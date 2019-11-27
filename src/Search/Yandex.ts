import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";
import { SimulateMouse } from "../Puppeteer/mouseImitation";
import { MyPuppeteer } from "../Puppeteer/MyPuppeteer";

export class Yandex {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public referer?: string;
    public useragent: string;
    public link: string;
    public log: Logger;
    public word: string;
    public site: string;
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
    public init() {
        this.page.then(async (page: puppeteer.Page) => {
            await page.setUserAgent(this.useragent);
            await page.goto(this.link, { referer: this.referer});
            this.log.saveTo(page.url());

            const inputSelector = "input.input__control.input__input";
            await page.type(inputSelector, this.word, {delay: 90});
            await page.keyboard.press("Enter");
            await page.waitForNavigation();

            const pageTarget = page.target();
            await SimulateMouse.mousejsInject(page);

            const helplink = this.site.replace(/\./g, "\.").replace(/\*/g, ".");
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

            console.log(selectornext);

            await SimulateMouse.SelectMoveClick(page, selectornext);
            await page.waitFor(200000);
            /*
            const waiter = await SimulateMouse.randomMoves(page, 5);
            const timer = await SimulateMouse.sleep(5000);
            await Promise.all([waiter, timer]).then(async () => {
                await SimulateMouse.randomMoves(page, 5);
                await page.waitFor(2500000);
                return Promise.resolve("EndPageTask");
            });
            page.close();
            this.browser.then((browser) => { browser.close(); });
            */
        });
    }
}
