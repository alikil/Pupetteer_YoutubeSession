import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { GetDate } from "./date";

export class Logger {
    public path: string;
    public date: string;
    constructor() {
        this.date = new GetDate().dmy;
        this.path = "C:/pupett/logs";
        this.init();
    }
    public saveTo(info: string) {
        const file = `${this.path}/${this.date}.txt`;
        const textFile = readFileSync(file, "utf8");
        if (textFile.includes(info)) {
            console.log("line already exist");
        } else {
            appendFileSync(file, `${info}\n`);
        }
    }
    private init() {
        if (!existsSync(this.path)) { mkdirSync(this.path); }
        if (!existsSync(`${this.path}/${this.date}.txt`)) {
            writeFileSync(`${this.path}/${this.date}.txt`, "");
        }
    }
}
