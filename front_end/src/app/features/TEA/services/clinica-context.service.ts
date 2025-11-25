import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClinicaContextService {
  private readonly key = 'selectedClinica';

  getClinicaId(): string | null {
    return localStorage.getItem(this.key);
  }

  setClinicaId(id: string): void {
    localStorage.setItem(this.key, id);
  }

  clearClinicaId(): void {
    localStorage.removeItem(this.key);
  }
}
