import { chromium, Page, BrowserContext } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { generateUniqueEmail } from '@utils/randomData';

dotenv.config();

const BASE_URL = 'https://my.saleshandy.com';
const AUTH_DIR = path.resolve(__dirname, '../../auth');

const PASSWORD = process.env.PERSONAL_PASSWORD || 'QaAssignment@123';

const accountTypes = ['personal', 'business', 'clients'] as const;
type AccountType = typeof accountTypes[number];

const onboardingConfig: Record<AccountType, {
    accountType: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
}> = {
    personal: {
        accountType: 'Personal Use',
        step2: 'Freelancer',
        step3: 'Cold Outreach',
        step4: '0 - 30K',
        step5: '',
    },
    business: {
        accountType: 'Business',
        step2: 'Generate B2B Leads / Book Meetings',
        step3: 'No, I have not',
        step4: 'Cold Outreach',
        step5: 'Google',
    },
    clients: {
        accountType: 'Clients',
        step2: 'Digital Marketing Agency',
        step3: '6 - 20',
        step4: '0 - 30K',
        step5: 'Google',
    },
};

// ── Signup ────────────────────────────────────────────────────

async function doSignup(page: Page, email: string): Promise<void> {
    console.log(`\n  📝 Signing up with: ${email}`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(2000);

    const firstNameInput = page.locator('input[placeholder="John"]');
    const lastNameInput = page.locator('input[placeholder="Doe"]');
    const emailInput = page.locator('input[placeholder="johndoe@example.com"]');
    const passwordInput = page.locator('input[placeholder="Minimum 8 Characters"]');

    await firstNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await firstNameInput.fill('QA');
    await lastNameInput.fill('Automation');
    await emailInput.fill(email);
    await passwordInput.fill(PASSWORD);
    await page.waitForTimeout(500);

    // Self-healing double-check for form fields (SPA re-render protection)
    if (await emailInput.inputValue() !== email) {
        console.log('  ⚠️ Email field cleared or truncated, refilling...');
        await emailInput.fill(email);
    }
    if (await passwordInput.inputValue() !== PASSWORD) {
        console.log('  ⚠️ Password field cleared or truncated, refilling...');
        await passwordInput.fill(PASSWORD);
    }
    if (await firstNameInput.inputValue() !== 'QA') {
        await firstNameInput.fill('QA');
    }
    if (await lastNameInput.inputValue() !== 'Automation') {
        await lastNameInput.fill('Automation');
    }

    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/sequence\?signup=completed/, { timeout: 45000 });
    console.log(`  ✅ Signup successful`);
}

// ── Onboarding ────────────────────────────────────────────────

async function completeOnboarding(page: Page, type: AccountType): Promise<void> {
    const config = onboardingConfig[type];
    console.log(`\n  🧭 Completing onboarding: ${config.accountType}`);
    await page.waitForTimeout(2000);

    // Step 1 — Account type
    await page.getByText(config.accountType, { exact: true }).click();
    console.log(`  → Step 1: ${config.accountType}`);
    await page.waitForTimeout(1500);

    // Step 2
    await page.getByRole('button', { name: config.step2 }).first().click();
    console.log(`  → Step 2: ${config.step2}`);
    await page.waitForTimeout(1500);

    // Step 3
    await page.getByRole('button', { name: config.step3 }).first().click();
    console.log(`  → Step 3: ${config.step3}`);
    await page.waitForTimeout(1500);

    // Step 4
    await page.getByRole('button', { name: config.step4 }).first().click();
    console.log(`  → Step 4: ${config.step4}`);
    await page.waitForTimeout(1500);

    // Step 5 — Business & Clients only
    if (config.step5) {
        await page.getByRole('button', { name: config.step5 }).first().click();
        console.log(`  → Step 5: ${config.step5}`);
        await page.waitForTimeout(1500);
    }

    // Welcome modal
    await page.waitForSelector('text=Welcome to Saleshandy', { timeout: 20000 });
    await page.getByRole('button', { name: /Let's Start/i }).click();
    await page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, { timeout: 25000 });
    console.log(`  ✅ Onboarding complete`);
}

// ── Save storage state ────────────────────────────────────────

async function saveStorageState(context: BrowserContext, type: AccountType): Promise<void> {
    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
    const storageState = await context.storageState();
    const outputPath = path.join(AUTH_DIR, `storageState.${type}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(storageState, null, 2));
    console.log(`\n  💾 Session saved: auth/storageState.${type}.json`);
}

// ── Run BDD tests for account type ───────────────────────────

function runTests(type: AccountType): void {
    console.log(`\n  🧪 Running BDD tests for: ${type.toUpperCase()}`);
    console.log(`  ─────────────────────────────────────`);
    try {
        execSync(`npx cucumber-js --tags @${type}`, {
            stdio: 'inherit',
            cwd: path.resolve(__dirname, '../../'),
        });
        console.log(`  ✅ Tests complete for ${type.toUpperCase()}`);
    } catch {
        // cucumber-js exits with non-zero if tests fail — that's ok, continue
        console.log(`  ⚠️  Some tests failed for ${type.toUpperCase()} — continuing...`);
    }
}

// ── Delete account ────────────────────────────────────────────

async function deleteAccount(page: Page, email: string): Promise<void> {
    console.log(`\n  🗑️  Deleting account...`);
    try {
        await page.goto(`${BASE_URL}/settings/profile`, {
            waitUntil: 'domcontentloaded',
            timeout: 20000,
        });
        await page.waitForTimeout(2000);

        // Look for Delete Account button/link
        const deleteBtn = page.getByRole('button', { name: /delete account/i })
            .or(page.getByText(/delete account/i))
            .first();

        await deleteBtn.waitFor({ state: 'visible', timeout: 10000 });
        await deleteBtn.click();
        await page.waitForTimeout(1500);

        // Confirm deletion dialog
        const confirmBtn = page.getByRole('button', { name: /confirm|yes|delete|proceed/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
        }

        // Some apps ask for email/password confirmation
        const emailConfirm = page.locator('input[type="email"]').first();
        if (await emailConfirm.isVisible({ timeout: 2000 })) {
            await emailConfirm.fill(email);
            const submitBtn = page.getByRole('button', { name: /confirm|delete/i }).first();
            await submitBtn.click();
            await page.waitForTimeout(2000);
        }

        console.log(`  ✅ Account deleted`);
    } catch (error) {
        console.log(`  ⚠️  Auto-delete failed — please delete manually`);
        console.log(`  → Go to: ${BASE_URL}/settings/profile → Delete Account`);
        console.log(`  → Press Enter here when done...`);

        // Wait for manual deletion
        await new Promise<void>((resolve) => {
            process.stdin.once('data', () => resolve());
        });
    }
}

// ── Main ──────────────────────────────────────────────────────

async function runAll() {
    const args = process.argv.slice(2);
    const filterType = args[0] as AccountType | undefined;
    const typesToRun = filterType ? [filterType] : accountTypes;

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  🚀 SALESHANDY FULL TEST RUN`);
    console.log(`${'═'.repeat(50)}\n`);

    const browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });

    for (const type of typesToRun) {
        const email = generateUniqueEmail(`qa${type}`);
        console.log(`\n${'─'.repeat(50)}`);
        console.log(`  ACCOUNT TYPE: ${type.toUpperCase()}`);
        console.log(`  Email: ${email}`);
        console.log(`${'─'.repeat(50)}`);

        const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
        const page = await context.newPage();

        try {
            // 1. Signup
            await doSignup(page, email);

            // 2. Complete onboarding
            await completeOnboarding(page, type);

            // 3. Save storage state
            await saveStorageState(context, type);

            // 4. Run BDD tests for this account type
            runTests(type);

            // 5. Delete account (ready for next type)
            if (type !== 'clients') {
                await deleteAccount(page, email);
            }

        } catch (error) {
            console.error(`\n  ❌ Error during ${type}:`, error);
            try {
                const screenshotPath = path.resolve(__dirname, `../../error-${type}.png`);
                await page.screenshot({ path: screenshotPath, fullPage: true });
                console.log(`  📸 Screenshot saved to: ${screenshotPath}`);
            } catch (err) {
                console.log(`  ⚠️  Failed to take screenshot:`, err);
            }
        } finally {
            await context.close();
        }
    }

    await browser.close();

    console.log(`\n${'═'.repeat(50)}`);
    console.log(`  🎉 ALL DONE!`);
    console.log(`  Storage states saved in: auth/`);
    console.log(`  Run full suite anytime: npm test`);
    console.log(`${'═'.repeat(50)}\n`);
}

runAll().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
});