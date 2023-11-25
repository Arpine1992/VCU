/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import ImpossibleContinueTestingError from "../exceptions/ImpossibleContinueTestingError";
import { errorMessages } from "../ErrorMessages";
import assert from "assert";
/**
 * Updates test run results in TestRail
 */
export class TestRailClient {
  private readonly baseURL = "https://axs.testrail.io/index.php?/cases/view/".split("index.php?/cases/view/")[0];
  private readonly apiKey = process.env.TEST_RAIL_API_KEY;
  private readonly userName = process.env.TEST_RAIL_USER_NAME;
  private runId: string;

  constructor() {
    if (process.env.RUN_ID) {
      this.runId = process.env.RUN_ID;
    }
  }

  /**
   * Returns headers for TestRail account API call
   * @returns
   */
  private getRequestConfig(): AxiosRequestConfig {
    const headers: any = {
      Authorization: `Basic ${Buffer.from(`${this.userName}:${this.apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    };
    return {
      headers: headers,
    };
  }

  /**
   * Adds a new test result and comment to "Test Run"
   * @param testInfo
   * @param description
   * @param defectId
   * @returns
   */
  public async addResultForCase(testInfo: any, description: string, defectId?: string): Promise<any> {
    const status = {
      passed: 1,
      skipped: 3,
      timedOut: 4,
      interrupted: 4,
      failed: 5,
      failedExisting: 9,
    };
    const endpoint = `index.php?/api/v2/add_result_for_case/${this.runId}/${(testInfo).substring(1)}`;
    const jiraURL = `https://axsteam.atlassian.net/browse/${defectId}`;
    const comment = `${description}\n\n[${defectId}](${jiraURL})`;
    const data = {
      status_id: status[testInfo.status] !== 1 && defectId ? 9 : status[testInfo.status],
      comment,
      defects: "",
    };
    if (process.env.TEST_RAIL_INTEGRATION.toLowerCase() === "true") {
      assert(this.runId);
      try {
        const response = await axios.post(this.baseURL + endpoint, data, this.getRequestConfig());
        return response.data;
      } catch (error) {
        throw new ImpossibleContinueTestingError(`${errorMessages.TEST_RAIL_API_REQUEST_ERROR} \n${error.message}`);
      }
    }
  }
}
