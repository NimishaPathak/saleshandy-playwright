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
 * Prospects API Tests
 * Actual response structure confirmed from live API:
 * { message: string, payload: [...] }
 * Each prospect has: id, email, attributes[], tags[], verificationStatus, createdAt
 */
test.describe('Prospects API', () => {

    // ── POSITIVE TESTS ─────────────────────────────────────────

    test('GET /prospects - should return 200 with prospects list', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        logger.api('GET', `${BASE_URL}/prospects`, response.status());
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('payload');
        expect(Array.isArray(body.payload)).toBeTruthy();
        logger.success(`Prospects fetched: ${body.payload?.length} items`);
    });

    test('GET /prospects - response schema has message and payload', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('payload');
        logger.success('Schema validated: message + payload present');
    });

    test('GET /prospects - each prospect has required fields', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body.payload.length).toBeGreaterThan(0);
        const prospect = body.payload[0];
        expect(prospect).toHaveProperty('id');
        expect(prospect).toHaveProperty('email');
        expect(prospect).toHaveProperty('attributes');
        expect(prospect).toHaveProperty('verificationStatus');
        logger.success(`First prospect email: "${prospect.email}"`);
    });

    test('GET /prospects - response time under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        const duration = Date.now() - start;
        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000);
        logger.success(`Response time: ${duration}ms`);
    });

    // ── NEGATIVE TESTS ─────────────────────────────────────────

    test('GET /prospects - returns 4xx with invalid API key', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, {
            headers: headers('bad-api-key-00000'),
        });
        logger.api('GET', `${BASE_URL}/prospects`, response.status());
        // Saleshandy returns 400 for invalid key format
        expect([400, 401, 403]).toContain(response.status());
        logger.success(`Invalid API key rejected with: ${response.status()}`);
    });

    test('GET /prospects/:id - returns 4xx for non-existent prospect', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects/nonexistent-id-999`, {
            headers: headers(),
        });
        expect([400, 404]).toContain(response.status());
        logger.success('Non-existent prospect ID returns 4xx');
    });

    test('GET /prospects - message confirms successful fetch', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body.message).toContain('prospects');
        logger.success(`API message: "${body.message}"`);
    });
});