"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.1 Modular Edition

    events.js

==================================================*/


/*==================================================
    EVENTS
==================================================*/

function bindEvents() {
    if (DOM.addEntryButton) {
        DOM.addEntryButton.addEventListener("click", addEntry);
    }

    if (DOM.clearAllButton) {
        DOM.clearAllButton.addEventListener("click", clearAllEntries);
    }

    if (DOM.clearLogButton) {
        DOM.clearLogButton.addEventListener("click", () => {
            Terminal.clear();
        });
    }

    if (DOM.entryInput) {
        DOM.entryInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                addEntry();
            }
        });
    }

    if (DOM.startButton) {
        DOM.startButton.addEventListener("click", () => {
            Engine.start();
        });
    }

    if (DOM.resetButton) {
        DOM.resetButton.addEventListener("click", resetSystem);
    }

    if (DOM.settingsButton) {
        DOM.settingsButton.addEventListener("click", openSettings);
    }

    if (DOM.closeSettingsButton) {
        DOM.closeSettingsButton.addEventListener("click", closeSettings);
    }

    if (DOM.saveOperatorButton) {
        DOM.saveOperatorButton.addEventListener("click", saveOperatorName);
    }

    if (DOM.operatorInput) {
        DOM.operatorInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                saveOperatorName();
            }
        });
    }

    if (DOM.settingsPanel) {
        DOM.settingsPanel.addEventListener("click", event => {
            if (event.target === DOM.settingsPanel) {
                closeSettings();
            }
        });
    }

    if (DOM.openCreatorButton) {
        DOM.openCreatorButton.addEventListener("click", openCreatorPanel);
    }

    if (DOM.closeCreatorButton) {
        DOM.closeCreatorButton.addEventListener("click", closeCreatorPanel);
    }

    if (DOM.shareXButton) {
        DOM.shareXButton.addEventListener("click", shareToX);
    }

    if (DOM.saveResultButton) {
        DOM.saveResultButton.addEventListener("click", saveResultPng);
    }

    if (DOM.creatorPanel) {
        DOM.creatorPanel.addEventListener("click", event => {
            if (event.target === DOM.creatorPanel) {
                closeCreatorPanel();
            }
        });
    }

    Terminal.system("Event bindings ready.");
}
