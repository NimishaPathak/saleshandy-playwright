import { test, expect } from '@playwright/test';
import { SequencesApi } from '@api/sequencesApi';
import { sequencePayloads } from '@data/apiPayloads';
import { logger } from '@utils/logger';

/**
 * Sequences API Tests
 * Fast, browserless tests that validate the Saleshandy sequences API.
 * Runs against: https://open-api.saleshandy.com/v1/sequences
 * Auth: x-api-key header
 */
test.describe('Sequences API', () => {
    let sequencesApi: SequencesApi;
    let createdSequenceId: string;

    test.beforeEach(async ({ request }) => {
        sequencesApi = new SequencesApi(request);
        logger.separator();
    });

    // ── POSITIVE TESTS ─────────────────────────────────────────

    test('GET /sequences - should return 200 with sequences list', async () => {
        const response = await sequencesApi.listSequences();
        expect(response).toBeDefined();
        expect(Array.isArray(response.data)).toBeTruthy();
        logger.success(`Sequences list returned: ${response.data?.length} items`);
    });

    test('GET /sequences - response should contain expected schema fields', async ({ request }) => {
        const rawResponse = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(rawResponse.status()).toBe(200);
        const body = await rawResponse.json();
        // Verify top-level structure
        expect(body).toHaveProperty('data');
        logger.success('Sequences response schema is valid');
    });

    test('GET /sequences - should return 401 with invalid API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences`,
            {
                headers: {
                    'x-api-key': 'invalid-key-12345',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Invalid API key correctly rejected');
    });

    test('GET /sequences - should return 401 with missing API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Missing API key correctly rejected');
    });

    test('GET /sequences - pagination works with page and limit params', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
                params: { page: 1, limit: 5 },
            }
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.data?.length).toBeLessThanOrEqual(5);
        logger.success('Pagination params accepted');
    });

    test('GET /sequences/:id - should return 404 for non-existent ID', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences/nonexistent-id-999`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([404, 400]).toContain(response.status());
        logger.success('Non-existent sequence ID correctly returns 404');
    });

    test('GET /sequences - response time should be under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/sequences`,
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
        logger.success(`Response time: ${duration}ms`);
    });
});