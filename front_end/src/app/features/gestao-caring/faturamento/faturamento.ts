import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Faturamento {
  id: string;
  valor: number;
  referencia: string;
  status: 'pendente' | 'faturado' | 'nf_enviada' | 'pago' | 'cancelado';
  created_at: string;
  cliente?: {
    nome: string;
    empresa?: {
      nome: string;
    };
  };
}

export interface EmpresaTotal {
  nome: string;
  total: number;
}

@Component({
  selector: 'app-faturamento',
  imports: [CommonModule, FormsModule],
  templateUrl: './faturamento.html',
  styleUrl: './faturamento.css',
})
export class FaturamentoComponent {
  searchTerm = '';
  activeTab = 'todos';
  loading = false;
  deleteDialogOpen = false;
  faturamentoToDelete: string | null = null;
  editingFaturamento: Faturamento | null = null;
  editDialogOpen = false;

  // Mock data - substitua pela integração com seu serviço
  faturamentos: Faturamento[] = [
    {
      id: '1',
      valor: 5000.00,
      referencia: 'FAT-2024-001',
      status: 'pago',
      created_at: new Date().toISOString(),
      cliente: {
        nome: 'João Silva',
        empresa: { nome: 'Tech Solutions' }
      }
    },
    {
      id: '2',
      valor: 3500.00,
      referencia: 'FAT-2024-002',
      status: 'pendente',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      cliente: {
        nome: 'Maria Santos',
        empresa: { nome: 'Inovação Digital' }
      }
    },
    {
      id: '3',
      valor: 7200.00,
      referencia: 'FAT-2024-003',
      status: 'faturado',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      cliente: {
        nome: 'Pedro Costa',
        empresa: { nome: 'StartUp Brasil' }
      }
    },
    {
      id: '4',
      valor: 2800.00,
      referencia: 'FAT-2024-004',
      status: 'nf_enviada',
      created_at: new Date(Date.now() - 259200000).toISOString(),
      cliente: {
        nome: 'Ana Oliveira',
        empresa: { nome: 'Tech Solutions' }
      }
    }
  ];

  get filteredFaturamentos(): Faturamento[] {
    return this.faturamentos.filter(fatura =>
      fatura.cliente?.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fatura.cliente?.empresa?.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fatura.referencia.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get faturamentosByStatus() {
    return {
      pendente: this.faturamentos.filter(f => f.status === 'pendente'),
      faturado: this.faturamentos.filter(f => f.status === 'faturado'),
      nf_enviada: this.faturamentos.filter(f => f.status === 'nf_enviada'),
      pago: this.faturamentos.filter(f => f.status === 'pago'),
      cancelado: this.faturamentos.filter(f => f.status === 'cancelado')
    };
  }

  get totalValues() {
    const pendente = this.faturamentosByStatus.pendente.reduce((acc, f) => acc + f.valor, 0);
    const faturado = this.faturamentosByStatus.faturado.reduce((acc, f) => acc + f.valor, 0);
    const recebido = this.faturamentosByStatus.pago.reduce((acc, f) => acc + f.valor, 0);
    const totalMes = this.faturamentos.reduce((acc, f) => acc + f.valor, 0);

    return { pendente, faturado, recebido, totalMes };
  }

  get totalPorEmpresa(): EmpresaTotal[] {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const faturamentosMesAtual = this.faturamentos.filter(f => {
      const dataFaturamento = new Date(f.created_at);
      return dataFaturamento.getMonth() === mesAtual && dataFaturamento.getFullYear() === anoAtual;
    });

    const empresasMap = new Map<string, EmpresaTotal>();
    
    faturamentosMesAtual.forEach(f => {
      const empresaNome = f.cliente?.empresa?.nome || 'Sem Empresa';
      const atual = empresasMap.get(empresaNome) || { nome: empresaNome, total: 0 };
      empresasMap.set(empresaNome, { nome: empresaNome, total: atual.total + f.valor });
    });

    return Array.from(empresasMap.values()).sort((a, b) => b.total - a.total);
  }

  get faturamentoStats() {
    const totals = this.totalValues;
    return [
      {
        title: 'Pendentes',
        value: this.formatCurrency(totals.pendente),
        icon: '⏰',
        variant: 'red'
      },
      {
        title: 'Faturados',
        value: this.formatCurrency(totals.faturado),
        icon: '⚠️',
        variant: 'default'
      },
      {
        title: 'Recebidos',
        value: this.formatCurrency(totals.recebido),
        icon: '✅',
        variant: 'teal'
      },
      {
        title: 'Total do Mês',
        value: this.formatCurrency(totals.totalMes),
        icon: '📈',
        variant: 'default'
      }
    ];
  }

  getFilteredByStatus(status: string): Faturamento[] {
    if (status === 'todos') return this.filteredFaturamentos;
    
    const statusFaturamentos = this.faturamentosByStatus[status as keyof typeof this.faturamentosByStatus] || [];
    return statusFaturamentos.filter(fatura =>
      fatura.cliente?.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fatura.cliente?.empresa?.nome?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fatura.referencia.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  }

  getStatusLabel(status: string): string {
    const labels: {[key: string]: string} = {
      'pendente': 'Pendente',
      'faturado': 'Faturado',
      'nf_enviada': 'NF Enviada',
      'pago': 'Pago',
      'cancelado': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: {[key: string]: string} = {
      'pendente': 'status-pending',
      'faturado': 'status-invoiced',
      'nf_enviada': 'status-sent',
      'pago': 'status-paid',
      'cancelado': 'status-cancelled'
    };
    return classes[status] || 'status-default';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleEdit(fatura: Faturamento): void {
    this.editingFaturamento = fatura;
    this.editDialogOpen = true;
  }

  handleCloseEdit(): void {
    this.editDialogOpen = false;
    this.editingFaturamento = null;
  }

  openDeleteDialog(id: string): void {
    this.faturamentoToDelete = id;
    this.deleteDialogOpen = true;
  }

  handleDelete(): void {
    if (this.faturamentoToDelete) {
      this.faturamentos = this.faturamentos.filter(f => f.id !== this.faturamentoToDelete);
      this.deleteDialogOpen = false;
      this.faturamentoToDelete = null;
    }
  }

  cancelDelete(): void {
    this.deleteDialogOpen = false;
    this.faturamentoToDelete = null;
  }

  getTabCount(status: string): number {
    if (status === 'todos') return this.faturamentos.length;
    const statusKey = status as keyof typeof this.faturamentosByStatus;
    return this.faturamentosByStatus[statusKey]?.length || 0;
  }
}
