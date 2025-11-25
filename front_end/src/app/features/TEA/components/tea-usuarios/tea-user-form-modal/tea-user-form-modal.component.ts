import { Component, EventEmitter, Input, Output, OnInit, OnChanges, inject } from '@angular/core';
import { TerapeutaService } from '../../../services/terapeuta.service';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface TeaUser {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  senha?: string;
  dataNascimento?: string;
  clinicaId?: string;
  perfil: 'terapeuta' | 'user';
  status: 'ativo' | 'inativo';
  especialidades?: string[];
  permissoes?: { [key: string]: boolean };
  dataUltimoAcesso: string | Date;
  dataCriacao: string | Date;
}

@Component({
  selector: 'app-tea-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tea-user-form-modal.component.html',
  styleUrls: ['./tea-user-form-modal.component.css'],
  providers: [TerapeutaService, UsuarioService]
})
export class TeaUserFormModalComponent implements OnInit, OnChanges {
  private terapeutaService = inject(TerapeutaService);
  private usuarioService = inject(UsuarioService);
  @Input() show: boolean = false;
  @Input() user: TeaUser | null = null;
  @Input() mode: 'create' | 'edit' = 'create';
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TeaUser>();

  formData: Partial<TeaUser> = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    dataNascimento: '',
    perfil: 'terapeuta',
    status: 'ativo',
    especialidades: [],
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

  especialidadeInput: string = '';
  
  readonly perfilOptions = [
    { value: 'terapeuta', label: 'Terapeuta' },
    { value: 'user', label: 'Usuário' }
  ];

  readonly statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' }
  ];

  get modalTitle(): string {
    return this.mode === 'create' ? 'Novo Usuário TEA' : 'Editar Usuário TEA';
  }

  get submitButtonText(): string {
    return this.mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações';
  }

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: any): void {
    // Debug para rastrear mudanças
    console.log('[DEBUG][Modal] ngOnChanges', changes, 'show:', this.show, 'user:', this.user);
    if (this.show && (changes['user'] || changes['show'])) {
      if (this.mode === 'edit' && this.user) {
        // Só reseta se user está presente e tem id
        this.resetForm();
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    }
  }

  resetForm(): void {
    const clinicaId = String(localStorage.getItem('selectedClinica') || '');
    if (this.mode === 'edit' && this.user) {
      // Converter roles (array) em permissoes (objeto) se for perfil user
      let permissoes: { [key: string]: boolean } = {
        TEA_CLINICAS: false,
        TEA_CLINICA: false,
        TEA_CADASTRO: false,
        TEA_TERAPEUTA: false,
        TEA_CALENDARIO: false,
        TEA_AGENDAMENTO: false,
        TEA_MODULO: false
      };
      if ((this.user.perfil ?? '').toLowerCase() === 'user') {
        if (Array.isArray((this.user as any).roles)) {
          for (const role of (this.user as any).roles) {
            permissoes[role] = true;
          }
        } else if (this.user.permissoes) {
          permissoes = { ...permissoes, ...this.user.permissoes };
        }
      } else if (this.user.permissoes) {
        permissoes = { ...permissoes, ...this.user.permissoes };
      }
      this.formData = {
        id: this.user.id?.toString() ?? '',
        cpf: this.user.cpf ?? '',
        nome: this.user.nome ?? '',
        email: this.user.email ?? '',
        telefone: this.user.telefone ?? '',
        senha: '',
        dataNascimento: (typeof this.user.dataNascimento === 'string' ? this.user.dataNascimento.substring(0, 10) : ''),
        perfil: (this.user.perfil ?? 'terapeuta').toLowerCase() as 'terapeuta' | 'user',
        status: this.user.status ?? 'ativo',
        especialidades: Array.isArray(this.user.especialidades) ? [...this.user.especialidades] : [],
        permissoes,
        clinicaId: this.user.clinicaId?.toString() || clinicaId,
        dataUltimoAcesso: this.user.dataUltimoAcesso ?? '',
        dataCriacao: this.user.dataCriacao ?? ''
      };
    } else {
      this.formData = {
        cpf: '',
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        dataNascimento: '',
        perfil: 'terapeuta',
        status: 'ativo',
        especialidades: [],
        permissoes: {
          TEA_CLINICAS: false,
          TEA_CLINICA: false,
          TEA_CADASTRO: false,
          TEA_TERAPEUTA: false,
          TEA_CALENDARIO: false,
          TEA_AGENDAMENTO: false,
          TEA_MODULO: false
        },
        clinicaId
      };
    }
    this.especialidadeInput = '';
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const statusNum = this.formData.status === 'ativo' ? 1 : 0;
      if (this.formData.perfil === 'terapeuta') {
        // Garante que dataNascimento seja string ISO (yyyy-MM-dd)
        let dataNascimentoISO = this.formData.dataNascimento;
        if (dataNascimentoISO && dataNascimentoISO.length > 10) {
          // Caso venha com hora, pega só a data
          dataNascimentoISO = dataNascimentoISO.substring(0, 10);
        }
        const payload: any = {
          nome: this.formData.nome,
          cpf: this.formData.cpf,
          dataNascimento: dataNascimentoISO,
          email: this.formData.email,
          senha: this.formData.senha,
          telefone: this.formData.telefone,
          clinicaId: this.formData.clinicaId,
          status: statusNum,
          perfilId: 4
        };
        // Só envia usuId se estiver preenchido (edição)
        if (this.formData.id) {
          payload.usuId = this.formData.id;
        }
        this.terapeutaService.create(payload).subscribe({
          next: (result) => this.save.emit(result),
          error: (err) => alert('Erro ao salvar terapeuta: ' + err)
        });
      } else if (this.formData.perfil === 'user') {
        const roles = Object.entries(this.formData.permissoes || {})
          .filter(([_, value]) => value)
          .map(([key]) => key);
        const payload = {
          nome: this.formData.nome,
          cpf: this.formData.cpf,
          dataNascimento: this.formData.dataNascimento,
          email: this.formData.email,
          senha: this.formData.senha,
          telefone: this.formData.telefone,
          clinicaId: this.formData.clinicaId,
          status: statusNum,
          perfilId: 1,
          roles
        };
        this.usuarioService.create(payload).subscribe({
          next: (result) => this.save.emit(result),
          error: (err) => alert('Erro ao salvar usuário: ' + err)
        });
      }
    }
  }

  isFormValid(): boolean {
    const cpfRequired = this.mode === 'create' ? this.formData.cpf?.trim() : true;
    return !!(
      cpfRequired &&
      this.formData.nome?.trim() &&
      this.formData.email?.trim() &&
      this.formData.telefone?.trim() &&
      this.formData.senha?.trim() &&
      this.formData.dataNascimento?.trim() &&
      this.formData.perfil &&
      this.formData.status &&
      this.formData.clinicaId?.trim()
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
