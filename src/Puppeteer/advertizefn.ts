import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "./mouseImitation";

export class AdvertPage {
    public page: puppeteer.Page;
    public log: Logger;
    constructor(page: puppeteer.Page) {
        this.log = new Logger();
        this.main(page);
    }
    private async main(page: puppeteer.Page) {
        await page.waitForSelector("body");
        await page.waitFor(3000);
        console.log("loaded");
        this.log.saveTo(page.url());
        await this.WorkWithPage(page, 4);
        await page.close();
    }
    private async WorkWithPage(page: puppeteer.Page, count: number) {
        const before: string[] = [];
        for (let index = 0; index < count; index++) {
            const waiter = await SimulateMouse.randomMoves(page, 15);
            const timer = await SimulateMouse.sleep(10000);
            before.push(page.url());
            await Promise.all([waiter, timer]).then(async () => {
                await this.ClickRandomHref(page, before);
            });
        }
    }
    private async ClickRandomHref(page: puppeteer.Page, before?: string[]) {
        await page.waitFor(3000);
        let hrefAll = await page.$$("[href^='/']");
        if (hrefAll.length < 3) {
            hrefAll = await page.$$("[href^='http']");
        }
        const href = hrefAll[Math.floor(Math.random() * hrefAll.length)];
        await SimulateMouse.SelectMoveClick(page, href).catch(async (err) => {
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
