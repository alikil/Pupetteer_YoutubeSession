import { existsSync, readFileSync } from "fs";
import { IEnv } from "../interfaces/env";
import { IMainAcc } from "../interfaces/interfaces";

export class MAinSetings {
    public acc: IMainAcc;
    constructor(env: IEnv) {
        this.acc = this.init(env);
    }
    private init(env: IEnv) {
        const accountFile = `${env.AppPath}/Sites/Youtube/${env.Login}.txt`;
        let acc: IMainAcc;
        if (!existsSync(accountFile)) {
            console.log("Account not Found " + accountFile);
            process.exit();
        } else {
            acc = JSON.parse(readFileSync(accountFile, "utf8"));
            if (acc.status === "suspended") {
                console.log("Account Suspended " + acc);
                process.exit();
            }
            return acc;
        }
    }
}
