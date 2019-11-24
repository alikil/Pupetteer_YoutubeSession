import * as puppeteer from "puppeteer";
import { env } from "../index";
import { AdvertPage } from "./advertizefn";
import { SimulateMouse } from "./mouseImitation";
import { YoutubeFunctions } from "./youtubefn";

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
        const page = await browser.newPage();
        await page.goto("https://www.youtube.com/watch?v=ADlGkXAz1D0");
        await YoutubeFunctions.clickPlayButton(page);
        await YoutubeFunctions.clickSkipAds(page);
        await SimulateMouse.mousejsInject(page);
        await SimulateMouse.randomMoves(page, 5);
        const pageTarget = page.target();
        await YoutubeFunctions.clickAD(page);

        await this.toNextPageClick(browser, pageTarget);

        await page.waitFor(2500000);
        return Promise.resolve("EndPageTask");
    }
    private async toNextPageClick(browser: puppeteer.Browser, pageTarget: puppeteer.Target) {
        await browser.waitForTarget((target) => target.opener() === pageTarget)
        .then(
            async (newTarget) => {
                await newTarget.page().then(async (newPage) => {
                    console.log("newPage");
                    await newPage.waitForSelector("body");
                    console.log("newPage => selector body");
                    return new AdvertPage(newPage);
                });
            },
            async (err) => {
                console.log("err button");
            },
        );
    }
}
