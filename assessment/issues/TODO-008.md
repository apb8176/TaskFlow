# [TODO-008] Priority changes do not survive refresh

Assessment ID: TODO-008

Difficulty: Medium

## Bug description

Changing a task priority updates the current view but can be lost on reload.

## Steps to reproduce

1. Change a task priority.
2. Verify its priority immediately in the UI.
3. Refresh without making other changes.
4. Inspect its priority and other properties.

## Expected behavior

The chosen priority survives reload without changing the task title, completion state, identity, or creation date.

## Acceptance criteria

- Priority can be changed and updates immediately.
- Priority persists on reload.
- Unrelated properties and tasks remain unchanged.

## Testing and submission

Run `npm run test:issue -- TODO-008`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-008` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
