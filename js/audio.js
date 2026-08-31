// ==========================================================================
// Аудіо рушій на базі Web Audio API з регулюванням гучності + Haptics
// ==========================================================================
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    triggerHaptic(ms = 12) {
        if (navigator.vibrate) {
            try { navigator.vibrate(ms); } catch (e) { }
        }
    }

    playClick(freq = 600, duration = 0.04) {
        if (state.soundProfile === 'off' || state.soundVolume <= 0) return;
        this.triggerHaptic(8);
        try {
            this.init();
            if (!this.ctx) return;

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const masterVol = state.soundVolume;

            switch (state.soundProfile) {
                case 'tactile':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(320, now);
                    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);
                    gain.gain.setValueAtTime(0.2 * masterVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
                    break;
                case 'retro':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq * 1.5, now);
                    osc.frequency.setValueAtTime(freq * 0.9, now + 0.02);
                    gain.gain.setValueAtTime(0.08 * masterVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                    break;
                case 'scifi':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq * 2.2, now);
                    osc.frequency.exponentialRampToValueAtTime(freq * 1.1, now + 0.06);
                    gain.gain.setValueAtTime(0.12 * masterVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                    break;
                case 'classic':
                default:
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    osc.frequency.exponentialRampToValueAtTime(150, now + duration);
                    gain.gain.setValueAtTime(0.12 * masterVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
                    break;
            }

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + Math.max(duration, 0.06));
        } catch (e) { }
    }

    playAction() {
        this.playClick(850, 0.06);
    }

    playEquals() {
        if (state.soundProfile === 'off' || state.soundVolume <= 0) return;
        this.triggerHaptic(18);
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const masterVol = state.soundVolume;

            osc.type = state.soundProfile === 'retro' ? 'square' : 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

            gain.gain.setValueAtTime(0.16 * masterVol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (e) { }
    }

    playError() {
        if (state.soundProfile === 'off' || state.soundVolume <= 0) return;
        this.triggerHaptic([30, 40, 30]);
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const masterVol = state.soundVolume;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(140, now + 0.08);

            gain.gain.setValueAtTime(0.2 * masterVol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.22);
        } catch (e) { }
    }
}

const audio = new SoundEngine();
