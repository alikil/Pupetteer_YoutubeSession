import { AdvertPage } from "./Puppeteer/advertizefn";
import { MyPuppeteer } from "./Puppeteer/MyPuppeteer";
import { YoutubeWatchClickAd } from "./Youtube/youtube";
const MyPuppet = new MyPuppeteer();

async function start() {
const link = "https://www.youtube.com/watch?v=ADlGkXAz1D0";
const referer = "https://seosprint.net/read-task?587c625aao22a354c46o591b0210o974bba5226o938063ad98";
const Youtube = new YoutubeWatchClickAd(MyPuppet, link, referer);
const adPage = await Youtube.init();
const aPageRules = { steps: 4, waitAtPage: 20 };
const name = new AdvertPage(adPage, aPageRules);
}
start();
