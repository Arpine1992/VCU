/* eslint-disable max-len */

import { logger } from "./Logger";
import { Page, TestInfo } from "@playwright/test";
import { errors } from "playwright-core";

/**
 * Handles wrapping actions in a test, captures errors, and attaches screenshots to the test report on failure.
 *
 * @param {Page} page - The Playwright Page object representing the current web page.
 * @param {TestInfo} testInfo - Information about the test being executed.
 */
export async function wrapActions(page: Page, testInfo: TestInfo) {
  const errorStartsWithText = "Error:";

  const error_message = `Test is interrupted, as couldn't make a test action, ended up at ${page.url()}\n\n`;
  if (testInfo.status !== testInfo.expectedStatus) {
    if (!testInfo.error.stack.startsWith(errorStartsWithText)) {
      logger.info(`\nFinished '${testInfo.title}' with status '${testInfo.status}'`);
      testInfo.error.stack = error_message + testInfo.error.stack;
      try {
        const screenshot = await page.screenshot();
        await testInfo.attach(`Action error - ${testInfo.title}`, { body: screenshot, contentType: "image/png" });
      } catch (err) {
        logger.info("As the browser context is closed, it is not possible to take a screenshot.");
      }
    }
    if (testInfo.project.use.trace) {
      const outputDir = testInfo.outputDir.match(/test-results.*/g)[0];
      testInfo.error.message =
        testInfo.error.message +
        "\n" +
        "\nattachment #: trace (application/zip) -------------" +
        "\n" +
        "\nPlease see the details about test case run with the following steps: " +
        "\n 1. Download attached trace.zip file " +
        "\n 2. Run 'npx playwright show-trace <path-to trace.zip file>/trace.zip'" +
        "\n\nNote : For local runs use the following command:" +
        "\n npx playwright show-trace " +
        outputDir +
        "/trace.zip\n";
    }
  }
}

/**
 * @template T
 * @param {string} message
 * @param {Promise<T>} promise
 * @return {Promise<T>}
 */
export async function timeOutMessage<T>(message: string, promise: Promise<T>): Promise<T> {
  return promise.catch((e: { message: string }) => {
    if (e instanceof errors.TimeoutError) e.message = message + "\n\n" + e.message;
    throw e;
  });
}
