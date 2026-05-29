import { Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { getWorld } from './world';
import { logger } from '@utils/logger';

Before(async function () {
    const world = getWorld(this);
    await world.openBrowser();
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