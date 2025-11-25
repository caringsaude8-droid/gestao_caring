import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WeeklyAppointment {
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  patient: string;
  terapeuta: string;
  professional?: string;
  therapy: string;
}

@Component({
  selector: 'app-tea-calendario-por-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario-paciente.html',
  styleUrls: ['./tea-calendario-paciente.css']
})
export class TeaCalendarioPorPacienteComponent implements OnInit {
  // Controles de semana e paciente
  selectedDate: string = new Date().toISOString().substring(0,10); // yyyy-MM-dd
  selectedPatient: string = '';
  patients: string[] = [];
  patientSearch: string = '';
  sessionSearch: string = '';
  get filteredPatients(): string[] {
    const term = this.patientSearch.trim().toLowerCase();
    return this.patients.filter(p => !term || p.toLowerCase().includes(term));
  }

  // Estrutura da semana e horários
  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = ['14:00', '14:50', '15:40', '16:30'];

  // Base de agendamentos por deslocamento de dia (0..5) para gerar dinamicamente
  baseSchedule: Array<{ dayOffset: number; time: string; patient: string; terapeuta: string; therapy: string }> = [
    { dayOffset: 0, time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Geo Psi', therapy: 'Terapia ABA' },
    { dayOffset: 1, time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 2, time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 3, time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Ana Carolina', therapy: 'Terapia ABA' },
    { dayOffset: 4, time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Ana Carolina', therapy: 'Terapia ABA' },

    { dayOffset: 1, time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { dayOffset: 2, time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Isaura', therapy: 'Nutricionista' },
    { dayOffset: 3, time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Wylly', therapy: 'Psicomotricidade Funcional' },
    { dayOffset: 4, time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Aldair Ivo', therapy: 'Psicopedagogo' },

    { dayOffset: 1, time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Ana', therapy: 'Fonoaudiólogo' },
    { dayOffset: 2, time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Lidja', therapy: 'Psicólogo' },
    { dayOffset: 3, time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Aldair Ivo', therapy: 'Psicopedagogo' },
    { dayOffset: 4, time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Geo Psi', therapy: 'Terapia ABA' },

    { dayOffset: 1, time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Elayne', therapy: 'Terapeuta Ocupacional' },
    { dayOffset: 2, time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Geo Psi', therapy: 'Terapia ABA' },
    { dayOffset: 3, time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Ana Carolina', therapy: 'Terapia ABA' },
    { dayOffset: 4, time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', terapeuta: 'Lidja', therapy: 'Psicólogo' },
  ];

  appointments: WeeklyAppointment[] = [];

  // Mini calendário (sidebar) - mesmo comportamento do mensal
  currentDate: Date = new Date();
  calendarDays: Array<{ date: Date; iso: string; isCurrentMonth: boolean; isToday: boolean; hasAppointments: boolean }> = [];

  ngOnInit(): void {
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
    // Popular pacientes únicos
    this.patients = Array.from(new Set(this.appointments.map(a => a.patient))).sort();
    this.selectedPatient = this.patients[0] || '';

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
    this.buildWeekFromSelectedDate();
    this.generateAppointmentsForWeek();
    this.generateSidebarCalendar();
  }

  onPatientChange(value: string): void {
    this.selectedPatient = value;
  }

  isToday(day: Date): boolean {
    const t = new Date();
    t.setHours(0,0,0,0);
    const d = new Date(day);
    d.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  }

  getCellContent(day: Date, time: string): { terapeuta: string; therapy: string } | null {
    const dateStr = day.toISOString().substring(0,10);
    const found = this.appointments.find(a => a.date === dateStr && a.time === time && a.patient === this.selectedPatient);
    if (!found) return null;
    const term = this.sessionSearch.trim().toLowerCase();
    if (term && !(found.terapeuta.toLowerCase().includes(term) || found.therapy.toLowerCase().includes(term))) {
      return null;
    }
    return { terapeuta: found.terapeuta, therapy: found.therapy };
  }

  clearPatientFilters(): void {
    this.patientSearch = '';
    this.sessionSearch = '';
    this.selectedPatient = '';
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
      const hasAppointments = this.appointments.some(a => a.date === iso && (!this.selectedPatient || a.patient === this.selectedPatient));
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

  private generateAppointmentsForWeek(): void {
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
        terapeuta: s.terapeuta,
        professional: s.terapeuta,
        therapy: s.therapy
      };
    });
  }

  // Estatísticas e tabela "Visualização Completa" semelhantes ao mensal
  getWeekStats(): { scheduled: number; completed: number; cancelled: number; noShow: number } {
    const count = this.appointments.filter(a => !this.selectedPatient || a.patient === this.selectedPatient).length;
    return { scheduled: count, completed: 0, cancelled: 0, noShow: 0 };
  }

  get filteredDaySlots(): Array<{ hora: string; paciente: string; especialidade: string; terapeuta: string; status: 'agendado' | 'confirmado' | 'cancelado' }> {
    const dayISO = new Date(this.selectedDate).toISOString().substring(0,10);
    return this.appointments
      .filter(a => a.date === dayISO && (!this.selectedPatient || a.patient === this.selectedPatient))
      .map(a => ({
        hora: a.time,
        paciente: a.patient,
        especialidade: a.therapy,
        terapeuta: a.terapeuta || '',
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