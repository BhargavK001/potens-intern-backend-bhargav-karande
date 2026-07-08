import { prisma } from '../../lib/prisma.js';

export async function clearDatabase() {
  await prisma.logEntry.deleteMany({});
}
