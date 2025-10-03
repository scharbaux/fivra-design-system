import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/angular";

/**
 * Storybook configuration for the Angular workspace using the Vite builder.
 * Mirrors the React and Vue setups so aliases, addons, and production tweaks stay aligned.
 */
const storybookDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(storybookDir, "../../..");

const resolveFromRoot = (relativePath: string) => resolve(repoRoot, relativePath);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-designs"],
  framework: {
    name: "@storybook/angular",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  async viteFinal(config, { configType }) {
    const resolveConfig = {
      ...(config.resolve ?? {}),
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@components": resolveFromRoot("src/components"),
        "@web-components": resolveFromRoot("src/web-components"),
        "@shared": resolveFromRoot("src/shared"),
        "@styles": resolveFromRoot("src/styles"),
        "@internal/angular": resolveFromRoot("src/angular"),
      },
    };

    const serverConfig = {
      ...(config.server ?? {}),
      headers: {
        ...(config.server?.headers ?? {}),
        "Access-Control-Allow-Origin": "http://localhost:6006",
        "Access-Control-Allow-Credentials": "true",
      },
    };

    if (configType === "PRODUCTION") {
      return {
        ...config,
        base: "./",
        resolve: resolveConfig,
        server: serverConfig,
        plugins: [
          ...(config.plugins ?? []),
          {
            name: "sb-ghpages-fix-absolute-vite-inject",
            transformIndexHtml(html) {
              return html.replace(
                /src="\/vite-inject-mocker-entry\.js"/g,
                'src="./vite-inject-mocker-entry.js"',
              );
            },
          },
        ],
      };
    }

    return {
      ...config,
      resolve: resolveConfig,
      server: {
        ...serverConfig,
        watch: {
          usePolling: true,
          interval: 200,
        },
      },
    };
  },
};

export default config;
