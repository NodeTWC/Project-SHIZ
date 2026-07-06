"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    renderer.js

==================================================*/


/*==================================================
    STATUS CLASS
==================================================*/

function getStatusClass(status) {
    switch (status) {
        case "CHECKING":
            return "is-checking";

        case "SCANNING":
            return "is-scanning";

        case "TARGET LOCK":
            return "is-locked";

        default:
            return "";
    }
}


/*==================================================
    RENDER
==================================================*/

function render() {
    renderCounters();
    renderEntryCards();
}

function renderCounters() {
    DOM.entryCount.textContent = App.entries.length;
}

function renderEntryCards() {
    DOM.entryCards.innerHTML = "";

    App.entries.forEach((entry, index) => {
        const card = createEntryCard(entry, index);

        DOM.entryCards.appendChild(card);
    });
}

function createEntryCard(entry, index) {
    const card = document.createElement("div");

    card.className = `movieCard ${getStatusClass(entry.status)}`;
    card.dataset.id = entry.id;

    card.innerHTML = `
        <button
            class="delete-entry"
            type="button"
            title="Delete Entry"
            aria-label="Delete Entry"
        >
            ×
        </button>

        <div class="movieTitle">
            ◆ ${escapeHTML(entry.title)}
        </div>

        <div class="movieStatus">
            ID : ${formatId(index)}
            /
            STATUS : ${entry.status}
        </div>

        <div class="movieBar"></div>
    `;

    attachEntryEvents(card, entry);

    return card;
}

function attachEntryEvents(card, entry) {
    const deleteButton = card.querySelector(".delete-entry");

    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        removeEntry(entry.id);
    });

    card.addEventListener("dblclick", () => {
        removeEntry(entry.id);
    });
}
