class PomodoroTimer {
    constructor(onComplete) {
        this.workDuration = 25 * 60; // 25 minutes in seconds
        this.breakDuration = 5 * 60; // 5 minutes in seconds
        this.timeRemaining = this.workDuration;
        this.isRunning = false;
        this.isWorkSession = true;
        this.onComplete = onComplete;
        this.timer = null;
        this.originalTitle = document.title;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timer = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
            document.title = this.originalTitle; // Reset title when paused
        }
    }

    reset() {
        this.pause();
        this.timeRemaining = this.workDuration;
        this.isWorkSession = true;
        this.updateDisplay();
        document.title = this.originalTitle; // Reset title when reset
    }

    tick() {
        this.timeRemaining--;
        this.updateDisplay();

        if (this.timeRemaining <= 0) {
            this.pause();
            if (this.isWorkSession) {
                this.onComplete();
                this.timeRemaining = this.breakDuration;
                this.isWorkSession = false;
            } else {
                this.timeRemaining = this.workDuration;
                this.isWorkSession = true;
            }
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // Update tab title
        const timeString = this.formatTime(this.timeRemaining);
        const sessionType = this.isWorkSession ? 'Work' : 'Break';
        document.title = `(${timeString}) ${sessionType} - Pokédoro`;
    }
} 