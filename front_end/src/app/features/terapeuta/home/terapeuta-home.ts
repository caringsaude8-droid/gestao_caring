  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TeaAgendaService, Terapeuta, SlotHorario } from '../../TEA/services/tea-agenda.service';
  import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-terapeuta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terapeuta-home.html',
  styleUrls: ['./terapeuta-home.css']
})
export class TerapeutaComponent implements OnInit {
  especialidadeSelecionada: string = '';
  especialidades: { id: string; nome: string }[] = [];
  terapeutaId: string = '';
  slotsDoTerapeuta: SlotHorario[] = [];

  constructor(
    private agendaService: TeaAgendaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pega terapeuta logado
    const terapeuta = this.authService.getCurrentUser();
    this.terapeutaId = terapeuta?.id || '';
    this.especialidades = this.agendaService.especialidades || [];
    this.buscar();
  }

  buscar(): void {
    const slots = this.agendaService.getSlotsSnapshot();
    this.slotsDoTerapeuta = slots
      .filter(s => s.terapeutaId === this.terapeutaId &&
        (this.especialidadeSelecionada === '' || s.especialidadeId === this.especialidadeSelecionada))
      .sort((a,b) => {
        // Ordena por data e hora
        if (a.data === b.data) {
          return a.hora.localeCompare(b.hora);
        }
        return a.data.localeCompare(b.data);
      });
  }

  get nomeEspecialidade(): string {
    // Busca especialidade do terapeuta logado
    const terapeuta = this.agendaService.terapeutas.find(p => p.id === this.terapeutaId);
    const espId = terapeuta?.especialidadeId || '';
    return this.agendaService.getEspecialidadeNome(espId);
  }

  get pendentes(): SlotHorario[] {
    return this.slotsDoTerapeuta.filter(s => s.status === 'agendado');
  }

  get evoluidos(): SlotHorario[] {
    return this.slotsDoTerapeuta.filter(s => s.status === 'confirmado');
  }

  getEspNome(id: string): string {
    return this.agendaService.getEspecialidadeNome(id);
  }

  visualizarHistorico(slot: SlotHorario) {
    this.router.navigate(['/tea/terapeuta/visualizar-historico', slot.id]);
  }

  atender(slot: SlotHorario) {
    alert(`Atender ${slot.paciente || 'Paciente'} às ${slot.hora}`);
  }
}