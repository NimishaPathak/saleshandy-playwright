import { APIRequestContext } from '@playwright/test';
import { APIClient } from './apiClient';
import { logger } from '@utils/logger';

/**
 * UserApi — handles user profile and account related endpoints.
 */
export class UserApi extends APIClient {
    constructor(apiContext: APIRequestContext, apiKey?: string) {
        super(apiContext, apiKey);
    }

    /**
     * Get current user profile.
     * Endpoint: GET /v1/user
     */
    async getCurrentUser() {
        logger.step('Fetching current user profile');
        const response = await this.get('/user');
        await this.assertStatus(response, 200);
        const data = await this.getJsonResponse(response);
        logger.success(`User fetched: ${data.email}`);
        return data;
    }

    /**
     * Verify account type is correctly set.
     * Usage: After onboarding, verify the account type is saved.
     */
    async verifyAccountType(expectedType: 'personal' | 'business' | 'clients') {
        const user = await this.getCurrentUser();
        const actualType = user.accountType || user.account_type;
        logger.info(`Expected: ${expectedType}, Got: ${actualType}`);
        if (actualType !== expectedType) {
            throw new Error(`Account type mismatch. Expected ${expectedType}, got ${actualType}`);
        }
        logger.success(`Account type verified: ${actualType}`);
    }

    /**
     * Get user settings.
     * Endpoint: GET /v1/user/settings
     */
    async getUserSettings() {
        logger.step('Fetching user settings');
        const response = await this.get('/user/settings');
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }

    /**
     * Update user settings.
     * Endpoint: PUT /v1/user/settings
     */
    async updateUserSettings(settings: Record<string, unknown>) {
        logger.step('Updating user settings');
        const response = await this.put('/user/settings', settings);
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }
}