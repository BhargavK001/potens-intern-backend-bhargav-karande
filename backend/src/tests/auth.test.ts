import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('🔑 API Key Authentication Integration Tests', () => {
  const testEndpoints = [
    { method: 'post', path: '/api/v1/log' },
    { method: 'get', path: '/api/v1/logs' },
    { method: 'get', path: '/api/v1/logs/22222222-2222-4222-b222-222222222222' },
    { method: 'get', path: '/api/v1/verify' },
    { method: 'get', path: '/api/v1/export' },
  ];

  testEndpoints.forEach(({ method, path }) => {
    it(`should reject ${method.toUpperCase()} ${path} with 401 when X-API-Key is missing`, async () => {
      const res = await (request(app) as any)[method](path);
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it(`should reject ${method.toUpperCase()} ${path} with 401 when X-API-Key is invalid`, async () => {
      const res = await (request(app) as any)[method](path).set('X-API-Key', 'invalid-key-value');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
