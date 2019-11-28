import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";

export class Google {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public referer?: string;
    public useragent: string;
    public link: string;
    public log: Logger;
    public word: string;
    public site: string;
    public newPage: puppeteer.Page;
    constructor(MyPuppet: MyPuppeteer, link: string, words: string[], referer: string, site: string) {
        this.log = new Logger();
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.useragent = MyPuppet.UserAgent;
        this.link = link;
        this.referer = referer;
        this.word = words[Math.floor(Math.random() * words.length)];
        this.site = site;
    }
    public async init() {
        this.newPage = await this.page.then(async (page: puppeteer.Page) => {
            await page.setUserAgent(this.useragent);
            await page.goto(this.link, { referer: this.referer});
            const inputSelector = `input[title="Поиск"]`;
            await page.type(inputSelector, this.word, {delay: 90});
            await page.keyboard.press("Enter");
            await page.waitForNavigation();

            await SimulateMouse.mousejsInject(page);

            const selector = `div#main div.g div.r > a[href^='http']`;
            const helplink = this.site.replace(/\./g, "\.").replace(/\*/g, ".");
            const regexHelplink = new RegExp(`${helplink}`, "g");

            const aaa = await page.$$eval(selector, (elems) => {
                return elems.map((value, index, array) => {
                    return value.outerHTML;
                });
            });
            const bbf = aaa.filter((value, index, array) => {
                return value.match(regexHelplink);
            });
            const link = bbf[0].match(/href=\"(.*?)\"/)[1].toString();
            await page.setUserAgent(this.useragent);
            const selectornext = `a[href^="${link}"] > h3`;
            await SimulateMouse.SelectMoveClick(page, selectornext);
            await page.waitForNavigation();
            return page;
        });
    }
}
