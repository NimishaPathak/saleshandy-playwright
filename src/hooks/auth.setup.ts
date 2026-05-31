import { chromium, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const BASE_URL = 'https://my.saleshandy.com';
const AUTH_DIR = path.resolve(__dirname, '../../auth');

// ── Single account — run once per account type ─────────────────
// Usage:
//   npm run auth:setup -- personal
//   npm run auth:setup -- business
//   npm run auth:setup -- clients

const accountType = (process.argv[2] || 'personal') as 'personal' | 'business' | 'clients';

const EMAIL = process.env.PERSONAL_EMAIL || 'nimishapathak29@gmail.com';
const PASSWORD = process.env.PERSONAL_PASSWORD || 'QaAssignment@123';

const onboardingConfig = {
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

async function doSignup(page: Page): Promise<void> {
    console.log(`  → Going to signup page...`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.locator('input[placeholder="John"]').fill('QA');
    await page.locator('input[placeholder="Doe"]').fill('Automation');
    await page.locator('input[placeholder="johndoe@example.com"]').fill(EMAIL);
    await page.locator('input[placeholder="Minimum 8 Characters"]').fill(PASSWORD);
    await page.waitForTimeout(500);

    // Submit button — not SSO buttons
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/sequence\?signup=completed/, { timeout: 30000 });
    console.log(`  ✅ Signup successful`);
}

// ── Login ─────────────────────────────────────────────────────

async function doLogin(page: Page): Promise<boolean> {
    console.log(`  → Going to login page...`);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(EMAIL);

    await page.locator('input[type="password"]').first().fill(PASSWORD);

    // Click submit — not SSO buttons
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(4000);

    const url = page.url();
    console.log(`  → After login URL: ${url}`);
    return !url.includes('/login') && !url.includes('/signup');
}

// ── Onboarding ────────────────────────────────────────────────

async function completeOnboarding(page: Page): Promise<void> {
    const config = onboardingConfig[accountType];
    console.log(`  → Completing onboarding for: ${config.accountType}`);

    // Wait for modal
    await page.waitForSelector("text=Let's shape your experience", { timeout: 20000 });
    await page.waitForTimeout(1000);

    // Step 1 — Account type
    await page.getByText(config.accountType, { exact: true }).click();
    console.log(`  → Step 1 done: ${config.accountType}`);
    await page.waitForTimeout(1200);

    // Step 2
    await page.getByRole('button', { name: config.step2 }).first().click();
    console.log(`  → Step 2 done: ${config.step2}`);
    await page.waitForTimeout(1200);

    // Step 3
    await page.getByRole('button', { name: config.step3 }).first().click();
    console.log(`  → Step 3 done: ${config.step3}`);
    await page.waitForTimeout(1200);

    // Step 4
    await page.getByRole('button', { name: config.step4 }).first().click();
    console.log(`  → Step 4 done: ${config.step4}`);
    await page.waitForTimeout(1200);

    // Step 5 — Business & Clients only
    if (config.step5) {
        await page.getByRole('button', { name: config.step5 }).first().click();
        console.log(`  → Step 5 done: ${config.step5}`);
        await page.waitForTimeout(1200);
    }

    // Welcome modal → Let's Start
    await page.waitForSelector('text=Welcome to Saleshandy', { timeout: 20000 });
    await page.getByRole('button', { name: /Let's Start/i }).click();
    await page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, { timeout: 25000 });
    console.log(`  ✅ Onboarding complete — on dashboard`);
}

// ── Main ──────────────────────────────────────────────────────

async function setupAuth() {
    console.log(`\n🔐 Auth Setup — Account Type: ${accountType.toUpperCase()}`);
    console.log(`   Email: ${EMAIL}\n`);

    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    try {
        // Try login first
        const loginOk = await doLogin(page);

        if (loginOk) {
            console.log(`  ✅ Login successful`);

            // Check if onboarding still pending
            const needsOnboarding = await page
                .getByText("Let's shape your experience")
                .isVisible({ timeout: 4000 })
                .catch(() => false);

            if (needsOnboarding) {
                await completeOnboarding(page);
            } else {
                console.log(`  → Already on dashboard — no onboarding needed`);
            }

        } else {
            // Login failed — try signup
            console.log(`  → Login failed — trying signup...`);
            await doSignup(page);
            await completeOnboarding(page);
        }

        // Stable state
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Save storage state
        const storageState = await context.storageState();
        const outputPath = path.join(AUTH_DIR, `storageState.${accountType}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(storageState, null, 2));
        console.log(`\n  💾 Saved: auth/storageState.${accountType}.json`);

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`  ✅ ${accountType.toUpperCase()} auth setup complete!`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        if (accountType === 'personal') {
            console.log(`\n  ⏭  NEXT STEPS:`);
            console.log(`  1. Go to my.saleshandy.com → Settings → My Profile → Delete Account`);
            console.log(`  2. Then run: npm run auth:setup -- business`);
        } else if (accountType === 'business') {
            console.log(`\n  ⏭  NEXT STEPS:`);
            console.log(`  1. Go to my.saleshandy.com → Settings → My Profile → Delete Account`);
            console.log(`  2. Then run: npm run auth:setup -- clients`);
        } else {
            console.log(`\n  🎉 ALL 3 STORAGE STATES SAVED!`);
            console.log(`  Run: npm test`);
        }

    } catch (error) {
        console.error(`  ❌ Error:`, error);
    } finally {
        await context.close();
        await browser.close();
    }
}

setupAuth().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
});