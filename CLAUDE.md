# Estrutura de Pastas — Plano de Migração

## Visão Geral

Este documento descreve o plano e execução da migração da estrutura de pastas da aplicação para o padrão moderno de Next.js App Router com organização por domains (features) e componentes por tipo.

**Status:** ✅ Concluído (3 commits atômicos)

---

## Estrutura Alvo

```
src/
├─ app/
│  ├─ (public)/
│  │  ├─ page.tsx
│  │  ├─ page.test.tsx
│  │  └─ ...
│  ├─ (auth)/              # [Placeholder para futura expansão]
│  ├─ (dashboard)/         # [Placeholder para futura expansão]
│  ├─ api/
│  │  ├─ health/route.ts
│  │  ├─ docs/route.ts
│  │  └─ rss.xml/route.ts
│  ├─ layout.tsx (raiz)
│  └─ [...metadata routes]
│
├─ components/
│  ├─ ui/
│  │  ├─ button.tsx
│  │  ├─ button.test.tsx
│  │  └─ card.tsx
│  ├─ layouts/
│  │  ├─ site-header.tsx
│  │  ├─ site-header.test.tsx
│  │  ├─ site-footer.tsx
│  │  └─ site-footer.test.tsx
│  ├─ common/              # [Placeholder]
│  └─ providers/           # [Placeholder]
│
├─ features/               # [Placeholder para domain-driven features]
├─ hooks/                  # [Placeholder para custom hooks]
├─ services/               # [Placeholder para API clients]
├─ types/                  # [Placeholder para tipos globais]
├─ styles/
│  └─ globals.css
└─ lib/
   ├─ env.ts
   ├─ metadata.ts
   ├─ site-config.ts
   └─ utils.ts
```

---

## Mudanças Implementadas

### ✅ Commit 1: Renomear `layout/` → `layouts/`
**Mensagem:** `refactor(components): rename layout to layouts`

**Arquivos movidos:** 4
- `src/components/layout/site-header.tsx` → `src/components/layouts/site-header.tsx`
- `src/components/layout/site-header.test.tsx` → `src/components/layouts/site-header.test.tsx`
- `src/components/layout/site-footer.tsx` → `src/components/layouts/site-footer.tsx`
- `src/components/layout/site-footer.test.tsx` → `src/components/layouts/site-footer.test.tsx`

**Motivo:** Alinhar com convenção plural na estrutura (ui, layouts, common, providers).

---

### ✅ Commit 2: Mover `page.tsx` para Route Group `(public)`
**Mensagem:** `refactor(app): move page.tsx to (public) route group`

**Arquivos movidos:** 2
- `src/app/page.tsx` → `src/app/(public)/page.tsx`
- `src/app/page.test.tsx` → `src/app/(public)/page.test.tsx`

**Motivo:** Pré-configurar a estrutura de route groups para futuro crescimento (auth, dashboard, etc.). Segue convenção Next.js 13+ com App Router.

**Impacto:** As rotas públicas agora estão explicitamente organizadas em um grupo, facilitando adição de layouts específicos (`(public)/layout.tsx`) quando necessário.

---

### ✅ Commit 3: Mover `globals.css` e Atualizar Imports
**Mensagem:** `refactor(app): move globals.css to src/styles and update imports`

**Arquivos movidos/atualizados:** 2
- `src/app/globals.css` → `src/styles/globals.css`
- `src/app/layout.tsx` (imports atualizados):
  - `import "./globals.css"` → `import "@/styles/globals.css"`
  - `@/components/layout/` → `@/components/layouts/`

**Motivo:**
1. Separar estilos globais em pasta dedicada (`src/styles/`) alinha-se com padrão SRP (Single Responsibility Principle).
2. Usar alias absoluto (`@/styles/`) torna imports mais consistentes com resto da base.
3. Atualizar imports de componentes layout para layouts (decorrência do Commit 1).

**Impacto:** Build validation passou—CSS é carregado corretamente via alias.

---

## Estrutura de Pastas Criadas (Placeholders)

Para facilitar crescimento futuro, as seguintes pastas foram pré-criadas:

| Pasta | Propósito | Status |
|-------|----------|--------|
| `src/components/common/` | Componentes reutilizáveis (EmptyState, Loading, ErrorState) | Vazia |
| `src/components/providers/` | Providers (Auth, Theme, Toast) | Vazia |
| `src/features/` | Domain-driven features (future: auth/, blog/, user/) | Vazia |
| `src/hooks/` | Custom hooks (useDebounce, useMediaQuery, etc.) | Vazia |
| `src/services/` | API clients, data fetching, integrations | Vazia |
| `src/types/` | Tipos globais, interfaces TypeScript | Vazia |
| `src/styles/` | Estilos globais (CSS, animações, tokens) | ✓ globals.css |

---

## Checklist de Validação

- ✅ Testes unitários: 48 passed em 15 arquivos de teste
- ✅ Build: Sucesso em 3.4s (TypeScript verificado)
- ✅ Rotas públicas: Acessíveis via `(public)` route group
- ✅ CSS global: Carregado via alias `@/styles/globals.css`
- ✅ Imports: Todos atualizados (layout → layouts)
- ✅ Git history: 3 commits atômicos, reversíveis

---

## Próximos Passos (Roadmap Futuro)

### Phase 1: Expandir Route Groups (quando houver necessidade)
```bash
# Exemplo: adicionar autenticação
mkdir -p src/app/(auth)/login
mkdir -p src/app/(auth)/register
# Criar layout.tsx em src/app/(auth)/layout.tsx para shell compartilhado
```

### Phase 2: Preencher `src/features/`
```
src/features/
├─ blog/
│  ├─ components/
│  ├─ hooks/
│  ├─ utils/
│  └─ types.ts
├─ auth/
│  ├─ components/
│  │  ├─ login-form.tsx
│  │  └─ register-form.tsx
│  ├─ hooks/
│  ├─ services/
│  └─ types.ts
```

### Phase 3: Adicionar Providers em `src/app/providers.tsx`
```typescript
// src/app/providers.tsx
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

### Phase 4: Preencher `src/hooks/` com custom hooks reutilizáveis
- `use-debounce.ts`
- `use-media-query.ts`
- `use-toast.ts`
- `use-fetch.ts`

---

## Como Aplicar em Futuro (se necessário reverter)

Cada commit é **reversível** via `git revert`:

```bash
# Reverter com segurança
git revert 1359752  # Revert Commit 3 (globals.css)
git revert 450144a  # Revert Commit 2 (page.tsx)
git revert 0b8739b  # Revert Commit 1 (layout → layouts)
```

Ou restaurar um arquivo específico:
```bash
git checkout <commit>~1 -- src/app/globals.css
```

---

## Notas de Design

1. **Alias `@/*` mantido:** Não foram adicionadas aliases específicas (e.g., `@/components`, `@/hooks`) para manter simplicidade. Se necessário adicionar no futuro, basta atualizar `tsconfig.json`.

2. **Route Groups: `(public)` vs Raiz:** A página raiz está em `src/app/(public)/page.tsx` para antecipação de estrutura multi-zona. Se houver apenas rotas públicas, pode-se simplificar para `src/app/page.tsx` later (trivial).

3. **CSS em `src/styles/`:** Alternativa mais limpa que manter em `src/app/`. PostCSS e Tailwind resolvem corretamente via alias absoluto.

4. **Colocação de Testes:** `.test.tsx` files permanecem lado a lado com componentes (`co-location`), seguindo Next.js conventions e facilitando manutenção.

---

@AGENTS.md
