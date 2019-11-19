import { appendFileSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import * as puppeteer from "puppeteer";
import { IEnv } from "./interfaces/env";
import { GetDate } from "./modules/date";
import { MAinSetings } from "./modules/MAinSetings";
import { TakeNewProxy } from "./modules/takeProxy";

const env: IEnv = {
    AppPath : process.env.AppPath || "C:/pupett",
    Login : process.env.Login || "abakeliya",
    UserSite : process.env.UserSite || "Gmail",
};

const date = new GetDate();
console.log(date);

const acc = new MAinSetings(env).acc;
console.log(acc);

const newprox = new TakeNewProxy(acc).proxy;
console.log(newprox);
/*
const aaa = async () => {
    const browser = await puppeteer.launch({headless: false, ignoreDefaultArgs: ["--mute-audio"]});
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://market.dota2.net/");
    await page.screenshot({path: "screenshot.png"});
    await browser.close();
};
aaa();
*/
