# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`  
**Created**: 2026-03-24  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicator on Todo Card (Priority: P1)

A user opens their todo list and immediately sees which items are past their due date
without having to manually compare dates. Overdue todos are visually distinguished
from on-time and undated todos through a clear visual treatment on the todo card — such
as a distinct text color, label, or icon next to the due date.

**Why this priority**: This is the core value of the feature. Without a visual
indicator, users have no passive awareness of overdue items; they must mentally compute
the status themselves. This story alone constitutes a complete and demonstrable MVP.

**Independent Test**: Create a todo with a due date in the past, leave it incomplete,
and load the todo list. The overdue item must be visually distinct from non-overdue
items. No other story needs to be implemented for this test to be meaningful.

**Acceptance Scenarios**:

1. **Given** a todo exists with a due date in the past and is not completed, **When** the user views the todo list, **Then** the todo card displays a visual overdue indicator (e.g., red due date text or "Overdue" label) distinguishing it from other cards.
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

- **FR-001**: The system MUST display a distinct visual indicator on any incomplete todo card whose due date is strictly before today's date.
- **FR-002**: The system MUST NOT display an overdue indicator on todo cards that are marked complete, regardless of their due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todo cards with no due date.
- **FR-004**: The system MUST NOT display an overdue indicator on todo cards whose due date is today or in the future.
- **FR-005**: The overdue indicator MUST update dynamically when a todo's completion status changes (toggled complete/incomplete) without requiring a page reload.
- **FR-006**: The overdue indicator MUST update when a todo's due date is edited to a new value, reflecting the new overdue status after the change is saved.
- **FR-007**: The visual treatment for overdue items MUST be consistent with the existing UI design system (using the defined Danger color token for the indicator).
- **FR-008**: The overdue indicator MUST be accessible — it must not rely on color alone; a text label or icon with descriptive meaning MUST also be present.

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
- Due date comparison uses the user's local date (browser/client date), which is the date visible to the user in the UI.
- The feature is purely presentational — it derives overdue status at display time and does not introduce a new stored field or backend change.
- The existing Danger color token (`#c62828` light / `#ef5350` dark) from the design system is used for the visual indicator, maintaining design consistency.
- Both light and dark modes must display the overdue indicator using the appropriate Danger color token for each mode.
- End-to-end tests are out of scope; unit and integration tests are sufficient per the project's testing guidelines.
