import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '@utils/logger';

export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ── Locators ─────────────────────────────────────────────────

    get welcomeMessage(): Locator {
        return this.page.getByText(/Welcome.*Let's build/i);
    }

    get sequencesLink(): Locator {
        return this.page.getByRole('link', { name: /Sequence/i });
    }

    get checklistTitle(): Locator {
        return this.page.getByText(/Let's build your outreach|Getting Started/i);
    }

    get generateAISequenceStep(): Locator {
        return this.page.getByText(/Generate AI Sequence|Create Sequence/).first();
    }

    get addProspectsStep(): Locator {
        return this.page.getByText(/Add Prospects/).first();
    }

    get addEmailAccountStep(): Locator {
        return this.page.getByText(/Add Email Account/).first();
    }

    get launchSequenceStep(): Locator {
        return this.page.getByText(/Launch Sequence/).first();
    }

    get addClientsStep(): Locator {
        return this.page.getByText(/Add Clients/).first();
    }

    get emailVerificationBanner(): Locator {
        return this.page.getByText(/Check your registered email.*authenticate/i);
    }

    get trialBanner(): Locator {
        return this.page.getByText(/trial expires in 7 days/i);
    }

    get skipOnboardingLink(): Locator {
        return this.page.getByRole('link', { name: /Skip Onboarding/i });
    }

    get userAvatar(): Locator {
        return this.page.locator('[class*="avatar"], [class*="profile"]').first();
    }

    // ── Actions ──────────────────────────────────────────────────

    async assertDashboardLoaded(): Promise<void> {
        await this.assertVisible(this.welcomeMessage);
        logger.success('Dashboard loaded with welcome message');
    }

    async assertOnboardingChecklistVisible(): Promise<void> {
        await this.assertVisible(this.checklistTitle);
        await this.assertVisible(this.generateAISequenceStep);
        await this.assertVisible(this.addProspectsStep);
        logger.success('Onboarding checklist is visible');
    }

    async assertAddClientsStepVisibleForClientsAccount(): Promise<void> {
        await this.assertVisible(this.addClientsStep);
        logger.success('Add Clients step visible for Clients account');
    }

    async assertAddClientsStepNotVisibleForOtherAccounts(): Promise<void> {
        await this.assertNotVisible(this.addClientsStep);
        logger.success('Add Clients step NOT visible for non-Clients account');
    }

    async assertEmailVerificationBannerVisible(): Promise<void> {
        await this.assertVisible(this.emailVerificationBanner);
        logger.success('Email verification banner is visible');
    }

    async assertTrialBannerVisible(): Promise<void> {
        await this.assertVisible(this.trialBanner);
        logger.success('Trial banner is visible');
    }
}