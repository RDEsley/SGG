
# Sistema de Gerenciamento de Granja (SGG)

## Visão Geral
O **Sistema de Gerenciamento de Granja (SGG)** é um protótipo pensado para controlar de forma prática e objetiva o ciclo de produção de aves — desde a aquisição de ovos, passando pela incubação, até a criação e venda das aves. O sistema foca em rastreabilidade por **lote**, permitindo análise financeira por lote (receita, custo e lucro) e o registro de eventos produtivos (mortalidade, despesas, vendas).

Este repositório contém o design conceitual, o modelo de dados e tecnologias propostas para protótipo acadêmico.

---

## Principais Funcionalidades
- Cadastro e controle de **lotes de ovos**, incluindo custo inicial e fornecedor.  
- Criação e acompanhamento de **lotes de incubação** (associação entre lote de ovos e chocadeira).  
- Geração automática de **lotes de aves** ao final da incubação.  
- Registro de **mortalidade** e atualização automática da quantidade disponível por lote.  
- Vinculação de **despesas** (ração, vacinas, energia) a lotes para cálculo de custo detalhado.  
- Registro de **vendas** com atualização de estoque e cálculo de receita.  
- **Dashboard** com resumo financeiro (gasto total, receita total, lucro total e lucro por lote) e indicadores de status.

---

## Conceito Central: Lote
A unidade central do sistema é o **lote**. Todas as operações (custos, perdas, receitas) são associadas a um lote específico, o que facilita o cálculo de rentabilidade e a rastreabilidade completa do ciclo produtivo.

Tipos de lote:
- **Lote de Ovos** — ovos adquiridos.  
- **Lote de Incubação** — ovos alocados para uma chocadeira.  
- **Lote de Aves** — aves nascidas após incubação.

---

## Cálculos Financeiros
Os indicadores financeiros por lote são calculados conforme:
- **Receita Total do Lote** = soma(valor_total_venda) das vendas vinculadas ao lote.  
- **Custo Total do Lote** = custo inicial dos ovos + soma(despesas vinculadas ao lote).  
- **Lucro do Lote** = Receita Total – Custo Total.

---

## Modelo de Dados (resumo)
Entidades principais (campos principais):
- `racas` (id_raca PK, nome_raca)  
- `lotes_ovos` (id_lote_ovos PK, fk_id_raca, data_compra, quantidade_comprada, valor_unitario_pago, custo_total, fornecedor)  
- `chocadeiras` (id_chocadeira PK, nome_identificacao, capacidade)  
- `lotes_incubacao` (id_lote_incubacao PK, fk_id_lote_ovos, fk_id_chocadeira, data_inicio, data_final, quantidade_ovos, quantidade_fracasso, status)  
- `lotes_aves` (id_lote_aves PK, fk_id_lote_incubacao, fk_id_raca, data_nascimento, quantidade_inicial, quantidade_atual, status)  
- `registros_mortalidade` (id_registro_morte PK, fk_id_lote_aves, data_ocorrencia, quantidade, motivo)  
- `despesas` (id_despesa PK, fk_id_lote_aves opcional, tipo_despesa, descricao, data_despesa, valor_gasto)  
- `vendas` (id_venda PK, fk_id_lote_aves, data_venda, quantidade_vendida, valor_unitario_venda, valor_total_venda, cliente opcional)

---

## Tecnologias Utilizadas e Função no Projeto
- **Banco de dados: Supabase (Postgres + Auth)**  
  - Armazena todas as tabelas do sistema (lotes, despesas, vendas, etc.).  
  - Fornece autenticação (Supabase Auth) para gerenciar usuários e acesso ao sistema.  
  - Permite uso de SQL, triggers e políticas RLS se necessário.

- **Backend: Node.js + Express**  
  - Implementa regras de negócio (validações complexas, workflows de incubação, cálculos agregados).  
  - Faz a comunicação segura com o Supabase usando a `service_role` (quando necessário) e expõe uma API REST/Serverless para o frontend.  
  - Autentica tokens JWT provenientes do Supabase.

- **Frontend: HTML / CSS / Vanilla JS**  
  - Interface do usuário (Dashboard, formulários de cadastro, telas de listagem).  
  - Pode utilizar Supabase JS SDK diretamente para operações simples (autenticação, CRUD) em cenários onde não há lógica sensível exposta.

- **Autenticação: Supabase AUTH**  
  - Gerencia cadastro, login e recuperação de senha.  
  - Fornece tokens JWT que o backend deve validar em rotas protegidas.

- **Hosting: Vercel**  
  - Hospedagem do frontend estático.  
  - Possibilidade de hospedar endpoints serverless (Funções) para rotas leves.  
  - Para manter a `service_role` em segurança, recomenda-se hospedar o backend que usa esta key em um serviço que suporte variáveis de ambiente protegidas (p.ex. Render, Railway ou Vercel com cuidado e variáveis protegidas).

---

## Estrutura do Repositório (em desenvolvimento)
```
/project-root
  /frontend
    index.html
    /css
    /js
  /backend
    /src
      index.js
      routes/
      controllers/
      services/
  /sql
    schema.sql
  README.md
  .env.example
```

## Roadmap
- Implementar esquema SQL básico e popular o DB com dados de teste.  
- Desenvolver endpoints principais (CRUD de lotes, finalização de incubação, vendas, linkar despesas).  
- Criar UI do Dashboard com cards e gráficos simples (p.ex. Chart.js).  
- Testes manuais de fluxo (criar lote ovo → incubar → finalizar → vendas).  
- Deploy e documentação final atualizada.

---

## Como contribuir
- Abra issues descrevendo problemas ou melhorias.  
- Envie PRs com branch nomeada `feature/<nome>` ou `fix/<nome>`.  
- Inclua testes e atualize `README.md` com mudanças significativas.

---

## Licença
Este projeto é um protótipo acadêmico — licença (MIT).

---

## Desenvolvedores
[Richard Esley](https://github.com/RDEsley) / [Fernanda Kikuchi](https://github.com/FeMeNiKi) / Matheus Brandão / Nicolas Mota
