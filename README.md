# 🏟️ AtletaTrack — Sistema de Análise de Desempenho de Atletas

<div align="center">

![AtletaTrack Banner](https://img.shields.io/badge/AtletaTrack-v1.0.0-10b981?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791?style=for-the-badge&logo=postgresql)
![FATEC](https://img.shields.io/badge/FATEC-Jacareí-blue?style=for-the-badge)

**Protótipo de sistema de informações para análise de desempenho físico de atletas de futebol com Inteligência Artificial**

[📋 Backlog](#-backlog) · [🚀 Instalação](#-como-rodar) · [🏗️ Arquitetura](#️-arquitetura) · [👥 Time](#-time)

</div>

---

## 📋 Sobre o Projeto

Projeto desenvolvido como **ABP (Aprendizagem Baseada em Projetos)** do curso de **Desenvolvimento de Software Multiplataforma** da **FATEC Jacareí**, semestre 2026-1.

**Parceiro:** Leandro Spinola  
**Focal Point:** Prof. Leandro Toss Hoffmann  
**Kick-off:** 26/03/2026

### O Desafio

O futebol profissional moderno utiliza dados de rastreamento GPS e sensores para monitorar o desempenho físico dos atletas. O **AtletaTrack** busca transformar esses dados brutos em **inteligência acionável** para a comissão técnica, permitindo:

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
│  PostgreSQL (Supabase)│   │   ML/IA (Sprint 2)       │
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

## 📊 Requisitos Implementados

### Funcionais (RF)
| ID | Descrição | Sprint | User Story (US) | Status |
|----|-----------|--------|-----------------|--------|
| RF01 | Importar dataset histórico para o banco | 1 | [US04] | ✅ |
| RF02 | Importar novos dados de partidas | 1 | [US04] | ✅ |
| RF03 | Identificar perfis automáticos de jogadores | 1-2 | [US05], [US06] | 🔄 |
| RF04 | Comparar atletas por perfis e indicadores | 3 | [US09] | 🔜 |
| RF05 | Detectar quedas de desempenho (Anomalias) | 2 | [US07] | 🔜 |
| RF06 | Emitir alertas para a comissão técnica | 2 | [US08] | 🔜 |
| RF07 | Dashboards com visualizações | 1-3 | [US05], [US09] | 🔄 |
| RF08 | Acesso via dispositivos móveis | 3 | [US10] | 🔄 |

### Não Funcionais (RNF)
| ID | Descrição | User Story (US) | Status |
|----|-----------|-----------------|--------|
| RNF01 | Interface responsiva e intuitiva | [US05], [US10] | ✅ |
| RNF02 | Segurança: Autenticação JWT + Bcrypt | [US03] | ✅ |
| RNF03 | Desempenho e escalabilidade (Node.js) | [US02] | ✅ |
| RNF04 | Confiabilidade e persistência de dados | [US02] | ✅ |
| RNF05 | Análises claras e compreensíveis | [US06], [US09] | 🔄 |

### Restrições (RP)
| ID | Descrição | User Story (US) | Status |
|----|-----------|-----------------|--------|
| RP01 | Análise com IA/ML (K-Means/Anomalias) | [US06], [US07] | Sprint 2 🔜 |
| RP02 | Serviços de nuvem (Supabase + Render) | [US02] | ✅ |
| RP03 | Desenvolvimento incremental e ágil | [US01] | ✅ |
| RP04 | Segurança: criptografia e LGPD | [US11] | ✅ |
| RP05 | Frontend mobile-first | [US10] | ✅ |
| RP06 | Padrão arquitetural MVC documentado | [US01] | ✅ |
| RP07 | Documentação + diagrama de componentes | 🔄 |

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
# Edite o .env com sua DATABASE_URL do Supabase
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
- Crie uma conta via `POST /auth/register`
- Faça login e clique em "📥 Importar Dados"
- Selecione o arquivo `Players.xlsx`

---

## 📅 Sprints

| Sprint | Período | Foco |
|--------|---------|------|
| **Sprint 1** | 13/04 – 30/04/2026 | Setup + Auth + Import + Dashboard base |
| **Sprint 2** | 04/05 – 21/05/2026 | ML/IA (perfis + anomalias) + Alertas |
| **Sprint 3** | 25/05 – 11/06/2026 | Dashboards avançados + Mobile + Segurança |
| **Apresentação** | Semana de 22/06/2026 | Apresentação final |

---

## 👥 Time

| Nome | Papel | GitHub |
|------|-------|--------|
| Polly | Dev + **Scrum Master** | @polly |
| Bruna | Dev + **Product Owner** | @bruna |
| Dev 3 | Dev Full Stack | — |
| Dev 4 | Dev Full Stack | — |
| Dev 5 | Dev Full Stack | — |
| Dev 6 | Dev Frontend | — |
| Dev 7 | Dev Full Stack | — |

---

## 🌿 Branches

```
main         ← código de produção (só via PR revisado)
develop      ← integração (branch principal de desenvolvimento)
feature/xxx  ← features (ex: feature/us06-import-xlsx)
fix/xxx      ← correções de bugs
```

## ✅ Commits

Seguimos o padrão **Conventional Commits**:
```
feat: adiciona importação de xlsx
fix: corrige validação de datas
docs: atualiza README
chore: configura CI/CD
test: adiciona testes de import
refactor: extrai service de alertas
```

---

## 📝 Licença

Projeto acadêmico — FATEC Jacareí © 2026
