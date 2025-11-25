import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((newToken: string) => {
            this.isRefreshing = false;
            localStorage.setItem('auth_token', newToken);
            this.refreshTokenSubject.next(newToken);
            return next.handle(request.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            }));
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(() => err);
          })
        );
      } else {
        this.authService.logout();
        return throwError(() => 'No refresh token');
      }
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })))
      );
    }
  }
}
