# [TODO-004] Task search incorrectly depends on letter case

Assessment ID: TODO-004

Difficulty: Easy

## Bug description

A lowercase search does not find a title such as Learn React.

## Steps to reproduce

1. Create a task named Learn React.
2. Search for react, REACT, and rEaCt.
3. Try a term that is not in any title.

## Expected behavior

Search matches title text regardless of letter case.

## Acceptance criteria

- Lowercase, uppercase, and mixed-case queries find matching titles.
- A missing term returns an empty result.

## Testing and submission

Run `npm run test:issue -- TODO-004`, `npm run test:baseline`, `npm run build`, and `npm run lint`. The selected issue suite should pass after your change. Other issue suites are expected to remain failing. Keep the fix focused on this bug; no new features are required.

Fork the repository and submit a PR to the original `main`. Use any clear, concise title. Complete the PR template and identify the assessment using `Assessment ID: TODO-004` and this issue's actual GitHub number using `Related GitHub Issue: #NUMBER`. Do not use auto-closing keywords. This issue stays open for other students; evaluated PRs are closed without merging.
