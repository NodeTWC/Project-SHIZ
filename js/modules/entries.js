"use strict";

/*==================================================
    DATABASE
==================================================*/

function addEntry() {
    const title = DOM.entryInput.value.trim();

    if (!title) {
        Terminal.warn("Empty entry rejected.");
        setSystemMessage("NO DATA");
        Sound.play("error");
        return;
    }

    App.entries.push({
        id: createId(),
        title,
        status: "READY"
    });

    saveEntries();

    DOM.entryInput.value = "";

    render();

    Terminal.database(`Record registered : ${title}`);
    setSystemMessage("ENTRY ADDED");

    Sound.play("add");
}

function removeEntry(id) {
    if (App.isRunning) {
        Terminal.warn("Cannot remove entry during operation.");
        return;
    }

    const entry = App.entries.find(item => item.id === id);

    if (!entry) return;

    App.entries = App.entries.filter(item => item.id !== id);

    if (App.selectedEntry && App.selectedEntry.id === id) {
        App.selectedEntry = null;
        App.selectedIndex = -1;

        resetResultPanel();
        resetCreatorCard();
        closeCreatorPanel();

        setAppState("READY");
        setRingMode("idle");
        setSystemMessage("SYSTEM READY");
    }

    saveEntries();
    render();

    Terminal.database(`Record removed : ${entry.title}`);
    setSystemMessage("ENTRY REMOVED");

    Sound.play("delete");
}

function clearAllEntries() {
    if (App.isRunning) return;

    if (App.entries.length === 0) {
        Terminal.warn("Archive already empty.");
        return;
    }

    if (!confirm("登録データをすべて削除しますか？")) {
        return;
    }

    App.entries = [];

    saveEntries();
    render();
    resetSystem();

    Terminal.database("All records cleared.");

    Sound.play("clear");
}

