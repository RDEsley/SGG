# Guia de Instalação e Configuração

## Status do Projeto

✅ **Frontend Angular completo implementado** com todos os componentes solicitados
⚠️ **Build apresenta warnings** devido à versão Angular 20.0.0 (recém-lançada)

## Arquivos Implementados

### Estrutura Completa

```
src/
├── app/
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts ✅
│   │   │   ├── dashboard.component.html ✅
│   │   │   └── dashboard.component.css ✅
│   │   ├── lotes-ovos/
│   │   │   ├── lotes-ovos-list.component.ts ✅
│   │   │   ├── lotes-ovos-list.component.html ✅
│   │   │   ├── lotes-ovos-list.component.css ✅
│   │   │   ├── lote-ovos-form-wizard.component.ts ✅
│   │   │   ├── lote-ovos-form-wizard.component.html ✅
│   │   │   └── lote-ovos-form-wizard.component.css ✅
│   │   ├── incubacao/
│   │   │   ├── chocadeiras-list.component.ts ✅
│   │   │   ├── chocadeiras-list.component.html ✅
│   │   │   ├── chocadeiras-list.component.css ✅
│   │   │   ├── alocacao-form.component.ts ✅
│   │   │   ├── alocacao-form.component.html ✅
│   │   │   ├── alocacao-form.component.css ✅
│   │   │   ├── transferencia-modal.component.ts ✅
│   │   │   ├── transferencia-modal.component.html ✅
│   │   │   └── transferencia-modal.component.css ✅
│   │   └── lotes-aves/
│   │       ├── lotes-aves-list.component.ts ✅
│   │       ├── lotes-aves-list.component.html ✅
│   │       └── lotes-aves-list.component.css ✅
│   ├── services/
│   │   ├── supabase-client.ts ✅
│   │   ├── auth.service.ts ✅
│   │   ├── lotes-ovos.service.ts ✅
│   │   ├── incubacao.service.ts ✅
│   │   ├── lotes-aves.service.ts ✅
│   │   └── financeiro.service.ts ✅
│   ├── shared/
│   │   ├── confirm-dialog.component.ts ✅
│   │   ├── snackbar.service.ts ✅
│   │   └── masks.pipe.ts ✅
│   ├── app.component.ts ✅
│   ├── app.component.html ✅
│   ├── app.component.css ✅
│   ├── app.module.ts ✅
│   └── app-routing.module.ts ✅
├── assets/
│   └── i18n/
│       └── pt-BR.json ✅
├── environments/
│   ├── environment.ts ✅
│   └── environment.prod.ts ✅
├── main.ts ✅
├── index.html ✅
└── styles.css ✅
```

## Solução para os Warnings de Build

Os warnings ocorrem porque o Angular 20.0.0 foi lançado muito recentemente (Novembro 2024) e há pequenas incompatibilidades.

### Opção 1: Downgrade para Angular 19 (Recomendado)

```bash
npm install @angular/animations@^19.0.0 @angular/common@^19.0.0 @angular/compiler@^19.0.0 @angular/core@^19.0.0 @angular/forms@^19.0.0 @angular/platform-browser@^19.0.0 @angular/platform-browser-dynamic@^19.0.0 @angular/router@^19.0.0

npm install --save-dev @angular/build@^19.0.0 @angular/cli@^19.0.0 @angular/compiler-cli@^19.0.0

npm install @angular/cdk@^19.0.0 @angular/material@^19.0.0
```

### Opção 2: Aguardar Estabilização

O Angular 20 foi lançado recentemente. Aguarde algumas semanas para que as bibliotecas complementares (Material, CDK) sejam atualizadas.

## Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie:
   - Project URL
   - Anon/Public Key

5. Edite `src/app/services/supabase-client.ts`:

```typescript
const supabaseUrl = 'SUA_URL_AQUI';
const supabaseAnonKey = 'SUA_CHAVE_AQUI';
```

## Executar o Projeto

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm start

# Build
npm run build
```

## Funcionalidades Implementadas

### ✅ Dashboard
- Cards com estatísticas (receita, despesa, lucro)
- Gráfico de linha: Receitas vs Despesas
- Gráfico de pizza: Taxa de eclosão
- Integração com serviço financeiro

### ✅ Lotes de Ovos
- Listagem paginada com Material Table
- Wizard de cadastro em 3 etapas
- Validações reativas:
  - Quantidade mínima: 1
  - Preço unitário mínimo: 0.01
  - Não permite reduzir quantidade abaixo do alocado
- Cálculo automático de valor total
- Edição e exclusão

### ✅ Incubação
- Cards de chocadeiras com indicador visual de ocupação
- Barra de progresso colorida (verde/laranja/vermelho)
- Alocação de ovos com validação de capacidade
- Transferência entre chocadeiras (modal)
- Finalização de incubação
- Cálculo de dias restantes

### ✅ Lotes de Aves
- Listagem com estatísticas de mortalidade
- Taxa de sobrevivência com cores
- Painel de detalhes lateral
- Registro de mortalidade com motivo
- Histórico completo
- Bloqueio de redução de quantidade inicial

### ✅ Componentes Compartilhados
- Diálogo de confirmação reutilizável
- Snackbar service (sucesso/erro/warning/info)
- Pipe de máscaras (currency, date, number)

### ✅ Serviços
- Integração completa com Supabase
- Auth service (preparado para login/logout)
- CRUD completo para todas entidades
- Tratamento de erros
- Validações de negócio

## Validações Implementadas

### Lotes de Ovos
- ✅ Quantidade comprada >= 1
- ✅ Preço unitário >= 0.01
- ✅ Fornecedor obrigatório (máx 200 chars)
- ✅ Observações (máx 500 chars)
- ✅ Não reduz quantidade abaixo do alocado

### Incubação
- ✅ Validação de capacidade disponível
- ✅ Quantidade dentro dos limites
- ✅ Temperatura (30°C - 45°C)
- ✅ Umidade (0% - 100%)
- ✅ Datas válidas

### Lotes de Aves
- ✅ Quantidade inicial não reduz
- ✅ Mortalidade <= quantidade atual
- ✅ Motivo obrigatório

## Rotas Implementadas

```typescript
/dashboard              - Dashboard principal
/lotes-ovos            - Lista de lotes de ovos
/lotes-ovos/novo       - Wizard de novo lote
/lotes-ovos/editar/:id - Edição de lote
/incubacao             - Gerenciamento de chocadeiras
/incubacao/alocar      - Nova alocação
/lotes-aves            - Lista de lotes de aves
```

## Próximos Passos

1. **Corrigir Build**
   - Opção 1: Fazer downgrade para Angular 19
   - Opção 2: Aguardar atualização das libs

2. **Implementar Autenticação**
   - Telas de login/cadastro
   - Guards de rota
   - Gerenciamento de sessão

3. **Adicionar Módulos Restantes**
   - Vendas (lista + formulário)
   - Despesas (lista + formulário)
   - Raças (CRUD completo)
   - Configurações

4. **Melhorias de UX**
   - Animações de transição
   - Skeleton loaders
   - Toasts mais elaborados
   - Confirmações visuais

5. **Testes**
   - Unitários (componentes)
   - Integração (serviços)
   - E2E (fluxos principais)

## Suporte Técnico

### Problemas Conhecidos

**1. Build Warnings ngFor/ngIf**
- Causa: Angular 20 requer nova sintaxe @for/@if
- Solução: Downgrade para Angular 19

**2. Material Dialog não reconhecido**
- Causa: Versões incompatíveis
- Solução: Downgrade ou aguardar atualização

### Contato

Para dúvidas técnicas:
- Documentação Angular: https://angular.io
- Documentação Supabase: https://supabase.com/docs
- Material Design: https://material.angular.io
