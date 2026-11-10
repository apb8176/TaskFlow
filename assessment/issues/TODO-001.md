# [TODO-001] Whitespace-only task titles are accepted

Assessment ID: TODO-001

Difficulty: Easy

## Bug description

Submit a task whose title contains only spaces.

## Steps to reproduce

1. Start with an empty new-task field and submit it.
2. Enter several spaces and click Add task.
3. Compare the list with a valid title submission.

## Expected behavior

Empty and whitespace-only titles are rejected with feedback. Valid titles, including internal spaces, remain usable.

## Acceptance criteria

- Reject empty input.
- Reject whitespace-only input.
- Accept valid titles and preserve internal spaces.

## Testing and submission

Run `npm run test:issue -- TODO-001`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-001` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
