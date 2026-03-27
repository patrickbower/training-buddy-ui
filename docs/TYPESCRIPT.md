# TypeScript Conventions

Strict TypeScript is non-negotiable. No `any`. No type assertions (`as Foo`) unless absolutely unavoidable with a comment explaining why.

## Compiler settings

`tsconfig.app.json` enables `strict: true`. Do not relax any flags.

## Key rules

- Prefer `interface` for object shapes, `type` for unions and computed types.
- Use `unknown` instead of `any` when a type is genuinely unknown, then narrow it.
- All function parameters and return types must be explicitly typed.
- Never use non-null assertion (`!`) without a comment explaining the guarantee.
- Prefer `readonly` arrays and properties where mutation is not intended.

## Naming

- Types and interfaces: `PascalCase` (e.g. `TrainingPlan`, `CoachMessage`)
- Zustand stores: `use[Domain]Store` (e.g. `useConversationStore`)
- TanStack Query hooks: `use[Entity][Action]` (e.g. `useRunHistory`, `useTrainingPlanCreate`)
- Enums: avoid — use `as const` objects instead.

See [DOMAIN.md](DOMAIN.md) for canonical entity type definitions.
See [TESTING.md](TESTING.md) for type-safe testing patterns.
