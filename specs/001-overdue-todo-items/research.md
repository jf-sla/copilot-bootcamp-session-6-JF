# Research: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-24  
**Method**: Codebase inspection (no external unknowns; all resolved by reading existing source)

---

## Finding 1: How `dueDate` is stored and transported

**Question**: What format does `dueDate` take at the backend, API, and frontend layers?

**Research**: Inspected `packages/backend/src/app.js` and `packages/backend/src/services/todoService.js`.

- SQLite schema: `dueDate TEXT` — stored as plain text string.
- INSERT/UPDATE uses the value as-is from the request body (no transformation).
- Frontend `todoService.js` passes the HTML `<input type="date">` value directly
  (native browser date picker produces `"YYYY-MM-DD"` format).
- Existing tests use `dueDate: '2025-12-25'` (YYYY-MM-DD string) as fixture data.

**Decision**: `dueDate` is always a `"YYYY-MM-DD"` string or `null` at every layer.

**Rationale**: String comparison `dueDate < todayString` (lexicographic) is
mathematically equivalent to date comparison for ISO YYYY-MM-DD format. No parsing,
no `Date` constructor needed for the overdue check.

**Alternatives considered**: Parsing via `new Date(dueDate)` — rejected because
`new Date("2026-03-20")` is parsed as UTC midnight, which shifts the apparent date
by one day in timezones behind UTC when compared to local `new Date()`.

---

## Finding 2: How `todayString` (YYYY-MM-DD) should be derived in the browser

**Question**: How do we get the current local date as a YYYY-MM-DD string?

**Research**: Standard JavaScript approach.

**Decision**:
```javascript
const todayString = new Date().toLocaleDateString('en-CA'); // returns "YYYY-MM-DD"
```

`'en-CA'` locale consistently produces `YYYY-MM-DD` format in all browsers without
any external library. The comparison is then `dueDate < todayString`.

**Rationale**: Avoids `toISOString()` (returns UTC, not local date). The `en-CA`
trick is a widely-used, zero-dependency approach for local YYYY-MM-DD.

**Alternatives considered**:
- `new Date().toISOString().split('T')[0]` — rejected (UTC, same timezone problem).
- Manual `padStart` construction — works but more verbose; `en-CA` is cleaner.

---

## Finding 3: Where to place the overdue rendering logic in `TodoCard.js`

**Question**: Should the overdue check be a separate utility function, or inline?

**Research**: Inspected `packages/frontend/src/components/TodoCard.js`.

The non-edit render path has this structure:

```jsx
<div className="todo-content">
  <h3 className="todo-title">{todo.title}</h3>
  {todo.dueDate && (
    <p className="todo-due-date">
      Due: {formatDate(todo.dueDate)}
    </p>
  )}
</div>
```

**Decision**: Compute `const overdue = !todo.completed && !!todo.dueDate && todo.dueDate < todayString;`
inline in the render function body (no new helper file per Constitution Principle V).
The `<p>` element gains a CSS modifier class and an inline "Overdue" span when true.

**Rationale**: Single-use logic, three-token boolean expression — no abstraction
warranted. Inline computation is readable and testable via the component's rendered
output.

**Alternatives considered**: Separate `isOverdue()` utility in a `utils/` file —
rejected (Constitution Principle V: no single-use abstractions).

---

## Finding 4: CSS approach for the danger color styling

**Question**: Is `--danger-color` already a CSS custom property available to component stylesheets?

**Research**: Inspected `packages/frontend/src/styles/theme.css`:

```css
:root          { --danger-color: #c62828; }
[data-theme="dark"] { --danger-color: #ef5350; }
```

`App.css` imports `theme.css`. All component styles are global (no CSS Modules).

**Decision**: Add a single CSS rule (in `App.css` alongside existing component
styles, or in the same place as `.todo-due-date`):

```css
.todo-due-date--overdue {
  color: var(--danger-color);
}
```

Apply it with `className={\`todo-due-date \${overdue ? 'todo-due-date--overdue' : ''}\`}`.

**Rationale**: CSS custom property already exists, dark/light mode switching is
handled automatically by the theme system. No additional tokens or media queries needed.

**Alternatives considered**: Inline style `style={{ color: 'var(--danger-color)' }}`
— rejected (violates styling conventions; harder to override and test).

---

## Finding 5: Existing test patterns in `TodoCard.test.js`

**Question**: What test utilities and patterns are established for `TodoCard`?

**Research**: Inspected `packages/frontend/src/components/__tests__/TodoCard.test.js`.

- Uses `@testing-library/react`: `render`, `screen`, `fireEvent`
- Fixture object: `mockTodo = { id, title, dueDate, completed, createdAt }`
- `completed` is stored as integer `0` (false) or `1` (true)
- Tests use `jest.fn()` for handlers; `beforeEach(() => jest.clearAllMocks())`

**Decision**: New tests follow the same pattern — create fixture variants with
past/today/future/null due dates and completed/incomplete states; assert presence or
absence of "Overdue" text via `screen.getByText` / `screen.queryByText`.

**Rationale**: Consistency with existing test style (Constitution Principle I, II).

**Key testing note**: Tests that check date-relative behavior ("past due date")
MUST mock `Date` so tests are not time-dependent. The `jest.useFakeTimers` or
`jest.spyOn(global, 'Date')` approach should be used when freezing today's date.

---

## Summary: No Remaining NEEDS CLARIFICATION

All unknowns resolved by codebase inspection. No external research required.

| # | Unknown | Resolution |
|---|---------|------------|
| 1 | `dueDate` storage format | `"YYYY-MM-DD"` string (TEXT in SQLite) |
| 2 | Today's date as YYYY-MM-DD | `new Date().toLocaleDateString('en-CA')` |
| 3 | Logic placement | Inline in `TodoCard.js` render body |
| 4 | CSS token availability | `--danger-color` already in `theme.css`; add one CSS rule |
| 5 | Test patterns | Match existing `@testing-library/react` conventions; mock `Date` for time-sensitive tests |
