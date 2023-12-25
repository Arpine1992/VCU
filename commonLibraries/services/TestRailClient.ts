/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import ImpossibleContinueTestingError from "../exceptions/ImpossibleContinueTestingError";
import { errorMessages } from "../ErrorMessages";
import { getTestId } from "../utils/Helpers";
import assert from "assert";
/**
 * Updates test run results in TestRail
 */
export class TestRailClient {
  private readonly baseURL = "https://vsu2024testing.testrail.io/index.php?/cases/view/".split("index.php?/cases/view/")[0];
  private readonly apiKey = "gCOtbmDpoVvmta37DdiR-sk9njGp3704wcdMQn5ae";
  private readonly userName = "kochinyan1992@mail.ru";
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

  private async isTestCaseInRun(runId: number, testCaseId: number): Promise<boolean> {
    const endpoint = `/index.php?/api/v2/get_tests/${runId}`;
    try {
      const response = await axios.get(this.baseURL + endpoint, this.getRequestConfig());
      const tests = response.data.tests;
      if (Array.isArray(tests)) {
        return tests.some((test) => test.case_id === testCaseId);
      } else {
        console.warn('Unexpected TestRail API response:', tests);
        return false;
      }
    } catch (error) {
      console.error('Error checking if test case is in run:', error);
      throw new Error(`${errorMessages.TEST_RAIL_API_REQUEST_ERROR} \n${error.message}`);
    }
  }

    /**
   * Add a test case to a test run
   * @param runId - ID of the test run
   * @param testCaseId - ID of the test case
   */
    private async addTestCaseToRun(runId: number, testCaseId: number): Promise<void> {
      const endpoint = `index.php?/api/v2/update_run/${runId}`;
      const data = {
        'case_ids': [testCaseId],
      };
      try {
        const response = await axios.post(this.baseURL + endpoint, data, this.getRequestConfig());
        if (response.status !== 200) {
          throw new Error(`Failed to add test case to run. Status code: ${response.status}`);
        }
        console.log(`Test case ${testCaseId} added to run ${runId}`);
      } catch (error) {
        console.error('Error adding test case to run:', error);
        throw new Error(`${errorMessages.TEST_RAIL_API_REQUEST_ERROR} \n${error.message}`);
      }
    }

  /**
  * Adds a new test result and comment to "Test Run"
  * @param testInfo
  * @param description
  * @param defectId
  * @returns
  */
  public async addResultForCasea(testInfo: any, description: string, defectId?: string): Promise<any> {
    const status = {
      passed: 1,
      skipped: 3,
      timedOut: 4,
      interrupted: 4,
      failed: 5,
      failedExisting: 9,
    };
    const endpoint = `index.php?/api/v2/add_result_for_case/${this.runId}/${getTestId(testInfo).substring(1)}`;
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
    const testCaseId = getTestId(testInfo).substring(1);
    const endpoint = `/index.php?/api/v2/add_result_for_case/${this.runId}/${testCaseId}`;
    const jiraURL = `https://axsteam.atlassian.net/browse/${defectId}`;
    const comment = `${description}\n\n[${defectId}](${jiraURL})`;
    const data = {
      status_id: status[testInfo.status] !== 1 && defectId ? 9 : status[testInfo.status],
      comment,
      defects: '',
    };

    if (process.env.TEST_RAIL_INTEGRATION.toLowerCase() === 'true') {
      assert(this.runId)
      const testCaseInRun = await this.isTestCaseInRun(Number(this.runId), Number(testCaseId));
      if (!testCaseInRun) {
        await this.addTestCaseToRun(Number(this.runId), Number(testCaseId));
      }

      try {
        const response = await axios.post(this.baseURL + endpoint, data, this.getRequestConfig());
        return response.data;
      } catch (error) {
        throw new Error(`${errorMessages.TEST_RAIL_API_REQUEST_ERROR} \n${error.message}`);
      }
    }
  }
}



