import type { Request, Response, NextFunction } from 'express';
import { LogService } from '../services/LogService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AuditLogController {
  constructor(private readonly logService: LogService) {}

  /**
   * Appends a new immutable audit log entry.
   * Extends the cryptographic hash chain using service-layer business orchestration.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // The controller receives input validated at the middleware boundary
      const { actor, action, payload } = req.body;

      const logEntry = await this.logService.create({
        actor,
        action,
        payload,
      });

      // Returns the standardized response using the project's success response helper with a 201 status code
      ApiResponse.success(
        res,
        logEntry,
        'Audit log entry created successfully',
        201
      );
    } catch (error) {
      // Propagation strictly delegates to the centralized Express error middleware
      next(error);
    }
  }
}
