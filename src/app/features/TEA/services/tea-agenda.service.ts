import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Especialidade {
  id: string;
  nome: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidadeId: string;
}

export type SlotStatus = 'agendado' | 'confirmado' | 'cancelado';

export interface SlotHorario {
  id: string;
  data: string; // yyyy-mm-dd
  hora: string; // HH:MM
  profissionalId: string;
  especialidadeId: string;
  status: SlotStatus;
  paciente?: string;
  canceladoEm?: string;
  selecionado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TeaAgendaService {
  private readonly horasVisiveis: string[] = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  readonly especialidades: Especialidade[] = [
    { id: 'aba', nome: 'ABA' },
    { id: 'fono', nome: 'Fonoaudiologia' },
    { id: 'to', nome: 'Terapia Ocupacional' },
    { id: 'psico', nome: 'Psicologia' }
  ];

  readonly profissionais: Profissional[] = [
    { id: 'p1', nome: 'Maria Santos', especialidadeId: 'aba' },
    { id: 'p2', nome: 'Pedro Lima', especialidadeId: 'fono' },
    { id: 'p3', nome: 'Carla Souza', especialidadeId: 'to' },
    { id: 'p4', nome: 'João Almeida', especialidadeId: 'psico' }
  ];

  private slotsSubject = new BehaviorSubject<SlotHorario[]>([]);
  slots$ = this.slotsSubject.asObservable();

  constructor() {
    this.initMockData();
  }

  private initMockData() {
    const hoje = new Date();
    const adicionarDias = (d: number) => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + d);
    const formatDate = (dt: Date) => dt.toISOString().slice(0, 10);

    const profs = this.profissionais;
    let idCounter = 1;
    const generated: SlotHorario[] = [];
    for (let d = 0; d < 7; d++) {
      const data = formatDate(adicionarDias(d));
      for (const h of this.horasVisiveis) {
        const prof = profs[(d + this.horasVisiveis.indexOf(h)) % profs.length];
        generated.push({
          id: 's' + idCounter++,
          data,
          hora: h,
          profissionalId: prof.id,
          especialidadeId: prof.especialidadeId,
          status: 'agendado',
          paciente: 'Paciente Teste',
          selecionado: false
        });
      }
    }
    this.slotsSubject.next(generated);
  }

  getSlotsSnapshot(): SlotHorario[] {
    return this.slotsSubject.getValue();
  }

  getProfissionalNome(id: string): string {
    return this.profissionais.find(p => p.id === id)?.nome || '';
  }

  upsertSlot(slot: SlotHorario) {
    const current = this.getSlotsSnapshot();
    const idx = current.findIndex(s => s.id === slot.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...slot };
    } else {
      current.push({ ...slot });
    }
    this.slotsSubject.next([...current]);
  }

  removeSlot(id: string) {
    const current = this.getSlotsSnapshot().filter(s => s.id !== id);
    this.slotsSubject.next(current);
  }

  removeSlots(ids: string[]) {
    const set = new Set(ids);
    const current = this.getSlotsSnapshot().filter(s => !set.has(s.id));
    this.slotsSubject.next(current);
  }

  setStatus(id: string, status: SlotStatus) {
    const current = this.getSlotsSnapshot();
    const idx = current.findIndex(s => s.id === id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], status };
      this.slotsSubject.next([...current]);
    }
  }

  getTodaySessionsForClinica(): { id: string; patient: string; therapist: string; type: string; time: string; status: 'scheduled' | 'completed' | 'cancelled' }[] {
    const todayIso = new Date().toISOString().slice(0, 10);
    return this.getSlotsSnapshot()
      .filter(s => s.data === todayIso && s.paciente && s.status !== 'cancelado')
      .map(s => {
        const status: 'scheduled' | 'completed' | 'cancelled' = s.status === 'cancelado' ? 'cancelled' : 'scheduled';
        return {
          id: s.id,
          patient: s.paciente || '',
          therapist: this.getProfissionalNome(s.profissionalId),
          type: this.especialidades.find(e => e.id === s.especialidadeId)?.nome || '',
          time: s.hora,
          status
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }
}