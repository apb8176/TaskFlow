import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
export const root = fileURLToPath(new URL("../", import.meta.url));
export const manifest = JSON.parse(
  readFileSync(
    new URL("../assessment/issue-manifest.json", import.meta.url),
    "utf8",
  ),
);
export function issueFor(id) {
  const issue = manifest.issues.find((item) => item.id === id && item.enabled);
  if (
    !issue ||
    !/^TODO-\d{3}$/.test(id) ||
    issue.testFile !== `tests/issues/${id}.test.tsx`
  )
    throw new Error("Unknown or disabled assessment ID");
  return issue;
}
export function vitest(args, options = {}) {
  return spawnSync(
    process.execPath,
    ["node_modules/vitest/vitest.mjs", "run", ...args],
    { cwd: root, stdio: "inherit", ...options },
  );
}
