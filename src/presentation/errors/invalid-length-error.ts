export class InvalidLengthError extends Error {
  constructor(paramName: string) {
    super(`Invalid length: ${paramName}`);
    this.name = 'InvalidLengthError';
  }
}
