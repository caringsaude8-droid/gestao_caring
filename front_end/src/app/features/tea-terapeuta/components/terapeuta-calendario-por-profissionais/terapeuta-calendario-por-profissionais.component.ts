import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profissional, ProfissionalService } from '../../../TEA/services/profissional.service';
import { TeaAgendaService, SlotHorario } from '../../../TEA/services/tea-agenda.service';

interface WeeklyAppointment {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  patient: string;
  professional: string;
  professionalId: string;
  therapy: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou';
}

@Component({
  selector: 'app-terapeuta-calendario-por-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terapeuta-calendario-por-profissionais.component.html',
  styleUrls: ['./terapeuta-calendario-por-profissionais.component.css']
})
export class TerapeutaCalendarioPorProfissionaisComponent implements OnInit {
  selectedDate: string = new Date().toISOString().substring(0,10);
  selectedProfessional: string = '';
  professionals: string[] = [];
  professionalSearch: string = '';
  sessionSearch: string = '';
  allProfessionals: Profissional[] = [];

  get filteredAgendaProfessionals(): Array<{ id: string; nome: string }> {
    const term = this.professionalSearch.trim().toLowerCase();
    return this.agendaService.profissionais
      .filter(p => !term || p.nome.toLowerCase().includes(term))
      .map(p => ({ id: p.id, nome: p.nome }));
  }

  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = [];

  selectedStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';
  filtroStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';

  appointments: WeeklyAppointment[] = [];

  currentDate: Date = new Date();
  calendarDays: Array<{ date: Date; iso: string; isCurrentMonth: boolean; isToday: boolean; hasAppointments: boolean }> = [];

  constructor(private profissionalService: ProfissionalService, private agendaService: TeaAgendaService) {}

  ngOnInit(): void {
    this.profissionalService.profissionais$.subscribe(profissionais => {
      this.allProfessionals = profissionais;
      this.professionals = this.allProfessionals.map(p => p.nome).sort();
      this.selectedProfessional = '';
      this.initializeCalendar();
    });

    this.agendaService.slots$.subscribe((slots: SlotHorario[]) => {
      this.buildWeekFromSelectedDate();
      this.appointments = this.mapSlotsToWeeklyAppointments(slots);
      this.generateSidebarCalendar();
    });
  }

  initializeCalendar(): void {
    this.buildWeekFromSelectedDate();
    this.timeSlots = this.agendaService.getHorasVisiveis();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
    this.generateSidebarCalendar();
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

  onProfessionalChange(value: string): void {
    this.selectedProfessional = value;
    this.generateSidebarCalendar();
  }

  onStatusFilterChange(): void {
    this.listar();
  }

  clearProfessionalFilters(): void {
    this.professionalSearch = '';
    this.sessionSearch = '';
    this.selectedProfessional = '';
    this.initializeCalendar();
  }

  getWeekRange(): string {
    if (!this.weekDays.length) return '';
    const start = this.weekDays[0].date.toLocaleDateString('pt-BR');
    const end = this.weekDays[this.weekDays.length - 1].date.toLocaleDateString('pt-BR');
    return `${start} – ${end}`;
  }

  getCurrentMonthYear(): string {
    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateSidebarCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateSidebarCalendar();
  }

  selectSidebarDay(day: { iso: string; date: Date }) {
    this.selectedDate = day.iso;
    this.listar();
  }

  private generateSidebarCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const today = new Date();
    const days: Array<{ date: Date; iso: string; isCurrentMonth: boolean; isToday: boolean; hasAppointments: boolean }> = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const iso = date.toISOString().substring(0,10);
      const hasAppointments = this.appointments.some(a => a.date === iso && (!this.selectedProfessional || a.professionalId === this.selectedProfessional));
      days.push({
        date,
        iso,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        hasAppointments
      });
    }
    this.calendarDays = days;
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
    const found = this.appointments.find(a => a.date === dateStr && a.time === time && (!this.selectedProfessional || a.professionalId === this.selectedProfessional));
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

    const inRange = slots.filter(s => s.data >= startISO && s.data <= endISO);
    return inRange.map(s => ({
      date: s.data,
      time: s.hora,
      patient: s.paciente || '',
      professional: this.agendaService.getProfissionalNome(s.profissionalId),
      professionalId: s.profissionalId,
      therapy: this.agendaService.getEspecialidadeNome(s.especialidadeId),
      status: s.status
    })).sort((a, b) => (a.date + 'T' + a.time).localeCompare(b.date + 'T' + b.time));
  }

  getWeekStats(): { scheduled: number; completed: number; cancelled: number; noShow: number } {
    const filteredAppointments = this.appointments
      .filter(a => !this.selectedProfessional || a.professionalId === this.selectedProfessional)
      .filter(a => this.filtroStatus === 'todos' || a.status === this.filtroStatus.toLowerCase());
    return {
      scheduled: filteredAppointments.filter(a => a.status === 'agendado').length,
      completed: filteredAppointments.filter(a => a.status === 'confirmado').length,
      cancelled: filteredAppointments.filter(a => a.status === 'cancelado').length,
      noShow: filteredAppointments.filter(a => a.status === 'faltou').length
    };
  }

  get filteredDaySlots(): Array<{ hora: string; paciente: string; especialidade: string; profissional: string; status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou' }>{
    const dayISO = new Date(this.selectedDate).toISOString().substring(0,10);
    return this.appointments
      .filter(a => a.date === dayISO && (!this.selectedProfessional || a.professionalId === this.selectedProfessional))
      .filter(a => this.filtroStatus === 'todos' || a.status === this.filtroStatus.toLowerCase())
      .map(a => ({
        hora: a.time,
        paciente: a.patient,
        especialidade: a.therapy,
        profissional: a.professional,
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

  getSelectedProfessionalName(): string {
    if (!this.selectedProfessional) return '';
    return this.agendaService.getProfissionalNome(this.selectedProfessional);
  }
}