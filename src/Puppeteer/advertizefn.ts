import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "./mouseImitation";

export class AdvertPage {
    public page: puppeteer.Page;
    public steps: number;
    public waitAtPage: number;
    public log: Logger;
    public UserSite: string;
    constructor(rules: { steps: any; waitAtPage: number }, log: Logger) {
        this.log = log;
        this.steps = rules.steps;
        this.waitAtPage = rules.waitAtPage;
    }
    public async main(page: puppeteer.Page): Promise<puppeteer.Page> {
        await page.waitForSelector("body");
        await page.waitFor(3000);
        await SimulateMouse.mousejsInject(page);
        this.UserSite = page.url().match(/\/\/(.*?)\//)[1];
        await this.WorkWithPage(page);
        return page;
    }
    private async WorkWithPage(page: puppeteer.Page): Promise<void> {
        const before: string[] = [];
        for (let index = 0; index < this.steps; index++) {
            if (this.log.advert.pic === true) {
                await this.log.savePicture(page, `${index}_${this.UserSite}`);
            }
            if (this.log.advert.url === true) {
                this.log.saveUrl(page.url());
            }
            // const waiter = SimulateMouse.randomMoves(page, 15);
            const moves = SimulateMouse.randomMoves(page, this.waitAtPage / 2);
            const timer = await SimulateMouse.sleep(this.waitAtPage * 1000);
            before.push(page.url());
            await Promise.all([timer, moves]);
            await this.ClickRandomHref(page, before);
        }
    }
    private async ClickRandomHref(
        page: puppeteer.Page,
        before?: string[]
    ): Promise<string> {
        await SimulateMouse.randomMoves(page, 1);
        await page.waitFor(1000);
        let hrefAll = await page.$$(`a[href^='https://${this.UserSite}/']`);
        if (hrefAll.length < 3) {
            hrefAll = await page.$$(`a[href^='http://${this.UserSite}/']`);
        }
        if (hrefAll.length < 3) {
            hrefAll = await page.$$("a[href^='/']");
        }
        const href = hrefAll[Math.floor(Math.random() * hrefAll.length)];
        if (href === undefined) {
            return "ok";
        }
        const checkForElemWork = await SimulateMouse.takeElementPosition(
            page,
            href
        );
        let readylink = "err";
        if (checkForElemWork[0] !== 0 && checkForElemWork[1] !== 0) {
            readylink = "ok";
        }
        if (checkForElemWork[0] > 10 && checkForElemWork[1] > 10) {
            readylink = "ok";
        }
        console.log(checkForElemWork);
        if (readylink === "err") {
            await this.ClickRandomHref(page, before);
            return "ok";
        }
        if (readylink === "ok") {
            await SimulateMouse.SelectMoveClick(page, href);
            await page.waitForNavigation({ timeout: 8000 }).then(
                async res => {
                    await page.waitFor(5000);
                    if (before.includes(page.url())) {
                        await this.ClickRandomHref(page, before);
                        return "ok";
                    } else {
                        console.log("ok " + page.url());
                        return "ok";
                    }
                },
                async err => {
                    console.log("click => err");
                    await this.ClickRandomHref(page, before);
                    return "ok";
                }
            );
        }
    }
}
