# 🏟️ AtletaTrack — Documentação Técnica do Sistema

Este documento descreve a arquitetura, modelagem e decisões técnicas tomadas para o desenvolvimento do **AtletaTrack**, um sistema de análise de desempenho para atletas de futebol desenvolvido para a ABP do 5º semestre de DSM (FATEC Jacareí).

---

## 1. Visão Geral do Projeto
O AtletaTrack é uma plataforma voltada para comissões técnicas (staff) que transforma dados brutos de telemetria GPS (extraídos de dispositivos vestíveis em jogos e treinos) em inteligência de dados. 

**Objetivos Principais:**
- Automatizar a ingestão de dados massivos (planilhas Excel).
- Identificar automaticamente o perfil físico de cada atleta.
- Centralizar métricas de intensidade, carga e velocidade.
- Facilitar a tomada de decisão para substituições e prevenção de lesões.

---

## 2. Arquitetura do Sistema

O projeto segue uma arquitetura moderna de **Single Page Application (SPA)** com separação total entre cliente e servidor.

### 🧩 Backend (Node.js + Express)
Segue o padrão **MVC (Model-View-Controller)**:
- **Models**: Gerenciados pelo **Prisma ORM**, definindo a estrutura das tabelas no PostgreSQL.
- **Controllers**: Lógica de orquestração (ex: `athleteController.js`, `authController.js`).
- **Routes**: Definição dos endpoints REST.
- **Services**: Lógica de negócio pesada (ex: algoritmo de classificação de perfis).
- **Middlewares**: Filtros de segurança e tratamento de erros (ex: `authMiddleware.js`).

### 🎨 Frontend (React + Vite)
Focado em UX/UI Premium e Performance:
- **Context API**: Gerenciamento de estado global da autenticação.
- **Componentização**: Interface baseada em componentes reutilizáveis (Card, Sidebar, StatCard).
- **Design System**: Uso de variáveis CSS e Dark Mode para visual moderno.

---

## 3. Modelagem do Banco de Dados (PostgreSQL)

Usamos o **Prisma ORM** para garantir tipagem e facilidade nas migrações.

### 📊 Entidades Principais:
1.  **User**: Usuários do staff (Login/Senha).
    - `id`, `name`, `email`, `password`.
2.  **Athlete**: O jogador.
    - `id`, `athleteId` (ID vindo do GPS), `name`, `position`, `profile` (calculado), `photo`.
3.  **Session**: Cada partida ou treino registrado.
    - Armazena métricas como: `distanceM`, `topSpeedKph`, `sessionLoad`, `highIntensityRunM`, `noOfSprints`.
    - Relacionamento: N sessões para 1 Atleta.
4.  **Alert**: Notificações de queda de desempenho.
    - `type`, `message`, `isRead`.

---

## 4. Lógica de Negócio e Algoritmos

### 📥 Importação de Dados (XLSX)
O sistema processa o arquivo `Players.xlsx` (3013 registros) usando as bibliotecas `multer` e `xlsx`. 
- **Otimização**: O algoritmo identifica se o atleta já existe no banco antes de criar, evitando duplicidade e conectando as sessões ao atleta correto automaticamente.

### 🧬 Classificação Automática de Perfis
Na Sprint 1, implementamos um motor de regras (Heuristic Engine) que analisa as métricas médias do atleta:
- **Explosivo**: Atletas com `topSpeed` > 30km/h ou alta média de `noOfSprints`.
- **Alta Resistência**: Atletas com `distanceM` total acima da média.
- **Moderado**: Atletas com métricas balanceadas.
- *Nota: Na Sprint 2, este motor será substituído por um modelo de Machine Learning (K-Means).*

---

## 5. Tecnologias Utilizadas (Stack)

| Tecnologia | Motivo da Escolha |
| :--- | :--- |
| **Node.js** | Alta escalabilidade e velocidade de desenvolvimento com JS. |
| **Express** | Framework minimalista e flexível para APIs REST. |
| **PostgreSQL** | Banco relacional robusto para lidar com milhares de sessões. |
| **Prisma ORM** | Facilita a modelagem e garante que o banco esteja sempre em sincronia com o código. |
| **React** | Biblioteca líder para criação de interfaces dinâmicas e reativas. |
| **JWT (JSON Web Token)** | Padrão de mercado para autenticação segura e stateless. |
| **Bcryptjs** | Criptografia de senhas (segurança avançada). |

---

## 6. Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Banco de Dados PostgreSQL (Local ou Supabase).

### Passo 1: Configurar o Backend
1. Entre na pasta `backend`.
2. Instale as dependências: `npm install`.
3. Configure o arquivo `.env` com a `DATABASE_URL` e `JWT_SECRET`.
4. Sincronize o banco: `npx prisma migrate dev`.
5. Gere o cliente Prisma: `npx prisma generate`.
6. Inicie o servidor: `npm run dev`.

### Passo 2: Configurar o Frontend
1. Entre na pasta `frontend`.
2. Instale as dependências: `npm install`.
3. Configure o arquivo `.env` com `VITE_API_URL=http://localhost:3333`.
4. Inicie o app: `npm run dev`.

---

## 📅 Próximos Passos (Sprint 2)
- [ ] Integrar Python/Sklearn para detecção de anomalias (lesões).
- [ ] Criar gráficos de evolução temporal por atleta.
- [ ] Implementar sistema de alertas em tempo real.

---

**Desenvolvido por:** Polly (SM) & Time AtletaTrack.
