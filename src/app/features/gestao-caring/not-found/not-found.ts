import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <div class="card not-found-card">
        <div class="card-content not-found-content">
          <div class="error-code">404</div>
          <h1 class="error-title">Página não encontrada</h1>
          <p class="error-description">
            A página que você está procurando não existe ou foi movida.
          </p>
          <button class="btn btn-primary" (click)="goHome()">
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .not-found-card {
      max-width: 400px;
      width: 100%;
    }
    .not-found-content {
      text-align: center;
      padding: 2rem;
    }
    .error-code {
      font-size: 4rem;
      font-weight: bold;
      color: #2563eb;
      margin-bottom: 1rem;
    }
    .error-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #111827;
      margin: 0 0 1rem 0;
    }
    .error-description {
      color: #6b7280;
      margin-bottom: 2rem;
    }
    .card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .card-content {
      color: #374151;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      font-size: 0.875rem;
      transition: all 0.2s ease-in-out;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;
    }
    .btn-primary:hover {
      background-color: #1d4ed8;
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}