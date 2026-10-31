# TaskFlow

**A focused task workspace. A real codebase to investigate.**

TaskFlow is TieOpp's first Codebase Comprehension & Engineering Judgment Assessment. It is a functional React application with **10 deliberately introduced bugs**, all present together on `main`. Choose one existing issue, investigate its behavior, and submit a focused fix from your fork. This is a bug-fixing assessment, not a feature-building exercise.

## Run locally

Install Node.js 22.12 or newer (Node 22 LTS is used in CI), then:

```sh
npm install
npm run dev
```

Open the local Vite URL. The initial workspace includes realistic sample tasks. Add, edit, delete, complete, search, filter, and prioritize tasks. Data stays in this browser's localStorage; there is no account or backend. Do not use this deliberately defective application to store important work. Clear the `tieopp.taskflow.v1` storage key to restore samples.

## Choose one issue

Browse the [assessment issues](https://github.com/tieopp/TaskFlow/issues?q=is%3Aissue+is%3Aopen+TODO-) or the definitions in [assessment/issues](assessment/issues). Publishing by a maintainer is required before the issues appear on GitHub. Multiple students can independently solve the same issue; it stays open after evaluation.

| ID | Bug | Difficulty |
| --- | --- | --- |
| TODO-001 | Whitespace-only titles are accepted | Easy |
| TODO-002 | Editing can update another task | Medium |
| TODO-003 | Completed tasks appear in Active | Easy |
| TODO-004 | Search depends on letter case | Easy |
| TODO-005 | Added tasks can disappear on refresh | Medium |
| TODO-006 | Filtered deletion can remove another task | Medium |
| TODO-007 | Completed count becomes stale | Easy |
| TODO-008 | Priority changes disappear on refresh | Medium |
| TODO-009 | Rapid creation loses submissions | Hard |
| TODO-010 | Switching filters clears search | Medium |

## Submit a fix

1. Select an issue through TieOpp and read its acceptance criteria.
2. Fork `tieopp/TaskFlow` into your own GitHub account. Clone your fork.
3. Create a branch such as `fix/todo-003-active-filter` from the assessment's pinned baseline.
4. Reproduce the bug, navigate the code, and make a focused change in `src/`.
5. Run the baseline suite, your selected issue suite, build, and lint.
6. Push your branch to your fork and open a PR against `tieopp/TaskFlow:main`.
7. Title it `[TODO-003] Fix Active Filter Behavior`, replacing the ID as appropriate. Complete every PR template section, including the explanation of the root cause and testing.
8. Copy the **actual GitHub issue number** from the selected issue. `TODO-003` does not necessarily mean issue `#3`. Do not use `Fixes #N`, `Closes #N`, or `Resolves #N`.

```sh
git clone https://github.com/YOUR-USERNAME/TaskFlow.git
cd TaskFlow
git switch -c fix/todo-003-active-filter
npm install
npm run test:baseline
npm run test:issue -- TODO-003
npm run build
npm run lint
git add src
git commit -m "Fix active task filtering"
git push -u origin fix/todo-003-active-filter
```

See the [student guide](docs/student-guide.md) for baseline selection and troubleshooting.

## Test commands

| Command | Purpose |
| --- | --- |
| `npm run test:baseline` | 15 existing-behavior checks; must pass |
| `npm run test:issue -- TODO-003` | Only that issue's public regression tests |
| `npm run test:all` | All 56 app tests; intentionally fails on the original baseline |
| `npm run test:tooling` | Submission, completion-operation, and workflow checks |
| `npm run verify:assessment` | Maintainer check: baseline green, all ten issue suites red |
| `npm run build` | TypeScript validation and production build |
| `npm run lint` | ESLint code-quality checks |

Only your selected issue must pass; unrelated bugs remain. Tests assert correct behavior using ordinary assertions, not expected-failure markers. Public tests and configs changed in a fork are not authoritative grading inputs. Dependency changes are outside the scope of these ten issues.

## Evaluation

GitHub Actions validates your PR metadata, builds submitted application code with the pinned harness, runs baseline tests and only the selected issue suite, and uploads JSON evidence. Fork runs may require maintainer approval. The whole diagnostic suite is **not** used to grade your selected issue.

TieOpp's evaluation service will separately run trusted public and private tests in isolation and review your explanation and implementation with AI assistance. The service must be connected by the repository administrator; no scores or backend integrations are simulated here. Final reports belong on your authenticated TieOpp dashboard.

After TieOpp confirms evaluation completion, its GitHub App can comment with your authenticated report link and close the PR **without merging**. Infrastructure errors keep the PR pending. The original assessment issue stays open, and `main` keeps all ten bugs for the next student.

## Repository map

```text
src/                 React UI, context, hooks, storage and filtering
tests/baseline/      Existing functional behavior
tests/issues/        One public suite per assessment ID
tests/tooling/       Integration and repository safeguards
assessment/issues/  Ten ready-to-publish issue definitions
assessment/         Manifest and evaluation contract
scripts/            Issue runner, publishing, validation, reports, completion
.github/            PR template and restricted CI workflows
docs/               Student, architecture, admin and integration guides
```

Built with React 19, TypeScript, Vite, Tailwind CSS, Context and hooks, Vitest, React Testing Library, and ESLint. See [architecture](docs/architecture.md), [admin setup](docs/admin-guide.md), and [GitHub integration](docs/github-integration.md). Public PRs expose submitted solutions; higher-stakes assessments should use private per-student repositories.
