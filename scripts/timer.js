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
        this.mode = 'pomodoro';
        this.stopwatchTime = 0;
        this.startTime = null;

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
            if (this.mode === 'stopwatch') {
                this.startTime = Date.now() - (this.stopwatchTime * 1000); // Account for paused time
            }
            this.tick(); // Initial tick
            this.timer = setInterval(() => this.tick(), 100); // More frequent updates for smoother display
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.mode === 'stopwatch') {
                this.stopwatchTime = Math.floor((Date.now() - this.startTime) / 1000);
            }
            clearInterval(this.timer);
            this.timer = null;
            this.lastTick = null;
            this.startTime = null;
            document.title = this.originalTitle;
        }
    }

    reset() {
        this.pause();
        if (this.mode === 'pomodoro') {
            this.timeRemaining = this.workDuration;
            this.isWorkSession = true;
        } else {
            this.stopwatchTime = 0;
            this.timeRemaining = 0;
        }
        this.updateDisplay();
        document.title = this.originalTitle;
    }

    tick() {
        if (!this.isRunning) return;

        const now = Date.now();

        if (this.mode === 'pomodoro') {
            const delta = now - this.lastTick;
            if (delta >= 1000) {
                this.timeRemaining--;
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
                }
                this.lastTick = now;
            }
        } else {
            // Stopwatch mode - calculate exact elapsed time
            const elapsedSeconds = Math.floor((now - this.startTime) / 1000);
            this.timeRemaining = elapsedSeconds;
            this.stopwatchTime = elapsedSeconds;
        }

        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

        // Update tab title
        const timeString = this.formatTime(this.timeRemaining);
        const modeString = this.mode === 'pomodoro'
            ? (this.isWorkSession ? 'Work' : 'Break')
            : 'Stopwatch';
        document.title = `(${timeString}) ${modeString} - Pokédoro`;
    }

    setMode(mode) {
        this.mode = mode;
        this.pause();
        if (mode === 'pomodoro') {
            this.timeRemaining = this.workDuration;
        } else {
            this.stopwatchTime = 0;
            this.timeRemaining = 0;
        }
        this.updateDisplay();
    }
} 