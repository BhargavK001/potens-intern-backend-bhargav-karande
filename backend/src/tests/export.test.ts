import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { clearDatabase } from './helpers/database.js';
import { getAuthHeader } from './helpers/auth.js';
import { generateMockPayload } from './helpers/fixtures.js';

describe('📥 Administrative Log Export Integration Tests', () => {
  const authHeader = getAuthHeader();

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('JSON Export', () => {
    it('should return a pure JSON data structure without standard REST wrapper parameters', async () => {
      // Seed 2 logs via public endpoints
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1' }));
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User2' }));

      const res = await request(app)
        .get('/api/v1/export?format=json')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(res.headers['content-disposition']).toContain('attachment; filename=');
      expect(res.headers['content-disposition']).toContain('.json');

      const body = res.body;
      expect(body.metadata).toBeDefined();
      expect(body.logs).toBeDefined();
      expect(body.logs.length).toBe(2);

      // Verify that no standard REST wrapper parameters exist
      expect(body.success).toBeUndefined();
      expect(body.message).toBeUndefined();
      expect(body.data).toBeUndefined();
    });
  });

  describe('CSV Export', () => {
    it('should return CSV data starting with UTF-8 BOM and protected from formula injection', async () => {
      // Seed logs via public endpoints
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User1', action: '=SUM(1,2)' }));
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'User2', action: '@INJECT' }));

      const res = await request(app)
        .get('/api/v1/export?format=csv')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('text/csv; charset=utf-8');
      expect(res.headers['content-disposition']).toContain('attachment; filename=');
      expect(res.headers['content-disposition']).toContain('.csv');

      // Check UTF-8 BOM prefix (\uFEFF)
      expect(res.text.startsWith('\uFEFF')).toBe(true);

      const csvData = res.text.replace('\uFEFF', '');
      const lines = csvData.trim().split('\n');

      // CSV parsing round-trip test: Row count matches repository record count
      const dataRowsCount = lines.length - 1; // Subtract headers line
      expect(dataRowsCount).toBe(2);

      // Verify formula injection protection
      expect(lines.some((line) => line.includes('\"\'=SUM(1,2)\"'))).toBe(true);
      expect(lines.some((line) => line.includes('\"\'@INJECT\"'))).toBe(true);
    });
  });

  describe('Filtering', () => {
    it('should filter export rows based on query filters', async () => {
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'Alice' }));
      await request(app).post('/api/v1/log').set(authHeader).send(generateMockPayload({ actor: 'Bob' }));

      const res = await request(app)
        .get('/api/v1/export?format=json&actor=Alice')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.logs.length).toBe(1);
      expect(res.body.logs[0].actor).toBe('Alice');
    });
  });
});
