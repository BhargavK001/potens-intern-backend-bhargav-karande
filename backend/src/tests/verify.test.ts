import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { clearDatabase } from './helpers/database.js';
import { getAuthHeader } from './helpers/auth.js';
import { generateMockPayload } from './helpers/fixtures.js';

describe('🔒 Chain Integrity Verification Integration Tests', () => {
  const authHeader = getAuthHeader();

  beforeEach(async () => {
    await clearDatabase();
  });

  it('should return PASS with 0 entries checked when the database is empty', async () => {
    const res = await request(app)
      .get('/api/v1/verify')
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PASS');
    expect(res.body.data.entriesChecked).toBe(0);
    expect(res.body.data.brokenEntryId).toBeNull();
  });

  it('should return PASS and count successfully verified logs when the chain is valid', async () => {
    // Seed 2 logs via public endpoints
    await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1' }));
    await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User2' }));

    const res = await request(app)
      .get('/api/v1/verify')
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('PASS');
    expect(res.body.data.entriesChecked).toBe(2);
    expect(res.body.data.brokenEntryId).toBeNull();
  });

  it('should return FAIL and PREVIOUS_HASH_MISMATCH when a link previousHash is broken', async () => {
    // Seed 2 logs via endpoints
    const log1 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1' }));
    const log2 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User2' }));

    // Tamper with log2's previousHash directly in the DB
    await prisma.logEntry.update({
      where: { id: log2.body.data.id },
      data: { previousHash: 'b' + 'a'.repeat(63) },
    });

    const res = await request(app)
      .get('/api/v1/verify')
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('FAIL');
    expect(res.body.data.reason).toBe('PREVIOUS_HASH_MISMATCH');
    expect(res.body.data.brokenEntryId).toBe(log2.body.data.id);
    expect(res.body.data.entriesChecked).toBe(1); // Fails at index 1, meaning index 0 (1 entry) verified successfully
  });

  it('should return FAIL and HASH_MISMATCH when a log hash is tampered', async () => {
    const log1 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1' }));

    // Tamper with log1's stored hash directly in the DB
    await prisma.logEntry.update({
      where: { id: log1.body.data.id },
      data: { hash: 'c' + 'a'.repeat(63) },
    });

    const res = await request(app)
      .get('/api/v1/verify')
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('FAIL');
    expect(res.body.data.reason).toBe('HASH_MISMATCH');
    expect(res.body.data.brokenEntryId).toBe(log1.body.data.id);
    expect(res.body.data.entriesChecked).toBe(0); // Fails at index 0, meaning 0 entries verified successfully before stopping
  });
});
