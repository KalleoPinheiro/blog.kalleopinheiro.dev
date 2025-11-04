# 🧭 Roadmap — Blog Pessoal de Aprendizado

> Este roadmap detalha as etapas de desenvolvimento e manutenção do blog pessoal, que servirá como um repositório de aprendizados e experiências acumuladas em desenvolvimento web ao longo de 10 anos.

---

## 🧱 Milestone 1 — Concepção e Estratégia

**Objetivo:** Definir propósito, público, nome e estrutura de conteúdo.

**Issues**

- [ ] Redigir manifesto pessoal do blog (missão, visão, propósito)
- [ ] Definir público-alvo e estilo de linguagem
- [ ] Mapear tipos de conteúdo (posts técnicos, reflexões, diários de aprendizado)
- [ ] Escolher nome e verificar disponibilidade de domínio
- [ ] Criar documento de escopo do projeto

📅 **Duração estimada:** 1 semana  
🔗 **Dependência:** Nenhuma

---

## 🧭 Milestone 2 — Arquitetura e Planejamento

**Objetivo:** Escolher stack, estruturar repositório e planejar convenções de desenvolvimento.

**Issues**

- [ ] Definir stack tecnológica (Next.js + TypeScript + TailwindCSS + MDX)
- [ ] Criar repositório GitHub com README inicial
- [ ] Configurar `.editorconfig`, `.gitignore`, ESLint e Prettier
- [ ] Criar estrutura inicial de diretórios (`/pages`, `/components`, `/lib`, `/styles`)
- [ ] Definir convenções de commits (Conventional Commits)
- [ ] Criar roadmap inicial (este documento 😄)

📅 **Duração estimada:** 1 semana  
🔗 **Dependência:** Milestone 1

---

## 🎨 Milestone 3 — Identidade Visual e Design

**Objetivo:** Construir o design system e wireframes no Figma.

**Issues**

- [ ] Criar moodboard de inspiração
- [ ] Definir paleta de cores, tipografia e estilos de componentes
- [ ] Criar wireframes (Home, Post, About)
- [ ] Gerar mockups de alta fidelidade
- [ ] Documentar tokens de design (spacing, color, font, radius)

📅 **Duração estimada:** 2 semanas  
🔗 **Dependência:** Milestone 2

---

## 💻 Milestone 4 — Desenvolvimento da Base

**Objetivo:** Implementar layout, rotas principais e componentes reutilizáveis.

**Issues**

- [ ] Inicializar projeto com Next.js e TailwindCSS
- [ ] Implementar layout base (Navbar, Footer, Layout principal)
- [ ] Criar componentes `Button`, `Card`, `PostList`, `PostPreview`
- [ ] Implementar páginas básicas (`/`, `/posts/[slug]`, `/about`)
- [ ] Adicionar suporte a MDX e parser de metadados (frontmatter)

📅 **Duração estimada:** 3 semanas  
🔗 **Dependência:** Milestone 3

---

## 🗄️ Milestone 5 — CMS e Conteúdo

**Objetivo:** Criar fluxo de criação de conteúdo e gerenciamento de posts.

**Issues**

- [ ] Definir formato de conteúdo (Markdown ou CMS headless)
- [ ] Implementar sistema de build estático com Contentlayer
- [ ] Criar scripts para geração de novos posts
- [ ] Implementar listagem de posts e busca
- [ ] Adicionar paginação

📅 **Duração estimada:** 2 semanas  
🔗 **Dependência:** Milestone 4

---

## ☁️ Milestone 6 — Deploy e Infraestrutura

**Objetivo:** Publicar e automatizar o ciclo de deploy.

**Issues**

- [ ] Configurar CI/CD (GitHub Actions + Vercel)
- [ ] Conectar domínio personalizado
- [ ] Configurar Analytics e monitoramento (Plausible ou GA4)
- [ ] Criar backup automatizado dos posts
- [ ] Testar build e performance em produção

📅 **Duração estimada:** 1 semana  
🔗 **Dependência:** Milestone 5

---

## 🚀 Milestone 7 — SEO, Acessibilidade e Performance

**Objetivo:** Garantir que o blog seja rápido, acessível e fácil de encontrar.

**Issues**

- [ ] Implementar SEO base (title, meta, OG tags)
- [ ] Adicionar sitemap e robots.txt
- [ ] Revisar acessibilidade (ARIA, contraste, navegação por teclado)
- [ ] Testar performance (Lighthouse e Web Vitals)
- [ ] Ajustar imagens e lazy loading

📅 **Duração estimada:** 1 semana  
🔗 **Dependência:** Milestone 6

---

## 🔁 Milestone 8 — Crescimento e Manutenção Contínua

**Objetivo:** Planejar a evolução do blog e automatizar processos.

**Issues**

- [ ] Criar sistema de comentários (giscus ou utterances)
- [ ] Adicionar RSS feed e integração com newsletter
- [ ] Escrever guia de contribuição e manutenção
- [ ] Criar cronograma editorial (posts mensais)
- [ ] Revisar e atualizar documentação do projeto

📅 **Duração estimada:** Contínuo  
🔗 **Dependência:** Milestone 7

---

## 💡 Estrutura sugerida no GitHub Project

| Status | Exemplos de Cards |
|:--|:--|
| **Backlog** | “Criar manifesto pessoal”, “Escolher stack tecnológica” |
| **Em progresso** | “Implementar layout base”, “Criar mockups” |
| **Revisão** | “Configurar CI/CD”, “Revisar acessibilidade” |
| **Concluído** | “Definir paleta de cores”, “Publicar no Vercel” |

---

📘 **Legenda**

- **🧱** Planejamento e base conceitual  
- **🎨** Design e identidade visual  
- **💻** Desenvolvimento técnico  
- **☁️** Infraestrutura e deploy  
- **🚀** Otimização  
- **🔁** Manutenção contínua  

---

> _“Aprender construindo é o caminho mais sólido — este blog é a prova viva disso.”_
