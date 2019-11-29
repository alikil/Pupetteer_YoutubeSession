import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "./mouseImitation";

export class AdvertPage {
    public page: puppeteer.Page;
    public log: Logger;
    public steps: number;
    public waitAtPage: number;
    public UserSite: RegExpMatchArray;
    constructor(page: puppeteer.Page, rules: { steps: any; waitAtPage: number; }) {
        this.steps = rules.steps;
        this.waitAtPage = rules.waitAtPage;
        this.log = new Logger();
        this.UserSite = page.url().match(/\/\/(.*)\//);
        this.main(page);
    }
    private async main(page: puppeteer.Page) {
        await page.waitForSelector("body");
        await page.waitFor(3000);
        console.log("loaded");
        this.log.saveTo(page.url());
        await SimulateMouse.mousejsInject(page);
        await this.WorkWithPage(page);
        await page.close();
    }
    private async WorkWithPage(page: puppeteer.Page) {
        const before: string[] = [];
        for (let index = 0; index < this.steps; index++) {
            const waiter = SimulateMouse.randomMoves(page, 15);
            const timer = SimulateMouse.sleep(this.waitAtPage * 1000);
            before.push(page.url());
            await Promise.all([waiter, timer]).then(async () => {
                await this.ClickRandomHref(page, before);
            });
        }
    }
    private async ClickRandomHref(page: puppeteer.Page, before?: string[]) {
        await page.waitFor(3000);
        let hrefAll = await page.$$("a[href^='/']");
        if (hrefAll.length < 3) {
            hrefAll = await page.$$(`a[href^='http://${this.UserSite}/']`);
        }
        if (hrefAll.length < 3) {
            hrefAll = await page.$$(`a[href^='https://${this.UserSite}/']`);
        }
        const href = hrefAll[Math.floor(Math.random() * hrefAll.length)];
        await SimulateMouse.SelectMoveClick(page, href);
        await page.waitForNavigation({ timeout: 8000 }).catch(async (err) => {
                console.log("click => err");
                await this.ClickRandomHref(page, before);
        });
        await page.waitFor(5000);
        if (before.includes(page.url())) { await this.ClickRandomHref(page, before); } else {
            this.log.saveTo(page.url());
            console.log("ok " + page.url());
        }
    }
}
