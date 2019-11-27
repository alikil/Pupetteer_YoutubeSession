import * as puppeteer from "puppeteer";
import { IEnv } from "../interfaces/env";
import { IMainAcc } from "../interfaces/interfaces";
import { IProxy } from "../interfaces/proxy";
import { Proxy } from "../modules/takeProxy";

export class MyPuppeteer {
    public browser: Promise<puppeteer.Browser>;
    public page: Promise<puppeteer.Page>;
    public env: IEnv;
    public acc: IMainAcc;
    public referer: string;
    public UserAgent: string;
    private proxy: IProxy;
    constructor(env: IEnv, acc: IMainAcc, referer?: string) {
        this.env = env;
        this.acc = acc;
        this.proxy = Proxy.readProxy(acc);
        this.referer = referer;
        this.UserAgent = acc.useragent;
        this.browser = this.initBrowser();
        this.page = this.browser.then(async (browser) => this.initPage(browser));
    }
    private initBrowser() {
        const extensions = {
            AdGuard : `${this.env.AppPath}/extensions/bgnkhhnnamicmpeenaelnjfhikgbkllg/3.3.2_0`,
            PupeteerRecorder : `${this.env.AppPath}/extensions/djeegiggegleadkkbgopoonhjimgehda/0.7.1_0`,
            // TimeShift: `${env.AppPath}/extensions/nbofeaabhknfdcpoddmfckpokmncimpj/0.1.4_0`,
            WebRTC  : `${this.env.AppPath}/extensions/bppamachkoflopbagkdoflbgfjflfnfl/1.0.4_0`,
        };
        const proxyurl = `${this.proxy.ip}:${this.proxy.port}`;
        return puppeteer.launch({
            args: [
                `--disable-extensions-except=${extensions.PupeteerRecorder},${extensions.WebRTC }`,
                // `--load-extension=${extensions.AdGuard}`,
                `--load-extension=${extensions.PupeteerRecorder}`,
                `--load-extension=${extensions.WebRTC}`,
                // `--load-extension=${extensions.TimeShift}`,
                `--proxy-server=${proxyurl}`,
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--disable-infobars",
            ],
            defaultViewport: { width: 1280, height: 720 },
            headless: false,
            ignoreDefaultArgs: ["--mute-audio"],
            ignoreHTTPSErrors: true,
            userDataDir: `${this.env.AppPath}/${this.env.UserSite}/${this.env.Login}`,
        });
    }
    private async initPage(browser: puppeteer.Browser) {
        const page = await browser.newPage();
        await page.setUserAgent(this.UserAgent);
        if (this.proxy.login) {
            const proxyAuth = {
                username: this.proxy.login,
                // tslint:disable-next-line:object-literal-sort-keys
                password: this.proxy.pass,
            };
            await page.authenticate(proxyAuth);
            return page;
        }
        return page;
    }
}
