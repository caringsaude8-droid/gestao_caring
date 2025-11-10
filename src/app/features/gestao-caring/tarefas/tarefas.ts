import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'urgente';
  prioridade: 'alta' | 'media' | 'baixa';
  visibilidade: 'publico' | 'privado' | 'especifico';
  data_limite?: string;
  data_criacao: string;
  user_id: string;
  empresa_id?: string;
  cliente_id?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

export interface Empresa {
  id: string;
  nome: string;
}

export interface Cliente {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.css',
})
export class TarefasComponent implements OnInit {
  // Data properties
  tarefas: Tarefa[] = [];
  usuarios: Usuario[] = [];
  empresas: Empresa[] = [];
  clientes: Cliente[] = [];
  loading = false;

  // Filter properties
  searchTerm = '';
  selectedEmpresa = 'todos';
  selectedOwnership = 'todas';
  activeTab: 'todas' | 'pendente' | 'em_andamento' | 'urgente' | 'concluida' = 'todas';

  // Modal properties
  showTaskForm = false;
  showTaskDetails = false;
  showEditForm = false;
  editingTask: Tarefa | null = null;
  selectedTask: Tarefa | null = null;

  // Current user (mock)
  currentUser: Usuario = {
    id: '1',
    nome: 'Bruno Caring',
    email: 'bruno@caringsaude.com.br'
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Mock data
    this.usuarios = [
      { id: '1', nome: 'Bruno Caring', email: 'bruno@caringsaude.com.br' },
      { id: '2', nome: 'Ana Silva', email: 'ana@caringsaude.com.br' },
      { id: '3', nome: 'Carlos Santos', email: 'carlos@caringsaude.com.br' }
    ];

    this.empresas = [
      { id: '1', nome: 'Caring Saúde Ltda' },
      { id: '2', nome: 'Caring Consultoria' },
      { id: '3', nome: 'Caring Tech Solutions' }
    ];

    this.clientes = [
      { id: '1', nome: 'Hospital São Lucas' },
      { id: '2', nome: 'Clínica Central' },
      { id: '3', nome: 'UPA Norte' }
    ];

    this.tarefas = [
      {
        id: '1',
        titulo: 'Revisar contratos médicos',
        descricao: 'Análise detalhada dos contratos de prestação de serviços médicos',
        status: 'pendente',
        prioridade: 'alta',
        visibilidade: 'publico',
        data_limite: '2025-10-30',
        data_criacao: '2025-10-20',
        user_id: '1',
        empresa_id: '1',
        cliente_id: '1'
      },
      {
        id: '2',
        titulo: 'Análise financeira trimestral',
        descricao: 'Relatório financeiro do terceiro trimestre',
        status: 'em_andamento',
        prioridade: 'media',
        visibilidade: 'privado',
        data_limite: '2025-10-25',
        data_criacao: '2025-10-18',
        user_id: '2',
        empresa_id: '1'
      },
      {
        id: '3',
        titulo: 'Reunião com stakeholders',
        descricao: 'Apresentação dos resultados do projeto piloto',
        status: 'urgente',
        prioridade: 'alta',
        visibilidade: 'especifico',
        data_limite: '2025-10-24',
        data_criacao: '2025-10-22',
        user_id: '1',
        empresa_id: '2'
      },
      {
        id: '4',
        titulo: 'Documentação de processos',
        descricao: 'Atualizar documentação dos processos internos',
        status: 'concluida',
        prioridade: 'baixa',
        visibilidade: 'publico',
        data_limite: '2025-10-20',
        data_criacao: '2025-10-15',
        user_id: '3',
        empresa_id: '3'
      }
    ];

    this.loading = false;
  }

  // Computed properties
  get filteredTasks(): Tarefa[] {
    return this.tarefas.filter(task => {
      const matchesSearch = task.titulo.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro por empresa
      let matchesEmpresa = true;
      if (this.selectedEmpresa === 'sem_empresa') {
        matchesEmpresa = !task.empresa_id;
      } else if (this.selectedEmpresa !== 'todos') {
        matchesEmpresa = task.empresa_id === this.selectedEmpresa;
      }
      
      // Filtro por criação/compartilhamento
      let matchesOwnership = true;
      if (this.selectedOwnership === 'minhas') {
        matchesOwnership = task.user_id === this.currentUser.id;
      } else if (this.selectedOwnership === 'compartilhadas') {
        matchesOwnership = task.user_id !== this.currentUser.id;
      }
      
      return matchesSearch && matchesEmpresa && matchesOwnership;
    });
  }

  get tasksByStatus() {
    return {
      todas: this.tarefas,
      pendente: this.tarefas.filter(t => t.status === 'pendente'),
      em_andamento: this.tarefas.filter(t => t.status === 'em_andamento'),
      urgente: this.tarefas.filter(t => t.status === 'urgente'),
      concluida: this.tarefas.filter(t => t.status === 'concluida')
    };
  }

  // Helper methods
  getStatusBadgeClass(status: string): string {
    const classes = {
      pendente: 'badge-warning',
      em_andamento: 'badge-info',
      concluida: 'badge-success',
      urgente: 'badge-danger'
    };
    return classes[status as keyof typeof classes] || 'badge-secondary';
  }

  getPrioridadeBadgeClass(prioridade: string): string {
    const classes = {
      alta: 'badge-danger',
      media: 'badge-warning',
      baixa: 'badge-success'
    };
    return classes[prioridade as keyof typeof classes] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const labels = {
      pendente: 'Pendente',
      em_andamento: 'Em Andamento',
      concluida: 'Concluída',
      urgente: 'Urgente'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getPrioridadeLabel(prioridade: string): string {
    const labels = {
      alta: 'Alta',
      media: 'Média',
      baixa: 'Baixa'
    };
    return labels[prioridade as keyof typeof labels] || prioridade;
  }

  getVisibilityLabel(visibilidade: string): string {
    const labels = {
      publico: 'Público',
      privado: 'Privado',
      especifico: 'Específico'
    };
    return labels[visibilidade as keyof typeof labels] || visibilidade;
  }

  isTaskSharedByOthers(task: Tarefa): boolean {
    return task.user_id !== this.currentUser.id;
  }

  getCreatorName(task: Tarefa): string {
    const creator = this.usuarios.find(u => u.id === task.user_id);
    return creator?.nome || 'Usuário desconhecido';
  }

  getEmpresaName(task: Tarefa): string | null {
    if (!task.empresa_id) return null;
    const empresa = this.empresas.find(e => e.id === task.empresa_id);
    return empresa?.nome || null;
  }

  getClienteName(task: Tarefa): string | null {
    if (!task.cliente_id) return null;
    const cliente = this.clientes.find(c => c.id === task.cliente_id);
    return cliente?.nome || null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  // Actions
  openTaskForm() {
    this.showTaskForm = true;
  }

  closeTaskForm() {
    this.showTaskForm = false;
  }

  viewTaskDetails(task: Tarefa) {
    this.selectedTask = task;
    this.showTaskDetails = true;
  }

  closeTaskDetails() {
    this.showTaskDetails = false;
    this.selectedTask = null;
  }

  editTask(task: Tarefa) {
    this.editingTask = task;
    this.showEditForm = true;
  }

  closeEditForm() {
    this.showEditForm = false;
    this.editingTask = null;
  }

  deleteTask(task: Tarefa) {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.titulo}"?`)) {
      this.tarefas = this.tarefas.filter(t => t.id !== task.id);
      console.log('Tarefa excluída:', task.titulo);
    }
  }

  setActiveTab(tab: 'todas' | 'pendente' | 'em_andamento' | 'urgente' | 'concluida') {
    this.activeTab = tab;
  }

  onFiltersChange() {
    // Método chamado quando filtros mudam
    console.log('Filtros alterados:', {
      searchTerm: this.searchTerm,
      selectedEmpresa: this.selectedEmpresa,
      selectedOwnership: this.selectedOwnership
    });
  }

  // Propriedades para o formulário
  newTask = {
    title: '',
    description: '',
    empresa: '',
    cliente: '',
    prioridade: 'media',
    status: 'pendente',
    dataVencimento: '',
    horarioVencimento: '',
    tagsText: '',
    notificarEmail: false
  };

  // As listas empresas e clientes já estão definidas no ngOnInit

  createTask() {
    if (!this.newTask.title.trim()) {
      return;
    }

    // Processar tags
    const tags = this.newTask.tagsText 
      ? this.newTask.tagsText.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];

    // Criar nova tarefa
    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      titulo: this.newTask.title,
      descricao: this.newTask.description,
      status: this.newTask.status as any,
      prioridade: this.newTask.prioridade as any,
      visibilidade: 'publico',
      data_limite: this.newTask.dataVencimento ? 
        `${this.newTask.dataVencimento}${this.newTask.horarioVencimento ? 'T' + this.newTask.horarioVencimento : ''}` : 
        undefined,
      data_criacao: new Date().toISOString(),
      user_id: this.currentUser.id,
      empresa_id: this.empresas.find(e => e.nome === this.newTask.empresa)?.id,
      cliente_id: this.clientes.find(c => c.nome === this.newTask.cliente)?.id
    };

    // Adicionar à lista de tarefas
    this.tarefas.push(novaTarefa);
    
    // Os getters filteredTasks e tasksByStatus são atualizados automaticamente
    
    // Resetar formulário
    this.resetTaskForm();
    
    // Fechar modal
    this.closeTaskForm();

    // Simular notificação (em produção seria um toast/notification)
    console.log('Tarefa criada com sucesso:', novaTarefa);
    if (this.newTask.notificarEmail) {
      console.log('Email de notificação enviado');
    }
  }

  resetTaskForm() {
    this.newTask = {
      title: '',
      description: '',
      empresa: '',
      cliente: '',
      prioridade: 'media',
      status: 'pendente',
      dataVencimento: '',
      horarioVencimento: '',
      tagsText: '',
      notificarEmail: false
    };
  }

  getCurrentTabTasks(): Tarefa[] {
    let tasks: Tarefa[] = [];
    
    if (this.activeTab === 'todas') {
      tasks = this.filteredTasks;
    } else {
      const statusTasks = this.tasksByStatus[this.activeTab];
      if (statusTasks) {
        tasks = statusTasks;
      }
    }

    return tasks.filter(task => {
      // Filtro por termo de busca
      const matchesSearch = task.titulo.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro por empresa
      const matchesEmpresa = this.selectedEmpresa === 'todos' || 
        (this.selectedEmpresa === 'sem_empresa' && !task.empresa_id) || 
        task.empresa_id === this.selectedEmpresa;
      
      // Filtro por propriedade
      const matchesOwnership = this.selectedOwnership === 'todas' || 
        (this.selectedOwnership === 'minhas' && task.user_id === this.currentUser.id) || 
        (this.selectedOwnership === 'compartilhadas' && task.user_id !== this.currentUser.id);

      return matchesSearch && matchesEmpresa && matchesOwnership;
    });
  }
}
