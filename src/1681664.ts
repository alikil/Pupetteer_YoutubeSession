import { existsSync, mkdirSync } from "fs";
import { IEnv } from "./interfaces/env";
import { MAinSetings } from "./modules/MAinSetings";
import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { Google } from "./Search/Google";

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
        const data = {
            link: "https://www.google.com/",
            referer: "https://seosprint.net/read-task?62636ee00o40128f7368o1150910o38104c6abco754a9ed901",
            words: [
                "достичь стройности и легкости без строгих диет и голодания",
            ],
            wwhelpWord: "pa**ta0*.r*",
        };
        const search = new Google(MyPuppet, data);
        const sitepage = await search.init();

        const aPageRules = { steps: 4, waitAtPage: 20 };
        const name = new AdvertPage(sitepage, aPageRules);
    }
}
start();
