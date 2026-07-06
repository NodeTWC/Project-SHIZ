"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.2 Modular Edition

    events.js

==================================================*/


/*==================================================
    EVENTS
==================================================*/

function safeRun(label, callback) {
    try {
        callback();
    } catch (error) {
        console.error(`[A.R.C.S. EVENT ERROR] ${label}`, error);

        if (typeof Terminal !== "undefined") {
            Terminal.warn(`${label} failed : ${error.message}`);
        }

        if (typeof setSystemMessage === "function") {
            setSystemMessage("EVENT ERROR");
        }
    }
}

function bindEvents() {
    if (DOM.addEntryButton) {
        DOM.addEntryButton.addEventListener("click", () => {
            safeRun("ADD ENTRY", addEntry);
        });
    }

    if (DOM.clearAllButton) {
        DOM.clearAllButton.addEventListener("click", () => {
            safeRun("CLEAR ALL", clearAllEntries);
        });
    }

    if (DOM.clearLogButton) {
        DOM.clearLogButton.addEventListener("click", () => {
            safeRun("CLEAR LOG", () => {
                Terminal.clear();
            });
        });
    }

    if (DOM.entryInput) {
        DOM.entryInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                safeRun("ADD ENTRY", addEntry);
            }
        });
    }

    if (DOM.startButton) {
        DOM.startButton.addEventListener("click", () => {
            safeRun("START", () => {
                if (typeof Engine === "undefined" || !Engine || typeof Engine.start !== "function") {
                    throw new Error("Engine.start is not available");
                }

                Engine.start();
            });
        });
    }

    if (DOM.resetButton) {
        DOM.resetButton.addEventListener("click", () => {
            safeRun("RESET", resetSystem);
        });
    }

    if (DOM.settingsButton) {
        DOM.settingsButton.addEventListener("click", () => {
            safeRun("OPEN SETTINGS", openSettings);
        });
    }

    if (DOM.closeSettingsButton) {
        DOM.closeSettingsButton.addEventListener("click", () => {
            safeRun("CLOSE SETTINGS", closeSettings);
        });
    }

    if (DOM.saveOperatorButton) {
        DOM.saveOperatorButton.addEventListener("click", () => {
            safeRun("SAVE OPERATOR", saveOperatorName);
        });
    }

    if (DOM.operatorInput) {
        DOM.operatorInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                safeRun("SAVE OPERATOR", saveOperatorName);
            }
        });
    }

    if (DOM.settingsPanel) {
        DOM.settingsPanel.addEventListener("click", event => {
            if (event.target === DOM.settingsPanel) {
                safeRun("CLOSE SETTINGS", closeSettings);
            }
        });
    }

    if (DOM.openCreatorButton) {
        DOM.openCreatorButton.addEventListener("click", () => {
            safeRun("OPEN CREATOR", openCreatorPanel);
        });
    }

    if (DOM.closeCreatorButton) {
        DOM.closeCreatorButton.addEventListener("click", () => {
            safeRun("CLOSE CREATOR", closeCreatorPanel);
        });
    }

    if (DOM.shareXButton) {
        DOM.shareXButton.addEventListener("click", () => {
            safeRun("SHARE X", shareToX);
        });
    }

    if (DOM.saveResultButton) {
        DOM.saveResultButton.addEventListener("click", () => {
            safeRun("SAVE PNG", saveResultPng);
        });
    }

    if (DOM.creatorPanel) {
        DOM.creatorPanel.addEventListener("click", event => {
            if (event.target === DOM.creatorPanel) {
                safeRun("CLOSE CREATOR", closeCreatorPanel);
            }
        });
    }

    Terminal.system("Event bindings ready.");
}
