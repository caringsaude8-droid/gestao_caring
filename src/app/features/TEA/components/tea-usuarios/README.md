# TEA Usuários Component

## Descrição
Componente de gestão de usuários específico para o módulo TEA. Permite criar, editar, visualizar e filtrar usuários que atuam no contexto do TEA (Transtorno do Espectro Autista).

## Estrutura

```
tea-usuarios/
├── tea-usuarios.component.ts      # Componente principal
├── tea-usuarios.component.html    # Template
├── tea-usuarios.component.css     # Estilos
├── components/
│   ├── tea-user-details-modal/    # Modal de detalhes do usuário
│   │   ├── tea-user-details-modal.component.ts
│   │   ├── tea-user-details-modal.component.html
│   │   └── tea-user-details-modal.component.css
│   └── tea-user-form-modal/       # Modal de formulário (criar/editar)
│       ├── tea-user-form-modal.component.ts
│       ├── tea-user-form-modal.component.html
│       └── tea-user-form-modal.component.css
└── README.md
```

## Funcionalidades

### Principais
- ✅ Listagem de usuários TEA
- ✅ Busca por nome ou email
- ✅ Filtros por perfil (Terapeuta, Recepção, Supervisor)
- ✅ Filtro por status (Ativo/Inativo)
- ✅ Visualização detalhada de usuário
- ✅ Criação de novo usuário
- ✅ Edição de usuário existente
- ✅ Cards estatísticos (Total, Ativos, Inativos)

### Perfis Disponíveis
- **Terapeuta**: Profissionais que realizam atendimentos
- **Recepção**: Equipe administrativa
- **Supervisor**: Responsáveis por supervisão e gestão

## Uso

### Rota
O componente está acessível através da rota `/tea/usuarios` dentro do layout TEA.

### Integração
O componente está integrado ao menu lateral da sidebar TEA e aparece como "Usuários" no menu de navegação.

## Características Visuais

### Tema
- **Cores principais**: Azul (#1e40af, #1d4ed8) - tema TEA
- **Layout**: Cards com avatar, informações básicas e ações
- **Responsivo**: Adaptado para mobile e desktop

### Badges de Perfil
- **Terapeuta**: Azul claro
- **Recepção**: Rosa
- **Supervisor**: Roxo

### Badges de Status
- **Ativo**: Verde
- **Inativo**: Vermelho

## Interface TeaUser

```typescript
interface TeaUser {
  id: string;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: 'terapeuta' | 'recepcao' | 'supervisor';
  status: 'ativo' | 'inativo';
  dataUltimoAcesso: string;
  dataCriacao: string;
  avatar?: string;
  especialidades?: string[];
  departamento?: string;
}
```

## Componentes Filhos

### TeaUserDetailsModalComponent
Modal para visualizar informações detalhadas de um usuário, incluindo:
- Dados de contato
- Informações profissionais
- Especialidades (se aplicável)
- Data de criação

### TeaUserFormModalComponent
Modal para criar ou editar usuários com validação de formulário:
- Campos obrigatórios: CPF, Nome, Email, Telefone, Perfil, Status
- Campo especialidades para terapeutas
- Departamento fixo como "TEA"

## Próximos Passos
- [ ] Integração com API backend
- [ ] Gerenciamento de permissões
- [ ] Upload de avatar
- [ ] Histórico de atividades do usuário
- [ ] Exportação de relatórios
