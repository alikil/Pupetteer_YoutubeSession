import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { AdvertPage } from "../Puppeteer/advertizefn";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";
import { YoutubeFunctions } from "./youtubefn";

export class YoutubeWatchClickAd {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    private link: string;
    private log: Logger;
    constructor(MyPuppet: MyPuppeteer, link: string, referer?: string) {
        this.log = new Logger();
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.link = link;
        this.init();
    }
    public async init() {
        this.page.then(async (page: puppeteer.Page) => {
            await page.goto(this.link);
            this.log.saveTo(page.url());
            const pageTarget = page.target();
            await YoutubeFunctions.clickPlayButton(page);
            await YoutubeFunctions.clickSkipAds(page);
            await SimulateMouse.mousejsInject(page);

            const waiter = await SimulateMouse.randomMoves(page, 5);
            const timer = await SimulateMouse.sleep(5000);
            await Promise.all([waiter, timer]).then(async () => {
                await SimulateMouse.randomMoves(page, 5);
                await YoutubeFunctions.clickAD(page);
                await this.toNextPageClick(pageTarget, page);
                await page.waitFor(2500000);
                return Promise.resolve("EndPageTask");
            });
            page.close();
            this.browser.then((browser) => { browser.close(); });
        });
    }
    private async toNextPageClick( pageTarget: puppeteer.Target, page: puppeteer.Page) {
        this.browser.then((browser) => {
            browser.waitForTarget((target) => (target.opener() === pageTarget), {timeout: 12000} )
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
                    await this.toNextPageClick(pageTarget, page);
                },
            );
        });
    }
}
