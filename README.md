# Sistema de Gerenciamento de Granja (SGG)

## 1. Objetivo Principal do Projeto  

O **Sistema de Gerenciamento de Granja (SGG)** tem como objetivo fornecer um controle financeiro e operacional completo do ciclo de produção de pintos, abrangendo desde a aquisição dos ovos até a venda final das aves. O sistema será responsável por rastrear custos, perdas e receitas de cada lote, permitindo ao usuário realizar análises de lucratividade e tomar decisões mais assertivas em relação a compras, processos produtivos e estratégias de precificação.  

---

## 2. Conceito Central: O "Lote"  

O conceito de **lote** constitui a espinha dorsal do sistema e será a principal unidade de controle e rastreabilidade. Cada etapa da produção estará vinculada a um lote específico:  

- **Lote de Ovos:** corresponde ao agrupamento de ovos adquiridos.  
- **Lote de Incubação:** representa a divisão de ovos incubados em determinada chocadeira.  
- **Lote de Aves:** resultado do processo de incubação, gerando um grupo de pintos.  

Todos os cálculos financeiros e produtivos serão realizados a partir da unidade de lote.  

---

## 3. Fluxo de Navegação e Processos  

O sistema terá como ponto inicial a **página principal (Dashboard)**, que exibirá **cards de acesso rápido** para as funcionalidades de Ovos, Incubação, Aves, Despesas e Vendas. Além disso, apresentará um **resumo financeiro** com gasto total, receita total, lucro total e lucro por lote, assim como indicadores de status (ovos em estoque, ovos incubando e aves disponíveis).  

As etapas do fluxo de processos serão divididas em quatro fases principais:  

### Fase 1 – Aquisição de Insumos (Custos Iniciais)  
- **Cadastro de ovos (lote de ovos):** inclui informações como data da compra, fornecedor, raça, quantidade, valor unitário e valor total. O sistema cria um novo lote de ovos já com custo registrado.  
- **Cadastro de outras despesas (rações, vacinas, energia, entre outras):** inclui tipo de despesa, descrição, quantidade, valor total e data. Esses custos podem posteriormente ser vinculados a lotes de aves.  

### Fase 2 – Incubação  
- **Criação de lote de incubação:** a partir de um lote de ovos, informando a chocadeira utilizada, quantidade alocada e datas. O sistema valida a disponibilidade de ovos.  
- **Finalização da incubação:** registra a quantidade de ovos não eclodidos e a data real de nascimento. A partir dessa operação, é gerado automaticamente um novo lote de aves.  

### Fase 3 – Criação das Aves (Custos Diretos e Mortalidade)  
- **Registro das informações herdadas:** raça, data de nascimento e quantidade inicial.  
- **Acompanhamento dinâmico da quantidade atual:** atualizada automaticamente em função de vendas e perdas.  
- **Registro de perdas (mortalidade):** data, quantidade e motivo (opcional).  
- **Vinculação de despesas:** despesas cadastradas (como ração e vacinas) podem ser vinculadas diretamente ao lote, permitindo o cálculo detalhado dos custos de criação.  

### Fase 4 – Venda das Aves (Receita)  
- **Registro de vendas:** vincula o lote de origem, cliente, data, quantidade vendida e valor unitário. O sistema calcula automaticamente o valor total da venda e atualiza a quantidade de aves disponíveis no lote.  

---

## 4. Estrutura do Banco de Dados  

A modelagem do banco de dados foi elaborada de forma simplificada, contemplando as principais entidades e seus relacionamentos. As tabelas previstas são:  

- **racas:** id_raca (PK), nome_raca.  
- **lotes_ovos:** id_lote_ovos (PK), fk_id_raca, data_compra, quantidade_comprada, valor_unitario_pago, custo_total, fornecedor (opcional).  
- **chocadeiras:** id_chocadeira (PK), nome_identificacao, capacidade.  
- **lotes_incubacao:** id_lote_incubacao (PK), fk_id_lote_ovos, fk_id_chocadeira, data_inicio, data_final, quantidade_ovos, quantidade_fracasso, status (Incubando, Finalizado).  
- **lotes_aves:** id_lote_aves (PK), fk_id_lote_incubacao, fk_id_raca, data_nascimento, quantidade_inicial, quantidade_atual, status (Ativo, Vendido, Finalizado).  
- **registros_mortalidade:** id_registro_morte (PK), fk_id_lote_aves, data_ocorrencia, quantidade, motivo (opcional).  
- **despesas:** id_despesa (PK), fk_id_lote_aves (opcional), tipo_despesa, descricao, data_despesa, valor_gasto.  
- **vendas:** id_venda (PK), fk_id_lote_aves, data_venda, quantidade_vendida, valor_unitario_venda, valor_total_venda, cliente (opcional).  

---

## 5. Cálculo de Resultados  

O sistema permitirá a análise de rentabilidade por lote a partir das seguintes fórmulas:  

- **Receita Total do Lote =** soma dos valores totais das vendas.  
- **Custo Total do Lote =** custo inicial dos ovos + soma das despesas vinculadas ao lote de aves.  
- **Lucro do Lote =** Receita Total – Custo Total.  

---
