import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-controle-reajustes',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Controle de Reajustes</h1>
        <p class="page-subtitle">Gerencie os reajustes de preços</p>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Controle de Reajustes</h3>
        </div>
        <div class="card-content">
          <p>Funcionalidade de controle de reajustes será implementada aqui.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 1.5rem; }
    .page-header { margin-bottom: 1.5rem; }
    .page-title { font-size: 1.875rem; font-weight: bold; color: #2563eb; margin: 0 0 0.5rem 0; }
    .page-subtitle { color: #6b7280; margin: 0; }
    .card { 
      background: white; 
      border-radius: 8px; 
      border: 1px solid #e5e7eb; 
      padding: 1rem; 
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .card-header { 
      border-bottom: 1px solid #e5e7eb; 
      padding-bottom: 0.75rem; 
      margin-bottom: 1rem; 
    }
    .card-header h3 { 
      margin: 0; 
      font-size: 1.125rem; 
      font-weight: 600; 
    }
    .card-content { }
  `]
})
export class ControleReajustesComponent {}