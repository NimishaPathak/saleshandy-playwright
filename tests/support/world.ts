import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

/**
 * CustomWorld — shares Playwright browser, context and page across all steps.
 * Loads storage state from auth/ folder if available — skips login entirely.
 */
export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    testEmail?: string;
    testPassword?: string;
    accountType?: string;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async openBrowser(accountType?: string): Promise<void> {
        this.browser = await chromium.launch({
            headless: process.env.HEADLESS !== 'false',
        });

        // Load storage state if available for this account type
        let storageState: any = undefined;
        if (accountType) {
            const statePath = path.resolve(
                __dirname, `../../auth/storageState.${accountType}.json`
            );
            if (fs.existsSync(statePath)) {
                try {
                    storageState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
                    console.log(`  [Auth] Loaded storage state for: ${accountType}`);
                } catch {
                    console.warn(`  [Auth] Could not load storage state for: ${accountType}`);
                }
            }
        }

        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 720 },
            locale: 'en-US',
            timezoneId: 'Asia/Kolkata',
            storageState: storageState || undefined,
        });

        this.page = await this.context.newPage();
    }

    async closeBrowser(): Promise<void> {
        await this.context?.close();
        await this.browser?.close();
    }
}

setWorldConstructor(CustomWorld);

export function getPage(world: unknown): Page {
    const customWorld = world as CustomWorld;
    if (!customWorld.page) {
        throw new Error('Page not initialized. Make sure openBrowser() was called in Before hook.');
    }
    return customWorld.page;
}

export function getWorld(world: unknown): CustomWorld {
    return world as CustomWorld;
}