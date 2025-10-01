import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

type MultiFrameworkConfig = StorybookConfig & {
  /**
   * Storybook multi-renderer support is still stabilising, so the generic
   * StorybookConfig type doesn't yet expose these properties. Extend the type
   * locally so we can register both React and Angular renderers without using
   * `any` casts.
   */
  renderers?: { name: string; options?: Record<string, unknown> }[];
  frameworks?: Record<string, { name: string; options?: Record<string, unknown> }>;
};

/**
 * Storybook configuration (TypeScript) for a React + Vite setup.
 * Uses Storybook 9 framework packages.
 */

const storybookDir = dirname(fileURLToPath(import.meta.url));

const resolveAliasPath = (relativePath: string) =>
  resolve(storybookDir, relativePath);

const withAngularDocgenExclusion = <T extends { name?: string; transform?: (...args: any[]) => any }>(
  plugins: T[] | undefined,
): T[] => {
  if (!plugins) {
    return [];
  }

  return plugins.map((plugin) => {
    if (plugin?.name !== "storybook:react-docgen-plugin" || typeof plugin.transform !== "function") {
      return plugin;
    }

    const originalTransform = plugin.transform.bind(plugin);

    return {
      ...plugin,
      async transform(code: unknown, id: string, ...rest: unknown[]) {
        if (id.includes("/src/angular/")) {
          return null;
        }

        return originalTransform(code, id, ...rest);
      },
    } satisfies T;
  });
};

const config: MultiFrameworkConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/angular/**/*.stories.@(ts|tsx)",
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
  frameworks: {
    angular: {
      name: "@storybook/angular",
      options: {},
    },
  },
  renderers: [
    { name: "@storybook/react" },
    { name: "@storybook/angular/renderer-vite" },
  ],
  async viteFinal(config, { configType }) {
    const resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        "@components": resolveAliasPath("../src/components"),
        "@web-components": resolveAliasPath("../src/web-components"),
        "@shared": resolveAliasPath("../src/shared"),
        "@styles": resolveAliasPath("../src/styles"),
        "@angular-ds": resolveAliasPath("../src/angular"),
      },
    };

    // Use relative base only for production builds (Pages). Keep dev defaults.
    if (configType === "PRODUCTION") {
      return {
        ...config,
        base: "./",
        resolve,
        plugins: withAngularDocgenExclusion([
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
        ]),
      };
    }
    // Strengthen file watching for Windows/VM/network drives
    return {
      ...config,
      resolve,
      plugins: withAngularDocgenExclusion(config.plugins),
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
