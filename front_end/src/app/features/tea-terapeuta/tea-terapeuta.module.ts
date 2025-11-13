import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeaTerapeutaLayoutComponent } from '../../layouts/tea-terapeuta-layout/tea-terapeuta-layout';
import { TerapeutaHomeComponent } from './pages/home/home.component';
import { TerapeutaAgendaProfissionaisComponent } from './components/terapeuta-agenda-profissionais/terapeuta-agenda-profissionais.component';
import { TerapeutaProfissionalComponent } from './components/terapeuta-profissional/terapeuta-profissional.component';
import { TerapeutaVisualizarHistoricoComponent } from './components/terapeuta-visualizar-historico/terapeuta-visualizar-historico.component';
import { TerapeutaCalendarioPorProfissionaisComponent } from './components/terapeuta-calendario-por-profissionais/terapeuta-calendario-por-profissionais.component';
import { TerapeutaProntuarioEletronicoComponent } from './components/terapeuta-prontuario-eletronico/terapeuta-prontuario-eletronico.component';
import { TerapeutaProntuarioListaComponent } from './components/terapeuta-prontuario-lista/terapeuta-prontuario-lista.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: TeaTerapeutaLayoutComponent,
        children: [
          { path: '', component: TerapeutaHomeComponent },
          { path: 'home', component: TerapeutaHomeComponent },
          { path: 'agenda', component: TerapeutaAgendaProfissionaisComponent },
          { path: 'profissional', component: TerapeutaProfissionalComponent },
          { path: 'visualizar-historico/:id', component: TerapeutaVisualizarHistoricoComponent },
          { path: 'calendario-por-profissionais', component: TerapeutaCalendarioPorProfissionaisComponent },
          { path: 'prontuario-eletronico/:id', component: TerapeutaProntuarioEletronicoComponent },
          { path: 'pacientes', component: TerapeutaProntuarioListaComponent },
        ]
      }
    ]),
    TerapeutaHomeComponent,
    TeaTerapeutaLayoutComponent,
    TerapeutaCalendarioPorProfissionaisComponent,
    TerapeutaProntuarioEletronicoComponent,
    TerapeutaVisualizarHistoricoComponent,
    TerapeutaProntuarioListaComponent,
  ],
})
export class TeaTerapeutaModule {}