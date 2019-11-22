import * as puppeteer from "puppeteer";
import { env } from "../index";
import { SimulateMouse } from "./mouseImitation";

export class MyPuppeteer {
    constructor() {
        this.initBrowser().then((browser) => {
            const p1 = this.initPage(browser);
            // const p2 = this.initPage(browser);
            Promise.all([p1]).then(() => {browser.close(); });
        });
    }
    private initBrowser() {
        const extensions = {
            AdGuard : `${env.AppPath}/extensions/bgnkhhnnamicmpeenaelnjfhikgbkllg/3.3.2_0`,
            PupeteerRecorder : `${env.AppPath}/extensions/djeegiggegleadkkbgopoonhjimgehda/0.7.1_0`,
        };
        return puppeteer.launch({
            args: [
                `--disable-extensions-except=${extensions.PupeteerRecorder}`,
                // `--load-extension=${extensions.AdGuard}`,
                `--load-extension=${extensions.PupeteerRecorder}`,
            ],
            defaultViewport: { width: 1280, height: 720 },
            headless: false,
            ignoreDefaultArgs: ["--mute-audio"],
            userDataDir: `${env.AppPath}/user_data`,
        });
    }
    private async initPage(browser: puppeteer.Browser) {
        const mouseImitation = new SimulateMouse();
        const page = await browser.newPage();
        await page.goto("https://www.youtube.com/watch?v=fVwaEjbtom8");
        await this.clickPlayButton(page);
        await this.clickSkipAds(page);
        await mouseImitation.mousejsInject(page);
        await mouseImitation.randomMoves(page);

        console.log("ok");
        await this.clickAD(page, mouseImitation);
        await page.waitFor(2500000);
        return Promise.resolve("EndPageTask");
    }
    // Youtube functions
    private clickPlayButton = async (page: puppeteer.Page) => {
        const youtubeStartButton = `#movie_player > div.ytp-cued-thumbnail-overlay[style="display: none;"]`;
        const youtubeStartButtonClick = `#movie_player > div.ytp-cued-thumbnail-overlay > button`;
        await page.waitForSelector(youtubeStartButton, {timeout: 5000}).catch(async () => {
            console.log("Play button found => Click");
            await page.click(youtubeStartButtonClick);
            await page.waitForSelector(youtubeStartButton, {timeout: 5000}).catch(() => {
                console.log("Hard Error => Play button not clicked!");
                process.exit();
            });
        });
    }
    private clickSkipAds = async (page: puppeteer.Page) => {
        const skipButton = `button.ytp-ad-skip-button.ytp-button`;
        await page.waitFor(5500);
        await page.waitForSelector(skipButton, {timeout: 7000}).then(
            async () => {
                console.log("Skip button found => Click");
                await page.click(skipButton);
            },
            async () => {
                console.log("Skip button not found => OK");
            },
        );
    }
    private async clickAD(page: puppeteer.Page, mouseImitation: SimulateMouse) {
        const adbutton = "div.style-scope.ytd-iframe-companion-renderer > iframe";
        const cords = await mouseImitation.takeSelectorPosition(page, adbutton);
        console.log(cords);
        // await page.waitFor(11500);
        // await page.click(adbutton);
        console.log("ad button clicked");
    }
}
