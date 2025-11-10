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
  selector: 'app-tea-calendario-por-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-calendario-por-paciente.component.html',
  styleUrls: ['./tea-calendario-por-paciente.component.css']
})
export class TeaCalendarioPorPacienteComponent implements OnInit {
  // Controles de semana e paciente
  selectedDate: string = new Date().toISOString().substring(0,10); // yyyy-MM-dd
  selectedPatient: string = '';
  patients: string[] = [];

  // Estrutura da semana e horários
  weekDays: { label: string; date: Date }[] = [];
  timeSlots: string[] = ['14:00', '14:50', '15:40', '16:30'];

  // Dados mock (inspirados no print e consistentes com projeto)
  appointments: WeeklyAppointment[] = [
    { date: '2025-10-27', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Geo Psi', therapy: 'Terapia ABA' },
    { date: '2025-10-28', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-29', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-30', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { date: '2025-10-31', time: '14:00', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Ana Carolina', therapy: 'Terapia ABA' },

    { date: '2025-10-28', time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Marcos Antônio', therapy: 'Terapia ABA' },
    { date: '2025-10-29', time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Isaura', therapy: 'Nutricionista' },
    { date: '2025-10-30', time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Wylly', therapy: 'Psicomotricidade Funcional' },
    { date: '2025-10-31', time: '14:50', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },

    { date: '2025-10-28', time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Ana', therapy: 'Fonoaudiólogo' },
    { date: '2025-10-29', time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Lidja', therapy: 'Psicólogo' },
    { date: '2025-10-30', time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Aldair Ivo', therapy: 'Psicopedagogo' },
    { date: '2025-10-31', time: '15:40', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Geo Psi', therapy: 'Terapia ABA' },

    { date: '2025-10-28', time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Elayne', therapy: 'Terapeuta Ocupacional' },
    { date: '2025-10-29', time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Geo Psi', therapy: 'Terapia ABA' },
    { date: '2025-10-30', time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Ana Carolina', therapy: 'Terapia ABA' },
    { date: '2025-10-31', time: '16:30', patient: 'Diogo Thallys Alexandre de Abdias Silva', professional: 'Lidja', therapy: 'Psicólogo' },
  ];

  ngOnInit(): void {
    // Popular pacientes únicos
    this.patients = Array.from(new Set(this.appointments.map(a => a.patient))).sort();
    this.selectedPatient = this.patients[0] || '';
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

  getCellContent(day: Date, time: string): { professional: string; therapy: string } | null {
    const dateStr = day.toISOString().substring(0,10);
    const found = this.appointments.find(a => a.date === dateStr && a.time === time && a.patient === this.selectedPatient);
    return found ? { professional: found.professional, therapy: found.therapy } : null;
  }
}