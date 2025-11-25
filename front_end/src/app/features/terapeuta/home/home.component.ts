import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terapeuta-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tea-page-container">
      <div class="page-header">
        <h2 class="page-title">TEA - Terapeuta</h2>
        <p class="page-subtitle">Módulo inicial seguindo padrões do TEA.</p>
      </div>
      <section class="content-card">
        <p>Use esta página para gerenciar terapeutas, evoluções e atendimentos.</p>
      </section>
    </div>
  `
})
export class TerapeutaHomeComponent {}