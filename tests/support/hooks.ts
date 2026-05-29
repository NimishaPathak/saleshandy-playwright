import { Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { logger } from '@utils/logger';

/**
 * Before hook — runs before each scenario.
 * Opens browser and creates a fresh page.
 */
Before(async function (this: CustomWorld) {
    await this.openBrowser();
    logger.separator();
    logger.step('Scenario started — browser opened');
});

/**
 * After hook — runs after each scenario.
 * Takes screenshot on failure, then closes browser.
 */
After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status === Status.FAILED) {
        logger.error(`Scenario FAILED: ${scenario.pickle.name}`);

        // Take screenshot on failure
        if (this.page) {
            const screenshotName = scenario.pickle.name
                .replace(/[^a-zA-Z0-9]/g, '_')
                .substring(0, 50);
            try {
                const screenshot = await this.page.screenshot({ fullPage: true });
                await this.attach(screenshot, 'image/png');
                logger.info(`Screenshot attached for failed scenario`);
            } catch (e) {
                logger.warn('Could not take screenshot');
            }
        }
    }

    await this.closeBrowser();
    logger.step('Scenario ended — browser closed');
    logger.separator();
});

/**
 * AfterStep — logs each step result for debugging.
 */
AfterStep(async function (this: CustomWorld, step) {
    if (step.result?.status === Status.FAILED) {
        logger.error(`Step FAILED: ${step.pickleStep.text}`);
    }
});