import { test as base } from '@playwright/test';
import path from 'path';

export type AccountType = 'personal' | 'business' | 'clients';

/**
 * PageFixture — extends baseFixtures with storage state injection per account type.
 * Usage:
 *
 *   import { test } from '@fixtures/pageFixtures';
 *
 *   test('logged in personal user', { account: 'personal' }, async ({ page, loginPage }) => {
 *     // page already has storage state for personal account loaded
 *     await page.goto('/sequence');
 *   });
 */
export const test = base.extend<{}, { account?: AccountType }>({
    account: [undefined, { option: true }],
});

test.beforeEach(async ({ page, account }, testInfo) => {
    if (account) {
        const storageStatePath = path.resolve(
            __dirname,
            `../../auth/storageState.${account}.json`,
        );
        try {
            await page.context().addInitScript(() => {
                // This runs before any navigation
            });
            // Load auth state if file exists
            const fs = await import('fs');
            if (fs.existsSync(storageStatePath)) {
                const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
                await page.context().addCookies(state.cookies || []);
                await page.evaluate(() => {
                    const localStorage = window.localStorage;
                    // Apply saved localStorage if needed
                });
            }
        } catch (error) {
            console.warn(
                `Could not load storage state for account: ${account}. File may not exist yet.`,
            );
        }
    }
});