import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: number;
  nome: string;
  matriculaConvenio: string;
  convenio: string;
  situacao: 'Ativo' | 'Inativo' | 'Em Espera';
  avatar?: string; // foto do paciente
}

@Component({
  selector: 'app-tea-pesquisar-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-pesquisar-pacientes.component.html',
  styleUrls: ['./tea-pesquisar-pacientes.component.css']
})
export class TeaPesquisarPacientesComponent implements OnInit {
  // filtros
  searchTerm: string = '';
  selectedStatus: string = 'Ativos';
  matriculaTerm: string = '';

  // mock de pacientes (substituir por API futuramente)
  patients: Patient[] = [
    { id: 19, nome: 'Diogo Thallys Alexandre de Abdias Silva', matriculaConvenio: '086051562', convenio: 'PARTICULAR', situacao: 'Ativo', avatar: 'https://i.pravatar.cc/48?img=1' },
    { id: 20, nome: 'Pedro Guilherme Cavalcanti de Souza Rodrigues', matriculaConvenio: '5001050121590370', convenio: 'PARTICULAR', situacao: 'Ativo', avatar: 'https://i.pravatar.cc/48?img=2' },
    { id: 21, nome: 'Alice Magalhães', matriculaConvenio: '123456', convenio: 'CONVÊNIO X', situacao: 'Inativo' }
  ];

  filteredPatients: Patient[] = [];
  totalActiveCount: number = 0;
  totalAbaCount: number = 4; // mock

  ngOnInit(): void {
    this.applyFilters();
    this.updateCounts();
  }

  onSearch(): void { this.applyFilters(); }
  onStatusChange(): void { this.applyFilters(); }
  listar(): void { this.applyFilters(); }

  private applyFilters(): void {
    const nameTerm = this.searchTerm.trim().toLowerCase();
    const matricTerm = this.matriculaTerm.trim();
    const status = this.selectedStatus;
    this.filteredPatients = this.patients.filter(p => {
      const matchesName = !nameTerm || p.nome.toLowerCase().includes(nameTerm);
      const matchesMatric = !matricTerm || p.matriculaConvenio.includes(matricTerm);
      const matchesStatus = status === '' ||
        (status === 'Ativos' && p.situacao === 'Ativo') ||
        (status === 'Inativos' && p.situacao === 'Inativo') ||
        (status === 'Em Espera' && p.situacao === 'Em Espera');
      return matchesName && matchesMatric && matchesStatus;
    });
    this.updateCounts();
  }

  private updateCounts(): void {
    this.totalActiveCount = this.patients.filter(p => p.situacao === 'Ativo').length;
  }
}