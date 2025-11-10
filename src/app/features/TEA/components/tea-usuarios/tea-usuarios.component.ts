import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import removido
import { TeaUserFormModalComponent } from './components/tea-user-form-modal/tea-user-form-modal.component';
import { TeaUserDetailsModalComponent } from './components/tea-user-details-modal/tea-user-details-modal.component';

interface TeaUser {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'terapeuta' | 'recepcao' | 'supervisor';
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
  selector: 'app-tea-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, TeaUserFormModalComponent, TeaUserDetailsModalComponent],
  templateUrl: './tea-usuarios.component.html',
  styleUrls: ['./tea-usuarios.component.css']
})
export class TeaUsuariosComponent implements OnInit {
  searchTerm: string = '';
  selectedPerfil: string = '';
  selectedStatus: string = '';
  showUserDetailsModal: boolean = false;
  showUserFormModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedUser: TeaUser | null = null;
  
  users: TeaUser[] = [
    {
      id: '1',
      cpf: '234.567.890-12',
      nome: 'Dr. Pedro Lima Costa',
      email: 'pedro.lima@caring.com',
      telefone: '(11) 99999-0002',
      perfil: 'terapeuta',
      status: 'ativo',
      dataUltimoAcesso: '2024-01-25',
      dataCriacao: '2023-03-20',
      especialidades: ['ABA', 'Fonoaudiologia'],
      departamento: 'TEA'
    },
    {
      id: '2',
      cpf: '456.789.012-34',
      nome: 'Julia Ferreira',
      email: 'julia.ferreira@caring.com',
      telefone: '(11) 99999-0005',
      perfil: 'terapeuta',
      status: 'ativo',
      dataUltimoAcesso: '2024-01-20',
      dataCriacao: '2024-01-15',
      especialidades: ['Psicologia'],
      departamento: 'TEA'
    },
    {
      id: '3',
      cpf: '567.890.123-45',
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@caring.com',
      telefone: '(11) 99999-0006',
      perfil: 'supervisor',
      status: 'ativo',
      dataUltimoAcesso: '2024-01-24',
      dataCriacao: '2023-06-10',
      departamento: 'TEA'
    }
  ];

  filteredUsers: TeaUser[] = [];

  constructor() {}

  ngOnInit() {
    this.filteredUsers = [...this.users];
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

      const matchesPerfil = !this.selectedPerfil || user.perfil === this.selectedPerfil;
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
      'terapeuta': 'Terapeuta',
      'recepcao': 'Recepção',
      'supervisor': 'Supervisor'
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
    this.selectedUser = user;
    this.showUserFormModal = true;
    this.closeUserDetailsModal();
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
      id: userData.id.toString(),
      dataUltimoAcesso: typeof userData.dataUltimoAcesso === 'string' ? userData.dataUltimoAcesso : userData.dataUltimoAcesso.toISOString(),
      dataCriacao: typeof userData.dataCriacao === 'string' ? userData.dataCriacao : userData.dataCriacao.toISOString()
    };

    if (this.formMode === 'create') {
      // Adicionar novo usuário
      this.users.push({
        ...userToSave,
        dataUltimoAcesso: new Date().toISOString(),
        dataCriacao: new Date().toISOString()
      });
      console.log('Usuário TEA criado:', userToSave);
    } else {
      // Editar usuário existente
      const index = this.users.findIndex(u => u.id === userToSave.id);
      if (index !== -1) {
        this.users[index] = {
          ...userToSave,
          dataUltimoAcesso: this.users[index].dataUltimoAcesso,
          dataCriacao: this.users[index].dataCriacao
        };
        console.log('Usuário TEA atualizado:', userToSave);
      }
    }
    
    this.closeUserFormModal();
    // Aqui você implementaria a chamada para a API
  }
}
