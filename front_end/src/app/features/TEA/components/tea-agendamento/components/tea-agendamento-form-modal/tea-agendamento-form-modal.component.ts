import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AgendamentoFormData {
  paciente: string;
  profissionalId: string;
  especialidadeId: string;
  data: string; // yyyy-mm-dd
  hora: string; // HH:MM
  procedimento?: string;
  local?: string;
  sala?: string;
}

export interface ProfissionalOption {
  id: string;
  nome: string;
  especialidadeId: string;
}

@Component({
  selector: 'app-tea-agendamento-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-agendamento-form-modal.component.html',
  styleUrls: ['./tea-agendamento-form-modal.component.css']
})
export class TeaAgendamentoFormModalComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() dia: string = '';
  @Input() horas: string[] = [];
  @Input() profissionais: ProfissionalOption[] = [];
  @Input() especialidadeId: string = '';
  @Input() slot: { hora: string; profissionalId: string; especialidadeId: string } | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AgendamentoFormData>();

  form: AgendamentoFormData = {
    paciente: '',
    profissionalId: '',
    especialidadeId: '',
    data: '',
    hora: ''
  };

  ngOnInit(): void {
    this.hydrateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] || changes['slot'] || changes['dia'] || changes['especialidadeId']) {
      this.hydrateForm();
    }
  }

  hydrateForm() {
    this.form.data = this.dia || this.form.data;
    this.form.hora = this.slot?.hora || this.form.hora || (this.horas.length ? this.horas[0] : '');
    this.form.profissionalId = this.slot?.profissionalId || this.form.profissionalId || (this.profissionais[0]?.id || '');
    this.form.especialidadeId = this.slot?.especialidadeId || this.especialidadeId || this.form.especialidadeId;
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (!this.form.paciente || !this.form.data || !this.form.hora || !this.form.profissionalId) {
      return; // validação simples
    }
    this.save.emit({ ...this.form });
  }
}