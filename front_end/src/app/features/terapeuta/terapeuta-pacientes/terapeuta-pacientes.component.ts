import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Paciente } from '../../gestao-caring/pacientes/pacientes';

@Component({
  selector: 'app-terapeuta-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terapeuta-pacientes.component.html',
  styleUrls: ['./terapeuta-pacientes.component.css']
})
export class TerapeutaPacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loading = true;
    // Mock: obter terapeuta logado
    const terapeuta = this.authService.getCurrentUser();
    // Mock: lista de pacientes (simula que cada terapeuta tem pacientes com id relacionado)
    const todosPacientes: Paciente[] = [
      {
        id: '1', nome: 'João Silva Santos', email: 'joao.silva@email.com', telefone: '(11) 99999-8888', cpf: '123.456.789-00', dataNascimento: '1985-03-15', convenio: 'Unimed', numeroCartao: '123456789', status: 'ativo', data_cadastro: '2025-01-15',
        terapeutaId: 'terapeuta1'
      },
      {
        id: '2', nome: 'Maria Oliveira Costa', email: 'maria.oliveira@email.com', telefone: '(11) 88888-7777', cpf: '987.654.321-00', dataNascimento: '1990-07-22', convenio: 'SulAmérica', numeroCartao: '987654321', status: 'ativo', data_cadastro: '2025-02-10',
        terapeutaId: 'terapeuta2'
      },
      {
        id: '3', nome: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com', telefone: '(11) 77777-6666', cpf: '456.789.123-00', dataNascimento: '1978-12-08', convenio: 'Bradesco Saúde', numeroCartao: '456789123', status: 'ativo', data_cadastro: '2025-01-30',
        terapeutaId: 'terapeuta1'
      },
      {
        id: '4', nome: 'Ana Paula Ferreira', email: 'ana.ferreira@email.com', telefone: '(11) 66666-5555', cpf: '321.654.987-00', dataNascimento: '1992-05-14', convenio: 'Particular', numeroCartao: '', status: 'inativo', data_cadastro: '2025-01-20',
        terapeutaId: 'terapeuta2'
      }
    ];
    // Se não houver id, mostra um paciente fictício para visualização
    if (!terapeuta.id) {
      this.pacientes = [
        {
          id: 'demo',
          nome: 'Paciente Exemplo',
          email: 'exemplo@demo.com',
          telefone: '(00) 00000-0000',
          cpf: '000.000.000-00',
          dataNascimento: '2000-01-01',
          convenio: 'Demo Saúde',
          numeroCartao: '000000',
          status: 'ativo',
          data_cadastro: '2025-11-17',
          terapeutaId: 'demo'
        }
      ];
    } else {
      this.pacientes = todosPacientes.filter(p => p.terapeutaId === terapeuta.id);
    }
    this.loading = false;
  }
}
