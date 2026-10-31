# [TODO-007] Completed task count becomes stale

Assessment ID: TODO-007

Difficulty: Easy

## Bug description

The Completed statistic can lag behind the task collection.

## Steps to reproduce

1. Note the completed count.
2. Complete an active task, then uncomplete it.
3. Compare the statistic after each action.
4. Also add and delete tasks and inspect the totals.

## Expected behavior

The completed count always equals the number of completed tasks in the underlying collection.

## Acceptance criteria

- Count is correct after addition.
- Count is correct after completing and uncompleting.
- Count is correct after deletion.

## Testing and submission

Run `npm run test:issue -- TODO-007`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use `[TODO-007] Your concise fix description` as the title. Complete the PR template and reference this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
