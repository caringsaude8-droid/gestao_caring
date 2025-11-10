import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeaMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}



@Component({
  selector: 'app-tea-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tea-dashboard.component.html',
  styleUrls: ['./tea-dashboard.component.css']
})
export class TeaDashboardComponent implements OnInit {
  metrics: TeaMetric[] = [
    {
      title: 'Pacientes Ativos',
      value: '127',
      change: '+12 este mês',
      trend: 'up',
      icon: 'users',
      color: 'blue'
    },
    {
      title: 'Sessões Hoje',
      value: '24',
      change: '8 concluídas',
      trend: 'stable',
      icon: 'calendar',
      color: 'green'
    },
    {
      title: 'Taxa de Progresso',
      value: '85%',
      change: '+5% vs mês anterior',
      trend: 'up',
      icon: 'chart',
      color: 'purple'
    },
    {
      title: 'Tempo Médio/Sessão',
      value: '45min',
      change: 'Dentro do esperado',
      trend: 'stable',
      icon: 'clock',
      color: 'orange'
    }
  ];

  ngOnInit() {
    // Carregar dados do dashboard
  }
}