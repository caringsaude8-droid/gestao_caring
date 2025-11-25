import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard que valida acesso por roles definidos em route.data.roles
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = (route.data?.['roles'] as string[] | undefined) || [];
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const user = auth.getCurrentUser();
  if (!token || !user || !user.nome) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  // Admin passa sempre
  if (auth.isAdmin()) return true;

  // Bloqueia acesso ao /home do sistema principal para usuários com roles exclusivas de TEA
  if (state.url === '/home') {
    // Se o usuário tem roles e TODAS são de TEA, bloqueia acesso ao home principal
    if (user.roles && user.roles.length > 0) {
      const allRolesAreTea = user.roles.every((r: string) => r.toUpperCase().includes('TEA'));
      if (allRolesAreTea) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
    }
    return true;
  }

  // 1. Se não tem roles, acesso total
  if (!user.roles || user.roles.length === 0) return true;

  // 2. Verificar permissões específicas para rotas do TEA
  if (state.url.startsWith('/tea')) {
    // TEA Home
    if (state.url === '/tea/home') {
      if (!auth.hasFeatureAccess('TEA_HOME')) {
        router.navigate(['/tea/selecao-clinica'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Seleção de Clínica (sempre permitido para quem tem acesso ao TEA)
    if (state.url === '/tea/selecao-clinica') return true;

    // Cadastro de Pacientes
    if (state.url.startsWith('/tea/pacientes')) {
      if (!auth.hasFeatureAccess('TEA_CADASTRO_PACIENTE')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Calendário
    if (state.url.startsWith('/tea/calendario')) {
      if (!auth.hasFeatureAccess('TEA_CALENDARIO')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Agendamento
    if (state.url.startsWith('/tea/agendamento')) {
      if (!auth.hasFeatureAccess('TEA_AGENDAMENTO')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Módulo Terapeuta
    if (state.url.startsWith('/tea/terapeuta')) {
      if (!auth.hasModuleAccess('TERAPEUTA_MODULO')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Convênios
    if (state.url.startsWith('/tea/convenios')) {
      if (!auth.hasFeatureAccess('TEA_CONVENIOS') && !auth.hasModuleAccess('TEA_MODULO')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Prontuário Eletrônico
    if (state.url.startsWith('/tea/prontuario-eletronico')) {
      if (!auth.hasFeatureAccess('TEA_PRONTUARIO_ELETRONICO') && !auth.hasModuleAccess('TEA_MODULO')) {
        router.navigate(['/tea/home'], { replaceUrl: true });
        return false;
      }
      return true;
    }

    // Outras rotas do TEA (usuarios, clinicas, etc) - permitir se tiver TEA_MODULO
    if (auth.hasModuleAccess('TEA_MODULO')) return true;
  }

  // 3. Se a rota exige roles específicas, só permite se tiver
  if (requiredRoles && requiredRoles.length > 0) {
    if (auth.hasAnyRole(requiredRoles)) return true;
    // Sem permissão: redireciona para uma rota segura
    router.navigate(['/tea/clinica']);
    return false;
  }

  // 4. Se não exige roles, mas usuário tem roles, restringe acesso a rotas não permitidas
  if (user.roles && user.roles.length > 0) {
    // Se a rota for do TEA, só permite se o usuário tiver alguma role de TEA
    if (state.url.startsWith('/tea')) {
      const urlParts = state.url.split('/').filter(Boolean);
      if (urlParts.length > 1) {
        const feature = urlParts[1].toUpperCase();
        const role = `TEA_${feature.replace('-', '_')}`;
        // Permite se for um dos módulos principais
        if (
          user.roles.includes(role) ||
          (role === 'TEA_TERAPEUTA' && user.roles.includes('TEA_TERAPEUTA')) ||
          (role === 'TEA_PACIENTES' && user.roles.includes('TEA_PACIENTES')) ||
          user.roles.includes('TEA_MODULO')
        ) return true;
        router.navigate(['/tea/clinica']);
        return false;
      }
    }
  }

  // Quando não há requisito, permite acesso
  return true;
};
