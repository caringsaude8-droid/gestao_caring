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
  styleUrl: './tea-layout.css'
})
export class TeaLayoutComponent implements OnInit, OnDestroy {
  collapsed = false;
  profile: any = null;
  logoUrl: string | null = null;
  currentRoute: string = '';
  private logoSubscription?: Subscription;
  private routeSubscription?: Subscription;

  private allTeaMenuItems: MenuItem[] = [
      { title: "Home", url: "/home", icon: "home" },
      { title: "Clínicas", url: "/tea/selecao-clinica", icon: "clinic" },
      { title: "TEA Clínica", url: "/tea/clinica", icon: "brain" },
      { title: "Cadastro", url: "/cadastro", icon: "folder", submenu: [
        { title: "Usuários", url: "/tea/usuarios", icon: "users" },
        { title: "Pacientes", url: "/tea/pacientes", icon: "users" },
        { title: "Pesquisar Pacientes", url: "/tea/pesquisar-pacientes", icon: "search" },
        { title: "Profissionais", url: "/tea/profissionais", icon: "users" },
        { title: "Clínicas", url: "/tea/clinicas", icon: "clinic" },
        { title: "Convênios", url: "/tea/convenios", icon: "folder" }
      ] },
      { title: "Check-in", url: "/tea/checkin", icon: "check-square", submenu: [
        { title: "Check-in por Senha", url: "/tea/checkin-por-senha", icon: "lock" },
        { title: "Check-in em Lote", url: "/tea/checkin-em-lote", icon: "layers" },
        { title: "Gestão de Checkin", url: "/tea/gestao-checkin", icon: "settings" },
        { title: "Fila Recepção", url: "/tea/fila-recepcao", icon: "list" },
        { title: "Painel de Checkin", url: "/tea/painel-checkin", icon: "monitor" }
      ] },
      { title: "Calendário", url: "/tea/calendario", icon: "calendar", submenu: [
        { title: "Calendário Mensal", url: "/tea/calendario", icon: "calendar" },
        { title: "Por Paciente", url: "/tea/calendario-por-paciente", icon: "users" },
        { title: "Por Profissionais", url: "/tea/calendario-por-profissionais", icon: "users" }
      ] },
      { title: "Agendamento", url: "/tea/agendamento", icon: "clock" },
      { title: "Relatórios", url: "/tea/relatorios", icon: "bar-chart", submenu: [
        { title: "Atendimentos", url: "/tea/relatorios/atendimentos", icon: "bar-chart" },
        { title: "Aniversários", url: "/tea/relatorios/aniversarios", icon: "calendar" }
      ] },
      { title: "Painel Atendimento", url: "/tea/painel-atendimento", icon: "monitor" },
      { title: "Prontuário Eletrônico", url: "/tea/prontuario-eletronico", icon: "folder" },
      { title: "Dashboard", url: "/tea/dashboard", icon: "dashboard" },
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
    if (url === '/tea/usuarios' || url === '/tea/pacientes' || url === '/tea/profissionais' || url === '/tea/clinicas' || url === '/tea/convenios') {
      return this.currentRoute === url;
    }
    
    // Para o menu Cadastro, verificar se está em alguma das páginas de cadastro
    if (url === '/tea/cadastro') {
      return this.currentRoute === '/tea/usuarios' || 
             this.currentRoute === '/tea/pacientes' || 
             this.currentRoute === '/tea/profissionais' || 
             this.currentRoute === '/tea/clinicas' ||
             this.currentRoute === '/tea/convenios';
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
    if (path === "/tea/dashboard") return this.router.url === "/tea/dashboard";
    
    // Caso padrão - verificar se a URL começa com o caminho (para compatibilidade)
    return this.router.url === path;
  }

  signOut() {
    console.log('Sign out from TEA');
    this.router.navigate(['/login']);
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  // Verifica se o usuário atual é admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /**
   * Filtra os itens do menu baseado no perfil do usuário
   */
  private filterMenuItems(): void {
    if (this.isAdmin()) {
      // Admin mantém visual original com todos os itens
      this.teaMenuItems = [...this.allTeaMenuItems];
      return;
    }

    // Exibir todos os itens (incluindo Home) para não-admin
    this.teaMenuItems = [...this.allTeaMenuItems];
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