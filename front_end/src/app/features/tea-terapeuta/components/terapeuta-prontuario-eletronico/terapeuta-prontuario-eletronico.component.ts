import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Badge {
  label: string;
  color: string;
}

interface Appointment {
  tipo: string;
  profissional: string;
  dataHora: string;
}

interface CounterCard {
  label: string;
  value: number;
  action: string;
}

@Component({
  selector: 'app-terapeuta-prontuario-eletronico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terapeuta-prontuario-eletronico.component.html',
  styleUrls: ['./terapeuta-prontuario-eletronico.component.css']
})
export class TerapeutaProntuarioEletronicoComponent implements OnInit {
  pageTitle = 'Prontuário Eletrônico';
  patientId: string | null = null;

  paciente = {
    nome: 'Paciente',
    telefone: '',
    idade: 0,
    convenio: '',
    avatarUrl: ''
  };

  badges: Badge[] = [
    { label: 'DIABETES', color: '#0ea5e9' },
    { label: 'BOTOX', color: '#1d4ed8' },
    { label: 'ALERGIAS: DIPIRONA', color: '#ec4899' },
    { label: 'INTERESSE: LASER CO2', color: '#8b5cf6' }
  ];

  tabs = ['Informações Pessoais', 'Prescrições', 'Acompanhamento', 'Financeiro', 'Orçamentos', 'Marketing', 'Arquivos'];
  activeTab = this.tabs[0];

  futurosAgendamentos: Appointment[] = [
    { tipo: 'Consulta', profissional: 'Marina Dias', dataHora: '19/11/2022 às 15:00' },
    { tipo: 'Procedimento', profissional: 'Marina Dias', dataHora: '19/11/2022 às 16:00' }
  ];

  observacoes: string[] = [
    'Paciente mais sensível à dor! Agendar procedimentos com tempo extra'
  ];

  observacoesPrivadas: string[] = [
    'Paciente diabética'
  ];

  counters: CounterCard[] = [
    { label: 'Consultas', value: 31, action: 'Nova consulta' },
    { label: 'Exames', value: 2, action: 'Novo Exame' },
    { label: 'Vacinas', value: 0, action: 'Nova Vacinação' },
    { label: 'Cirurgias', value: 2, action: 'Nova Cirurgia' },
    { label: 'Procedimentos', value: 47, action: 'Voltar ao Procedimento' },
    { label: 'Cancelados / Faltas', value: 0, action: 'Ver mais' }
  ];

  historicoSearch = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    const idNum = Number(this.patientId);
    const mock = this.getMockPatient(idNum);
    if (mock) {
      this.paciente = mock;
      this.pageTitle = `Prontuário Eletrônico — ${mock.nome}`;
    } else {
      this.pageTitle = 'Prontuário Eletrônico';
    }
  }

  private getMockPatient(id: number) {
    const list = [
      { nome: 'Alice Henriques', telefone: '(51) 99107-9550', idade: 29, convenio: 'UNIMED 123', avatarUrl: '' },
      { nome: 'João Silva', telefone: '(51) 99999-9999', idade: 35, convenio: 'PARTICULAR', avatarUrl: '' },
      { nome: 'Pedro Rodrigues', telefone: '(51) 98888-8888', idade: 41, convenio: 'PARTICULAR', avatarUrl: '' }
    ];
    if (!Number.isFinite(id) || id < 1 || id > list.length) return null;
    return list[id - 1];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}