# GitHub Actions CI Required Checks

This repository uses `.github/workflows/ci.yml` as the main pull request gate.

## Required Branch Protection Setup

Configure this manually in GitHub:

1. Open **Settings -> Branches -> Branch protection rules**.
2. Add or edit the rule for `main`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging**.
5. Select `CI Required` as the required check.
6. Enable **Require branches to be up to date before merging**.
7. Save the rule.

## Validation

Use two throwaway pull requests after enabling protection:

1. Make a harmless one-character docs change. CI should run and finish green.
2. Make a deliberate type/build break in a service. CI should fail and GitHub should block merge into `main`.

The workflow runs all checks on `push` to `main` and when a pull request is first opened. Later PR updates only run jobs for changed service paths. `CI Required` is a stable aggregate check so branch protection still works when path filters skip individual service jobs.
