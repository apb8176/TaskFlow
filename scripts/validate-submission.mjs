import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { manifest } from "./lib.mjs";
export function validateSubmission(event, config = manifest) {
  const pr = event.pull_request;
  if (!pr || pr.base?.ref !== "main") throw new Error("PR must target main");
  if (pr.base.repo.full_name !== config.repository)
    throw new Error("Wrong assessment repository");
  const title = /^\[(TODO-(?:\d{3}|ALL))\]\s+\S.+$/.exec(pr.title ?? "");
  if (!title)
    throw new Error("Title must start with [TODO-NNN] or [TODO-ALL] and a description");
  const body = pr.body ?? "";
  const enabledIssues = config.issues.filter((item) => item.enabled);
  let issues;
  if (title[1] === "TODO-ALL") {
    const assessmentLines = [...body.matchAll(/^Assessment IDs:\s*(.+)\s*$/gm)];
    if (assessmentLines.length !== 1)
      throw new Error("Body must contain exactly one Assessment IDs line");
    const submittedIds = assessmentLines[0][1].match(/TODO-\d{3}/g) ?? [];
    const expectedIds = enabledIssues.map((item) => item.id);
    if (
      submittedIds.length !== expectedIds.length ||
      new Set(submittedIds).size !== expectedIds.length ||
      expectedIds.some((id) => !submittedIds.includes(id))
    )
      throw new Error("TODO-ALL must include every enabled assessment ID exactly once");
    const relatedLines = [
      ...body.matchAll(/^Related GitHub Issues:\s*(.+)\s*$/gm),
    ];
    const submittedNumbers =
      relatedLines.length === 1
        ? [...relatedLines[0][1].matchAll(/#([1-9]\d*)/g)].map((match) =>
            Number(match[1]),
          )
        : [];
    const expectedNumbers = enabledIssues.map((item) => item.githubIssueNumber);
    if (
      submittedNumbers.length !== expectedNumbers.length ||
      new Set(submittedNumbers).size !== expectedNumbers.length ||
      expectedNumbers.some((number) => !submittedNumbers.includes(number))
    )
      throw new Error("Related GitHub Issues must include every published issue exactly once");
    issues = enabledIssues;
  } else {
    const ids = new Set(`${pr.title}\n${body}`.match(/TODO-\d+/g));
    if (ids.size !== 1) throw new Error("Associate exactly one assessment ID");
    const assessments = [
      ...body.matchAll(/^Assessment ID:\s*(TODO-\d{3})\s*$/gm),
    ];
    if (assessments.length !== 1 || assessments[0][1] !== title[1])
      throw new Error("Body assessment ID must match title");
    const issue = enabledIssues.find((item) => item.id === title[1]);
    if (!issue) throw new Error("Unknown or disabled assessment ID");
    const related = [
      ...body.matchAll(/^Related GitHub Issue:\s*#([1-9]\d*)\s*$/gm),
    ];
    if (
      related.length !== 1 ||
      Number(related[0][1]) !== issue.githubIssueNumber
    )
      throw new Error("Related issue does not match the published manifest");
    issues = [issue];
  }
  if (issues.some((issue) => issue.testFile !== `tests/issues/${issue.id}.test.tsx`))
    throw new Error("Invalid manifest test path");
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
    assessmentId: title[1],
    assessmentIds: issues.map((issue) => issue.id),
    githubIssueNumber: issues.length === 1 ? issues[0].githubIssueNumber : null,
    githubIssueNumbers: issues.map((issue) => issue.githubIssueNumber),
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
