import { test } from "node:test";
import assert from "node:assert/strict";
import { completeEvaluation } from "../../scripts/complete-evaluation.mjs";
function fixture() {
  const record = {
    evaluationId: "eval-123",
    finalStatus: "completed",
    completionConfirmedAt: "2026-01-01T00:00:00Z",
    repository: "tieopp/TaskFlow",
    pullRequestNumber: 27,
    assessmentId: "TODO-003",
    githubIssueNumber: 42,
    headCommitSha: "a".repeat(40),
    baseAssessmentCommitSha: "b".repeat(40),
    studentGithubId: 12,
    reportUrl: "https://reports.example.test/reports/eval-123",
  };
  const calls = [],
    comments = [];
  const pr = {
    state: "open",
    merged: false,
    head: { sha: record.headCommitSha },
    user: { id: 12 },
    base: { ref: "main", repo: { full_name: record.repository } },
  };
  const options = {
    reportOrigin: "https://reports.example.test",
    appId: 9,
    repository: record.repository,
    manifest: { issues: [{ id: "TODO-003", githubIssueNumber: 42 }] },
    github: async (method, path, body) => {
      calls.push({ method, path, body });
      if (method === "GET")
        return path.includes("/comments") ? comments : structuredClone(pr);
      if (method === "POST") {
        comments.push({ body: body.body, performed_via_github_app: { id: 9 } });
        return {};
      }
      if (method === "PATCH") {
        pr.state = "closed";
        return {};
      }
      throw new Error("Unexpected call");
    },
  };
  return { record, options, pr, calls, comments };
}
test("comments and closes only the PR, never the assessment issue", async () => {
  const { record, options, calls } = fixture();
  await completeEvaluation(record, options);
  assert.equal(calls.filter((c) => c.method === "POST").length, 1);
  assert.deepEqual(
    calls.find((c) => c.method === "PATCH"),
    {
      method: "PATCH",
      path: "/repos/tieopp/TaskFlow/pulls/27",
      body: { state: "closed" },
    },
  );
  assert.ok(
    calls.every(
      (c) => !c.path.includes("/issues/42") && !c.path.includes("/merge"),
    ),
  );
});
test("retries after success do not duplicate comments", async () => {
  const f = fixture();
  await completeEvaluation(f.record, f.options);
  await completeEvaluation(f.record, f.options);
  assert.equal(f.calls.filter((c) => c.method === "POST").length, 1);
});
test("recovers from failure between comment and close", async () => {
  const f = fixture();
  const client = f.options.github;
  let fail = true;
  f.options.github = async (...args) => {
    if (args[0] === "PATCH" && fail) {
      fail = false;
      throw new Error("temporary");
    }
    return client(...args);
  };
  await assert.rejects(completeEvaluation(f.record, f.options));
  await completeEvaluation(f.record, f.options);
  assert.equal(f.calls.filter((c) => c.method === "POST").length, 1);
});
for (const [name, mutate] of [
  [
    "pending evaluation",
    (f) => {
      f.record.finalStatus = "pending";
    },
  ],
  [
    "infrastructure error",
    (f) => {
      f.record.infrastructureError = true;
    },
  ],
  [
    "stale head",
    (f) => {
      f.pr.head.sha = "c".repeat(40);
    },
  ],
  [
    "wrong student",
    (f) => {
      f.pr.user.id = 99;
    },
  ],
  [
    "untrusted report origin",
    (f) => {
      f.record.reportUrl = "https://attacker.test/reports/x";
    },
  ],
  [
    "token-bearing report URL",
    (f) => {
      f.record.reportUrl += "?token=secret";
    },
  ],
  [
    "wrong issue mapping",
    (f) => {
      f.record.githubIssueNumber = 3;
    },
  ],
])
  test(`refuses ${name}`, async () => {
    const f = fixture();
    mutate(f);
    await assert.rejects(completeEvaluation(f.record, f.options));
    assert.equal(f.calls.filter((c) => c.method !== "GET").length, 0);
  });
