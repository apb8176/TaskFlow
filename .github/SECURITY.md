# Security policy

## Supported version

Security maintenance applies to the current default branch and its trusted assessment automation. Historical assessment snapshots and contributor forks are immutable or independently maintained and may not receive updates.

| Version | Supported |
| --- | --- |
| Current `main` | Yes |
| Historical baselines and forks | No |

## Reporting a vulnerability

Report suspected vulnerabilities through [GitHub's private vulnerability reporting flow](https://github.com/tieopp/TaskFlow/security/advisories/new). Include:

- the affected file, workflow, or integration;
- clear reproduction steps and expected impact;
- the commit SHA or assessment version involved;
- any safe proof of concept and suggested mitigation.

Do not open a public issue, pull request, or discussion containing exploit details, credentials, private test material, or candidate data. Give maintainers reasonable time to investigate before public disclosure.

The ten documented TODO behaviors are intentional functional assessment defects. Report them through their existing assessment issues, not as security vulnerabilities, unless they create a genuine confidentiality, integrity, or availability risk outside the exercise.

Never commit secrets. If a credential is exposed, revoke or rotate it immediately before reporting the incident.
