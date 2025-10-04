import { defineConfig } from "@playwright/test";

const storybookPort = Number.parseInt(process.env.VISUAL_TEST_PORT ?? "6009", 10);
const baseURL = process.env.VISUAL_TEST_BASE_URL ?? `http://127.0.0.1:${storybookPort}`;

export default defineConfig({
  testDir: "./visual-tests",
  snapshotDir: "./visual-tests/__screenshots__",
  snapshotPathTemplate:
    "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL,
    browserName: "chromium",
    locale: "en-US",
    colorScheme: "light",
    viewport: { width: 600, height: 400 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `yarn http-server storybook-static --port ${storybookPort} --silent`,
    url: `${baseURL}/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
