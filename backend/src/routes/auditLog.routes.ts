import { Router } from 'express';
import { AuditLogRepository } from '../repositories/AuditLogRepository.js';
import { LogService } from '../services/LogService.js';
import { AuditLogController } from '../controllers/AuditLogController.js';
import { validate } from '../middleware/validate.js';
import { createAuditLogSchema, getAuditLogsQuerySchema, getAuditLogParamsSchema } from '../schemas/auditLog.schema.js';

const router = Router();

// Instantiate dependencies exactly once during router initialization (Dependency Injection)
const auditLogRepository = new AuditLogRepository();
const logService = new LogService(auditLogRepository);
const auditLogController = new AuditLogController(logService);

// Map the creation endpoint under the validation middleware boundary (POST /api/v1/log)
router.post(
  '/log',
  validate({ body: createAuditLogSchema }),
  (req, res, next) => auditLogController.create(req, res, next)
);

// Map the retrieval collection endpoint (GET /api/v1/logs)
router.get(
  '/logs',
  validate({ query: getAuditLogsQuerySchema }),
  (req, res, next) => auditLogController.getAll(req, res, next)
);

// Map the retrieval single resource endpoint (GET /api/v1/logs/:id)
router.get(
  '/logs/:id',
  validate({ params: getAuditLogParamsSchema }),
  (req, res, next) => auditLogController.getById(req, res, next)
);

export default router;
