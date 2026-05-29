import { Page, Locator, expect } from '@playwright/test';
import { logger } from '@utils/logger';

/**
 * BasePage — parent class for all Page Objects.
 * Implements Pramod Dutta's hybrid locator strategy:
 * - Primary: page.locator() with stable CSS/ID selectors
 * - Semantic: getByRole(), getByText(), getByLabel() where appropriate
 * All locators are returned as Locator objects from getter methods.
 */
export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ── Navigation ───────────────────────────────────────────────

    async navigateTo(url: string): Promise<void> {
        logger.step(`Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return this.page.title();
    }

    async waitForUrl(urlPattern: string | RegExp, timeout = 15000): Promise<void> {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    // ── Element interactions ─────────────────────────────────────

    async clickElement(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async fillField(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.clear();
        await locator.fill(value);
    }

    async selectOption(locator: Locator, optionText: string): Promise<void> {
        await locator.waitFor({ state: 'visible' });
        await locator.selectOption({ label: optionText });
    }

    async getTextContent(locator: Locator): Promise<string> {
        await locator.waitFor({ state: 'visible' });
        return (await locator.textContent()) ?? '';
    }

    async isVisible(locator: Locator): Promise<boolean> {
        return locator.isVisible();
    }

    async isEnabled(locator: Locator): Promise<boolean> {
        return locator.isEnabled();
    }

    // ── Waits ────────────────────────────────────────────────────

    async waitForElement(locator: Locator, timeout = 10000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForElementHidden(locator: Locator, timeout = 10000): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    async waitForNetworkIdle(timeout = 10000): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    // ── Assertions (wrapped for cleaner step definitions) ────────

    async assertVisible(locator: Locator, message?: string): Promise<void> {
        await expect(locator, message).toBeVisible();
    }

    async assertText(locator: Locator, expectedText: string): Promise<void> {
        await expect(locator).toHaveText(expectedText);
    }

    async assertContainsText(locator: Locator, expectedText: string): Promise<void> {
        await expect(locator).toContainText(expectedText);
    }

    async assertUrl(expectedUrl: string | RegExp): Promise<void> {
        await expect(this.page).toHaveURL(expectedUrl);
    }

    async assertNotVisible(locator: Locator): Promise<void> {
        await expect(locator).not.toBeVisible();
    }

    async assertEnabled(locator: Locator): Promise<void> {
        await expect(locator).toBeEnabled();
    }

    async assertDisabled(locator: Locator): Promise<void> {
        await expect(locator).toBeDisabled();
    }

    // ── Screenshot ───────────────────────────────────────────────

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({
            path: `allure-results/screenshots/${name}-${Date.now()}.png`,
            fullPage: true,
        });
    }

    // ── Scroll ───────────────────────────────────────────────────

    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }
}