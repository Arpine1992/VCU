import { assert } from 'console';
import { Page } from "@playwright/test";
import { test } from "@playwright/test";
import { VSUBasePage } from "../pages/VSUBasePage";
import { SoftAssert } from '../../commonLibraries/utils/SoftAssert';

let vcuBasePage: VSUBasePage;
let softAssert: SoftAssert;


test.describe("@Should perform some Playwright actions", () => {

  test.beforeEach(async ({ page, context }, testInfo) => {
    softAssert = new SoftAssert(context, testInfo);
    vcuBasePage = new VSUBasePage(page);
  });


  test("aaa | C1", async () => {
    await vcuBasePage.goto();
    console.log("aaa:");
  });

  test.afterEach(async ({ page }, testInfo) => {
    await softAssert.assertAll();
  });
});

