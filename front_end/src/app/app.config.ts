import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { AuthRefreshInterceptor } from './core/interceptors/auth-refresh.interceptor';
import { teaClinicInterceptor } from './core/interceptors/tea-clinic.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([teaClinicInterceptor])
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRefreshInterceptor,
      multi: true
    }
  ]
};
