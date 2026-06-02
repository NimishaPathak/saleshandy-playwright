import { Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { getWorld } from './world';
import { logger } from '@utils/logger';

/**
 * Before hook — opens browser with correct storage state based on scenario tags.
 * Tags @personal, @business, @clients determine which storage state to load.
 * Tag @signup opens a fresh browser with no storage state (for signup tests).
 */
Before(async function (scenario) {
    const world = getWorld(this);
    const tags = scenario.pickle.tags.map(t => t.name);

    // Determine account type from tags
    let accountType: string | undefined;
    if (tags.includes('@personal')) accountType = 'personal';
    if (tags.includes('@business')) accountType = 'business';
    if (tags.includes('@clients')) accountType = 'clients';

    // @signup and @navigation tests need fresh browser (no stored auth)
    if (tags.includes('@signup') || tags.includes('@negative') || tags.includes('@edge')) {
        accountType = undefined;
    }

    await world.openBrowser(accountType);
    logger.separator();
    logger.step(`Scenario: ${scenario.pickle.name}`);
    if (accountType) logger.info(`Account type: ${accountType}`);
});

After(async function (scenario) {
    const world = getWorld(this);

    if (scenario.result?.status === Status.FAILED) {
        logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
        if (world.page) {
            try {
                const screenshot = await world.page.screenshot({ fullPage: true });
                await this.attach(screenshot, 'image/png');
                logger.info('Screenshot attached');
            } catch {
                logger.warn('Could not take screenshot');
            }
        }
    }

    await world.closeBrowser();
    logger.separator();
});

AfterStep(async function (step) {
    if (step.result?.status === Status.FAILED) {
        logger.error(`Step FAILED: ${step.pickleStep.text}`);
    }
});