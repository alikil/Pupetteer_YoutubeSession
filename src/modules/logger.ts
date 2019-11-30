import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import * as puppeteer from "puppeteer";
import { GetDate } from "./date";

export interface ILogSettings {
    search: { pic: boolean, url: boolean };
    advert: { pic: boolean, url: boolean };
}

export class Logger {
    public path: string;
    public date: string;
    public adnum: number;
    public mainPath: string;
    public screenshotPath: string;
    public logSettings: ILogSettings;
    public search: { pic: boolean; url: boolean; };
    public advert: { pic: boolean; url: boolean; };
    constructor(adnum: number, logSettings: ILogSettings) {
        this.search = logSettings.search;
        this.advert = logSettings.advert;
        this.adnum = adnum;
        this.logSettings = logSettings;
        this.date = new GetDate().dmy;
        this.path = "C:/pupett/logs";
        this.init();
    }
    public saveUrl(info: string) {
        const file = `${this.mainPath}/${this.date}.txt`;
        const textFile = readFileSync(file, "utf8");
        if (textFile.includes(info)) {
            console.log("line already exist");
        } else {
            appendFileSync(file, `${info}\n`);
        }
        return "ok";
    }
    public async savePicture(page: puppeteer.Page, name: string) {
        await page.screenshot({path: `${this.screenshotPath}/${name}.jpeg`, type: "jpeg", fullPage: false });
        await page.waitFor(1000);
        return "ok";
    }
    private init() {
        this.mainPath = `${this.path}/${this.adnum}/${this.date}`;
        this.screenshotPath = `${this.mainPath}/screenshot`;
        if (!existsSync(this.path)) { mkdirSync(this.path); }
        if (!existsSync(`${this.path}/${this.adnum}`)) {
            mkdirSync(`${this.path}/${this.adnum}`);
        }
        if (!existsSync(`${this.mainPath}`)) {
            mkdirSync(`${this.mainPath}`);
        }
        if (!existsSync(`${this.mainPath}/${this.date}.txt`)) {
            writeFileSync(`${this.mainPath}/${this.date}.txt`, "");
        }
        if (!existsSync(`${this.screenshotPath}`)) {
            mkdirSync(`${this.screenshotPath}`);
        }
    }
}
