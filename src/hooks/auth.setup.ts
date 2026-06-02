import { chromium, Page, BrowserContext } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

dotenv.config();

const BASE_URL = "https://my.saleshandy.com";
const AUTH_DIR = path.resolve(__dirname, "../../auth");
const EMAIL = process.env.PERSONAL_EMAIL || "nimishapathak29@gmail.com";
const PASSWORD = process.env.PERSONAL_PASSWORD || "QaAssignment@123";

const accountTypes = ["personal", "business", "clients"] as const;
type AccountType = typeof accountTypes[number];

/**
 * Onboarding steps — confirmed from live UI (June 2026)
 *
 * Personal Use (6 steps):
 *   1. Account Type: Personal Use
 *   2. Occupation: Freelancer
 *   3. Primary Goal: Generate Leads for my Business
 *   4. Usage: Cold Outreach  ← "How would you use Saleshandy?"
 *   5. Email Volume: 0 - 30K
 *   6. Welcome → Let's Start
 *
 * Business (6 steps):
 *   1. Account Type: Business
 *   2. Primary Goal: Generate B2B Leads / Book Meetings
 *   3. Experience: No, I have not
 *   4. Usage: Cold Outreach
 *   5. Discovery: Google
 *   6. Welcome → Let's Start
 *
 * Clients (6 steps):
 *   1. Account Type: Clients
 *   2. Agency Type: Digital Marketing Agency
 *   3. Client Count: 6 - 20
 *   4. Email Volume: 0 - 30K
 *   5. Discovery: Google
 *   6. Welcome → Let's Start
 */
const onboardingSteps: Record<AccountType, string[]> = {
    personal: [
        "Personal Use",
        "Freelancer",
        "Generate Leads for my Business",
        "Cold Outreach",
        "0 - 30K",
        "Google",                          // Step 6 — How did you find us?
    ],
    business: [
        "Business",                              // Step 1 — account type
        "Generate B2B Leads / Book Meetings",    // Step 2 — primary goal
        "No, I have not",                        // Step 3 — experience
        "Cold Outreach",                         // Step 4 — usage
        "Google",                                // Step 5 — discovery
    ],
    clients: [
        "Clients",                         // Step 1 — account type
        "Digital Marketing Agency",        // Step 2 — agency type
        "6 - 20",                          // Step 3 — client count
        "0 - 30K",                         // Step 4 — email volume
        "Google",                          // Step 5 — discovery
    ],
};

// ── Signup ────────────────────────────────────────────────────

async function doSignup(page: Page): Promise<void> {
    console.log(`\n  Signing up: ${EMAIL}`);
    await page.goto(`${BASE_URL}/signup`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2000);

    await page.locator('input[placeholder="John"]').fill("QA");
    await page.locator('input[placeholder="Doe"]').fill("Automation");
    await page.locator('input[placeholder="johndoe@example.com"]').fill(EMAIL);
    await page.locator('input[placeholder="Minimum 8 Characters"]').fill(PASSWORD);
    await page.waitForTimeout(500);
    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/sequence\?signup=completed/, { timeout: 30000 });
    console.log("  Signup successful");
}

// ── Onboarding ────────────────────────────────────────────────

async function completeOnboarding(page: Page, type: AccountType): Promise<void> {
    const steps = onboardingSteps[type];
    console.log(`\n  Onboarding: ${type.toUpperCase()}`);
    await page.waitForTimeout(2000);

    for (let i = 0; i < steps.length; i++) {
        const stepText = steps[i];
        const stepNum = i + 1;

        console.log(`  Step ${stepNum}: ${stepText}`);

        if (i === 0) {
            // Step 1 — account type uses text click (radio label)
            await page.getByText(stepText, { exact: true }).click();
        } else {
            // All other steps — button click
            await page.getByRole("button", { name: stepText }).first().click();
        }

        await page.waitForTimeout(1500);
    }

    // Final — Welcome modal → Let's Start
    await page.waitForSelector("text=Welcome to Saleshandy", { timeout: 20000 });
    await page.getByRole("button", { name: /Let.s Start/i }).click();
    await page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, { timeout: 25000 });
    console.log("  Onboarding complete ✅");
}

// ── Save storage state ────────────────────────────────────────

async function saveStorageState(context: BrowserContext, type: AccountType): Promise<void> {
    if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
    const storageState = await context.storageState();
    const outputPath = path.join(AUTH_DIR, `storageState.${type}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(storageState, null, 2));
    console.log(`\n  Saved: auth/storageState.${type}.json`);
}

// ── Run BDD tests ─────────────────────────────────────────────

function runTests(type: AccountType): void {
    console.log(`\n  Running tests: @${type}`);
    try {
        execSync(`npx cucumber-js --tags @${type}`, {
            stdio: "inherit",
            cwd: path.resolve(__dirname, "../../"),
        });
    } catch {
        console.log(`  Some tests failed — continuing...`);
    }
}

// ── Delete account ────────────────────────────────────────────

async function deleteAccount(page: Page): Promise<void> {
    console.log("\n  Deleting account...");
    try {
        await page.goto(`${BASE_URL}/settings/profile`, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(3000);

        // Scroll to find delete button
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1000);

        await page.getByRole("button", { name: /delete account/i }).first().click({ timeout: 10000 });
        await page.waitForTimeout(1500);

        // Confirm dialog
        const confirmBtn = page.getByRole("button", { name: /confirm|yes.*delete|delete.*account|proceed/i }).first();
        if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.click();
            await page.waitForTimeout(2000);
        }

        // Password confirmation if needed
        const passwordField = page.locator('input[type="password"]').first();
        if (await passwordField.isVisible({ timeout: 2000 })) {
            await passwordField.fill(PASSWORD);
            await page.getByRole("button", { name: /confirm|delete|proceed/i }).first().click();
            await page.waitForTimeout(2000);
        }

        console.log("  Account deleted ✅");
    } catch {
        console.log("\n  Auto-delete failed — please delete manually:");
        console.log(`  ${BASE_URL}/settings/profile → Delete Account`);
        console.log("  Press ENTER when done...");
        await new Promise<void>((resolve) => {
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            process.stdin.once("data", () => { process.stdin.pause(); resolve(); });
        });
        console.log("  Continuing...");
    }
}

// ── Main ──────────────────────────────────────────────────────

async function runAll() {
    const args = process.argv.slice(2);
    const filterType = args[0] as AccountType | undefined;
    const typesToRun = filterType ? [filterType] : [...accountTypes];

    console.log(`\nSALESHANDY TEST RUN — Email: ${EMAIL}`);
    console.log(`Running: ${typesToRun.join(", ")}\n`);

    const browser = await chromium.launch({ headless: false });

    for (let i = 0; i < typesToRun.length; i++) {
        const type = typesToRun[i];
        const isLast = i === typesToRun.length - 1;

        console.log(`\n${"─".repeat(40)}`);
        console.log(`[${i + 1}/${typesToRun.length}] ${type.toUpperCase()}`);
        console.log(`${"─".repeat(40)}`);

        const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
        const page = await context.newPage();

        try {
            await doSignup(page);
            await completeOnboarding(page, type);
            await saveStorageState(context, type);
            runTests(type);
            if (!isLast) await deleteAccount(page);
        } catch (error) {
            console.error(`  Error during ${type}:`, error);
        } finally {
            await context.close();
        }
    }

    await browser.close();
    console.log("\nALL DONE!");
}

runAll().catch((err) => { console.error("Fatal:", err); process.exit(1); });