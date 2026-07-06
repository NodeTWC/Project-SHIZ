"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    dom.js

==================================================*/


const DOM = {
    bootScreen: document.getElementById("bootScreen"),

    entryInput: document.getElementById("movieInput"),
    addEntryButton: document.getElementById("addMovie"),
    clearAllButton: document.getElementById("clearAllButton"),
    clearLogButton: document.getElementById("clearLogButton"),

    entryCards: document.getElementById("movieCards"),
    entryCount: document.getElementById("movieCount"),

    startButton: document.getElementById("startButton"),
    resetButton: document.getElementById("resetButton"),

    settingsButton: document.getElementById("settingsButton"),
    settingsPanel: document.getElementById("settingsPanel"),
    operatorName: document.getElementById("operatorName"),
    operatorInput: document.getElementById("operatorInput"),
    saveOperatorButton: document.getElementById("saveOperatorButton"),
    closeSettingsButton: document.getElementById("closeSettingsButton"),

    systemMessage: document.querySelector("#systemMessage span:last-child"),
    terminal: document.getElementById("terminal"),
    ring: document.getElementById("ring"),

    resultTitle: document.getElementById("resultTitle"),
    resultId: document.getElementById("resultId"),
    resultConfidence: document.getElementById("resultConfidence"),
    resultStatus: document.getElementById("resultStatus"),

    openCreatorButton: document.getElementById("openCreatorButton"),
    creatorPanel: document.getElementById("creatorPanel"),
    creatorCard: document.getElementById("creatorCard"),
    creatorResultTitle: document.getElementById("creatorResultTitle"),
    creatorOperator: document.getElementById("creatorOperator"),
    creatorResultId: document.getElementById("creatorResultId"),
    creatorConfidence: document.getElementById("creatorConfidence"),
    saveResultButton: document.getElementById("saveResultButton"),
    shareXButton: document.getElementById("shareXButton"),
    closeCreatorButton: document.getElementById("closeCreatorButton")
};
