import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Update the import path if the file is in a different location, for example:
import { TeaAgendaService, SlotHorario } from '../../../services/tea-agenda.service';
// Or ensure that '../../services/tea-agenda.service.ts' exists and is correctly named.
import { TerapeutaService, Terapeuta } from '../../../services/terapeuta.service';

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
  selector: 'app-tea-calendario-por-terapeutas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario-terapeuta.html',
  styleUrls: ['./tea-calendario-terapeuta.css']
})
export class TeaCalendarioTerapeutasComponent implements OnInit {
  // Controles de semana e terapeuta
  selectedDate: string = new Date().toISOString().substring(0,10); // yyyy-MM-dd
  selectedTerapeuta: string = '';
  terapeutas: string[] = [];
  terapeutaSearch: string = '';
  sessionSearch: string = '';
  allTerapeutas: any[] = []; // Lista completa (não utilizada para filtro do calendário mensal)

  // Terapeutas vindos da agenda compartilhada (mesmos do calendário mensal)
  get filteredAgendaTerapeutas(): Array<{ id: string; nome: string }> {
    const term = this.terapeutaSearch.trim().toLowerCase();
    return this.agendaService.terapeutas
      .filter(p => !term || p.nome.toLowerCase().includes(term))
      .map(p => ({ id: p.id, nome: p.nome }));
  }

  // Estrutura da semana e horários
  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = [];

  // Filtro de status para Visualização Completa
  selectedStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';
  filtroStatus: 'todos' | 'agendado' | 'confirmado' | 'cancelado' | 'faltou' = 'todos';

  // Agendamentos base por deslocamento de dia (0..5) para gerar dinamicamente
  // baseSchedule: Array<{ dayOffset: number; time: string; patient: string; professional: string; therapy: string }> = [
  //   { dayOffset: 0, time: '14:00', patient: 'Maria Santos', professional: 'Dra. Maria Silva', therapy: 'Psicopedagogo' },
  //   { dayOffset: 1, time: '14:00', patient: 'Carlos Souza', professional: 'Dr. João Santos', therapy: 'Terapia ABA' },
  //   { dayOffset: 2, time: '14:00', patient: 'Ana Júlia', professional: 'Dr. João Santos', therapy: 'Terapia ABA' },
  //   { dayOffset: 3, time: '14:00', patient: 'Pedro Lima', professional: 'Dra. Ana Oliveira', therapy: 'Terapia ABA' },
  //   { dayOffset: 4, time: '14:00', patient: 'João Almeida', professional: 'Dra. Maria Silva', therapy: 'Terapia ABA' },

  //   { dayOffset: 1, time: '14:50', patient: 'Maria Santos', professional: 'Dr. João Santos', therapy: 'Terapia ABA' },
  //   { dayOffset: 2, time: '14:50', patient: 'Pedro Lima', professional: 'Dra. Ana Oliveira', therapy: 'Nutricionista' },
  //   { dayOffset: 3, time: '14:50', patient: 'Ana Júlia', professional: 'Dra. Maria Silva', therapy: 'Psicomotricidade Funcional' },
  //   { dayOffset: 4, time: '14:50', patient: 'Carlos Souza', professional: 'Dr. João Santos', therapy: 'Psicopedagogo' },

  //   { dayOffset: 1, time: '15:40', patient: 'João Almeida', professional: 'Dra. Ana Oliveira', therapy: 'Fonoaudiólogo' },
  //   { dayOffset: 2, time: '15:40', patient: 'Carla Souza', professional: 'Dra. Maria Silva', therapy: 'Psicólogo' },
  //   { dayOffset: 3, time: '15:40', patient: 'Maria Santos', professional: 'Dr. João Santos', therapy: 'Psicopedagogo' },
  //   { dayOffset: 4, time: '15:40', patient: 'Pedro Lima', professional: 'Dra. Ana Oliveira', therapy: 'Terapia ABA' },

  //   { dayOffset: 1, time: '16:30', patient: 'Diogo Thallys', professional: 'Dra. Maria Silva', therapy: 'Terapeuta Ocupacional' },
  //   { dayOffset: 2, time: '16:30', patient: 'Maria Santos', professional: 'Dr. João Santos', therapy: 'Terapia ABA' },
  //   { dayOffset: 3, time: '16:30', patient: 'João Almeida', professional: 'Dra. Ana Oliveira', therapy: 'Terapia ABA' },
  //   { dayOffset: 4, time: '16:30', patient: 'Carla Souza', professional: 'Dra. Maria Silva', therapy: 'Psicólogo' },
  // ];

  // Lista gerada com datas concretas para a semana selecionada
  appointments: WeeklyAppointment[] = [];

  // Mini calendário (sidebar) - igual ao mensal
  currentDate: Date = new Date();
  calendarDays: Array<{ date: Date; iso: string; isCurrentMonth: boolean; isToday: boolean; hasAppointments: boolean }> = [];

  constructor(
    @Inject(TeaAgendaService) private agendaService: TeaAgendaService,
    @Inject(TerapeutaService) private terapeutaService: TerapeutaService
  ) { }

  ngOnInit(): void {
    // Carrega terapeutas para o seletor
    this.terapeutaService.getTerapeutas().subscribe((terapeutas: Terapeuta[]) => {
      this.allTerapeutas = terapeutas as any[];
      this.terapeutas = this.allTerapeutas.map(p => p.nome).sort();
      this.selectedTerapeuta = '';
      this.initializeCalendar();
    });

    // Integra com a agenda compartilhada para espelhar os mesmos dados do calendário mensal
    this.agendaService.slots$.subscribe((slots: SlotHorario[]) => {
      // Atualiza a semana atual e popula agendamentos a partir dos slots
      this.buildWeekFromSelectedDate();
      this.appointments = this.mapSlotsToWeeklyAppointments(slots);
      this.generateSidebarCalendar();
    });
  }

  initializeCalendar(): void {
    // Inicializa a semana e gera os agendamentos concretos
    this.buildWeekFromSelectedDate();
    // Sincroniza horários visíveis com o serviço (igual ao calendário mensal)
    this.timeSlots = this.agendaService.getHorasVisiveis();
    // Ao iniciar, sincroniza com os slots atuais do serviço
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
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
    // Reconstrói a semana e regenera os agendamentos dinâmicos
    this.buildWeekFromSelectedDate();
    this.appointments = this.mapSlotsToWeeklyAppointments(this.agendaService.getSlotsSnapshot());
    // this.generateSidebarCalendar(); // Removido para evitar loop de detecção de mudanças
  }

  onTerapeutaChange(value: string): void {
    this.selectedTerapeuta = value;
    // A visualização reage automaticamente via binding, não precisa regenerar appointments.
    this.generateSidebarCalendar(); // Atualiza o calendário lateral com base no terapeuta selecionado
  }

  onStatusFilterChange(): void {
    this.listar();
  }

  clearTerapeutaFilters(): void {
    this.terapeutaSearch = '';
    this.sessionSearch = '';
    this.selectedTerapeuta = '';
    this.initializeCalendar(); // Reinicializa o calendário para mostrar todos os terapeutas
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
      const hasAppointments = this.appointments.some(a => a.date === iso && (!this.selectedTerapeuta || a.terapeutaId === this.selectedTerapeuta));
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

  // Mapeia slots do serviço para agendamentos semanais, espelhando o calendário mensal
  private mapSlotsToWeeklyAppointments(slots: SlotHorario[]): WeeklyAppointment[] {
    if (!this.weekDays.length) return [];
    const startISO = this.weekDays[0].date.toISOString().substring(0, 10);
    const endISO = this.weekDays[this.weekDays.length - 1].date.toISOString().substring(0, 10);

    const inRange = slots.filter(s => s.data >= startISO && s.data <= endISO);
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

  // Estatísticas e tabela "Visualização Completa" semelhantes ao mensal
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
        status: a.status // Usar o status real do agendamento
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

  // Nome do terapeuta selecionado (quando ID está selecionado)
  getSelectedTerapeutaName(): string {
    if (!this.selectedTerapeuta) return '';
    return this.agendaService.getTerapeutaNome(this.selectedTerapeuta);
  }
}