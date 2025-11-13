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
  selector: 'app-tea-terapeuta-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tea-terapeuta-layout.html',
  styleUrl: './tea-terapeuta-layout.css'
})
export class TeaTerapeutaLayoutComponent implements OnInit, OnDestroy {
  collapsed = false;
  profile: any = null;
  logoUrl: string | null = null;
  currentRoute: string = '';
  private logoSubscription?: Subscription;
  private routeSubscription?: Subscription;

  // Menu do módulo tea-terapeuta: somente rotas existentes neste módulo
  private allTeaMenuItems: MenuItem[] = [
    { title: "Home", url: "/tea/terapeuta/home", icon: "home" },
    { title: "Agenda", url: "/tea/terapeuta/agenda", icon: "calendar" },
    { title: "Calendário", url: "/tea/terapeuta/calendario-por-profissionais", icon: "calendar" },
    { title: "Pacientes", url: "/tea/terapeuta/pacientes", icon: "users" },
    { title: "Prontuário", url: "/tea/terapeuta/pacientes", icon: "folder" },
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
    this.filterMenuItems();
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
    this.updateMainContentMargin();
  }

  private updateMainContentMargin() {
    const mainElement = document.querySelector('.tea-terapeuta-main-content');
    if (mainElement) {
      if (this.collapsed) {
        mainElement.classList.add('sidebar-collapsed');
      } else {
        mainElement.classList.remove('sidebar-collapsed');
      }
    }
  }

  isRouteActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path);
  }

  signOut() {
    console.log('Sign out from TEA Terapeuta');
    this.router.navigate(['/login']);
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
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