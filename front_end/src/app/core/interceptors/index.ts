import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthRefreshInterceptor } from './auth-refresh.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthRefreshInterceptor, multi: true }
];
