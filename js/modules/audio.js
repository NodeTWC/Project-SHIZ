"use strict";

/*==================================================
    AUDIO
==================================================*/

const AudioSystem = {
    sounds: {},

    files: {
        boot: "assets/sounds/boot.mp3",
        auth: "assets/sounds/auth.mp3",
        database: "assets/sounds/database.mp3",
        scan_loop: "assets/sounds/scan-loop.mp3",
        lock: "assets/sounds/lock.mp3",
        result: "assets/sounds/result.mp3",
        add: "assets/sounds/add.mp3",
        delete: "assets/sounds/delete.mp3",
        clear: "assets/sounds/clear.mp3",
        error: "assets/sounds/error.mp3"
    },

    init() {
        Object.entries(this.files).forEach(([name, path]) => {
            const audio = new Audio(path);
            audio.preload = "auto";
            audio.volume = App.config.volume;

            if (name === "scan_loop") {
                audio.loop = true;
            }

            this.sounds[name] = audio;
        });
    },

    play(name) {
        if (!App.config.soundEnabled) return;

        const sound = this.sounds[name];

        if (!sound) {
            console.log(`sound:${name}`);
            return;
        }

        sound.currentTime = 0;
        sound.play().catch(() => {
            console.log(`sound-blocked:${name}`);
        });
    },

    stop(name) {
        if (!App.config.soundEnabled) return;

        const sound = this.sounds[name];

        if (!sound) {
            console.log(`sound-stop:${name}`);
            return;
        }

        sound.pause();
        sound.currentTime = 0;
    },

    setVolume(value) {
        App.config.volume = Math.max(0, Math.min(value, 1));

        Object.values(this.sounds).forEach(sound => {
            sound.volume = App.config.volume;
        });
    },

    enable() {
        App.config.soundEnabled = true;
    },

    disable() {
        App.config.soundEnabled = false;
        this.stopAll();
    },

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
};

const Sound = AudioSystem;
