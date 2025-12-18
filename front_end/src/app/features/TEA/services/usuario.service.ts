import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  create(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/usuarios`, payload);
  }

  getAll(clinicaId?: string): Observable<any[]> {
    let url = `${environment.apiUrl}/usuarios`;
    if (clinicaId) {
      url += `?clinicaId=${clinicaId}`;
    }
    return this.http.get<any[]>(url);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/usuarios/${id}`);
  }
}
