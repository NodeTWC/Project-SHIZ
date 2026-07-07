"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.7
    engine.js

==================================================*/


/*==================================================
    ENGINE
==================================================*/

var Engine = {
    async start() {
        if (App.isRunning) return;

        if (App.entries.length === 0) {
            Terminal.warn("No entry data found. Please add at least one entry.");
            setSystemMessage("NO DATA");
            Sound.play("error");
            return;
        }

        App.isRunning = true;

        DOM.startButton.disabled = true;
        DOM.resetButton.disabled = true;

        resetResultPanel();
        resetCreatorCard();
        closeCreatorPanel();

        try {
            Terminal.system("Start command accepted.");

            await Scene.boot();
            await Scene.auth();
            await Scene.database();
            await Scene.scan();
            await Scene.lock();
            await Scene.result();
        } catch (error) {
            console.error("[A.R.C.S. ENGINE ERROR]", error);
            Terminal.warn(`Engine stopped : ${error.message}`);
            setSystemMessage("ENGINE ERROR");
            Sound.stopAll();
        } finally {
            App.isRunning = false;

            DOM.startButton.disabled = false;
            DOM.resetButton.disabled = false;

            if (window.Idle) {
                Idle.start();
            }
        }
    }
};

window.Engine = Engine;
