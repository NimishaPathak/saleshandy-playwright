import { Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { getWorld } from './world';
import { logger } from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

Before(async function (scenario) {
    const world = getWorld(this);
    await world.openBrowser();

    const tags = scenario.pickle.tags.map(t => t.name);
    const isDashboard = tags.includes('@dashboard');
    const hasOnboardingStep = scenario.pickle.steps.some(step =>
        step.text.toLowerCase().includes('completed') ||
        step.text.toLowerCase().includes('signup') ||
        step.text.toLowerCase().includes('onboarding')
    );

    if (isDashboard && !hasOnboardingStep) {
        let accountType = 'personal';
        if (tags.includes('@business')) accountType = 'business';
        if (tags.includes('@clients')) accountType = 'clients';

        const storageStatePath = path.resolve(__dirname, `../../auth/storageState.${accountType}.json`);
        if (fs.existsSync(storageStatePath)) {
            try {
                const state = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
                if (state.cookies) {
                    await world.context.addCookies(state.cookies);
                }
                const baseUrl = process.env.BASE_URL || 'https://my.saleshandy.com';
                await world.page.goto(`${baseUrl}/sequence`, { waitUntil: 'domcontentloaded' });
                logger.info(`Loaded saved session for account: ${accountType}`);
            } catch (err: any) {
                logger.warn(`Could not load storage state: ${err.message}`);
            }
        } else {
            logger.warn(`Storage state file not found for ${accountType} at: ${storageStatePath}`);
        }
    }

    logger.separator();
    logger.step('Scenario started — browser opened');
});

After(async function (scenario) {
    const world = getWorld(this);

    if (scenario.result?.status === Status.FAILED) {
        logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
        if (world.page) {
            try {
                const screenshot = await world.page.screenshot({ fullPage: true });
                await this.attach(screenshot, 'image/png');
                logger.info('Screenshot attached for failed scenario');
            } catch {
                logger.warn('Could not take screenshot');
            }
        }
    }

    await world.closeBrowser();
    logger.step('Scenario ended — browser closed');
    logger.separator();
});

AfterStep(async function (step) {
    if (step.result?.status === Status.FAILED) {
        logger.error(`Step FAILED: ${step.pickleStep.text}`);
    }
});