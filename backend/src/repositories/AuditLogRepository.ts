import { PrismaClient, Prisma } from '@prisma/client';
import type { LogEntry } from '@prisma/client';
import { prisma as defaultPrisma } from '../lib/prisma.js';
import type { AuditLogQuery } from '../types/log.js';

export class AuditLogRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || defaultPrisma;
  }

  async findLatest(
    client: PrismaClient | Prisma.TransactionClient = this.prisma
  ): Promise<LogEntry | null> {
    return client.logEntry.findFirst({
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
    });
  }

  async create(
    data: Prisma.LogEntryCreateInput,
    client: PrismaClient | Prisma.TransactionClient = this.prisma
  ): Promise<LogEntry> {
    return client.logEntry.create({ data });
  }

  async findById(
    id: string,
    client: PrismaClient | Prisma.TransactionClient = this.prisma
  ): Promise<LogEntry | null> {
    return client.logEntry.findUnique({
      where: { id },
    });
  }

  async findAllChronological(
    client: PrismaClient | Prisma.TransactionClient = this.prisma
  ): Promise<LogEntry[]> {
    return client.logEntry.findMany({
      orderBy: [
        { createdAt: 'asc' },
        { id: 'asc' },
      ],
    });
  }

  async findFiltered(
    filters: AuditLogQuery,
    client: PrismaClient | Prisma.TransactionClient = this.prisma
  ): Promise<LogEntry[]> {
    const where: Prisma.LogEntryWhereInput = {};

    if (filters.actor !== undefined) {
      where.actor = filters.actor;
    }

    if (filters.startDate !== undefined || filters.endDate !== undefined) {
      const createdAtFilter: Prisma.DateTimeFilter = {};
      if (filters.startDate !== undefined) {
        createdAtFilter.gte = new Date(filters.startDate);
      }
      if (filters.endDate !== undefined) {
        createdAtFilter.lte = new Date(filters.endDate);
      }
      where.createdAt = createdAtFilter;
    }

    return client.logEntry.findMany({
      where,
      orderBy: [
        { createdAt: 'asc' },
        { id: 'asc' },
      ],
    });
  }
}
