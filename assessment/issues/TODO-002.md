# [TODO-002] Editing a task can update another task

Assessment ID: TODO-002

Difficulty: Medium

## Bug description

Editing a visible task can alter another task when the displayed collection changes.

## Steps to reproduce

1. Create several tasks with different priorities and completion states.
2. Select Completed or search for one task, then edit the visible title.
3. Return to All and compare every task.
4. Repeat after changing a task priority so its position changes.

## Expected behavior

Only the selected task changes, regardless of visible ordering or filtering.

## Acceptance criteria

- Editing works in the original list.
- Editing works after filtering and priority reordering.
- Unrelated task records remain unchanged.

## Testing and submission

Run `npm run test:issue -- TODO-002`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-002` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
