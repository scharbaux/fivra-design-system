import { expect, test } from "@playwright/test";

type AngularStory = {
  id: string;
  name: string;
};

const angularStories: AngularStory[] = [
  { id: "atomics-button-angular--dropdown", name: "dropdown" },
  { id: "atomics-button-angular--loading", name: "loading" },
];

const storyUrl = (story: AngularStory) =>
  `/angular/iframe.html?id=${story.id}&globals=backgrounds.grid:false&viewMode=story`;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

test.describe("Angular Button Storybook health", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 320 });
  });

  for (const story of angularStories) {
    test(`${story.name} renders and stays responsive`, async ({ page }) => {
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];

      page.on("pageerror", (error) => {
        pageErrors.push(error.message);
      });

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(storyUrl(story), { waitUntil: "domcontentloaded" });
      await sleep(750);

      expect(pageErrors, `Unexpected page errors in Angular story \"${story.name}\"`).toEqual([]);
      expect(consoleErrors, `Unexpected console errors in Angular story \"${story.name}\"`).toEqual([]);
    });
  }
});
