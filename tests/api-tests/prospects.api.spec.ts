import { test, expect } from '@playwright/test';
import { ProspectsApi } from '@api/prospectsApi';
import { prospectPayloads } from '@data/apiPayloads';
import { logger } from '@utils/logger';

/**
 * Prospects API Tests
 * Validates the Saleshandy prospects/leads API endpoints.
 * Runs against: https://open-api.saleshandy.com/v1/prospects
 */
test.describe('Prospects API', () => {
    let prospectsApi: ProspectsApi;

    test.beforeEach(async ({ request }) => {
        prospectsApi = new ProspectsApi(request);
        logger.separator();
    });

    // ── POSITIVE TESTS ─────────────────────────────────────────

    test('GET /prospects - should return 200 with prospects list', async () => {
        const response = await prospectsApi.listProspects();
        expect(response).toBeDefined();
        expect(Array.isArray(response.data)).toBeTruthy();
        logger.success(`Prospects list returned: ${response.data?.length} items`);
    });

    test('GET /prospects - response schema should have data array', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/prospects`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body).toHaveProperty('data');
        logger.success('Prospects response schema is valid');
    });

    // ── NEGATIVE TESTS ─────────────────────────────────────────

    test('GET /prospects - should return 401 with invalid API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/prospects`,
            {
                headers: {
                    'x-api-key': 'bad-api-key-00000',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Invalid API key correctly rejected for prospects');
    });

    test('GET /prospects - should return 401 with missing API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/prospects`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Missing API key correctly rejected for prospects');
    });

    test('GET /prospects/:id - should return 404 for non-existent prospect', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/prospects/nonexistent-id-999`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([404, 400]).toContain(response.status());
        logger.success('Non-existent prospect ID correctly returns 404');
    });

    // ── PERFORMANCE TESTS ───────────────────────────────────────

    test('GET /prospects - response time should be under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/prospects`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        const duration = Date.now() - start;
        expect(response.status()).toBe(200);
        expect(duration).toBeLessThan(3000);
        logger.success(`Prospects response time: ${duration}ms`);
    });
});