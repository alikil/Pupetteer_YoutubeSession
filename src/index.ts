import { existsSync, mkdirSync } from "fs";
import { IEnv } from "./interfaces/env";
import { MAinSetings } from "./modules/MAinSetings";
import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { YoutubeWatchClickAd } from "./Youtube/youtube";

export const env: IEnv = {
    AppPath : process.env.AppPath || "C:/pupett",
    Login : process.env.Login || "abakeliya",
    UserSite : process.env.UserSite || "Youtube",
};

if (!existsSync(`${env.AppPath}/${env.UserSite}`)) {
    mkdirSync(`${env.AppPath}/${env.UserSite}`);
}
if (!existsSync(`${env.AppPath}/${env.UserSite}/${env.Login}`)) {
    mkdirSync(`${env.AppPath}/${env.UserSite}/${env.Login}`);
}

async function start() {
const link = "https://www.youtube.com/watch?v=ADlGkXAz1D0";
const referer = "https://seosprint.net/read-task?587c625aao22a354c46o591b0210o974bba5226o938063ad98";

const acc = new MAinSetings(env).acc;
const MyPuppet = new MyPuppeteer(env, acc);
const Youtube = new YoutubeWatchClickAd(MyPuppet, link, referer);

const adPage = await Youtube.init();
const aPageRules = { steps: 4, waitAtPage: 20 };
const name = new AdvertPage(adPage, aPageRules);
}
start();
