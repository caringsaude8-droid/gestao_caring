import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Task {
  id: string;
  titulo: string;
  status: string;
  data_limite?: string;
}

interface Faturamento {
  id: string;
  status: string;
  valor: number;
}

interface Evento {
  id: string;
  data_inicio: string;
}

interface Stat {
  title: string;
  value: string | number;
  icon: string;
  variant: 'red' | 'teal' | 'default';
}

interface RecentTask {
  id: string;
  title: string;
  setor: string;
  deadline: string;
  status: 'urgent' | 'normal';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  tarefas: Task[] = [];
  faturamentos: Faturamento[] = [];
  eventos: Evento[] = [];
  profile = { nome: 'Bruno Caring' };
  
  loadingTarefas = false;
  loadingFaturamentos = false;
  loadingEventos = false;

  stats: Stat[] = [];
  recentTasks: RecentTask[] = [];

  // Mock data para formulários
  usuarios = [
    { id: '1', nome: 'Bruno Caring', email: 'bruno@caringsaude.com.br' },
    { id: '2', nome: 'Ana Silva', email: 'ana@caringsaude.com.br' },
    { id: '3', nome: 'Carlos Santos', email: 'carlos@caringsaude.com.br' }
  ];

  empresas = [
    { id: '1', nome: 'Caring Saúde Ltda' },
    { id: '2', nome: 'Caring Consultoria' },
    { id: '3', nome: 'Caring Tech Solutions' }
  ];

  clientes = [
    { id: '1', nome: 'Hospital São Lucas', ativo: true },
    { id: '2', nome: 'Clínica Central', ativo: true },
    { id: '3', nome: 'UPA Norte', ativo: true },
    { id: '4', nome: 'Cliente Inativo', ativo: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Simular carregamento de dados
    this.loadingTarefas = true;
    this.loadingFaturamentos = true;
    this.loadingEventos = true;

    // Dados mock para demonstração
    setTimeout(() => {
      this.tarefas = [
        { id: '1', titulo: 'Revisar contratos', status: 'pendente', data_limite: '2025-10-25' },
        { id: '2', titulo: 'Análise financeira', status: 'urgente', data_limite: '2025-10-24' },
        { id: '3', titulo: 'Reunião com cliente', status: 'concluida' }
      ];

      this.faturamentos = [
        { id: '1', status: 'pendente', valor: 15000 },
        { id: '2', status: 'pago', valor: 8500 }
      ];

      this.eventos = [
        { id: '1', data_inicio: '2025-10-24T09:00:00' },
        { id: '2', data_inicio: '2025-10-24T14:00:00' }
      ];

      this.loadingTarefas = false;
      this.loadingFaturamentos = false;
      this.loadingEventos = false;

      this.calculateStats();
      this.prepareRecentTasks();
    }, 1000);
  }

  private calculateStats() {
    const tarefasAbertas = this.tarefas.filter(t => t.status !== 'concluida').length;
    const tarefasConcluidas = this.tarefas.filter(t => t.status === 'concluida').length;
    
    const faturamentoPendente = this.faturamentos
      .filter(f => f.status === 'pendente')
      .reduce((acc, f) => acc + f.valor, 0);

    const hoje = new Date().toISOString().split('T')[0];
    const eventosHoje = this.eventos.filter(e => 
      e.data_inicio.split('T')[0] === hoje
    ).length;

    this.stats = [
      {
        title: "Tarefas Abertas",
        value: this.loadingTarefas ? "..." : tarefasAbertas,
        icon: "clipboard-list",
        variant: "red",
      },
      {
        title: "Tarefas Concluídas",
        value: this.loadingTarefas ? "..." : tarefasConcluidas,
        icon: "check-circle",
        variant: "teal",
      },
      {
        title: "Faturamento Pendente",
        value: this.loadingFaturamentos ? "..." : new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(faturamentoPendente),
        icon: "dollar-sign",
        variant: "red",
      },
      {
        title: "Compromissos Hoje",
        value: this.loadingEventos ? "..." : eventosHoje,
        icon: "calendar",
        variant: "default",
      },
    ];
  }

  private prepareRecentTasks() {
    this.recentTasks = this.tarefas
      .filter(t => t.status !== 'concluida')
      .slice(0, 3)
      .map(t => ({
        id: t.id,
        title: t.titulo,
        setor: "Geral",
        deadline: t.data_limite ? new Date(t.data_limite).toLocaleDateString('pt-BR') : "Sem prazo",
        status: t.status === 'urgente' ? 'urgent' : 'normal'
      }));
  }

  onNotificationsClick() {
    // Implementar lógica de notificações
    console.log('Notificações clicadas');
  }

  onViewAllTasks() {
    // Navegar para página de tarefas
    console.log('Ver todas as tarefas');
  }

  onNewTask() {
    // Abrir modal de nova tarefa
    console.log('Nova tarefa');
  }

  onNewInvoice() {
    // Abrir modal de novo faturamento
    console.log('Novo faturamento');
  }

  onNewEvent() {
    // Abrir modal de novo evento
    console.log('Novo evento');
  }

  onManageUsers() {
    // Navegar para gerenciamento de usuários
    console.log('Gerenciar usuários');
  }

  // Handlers para formulários
  onTaskCreated(taskData: any) {
    console.log('Nova tarefa criada:', taskData);
    
    // Simular adição da tarefa à lista
    const newTask: Task = {
      id: String(Date.now()),
      titulo: taskData.titulo,
      status: taskData.status,
      data_limite: taskData.data_limite
    };
    
    this.tarefas.unshift(newTask);
    this.calculateStats();
    this.prepareRecentTasks();
    
    // Mock success message
    alert(`Tarefa "${taskData.titulo}" criada com sucesso!`);
  }

  onInvoiceCreated(invoiceData: any) {
    console.log('Novo faturamento criado:', invoiceData);
    
    // Simular adição do faturamento à lista
    const newInvoice: Faturamento = {
      id: String(Date.now()),
      status: invoiceData.status,
      valor: invoiceData.valor
    };
    
    this.faturamentos.unshift(newInvoice);
    this.calculateStats();
    
    // Mock success message
    alert(`Faturamento de ${this.formatCurrency(invoiceData.valor)} criado com sucesso!`);
  }

  onInvoiceUpdated(data: { id: string; data: any }) {
    console.log('Faturamento atualizado:', data);
    // Implementar lógica de atualização
    alert(`Faturamento ${data.id} atualizado com sucesso!`);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToClientes() {
    this.router.navigate(['/clientes']);
  }

  navigateToTarefas() {
    this.router.navigate(['/tarefas']);
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}
