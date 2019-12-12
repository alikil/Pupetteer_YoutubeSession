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
    public word: string;
    public wwhelpWord: string;
    public newPage: puppeteer.Page;
    public nexpage: puppeteer.Page;
    public log: Logger;
    constructor(MyPuppet: MyPuppeteer, data: ISearchDataYandex, log: Logger) {
        this.log = log;
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.useragent = MyPuppet.UserAgent;
        this.link = data.link;
        this.referer = data.referer;
        this.word = data.words[Math.floor(Math.random() * data.words.length)];
        this.wwhelpWord = data.wwhelpWord;
    }
    public async init(): Promise<puppeteer.Page> {
        const page = await this.page;
        await page.setUserAgent(this.useragent);
        await page.goto(this.link, { referer: this.referer });
        const inputSelector = "input.input__control.input__input";
        await page.type(inputSelector, this.word, { delay: 90 });
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        await page.waitFor(4000);
        if (this.log.search.pic === true) {
            await this.log.savePicture(page, "search");
        }
        if (this.log.search.url === true) {
            this.log.saveUrl(page.url());
        }
        await SimulateMouse.mousejsInject(page);
        const helplink = this.wwhelpWord
            .replace(/\./g, ".")
            .replace(/\*/g, ".");
        const regexve = new RegExp(`http.?:\/\/${helplink}`, "g");
        const selector = `ul[aria-label="Результаты поиска"] > li > div.organic_with-related_yes`;
        console.log(regexve);
        const aaa = await page.$$eval(selector, elems => {
            return elems.map(value => {
                return value.innerHTML;
            });
        });
        const bbf = aaa.filter(value => {
            return value.match(regexve);
        });
        const link = bbf[0].match(/href=\"(.*?)\"/)[1].toString();
        await page.setUserAgent(this.useragent);
        const selectornext = `a[href^="${link}"]`;
        const pageTarget = page.target();
        await SimulateMouse.SelectMoveClick(page, selectornext);
        return await this.toNextPage(pageTarget, page, selectornext);
    }
    private async toNextPage(
        pageTarget: puppeteer.Target,
        page: puppeteer.Page,
        selectornext: string
    ): Promise<puppeteer.Page> {
        const browser = await this.browser;
        const nextTarget = await browser.waitForTarget(
            t => t.opener() === pageTarget
        );
        const nextPagenew = await nextTarget.page();
        await nextPagenew.waitForSelector("body");
        return nextPagenew;
    }
}
