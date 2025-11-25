
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario.service';
import { TerapeutaService } from '../../services/terapeuta.service';
import { TeaUserFormModalComponent, TeaUser } from './tea-user-form-modal/tea-user-form-modal.component';
import { TeaUserDetailsModalComponent } from './tea-user-details-modal/tea-user-details-modal.component';

interface UserStats {
  total: number;
  ativos: number;
  inativos: number;
}

@Component({
  selector: 'app-tea-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TeaUserFormModalComponent, TeaUserDetailsModalComponent],
  templateUrl: './tea-usuarios.component.html',
  styleUrls: ['./tea-usuarios.component.css']
})
export class TeaUsuariosComponent implements OnInit {
    isLoading: boolean = false;
  searchTerm: string = '';
  selectedPerfil: string = '';
  selectedStatus: string = '';
  showUserDetailsModal: boolean = false;
  showUserFormModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedUser: TeaUser | null = null;
  
  users: TeaUser[] = [];

  filteredUsers: TeaUser[] = [];

  private usuarioService = inject(UsuarioService);
  private terapeutaService = inject(TerapeutaService);

  constructor() {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    const selectedClinicaId = localStorage.getItem('selectedClinica');
    forkJoin({
      usuarios: this.usuarioService.getAll(selectedClinicaId ? String(selectedClinicaId) : undefined),
      terapeutas: this.terapeutaService.getTerapeutas(selectedClinicaId || undefined)
    }).subscribe({
      next: ({ usuarios, terapeutas }) => {
        const mappedUsers = (usuarios || [])
          .filter(u => !u.perfil || ['user', 'USER', 'terapeuta', 'TERAPEUTA'].includes(u.perfil))
          .map(u => ({
            ...u,
            id: u.id ? u.id.toString() : '',
            perfil: (u.perfil && u.perfil.toLowerCase() === 'terapeuta') ? 'terapeuta' : 'user',
            clinicaId: (u as any)['clinicaId'] ?? (u as any)['clinica_id'] ?? (u as any)['teaCliId'] ?? null,
            status: u.status === 1 || u.status === true ? 'ativo' : u.status === 0 || u.status === false ? 'inativo' : (u.status || 'ativo'),
          }));
        const mappedTerapeutas = (terapeutas || [])
          .map(t => {
            let status: string = 'ativo';
            if (typeof t.status === 'number') {
              status = t.status === 1 ? 'ativo' : 'inativo';
            } else if (typeof t.status === 'boolean') {
              status = t.status ? 'ativo' : 'inativo';
            } else if (typeof t.status === 'string') {
              status = t.status;
            }
            return {
              id: t.id ? t.id.toString() : '',
              nome: t.nome,
              email: t.email,
              cpf: t.cpf,
              telefone: t.telefone,
              perfil: 'terapeuta',
              clinicaId: (t as any)['clinicaId'] ?? (t as any)['clinica_id'] ?? null,
              status,
              especialidades: t.especialidade ? [t.especialidade] : [],
              permissoes: {},
              dataUltimoAcesso: '',
              dataCriacao: '',
            };
          });
        this.users = [...mappedUsers, ...mappedTerapeutas];
        this.filterUsers();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  get stats(): UserStats {
    return {
      total: this.users.length,
      ativos: this.users.filter(u => u.status === 'ativo').length,
      inativos: this.users.filter(u => u.status === 'inativo').length
    };
  }

  onSearch(): void {
    this.filterUsers();
  }

  onPerfilChange(): void {
    this.filterUsers();
  }

  onStatusChange(): void {
    this.filterUsers();
  }

  private filterUsers(): void {
    const selectedClinicaId = localStorage.getItem('selectedClinica');
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Comparação case-insensitive para perfil e status
      const matchesPerfil = !this.selectedPerfil || (user.perfil && String(user.perfil).toLowerCase() === this.selectedPerfil.toLowerCase());
    
      let userStatusStr = user.status;
      if (typeof user.status === 'boolean') {
        userStatusStr = user.status ? 'ativo' : 'inativo';
      }
      const matchesStatus = !this.selectedStatus || (userStatusStr && String(userStatusStr).toLowerCase() === this.selectedStatus.toLowerCase());
      const matchesClinica = !selectedClinicaId || String(user.clinicaId) === String(selectedClinicaId);

      return matchesSearch && matchesPerfil && matchesStatus && matchesClinica;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPerfil = '';
    this.selectedStatus = '';
    this.filteredUsers = [...this.users];
  }

  getPerfilLabel(perfil: string): string {
    const labels: { [key: string]: string } = {
      'terapeuta': 'Terapeuta',
      'user': 'Usuário'
    };
    return labels[perfil] || perfil;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'inativo': 'Inativo'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getPerfilClass(perfil: string): string {
    return `perfil-${perfil}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  getDaysAgo(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays === 0) return 'Hoje';
    return `${diffDays} dias atrás`;
  }

  openAddUserModal(): void {
    this.formMode = 'create';
    this.selectedUser = null;
    this.showUserFormModal = true;
  }

  editUser(user: TeaUser): void {
    this.formMode = 'edit';
    const closeAndSet = (data: any) => {
      this.closeUserDetailsModal();
      const perfil: 'terapeuta' | 'user' = user.perfil === 'terapeuta' ? 'terapeuta' : 'user';
      this.selectedUser = { ...data, perfil };
      // Só abre o modal depois de selectedUser estar pronto!
      this.showUserFormModal = true;
    };
    if (user.perfil === 'terapeuta') {
      this.terapeutaService.getTerapeutaById(user.id).subscribe({
        next: (data: any) => closeAndSet(data),
        error: () => closeAndSet(user)
      });
    } else {
      this.usuarioService.getById(user.id).subscribe({
        next: (data: any) => closeAndSet(data),
        error: () => closeAndSet(user)
      });
    }
  }

  viewUserDetails(user: TeaUser): void {
    this.selectedUser = user;
    this.showUserDetailsModal = true;
  }

  closeUserDetailsModal(): void {
    this.showUserDetailsModal = false;
    this.selectedUser = null;
  }

  closeUserFormModal(): void {
    this.showUserFormModal = false;
    this.selectedUser = null;
    this.formMode = 'create';
  }

  onSaveUser(userData: any): void {
    const userToSave: TeaUser = {
      ...userData,
      id: userData.id?.toString() ?? '',
      dataUltimoAcesso: userData.dataUltimoAcesso
        ? (typeof userData.dataUltimoAcesso === 'string'
            ? userData.dataUltimoAcesso
            : userData.dataUltimoAcesso.toISOString())
        : '',
      dataCriacao: userData.dataCriacao
        ? (typeof userData.dataCriacao === 'string'
            ? userData.dataCriacao
            : userData.dataCriacao.toISOString())
        : ''
    };

    // Após salvar, recarrega a lista da API
    this.loadUsers();
    this.closeUserFormModal();
  }
}
