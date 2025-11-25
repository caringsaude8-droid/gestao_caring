import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeaTerapeutaLayoutComponent } from '../../layouts/terapeuta-layout/terapeuta-layout';
import { TerapeutaHomeComponent } from './home/home.component';
// standalone route components will be lazy-loaded via `loadComponent`

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: TeaTerapeutaLayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
          { path: 'home', loadComponent: () => import('./home/terapeuta-home').then(m => m.TerapeutaComponent) },
          { path: 'agenda', loadComponent: () => import('./terapeuta-agenda/terapeuta-agenda').then(m => m.TerapeutaAgendaComponent) },
          { path: 'terapeuta', loadComponent: () => import('./home/terapeuta-home').then(m => m.TerapeutaComponent) },
          { path: 'visualizar-historico/:id', loadComponent: () => import('./terapeuta-visualizar-historico/terapeuta-visualizar-historico').then(m => m.TerapeutaVisualizarHistoricoComponent) },
          { path: 'calendario-por-terapeutas', loadComponent: () => import('./terapeuta-calendario/terapeuta-calendario').then(m => m.TerapeutaCalendarioComponent) },
          { path: 'pacientes', loadComponent: () => import('./terapeuta-pacientes/terapeuta-pacientes.component').then(m => m.TerapeutaPacientesComponent) },
          { path: 'prontuario-eletronico/:id', loadComponent: () => import('./terapeuta-prontuario-eletronico/terapeuta-prontuario-eletronico').then(m => m.TerapeutaProntuarioEletronicoComponent) },
        ]
      }
    ]),
    TeaTerapeutaLayoutComponent,
    // standalone home component (now standalone)
    TerapeutaHomeComponent,
  ],
  declarations: [],
})
export class TeaTerapeutaModule {}