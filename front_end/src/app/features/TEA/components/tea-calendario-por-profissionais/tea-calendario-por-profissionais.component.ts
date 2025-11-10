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
  selector: 'app-tea-calendario-por-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario-por-profissionais.component.html',
  styleUrls: ['./tea-calendario-por-profissionais.component.css']
})
export class TeaCalendarioPorProfissionaisComponent implements OnInit {
  // Controles de semana e profissional
  selectedDate: string = new Date().toISOString().substring(0,10); // yyyy-MM-dd
  selectedProfessional: string = '';
  professionals: string[] = [];

  // Estrutura da semana e horários
  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = ['14:00', '14:50', '15:40', '16:30'];

  // Dados mock: mesmo layout do 'Por Paciente', filtrando por profissional
  appointments: WeeklyAppointment[] = [
    { date: '2025-10-27', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Geo Psi', therapy: 'Terapia ABA' },
    { date: '2025-10-28', time: '14:00', patient: 'Carlos Souza', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-29', time: '14:00', patient: 'Ana Júlia', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-30', time: '14:00', patient: 'Maria Santos', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { date: '2025-10-31', time: '14:00', patient: 'Pedro Lima', professional: 'Ana Carolina', therapy: 'Terapia ABA' },

    { date: '2025-10-28', time: '14:50', patient: 'Maria Santos', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-29', time: '14:50', patient: 'Pedro Lima', professional: 'Isaura', therapy: 'Nutricionista' },
    { date: '2025-10-30', time: '14:50', patient: 'Ana Júlia', professional: 'Wylly', therapy: 'Psicomotricidade Funcional' },
    { date: '2025-10-31', time: '14:50', patient: 'Carlos Souza', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },

    { date: '2025-10-28', time: '15:40', patient: 'João Almeida', professional: 'Ana', therapy: 'Fonoaudiólogo' },
    { date: '2025-10-29', time: '15:40', patient: 'Carla Souza', professional: 'Lidja', therapy: 'Psicólogo' },
    { date: '2025-10-30', time: '15:40', patient: 'Maria Santos', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },
    { date: '2025-10-31', time: '15:40', patient: 'Pedro Lima', professional: 'Geo Psi', therapy: 'Terapia ABA' },

    { date: '2025-10-28', time: '16:30', patient: 'Diogo Thallys', professional: 'Elayne', therapy: 'Terapeuta Ocupacional' },
    { date: '2025-10-29', time: '16:30', patient: 'Maria Santos', professional: 'Geo Psi', therapy: 'Terapia ABA' },
    { date: '2025-10-30', time: '16:30', patient: 'João Almeida', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { date: '2025-10-31', time: '16:30', patient: 'Carla Souza', professional: 'Lidja', therapy: 'Psicólogo' },
  ];

  ngOnInit(): void {
    // Popular profissionais únicos
    this.professionals = Array.from(new Set(this.appointments.map(a => a.professional))).sort();
    this.selectedProfessional = this.professionals[0] || '';
    this.buildWeekFromSelectedDate();
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
  }

  nextWeek(): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 7);
    this.selectedDate = d.toISOString().substring(0,10);
    this.buildWeekFromSelectedDate();
  }

  listar(): void {
    // Para futura integração com API; no mock apenas reconstrói a semana
    this.buildWeekFromSelectedDate();
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
    return found ? { patient: found.patient, therapy: found.therapy } : null;
  }
}