import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Profissional, ProfissionalService } from '../../services/profissional.service';

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

  profissionais: Profissional[] = []; // Será populado pelo serviço

  filteredProfissionais: Profissional[] = [];

  stats: ProfissionalStats = {
    total: 0,
    ativos: 0,
    inativos: 0
  };

  constructor(
    private router: Router,
    private profissionalService: ProfissionalService // Injetar o serviço
  ) { }

  ngOnInit() {
    this.profissionalService.profissionais$.subscribe(profissionais => {
      this.profissionais = profissionais;
      this.filterProfissionais();
      this.updateStats();
    });
  }

  onSearch(): void {
    this.filterProfissionais();
  }

  onStatusChange(): void {
    this.filterProfissionais();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedEspecialidade = '';
    this.selectedStatus = '';
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

  private updateStats(): void {
    this.stats = {
      total: this.profissionais.length,
      ativos: this.profissionais.filter(p => p.status === 'ativo').length,
      inativos: this.profissionais.filter(p => p.status === 'inativo').length
    };
  }

  getStatusClass(status: 'ativo' | 'inativo'): string {
    return status === 'ativo' ? 'status-active' : 'status-inactive';
  }

  getStatusLabel(status: 'ativo' | 'inativo'): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
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
      this.profissionalService.addProfissional(profissional);
    } else {
      this.profissionalService.updateProfissional(profissional);
    }
    this.closeProfissionalFormModal();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
}