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
            function random(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1) ) + min; }
            const element = document.querySelector(select);
            const position = element.getBoundingClientRect();
            const xrand = random(position.left, position.right);
            const yrand = random(position.top, position.bottom);
            return Promise.resolve([xrand, yrand]);
        }, selector);
    }
    public static async SelectMoveClick(page: puppeteer.Page, selector: string) {
        return await this.takeSelectorPosition(page, selector).then(async (cords) => {
            await page.mouse.move(cords[0], cords[1], {steps: 100});
            await page.click(selector);
        });
    }
    public static async randomMoves(page: puppeteer.Page, count: number) {
        for (let index = 0; index < count ; index++) {
            const randXYZ = this.randomXY();
            await page.mouse.move(randXYZ[0], randXYZ[1], {steps: randXYZ[2]});
            await this.sleepRand(50, 200);
        }
    }
    public static randomXY() {
        const x = Math.floor(Math.random() * 1200);
        const y = Math.floor(Math.random() * 700);
        const z = this.random(80, 200);
        return [ x, y, z ];
    }
    public static sleep = (time: number) => new Promise((res) => {setTimeout(res, time); });
    public static sleepRand = (min: number, max: number) => new Promise((res) => {
        setTimeout(res, SimulateMouse.random(min, max));
    })
    public static random(min: number, max: number) {return Math.floor(Math.random() * (max - min + 1) ) + min; }
}
