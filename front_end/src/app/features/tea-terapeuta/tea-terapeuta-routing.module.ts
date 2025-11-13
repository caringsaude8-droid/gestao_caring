import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeaTerapeutaHomeComponent } from './pages/home/home.component';
import { TeaAgendaProfissionaisComponent } from './components/tea-agenda-profissionais/tea-agenda-profissionais.component';
import { TeaProfissionalComponent } from './components/tea-profissional/tea-profissional.component';
import { TeaTerapeutaVisualizarHistoricoComponent } from './components/tea-visualizar-historico/tea-visualizar-historico.component';

const routes: Routes = [
  { path: '', component: TeaTerapeutaHomeComponent },
  { path: 'home', component: TeaTerapeutaHomeComponent },
  { path: 'agenda', component: TeaAgendaProfissionaisComponent },
  { path: 'profissional', component: TeaProfissionalComponent },
  { path: 'visualizar-historico/:id', component: TeaTerapeutaVisualizarHistoricoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeaTerapeutaRoutingModule {}