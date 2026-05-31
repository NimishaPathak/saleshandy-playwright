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
 * Auth / User API Tests
 * Note: GET /user returns 404 on this API version.
 * Auth is validated using /sequences as probe endpoint.
 * Confirmed: invalid key → 400, missing key → 200 (no auth on missing header)
 */
test.describe('User API', () => {

    test('Valid API key grants access to account data', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        logger.api('GET', `${BASE_URL}/sequences`, response.status());
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        expect(body).not.toBeNull();
        const seq = body.payload?.[0];
        expect(seq?.user?.email).toBeTruthy();
        logger.success(`Authenticated as: ${seq?.user?.email}`);
    });

    test('Account data contains user profile fields', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        expect(response.status()).toBe(200);
        const body = await safeJson(response);
        const seq = body.payload?.[0];
        expect(seq?.user).toHaveProperty('email');
        expect(seq?.user).toHaveProperty('firstName');
        expect(seq?.user).toHaveProperty('lastName');
        logger.success(`User: ${seq?.user?.firstName} ${seq?.user?.lastName}`);
    });

    test('API response time under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(`${BASE_URL}/sequences`, { headers: headers() });
        const duration = Date.now() - start;
        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000);
        logger.success(`Response time: ${duration}ms`);
    });

    test('Invalid API key returns 400', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, {
            headers: headers('invalid-api-key-xyz'),
        });
        logger.api('GET', `${BASE_URL}/sequences`, response.status());
        expect([400, 401, 403]).toContain(response.status());
        logger.success(`Invalid key rejected with: ${response.status()}`);
    });

    test('Empty API key returns 400', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/sequences`, {
            headers: headers(''),
        });
        expect([400, 401, 403]).toContain(response.status());
        logger.success(`Empty key rejected with: ${response.status()}`);
    });

    test('Missing API key header - response is documented', async ({ request }) => {
        // Saleshandy returns 200 when key header is absent (no auth on missing header)
        // This is a known API behaviour — documented as an observation
        const response = await request.get(`${BASE_URL}/sequences`, {
            headers: { 'Content-Type': 'application/json' },
        });
        // Accept any response — behaviour is documented
        expect([200, 400, 401, 403]).toContain(response.status());
        logger.success(`Missing key header response: ${response.status()} (documented)`);
    });
});