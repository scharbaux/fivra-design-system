import { describe, expect, it } from 'vitest';

import reactMeta, * as reactStories from '../Icon.stories';
import vueMeta, * as vueStories from '../../../../storybooks/vue/src/stories/Icon.stories';

type StoryMetaLike = {
  title?: string;
  id?: string;
  argTypes?: Record<string, {
    description?: string;
    options?: unknown;
    table?: { category?: string };
  }>;
};

function getStoryExportNames(moduleExports: Record<string, unknown>): string[] {
  return Object.keys(moduleExports)
    .filter((name) => name !== 'default')
    .sort();
}

describe('Icon story parity', () => {
  const react = reactMeta as StoryMetaLike;
  const vue = vueMeta as StoryMetaLike;

  it('keeps Storybook metadata aligned across React and Vue', () => {
    expect(react.title).toBe(vue.title);
    expect(react.title).toBe('Atomics/Icon');
    expect(react.id).toBe('atomics-icon-react');
    expect(vue.id).toBe('atomics-icon-vue');
  });

  it('keeps story export coverage aligned', () => {
    expect(getStoryExportNames(reactStories)).toEqual(getStoryExportNames(vueStories));
  });

  it('keeps argTypes keys and descriptions aligned', () => {
    const reactArgTypes = react.argTypes ?? {};
    const vueArgTypes = vue.argTypes ?? {};

    const reactKeys = Object.keys(reactArgTypes).sort();
    const vueKeys = Object.keys(vueArgTypes).sort();

    expect(reactKeys).toEqual(vueKeys);

    for (const key of reactKeys) {
      expect(vueArgTypes[key]?.description).toBe(reactArgTypes[key]?.description);
      expect(vueArgTypes[key]?.table?.category).toBe(reactArgTypes[key]?.table?.category);
      expect(vueArgTypes[key]?.options).toEqual(reactArgTypes[key]?.options);
    }
  });
});
