import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { SignupHelper } from '@helpers/signupHelper';
import { OnboardingHelper } from '@helpers/onboardingHelper';
import { DashboardPage } from '@pages/DashboardPage';
import { logger } from '@utils/logger';
import { AccountType, generateSignupData } from '@utils/randomData';

/**
 * Global Setup — runs ONCE before any tests.
 * Generates and saves storage state for each account type:
 * - auth/storageState.personal.json
 * - auth/storageState.business.json
 * - auth/storageState.clients.json
 *
 * These files are then used by all subsequent tests via playwright.config.ts.
 * This means tests skip login entirely — huge speed boost!
 */

const accountTypes: AccountType[] = ['personal', 'business', 'clients'];

for (const accountType of accountTypes) {
    setup(`auth setup: ${accountType}`, async ({ browser }) => {
        logger.step(`Setting up auth for ${accountType} account`);

        const context = await browser.newContext();
        const page = await context.newPage();

        try {
            const signupHelper = new SignupHelper(page);
            const onboardingHelper = new OnboardingHelper(page);
            const dashboardPage = new DashboardPage(page);

            // ── Step 1: Signup ────────────────────────────────────────
            logger.step(`[${accountType}] Step 1: Signup`);
            const signupData = await signupHelper.signUpWithGeneratedData(accountType);

            // Store credentials for reference (optional — useful for debugging)
            logger.info(`Credentials for ${accountType}: ${signupData.email} / ${signupData.password}`);

            // ── Step 2: Complete Onboarding ───────────────────────────
            logger.step(`[${accountType}] Step 2: Onboarding`);
            await onboardingHelper.completeOnboarding(accountType);

            // ── Step 3: Verify Dashboard ──────────────────────────────
            logger.step(`[${accountType}] Step 3: Dashboard verification`);
            await dashboardPage.assertDashboardLoaded();
            await onboardingHelper.verifyAccountTypeUI(accountType);

            // ── Step 4: Save Storage State ────────────────────────────
            logger.step(`[${accountType}] Step 4: Saving storage state`);
            const storageState = await context.storageState();
            const outputDir = path.resolve(__dirname, '../../auth');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const outputPath = path.join(outputDir, `storageState.${accountType}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(storageState, null, 2));

            logger.success(`Storage state saved: ${outputPath}`);
            logger.success(`${accountType} account setup complete\n`);
        } catch (error) {
            logger.error(`Setup failed for ${accountType}`, error);
            throw error;
        } finally {
            await context.close();
        }
    });
}