import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from '../config/env.js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  prismaInstance = new PrismaClient({
    adapter,
    log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  if (config.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
