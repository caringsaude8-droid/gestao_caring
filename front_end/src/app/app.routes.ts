import { Routes } from '@angular/router';
import { DashboardGestao } from './layouts/dashboard-gestao/dashboard-gestao';
import { TeaLayoutComponent } from './layouts/tea-layout/tea-layout';
import { DashboardComponent } from './features/gestao-caring/dashboard/dashboard';
import { LoginComponent } from './core/login/login.component';
import { HomeComponent } from './features/home';
import { TeaClinicaComponent } from './features/TEA/components/tea-clinica/tea-clinica.component';
import { TeaSelecaoClinicaComponent } from './features/TEA/components/tea-selecao-clinica/tea-selecao-clinica.component';
import { TeaDashboardComponent } from './features/TEA/components/tea-dashboard/tea-dashboard.component';
import { TeaPacientesComponent } from './features/TEA/components/tea-pacientes/tea-pacientes.component';
import { TeaCalendarioComponent } from './features/TEA/components/tea-calendario/tea-calendario.component';
import { TeaCalendarioPorPacienteComponent } from './features/TEA/components/tea-calendario-por-paciente/tea-calendario-por-paciente.component';
import { TeaCalendarioPorProfissionaisComponent } from './features/TEA/components/tea-calendario-por-profissionais/tea-calendario-por-profissionais.component';
import { TeaAgendamentoComponent } from './features/TEA/components/tea-agendamento/tea-agendamento.component';
import { TeaUsuariosComponent } from './features/TEA/components/tea-usuarios/tea-usuarios.component';
import { TeaProfissionaisComponent } from './features/TEA/components/tea-profissionais/tea-profissionais.component';
import { TeaClinicasComponent } from './features/TEA/components/tea-clinicas/tea-clinicas.component';
import { TeaCheckinPorSenhaComponent } from './features/TEA/components/tea-checkin-por-senha/tea-checkin-por-senha.component';
import { TeaCheckinEmLoteComponent } from './features/TEA/components/tea-checkin-em-lote/tea-checkin-em-lote.component';
import { TeaGestaoCheckinComponent } from './features/TEA/components/tea-gestao-checkin/tea-gestao-checkin.component';
import { TeaFilaRecepcaoComponent } from './features/TEA/components/tea-fila-recepcao/tea-fila-recepcao.component';
import { TeaPainelCheckinComponent } from './features/TEA/components/tea-painel-checkin/tea-painel-checkin.component';
import { TeaPainelAtendimentoComponent } from './features/TEA/components/tea-painel-atendimento/tea-painel-atendimento.component';
  import { TeaProntuarioEletronicoComponent } from './features/TEA/components/tea-prontuario-eletronico/tea-prontuario-eletronico.component';
  import { TeaProntuarioEletronicoVisualizacaoComponent } from './features/TEA/components/tea-prontuario-eletronico-visualizacao/tea-prontuario-eletronico-visualizacao.component';
import { TeaProntuarioListaComponent } from './features/TEA/components/tea-prontuario-lista/tea-prontuario-lista.component';
import { TeaPesquisarPacientesComponent } from './features/TEA/components/tea-pesquisar-pacientes/tea-pesquisar-pacientes.component';
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
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
      { path: 'tarefas', component: TarefasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'pacientes', component: PacientesComponent },
      { path: 'profissionais', component: ProfissionaisComponent },
      { path: 'faturamento', component: FaturamentoComponent },
      { path: 'empresas', component: EmpresasComponent },
      { path: 'convenios', component: ConveniosComponent },
      { path: 'relatorios/atendimentos', component: RelatoriosAtendimentosComponent },
      { path: 'relatorios/aniversarios', component: RelatoriosAniversariosComponent },
      { path: 'usuarios', component: UsuariosComponent },
    ]
  },
  {
    path: 'tea',
    component: TeaLayoutComponent,
    children: [
      { path: '', redirectTo: 'selecao-clinica', pathMatch: 'full' },
      { path: 'selecao-clinica', component: TeaSelecaoClinicaComponent },
      { path: 'clinica', component: TeaClinicaComponent },
      { path: 'dashboard', component: TeaDashboardComponent },
      { path: 'pacientes', component: TeaPacientesComponent },
      { path: 'calendario', component: TeaCalendarioComponent },
      { path: 'calendario-por-paciente', component: TeaCalendarioPorPacienteComponent },
      { path: 'calendario-por-profissionais', component: TeaCalendarioPorProfissionaisComponent },
      // Profissionais submenu (atalhos dedicados)
      { path: 'profissionais-calendario', component: TeaCalendarioPorProfissionaisComponent },
      { path: 'profissionais-pacientes', component: TeaPacientesComponent },
      { path: 'profissionais-prontuario', component: TeaProntuarioListaComponent },
      { path: 'agendamento', component: TeaAgendamentoComponent },
      { path: 'pesquisar-pacientes', component: TeaPesquisarPacientesComponent },
      { path: 'usuarios', component: TeaUsuariosComponent },
      { path: 'profissionais', component: TeaProfissionaisComponent },
      { path: 'clinicas', component: TeaClinicasComponent },
      { path: 'convenios', component: ConveniosComponent },
      { path: 'relatorios/atendimentos', component: RelatoriosAtendimentosComponent },
      { path: 'relatorios/aniversarios', component: RelatoriosAniversariosComponent },
      { path: 'checkin-por-senha', component: TeaCheckinPorSenhaComponent },
      { path: 'checkin-em-lote', component: TeaCheckinEmLoteComponent },
      { path: 'gestao-checkin', component: TeaGestaoCheckinComponent },
      { path: 'fila-recepcao', component: TeaFilaRecepcaoComponent },
      { path: 'painel-checkin', component: TeaPainelCheckinComponent },
      { path: 'painel-atendimento', component: TeaPainelAtendimentoComponent },
      { path: 'prontuario-eletronico', component: TeaProntuarioListaComponent },
      { path: 'prontuario-eletronico-visualizacao/:id', component: TeaProntuarioEletronicoVisualizacaoComponent },
      { path: 'prontuario-eletronico/:id', component: TeaProntuarioEletronicoComponent }
    ]
  },
  { path: '**', redirectTo: '/home' }
];
