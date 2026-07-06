"use strict";

/*==================================================

    audio.js

==================================================*/

const Sound = {
    cache: {},

    map: {
        boot: AUDIO.boot,
        auth: AUDIO.auth,
        database: AUDIO.database,
        scan_loop: AUDIO.scanLoop,
        lock: AUDIO.lock,
        result: AUDIO.result,
        add: AUDIO.add,
        delete: AUDIO.delete,
        clear: AUDIO.clear,
        error: AUDIO.error
    },

    load(name) {
        const src = this.map[name];

        if (!src) return null;

        if (!this.cache[name]) {
            const audio = new Audio(src);

            audio.volume = App.config.volume;

            if (name === "scan_loop") {
                audio.loop = true;
            }

            this.cache[name] = audio;
        }

        return this.cache[name];
    },

    play(name) {
        if (!App.config.soundEnabled) return;

        const audio = this.load(name);

        if (!audio) return;

        audio.currentTime = 0;

        audio.play().catch(() => {
            console.log(`sound-play-blocked:${name}`);
        });
    },

    stop(name) {
        const audio = this.cache[name];

        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
    },

    stopAll() {
        Object.keys(this.cache).forEach(name => {
            this.stop(name);
        });
    },

    setVolume(value) {
        App.config.volume = value;

        Object.values(this.cache).forEach(audio => {
            audio.volume = value;
        });
    }
};
