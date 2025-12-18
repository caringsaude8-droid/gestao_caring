import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Patient } from '../models/patient.model';
import { Terapeuta, SlotHorario } from './tea-agenda.service';
import { environment } from '../../../../environments/environment';

export interface Clinica {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  status: 'ativo' | 'inativo';
  dataCadastro?: string;
  cnpj?: string;
  responsavel?: string;
  website?: string;
}

@Injectable({ providedIn: 'root' })
export class TeaHomeService {
  private apiUrl = 'api/clinicas'; // Defina sua URL base da API aqui

  constructor(private http: HttpClient) { }
  private clinicas: Clinica[] = [
    {
      id: '1',
      nome: 'Clínica Esperança',
      endereco: 'Rua das Flores, 123 - São Paulo, SP',
      telefone: '(11) 3456-7890',
      email: 'contato@clinicaesperanca.com.br',
      status: 'ativo',
      dataCadastro: '2023-04-10'
    },
    {
      id: '2',
      nome: 'Centro de Terapia Integrada',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP',
      telefone: '(11) 2345-6789',
      email: 'contato@centroterapia.com.br',
      status: 'ativo',
      dataCadastro: '2023-05-22'
    },
    {
      id: '3',
      nome: 'Instituto Desenvolvimento',
      endereco: 'Rua Augusta, 500 - São Paulo, SP',
      telefone: '(11) 3456-7891',
      email: 'contato@instituto.com.br',
      status: 'inativo',
      dataCadastro: '2023-06-15'
    }
  ];

  getClinicas(): Observable<Clinica[]> {
    return this.http.get<Clinica[]>(`${environment.apiUrl}/clinicas`);
  }

}