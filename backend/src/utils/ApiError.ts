export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly details: any[];

  constructor(statusCode: number, errorCode: string, message: string, details: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
