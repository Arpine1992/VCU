import * as fs from "fs";
import ImpossibleContinueTestingError from "../exceptions/ImpossibleContinueTestingError";

/**
 * Read json file from given path
 * @param filePath
 * @returns
 */
export function readJsonFileSync(filePath: string): object {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new ImpossibleContinueTestingError(
      `Could not read json file with given path, please check file existence and it's content: \n${error.message}`
    );
  }
}

/**
 * Gets test Id from running test
 * @param testInfo
 */
export function getTestId(testInfo: { title: string }) {
  // Getting TestId from test title
  return testInfo.title.match(/\w?\d+$/g)[0];
}

/**
 * Decode encoded text
 * @param encodedText
 * @returns decoded text
 */
export function decodeEncodedText(encodedText: string) {
  return Buffer.from(encodedText, "base64").toString("utf8");
}

/**
 * Encoded decoded  text
 * @param textToEncode
 * @returns
 */
export function encodeText(textToEncode: string) {
  return Buffer.from(textToEncode, "utf8").toString("base64");
}
