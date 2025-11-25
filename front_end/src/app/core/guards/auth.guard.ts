import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token || this.isTokenExpired(token)) {
      this.authService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    return true;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      if (!exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch {
      return true;
    }
  }
}
