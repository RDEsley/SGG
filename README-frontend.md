# Sistema de Gestão de Granja - Frontend Angular

Frontend completo do Sistema de Gestão de Granja (SGG) desenvolvido em Angular com Material Design.

## Tecnologias Utilizadas

- **Angular 20** - Framework principal
- **Angular Material** - Componentes UI
- **ng2-charts** - Visualização de dados
- **Supabase** - Backend e autenticação
- **ngx-mask** - Máscaras de input
- **RxJS** - Programação reativa

## Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase (gratuita)
- Angular CLI instalado globalmente (opcional)

## Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `src/app/services/supabase-client.ts` e configure suas credenciais do Supabase:

```typescript
const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseAnonKey = 'sua-chave-anon';
```

**Como obter as credenciais:**

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Crie um novo projeto
4. Vá em Settings > API
5. Copie a URL do projeto e a chave `anon/public`

### 3. Executar o Projeto

```bash
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

### 4. Build para Produção

```bash
npm run build
```

Os arquivos de build estarão em `dist/demo`

## Estrutura do Projeto

```
src/
├── app/
│   ├── pages/              # Páginas principais
│   │   ├── dashboard/      # Dashboard com gráficos
│   │   ├── lotes-ovos/     # Gestão de lotes de ovos
│   │   ├── incubacao/      # Gestão de incubação
│   │   └── lotes-aves/     # Gestão de lotes de aves
│   ├── services/           # Serviços de API
│   │   ├── auth.service.ts
│   │   ├── lotes-ovos.service.ts
│   │   ├── incubacao.service.ts
│   │   ├── lotes-aves.service.ts
│   │   └── financeiro.service.ts
│   ├── shared/             # Componentes compartilhados
│   │   ├── confirm-dialog.component.ts
│   │   ├── snackbar.service.ts
│   │   └── masks.pipe.ts
│   ├── app.component.ts    # Componente raiz
│   ├── app.module.ts       # Módulo principal
│   └── app-routing.module.ts # Rotas
├── assets/
│   └── i18n/               # Arquivos de tradução
├── environments/           # Configurações de ambiente
└── styles.css              # Estilos globais
```

## Funcionalidades Implementadas

### Dashboard
- Visualização de receitas, despesas e lucro líquido
- Gráficos de receitas vs despesas ao longo do tempo
- Taxa de sucesso de eclosão
- Cards com estatísticas principais

### Lotes de Ovos
- Listagem paginada de lotes
- Wizard de cadastro em 3 etapas
- Edição com validação de quantidade alocada
- Validações reativas em tempo real
- Cálculo automático de valores

### Incubação
- Visualização de chocadeiras e ocupação
- Alocação de ovos com validação de capacidade
- Transferência entre chocadeiras
- Finalização de incubação com registro de nascimentos
- Indicadores visuais de capacidade

### Lotes de Aves
- Listagem de lotes ativos
- Cálculo de mortalidade e taxa de sobrevivência
- Registro de mortalidade com motivo
- Histórico detalhado por lote
- Bloqueio de edição de quantidade inicial (UI)

## Validações Implementadas

### Lotes de Ovos
- Quantidade mínima: 1
- Preço unitário mínimo: 0.01
- Fornecedor obrigatório (máx. 200 caracteres)
- Observações (máx. 500 caracteres)
- Não permite reduzir quantidade abaixo do alocado

### Incubação
- Validação de capacidade disponível
- Quantidade dentro dos limites da chocadeira
- Temperatura (30°C - 45°C)
- Umidade (0% - 100%)
- Data de previsão posterior à entrada

### Lotes de Aves
- Quantidade inicial não pode ser reduzida
- Mortalidade não pode exceder quantidade atual
- Motivo obrigatório para mortalidade

## Integrações com Supabase

O sistema está totalmente integrado com Supabase:

- **Autenticação**: Preparado para login/logout (implementação futura)
- **Banco de Dados**: Todas as operações CRUD através do Supabase Client
- **Queries**: Uso de `.select()`, `.insert()`, `.update()`, `.delete()`
- **Relacionamentos**: Joins automáticos entre tabelas
- **Row Level Security**: Preparado para políticas de segurança

## Comandos Úteis

```bash
# Desenvolvimento
npm start                # Inicia dev server na porta 4200
npm run build            # Build de produção
ng generate component    # Gera novo componente
ng generate service      # Gera novo serviço

# Testes
ng test                  # Executa testes unitários
ng e2e                   # Executa testes e2e
```

## Troubleshooting

### Erro: "Cannot find module '@angular/...'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Supabase connection failed"
- Verifique se as credenciais em `supabase-client.ts` estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique a conexão com internet

### Erro: "Table does not exist"
- Certifique-se de que executou as migrations no Supabase
- Verifique se as tabelas foram criadas corretamente
- Confirme que as políticas RLS estão configuradas

## Próximos Passos

1. **Implementar autenticação**
   - Criar telas de login/cadastro
   - Implementar guards de rota
   - Adicionar logout

2. **Adicionar módulos restantes**
   - Vendas
   - Despesas
   - Configurações

3. **Melhorias de UX**
   - Loading states mais elaborados
   - Animações de transição
   - Feedback visual aprimorado

4. **Testes**
   - Testes unitários dos componentes
   - Testes de integração com Supabase
   - Testes e2e dos fluxos principais

## Suporte

Para dúvidas ou problemas:
- Verifique a documentação do Angular: https://angular.io/docs
- Documentação do Supabase: https://supabase.com/docs
- Material Design: https://material.angular.io

## Licença

Este projeto é privado e proprietário.
