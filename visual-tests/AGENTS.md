# Visual Testing Guidelines

This directory extends the repository root `AGENTS.md`. Use Playwright-based visual regression tests to guard Storybook regressions.

- Keep tests deterministic by disabling animations and waiting for Storybook frames to render before capturing screenshots.
- Store baseline images under `__screenshots__/` alongside the spec so Playwright manages updates consistently.
- Regenerate baselines intentionally with `yarn visual:test --update-snapshots` and review diffs before committing.
- Baseline filenames must stay platform-agnostic; avoid OS-specific suffixes by relying on the configured `snapshotPathTemplate`.
- Whenever a visual diff is expected, refresh every affected baseline before merging so shared snapshots pass locally and in CI.
- Document any new scenarios covered here in the contributor docs so the team understands the workflow.
- Record notable updates in the "Functional Changes" section below.
- When CI surfaces a failing run, download the `visual-regression-artifacts` upload from the job summary. Extract it locally to inspect `playwright-report/index.html` for an aggregated view and review the `test-results/` folder for the `*-actual.png`, `*-expected.png`, and `*-diff.png` comparisons.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Introduced Playwright-powered visual regression tests targeting the Button Storybook stories and committed baselines.
- 1.1.0: Added Angular dropdown/loading stories to the button visual suite to guard harmonized caret/spinner behavior.
- 1.1.1: Updated the harness to target Angular via JIT-enabled Storybook refs and captured dropdown/loading baselines.
- 1.1.2: Wait for `document.fonts.ready` (plus a frame tick) before capturing button stories so Google Sans always applies; refresh baselines after Playwright browsers finish installing.
- 1.1.3: Dropped OS-specific filename suffixes, refreshed shared baselines, and documented the cross-platform workflow.
- 1.1.4: Publish HTML reports and diff image bundles when Playwright visual tests fail so reviewers can audit regressions quickly.
- 1.1.5: Require the full Chromium toolchain (including `chromium-headless-shell`) before running tests and remind contributors to refresh baselines after the install completes.
- 1.1.6: Added Angular Button Storybook health checks that fail on page/console errors and renderer unresponsiveness to catch hung iframe regressions earlier.
- 1.1.7: Moved Angular dropdown/loading coverage out of `button.spec.ts` screenshots and into the dedicated Angular health check because Playwright screenshot capture against composed Angular iframes was timing out unreliably.
- 1.1.8: Applied Linux-tolerant per-story screenshot diff ratios (`secondary`, `tertiary`, `with-icons`) while keeping stricter defaults for remaining button visual scenarios.
