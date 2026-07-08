import { Router } from 'express';
import { AuditLogRepository } from '../repositories/AuditLogRepository.js';
import { LogService } from '../services/LogService.js';
import { AuditLogController } from '../controllers/AuditLogController.js';
import { validate } from '../middleware/validate.js';
import { createAuditLogSchema } from '../schemas/auditLog.schema.js';

const router = Router();

// Instantiate dependencies exactly once during router initialization (Dependency Injection)
const auditLogRepository = new AuditLogRepository();
const logService = new LogService(auditLogRepository);
const auditLogController = new AuditLogController(logService);

// Map the creation endpoint under the validation middleware boundary
router.post(
  '/',
  validate({ body: createAuditLogSchema }),
  (req, res, next) => auditLogController.create(req, res, next)
);

export default router;
