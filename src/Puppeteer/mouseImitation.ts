import * as puppeteer from "puppeteer";

export class SimulateMouse {
    public static async mousejsInject(page: puppeteer.Page) {
        await page.evaluate(() => {
            const box = document.createElement("div");
            box.classList.add("mouse-helper");
            const styleElement = document.createElement("style");
            styleElement.innerHTML = `
            .mouse-helper {
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: rgba(0,0,0,.4);
            border: 1px solid white;
            border-radius: 10px;
            margin-left: -10px;
            margin-top: -10px;
            transition: background .2s, border-radius .2s, border-color .2s;
            }
            .mouse-helper.button-1 {
            transition: none;
            background: rgba(0,0,0,0.9);
            }
            .mouse-helper.button-2 {
            transition: none;
            border-color: rgba(0,0,255,0.9);
            }
            .mouse-helper.button-3 {
            transition: none;
            border-radius: 4px;
            }
            .mouse-helper.button-4 {
            transition: none;
            border-color: rgba(255,0,0,0.9);
            }
            .mouse-helper.button-5 {
            transition: none;
            border-color: rgba(0,255,0,0.9);
            }
            `;
            document.head.appendChild(styleElement);
            document.body.appendChild(box);
            document.addEventListener("mousemove", (event) => {
            box.style.left = event.pageX + "px";
            box.style.top = event.pageY + "px";
            updateButtons(event.buttons);
            }, true);
            document.addEventListener("mousedown", (event) => {
            updateButtons(event.buttons);
            box.classList.add("button-" + event.which);
            }, true);
            document.addEventListener("mouseup", (event) => {
            updateButtons(event.buttons);
            box.classList.remove("button-" + event.which);
            }, true);
            function updateButtons(buttons: number | boolean) {
                // tslint:disable-next-line:curly
                for (let i = 0; i < 5; i++);
                // tslint:disable-next-line:no-bitwise
            }
        });
    }
    public static takeSelectorPosition = async (page: puppeteer.Page, selector: string) => {
        return await page.evaluate((select) => {
            function random(min: number, max: number) { return Math.floor( Math.random() * (max - min + 1) + min); }
            const element = document.querySelector(select);
            const position = element.getBoundingClientRect();
            const xrand = random(position.left, position.right);
            const yrand = random(position.top, position.bottom);
            return Promise.resolve([xrand, yrand]);
        }, selector);
    }
    public static takeElementPosition = async (page: puppeteer.Page, element: puppeteer.ElementHandle<Element>) => {
        return await page.evaluate((elem) => {
            function random(min: number, max: number) { return Math.floor( Math.random() * (max - min + 1) + min); }
            const position = elem.getBoundingClientRect();
            const xrand = random(position.left, position.right);
            const yrand = random(position.top, position.bottom);
            return Promise.resolve([xrand, yrand]);
        }, element);
    }
    public static async SelectMoveClick(page: puppeteer.Page, selector: string | puppeteer.ElementHandle<Element>) {
        let position: number[];
        // selector
        if (typeof selector === "string") {
            await page.$eval(selector, (elem) => {
                elem.scrollIntoView({block: "nearest", behavior: "smooth" });
                return new Promise((res) => {setTimeout(res, 2000); });
            });
            position = await this.takeSelectorPosition(page, selector);
            console.log("Selector position => " + position);
        } else {
        // Element
            await page.evaluate((elem) => {
                elem.scrollIntoView({block: "nearest", behavior: "smooth" });
                return new Promise((res) => {setTimeout(res, 2000); });
            }, selector);
            position = await this.takeElementPosition(page, selector);
            console.log("Element position => " + position);
        }
        await page.waitFor(1000);
        await page.mouse.move(position[0], position[1], {steps: 100});
        await this.sleep(100);
        await page.mouse.down();
        await this.sleep(800);
        await page.mouse.up();
    }
    public static async randomMoves(page: puppeteer.Page, count: number) {
        for (let index = 0; index < count ; index++) {
            await SimulateMouse.scrollBottomRand(page);
            const randXYZ = this.randomXY();
            await page.mouse.move(randXYZ[0], randXYZ[1], {steps: randXYZ[2]});
            await this.sleepRand(50, 200);
        }
    }
    public static async scrollLazytobottom(page: puppeteer.Page) {
        const bodyHandle = await page.$("body");
        const { height } = await bodyHandle.boundingBox();
        await bodyHandle.dispose();
        const viewportHeight = page.viewport().height;
        let viewportIncr = 0;
        while (viewportIncr + viewportHeight < height) {
            await page.evaluate((heightw) => {
                window.scrollBy(0, heightw);
            }, viewportHeight);
            await this.sleep(20);
            viewportIncr = viewportIncr + viewportHeight;
        }
    }
    public static async scrollBottomRand(page: puppeteer.Page) {
        const viewportHeight = page.viewport().height;
        const skrl = viewportHeight / this.random(4, 12);
        await page.evaluate((heightw) => {
            window.scrollBy({ top: heightw, behavior: "smooth" });
        }, skrl);
        await this.sleep(60);
    }
    public static randomXY() {
        const x = Math.floor(Math.random() * 1200);
        const y = Math.floor(Math.random() * 700);
        const z = this.random(65, 200);
        return [ x, y, z ];
    }
    public static sleep = (time: number) => new Promise((res) => {setTimeout(res, time); });
    public static sleepRand = (min: number, max: number) => new Promise((res) => {
        setTimeout(res, SimulateMouse.random(min, max));
    })
    public static random(min: number, max: number) {return Math.floor(Math.random() * (max - min + 1) ) + min; }
}
