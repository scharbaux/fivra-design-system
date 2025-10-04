# Visual Testing Guidelines

This directory extends the repository root `AGENTS.md`. Use Playwright-based visual regression tests to guard Storybook regressions.

- Keep tests deterministic by disabling animations and waiting for Storybook frames to render before capturing screenshots.
- Store baseline images under `__screenshots__/` alongside the spec so Playwright manages updates consistently.
- Regenerate baselines intentionally with `yarn visual:test --update-snapshots` and review diffs before committing.
- Document any new scenarios covered here in the contributor docs so the team understands the workflow.
- Record notable updates in the "Functional Changes" section below.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0: Introduced Playwright-powered visual regression tests targeting the Button Storybook stories and committed baselines.
- 1.1.0: Added Angular dropdown/loading stories to the button visual suite to guard harmonized caret/spinner behavior.
- 1.1.1: Updated the harness to target Angular via JIT-enabled Storybook refs and captured dropdown/loading baselines.
- 1.1.2: Wait for `document.fonts.ready` (plus a frame tick) before capturing button stories so Google Sans always applies; refresh baselines after Playwright browsers finish installing.
