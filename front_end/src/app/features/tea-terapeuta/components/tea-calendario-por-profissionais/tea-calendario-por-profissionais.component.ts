import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WeeklyAppointment {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  patient: string;
  professional: string;
  therapy: string;
}

@Component({
  selector: 'app-tea-terapeuta-calendario-por-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario-por-profissionais.component.html',
  styleUrls: ['./tea-calendario-por-profissionais.component.css']
})
export class TeaTerapeutaCalendarioPorProfissionaisComponent implements OnInit {
  // Controles de semana e profissional
  selectedDate: string = new Date().toISOString().substring(0,10); // yyyy-MM-dd
  selectedProfessional: string = '';
  professionals: string[] = [];
  professionalSearch: string = '';
  sessionSearch: string = '';
  get filteredProfessionals(): string[] {
    const term = this.professionalSearch.trim().toLowerCase();
    return this.professionals.filter(p => !term || p.toLowerCase().includes(term));
  }

  // Estrutura da semana e horários
  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = ['14:00', '14:50', '15:40', '16:30'];

  // Agendamentos base por deslocamento de dia (0..5) para gerar dinamicamente
  baseSchedule: Array<{ dayOffset: number; time: string; patient: string; professional: string; therapy: string }> = [
    { dayOffset: 0, time: '14:00', patient: 'Maria Santos', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },
    { dayOffset: 1, time: '14:00', patient: 'Carlos Souza', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 2, time: '14:00', patient: 'Ana Júlia', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 3, time: '14:00', patient: 'Pedro Lima', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { dayOffset: 4, time: '14:00', patient: 'João Almeida', professional: 'Geo Psi', therapy: 'Terapia ABA' },

    { dayOffset: 1, time: '14:50', patient: 'Maria Santos', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 2, time: '14:50', patient: 'Pedro Lima', professional: 'Isaura', therapy: 'Nutricionista' },
    { dayOffset: 3, time: '14:50', patient: 'Ana Júlia', professional: 'Wylly', therapy: 'Psicomotricidade Funcional' },
    { dayOffset: 4, time: '14:50', patient: 'Carlos Souza', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },

    { dayOffset: 1, time: '15:40', patient: 'João Almeida', professional: 'Ana', therapy: 'Fonoaudiólogo' },
    { dayOffset: 2, time: '15:40', patient: 'Carla Souza', professional: 'Lidja', therapy: 'Psicólogo' },
    { dayOffset: 3, time: '15:40', patient: 'Maria Santos', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },
    { dayOffset: 4, time: '15:40', patient: 'Pedro Lima', professional: 'Geo Psi', therapy: 'Terapia ABA' },

    { dayOffset: 1, time: '16:30', patient: 'Diogo Thallys', professional: 'Elayne', therapy: 'Terapeuta Ocupacional' },
    { dayOffset: 2, time: '16:30', patient: 'Maria Santos', professional: 'Geo Psi', therapy: 'Terapia ABA' },
    { dayOffset: 3, time: '16:30', patient: 'João Almeida', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { dayOffset: 4, time: '16:30', patient: 'Carla Souza', professional: 'Lidja', therapy: 'Psicólogo' },
  ];

  // Lista gerada com datas concretas para a semana selecionada
  appointments: WeeklyAppointment[] = [];

  // Mini calendário (sidebar) - igual ao mensal
  currentDate: Date = new Date();
  calendarDays: Array<{ date: Date; iso: string; isCurrentMonth: boolean; isToday: boolean; hasAppointments: boolean }> = [];

  ngOnInit(): void {
    // Inicializa a semana e gera os agendamentos concretos
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
    // Popular profissionais únicos
    this.professionals = Array.from(new Set(this.appointments.map(a => a.professional))).sort();
    this.selectedProfessional = this.professionals[0] || '';
    this.generateSidebarCalendar();
  }

  buildWeekFromSelectedDate(): void {
    const base = new Date(this.selectedDate);
    const dayOfWeek = base.getDay(); // 0=Dom, 1=Seg...
    // Ajusta para começar na segunda-feira
    const monday = new Date(base);
    const diffToMonday = (dayOfWeek + 6) % 7; // distância até segunda
    monday.setDate(base.getDate() - diffToMonday);

    this.weekDays = [];
    for (let i = 0; i < 6; i++) { // Seg a Sáb conforme print
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
      this.weekDays.push({ label: `${labels[i]} - ${d.toLocaleDateString('pt-BR')}` as string, date: d });
    }
  }

  previousWeek(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 7);
    this.selectedDate = d.toISOString().substring(0,10);
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
  }

  nextWeek(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 7);
    this.selectedDate = d.toISOString().substring(0,10);
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
  }

  listar(): void {
    // Reconstrói a semana e regenera os agendamentos dinâmicos
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
    this.generateSidebarCalendar();
  }

  onProfessionalChange(value: string): void {
    this.selectedProfessional = value;
    // A visualização reage automaticamente via binding, não precisa regenerar appointments.
  }

  clearProfessionalFilters(): void {
    this.professionalSearch = '';
    this.sessionSearch = '';
    this.selectedProfessional = '';
  }

  getWeekRange(): string {
    if (!this.weekDays.length) return '';
    const start = this.weekDays[0].date.toLocaleDateString('pt-BR');
    const end = this.weekDays[this.weekDays.length - 1].date.toLocaleDateString('pt-BR');
    return `${start} – ${end}`;
  }

  // ===== Mini calendário lateral =====
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
      const hasAppointments = this.appointments.some(a => a.date === iso && (!this.selectedProfessional || a.professional === this.selectedProfessional));
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

  // ===== Badges do mensal =====
  getMonthlyBadgeClass(status: 'agendado' | 'confirmado' | 'cancelado'): string {
    return status === 'cancelado' ? 'badge-cancelled' : status === 'confirmado' ? 'badge-completed' : 'badge-scheduled';
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
    const found = this.appointments.find(a => a.date === dateStr && a.time === time && a.professional === this.selectedProfessional);
    if (!found) return null;
    const term = this.sessionSearch.trim().toLowerCase();
    if (term && !(found.patient.toLowerCase().includes(term) || found.therapy.toLowerCase().includes(term))) {
      return null;
    }
    return { patient: found.patient, therapy: found.therapy };
  }

  private generateAppointmentsForWeek(): void {
    // Gera datas concretas a partir da segunda-feira da semana
    if (!this.weekDays.length) return;
    const monday = new Date(this.weekDays[0].date);
    monday.setHours(0,0,0,0);
    this.appointments = this.baseSchedule.map(s => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + s.dayOffset);
      return {
        date: d.toISOString().substring(0,10),
        time: s.time,
        patient: s.patient,
        professional: s.professional,
        therapy: s.therapy
      };
    });
  }

  // Estatísticas e tabela "Visualização Completa" semelhantes ao mensal
  getWeekStats(): { scheduled: number; completed: number; cancelled: number; noShow: number } {
    const count = this.appointments.filter(a => !this.selectedProfessional || a.professional === this.selectedProfessional).length;
    return { scheduled: count, completed: 0, cancelled: 0, noShow: 0 };
  }

  get filteredDaySlots(): Array<{ hora: string; paciente: string; especialidade: string; profissional: string; status: 'agendado' | 'confirmado' | 'cancelado' }>{
    const dayISO = new Date(this.selectedDate).toISOString().substring(0,10);
    return this.appointments
      .filter(a => a.date === dayISO && (!this.selectedProfessional || a.professional === this.selectedProfessional))
      .map(a => ({
        hora: a.time,
        paciente: a.patient,
        especialidade: a.therapy,
        profissional: a.professional,
        status: 'agendado' as const
      }))
      .sort((x, y) => x.hora.localeCompare(y.hora));
  }

  getSlotStatusLabel(s: 'agendado' | 'confirmado' | 'cancelado'): string {
    switch (s) {
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      default: return 'Agendado';
    }
  }
}