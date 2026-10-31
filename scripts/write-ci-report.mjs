import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
const read = (path) =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
const submission = read("../trusted/reports/submission.json") ?? {
  status: "invalid_submission",
};
function suite(path) {
  const data = read(path);
  if (!data) return { passed: 0, total: 0, status: "not_run", tests: [] };
  return {
    passed: data.numPassedTests,
    total: data.numTotalTests,
    status: data.success ? "passed" : "failed",
    tests: data.testResults.flatMap((file) =>
      file.assertionResults.map((test) => ({
        name: test.fullName,
        status: test.status,
      })),
    ),
  };
}
const baseline = suite("reports/baseline.json"),
  issue = suite("reports/issue.json");
const categories = [];
if (
  submission.status === "invalid_submission" ||
  process.env.VALIDATION !== "success"
)
  categories.push("invalid_submission");
if (process.env.INSTALL === "failure") categories.push("dependency_failure");
if (process.env.BUILD === "failure") categories.push("build_failure");
if (process.env.BASELINE === "failure") categories.push("baseline_failure");
if (process.env.ISSUE === "failure") categories.push("issue_test_failure");
if (
  !categories.length &&
  [
    process.env.INSTALL,
    process.env.BUILD,
    process.env.BASELINE,
    process.env.ISSUE,
  ].some((value) => value !== "success")
)
  categories.push("infrastructure_failure");
const report = {
  ...submission,
  schemaVersion: 1,
  buildPassed: process.env.BUILD === "success",
  baselinePassed: baseline.status === "passed",
  issueTestsPassed: issue.passed,
  issueTestsTotal: issue.total,
  baseline,
  issue,
  categories,
  status: categories.includes("invalid_submission")
    ? "invalid_submission"
    : categories.some((c) =>
          ["dependency_failure", "infrastructure_failure"].includes(c),
        )
      ? "infrastructure_error"
      : "completed",
  evidenceTrust: "public-ci-advisory",
  runId: process.env.GITHUB_RUN_ID ?? null,
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/evaluation.json", JSON.stringify(report, null, 2));
if (categories.length) process.exitCode = 1;
