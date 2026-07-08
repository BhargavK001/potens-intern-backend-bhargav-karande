import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { prisma } from '../lib/prisma.js';
import { clearDatabase } from './helpers/database.js';
import { getAuthHeader } from './helpers/auth.js';
import { generateMockPayload } from './helpers/fixtures.js';

describe('📝 Audit Log CRUD Integration Tests', () => {
  const authHeader = getAuthHeader();

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/v1/log', () => {
    it('should successfully create an audit log and return 201 Created', async () => {
      const payload = generateMockPayload({ actor: ' Alice ', action: ' LOGIN ' });
      const res = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.actor).toBe('Alice'); // Verify trimming
      expect(res.body.data.action).toBe('LOGIN'); // Verify trimming
      expect(res.body.data.previousHash).toBe('GENESIS'); // Genesis case
      expect(res.body.data.hash).toBeDefined();
    });

    it('should link the previousHash of the second log entry to the hash of the first log entry', async () => {
      const log1 = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send(generateMockPayload({ actor: 'User1' }));

      const log2 = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send(generateMockPayload({ actor: 'User2' }));

      expect(log2.status).toBe(201);
      expect(log2.body.data.previousHash).toBe(log1.body.data.hash);
    });

    it('should propagate duplicate hash constraint failures cleanly from database uniqueness rules', async () => {
      const sameHash = 'a'.repeat(64);
      await prisma.logEntry.create({
        data: {
          id: '11111111-1111-4111-a111-111111111111',
          actor: 'User1',
          action: 'ACTION',
          payload: {},
          previousHash: 'GENESIS',
          hash: sameHash,
        },
      });

      await expect(
        prisma.logEntry.create({
          data: {
            id: '22222222-2222-4222-b222-222222222222',
            actor: 'User2',
            action: 'ACTION',
            payload: {},
            previousHash: sameHash,
            hash: sameHash,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('GET /api/v1/logs', () => {
    it('should return 200 OK and an empty list when no log entries exist', async () => {
      const res = await request(app)
        .get('/api/v1/logs')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should retrieve logs in chronological order (createdAt ASC, id ASC)', async () => {
      // Seed three logs sequentially via HTTP endpoints
      const date1 = new Date(Date.now() - 10000);
      const date2 = new Date(Date.now() - 5000);
      const date3 = new Date(Date.now());

      const res1 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1' }));
      const res2 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User2' }));
      const res3 = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User3' }));

      // Explicitly adjust timestamps in DB to verify sorting
      await prisma.logEntry.update({ where: { id: res1.body.data.id }, data: { createdAt: date3 } }); // User1 is now last
      await prisma.logEntry.update({ where: { id: res2.body.data.id }, data: { createdAt: date1 } }); // User2 is now first
      await prisma.logEntry.update({ where: { id: res3.body.data.id }, data: { createdAt: date2 } }); // User3 is now second

      const getRes = await request(app).get('/api/v1/logs').set(authHeader);
      expect(getRes.status).toBe(200);
      const items = getRes.body.data;
      expect(items.length).toBe(3);
      expect(items[0].actor).toBe('User2');
      expect(items[1].actor).toBe('User3');
      expect(items[2].actor).toBe('User1');
    });

    it('should filter logs by exact actor match', async () => {
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'Alice' }));
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'Bob' }));

      const res = await request(app).get('/api/v1/logs?actor=Alice').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].actor).toBe('Alice');
    });

    it('should filter logs within specified date ranges', async () => {
      const now = Date.now();
      const start = new Date(now - 10000);
      const mid = new Date(now - 5000);
      const end = new Date(now);

      const log = await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'Alice' }));
      await prisma.logEntry.update({ where: { id: log.body.data.id }, data: { createdAt: mid } });

      const filter1 = await request(app).get(`/api/v1/logs?startDate=${start.toISOString()}`).set(authHeader);
      expect(filter1.body.data.length).toBe(1);

      const filter2 = await request(app).get(`/api/v1/logs?endDate=${start.toISOString()}`).set(authHeader);
      expect(filter2.body.data.length).toBe(0);
    });
  });

  describe('GET /api/v1/logs/:id', () => {
    it('should return a log entry by its UUID', async () => {
      const createRes = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send(generateMockPayload({ actor: 'Alice' }));

      const id = createRes.body.data.id;
      const getRes = await request(app)
        .get(`/api/v1/logs/${id}`)
        .set(authHeader);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.id).toBe(id);
      expect(getRes.body.data.actor).toBe('Alice');
    });

    it('should return 404 Not Found for non-existent but valid UUIDs', async () => {
      const unknownUuid = 'c33b804f-35da-48c0-8260-23a57be11883';
      const res = await request(app)
        .get(`/api/v1/logs/${unknownUuid}`)
        .set(authHeader);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
