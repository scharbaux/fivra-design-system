import { expect, test, type Page } from "@playwright/test";

type StoryConfig = {
  id: string;
  name: string;
  framePrefix: "" | "/vue";
};

const typographyStories: StoryConfig[] = [
  { id: "atomics-typography-react--body-copy", name: "react-body-copy", framePrefix: "" },
  { id: "atomics-typography-react--headings", name: "react-headings", framePrefix: "" },
  { id: "atomics-typography-react--emphasis-and-links", name: "react-emphasis-and-links", framePrefix: "" },
  { id: "atomics-typography-react--truncation", name: "react-truncation", framePrefix: "" },
  { id: "atomics-typography-react--no-wrap", name: "react-no-wrap", framePrefix: "" },
  { id: "atomics-typography-vue--body-copy", name: "vue-body-copy", framePrefix: "/vue" },
  { id: "atomics-typography-vue--headings", name: "vue-headings", framePrefix: "/vue" },
  { id: "atomics-typography-vue--emphasis-and-links", name: "vue-emphasis-and-links", framePrefix: "/vue" },
  { id: "atomics-typography-vue--truncation", name: "vue-truncation", framePrefix: "/vue" },
  { id: "atomics-typography-vue--no-wrap", name: "vue-no-wrap", framePrefix: "/vue" },
];

const storyUrl = (story: StoryConfig) =>
  `${story.framePrefix}/iframe.html?id=${story.id}&globals=backgrounds.grid:false&viewMode=story`;

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

test.describe("Typography visual regressions", () => {
  const screenshotOptions = {
    animations: "disabled" as const,
    caret: "hide" as const,
    scale: "css" as const,
    maxDiffPixelRatio: 0.02,
  };

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 540 });
  });

  for (const story of typographyStories) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await loadStory(page, story);
      const canvas = page.locator("#storybook-root");
      await expect(canvas).toHaveScreenshot(`${story.name}.png`, screenshotOptions);
    });
  }
});
