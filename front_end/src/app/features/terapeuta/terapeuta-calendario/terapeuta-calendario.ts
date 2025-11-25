import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Terapeuta, TerapeutaService } from '../../TEA/services/terapeuta.service';
import { TeaAgendaService, SlotHorario } from '../../TEA/services/tea-agenda.service';
import { AuthService } from '../../../core/services/auth.service';

interface WeeklyAppointment {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  patient: string;
  terapeuta: string;
  terapeutaId: string;
  therapy: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou';
}

@Component({
  selector: 'app-terapeuta-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './terapeuta-calendario.html',
  styleUrls: ['./terapeuta-calendario.css']
})
export class TerapeutaCalendarioComponent implements OnInit {
  selectedDate: string = new Date().toISOString().substring(0,10);
  selectedTerapeuta: string = '';
  terapeutas: string[] = [];
  terapeutaSearch: string = '';
  sessionSearch: string = '';
  allTerapeutas: Terapeuta[] = [];
  terapeutaId: string | null = null;

  get filteredAgendaTerapeutas(): Array<{ id: string; nome: string }> {
    const term = this.terapeutaSearch.trim().toLowerCase();
    return this.agendaService.terapeutas
      .filter(p => !term || p.nome.toLowerCase().includes(term))
      .map(p => ({ id: p.id, nome: p.nome }));
  }

  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = [];

  selectedStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';
  filtroStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';

  appointments: WeeklyAppointment[] = [];

  

  constructor(private terapeutaService: TerapeutaService, private agendaService: TeaAgendaService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.terapeutaId = user?.id ?? null;
    // Quando terapeuta estiver logado, pre-seleciona para escopo por padrão
    if (this.terapeutaId && !this.authService.isAdmin()) {
      this.selectedTerapeuta = this.terapeutaId;
    }
    this.terapeutaService.getTerapeutas().subscribe(terapeutas => {
      this.allTerapeutas = terapeutas;
      this.terapeutas = this.allTerapeutas.map(p => p.nome).sort();
      this.selectedTerapeuta = '';
      this.initializeCalendar();
    });

    this.agendaService.slots$.subscribe((slots: SlotHorario[]) => {
      this.buildWeekFromSelectedDate();
      this.appointments = this.mapSlotsToWeeklyAppointments(slots);
    });
  }

  initializeCalendar(): void {
    this.buildWeekFromSelectedDate();
    this.timeSlots = this.agendaService.getHorasVisiveis();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
  }

  buildWeekFromSelectedDate(): void {
    const base = new Date(this.selectedDate);
    const dayOfWeek = base.getDay();
    const monday = new Date(base);
    const diffToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(base.getDate() - diffToMonday);

    this.weekDays = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      this.weekDays.push({ label: `${labels[i]} - ${d.toLocaleDateString('pt-BR')}`, date: d });
    }
  }

  getWeekRange(): string {
    if (!this.weekDays.length) return '';
    const start = this.weekDays[0].date.toLocaleDateString('pt-BR');
    const end = this.weekDays[this.weekDays.length - 1].date.toLocaleDateString('pt-BR');
    return `${start} – ${end}`;
  }

  previousWeek(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 7);
    this.selectedDate = d.toISOString().substring(0,10);
    this.buildWeekFromSelectedDate();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
  }

  nextWeek(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 7);
    this.selectedDate = d.toISOString().substring(0,10);
    this.buildWeekFromSelectedDate();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
  }

  listar(): void {
    this.buildWeekFromSelectedDate();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
  }

  onTerapeutaChange(value: string): void {
    this.selectedTerapeuta = value;
  }

  onStatusFilterChange(): void {
    this.listar();
  }

  clearTerapeutaFilters(): void {
    this.terapeutaSearch = '';
    this.sessionSearch = '';
    this.selectedTerapeuta = '';
    this.initializeCalendar();
  }

  

  

  getMonthlyBadgeClass(status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou'): string {
    switch (status) {
      case 'cancelado': return 'badge-cancelled';
      case 'confirmado': return 'badge-completed';
      case 'faltou': return 'badge-no-show';
      default: return 'badge-scheduled';
    }
  }

  isToday(day: Date): boolean {
    const t = new Date();
    t.setHours(0,0,0,0);
    const d = new Date(day);
    d.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  }

  getCellContent(day: Date, time: string): { patient: string; therapy: string } | null {
    const dateStr = day.toISOString().substring(0,10);
    const found = this.appointments.find(a => a.date === dateStr && a.time === time && (!this.selectedTerapeuta || a.terapeutaId === this.selectedTerapeuta));
    if (!found) return null;
    const term = this.sessionSearch.trim().toLowerCase();
    if (term && !(found.patient.toLowerCase().includes(term) || found.therapy.toLowerCase().includes(term))) {
      return null;
    }
    return { patient: found.patient, therapy: found.therapy };
  }

  private mapSlotsToWeeklyAppointments(slots: SlotHorario[]): WeeklyAppointment[] {
    if (!this.weekDays.length) return [];
    const startISO = this.weekDays[0].date.toISOString().substring(0, 10);
    const endISO = this.weekDays[this.weekDays.length - 1].date.toISOString().substring(0, 10);

    let inRange = slots.filter(s => s.data >= startISO && s.data <= endISO);
    // Aplicar escopo por terapeuta: se usuário não for admin e tiver terapeutaId, forçar filtro
    const effectiveTerapeutaId = (!this.authService.isAdmin() && this.terapeutaId) ? this.terapeutaId : (this.selectedTerapeuta || this.terapeutaId || '');
    if (effectiveTerapeutaId) {
      inRange = inRange.filter(s => s.terapeutaId === effectiveTerapeutaId);
    }
    return inRange.map(s => ({
      date: s.data,
      time: s.hora,
      patient: s.paciente || '',
      terapeuta: this.agendaService.getTerapeutaNome(s.terapeutaId),
      terapeutaId: s.terapeutaId,
      therapy: this.agendaService.getEspecialidadeNome(s.especialidadeId),
      status: s.status
    })).sort((a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time));
  }

  getWeekStats(): { scheduled: number; completed: number; cancelled: number; noShow: number } {
    const filteredAppointments = this.appointments
      .filter(a => !this.selectedTerapeuta || a.terapeutaId === this.selectedTerapeuta)
      .filter(a => this.filtroStatus === 'todos' || a.status === this.filtroStatus.toLowerCase());
    return {
      scheduled: filteredAppointments.filter(a => a.status === 'agendado').length,
      completed: filteredAppointments.filter(a => a.status === 'confirmado').length,
      cancelled: filteredAppointments.filter(a => a.status === 'cancelado').length,
      noShow: filteredAppointments.filter(a => a.status === 'faltou').length
    };
  }

  get filteredDaySlots(): Array<{ hora: string; paciente: string; especialidade: string; terapeuta: string; status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou' }>{
    const dayISO = new Date(this.selectedDate).toISOString().substring(0,10);
    return this.appointments
      .filter(a => a.date === dayISO && (!this.selectedTerapeuta || a.terapeutaId === this.selectedTerapeuta))
      .filter(a => this.filtroStatus === 'todos' || a.status === this.filtroStatus.toLowerCase())
      .map(a => ({
        hora: a.time,
        paciente: a.patient,
        especialidade: a.therapy,
        terapeuta: a.terapeuta,
        status: a.status
      }))
      .sort((x, y) => x.hora.localeCompare(y.hora));
  }

  getSlotStatusLabel(s: 'agendado' | 'confirmado' | 'cancelado' | 'faltou'): string {
    switch (s) {
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'faltou': return 'Faltou';
      default: return 'Agendado';
    }
  }

  
}