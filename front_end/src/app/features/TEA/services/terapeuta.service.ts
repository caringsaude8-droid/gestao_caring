import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Terapeuta {
  id: string;
  nome: string;
  especialidade: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'inativo';
  dataCadastro?: string;
  cpf?: string;
  crm?: string;
  endereco?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TerapeutaService {
  constructor(private http: HttpClient) { }

  create(payload: any): Observable<any> {
    return this.http.post('http://localhost:8081/api/v1/terapeutas', payload);
  }

  getTerapeutas(clinicaId?: string): Observable<Terapeuta[]> {
    let params = new HttpParams();
    if (clinicaId) {
      params = params.set('clinicaId', clinicaId);
    }
    return this.http.get<Terapeuta[]>('http://localhost:8081/api/v1/terapeutas', { params });
  }

  getTerapeutaById(id: string): Observable<any> {
    return this.http.get(`http://localhost:8081/api/v1/terapeutas/${id}`);
  }
}