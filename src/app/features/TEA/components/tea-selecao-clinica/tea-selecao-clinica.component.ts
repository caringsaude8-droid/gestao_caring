import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeaClinicasService, Clinica } from '../../services/tea-clinicas.service';

@Component({
  selector: 'app-tea-selecao-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-selecao-clinica.component.html',
  styleUrls: ['./tea-selecao-clinica.component.css']
})
export class TeaSelecaoClinicaComponent implements OnInit {
  clinicas: Clinica[] = [];
  selectedClinicaId: string = '';

  constructor(private clinicasService: TeaClinicasService, private router: Router) {}

  ngOnInit(): void {
    this.clinicas = this.clinicasService.getClinicas();
    // Se já há clínica selecionada em sessão prévia, manter seleção
    const stored = localStorage.getItem('teaClinicaSelecionada');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.selectedClinicaId = parsed?.id || '';
      } catch {}
    }
  }

  acessar(): void {
    const clinica = this.clinicas.find(c => c.id === this.selectedClinicaId);
    if (!clinica) return;
    localStorage.setItem('teaClinicaSelecionada', JSON.stringify({ id: clinica.id, nome: clinica.nome }));
    this.router.navigate(['/tea/clinica']);
  }
}