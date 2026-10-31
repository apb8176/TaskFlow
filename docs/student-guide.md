# Student guide

Select one TODO issue on TieOpp and read its GitHub description before branching. Keep your fork's `main` at the baseline specified by TieOpp. If TieOpp gives a SHA, create your branch with `git switch -c fix/todo-003-active-filter BASELINE_SHA`; do not base your work on another student's branch. A fresh clone of the original frozen main is equivalent for the first assessment release.

Use Node 22.12+ and `npm install`, then `npm run dev`. After cloning, `npm ci` installs exactly the lockfile versions and is appropriate for repeatable local validation. No `.env` credentials are needed. Browser data belongs to the origin/port used; opening another port uses a separate store. Deleting the localStorage key resets sample data, while an empty saved list should stay empty.

First run `npm run test:baseline` and the suite for your issue. Baseline should pass, and the issue suite should expose the bug. Read the assertions as behavioral requirements. Trace the data from UI through hooks and utilities, fix the selected problem, and rerun both suites. Use `npm run build` and `npm run lint` before submitting. `test:all` intentionally reports failures for the other issues; this is not a reason to solve them all.

Submit one PR for one assessment ID from a branch in your fork to the original repository's `main`. Explain the observed behavior, root cause, changes, and verification. Replace the example ID and issue number in the template. Keep `Related GitHub Issue: #NUMBER` on its own line. Use neutral references so GitHub does not automatically close assessment issues. You do not need write access to the original repository.

Fix the product source in `src/`. Changes to tests, package scripts, lockfile, CI, manifests, or configuration in your fork are not used by the trusted assessment harness. You can add local experiments, but the selected fix must work with the baseline toolchain. If that is impossible, contact TieOpp before changing dependencies.

If CI rejects metadata, check the title ID, body ID, actual published issue number, and completed explanation sections. If a fork run awaits approval, wait for a maintainer. A missing frozen-baseline configuration is an administrator issue. Dependency or evaluation infrastructure errors are reported separately from your implementation's test results.

After evaluation, use your authenticated TieOpp dashboard to read your report. The PR is closed without merging to preserve the assessment baseline. The issue remains available to other students. Do not publish private test details or other students' reports.
