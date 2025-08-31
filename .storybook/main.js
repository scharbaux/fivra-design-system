/**
 * Storybook configuration (ESM) for a React + Vite setup.
 * Uses Storybook 8 framework packages.
 */

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    // Use relative base only for production builds (Pages). Keep dev defaults.
    if (configType === 'PRODUCTION') {
      return { ...config, base: './' };
    }
    // Strengthen file watching for Windows/VM/network drives
    return {
      ...config,
      server: {
        ...(config.server || {}),
        watch: {
          // polling improves reliability on some environments
          usePolling: true,
          interval: 200,
        },
      },
    };
  },
};

export default config;
