# [TODO-006] Deleting a filtered task can delete another task

Assessment ID: TODO-006

Difficulty: Medium

## Bug description

Deleting a task in a narrowed list can remove a different task.

## Steps to reproduce

1. Have several tasks with different completion states.
2. Choose Completed and delete a displayed task.
3. Return to All and inspect the remaining tasks.
4. Repeat with a search that narrows the list.

## Expected behavior

Deletion removes only the selected task, identified by its stable task ID.

## Acceptance criteria

- Normal deletion works.
- Deletion from filtered and searched lists works.
- Unrelated task records remain unchanged.

## Testing and submission

Run `npm run test:issue -- TODO-006`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-006` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
