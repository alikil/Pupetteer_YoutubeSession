import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";

interface ISearchDataYandex {
    readonly link: string;
    readonly referer: string;
    readonly words: string[];
    readonly wwhelpWord?: string;
}

export class Yandex {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public referer?: string;
    public useragent: string;
    public link: string;
    public log: Logger;
    public word: string;
    public wwhelpWord: string;
    public newPage: puppeteer.Page;
    public nexpage: puppeteer.Page;
    constructor(MyPuppet: MyPuppeteer, data: ISearchDataYandex) {
        this.log = new Logger();
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.useragent = MyPuppet.UserAgent;
        this.link = data.link;
        this.referer = data.referer;
        this.word = data.words[Math.floor(Math.random() * data.words.length)];
        this.wwhelpWord = data.wwhelpWord;
    }
    public async init() {
        return this.page.then(async (page: puppeteer.Page) => {
            await page.setUserAgent(this.useragent);
            await page.goto(this.link, { referer: this.referer});
            this.log.saveTo(page.url());

            const inputSelector = "input.input__control.input__input";
            await page.type(inputSelector, this.word, {delay: 90});
            await page.keyboard.press("Enter");
            await page.waitForNavigation();
            await page.waitFor(4000);
            await SimulateMouse.mousejsInject(page);

            const helplink = this.wwhelpWord.replace(/\./g, "\.").replace(/\*/g, ".");
            const regexve = new RegExp(`http.?:\/\/${helplink}`, "g");
            const selector = `ul[aria-label="Результаты поиска"] > li > div.organic_with-related_yes`;
            console.log(regexve);
            const aaa = await page.$$eval(selector, (elems) => {
                return elems.map((value, index, array) => {
                    return value.innerHTML;
                });
            });
            const bbf = aaa.filter((value, index, array) => {
                return value.match(regexve);
            });
            const link = bbf[0].match(/href=\"(.*?)\"/)[1].toString();
            await page.setUserAgent(this.useragent);
            const selectornext = `a[href^="${link}"]`;
            const pageTarget = page.target();
            await SimulateMouse.SelectMoveClick(page, selectornext);
            return await this.toNextPage(pageTarget, page, selectornext);
        });
    }
    private async toNextPage( pageTarget: puppeteer.Target, page: puppeteer.Page, selectornext: string) {
        const browser = await this.browser;
        const nextTarget = await browser.waitForTarget((t) => (t.opener() === pageTarget));
        const newpage = await nextTarget.page().then(async (newPage) => {
            await newPage.waitForSelector("body");
            return newPage;
        });
        return newpage;
    }
}
