import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { InputComponent } from '../../../../../shared/components/ui/input/input';

interface TaskFormData {
  titulo: string;
  status: string;
  prioridade: string;
  data_limite: string;
  empresa_id: string | null;
  cliente_id: string | null;
  visibilidade: 'privado' | 'publico' | 'especifico';
  lembrete_email: boolean;
  periodicidade_lembrete: string | null;
  emails_notificacao: string[];
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface Empresa {
  id: string;
  nome: string;
}

interface Cliente {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Input() triggerButtonText: string = 'Nova Tarefa';
  @Input() usuarios: Usuario[] = [];
  @Input() empresas: Empresa[] = [];
  @Input() clientes: Cliente[] = [];
  
  @Output() taskCreated = new EventEmitter<TaskFormData>();
  @Output() formClosed = new EventEmitter<void>();

  taskForm: FormGroup;
  isOpen = false;
  emailsTexto = '';
  usuariosSelecionados: string[] = [];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      status: ['pendente'],
      prioridade: ['media'],
      data_limite: [''],
      empresa_id: [null],
      cliente_id: [null],
      visibilidade: ['privado'],
      lembrete_email: [false],
      periodicidade_lembrete: [null]
    });
  }

  ngOnInit() {
    // Setup form value changes
    this.taskForm.get('lembrete_email')?.valueChanges.subscribe(value => {
      const periodicidadeControl = this.taskForm.get('periodicidade_lembrete');
      if (value) {
        periodicidadeControl?.setValue('diario');
      } else {
        periodicidadeControl?.setValue(null);
      }
    });

    this.taskForm.get('visibilidade')?.valueChanges.subscribe(value => {
      if (value !== 'especifico') {
        this.usuariosSelecionados = [];
      }
    });
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
    this.resetForm();
    this.formClosed.emit();
  }

  resetForm() {
    this.taskForm.reset({
      titulo: '',
      status: 'pendente',
      prioridade: 'media',
      data_limite: '',
      empresa_id: null,
      cliente_id: null,
      visibilidade: 'privado',
      lembrete_email: false,
      periodicidade_lembrete: null
    });
    this.emailsTexto = '';
    this.usuariosSelecionados = [];
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.showError('O título da tarefa é obrigatório');
      return;
    }

    if (this.taskForm.value.visibilidade === 'especifico' && this.usuariosSelecionados.length === 0) {
      this.showError('Selecione pelo menos um usuário para ter acesso à tarefa');
      return;
    }

    const formValue = this.taskForm.value;
    const taskData: TaskFormData = {
      ...formValue,
      emails_notificacao: this.emailsTexto.split(',').map(email => email.trim()).filter(email => email)
    };

    this.taskCreated.emit(taskData);
    this.closeDialog();
  }

  onUsuarioChange(usuarioId: string, checked: boolean | undefined) {
    if (checked === undefined) return;
    if (checked) {
      this.usuariosSelecionados.push(usuarioId);
    } else {
      this.usuariosSelecionados = this.usuariosSelecionados.filter(id => id !== usuarioId);
    }
  }

  isUsuarioSelected(usuarioId: string): boolean {
    return this.usuariosSelecionados.includes(usuarioId);
  }

  getPrioridadeColor(prioridade: string): string {
    const colors = {
      'alta': 'bg-red-500',
      'media': 'bg-orange-500',
      'baixa': 'bg-green-500'
    };
    return colors[prioridade as keyof typeof colors] || 'bg-gray-500';
  }

  private showError(message: string) {
    // Mock toast implementation - replace with actual toast service
    alert(`Erro: ${message}`);
  }
}
