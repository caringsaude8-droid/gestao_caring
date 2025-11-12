import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeaAgendamentoFormModalComponent, AgendamentoFormData } from './components/tea-agendamento-form-modal/tea-agendamento-form-modal.component';
import { TeaAgendaService, SlotHorario as ServiceSlotHorario, Profissional as ServiceProfissional, Especialidade as ServiceEspecialidade } from '../../services/tea-agenda.service';

type Especialidade = ServiceEspecialidade;
type Profissional = ServiceProfissional;
type SlotHorario = ServiceSlotHorario;

@Component({
  selector: 'app-tea-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, TeaAgendamentoFormModalComponent],
  templateUrl: './tea-agendamento.component.html',
  styleUrls: ['./tea-agendamento.component.css']
})
export class TeaAgendamentoComponent implements OnInit {
  especialidades: Especialidade[] = [];
  profissionais: Profissional[] = [];

  slots: SlotHorario[] = [];

  filtroEspecialidade: string = '';
  filtroProfissional: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  viewMode: 'list' | 'grid' = 'list';
  diaSelecionado: string = '';

  // Modal state
  showFormModal: boolean = false;
  slotSelecionado: SlotHorario | null = null;
  detalhesSlot: SlotHorario | null = null;
  // Estado de UI para dropdown de Check-in não é necessário

  diasVisiveis: string[] = [];
  horasVisiveis: string[] = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  // Calendar state
  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calCurrent: Date = new Date();
  mesesPt = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  calendarWeeks: { iso: string; day: number; inMonth: boolean; isToday: boolean; isSelected: boolean; availableCount: number }[][] = [];

  // Confirmação de exclusão (modal do sistema)
  confirmModalOpen: boolean = false;
  confirmMode: 'single' | 'bulk' = 'bulk';
  confirmCount: number = 0;
  confirmTarget: SlotHorario | null = null;

  constructor(private agendaService: TeaAgendaService) {}

  ngOnInit(): void {
    // Carregar dados do serviço compartilhado
    this.especialidades = this.agendaService.especialidades;
    this.profissionais = this.agendaService.profissionais;
    this.agendaService.slots$.subscribe(slots => {
      this.slots = slots;
      // atualizar contadores/grade quando slots mudarem
      this.buildCalendar();
    });
    this.inicializarPeriodoPadrao();
    this.atualizarDiasVisiveis();
    this.diaSelecionado = this.filtroDataInicio;
    this.calCurrent = new Date(this.diaSelecionado);
    this.buildCalendar();
  }

  private inicializarPeriodoPadrao() {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 6);
    this.filtroDataInicio = inicio.toISOString().slice(0, 10);
    this.filtroDataFim = fim.toISOString().slice(0, 10);
  }

  private atualizarDiasVisiveis() {
    const start = new Date(this.filtroDataInicio);
    const end = new Date(this.filtroDataFim);
    const dates: string[] = [];
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dates.push(fmt(new Date(dt)));
    }
    this.diasVisiveis = dates;
  }

  private firstDayOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  private lastDayOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
  private toISO(d: Date) { return d.toISOString().slice(0, 10); }

  buildCalendar() {
    const first = this.firstDayOfMonth(this.calCurrent);
    const last = this.lastDayOfMonth(this.calCurrent);
    const start = new Date(first);
    // start on Sunday
    start.setDate(first.getDate() - first.getDay());
    const end = new Date(last);
    // end on Saturday
    end.setDate(last.getDate() + (6 - last.getDay()));

    const weeks: { iso: string; day: number; inMonth: boolean; isToday: boolean; isSelected: boolean; availableCount: number }[][] = [];
    let week: { iso: string; day: number; inMonth: boolean; isToday: boolean; isSelected: boolean; availableCount: number }[] = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const cellDate = new Date(dt);
      const iso = this.toISO(cellDate);
      const inMonth = cellDate.getMonth() === this.calCurrent.getMonth();
      const isToday = this.toISO(new Date()) === iso;
      const isSelected = this.diaSelecionado === iso;
      const availableCount = this.countDisponibilidade(iso);
      week.push({ iso, day: cellDate.getDate(), inMonth, isToday, isSelected, availableCount });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    this.calendarWeeks = weeks;
  }

  prevMonth() {
    this.calCurrent = new Date(this.calCurrent.getFullYear(), this.calCurrent.getMonth() - 1, 1);
    // sincronizar período com o mês atual
    const inicio = this.firstDayOfMonth(this.calCurrent);
    const fim = this.lastDayOfMonth(this.calCurrent);
    this.filtroDataInicio = this.toISO(inicio);
    this.filtroDataFim = this.toISO(fim);
    this.atualizarDiasVisiveis();
    // manter dia selecionado dentro do novo período
    if (!this.diaSelecionado || this.diaSelecionado < this.filtroDataInicio || this.diaSelecionado > this.filtroDataFim) {
      this.diaSelecionado = this.filtroDataInicio;
    }
    this.buildCalendar();
  }

  nextMonth() {
    this.calCurrent = new Date(this.calCurrent.getFullYear(), this.calCurrent.getMonth() + 1, 1);
    // sincronizar período com o mês atual
    const inicio = this.firstDayOfMonth(this.calCurrent);
    const fim = this.lastDayOfMonth(this.calCurrent);
    this.filtroDataInicio = this.toISO(inicio);
    this.filtroDataFim = this.toISO(fim);
    this.atualizarDiasVisiveis();
    // manter dia selecionado dentro do novo período
    if (!this.diaSelecionado || this.diaSelecionado < this.filtroDataInicio || this.diaSelecionado > this.filtroDataFim) {
      this.diaSelecionado = this.filtroDataInicio;
    }
    this.buildCalendar();
  }

  selectCalendarDay(iso: string) {
    this.setDiaSelecionado(iso);
    this.filtroDataInicio = iso;
    this.filtroDataFim = iso;
    this.atualizarDiasVisiveis();
    this.buildCalendar();
  }

  getMesLabel(d: Date): string {
    return this.mesesPt[d.getMonth()];
  }

  private countDisponibilidade(diaISO: string): number {
    return this.slots.filter(s =>
      s.data === diaISO &&
      s.status === 'agendado' &&
      (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade) &&
      (!this.filtroProfissional || s.profissionalId === this.filtroProfissional)
    ).length;
  }

  get especialidadesFiltradas(): Especialidade[] {
    return this.especialidades;
  }

  get profissionaisFiltrados(): Profissional[] {
    return this.profissionais.filter(p =>
      (!this.filtroEspecialidade || p.especialidadeId === this.filtroEspecialidade)
    );
  }

  slotsFiltradosPorDia(dia: string): SlotHorario[] {
    return this.slots.filter(s =>
      s.data === dia &&
      (!this.filtroEspecialidade || s.especialidadeId === this.filtroEspecialidade) &&
      (!this.filtroProfissional || s.profissionalId === this.filtroProfissional)
    ).sort((a, b) => a.hora.localeCompare(b.hora));
  }

  getProfissionalNome(id: string): string {
    const p = this.profissionais.find(pro => pro.id === id);
    return p ? p.nome : '';
  }

  getEspecialidadeNome(id: string): string {
    const e = this.especialidades.find(esp => esp.id === id);
    return e ? e.nome : '';
  }

  liberar(slot: SlotHorario) {
    slot.status = 'agendado';
    slot.paciente = undefined;
    slot.canceladoEm = undefined;
  }

  onStatusChange(slot: SlotHorario, status: 'agendado' | 'confirmado' | 'cancelado' | 'faltou') {
    this.agendaService.setStatus(slot.id, status);
    if (this.detalhesSlot && this.detalhesSlot.id === slot.id) {
      this.detalhesSlot.status = status;
      this.fecharDetalhes();
    }
  }

  excluirAgendamento(slot: SlotHorario) {
    // Remover completamente o slot via serviço
    const id = slot.id;
    this.agendaService.removeSlot(id);
    if (this.detalhesSlot && this.detalhesSlot.id === id) {
      this.fecharDetalhes();
    }
    // Reconstroi a agenda para refletir imediatamente
    this.buildCalendar();
  }

  excluirSelecionados() {
    const selecionados = this.slotsFiltradosPorDia(this.diaSelecionado).filter(s => !!s.selecionado);
    if (selecionados.length === 0) {
      return;
    }
    // Abrir confirmação do sistema em modo bulk
    this.confirmMode = 'bulk';
    this.confirmCount = selecionados.length;
    this.confirmTarget = null;
    this.confirmModalOpen = true;
  }

  onSelecionadoChange(slot: SlotHorario, checked: boolean) {
    slot.selecionado = checked;
  }

  // Evita arrow function em template: usado para desabilitar o botão
  algumSelecionado(): boolean {
    return this.slotsFiltradosPorDia(this.diaSelecionado).some(s => !!s.selecionado);
  }

  solicitarExclusaoSlot(slot: SlotHorario) {
    this.confirmMode = 'single';
    this.confirmCount = 1;
    this.confirmTarget = slot;
    this.confirmModalOpen = true;
  }

  solicitarExclusaoSelecionados() {
    const count = this.slotsFiltradosPorDia(this.diaSelecionado).filter(s => !!s.selecionado).length;
    if (count <= 0) return;
    this.confirmMode = 'bulk';
    this.confirmCount = count;
    this.confirmTarget = null;
    this.confirmModalOpen = true;
  }

  confirmarExclusao() {
    if (this.confirmMode === 'single' && this.confirmTarget) {
      this.excluirAgendamento(this.confirmTarget);
    } else {
      const selecionados = this.slotsFiltradosPorDia(this.diaSelecionado).filter(s => !!s.selecionado);
      const ids = new Set(selecionados.map(s => s.id));
      this.agendaService.removeSlots(Array.from(ids));
      if (this.detalhesSlot && ids.has(this.detalhesSlot.id)) {
        this.fecharDetalhes();
      }
      this.buildCalendar();
    }
    this.confirmModalOpen = false;
    this.confirmCount = 0;
    this.confirmTarget = null;
  }

  cancelarExclusao() {
    this.confirmModalOpen = false;
    this.confirmTarget = null;
    this.confirmCount = 0;
  }

  // Detalhes
  abrirDetalhes(slot: SlotHorario) {
    this.detalhesSlot = slot;
    console.log('Detalhes do Slot:', this.detalhesSlot);
  }

  fecharDetalhes() {
    this.detalhesSlot = null;
  }

  // Modal handlers
  openNewAgendamento() {
    this.slotSelecionado = null;
    this.showFormModal = true;
  }

  openMarcar(slot: SlotHorario) {
    this.slotSelecionado = slot;
    this.showFormModal = true;
  }

  closeForm() {
    this.showFormModal = false;
    this.slotSelecionado = null;
  }

  saveAgendamento(data: AgendamentoFormData) {
    // Atualiza dados do agendamento existente ou cria novo
    if (this.slotSelecionado) {
      const slot = this.slotSelecionado;
      const atualizado: SlotHorario = {
        ...slot,
        status: 'agendado',
        paciente: data.paciente,
        profissionalId: data.profissionalId,
        especialidadeId: data.especialidadeId || slot.especialidadeId,
        hora: data.hora,
        data: data.data
      };
      this.agendaService.upsertSlot(atualizado);
    } else {
      // Novo agendamento: tenta encontrar slot para o horário; se não existir, cria um novo
      const match = this.slots.find(s => s.data === data.data && s.hora === data.hora && s.profissionalId === data.profissionalId);
      if (match && match.status === 'agendado') {
        const atualizado: SlotHorario = {
          ...match,
          status: 'agendado',
          paciente: data.paciente,
          especialidadeId: data.especialidadeId || match.especialidadeId
        };
        this.agendaService.upsertSlot(atualizado);
      } else {
        const novo: SlotHorario = {
          id: 's' + (this.slots.length + 1),
          data: data.data,
          hora: data.hora,
          profissionalId: data.profissionalId,
          especialidadeId: data.especialidadeId || (this.profissionais.find(p => p.id === data.profissionalId)?.especialidadeId || ''),
          status: 'agendado',
          paciente: data.paciente
        };
        this.agendaService.upsertSlot(novo);
      }
    }
    this.closeForm();
  }

  onPeriodoChange() {
    this.atualizarDiasVisiveis();
    // manter o dia selecionado dentro do período
    if (!this.diaSelecionado || this.diaSelecionado < this.filtroDataInicio || this.diaSelecionado > this.filtroDataFim) {
      this.diaSelecionado = this.filtroDataInicio;
    }
    this.calCurrent = new Date(this.diaSelecionado);
    this.buildCalendar();
  }

  setDiaSelecionado(dia: string) {
    this.diaSelecionado = dia;
    this.buildCalendar();
  }

  alternarViewMode(modo: 'list' | 'grid') {
    this.viewMode = modo;
  }
}