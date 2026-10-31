# [TODO-005] New tasks disappear after refreshing a populated workspace

Assessment ID: TODO-005

Difficulty: Medium

## Bug description

Tasks added to a populated workspace are not reliably restored on refresh.

## Steps to reproduce

1. Start with the five sample tasks.
2. Add two distinct tasks and verify both are visible.
3. Refresh the page and compare the collection.
4. Also check editing, deleting, and saving an empty list across reloads.

## Expected behavior

Every saved task is restored, including newly added tasks; edits, deletions, and an empty collection survive reload.

## Acceptance criteria

- Add and reload preserves all tasks.
- Edited titles survive reload.
- Deleted tasks stay removed.
- An intentionally empty stored collection stays empty.

## Testing and submission

Run `npm run test:issue -- TODO-005`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use `[TODO-005] Your concise fix description` as the title. Complete the PR template and reference this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
