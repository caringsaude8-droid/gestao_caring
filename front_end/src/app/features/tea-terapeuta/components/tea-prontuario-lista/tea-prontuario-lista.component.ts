import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  responsible: string;
  status: string;
}

@Component({
  selector: 'app-tea-terapeuta-prontuario-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tea-prontuario-lista.component.html',
  styleUrl: './tea-prontuario-lista.component.css'
})
export class TeaTerapeutaProntuarioListaComponent {
  searchTerm = '';
  patients: Patient[] = [
    { id: 1, name: 'João Silva', birthDate: '2018-05-14', responsible: 'Maria Silva', status: 'Ativo' },
    { id: 2, name: 'Ana Souza', birthDate: '2017-09-02', responsible: 'Carlos Souza', status: 'Ativo' },
    { id: 3, name: 'Pedro Santos', birthDate: '2019-01-30', responsible: 'Fernanda Santos', status: 'Inativo' },
  ];

  constructor(private router: Router) {}

  onSearch(value: string) {
    this.searchTerm = value.toLowerCase();
  }

  get filteredPatients(): Patient[] {
    const term = this.searchTerm.trim();
    if (!term) return this.patients;
    return this.patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.responsible.toLowerCase().includes(term)
    );
  }

  abrirProntuario(id: number) {
    this.router.navigate([`/tea/terapeuta/prontuario-eletronico/${id}`]);
  }

  visualizarHistorico(id: number) {
    this.router.navigate([`/tea/terapeuta/visualizar-historico/${id}`]);
  }
}