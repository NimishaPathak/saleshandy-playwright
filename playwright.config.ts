import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    // ── Global settings ──────────────────────────────────────────
    timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
    expect: { timeout: 10000 },
    fullyParallel: false,
    forbidOnly: false,
    retries: 1,
    workers: 1,

    // ── Reporters ────────────────────────────────────────────────
    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],

    // ── Shared settings ──────────────────────────────────────────
    use: {
        baseURL: process.env.BASE_URL || 'https://my.saleshandy.com',
        headless: process.env.HEADLESS !== 'false',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        actionTimeout: 15000,
        navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
        timezoneId: 'Asia/Kolkata',
    },

    // ── Projects ─────────────────────────────────────────────────
    projects: [
        // ── API tests ONLY — no browser context ──────────────────
        {
            name: 'api',
            testDir: './tests/api-tests',
            testMatch: '**/*.spec.ts',
            use: {
                // No browser — pure HTTP via APIRequestContext
                extraHTTPHeaders: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            },
        },
    ],

    outputDir: 'test-results',
});