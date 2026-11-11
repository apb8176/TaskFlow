# [TODO-009] Rapid task creation loses submissions

Assessment ID: TODO-009

Difficulty: Hard

## Bug description

Closely spaced task submissions can overwrite one another.

## Steps to reproduce

1. Open a workspace and prepare several distinct titles.
2. Exercise consecutive submissions before the next render using the provided regression suite.
3. Compare all submitted titles and IDs with the resulting collection.
4. Reload and inspect persisted tasks.

## Expected behavior

Every valid submission creates exactly one task with a unique ID, even when updates arrive in the same render batch.

## Acceptance criteria

- All rapid submissions produce tasks.
- Every submitted title is retained.
- Every task has a distinct ID.
- The rapid updates are persisted.

## Testing and submission

Run `npm run test:issue -- TODO-009`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-009` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
