import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PainelItem {
  patient: string;
  room: string;
  professional: string;
  specialty: string;
}

@Component({
  selector: 'app-tea-painel-atendimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-painel-atendimento.component.html',
  styleUrls: ['./tea-painel-atendimento.component.css']
})
export class TeaPainelAtendimentoComponent implements OnInit {
  selectedDate: string = '';
  timeSlots: string[] = ['09:30', '10:20', '11:10', '14:00'];
  sessionsByTime: Record<string, PainelItem[]> = {};

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = today.toISOString().substring(0,10);
    this.buildMockData();
  }

  listar(): void {
    // Futura integração: buscar da API pela data
    this.buildMockData();
  }

  private buildMockData(): void {
    // Mock de dados de exemplo, mantendo o layout do projeto
    this.sessionsByTime = {
      '09:30': [
        { patient: 'Alice Magalhães', room: 'Sala 03', professional: 'Gabriela', specialty: 'Psicopedagogo' },
        { patient: 'Elizabeth Sophia', room: 'Sala 02', professional: 'Lidja', specialty: 'Psicólogo' },
        { patient: 'Gabriel', room: 'Sala 06', professional: 'Isaura', specialty: 'Nutricionista' },
        { patient: 'João Miguel', room: 'Sala 04', professional: 'Kerolayne', specialty: 'Psicomotricidade Funcional' },
        { patient: 'Nicollas Eduardo', room: 'Sala 05', professional: 'Camila', specialty: 'Terapeuta Ocupacional' },
        { patient: 'Pedro', room: 'Sala 05', professional: 'Elayne', specialty: 'Integração sensorial' },
        { patient: 'Teylon', room: 'Sala 01', professional: 'Renata', specialty: 'Fonoaudiólogo' }
      ],
      '10:20': [
        { patient: 'Alice Magalhães', room: 'Sala 01', professional: 'Renata', specialty: 'Fonoaudiólogo' },
        { patient: 'Elizabeth Sophia', room: 'Sala 04', professional: 'Kerolayne', specialty: 'Psicomotricidade Funcional' },
        { patient: 'Gabriel', room: 'Sala 08', professional: 'Geo Psi', specialty: 'Terapia ABA' },
        { patient: 'João Miguel', room: 'Sala 05', professional: 'Heleilane', specialty: 'Terapeuta Ocupacional' },
        { patient: 'Nicollas Eduardo', room: 'Sala 02', professional: 'Lidja', specialty: 'Terapia ABA' },
        { patient: 'Pedro', room: 'Sala 01', professional: 'Wedja', specialty: 'Terapia ABA' },
        { patient: 'Teylon', room: 'Sala 03', professional: 'Gabriela', specialty: 'Psicopedagogo' }
      ],
      '11:10': [
        { patient: 'Diogo Thallys', room: 'Sala 02', professional: 'Ana Carolina', specialty: 'Terapia ABA' }
      ],
      '14:00': [
        { patient: 'Lucas Pereira', room: 'Sala 06', professional: 'Marcos Antônio', specialty: 'Terapia ABA' }
      ]
    };
  }
}