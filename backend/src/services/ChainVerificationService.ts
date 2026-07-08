import { AuditLogRepository } from '../repositories/AuditLogRepository.js';
import { serializePayload, computeLogHash } from '../lib/hash.js';
import type { VerificationResult } from '../types/log.js';

export class ChainVerificationService {
  constructor(private readonly repository = new AuditLogRepository()) {}

  /**
   * Performs chronological validation traversal of the ledger.
   * 
   * Design Decisions & Refinements:
   * 1. Repository Responsibility: This service never sorts records itself. It trusts and relies
   *    entirely on the database ordering returned by AuditLogRepository.findAllChronological()
   *    (ordered by createdAt ASC, id ASC) which owns sorting concerns.
   * 2. Fail-Fast Strategy: Validation terminates immediately after the first detected inconsistency
   *    (link break or hash mismatch) instead of scanning the remainder of the ledger.
   * 3. entriesChecked Definition: entriesChecked represents the number of successfully verified
   *    entries before the first failure was encountered (e.g. if Entry1 and Entry2 are valid but
   *    Entry3 fails, it returns entriesChecked = 2 and brokenEntryId = Entry3).
   * 
   * Complexity:
   * - Time: O(n) traversal
   * - Memory: O(1) additional space
   */
  async verify(): Promise<VerificationResult> {
    const logs = await this.repository.findAllChronological();
    const verifiedAt = new Date().toISOString();

    if (logs.length === 0) {
      return {
        status: 'PASS',
        entriesChecked: 0,
        brokenEntryId: null,
        reason: null,
        verifiedAt,
      };
    }

    let expectedPreviousHash = 'GENESIS';

    for (let i = 0; i < logs.length; i++) {
      const entry = logs[i]!;

      // 1. Verify previous link matches expectations
      if (entry.previousHash !== expectedPreviousHash) {
        return {
          status: 'FAIL',
          entriesChecked: i,
          brokenEntryId: entry.id,
          reason: 'PREVIOUS_HASH_MISMATCH',
          verifiedAt,
        };
      }

      // 2. Verify payload hash integrity
      const serialized = serializePayload(entry.payload);
      const computedHash = computeLogHash(
        entry.previousHash,
        entry.actor,
        entry.action,
        serialized,
        entry.createdAt.toISOString()
      );

      if (entry.hash !== computedHash) {
        return {
          status: 'FAIL',
          entriesChecked: i,
          brokenEntryId: entry.id,
          reason: 'HASH_MISMATCH',
          verifiedAt,
        };
      }

      // 3. Move cursor to check the next linked block
      expectedPreviousHash = entry.hash;
    }

    return {
      status: 'PASS',
      entriesChecked: logs.length,
      brokenEntryId: null,
      reason: null,
      verifiedAt,
    };
  }
}
