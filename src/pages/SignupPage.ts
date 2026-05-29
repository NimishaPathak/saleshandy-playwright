import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';
import { SignupData } from '@utils/randomData';

/**
 * SignupPage — handles my.saleshandy.com/signup
 * All locators verified against actual UI screenshots.
 *
 * Form fields: First Name*, Last Name*, Work Email*, Phone (optional), Password*
 * SSO options: Sign up with Google, Sign up with Microsoft
 */
export class SignupPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ── Locators ─────────────────────────────────────────────────

    get firstNameInput(): Locator {
        return this.page.locator('input[placeholder="John"]');
    }

    get lastNameInput(): Locator {
        return this.page.locator('input[placeholder="Doe"]');
    }

    get workEmailInput(): Locator {
        return this.page.locator('input[placeholder="johndoe@example.com"]');
    }

    get phoneInput(): Locator {
        return this.page.locator('input[type="tel"]');
    }

    get passwordInput(): Locator {
        return this.page.locator('input[placeholder="Minimum 8 Characters"]');
    }

    get passwordToggleIcon(): Locator {
        return this.page.locator('input[type="password"] ~ span, .eye-icon, [class*="password"] svg').first();
    }

    get signUpButton(): Locator {
        return this.page.getByRole('button', { name: /sign up/i });
    }

    get googleSignupButton(): Locator {
        return this.page.getByRole('button', { name: /sign up with google/i });
    }

    get microsoftSignupButton(): Locator {
        return this.page.getByRole('button', { name: /sign up with microsoft/i });
    }

    get loginLink(): Locator {
        return this.page.getByRole('link', { name: /log in/i });
    }

    get privacyPolicyLink(): Locator {
        return this.page.getByRole('link', { name: /privacy policy/i });
    }

    get termsOfServiceLink(): Locator {
        return this.page.getByRole('link', { name: /terms of service/i });
    }

    // ── Validation messages ──────────────────────────────────────

    get firstNameError(): Locator {
        return this.page.getByText('First name is required.');
    }

    get passwordSecuredMessage(): Locator {
        return this.page.getByText("Your password is secured & You're all set!");
    }

    get passwordRequirementUppercase(): Locator {
        return this.page.getByText('One uppercase character');
    }

    get passwordRequirementLowercase(): Locator {
        return this.page.getByText('One lowercase character');
    }

    get passwordRequirementNumber(): Locator {
        return this.page.getByText('One numerical character');
    }

    get passwordRequirementMinLength(): Locator {
        return this.page.getByText('8 characters minimum');
    }

    // ── General error locator ────────────────────────────────────

    get errorMessage(): Locator {
        return this.page.locator('[class*="error"],[class*="alert"],[role="alert"]').first();
    }

    // ── Actions ──────────────────────────────────────────────────

    async navigate(): Promise<void> {
        await this.navigateTo(`${process.env.BASE_URL}/signup`);
        await this.assertVisible(this.signUpButton);
        logger.success('Signup page loaded');
    }

    async fillSignupForm(data: SignupData): Promise<void> {
        logger.step('Filling signup form');

        await this.fillField(this.firstNameInput, data.firstName);
        logger.info(`First Name: ${data.firstName}`);

        await this.fillField(this.lastNameInput, data.lastName);
        logger.info(`Last Name: ${data.lastName}`);

        await this.fillField(this.workEmailInput, data.email);
        logger.info(`Work Email: ${data.email}`);

        if (data.phone) {
            await this.fillField(this.phoneInput, data.phone);
            logger.info(`Phone: ${data.phone}`);
        }

        await this.fillField(this.passwordInput, data.password);
        logger.info('Password: filled');
    }

    async submitForm(): Promise<void> {
        logger.step('Clicking Sign up button');
        await this.clickElement(this.signUpButton);
    }

    async signUp(data: SignupData): Promise<void> {
        await this.fillSignupForm(data);
        await this.submitForm();
    }

    async clickGoogleSignup(): Promise<void> {
        logger.step('Clicking Sign up with Google');
        await this.clickElement(this.googleSignupButton);
    }

    async clickMicrosoftSignup(): Promise<void> {
        logger.step('Clicking Sign up with Microsoft');
        await this.clickElement(this.microsoftSignupButton);
    }

    // ── Assertions ───────────────────────────────────────────────

    async assertSignupPageLoaded(): Promise<void> {
        await this.assertVisible(this.firstNameInput);
        await this.assertVisible(this.lastNameInput);
        await this.assertVisible(this.workEmailInput);
        await this.assertVisible(this.passwordInput);
        await this.assertVisible(this.signUpButton);
        await this.assertVisible(this.googleSignupButton);
        await this.assertVisible(this.microsoftSignupButton);
        logger.success('Signup page elements verified');
    }

    async assertFirstNameErrorVisible(): Promise<void> {
        await this.assertVisible(this.firstNameError);
        logger.success('First name error message is visible');
    }

    async assertPasswordSecured(): Promise<void> {
        await this.assertVisible(this.passwordSecuredMessage);
        logger.success('Password secured message is visible');
    }

    async assertRedirectedToOnboarding(): Promise<void> {
        await this.waitForUrl(/sequence\?signup=completed/, 30000);
        logger.success('Redirected to onboarding page after signup');
    }
}