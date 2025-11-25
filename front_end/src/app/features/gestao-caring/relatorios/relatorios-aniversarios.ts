import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/ui/input/input';

interface PessoaAniversario {
  id: string;
  nome: string;
  dataNascimento: string; // ISO
  convenio?: string;
}

@Component({
  selector: 'app-relatorios-aniversarios',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent],
  templateUrl: './relatorios-aniversarios.html',
  styleUrls: ['./relatorios-aniversarios.css'],
})
export class RelatoriosAniversariosComponent implements OnInit {
  pessoas: PessoaAniversario[] = [];
  filtroNome = '';
  filtroMes = new Date().getMonth() + 1; // 1..12

  ngOnInit() {
    this.loadMock();
  }

  private loadMock() {
    this.pessoas = [
      { id: '1', nome: 'João Silva', dataNascimento: '2012-11-15', convenio: 'Unimed' },
      { id: '2', nome: 'Ana Costa', dataNascimento: '2015-11-22', convenio: 'SulAmérica' },
      { id: '3', nome: 'Lucas Oliveira', dataNascimento: '2010-12-05', convenio: 'Particular' },
      { id: '4', nome: 'Paula Mendes', dataNascimento: '2013-01-02', convenio: 'Unimed' },
      { id: '5', nome: 'Rafael Lima', dataNascimento: '2011-02-28', convenio: 'Amil' },
    ];
  }

  get filtered() {
    return this.pessoas
      .filter(p => p.nome.toLowerCase().includes(this.filtroNome.toLowerCase()))
      .filter(p => {
        const mes = new Date(p.dataNascimento).getMonth() + 1;
        return mes === Number(this.filtroMes);
      })
      .map(p => ({
        ...p,
        idade: this.calcularIdade(p.dataNascimento),
        proxAniversario: this.proximoAniversario(p.dataNascimento)
      }));
  }

  calcularIdade(nascISO: string): number {
    const nasc = new Date(nascISO);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  proximoAniversario(nascISO: string): string {
    const nasc = new Date(nascISO);
    const hoje = new Date();
    const prox = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
    if (prox < hoje) prox.setFullYear(hoje.getFullYear() + 1);
    return prox.toISOString().slice(0,10);
  }

  exportCSV() {
    const header = ['Nome','Data Nasc.','Idade','Próx. Aniversário','Convênio'];
    const rows = this.filtered.map(p => [p.nome, p.dataNascimento, String(p.idade), p.proxAniversario, p.convenio || '']);
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-aniversarios-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}