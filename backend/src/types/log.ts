import type { Prisma } from '@prisma/client';

export type JsonValue = Prisma.JsonValue;

export interface CreateLogInput {
  actor: string;
  action: string;
  payload: JsonValue;
}

export interface VerificationResult {
  status: 'PASS' | 'FAIL';
  entriesChecked: number;
  brokenEntryId: string | null;
  reason?: string;
}

export interface ExportFilters {
  actor?: string;
  startDate?: string;
  endDate?: string;
}
