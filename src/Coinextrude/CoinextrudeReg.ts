import * as puppeteer from "puppeteer";
import { Logger } from "../modules/logger";

export class Coinextrude {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    private link: string;
    private log: Logger;
    constructor(browserPromise: Promise<puppeteer.Browser>, pagePromise: Promise<puppeteer.Page>, link: string) {
        this.log = new Logger();
        this.browser = browserPromise;
        this.page = pagePromise;
        this.link = link;
        this.init();
    }
    private init() {
        
    }
}
