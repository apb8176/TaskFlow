import { issueFor, vitest } from "./lib.mjs";
try {
  const [id, ...options] = process.argv.slice(2);
  const issue = issueFor(id);
  if (
    options.some(
      (arg) =>
        !/^--(?:reporter=(?:default|json)|outputFile=[\w./\\-]+\.json)$/.test(
          arg,
        ),
    )
  )
    throw new Error("Only --reporter and --outputFile options are supported");
  const result = vitest([issue.testFile, ...options]);
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
