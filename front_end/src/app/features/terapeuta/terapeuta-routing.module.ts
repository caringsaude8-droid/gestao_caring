import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerapeutaHomeComponent } from './home/home.component';
import { TerapeutaAgendaComponent } from './terapeuta-agenda/terapeuta-agenda';
import { TerapeutaComponent } from './home/terapeuta-home';
import { TerapeutaVisualizarHistoricoComponent } from './terapeuta-visualizar-historico/terapeuta-visualizar-historico';

const routes: Routes = [
  { path: '', component: TerapeutaHomeComponent },
  { path: 'home', component: TerapeutaHomeComponent },
  { path: 'agenda', component: TerapeutaAgendaComponent },
  { path: 'terapeuta', component: TerapeutaComponent },
  { path: 'visualizar-historico/:id', component: TerapeutaVisualizarHistoricoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeaTerapeutaRoutingModule {}