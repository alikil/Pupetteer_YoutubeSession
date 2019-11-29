import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { Yandex } from "./Search/Yandex";
const MyPuppet = new MyPuppeteer();

const num = 2268163;

async function start() {
    if (num === 2268163) {
        const link = "https://yandex.by/?from=tabbar";
        const referer = "https://seosprint.net/read-task?435d03481o28cfe03fco671eab90o5423dfad6ao231d1a321d";
        const words = [
        "Родной край прославит плодотворной работой",
        "Солы для Алега з падпіскай",
        "Паляцела яго птушка вечнасці",
        "Вокруг сенсации: Приключения ручной Машки",
        ];
        const data = {
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
        const search = new Yandex(MyPuppet, data);
        const sitepage = await search.init();
        const aPageRules = {
            steps: 4,
            waitAtPage: 20,
        };
        const name = new AdvertPage(sitepage, aPageRules);
    }
}
start();
