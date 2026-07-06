"use strict";

/*==================================================
    EVENTS
==================================================*/

DOM.addEntryButton.addEventListener("click", addEntry);

DOM.clearAllButton.addEventListener("click", clearAllEntries);

DOM.clearLogButton.addEventListener("click", () => {
    Terminal.clear();
});

DOM.entryInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addEntry();
    }
});

DOM.startButton.addEventListener("click", () => {
    Engine.start();
});

DOM.resetButton.addEventListener("click", resetSystem);

DOM.settingsButton.addEventListener("click", openSettings);

DOM.closeSettingsButton.addEventListener("click", closeSettings);

DOM.saveOperatorButton.addEventListener("click", saveOperatorName);

DOM.operatorInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        saveOperatorName();
    }
});

DOM.settingsPanel.addEventListener("click", event => {
    if (event.target === DOM.settingsPanel) {
        closeSettings();
    }
});

DOM.openCreatorButton.addEventListener("click", openCreatorPanel);

DOM.closeCreatorButton.addEventListener("click", closeCreatorPanel);

DOM.shareXButton.addEventListener("click", shareToX);

DOM.saveResultButton.addEventListener("click", saveResultPng);

DOM.creatorPanel.addEventListener("click", event => {
    if (event.target === DOM.creatorPanel) {
        closeCreatorPanel();
    }
});

