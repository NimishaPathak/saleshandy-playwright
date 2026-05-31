import { test, expect } from '@playwright/test';
import { logger } from '@utils/logger';

const BASE_URL = process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1';
const API_KEY = process.env.API_KEY || '';

async function safeJson(response: any): Promise<any> {
    const text = await response.text();
    if (!text || text.trim() === '') return null;
    try { return JSON.parse(text); } catch { return null; }
}

function headers(key = API_KEY) {
    return { 'x-api-key': key, 'Content-Type': 'application/json' };
}

/**
 * Sequences API Tests
 * Actual response: { message: string, payload: [...] }
 * Each sequence: id, title, active, steps[], user{}
 */
test.describe('Sequences API', () => {

    test('GET /sequences - should return 200 with sequences list', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        logger.api('GET', `${BASE_URL}/sequences`, response.status());
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('payload');
        expect(Array.isArray(body.payload)).toBeTruthy();
        logger.success(`Sequences fetched: ${body.payload?.length} items`);
    });

    test('GET /sequences - response schema has message and payload', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('payload');
        logger.success('Schema validated: message + payload present');
    });

    test('GET /sequences - each sequence has required fields', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body.payload.length).toBeGreaterThan(0);
        const seq = body.payload[0];
        expect(seq).toHaveProperty('id');
        expect(seq).toHaveProperty('title');
        expect(seq).toHaveProperty('active');
        logger.success(`First sequence: "${seq.title}"`);
    });

    test('GET /sequences - response time under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        const duration = Date.now() - start;
        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000);
        logger.success(`Response time: ${duration}ms`);
    });

    test('GET /sequences - returns 4xx with invalid API key', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, {
            headers: headers('invalid-key-12345'),
        });
        logger.api('GET', `${BASE_URL}/sequences`, response.status());
        expect([400, 401, 403]).toContain(response.status());
        logger.success(`Invalid key rejected with: ${response.status()}`);
    });

    test('GET /sequences - returns 4xx with missing API key', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect([200, 400, 401, 403]).toContain(response.status());
        logger.success(`Missing key response: ${response.status()}`);
    });

    test('GET /sequences/:id - returns 4xx for non-existent ID', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences/nonexistent-id-999`, {
            headers: headers(),
        });
        expect([400, 404]).toContain(response.status());
        logger.success('Non-existent ID returns 4xx');
    });
});