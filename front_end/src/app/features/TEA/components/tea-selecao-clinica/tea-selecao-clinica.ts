import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeaHomeService, Clinica } from '../../services/tea-home.service';
import { Inject } from '@angular/core';
@Component({
  selector: 'app-tea-selecao-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tea-selecao-clinica.component.html',
  styleUrls: ['./tea-selecao-clinica.component.css']
})
export class TeaSelecaoClinicaComponent implements OnInit {
    clinicaSelecionadaMsg: string = '';
  clinicas: Clinica[] = [];
  selectedClinicaId: string = '';

  constructor(
    @Inject(TeaHomeService) private homeService: TeaHomeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Verifica se usuário já tem clínica vinculada (teaCliId)
    const authData = localStorage.getItem('auth');
    let teaCliId: number | null = null;
    
    if (authData) {
      try {
        const user = JSON.parse(authData);
        teaCliId = user.teaCliId;
      } catch (e) {
        console.error('Erro ao parsear dados do usuário:', e);
      }
    }

    // Se tem teaCliId, seleciona automaticamente e redireciona
    if (teaCliId) {
      localStorage.setItem('selectedClinica', String(teaCliId));
      console.log('[DEBUG] Clínica selecionada automaticamente via teaCliId:', teaCliId);
      this.router.navigate(['/tea/home']);
      return;
    }

    // Caso contrário, limpa selectedClinica e carrega lista para seleção manual
    localStorage.removeItem('selectedClinica');
    this.homeService.getClinicas().subscribe({
      next: (clinicas: Clinica[]) => {
        console.log('[DEBUG] Clínicas recebidas da API:', clinicas);
        this.clinicas = clinicas;
      },
      error: (err: any) => {
        console.error('Erro ao carregar clínicas:', err);
      }
    });
  }

  acessar(): void {
    const clinica = this.clinicas.find(c => String(c.id) === String(this.selectedClinicaId));
    if (!clinica) return;
    try {
      localStorage.setItem('selectedClinica', String(clinica.id));
      console.log('[DEBUG] selectedClinica salvo no localStorage:', String(clinica.id));
    } catch (e) {
      console.error('[DEBUG] Falha ao salvar selectedClinica no localStorage:', e);
    }
    this.clinicaSelecionadaMsg = `Clínica "${clinica.nome}" selecionada com sucesso!`;
    setTimeout(() => {
      this.clinicaSelecionadaMsg = '';
      this.router.navigate(['/tea/home']);
    }, 1200);
  }
}