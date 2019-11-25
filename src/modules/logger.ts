import { appendFileSync, existsSync, mkdirSync } from "fs";
import { GetDate } from "./date";

export class Logger {
    public path: string;
    constructor() {
        this.path = "C:/pupett/logs";
        this.init();
    }
    public saveTo(info: string) {
        appendFileSync(`${this.path}/${new GetDate().dmy}.txt`, `${info}\n`);
    }
    private init() {
        if (!existsSync(this.path)) { mkdirSync(this.path); }
    }
}
