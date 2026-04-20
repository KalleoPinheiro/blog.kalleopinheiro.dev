# Research: shadcn/ui Configuration with MCP

**Date**: 2026-04-20  
**Context**: Configure shadcn/ui in Next.js 16.2.4 project using Claude's shadcn/ui MCP

## Research Findings

### 1. shadcn/ui MCP Capabilities

**Decision**: Use Claude's built-in shadcn/ui MCP tools to manage component configuration and additions

**Rationale**: 
- MCP provides direct access to current shadcn/ui component library
- Ensures components match official specifications
- Reduces manual setup errors
- Leverages real-time updates without version lag

**MCP Tools Available**:
- `list_components` — list all available shadcn/ui components
- `get_component` — retrieve component source code
- `get_component_demo` — get usage examples
- `get_component_metadata` — component dependencies and requirements
- `list_blocks` — pre-built page layouts
- `list_themes` — available theme presets
- `apply_theme` — apply theme configuration

**Alternatives Considered**:
- Manual shadcn/ui CLI init: requires version management, less reliable
- Third-party component libraries: lack of integration with project standards
- Custom components: duplicates work, increases maintenance burden

### 2. shadcn/ui + Next.js 16.2.4 Integration

**Decision**: Configure shadcn/ui following Next.js 16.2.4 best practices with App Router

**Rationale**:
- Project uses Next.js 16.2.4 App Router (confirmed in CLAUDE.md)
- shadcn/ui components require Tailwind CSS (already available)
- React 19 compatibility confirmed with latest shadcn/ui
- TypeScript 5.x provides proper type definitions

**Setup Requirements**:
1. **components.json**: CLI configuration file pointing to component directory (`src/components/ui/`)
2. **tailwind.config.ts**: Already exists; must be extended with shadcn/ui color scheme
3. **tsconfig.json**: Path aliases (`@` for `src/`) must be configured for imports
4. **package.json**: Dependencies (radix-ui, lucide-react, etc.) must be caret-versioned
5. **globals.css**: Tailwind directives + shadcn/ui overrides

**Alternatives Considered**:
- Different component directory: rejected (using project convention `src/components/ui/`)
- Custom theme: rejected (use default shadcn/ui theme per assumption)
- Pinned versions: rejected (flexible caret ranges per clarification Q3)

### 3. Component Migration Strategy

**Decision**: Migrate existing button to shadcn/ui standards; adopt default styling

**Rationale**:
- Ensures consistency with library system
- Reduces technical debt
- Allows team to use standard button for future additions
- Developers can use CLI to add variations

**Migration Steps**:
1. Backup existing button component
2. Replace with shadcn/ui button (via MCP or CLI)
3. Update imports across codebase
4. Verify functionality matches or improves

**Alternatives Considered**:
- Preserve original styling: creates maintenance burden, inconsistency
- Create wrapper component: deferred to future enhancements

### 4. Error Handling & Validation

**Decision**: Setup process validates configuration; fails fast with clear errors

**Rationale**:
- Prevents silent configuration mismatches
- Gives developers clear remediation path
- Aligns with project's security-by-design principle

**Configuration Validation Checks**:
- Verify `components.json` exists and is valid
- Verify path aliases are configured in `tsconfig.json`
- Verify Tailwind CSS configuration includes shadcn/ui colors
- Verify required dependencies are installed

**Alternatives Considered**:
- Automatic conflict resolution: too risky, hides problems
- Interactive resolution: deferred to future enhancement

### 5. Developer Experience

**Decision**: Use CLI commands + MCP for consistent, repeatable component additions

**Rationale**:
- Single source of truth (MCP)
- No manual file copying
- Automatic dependency management
- Clear documentation of patterns

**Developer Workflow**:
```
# Add component via CLI or MCP
shadcn-ui add button
shadcn-ui add input

# Component automatically placed in src/components/ui/
# Developer imports and uses in application
```

**Alternatives Considered**:
- Manual component placement: error-prone, inconsistent
- Custom generator: unnecessary complexity given CLI exists

## Unknowns Resolved

✓ shadcn/ui MCP available and capable  
✓ Next.js 16.2.4 compatibility confirmed  
✓ Component directory strategy defined  
✓ Error handling approach selected  
✓ Dependency versioning strategy selected  

## Next Steps

Proceed to Phase 1 design:
- Create data model for component configuration
- Define component contracts
- Create quickstart guide
- Update agent context with findings
