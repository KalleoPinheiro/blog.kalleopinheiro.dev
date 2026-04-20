# Data Model: shadcn/ui Configuration & Components

**Date**: 2026-04-20

## Entity: Component Configuration

Represents the metadata and runtime configuration for a shadcn/ui component within the project.

**File Location**: `src/components/ui/[component-name].tsx`

**Structure**:
```typescript
// Entity attributes (implicit in file structure)
- component_name: string (from filename)
- source_origin: "shadcn-ui-library" (literal value)
- tailwind_classes: string[] (Tailwind CSS classes applied)
- dependencies: string[] (Radix UI, utilities, etc.)
- exported_types: string[] (React types, interfaces)
- is_customizable: boolean (supports theming/props)
- migration_status: "original" | "migrated" | "imported"
```

**Validation Rules**:
- `component_name` must be kebab-case (e.g., "button", "input-field")
- Must export a React component as default export
- All Tailwind classes must exist in project's Tailwind config
- Dependencies must be declared in `package.json`
- Component must be importable via path alias `@/components/ui/[name]`

**Lifecycle**:
- State: `not_configured` → `configured` → `component_added`
- From `not_configured`: System blocks component imports with error message
- From `configured`: Developers can add components via CLI
- From `component_added`: Component available for use in application

## Entity: Project Configuration

Represents the shadcn/ui setup metadata for the entire project.

**File Location**: `components.json` (in project root or as specified in CLI config)

**Structure**:
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "aliasPrefix": "@",
  "componentDirectory": "src/components/ui"
}
```

**Attributes**:
- `style`: UI style framework (shadcn standard)
- `rsc`: React Server Components enabled (boolean)
- `tsx`: TypeScript usage (boolean)
- `aliasPrefix`: Import alias for project (e.g., "@" = `src/`)
- `componentDirectory`: Where components are stored (relative to root)

**Validation Rules**:
- `componentDirectory` must exist in filesystem
- `aliasPrefix` must match `tsconfig.json` path aliases
- File must be valid JSON
- All required fields must be present

**Relationships**:
- References: `tsconfig.json` (path aliases), `package.json` (dependencies), `tailwind.config.ts` (CSS config)

## Entity: Tailwind CSS Configuration

Represents the Tailwind CSS setup that powers shadcn/ui components.

**File Location**: `tailwind.config.ts`

**Required Configuration**:
```typescript
export default {
  content: [
    "./src/**/*.tsx"
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui color palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        // ... additional colors
      }
    }
  }
}
```

**Attributes**:
- `content`: Files to scan for Tailwind classes
- `theme.extend.colors`: CSS variables for theming (hsl format)

**Validation Rules**:
- Must scan `src/**/*.tsx` for class detection
- Color values must use CSS variables (not hardcoded hex)
- CSS variables must be defined in globals.css
- Config must be TypeScript, not JavaScript

**Relationships**:
- References: `globals.css` (CSS variable definitions)
- Referenced by: All component files (for styling)

## Entity: TypeScript Configuration

Represents type system and import path setup.

**File Location**: `tsconfig.json`

**Required Setup**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Attributes**:
- `baseUrl`: Project root for relative imports
- `paths`: Import aliases mapping

**Validation Rules**:
- `@/*` alias must point to `src/` directory
- Base URL must be `.` (project root)
- Aliases must be consistent across all config files

**Relationships**:
- Referenced by: Build tools, IDEs, component imports
- Must align with: `components.json` aliasPrefix

## Entity: Dependency Set

Represents external packages required for shadcn/ui functionality.

**File Location**: `package.json` (dependencies section)

**Core Dependencies**:
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.2.4",
    "@radix-ui/react-*": "^1.x.x",
    "lucide-react": "^latest",
    "class-variance-authority": "^latest",
    "clsx": "^latest",
    "tailwind-merge": "^latest"
  }
}
```

**Attributes**:
- Package name (string)
- Version constraint (caret range per clarification Q3)
- Install status (installed | pending)

**Validation Rules**:
- All Radix UI components must use caret versions
- lucide-react must be caret-versioned
- Class utility packages required for component styling
- Versions must allow automatic patch/minor updates

**Lifecycle**:
- New component CLI adds → dependencies → validate → install

## Relationships & Dependencies

```
components.json ← references → tsconfig.json (path aliases)
                ← references → tailwind.config.ts (CSS)
                ← references → package.json (dependencies)
                
Component Files → reference → @/components/ui/* imports
                → reference → Tailwind classes
                → reference → dependencies

tailwind.config.ts → requires → globals.css (CSS variables)
                  → extends → Tailwind default theme
```

## State Transitions

```
NOT_CONFIGURED
  ↓ (setup runs)
CONFIGURED
  ├─ (add component via CLI)
  └→ COMPONENT_ADDED
     └─ (component added, repeatable)
```

## Validation & Testing Strategy

- **Configuration Validity**: Check file format (JSON/TS), required fields, path references
- **Import Paths**: Verify alias resolution works in IDE and build
- **Component Access**: Verify added components are importable and typed
- **Build Success**: Verify TypeScript compilation succeeds, no unresolved imports
- **Runtime**: Verify component renders without errors, styles apply correctly
