# 🏟️ WizardVision — Sistema de Análise de Desempenho de Atletas

<div align="center">

![AtletaTrack Banner](https://img.shields.io/badge/AtletaTrack-v1.0.0-10b981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDIgM3M0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTFTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLyA+PC9zdmc+)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql)
![FATEC](https://img.shields.io/badge/FATEC-Jacareí-blue?style=for-the-badge)

**Protótipo de sistema de informações para análise de desempenho físico de atletas de futebol com Inteligência Artificial**

[📋 Backlog](#-product-backlog-priorizado) · [🏃 Sprint Backlogs](#-sprint-backlogs-detalhados) · [🚀 Instalação](#-como-rodar) · [🏗️ Arquitetura](#️-arquitetura) · [👥 Time](#-time)

</div>

---

## 📋 Sobre o Projeto

Projeto desenvolvido como **ABP (Aprendizagem Baseada em Projetos)** do curso de **Desenvolvimento de Software Multiplataforma** da **FATEC Jacareí**, semestre 2026-1.

**Parceiro:** Leandro Spinola  
**Focal Point:** Prof. Leandro Toss Hoffmann  
**Kick-off:** 26/03/2026

### O Desafio

O futebol profissional moderno utiliza dados de rastreamento GPS e sensores para monitorar o desempenho físico dos atletas. O **WizardVision** busca transformar esses dados brutos em **inteligência acionável** para a comissão técnica, permitindo:

- 📊 Visualizar o desempenho individual e coletivo em dashboards intuitivos
- 🧬 Identificar **perfis automáticos** de jogadores via IA (explosivo, alta resistência, etc.)
- 🚨 Detectar **quedas de desempenho** automaticamente e emitir alertas
- 📱 Acessar todas as análises via **dispositivos móveis**

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)                │
│   Dashboard · Atletas · Alertas · Mobile-first     │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│            BACKEND (Node.js + Express)              │
│   Auth · Import · CRUD · ML Service · Alerts       │
└──────────┬───────────────────────────┬──────────────┘
           │                           │
┌──────────▼───────────┐   ┌───────────▼──────────────┐
│  PostgreSQL (Supabase)│   │   ML/IA                  │
│  via Prisma ORM      │   │   K-Means + Anomaly Det. │
└──────────────────────┘   └──────────────────────────┘
```

**Padrão Arquitetural:** MVC (Model-View-Controller)  
**Padrões de Projeto:**
- 🏭 **Factory** — criação de perfis de atletas
- 🎯 **Strategy** — algoritmos de análise intercambiáveis (regras → ML)
- 👁️ **Observer** — sistema de alertas automáticos
- 🗄️ **Repository** — abstração do acesso a dados via Prisma

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Finalidade |
|--------|-----------|------------|
| Frontend | React 18 + Vite | Interface responsiva e reativa |
| Estilização | CSS Vanilla + Inter Font | Design system próprio, dark mode |
| Roteamento | React Router DOM | SPA com rotas protegidas |
| Backend | Node.js + Express | API REST |
| ORM | Prisma | Abstração do banco de dados |
| Banco | PostgreSQL (Supabase) | Persistência na nuvem |
| Autenticação | JWT + bcryptjs | Segurança das rotas |
| Import | xlsx + Multer | Upload e parse de planilhas |
| Deploy Frontend | Vercel | Hospedagem gratuita |
| Deploy Backend | Render | Hospedagem gratuita |
| CI/CD | GitHub Actions | Automação de deploys |

---

## 📊 Requisitos do Sistema

### Funcionais (RF)
| ID | Descrição | Sprint | User Story (US) | Status |
|----|-----------|--------|-----------------|--------|
| RF01 | Importar dataset histórico para o banco | 1 | [US04] | ✅ |
| RF02 | Importar novos dados de partidas | 1 | [US04] | ✅ |
| RF03 | Identificar perfis automáticos de jogadores | 1-2 | [US05], [US06] | ✅ |
| RF04 | Comparar atletas por perfis e indicadores | 3 | [US09] | ✅ |
| RF05 | Detectar quedas de desempenho (Anomalias) | 2 | [US07] | ✅ |
| RF06 | Emitir alertas para a comissão técnica | 2 | [US08] | ✅ |
| RF07 | Dashboards com visualizações | 1-3 | [US05], [US09] | ✅ |
| RF08 | Acesso via dispositivos móveis | 3 | [US10] | ✅ |

### Não Funcionais (RNF)
| ID | Descrição | User Story (US) | Status |
|----|-----------|-----------------|--------|
| RNF01 | Interface responsiva e intuitiva | [US05], [US10] | ✅ |
| RNF02 | Segurança: Autenticação JWT + Bcrypt | [US03] | ✅ |
| RNF03 | Desempenho e escalabilidade (Node.js) | [US02] | ✅ |
| RNF04 | Confiabilidade e persistência de dados | [US02] | ✅ |
| RNF05 | Análises claras e compreensíveis | [US06], [US09] | ✅ |

### Restrições (RP)
| ID | Descrição | User Story (US) | Status |
|----|-----------|-----------------|--------|
| RP01 | Análise com IA/ML (K-Means/Anomalias) | [US06], [US07] | ✅ |
| RP02 | Serviços de nuvem (Supabase + Render) | [US02] | ✅ |
| RP03 | Desenvolvimento incremental e ágil | [US01] | ✅ |
| RP04 | Segurança: criptografia e LGPD | [US11] | ✅ |
| RP05 | Frontend mobile-first | [US10] | ✅ |
| RP06 | Padrão arquitetural MVC documentado | [US01] | ✅ |
| RP07 | Documentação + diagrama de componentes | | ✅ |

---

## 📅 Planejamento de Sprints

| Sprint | Período | Foco | Status |
|--------|---------|------|--------|
| **Sprint 1** | 13/04 – 30/04/2026 | Setup + Auth + Import + Dashboard base | ✅ Concluída |
| **Sprint 2** | 04/05 – 21/05/2026 | ML/IA (perfis + anomalias) + Alertas | ✅ Concluída |
| **Sprint 3** | 25/05 – 11/06/2026 | Dashboards avançados + Mobile + Segurança | ✅ Concluída |
| **Apresentação** | Semana de 22/06/2026 | Apresentação final | ✅ Concluída |

---

## 📋 Product Backlog Priorizado

Tabela de gerenciamento do backlog unificado do produto, ordenada por prioridade técnica e valor de negócio:

| ID | Requisito Associado | User Story (US) | Prioridade | Valor de Negócio | Estimativa (Story Points) | Sprint | Status |
|----|---------------------|-----------------|------------|------------------|---------------------------|--------|--------|
| **US01** | RP03, RP06 | **Setup e Arquitetura Base**: Como desenvolvedor, quero configurar o repositório GitHub e a estrutura base para iniciar o projeto com padrões profissionais. | Muito Alta | Alta | 3 SP | 1 | ✅ |
| **US02** | RNF03, RNF04, RP02 | **Banco de Dados e Modelagem (Prisma)**: Como desenvolvedor, quero modelar as tabelas de Atletas, Usuários e Sessões no PostgreSQL via Prisma para persistir os dados. | Muito Alta | Alta | 5 SP | 1 | ✅ |
| **US03** | RNF02 | **Sistema de Autenticação**: Como membro da comissão técnica, quero criar uma conta e fazer login para acessar os dados restritos dos atletas. | Alta | Muito Alta | 5 SP | 1 | ✅ |
| **US04** | RF01, RF02 | **Importação dos Dados (XLSX)**: Como analista de desempenho, quero fazer upload da planilha "Players.xlsx" para que o sistema popule o banco automaticamente. | Alta | Muito Alta | 5 SP | 1 | ✅ |
| **US05** | RF07, RNF01 | **Dashboard Principal e Listagem**: Como técnico, quero ver uma lista de todos os atletas e estatísticas gerais do time para ter uma visão macro do elenco. | Média | Alta | 5 SP | 1 | ✅ |
| **US06** | RF03, RP01 | **Identificação de Perfis via IA (K-Means)**: Como analista, quero que o sistema utilize um modelo de Machine Learning (K-Means) para classificar os atletas. | Alta | Alta | 8 SP | 2 | ✅ |
| **US07** | RF05, RP01 | **Detecção de Anomalias (Prevenção)**: Como Comissão Técnica, quero receber alertas automáticos quando um atleta tiver uma queda de rendimento. | Alta | Muito Alta | 8 SP | 2 | ✅ |
| **US08** | RF06 | **Central de Notificações e Alertas**: Como técnico, quero um painel de notificações em tempo real para acompanhamento dos atletas. | Média | Alta | 5 SP | 2 | ✅ |
| **US09** | RF04, RF07, RNF05 | **Visão Individual do Atleta**: Como atleta ou técnico, quero ver gráficos de evolução ao longo do tempo para entender o progresso do condicionamento. | Alta | Alta | 5 SP | 3 | ✅ |
| **US10** | RF08, RNF01, RP05 | **Relatórios Mobile-First para Campo**: Como auxiliar técnico, quero acessar os perfis dos atletas no celular durante o treino para decidir quem substituir. | Média | Alta | 5 SP | 3 | ✅ |
| **US11** | RP04 | **Segurança de Dados**: Como gestor, quero que os dados sensíveis dos atletas sejam protegidos com criptografia em trânsito e em repouso. | Alta | Alta | 5 SP | 3 | ✅ |

---

## 🏃 Sprint Backlogs Detalhados

Detalhamento das atividades internas executadas por ciclo de desenvolvimento, com atribuição de responsáveis e controle de esforço.

### Sprint 1 Backlog — Setup + Ingestão
*Foco: Criação da infraestrutura, modelagem relacional, fluxo de autenticação e parser de planilhas.*

| Atividade | Responsável | Estimativa | Requisito Relacionado | Status |
|-----------|-------------|------------|-----------------------|--------|
| Configuração de pastas, `.gitignore` e setup do repositório Git | Pollyana Roberta,  Bruna Regra | 1 SP | US01 | Concluído |
| Configuração de rotas base no React e Express Backend | Pamela Freitas,| 2 SP | US01 | Concluído |
| Escrita do `schema.prisma` (tabelas User, Athlete, Session, Alert) | Maria Eduarda | 3 SP | US02 | Concluído |
| Provisionamento do banco PostgreSQL no Supabase e Migrations | Maria Eduarda | 2 SP | US02 | Concluído |
| Implementação de rotas de registro e login (JWT + Bcrypt no Node) | Pollyana Roberta, Leandro Barbosa| 3 SP | US03 | Concluído |
| Criação das telas de Login e Registro no Frontend React | Raquel Massae, Bruna Regra | 2 SP | US03 | Concluído |
| Criação do Parser de Excel no Backend (Multer + xlsx parser) | Felipe Correia | 3 SP | US04 | Concluído |
| Desenvolvimento da lógica de desduplicação de atletas no Banco | Pollyana Roberta | 2 SP | US04 | Concluído |
| Grid de Cards de Atletas e barra de buscas no Dashboard |  Raquel Massae , Leandro Barbosa | 3 SP | US05 | Concluído |
| Implementação de filtros por posição no frontend | Raquel Massae , Leandro Barbosa | 2 SP | US05 | Concluído |

### Sprint 2 Backlog — Inteligência Artificial & Notificações
*Foco: Desenvolvimento do microsserviço FastAPI em Python, algoritmos de Machine Learning e disparo de alertas.*

| Atividade | Responsável | Estimativa | Requisito Relacionado | Status |
|-----------|-------------|------------|-----------------------|--------|
| Hospedar o serviço de ML na nuvem (backend e ml-service no Render) | Felipe Correia,  Pollyana Roberta | 2 SP | US06 | Concluído |
| Treinar modelo de agrupamento com dados históricos | Pollyana Roberta | 4 SP | US06 | Concluído |
| Consumir as predições do modelo via API no backend Node.js | Raquel Massae,  Pollyana Roberta | 2 SP | US06 | Concluído |
| Implementar algoritmo de detecção | Maria Eduarda e Processar o histórico de sessões do atleta para identificar outliers | 4 SP | US07 | Concluído |
| Integração híbrida da Floresta de Isolamento no microsserviço de IA | Pamela Freitas | 4 SP | US07 | Concluído |
| Criação das rotas REST de alertas (`GET /alerts`, `PATCH /alerts/:id`) | Leandro Barbosa | 2 SP | US08 | Concluído |
| Desenvolvimento da gaveta lateral de alertas no Frontend (CSS Glassmorphism) | Bruna Regra | 3 SP | US08 | Concluído |

### Sprint 3 Backlog — Dashboards Avançados, Mobile & Segurança
*Foco: Visualizações gráficas de linha, portabilidade responsiva móvel e criptografia simétrica.*

| Atividade | Responsável | Estimativa | Requisito Relacionado | Status |
|-----------|-------------|------------|-----------------------|--------|
| Criação do componente e roteamento de detalhes do atleta (`/athletes/:id`) | Leandro Barbosa,  Pollyana Roberta | 1 SP | US09 | Concluído |
| Integração dos gráficos de evolução temporal de métricas com a biblioteca `recharts` | Bruna Regra, Leandro Barbosa | 2 SP | US09 | Concluído |
| Lógica de cálculo de baseline individual do atleta e comparativo percentual | Felipe Correia, Bruna Regra | 2 SP | US09 | Concluído |
| Ajuste da folha de estilos da Sidebar para Bottom Nav responsivo móvel | Leandro Barbosa | 3 SP | US10 | Concluído |
| Criação do grid empilhável para visualização tática de cartões no mobile | Pamela Freitas | 2 SP | US10 | Concluído |
| Implementação de paginação no front e no back para otimização de banda de rede | Raquel Massae| 1 SP | US10 | Concluído |
| Criação do utilitário `crypto.js` com o algoritmo AES-256-GCM para criptografia | Felipe Correia, Pollyana Roberta | 2 SP | US11 | Concluído |
| Integração da cifragem do nome do atleta no importador e decifragem nos controllers | Maria Eduarda | 2 SP | US11 | Concluído |
| Configuração de HTTPS em produção e tempo de expiração do JWT | Pollyana Roberta | 1 SP | US11 | Concluído |

---

---

## 🛡️ Definition of Done (DoD)

Para que uma funcionalidade ou User Story seja considerada **concluída (Done)** e apta a ser entregue para deploy, ela deve passar pelos seguintes critérios de qualidade da equipe:

1.  **Código Limpo:** O código não deve apresentar avisos de compilação ou erros de sintaxe e deve seguir os padrões de formatação adotados pelo grupo.
2.  **Revisão por Pares (Code Review):** As alterações devem ser revisadas e aprovadas por pelo menos um outro desenvolvedor da equipe.
3.  **Validação Funcional:** A história de usuário deve ser testada localmente em ambiente de desenvolvimento, provando o funcionamento de todos os itens do seu respectivo checklist de testes.
4.  **Segurança e Chaves:** Nenhuma variável de ambiente (`.env`), senha em texto limpo ou credencial de banco de dados deve ser versionada no repositório.
5.  **Deploy Aprovado:** A funcionalidade deve ser publicada e executada com sucesso nos ambientes de homologação/produção (Vercel e Render).

---

## 🔄 Retrospectiva das Sprints

### Sprint 1
*   **O que funcionou bem:**
    *   Rapidez na modelagem e sincronização inicial do banco de dados PostgreSQL.
    *   Sucesso no processamento rápido da planilha pesada de 3000+ linhas de telemetria.
*   **Dificuldades encontradas:**
    *   Tivemos problema no acesso ao github, o que atrasou um pouco o desenvolvimento, já que apenas a Pollyana conseguia acessar.
*   **Ações de melhoria para a próxima sprint:**
    *  Verificar o mau funcionamento da plataforma.

### Sprint 2
*   **O que funcionou bem:**
    *   Precisão da IA no agrupamento do K-Means e detecção individualizada com Z-Score.
    *   O visual *glassmorphic* da central de notificações foi muito elogiado no design.
*   **Dificuldades encontradas:**
    *   Problemas de CORS na integração local entre o servidor Node e a IA FastAPI.
    *   O deploy no Render falhava devido a espaços invisíveis colados no final da variável `DATABASE_URL`.
    *   Algoritmo Isolation Forest não estava aplicado de forma correta.
*   **Ações de melhoria para a próxima sprint:**
    *   Criar função preventiva de limpeza de dados (`.strip()`) no FastAPI.
    *   Liberar origens de CORS específicas para os domínios de deploy na Vercel e Render.
    *   Aplicar o algoritmo de maneira correta, para comparar o desempenho do atleta com ele mesmo.

### Sprint 3
*   **O que funcionou bem:**
    *   A integração de gráficos de linha responsivos (`recharts`) rodou com ótima performance.
    *   A transição de Sidebar para Bottom Nav ficou perfeita e intuitiva no smartphone.
    *   Implementação robusta da criptografia AES-256-GCM sem causar gargalos de carregamento nas páginas.
*   **Dificuldades encontradas:**
    *   Curva de aprendizado no tratamento de dados binários do Node para cifrar strings complexas.
*   **Aprendizado final:**
    *   O desenvolvimento orientado a responsividade móvel (Mobile-First) desde o início do protótipo poupa tempo de refatoração no final do projeto.

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm 9+
- Conta no [Supabase](https://supabase.com) (gratuito) ou banco PostgreSQL local

### 1. Clone o repositório
```bash
git clone https://github.com/SEU-USUARIO/atletatrack.git
cd atletatrack
```

### 2. Configure o Backend
```bash
cd backend
cp .env.example .env
# Edite o .env com sua DATABASE_URL do Supabase e as chaves JWT e de Criptografia
npm install
npm run generate       # Gera o Prisma Client
npm run migrate        # Cria as tabelas no banco
npm run dev            # Inicia em modo desenvolvimento
```

### 3. Configure o Frontend
```bash
cd ../frontend
cp .env.example .env
# Edite VITE_API_URL se necessário
npm install
npm run dev            # Inicia em http://localhost:5173
```

### 4. Importe os dados
- Acesse o sistema em `http://localhost:5173`
- Crie uma conta no formulário de Registro do staff
- Faça login e clique em "📥 Importar Dados" no cabeçalho
- Selecione o arquivo `Players.xlsx` que acompanha o projeto

---

## 👥 Time

| Nome | Papel | GitHub |
|------|-------|--------|
| Pollyana Roberta | Dev + **Scrum Master** | [@pollymeowth](https://github.com/pollymeowth) |
| Bruna Regra | Dev + **Product Owner** | [@regrabru](https://github.com/regrabru) |
| Maria Eduarda | Dev Full Stack | [@ferreira-me](https://github.com/ferreira-me) |
| Leandro Barbosa | Dev Full Stack | [@gmlebc](https://github.com/gmlebc) |
| Raquel Massae | Dev Full Stack | [@nakamuraquel](https://github.com/nakamuraquel) |
| Felipe Correia | Dev Frontend | [@turnupthetaste](https://github.com/turnupthetaste) |
| Pamela Freitas | Dev Full Stack | [@PaamFreitas18](https://github.com/PaamFreitas18) |

---

## 📝 Licença

Projeto acadêmico — FATEC Jacareí © 2026
