import * as puppeteer from "puppeteer";
import { ILogSettings, Logger } from "../modules/logger";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";

interface ISearchData {
    readonly link: string;
    readonly referer: string;
    readonly words?: string[];
    readonly wwhelpWord: string;
}

export class Facebook {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public referer?: string;
    public useragent: string;
    public link: string;
    public word: string;
    public wwhelpWord: string;
    public newPage: puppeteer.Page;
    public log: Logger;
    constructor(MyPuppet: MyPuppeteer, data: ISearchData, log: Logger) {
        this.log = log;
        this.browser = MyPuppet.browser;
        this.page = MyPuppet.page;
        this.useragent = MyPuppet.UserAgent;
        this.link = data.link;
        this.referer = data.referer;
        if (data.words) {
            this.word =
                data.words[Math.floor(Math.random() * data.words.length)];
        }
        this.wwhelpWord = data.wwhelpWord;
    }
    public async init(): Promise<puppeteer.Page> {
        const page = await this.page;
        await page.setUserAgent(this.useragent);
        await page.goto(this.link, { referer: this.referer });
        if (this.log.search.pic === true) {
            await this.log.savePicture(page, "search");
        }
        if (this.log.search.url === true) {
            this.log.saveUrl(page.url());
        }
        await SimulateMouse.mousejsInject(page);
        const selector = `a[href^="http"]`;
        const helplink = this.wwhelpWord
            .replace(/\./g, ".")
            .replace(/\*/g, ".");
        const regexHelplink = new RegExp(`${helplink}`, "g");
        const aaa = await page.$$eval(selector, elems => {
            return elems.map(value => {
                return value.outerHTML;
            });
        });
        const bbf = aaa.filter(value => {
            return value.match(regexHelplink);
        });
        const link = bbf[0]
            .match(/href=\"(.*?)\"/)[1]
            .toString()
            .match(/(.*)\&/)[1];
        const selectornext = `a[href^="${link}"]`;
        await SimulateMouse.SelectMoveClick(page, selectornext);
        return page;
    }
}
