/* eslint-disable quotes */
import type { PlaywrightTestConfig } from "@playwright/test";
import { defineConfig } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./src/tests",

  /* Maximum time one test can run for. */
  timeout: 100 * 2000,

  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 80000,
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  reporter: [["line"], ["allure-playwright"]],

  use: {
    actionTimeout: 80000,
    navigationTimeout: 80000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",

    contextOptions: {
      ignoreHTTPSErrors: true,
    },
    viewport: { width: 1980, height: 1020 },
  },
  globalTimeout: 60 * 60 * 1000,
  outputDir: "test-results/",
  ...defineConfig({
    fullyParallel: true,
  }),
};
export default config;
