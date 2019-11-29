import { Logger } from "./modules/logger";
import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { Google } from "./Search/Google";
import { Yandex } from "./Search/Yandex";
import { YoutubeWatchClickAd } from "./Youtube/youtube";
const MyPuppet = new MyPuppeteer();

const num = 2268163;
(async function start(adNumber) {
    if (adNumber === 1) {
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true },
        };
        const log = new Logger(adNumber, logsettings);
        const link = "https://www.youtube.com/watch?v=ADlGkXAz1D0";
        const referer = "https://seosprint.net/read-task?587c625aao22a354c46o591b0210o974bba5226o938063ad98";
        const aPageRules = { steps: 4, waitAtPage: 20 };
        const Youtube = new YoutubeWatchClickAd(MyPuppet, link, referer);
        await Youtube.init();
        const advPage = new AdvertPage(Youtube.nextPage, aPageRules, log);
        await advPage.main(advPage.page);
        await advPage.page.close();
        await Youtube.browser.then((browser) => browser.close());
    }
    if (adNumber === 1681664) {
        const data = {
            adPageRules: { steps: 4, waitAtPage: 20 },
            link: "https://www.google.com/",
            referer: "https://seosprint.net/read-task?62636ee00o40128f7368o1150910o38104c6abco754a9ed901",
            words: ["достичь стройности и легкости без строгих диет и голодания"],
            wwhelpWord: "pa**ta0*.r*",
        };
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true },
        };
        const log = new Logger(adNumber, logsettings);
        const search = new Google(MyPuppet, data, log);
        const sitepage = await search.init();
        const advPage = new AdvertPage(sitepage, data.adPageRules, log);
        await advPage.main(sitepage);
        await advPage.page.close();
        await search.browser.then((browser) => browser.close());
    }
    if (adNumber === 2268163) {
        const data = {
            adPageRules: { steps: 10, waitAtPage: 10 },
            link: "https://yandex.by/?from=tabbar",
            referer: "https://seosprint.net/read-task?435d03481o28cfe03fco671eab90o5423dfad6ao231d1a321d",
            words: [
                "Родной край прославит плодотворной работой",
                "Солы для Алега з падпіскай",
                "Паляцела яго птушка вечнасці",
                "Вокруг сенсации: Приключения ручной Машки",
            ],
            wwhelpWord: "agr*gor*dok-s*ly.*om",
        };
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true },
        };
        const log = new Logger(adNumber, logsettings);

        const search = new Yandex(MyPuppet, data, log);
        const sitepage = await search.init();
        const advPage = new AdvertPage(sitepage, data.adPageRules, log);
        await advPage.main(sitepage);
        await advPage.page.close();
        await search.browser.then((browser) => browser.close());
    }
})(num);
