import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

export interface Paciente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf: string;
  dataNascimento: string;
  convenio?: string;
  numeroCartao?: string;
  status: 'ativo' | 'inativo';
  data_cadastro: string;
}

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css',
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = 'todos';
  showPatientForm = false;

  ngOnInit() {
    this.loadPacientes();
  }

  loadPacientes() {
    this.loading = true;
    
    // Mock data
    this.pacientes = [
      {
        id: '1',
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        telefone: '(11) 99999-8888',
        cpf: '123.456.789-00',
        dataNascimento: '1985-03-15',
        convenio: 'Unimed',
        numeroCartao: '123456789',
        status: 'ativo',
        data_cadastro: '2025-01-15'
      },
      {
        id: '2',
        nome: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        telefone: '(11) 88888-7777',
        cpf: '987.654.321-00',
        dataNascimento: '1990-07-22',
        convenio: 'SulAmérica',
        numeroCartao: '987654321',
        status: 'ativo',
        data_cadastro: '2025-02-10'
      },
      {
        id: '3',
        nome: 'Carlos Eduardo Lima',
        email: 'carlos.lima@email.com',
        telefone: '(11) 77777-6666',
        cpf: '456.789.123-00',
        dataNascimento: '1978-12-08',
        convenio: 'Bradesco Saúde',
        numeroCartao: '456789123',
        status: 'ativo',
        data_cadastro: '2025-01-30'
      },
      {
        id: '4',
        nome: 'Ana Paula Ferreira',
        email: 'ana.ferreira@email.com',
        telefone: '(11) 66666-5555',
        cpf: '321.654.987-00',
        dataNascimento: '1992-05-14',
        convenio: 'Particular',
        numeroCartao: '',
        status: 'inativo',
        data_cadastro: '2025-01-20'
      }
    ];

    this.loading = false;
  }

  get filteredPacientes() {
    return this.pacientes.filter(paciente => {
      const matchesSearch = paciente.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'todos' || paciente.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  get pacientesAtivos() {
    return this.pacientes.filter(p => p.status === 'ativo').length;
  }

  get pacientesInativos() {
    return this.pacientes.filter(p => p.status === 'inativo').length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  getStatusClass(status: string): string {
    return status === 'ativo' ? 'badge-success' : 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  }

  openPatientForm() {
    this.showPatientForm = true;
  }

  closePatientForm() {
    this.showPatientForm = false;
    this.resetPatientForm();
  }

  editPatient(paciente: Paciente) {
    console.log('Editar paciente:', paciente);
  }

  deletePatient(paciente: Paciente) {
    if (confirm(`Tem certeza que deseja excluir o paciente "${paciente.nome}"?`)) {
      this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
      console.log('Paciente excluído:', paciente.nome);
    }
  }

  toggleStatus(paciente: Paciente) {
    paciente.status = paciente.status === 'ativo' ? 'inativo' : 'ativo';
    console.log('Status alterado:', paciente.nome, paciente.status);
  }

  // Propriedades para o formulário
  newPatient = {
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: 'SP',
    cep: '',
    convenio: '',
    numeroCartao: '',
    nomeResponsavel: '',
    telefoneResponsavel: '',
    status: 'ativo',
    observacoes: '',
    notificarEmail: false
  };

  // Lista de convênios para o select
  convenios = [
    { id: 'particular', nome: 'Particular' },
    { id: 'unimed', nome: 'Unimed' },
    { id: 'sulamerica', nome: 'SulAmérica' },
    { id: 'bradesco', nome: 'Bradesco Saúde' },
    { id: 'amil', nome: 'Amil' },
    { id: 'notredame', nome: 'NotreDame Intermédica' },
    { id: 'hapvida', nome: 'Hapvida' }
  ];

  createPatient() {
    if (!this.newPatient.nome.trim() || !this.newPatient.cpf.trim()) {
      return;
    }

    // Criar novo paciente
    const novoPaciente: Paciente = {
      id: Date.now().toString(),
      nome: this.newPatient.nome,
      email: this.newPatient.email,
      telefone: this.newPatient.telefone,
      cpf: this.newPatient.cpf,
      dataNascimento: this.newPatient.dataNascimento,
      convenio: this.convenios.find(c => c.id === this.newPatient.convenio)?.nome || 'Particular',
      numeroCartao: this.newPatient.numeroCartao,
      status: this.newPatient.status as any,
      data_cadastro: new Date().toISOString()
    };

    // Adicionar à lista de pacientes
    this.pacientes.push(novoPaciente);
    
    // Resetar formulário
    this.resetPatientForm();
    
    // Fechar modal
    this.closePatientForm();

    // Simular notificação (em produção seria um toast/notification)
    console.log('Paciente criado com sucesso:', novoPaciente);
    if (this.newPatient.notificarEmail) {
      console.log('Email de boas-vindas enviado para:', this.newPatient.email);
    }
  }

  resetPatientForm() {
    this.newPatient = {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      convenio: '',
      numeroCartao: '',
      nomeResponsavel: '',
      telefoneResponsavel: '',
      status: 'ativo',
      observacoes: '',
      notificarEmail: false
    };
  }
}