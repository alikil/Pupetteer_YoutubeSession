import { readFileSync } from "fs";
import { IMainAcc } from "../interfaces/interfaces";
import { IProxy } from "../interfaces/proxy";
import { GetDate } from "./date";
class Proxy {
    public static readProxy(acc: IMainAcc): IProxy {
        let proxy: IProxy;
        if (acc.proxy.includes("@")) {
            const arrProxy = acc.proxy.match(/^(.*):(.*)@(.*):(.*$)/);
            proxy = {
                ip: arrProxy[3],
                port: arrProxy[4],
                login: arrProxy[1],
                pass: arrProxy[2]
            };
        } else {
            const arrProxy = acc.proxy.match(/^(.*):(.*$)/);
            proxy = { ip: arrProxy[1], port: arrProxy[2] };
        }
        return proxy;
    }
    public proxy: string;
    constructor(acc: IMainAcc) {
        this.proxy = this.init(acc.country);
    }
    private init(country: string): string {
        const proxylist = JSON.parse(
            readFileSync(
                `C:/Socks/${country}_${new GetDate().dmy}.json`,
                "utf8"
            )
        );
        const proxy: string =
            proxylist[Math.floor(Math.random() * proxylist.length)];
        return proxy;
    }
}

export { Proxy };
