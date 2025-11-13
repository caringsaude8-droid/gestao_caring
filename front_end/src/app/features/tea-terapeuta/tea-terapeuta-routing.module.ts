import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerapeutaHomeComponent } from './pages/home/home.component';
import { TerapeutaAgendaProfissionaisComponent } from './components/terapeuta-agenda-profissionais/terapeuta-agenda-profissionais.component';
import { TerapeutaProfissionalComponent } from './components/terapeuta-profissional/terapeuta-profissional.component';
import { TerapeutaVisualizarHistoricoComponent } from './components/terapeuta-visualizar-historico/terapeuta-visualizar-historico.component';

const routes: Routes = [
  { path: '', component: TerapeutaHomeComponent },
  { path: 'home', component: TerapeutaHomeComponent },
  { path: 'agenda', component: TerapeutaAgendaProfissionaisComponent },
  { path: 'profissional', component: TerapeutaProfissionalComponent },
  { path: 'visualizar-historico/:id', component: TerapeutaVisualizarHistoricoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeaTerapeutaRoutingModule {}