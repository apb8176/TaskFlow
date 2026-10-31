import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { parseDocument } from "yaml";
import { manifest } from "../../scripts/lib.mjs";
test("all workflow YAML parses, with no privileged PR-code trigger", () => {
  for (const file of readdirSync(".github/workflows")) {
    const doc = parseDocument(
      readFileSync(`.github/workflows/${file}`, "utf8"),
      { uniqueKeys: true },
    );
    assert.deepEqual(doc.errors, []);
    const workflow = doc.toJS();
    assert.ok(workflow.jobs);
    assert.equal(workflow.permissions.contents, "read");
    assert.equal(workflow.on.pull_request_target, undefined);
  }
});
test("manifest has exactly ten unique IDs and existing suites and definitions", () => {
  assert.equal(manifest.issues.length, 10);
  assert.equal(new Set(manifest.issues.map((i) => i.id)).size, 10);
  assert.equal(
    readdirSync("assessment/issues").filter((f) => f.endsWith(".md")).length,
    10,
  );
  for (const issue of manifest.issues) {
    assert.ok(existsSync(issue.testFile));
    assert.ok(existsSync(`assessment/issues/${issue.id}.md`));
  }
});
