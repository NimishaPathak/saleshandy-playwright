import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { SignupPage } from '@pages/SignupPage';
import { OnboardingPage } from '@pages/OnboardingPage';
import { DashboardPage } from '@pages/DashboardPage';
import { SignupHelper } from '@helpers/signupHelper';
import { OnboardingHelper } from '@helpers/onboardingHelper';

/**
 * BaseFixture — extends Playwright's base test with pre-initialized page objects and helpers.
 * Usage in tests:
 *
 *   test('signup flow', async ({ loginPage, signupPage, signupHelper }) => {
 *     await signupPage.navigate();
 *     const data = await signupHelper.signUpWithGeneratedData('personal');
 *   });
 */
export const test = base.extend<{
    loginPage: LoginPage;
    signupPage: SignupPage;
    onboardingPage: OnboardingPage;
    dashboardPage: DashboardPage;
    signupHelper: SignupHelper;
    onboardingHelper: OnboardingHelper;
}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },

    onboardingPage: async ({ page }, use) => {
        await use(new OnboardingPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    signupHelper: async ({ page }, use) => {
        await use(new SignupHelper(page));
    },

    onboardingHelper: async ({ page }, use) => {
        await use(new OnboardingHelper(page));
    },
});

export { expect };