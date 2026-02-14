import { expect, test, type Page } from "@playwright/test";

type StoryConfig = {
  id: string;
  name: string;
};

const buttonStories: StoryConfig[] = [
  { id: "atomics-button-react--primary", name: "primary" },
  { id: "atomics-button-react--secondary", name: "secondary" },
  { id: "atomics-button-react--tertiary", name: "tertiary" },
  { id: "atomics-button-react--with-icons", name: "with-icons" },
  { id: "atomics-button-react--dropdown", name: "dropdown" },
  { id: "atomics-button-react--loading", name: "loading" },
  { id: "atomics-button-react--icon-only", name: "icon-only" },
];

const storyUrl = (story: StoryConfig) => {
  return `/iframe.html?id=${story.id}&globals=backgrounds.grid:false&viewMode=story`;
};

async function loadStory(page: Page, story: StoryConfig) {
  await page.goto(storyUrl(story), { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#storybook-root:not([hidden])");
  await page.evaluate(() => {
    document.body.style.margin = "0";
    document.documentElement.style.setProperty("color-scheme", "light");
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

test.describe("Button visual regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 320 });
  });

  for (const story of buttonStories) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await loadStory(page, story);
      const canvas = page.locator("#storybook-root");
      await expect(canvas).toHaveScreenshot(`${story.name}.png`, {
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    });
  }
});
