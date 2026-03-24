# Data Model: Support for Overdue Todo Items

**Feature**: `001-overdue-todo-items`  
**Date**: 2026-03-24

## Summary

This feature introduces **no data model changes**. Overdue status is a **derived,
display-time property** computed by comparing the existing `dueDate` field against the
current local date. No new fields, tables, or API parameters are added.

---

## Existing Entity: Todo Item

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unchanged |
| `title` | TEXT | NOT NULL, max 255 chars | Unchanged |
| `dueDate` | TEXT | nullable | `"YYYY-MM-DD"` string or `null`; unchanged |
| `completed` | BOOLEAN | DEFAULT 0 | Stored as `0`/`1` integer; unchanged |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Unchanged |

---

## Derived Property: `isOverdue`

`isOverdue` is **not stored**. It is computed at display time in the frontend.

**Definition**:
```
isOverdue = (dueDate !== null) AND (completed === 0) AND (dueDate < todayString)
```

where `todayString` = today's local date formatted as `"YYYY-MM-DD"`.

**Boundary rule**: A todo whose `dueDate` equals today is **not** overdue.
Overdue begins the day after the due date.

---

## Validation Rules (unchanged)

- `dueDate` remains optional; `null` values never trigger the overdue state.
- No new validation rules are introduced.

---

## State Transitions

```
         [incomplete, dueDate in future]
                      │
               day passes
                      ▼
         [incomplete, dueDate < today]  ← overdue state (display only)
                      │
             user marks complete
                      ▼
         [complete, dueDate in past]    ← NOT overdue (completed trumps)
                      │
        user marks incomplete again
                      ▼
         [incomplete, dueDate < today]  ← overdue state again
```
