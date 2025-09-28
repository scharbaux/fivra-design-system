import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook configuration (TypeScript) for a React + Vite setup.
 * Uses Storybook 9 framework packages.
 */

const resolveAliasPath = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../src/docs/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/docs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-designs",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config, { configType }) {
    const resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        "@components": resolveAliasPath("../src/components"),
        "@web-components": resolveAliasPath("../src/web-components"),
        "@shared": resolveAliasPath("../src/shared"),
        "@styles": resolveAliasPath("../src/styles"),
      },
    };

    // Use relative base only for production builds (Pages). Keep dev defaults.
    if (configType === "PRODUCTION") {
      return {
        ...config,
        base: "./",
        resolve,
        plugins: [
          ...(config.plugins || []),
          {
            name: "sb-ghpages-fix-absolute-vite-inject",
            transformIndexHtml(html) {
              return html.replace(
                /src="\/vite-inject-mocker-entry\.js"/g,
                'src="./vite-inject-mocker-entry.js"'
              );
            },
          },
        ],
      };
    }
    // Strengthen file watching for Windows/VM/network drives
    return {
      ...config,
      resolve,
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
