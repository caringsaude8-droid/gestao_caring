import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../shared/components/ui/card/card';
import { ButtonComponent } from '../../../shared/components/ui/button/button';

interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  participantes?: string[];
  user_id: string;
}

interface CalendarDay {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
  events: Evento[];
}

@Component({
  selector: 'app-calendario',
  imports: [CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, ButtonComponent],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class CalendarioComponent implements OnInit {
  selectedDate = new Date();
  currentMonth = new Date();
  filtroVisibilidade: 'todos' | 'meus' = 'todos';
  loading = false;
  currentUser = { id: 'user-1' }; // Mock user

  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  calendarDays: CalendarDay[] = [];

  // Mock data
  eventos: Evento[] = [
    {
      id: '1',
      titulo: 'Reunião de equipe',
      descricao: 'Reunião semanal da equipe',
      data_inicio: new Date().toISOString(),
      data_fim: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      participantes: ['João', 'Maria'],
      user_id: 'user-1'
    },
    {
      id: '2',
      titulo: 'Apresentação do projeto',
      descricao: 'Apresentação dos resultados',
      data_inicio: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      data_fim: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      participantes: ['Carlos', 'Ana'],
      user_id: 'user-2'
    },
    {
      id: '3',
      titulo: 'Reunião com cliente',
      descricao: 'Apresentação de proposta comercial',
      data_inicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      data_fim: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      participantes: ['Pedro', 'Sofia'],
      user_id: 'user-1'
    },
    {
      id: '4',
      titulo: 'Workshop técnico',
      descricao: 'Treinamento em novas tecnologias',
      data_inicio: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      data_fim: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      participantes: ['Equipe técnica'],
      user_id: 'user-1'
    },
    {
      id: '5',
      titulo: 'Review do sprint',
      descricao: 'Revisão das entregas da sprint',
      data_inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      participantes: ['Scrum Master', 'Dev Team'],
      user_id: 'user-2'
    }
  ];

  ngOnInit() {
    this.generateCalendarDays();
  }

  get proximosEventos(): Evento[] {
    return this.eventos.filter(evento => 
      new Date(evento.data_inicio) >= new Date()
    ).slice(0, 5);
  }

  get eventosHoje(): Evento[] {
    const hoje = new Date().toISOString().split('T')[0];
    return this.eventos.filter(e => 
      e.data_inicio.split('T')[0] === hoje
    );
  }

  alterarFiltroVisibilidade(filtro: 'todos' | 'meus') {
    this.filtroVisibilidade = filtro;
  }

  isEventSharedByOthers(evento: Evento): boolean {
    return evento.user_id !== this.currentUser.id;
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  // Calendar methods
  generateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Start from the first Sunday that shows on the calendar
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const dayEvents = this.getEventsForDate(currentDate);

      days.push({
        date: currentDate.getDate(),
        fullDate: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isSameDay(currentDate, today),
        isSelected: this.isSameDay(currentDate, this.selectedDate),
        hasEvents: dayEvents.length > 0,
        events: dayEvents
      });
    }

    this.calendarDays = days;
  }

  getEventsForDate(date: Date): Evento[] {
    return this.eventos.filter(evento => {
      const eventDate = new Date(evento.data_inicio);
      return this.isSameDay(eventDate, date);
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getMonthYearDisplay(): string {
    return this.currentMonth.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  selectDate(day: CalendarDay): void {
    this.selectedDate = new Date(day.fullDate);
    this.generateCalendarDays();
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedDate = today;
    this.generateCalendarDays();
  }

  openNewEventModal(): void {
    // TODO: Implement new event modal
    alert('Modal de novo evento será implementado');
  }
}