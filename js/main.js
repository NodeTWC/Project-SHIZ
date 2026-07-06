"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.2 Modular Edition

    main.js

==================================================*/


/*==================================================
    INIT
==================================================*/

function init() {
    try {
        setAppState("READY");

        setRingMode("idle");

        resetResultPanel();
        resetCreatorCard();

        Terminal.system(`${SYSTEM.project} interface online.`);
        Terminal.system(`${SYSTEM.name} standby.`);

        loadSettings();

        renderSettings();

        loadEntries();

        render();

        bindEvents();

        Terminal.system("System ready.");

        closeBootScreen();
    } catch (error) {
        console.error("[A.R.C.S. INIT ERROR]", error);

        if (typeof Terminal !== "undefined") {
            Terminal.warn(`Init failed : ${error.message}`);
        }

        if (typeof setSystemMessage === "function") {
            setSystemMessage("INIT ERROR");
        }

        if (DOM.bootScreen) {
            DOM.bootScreen.classList.add("is-hidden");
        }
    }
}

init();
