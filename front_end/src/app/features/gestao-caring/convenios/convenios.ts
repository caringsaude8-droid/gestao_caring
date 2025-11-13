import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

export interface Convenio {
  id: string;
  nome: string;
  codigo?: string;
  cnpj?: string;
  tabelaConvenio: 'Padrão' | 'Especial';
  tipoCobranca: 'Plano de Saúde' | 'Particular';
  validade?: string;
  dataFaturamento?: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

@Component({
  selector: 'app-convenios',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './convenios.html',
  styleUrl: './convenios.css',
})
export class ConveniosComponent implements OnInit {
  convenios: Convenio[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = 'todos';
  showForm = false;

  ngOnInit() {
    this.loadConvenios();
  }

  loadConvenios() {
    this.loading = true;
    // Mock inicial
    this.convenios = [
      {
        id: '1',
        nome: 'Unimed',
        codigo: 'UNM-001',
        tabelaConvenio: 'Padrão',
        tipoCobranca: 'Plano de Saúde',
        validade: '2025-12-31',
        status: 'ativo'
      },
      {
        id: '2',
        nome: 'SulAmérica',
        codigo: 'SLA-002',
        tabelaConvenio: 'Especial',
        tipoCobranca: 'Plano de Saúde',
        validade: '2026-06-30',
        status: 'ativo'
      },
      {
        id: '3',
        nome: 'Particular',
        codigo: 'PAR-000',
        tabelaConvenio: 'Padrão',
        tipoCobranca: 'Particular',
        status: 'ativo'
      }
    ];
    this.loading = false;
  }

  get filteredConvenios() {
    return this.convenios.filter(conv => {
      const matchesSearch = conv.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) || (conv.codigo || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'todos' || conv.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  get conveniosAtivos() { return this.convenios.filter(c => c.status === 'ativo').length; }
  get conveniosInativos() { return this.convenios.filter(c => c.status === 'inativo').length; }

  getStatusClass(status: string): string {
    return status === 'ativo' ? 'badge-success' : 'badge-secondary';
  }
  getStatusLabel(status: string): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  }

  openForm() { this.showForm = true; }
  closeForm() { this.showForm = false; this.resetForm(); }

  // Form model
  newConvenio: Partial<Convenio> = {
    nome: '',
    codigo: '',
    cnpj: '',
    tabelaConvenio: 'Padrão',
    tipoCobranca: 'Plano de Saúde',
    validade: '',
    dataFaturamento: '',
    status: 'ativo',
    observacoes: ''
  };

  createConvenio() {
    if (!this.newConvenio.nome?.trim()) return;
    const created: Convenio = {
      id: Date.now().toString(),
      nome: this.newConvenio.nome!,
      codigo: this.newConvenio.codigo || '',
      cnpj: this.newConvenio.cnpj || '',
      tabelaConvenio: (this.newConvenio.tabelaConvenio || 'Padrão') as any,
      tipoCobranca: (this.newConvenio.tipoCobranca || 'Plano de Saúde') as any,
      validade: this.newConvenio.validade || '',
      dataFaturamento: this.newConvenio.dataFaturamento || '',
      status: (this.newConvenio.status || 'ativo') as any,
      observacoes: this.newConvenio.observacoes || ''
    };
    this.convenios.push(created);
    this.resetForm();
    this.closeForm();
  }

  toggleStatus(conv: Convenio) {
    conv.status = conv.status === 'ativo' ? 'inativo' : 'ativo';
  }

  deleteConvenio(conv: Convenio) {
    this.convenios = this.convenios.filter(c => c.id !== conv.id);
  }

  resetForm() {
    this.newConvenio = {
      nome: '',
      codigo: '',
      cnpj: '',
      tabelaConvenio: 'Padrão',
      tipoCobranca: 'Plano de Saúde',
      validade: '',
      dataFaturamento: '',
      status: 'ativo',
      observacoes: ''
    };
  }
}