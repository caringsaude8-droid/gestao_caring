import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  create(payload: any): Observable<any> {
    return this.http.post('http://localhost:8081/api/v1/usuarios', payload);
  }

  getAll(clinicaId?: string): Observable<any[]> {
    let url = 'http://localhost:8081/api/v1/usuarios';
    if (clinicaId) {
      url += `?clinicaId=${clinicaId}`;
    }
    return this.http.get<any[]>(url);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`http://localhost:8081/api/v1/usuarios/${id}`);
  }
}
