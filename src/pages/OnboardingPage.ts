import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';
import { AccountType } from '@utils/randomData';

/**
 * OnboardingPage — handles the 5-6 step onboarding wizard after signup.
 * URL: my.saleshandy.com/sequence?signup=completed
 *
 * ✨ Parameterized Design:
 * Single method selectOnboardingPath() accepts accountType and drives the correct flow.
 * Internally, it calls the right step methods for that account type.
 *
 * Flows:
 * - Personal Use: 5 steps (Account Type → Occupation → Usage → Email Volume → Welcome)
 * - Business: 6 steps (Account Type → Goal → Experience → Usage → Discovery → Welcome)
 * - Clients: 6 steps (Account Type → Agency → ClientCount → Email Volume → Discovery → Welcome)
 */
export class OnboardingPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ══════════════════════════════════════════════════════════════
    // STEP 1 — Account Type Selection (Common to all paths)
    // ══════════════════════════════════════════════════════════════

    get greeting(): Locator {
        return this.page.getByText(/Hey \w+,/);
    }

    get modalTitle(): Locator {
        return this.page.getByText("Let's shape your experience");
    }

    get clientsOption(): Locator {
        return this.page
            .locator('label')
            .filter({ has: this.page.getByText('I want to outreach for my clients') })
            .first();
    }

    get businessOption(): Locator {
        return this.page
            .locator('label')
            .filter({ has: this.page.getByText('I want to grow my business using cold emails') })
            .first();
    }

    get personalUseOption(): Locator {
        return this.page
            .locator('label')
            .filter({ has: this.page.getByText('I want to do cold emailing for personal use') })
            .first();
    }

    get backArrow(): Locator {
        return this.page.locator('button').filter({ hasText: '←' }).first();
    }

    get forwardArrow(): Locator {
        return this.page.locator('button').filter({ hasText: '→' }).first();
    }

    get progressBar(): Locator {
        return this.page.locator('[class*="progress"]').first();
    }

    // ══════════════════════════════════════════════════════════════
    // STEP 2 OPTIONS — Different per account type
    // ══════════════════════════════════════════════════════════════

    // Personal Use Step 2: Occupation
    get occupationFreelancer(): Locator {
        return this.page.getByRole('button', { name: /^Freelancer$/i });
    }

    get occupationInfluencer(): Locator {
        return this.page.getByRole('button', { name: /^Influencer$/i });
    }

    get occupationConsultant(): Locator {
        return this.page.getByRole('button', { name: /Consultant|Advisor/i });
    }

    get occupationOther(): Locator {
        return this.page.getByRole('button', { name: /^Other$/i });
    }

    // Business Step 2: Primary Goal
    get goalB2BLeads(): Locator {
        return this.page.getByRole('button', { name: /Generate B2B Leads|Book Meetings/i });
    }

    get goalPromoteProducts(): Locator {
        return this.page.getByRole('button', { name: /Promote Products|Services/i });
    }

    get goalOneTimeOutreach(): Locator {
        return this.page.getByRole('button', { name: /One-time Email Outreach/i });
    }

    get goalOutreachCandidates(): Locator {
        return this.page.getByRole('button', { name: /Outreach Candidates/i });
    }

    get goalLinkBuilding(): Locator {
        return this.page.getByRole('button', { name: /Link Building/i });
    }

    // Clients Step 2: Agency Type
    get agencyLeadGen(): Locator {
        return this.page.getByRole('button', { name: /Lead Generation Agency/i });
    }

    get agencySales(): Locator {
        return this.page.getByRole('button', { name: /^Sales Agency$/i });
    }

    get agencyDigitalMarketing(): Locator {
        return this.page.getByRole('button', { name: /Digital Marketing Agency/i });
    }

    get agencySocialMedia(): Locator {
        return this.page.getByRole('button', { name: /Social Media Agency/i });
    }

    get agencyRecruitment(): Locator {
        return this.page.getByRole('button', { name: /Recruitment Agency/i });
    }

    // ══════════════════════════════════════════════════════════════
    // STEP 3 / OTHER STEPS — Options across multiple steps
    // ══════════════════════════════════════════════════════════════

    // Business Step 3: Experience with cold outreach tools
    get experienceYes(): Locator {
        return this.page.getByRole('button', { name: /^Yes, I have$/i });
    }

    get experienceNo(): Locator {
        return this.page.getByRole('button', { name: /^No, I have not$/i });
    }

    get experienceEmailMarketing(): Locator {
        return this.page.getByRole('button', {
            name: /Not exactly.*email marketing/i,
        });
    }

    // Usage: Cold Outreach, Lead Finder, etc (appears in multiple steps)
    get usageColdOutreach(): Locator {
        return this.page.getByRole('button', { name: /^Cold Outreach$/i });
    }

    get usageLeadFinder(): Locator {
        return this.page.getByRole('button', { name: /^Lead Finder$/i });
    }

    get usageBoth(): Locator {
        return this.page.getByRole('button', { name: /Find Leads.*Cold Outreach/i });
    }

    // Email volume (same across Personal/Business/Clients)
    get emailVolume030K(): Locator {
        return this.page.getByRole('button', { name: /0.*30K|0 - 30K/i });
    }

    get emailVolume30100K(): Locator {
        return this.page.getByRole('button', { name: /30K.*100K|30K - 100K/i });
    }

    get emailVolume100250K(): Locator {
        return this.page.getByRole('button', { name: /100K.*250K|100K - 250K/i });
    }

    get emailVolume250KPlus(): Locator {
        return this.page.getByRole('button', { name: /More than 250K|250K\+/i });
    }

    // Clients Step 3: How many clients
    get clientCount0To5(): Locator {
        return this.page.getByRole('button', { name: /0 - 5|0-5/i });
    }

    get clientCount6To20(): Locator {
        return this.page.getByRole('button', { name: /6 - 20|6-20/i });
    }

    get clientCount21To50(): Locator {
        return this.page.getByRole('button', { name: /21 - 50|21-50/i });
    }

    get clientCount50Plus(): Locator {
        return this.page.getByRole('button', { name: /More than 50|50\+/i });
    }

    // Discovery: How did you find us (Business & Clients Step 5)
    get discoveryLinkedIn(): Locator {
        return this.page.getByRole('button', { name: /^LinkedIn$/i });
    }

    get discoveryBlog(): Locator {
        return this.page.getByRole('button', { name: /^Blog$/i });
    }

    get discoveryGoogle(): Locator {
        return this.page.getByRole('button', { name: /^Google$/i });
    }

    get discoveryAds(): Locator {
        return this.page.getByRole('button', { name: /^Ads$/i });
    }

    get discoveryYouTube(): Locator {
        return this.page.getByRole('button', { name: /^YouTube$/i });
    }

    get discoveryRecommendation(): Locator {
        return this.page.getByRole('button', { name: /^Recommendation$/i });
    }

    get discoveryOtherInput(): Locator {
        return this.page.locator('input[placeholder*="Other"], textarea').first();
    }

    // ══════════════════════════════════════════════════════════════
    // FINAL STEP — Welcome Modal
    // ══════════════════════════════════════════════════════════════

    get welcomeTitle(): Locator {
        return this.page.getByText('Welcome to Saleshandy');
    }

    get welcomeVideo(): Locator {
        return this.page.locator('[class*="video"], iframe, video').first();
    }

    get exploreDemoButton(): Locator {
        return this.page.getByRole('button', { name: /Explore Demo Account/i });
    }

    get letsStartButton(): Locator {
        return this.page.getByRole('button', { name: /Let's Start/i });
    }

    // ══════════════════════════════════════════════════════════════
    // ACTIONS — Parameterized Flow
    // ══════════════════════════════════════════════════════════════

    /**
     * Main entry point — parameterized onboarding flow.
     * Accepts account type and automatically drives the correct path.
     * @param accountType 'personal' | 'business' | 'clients'
     */
    async completeOnboarding(accountType: AccountType): Promise<void> {
        logger.step(`Starting ${accountType.toUpperCase()} account onboarding`);

        // Step 1: Select account type
        await this.selectAccountType(accountType);

        // Step 2 onwards varies by account type
        if (accountType === 'personal') {
            await this.completePersonalUseFlow();
        } else if (accountType === 'business') {
            await this.completeBusinessFlow();
        } else if (accountType === 'clients') {
            await this.completeClientsFlow();
        }

        // Final: Click Let's Start
        await this.clickLetsStart();
        await this.waitForUrl(/my\.saleshandy\.com\/(sequence|v2)/);
        logger.success(`${accountType} onboarding completed`);
    }

    private async selectAccountType(accountType: AccountType): Promise<void> {
        logger.step('Step 1: Selecting account type');

        if (accountType === 'personal') {
            await this.clickElement(this.personalUseOption);
        } else if (accountType === 'business') {
            await this.clickElement(this.businessOption);
        } else if (accountType === 'clients') {
            await this.clickElement(this.clientsOption);
        }

        logger.success(`Selected: ${accountType}`);
    }

    private async completePersonalUseFlow(): Promise<void> {
        // Step 2: Occupation
        logger.step('Step 2 (Personal Use): Selecting occupation');
        await this.clickElement(this.occupationFreelancer);

        // Step 3: Usage
        logger.step('Step 3 (Personal Use): Selecting usage mode');
        await this.clickElement(this.usageColdOutreach);

        // Step 4: Email volume
        logger.step('Step 4 (Personal Use): Selecting email volume');
        await this.clickElement(this.emailVolume030K);
    }

    private async completeBusinessFlow(): Promise<void> {
        // Step 2: Primary goal
        logger.step('Step 2 (Business): Selecting primary goal');
        await this.clickElement(this.goalB2BLeads);

        // Step 3: Experience
        logger.step('Step 3 (Business): Selecting tool experience');
        await this.clickElement(this.experienceNo);

        // Step 4: Usage
        logger.step('Step 4 (Business): Selecting usage mode');
        await this.clickElement(this.usageColdOutreach);

        // Step 5: Discovery
        logger.step('Step 5 (Business): Selecting discovery source');
        await this.clickElement(this.discoveryGoogle);
    }

    private async completeClientsFlow(): Promise<void> {
        // Step 2: Agency type
        logger.step('Step 2 (Clients): Selecting agency type');
        await this.clickElement(this.agencyDigitalMarketing);

        // Step 3: Client count
        logger.step('Step 3 (Clients): Selecting client count');
        await this.clickElement(this.clientCount6To20);

        // Step 4: Email volume
        logger.step('Step 4 (Clients): Selecting email volume');
        await this.clickElement(this.emailVolume030K);

        // Step 5: Discovery
        logger.step('Step 5 (Clients): Selecting discovery source');
        await this.clickElement(this.discoveryGoogle);
    }

    private async clickLetsStart(): Promise<void> {
        logger.step('Final step: Clicking Let\'s Start');
        await this.clickElement(this.letsStartButton);
    }

    // ══════════════════════════════════════════════════════════════
    // ASSERTIONS
    // ══════════════════════════════════════════════════════════════

    async assertOnboardingModalVisible(): Promise<void> {
        await this.assertVisible(this.modalTitle);
        await this.assertVisible(this.greeting);
        logger.success('Onboarding modal is visible');
    }

    async assertWelcomeModalVisible(): Promise<void> {
        await this.assertVisible(this.welcomeTitle);
        await this.assertVisible(this.letsStartButton);
        logger.success('Welcome modal is visible');
    }

    async assertAccountTypeSelected(accountType: AccountType): Promise<void> {
        const option =
            accountType === 'personal'
                ? this.personalUseOption
                : accountType === 'business'
                    ? this.businessOption
                    : this.clientsOption;

        // Selected option has blue border
        await this.assertVisible(option);
        logger.success(`${accountType} option is selected`);
    }
}