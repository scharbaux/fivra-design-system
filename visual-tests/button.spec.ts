import { expect, test, type Page } from "@playwright/test";

type StoryConfig = {
  id: string;
  name: string;
};

const buttonStories: StoryConfig[] = [
  { id: "components-button-react--primary", name: "primary" },
  { id: "components-button-react--secondary", name: "secondary" },
  { id: "components-button-react--tertiary", name: "tertiary" },
  { id: "components-button-react--with-icons", name: "with-icons" },
  { id: "components-button-react--dropdown", name: "dropdown" },
  { id: "components-button-react--loading", name: "loading" },
  { id: "components-button-react--icon-only", name: "icon-only" },
];

const storyUrl = (id: string) => `/iframe.html?id=${id}&globals=backgrounds.grid:false&viewMode=story`;

async function loadStory(page: Page, storyId: string) {
  await page.goto(storyUrl(storyId), { waitUntil: "networkidle" });
  await page.waitForSelector("#storybook-root");
  await page.evaluate(() => {
    document.body.style.margin = "0";
    document.documentElement.style.setProperty("color-scheme", "light");
  });
}

test.describe("Button visual regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 320 });
  });

  for (const story of buttonStories) {
    test(`${story.name} matches baseline`, async ({ page }) => {
      await loadStory(page, story.id);

      const canvas = page.locator("#storybook-root");
      await expect(canvas).toHaveScreenshot(`${story.name}.png`, {
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    });
  }
});
