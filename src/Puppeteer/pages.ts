import * as puppeteer from "puppeteer";

export class Redirect {
    public browser: puppeteer.Browser;
    public maintarget: puppeteer.Target;
    constructor(browser: puppeteer.Browser) {
        this.browser = browser;
    }
    public async toNextPage(oldPage: puppeteer.Page) {
        const pageTarget = oldPage.target();
        const finalpage = await this.browser
            .waitForTarget(t => t.opener() === pageTarget, { timeout: 8000 })
            .then(
                async nextTarget => {
                    return nextTarget.page().then(async newPage => {
                        await newPage.waitForSelector("body");
                        await oldPage.close();
                        console.log("NewPage");
                        return newPage;
                    });
                },
                async nextTarget => {
                    console.log("similarPage");
                    await oldPage.waitFor(1000);
                    return oldPage;
                }
            );
        return finalpage;
    }
}
