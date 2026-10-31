import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
const script = resolve("scripts/write-ci-report.mjs");
function report(env, suites = true) {
  const folder = mkdtempSync(join(tmpdir(), "taskflow-report-"));
  try {
    mkdirSync(join(folder, "trusted/reports"), { recursive: true });
    mkdirSync(join(folder, "evaluation/reports"), { recursive: true });
    writeFileSync(
      join(folder, "trusted/reports/submission.json"),
      JSON.stringify({
        assessmentId: "TODO-003",
        githubIssueNumber: 42,
        pullRequestNumber: 91,
        commitSha: "a".repeat(40),
      }),
    );
    if (suites)
      for (const name of ["baseline", "issue"])
        writeFileSync(
          join(folder, `evaluation/reports/${name}.json`),
          JSON.stringify({
            numPassedTests: name === "issue" ? 2 : 15,
            numTotalTests: name === "issue" ? 4 : 15,
            success: name === "baseline",
            testResults: [
              {
                assertionResults: [
                  { fullName: "runtime test name", status: "passed" },
                ],
              },
            ],
          }),
        );
    const processResult = spawnSync(process.execPath, [script], {
      cwd: join(folder, "evaluation"),
      env: {
        ...process.env,
        VALIDATION: "success",
        INSTALL: "success",
        BUILD: "success",
        BASELINE: "success",
        ISSUE: "failure",
        ...env,
      },
    });
    return {
      exit: processResult.status,
      data: JSON.parse(
        readFileSync(join(folder, "evaluation/reports/evaluation.json")),
      ),
    };
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}
test("reports actual selected-suite counts and identities", () => {
  const { data, exit } = report({});
  assert.equal(data.githubIssueNumber, 42);
  assert.equal(data.pullRequestNumber, 91);
  assert.equal(data.issueTestsPassed, 2);
  assert.equal(data.issueTestsTotal, 4);
  assert.equal(data.status, "completed");
  assert.deepEqual(data.categories, ["issue_test_failure"]);
  assert.equal(exit, 1);
});
test("distinguishes dependency failure from student assertions", () => {
  const { data } = report(
    {
      INSTALL: "failure",
      BUILD: "skipped",
      BASELINE: "skipped",
      ISSUE: "skipped",
    },
    false,
  );
  assert.equal(data.status, "infrastructure_error");
  assert.deepEqual(data.categories, ["dependency_failure"]);
  assert.equal(data.issue.status, "not_run");
});
test("distinguishes invalid mapping from build failure", () => {
  assert.equal(
    report(
      {
        VALIDATION: "failure",
        INSTALL: "skipped",
        BUILD: "skipped",
        BASELINE: "skipped",
        ISSUE: "skipped",
      },
      false,
    ).data.status,
    "invalid_submission",
  );
  assert.ok(
    report({ BUILD: "failure" }).data.categories.includes("build_failure"),
  );
});
