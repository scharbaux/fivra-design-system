import { expect, test, type Page } from '@playwright/test';

type StoryConfig = {
  id: string;
  name: string;
  framePrefix: '' | '/vue';
};

const boxStories: StoryConfig[] = [
  { id: 'atomics-box-react--padding-and-margin-tokens', name: 'react-padding-and-margin-tokens', framePrefix: '' },
  { id: 'atomics-box-react--flex-alignment', name: 'react-flex-alignment', framePrefix: '' },
  { id: 'atomics-box-react--background-utilities', name: 'react-background-utilities', framePrefix: '' },
  { id: 'atomics-box-react--nested-composition', name: 'react-nested-composition', framePrefix: '' },
  { id: 'atomics-box-vue--padding-and-margin-tokens', name: 'vue-padding-and-margin-tokens', framePrefix: '/vue' },
  { id: 'atomics-box-vue--flex-alignment', name: 'vue-flex-alignment', framePrefix: '/vue' },
  { id: 'atomics-box-vue--background-utilities', name: 'vue-background-utilities', framePrefix: '/vue' },
  { id: 'atomics-box-vue--nested-composition', name: 'vue-nested-composition', framePrefix: '/vue' },
];

const storyUrl = (story: StoryConfig) =>
  `${story.framePrefix}/iframe.html?id=${story.id}&globals=backgrounds.grid:false&viewMode=story`;

async function loadStory(page: Page, story: StoryConfig) {
  await page.goto(storyUrl(story), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#storybook-root:not([hidden])');
  await page.evaluate(() => {
    document.body.style.margin = '0';
    document.documentElement.style.setProperty('color-scheme', 'light');
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

test.describe('Box visual regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 760 });
  });

  for (const story of boxStories) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await loadStory(page, story);
      const canvas = page.locator('#storybook-root');
      await expect(canvas).toHaveScreenshot(`${story.name}.png`, {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      });
    });
  }
});
