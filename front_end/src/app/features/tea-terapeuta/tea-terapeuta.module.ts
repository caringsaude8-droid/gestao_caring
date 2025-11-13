import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeaTerapeutaLayoutComponent } from '../../layouts/tea-terapeuta-layout/tea-terapeuta-layout';
import { TeaTerapeutaHomeComponent } from './pages/home/home.component';
import { TeaAgendaProfissionaisComponent } from './components/tea-agenda-profissionais/tea-agenda-profissionais.component';
import { TeaProfissionalComponent } from './components/tea-profissional/tea-profissional.component';
import { TeaTerapeutaVisualizarHistoricoComponent } from './components/tea-visualizar-historico/tea-visualizar-historico.component';
import { TeaTerapeutaCalendarioPorProfissionaisComponent } from './components/tea-calendario-por-profissionais/tea-calendario-por-profissionais.component';
import { TeaTerapeutaProntuarioEletronicoComponent } from './components/tea-prontuario-eletronico/tea-prontuario-eletronico.component';
import { TeaTerapeutaProntuarioListaComponent } from './components/tea-prontuario-lista/tea-prontuario-lista.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: TeaTerapeutaLayoutComponent,
        children: [
          { path: '', component: TeaTerapeutaHomeComponent },
          { path: 'home', component: TeaTerapeutaHomeComponent },
          { path: 'agenda', component: TeaAgendaProfissionaisComponent },
          { path: 'profissional', component: TeaProfissionalComponent },
          { path: 'visualizar-historico/:id', component: TeaTerapeutaVisualizarHistoricoComponent },
          { path: 'calendario-por-profissionais', component: TeaTerapeutaCalendarioPorProfissionaisComponent },
          { path: 'prontuario-eletronico/:id', component: TeaTerapeutaProntuarioEletronicoComponent },
          { path: 'pacientes', component: TeaTerapeutaProntuarioListaComponent },
        ]
      }
    ]),
    TeaTerapeutaHomeComponent,
    TeaTerapeutaLayoutComponent,
    TeaTerapeutaCalendarioPorProfissionaisComponent,
    TeaTerapeutaProntuarioEletronicoComponent,
    TeaTerapeutaVisualizarHistoricoComponent,
    TeaTerapeutaProntuarioListaComponent,
  ],
})
export class TeaTerapeutaModule {}