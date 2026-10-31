# GitHub and TieOpp integration

## Public CI

`pr-tests.yml` responds to opened, reopened, synchronize, and edited PR events. It uses read-only permissions, GitHub-hosted disposable runners, pinned action revisions, a 12-minute job timeout, and no saved checkout credentials. It does not use `pull_request_target` or access secrets. GitHub's native workflow job conclusion supplies the check status; JSON artifacts retain individual test results and category details.

Set `ASSESSMENT_BASE_SHA` to the full immutable baseline SHA **after** issue mappings have been committed. The workflow fetches current PR metadata from GitHub, validates the selected issue against that trusted manifest, and checks out the exact head SHA. It assembles the submitted `src/` with trusted package scripts, lockfile, tests, build configuration, public assets, and assessment metadata. Only `src/` is accepted as product implementation for these issues. Submitted tests/configs cannot replace this harness.

Build, baseline, and issue checks are separate steps with independent recorded outcomes. Build failure does not prevent installed test suites from producing diagnostic evidence. Installation failure skips code execution and is categorized separately. Invalid metadata prevents installation/execution. Artifact upload runs even after failed checks. Bootstrap failures before trusted scripts are available appear as workflow infrastructure failures and may have no JSON artifact; the backend must never assume missing evidence is a student failure.

The ordinary fork PR workflow definition is itself editable. Its output is not authoritative. `trusted-pr-tests.yml` is dispatched from protected `main` by maintainers or the backend App and reuses the trusted workflow definition. It still executes malicious-capable student JS, so final trusted grading must happen separately in the isolated backend runner. No public CI artifact can authorize PR closure.

See GitHub's [fork workflow settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) and [secure trigger guidance](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target). Require approval for outside contributors; do not enable write tokens or secrets for fork runs.

## GitHub App setup

Create an organization-owned GitHub App installed only on assessment repositories. Keep its private key in TieOpp's existing secret manager, never in this repository. The backend mints short-lived installation tokens. Grant repository Metadata read, Contents read, Pull requests read/write, and Issues write for PR comments. Grant Checks write only if the service will publish its own authoritative check runs. Actions write is needed only for optional trusted workflow dispatch. Use separate narrowly scoped installation tokens for dispatch and finalization where possible.

Configure a webhook HTTPS endpoint in the existing backend and subscribe to `pull_request` (opened, reopened, synchronize, edited, closed) and installation changes. Validate `X-Hub-Signature-256` against the **raw request bytes** with HMAC-SHA256 and constant-time comparison before deserialization. Store the delivery ID, acknowledge after durable queueing, and process asynchronously. Reject wrong installation/repository identities and replay duplicate deliveries idempotently.

Resolve the PR through GitHub's API; do not trust user-editable event text as authorization. Verify base repository/main, linked numeric GitHub student ID, enrollment, selected assessment ID, published issue mapping, fork identity and immutable head SHA. Tie the submission to the baseline from enrollment, not a supplied branch name. Validate metadata using the same rules as `validate-submission.mjs`.

## Evaluation and completion

The .NET/Python service queues the validated submission and invokes an isolated disposable executor according to the [contract](../assessment/evaluation-contract.md). Read baseline and private suites from trusted versioned storage. Review the implementation and explanation; generate the authenticated report; persist evidence and completion transactionally. Do not implement fake AI scores or accept student-supplied scores.

After completion, the trusted finalization worker can import:

```js
import { completeEvaluation, githubAppClient } from './scripts/complete-evaluation.mjs';

// completedRecord, token, settings and manifest come from trusted service storage.
await completeEvaluation(completedRecord, {
  github: githubAppClient(token),
  reportOrigin: settings.authenticatedReportOrigin,
  appId: settings.githubAppId,
  repository: settings.assessmentRepository,
  manifest: pinnedManifest,
});
```

This module is not a public CLI accepting arbitrary completion JSON. The service verifies completion, obtains an installation token, and serializes the operation. On timeout/error, retry through the outbox. Pending or infrastructure-error records must not close PRs. No closure webhook is sufficient to declare evaluation completed.

The report route must require login and authorization by numeric linked identity. A valid HTTPS URL alone does not prove authentication; configure and test report access in the backend. Public comments contain no score, hidden test names, diagnostics, or tokens. The module posts an App-owned marker for retry detection and closes only the PR. Verify this lifecycle in a disposable integration repository before production installation.

## Deployment checklist owned by TieOpp

- Publish issues and commit actual mappings; freeze and record a baseline SHA.
- Configure branch rules, outside-contributor approvals, and the baseline variable.
- Install the App, webhook secret/key management, and ownership validation.
- Provide queue, isolated runners, private suites, report authorization, review, and ERI evidence storage.
- Provide an idempotent finalization worker and monitor stale heads/partial completion failures.
- Test duplicate deliveries, failed runner provisioning, new commits during review, comment timeouts, closure retries, and unauthorized report access.

These services and credentials are intentionally external requirements. Local mocked integration tests validate the reusable operation's behavior; they do not establish a live production connection.
