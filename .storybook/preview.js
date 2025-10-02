import React from 'react';
import '../src/styles/index.css';
import * as designTokenModule from '../src/styles/themes';

const DESIGN_TOKEN_LOG_PREFIX = '[Storybook][Design Tokens]';
const SAMPLE_THEME_VARIABLES = [
  '--radiusMax',
  '--spacingS',
  '--backgroundPrimaryInteractive',
];

const shouldLogDesignTokenStatus = () =>
  typeof window !== 'undefined' && (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production');

const logDesignTokenDebug = (message, details) => {
  if (!shouldLogDesignTokenStatus()) {
    return;
  }

  if (typeof details === 'undefined') {
    console.info(`${DESIGN_TOKEN_LOG_PREFIX} ${message}`);
    return;
  }

  console.info(`${DESIGN_TOKEN_LOG_PREFIX} ${message}`, details);
};

const describeExportValue = (value) => {
  if (value === undefined) {
    return { type: 'undefined' };
  }

  if (value === null) {
    return { type: 'null' };
  }

  if (typeof value === 'function') {
    return { type: 'function', name: value.name || '(anonymous)' };
  }

  if (Array.isArray(value)) {
    return { type: 'array', length: value.length };
  }

  if (typeof value === 'object') {
    try {
      return { type: 'object', keys: Object.keys(value) };
    } catch (error) {
      return { type: 'object', keys: [], error: error instanceof Error ? error.message : String(error) };
    }
  }

  return { type: typeof value, value };
};

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

const describeModuleCandidates = (candidates) =>
  candidates.map((candidate) => {
    const summary = describeExportValue(candidate);
    if (summary.type === 'object') {
      summary.keys = summary.keys?.slice(0, 10);
    }
    return summary;
  });

const resolveDesignTokenExport = (
  exportName,
  {
    expectFunction = false,
    coerceValue,
  } = {},
) => {
  const queue = [designTokenModule];
  const visited = new Set();

  while (queue.length > 0) {
    const currentModule = queue.shift();
    if (!currentModule || visited.has(currentModule)) {
      continue;
    }

    visited.add(currentModule);

    let exportValue = getModuleExport(currentModule, exportName);
    if (typeof coerceValue === 'function') {
      try {
        const coercedValue = coerceValue(exportValue);
        if (typeof coercedValue !== 'undefined') {
          exportValue = coercedValue;
        }
      } catch (error) {
        logDesignTokenDebug(
          `Coercion failed while resolving "${exportName}".`,
          {
            error: error instanceof Error ? error.message : String(error),
            original: describeExportValue(exportValue),
          },
        );
      }
    }

    if (expectFunction) {
      if (typeof exportValue === 'function') {
        logDesignTokenDebug(`Resolved "${exportName}" as a callable export.`, describeExportValue(exportValue));
        return exportValue;
      }
    } else if (typeof exportValue !== 'undefined' && exportValue !== null) {
      logDesignTokenDebug(`Resolved "${exportName}" export.`, describeExportValue(exportValue));
      return exportValue;
    }

    const defaultExport = getModuleExport(currentModule, 'default');
    if (defaultExport && (typeof defaultExport === 'object' || typeof defaultExport === 'function')) {
      logDesignTokenDebug(
        `Queued default export while searching for "${exportName}".`,
        describeExportValue(defaultExport),
      );
      queue.push(defaultExport);
    }

    if (typeof currentModule === 'object' && currentModule !== null) {
      const nestedCandidates = [];

      if ('module' in currentModule && typeof currentModule.module === 'object') {
        nestedCandidates.push(currentModule.module);
      }

      if ('exports' in currentModule && typeof currentModule.exports === 'object') {
        nestedCandidates.push(currentModule.exports);
      }

      for (const candidate of nestedCandidates) {
        if (candidate && (typeof candidate === 'object' || typeof candidate === 'function')) {
          logDesignTokenDebug(
            `Queued CommonJS interop candidate while searching for "${exportName}".`,
            describeExportValue(candidate),
          );
          queue.push(candidate);
        }
      }
    }
  }

  logDesignTokenDebug(
    `Exhausted module candidates without resolving "${exportName}".`,
    describeModuleCandidates([...visited]),
  );

  return expectFunction ? null : null;
};

const coerceDesignTokenManifest = (value) => {
  if (value && typeof value === 'object' && 'themes' in value) {
    return value;
  }

  if (typeof value === 'function') {
    try {
      const result = value();
      if (result && typeof result === 'object' && 'themes' in result) {
        logDesignTokenDebug('Invoked manifest factory function while resolving design tokens.', {
          factory: describeExportValue(value),
          result: describeExportValue(result),
        });
        return result;
      }
    } catch (error) {
      logDesignTokenDebug('Manifest factory invocation failed.', {
        error: error instanceof Error ? error.message : String(error),
        factory: describeExportValue(value),
      });
      return undefined;
    }
  }

  if (value && typeof value === 'object' && typeof value.then === 'function') {
    logDesignTokenDebug('Encountered an async manifest export. Storybook requires synchronous manifest resolution.', {
      promiseKeys: describeExportValue(value),
    });
  }

  return undefined;
};

const designTokenManifest = resolveDesignTokenExport('designTokenManifest', {
  coerceValue: coerceDesignTokenManifest,
});
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

logDesignTokenDebug('Design token manifest resolution summary.', {
  themes: Array.isArray(designTokenManifest.themes)
    ? designTokenManifest.themes.map((theme) => ({ slug: theme.slug, isDefault: Boolean(theme.isDefault) }))
    : null,
  applyDesignTokenTheme: describeExportValue(applyDesignTokenTheme),
  clearDesignTokenTheme: describeExportValue(clearDesignTokenTheme),
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
