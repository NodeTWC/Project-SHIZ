"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    settings.js

==================================================*/


function renderSettings() {
    DOM.operatorName.textContent = App.settings.operatorName;
    DOM.operatorInput.value = App.settings.operatorName;
}

function openSettings() {
    renderSettings();
    DOM.settingsPanel.classList.add("open");
}

function closeSettings() {
    DOM.settingsPanel.classList.remove("open");
}

function saveOperatorName() {
    const name = DOM.operatorInput.value.trim();

    App.settings.operatorName = name || "OPERATOR";

    saveSettings();
    renderSettings();
    closeSettings();

    Terminal.auth(`Operator updated : ${App.settings.operatorName}`);
    setSystemMessage("OPERATOR UPDATED");
    Sound.play("auth");
}
