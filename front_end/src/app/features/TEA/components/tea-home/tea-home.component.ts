
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeaAgendaService, SlotStatus } from '../../services/tea-agenda.service';
import { Router } from '@angular/router';

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

interface TeaSession {
  id: string;
  patientName: string;
  therapist: string;
  type: string;
  time: string;
  status: SlotStatus;
}

@Component({
  selector: 'app-tea-home',
  standalone: true,
  imports: [
    CommonModule,
    
  ],
  templateUrl: './tea-home.component.html',
  styleUrls: ['./tea-home.component.css']
})
export class TeaHomeComponent implements OnInit {
  userProfile: UserProfile | null = null;

  recentSessions: TeaSession[] = [];

  constructor(
    private teaAgendaService: TeaAgendaService,
    private router: Router,
    @Inject(AuthService) private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.refreshData();
  }

  loadUserProfile(): void {
    const user = this.authService.getCurrentUser();
    this.userProfile = user ? {
      name: user.nome || 'Usuário',
      role: user.perfil || '',
      avatar: 'assets/avatar.png'
    } : null;
  }

  refreshData(): void {
    this.teaAgendaService.getTodaySessionsForClinica().subscribe((sessions: TeaSession[]) => {
      this.recentSessions = sessions.map((session: TeaSession) => ({
        id: session.id,
        patientName: session.patientName,
        therapist: session.therapist,
        type: session.type,
        time: session.time,
        status: session.status
      }));
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getStatusLabel(status: SlotStatus): string {
    switch (status) {
      case 'agendado':
        return 'Agendado';
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      case 'faltou':
        return 'Faltou';
      default:
        return 'Desconhecido';
    }
  }

  onStatusChange(session: TeaSession, newStatus: SlotStatus): void {
    this.teaAgendaService.updateSlotStatus(session.id, newStatus).subscribe(() => {
      this.refreshData();
    });
  }
}
