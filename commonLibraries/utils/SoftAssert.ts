/* eslint-disable max-len */
import { BrowserContext, expect, Page } from "@playwright/test";
import { errorMessages } from "../ErrorMessages";
import { Element } from "./Element";
import * as util from "util";
import { TestInfo } from "@playwright/test";
import { TestRailClient } from "../services/TestRailClient";

/**
 * A utility class for performing soft assertions and adding error messages and screenshots to failed test cases.
 *
 * @class SoftAssert
 */
export class SoftAssert {
  testRailClient = new TestRailClient();
  errorMessage: string[];
  isAssertAllCalled: boolean;
  context: BrowserContext;
  readonly testInfo: TestInfo;

  constructor(context: BrowserContext, testInfo: TestInfo) {
    this.errorMessage = [];
    this.isAssertAllCalled = false;
    this.testInfo = testInfo;
    this.context = context;
  }

  /**
   *
   * @param {*} isHard checks if isHard is true, assertAll is called
   */
  async checkIsHard(isHard: boolean) {
    if (isHard) {
      this.assertAll();
    }
  }

  /**
   * Adds a full-page screenshot to the test when a test case fails.
   */
  async addScreenshot() {
    const pages = this.context.pages();
    if (pages.length > 0) {
      const lastPage = pages[pages.length - 1];
      if (lastPage) {
        const screenshot = await lastPage.screenshot({ fullPage: true });
        await this.testInfo.attach(`screenshot-${this.errorMessage.length}`, {
          body: screenshot,
          contentType: "image/png",
        });
      }
    }
  }

  /**
   * Adds an error message and captures a full-page screenshot when a test case fails.
   * @param errorMessage - The error message to be added.
   * @param isHard - Indicates whether the error is a hard failure.
   * @param ex - The error object.
   */
  async addErrorMessage(errorMessage: string, isHard: boolean, ex: Error) {
    const screenNumber = this.errorMessage.length + 1;
    this.errorMessage.push(
      `${errorMessage} \nRELATED-SCREENSHOT: screenshot-${screenNumber}\n \n${ex.message}\n---------------------------------------------------`
    );
    await this.addScreenshot();
    await this.checkIsHard(isHard);
  }

  /**
   * Checks if the actual locator is checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertChecked(actual: Element, errorMessage: string = errorMessages.UNABLE_UNCHECK_MARKS, isHard = false) {
    try {
      await expect(actual.locator).toBeChecked();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotChecked(actual: Element, errorMessage: string = errorMessages.UNABLE_CHECK_MARKS, isHard = false) {
    try {
      await expect(actual.locator).not.toBeChecked();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertDisabled(actual: Element, errorMessage: string = errorMessages.NOT_DISABLED, isHard = false) {
    try {
      await expect(actual.locator).toBeDisabled();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotDisabled(actual: Element, errorMessage: string = errorMessages.IS_DISABLED, isHard = false) {
    try {
      await expect(actual.locator).not.toBeDisabled();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertEditable(actual: Element, errorMessage: string = errorMessages.NOT_EDITABLE, isHard = false) {
    try {
      await expect(actual.locator).toBeEditable();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotEditable(actual: Element, errorMessage: string = errorMessages.IS_EDITABLE, isHard = false) {
    try {
      await expect(actual.locator).not.toBeEditable();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertEmpty(actual: Element, errorMessage: string = errorMessages.NOT_EMPTY, isHard = false) {
    try {
      await expect(actual.locator).toBeEmpty();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not checked
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotEmpty(actual: Element, errorMessage: string = errorMessages.IS_EMPTY, isHard = false) {
    try {
      await expect(actual.locator).not.toBeEmpty();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /*
   * Checks if the actual locator enable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertEnabled(actual: Element, errorMessage: string = errorMessages.NOT_ENABLED, isHard = false) {
    try {
      await expect(actual.locator).toBeEnabled();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator not enable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotEnabled(actual: Element, errorMessage: string = errorMessages.IS_ENABLED, isHard = false) {
    try {
      await expect(actual.locator).not.toBeEnabled();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is disable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertFocused(actual: Element, errorMessage: string = errorMessages.NOT_FOCUSED, isHard = false) {
    try {
      await expect(actual.locator).toBeFocused();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not disable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotFocused(actual: Element, errorMessage: string = errorMessages.IS_FOCUSED, isHard = false) {
    try {
      await expect(actual.locator).not.toBeFocused();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is disable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHidden(actual: Element, errorMessage: string = errorMessages.NOT_HIDDEN, isHard = false) {
    try {
      await expect(actual.locator).toBeHidden();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not disable
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotHidden(actual: Element, errorMessage: string = errorMessages.IS_HIDDEN, isHard = false) {
    try {
      await expect(actual.locator).not.toBeHidden();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator is visible
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertVisible(
    actual: Element,
    isHard = false,
    errorMessage: string = errorMessages.NOT_VISIBLE,
    timeout = 20000
  ) {
    try {
      await expect(actual.locator).toBeVisible({ timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator is not visible
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertNotVisible(
    actual: Element,
    errorMessage: string = errorMessages.IS_VISIBLE,
    timeout = 20000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toBeVisible({ timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have the text
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected Array of the expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertContainText(
    actual: Element,
    expected: string | RegExp | (string | RegExp)[],
    errorMessage: string = errorMessages.INCORRECT_TEXT,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toContainText(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have the text
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected Array of the expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertNotContainText(
    actual: Element,
    expected: string | RegExp | (string | RegExp)[],
    errorMessage: string = errorMessages.INCORRECT_TEXT,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toContainText(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator has the given attribute
   *
   * @param {*} actual The actual data to validated
   * @param {*} attributeType The actual locator attribute type
   * @param {*} attributeValue The actual locator attribute value
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveAttribute(
    actual: Element,
    attributeType: string,
    attributeValue: string,
    errorMessage: string = errorMessages.WRONG_ATTRIBUTE_VALUE,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveAttribute(attributeType, attributeValue);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, attributeType), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator has not the given attribute
   *
   * @param {*} actual The actual data to validated
   * @param {*} attributeType The actual locator attribute type
   * @param {*} attributeValue The actual locator attribute value
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveNotAttribute(
    actual: Element,
    attributeType: string,
    attributeValue: string,
    errorMessage: string = errorMessages.WRONG_ATTRIBUTE_VALUE,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveAttribute(attributeType, attributeValue);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, attributeType), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator has the given class
   *
   * @param {*} actual The actual data to validated
   * @param {*} className The actual locator class name
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveClass(
    actual: Element,
    className: string | RegExp,
    errorMessage: string = errorMessages.WRONG_CLASS_NAME,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveClass(className);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, className), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator has not the given class
   *
   * @param {*} actual The actual data to validated
   * @param {*} className The actual locator class name
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveNotClass(
    actual: Element,
    className: string,
    errorMessage: string = errorMessages.WRONG_CLASS_NAME,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveClass(className);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, className), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertElementExist(actual: Element, errorMessage: string = errorMessages.IS_MISSING, isHard = false) {
    try {
      await expect(actual.locator).toHaveCount(1);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is not exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertElementNotExist(actual: Element, errorMessage: string = errorMessages.EXISTS, isHard = false) {
    try {
      await expect(actual.locator).not.toHaveCount(1);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveCSS(
    actual: Element,
    cssName: string,
    value: string | RegExp = errorMessages.IS_VISIBLE,
    errorMessage: string = errorMessages.WRONG_CSS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveCSS(cssName, value);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, cssName), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotHaveCSS(
    actual: Element,
    cssName: string,
    value: string | RegExp = errorMessages.IS_VISIBLE,
    errorMessage: string = errorMessages.WRONG_CSS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveCSS(cssName, value);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, cssName), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveId(
    actual: Element,
    id: string | RegExp,
    errorMessage: string = errorMessages.IS_VISIBLE,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveId(id);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, id), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveJSProperty(
    actual: Element,
    name: string,
    value: object,
    errorMessage: string = errorMessages.EXISTS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveJSProperty(name, value);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, name), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotHaveJSProperty(
    actual: Element,
    name: string,
    value: object,
    errorMessage: string = errorMessages.EXISTS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveJSProperty(name, value);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, name), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertHaveScreenShot(
    actual: Element,
    name: string | Array<string>,
    options: object,
    errorMessage: string = errorMessages.EXISTS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveScreenshot(name, options);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, name), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator is exist
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotHaveScreenShot(
    actual: Element,
    name: string | Array<string>,
    options: object,
    errorMessage: string = errorMessages.EXISTS,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveScreenshot(name, options);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description, name), isHard, ex);
    }
  }

  /**
   * Checks actual locator have the text
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveText(
    actual: Element,
    expected: string | RegExp | (string | RegExp)[],
    errorMessage: string = errorMessages.INCORRECT_TEXT,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveText(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the text
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveNotText(
    actual: Element,
    expected: string | RegExp,
    errorMessage: string = errorMessages.INCORRECT_TEXT,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveText(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveValue(
    actual: Element,
    expected: string | RegExp,
    errorMessage: string = errorMessages.INCORRECT_VALUE,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveValue(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveNotValue(
    actual: Element,
    expected: string | RegExp,
    errorMessage: string = errorMessages.INCORRECT_VALUE,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveValue(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveValues(
    actual: Element,
    expected: Array<string | RegExp>,
    errorMessage: string = errorMessages.INCORRECT_VALUE,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).toHaveValues(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertHaveNotValues(
    actual: Element,
    expected: Array<string | RegExp>,
    errorMessage: string = errorMessages.INCORRECT_VALUE,
    timeout = 3000,
    isHard = false
  ) {
    try {
      await expect(actual.locator).not.toHaveValues(expected, { timeout: timeout });
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.description), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertPageHaveScreenShot(
    actual: Page,
    name: string | Array<string>,
    options: object = {},
    errorMessage: string = errorMessages.MISSING_SCREEN_SHOT,
    isHard = false
  ) {
    try {
      await expect(actual).toHaveScreenshot(name, options);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, name), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertPageHaveTitle(
    actual: Page,
    title: string | RegExp,
    options: object = {},
    errorMessage: string = errorMessages.WRONG_PAGE_TITLE,
    isHard = false
  ) {
    try {
      await expect(actual).toHaveTitle(title, options);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, title), isHard, ex);
    }
  }

  /**
   * Checks actual locator have not the value
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} timeout Timeout to wait until the expectation happens | Default is 10000 ms
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertPageNotHaveTitle(
    actual: Page,
    title: string | RegExp,
    options: object = {},
    errorMessage: string = errorMessages.WRONG_PAGE_TITLE,
    isHard = false
  ) {
    try {
      await expect(actual).not.toHaveTitle(title, options);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, title), isHard, ex);
    }
  }

  /**
   * Checks if the current page has the expected url
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} url The current page url
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertPageHaveUrl(
    actual: Page,
    url: string,
    errorMessage: string = errorMessages.WRONG_PAGE_URL,
    isHard = false
  ) {
    try {
      await expect(actual).toHaveURL(url);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, url), isHard, ex);
    }
  }

  /**
   * Checks if the current page has not the expected url
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} url The current page url
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async asserPagetHaveNotUrl(
    actual: Page,
    url: string,
    errorMessage: string = errorMessages.WRONG_PAGE_URL,
    isHard = false
  ) {
    try {
      await expect(actual).not.toHaveURL(url);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, url), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator attribute value corresponds the expected value
   *
   * @param {*} actual The actual data to validated
   * @param {*} attributeType The actual locator attribute type
   * @param {*} expectedValue The expected value
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertCompareAttributeValue(
    actualValue: Element,
    attributeType: string,
    expectedValue: string,
    errorMessage: string = errorMessages.WRONG_ATTRIBUTE_VALUE,
    isHard = false
  ) {
    try {
      const attribute = await actualValue.locator.getAttribute(attributeType);
      expect(attribute).toEqual(expectedValue);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actualValue.description, attributeType), isHard, ex);
    }
  }

  /**
   * Checks if the actual locator attribute value contains the expected value
   *
   * @param {*} actual The actual data to validated
   * @param {*} attributeType The actual locator attribute type
   * @param {*} expectedValue The expected value
   * @param {*} errorMessage Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertContainAttributeValue(
    actualValue: Element,
    attributeType: string,
    expectedValue: string,
    errorMessage: string = errorMessages.NOT_CONTAIN_ATTRIBUTE_VALUE,
    isHard = false
  ) {
    try {
      const attribute = await actualValue.locator.getAttribute(attributeType);
      expect(attribute).toContain(expectedValue);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actualValue.description, attributeType), isHard, ex);
    }
  }

  /**
 * Checks if the actual data contain the expected one
 
 * @param {*} actual  The actual results to be validated against expected
 * @param {*} expected The expected results to make the assertion against it
 * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
 * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
 *  stopped and no more validation happens | Default is false
 */
  async assertContain<T>(actual: string, expected: T, errorMessage: string = errorMessages.MISSING_ITEM, isHard = false) {
    try {
      expect(actual).toContain(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the actual data doesn't contain the expected one
   * @param {*} actual The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotContains<T>(
    actual: string,
    expected: T,
    errorMessage: string = errorMessages.REDUNDANT_ITEM,
    isHard = false
  ) {
    try {
      expect(actual).not.toContain(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks the equality of 2 objects
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertToEqual<T>(actual: string, expected: T, errorMessage: string = errorMessages.NOT_EQUAL, isHard = false) {
    try {
      expect(actual).toEqual(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks non equality of 2 objects
   *
   * @param {*} actual  The actual results to be validated against expected
   * @param {*} expected The expected results to make the assertion against it
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertNotEqual<T>(actual: string, expected: T, errorMessage: string = errorMessages.EQUAL, isHard = false) {
    try {
      expect(actual).not.toEqual(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the actual value is greater than expected one
   *
   * @param {*} actual The actual results to be greater than actual
   * @param {*} expected The expected results to be less than actual
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertGreaterThan(
    actual: number,
    expected: number,
    errorMessage: string = errorMessages.GREATER_THAN,
    isHard = false
  ) {
    try {
      expect(actual).toBeGreaterThan(expected);
    } catch (ex) {
      await this.addErrorMessage(errorMessage, isHard, ex);
    }
  }

  /**
   * Checks if the actual value is greater or equal than expected one
   *
   * @param {*} actual The actual results to be greater or equal than actual
   * @param {*} expected The expected results to be less than actual
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertGreaterThanOrEqualTo(
    actual: number,
    expected: number,
    errorMessage: string = errorMessages.GREATER_THAN_OR_EQUAL,
    isHard = false
  ) {
    try {
      expect(actual).toBeGreaterThanOrEqual(expected);
    } catch (ex) {
      await this.addErrorMessage(errorMessage, isHard, ex);
    }
  }

  /**
   * Checks if the actual value is less than expected one
   *
   * @param {*} actual The actual results to be less than actual
   * @param {*} expected The expected results to be greater than actual
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertLessThan(
    actual: number,
    expected: number,
    errorMessage: string = errorMessages.LESS_THAN,
    isHard = false
  ) {
    try {
      expect(actual).toBeLessThan(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the actual value is less or equal than expected one
   *
   * @param {*} actual The actual results to be less or equal than actual
   * @param {*} expected The expected results to be greater than actual
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertLessThanOrEqualTo(
    actual: number,
    expected: number,
    errorMessage: string = errorMessages.LESS_THAN_OR_EQUAL,
    isHard = false
  ) {
    try {
      expect(actual).toBeLessThanOrEqual(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the actual data matches the regex
   *
   * @param {*} actual The actual data to validated
   * @param {*} re the expected regular expression the actual data should match
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertMatch(actual: string, expected: RegExp, errorMessage: string = errorMessages.NOT_MATCH, isHard = false) {
    try {
      expect(actual).toMatch(expected);
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actual.toString(), expected.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the expected action is satisfied
   *
   * @param {*} actualAction The actions to be checked
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertOk(actualAction: unknown, errorMessage: string = errorMessages.TO_BE_TRUTHY, isHard = false) {
    try {
      expect(actualAction).toBeTruthy();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actualAction.toString()), isHard, ex);
    }
  }

  /**
   * Checks that the action is not ok
   *
   * @param {*} actualAction The actions to be checked
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   *  stopped and no more validation happens | Default is false
   */
  async assertNotOk(actualAction: unknown, errorMessage: string = errorMessages.NOT_BE_TRUTHY, isHard = false) {
    try {
      expect(actualAction).not.toBeTruthy();
    } catch (ex) {
      await this.addErrorMessage(util.format(errorMessage, actualAction.toString()), isHard, ex);
    }
  }

  /**
   * Checks if the actual data is null
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNull(actual: unknown, errorMessage: string = errorMessages.EQUAL, isHard = false) {
    try {
      expect(actual).toBeNull();
    } catch (ex) {
      await this.addErrorMessage(errorMessage, isHard, ex);
    }
  }

  /**
   * Checks if the actual data is not null
   *
   * @param {*} actual The actual data to validated
   * @param {*} errorMessage  Error message if the assertion fails | Default is empty string
   * @param {*} isHard If it is provided as true and the assertion is failed, the test is hard
   * stopped and no more validation happens | Default is false
   */
  async assertNotNull(actual: unknown, errorMessage: string = errorMessages.EQUAL, isHard = false) {
    try {
      expect(actual).not.toBeNull();
    } catch (ex) {
      await this.addErrorMessage(errorMessage, isHard, ex);
    }
  }

 
  /**
   * Asserts all current collected failures and stops the test case next steps execution
   * @param defectId {string} The Jira URL for the test case failure (optional)
   */
  async assertAll(defectId?: string) {
    const errorM = this.errorMessage.length;
    let testRailMessage = "";
    for (let i = 0; i < errorM; i++) {
      const number = i + 1;
      this.errorMessage[i] = `ASSERTION ERROR N-${number} : ${this.errorMessage[i]}\n`;
    }
    try {
      expect(this.errorMessage.length).toEqual(0);
    } catch (ex) {
      this.testInfo.status = "failed";
      testRailMessage = this.errorMessage.length > 0 ? "THE TEST CASE IS FAILED:\n" + this.errorMessage.join("\n") : ex;
      throw new Error(testRailMessage);
    } finally {
      await this.testRailClient.addResultForCase(this.testInfo, testRailMessage, defectId);
    }
  }
}
