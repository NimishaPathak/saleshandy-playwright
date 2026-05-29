import { APIRequestContext } from '@playwright/test';
import { APIClient } from './apiClient';
import { logger } from '@utils/logger';

export interface SequencePayload {
    name: string;
    templateId?: string;
    description?: string;
    [key: string]: any;
}

/**
 * SequencesApi — handles email sequence/campaign endpoints.
 */
export class SequencesApi extends APIClient {
    constructor(apiContext: APIRequestContext, apiKey?: string) {
        super(apiContext, apiKey);
    }

    /**
     * Get all sequences.
     * Endpoint: GET /v1/sequences
     */
    async listSequences(page = 1, limit = 20) {
        logger.step(`Fetching sequences (page ${page})`);
        const response = await this.get('/sequences', { page, limit });
        await this.assertStatus(response, 200);
        const data = await this.getJsonResponse(response);
        logger.success(`Fetched ${data.data?.length || 0} sequences`);
        return data;
    }

    /**
     * Create a new sequence.
     * Endpoint: POST /v1/sequences
     */
    async createSequence(payload: SequencePayload) {
        logger.step(`Creating sequence: ${payload.name}`);
        const response = await this.post('/sequences', payload);
        await this.assertStatus(response, 201);
        const data = await this.getJsonResponse(response);
        logger.success(`Sequence created with ID: ${data.id}`);
        return data;
    }

    /**
     * Get sequence details by ID.
     * Endpoint: GET /v1/sequences/:id
     */
    async getSequence(sequenceId: string) {
        logger.step(`Fetching sequence: ${sequenceId}`);
        const response = await this.get(`/sequences/${sequenceId}`);
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }

    /**
     * Update sequence.
     * Endpoint: PUT /v1/sequences/:id
     */
    async updateSequence(sequenceId: string, payload: Record<string, unknown>) {
        logger.step(`Updating sequence: ${sequenceId}`);
        const response = await this.put(`/sequences/${sequenceId}`, payload);
        await this.assertStatus(response, 200);
        return this.getJsonResponse(response);
    }

    /**
     * Delete sequence.
     * Endpoint: DELETE /v1/sequences/:id
     */
    async deleteSequence(sequenceId: string) {
        logger.step(`Deleting sequence: ${sequenceId}`);
        const response = await this.delete(`/sequences/${sequenceId}`);
        await this.assertStatus(response, 200);
        logger.success(`Sequence deleted`);
    }

    /**
     * Verify sequence exists.
     * Useful for post-onboarding tests.
     */
    async verifySequenceExists(sequenceName: string): Promise<boolean> {
        logger.step(`Verifying sequence exists: ${sequenceName}`);
        const data = await this.listSequences();
        const exists = data.data?.some(
            (seq: any) => seq.name === sequenceName || seq.name?.includes(sequenceName),
        );
        if (exists) {
            logger.success(`Sequence found: ${sequenceName}`);
        } else {
            logger.warn(`Sequence NOT found: ${sequenceName}`);
        }
        return !!exists;
    }
}