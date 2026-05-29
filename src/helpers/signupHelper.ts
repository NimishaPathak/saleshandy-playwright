import { Page } from '@playwright/test';
import { SignupPage } from '@pages/SignupPage';
import { generateSignupData, generateUniqueEmail, SignupData, AccountType } from '@utils/randomData';
import { logger } from '@utils/logger';

/**
 * SignupHelper — abstracts signup flow for all account types.
 * Generates unique test data and orchestrates the signup page actions.
 */
export class SignupHelper {
    private page: Page;
    private signupPage: SignupPage;

    constructor(page: Page) {
        this.page = page;
        this.signupPage = new SignupPage(page);
    }

    /**
     * Complete signup flow with generated test data.
     * Returns the generated signup data for reference (e.g., to store credentials).
     */
    async signUpWithGeneratedData(
        accountType: AccountType = 'personal',
    ): Promise<SignupData> {
        logger.step(`Starting signup for ${accountType} account`);

        // Navigate to signup page
        await this.signupPage.navigate();
        await this.signupPage.assertSignupPageLoaded();

        // Generate unique test data
        const signupData = generateSignupData(accountType);
        logger.info(`Generated email: ${signupData.email}`);

        // Fill and submit form
        await this.signupPage.signUp(signupData);

        // Wait for redirect to onboarding
        await this.signupPage.assertRedirectedToOnboarding();

        logger.success(`Signup completed successfully`);
        return signupData;
    }

    /**
     * Signup with custom data (for specific test cases).
     */
    async signUpWithCustomData(data: SignupData): Promise<void> {
        logger.step('Starting signup with custom data');

        await this.signupPage.navigate();
        await this.signupPage.assertSignupPageLoaded();
        await this.signupPage.signUp(data);
        await this.signupPage.assertRedirectedToOnboarding();

        logger.success('Signup with custom data completed');
    }

    /**
     * Helper to test validation errors.
     */
    async submitEmptyForm(): Promise<void> {
        logger.step('Submitting empty signup form');
        await this.signupPage.navigate();
        await this.signupPage.submitForm();
    }

    /**
     * Helper to test with invalid email.
     */
    async signUpWithInvalidEmail(invalidEmail: string): Promise<void> {
        logger.step(`Signup with invalid email: ${invalidEmail}`);

        const data = generateSignupData('personal');
        data.email = invalidEmail;

        await this.signupPage.navigate();
        await this.signupPage.fillSignupForm(data);
        await this.signupPage.submitForm();
    }

    /**
     * Helper to test with weak password.
     */
    async signUpWithWeakPassword(weakPassword: string): Promise<void> {
        logger.step(`Signup with weak password`);

        const data = generateSignupData('personal');
        data.password = weakPassword;

        await this.signupPage.navigate();
        await this.signupPage.fillSignupForm(data);
        await this.signupPage.submitForm();
    }

    /**
     * Helper to test Google SSO flow.
     */
    async clickGoogleSignup(): Promise<void> {
        logger.step('Clicking Google signup');
        await this.signupPage.navigate();
        await this.signupPage.clickGoogleSignup();
        // Note: Actual OAuth flow would require a secondary helper or browser context
    }
}