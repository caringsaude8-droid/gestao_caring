import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeaAgendaService, SlotHorario, Especialidade } from '../../TEA/services/tea-agenda.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-terapeuta-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terapeuta-agenda.html',
  styleUrls: ['./terapeuta-agenda.css']
})
export class TerapeutaAgendaComponent implements OnInit {
  // Tabs superiores: Evoluções | Devolutivas
  topTab: 'evolucoes' | 'devolutivas' = 'evolucoes';

  // Tabs internas: Pendentes | Evoluídos | Ambos
  statusTab: 'pendentes' | 'evoluidos' | 'ambos' = 'pendentes';

  // Filtros
  filtroEspecialidade: string = '';
  especialidades: Especialidade[] = [];

  // Lista exibida
  exibicaoSlots: SlotHorario[] = [];
  terapeutaId: string | null = null;

  constructor(private agendaService: TeaAgendaService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.especialidades = this.agendaService.especialidades;
    const user = this.authService.getCurrentUser();
    this.terapeutaId = user?.id ?? null;
    this.buscar();
  }

  setTopTab(tab: 'evolucoes' | 'devolutivas') {
    this.topTab = tab;
  }

  setStatusTab(tab: 'pendentes' | 'evoluidos' | 'ambos') {
    this.statusTab = tab;
    this.buscar();
  }

  buscar() {
    const slots = this.agendaService.getSlotsSnapshot();
    // Por ora, usamos o dia atual como recorte simples
    const hojeISO = new Date().toISOString().slice(0, 10);
    let filtrados = slots.filter(s => s.data === hojeISO);

    // Filtrar apenas slots do terapeuta logado (quando disponível)
    if (this.terapeutaId) {
      filtrados = filtrados.filter(s => s.terapeutaId === this.terapeutaId);
    }

    if (this.filtroEspecialidade) {
      filtrados = filtrados.filter(s => s.especialidadeId === this.filtroEspecialidade);
    }

    if (this.statusTab === 'pendentes') {
      filtrados = filtrados.filter(s => s.status === 'agendado');
    } else if (this.statusTab === 'evoluidos') {
      filtrados = filtrados.filter(s => s.status === 'confirmado');
    } else if (this.statusTab === 'ambos') {
      // Mostrar apenas pendentes e evoluídos (exclui cancelados/faltou)
      filtrados = filtrados.filter(s => s.status === 'agendado' || s.status === 'confirmado');
    }

    // Ordena por hora
    this.exibicaoSlots = filtrados.sort((a, b) => a.hora.localeCompare(b.hora));
  }

  getTerapeutaNome(id: string): string {
    return this.agendaService.getTerapeutaNome(id);
  }

  getEspecialidadeNome(id: string): string {
    return this.agendaService.getEspecialidadeNome(id);
  }

  atender(slot: SlotHorario) {
    // Placeholder para fluxo de atendimento
    alert(`Atender: ${slot.paciente || 'Paciente'} às ${slot.hora} com ${this.getTerapeutaNome(slot.terapeutaId)}`);
  }

  marcarEvoluido(slot: SlotHorario) {
    this.agendaService.setStatus(slot.id, 'confirmado').subscribe(() => {
      this.buscar();
    });
  }

  mostrar(slot: SlotHorario) {
    // Placeholder para mostrar detalhes
    alert(`Detalhes\nPaciente: ${slot.paciente || '—'}\nTerapeuta: ${this.getTerapeutaNome(slot.terapeutaId)}\nEspecialidade: ${this.getEspecialidadeNome(slot.especialidadeId)}\nHora: ${slot.hora}`);
  }

  visualizarHistorico(slot: SlotHorario) {
    this.router.navigate(['/tea/terapeuta/visualizar-historico', slot.id]);
  }

  retomarAtendimento(slot: SlotHorario) {
    alert(`Retomar atendimento de ${slot.paciente || 'Paciente'} às ${slot.hora}`);
  }
}