import { appendFileSync, existsSync, mkdirSync, readFileSync } from "fs";
import { GetDate } from "./date";

export class Logger {
    public path: string;
    constructor() {
        this.path = "C:/pupett/logs";
        this.init();
    }
    public saveTo(info: string) {
        const file = `${this.path}/${new GetDate().dmy}.txt`;
        const textFile = readFileSync(file, "utf8");
        if (textFile.includes(info)) {
            console.log("line already exist");
        } else {
            appendFileSync(file, `${info}\n`);
        }
    }
    private init() {
        if (!existsSync(this.path)) { mkdirSync(this.path); }
    }
}
