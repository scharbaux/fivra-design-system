# Web Components Guidelines

This directory extends the repository and `src/components/` guidance for custom elements.

- Keep custom element classes framework-agnostic and avoid importing React-specific utilities.
- Mirror property/attribute changes across React wrappers and Storybook stories when behavior changes.
- Update the "Functional Changes" log below whenever a web component gains new capabilities.

## Functional Changes
- 2024-07-08: Registered the `<fivra-button>` custom element that mirrors the shared Button styles and attributes.
- 2024-07-09: Ensured `defineDesignSystemElements` explicitly imports `defineFivraButton` to support isolated DTS builds.
