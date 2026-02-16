import { expect, test, type Page } from '@playwright/test';

type StoryConfig = {
  id: string;
  name: string;
  framePrefix: '' | '/vue';
};

const iconStories: StoryConfig[] = [
  { id: 'atomics-icon-react--basic', name: 'react-outline', framePrefix: '' },
  { id: 'atomics-icon-react--solid', name: 'react-solid', framePrefix: '' },
  { id: 'atomics-icon-react--sizes', name: 'react-sizes', framePrefix: '' },
  { id: 'atomics-icon-react--colors', name: 'react-colors', framePrefix: '' },
  { id: 'atomics-icon-vue--basic', name: 'vue-outline', framePrefix: '/vue' },
  { id: 'atomics-icon-vue--solid', name: 'vue-solid', framePrefix: '/vue' },
  { id: 'atomics-icon-vue--sizes', name: 'vue-sizes', framePrefix: '/vue' },
  { id: 'atomics-icon-vue--colors', name: 'vue-colors', framePrefix: '/vue' },
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

test.describe('Icon visual regressions', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 560 });
  });

  for (const story of iconStories) {
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
