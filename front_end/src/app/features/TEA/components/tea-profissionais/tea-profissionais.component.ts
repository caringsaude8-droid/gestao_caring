import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  dataCadastro?: string;
  cpf?: string;
  crm?: string;
  endereco?: string;
}

interface ProfissionalStats {
  total: number;
  ativos: number;
  inativos: number;
}

@Component({
  selector: 'app-tea-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-profissionais.component.html',
  styleUrls: ['./tea-profissionais.component.css']
})
export class TeaProfissionaisComponent implements OnInit {
  searchTerm: string = '';
  selectedEspecialidade: string = '';
  selectedStatus: string = '';
  showProfissionalFormModal: boolean = false;
  showProfissionalDetailsModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedProfissional: Profissional | null = null;
  
  profissionais: Profissional[] = [
    {
      id: '1',
      nome: 'Dra. Maria Silva',
      especialidade: 'Psicóloga',
      email: 'maria.silva@exemplo.com',
      telefone: '(11) 98765-4321',
      status: 'ativo',
      dataCadastro: '2023-05-15',
      cpf: '123.456.789-00',
      crm: 'CRP 06/12345',
      endereco: 'Rua das Flores, 123 - São Paulo, SP'
    },
    {
      id: '2',
      nome: 'Dr. João Santos',
      especialidade: 'Fonoaudiólogo',
      email: 'joao.santos@exemplo.com',
      telefone: '(11) 91234-5678',
      status: 'ativo',
      dataCadastro: '2023-06-20',
      cpf: '987.654.321-00',
      crm: 'CRFa 2-12345',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP'
    },
    {
      id: '3',
      nome: 'Dra. Ana Oliveira',
      especialidade: 'Terapeuta Ocupacional',
      email: 'ana.oliveira@exemplo.com',
      telefone: '(11) 99876-5432',
      status: 'inativo',
      dataCadastro: '2023-07-10',
      cpf: '456.789.123-00',
      crm: 'CREFITO 3-12345',
      endereco: 'Rua Augusta, 500 - São Paulo, SP'
    }
  ];
  
  filteredProfissionais: Profissional[] = [];

  stats: ProfissionalStats = {
    total: 3,
    ativos: 2,
    inativos: 1
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredProfissionais = [...this.profissionais];
  }
  
  onSearch(): void {
    this.filterProfissionais();
  }

  onStatusChange(): void {
    this.filterProfissionais();
  }

  onEspecialidadeChange(): void {
    this.filterProfissionais();
  }

  private filterProfissionais(): void {
    this.filteredProfissionais = this.profissionais.filter(profissional => {
      const matchesSearch = !this.searchTerm || 
        profissional.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        profissional.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        profissional.especialidade.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.selectedStatus || profissional.status === this.selectedStatus;
      const matchesEspecialidade = !this.selectedEspecialidade || profissional.especialidade === this.selectedEspecialidade;
      return matchesSearch && matchesStatus && matchesEspecialidade;
    });
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEspecialidade = '';
    this.selectedStatus = '';
    this.filteredProfissionais = [...this.profissionais];
  }
  
  getStatusClass(status: string): string {
    if (status === 'ativo') return 'status-active';
    if (status === 'inativo') return 'status-inactive';
    return '';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'ATIVO',
      'inativo': 'INATIVO'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
  
  openAddProfissionalModal(): void {
    this.selectedProfissional = null;
    this.formMode = 'create';
    this.showProfissionalFormModal = true;
  }
  
  viewProfissionalDetails(profissional: Profissional): void {
    this.selectedProfissional = profissional;
    this.showProfissionalDetailsModal = true;
  }
  
  editProfissional(profissional: Profissional): void {
    this.selectedProfissional = profissional;
    this.formMode = 'edit';
    this.showProfissionalFormModal = true;
  }

  closeProfissionalFormModal(): void {
    this.showProfissionalFormModal = false;
  }

  closeProfissionalDetailsModal(): void {
    this.showProfissionalDetailsModal = false;
  }

  onSaveProfissional(profissional: Profissional): void {
    if (this.formMode === 'create') {
      // Adicionar novo profissional
      const newProfissional = {
        ...profissional,
        id: (this.profissionais.length + 1).toString(),
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      this.profissionais.push(newProfissional);
    } else {
      // Atualizar profissional existente
      const index = this.profissionais.findIndex(p => p.id === profissional.id);
      if (index !== -1) {
        this.profissionais[index] = profissional;
      }
    }
    
    // Atualizar estatísticas
    this.stats = {
      total: this.profissionais.length,
      ativos: this.profissionais.filter(p => p.status === 'ativo').length,
      inativos: this.profissionais.filter(p => p.status === 'inativo').length
    };
    
    this.filteredProfissionais = [...this.profissionais];
    this.closeProfissionalFormModal();
  }
}