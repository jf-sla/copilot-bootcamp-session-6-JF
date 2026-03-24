---
description: "Task list for 001-overdue-todo-items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`  
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | quickstart.md ✅  
**Contracts**: N/A — no API or interface changes

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Exact file paths included in all descriptions

## Path Conventions

```
packages/frontend/src/components/TodoCard.js
packages/frontend/src/components/__tests__/TodoCard.test.js
packages/frontend/src/App.css
```

---

## Phase 1: Setup (No separate setup needed)

This feature modifies only existing files. No project initialization, dependency
installation, or scaffolding is required. Proceed directly to implementation.

---

## Phase 2: Foundational (Shared prerequisite for both stories)

**Purpose**: Add the CSS rule that both user stories depend on.  
Without it, the overdue class has no visual effect.

**⚠️ CRITICAL**: T001 MUST be completed before implementing the JSX in either story.

- [ ] T001 Add `.todo-due-date--overdue { color: var(--danger-color); }` rule to `packages/frontend/src/App.css` immediately after the existing `.todo-due-date` rule

**Checkpoint**: CSS token wired up — US1 and US2 implementation can now begin.

---

## Phase 3: User Story 1 - Visual Overdue Indicator on Todo Card (Priority: P1) 🎯 MVP

**Goal**: An incomplete todo with a past due date displays the due date text in
danger color with "· Overdue" appended inline. All other cards are unaffected.

**Independent Test**: Render a `TodoCard` with `{ dueDate: '2020-01-01', completed: 0 }`
and today mocked to 2026-03-24. Assert `screen.getByText(/Overdue/)` is present and
the `.todo-due-date--overdue` class is applied. Render cards with future/today/no date
and assert "Overdue" is absent.

### Tests for User Story 1 ⚠️ Write FIRST — ensure they FAIL before T003

- [ ] T002 [US1] Add `jest.useFakeTimers().setSystemTime(new Date('2026-03-24'))` setup/teardown to the describe block in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T003 [P] [US1] Add test: incomplete todo with past due date shows "· Overdue" inline and has `todo-due-date--overdue` CSS class in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T004 [P] [US1] Add test: incomplete todo with today's due date does NOT show "Overdue" in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T005 [P] [US1] Add test: incomplete todo with future due date does NOT show "Overdue" in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T006 [P] [US1] Add test: incomplete todo with no due date does NOT show "Overdue" in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T007 [P] [US1] Add test: completed todo with past due date does NOT show "Overdue" in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 1 (depends on T001–T007 tests failing)

- [ ] T008 [US1] Add `const todayString = new Date().toLocaleDateString('en-CA');` and `const overdue = !todo.completed && !!todo.dueDate && todo.dueDate < todayString;` to the render body of `packages/frontend/src/components/TodoCard.js` (before the non-edit return statement)
- [ ] T009 [US1] Update the due date `<p>` element in `packages/frontend/src/components/TodoCard.js` to use `className={\`todo-due-date\${overdue ? ' todo-due-date--overdue' : ''}\`}` and append `{overdue && ' · Overdue'}` after the formatted date

**Checkpoint**: User Story 1 fully functional and independently testable.  
Run `cd packages/frontend && npm test -- --testPathPattern=TodoCard` to verify T003–T007 pass.

---

## Phase 4: User Story 2 - Overdue State Clears When Todo is Completed (Priority: P2)

**Goal**: Toggling an overdue todo to complete removes the indicator immediately.
Un-completing it restores the indicator. No additional code is required beyond what
was built for US1 — this phase is a verification and test coverage phase only.

**Independent Test**: Render overdue `TodoCard`, assert "Overdue" present. Simulate
checkbox click (toggle to complete). Re-render with `completed: 1`. Assert "Overdue"
absent. Simulate un-complete (`completed: 0`). Assert "Overdue" reappears.

**Note**: Because `overdue` is derived from `todo.completed` on every render, US2
behaviour is automatically satisfied by the US1 implementation. This phase adds the
test coverage to prove it.

### Tests for User Story 2 ⚠️ Write FIRST — ensure they FAIL before T011

- [ ] T010 [P] [US2] Add test: overdue todo marked complete (completed: 1) loses "Overdue" label — render with completed 0, assert present; render with completed 1, assert absent in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [ ] T011 [P] [US2] Add test: completed todo with past due date marked incomplete (completed: 0) regains "Overdue" label in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 2

- [ ] T012 [US2] Verify no additional code changes are required in `packages/frontend/src/components/TodoCard.js` — `overdue` derivation already incorporates `!todo.completed`, satisfying US2; document in PR description

**Checkpoint**: User Story 2 fully tested. Run full test suite to confirm all overdue tests pass.

---

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T013 [P] Run `cd packages/frontend && npm test -- --coverage` and confirm overall coverage remains ≥ 80% and all new tests pass
- [ ] T014 [P] Verify dark mode: confirm `.todo-due-date--overdue` uses `var(--danger-color)` (resolves to `#ef5350` in dark mode via `theme.css`) — inspect via browser DevTools or snapshot test; no code change expected
- [ ] T015 Run ESLint on modified files: `cd packages/frontend && npx eslint src/components/TodoCard.js src/App.css` and fix any reported issues

---

## Dependency Graph

```
T001 (CSS rule)
  └── T002 (fake timers setup)
        ├── T003 (test: past date → overdue)  ──────────────┐
        ├── T004 (test: today → not overdue)                │
        ├── T005 (test: future → not overdue)               │
        ├── T006 (test: no date → not overdue)              │
        └── T007 (test: complete+past → not overdue)        │
              └── T008 (impl: overdue const)                │
                    └── T009 (impl: JSX update) ────────────┘ (US1 complete)
                          ├── T010 (test: complete clears overdue)
                          └── T011 (test: incomplete restores overdue)
                                └── T012 (verify no-op impl for US2)
                                      ├── T013 (coverage gate)
                                      ├── T014 (dark mode verification)
                                      └── T015 (ESLint pass)
```

## Parallel Execution Summary

After T001–T002 are complete, **T003–T007 can all run in parallel** (independent test
cases in the same file, no ordering required).

After T008–T009 are complete (US1 implementation), **T010–T011 can run in parallel**.

After T012, **T013–T015 can all run in parallel** (independent quality gates).

## Implementation Strategy

**MVP scope**: Complete Phase 1–3 (T001–T009) for a fully demonstrable US1 that covers
5 of 7 acceptance scenarios. Can be code-reviewed and demonstrated independently.

**Full delivery**: Add Phase 4 (T010–T012) to complete US2 coverage, then Polish
(T013–T015) before merging.

**Suggested PR sequence**: One PR for the full feature (all 15 tasks) since the scope
is small (2 files modified, 1 CSS rule added, ~12 new test cases).
