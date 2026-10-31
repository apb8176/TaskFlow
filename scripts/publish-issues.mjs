import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { manifest } from "./lib.mjs";
const flags = process.argv.slice(2);
if (flags.some((flag) => !["--dry-run"].includes(flag)))
  throw new Error("Usage: npm run publish:issues -- [--dry-run]");
const dryRun = flags.includes("--dry-run");
function gh(args) {
  const result = spawnSync("gh", args, { encoding: "utf8", shell: false });
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message ?? result.stderr);
  return result.stdout.trim();
}
if (dryRun) {
  for (const issue of manifest.issues)
    console.log(
      `[dry-run] ${manifest.repository}: [${issue.id}] ${issue.title} (${issue.difficulty}); mapped issue: ${issue.githubIssueNumber ?? "not published"}`,
    );
  console.log(
    "No remote changes. Live publishing searches all issues, including closed issues, before creating anything.",
  );
} else {
  gh(["auth", "status"]);
  // --paginate retrieves all pages, avoiding a fixed issue count duplicate-detection limit.
  const pages = JSON.parse(
    gh([
      "api",
      "--paginate",
      "--slurp",
      `repos/${manifest.repository}/issues?state=all&per_page=100`,
    ]),
  );
  const existing = pages.flat().filter((item) => !item.pull_request);
  for (const issue of manifest.issues) {
    const matches = existing.filter((item) =>
      item.title.startsWith(`[${issue.id}] `),
    );
    if (matches.length > 1)
      throw new Error(
        `Duplicate ${issue.id} issues exist; resolve mapping manually`,
      );
    if (
      issue.githubIssueNumber &&
      matches[0]?.number !== issue.githubIssueNumber
    )
      throw new Error(
        `Mapping drift for ${issue.id}; inspect before publishing`,
      );
    if (matches[0]) {
      if (matches[0].state !== "open")
        throw new Error(
          `${issue.id} is closed; reopen it manually before continuing`,
        );
      issue.githubIssueNumber = matches[0].number;
    } else {
      const url = gh([
        "issue",
        "create",
        "--repo",
        manifest.repository,
        "--title",
        `[${issue.id}] ${issue.title}`,
        "--body-file",
        `assessment/issues/${issue.id}.md`,
      ]);
      const number = Number(url.split("/").at(-1));
      if (!Number.isSafeInteger(number) || number < 1)
        throw new Error("Unexpected GitHub issue URL");
      issue.githubIssueNumber = number;
    }
    // Persist each success so retries recover partial publication safely.
    writeFileSync(
      "assessment/issue-manifest.json",
      JSON.stringify(manifest, null, 2) + "\n",
    );
    console.log(`${issue.id}: #${issue.githubIssueNumber}`);
  }
}
