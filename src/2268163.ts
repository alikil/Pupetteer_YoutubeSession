import { existsSync, mkdirSync } from "fs";
import { IEnv } from "./interfaces/env";
import { MAinSetings } from "./modules/MAinSetings";
import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { Yandex } from "./Search/Yandex";

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

const num = 2268163;

const acc = new MAinSetings(env).acc;
const MyPuppet = new MyPuppeteer(env, acc);

async function start() {
    if (num === 2268163) {
        const link = "https://yandex.by/?from=tabbar";
        const referer = "https://seosprint.net/read-task?435d03481o28cfe03fco671eab90o5423dfad6ao231d1a321d";
        const words = [
        "Родной край прославит плодотворной работой",
        "Солы для Алега з падпіскай",
        "Паляцела яго птушка вечнасці",
        "Вокруг сенсации: Приключения ручной Машки",
        ];
        const site = "agr*gor*dok-s*ly.*om";
        const search = new Yandex(MyPuppet, link, words, referer, site);
        await search.init();
        const name = new AdvertPage(search.newPage);
    }
}
start();
