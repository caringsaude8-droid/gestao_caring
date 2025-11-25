import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { ClinicaContextService } from '../../TEA/services/clinica-context.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface UserForm {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'USER' | 'ADMIN' | 'GESTOR' | 'TERAPEUTA';
  status: 'ativo' | 'inativo';
  especialidades?: string[];
  dataUltimoAcesso: string;
  dataCriacao: string;
  permissoes?: { [key: string]: boolean };
  roles?: string[];
  senha?: string;
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
  @Input() user: UserForm | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData: Partial<UserForm> & { permissoes?: { [key: string]: boolean } } = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    perfil: 'USER',
    status: 'ativo',
    especialidades: [],
    senha: '',
    permissoes: {
      TEA_CLINICAS: false,
      TEA_HOME: false,
      TEA_CADASTRO: false,
      TEA_TERAPEUTA: false,
      TEA_CALENDARIO: false,
      TEA_AGENDAMENTO: false,
      TEA_MODULO: false
    }
  };
  
  readonly perfilOptions = [
    { value: 'USER', label: 'Usuário' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'GESTOR', label: 'Gestor' },
    { value: 'TERAPEUTA', label: 'Terapeuta' }
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
      // Permissões possíveis
      const allPerms = [
        'TEA_CLINICAS',
        'TEA_HOME',
        'TEA_CADASTRO',
        'TEA_TERAPEUTA',
        'TEA_CALENDARIO',
        'TEA_AGENDAMENTO',
        'TEA_MODULO'
      ];
      let permissoes: { [key: string]: boolean } = {};
      if (Array.isArray(this.user.roles)) {
        for (const perm of allPerms) {
          permissoes[perm] = this.user.roles.includes(perm);
        }
      } else if (this.user.permissoes) {
        permissoes = { ...permissoes, ...this.user.permissoes };
        for (const perm of allPerms) {
          if (!(perm in permissoes)) permissoes[perm] = false;
        }
      } else {
        for (const perm of allPerms) permissoes[perm] = false;
      }
      this.formData = {
        id: this.user.id,
        nome: this.user.nome || '',
        email: this.user.email || '',
        telefone: this.user.telefone || '',
        perfil: this.user.perfil || 'USER',
        status: typeof this.user.status === 'boolean'
          ? (this.user.status ? 'ativo' : 'inativo')
          : (this.user.status || 'ativo'),
        permissoes: { ...permissoes }, // força nova referência
        cpf: '',
        especialidades: this.user.especialidades || [],
        dataUltimoAcesso: this.user.dataUltimoAcesso || '',
        dataCriacao: this.user.dataCriacao || '',
        senha: ''
      };
    } else {
      this.formData = {
        cpf: '',
        nome: '',
        email: '',
        telefone: '',
        perfil: 'USER',
        status: 'ativo',
        permissoes: {
          TEA_CLINICAS: false,
          TEA_HOME: false,
          TEA_CADASTRO: false,
          TEA_TERAPEUTA: false,
          TEA_CALENDARIO: false,
          TEA_AGENDAMENTO: false,
          TEA_MODULO: false
        },
        especialidades: [],
        dataUltimoAcesso: '',
        dataCriacao: '',
        senha: ''
      };
    }
  }

  onClose(): void {
    this.close.emit();
  }

  constructor(private clinicaContext: ClinicaContextService) {}

  onSubmit(): void {
    if (this.isFormValid()) {
      // Conversão de status para boolean
      const statusBoolean = this.formData.status === 'ativo';
      // Conversão de permissoes para lista de strings (roles)
      const roles = Object.entries(this.formData.permissoes || {})
        .filter(([_, value]) => value)
        .map(([key]) => key);
      // Monta o objeto para API
      const userApi: any = {
        id: this.mode === 'edit' && this.user ? this.user.id : (this.formData.id ? this.formData.id : Date.now().toString()),
        nome: this.formData.nome!,
        email: this.formData.email!,
        status: statusBoolean,
        perfil: this.formData.perfil,
        roles,
        telefone: this.formData.telefone!,
        senha: this.formData.senha || ''
      };
      if (this.mode === 'create') {
        userApi.cpf = this.formData.cpf!;
      }
      // Só inclui clinicaId se estiver no módulo TEA
      if (window.location.pathname.startsWith('/tea')) {
        const clinicaId = this.clinicaContext.getClinicaId();
        if (clinicaId) {
          userApi.clinicaId = clinicaId;
        }
      }
      this.save.emit(userApi);
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
}