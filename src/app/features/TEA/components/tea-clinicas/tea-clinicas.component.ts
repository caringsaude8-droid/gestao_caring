import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
  dataCadastro?: string;
  cnpj?: string;
  responsavel?: string;
  website?: string;
}

interface ClinicaStats {
  total: number;
  ativas: number;
  inativas: number;
}

@Component({
  selector: 'app-tea-clinicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-clinicas.component.html',
  styleUrls: ['./tea-clinicas.component.css']
})
export class TeaClinicasComponent implements OnInit {
  searchTerm: string = '';
  selectedStatus: string = '';
  showClinicaFormModal: boolean = false;
  showClinicaDetailsModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedClinica: Clinica | null = null;
  filteredClinicas: Clinica[] = [];
  
  clinicas: Clinica[] = [
    {
      id: '1',
      nome: 'Clínica Esperança',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      telefone: '(11) 3456-7890',
      email: 'contato@clinicaesperanca.com.br',
      status: 'ativo',
      dataCadastro: '2023-04-10'
    },
    {
      id: '2',
      nome: 'Centro de Terapia Integrada',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      telefone: '(11) 2345-6789',
      email: 'contato@centroterapia.com.br',
      status: 'ativo',
      dataCadastro: '2023-05-22'
    },
    {
      id: '3',
      nome: 'Instituto Desenvolvimento',
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      telefone: '(11) 3456-7891',
      email: 'contato@instituto.com.br',
      status: 'inativo',
      dataCadastro: '2023-06-15'
    }
  ];
  
  stats: ClinicaStats = {
    total: 3,
    ativas: 2,
    inativas: 1
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterClinicas();
    this.updateStats();
  }
  
  onSearch(): void {
    this.filterClinicas();
  }

  onStatusChange(): void {
    this.filterClinicas();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.filterClinicas();
  }

  private filterClinicas(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredClinicas = this.clinicas.filter(c => {
      const matchTerm = term ? (
        c.nome.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.endereco.toLowerCase().includes(term)
      ) : true;
      const matchStatus = this.selectedStatus ? c.status === this.selectedStatus : true;
      return matchTerm && matchStatus;
    });
  }

  private updateStats(): void {
    this.stats = {
      total: this.clinicas.length,
      ativas: this.clinicas.filter(c => c.status === 'ativo').length,
      inativas: this.clinicas.filter(c => c.status === 'inativo').length
    };
  }

  getStatusClass(status: 'ativo' | 'inativo'): string {
    return status === 'ativo' ? 'status-active' : 'status-inactive';
  }

  getStatusLabel(status: 'ativo' | 'inativo'): string {
    return status === 'ativo' ? 'Ativa' : 'Inativa';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  openAddClinicaModal(): void {
    this.formMode = 'create';
    this.selectedClinica = {
      id: '',
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      status: 'ativo'
    };
    this.showClinicaFormModal = true;
  }
  
  viewClinicaDetails(clinica: Clinica): void {
    this.selectedClinica = { ...clinica };
    this.showClinicaDetailsModal = true;
  }
  
  editClinica(clinica: Clinica): void {
    this.formMode = 'edit';
    this.selectedClinica = { ...clinica };
    this.showClinicaFormModal = true;
  }

  closeClinicaFormModal(): void {
    this.showClinicaFormModal = false;
    this.selectedClinica = null;
  }

  closeClinicaDetailsModal(): void {
    this.showClinicaDetailsModal = false;
    // mantém selectedClinica para reabrir se necessário
  }

  onSaveClinica(clinica: Clinica): void {
    if (this.formMode === 'create') {
      const newId = String(this.clinicas.length + 1);
      const novo = { ...clinica, id: newId };
      this.clinicas.push(novo);
    } else if (this.formMode === 'edit' && this.selectedClinica) {
      this.clinicas = this.clinicas.map(c => c.id === this.selectedClinica!.id ? { ...this.selectedClinica!, ...clinica, id: this.selectedClinica!.id } : c);
    }
    this.updateStats();
    this.filterClinicas();
    this.closeClinicaFormModal();
  }
}