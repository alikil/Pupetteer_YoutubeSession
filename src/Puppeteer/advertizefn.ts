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
        await page.evaluate((elem) => { elem.scrollIntoView(); }, href);
        await SimulateMouse.SelectMoveClick(page, href).then(
            async (ok) => {
                console.log("click => ok");
                await page.waitForNavigation({timeout: 5000}).catch(async (err) => {
                    console.log("Navigation err");
                    await this.ClickRandomHref(page, before);
                });
                if (page.url() === before) {
                    console.log("before : after => " + page.url() + "\n" + before);
                    await this.ClickRandomHref(page, before);
                } else {
                    console.log("ok");
                    Promise.resolve(page);
                }
            },
            async (err) => {
                console.log("click => err");
                await this.ClickRandomHref(page, before);
            },
        );
    }
}
