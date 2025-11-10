import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Patient {
  id: number;
  nome: string;
  matriculaConvenio: string;
  convenio: string;
  situacao: 'Ativo' | 'Inativo' | 'Em Espera';
  fotoUrl?: string;
}

@Component({
  selector: 'app-tea-prontuario-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-prontuario-lista.component.html',
  styleUrl: './tea-prontuario-lista.component.css'
})
export class TeaProntuarioListaComponent implements OnInit {
  pageTitle = 'Prontuário Eletrônico — Selecionar Paciente';
  searchTerm = '';
  patients: Patient[] = [
    { id: 1, nome: 'Alice Henriques', matriculaConvenio: 'UNIMED123', convenio: 'UNIMED', situacao: 'Ativo' },
    { id: 2, nome: 'João Silva', matriculaConvenio: '086065162', convenio: 'PARTICULAR', situacao: 'Ativo' },
    { id: 3, nome: 'Pedro Rodrigues', matriculaConvenio: '5010150121590370', convenio: 'PARTICULAR', situacao: 'Inativo' }
  ];
  filtered: Patient[] = [...this.patients];
  // Paginação
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  paged: Patient[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.onSearch();
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filtered = this.patients.filter(p =>
      !term || p.nome.toLowerCase().includes(term) || p.matriculaConvenio.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  abrirProntuario(p: Patient) {
    this.router.navigate(['/tea/prontuario-eletronico', p.id]);
  }

  private updatePagination() {
    this.totalPages = Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paged = this.filtered.slice(start, end);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
}