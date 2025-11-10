import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Appointment {
  date: string;
  patient: string;
  convenio: string;
  checkedIn: boolean;
}

@Component({
  selector: 'app-tea-checkin-por-senha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-checkin-por-senha.component.html',
  styleUrls: ['./tea-checkin-por-senha.component.css']
})
export class TeaCheckinPorSenhaComponent implements OnInit {
  // Modelo de filtros
  pacienteBusca: string = '';
  pacienteSelecionado: string = '';
  tipoAgendamento: 'Interno' | 'Externo' = 'Interno';
  formaOrdenacao: 'Crescente' | 'Decrescente' = 'Crescente';
  private searchInput$ = new Subject<string>();

  // Dados mock conforme o print
  appointments: Appointment[] = [
    { date: '31/10/2025', patient: 'Bernardo Ferreira Souza Leão', convenio: '—', checkedIn: true },
    { date: '31/10/2025', patient: 'Bryan Guilherme da Silva', convenio: '—', checkedIn: true }
  ];

  filteredAppointments: Appointment[] = [...this.appointments];
  pacienteOptions: string[] = [];

  ngOnInit(): void {
    this.searchInput$.pipe(debounceTime(250)).subscribe((term) => {
      this.pacienteBusca = term;
      this.pesquisar();
    });

    // Popular opções únicas de pacientes para o select
    this.pacienteOptions = Array.from(new Set(this.appointments.map(a => a.patient)))
      .sort((a, b) => this.normalizeText(a).localeCompare(this.normalizeText(b)));
  }

  pesquisar(): void {
    const term = this.normalizeText(this.pacienteBusca.trim().toLowerCase());
    const selected = this.normalizeText(this.pacienteSelecionado.trim().toLowerCase());
    let list = [...this.appointments];

    // Se houver paciente selecionado, filtra por igualdade exata; caso contrário, aplica busca textual
    if (selected) {
      list = list.filter(a => this.normalizeText(a.patient.toLowerCase()) === selected);
    } else if (term) {
      list = list.filter(a => this.normalizeText(a.patient.toLowerCase()).includes(term));
    }

    // tipoAgendamento é ilustrativo neste mock; mantemos para futura integração

    list.sort((a, b) => {
      const aDate = this.parseDate(a.date);
      const bDate = this.parseDate(b.date);
      return this.formaOrdenacao === 'Crescente' ? aDate - bDate : bDate - aDate;
    });

    this.filteredAppointments = list;
  }

  limparFiltros(): void {
    this.pacienteBusca = '';
    this.pacienteSelecionado = '';
    this.tipoAgendamento = 'Interno';
    this.formaOrdenacao = 'Crescente';
    this.filteredAppointments = [...this.appointments];
  }

  private parseDate(d: string): number {
    // Formato dd/MM/yyyy
    const [day, month, year] = d.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  onPacienteBuscaChange(value: string): void {
    this.searchInput$.next(value);
  }

  onPacienteSelecionadoChange(): void {
    this.pesquisar();
  }

  private normalizeText(text: string): string {
    // Remove acentos para busca mais amigável em PT-BR
    return text.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
  }
}