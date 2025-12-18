
// Interface local para Clinica (ajuste conforme necessário)
export interface Clinica {
  id?: number;
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  status?: string;
  // Adicione outros campos conforme necessário
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';


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
  clinicas: Clinica[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadClinicas();
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
        c.email?.toLowerCase().includes(term) ||
        c.endereco?.toLowerCase().includes(term)
      ) : true;
      const matchStatus = this.selectedStatus ? c.status === this.selectedStatus : true;
      return matchTerm && matchStatus;
    });
  }

  openAddClinicaModal(): void {
    this.formMode = 'create';
    this.selectedClinica = {
      id: undefined, nome: '', endereco: '', telefone: '', email: '', status: 'ativo', cnpj: ''
    };
    this.showClinicaFormModal = true;
  }

  editClinica(clinica: Clinica): void {
    this.formMode = 'edit';
    this.selectedClinica = { ...clinica };
    this.showClinicaFormModal = true;
  }

  viewClinicaDetails(clinica: Clinica): void {
    this.selectedClinica = { ...clinica };
    this.showClinicaDetailsModal = true;
  }

  closeClinicaFormModal(): void {
    this.showClinicaFormModal = false;
    this.selectedClinica = null;
  }

  closeClinicaDetailsModal(): void {
    this.showClinicaDetailsModal = false;
    // mantém selectedClinica para reabrir se necessário
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

  loadClinicas(): void {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) } : {};
    this.http.get<any[]>('http://localhost:8081/api/v1/clinicas', headers).subscribe({
      next: (data: any[]) => {
        this.clinicas = data.map((c: any) => ({
          id: c.id,
          nome: c.nome,
          endereco: c.endereco,
          telefone: c.telefone,
          email: c.email,
          status: c.status === 1 ? 'ativo' : 'inativo',
          dataCadastro: c.dataCadastro,
          cnpj: c.cnpj,
          responsavel: c.responsavel,
          website: c.website
        }));
        this.filterClinicas();
      },
      error: (err) => {
        console.error('Erro ao carregar clínicas:', err);
      }
    });
  }

  onSaveClinica(clinica: Clinica): void {
    // Salvar lógica (POST/PUT) aqui
    this.closeClinicaFormModal();
  }
}
