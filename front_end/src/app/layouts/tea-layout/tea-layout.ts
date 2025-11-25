import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LogoService } from '../../shared/services/logo.service';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-tea-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tea-layout.html',
  styleUrls: ['./tea-layout.css']
})
export class TeaLayoutComponent implements OnInit, OnDestroy {
    toast: { title: string; message: string; type: 'error' | 'success' } | null = null;
  collapsed = false;
  profile: any = null;
  logoUrl: string | null = null;
  currentRoute: string = '';
  private logoSubscription?: Subscription;
  private routeSubscription?: Subscription;

  private allTeaMenuItems: MenuItem[] = [
      { title: "Home", url: "/home", icon: "home" },
      { title: "Seleção de Clínica", url: "/tea/selecao-clinica", icon: "clinic" },

      
      { title: "TEA Home", url: "/tea/home", icon: "brain" },


      { title: "Calendário", url: "/tea/calendario", icon: "calendar", submenu: [
        { title: "Calendário Mensal", url: "/tea/calendario", icon: "" },
        { title: "Por Paciente", url: "/tea/calendario-por-paciente", icon: "" },
        { title: "Por Profissionais", url: "/tea/calendario-por-terapeutas", icon: "" }
      ] },

      { title: "Agendamento", url: "/tea/agendamento", icon: "clock" },


      { title: "Cadastro", url: "/cadastro", icon: "folder", submenu: [
        { title: "Usuario TEA", url: "/tea/usuarios", icon: "" },
        { title: "Pacientes", url: "/tea/pacientes", icon: "" },
        { title: "Clínicas", url: "/tea/clinicas", icon: "" }

      ] },

      { title: "Convênios", url: "/tea/convenios", icon: "convenio" },
      { title: "Prontuário Eletrônico", url: "/tea/prontuario-eletronico", icon: "prontuario" },
      

      { title: "Relatórios", url: "/tea/relatorios", icon: "bar-chart", submenu: [
        { title: "Atendimentos", url: "/tea/relatorios/atendimentos", icon: "" },
        { title: "Aniversários", url: "/tea/relatorios/aniversarios", icon: "" }
      ] },

      
      


      { title: "Painel Atendimento", url: "/tea/painel-atendimento", icon: "monitor" },

      
  ];

  // Controla o submenu aberto
  openSubmenuIndex: number | null = null;

  ngOnDestroy() {
    if (this.logoSubscription) {
      this.logoSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  // Funções para controle do submenu similar ao sidebar
  toggleSubmenu(index: number) {
    this.openSubmenuIndex = this.openSubmenuIndex === index ? null : index;
  }

  // Abre/fecha pelo hover
  // Removido: comportamento por hover desativado para abrir somente com clique
  
  isSubmenuActive(item: MenuItem): boolean {
    if (!item.submenu) return false;
    return item.submenu.some(subItem => this.checkUrlActive(subItem.url));
  }
  
  checkUrlActive(url: string): boolean {
    // Para submenus do Cadastro, verificar se está em alguma das páginas de cadastro
    if (url === '/tea/usuarios' || url === '/tea/pacientes' || url === '/tea/clinicas' || url === '/tea/convenios') {
      return this.currentRoute === url;
    }
    
    // Para o menu Cadastro, verificar se está em alguma das páginas de cadastro
    if (url === '/tea/cadastro') {
      return this.currentRoute === '/tea/usuarios' || 
             this.currentRoute === '/tea/pacientes' || 
             this.currentRoute === '/tea/profissionais' || 
             this.currentRoute === '/tea/clinicas';
    }

    if (url === '/tea/convenios') {
      return this.currentRoute === url;
    }

    if (url === '/tea/prontuario-eletronico') {
      return this.currentRoute.startsWith(url);
    }

    // Para submenus do Check-in, verificar se está em alguma das páginas de check-in
    if (url === '/tea/checkin-por-senha' || url === '/tea/checkin-em-lote' || url === '/tea/gestao-checkin' || url === '/tea/fila-recepcao' || url === '/tea/painel-checkin') {
      return this.currentRoute === url;
    }

    // Para o menu Check-in, considerar ativo ao navegar por qualquer submenu de check-in
    if (url === '/tea/checkin') {
      return this.currentRoute === '/tea/checkin-por-senha' ||
             this.currentRoute === '/tea/checkin-em-lote' ||
             this.currentRoute === '/tea/gestao-checkin' ||
             this.currentRoute === '/tea/fila-recepcao' ||
             this.currentRoute === '/tea/painel-checkin';
    }

    // Para submenus do Calendário
    if (url === '/tea/calendario' || url === '/tea/calendario-por-paciente' || url === '/tea/calendario-por-profissionais') {
      return this.currentRoute === url;
    }

    // Para o menu Calendário considerar ativo ao navegar por qualquer submenu
    if (url === '/tea/calendario') {
      return this.currentRoute === '/tea/calendario' ||
             this.currentRoute === '/tea/calendario-por-paciente' ||
             this.currentRoute === '/tea/calendario-por-profissionais';
    }

    
    // Para submenus de Relatórios
    if (url === '/tea/relatorios/atendimentos' || url === '/tea/relatorios/aniversarios') {
      return this.currentRoute === url;
    }

    // Para o menu Relatórios considerar ativo ao navegar por qualquer submenu
    if (url === '/tea/relatorios') {
      return this.currentRoute === '/tea/relatorios/atendimentos' ||
             this.currentRoute === '/tea/relatorios/aniversarios';
    }

    return this.currentRoute.startsWith(url);
  }

  teaMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private logoService: LogoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtém usuário atual do AuthService
    this.profile = this.authService.getCurrentUser();

    // Filtrar itens do menu baseado no perfil
    this.filterMenuItems();
    // Abre automaticamente o submenu correspondente à rota atual
    this.updateOpenSubmenuBasedOnRoute();

    // Subscribe to logo changes
    this.logoSubscription = this.logoService.logoUrl$.subscribe(logoUrl => {
      this.logoUrl = logoUrl;
    });

    // Subscribe to route changes
    this.currentRoute = this.router.url;
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateOpenSubmenuBasedOnRoute();
      });
  }

  // Oculta o menu TEA quando estiver no módulo TEA Terapeuta
  isTerapeutaModuleActive(): boolean {
    // Considera ativo apenas quando a rota é exatamente '/tea/terapeuta'
    // ou quando está dentro do módulo lazy carregado '/tea/terapeuta/...'
    return this.currentRoute === '/tea/terapeuta' || this.currentRoute.startsWith('/tea/terapeuta/');
  }


  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.updateMainContentMargin();
  }

  private updateMainContentMargin() {
    // Atualiza a classe CSS do elemento main para ajustar a margem
    const mainElement = document.querySelector('.tea-main-content');
    if (mainElement) {
      if (this.collapsed) {
        mainElement.classList.add('sidebar-collapsed');
      } else {
        mainElement.classList.remove('sidebar-collapsed');
      }
    }
  }

  isRouteActive(path: string): boolean {
    // Para itens de menu principal
    if (path === "/tea/clinica") return this.router.url === "/tea/clinica";
    if (path === "/home") return this.router.url === "/home";
    
    // Para submenus, verificar exatamente a rota atual
    if (path === "/tea/usuarios") return this.router.url === "/tea/usuarios";
    if (path === "/tea/pacientes") return this.router.url === "/tea/pacientes";
    if (path === "/tea/profissionais") return this.router.url === "/tea/profissionais";
    if (path === "/tea/clinicas") return this.router.url === "/tea/clinicas";
    if (path === "/tea/calendario") return this.router.url === "/tea/calendario";
    
    // Caso padrão - verificar se a URL começa com o caminho (para compatibilidade)
    return this.router.url === path;
  }

  signOut() {
    this.authService.logout();
  }

  navigateTo(url: string) {
    // Verificar permissões antes de navegar
    if (!this.hasPermissionForRoute(url)) {
      // Não faz nada se não tiver permissão
      return;
    }

    const clinicaSelecionada = localStorage.getItem('selectedClinica');
    let isClinicaValida = false;
    if (clinicaSelecionada && clinicaSelecionada !== 'null' && clinicaSelecionada !== '') {
      // Se for um número, considera válido
      isClinicaValida = !isNaN(Number(clinicaSelecionada));
    }
    const isHomeOrClinicas = url === '/home' || url === '/tea/selecao-clinica';
    if (isHomeOrClinicas) {
      this.router.navigate([url]);
      return;
    }
    if (!isClinicaValida) {
      this.showToast('Atenção', 'Selecione uma clínica para acessar este menu.', 'error');
      return;
    }
    this.router.navigate([url]);
  }

  /**
   * Verifica se o usuário tem permissão para acessar uma rota específica
   */
  private hasPermissionForRoute(url: string): boolean {
    // Admin tem acesso a tudo
    if (this.isAdmin()) return true;

    // Rotas sempre permitidas
    if (url === '/home' || url === '/tea/home' || url === '/tea/selecao-clinica') return true;

    // Verificar permissões específicas
    if (url === '/tea/pacientes') return this.authService.hasFeatureAccess('TEA_CADASTRO_PACIENTE');
    if (url === '/tea/usuarios') return this.authService.hasFeatureAccess('TEA_CADASTRO_USUARIO') || this.authService.hasModuleAccess('TEA_MODULO');
    if (url === '/tea/clinicas') return this.authService.hasFeatureAccess('TEA_CADASTRO_CLINICA') || this.authService.hasModuleAccess('TEA_MODULO');
    if (url.startsWith('/tea/calendario')) return this.authService.hasFeatureAccess('TEA_CALENDARIO');
    if (url === '/tea/agendamento') return this.authService.hasFeatureAccess('TEA_AGENDAMENTO');
    if (url === '/tea/convenios') return this.authService.hasFeatureAccess('TEA_CONVENIOS') || this.authService.hasModuleAccess('TEA_MODULO');
    if (url === '/tea/prontuario-eletronico') return this.authService.hasFeatureAccess('TEA_PRONTUARIO_ELETRONICO') || this.authService.hasModuleAccess('TEA_MODULO');
    if (url.startsWith('/tea/relatorios')) return this.authService.hasModuleAccess('TEA_MODULO');
    if (url === '/tea/painel-atendimento') return this.authService.hasModuleAccess('TEA_MODULO');

    // Por padrão, permite (para rotas não mapeadas)
    return true;
  }

  showToast(title: string, message: string, type: 'error' | 'success') {
    this.toast = { title, message, type };
    setTimeout(() => this.closeToast(), 3500);
  }

  closeToast() {
    this.toast = null;
  }

  // Verifica se o usuário atual é admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Filtra os itens do menu baseado no perfil do usuário
   */
  private filterMenuItems(): void {
    const roles = Array.isArray(this.profile?.roles) ? this.profile.roles : [];

    // Se for admin OU não tiver nenhuma role, mostra todos os itens
    if (this.isAdmin() || roles.length === 0) {
      this.teaMenuItems = [...this.allTeaMenuItems];
      return;
    }

    // Função auxiliar para decidir se pode ver um item
    const podeVerItem = (item: MenuItem): boolean => {
      // Home geral só aparece para quem não tem nenhuma role
      if (item.url === '/home') return roles.length === 0;
      // TEA Home
      if (item.url === '/tea/home') return this.authService.hasFeatureAccess('TEA_HOME');
      // Seleção de Clínica: só mostra se tiver TEA_MODULO e NÃO tiver idClinica vinculado
      if (item.url === '/tea/selecao-clinica') {
        const temTeaModulo = this.authService.hasModuleAccess('TEA_MODULO');
        const temIdClinica = !!this.profile?.idClinica;
        return temTeaModulo && !temIdClinica;
      }
      // Calendário
      if (item.url === '/tea/calendario') return this.authService.hasFeatureAccess('TEA_CALENDARIO');
      // Agendamento
      if (item.url === '/tea/agendamento') return this.authService.hasFeatureAccess('TEA_AGENDAMENTO');
      // Cadastro (qualquer subitem)
      if (item.url === '/cadastro') {
        if (!item.submenu) return false;
        return item.submenu.some(podeVerItem);
      }
      // Submenus do Cadastro
      if (item.url === '/tea/pacientes') return this.authService.hasFeatureAccess('TEA_CADASTRO_PACIENTE');
      // Convênios
      if (item.url === '/tea/convenios') return this.authService.hasFeatureAccess('TEA_CONVENIOS') || this.authService.hasModuleAccess('TEA_MODULO');
      // Prontuário Eletrônico
      if (item.url === '/tea/prontuario-eletronico') return this.authService.hasFeatureAccess('TEA_PRONTUARIO_ELETRONICO') || this.authService.hasModuleAccess('TEA_MODULO');
      // Relatórios
      if (item.url === '/tea/relatorios') {
        if (!item.submenu) return false;
        return item.submenu.some(podeVerItem);
      }
      // Painel Atendimento
      if (item.url === '/tea/painel-atendimento') return true;
      // Módulo Terapeuta
      if (item.url && item.url.startsWith('/terapeuta')) return this.authService.hasModuleAccess('TERAPEUTA_MODULO');
      // Submenus genéricos (caso algum item não mapeado)
      return true;
    };

    // Função para filtrar submenus
    const filtrarSubmenu = (submenu: MenuItem[]): MenuItem[] => {
      return submenu.filter(podeVerItem);
    };

    this.teaMenuItems = this.allTeaMenuItems
      .map(item => {
        if (item.submenu) {
          const novoSubmenu = filtrarSubmenu(item.submenu);
          return { ...item, submenu: novoSubmenu };
        }
        return item;
      })
      .filter(item => {
        if (item.submenu) {
          return item.submenu && item.submenu.length > 0 && podeVerItem(item);
        }
        return podeVerItem(item);
      });
  }

  // Abre o submenu que contém a rota atual
  private updateOpenSubmenuBasedOnRoute(): void {
    const index = this.teaMenuItems.findIndex(item => {
      if (!item.submenu) return false;
      return item.submenu.some(sub => this.checkUrlActive(sub.url));
    });
    this.openSubmenuIndex = index >= 0 ? index : null;
  }
}
