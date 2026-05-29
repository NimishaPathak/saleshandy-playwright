import { Page } from '@playwright/test';
import { OnboardingPage } from '@pages/OnboardingPage';
import { DashboardPage } from '@pages/DashboardPage';
import { AccountType } from '@utils/randomData';
import { logger } from '@utils/logger';

/**
 * OnboardingHelper — orchestrates the complete onboarding flow.
 * Handles all 3 account types through a single parameterized method.
 */
export class OnboardingHelper {
    private page: Page;
    private onboardingPage: OnboardingPage;
    private dashboardPage: DashboardPage;

    constructor(page: Page) {
        this.page = page;
        this.onboardingPage = new OnboardingPage(page);
        this.dashboardPage = new DashboardPage(page);
    }

    /**
     * Complete onboarding for a given account type.
     * Automatically drives the correct path (Personal/Business/Clients).
     */
    async completeOnboarding(accountType: AccountType): Promise<void> {
        logger.step(`Completing ${accountType} onboarding`);

        // Verify onboarding modal is visible
        await this.onboardingPage.assertOnboardingModalVisible();

        // Drive the parameterized flow (handles all 3 paths internally)
        await this.onboardingPage.completeOnboarding(accountType);

        // Verify dashboard loaded
        await this.dashboardPage.assertDashboardLoaded();

        logger.success(`Onboarding for ${accountType} completed successfully`);
    }

    /**
     * Verify account type specific UI elements post-onboarding.
     */
    async verifyAccountTypeUI(accountType: AccountType): Promise<void> {
        logger.step(`Verifying ${accountType} account UI`);

        await this.dashboardPage.assertOnboardingChecklistVisible();

        if (accountType === 'clients') {
            await this.dashboardPage.assertAddClientsStepVisibleForClientsAccount();
        } else {
            await this.dashboardPage.assertAddClientsStepNotVisibleForOtherAccounts();
        }

        logger.success(`${accountType} UI verified`);
    }

    /**
     * Verify email verification banner (shown on all accounts).
     */
    async verifyEmailVerificationBanner(): Promise<void> {
        logger.step('Verifying email verification banner');
        await this.dashboardPage.assertEmailVerificationBannerVisible();
    }

    /**
     * Verify trial banner (shown on all accounts).
     */
    async verifyTrialBanner(): Promise<void> {
        logger.step('Verifying trial banner');
        await this.dashboardPage.assertTrialBannerVisible();
    }
}