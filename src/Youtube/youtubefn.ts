import * as puppeteer from "puppeteer";
import { SimulateMouse } from "../Puppeteer/mouseImitation";

class YoutubeFunctions {
    public static clickPlayButton = async (
        page: puppeteer.Page
    ): Promise<void> => {
        const youtubeStartButton = `#movie_player > div.ytp-cued-thumbnail-overlay[style="display: none;"]`;
        const youtubeStartButtonClick = `#movie_player > div.ytp-cued-thumbnail-overlay > button`;
        await page
            .waitForSelector(youtubeStartButton, { timeout: 5000 })
            .catch(async () => {
                console.log("Play button found => Click");
                await SimulateMouse.SelectMoveClick(
                    page,
                    youtubeStartButtonClick
                );
                await page
                    .waitForSelector(youtubeStartButton, { timeout: 5000 })
                    .catch(() => {
                        console.log("Hard Error => Play button not clicked!");
                        process.exit();
                    });
            });
    };
    public static clickSkipAds = async (
        page: puppeteer.Page
    ): Promise<void> => {
        const skipButton = `button.ytp-ad-skip-button.ytp-button`;
        await page.waitFor(5500);
        await page.waitForSelector(skipButton, { timeout: 7000 }).then(
            async () => {
                console.log("Skip button found => Click");
                await SimulateMouse.SelectMoveClick(page, skipButton);
            },
            async () => {
                console.log("Skip button not found => OK");
            }
        );
    };
    public static clickAD = async (page: puppeteer.Page): Promise<void> => {
        const fullAdFrame = `
        #squareThrone > div.ns-khitf-e-1,
        #squareThrone > div.ns-khitf-e-2.bottom,
        iframe[src^="https://googleads.g.doubleclick.net/pagead/ads?"]
        `;
        const elem = await page.$(fullAdFrame);
        if (elem === null) {
            console.log("Ad => Nou found");
            await page.reload();
            await page.waitFor(5000);
            await YoutubeFunctions.clickAD(page);
        } else {
            await SimulateMouse.SelectMoveClick(page, fullAdFrame);
            console.log("ad button clicked");
            console.log("Ad => Found");
        }
    };
}

export { YoutubeFunctions };
