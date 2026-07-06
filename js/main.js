"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.1 Modular Edition

    main.js

==================================================*/


/*==================================================
    INIT
==================================================*/

function init() {
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
}

init();
