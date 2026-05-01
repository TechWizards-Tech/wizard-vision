# 🗂️ AtletaTrack — Planejamento Ágil (Trello)

Este documento contém o planejamento completo das 3 Sprints para o board do Trello. Siga estas instruções para montar um board digno de nota máxima na ABP.

---

## 📋 1. Configuração das Listas (Colunas)
Crie as colunas nesta ordem para simular o fluxo Kanban:
1.  **📌 Product Backlog** (Onde ficam as US de Sprint 2 e 3)
2.  **🎯 Sprint Backlog** (Itens da Sprint atual)
3.  **🔄 Em Desenvolvimento**
4.  **👀 Em Revisão (Code Review/PR)**
5.  **✅ Concluído (Sprint 1)**
6.  **🚀 Deploy / Produção**

---

## 🏷️ 2. Sistema de Labels (Etiquetas)
| Cor | Nome | Descrição |
| :--- | :--- | :--- |
| 🔴 Vermelho | Backend | API, Banco, Lógica |
| 🔵 Azul | Frontend | UI, UX, React |
| 🟣 Roxo | ML / IA | Modelos e Ciência de Dados |
| ⚫ Preto | DevOps / Infra | Docker, Deploy, CI/CD |
| 🟡 Amarelo | Documentação | Relatórios, README |
| 🟢 Verde | Sprint 1 | Entregue |
| 🩵 Ciano | Sprint 2 | Próximo foco |
| 🩷 Rosa | Sprint 3 | Finalização |

---

## 🥇 SPRINT 1 — Fundação e Ingestão (STATUS: CONCLUÍDO)
*Estes cards devem ser criados e movidos para a lista **✅ Concluído** para mostrar progresso.*

### [US01] Setup e Arquitetura Base
- **Descrição**: Como desenvolvedor, quero configurar o repositório GitHub e a estrutura base (React + Node) para iniciar o projeto com padrões profissionais.
- **Labels**: ⚫ DevOps, 🟡 Documentação, 🟢 Sprint 1
- **Checklist**:
    - [x] Criar repositório e README.md
    - [x] Configurar pastas backend/ e frontend/
    - [x] Configurar .gitignore e env.example

### [US02] Banco de Dados e Modelagem (Prisma)
- **Descrição**: Como desenvolvedor, quero modelar as tabelas de Atletas, Usuários e Sessões no PostgreSQL via Prisma para persistir os dados do sistema.
- **Labels**: 🔴 Backend, ⚫ DevOps, 🟢 Sprint 1
- **Checklist**:
    - [x] Criar schema.prisma (User, Athlete, Session, Alert)
    - [x] Provisionar banco no Supabase/Neon
    - [x] Rodar migrations iniciais

### [US03] Sistema de Autenticação Staff
- **Descrição**: Como membro da comissão técnica, quero criar uma conta e fazer login para acessar os dados restritos dos atletas.
- **Labels**: 🔴 Backend, 🔵 Frontend, 🟢 Sprint 1
- **Checklist**:
    - [x] Endpoint de Registro e Login (JWT + Bcrypt)
    - [x] Contexto de Auth no React (AuthProvider)
    - [x] Tela de Login e Cadastro (UI Premium)

### [US04] Importação Massiva de Dados (XLSX)
- **Descrição**: Como analista de desempenho, quero fazer upload da planilha "Players.xlsx" para que o sistema popule o banco automaticamente com os dados do GPS.
- **Labels**: 🔴 Backend, 🟢 Sprint 1
- **Checklist**:
    - [x] Implementar parser de Excel (Multer + XLSX)
    - [x] Lógica de deduplicação de atletas
    - [x] Processar 3000+ sessões em um único upload

### [US05] Dashboard Principal e Listagem
- **Descrição**: Como técnico, quero ver uma lista de todos os atletas e estatísticas gerais do time para ter uma visão macro do elenco.
- **Labels**: 🔵 Frontend, 🟢 Sprint 1
- **Checklist**:
    - [x] Grid de cards de atletas
    - [x] Cards de estatísticas (Total atletas, Sessões, Perfis)
    - [x] Filtros por posição e perfil

---

## 🥈 SPRINT 2 — Inteligência e Alertas (STATUS: PRODUCT BACKLOG)
*Estes cards devem estar na lista **📌 Product Backlog**.*

### [US06] Modelo de Machine Learning para Perfis (RP01, RP02)
- **Descrição**: Como analista, quero que o sistema utilize um modelo de Machine Learning (K-Means ou similar) hospedado na nuvem para classificar os atletas, atendendo à restrição de inteligência artificial.
- **Labels**: 🟣 ML / IA, 🔴 Backend, 🩵 Sprint 2 | **SP: 8**
- **Checklist**:
    - [ ] Treinar modelo de agrupamento com dados históricos
    - [ ] Hospedar o serviço de ML na nuvem (Render/Vercel)
    - [ ] Consumir as predições do modelo via API no backend Node.js

### [US07] IA para Detecção de Anomalias (RP01)
- **Descrição**: Como técnico, quero que um algoritmo de IA analise o comportamento físico dos atletas para detectar anomalias que indiquem risco de lesão.
- **Labels**: 🟣 ML / IA, 🔴 Backend, 🩵 Sprint 2 | **SP: 8**
- **Checklist**:
    - [ ] Implementar algoritmo de detecção (Isolation Forest ou Threshold-based AI)
    - [ ] Processar o histórico de sessões do atleta para identificar outliers
    - [ ] Disparar alertas automáticos no sistema

### [US08] Central de Notificações e Alertas
- **Descrição**: Como técnico, quero um painel de notificações em tempo real para saber quais atletas precisam de atenção imediata.
- **Labels**: 🔵 Frontend, 🔴 Backend, 🩵 Sprint 2 | **SP: 5**
- **Checklist**:
    - [ ] Criar ícone de sino com contador de alertas pendentes
    - [ ] Marcar alerta como lido
    - [ ] Diferenciar níveis de alerta (Crítico, Atenção, Informativo)

---

## 🥉 SPRINT 3 — Dashboards e Refinamento (STATUS: PRODUCT BACKLOG)
*Estes cards devem estar na lista **📌 Product Backlog**.*

### [US09] Visão Individual do Atleta (Deep Dive)
- **Descrição**: Como atleta ou técnico, quero ver gráficos de evolução (velocidade, distância) ao longo do tempo para entender o progresso do condicionamento.
- **Labels**: 🔵 Frontend, 🩷 Sprint 3 | **SP: 5**
- **Checklist**:
    - [ ] Implementar gráficos de linha (Recharts)
    - [ ] Filtro por período (Últimos 7 dias, 30 dias, Mês)
    - [ ] Comparação entre métricas do atleta vs média do elenco

### [US10] Relatórios Mobile-First para Campo
- **Descrição**: Como auxiliar técnico, quero acessar os perfis dos atletas no celular durante o treino para decidir quem substituir.
- **Labels**: 🔵 Frontend, 🩷 Sprint 3 | **SP: 5**
- **Checklist**:
    - [ ] Tornar o layout 100% responsivo
    - [ ] Otimizar performance de carregamento no mobile
    - [ ] Implementar visualização de "Cards Rápidos"

### [US11] Segurança e Criptografia de Dados (RP04)
- **Descrição**: Como gestor, quero que os dados sensíveis dos atletas sejam protegidos com criptografia em trânsito e em repouso, garantindo a segurança da informação.
- **Labels**: 🔴 Backend, ⚫ DevOps, 🩷 Sprint 3 | **SP: 5**
- **Checklist**:
    - [ ] Implementar criptografia de dados sensíveis no banco (Repouso)
    - [ ] Garantir comunicação via HTTPS/TLS (Trânsito)
    - [ ] Aplicar política de expiração de tokens e segurança de endpoints

---

## 📈 Resumo do Projeto para o Professor
- **Total de User Stories**: 11
- **Metodologia**: Scrum / Kanban
- **Estimativa**: Planning Poker (Sequence de Fibonacci)
- **Definição de Pronto (DoD)**: Código revisado, testado e deployado.
