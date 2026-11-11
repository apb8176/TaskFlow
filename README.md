# TaskFlow

**A focused task workspace. A real codebase to investigate.**

TaskFlow is TieOpp's Codebase Comprehension & Engineering Judgment Assessment for React engineers. It is a functional task-management application with **10 deliberately introduced bugs**, all present together on the pinned assessment baseline. Candidates investigate real application behavior, trace the existing architecture, implement focused corrections, and verify them through an isolated test harness.

> [!IMPORTANT]
> This repository intentionally contains known functional defects. It is an assessment environment, not a production task manager. Do not store important data in it.

## Highlights

- React 19 and TypeScript application built with Vite and Tailwind CSS
- Ten independently specified debugging requirements with public acceptance tests
- Single-requirement and all-requirements (`TODO-ALL`) submission modes
- Pinned assessment baseline and trusted GitHub Actions validation
- Baseline, issue, tooling, build, and lint checks
- Machine-readable evaluation evidence for TieOpp integrations

## Documentation

- [Student guide](docs/student-guide.md) — setup, baseline selection, submission, and troubleshooting
- [Architecture](docs/architecture.md) — application structure and data flow
- [Administrator guide](docs/admin-guide.md) — assessment maintenance and repository controls
- [GitHub integration](docs/github-integration.md) — trusted automation and evaluation lifecycle
- [Contributing](CONTRIBUTING.md) — contribution and pull-request requirements
- [Security](SECURITY.md) and [support](SUPPORT.md) — private reporting and help channels

## Run locally

Install Node.js 22.12 or newer (Node 22 LTS is used in CI), then:

```sh
npm install
npm run dev
```

Open the local Vite URL. The initial workspace includes realistic sample tasks. Add, edit, delete, complete, search, filter, and prioritize tasks. Data stays in this browser's localStorage; there is no account or backend. Do not use this deliberately defective application to store important work. Clear the `tieopp.taskflow.v1` storage key to restore samples.

## Choose an assessment scope

Browse the [assessment issues](https://github.com/tieopp/TaskFlow/issues?q=is%3Aissue+is%3Aopen+TODO-) or the definitions in [assessment/issues](assessment/issues). A submission may address one selected requirement or all ten requirements when the assigned TieOpp challenge uses `TODO-ALL`. Multiple students can independently solve the same issue; assessment issues remain open after evaluation.

| ID | Bug | Difficulty |
| --- | --- | --- |
| [TODO-001](https://github.com/tieopp/TaskFlow/issues/11) | Whitespace-only titles are accepted | Easy |
| [TODO-002](https://github.com/tieopp/TaskFlow/issues/12) | Editing can update another task | Medium |
| [TODO-003](https://github.com/tieopp/TaskFlow/issues/13) | Completed tasks appear in Active | Easy |
| [TODO-004](https://github.com/tieopp/TaskFlow/issues/14) | Search depends on letter case | Easy |
| [TODO-005](https://github.com/tieopp/TaskFlow/issues/15) | Added tasks can disappear on refresh | Medium |
| [TODO-006](https://github.com/tieopp/TaskFlow/issues/16) | Filtered deletion can remove another task | Medium |
| [TODO-007](https://github.com/tieopp/TaskFlow/issues/17) | Completed count becomes stale | Easy |
| [TODO-008](https://github.com/tieopp/TaskFlow/issues/18) | Priority changes disappear on refresh | Medium |
| [TODO-009](https://github.com/tieopp/TaskFlow/issues/19) | Rapid creation loses submissions | Hard |
| [TODO-010](https://github.com/tieopp/TaskFlow/issues/20) | Switching filters clears search | Medium |

## Submit a fix

1. Select an issue through TieOpp and read its acceptance criteria.
2. Fork `tieopp/TaskFlow` into your own GitHub account. Clone your fork.
3. Create a branch such as `fix/todo-003-active-filter` from the assessment's pinned baseline.
4. Reproduce the bug, navigate the code, and make a focused change in `src/`.
5. Run the baseline suite, your selected issue suite, build, and lint.
6. Push your branch to your fork and open a PR against `tieopp/TaskFlow:main`.
7. Use any clear, non-empty PR title. Complete every PR template section, including the structured `Assessment ID`/`Assessment IDs` field, root cause, changes, and testing evidence.
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
| `npm run test:issues` | All ten public issue suites for a `TODO-ALL` submission |
| `npm run test:all` | All 56 app tests; intentionally fails on the original baseline |
| `npm run test:tooling` | Submission, completion-operation, and workflow checks |
| `npm run verify:assessment` | Maintainer check: baseline green, all ten issue suites red |
| `npm run build` | TypeScript validation and production build |
| `npm run lint` | ESLint code-quality checks |

For a single-requirement submission, only the selected issue must pass and unrelated bugs remain. A `TODO-ALL` submission must pass every issue suite. Tests assert correct behavior using ordinary assertions, not expected-failure markers. Public tests and configs changed in a fork are not authoritative grading inputs. Dependency changes are outside the scope of these ten issues.

## Evaluation

GitHub Actions validates structured PR metadata, builds submitted application code with the pinned harness, runs baseline tests and the applicable issue suite or suites, and uploads JSON evidence. Fork runs may require maintainer approval.

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

## Contributing, security, and support

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing changes. Assessment submissions and repository-maintenance changes follow different review paths. Report security vulnerabilities privately according to [SECURITY.md](SECURITY.md); do not disclose them in a public issue. For setup and assessment help, see [SUPPORT.md](SUPPORT.md).
