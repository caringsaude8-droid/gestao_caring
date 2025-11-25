import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { authGuard } from './core/guards/auth-guard';
import { DashboardGestao } from './layouts/dashboard-gestao/dashboard-gestao';
import { TeaLayoutComponent } from './layouts/tea-layout/tea-layout';
import { DashboardComponent } from './features/gestao-caring/dashboard/dashboard';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './features/home';
// TeaSelecaoClinicaComponent was removed from routes; consolidated into TeaClinicasComponent
import { TeaPacientesComponent } from './features/TEA/components/tea-pacientes/tea-pacientes.component';
import { TeaCalendarioComponent } from './features/TEA/components/tea-calendario/tea-calendario.component';
import { TeaCalendarioPorPacienteComponent } from './features/TEA/components/tea-calendario/tea-calendario-paciente/tea-calendario-paciente';
import { TeaCalendarioTerapeutasComponent } from './features/TEA/components/tea-calendario/tea-calendario-terapeuta/tea-calendario-terapeuta';
import { TeaAgendamentoComponent } from './features/TEA/components/tea-agendamento/tea-agendamento.component';
import { TeaUsuariosComponent } from './features/TEA/components/tea-usuarios/tea-usuarios.component';
import { TeaHomeComponent } from './features/TEA/components/tea-home/tea-home.component';
import { TeaSelecaoClinicaComponent } from './features/TEA/components/tea-selecao-clinica/tea-selecao-clinica';
import { TeaTerapeutaCadastroComponent } from './features/TEA/components/tea-terapeuta-cadastro/tea-terapeuta-cadastro.component';





import { TeaPainelAtendimentoComponent } from './features/TEA/components/tea-painel-atendimento/tea-painel-atendimento.component';
  import { TeaProntuarioEletronicoComponent } from './features/TEA/components/tea-prontuario-eletronico/tea-prontuario-eletronico.component';
  


import { CalendarioComponent } from './features/gestao-caring/calendario/calendario';
import { ConfiguracoesComponent } from './features/gestao-caring/configuracoes/configuracoes';
import { TarefasComponent } from './features/gestao-caring/tarefas/tarefas';
import { ClientesComponent } from './features/gestao-caring/clientes/clientes';
import { PacientesComponent } from './features/gestao-caring/pacientes/pacientes';
import { FaturamentoComponent } from './features/gestao-caring/faturamento/faturamento';
import { EmpresasComponent } from './features/gestao-caring/empresas/empresas';
import { ConveniosComponent } from './features/gestao-caring/convenios/convenios';
import { RelatoriosAtendimentosComponent } from './features/gestao-caring/relatorios/relatorios-atendimentos';
import { RelatoriosAniversariosComponent } from './features/gestao-caring/relatorios/relatorios-aniversarios';
import { ProfissionaisComponent } from './features/gestao-caring/profissionais/profissionais';
import { UsuariosComponent } from './features/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: LoginComponent },
  {
    path: '',
    component: DashboardGestao,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'calendario', component: CalendarioComponent, canActivate: [AuthGuard] },
      { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard] },
      { path: 'tarefas', component: TarefasComponent, canActivate: [AuthGuard] },
      { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
      { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
      { path: 'profissionais', component: ProfissionaisComponent, canActivate: [AuthGuard] },
      { path: 'faturamento', component: FaturamentoComponent, canActivate: [AuthGuard] },
      { path: 'empresas', component: EmpresasComponent, canActivate: [AuthGuard] },
      { path: 'convenios', component: ConveniosComponent, canActivate: [AuthGuard] },
      { path: 'relatorios/atendimentos', component: RelatoriosAtendimentosComponent, canActivate: [AuthGuard] },
      { path: 'relatorios/aniversarios', component: RelatoriosAniversariosComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'tea',
    component: TeaLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'selecao-clinica', pathMatch: 'full' },
      { path: 'home', component: TeaHomeComponent, canActivate: [authGuard] },
      { path: 'clinicas', loadComponent: () => import('./features/TEA/components/tea-clinicas/tea-clinicas.component').then(m => m.TeaClinicasComponent), canActivate: [authGuard] },
      { path: 'selecao-clinica', component: TeaSelecaoClinicaComponent, canActivate: [authGuard] },
      // { path: 'clinica', component: TeaClinicaComponent, canActivate: [authGuard] }, // removido, agora 'home' é o dashboard principal
      { path: 'pacientes', component: TeaPacientesComponent, canActivate: [authGuard] },
      { path: 'calendario', component: TeaCalendarioComponent, canActivate: [authGuard] },
      { path: 'calendario-por-paciente', component: TeaCalendarioPorPacienteComponent, canActivate: [authGuard] },
      { path: 'calendario-por-terapeutas', component: TeaCalendarioTerapeutasComponent, canActivate: [authGuard] },
      { path: 'terapeutas-calendario', component: TeaCalendarioTerapeutasComponent, canActivate: [authGuard] },
      { path: 'terapeutas-pacientes', component: TeaPacientesComponent, canActivate: [authGuard] },
      { path: 'agendamento', component: TeaAgendamentoComponent, canActivate: [authGuard] },
      { path: 'usuarios', component: TeaUsuariosComponent, canActivate: [authGuard] },
      { path: 'convenios', component: ConveniosComponent, canActivate: [authGuard] },
      { path: 'relatorios/atendimentos', component: RelatoriosAtendimentosComponent, canActivate: [authGuard] },
      { path: 'relatorios/aniversarios', component: RelatoriosAniversariosComponent, canActivate: [authGuard] },
      { path: 'painel-atendimento', component: TeaPainelAtendimentoComponent, canActivate: [authGuard] },
      { path: 'prontuario-eletronico', component: TeaProntuarioEletronicoComponent, canActivate: [authGuard] },
      { path: 'prontuario-eletronico-visualizacao/:id', component: TeaProntuarioEletronicoComponent, canActivate: [authGuard] },
      { path: 'prontuario-eletronico/:id', component: TeaProntuarioEletronicoComponent, canActivate: [authGuard] },
      { path: 'terapeuta-cadastro', component: TeaTerapeutaCadastroComponent, canActivate: [authGuard] },
      { path: 'terapeuta', loadChildren: () => import('./features/terapeuta/terapeuta.module').then(m => m.TeaTerapeutaModule), canActivate: [authGuard] }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
