import { PrismaClient } from '@prisma/client';
import type { LogEntry } from '@prisma/client';
import { prisma as defaultPrisma } from '../lib/prisma.js';
import { AuditLogRepository } from '../repositories/AuditLogRepository.js';
import { serializePayload, computeLogHash } from '../lib/hash.js';
import type { CreateLogInput, AuditLogQuery } from '../types/log.js';

export class LogService {
  constructor(
    private readonly repository = new AuditLogRepository(),
    private readonly prismaInstance: PrismaClient = defaultPrisma
  ) {}

  /**
   * Orchestrates the creation of immutable audit log entries while enforcing the application's append-only chain rules.
   */
  async create(input: CreateLogInput): Promise<LogEntry> {
    // Transactions prevent concurrent requests from producing conflicting hash chains or race conditions during chain extension.
    return this.prismaInstance.$transaction(async (tx) => {
      const latestEntry = await this.repository.findLatest(tx);

      // The first log uses a predefined GENESIS hash because no previous entry exists in the audit chain.
      const previousHash = latestEntry ? latestEntry.hash : 'GENESIS';

      // A single timestamp must be shared between hash computation and persistence to guarantee hash chain verification parity.
      const createdAtDate = new Date();
      const createdAtStr = createdAtDate.toISOString();

      // Deterministic JSON serialization ensures identical payloads yield identical hash digests regardless of object property order.
      const serializedPayload = serializePayload(input.payload);

      const hash = computeLogHash(
        previousHash,
        input.actor,
        input.action,
        serializedPayload,
        createdAtStr
      );

      // All database interactions within the sequence must execute within the active transaction context to maintain atomic isolation.
      return this.repository.create(
        {
          actor: input.actor,
          action: input.action,
          payload: input.payload ?? {},
          previousHash,
          hash,
          createdAt: createdAtDate,
        },
        tx
      );
    });
  }

  // ==========================================
  // READS
  // ==========================================

  /**
   * Retrieves all audit log entries, applying optional filters for actor, startDate, and endDate.
   * Returns records in ascending chronological order (createdAt ASC, id ASC).
   */
  async getAll(filters: AuditLogQuery = {}): Promise<LogEntry[]> {
    return this.repository.findFiltered(filters);
  }

  /**
   * Retrieves a single audit log entry by its UUID.
   */
  async getById(id: string): Promise<LogEntry | null> {
    return this.repository.findById(id);
  }
}

