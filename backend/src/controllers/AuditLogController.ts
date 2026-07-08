import type { Request, Response, NextFunction } from 'express';
import { LogService } from '../services/LogService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

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

  /**
   * Retrieves all audit log entries, optionally filtered by actor and date ranges.
   * Returns HTTP 200 OK with records list (or empty list if no logs match).
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { actor, startDate, endDate } = req.query as any;

      const logs = await this.logService.getAll({
        actor,
        startDate,
        endDate,
      });

      ApiResponse.success(
        res,
        logs,
        'Audit logs retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a single audit log entry by its UUID.
   * Returns HTTP 200 OK with the record, or HTTP 404 NOT_FOUND if it does not exist.
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;

      const logEntry = await this.logService.getById(id);

      if (!logEntry) {
        throw new ApiError(
          404,
          'NOT_FOUND',
          `Log entry with id '${id}' does not exist`
        );
      }

      ApiResponse.success(
        res,
        logEntry,
        'Audit log retrieved successfully',
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
