# 🚀 Guia de Apresentação — Sprint 1 (AtletaTrack)

Este guia serve como um "script" para você e a Bruna (PO) apresentarem o projeto com sucesso.

## 1. O Pitch (O que falar no começo)
"O AtletaTrack nasceu da necessidade de transformar dados brutos de GPS de futebol em decisões estratégicas. Hoje, um analista de desempenho perde horas limpando planilhas; nossa ferramenta automatiza isso e já entrega o perfil do atleta no momento do upload."

## 2. Pontos Fortes para Mostrar:
- **Design Premium**: O visual dark mode passa uma imagem de produto profissional e "caro".
- **Performance**: Mostre que importamos **mais de 3000 linhas** instantaneamente.
- **Segurança**: Destaque que as rotas são protegidas por JWT e senhas criptografadas.
- **Arquitetura**: Mencione o uso de **Prisma ORM** e **MVC**, que são padrões usados por empresas Tier 1.

## 3. Demo sugerida:
1. Mostre a tela de Login.
2. Crie uma conta nova (mostrando que o cadastro funciona).
3. Entre no Dashboard vazio.
4. **O "Momento Wow"**: Faça o upload do arquivo `Players.xlsx`.
5. Mostre os cards aparecendo com as métricas e o badge de perfil (Explosivo, etc.).

## 4. Respostas para Perguntas Técnicas:
- **"Como classificam o perfil?"**: "Nesta sprint usamos um motor de regras baseado em heurísticas físicas (velocidade e volume). Na Sprint 2, usaremos K-Means para clusterização via IA."
- **"Onde os dados estão?"**: "Estamos usando PostgreSQL hospedado no Supabase, garantindo persistência na nuvem."
- **"E se o arquivo for muito grande?"**: "Usamos o processamento em memória do Node com a biblioteca XLSX, preparada para lidar com milhares de linhas."

---
**Dica de Scrum Master:** Certifique-se de que todos os membros do time saibam explicar pelo menos um componente (ex: um explica a Auth, outro o Dashboard).
