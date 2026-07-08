import { Router } from 'express';
import auditLogRoutes from './auditLog.routes.js';

const router = Router();

// Mount domain routes under their versioned prefix
router.use('/', auditLogRoutes);

export default router;
