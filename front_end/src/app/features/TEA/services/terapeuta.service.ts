import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
    return this.http.post(`${environment.apiUrl}/terapeutas`, payload);
  }

  getTerapeutas(clinicaId?: string): Observable<Terapeuta[]> {
    let params = new HttpParams();
    if (clinicaId) {
      params = params.set('clinicaId', clinicaId);
    }
    return this.http.get<Terapeuta[]>(`${environment.apiUrl}/terapeutas`, { params });
  }

  getTerapeutaById(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/terapeutas/${id}`);
  }
}