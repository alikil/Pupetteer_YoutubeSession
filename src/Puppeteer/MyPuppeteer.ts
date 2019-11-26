import * as puppeteer from "puppeteer";
import { env } from "../index";
import { Logger } from "../modules/logger";
import { AdvertPage } from "./advertizefn";
import { SimulateMouse } from "./mouseImitation";
import { YoutubeFunctions } from "./youtubefn";

export class MyPuppeteer {
    private log: Logger;
    constructor() {
        this.log = new Logger();
        this.initBrowser().then(async (browser) => {
            const p1 = await this.initPage(browser);
            // const p2 = this.initPage(browser);
            // Promise.all([p1]).then(() => {browser.close(); });
            return "ok";
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
        this.log.saveTo(page.url());
        const pageTarget = page.target();
        await YoutubeFunctions.clickPlayButton(page);
        await YoutubeFunctions.clickSkipAds(page);
        await SimulateMouse.mousejsInject(page);
        await SimulateMouse.randomMoves(page, 5);
        await YoutubeFunctions.clickAD(page);
        await page.waitFor(5000);
        await this.toNextPageClick(browser, pageTarget, page);
        await page.waitFor(2500000);
        return Promise.resolve("EndPageTask");
    }
    private async toNextPageClick(browser: puppeteer.Browser, pageTarget: puppeteer.Target, page: puppeteer.Page) {
        await browser.waitForTarget((target) => (target.opener() === pageTarget), {timeout: 12000} )
        .then(
            async (newTarget) => {
                await newTarget.page().then(async (newPage) => {
                    await newPage.waitForSelector("body");
                    return new AdvertPage(newPage);
                });
            },
            async (err) => {
                console.log("err button => again click");
                await page.waitFor(8000);
                await SimulateMouse.randomMoves(page, 2);
                await YoutubeFunctions.clickAD(page);
                await this.toNextPageClick(browser, pageTarget, page);
            },
        );
    }
}
