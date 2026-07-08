import type { Prisma } from '@prisma/client';

export type JsonValue = Prisma.JsonValue;

export interface CreateLogInput {
  actor: string;
  action: string;
  payload: JsonValue;
}

export type VerificationFailureReason =
  | 'HASH_MISMATCH'
  | 'PREVIOUS_HASH_MISMATCH';

export interface VerificationResult {
  status: 'PASS' | 'FAIL';
  entriesChecked: number;
  brokenEntryId: string | null;
  reason?: VerificationFailureReason | null;
  verifiedAt: string;
}

export interface AuditLogQuery {
  actor?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExportResult {
  content: string;
  contentType: string;
  filename: string;
}
