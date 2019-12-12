import * as puppeteer from "puppeteer";
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

const num = 1681664;
(async function start(adNumber) {
    // Youtube
    if (adNumber === 3) {
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true }
        };
        const link = "https://www.youtube.com/watch?v=ADlGkXAz1D0";
        const referer =
            "https://seosprint.net/read-task?587c625aao22a354c46o591b0210o974bba5226o938063ad98";
        const aPageRules = { steps: 4, waitAtPage: 20 };
        const log = new Logger(adNumber, logsettings);
        const Youtube = new YoutubeWatchClickAd(MyPuppet, link, referer);
        const advPage = new AdvertPage(aPageRules, log);
        await Youtube.init();
        await advPage.main(await Youtube.page);
        await advPage.page.close();
        MyPuppet.browser.then(br => {
            br.close();
        });
    }
    // Google
    if (adNumber === 1681664) {
        const data = {
            adPageRules: { steps: 4, waitAtPage: 20 },
            link: "https://www.google.com/",
            referer:
                "https://seosprint.net/read-task?62636ee00o40128f7368o1150910o38104c6abco754a9ed901",
            words: [
                "достичь стройности и легкости без строгих диет и голодания"
            ],
            wwhelpWord: "pa**ta0*.r*"
        };
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true }
        };
        const log = new Logger(adNumber, logsettings);
        const search = new Google(MyPuppet, data, log);
        const advPage = new AdvertPage(data.adPageRules, log);
        const sitepage = await search.init();
        await advPage.main(sitepage);
        await advPage.page.close();
        MyPuppet.browser.then(br => {
            br.close();
        });
    }
    // Yandex
    if (adNumber === 2268163) {
        const data = {
            adPageRules: { steps: 1, waitAtPage: 10 },
            link: "https://yandex.by/?from=tabbar",
            referer:
                "https://seosprint.net/read-task?435d03481o28cfe03fco671eab90o5423dfad6ao231d1a321d",
            words: [
                "Родной край прославит плодотворной работой",
                "Солы для Алега з падпіскай",
                "Паляцела яго птушка вечнасці",
                "Вокруг сенсации: Приключения ручной Машки"
            ],
            wwhelpWord: "agr*gor*dok-s*ly.*om"
        };
        const logsettings = {
            advert: { pic: true, url: true },
            search: { pic: true, url: true }
        };
        const log = new Logger(adNumber, logsettings);
        const redirect = new Redirect(await MyPuppet.browser);
        const search = new Yandex(MyPuppet, data, log);
        const advPage = new AdvertPage(data.adPageRules, log);
        const searchPage = await search.init();
        const searchPage2 = await redirect.toNextPage(searchPage);
        const searchPageFinal = await advPage.main(searchPage2);

        const mplhgjoPage = await SimulateMouse.selectTakeRandLinkClick(
            searchPageFinal,
            mplhgjo,
            redirect
        );
        const mplhgjoPageok = await redirect.toNextPage(mplhgjoPage);
        await mplhgjoPageok.waitFor(8000);
        await mplhgjoPageok.close();

        const mplhgjoPage2 = await SimulateMouse.selectTakeRandLinkClick(
            searchPageFinal,
            mplhgjo,
            redirect
        );
        const mplhgjoPage2ok = await redirect.toNextPage(mplhgjoPage2);
        await mplhgjoPage2ok.waitFor(8000);
        await mplhgjoPage2ok.close();

        await advPage.page.close();
        MyPuppet.browser.then(br => {
            br.close();
        });
    }
    // Facebook
    if (adNumber === 693896) {
        const data = {
            adPageRules: { steps: 3, waitAtPage: 20 },
            link: "https://www.facebook.com/Guy-Julius-Caesar-116122016461538",
            referer: "https://socpublic.com/account/task_view.html?id=693896",
            wwhelpWord: "quiz***-b**.******."
        };
        const logsettings = {
            advert: { pic: false, url: false },
            search: { pic: false, url: false }
        };
        const log = new Logger(adNumber, logsettings);
        const redirect = new Redirect(await MyPuppet.browser);
        const facebook = new Facebook(MyPuppet, data, log);
        const advPage = new AdvertPage(data.adPageRules, log);
        const fb = await facebook.init();
        const sitepage = await redirect.toNextPage(fb);
        const cseGoogleCom = await SimulateMouse.selectTakeRandLinkClick(
            sitepage,
            `div.vc_btn3-container.vc_btn3-inline`,
            redirect
        );
        log.saveUrl(cseGoogleCom.url());
        const [frm, frmsel] = [
            "master-1",
            `div#adBlock a[href^='https://www.googleadservices.com/pagead/aclk?']`
        ];
        const adpage = await SimulateMouse.frameClick(
            cseGoogleCom,
            frm,
            frmsel,
            redirect
        );
        log.saveUrl(adpage.url());
        await advPage.main(adpage);
        MyPuppet.browser.then(br => {
            br.close();
        });
    }
    if (adNumber === 111) {
        // Test manual Page
        const data = {
            adPageRules: { steps: 3, waitAtPage: 20 },
            link: "https://www.facebook.com/Guy-Julius-Caesar-116122016461538",
            referer: "https://socpublic.com/account/task_view.html?id=693896",
            wwhelpWord: "quiz***-b**.******."
        };
        const logsettings = {
            advert: { pic: false, url: false },
            search: { pic: false, url: false }
        };
        const log = new Logger(adNumber, logsettings);
        const redirect = new Redirect(await MyPuppet.browser);
        const facebook = new Facebook(MyPuppet, data, log);
        const advPage = new AdvertPage(data.adPageRules, log);
        console.log(MyPuppet.acc);
        // MyPuppet.page.then(async (p) => { await p.waitFor(1000000); });
        // MyPuppet.browser.then((br) => { br.close(); });
    }
})(num);

const rktch = `a[href^="//st1.rktch.com/sclick?"]`;
const linksWm = `a[href^="http://link.links-wm.ru/check.php?page="]`;
const mplhgjo = `a[href^="http://mplhgjo.qkurtnucn.com/c?"]`;
const txtrk = `a[href^="http://txtrk.com/tiz/onc.php?"]`;
