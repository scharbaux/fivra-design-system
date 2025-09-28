# Repository Guidelines

## Project Goals
- Maintain a cohesive design system that delivers reusable, accessible UI primitives and documentation for Fivra products.
- Prioritize developer experience and consistent visual language across libraries, demos, and documentation.
- Ensure each change preserves design tokens, component contracts, and cross-platform parity.

## Coding and Documentation Standards
- Follow TypeScript best practices with strict typing and descriptive naming. Avoid implicit `any` and prefer composable, well-documented modules.
- Preserve accessibility considerations (ARIA attributes, keyboard interaction) in every component. Provide regression-safe tests when functionality changes.
- Update or add unit and visual regression tests when altering component behavior, APIs, or styles.
- Document noteworthy code paths with succinct comments when intent is non-obvious. Keep documentation in `docs/` aligned with implementation changes.

## AGENTS Governance
- Every directory that contains source files must include its own `AGENTS.md` outlining any additional or overriding rules.
- When creating a new directory, add an `AGENTS.md` that explicitly references this root file and describes any directory-specific expectations.
- Keep child `AGENTS.md` files synchronized with root policies. If root standards change, review and update descendant instructions accordingly.
- Record all functional or behavioral changes in the relevant directory-level `AGENTS.md` under a "Change Log" or similar section.
- run `yarn generate:icons` then run `yarn build`.
- Always make sure `yarn build` is ✅ successful before marking the task as completed.
- Always make sure `yarn test` has ✅ passed before marking the task as completed.

## Key Documentation References
- Tech stack details live in `docs/tech-stack.md`.
- Component architecture guidance is maintained in `docs/component-architecture.md`.
- Product overview and integration guides reside under `docs/overview/` and `docs/integrations/` respectively.
- When implementing features that alter technology choices, architectural boundaries, integration contracts, or documented component behavior, update the corresponding documents alongside your code changes.

## Functional Changes
- 2025-09-25: Introduced the Button component with shared React and web component implementations plus associated documentation.

