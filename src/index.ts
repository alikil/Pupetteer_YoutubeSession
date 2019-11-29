import { Logger } from "./modules/logger";
import { AdvertPage } from "./Puppeteer/advertizefn";
import { SimulateMouse } from "./Puppeteer/mouseImitation";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { Redirect } from "./Puppeteer/pages";
import { Facebook } from "./Search/Facebook";
import { Google } from "./Search/Google";
import { Yandex } from "./Search/Yandex";
import { YoutubeWatchClickAd } from "./Youtube/youtube";
const MyPuppet = new MyPuppeteer();

const num = 693896;
(async function start(adNumber) {
    // Youtube
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
        const advPage = new AdvertPage(aPageRules, log);
        await advPage.main(await Youtube.page);
        await advPage.page.close();
        MyPuppet.browser.then((br) => { br.close(); });
    }
    // Google
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
        const advPage = new AdvertPage(data.adPageRules, log);
        await advPage.main(sitepage);
        await advPage.page.close();
        MyPuppet.browser.then((br) => { br.close(); });
    }
    // Yandex
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
        const advPage = new AdvertPage(data.adPageRules, log);
        await advPage.main(sitepage);
        await advPage.page.close();
        MyPuppet.browser.then((br) => { br.close(); });
    }
    // Facebook
    if (adNumber === 693896) {
        const data = {
            adPageRules: { steps: 3, waitAtPage: 20 },
            link: "https://www.facebook.com/Guy-Julius-Caesar-116122016461538",
            referer: "https://socpublic.com/account/task_view.html?id=693896",
            wwhelpWord: "quiz***-b**.******.",
        };
        const logsettings = {
            advert: { pic: false, url: true },
            search: { pic: false, url: true },
        };
        const log = new Logger(adNumber, logsettings);
        const redirect = new Redirect(await MyPuppet.browser);
        const facebook = new Facebook(MyPuppet, data, log);
        const advPage = new AdvertPage(data.adPageRules, log);

        const fb = await facebook.init();
        const sitepage = await redirect.toNextPage(fb);
        const hrefAll = await sitepage.$$(`div.vc_btn3-container.vc_btn3-inline`);
        const hrefRand = hrefAll[Math.floor(Math.random() * hrefAll.length)];
        await SimulateMouse.SelectMoveClick(sitepage, hrefRand);
        const cseGoogleCom = await redirect.toNextPage(sitepage);
        const cseselectall = await sitepage.$$(`div.gsc-thumbnail-inside div.gs-title > a.gs-title[href]`);
        const csehrefRand = cseselectall[Math.floor(Math.random() * cseselectall.length)];
        await SimulateMouse.SelectMoveClick(cseGoogleCom, csehrefRand);
        const adpage = await redirect.toNextPage(sitepage);
        await advPage.main(adpage);
        MyPuppet.browser.then((br) => { br.close(); });
    }
})(num);
