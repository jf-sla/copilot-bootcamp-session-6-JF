<!--
  SYNC IMPACT REPORT
  ==================
  Version change: [unversioned template] → 1.0.0
  Modified principles: N/A (initial ratification — all sections new)

  Added sections:
  - Core Principles I–V
  - Technical Constraints
  - Development Workflow
  - Governance

  Removed sections: N/A

  Templates reviewed:
  - ✅ .specify/templates/plan-template.md — Constitution Check section is generic;
       no update needed.
  - ✅ .specify/templates/spec-template.md — No outdated principle references;
       no update needed.
  - ✅ .specify/templates/tasks-template.md — Task categories (tests, impl, infra)
       align with principles; no update needed.

  Deferred TODOs: None
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Consistency

All code MUST adhere to the project's established style, naming, and quality standards:

- **Naming**: `camelCase` for variables/functions, `PascalCase` for React components and
  classes, `UPPER_SNAKE_CASE` for constants.
- **Formatting**: 2-space indentation, LF line endings, max ~100 chars per line,
  no trailing whitespace.
- **DRY**: Common logic MUST be extracted into shared utilities or reusable components;
  duplication is prohibited.
- **SOLID**: Each module, component, or function MUST have a single, well-defined
  responsibility. Dependencies MUST be injected rather than hardcoded.
- **Error Handling**: All fallible operations (API calls, async I/O) MUST include
  try/catch with meaningful user-facing feedback.
- **Linting**: Code MUST pass ESLint checks before committing; all errors and warnings
  MUST be resolved before opening a pull request.
- **Imports**: Follow the prescribed import order (external → internal → styles);
  circular dependencies are prohibited.

**Rationale**: Consistent, well-structured code reduces cognitive load, prevents
regressions, and keeps the codebase maintainable as the team grows.

### II. Test-Driven Development (NON-NEGOTIABLE)

Testing is an integral part of development, not an afterthought:

- Tests MUST be written alongside (or before) implementation.
- Code coverage MUST reach **80% or above** across all packages.
- Each test MUST be independent: no shared mutable state; each test sets up its own
  data and cleans up after itself.
- All external dependencies (API calls, timers) MUST be mocked in unit tests.
- Test names MUST be descriptive and explain the behavior under test.
- Tests MUST be co-located with source files in `__tests__/` directories and follow
  the `{filename}.test.js` naming convention.

**Rationale**: High-quality, isolated tests are the primary safety net against
regressions and serve as living documentation of expected behavior.

### III. Functional Scope Discipline

The application MUST implement only the features described in the functional
requirements; scope creep is prohibited:

- Allowed features: create, view, update status, update details, and delete todo items.
- Out-of-scope items (authentication, multi-user support, priorities, categories,
  filtering, search, undo/redo, bulk operations, mobile-specific optimization) MUST NOT
  be added without explicit approval and an updated requirements document.
- Single-user design: no user-identification logic; todos are stored globally.
- Confirmation dialogs MUST be shown before any destructive action (e.g., delete).

**Rationale**: A tightly scoped MVP delivers real value quickly without accruing
unnecessary complexity or technical debt.

### IV. UI Design System Compliance

All UI work MUST follow the established design system defined in `docs/ui-guidelines.md`:

- **Colors**: Use defined light/dark-mode token values; arbitrary colors MUST NOT be
  introduced.
- **Typography**: Follow the prescribed font sizes and weights
  (heading 28px/700, body 16px/400, button 14px/600, etc.).
- **Spacing**: All spacing MUST be multiples of 8px (xs=8, sm=16, md=24, lg=32, xl=48).
- **Layout**: Single-column, max 600px wide on large screens with defined margin values.
- **Dark/Light mode**: Both modes MUST be supported using the defined color tokens.
- **Component contracts**: `TodoCard`, `TodoForm`, `ConfirmDialog`, and `ThemeToggle`
  MUST respect their defined visual structure (checkbox left, content center,
  actions right, overlay dialog, etc.).

**Rationale**: A consistent visual language creates a cohesive user experience and
prevents design debt.

### V. Simplicity & YAGNI

Prefer the simplest solution that satisfies the requirement:

- Abstractions, helpers, or utilities that serve only a single use-case MUST NOT be
  created.
- Premature optimisation (e.g., memoisation, lazy loading) MUST be avoided unless a
  concrete, measured performance problem exists.
- Component props MUST be minimal; unnecessary props MUST NOT be passed
  (Interface Segregation).
- Comments MUST explain *why*, not *what*; obvious comments are prohibited; all
  documentation MUST be kept up to date.
- `console` statements MUST NOT appear in production code paths.

**Rationale**: Simple, readable code is easier to test, review, and maintain.
Speculative complexity is a liability, not an asset.

## Technical Constraints

- **Frontend**: React (functional components with hooks), plain CSS,
  Jest + React Testing Library.
- **Backend**: Node.js with Express.js; Jest for backend tests.
- **Monorepo**: `packages/frontend` and `packages/backend` managed via npm workspaces.
- **Runtime**: Node.js ≥ v16, npm ≥ v7.
- **Persistence**: MUST use the existing Express.js API mechanism; no database schema
  changes beyond basic todo storage.
- **No authentication**: Single-user application; authentication and authorization are
  explicitly out of scope.

## Development Workflow

- All changes MUST be made on a feature branch; direct commits to `main` are not
  permitted.
- Pull requests MUST pass all existing tests and meet the 80%+ coverage gate
  before merge.
- ESLint MUST report zero errors in the changeset before a PR is opened.
- Code review is required for all pull requests.
- Breaking API or UI changes MUST be reflected in updated tests and, where applicable,
  updated documentation in the `docs/` directory.

## Governance

- This constitution supersedes all other stated practices; in the event of conflict,
  the constitution takes precedence.
- Amendments require: (1) a documented rationale, (2) an updated `Last Amended` date,
  and (3) a version bump following semantic versioning:
  - **MAJOR**: Removal or redefinition of an existing principle
    (backward-incompatible governance change).
  - **MINOR**: New principle, section, or materially expanded guidance added.
  - **PATCH**: Clarifications, wording corrections, or non-semantic refinements.
- All pull request reviews MUST verify compliance with the Core Principles.
- Violations of Principle V (Simplicity & YAGNI) MUST be explicitly justified in the
  PR description.
- Runtime development guidance is maintained in `docs/` (`coding-guidelines.md`,
  `testing-guidelines.md`, `ui-guidelines.md`, `functional-requirements.md`).

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
