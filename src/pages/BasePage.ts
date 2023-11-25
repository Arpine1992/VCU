import { BrowserContext, Page } from "@playwright/test";

/**
 * Base Page Object Model
 */
export abstract class BasePage {
  readonly _page: Page;
  protected readonly _context: BrowserContext;
  protected DEFAULT_TIMEOUT = 60000;
  protected url: string;
  protected host: string;

  constructor(page: Page, context?: BrowserContext) {
    this._page = page;
    this._context = context;
  }

  /**
   * Waits for page URL
   */
  async waitForUrl() {
    await this._page.waitForURL(`**${this.url}**`);
    return this;
  }

  /**
   * Get the page specific url
   * @returns Returns the page specific url
   */
  getUrl(): string {
    return this.url;
  }

  /**
   * Waits for page/modal load based on provided element visibility
   * @param selector
   * @returns
   */
  async waitForPageLoad(selector: string) {
    await this._page.waitForSelector(selector);
    return this;
  }

  /**
   * Get the current page context
   * @returns  current page context : Page
   */
  getPageContext(): Page {
    return this._page;
  }
}
