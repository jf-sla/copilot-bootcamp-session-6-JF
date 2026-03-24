# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-03-24 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Users need a visual indicator on todo cards that shows when an incomplete item is past
its due date. The implementation adds conditional rendering to the existing `TodoCard`
component: when a todo is incomplete and its `dueDate` YYYY-MM-DD string is strictly
less than today's YYYY-MM-DD string, the due date text is rendered in `--danger-color`
and an inline "Overdue" label is appended after it. No backend changes are required;
no new files are needed.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2, Node.js 24.11.1  
**Primary Dependencies**: React 18.2, react-scripts 5.0.1 (Create React App), @testing-library/react  
**Storage**: N/A — feature is purely presentational; no data model changes  
**Testing**: Jest (via react-scripts), @testing-library/react — `render`, `screen`, `fireEvent`  
**Target Platform**: Desktop browser (single-user web app, no mobile optimization required)  
**Project Type**: Web application — React frontend + Express.js backend (monorepo)  
**Performance Goals**: Synchronous derived state; no async operations; render cost is negligible (string comparison per card)  
**Constraints**: Must use existing CSS custom property `--danger-color` from `theme.css`; no timezone conversion; no new files  
**Scale/Scope**: Single-user; number of todos is small (in-memory SQLite); no performance concerns

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Consistency | ✅ PASS | `camelCase` for helpers, `PascalCase` preserved for component; no duplication |
| II. Test-Driven Development | ✅ PASS | New tests MUST be added to `TodoCard.test.js` covering all 5 acceptance scenarios |
| III. Functional Scope Discipline | ✅ PASS | Feature is within approved scope; no new entities or out-of-scope functionality |
| IV. UI Design System Compliance | ✅ PASS | Uses only `--danger-color` CSS token; no arbitrary colors; no layout changes |
| V. Simplicity & YAGNI | ✅ PASS | No new files, no new abstractions; logic is inline in existing `TodoCard`; minimal CSS addition |

**POST-DESIGN RE-CHECK**: ✅ All principles still pass after Phase 1 design. No complexity justification required.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md          # This file
├── research.md      # Phase 0 output
├── data-model.md    # Phase 1 output
├── quickstart.md    # Phase 1 output
└── tasks.md         # Phase 2 output (/speckit.tasks command)
```

Note: No `contracts/` directory — this feature introduces no API or interface changes.

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                  ← MODIFY: add overdue detection + conditional rendering
│   │   └── __tests__/
│   │       └── TodoCard.test.js         ← MODIFY: add overdue indicator test cases
│   └── styles/
│       └── theme.css                    ← READ ONLY: --danger-color already defined; no changes needed
│       └── App.css (or TodoCard CSS)    ← MODIFY: add .todo-due-date--overdue CSS rule
```

**Structure Decision**: Frontend-only change. Only two files require modification:
`TodoCard.js` (logic + JSX) and `TodoCard.test.js` (new test cases). A single CSS
rule is added for the overdue state. Backend is untouched.
