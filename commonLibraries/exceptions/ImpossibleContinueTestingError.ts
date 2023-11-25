/**
 * Custom error class for signaling an impossible continuation of testing.
 * This error should be thrown when a situation occurs during testing that makes it
 * impossible to proceed further with the testing process.
 *
 * @class ImpossibleContinueTestingError
 * @extends {Error}
 */
export default class ImpossibleContinueTestingError extends Error {
  constructor(message: string) {
    super("Impossible Continue Testing:\n " + message);
    this.name = "ImpossibleContinueTestingError";
  }
}
