# Administrator guide

## Bootstrap and freeze

The only permanent public assessment branch is `main`. All ten bugs belong on it. Do not create solution branches on the original repository or merge student PRs. This checkout includes implementation files but no automatic commit, push, or repository-setting mutation.

1. Review files and run `npm ci`, `npm run build`, `npm run lint`, `npm run test:baseline`, `npm run test:tooling`, and `npm run verify:assessment`.
2. Commit and push the repository to `tieopp/TaskFlow` on `main`. Check the configured remote before pushing.
3. Install GitHub CLI, authenticate as an issue-writing maintainer, and publish the definitions. The script searches all issue pages, including closed issues, and refuses conflicting mappings. It writes each real issue number immediately, so a partial publication can be resumed. Run only one publisher at a time; GitHub does not provide an atomic unique-title constraint.

```sh
gh auth login
npm run publish:issues -- --dry-run
npm run publish:issues
git add assessment/issue-manifest.json
git commit -m "Record published assessment issue mappings"
git push origin main
git rev-parse HEAD
gh variable set ASSESSMENT_BASE_SHA --repo tieopp/TaskFlow --body FULL_40_CHARACTER_SHA
```

The dry-run works without GitHub CLI or authentication and makes no remote requests. Live publishing verifies duplicates on GitHub, never closes/reopens issues, and records existing open matches. Manually resolve duplicate/closed issues before retrying. Difficulty is maintained in the manifest and issue definition; changing a published description requires an explicit maintainer edit.

Store the **full immutable SHA** in TieOpp's assessment-version record as well as the repository variable. This avoids a self-referential SHA in the commit itself. Never silently move an enrolled student's baseline. On future assessment releases, freeze a new SHA and version; retain old snapshots privately for in-flight evaluations. The repository variable is suitable for one active public version, while the backend must select each student's pinned version.

## Repository protections

Set `main` as default; disable auto-merge and restrict updates/deletions/force pushes with a ruleset. Use a restricted maintainer bypass list for controlled baseline maintenance. Do not grant students write access. Require approval for all outside-collaborator workflow runs and use GitHub-hosted ephemeral runners for public feedback. Do not place production secrets or self-hosted runners in the fork PR execution path.

For an assessment branch that must never accept student changes, use a branch lock or restrict all updates to a dedicated maintenance identity. Reviewers must not approve merging assessment PRs. Issue-closing keywords are rejected, and the completion module only patches the PR resource. No workflow grants merge or issue-closing permissions to student code.

A fork can alter its own `pull_request` workflow. Therefore its displayed checks/artifacts cannot be authoritative, even when the normal workflow copies trusted tests. For a trusted workflow definition, dispatch `trusted-pr-tests.yml` **from main** through the maintainer account or backend App. It uses the main workflow and pinned harness. Final evaluation still reruns in the private isolated service and never consumes a PR-produced completion flag.

```sh
gh workflow run trusted-pr-tests.yml --repo tieopp/TaskFlow --ref main -f pr_number=ACTUAL_PR_NUMBER
```

## Assessment maintenance

IDs are permanent identifiers, independent of issue numbers. `testFile` must be `tests/issues/ID.test.tsx`. Keep exactly these ten active issues for v1. A future assessment version can assign the next unused ID, add a bug definition and isolated tests, and freeze a new version; do not insert new features into this assessment. To disable an issue for new enrollments, set `enabled: false` in the next trusted manifest and backend catalog. Keep the GitHub issue open with a notice and honor existing enrollments using their frozen manifest.

Run `npm run verify:assessment` to require baseline green and every issue suite red. It writes actual counts to ignored `reports/verification.json`; a crash/empty suite is not a valid reproduction. To verify independence, use private temporary patches outside tracked files:

1. Snapshot the original source bytes and hashes.
2. Apply exactly one reference correction in an ignored scratch checkout.
3. Run baseline plus **all** issue suites. Require the selected suite to be fully green, baseline green, and every other suite still red.
4. Repeat from the original snapshot for every ID, then optionally test the combined corrections.
5. Restore and hash-compare original source; delete scratch patches. Re-run the intentionally buggy baseline checks.

Do not commit reference fixes, hidden tests, matrix scripts containing fixes, or internal grading prompts. The public verification command contains no fixes. Preserve only non-solution evidence in private maintainer storage.

## Reports and integration

Each normal CI run emits submission metadata, Vitest baseline and selected-issue JSON, and `evaluation.json`. Categories distinguish invalid submission, dependency failure, build failure, baseline failure, issue-test failure, and infrastructure failure. `status: completed` means public checks executed, **not** final TieOpp evaluation completion. Test counts are read from the runner, not inferred from exit status or hardcoded. Missing suites report `not_run`.

Configure the GitHub App and backend according to [GitHub integration](github-integration.md) and the [evaluation contract](../assessment/evaluation-contract.md). The completion module is importable service-side Node code; .NET/Python can implement the same operations or invoke it through a private trusted worker. App credentials never enter the app build or assessment runner.

Public PRs reveal student solutions. This repository cannot prevent copying from public submissions. For higher-stakes assessments, use private per-student repositories with equivalent pinned harnesses and restricted report access. Do not confuse public test success with verified authorship or engineering quality.
