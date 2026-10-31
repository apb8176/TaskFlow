import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { manifest, vitest } from "./lib.mjs";
mkdirSync("reports", { recursive: true });
const results = [];
for (const [id, path] of [
  ["baseline", "tests/baseline"],
  ...manifest.issues.map((issue) => [issue.id, issue.testFile]),
]) {
  const report = `reports/verify-${id}.json`;
  const run =
    id === "baseline"
      ? vitest([path, "--reporter=json", `--outputFile=${report}`], {
          stdio: "pipe",
        })
      : spawnSync(
          process.execPath,
          [
            "scripts/run-issue-tests.mjs",
            id,
            "--reporter=json",
            `--outputFile=${report}`,
          ],
          { stdio: "pipe" },
        );
  if (run.error) throw run.error;
  const data = JSON.parse(readFileSync(report, "utf8"));
  const valid =
    id === "baseline"
      ? run.status === 0 &&
        data.numFailedTests === 0 &&
        data.numTotalTests === 15
      : run.status === 1 &&
        data.numFailedTests > 0 &&
        data.numTotalTests >= 3 &&
        data.numTotalTests <= 5;
  results.push({
    id,
    passed: data.numPassedTests,
    failed: data.numFailedTests,
    total: data.numTotalTests,
    valid,
  });
  console.log(
    `${id}: ${data.numPassedTests}/${data.numTotalTests} passing; assessment expectation ${valid ? "met" : "NOT MET"}`,
  );
}
writeFileSync("reports/verification.json", JSON.stringify(results, null, 2));
if (results.some((result) => !result.valid)) process.exitCode = 1;
