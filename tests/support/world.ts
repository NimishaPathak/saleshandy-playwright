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
    testEmail?: string;
    testPassword?: string;
    accountType?: string;

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
 * getPage — safely casts Cucumber's IWorld<any> to CustomWorld and returns the page.
 * This resolves the TypeScript error:
 * "Argument of type 'IWorld<any>' is not assignable to parameter of type 'CustomWorld'"
 *
 * Usage in step definitions:
 *   const page = getPage(this);
 */
export function getPage(world: unknown): Page {
    const customWorld = world as CustomWorld;
    if (!customWorld.page) {
        throw new Error(
            'Page not initialized. Make sure openBrowser() was called in the Before hook.',
        );
    }
    return customWorld.page;
}

/**
 * getWorld — casts this context to CustomWorld for accessing extra properties.
 * Use when you need testEmail, testPassword, or accountType from the world.
 */
export function getWorld(world: unknown): CustomWorld {
    return world as CustomWorld;
}