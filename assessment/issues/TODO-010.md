# [TODO-010] Switching task filters clears the search term

Assessment ID: TODO-010

Difficulty: Medium

## Bug description

Changing the status filter clears the current search text.

## Steps to reproduce

1. Enter a search term.
2. Switch between All, Active, and Completed.
3. Observe the search field and combined results.
4. Clear the search while a status filter is selected.

## Expected behavior

Search text remains when status changes, and search and status filtering are composed. Clearing search restores results for the selected status.

## Acceptance criteria

- Entered text remains after switching filters.
- Search combines with the selected status.
- Returning to All retains the query.
- Clearing the query restores the appropriate filtered results.

## Testing and submission

Run `npm run test:issue -- TODO-010`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use `[TODO-010] Your concise fix description` as the title. Complete the PR template and reference this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
