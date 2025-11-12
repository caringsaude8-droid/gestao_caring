import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeaAgendaService, SlotHorario } from '../../services/tea-agenda.service';

interface TeaAppointment {
  id: string;
  patientName: string;
  therapistName: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  room: string;
  notes?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: TeaAppointment[];
}

@Component({
  selector: 'app-tea-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario.component.html',
  styleUrls: ['./tea-calendario.component.css']
})
export class TeaCalendarioComponent implements OnInit {
  currentDate = new Date();
  selectedTherapist = '';
  statusFilter: 'Todos' | 'Agendado' | 'Confirmado' | 'Cancelado' = 'Todos';
  filtroEspecialidade: string = '';
  filtroProfissional: string = '';
  filtroPaciente: string = '';
  submenuMode: 'pacientes' | 'profissionais' = 'profissionais';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  especialidadesFiltradas: { id: string; nome: string }[] = [];
  profissionaisFiltrados: { id: string; nome: string; especialidadeId: string }[] = [];
  pacientesFiltrados: string[] = [];
  calendarDays: CalendarDay[] = [];
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  // Dados provenientes do serviço compartilhado
  slots: SlotHorario[] = [];
  selectedDayISO: string = new Date().toISOString().slice(0, 10);

  // Semana (para tabela semanal abaixo)
  weeklyDays: { label: string; date: Date }[] = [];
  weeklyTimeSlots: string[] = ['14:00', '14:50', '15:40', '16:30'];

  get todaysAppointments(): TeaAppointment[] {
    const targetDay = this.selectedDayISO;
    return this.mapSlotsToAppointments(
      this.slots.filter(s =>
        s.data === targetDay &&
        s.paciente &&
        s.status !== 'cancelado' &&
        (!this.filtroProfissional || s.profissionalId === this.filtroProfissional) &&
        (!this.filtroPaciente || s.paciente === this.filtroPaciente) &&
        (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade)
      )
    );
  }

  constructor(private agendaService: TeaAgendaService, private router: Router) {}

  ngOnInit() {
    this.agendaService.slots$.subscribe(slots => {
      this.slots = slots;
      // Monta lista única de pacientes para o submenu
      this.pacientesFiltrados = Array.from(new Set(
        (this.slots || [])
          .map(s => s.paciente)
          .filter((n): n is string => !!n && n.trim().length > 0)
      )).sort((a, b) => a.localeCompare(b));
      this.generateCalendar();
      this.buildWeekFromSelectedDay();
    });
    // Inicializa listas de filtros com dados do serviço
    this.especialidadesFiltradas = this.agendaService.especialidades;
    this.profissionaisFiltrados = this.agendaService.profissionais;
  }

  onPeriodoChange() {
    // Ajusta filtros básicos e regenera visão; pode ser expandido futuramente
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const iso = date.toISOString().split('T')[0];
      const dayAppointments = this.mapSlotsToAppointments(
        this.slots.filter(s =>
          s.data === iso &&
          s.paciente &&
          (!this.filtroProfissional || s.profissionalId === this.filtroProfissional) &&
          (!this.filtroPaciente || s.paciente === this.filtroPaciente) &&
          (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade)
        )
      );
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        appointments: dayAppointments
      });
    }
    
    this.calendarDays = days;
  }

  getCurrentMonthYear(): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }


  filterAppointments() {
    // Implementar filtro por terapeuta
    this.generateCalendar();
  }

  openNewAppointment() {
    console.log('Abrindo modal para nova sessão');
    // Implementar modal de nova sessão
  }

  getMonthStats() {
    const monthISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const curKey = monthISO(this.currentDate);
    const monthSlots = this.slots.filter(s =>
      // Aplica filtro por data (dia selecionado, se existir) ou mês atual
      (this.selectedDayISO ? s.data === this.selectedDayISO : s.data.startsWith(curKey)) &&
      (!this.filtroProfissional || s.profissionalId === this.filtroProfissional) &&
      (!this.filtroPaciente || s.paciente === this.filtroPaciente) &&
      (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade)
    );

    const scheduled = monthSlots.filter(s => s.status === 'agendado').length;
    const completed = monthSlots.filter(s => s.status === 'confirmado').length;
    const cancelled = monthSlots.filter(s => s.status === 'cancelado').length;
    const noShow = 0; // Sem status específico de falta no modelo atual

    return { scheduled, completed, cancelled, noShow };
  }

  // Utilidades
  matchesSelectedTherapist(s: SlotHorario): boolean {
    if (!this.selectedTherapist) return true;
    const name = this.agendaService.getProfissionalNome(s.profissionalId);
    return this.selectedTherapist === name || this.selectedTherapist === `Dr. ${name}`;
  }

  mapSlotsToAppointments(slots: SlotHorario[]): TeaAppointment[] {
    return slots.map(s => {
      const status: TeaAppointment['status'] = s.status === 'cancelado' ? 'cancelled' : 'scheduled';
      return {
        id: s.id,
        patientName: s.paciente || '',
        therapistName: this.agendaService.getProfissionalNome(s.profissionalId),
        type: this.agendaService.especialidades.find(e => e.id === s.especialidadeId)?.nome || '',
        date: s.data,
        time: s.hora,
        duration: 45,
        status,
        room: '—'
      } as TeaAppointment;
    }).sort((a, b) => a.time.localeCompare(b.time));
  }

  // Visualização completa (tabela semelhante ao Agendamento)
  get daySlots(): SlotHorario[] {
    return this.slots
      .filter(s =>
        s.data === this.selectedDayISO &&
        (!this.filtroProfissional || s.profissionalId === this.filtroProfissional) &&
        (!this.filtroPaciente || s.paciente === this.filtroPaciente) &&
        (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade)
      )
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  get filteredDaySlots(): SlotHorario[] {
    const mapFilter: Record<'Agendado' | 'Confirmado' | 'Cancelado', SlotHorario['status']> = {
      Agendado: 'agendado',
      Confirmado: 'confirmado',
      Cancelado: 'cancelado',
    };
    if (this.statusFilter === 'Todos') return this.daySlots;
    const target = mapFilter[this.statusFilter];
    return this.daySlots.filter(s => s.status === target);
  }

  selectDay(day: CalendarDay) {
    this.selectedDayISO = day.date.toISOString().split('T')[0];
    // Ao mudar o dia, a visão é recalculada (getters dependem de selectedDayISO)
    this.buildWeekFromSelectedDay();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getEspecialidadeNome(id: string): string {
    return this.agendaService.especialidades.find(e => e.id === id)?.nome || '';
  }

  getProfissionalNome(id: string): string {
    return this.agendaService.getProfissionalNome(id);
  }

  getSlotStatusLabel(status: SlotHorario['status']): string {
    const map: Record<SlotHorario['status'], string> = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      cancelado: 'Cancelado',
      faltou: 'Faltou'
    };
    return map[status] || status;
  }

  getCheckinLabel(s: SlotHorario): string {
    // Placeholder simples: espelha status como check-in visual
    return this.getSlotStatusLabel(s.status);
  }

  onDetails(s: SlotHorario) {
    // Navega para a página de Agendamento; pode evoluir para modal com detalhes
    this.navigateTo('/tea/agendamento');
  }

  onCheckinChange(s: SlotHorario, status: SlotHorario['status']) {
    // Atualiza o status localmente para refletir visualmente na tabela
    s.status = status;
  }

  setProfissional(id: string) {
    this.filtroProfissional = id;
    this.onPeriodoChange();
  }

  setSubmenuMode(mode: 'pacientes' | 'profissionais') {
    this.submenuMode = mode;
  }

  setPaciente(nome: string) {
    this.filtroPaciente = nome;
    this.onPeriodoChange();
  }

  // ====== Semana (weekly table) ======
  private buildWeekFromSelectedDay(): void {
    const baseISO = this.selectedDayISO || new Date().toISOString().substring(0,10);
    const base = new Date(baseISO);
    const dayOfWeek = base.getDay(); // 0=Dom, 1=Seg...
    const monday = new Date(base);
    const diffToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(base.getDate() - diffToMonday);

    const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    this.weeklyDays = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      this.weeklyDays.push({ label: `${labels[i]} - ${d.toLocaleDateString('pt-BR')}`, date: d });
    }
  }

  isToday(day: Date): boolean {
    const t = new Date(); t.setHours(0,0,0,0);
    const d = new Date(day); d.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  }

  getWeeklyCellContent(day: Date, time: string): { patient: string; therapy: string } | null {
    const iso = day.toISOString().substring(0,10);
    const found = this.slots.find(s =>
      s.data === iso && s.hora === time &&
      (!this.filtroProfissional || s.profissionalId === this.filtroProfissional) &&
      (!this.filtroPaciente || s.paciente === this.filtroPaciente) &&
      (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade)
    );
    if (!found) return null;
    return { patient: found.paciente || '—', therapy: this.getEspecialidadeNome(found.especialidadeId) };
  }
}