import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSubmission } from "../../scripts/validate-submission.mjs";
import { issueFor, manifest } from "../../scripts/lib.mjs";
const config = structuredClone(manifest);
config.issues[2].githubIssueNumber = 42;
function event() {
  return {
    pull_request: {
      number: 17,
      title: "[TODO-003] Correct active filtering",
      body: "Assessment ID: TODO-003\nRelated GitHub Issue: #42\n\n## Bug Fixed\nCompleted tasks appeared.\n\n## Root Cause\nThe status predicate was incorrect.\n\n## Changes Made\nAdjusted the behavior.\n\n## Testing\nRan the selected suite.",
      base: { ref: "main", repo: { full_name: "tieopp/TaskFlow" } },
      head: { sha: "a".repeat(40), repo: { full_name: "student/TaskFlow" } },
      user: { login: "student" },
    },
  };
}
test("uses the published issue number, not the numeric assessment suffix", () => {
  const result = validateSubmission(event(), config);
  assert.equal(result.githubIssueNumber, 42);
  assert.equal(result.assessmentId, "TODO-003");
});
test("accepts one TODO-ALL submission containing every enabled issue", () => {
  const input = event();
  input.pull_request.title = "[TODO-ALL] Fix all ten task management issues";
  input.pull_request.body = `Assessment IDs: ${config.issues.map((issue) => issue.id).join(", ")}
Related GitHub Issues: ${config.issues.map((issue) => `#${issue.githubIssueNumber}`).join(", ")}

## Bug Fixed
All ten published task-management defects.

## Root Cause
The defects came from independent state, filtering, persistence, and identity errors.

## Changes Made
Implemented focused fixes for every published requirement.

## Testing
Ran the baseline and all ten assessment suites.`;
  const result = validateSubmission(input, config);
  assert.equal(result.assessmentId, "TODO-ALL");
  assert.deepEqual(
    result.assessmentIds,
    config.issues.map((issue) => issue.id),
  );
  assert.equal(result.githubIssueNumber, null);
  assert.deepEqual(
    result.githubIssueNumbers,
    config.issues.map((issue) => issue.githubIssueNumber),
  );
});
test("rejects an incomplete TODO-ALL mapping", () => {
  const input = event();
  input.pull_request.title = "[TODO-ALL] Fix all ten task management issues";
  input.pull_request.body = input.pull_request.body
    .replace("Assessment ID: TODO-003", "Assessment IDs: TODO-001, TODO-002")
    .replace("Related GitHub Issue: #42", "Related GitHub Issues: #11, #12");
  assert.throws(() => validateSubmission(input, config), /every enabled/);
});
for (const [name, change] of [
  [
    "unknown ID",
    (e) => {
      e.pull_request.title = "[TODO-099] Unknown";
    },
  ],
  [
    "multiple IDs",
    (e) => {
      e.pull_request.body += "\nTODO-004";
    },
  ],
  [
    "wrong issue number",
    (e) => {
      e.pull_request.body = e.pull_request.body.replace("#42", "#3");
    },
  ],
  [
    "wrong target",
    (e) => {
      e.pull_request.base.ref = "student-branch";
    },
  ],
  [
    "auto-closing keyword",
    (e) => {
      e.pull_request.body += "\nFixes #42";
    },
  ],
  [
    "missing explanation",
    (e) => {
      e.pull_request.body = e.pull_request.body.replace(
        "Adjusted the behavior.",
        "",
      );
    },
  ],
  [
    "invalid SHA",
    (e) => {
      e.pull_request.head.sha = "main";
    },
  ],
  [
    "duplicate assessment field",
    (e) => {
      e.pull_request.body += "\nAssessment ID: TODO-003";
    },
  ],
  [
    "shell-like title",
    (e) => {
      e.pull_request.title = "$(echo TODO-003)";
    },
  ],
])
  test(`rejects ${name}`, () => {
    const input = event();
    change(input);
    assert.throws(() => validateSubmission(input, config));
  });
test("rejects unpublished and disabled mappings", () => {
  assert.throws(() => validateSubmission(event(), manifest));
  const disabled = structuredClone(config);
  disabled.issues[2].enabled = false;
  assert.throws(() => validateSubmission(event(), disabled));
});
test("rejects path traversal in issue runner", () => {
  assert.throws(() => issueFor("../tests"));
  assert.throws(() => issueFor("TODO-999"));
  assert.equal(issueFor("TODO-003").testFile, "tests/issues/TODO-003.test.tsx");
});
