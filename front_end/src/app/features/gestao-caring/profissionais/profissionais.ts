import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProfissionalMedico {
  id?: string;
  nome: string;
  crm: string;
  cpf: string;
  especialidade: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
  observacoes?: string;
  dataCadastro?: Date;
  dataUltimaAtualizacao?: Date;
}

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profissionais.html',
  styleUrls: ['./profissionais.css']
})
export class ProfissionaisComponent {
  profissionais: ProfissionalMedico[] = [
    {
      id: '1',
      nome: 'Dr. João Silva',
      crm: '12345/SP',
      cpf: '123.456.789-00',
      especialidade: 'cardiologia',
      email: 'joao.silva@hospital.com',
      telefone: '(11) 99999-1234',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      ativo: true,
      observacoes: 'Especialista em cardiologia intervencionista',
      dataCadastro: new Date('2024-01-15'),
      dataUltimaAtualizacao: new Date('2024-01-15')
    },
    {
      id: '2',
      nome: 'Dra. Maria Santos',
      crm: '67890/SP',
      cpf: '987.654.321-00',
      especialidade: 'pediatria',
      email: 'maria.santos@clinica.com',
      telefone: '(11) 88888-5678',
      endereco: 'Av. Paulista, 1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100',
      ativo: true,
      observacoes: 'Especializada em neonatologia',
      dataCadastro: new Date('2024-02-20'),
      dataUltimaAtualizacao: new Date('2024-02-20')
    },
    {
      id: '3',
      nome: 'Dr. Pedro Costa',
      crm: '11111/RJ',
      cpf: '456.789.123-00',
      especialidade: 'ortopedia',
      email: 'pedro.costa@ortopedia.com',
      telefone: '(21) 77777-9012',
      endereco: 'Rua Copacabana, 456',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '22070-010',
      ativo: false,
      observacoes: 'Cirurgia de joelho e quadril',
      dataCadastro: new Date('2023-12-10'),
      dataUltimaAtualizacao: new Date('2024-01-05')
    },
    {
      id: '4',
      nome: 'Dra. Ana Lima',
      crm: '22222/MG',
      cpf: '789.123.456-00',
      especialidade: 'ginecologia',
      email: 'ana.lima@gineco.com',
      telefone: '(31) 66666-3456',
      endereco: 'Rua Savassi, 789',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      cep: '30112-000',
      ativo: true,
      observacoes: 'Especialista em reprodução humana',
      dataCadastro: new Date('2024-03-01'),
      dataUltimaAtualizacao: new Date('2024-03-15')
    }
  ];

  showProfessionalForm = false;
  newProfessional: ProfissionalMedico = this.createEmptyProfessional();

  especialidades = [
    { value: 'cardiologia', label: 'Cardiologia' },
    { value: 'neurologia', label: 'Neurologia' },
    { value: 'ortopedia', label: 'Ortopedia' },
    { value: 'pediatria', label: 'Pediatria' },
    { value: 'ginecologia', label: 'Ginecologia' },
    { value: 'dermatologia', label: 'Dermatologia' },
    { value: 'psiquiatria', label: 'Psiquiatria' },
    { value: 'oftalmologia', label: 'Oftalmologia' },
    { value: 'urologia', label: 'Urologia' },
    { value: 'clinica_geral', label: 'Clínica Geral' }
  ];

  createEmptyProfessional(): ProfissionalMedico {
    return {
      nome: '',
      crm: '',
      cpf: '',
      especialidade: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      ativo: true,
      observacoes: ''
    };
  }

  openProfessionalForm(): void {
    this.newProfessional = this.createEmptyProfessional();
    this.showProfessionalForm = true;
  }

  closeProfessionalForm(): void {
    this.showProfessionalForm = false;
    this.newProfessional = this.createEmptyProfessional();
  }

  createProfessional(): void {
    if (!this.newProfessional.nome || !this.newProfessional.crm) {
      alert('Por favor, preencha pelo menos o nome e CRM do profissional.');
      return;
    }

    // Verificar se CRM já existe
    const crmExists = this.profissionais.some(p => p.crm === this.newProfessional.crm);
    if (crmExists) {
      alert('Já existe um profissional cadastrado com este CRM.');
      return;
    }

    // Criar novo profissional
    const novoProfissional: ProfissionalMedico = {
      ...this.newProfessional,
      id: this.generateId(),
      dataCadastro: new Date(),
      dataUltimaAtualizacao: new Date()
    };

    this.profissionais.unshift(novoProfissional);
    this.closeProfessionalForm();
    
    console.log('Novo profissional criado:', novoProfissional);
  }

  viewProfessional(profissional: ProfissionalMedico): void {
    const especialidadeLabel = this.especialidades.find(e => e.value === profissional.especialidade)?.label || profissional.especialidade;
    
    alert(`
📋 INFORMAÇÕES DO PROFISSIONAL

👤 Nome: ${profissional.nome}
🏥 CRM: ${profissional.crm}
📄 CPF: ${profissional.cpf}
🩺 Especialidade: ${especialidadeLabel}

📧 Email: ${profissional.email}
📱 Telefone: ${profissional.telefone}

📍 Endereço: ${profissional.endereco}
🏙️ Cidade: ${profissional.cidade}/${profissional.estado}
📮 CEP: ${profissional.cep}

📊 Status: ${profissional.ativo ? 'Ativo' : 'Inativo'}
📝 Observações: ${profissional.observacoes || 'Nenhuma observação'}

📅 Cadastro: ${profissional.dataCadastro?.toLocaleDateString('pt-BR')}
🔄 Última atualização: ${profissional.dataUltimaAtualizacao?.toLocaleDateString('pt-BR')}
    `);
  }

  editProfessional(profissional: ProfissionalMedico): void {
    this.newProfessional = { ...profissional };
    this.showProfessionalForm = true;
  }

  deleteProfessional(profissional: ProfissionalMedico): void {
    const confirmar = confirm(`Tem certeza que deseja excluir o profissional ${profissional.nome}?`);
    
    if (confirmar) {
      const index = this.profissionais.findIndex(p => p.id === profissional.id);
      if (index > -1) {
        this.profissionais.splice(index, 1);
        console.log('Profissional removido:', profissional.nome);
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Métodos auxiliares para formatação
  getEspecialidadeLabel(especialidade: string): string {
    return this.especialidades.find(e => e.value === especialidade)?.label || especialidade;
  }

  formatPhoneNumber(phone: string): string {
    // Remove caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    // Formatar como (11) 99999-9999
    if (numbers.length === 11) {
      return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 5)}-${numbers.substr(7, 4)}`;
    }
    
    return phone;
  }

  formatCPF(cpf: string): string {
    // Remove caracteres não numéricos
    const numbers = cpf.replace(/\D/g, '');
    
    // Formatar como 000.000.000-00
    if (numbers.length === 11) {
      return `${numbers.substr(0, 3)}.${numbers.substr(3, 3)}.${numbers.substr(6, 3)}-${numbers.substr(9, 2)}`;
    }
    
    return cpf;
  }

  formatCEP(cep: string): string {
    // Remove caracteres não numéricos
    const numbers = cep.replace(/\D/g, '');
    
    // Formatar como 00000-000
    if (numbers.length === 8) {
      return `${numbers.substr(0, 5)}-${numbers.substr(5, 3)}`;
    }
    
    return cep;
  }
}