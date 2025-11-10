import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

interface Atendimento {
  id: string;
  data: string; // ISO
  paciente: string;
  profissional: string;
  convenio: string;
  status: 'Realizado' | 'Agendado' | 'Cancelado';
}

@Component({
  selector: 'app-relatorios-atendimentos',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './relatorios-atendimentos.html',
  styleUrl: './relatorios-atendimentos.css',
})
export class RelatoriosAtendimentosComponent implements OnInit {
  atendimentos: Atendimento[] = [];
  loading = false;
  // filtros
  filtroInicio = '';
  filtroFim = '';
  filtroPaciente = '';
  filtroProfissional = '';
  filtroStatus: 'Todos' | 'Realizado' | 'Agendado' | 'Cancelado' = 'Todos';

  ngOnInit() {
    this.loadMock();
  }

  loadMock() {
    this.loading = true;
    const hoje = new Date();
    const iso = (d: Date) => d.toISOString().slice(0,10);
    this.atendimentos = [
      { id: '1', data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-2)), paciente: 'João Silva', profissional: 'Dra. Maria', convenio: 'Unimed', status: 'Realizado' },
      { id: '2', data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-1)), paciente: 'Ana Costa', profissional: 'Dr. Pedro', convenio: 'SulAmérica', status: 'Realizado' },
      { id: '3', data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()+1)), paciente: 'Lucas Oliveira', profissional: 'Dra. Carla', convenio: 'Particular', status: 'Agendado' },
      { id: '4', data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()+3)), paciente: 'Paula Mendes', profissional: 'Dr. Marcos', convenio: 'Unimed', status: 'Agendado' },
      { id: '5', data: iso(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()-5)), paciente: 'Rafael Lima', profissional: 'Dra. Marina', convenio: 'Amil', status: 'Cancelado' },
    ];
    this.loading = false;
  }

  get filtered() {
    return this.atendimentos.filter(a => {
      const inPaciente = a.paciente.toLowerCase().includes(this.filtroPaciente.toLowerCase());
      const inProf = a.profissional.toLowerCase().includes(this.filtroProfissional.toLowerCase());
      const inStatus = this.filtroStatus === 'Todos' || a.status === this.filtroStatus;
      const afterStart = !this.filtroInicio || a.data >= this.filtroInicio;
      const beforeEnd = !this.filtroFim || a.data <= this.filtroFim;
      return inPaciente && inProf && inStatus && afterStart && beforeEnd;
    });
  }

  get totais() {
    return {
      total: this.filtered.length,
      realizados: this.filtered.filter(a => a.status === 'Realizado').length,
      agendados: this.filtered.filter(a => a.status === 'Agendado').length,
      cancelados: this.filtered.filter(a => a.status === 'Cancelado').length,
    };
  }

  exportCSV() {
    const header = ['ID','Data','Paciente','Profissional','Convênio','Status'];
    const rows = this.filtered.map(a => [a.id, a.data, a.paciente, a.profissional, a.convenio, a.status]);
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-atendimentos-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}