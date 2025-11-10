import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string | number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'admin' | 'terapeuta' | 'recepcao' | 'supervisor';
  status: 'ativo' | 'inativo';
  departamento?: string;
  especialidades?: string[];
  dataUltimoAcesso: string | Date;
  dataCriacao: string | Date;
}

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.css']
})
export class UserFormModalComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() user: User | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  formData: Partial<User> = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    perfil: 'recepcao',
    status: 'ativo',
    departamento: '',
    especialidades: []
  };

  especialidadeInput: string = '';
  
  readonly perfilOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'terapeuta', label: 'Admin TEA' }
  ];

  readonly statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' }
  ];

  get modalTitle(): string {
    return this.mode === 'create' ? 'Novo Usuário' : 'Editar Usuário';
  }

  get submitButtonText(): string {
    return this.mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações';
  }

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(): void {
    if (this.show) {
      this.resetForm();
    }
  }

  resetForm(): void {
    if (this.mode === 'edit' && this.user) {
      this.formData = {
        ...this.user,
        especialidades: [...(this.user.especialidades || [])]
      };
    } else {
      this.formData = {
        nome: '',
        email: '',
        telefone: '',
        perfil: 'recepcao',
        status: 'ativo',
        departamento: '',
        especialidades: []
      };
    }
    this.especialidadeInput = '';
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const userData: User = {
        id: this.mode === 'edit' && this.user ? this.user.id : Date.now(),
        cpf: this.formData.cpf!,
        nome: this.formData.nome!,
        email: this.formData.email!,
        telefone: this.formData.telefone!,
        perfil: this.formData.perfil as any,
        status: this.formData.status as any,
        departamento: this.formData.departamento || undefined,
        especialidades: this.formData.especialidades || [],
        dataUltimoAcesso: this.mode === 'edit' && this.user ? this.user.dataUltimoAcesso : new Date(),
        dataCriacao: this.mode === 'edit' && this.user ? this.user.dataCriacao : new Date()
      };

      this.save.emit(userData);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.cpf?.trim() &&
      this.formData.nome?.trim() &&
      this.formData.email?.trim() &&
      this.formData.telefone?.trim() &&
      this.formData.perfil &&
      this.formData.status
    );
  }

  addEspecialidade(): void {
    const especialidade = this.especialidadeInput.trim();
    if (especialidade && !this.formData.especialidades?.includes(especialidade)) {
      this.formData.especialidades = [...(this.formData.especialidades || []), especialidade];
      this.especialidadeInput = '';
    }
  }

  removeEspecialidade(especialidade: string): void {
    this.formData.especialidades = this.formData.especialidades?.filter(esp => esp !== especialidade) || [];
  }

  onEspecialidadeKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addEspecialidade();
    }
  }
}