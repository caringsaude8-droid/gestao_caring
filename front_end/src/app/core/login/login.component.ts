import { Component, OnInit } from '@angular/core';

interface Toast {
  title: string;
  message: string;
  type: 'success' | 'error';
}
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  senha = '';
  loading = false;

  toast: Toast | null = null;
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Limpa qualquer token/sessão anterior ao acessar a tela de login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth');
  }

  clearForm() {
    this.email = '';
    this.senha = '';
    this.showPassword = false;
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.loading = true;

    if (!this.email || !this.senha) {
      this.showToast('Erro no login', 'Email e senha são obrigatórios', 'error');
      this.loading = false;
      return;
    }

    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        // Aceita token dentro do user
        const user = response.user || response;
        const token = user.token || response.token;
        if (user && token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth', JSON.stringify(user));
          this.showToast('Login realizado', 'Bem-vindo ao Gestão Caring!', 'success');
          if (user.roles && user.roles.length > 0) {
            const rolesLower = user.roles.map((r: string) => r.toLowerCase());
            // Redireciona para TEA se tiver qualquer role que contenha 'tea'
            if (rolesLower.some((r: string) => r.includes('tea'))) {
              this.router.navigate(['/tea/selecao-clinica'], { replaceUrl: true });
              return;
            }
            if (rolesLower.some((r: string) => r.includes('terapeuta'))) {
              this.router.navigate(['/terapeuta'], { replaceUrl: true });
              return;
            }
            if (rolesLower.some((r: string) => r.includes('responsavel-paciente'))) {
              this.router.navigate(['/responsavel-paciente'], { replaceUrl: true });
              return;
            }
          }
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          this.showToast('Erro no login', 'Credenciais inválidas ou erro de conexão', 'error');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.showToast('Erro no login', 'Credenciais inválidas ou erro de conexão', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  showToast(title: string, message: string, type: 'success' | 'error') {
    this.toast = { title, message, type };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closeToast() {
    this.toast = null;
  }
}
