import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * CustomWorld — shares Playwright browser, context and page across all steps.
 * Cucumber's World object is instantiated fresh for each scenario.
 */
export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    testEmail?: string;       // Store generated email for cross-step use
    testPassword?: string;    // Store generated password for cross-step use
    accountType?: string;     // Store account type for cross-step assertions

    constructor(options: IWorldOptions) {
        super(options);
    }

    async openBrowser(): Promise<void> {
        this.browser = await chromium.launch({
            headless: process.env.HEADLESS !== 'false',
        });
        this.context = await this.browser.newContext({
            viewport: { width: 1280, height: 720 },
            locale: 'en-US',
            timezoneId: 'Asia/Kolkata',
        });
        this.page = await this.context.newPage();
    }

    async closeBrowser(): Promise<void> {
        await this.context?.close();
        await this.browser?.close();
    }
}

setWorldConstructor(CustomWorld);

/**
 * Helper to get the page from the Cucumber World context.
 * Used in all step definition files.
 */
export function getPage(world: CustomWorld): Page {
    if (!world.page) {
        throw new Error('Page not initialized. Make sure openBrowser() was called in Before hook.');
    }
    return world.page;
}