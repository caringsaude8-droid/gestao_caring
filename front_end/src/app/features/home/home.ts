import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface QuickAction {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  clickable: boolean;
}





interface UserProfile {
  nome: string;
  perfil: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  userProfile: UserProfile | null = null;
  constructor(private router: Router, private authService: AuthService) {}

  quickActions: QuickAction[] = [
    {
      title: 'Gestão',
      description: 'Visão geral do sistema',
      route: '/dashboard',
      icon: 'dashboard',
      color: 'blue',
      clickable: true
    },
    {
      title: 'TEA',
      description: 'Terapia e Acompanhamento Autista',
      route: '/tea',
      icon: 'brain',
      color: 'green',
      clickable: true
    },
    {
      title: 'TEA Terapeuta',
      description: 'Módulo do terapeuta (agenda, pacientes, prontuário)',
      route: '/tea/terapeuta',
      icon: 'users',
      color: 'purple',
      clickable: true
    },
    {
      title: 'Usuários',
      description: 'Gestão de usuários do sistema',
      route: '/usuarios',
      icon: 'users',
      color: 'teal',
      clickable: true
    }
  ];

  ngOnInit() {
    this.loadUserProfile();
  }

  private loadUserProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userProfile = {
        nome: user.nome || 'Usuário',
        perfil: user.perfil || 'Usuário'
      };
    } else {
      this.userProfile = null;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  refreshData() {
    // Recarregar dados conforme necessário
  }
}