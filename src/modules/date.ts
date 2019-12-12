export class GetDate {
    public currenthour: number;
    public hour: number;
    public min: number;
    public sec: number;
    public year: number;
    public month: number;
    public day: number;
    public dmy: string;
    constructor() {
        const date = new Date();
        this.hour = date.getHours();
        this.min = date.getMinutes();
        this.sec = date.getSeconds();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.dmy = `${this.day}.${this.month}.${this.year}`;
    }
}
