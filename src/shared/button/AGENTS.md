# Shared Button Core Guidelines

This directory extends the root `AGENTS.md` and exists to host framework-agnostic Button core modules that can be reused by React, Angular, and web-component adapters.

- Keep modules in this directory free of framework runtime dependencies (`react`, Angular decorators, or custom element lifecycle APIs).
- Treat this directory as the canonical source for shared Button styles and token-driven helper logic.
- If adapter-specific behavior is required, implement it in adapter directories and keep the API contract here stable.

## Functional Changes
- Use `<major>.<minor>[.<patch>]` labels instead of dates when recording new entries.
- 1.0.0: Introduced a shared Button core directory and moved canonical style, state-layer, and semantic color override modules out of `src/angular/button`.
- 1.0.1: Updated the shared button font-family token chain to prefer canonical typography tokens and fallback to `Saans` instead of Google Sans.

- 1.0.2: Migrated shared button style/color/state-layer token references to kebab-case CSS custom properties.
