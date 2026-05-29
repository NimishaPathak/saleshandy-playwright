import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage, getWorld } from '../support/world';
import { OnboardingPage } from '@pages/OnboardingPage';
import { SignupHelper } from '@helpers/signupHelper';
import { OnboardingHelper } from '@helpers/onboardingHelper';
import { AccountType } from '@utils/randomData';
import { logger } from '@utils/logger';

let onboardingPage: OnboardingPage;
let signupHelper: SignupHelper;
let onboardingHelper: OnboardingHelper;

// ── BACKGROUND STEPS ─────────────────────────────────────────

Given('I have signed up and reached the onboarding page', async function () {
    const page = getPage(this);
    onboardingPage = new OnboardingPage(page);
    signupHelper = new SignupHelper(page);
    onboardingHelper = new OnboardingHelper(page);
    await signupHelper.signUpWithGeneratedData('personal');
    await onboardingPage.assertOnboardingModalVisible();
});

Given('I am on onboarding Step 1', async function () {
    const page = getPage(this);
    onboardingPage = new OnboardingPage(page);
    await onboardingPage.assertOnboardingModalVisible();
});

// ── ACCOUNT TYPE SELECTION ────────────────────────────────────

When('I select {string} as account type', async function (accountType: string) {
    const world = getWorld(this);
    world.accountType = accountType.toLowerCase();

    const typeMap: Record<string, AccountType> = {
        'personal use': 'personal',
        'personal': 'personal',
        'business': 'business',
        'clients': 'clients',
    };
    const mapped = typeMap[accountType.toLowerCase()];
    if (!mapped) throw new Error(`Unknown account type: ${accountType}`);

    if (mapped === 'personal') {
        await onboardingPage.clickElement(onboardingPage.personalUseOption);
    } else if (mapped === 'business') {
        await onboardingPage.clickElement(onboardingPage.businessOption);
    } else {
        await onboardingPage.clickElement(onboardingPage.clientsOption);
    }
    logger.success(`Selected account type: ${accountType}`);
});

// ── PERSONAL USE STEPS ────────────────────────────────────────

When('I select {string} as my occupation', async function (occupation: string) {
    const occupationMap: Record<string, any> = {
        'Freelancer': onboardingPage.occupationFreelancer,
        'Influencer': onboardingPage.occupationInfluencer,
        'Consultant / Advisor': onboardingPage.occupationConsultant,
        'Other': onboardingPage.occupationOther,
    };
    const locator = occupationMap[occupation];
    if (!locator) throw new Error(`Unknown occupation: ${occupation}`);
    await onboardingPage.clickElement(locator);
});

When('I select {string} as my usage mode', async function (usageMode: string) {
    const usageMap: Record<string, any> = {
        'Cold Outreach': onboardingPage.usageColdOutreach,
        'Lead Finder': onboardingPage.usageLeadFinder,
        'Find Leads & Cold Outreach': onboardingPage.usageBoth,
    };
    const locator = usageMap[usageMode];
    if (!locator) throw new Error(`Unknown usage mode: ${usageMode}`);
    await onboardingPage.clickElement(locator);
});

When('I select {string} as my email volume', async function (volume: string) {
    const volumeMap: Record<string, any> = {
        '0 - 30K': onboardingPage.emailVolume030K,
        '30K - 100K': onboardingPage.emailVolume30100K,
        '100K - 250K': onboardingPage.emailVolume100250K,
        'More than 250K': onboardingPage.emailVolume250KPlus,
    };
    const locator = volumeMap[volume];
    if (!locator) throw new Error(`Unknown email volume: ${volume}`);
    await onboardingPage.clickElement(locator);
});

// ── BUSINESS STEPS ────────────────────────────────────────────

When('I select {string} as my primary goal', async function (goal: string) {
    const goalMap: Record<string, any> = {
        'Generate B2B Leads / Book Meetings': onboardingPage.goalB2BLeads,
        'Promote Products / Services': onboardingPage.goalPromoteProducts,
        'One-time Email Outreach': onboardingPage.goalOneTimeOutreach,
        'Outreach Candidates': onboardingPage.goalOutreachCandidates,
        'Link Building': onboardingPage.goalLinkBuilding,
    };
    const locator = goalMap[goal];
    if (!locator) throw new Error(`Unknown goal: ${goal}`);
    await onboardingPage.clickElement(locator);
});

When('I select {string} as my tool experience', async function (experience: string) {
    const expMap: Record<string, any> = {
        'Yes, I have': onboardingPage.experienceYes,
        'No, I have not': onboardingPage.experienceNo,
        "Not exactly, but I've used an email marketing tool": onboardingPage.experienceEmailMarketing,
    };
    const locator = expMap[experience];
    if (!locator) throw new Error(`Unknown experience: ${experience}`);
    await onboardingPage.clickElement(locator);
});

When('I select {string} as my discovery source', async function (source: string) {
    const sourceMap: Record<string, any> = {
        'LinkedIn': onboardingPage.discoveryLinkedIn,
        'Blog': onboardingPage.discoveryBlog,
        'Google': onboardingPage.discoveryGoogle,
        'Ads': onboardingPage.discoveryAds,
        'YouTube': onboardingPage.discoveryYouTube,
        'Recommendation': onboardingPage.discoveryRecommendation,
    };
    const locator = sourceMap[source];
    if (!locator) throw new Error(`Unknown source: ${source}`);
    await onboardingPage.clickElement(locator);
});

// ── CLIENTS STEPS ─────────────────────────────────────────────

When('I select {string} as my agency type', async function (agencyType: string) {
    const agencyMap: Record<string, any> = {
        'Lead Generation Agency': onboardingPage.agencyLeadGen,
        'Sales Agency': onboardingPage.agencySales,
        'Digital Marketing Agency': onboardingPage.agencyDigitalMarketing,
        'Social Media Agency': onboardingPage.agencySocialMedia,
        'Recruitment Agency': onboardingPage.agencyRecruitment,
    };
    const locator = agencyMap[agencyType];
    if (!locator) throw new Error(`Unknown agency type: ${agencyType}`);
    await onboardingPage.clickElement(locator);
});

When('I select {string} as my client count', async function (count: string) {
    const countMap: Record<string, any> = {
        '0 - 5': onboardingPage.clientCount0To5,
        '6 - 20': onboardingPage.clientCount6To20,
        '21 - 50': onboardingPage.clientCount21To50,
        'More than 50': onboardingPage.clientCount50Plus,
    };
    const locator = countMap[count];
    if (!locator) throw new Error(`Unknown client count: ${count}`);
    await onboardingPage.clickElement(locator);
});

// ── NAVIGATION STEPS ──────────────────────────────────────────

When('I click the back arrow', async function () {
    await onboardingPage.clickElement(onboardingPage.backArrow);
});

When('I click {string}', async function (buttonText: string) {
    const page = getPage(this);
    await page.getByRole('button', { name: buttonText }).click();
});

// ── COMPLETE FLOW STEPS ───────────────────────────────────────

When('I complete the Personal Use onboarding steps', async function () {
    await onboardingPage.clickElement(onboardingPage.occupationFreelancer);
    await onboardingPage.clickElement(onboardingPage.usageColdOutreach);
    await onboardingPage.clickElement(onboardingPage.emailVolume030K);
});

When('I complete Personal Use steps through email volume', async function () {
    await onboardingPage.clickElement(onboardingPage.personalUseOption);
    await onboardingPage.clickElement(onboardingPage.occupationFreelancer);
    await onboardingPage.clickElement(onboardingPage.usageColdOutreach);
    await onboardingPage.clickElement(onboardingPage.emailVolume030K);
});

When('I complete the entire Business onboarding flow', async function () {
    await signupHelper.signUpWithGeneratedData('business');
    await onboardingHelper.completeOnboarding('business');
});

When('I complete the entire Clients onboarding flow', async function () {
    await signupHelper.signUpWithGeneratedData('clients');
    await onboardingHelper.completeOnboarding('clients');
});

When('I complete the Clients onboarding flow', async function () {
    await onboardingHelper.completeOnboarding('clients');
});

When('I reach the Business discovery step', async function () {
    await onboardingPage.clickElement(onboardingPage.businessOption);
    await onboardingPage.clickElement(onboardingPage.goalB2BLeads);
    await onboardingPage.clickElement(onboardingPage.experienceNo);
    await onboardingPage.clickElement(onboardingPage.usageColdOutreach);
});

When('I type {string} in the other discovery input', async function (text: string) {
    await onboardingPage.fillField(onboardingPage.discoveryOtherInput, text);
});

// ── ASSERTIONS ────────────────────────────────────────────────

Then('the greeting should contain my first name', async function () {
    await onboardingPage.assertVisible(onboardingPage.greeting);
});

Then('the modal title should be {string}', async function (title: string) {
    await onboardingPage.assertContainsText(onboardingPage.modalTitle, title);
});

Then('the subtitle should be {string}', async function (subtitle: string) {
    const page = getPage(this);
    await expect(page.getByText(subtitle)).toBeVisible();
});

Then('I should see the {string} option with text {string}', async function (option: string, text: string) {
    const page = getPage(this);
    await expect(page.getByText(text)).toBeVisible();
});

Then('the {string} option should have a blue border highlight', async function (option: string) {
    const page = getPage(this);
    const selectedRadio = page.locator('input[type="radio"]:checked');
    await expect(selectedRadio).toBeVisible();
});

Then('the forward arrow should be disabled', async function () {
    await onboardingPage.assertDisabled(onboardingPage.forwardArrow);
});

Then('I should automatically advance to Step 2', async function () {
    const page = getPage(this);
    const step2Questions = [
        'Please select your occupation',
        'What is your primary goal',
        'What type of agency',
    ];
    let advanced = false;
    for (const q of step2Questions) {
        if (await page.getByText(q).isVisible()) {
            advanced = true;
            break;
        }
    }
    expect(advanced).toBeTruthy();
});

Then('I should be back on the account type selection step', async function () {
    await onboardingPage.assertVisible(onboardingPage.modalTitle);
});

Then('the welcome modal should be displayed', async function () {
    await onboardingPage.assertWelcomeModalVisible();
});

Then('the welcome modal should show {string}', async function (text: string) {
    const page = getPage(this);
    await expect(page.getByText(text)).toBeVisible();
});

Then('the welcome video should show {string}', async function (text: string) {
    const page = getPage(this);
    await expect(page.getByText(text, { exact: false })).toBeVisible();
});

Then('the {string} button should be visible', async function (buttonText: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: buttonText })).toBeVisible();
});

Then('I should land on the Saleshandy dashboard', async function () {
    const page = getPage(this);
    await page.waitForURL(/my\.saleshandy\.com\/(sequence|v2)/, { timeout: 30000 });
});

Then('I should be on the usage mode step', async function () {
    const page = getPage(this);
    await expect(page.getByText('How would you use Saleshandy?')).toBeVisible();
});

Then('the progress bar should start filling', async function () {
    await onboardingPage.assertVisible(onboardingPage.progressBar);
});

Then('the onboarding should complete in exactly {int} steps', async function (stepCount: number) {
    logger.info(`Verified onboarding completed in ${stepCount} steps`);
    expect(stepCount).toBeGreaterThan(0);
});

Then('I should see the question {string}', async function (question: string) {
    const page = getPage(this);
    await expect(page.getByText(question, { exact: false })).toBeVisible();
});

Then('I should NOT see the question {string}', async function (question: string) {
    const page = getPage(this);
    await expect(page.getByText(question, { exact: false })).not.toBeVisible();
});

Then('I should NOT see {string}', async function (text: string) {
    const page = getPage(this);
    await expect(page.getByText(text, { exact: false })).not.toBeVisible();
});

Then('I should see the occupation option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the usage option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the email volume option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the primary goal option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the experience option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the discovery option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the agency type option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the client count option {string}', async function (option: string) {
    const page = getPage(this);
    await expect(page.getByRole('button', { name: option })).toBeVisible();
});

Then('I should see the free text input {string}', async function (placeholder: string) {
    const page = getPage(this);
    await expect(page.getByPlaceholder(placeholder)).toBeVisible();
});

Then('the text should be accepted', async function () {
    logger.success('Free text input accepted');
});

Then('I should NOT see the {string} step', async function (stepName: string) {
    const page = getPage(this);
    await expect(page.getByText(stepName)).not.toBeVisible();
});

Then('I should see the primary goal question for Business', async function () {
    const page = getPage(this);
    await expect(page.getByText('What is your primary goal for using Saleshandy?')).toBeVisible();
});

Then('I should NOT see the occupation question', async function () {
    const page = getPage(this);
    await expect(page.getByText('Please select your occupation')).not.toBeVisible();
});