import type { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', status: number = 200) {
    return res.status(status).json({
      success: true,
      data,
      message,
    });
  }

  static error(res: Response, errorCode: string, message: string, details: any[] = [], status: number = 400) {
    return res.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
      },
    });
  }
}
