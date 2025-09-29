import React, { useEffect } from 'react';
import '../src/styles/index.css';
import {
  applyDesignTokenTheme,
  clearDesignTokenTheme,
  designTokenManifest,
  getDefaultDesignTokenTheme,
} from '../src/styles/themes';

/**
 * Global Storybook parameters and decorators for React stories.
 */

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

const ThemeProvider = ({ slug, children }) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    applyDesignTokenTheme(document, slug);

    return () => {
      if (typeof document === 'undefined') {
        return;
      }

      clearDesignTokenTheme(document);
    };
  }, [slug]);

  return children;
};

const withDesignTokenTheme = (Story, context) => {
  const slug = context.globals.theme ?? defaultTheme.slug;

  return React.createElement(
    ThemeProvider,
    { slug },
    React.createElement(Story),
  );
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
