"use strict";

/*==================================================
    BOOT SCREEN
==================================================*/

function closeBootScreen() {
    if (!DOM.bootScreen) return;

    setTimeout(() => {
        DOM.bootScreen.classList.add("is-hidden");
        Terminal.system("Boot screen closed.");
    }, 2300);
}

/*==================================================
    INIT
==================================================*/

function init() {
    setAppState("READY");

    setRingMode("idle");

    Sound.init();

    resetResultPanel();
    resetCreatorCard();

    Terminal.system(`${SYSTEM.project} interface online.`);
    Terminal.system(`${SYSTEM.name} standby.`);

    loadSettings();

    renderSettings();

    loadEntries();

    render();

    Terminal.system("System ready.");

    closeBootScreen();
}

init();
