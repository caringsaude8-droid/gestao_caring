import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  selector: 'app-tea-terapeuta-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terapeuta-layout.html',
  styleUrls: ['./terapeuta-layout.css']
})
export class TeaTerapeutaLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  collapsed = false;
  mobileMenuOpen = false;
  canScrollLeft = false;
  canScrollRight = false;
  profile: any = null;
  logoUrl: string | null = null;
  currentRoute: string = '';
  private logoSubscription?: Subscription;
  private routeSubscription?: Subscription;
  @ViewChild('navContainer') navContainer!: ElementRef;

  // Menu do módulo tea-terapeuta: somente rotas existentes neste módulo
  private allTeaMenuItems: MenuItem[] = [
    { title: "Home", url: "/tea/terapeuta/home", icon: "home" },
    { title: "Agenda", url: "/tea/terapeuta/agenda", icon: "calendar" },
    { title: "Calendário", url: "/tea/terapeuta/calendario-por-terapeutas", icon: "calendar" },
    { title: "Pacientes", url: "/tea/terapeuta/pacientes", icon: "users" },
    // Prontuário pode ser ajustado para outra rota se necessário
    { title: "Profissional", url: "/tea/terapeuta/profissional", icon: "users" },
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

  isSubmenuActive(item: MenuItem): boolean {
    if (!item.submenu) return false;
    return item.submenu.some(subItem => this.checkUrlActive(subItem.url));
  }
  
  checkUrlActive(url: string): boolean {
    return this.currentRoute === url || this.currentRoute.startsWith(url);
  }

  teaMenuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private logoService: LogoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.profile = this.authService.getCurrentUser();
    // Só exibe Home se o usuário tiver permissão global ou específica
    this.teaMenuItems = this.allTeaMenuItems.filter(item => {
      if (item.title === 'Home') {
        // Só mostra Home se tiver role HOME, ADMIN ou TERAPEUTA_MODULO
        return Array.isArray(this.profile?.roles) && (this.profile.roles.includes('HOME') || this.profile.roles.includes('ADMIN') || this.profile.roles.includes('TERAPEUTA_MODULO'));
      }
      return true;
    });
    this.filterMenuItems?.();
    this.updateOpenSubmenuBasedOnRoute();

    this.logoSubscription = this.logoService.logoUrl$.subscribe(logoUrl => {
      this.logoUrl = logoUrl;
    });

    this.currentRoute = this.router.url;
    this.routeSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateOpenSubmenuBasedOnRoute();
      });
  }

  private updateOpenSubmenuBasedOnRoute(): void {
    this.openSubmenuIndex = null;
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkScrollButtons();
      this.setupScrollListener();
    }, 100);
  }

  private setupScrollListener() {
    if (this.navContainer?.nativeElement) {
      this.navContainer.nativeElement.addEventListener('scroll', () => {
        this.checkScrollButtons();
      });
    }
  }

  private checkScrollButtons() {
    if (this.navContainer?.nativeElement) {
      const element = this.navContainer.nativeElement;
      this.canScrollLeft = element.scrollLeft > 0;
      this.canScrollRight = element.scrollLeft < (element.scrollWidth - element.clientWidth);
    }
  }

  scrollNavLeft() {
    if (this.navContainer?.nativeElement) {
      this.navContainer.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollNavRight() {
    if (this.navContainer?.nativeElement) {
      this.navContainer.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }

  isRouteActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path);
  }

  signOut() {
    this.authService.logout();
  }

  navigateTo(url: string) {
    if (url === '/tea/terapeuta/home' || url === '/home') {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate([url]);
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  private filterMenuItems(): void {
    if (this.isAdmin()) {
      this.teaMenuItems = [...this.allTeaMenuItems];
      return;
    }
    this.teaMenuItems = [...this.allTeaMenuItems];
  }
}