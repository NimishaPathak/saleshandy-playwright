import { chromium, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const BASE_URL = 'https://my.saleshandy.com';
const AUTH_DIR = path.resolve(__dirname, '../../auth');

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
    console.log(`  → Navigating to signup page...`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.locator('input[placeholder="John"]').fill('QA');
    await page.locator('input[placeholder="Doe"]').fill('Automation');
    await page.locator('input[placeholder="johndoe@example.com"]').fill(EMAIL);
    await page.locator('input[placeholder="Minimum 8 Characters"]').fill(PASSWORD);
    await page.waitForTimeout(500);

    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/sequence\?signup=completed/, { timeout: 30000 });
    console.log(`  ✅ Signup successful — onboarding page loaded`);
}

// ── Onboarding ────────────────────────────────────────────────

async function completeOnboarding(page: Page): Promise<void> {
    const config = onboardingConfig[accountType];
    console.log(`  → Starting onboarding for: ${config.accountType}`);
    await page.waitForTimeout(2000);

    // Step 1 — Account type selection
    await page.getByText(config.accountType, { exact: true }).click();
    console.log(`  → Step 1 done: ${config.accountType}`);
    await page.waitForTimeout(1500);

    // Step 2
    await page.getByRole('button', { name: config.step2 }).first().click();
    console.log(`  → Step 2 done: ${config.step2}`);
    await page.waitForTimeout(1500);

    // Step 3
    await page.getByRole('button', { name: config.step3 }).first().click();
    console.log(`  → Step 3 done: ${config.step3}`);
    await page.waitForTimeout(1500);

    // Step 4
    await page.getByRole('button', { name: config.step4 }).first().click();
    console.log(`  → Step 4 done: ${config.step4}`);
    await page.waitForTimeout(1500);

    // Step 5 — Business & Clients only
    if (config.step5) {
        await page.getByRole('button', { name: config.step5 }).first().click();
        console.log(`  → Step 5 done: ${config.step5}`);
        await page.waitForTimeout(1500);
    }

    // Welcome modal → Let's Start
    await page.waitForSelector('text=Welcome to Saleshandy', { timeout: 20000 });
    await page.getByRole('button', { name: /Let's Start/i }).click();
    await page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, { timeout: 25000 });
    console.log(`  ✅ Onboarding complete — on dashboard`);
}

// ── Main ──────────────────────────────────────────────────────

async function setupAuth() {
    console.log(`\n🔐 Auth Setup — [${accountType.toUpperCase()}]`);
    console.log(`   Email   : ${EMAIL}`);
    console.log(`   Password: ${PASSWORD}\n`);

    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    try {
        // Signup fresh — account must be deleted before running each type
        await doSignup(page);

        // Complete onboarding for this account type
        await completeOnboarding(page);

        // Wait for stable dashboard state
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
        await page.waitForTimeout(2000);

        // Save storage state
        const storageState = await context.storageState();
        const outputPath = path.join(AUTH_DIR, `storageState.${accountType}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(storageState, null, 2));

        console.log(`\n  💾 Saved: auth/storageState.${accountType}.json`);
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`  ✅ ${accountType.toUpperCase()} done!`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        if (accountType === 'personal') {
            console.log(`  ⏭  NEXT:`);
            console.log(`  1. Delete account: Settings → My Profile → Delete Account`);
            console.log(`  2. Run: npm run auth:business\n`);
        } else if (accountType === 'business') {
            console.log(`  ⏭  NEXT:`);
            console.log(`  1. Delete account: Settings → My Profile → Delete Account`);
            console.log(`  2. Run: npm run auth:clients\n`);
        } else {
            console.log(`  🎉 ALL 3 STORAGE STATES SAVED!`);
            console.log(`  Run BDD tests: npm test\n`);
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