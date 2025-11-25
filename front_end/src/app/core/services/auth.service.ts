import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthUser {
  id?: string;
  nome?: string;
  perfil?: string; // e.g., 'admin', 'terapeuta', 'supervisor', 'recepcao'
  roles: string[]; // permission identifiers
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/v1/usuarios';

  constructor(private http: HttpClient) {}
    /**
     * Realiza login via API e armazena o token JWT e refresh_token no localStorage
     */
    login(email: string, senha: string): Observable<any> {
      return new Observable(observer => {
        this.http.post<any>('http://localhost:8081/api/v1/usuarios/login', { email, senha }).subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('auth_token', response.token);
            }
            if (response.refreshToken) {
              localStorage.setItem('refresh_token', response.refreshToken);
            }
            if (response.user) {
              localStorage.setItem('auth', JSON.stringify(response.user));
            }
            observer.next(response);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
          }
        });
      });
    }
  // Lê roles da query string para facilitar testes: ?role=admin ou ?roles=a,b
  private getQueryRoles(): { perfil?: string; roles: string[] } {
    try {
      if (typeof window === 'undefined') return { roles: [] };
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role');
      const rolesParam = params.get('roles');
      const roles: string[] = [];
      let perfil: string | undefined = undefined;

      if (role) {
        if (role === 'admin') {
          perfil = 'admin';
          roles.push('admin');
        } else {
          perfil = role;
        }
      }

      if (rolesParam) {
        rolesParam.split(',').map(r => r.trim()).forEach(r => r && roles.push(r));
      }

      return { perfil, roles };
    } catch (_) {
      return { roles: [] };
    }
  }
  // Obtém o usuário atual do localStorage. Se vazio, aplica um mock seguro.
  getCurrentUser(): AuthUser {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('auth') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // Garante estrutura mínima
        return {
          id: parsed.id,
          nome: parsed.nome || 'Usuário',
          perfil: parsed.perfil || 'usuario',
          roles: Array.isArray(parsed.roles) ? parsed.roles : []
        };
      }
    } catch (_) {
      // Ignora erros de parse e retorna null
    }

    // Sem usuário autenticado
    return null as any;
  }

  // Define o usuário atual em localStorage (útil para testes via UI)
  setCurrentUser(user: Partial<AuthUser>) {
    try {
      const current = this.getCurrentUser();
      const updated: AuthUser = {
        id: user.id ?? current.id,
        nome: user.nome ?? current.nome,
        perfil: user.perfil ?? current.perfil,
        roles: user.roles ?? current.roles ?? []
      };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify(updated));
      }
    } catch (_) {
      // ignore
    }
  }

  // Retorna os roles atuais
  getRoles(): string[] {
    const user = this.getCurrentUser();
    return user.roles || [];
  }

  // Verifica se possui pelo menos um dos roles requeridos
  hasAnyRole(required: string[] | undefined | null): boolean {
    if (!required || required.length === 0) return true;
    const roles = this.getRoles();
    return required.some(r => roles.includes(r));
  }

  // Verifica se usuário é admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return (user.perfil === 'admin') || (user.roles || []).includes('admin');
  }

  // Verifica se possui acesso ao módulo (ex: TEA_MODULO)
  hasModuleAccess(module: string): boolean {
    const user = this.getCurrentUser();
    // Admin sem roles: acesso total ao sistema
    if (user?.perfil === 'admin' && (!user.roles || user.roles.length === 0)) return true;
    // Admin com apenas roles de módulo: acesso total ao módulo
    if (user?.perfil === 'admin' && user.roles?.includes(`${module}_MODULO`)) return true;
    return this.getRoles().includes(`${module}_MODULO`);
  }

  // Verifica se possui acesso à funcionalidade específica ou ao módulo inteiro
  hasFeatureAccess(feature: string): boolean {
    const user = this.getCurrentUser();
    // Admin sem roles: acesso total ao sistema
    if (user?.perfil === 'admin' && (!user.roles || user.roles.length === 0)) return true;
    // Admin com apenas roles de módulo: acesso total ao módulo
    const module = feature.split('_')[0];
    if (user?.perfil === 'admin' && user.roles?.includes(`${module}_MODULO`)) return true;
    return this.getRoles().includes(feature) || this.hasModuleAccess(module);
  }

  /**
   * Solicita novo access token usando o refresh token
   */
  refreshToken(refreshToken: string): Observable<string> {
    return new Observable(observer => {
      this.http.post<any>('http://localhost:8081/api/v1/auth/refresh', { refreshToken }).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          if (response.refreshToken) {
            localStorage.setItem('refresh_token', response.refreshToken);
          }
          observer.next(response.token);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Realiza logout removendo tokens do localStorage
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth');
    window.location.href = '/login';
  }

  signOut() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth');
        localStorage.removeItem('auth_token');
      }
    } catch (_) {
      // ignore
    }
    console.log('User signed out');
  }
}