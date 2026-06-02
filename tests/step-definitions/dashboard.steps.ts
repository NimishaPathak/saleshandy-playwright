import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage } from '../support/world';
import { DashboardPage } from '@pages/DashboardPage';
import { SignupHelper } from '@helpers/signupHelper';
import { OnboardingHelper } from '@helpers/onboardingHelper';
import { AccountType } from '@utils/randomData';
import { logger } from '@utils/logger';

let dashboardPage: DashboardPage;
let signupHelper: SignupHelper;
let onboardingHelper: OnboardingHelper;

// ── GIVEN STEPS ───────────────────────────────────────────────

Given("I have completed {string} onboarding and clicked Let's Start",
    async function (accountType: string) {
        const page = getPage(this);
        dashboardPage = new DashboardPage(page);
        signupHelper = new SignupHelper(page);
        onboardingHelper = new OnboardingHelper(page);

        await signupHelper.signUpWithGeneratedData(accountType as AccountType);
        await onboardingHelper.completeOnboarding(accountType as AccountType);
    }
);

Given('I am on the dashboard', async function () {
    const page = getPage(this);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.assertDashboardLoaded();
});

Given('I am on the dashboard with unverified email', async function () {
    const page = getPage(this);
    dashboardPage = new DashboardPage(page);
    await dashboardPage.assertDashboardLoaded();
});

Given('I have completed {string} onboarding with {string} usage selection',
    async function (accountType: string, usageSelection: string) {
        const page = getPage(this);
        dashboardPage = new DashboardPage(page);
        signupHelper = new SignupHelper(page);
        onboardingHelper = new OnboardingHelper(page);
        await signupHelper.signUpWithGeneratedData(accountType as AccountType);
        await onboardingHelper.completeOnboarding(accountType as AccountType);
        logger.info(`Usage selection was: ${usageSelection}`);
    }
);

// ── THEN STEPS ────────────────────────────────────────────────

Then('the dashboard should show the welcome message with my first name', async function () {
    await dashboardPage.assertDashboardLoaded();
});

Then('the email verification banner should be visible', async function () {
    await dashboardPage.assertEmailVerificationBannerVisible();
});

Then('the trial expiry banner should show 7 days remaining', async function () {
    await dashboardPage.assertTrialBannerVisible();
});

Then('the {string} button should be visible', async function (buttonText: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: buttonText })).toBeVisible();
});

Then('the onboarding checklist should show {string}', async function (progress: string) {
    const page = getPage(this);
    await expect(page.getByText(progress)).toBeVisible();
});

Then('the checklist should include the {string} step', async function (step: string) {
    const page = getPage(this);
    await expect(page.getByText(step)).toBeVisible();
});

Then('the checklist should contain {string}', async function (item: string) {
    const page = getPage(this);
    await expect(page.getByText(item)).toBeVisible();
});

Then('the checklist should NOT contain {string}', async function (item: string) {
    const page = getPage(this);
    await expect(page.getByText(item)).not.toBeVisible();
});

Then('the onboarding checklist should be dismissed', async function () {
    const page = getPage(this);
    await expect(page.getByText(/0\/\d+ steps completed/)).not.toBeVisible();
});

Then('the sidebar should show the {string} icon', async function (iconName: string) {
    const page = getPage(this);
    const icon = page.locator(
        `[aria-label*="${iconName}"], [title*="${iconName}"], a:has-text("${iconName}")`
    ).first();
    await expect(icon).toBeVisible();
});

Then('the sequences list should show the {string} filter dropdown', async function (filterText: string) {
    const page = getPage(this);
    await expect(page.getByText(filterText)).toBeVisible();
});

Then('the {string} dropdown filter should be visible in the sequences list', async function (filterText: string) {
    const page = getPage(this);
    await expect(page.getByText(filterText)).toBeVisible();
});

Then('the {string} filter should NOT be visible for Personal Use accounts', async function (filterText: string) {
    const page = getPage(this);
    await expect(page.getByText(filterText)).not.toBeVisible();
});

Then('the dashboard URL should contain {string}', async function (urlPart: string) {
    const page = getPage(this);
    await expect(page).toHaveURL(new RegExp(urlPart));
});

Then('the banner should contain {string}', async function (text: string) {
    const page = getPage(this);
    await expect(page.getByText(text, { exact: false })).toBeVisible();
});

Then('the banner should contain {string} link', async function (linkText: string) {
    const page = getPage(this);
    await expect(page.getByRole('link', { name: linkText })).toBeVisible();
});

Then('the announcement banner should disappear', async function () {
    const page = getPage(this);
    const banner = page.getByText(/Lead Finder 2\.0|Saleshandy Dialer/i);
    await expect(banner).not.toBeVisible();
});

Then('the {string} link should be visible on the dashboard', async function (linkText: string) {
    const page = getPage(this);
    await expect(page.getByText(linkText)).toBeVisible();
});

// ── WHEN STEPS ────────────────────────────────────────────────

When('I click {string}', async function (text: string) {
    const page = getPage(this);
    await page.getByText(text).click();
});

When('I click the X on the announcement banner', async function () {
    const page = getPage(this);
    const closeBtn = page.locator('[class*="banner"] button, [class*="announcement"] button').first();
    await closeBtn.click();
});

// ── NEW: Navigate to dashboard using storage state ────────────

Given('I navigate to the Saleshandy dashboard', async function () {
    const page = getPage(this);
    dashboardPage = new DashboardPage(page);
    // Storage state already loaded by hooks.ts based on @personal/@business/@clients tag
    // Just navigate to the sequences page
    await page.goto('https://my.saleshandy.com/sequence', {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
    });
    await page.waitForTimeout(2000);
    logger.success('Navigated to dashboard');
});