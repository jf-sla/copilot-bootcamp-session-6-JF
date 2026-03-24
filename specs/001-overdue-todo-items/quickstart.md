# Quickstart: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-24

## Prerequisites

- Node.js ≥ v16, npm ≥ v7
- Dev environment set up: `npm install` run from the repo root

## Files Modified

| File | Change |
|------|--------|
| `packages/frontend/src/components/TodoCard.js` | Add overdue detection logic + conditional CSS class/label in JSX |
| `packages/frontend/src/App.css` | Add `.todo-due-date--overdue { color: var(--danger-color); }` |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | Add test cases for all overdue acceptance scenarios |

## Running the App

```bash
# From repo root — starts both frontend (port 3000) and backend (port 3001)
npm run start
```

Open `http://localhost:3000` in a browser.

## Manual Verification Steps

1. **Trigger overdue state**: Edit any existing todo (or create a new one) and set its
   due date to a date in the past (e.g., yesterday). Leave it incomplete.
   - **Expected**: The due date text appears in red/danger color with "· Overdue"
     appended inline (e.g., `"Due: March 23, 2026 · Overdue"`).

2. **Non-overdue todos are unaffected**: Verify todos with a future due date, today's
   date, or no due date show no overdue indicator.

3. **Dark mode**: Toggle dark mode (top-right icon). The "Overdue" label and danger
   text should remain visible using the dark-mode danger color (`#ef5350`).

4. **Clear on completion**: Check the checkbox on an overdue todo. The "Overdue"
   indicator must disappear immediately without a page reload.

5. **Reappears on un-complete**: Uncheck the same todo. The indicator must reappear.

6. **Edit due date to future**: Edit an overdue todo and change its due date to
   tomorrow. After saving, the indicator must be gone.

## Running Tests

```bash
# Run all frontend tests with coverage
cd packages/frontend && npm test

# Or from repo root
npm test
```

**Expected**: All existing tests continue to pass. New overdue-related tests in
`TodoCard.test.js` pass, and coverage remains at 80%+.

## Key Implementation Notes for Developers

- **Overdue check** (inline in `TodoCard.js` render body):
  ```javascript
  const todayString = new Date().toLocaleDateString('en-CA');
  const overdue = !todo.completed && !!todo.dueDate && todo.dueDate < todayString;
  ```

- **JSX change** (in the non-edit render path):
  ```jsx
  {todo.dueDate && (
    <p className={`todo-due-date${overdue ? ' todo-due-date--overdue' : ''}`}>
      Due: {formatDate(todo.dueDate)}{overdue && ' · Overdue'}
    </p>
  )}
  ```

- **CSS** (one new rule in `App.css`):
  ```css
  .todo-due-date--overdue {
    color: var(--danger-color);
  }
  ```

- **Test date mocking** — always freeze today when testing overdue:
  ```javascript
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-03-24'));
  });
  afterEach(() => jest.useRealTimers());
  ```
