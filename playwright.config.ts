import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export default defineConfig({
    // ── API tests directory (Playwright native runner) ──────────
    testDir: './tests/api-tests',

    // ── Global settings ──────────────────────────────────────────
    timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
    expect: {
        timeout: 10000,
    },
    fullyParallel: false,
    forbidOnly: false,
    retries: 1,
    workers: 1,

    // ── Reporters ────────────────────────────────────────────────
    reporter: [
        ['list'],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: true,
        }],
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ],

    // ── Shared browser settings ──────────────────────────────────
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
        // ── Auth setup (runs once before all tests) ───────────────
        {
            name: 'auth:personal',
            testMatch: '**/hooks/auth.setup.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── API tests (no browser, no auth needed) ────────────────
        {
            name: 'api',
            testMatch: '**/api-tests/**/*.spec.ts',
            use: {
                ...devices['Desktop Chrome'],
                extraHTTPHeaders: {
                    'x-api-key': process.env.API_KEY || '',
                    'Content-Type': 'application/json',
                },
            },
        },

        // ── UI tests: Chromium ────────────────────────────────────
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: path.resolve(__dirname, 'auth/storageState.personal.json'),
            },
            dependencies: ['auth:personal'],
        },

        // ── UI tests: Firefox ─────────────────────────────────────
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: path.resolve(__dirname, 'auth/storageState.personal.json'),
            },
            dependencies: ['auth:personal'],
        },
    ],

    // ── Output folders ───────────────────────────────────────────
    outputDir: 'test-results',
});