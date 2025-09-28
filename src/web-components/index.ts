/**
 * Placeholder entry point for the custom elements build.
 * Future releases will register and export individual web components.
 */
export function defineDesignSystemElements(): void {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[web-components] No custom elements are registered yet.');
  }
}