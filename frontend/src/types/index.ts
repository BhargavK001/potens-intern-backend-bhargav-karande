export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  payload: Record<string, unknown>;
  previousHash: string;
  hash: string;
  createdAt: string;
}

export interface VerificationResult {
  status: 'PASS' | 'FAIL';
  entriesChecked: number;
  brokenEntryId: string | null;
  reason: 'PREVIOUS_HASH_MISMATCH' | 'HASH_MISMATCH' | null;
  verifiedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiErrorDetail {
  message: string;
  path?: string[];
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
}
