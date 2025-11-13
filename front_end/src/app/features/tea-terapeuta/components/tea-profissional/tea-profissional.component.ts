import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeaAgendaService, Profissional, SlotHorario } from '../../../TEA/services/tea-agenda.service';

@Component({
  selector: 'app-tea-profissional',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-profissional.component.html',
  styleUrls: ['./tea-profissional.component.css']
})
export class TeaProfissionalComponent implements OnInit {
  profissionais: Profissional[] = [];
  profissionalId: string = '';
  hojeISO: string = new Date().toISOString().slice(0,10);
  slotsDoProfissional: SlotHorario[] = [];

  constructor(
    private agendaService: TeaAgendaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profissionais = this.agendaService.profissionais;
    const qpId = this.route.snapshot.queryParamMap.get('profId');
    this.profissionalId = qpId || this.profissionais[0]?.id || '';
    this.buscar();
  }

  buscar(): void {
    const slots = this.agendaService.getSlotsSnapshot();
    this.slotsDoProfissional = slots
      .filter(s => s.data === this.hojeISO && s.profissionalId === this.profissionalId)
      .sort((a,b) => a.hora.localeCompare(b.hora));
  }

  get profissionalSelecionado(): Profissional | undefined {
    return this.profissionais.find(p => p.id === this.profissionalId);
  }

  get nomeEspecialidade(): string {
    const espId = this.profissionalSelecionado?.especialidadeId || '';
    return this.agendaService.getEspecialidadeNome(espId);
  }

  get pendentes(): SlotHorario[] {
    return this.slotsDoProfissional.filter(s => s.status === 'agendado');
  }

  get evoluidos(): SlotHorario[] {
    return this.slotsDoProfissional.filter(s => s.status === 'confirmado');
  }

  onProfChange(): void {
    this.buscar();
  }

  getProfNome(id: string): string {
    return this.agendaService.getProfissionalNome(id);
  }

  getEspNome(id: string): string {
    return this.agendaService.getEspecialidadeNome(id);
  }

  visualizarHistorico(slot: SlotHorario) {
    this.router.navigate(['/tea/visualizar-historico', slot.id]);
  }

  atender(slot: SlotHorario) {
    alert(`Atender ${slot.paciente || 'Paciente'} às ${slot.hora}`);
  }
}