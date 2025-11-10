import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeaAgendaService } from '../../services/tea-agenda.service';

interface TeaAction {
  title: string;
  description: string;
  route: string;
  icon: string;
  color: string;
  clickable: boolean;
}

interface TeaResource {
  title: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

interface UserProfile {
  nome: string;
  perfil: string;
}

interface TeaSession {
  id: string;
  patient: string;
  therapist: string;
  type: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-tea-clinica',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tea-clinica.component.html',
  styleUrls: ['./tea-clinica.component.css']
})
export class TeaClinicaComponent implements OnInit {
  userProfile: UserProfile | null = null;

  teaActions: TeaAction[] = [
    {
      title: 'Avaliação Inicial',
      description: 'Instrumentos de avaliação e diagnóstico',
      route: '/tea/avaliacao',
      icon: 'clipboard-check',
      color: 'blue',
      clickable: true
    },
    {
      title: 'Planos Terapêuticos',
      description: 'Criar e gerenciar planos de terapia',
      route: '/tea/planos',
      icon: 'file-text',
      color: 'green',
      clickable: true
    },
    {
      title: 'Atividades Sensoriais',
      description: 'Biblioteca de atividades sensoriais',
      route: '/tea/atividades-sensoriais',
      icon: 'activity',
      color: 'purple',
      clickable: true
    },
    {
      title: 'Comunicação Alternativa',
      description: 'Ferramentas de comunicação PECS/CAA',
      route: '/tea/comunicacao',
      icon: 'message-circle',
      color: 'orange',
      clickable: true
    },
    {
      title: 'Relatórios de Progresso',
      description: 'Acompanhamento e evolução',
      route: '/tea/relatorios',
      icon: 'trending-up',
      color: 'teal',
      clickable: true
    },
    {
      title: 'Recursos Familiares',
      description: 'Orientações para famílias',
      route: '/tea/recursos-familiares',
      icon: 'heart',
      color: 'pink',
      clickable: true
    }
  ];

  teaResources: TeaResource[] = [
    {
      title: 'Escalas de Avaliação',
      description: 'M-CHAT, CARS, ADOS-2 e outras ferramentas validadas',
      icon: 'check-square',
      color: '#3b82f6',
      count: 12
    },
    {
      title: 'Protocolos ABA',
      description: 'Programas de intervenção comportamental aplicada',
      icon: 'layers',
      color: '#10b981',
      count: 8
    },
    {
      title: 'Materiais TEACCH',
      description: 'Estruturação ambiental e rotinas visuais',
      icon: 'grid',
      color: '#8b5cf6',
      count: 15
    },
    {
      title: 'Jogos Terapêuticos',
      description: 'Atividades lúdicas para desenvolvimento',
      icon: 'gamepad-2',
      color: '#f59e0b',
      count: 25
    }
  ];

  recentSessions: TeaSession[] = [];

  constructor(private router: Router, private agendaService: TeaAgendaService) {}

  ngOnInit() {
    this.loadUserProfile();
    // Atualiza a lista de sessões de hoje sempre que os slots forem alterados
    this.agendaService.slots$.subscribe(() => {
      const todaySessions = this.agendaService.getTodaySessionsForClinica();
      // Converter para TeaSession tipado local
      this.recentSessions = todaySessions.map(s => ({
        id: s.id,
        patient: s.patient,
        therapist: s.therapist,
        type: s.type,
        time: s.time,
        status: s.status
      }));
    });
  }

  private loadUserProfile() {
    // Mock data - substituir por serviço real de autenticação
    this.userProfile = {
      nome: 'Dra. Ana Terapia',
      perfil: 'Terapeuta Comportamental'
    };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  refreshData() {
    // Recarregar dados conforme necessário
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'Agendada',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }
}