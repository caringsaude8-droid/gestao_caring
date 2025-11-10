# Componentes Reutilizáveis de Usuário

Este diretório contém componentes modulares e reutilizáveis para gerenciamento de usuários no sistema.

## 📋 Componentes Disponíveis

### 1. UserDetailsModalComponent (`user-details-modal/`)
**Modal para exibir detalhes completos de um usuário**

#### Uso:
```html
<app-user-details-modal 
  [show]="showUserDetailsModal"
  [user]="selectedUser"
  (close)="closeUserDetailsModal()"
  (editUser)="editUser($event)">
</app-user-details-modal>
```

#### Propriedades:
- `show: boolean` - Controla a visibilidade do modal
- `user: User | null` - Dados do usuário a ser exibido

#### Eventos:
- `close()` - Emitido quando o modal é fechado
- `editUser(user: User)` - Emitido quando o botão editar é clicado

#### Características:
- ✅ Exibição completa de dados do usuário
- ✅ Avatar personalizado com iniciais
- ✅ Badges de perfil e status
- ✅ Grade de informações organizadas
- ✅ Lista de especialidades (quando aplicável)
- ✅ Design responsivo
- ✅ Animações suaves

---

### 2. UserFormModalComponent (`user-form-modal/`)
**Modal com formulário para criar e editar usuários**

#### Uso:
```html
<app-user-form-modal
  [show]="showUserFormModal"
  [user]="selectedUser"
  [mode]="formMode"
  (close)="closeUserFormModal()"
  (save)="onSaveUser($event)">
</app-user-form-modal>
```

#### Propriedades:
- `show: boolean` - Controla a visibilidade do modal
- `user: User | null` - Dados do usuário (para edição) ou null (para criação)
- `mode: 'create' | 'edit'` - Define se é criação ou edição

#### Eventos:
- `close()` - Emitido quando o modal é fechado
- `save(user: User)` - Emitido quando o formulário é submetido com dados válidos

#### Características:
- ✅ Formulário reativo com validação
- ✅ Campos obrigatórios marcados com *
- ✅ Validação em tempo real
- ✅ Seção de especialidades dinâmica (aparece apenas para terapeutas)
- ✅ Adição/remoção de especialidades por tags
- ✅ Layout responsivo
- ✅ Estados de loading e validação
- ✅ Suporte para Enter em campos de especialidade

#### Campos do Formulário:
**Informações Básicas:**
- Nome Completo (obrigatório)
- Email (obrigatório, com validação)
- Telefone (obrigatório)
- Departamento (opcional)

**Perfil e Permissões:**
- Perfil (obrigatório): Admin, Terapeuta, Recepção, Supervisor
- Status (obrigatório): Ativo, Inativo

**Especialidades:**
- Lista dinâmica de especialidades (apenas para terapeutas)
- Adição via input + botão ou Enter
- Remoção individual por tag

---

## 🔧 Como Integrar em Outros Módulos

### 1. Importe os componentes:
```typescript
import { UserDetailsModalComponent } from './components/user-details-modal/user-details-modal.component';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';

@Component({
  // ...
  imports: [CommonModule, FormsModule, UserDetailsModalComponent, UserFormModalComponent],
  // ...
})
```

### 2. Adicione propriedades de controle:
```typescript
export class SeuComponent {
  showUserDetailsModal: boolean = false;
  showUserFormModal: boolean = false;
  formMode: 'create' | 'edit' = 'create';
  selectedUser: User | null = null;

  // Métodos de controle
  openUserDetails(user: User): void {
    this.selectedUser = user;
    this.showUserDetailsModal = true;
  }

  openCreateForm(): void {
    this.formMode = 'create';
    this.selectedUser = null;
    this.showUserFormModal = true;
  }

  openEditForm(user: User): void {
    this.formMode = 'edit';
    this.selectedUser = user;
    this.showUserFormModal = true;
  }

  closeModals(): void {
    this.showUserDetailsModal = false;
    this.showUserFormModal = false;
    this.selectedUser = null;
  }

  onSaveUser(userData: User): void {
    // Implementar lógica de save (API call, etc.)
    console.log('Dados salvos:', userData);
    this.closeModals();
  }
}
```

### 3. Use no template:
```html
<!-- Seus botões/triggers -->
<button (click)="openCreateForm()">Novo Usuário</button>
<button (click)="openUserDetails(user)">Ver Detalhes</button>
<button (click)="openEditForm(user)">Editar</button>

<!-- Componentes modais -->
<app-user-details-modal 
  [show]="showUserDetailsModal"
  [user]="selectedUser"
  (close)="closeModals()"
  (editUser)="openEditForm($event)">
</app-user-details-modal>

<app-user-form-modal
  [show]="showUserFormModal"
  [user]="selectedUser"
  [mode]="formMode"
  (close)="closeModals()"
  (save)="onSaveUser($event)">
</app-user-form-modal>
```

---

## 🎨 Personalização

### CSS Customizado:
Os componentes seguem o design system do projeto. Para customizar:

1. **Cores principais**: Ajuste as variáveis CSS no arquivo de estilos
2. **Espaçamentos**: Modifique os valores de padding/margin conforme necessário
3. **Breakpoints**: Responsive design configurado para 768px e 480px

### Validações:
Para adicionar validações customizadas, modifique o método `isFormValid()` no UserFormModalComponent.

### Campos adicionais:
Para adicionar novos campos ao formulário:
1. Adicione a propriedade na interface User
2. Inclua o campo no template HTML
3. Adicione a inicialização em `resetForm()`
4. Atualize a validação se necessário

---

## 🚀 Vantagens da Arquitetura

- **Reutilização**: Use os mesmos componentes em diferentes módulos
- **Manutenção**: Alterações centralizadas nos componentes
- **Consistência**: Design e comportamento uniformes
- **Testabilidade**: Componentes isolados e testáveis
- **Performance**: Lazy loading e otimização de bundle
- **Acessibilidade**: Navegação por teclado e ARIA labels

---

## 📝 Notas de Desenvolvimento

- Os componentes são **standalone** (Angular 15+)
- Utilizam **FormsModule** para formulários template-driven
- Eventos seguem o padrão **@Input/@Output**
- CSS otimizado para **responsividade**
- Animações implementadas com **CSS transitions**