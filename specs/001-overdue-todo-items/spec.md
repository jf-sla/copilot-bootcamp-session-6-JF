# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`  
**Created**: 2026-03-24  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## Clarifications

### Session 2026-03-24

- Q: What is the exact visual treatment for the overdue indicator — color-only, label-only, both, or a card border stripe? → A: Both: the due date text is rendered in the Danger color AND an inline "Overdue" text label is appended next to it.
- Q: How should the due date be compared to today to determine overdue status — UTC, local date, or direct string comparison? → A: Compare YYYY-MM-DD date strings directly without timezone conversion; no UTC or timezone shifting applied.
- Q: Where inside the TodoCard layout should the overdue indicator appear — inline after due date, on a separate line, or as a card border stripe? → A: Inline in the content area, appended directly after the due date text (e.g., "Due: Mar 20 · Overdue").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator on Todo Card (Priority: P1)

A user opens their todo list and immediately sees which items are past their due date
without having to manually compare dates. Overdue todos are visually distinguished
from on-time and undated todos through two combined visual treatments on the todo card:
the due date text is rendered in the Danger color, and an "Overdue" text label is
appended inline directly after the due date text within the content area
(e.g., `"Due: Mar 20 · Overdue"`). No new layout zones or card structural changes
are required.

**Why this priority**: This is the core value of the feature. Without a visual
indicator, users have no passive awareness of overdue items; they must mentally compute
the status themselves. This story alone constitutes a complete and demonstrable MVP.

**Independent Test**: Create a todo with a due date in the past, leave it incomplete,
and load the todo list. The overdue item must be visually distinct from non-overdue
items. No other story needs to be implemented for this test to be meaningful.

**Acceptance Scenarios**:

1. **Given** a todo exists with a due date in the past and is not completed, **When** the user views the todo list, **Then** the todo card displays the due date text in the Danger color AND shows an "Overdue" text label appended inline directly after the due date text in the content area (e.g., `"Due: Mar 20 · Overdue"`), with no structural changes to the card layout.
2. **Given** a todo exists with a due date of today and is not completed, **When** the user views the todo list, **Then** the todo card does NOT show an overdue indicator.
3. **Given** a todo exists with a due date in the future and is not completed, **When** the user views the todo list, **Then** the todo card does NOT show an overdue indicator.
4. **Given** a todo exists with a due date in the past AND is already marked complete, **When** the user views the todo list, **Then** the todo card does NOT show an overdue indicator (completed items are never overdue).
5. **Given** a todo exists with no due date, **When** the user views the todo list, **Then** the todo card does NOT show any overdue indicator.

---

### User Story 2 - Overdue State Clears When Todo is Completed (Priority: P2)

A user marks an overdue todo as complete. The overdue visual indicator immediately
disappears from that card so the user has clear confirmation that the item is no longer
outstanding.

**Why this priority**: Without this behaviour the overdue indicator becomes
misleading — completed tasks do not need priority attention. This is a correctness
story that reinforces trust in the UI; however, Story 1 already delivers standalone
value so this is P2.

**Independent Test**: Create an overdue todo (past due date, incomplete). Verify the
overdue indicator is present. Mark it complete. Verify the overdue indicator is gone
and the completed strikethrough style is shown instead.

**Acceptance Scenarios**:

1. **Given** an overdue todo is visible with the overdue indicator, **When** the user marks it as complete, **Then** the overdue indicator is removed and the card displays the normal completed state (strikethrough, reduced opacity).
2. **Given** a completed todo with a past due date, **When** the user marks it back as incomplete, **Then** the overdue indicator reappears because the item is now incomplete and past its due date.

---

### Edge Cases

- What happens when a todo's due date is exactly today (boundary between on-time and overdue)? → The item is NOT considered overdue on the due date itself; overdue begins the day after the due date passes.
- What happens when the user has many overdue items? → All overdue incomplete todos are treated equally; there is no limit on how many can show the indicator simultaneously.
- What happens if a todo's due date is edited to a future date? → The overdue indicator disappears immediately after the save.
- What happens if a todo with no due date has a due date added (past date)? → The overdue indicator appears after save.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a distinct visual indicator on any incomplete todo card whose due date is strictly before today's date; the indicator MUST appear inline in the card's content area, appended directly after the due date text (e.g., `"Due: Mar 20 · Overdue"`), with no structural changes to the card layout.
- **FR-002**: The system MUST NOT display an overdue indicator on todo cards that are marked complete, regardless of their due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todo cards with no due date.
- **FR-004**: The system MUST NOT display an overdue indicator on todo cards whose due date is today or in the future.
- **FR-005**: The overdue indicator MUST update dynamically when a todo's completion status changes (toggled complete/incomplete) without requiring a page reload.
- **FR-006**: The overdue indicator MUST update when a todo's due date is edited to a new value, reflecting the new overdue status after the change is saved.
- **FR-007**: The due date text on an overdue todo card MUST be rendered in the Danger color token (`#c62828` light / `#ef5350` dark) from the existing design system.
- **FR-008**: An inline "Overdue" text label MUST be appended next to the due date on overdue todo cards; the indicator MUST NOT rely on color alone, ensuring it is accessible to users who cannot distinguish colors.

### Key Entities

- **Todo Item**: An existing entity with attributes: `id`, `title`, `dueDate` (optional date), `completed` (boolean). No new attributes are required; overdue status is derived at display time by comparing `dueDate` to the current date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can visually identify all overdue todos at a glance within 5 seconds of loading the todo list, without performing any manual date arithmetic.
- **SC-002**: Zero false positives — completed todos, undated todos, and future-dated todos never display the overdue indicator.
- **SC-003**: Zero false negatives — every incomplete todo whose due date is in the past displays the overdue indicator.
- **SC-004**: The overdue state updates immediately (within the same user interaction) when a todo is completed or its due date is changed; no page reload is required.
- **SC-005**: The overdue indicator is understandable without relying solely on color — users who cannot distinguish colors can still identify overdue items.

## Assumptions

- The application already stores a `dueDate` field on todo items (per existing functional requirements); no data model changes are required.
- "Overdue" is defined as: the item's due date is strictly before today's calendar date AND the item is not completed.
- Due date comparison is performed by comparing the stored `dueDate` YYYY-MM-DD string against today's date formatted as a YYYY-MM-DD string (derived from `new Date()` in the browser). No UTC conversion or timezone shifting is applied; both sides of the comparison are plain date strings.
- The feature is purely presentational — it derives overdue status at display time and does not introduce a new stored field or backend change.
- The "Overdue" label is placed inline in the existing content area of the `TodoCard` component, directly after the due date text; no new layout zones, card containers, or structural DOM changes are introduced.
- The existing Danger color token (`#c62828` light / `#ef5350` dark) from the design system is used for the visual indicator, maintaining design consistency.
- Both light and dark modes must display the overdue indicator using the appropriate Danger color token for each mode.
- End-to-end tests are out of scope; unit and integration tests are sufficient per the project's testing guidelines.
