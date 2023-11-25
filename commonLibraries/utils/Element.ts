import { Locator } from "@playwright/test";
import { timeOutMessage } from "./WrapActions";
import { errorMessages } from "../ErrorMessages";

/**
 * Represents an element on a web page and provides various methods for interacting with it.
 *
 * @class Element
 */
export class Element {
  private _description: string;
  private _locator: Locator;

  /**
   * Get the description of the element.
   * @return {string} The description of the element.
   */
  public get description(): string {
    return this._description;
  }

  /**
   * Get the Playwright Locator associated with this element.
   * @return {Locator} The Playwright Locator for the element.
   */
  public get locator(): Locator {
    return this._locator;
  }

  /**
   * Creates an instance of the Element class.
   * @param {string} description - A human-readable description of the element.
   * @param {Locator} locator - The Playwright Locator that identifies the element on the web page.
   */
  constructor(description: string, locator: Locator) {
    this._description = description;
    this._locator = locator;
  }

  // Methods for interacting with the element with error handling and timeouts.
  async click(options?: object): Promise<void> {
    await timeOutMessage(errorMessages.COULD_NOT_CLICK.replace("%s", this._description), this._locator.click(options));
  }

  async fill(value: string, options?: object): Promise<void> {
    await timeOutMessage(
      errorMessages.COULD_NOT_FILL.replace("%s", this._description),
      this._locator.fill(value, options)
    );
  }

  async waitFor(options?: object): Promise<void> {
    await timeOutMessage(errorMessages.NOT_VISIBLE.replace("%s", this._description), this._locator.waitFor(options));
  }

  async hover(options?: object): Promise<void> {
    await timeOutMessage(errorMessages.COULD_NOT_HOVER.replace("%s", this._description), this._locator.hover(options));
  }

  async innerText(options?: object): Promise<string> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_GET_TEXT.replace("%s", this._description),
      this._locator.innerText(options)
    );
  }

  async setInputFiles(files: string | Array<string>): Promise<void> {
    await timeOutMessage(
      errorMessages.COULD_NOT_UPLOAD_FILE.replace("%s", this._description),
      this._locator.setInputFiles(files)
    );
  }

  async selectOption(
    values:
      | null
      | string
      | Array<string>
      | {
          value?: string;
          label?: string;
          index?: number;
        }
      | Array<{
          value?: string;
          label?: string;
          index?: number;
        }>,
    options?: object
  ): Promise<Array<string>> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_SELECT_OPTION.replace("%s", this._description),
      this._locator.selectOption(values, options)
    );
  }

  async count(): Promise<number> {
    return await timeOutMessage(errorMessages.COULD_NOT_COUNT.replace("%s", this._description), this._locator.count());
  }

  nth(index: number): Locator {
    return this._locator.nth(index);
  }

  async getAttribute(name: string, options?: object): Promise<null | string> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_GET_ATTRIBUTE.replace("%s", this._description),
      this._locator.getAttribute(name, options)
    );
  }

  async textContent(options?: object): Promise<null | string> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_GET_CONTENT.replace("%s", this._description),
      this._locator.textContent(options)
    );
  }

  async inputValue(options?: object): Promise<string> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_INPUT_VALUE.replace("%s", this._description),
      this._locator.inputValue(options)
    );
  }

  async scrollIntoViewIfNeeded(options?: object): Promise<void> {
    await timeOutMessage(
      errorMessages.NOT_VISIBLE.replace("%s", this._description),
      this._locator.scrollIntoViewIfNeeded(options)
    );
  }

  async getBoundingBox(options?: object): Promise<null | { x: number; y: number; width: number; height: number }> {
    return await timeOutMessage(
      errorMessages.COULD_NOT_FIND_BOUNDING_INFORMATION.replace("%s", this._description),
      this._locator.boundingBox(options)
    );
  }

  async isVisible(options?: object): Promise<boolean> {
    try {
      await this._locator.waitFor(options);
      return true;
    } catch (ex) {
      return false;
    }
  }
}
