import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/angular";

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
  async webpackFinal(baseConfig) {
    const updatedConfig = { ...baseConfig };
    updatedConfig.resolve = {
      ...(baseConfig.resolve ?? {}),
      alias: {
        ...(baseConfig.resolve?.alias ?? {}),
        "@components": resolveFromRoot("src/components"),
        "@web-components": resolveFromRoot("src/web-components"),
        "@shared": resolveFromRoot("src/shared"),
        "@styles": resolveFromRoot("src/styles"),
        "@internal/angular": resolveFromRoot("src/angular"),
      },
    };

    return updatedConfig;
  },
};

export default config;
