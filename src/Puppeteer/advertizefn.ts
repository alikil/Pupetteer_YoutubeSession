import * as puppeteer from "puppeteer";

export class AdvertPage {
    public page: puppeteer.Page;
    constructor(page: puppeteer.Page) {
        console.log("loaded");
        this.main(page);
    }
    private async main(page: puppeteer.Page) {
        console.log("main start");
        await this.takeNav(page);
    }
    private async takeNav(page: puppeteer.Page) {
        console.log("take Nav");
        const navCount = await page.$$eval("nav", (navs) => navs);
        console.log(navCount);
    }
}
