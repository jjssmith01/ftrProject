export class Timer{
    private interval: number;
    private startTime: Date;
    private timeRemaining: number;
    private intervalID: number;

    public constructor() {
        this.interval = 0;
        this.startTime = new Date();
        this.timeRemaining = 0
        this.intervalID = 0
    }
    
    public startTimer(functionToRun: () => void, interval: number) {
        clearInterval(this.intervalID); //Clear interval to ensure you arent running two timers at once.
        this.interval = interval;

        this.intervalID = setInterval(() => { //Run passed function every interval and set startTime of new interval.
            this.startTime = new Date();
            functionToRun();
        }, (this.interval * 1000));
    }

    //Calculate time remaining based on interval take the difference between start of interval and current time.
    public pauseTimer() {
        this.timeRemaining = (this.interval * 1000) - (new Date().valueOf() - this.startTime.valueOf());
        clearInterval(this.intervalID);
    }

    //Run a singular timeout with time remaining and then restart timer
    public resumeTimer(functionToRun: () => void) {
        setTimeout(() => {
            functionToRun();
            this.startTimer(functionToRun, this.interval);
        }, this.timeRemaining);
        
    }

    public stopTimer() {
        clearInterval(this.intervalID);
    }

}