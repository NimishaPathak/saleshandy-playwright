import { APIRequestContext } from '@playwright/test';
import { APIClient } from './apiClient';
import { logger } from '@utils/logger';

export interface ProspectPayload {
    email: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    [key: string]: any;
}

/**
 * ProspectsApi — handles prospects/leads endpoints.
 */
export class ProspectsApi extends APIClient {
    constructor(apiContext: APIRequestContext, apiKey?: string) {
        super(apiContext, apiKey);
    }

    /**
     * Get all prospects.
     * Endpoint: GET /v1/prospects
     */
    async listProspects(page = 1, limit = 20) {
        logger.step(`Fetching prospects (page ${page})`);
        const response = await this.get('/prospects', { page, limit });
        await this.assertStatus(response, 200);
        const data = await this.getJsonResponse(response);
        logger.success(`Fetched ${data.data?.length || 0} prospects`);
        return data;
    }

    /**
     * Add a prospect.
     * Endpoint: POST /v1/prospects
     */
    async addProspect(payload: ProspectPayload) {
        logger.step(`Adding prospect: ${payload.email}`);
        const response = await this.post('/prospects', payload);
        await this.assertStatus(response, 201);
        const data = await this.getJsonResponse(response);
        logger.success(`Prospect added with ID: ${data.id}`);
        return data;
    }

    /**
     * Get prospect by ID.
     * Endpoint: GET /v1/prospects/:id
     */
    async getProspect(prospectId: string) {
        logger.step(`Fetching prospect: ${prospectId}`);
        const response = await this.get(`/prospects/${prospectId}`);
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }

    /**
     * Update prospect.
     * Endpoint: PUT /v1/prospects/:id
     */
    async updateProspect(prospectId: string, payload: Record<string, unknown>) {
        logger.step(`Updating prospect: ${prospectId}`);
        const response = await this.put(`/prospects/${prospectId}`, payload);
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }

    /**
     * Delete prospect.
     * Endpoint: DELETE /v1/prospects/:id
     */
    async deleteProspect(prospectId: string) {
        logger.step(`Deleting prospect: ${prospectId}`);
        const response = await this.delete(`/prospects/${prospectId}`);
        await this.assertStatus(response, 200);
        logger.success(`Prospect deleted`);
    }

    /**
     * Verify prospect exists.
     */
    async verifyProspectExists(email: string): Promise<boolean> {
        logger.step(`Verifying prospect exists: ${email}`);
        const data = await this.listProspects();
        const exists = data.data?.some((prospect: any) => prospect.email === email);
        logger.info(`Prospect ${email} ${exists ? 'found' : 'not found'}`);
        return !!exists;
    }
}