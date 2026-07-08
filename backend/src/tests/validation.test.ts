import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { getAuthHeader } from './helpers/auth.js';

describe('📋 Input Request Validation Integration Tests', () => {
  const authHeader = getAuthHeader();

  describe('POST /api/v1/log', () => {
    it('should return 400 Bad Request when actor field is missing', async () => {
      const res = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send({ action: 'CREATE', payload: {} });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details.some((d: any) => d.field === 'actor')).toBe(true);
    });

    it('should return 400 Bad Request when action field is empty string', async () => {
      const res = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send({ actor: 'admin', action: ' ', payload: {} });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when payload is missing', async () => {
      const res = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send({ actor: 'admin', action: 'CREATE' });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when body contains unknown properties', async () => {
      const res = await request(app)
        .post('/api/v1/log')
        .set(authHeader)
        .send({ actor: 'admin', action: 'CREATE', payload: {}, extra: 'value' });
      
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/logs/:id', () => {
    it('should return 400 Bad Request when id parameter is not a valid UUID v4', async () => {
      const res = await request(app)
        .get('/api/v1/logs/not-a-valid-uuid')
        .set(authHeader);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details.some((d: any) => d.field === 'id')).toBe(true);
    });
  });

  describe('GET /api/v1/logs', () => {
    it('should return 400 Bad Request when startDate is not a valid date', async () => {
      const res = await request(app)
        .get('/api/v1/logs?startDate=invalid-date-format')
        .set(authHeader);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 Bad Request when query contains unknown parameters', async () => {
      const res = await request(app)
        .get('/api/v1/logs?unknownParam=value')
        .set(authHeader);

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
