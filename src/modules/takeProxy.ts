import { readFileSync } from "fs";
import { IMainAcc } from "../interfaces/interfaces";
import { GetDate } from "./date";
export class TakeNewProxy {
    public proxy: string;
    constructor(acc: IMainAcc) {
        this.proxy = this.init(acc.country);
    }
    private init(country: string) {
        const proxylist = JSON.parse(readFileSync(`C:/Socks/${country}_${new GetDate().dmy}.json`, "utf8"));
        const proxy = proxylist[Math.floor(Math.random() * proxylist.length)];
        return proxy;
    }
}
