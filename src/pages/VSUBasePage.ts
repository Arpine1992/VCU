import { BrowserContext, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class VSUBasePage extends BasePage {

  constructor(page: Page, context?: BrowserContext) {
    super(page, context);
    this.url = "https://vsu.am/";
  }

    /**
   * Open Festivals page with direct url
   * @returns
   */
    async goto() {
      await this._page.goto(this.url);
      await this.waitForUrl();
      return this;
    }
}
