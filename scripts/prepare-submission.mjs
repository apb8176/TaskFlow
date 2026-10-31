import { cpSync, lstatSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
// Run from the trusted checkout. Only application code crosses the trust boundary.
const submission = resolve(process.argv[2]);
const destination = resolve(process.argv[3]);
if (
  destination === submission ||
  destination === process.cwd() ||
  dirname(destination) !== resolve("..")
)
  throw new Error("Destination must be a sibling workspace");
function rejectLinks(path) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error("Symbolic links are not accepted");
  if (stat.isDirectory())
    for (const entry of readdirSync(path)) rejectLinks(join(path, entry));
  else if (!stat.isFile())
    throw new Error("Only regular source files are accepted");
}
rejectLinks(join(submission, "src"));
mkdirSync(destination, { recursive: false });
for (const path of [
  "src",
  "public",
  "tests",
  "scripts",
  "assessment",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  "eslint.config.js",
  "index.html",
]) {
  cpSync(path, join(destination, path), { recursive: true });
}
rmSync(join(destination, "src"), { recursive: true });
cpSync(join(submission, "src"), join(destination, "src"), { recursive: true });
mkdirSync(join(destination, "reports"));
