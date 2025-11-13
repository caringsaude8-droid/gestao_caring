import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Profissional {
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
export class ProfissionalService {
  private profissionaisSubject = new BehaviorSubject<Profissional[]>([
    {
      id: '1',
      nome: 'Dra. Maria Silva',
      especialidade: 'Psicóloga',
      email: 'maria.silva@exemplo.com',
      telefone: '(11) 98765-4321',
      status: 'ativo',
      dataCadastro: '2023-05-15',
      cpf: '123.456.789-00',
      crm: 'CRP 06/12345',
      endereco: 'Rua das Flores, 123 - São Paulo, SP'
    },
    {
      id: '2',
      nome: 'Dr. João Santos',
      especialidade: 'Fonoaudiólogo',
      email: 'joao.santos@exemplo.com',
      telefone: '(11) 91234-5678',
      status: 'ativo',
      dataCadastro: '2023-06-20',
      cpf: '987.654.321-00',
      crm: 'CRFa 2-12345',
      endereco: 'Av. Paulista, 1000 - São Paulo, SP'
    },
    {
      id: '3',
      nome: 'Dra. Ana Oliveira',
      especialidade: 'Terapeuta Ocupacional',
      email: 'ana.oliveira@exemplo.com',
      telefone: '(11) 99876-5432',
      status: 'inativo',
      dataCadastro: '2023-07-10',
      cpf: '456.789.123-00',
      crm: 'CREFITO 3-12345',
      endereco: 'Rua Augusta, 500 - São Paulo, SP'
    }
  ]);
  profissionais$: Observable<Profissional[]> = this.profissionaisSubject.asObservable();

  constructor() { }

  getProfissionais(): Observable<Profissional[]> {
    return this.profissionais$;
  }

  addProfissional(profissional: Profissional): void {
    const currentProfissionais = this.profissionaisSubject.getValue();
    const newProfissional = { ...profissional, id: (currentProfissionais.length + 1).toString() };
    this.profissionaisSubject.next([...currentProfissionais, newProfissional]);
  }

  updateProfissional(updatedProfissional: Profissional): void {
    const currentProfissionais = this.profissionaisSubject.getValue();
    const index = currentProfissionais.findIndex(p => p.id === updatedProfissional.id);
    if (index > -1) {
      currentProfissionais[index] = updatedProfissional;
      this.profissionaisSubject.next([...currentProfissionais]);
    }
  }
}