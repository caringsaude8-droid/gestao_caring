import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  ativo: boolean;
}

@Component({
  selector: 'app-empresas',
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas.html',
  styleUrl: './empresas.css',
})
export class EmpresasComponent {
  loading = false;
  isDialogOpen = false;
  editingCompany: Empresa | null = null;
  
  formData = {
    nome: '',
    cnpj: '',
    email: '',
    telefone: '',
    endereco: ''
  };

  // Mock data - substitua pela integração com seu serviço
  empresas: Empresa[] = [
    {
      id: '1',
      nome: 'Tech Solutions Ltda',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techsolutions.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Tecnologias, 123 - São Paulo/SP',
      ativo: true
    },
    {
      id: '2',
      nome: 'Inovação Digital',
      cnpj: '98.765.432/0001-10',
      email: 'info@inovacaodigital.com',
      telefone: '(21) 88888-8888',
      endereco: 'Av. Digital, 456 - Rio de Janeiro/RJ',
      ativo: true
    },
    {
      id: '3',
      nome: 'StartUp Brasil',
      cnpj: '11.222.333/0001-44',
      email: 'hello@startupbrasil.com',
      telefone: '(31) 77777-7777',
      endereco: 'Rua Empreendedora, 789 - Belo Horizonte/MG',
      ativo: true
    }
  ];

  resetForm(): void {
    this.formData = {
      nome: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: ''
    };
    this.editingCompany = null;
  }

  openDialog(): void {
    this.resetForm();
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    
    if (!this.formData.nome.trim()) {
      alert('Nome da empresa é obrigatório');
      return;
    }

    if (this.editingCompany) {
      // Update existing company
      const index = this.empresas.findIndex(e => e.id === this.editingCompany!.id);
      if (index !== -1) {
        this.empresas[index] = {
          ...this.editingCompany,
          ...this.formData
        };
      }
    } else {
      // Create new company
      const newCompany: Empresa = {
        id: Date.now().toString(),
        ...this.formData,
        ativo: true
      };
      this.empresas.push(newCompany);
    }

    this.closeDialog();
  }

  handleEdit(company: Empresa): void {
    this.editingCompany = company;
    this.formData = {
      nome: company.nome || '',
      cnpj: company.cnpj || '',
      email: company.email || '',
      telefone: company.telefone || '',
      endereco: company.endereco || ''
    };
    this.isDialogOpen = true;
  }

  handleDelete(id: string, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir a empresa "${nome}"?`)) {
      this.empresas = this.empresas.filter(e => e.id !== id);
    }
  }

  getDisplayValue(value?: string): string {
    return value || '-';
  }
}