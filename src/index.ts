import { appendFileSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import * as schedule from "node-schedule";

import { IEnv } from "./interfaces/env";
import { GetDate } from "./modules/date";
import { MAinSetings } from "./modules/MAinSetings";
import { Proxy } from "./modules/takeProxy";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";

export const env: IEnv = {
    AppPath : process.env.AppPath || "C:/pupett",
    Login : process.env.Login || "abakeliya",
    UserSite : process.env.UserSite || "Gmail",
};

const date = new GetDate().dmy;
const acc = new MAinSetings(env).acc;
const proxy = Proxy.readProxy(acc);

const MyPuppet = new MyPuppeteer();

schedule.scheduleJob("20 1 * * *", () => {
    console.log("The answer to life, the universe, and everything!");
});

console.log(proxy);
