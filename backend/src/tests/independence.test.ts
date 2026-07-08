import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { clearDatabase } from './helpers/database.js';
import { getAuthHeader } from './helpers/auth.js';
import { generateMockPayload } from './helpers/fixtures.js';

describe('🔄 Test Suite Independence Integration Tests', () => {
  const authHeader = getAuthHeader();

  beforeEach(async () => {
    await clearDatabase();
  });

  it('should run successfully in isolation and support repeated runs', async () => {
    // Run creation check
    const res1 = await request(app)
      .post('/api/v1/log')
      .set(authHeader)
      .send(generateMockPayload({ actor: 'IsolationUser' }));
    expect(res1.status).toBe(201);

    // Verify exactly 1 log exists
    const listRes1 = await request(app)
      .get('/api/v1/logs')
      .set(authHeader);
    expect(listRes1.body.data.length).toBe(1);
  });

  it('should remain independent in subsequent runs, cleaning up previous states', async () => {
    // Verify that database is cleared and starts empty, showing no leak from previous test
    const listRes2 = await request(app)
      .get('/api/v1/logs')
      .set(authHeader);
    expect(listRes2.body.data.length).toBe(0);

    // Create another log
    const res2 = await request(app)
      .post('/api/v1/log')
      .set(authHeader)
      .send(generateMockPayload({ actor: 'IsolationUser2' }));
    expect(res2.status).toBe(201);
  });
});
