"use strict";

/*==================================================
    UI CONTROL
==================================================*/

function setSystemMessage(message) {
    DOM.systemMessage.textContent = message;
}

function setAppState(state) {
    App.state = state;
    document.body.dataset.state = state;
}

function setRingMode(mode) {
    DOM.ring.classList.remove(
        "ring-idle",
        "ring-boot",
        "ring-scan",
        "ring-lock"
    );

    DOM.ring.classList.add(`ring-${mode}`);
}

function setAllEntryStatus(status) {
    App.entries.forEach(entry => {
        entry.status = status;
    });

    renderEntryCards();
}

function setEntryStatus(id, status) {
    const entry = App.entries.find(item => item.id === id);

    if (!entry) return;

    entry.status = status;

    renderEntryCards();
}

function resetEntryStatus() {
    App.entries.forEach(entry => {
        entry.status = "READY";
    });

    renderEntryCards();
}

function resetResultPanel() {
    DOM.resultTitle.textContent = "---";
    resetTitleFit(DOM.resultTitle);

    DOM.resultId.textContent = "----";
    DOM.resultConfidence.textContent = "--.--%";
    DOM.resultStatus.textContent = "LOCKED";
}

function resetSystem() {
    if (App.isRunning) return;

    App.selectedEntry = null;
    App.selectedIndex = -1;

    resetEntryStatus();
    resetResultPanel();
    resetCreatorCard();
    closeCreatorPanel();

    setAppState("READY");
    setRingMode("idle");
    setSystemMessage("SYSTEM READY");

    Terminal.system("Operation reset.");
}

