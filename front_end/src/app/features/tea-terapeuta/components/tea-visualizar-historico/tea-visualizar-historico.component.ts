import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeaAgendaService, SlotHorario } from '../../../TEA/services/tea-agenda.service';

@Component({
  selector: 'app-tea-terapeuta-visualizar-historico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-visualizar-historico.component.html',
  styleUrls: ['./tea-visualizar-historico.component.css']
})
export class TeaTerapeutaVisualizarHistoricoComponent implements OnInit {
  slot?: SlotHorario;
  profissionalSelecionado: string = '';
  dataSelecionada: string = new Date().toISOString().slice(0,10);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agendaService: TeaAgendaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const slots = this.agendaService.getSlotsSnapshot();
    this.slot = slots.find(s => s.id === id);
    if (this.slot) this.dataSelecionada = this.slot.data;
  }

  get pacienteNome(): string {
    return this.slot?.paciente || 'Paciente';
  }

  get profissionalNome(): string {
    return this.slot ? this.agendaService.getProfissionalNome(this.slot.profissionalId) : '';
  }

  get especialidadeNome(): string {
    return this.slot ? this.agendaService.getEspecialidadeNome(this.slot.especialidadeId) : '';
  }

  get horaIntervalo(): string {
    const h = this.slot?.hora || '11:10';
    // mock de duração 50min
    const [HH, MM] = h.split(':').map(Number);
    const end = new Date(0,0,0,HH,MM + 50);
    const endStr = `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
    return `${h} - ${endStr}`;
  }

  visualizarCadastro() { alert('Visualizar cadastro do paciente'); }
  anexos() { alert('Abrir anexos do paciente'); }
  imprimir() { window.print(); }
  remover() { alert('Remover evolução (exemplo)'); }
}