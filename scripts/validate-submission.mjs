import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { manifest } from "./lib.mjs";
export function validateSubmission(event, config = manifest) {
  const pr = event.pull_request;
  if (!pr || pr.base?.ref !== "main") throw new Error("PR must target main");
  if (pr.base.repo.full_name !== config.repository)
    throw new Error("Wrong assessment repository");
  const title = /^\[(TODO-\d{3})\]\s+\S.+$/.exec(pr.title ?? "");
  if (!title)
    throw new Error("Title must start with [TODO-NNN] and a description");
  const body = pr.body ?? "";
  const ids = new Set(`${pr.title}\n${body}`.match(/TODO-\d+/g));
  if (ids.size !== 1) throw new Error("Associate exactly one assessment ID");
  const assessments = [
    ...body.matchAll(/^Assessment ID:\s*(TODO-\d{3})\s*$/gm),
  ];
  if (assessments.length !== 1 || assessments[0][1] !== title[1])
    throw new Error("Body assessment ID must match title");
  const issue = config.issues.find(
    (item) => item.id === title[1] && item.enabled,
  );
  if (!issue) throw new Error("Unknown or disabled assessment ID");
  if (issue.testFile !== `tests/issues/${issue.id}.test.tsx`)
    throw new Error("Invalid manifest test path");
  const related = [
    ...body.matchAll(/^Related GitHub Issue:\s*#([1-9]\d*)\s*$/gm),
  ];
  if (related.length !== 1 || Number(related[0][1]) !== issue.githubIssueNumber)
    throw new Error("Related issue does not match the published manifest");
  if (
    /\b(?:close[sd]?|fix(?:es|ed)?|resolve[sd]?)\s+(?:(?:https:\/\/github\.com\/[^\s]+\/issues\/)|(?:[\w.-]+\/[\w.-]+)?#)\d+/i.test(
      body,
    )
  )
    throw new Error("Use Related GitHub Issue, not auto-closing keywords");
  for (const heading of [
    "Bug Fixed",
    "Root Cause",
    "Changes Made",
    "Testing",
  ]) {
    const match = new RegExp(
      `^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`,
      "m",
    ).exec(body);
    if (!match?.[1].trim() || /^Describe |^Explain /.test(match[1].trim()))
      throw new Error(`Complete the ${heading} section`);
  }
  if (!/^[a-f0-9]{40}$/.test(pr.head?.sha ?? ""))
    throw new Error("Invalid head commit SHA");
  if (
    !Number.isSafeInteger(pr.number) ||
    pr.number < 1 ||
    !pr.user?.login ||
    !pr.head.repo?.full_name
  )
    throw new Error("Missing PR identity");
  return {
    assessmentId: issue.id,
    githubIssueNumber: issue.githubIssueNumber,
    pullRequestNumber: pr.number,
    commitSha: pr.head.sha,
    studentGithubLogin: pr.user.login,
    pullRequestRepository: pr.base.repo.full_name,
    headRepository: pr.head.repo.full_name,
    baseAssessmentCommitSha: process.env.ASSESSMENT_BASE_SHA ?? null,
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  mkdirSync("reports", { recursive: true });
  try {
    const result = validateSubmission(
      JSON.parse(
        readFileSync(process.env.GITHUB_EVENT_PATH ?? process.argv[2], "utf8"),
      ),
    );
    writeFileSync("reports/submission.json", JSON.stringify(result, null, 2));
    console.log(result.assessmentId);
  } catch (error) {
    writeFileSync(
      "reports/submission.json",
      JSON.stringify({ status: "invalid_submission", error: error.message }),
    );
    console.error(error.message);
    process.exitCode = 2;
  }
}
