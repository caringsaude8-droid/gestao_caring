import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface UserDetails {
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
  roles?: string[];
}

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.css']
})
export class UserDetailsModalComponent {
  @Input() show: boolean = false;
  @Input() user: UserDetails | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<UserDetails>();

  onCloseModal(): void {
    this.close.emit();
  }

  onEditUser(): void {
    if (this.user) {
      this.editUser.emit(this.user);
      this.close.emit();
    }
  }

  onOverlayClick(event: Event): void {
    // Fecha o modal apenas se clicar no overlay (fundo)
    if (event.target === event.currentTarget) {
      this.onCloseModal();
    }
  }

  getPerfilLabel(perfil: string): string {
    const labels: { [key: string]: string } = {
      'admin': 'Administrador',
      'terapeuta': 'Admin TEA'
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
}