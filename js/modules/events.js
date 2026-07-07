"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.7
    events.js

==================================================*/

function bindEvents() {
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
        if (window.Idle) {
            Idle.stop();
        }

        Engine.start();
    });

    DOM.resetButton.addEventListener("click", () => {
        resetSystem();

        if (window.Idle) {
            Idle.start();
        }
    });

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

    bindIngestEvents();

    if (window.Idle) {
        Idle.start();
    }
}


/*==================================================
    DATABASE INGEST EVENTS
==================================================*/

function bindIngestEvents() {
    document.addEventListener("dragover", event => {
        event.preventDefault();

        if (App.isRunning || Ingest.isActive) return;

        if (window.Idle) {
            Idle.stop();
        }

        document.body.classList.add("is-dragging-file");

        Ingest.showReady();
    });

    document.addEventListener("dragleave", event => {
        if (event.relatedTarget !== null) return;

        document.body.classList.remove("is-dragging-file");

        Ingest.hideReady();

        if (!App.isRunning && !Ingest.isActive && window.Idle) {
            Idle.start();
        }
    });

    document.addEventListener("drop", event => {
        event.preventDefault();

        document.body.classList.remove("is-dragging-file");

        if (window.Idle) {
            Idle.stop();
        }

        const file = event.dataTransfer.files[0];

        if (!file) {
            Ingest.hideReady();

            if (!App.isRunning && !Ingest.isActive && window.Idle) {
                Idle.start();
            }

            return;
        }

        Ingest.handleFile(file);
    });
}
