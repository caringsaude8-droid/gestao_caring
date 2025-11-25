import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsModalComponent } from './user-details-modal/user-details-modal.component';
import { UserFormModalComponent, UserForm } from './user-form-modal/user-form-modal.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails } from './user-details-modal/user-details-modal.component';

interface UserApi {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: string;
  status: 'ativo' | 'inativo';
  dataUltimoAcesso: string;
  dataCriacao: string;
  avatar?: string;
  especialidades?: string[];
  departamento?: string;
}

interface UserStats {
  total: number;
  ativos: number;
  inativos: number;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDetailsModalComponent, UserFormModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  public isLoading = false;
  searchTerm: string = '';
  selectedPerfil: string = '';
  selectedStatus: string = '';
  showUserDetailsModal: boolean = false;
  showUserFormModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedUser: UserForm | null = null;
  
  users: UserApi[] = [];

  filteredUsers: UserApi[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.isLoading = false;
      return;
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:8081/api/v1/usuarios', { headers }).subscribe({
      next: (data: any[]) => {
        this.users = data.map((u: any) => ({
          ...u,
          status: u.status === true ? 'ativo' : 'inativo'
        }));
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar usuários:', err);
        this.filteredUsers = [];
        this.isLoading = false;
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
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Corrigir comparação para funcionar com perfis em maiúsculo/minúsculo
      const matchesPerfil = !this.selectedPerfil || (user.perfil && user.perfil.toLowerCase() === this.selectedPerfil.toLowerCase());
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;

      return matchesSearch && matchesPerfil && matchesStatus;
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
      'admin': 'Administrador',
      'user': 'Usuário',
      'gestor': 'Gestor'
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

  editUser(user: UserApi): void {
    this.formMode = 'edit';
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<UserApi>(`http://localhost:8081/api/v1/usuarios/${user.id}`, { headers }).subscribe({
      next: (usuarioCompleto: UserApi) => {
        // Conversão explícita para UserForm
        const userForm: UserForm = {
          id: usuarioCompleto.id,
          cpf: usuarioCompleto.cpf || '',
          nome: usuarioCompleto.nome || '',
          email: usuarioCompleto.email || '',
          telefone: usuarioCompleto.telefone || '',
          perfil: this.mapPerfil(usuarioCompleto.perfil),
          status: typeof usuarioCompleto.status === 'boolean'
            ? (usuarioCompleto.status ? 'ativo' : 'inativo')
            : (usuarioCompleto.status || 'ativo'),
          especialidades: usuarioCompleto.especialidades || [],
          dataUltimoAcesso: usuarioCompleto.dataUltimoAcesso || '',
          dataCriacao: usuarioCompleto.dataCriacao || '',
          permissoes: {},
          roles: (usuarioCompleto as any).roles || []
        };
        this.selectedUser = null;
        setTimeout(() => {
          this.selectedUser = userForm;
          this.showUserFormModal = true;
        }, 0);
        this.closeUserDetailsModal();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      }
    });
  }

  viewUserDetails(user: UserApi): void {
    const safeDate = (value: any) => {
      if (!value) return '';
      if (typeof value === 'string') return value;
      try {
        return new Date(value).toISOString();
      } catch {
        return '';
      }
    };
    const userDetails: UserDetails = {
      ...user,
      dataUltimoAcesso: safeDate(user.dataUltimoAcesso),
      dataCriacao: safeDate(user.dataCriacao),
      roles: (user as any).roles || []
    };
    this.selectedUser = userDetails as any;
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
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (this.formMode === 'create') {
      // Monta objeto apenas com campos esperados pela API
      const userToSend: any = {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        cpf: userData.cpf,
        perfil: userData.perfil,
        telefone: userData.telefone,
        roles: userData.roles || []
      };
      this.http.post<UserApi>('http://localhost:8081/api/v1/usuarios', userToSend, { headers }).subscribe({
        next: (createdUser: UserApi) => {
          this.users.push({
            ...createdUser,
            status: typeof createdUser.status === 'boolean'
              ? (createdUser.status ? 'ativo' : 'inativo')
              : (createdUser.status || 'ativo'),
            dataUltimoAcesso: createdUser.dataUltimoAcesso || new Date().toISOString(),
            dataCriacao: createdUser.dataCriacao || new Date().toISOString()
          });
          this.filteredUsers = [...this.users];
          this.closeUserFormModal();
        },
        error: (err) => {
          console.error('Erro ao criar usuário:', err);
        }
      });
    } else {
      // Editar usuário existente
      const userToSave: UserApi = {
        ...userData,
        id: userData.id.toString(),
        dataUltimoAcesso:
          userData.dataUltimoAcesso
            ? (typeof userData.dataUltimoAcesso === 'string'
                ? userData.dataUltimoAcesso
                : userData.dataUltimoAcesso.toISOString())
            : new Date().toISOString(),
        dataCriacao:
          userData.dataCriacao
            ? (typeof userData.dataCriacao === 'string'
                ? userData.dataCriacao
                : userData.dataCriacao.toISOString())
            : new Date().toISOString()
      };
      const index = this.users.findIndex(u => u.id === userToSave.id);
      if (index !== -1) {
        this.users[index] = {
          ...userToSave,
          dataUltimoAcesso: this.users[index].dataUltimoAcesso,
          dataCriacao: this.users[index].dataCriacao
        };
        this.filteredUsers = [...this.users];
      }
      this.closeUserFormModal();
    }
  }

  private mapPerfil(perfilApi: string): 'USER' | 'ADMIN' | 'GESTOR' | 'TERAPEUTA' {
    switch ((perfilApi || '').toUpperCase()) {
      case 'ADMIN':
      case 'admin':
        return 'ADMIN';
      case 'USER':
      case 'usuario':
        return 'USER';
      case 'GESTOR':
      case 'gestor':
        return 'GESTOR';
      case 'TERAPEUTA':
      case 'terapeuta':
        return 'TERAPEUTA';
      default:
        return 'USER';
    }
  }
}