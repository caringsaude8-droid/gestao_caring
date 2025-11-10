import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

export interface Cliente {
  id: string;
  nome: string;
  documento: string;
  tipoFaturamento: string;
  ativo: boolean;
  faturamos: string;
  comissao: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  endereco?: string;
  cidade?: string;
  observacoes?: string;
  dataCadastro?: Date;
  dataUltimaAtualizacao?: Date;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = 'todos';
  showClientForm = false;
  showClientDetails = false;
  selectedClient: Cliente | null = null;

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.loading = true;
    
    // Mock data
    this.clientes = [
      {
        id: '1',
        nome: 'Hospital São Lucas',
        documento: '12.345.678/0001-90',
        tipoFaturamento: 'Não informado',
        ativo: true,
        faturamos: 'Sim',
        comissao: '-',
        email: 'contato@saolucas.com.br',
        telefone: '(11) 3456-7890',
        empresa: 'Caring Saúde Ltda',
        endereco: 'Rua das Flores, 123 - Centro',
        cidade: 'São Paulo/SP',
        observacoes: 'Cliente premium com atendimento prioritário',
        dataCadastro: new Date('2024-01-15'),
        dataUltimaAtualizacao: new Date('2024-10-20')
      },
      {
        id: '2',
        nome: 'Clínica Vida Nova',
        documento: '23.456.789/0001-01',
        tipoFaturamento: 'Não informado',
        ativo: true,
        faturamos: 'Sim',
        comissao: '-',
        email: 'admin@clinicavidanova.com.br',
        telefone: '(11) 2345-6789',
        empresa: 'Caring Saúde Ltda',
        endereco: 'Av. Paulista, 1000 - Bela Vista',
        cidade: 'São Paulo/SP',
        observacoes: 'Especializada em exames de imagem',
        dataCadastro: new Date('2024-02-10'),
        dataUltimaAtualizacao: new Date('2024-10-15')
      },
      {
        id: '3',
        nome: 'UPA Norte',
        documento: '34.567.890/0001-12',
        tipoFaturamento: 'Não informado',
        ativo: false,
        faturamos: 'Não',
        comissao: '5%',
        email: 'gestao@upanorte.gov.br',
        telefone: '(11) 1234-5678',
        empresa: 'Caring Saúde Ltda',
        endereco: 'Rua Norte, 500 - Zona Norte',
        cidade: 'São Paulo/SP',
        observacoes: 'Unidade de Pronto Atendimento municipal',
        dataCadastro: new Date('2023-12-05'),
        dataUltimaAtualizacao: new Date('2024-09-30')
      }
    ];

    this.loading = false;
  }

  get filteredClientes() {
    return this.clientes.filter(cliente => {
      const matchesSearch = cliente.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'todos' || 
        (this.selectedStatus === 'ativo' && cliente.ativo) ||
        (this.selectedStatus === 'inativo' && !cliente.ativo);
      return matchesSearch && matchesStatus;
    });
  }

  get clientesAtivos() {
    return this.clientes.filter(c => c.ativo).length;
  }

  get clientesInativos() {
    return this.clientes.filter(c => !c.ativo).length;
  }



  getStatusClass(status: string): string {
    return status === 'ativo' ? 'badge-success' : 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    return status === 'ativo' ? 'Ativo' : 'Inativo';
  }

  openClientForm() {
    this.showClientForm = true;
  }

  closeClientForm() {
    this.showClientForm = false;
  }

  editClient(cliente: Cliente) {
    // Fechar modal de detalhes se estiver aberto
    this.closeClientDetails();
    
    // Carregar dados do cliente no formulário
    this.newClient = {
      nome: cliente.nome,
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      cpfCnpj: cliente.documento,
      tipo: 'pessoa_juridica',
      endereco: cliente.endereco || '',
      cidade: cliente.cidade || '',
      estado: 'SP',
      cep: '',
      empresaId: '1',
      status: cliente.ativo ? 'ativo' : 'inativo',
      observacoes: cliente.observacoes || '',
      notificarEmail: false
    };
    
    this.showClientForm = true;
    console.log('Editar cliente:', cliente);
  }

  deleteClient(cliente: Cliente) {
    if (confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
      this.clientes = this.clientes.filter(c => c.id !== cliente.id);
      console.log('Cliente excluído:', cliente.nome);
    }
  }

  viewClient(cliente: Cliente) {
    this.selectedClient = cliente;
    this.showClientDetails = true;
    console.log('Visualizar cliente:', cliente);
  }

  closeClientDetails() {
    this.showClientDetails = false;
    this.selectedClient = null;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Não informado';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  toggleStatus(cliente: Cliente) {
    cliente.ativo = !cliente.ativo;
    console.log('Status alterado:', cliente.nome, cliente.ativo ? 'ativo' : 'inativo');
  }

  // Propriedades para o formulário
  newClient = {
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    tipo: 'pessoa_fisica',
    endereco: '',
    cidade: '',
    estado: 'SP',
    cep: '',
    empresaId: '',
    status: 'ativo',
    observacoes: '',
    notificarEmail: false
  };

  // Lista de empresas para o select
  empresas = [
    { id: '1', nome: 'Caring Saúde Ltda' },
    { id: '2', nome: 'MedCenter Clínica' },
    { id: '3', nome: 'Hospital São João' },
    { id: '4', nome: 'Clínica Bem Estar' }
  ];

  createClient() {
    if (!this.newClient.nome.trim() || !this.newClient.email.trim()) {
      return;
    }

    // Criar novo cliente
    const novoCliente: Cliente = {
      id: Date.now().toString(),
      nome: this.newClient.nome,
      documento: this.newClient.cpfCnpj,
      tipoFaturamento: '',
      ativo: this.newClient.status === 'ativo',
      faturamos: 'Sim',
      comissao: '-'
    };

    // Adicionar à lista de clientes
    this.clientes.push(novoCliente);
    
    // Resetar formulário
    this.resetClientForm();
    
    // Fechar modal
    this.closeClientForm();

    // Simular notificação (em produção seria um toast/notification)
    console.log('Cliente criado com sucesso:', novoCliente);
    if (this.newClient.notificarEmail) {
      console.log('Email de boas-vindas enviado para:', this.newClient.email);
    }
  }

  resetClientForm() {
    this.newClient = {
      nome: '',
      email: '',
      telefone: '',
      cpfCnpj: '',
      tipo: 'pessoa_fisica',
      endereco: '',
      cidade: '',
      estado: 'SP',
      cep: '',
      empresaId: '',
      status: 'ativo',
      observacoes: '',
      notificarEmail: false
    };
  }
}
