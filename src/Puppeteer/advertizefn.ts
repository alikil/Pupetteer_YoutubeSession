import * as puppeteer from "puppeteer";
import { SimulateMouse } from "./mouseImitation";

export class AdvertPage {
    public page: puppeteer.Page;
    constructor(page: puppeteer.Page) {
        this.main(page);
    }
    private async main(page: puppeteer.Page) {
        await page.waitForSelector("body");
        console.log("loaded");
        const before = page.url();
        await this.ClickRandomHref(page, before);
    }
    private async ClickRandomHref(page: puppeteer.Page, before?: string) {
        let hrefAll = await page.$$("[href^='/']");
        if (hrefAll.length < 3) {
            hrefAll = await page.$$("[href^='http']");
        }
        const href = hrefAll[Math.floor(Math.random() * hrefAll.length)];
        await page.evaluate((elem) => {
            elem.scrollIntoView();
        }, href);
        await SimulateMouse.SelectMoveClick(page, href).then(
            async (ok) => {
                if (page.url() === before) {
                    await this.ClickRandomHref(page, before);
                } else {
                    console.log("ok");
                }
            },
            async (err) => {
                await this.ClickRandomHref(page, before);
                return page;
            },
        );
    }
}
