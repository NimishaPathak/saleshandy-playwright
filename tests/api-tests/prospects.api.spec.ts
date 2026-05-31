import { test, expect } from '@playwright/test';
import { logger } from '@utils/logger';

const BASE_URL = process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1';
const API_KEY = process.env.API_KEY || '';

async function safeJson(response: any): Promise<any> {
    const text = await response.text();
    if (!text || text.trim() === '') {
        logger.warn('Empty response body received');
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
        logger.warn(`Non-JSON response: ${text.substring(0, 200)}`);
        return null;
    }
}

function headers(key = API_KEY) {
    return { 'x-api-key': key, 'Content-Type': 'application/json' };
}

test.describe('Prospects API', () => {

    // ── POSITIVE TESTS ─────────────────────────────────────────

    test('GET /prospects - should return 200 with prospects list', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        logger.api('GET', `${BASE_URL}/prospects`, response.status());
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBeTruthy();
        logger.success(`Prospects fetched: ${body.data?.length} items`);
    });

    test('GET /prospects - response schema has data array', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        expect(body).toHaveProperty('data');
        logger.success('Schema validated');
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

    test('GET /prospects - returns 401 with invalid API key', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, {
            headers: headers('bad-api-key-00000'),
        });
        expect([401, 403]).toContain(response.status());
        logger.success('Invalid API key correctly rejected');
    });

    test('GET /prospects - returns 401 with missing API key', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects`, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect([401, 403]).toContain(response.status());
        logger.success('Missing API key correctly rejected');
    });

    test('GET /prospects/:id - returns 404 for non-existent prospect', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/prospects/nonexistent-id-999`, {
            headers: headers(),
        });
        expect([400, 404]).toContain(response.status());
        logger.success('Non-existent prospect ID returns 4xx');
    });
});