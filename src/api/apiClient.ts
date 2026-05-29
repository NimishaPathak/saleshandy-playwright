import { APIRequestContext } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * APIClient — base wrapper for Saleshandy's open API.
 * API docs: https://developer.saleshandy.com/api-reference/introduction
 * Base URL: https://open-api.saleshandy.com/v1
 * Authentication: x-api-key header
 */
export class APIClient {
    private apiContext: APIRequestContext;
    private baseUrl: string;
    private apiKey: string;

    constructor(apiContext: APIRequestContext, apiKey?: string) {
        this.apiContext = apiContext;
        this.baseUrl = process.env.API_BASE_URL || 'https://open-api.saleshandy.com/v1';
        this.apiKey = apiKey || process.env.API_KEY || '';

        if (!this.apiKey) {
            logger.warn('API key not provided. Set API_KEY in .env');
        }
    }

    // ── Headers ──────────────────────────────────────────────────

    private getHeaders(): Record<string, string> {
        return {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    // ── HTTP Methods ─────────────────────────────────────────────

    async get(endpoint: string, params?: Record<string, unknown>) {
        const url = `${this.baseUrl}${endpoint}`;
        logger.api('GET', url);
        return this.apiContext.get(url, {
            headers: this.getHeaders(),
            params,
        });
    }

    async post(endpoint: string, payload: Record<string, unknown>) {
        const url = `${this.baseUrl}${endpoint}`;
        logger.api('POST', url);
        return this.apiContext.post(url, {
            headers: this.getHeaders(),
            data: payload,
        });
    }

    async put(endpoint: string, payload: Record<string, unknown>) {
        const url = `${this.baseUrl}${endpoint}`;
        logger.api('PUT', url);
        return this.apiContext.put(url, {
            headers: this.getHeaders(),
            data: payload,
        });
    }

    async delete(endpoint: string) {
        const url = `${this.baseUrl}${endpoint}`;
        logger.api('DELETE', url);
        return this.apiContext.delete(url, {
            headers: this.getHeaders(),
        });
    }

    // ── Response Helpers ────────────────────────────────────────

    async getJsonResponse(response: any) {
        return response.json();
    }

    async assertStatus(response: any, expectedStatus: number) {
        if (response.status() !== expectedStatus) {
            throw new Error(
                `Expected status ${expectedStatus}, got ${response.status()}. Response: ${await response.text()}`,
            );
        }
    }
}