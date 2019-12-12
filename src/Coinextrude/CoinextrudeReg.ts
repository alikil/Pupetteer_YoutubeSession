import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";
import { runInThisContext } from "vm";

export class Coinextrude {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public referer?: string;
    public useragent: string;
    private link: string;
    private log: Logger;
    constructor(MyPuppet: MyPuppeteer, link: string, referer?: string) {
        this.log = new Logger();
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.useragent = MyPuppet.UserAgent;
        this.link = link;
        this.referer = referer;
        this.init();
    }
    private async init() : Promise<void>{
        const page = await this.page;

        await page.setUserAgent(this.useragent);
        await page.goto(this.link, { referer: this.referer});
        this.log.saveTo(page.url());
        const pageTarget = page.target();
        await SimulateMouse.mousejsInject(page);

        await page.waitFor(200000);
        const waiter = await SimulateMouse.randomMoves(page, 5);
        const timer = await SimulateMouse.sleep(5000);
        await Promise.all([waiter, timer]);

        await SimulateMouse.randomMoves(page, 5);
            await page.waitFor(2500000);
            
        page.close();
        this.browser.then((browser) => { browser.close(); });
    }

    /*
    private async init() { await this.page(async (page: puppeteer.Page) => {
            await page.setUserAgent(this.useragent);
            await page.goto(this.link, { referer: this.referer});
            this.log.saveTo(page.url());
            const pageTarget = page.target();
            await SimulateMouse.mousejsInject(page);

            await page.waitFor(200000);
            const waiter = await SimulateMouse.randomMoves(page, 5);
            const timer = await SimulateMouse.sleep(5000);
            await Promise.all([waiter, timer]).then(async () => {
                await SimulateMouse.randomMoves(page, 5);
                await page.waitFor(2500000);
                return Promise.resolve("EndPageTask");
            });
            page.close();
            this.browser.then((browser) => { browser.close(); });
        });
    }
    */
}
