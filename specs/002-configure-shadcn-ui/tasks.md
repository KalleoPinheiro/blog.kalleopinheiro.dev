# Implementation Tasks: Configure shadcn/ui

**Feature**: Configure shadcn/ui | **Branch**: `002-configure-shadcn-ui` | **Date**: 2026-04-20

## Overview

This tasks.md organizes implementation work into phases based on user stories from the specification. Each phase is independently testable and deliverable.

**User Stories**:
- **US1 (P1)**: Setup Project for Proper Component Library Usage
- **US2 (P2)**: Migrate Existing Component to Follow Standards
- **US3 (P3)**: Establish Standard Component Development Practices

**Total Tasks**: 17 | **Phases**: 4 (Setup + 3 User Stories)

---

## Phase 1: Setup & Foundation

*Foundation tasks that must complete before user story implementation*

### Independent Test Criteria
- All configuration files created in correct locations
- No TypeScript or build errors
- Project structure matches plan
- Dependencies installed successfully

**Tasks**:

- [ ] T001 Create `frontend/src/components/ui/` directory structure per plan
- [ ] T002 Verify `components.json` exists and is correctly configured for `src/components/ui/`
- [ ] T003 Verify `tailwind.config.ts` includes shadcn/ui color variables and content scanning
- [ ] T004 Verify `tsconfig.json` has path alias `@/*` → `./src/*` configured
- [ ] T005 Verify `frontend/src/lib/utils.ts` exists with `cn()` utility function
- [ ] T006 Verify `frontend/src/app/globals.css` includes Tailwind directives and CSS variables
- [ ] T007 Install all required dependencies (radix-ui, lucide-react, class-variance-authority, clsx, tailwind-merge) with caret versions in `frontend/package.json`
- [ ] T008 Run `npm install` in `frontend/` to validate dependency resolution and installation

---

## Phase 2: User Story 1 (P1) - Setup Project for Proper Component Library Usage

*Initialize shadcn/ui component library system; enable component additions via CLI*

### Story Goal
Developers can run shadcn/ui CLI commands to add components, which are automatically placed in the correct directory with proper imports and styles.

### Independent Test Criteria
- ✓ `npm run build` succeeds in `frontend/`
- ✓ TypeScript compilation has no errors
- ✓ shadcn/ui CLI can add a test component successfully
- ✓ Added component is importable via `@/components/ui/[name]`
- ✓ Added component renders without style errors
- ✓ Error messages are clear if configuration is missing

**Tasks**:

- [ ] T009 [US1] Configure shadcn/ui CLI via MCP: use `list_components` to verify available components
- [ ] T010 [P] [US1] Add Button component using shadcn/ui MCP and save to `frontend/src/components/ui/button.tsx`
- [ ] T011 [P] [US1] Add Input component using shadcn/ui MCP and save to `frontend/src/components/ui/input.tsx`
- [ ] T012 [US1] Create `frontend/src/lib/__tests__/component-import.test.ts` to verify component imports resolve correctly
- [ ] T013 [US1] Document error handling for missing configuration: add validation script in `frontend/scripts/validate-config.js`
- [ ] T014 [US1] Create error message guide in `COMPONENT_SETUP_ERRORS.md` for common configuration issues

---

## Phase 3: User Story 2 (P2) - Migrate Existing Component to Follow Standards

*Replace manually created button with shadcn/ui standard; ensure consistency with library*

### Story Goal
The existing button component is replaced with shadcn/ui standard version; imports across codebase are updated; styling uses shadcn/ui defaults.

### Independent Test Criteria
- ✓ Button component at `frontend/src/components/ui/button.tsx` matches shadcn/ui structure
- ✓ Button follows component contract (exports, props interface, styling method)
- ✓ All imports of button component in codebase resolve correctly
- ✓ Button renders with shadcn/ui default styling
- ✓ TypeScript has no errors for button prop types
- ✓ Existing button usage in application continues to work (no regression)

**Tasks**:

- [ ] T015 [US2] Locate existing manual button component in codebase and document its location and current usage
- [ ] T016 [US2] Replace manual button with shadcn/ui Button from `frontend/src/components/ui/button.tsx` (already added in US1)
- [ ] T017 [P] [US2] Update all imports of old button component to import from `@/components/ui/button` across application code
- [ ] T018 [US2] Verify button renders correctly in application with shadcn/ui default styling; check for visual regressions
- [ ] T019 [US2] Create test file `frontend/src/components/ui/__tests__/button.test.tsx` to verify button variants and props

---

## Phase 4: User Story 3 (P3) - Establish Standard Component Development Practices

*Document standards and patterns; enable team to add components consistently*

### Story Goal
Team has clear, accessible documentation for adding components following shadcn/ui and project standards. New developers can add components without guidance.

### Independent Test Criteria
- ✓ Component contract documented and available at `specs/002-configure-shadcn-ui/contracts/component-contract.md`
- ✓ Quickstart guide available at `specs/002-configure-shadcn-ui/quickstart.md`
- ✓ Example of adding new component (e.g., Card) successfully demonstrates patterns
- ✓ Team member can follow guide to add component independently

**Tasks**:

- [ ] T020 [P] [US3] Create example component documentation: add `Card` component via MCP to `frontend/src/components/ui/card.tsx`
- [ ] T021 [US3] Document component addition workflow in `frontend/COMPONENT_DEVELOPMENT.md` with step-by-step CLI instructions
- [ ] T022 [US3] Create component template scaffold in `frontend/.templates/component.tsx` for future manual component creation
- [ ] T023 [US3] Add component checklist to `COMPONENT_SETUP_ERRORS.md` for developers to verify their components before merge
- [ ] T024 [US3] Create short video or animated guide showing component addition workflow (optional, lower priority)

---

## Cross-Cutting Concerns & Polish

*Testing, documentation, and validation tasks*

### Test Coverage

- [ ] T025 Create integration test in `frontend/__tests__/integration/component-library.test.ts` to verify:
  - shadcn/ui components render without errors
  - Button and Input variants work correctly
  - Component imports resolve via path aliases
  - TypeScript types are correct

- [ ] T026 Create end-to-end test demonstrating full workflow: add new component → import → use in page

### Documentation & Standards

- [ ] T027 Ensure component contract is linked from project README or component library documentation
- [ ] T028 Add `COMPONENT_DEVELOPMENT.md` reference to project `CONTRIBUTING.md`
- [ ] T029 Document TypeScript path alias requirements in `frontend/README.md`

### Validation & Verification

- [ ] T030 Run `npm run build` and `npm run lint` in `frontend/` to verify no errors
- [ ] T031 Run TypeScript compiler in strict mode: `tsc --noEmit`
- [ ] T032 Verify all added components follow the component contract (export signature, styling, accessibility)

---

## Dependencies & Execution Order

### Critical Path (Minimum Implementation)

```
Phase 1 Setup (T001-T008)
    ↓
Phase 2 US1 (T009-T014)
    ↓
Phase 3 US2 (T015-T019)
    ↓
Phase 4 US3 (T020-T024)
    ↓
Testing & Validation (T025-T032)
```

### Parallel Execution Opportunities

**Within Phase 2 (US1)**: T010, T011 can run in parallel (independent components)

**Within Phase 3 (US2)**: T017 can run in parallel with T018 (different files)

**Within Phase 4 (US3)**: T020 can run in parallel with T021 (documentation and code)

### No Cross-Story Dependencies
- US1, US2, US3 build on Phase 1 foundation but don't depend on each other
- Could implement US3 documentation before US2 if needed
- Order suggests: US1 (setup) → US2 (migration) → US3 (practices)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
Complete **Phase 1 + Phase 2 (US1)** for MVP:
- Project configured and ready for component addition
- shadcn/ui CLI functional
- First components added successfully

**Estimated effort**: 4-6 hours

### Full Implementation
Complete all phases through **Phase 4 (US3)**:
- Component library fully operational
- Existing button migrated
- Team has clear documentation and practices

**Estimated effort**: 8-12 hours

### Post-Launch (Future)
- T024: Video guide (optional)
- Performance optimization for component library
- Storybook integration for visual testing
- Monorepo expansion if component library grows

---

## Acceptance Criteria Summary

| User Story | Success Metric | Tasks |
|------------|---|-------|
| US1 (P1) | Component CLI works; components importable | T009-T014 |
| US2 (P2) | Button migrated; imports updated; no regression | T015-T019 |
| US3 (P3) | Documentation complete; team can add components independently | T020-T024 |

---

## Notes

- All tasks follow the **strict checklist format**: `- [ ] [TaskID] [P] [Story] Description with file path`
- Tasks are organized by user story for independent implementation
- Each task is specific enough for LLM execution without additional context
- File paths are absolute and clear in each task
- Parallel opportunities identified for CI/CD optimization
- Testing tasks ensure acceptance criteria are met
