import { test, expect } from '@playwright/test';
import { UserApi } from '@api/userApi';
import { logger } from '@utils/logger';

/**
 * User API Tests
 * Validates user profile and account management endpoints.
 * Runs against: https://open-api.saleshandy.com/v1/user
 */
test.describe('User API', () => {
    let userApi: UserApi;

    test.beforeEach(async ({ request }) => {
        userApi = new UserApi(request);
        logger.separator();
    });

    // ── POSITIVE TESTS ─────────────────────────────────────────

    test('GET /user - should return 200 with user profile', async () => {
        const userData = await userApi.getCurrentUser();
        expect(userData).toBeDefined();
        expect(userData.email).toBeTruthy();
        logger.success(`User profile fetched: ${userData.email}`);
    });

    test('GET /user - response should contain required fields', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/user`,
            {
                headers: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect(response.status()).toBe(200);
        const body = await response.json();
        // Verify essential user fields exist
        expect(body).toHaveProperty('email');
        logger.success('User profile schema is valid');
    });

    // ── NEGATIVE TESTS ─────────────────────────────────────────

    test('GET /user - should return 401 with invalid API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/user`,
            {
                headers: {
                    'x-api-key': 'invalid-api-key-xyz',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Unauthorized access correctly blocked');
    });

    test('GET /user - should return 401 with empty API key', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/user`,
            {
                headers: {
                    'x-api-key': '',
                    'Content-Type': 'application/json',
                },
            }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Empty API key correctly rejected');
    });

    test('GET /user - should return 401 with no auth header', async ({ request }) => {
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/user`,
            { headers: { 'Content-Type': 'application/json' } }
        );
        expect([401, 403]).toContain(response.status());
        logger.success('Missing auth header correctly rejected');
    });

    // ── PERFORMANCE TESTS ───────────────────────────────────────

    test('GET /user - response time should be under 3 seconds', async ({ request }) => {
        const start = Date.now();
        const response = await request.get(
            `${process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1'}/user`,
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
        logger.success(`User API response time: ${duration}ms`);
    });
});