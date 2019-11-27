import { existsSync, mkdirSync } from "fs";
import { Coinextrude } from "./Coinextrude/CoinextrudeReg";
import { IEnv } from "./interfaces/env";
import { MAinSetings } from "./modules/MAinSetings";
import { Proxy } from "./modules/takeProxy";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";

const env: IEnv = {
    AppPath : process.env.AppPath || "C:/pupett",
    Login : process.env.Login || "abakeliya",
    UserSite : process.env.UserSite || "Gmail",
};
if (!existsSync(`${env.AppPath}/${env.UserSite}`)) { mkdirSync(env.UserSite); }
if (!existsSync(`${env.AppPath}/${env.UserSite}/${env.Login}`)) { mkdirSync(env.Login); }

const link = "https://www.youtube.com/watch?v=ADlGkXAz1D0";
const referer = "https://seosprint.net/read-task?587c625aao22a354c46o591b0210o974bba5226o938063ad98";

const acc = new MAinSetings(env).acc;
const MyPuppet = new MyPuppeteer(env, acc);
const regCoinextrude = new Coinextrude(MyPuppet, link, referer);
