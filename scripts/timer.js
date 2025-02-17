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
        this.lastTick = null;

        // Initialize audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    playStartSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    start() {
        if (!this.isRunning) {
            this.playStartSound();
            this.isRunning = true;
            this.lastTick = Date.now();
            this.tick(); // Initial tick
            this.timer = setInterval(() => this.tick(), 1000); // Back to 1-second intervals
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timer);
            this.timer = null;
            this.lastTick = null;
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
        if (!this.isRunning) return;

        const now = Date.now();
        const delta = now - this.lastTick;

        if (delta >= 1000) {
            this.timeRemaining--;
            this.lastTick = now;
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