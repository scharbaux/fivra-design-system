import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook configuration (TypeScript) for a React + Vite setup.
 * Uses Storybook 9 framework packages.
 */

const storybookDir = dirname(fileURLToPath(import.meta.url));

const resolveAliasPath = (relativePath: string) =>
  resolve(storybookDir, relativePath);

const getRefMode = () => {
  const explicitMode = process.env.STORYBOOK_REF_MODE;
  if (explicitMode === "static" || explicitMode === "dev") {
    return explicitMode;
  }

  return process.env.NODE_ENV === "production" ? "static" : "dev";
};

const refMode = getRefMode();
const isStaticRefMode = refMode === "static";

const angularDevUrl =
  process.env.STORYBOOK_ANGULAR_URL ?? "http://localhost:6007";
const vueDevUrl =
  process.env.STORYBOOK_VUE_URL ?? "http://localhost:6008";
const angularStaticUrl =
  process.env.STORYBOOK_ANGULAR_STATIC_URL ?? "./angular";
const vueStaticUrl = process.env.STORYBOOK_VUE_STATIC_URL ?? "./vue";

const includeAngularRef = process.env.STORYBOOK_COMPOSE_ANGULAR !== "false";
const includeVueRef = process.env.STORYBOOK_COMPOSE_VUE !== "false";

const refs: StorybookConfig["refs"] = {};

if (includeAngularRef) {
  refs.angular = {
    title: "Components/Button/Angular",
    url: isStaticRefMode ? angularStaticUrl : angularDevUrl,
    expanded: true,
  };
}

if (includeVueRef) {
  refs.vue = {
    title: "Components/Button/Vue",
    url: isStaticRefMode ? vueStaticUrl : vueDevUrl,
    expanded: true,
  };
}

const config: StorybookConfig = {
  stories: [
    "../docs/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../docs/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
  refs,
  managerEntries: async (existingEntries = []) => {
    const resolvedEntries =
      typeof existingEntries === "function"
        ? await existingEntries()
        : existingEntries;

    return [
      ...(resolvedEntries ?? []),
      resolveAliasPath("./refs-manager-entry.ts"),
    ];
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
