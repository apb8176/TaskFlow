# Contributing to TaskFlow

Thank you for helping improve TaskFlow. This repository serves two distinct workflows: candidate assessment submissions and maintainer changes to the assessment platform. Keep those scopes separate so the frozen assessment remains reproducible.

## Candidate submissions

1. Start from the baseline SHA assigned by TieOpp, not an arbitrary snapshot of `main`.
2. Work in a fork and target `tieopp/TaskFlow:main` from a focused branch.
3. Change application source only as required by the assigned assessment scope.
4. Use any clear, non-empty PR title.
5. Keep the structured assessment fields in the PR body accurate:
   - One requirement: `Assessment ID: TODO-NNN` and `Related GitHub Issue: #NUMBER`
   - All requirements: the complete `Assessment IDs` and `Related GitHub Issues` lists from the template
6. Complete the Bug Fixed, Root Cause, Changes Made, and Testing sections.
7. Do not use `Fixes`, `Closes`, or `Resolves` keywords. Assessment issues remain open for other candidates.

For a single requirement, run:

```sh
npm ci
npm run test:baseline
npm run test:issue -- TODO-003
npm run build
npm run lint
```

For a `TODO-ALL` submission, replace the selected issue command with `npm run test:issues`.

## Maintainer contributions

Repository infrastructure, documentation, test-harness, and assessment-definition changes must use a dedicated maintenance branch and clearly explain their impact on existing pinned baselines. Do not mix reference solutions or hidden evaluation material into public commits.

Before requesting review, run:

```sh
npm ci
npm run test:baseline
npm run test:tooling
npm run build
npm run lint
```

Run `npm run verify:assessment` only when validating an intentionally defective baseline; it expects the baseline suite to pass and each individual issue suite to reproduce its assigned defect.

## Review checklist

- The change is scoped and does not expose credentials, hidden tests, grading prompts, or reference fixes.
- Documentation and automated tests are updated when behavior or repository contracts change.
- Generated files, local reports, environment files, and dependencies are not committed.
- Commits use concise, imperative messages and the PR is ready for reproducible review.

By participating, contributors agree to communicate respectfully, provide actionable technical feedback, and avoid harassment, discrimination, or disclosure of another candidate's work as their own.
