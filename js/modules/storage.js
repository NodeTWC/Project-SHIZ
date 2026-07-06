"use strict";

/*==================================================
    STORAGE : ENTRIES
==================================================*/

function saveEntries() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(App.entries)
    );
}

function loadEntries() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
        App.entries = JSON.parse(saved);

        App.entries.forEach(entry => {
            if (!entry.status) {
                entry.status = "READY";
            }
        });

        Terminal.database("Local archive loaded.");
    } catch {
        App.entries = [];
        Terminal.warn("Failed to load local archive.");
    }
}


/*==================================================
    STORAGE : SETTINGS
==================================================*/

function saveSettings() {
    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(App.settings)
    );
}

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (!saved) return;

    try {
        App.settings = {
            ...App.settings,
            ...JSON.parse(saved)
        };
    } catch {
        Terminal.warn("Failed to load settings.");
    }
}

