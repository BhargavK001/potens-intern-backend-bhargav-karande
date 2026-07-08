import { z } from 'zod';

export const createAuditLogSchema = z.object({
  actor: z.string({
    message: 'actor is required and must be a string',
  })
    .trim()
    .min(1, 'actor cannot be empty')
    .max(100, 'actor cannot exceed 100 characters'),
  action: z.string({
    message: 'action is required and must be a string',
  })
    .trim()
    .min(1, 'action cannot be empty')
    .max(100, 'action cannot exceed 100 characters'),
  payload: z.record(z.string(), z.unknown())
    .refine(
      (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
      {
        message: 'payload must be a non-null, non-array object',
      }
    ),
}).strict();

export const getAuditLogsQuerySchema = z.object({
  actor: z.string().trim().min(1, 'actor cannot be empty').optional(),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'startDate must be a valid date string' }
  ).optional(),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'endDate must be a valid date string' }
  ).optional(),
}).strict();

export const getAuditLogParamsSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID v4' }),
}).strict();

export const exportAuditLogsQuerySchema = z.object({
  actor: z.string().trim().min(1, 'actor cannot be empty').optional(),
  startDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'startDate must be a valid date string' }
  ).optional(),
  endDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'endDate must be a valid date string' }
  ).optional(),
  format: z.enum(['csv', 'json']).default('json').optional(),
}).strict();
