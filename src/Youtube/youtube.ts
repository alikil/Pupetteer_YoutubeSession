import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { AdvertPage } from "../Puppeteer/advertizefn";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";
import { YoutubeFunctions } from "./youtubefn";

export class YoutubeWatchClickAd {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public nextPage: puppeteer.Page;
    private link: string;
    constructor(MyPuppet: MyPuppeteer, link: string, referer?: string) {
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.link = link;
    }
    public async init() {
        return await this.page.then(async (page: puppeteer.Page) => {
            await page.goto(this.link);
            const pageTarget = page.target();
            await YoutubeFunctions.clickPlayButton(page);
            await YoutubeFunctions.clickSkipAds(page);
            await SimulateMouse.mousejsInject(page);

            const waiter = await SimulateMouse.randomMoves(page, 5);
            const timer = await SimulateMouse.sleep(5000);
            const adPage = await Promise.all([waiter, timer]).then(async () => {
                await SimulateMouse.randomMoves(page, 5);
                await YoutubeFunctions.clickAD(page);
                return await this.toNextPageClick(pageTarget, page);
            });
            this.nextPage = adPage;
            return adPage;
        });
    }
    private async toNextPageClick( pageTarget: puppeteer.Target, page: puppeteer.Page) {
        const browser = await this.browser;
        const nextTarget = await browser.waitForTarget((t) => (t.opener() === pageTarget));
        const newpage = await nextTarget.page().then(async (newPage) => {
            await newPage.waitForSelector("body");
            return newPage;
        });
        return newpage;
    }
}
