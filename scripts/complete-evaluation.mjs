// Service-side module only. Never import into the app or a student-code runner.
// The caller must authenticate completion and serialize work on the submission key.
export async function completeEvaluation(
  record,
  { github, reportOrigin, appId, repository, manifest },
) {
  if (
    record.finalStatus !== "completed" ||
    record.infrastructureError ||
    !record.completionConfirmedAt
  )
    throw new Error(
      "TieOpp has not confirmed successful evaluation completion",
    );
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(record.evaluationId))
    throw new Error("Invalid evaluation identity");
  if (
    record.repository !== repository ||
    !/^[\w.-]+\/[\w.-]+$/.test(repository)
  )
    throw new Error("Repository mismatch");
  if (
    !Number.isSafeInteger(record.pullRequestNumber) ||
    record.pullRequestNumber < 1 ||
    !Number.isSafeInteger(appId) ||
    appId < 1
  )
    throw new Error("Invalid PR or App identity");
  if (
    !/^[a-f0-9]{40}$/.test(record.headCommitSha) ||
    !/^[a-f0-9]{40}$/.test(record.baseAssessmentCommitSha)
  )
    throw new Error("Invalid commit identity");
  const issue = manifest.issues.find(
    (issue) =>
      issue.id === record.assessmentId &&
      issue.githubIssueNumber === record.githubIssueNumber,
  );
  if (!issue) throw new Error("Invalid assessment mapping");
  const url = new URL(record.reportUrl);
  if (
    url.protocol !== "https:" ||
    url.origin !== reportOrigin ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/reports\/[a-zA-Z0-9/_-]+$/.test(url.pathname)
  )
    throw new Error(
      "Use an authenticated report route on the configured TieOpp origin, without URL tokens",
    );
  const prefix = `/repos/${repository}`;
  const getPR = () =>
    github("GET", `${prefix}/pulls/${record.pullRequestNumber}`);
  const validate = (pr) => {
    if (
      pr.merged ||
      pr.head.sha !== record.headCommitSha ||
      pr.user.id !== record.studentGithubId ||
      pr.base.ref !== "main" ||
      pr.base.repo.full_name !== repository
    )
      throw new Error("Stale or mismatched submission");
  };
  const pr = await getPR();
  validate(pr);
  if (pr.state === "closed") return { status: "already_closed" };
  const marker = `<!-- tieopp-evaluation:${record.evaluationId}:${record.headCommitSha} -->`;
  let found = false;
  for (let page = 1; ; page++) {
    const comments = await github(
      "GET",
      `${prefix}/issues/${record.pullRequestNumber}/comments?per_page=100&page=${page}`,
    );
    found ||= comments.some(
      (comment) =>
        comment.performed_via_github_app?.id === appId &&
        comment.body.includes(marker),
    );
    if (comments.length < 100) break;
  }
  if (!found)
    await github(
      "POST",
      `${prefix}/issues/${record.pullRequestNumber}/comments`,
      {
        body: `Thank you for submitting your solution to the TieOpp Codebase Comprehension & Engineering Judgment Assessment!\n\nYour submission for ${record.assessmentId} has been evaluated.\n\nYou can view your detailed assessment report, test results, and engineering feedback on your TieOpp dashboard.\n\nView your report: ${url.href}\n\nThis Pull Request is being closed without merging because it is part of a TieOpp engineering assessment.\n\nKeep building. Keep improving.\n\n${marker}`,
      },
    );
  validate(await getPR());
  await github("PATCH", `${prefix}/pulls/${record.pullRequestNumber}`, {
    state: "closed",
  });
  return { status: "closed_without_merging" };
}

// Supply a short-lived GitHub App installation token from TieOpp's credential broker.
// Token creation/private-key storage belongs to the existing backend, not this repo.
export function githubAppClient(installationToken) {
  if (!installationToken)
    throw new Error("GitHub App installation token required");
  return async (method, path, body) => {
    if (!path.startsWith("/repos/"))
      throw new Error("Only repository API routes are allowed");
    const response = await fetch(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${installationToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(
        `GitHub operation failed (${response.status}); retry through the idempotent worker`,
      );
    return response.json();
  };
}
