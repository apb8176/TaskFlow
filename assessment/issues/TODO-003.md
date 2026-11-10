# [TODO-003] Completed tasks appear in the Active filter

Assessment ID: TODO-003

Difficulty: Easy

## Bug description

The Active view includes completed tasks.

## Steps to reproduce

1. Have both completed and incomplete tasks.
2. Choose Active and inspect the results.
3. Toggle a task and compare Active, Completed, and All.

## Expected behavior

Active contains incomplete tasks, Completed contains completed tasks, and All contains both.

## Acceptance criteria

- All three filters return the correct collection.
- Results reflect changes to completion state.

## Testing and submission

Run `npm run test:issue -- TODO-003`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-003` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
