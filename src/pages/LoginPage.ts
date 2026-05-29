import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

/**
 * LoginPage — handles my.saleshandy.com/auth/login
 * Used by auth.setup.ts to create storage state per account type.
 */
export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ── Locators (Pramod's pattern — getters returning Locator) ──

    get emailInput(): Locator {
        return this.page.locator('input[type="email"], input[name="email"]');
    }

    get passwordInput(): Locator {
        return this.page.locator('input[type="password"]');
    }

    get loginButton(): Locator {
        return this.page.getByRole('button', { name: /log in|sign in/i });
    }

    get googleLoginButton(): Locator {
        return this.page.getByRole('button', { name: /sign in with google/i });
    }

    get microsoftLoginButton(): Locator {
        return this.page.getByRole('button', { name: /sign in with microsoft/i });
    }

    get forgotPasswordLink(): Locator {
        return this.page.getByRole('link', { name: /forgot password/i });
    }

    get signupLink(): Locator {
        return this.page.getByRole('link', { name: /sign up|create account/i });
    }

    get errorMessage(): Locator {
        return this.page.locator('[class*="error"], [class*="alert"], [role="alert"]');
    }

    // ── Actions ──────────────────────────────────────────────────

    async navigate(): Promise<void> {
        await this.navigateTo(`${process.env.BASE_URL}/auth/login`);
    }

    async login(email: string, password: string): Promise<void> {
        logger.step(`Logging in as: ${email}`);
        await this.fillField(this.emailInput, email);
        await this.fillField(this.passwordInput, password);
        await this.clickElement(this.loginButton);
        logger.success('Login form submitted');
    }

    async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
        await this.navigate();
        await this.login(email, password);
        // Wait for redirect to sequence/dashboard — handles both onboarding and direct dashboard
        await this.page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, {
            timeout: 30000,
        });
        logger.success(`Logged in successfully — URL: ${this.page.url()}`);
    }

    // ── Assertions ───────────────────────────────────────────────

    async assertLoginPageLoaded(): Promise<void> {
        await this.assertVisible(this.emailInput);
        await this.assertVisible(this.passwordInput);
        await this.assertVisible(this.loginButton);
        logger.success('Login page loaded correctly');
    }

    async assertErrorMessageVisible(): Promise<void> {
        await this.assertVisible(this.errorMessage);
    }
}