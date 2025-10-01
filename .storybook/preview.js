import React from 'react';
import '../src/styles/index.css';
import * as designTokenThemes from '../src/styles/themes';

const DESIGN_TOKEN_LOG_PREFIX = '[Storybook][Design Tokens]';
const SAMPLE_THEME_VARIABLES = [
  '--radiusMax',
  '--spacingS',
  '--backgroundPrimaryInteractive',
];

const shouldLogDesignTokenStatus = () =>
  typeof window !== 'undefined' && (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production');

const getModuleExport = (module, exportName) => {
  if (!module) {
    return undefined;
  }

  try {
    return Reflect.get(module, exportName);
  } catch (error) {
    if (shouldLogDesignTokenStatus()) {
      console.warn(
        `${DESIGN_TOKEN_LOG_PREFIX} Failed to read the "${exportName}" export from the design token module.`,
        error,
      );
    }
    return undefined;
  }
};

const resolveDesignTokenExport = (exportName, { expectFunction = false } = {}) => {
  const queue = [designTokenThemes];
  const visited = new Set();

  while (queue.length > 0) {
    const currentModule = queue.shift();
    if (!currentModule || visited.has(currentModule)) {
      continue;
    }

    visited.add(currentModule);

    const exportValue = getModuleExport(currentModule, exportName);
    if (expectFunction) {
      if (typeof exportValue === 'function') {
        return exportValue;
      }
    } else if (typeof exportValue !== 'undefined') {
      return exportValue;
    }

    const defaultExport = getModuleExport(currentModule, 'default');
    if (defaultExport && (typeof defaultExport === 'object' || typeof defaultExport === 'function')) {
      queue.push(defaultExport);
    }
  }

  return expectFunction ? null : null;
};

const designTokenManifest = resolveDesignTokenExport('designTokenManifest');
if (!designTokenManifest?.themes) {
  throw new Error(
    '[Storybook][Design Tokens] Unable to load the design token manifest from "src/styles/themes".',
  );
}

const applyDesignTokenTheme = resolveDesignTokenExport('applyDesignTokenTheme', {
  expectFunction: true,
});
const clearDesignTokenTheme = resolveDesignTokenExport('clearDesignTokenTheme', {
  expectFunction: true,
});

if (!applyDesignTokenTheme || !clearDesignTokenTheme) {
  throw new Error(
    '[Storybook][Design Tokens] Failed to load the apply/clear theme helpers from "src/styles/themes".',
  );
}

const resolveDefaultThemeGetter = () => {
  const namedGetter = resolveDesignTokenExport('getDefaultDesignTokenTheme', {
    expectFunction: true,
  });
  if (namedGetter) {
    return namedGetter;
  }

  return () =>
    designTokenManifest.themes.find((theme) => theme.isDefault) ?? designTokenManifest.themes[0];
};

const logDesignTokenStatus = (slug) => {
  if (!shouldLogDesignTokenStatus()) {
    return;
  }

  const root = document.documentElement;
  const computedStyles = window.getComputedStyle(root);
  const missingVariables = SAMPLE_THEME_VARIABLES.filter((variable) => {
    const value = computedStyles.getPropertyValue(variable).trim();
    return value.length === 0;
  });

  if (missingVariables.length > 0) {
    console.warn(
      `${DESIGN_TOKEN_LOG_PREFIX} Missing CSS custom properties for the "${slug}" theme.`,
      { missingVariables },
    );
    return;
  }

  const sampleValues = SAMPLE_THEME_VARIABLES.reduce((values, variable) => {
    values[variable] = computedStyles.getPropertyValue(variable).trim();
    return values;
  }, {});

  console.info(
    `${DESIGN_TOKEN_LOG_PREFIX} Applied the "${slug}" theme with resolved variables.`,
    sampleValues,
  );
};

/**
 * Global Storybook parameters and decorators for React stories.
 */

const getDefaultDesignTokenTheme = resolveDefaultThemeGetter();
const defaultTheme = getDefaultDesignTokenTheme();

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Select the design token theme applied to stories.',
    defaultValue: defaultTheme.slug,
    toolbar: {
      icon: 'paintbrush',
      dynamicTitle: true,
      items: designTokenManifest.themes.map((theme) => ({
        value: theme.slug,
        title: theme.name,
      })),
    },
  },
};

let activeThemeSlug = null;

const applyThemeToDocument = (slug) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (activeThemeSlug && activeThemeSlug !== slug) {
    clearDesignTokenTheme(document);
    if (shouldLogDesignTokenStatus()) {
      console.info(`${DESIGN_TOKEN_LOG_PREFIX} Cleared the "${activeThemeSlug}" theme attribute.`);
    }
  }

  const theme = applyDesignTokenTheme(document, slug);
  activeThemeSlug = theme.slug;
  logDesignTokenStatus(theme.slug);
};

const ThemeProvider = ({ slug, children }) => {
  React.useEffect(() => {
    applyThemeToDocument(slug);

    return () => {
      if (!shouldLogDesignTokenStatus()) {
        return;
      }
      console.info(`${DESIGN_TOKEN_LOG_PREFIX} Story unmounted while using the "${slug}" theme.`);
    };
  }, [slug]);

  return children;
};

const withDesignTokenTheme = (Story, context) => {
  const slug = context.globals.theme ?? defaultTheme.slug;

  applyThemeToDocument(slug);

  const storyResult = Story(context.args, context);

  if (React.isValidElement(storyResult)) {
    return React.createElement(ThemeProvider, { slug }, storyResult);
  }

  return storyResult;
};

export const decorators = [withDesignTokenTheme];

/** @type { import('@storybook/react').Preview } */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  options: {
    storySort: {
      order: [
        'Docs',
        ['Welcome', '*'],
        'Components',
        'Gallery',
        '*',
      ],
    },
  },
};
