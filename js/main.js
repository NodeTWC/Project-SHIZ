"use strict";

/*==================================================

    Project SHIZ
    A.R.C.S.
    Advanced Random Control System

    Version 3.3.3
    Creator Edition / Fit Result Title

    js/main.js

==================================================*/


/*==================================================
    SYSTEM
==================================================*/

const SYSTEM = {
    project: "PROJECT SHIZ",
    name: "A.R.C.S.",
    fullName: "Advanced Random Control System",
    version: "3.3.3"
};

const STORAGE_KEY = "arcs_entries_v1";
const SETTINGS_KEY = "arcs_settings_v1";


/*==================================================
    APP STATE
==================================================*/

const App = {
    state: "READY",

    entries: [],
    selectedEntry: null,
    selectedIndex: -1,

    isRunning: false,

    settings: {
        operatorName: "忠犬しず"
    },

    config: {
        soundEnabled: false
    }
};


/*==================================================
    DOM
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


/*==================================================
    TERMINAL
==================================================*/

const Terminal = {
    write(message, type = "INFO") {
        const time = new Date().toLocaleTimeString("ja-JP", {
            hour12: false
        });

        const line = document.createElement("div");
        line.textContent = `[${time}] [${type}] ${message}`;

        DOM.terminal.appendChild(line);
        DOM.terminal.scrollTop = DOM.terminal.scrollHeight;
    },

    clear() {
        DOM.terminal.innerHTML = "";
        this.system("Log cleared.");
    },

    system(message) {
        this.write(message, "SYS");
    },

    database(message) {
        this.write(message, "DB");
    },

    ai(message) {
        this.write(message, "AI");
    },

    auth(message) {
        this.write(message, "AUTH");
    },

    lock(message) {
        this.write(message, "LOCK");
    },

    result(message) {
        this.write(message, "RESULT");
    },

    warn(message) {
        this.write(message, "WARN");
    }
};


/*==================================================
    SOUND PLACEHOLDER
==================================================*/

const Sound = {
    play(name) {
        if (!App.config.soundEnabled) return;
        console.log(`sound:${name}`);
    },

    stop(name) {
        if (!App.config.soundEnabled) return;
        console.log(`sound-stop:${name}`);
    }
};


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


/*==================================================
    SETTINGS
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


/*==================================================
    CREATOR CARD
==================================================*/

function updateCreatorCard(entry, idText, confidence) {
    if (!DOM.creatorPanel) return;

    DOM.creatorResultTitle.textContent = entry.title;

    fitResultTitle(DOM.creatorResultTitle, {
        maxSize: 56,
        minSize: 24,
        maxLines: 3
    });

    DOM.creatorOperator.textContent = App.settings.operatorName;
    DOM.creatorResultId.textContent = idText;
    DOM.creatorConfidence.textContent = `${confidence}%`;
}

function resetCreatorCard() {
    if (!DOM.creatorPanel) return;

    DOM.creatorResultTitle.textContent = "---";
    resetTitleFit(DOM.creatorResultTitle);

    DOM.creatorOperator.textContent = "---";
    DOM.creatorResultId.textContent = "----";
    DOM.creatorConfidence.textContent = "--.--%";
}

async function openCreatorPanel() {
    if (!DOM.creatorPanel) return;

    if (!App.selectedEntry) {
        Terminal.warn("No result data available.");
        setSystemMessage("NO RESULT");
        return;
    }

    Terminal.system("Accessing creator module...");
    setSystemMessage("CREATOR MODULE");

    await sleep(260);

    DOM.creatorPanel.classList.add("open");

    Terminal.result("Creator module opened.");
}

function closeCreatorPanel() {
    if (!DOM.creatorPanel) return;

    DOM.creatorPanel.classList.remove("open");
}

function createShareText() {
    const title =
        App.selectedEntry
            ? App.selectedEntry.title
            : DOM.creatorResultTitle.textContent;

    const confidence =
        DOM.creatorConfidence
            ? DOM.creatorConfidence.textContent
            : "--.--%";

    return [
        "A.R.C.S. RESULT",
        "",
        `TARGET LOCK：${title}`,
        `AI CONFIDENCE：${confidence}`,
        "",
        "Generated by A.R.C.S.",
        "#ProjectSHIZ #ARCS #CreatorEdition"
    ].join("\n");
}

function shareToX() {
    const text = createShareText();

    copyShareText(text);

    const url =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(text);

    window.open(url, "_blank", "noopener,noreferrer");

    Terminal.result("Share text copied. Attach saved PNG on X.");
    setSystemMessage("SHARE READY");
}

async function copyShareText(text) {
    try {
        await navigator.clipboard.writeText(text);
        Terminal.result("Share text copied to clipboard.");
    } catch {
        Terminal.warn("Clipboard copy failed.");
    }
}

async function saveResultPng() {
    if (!DOM.creatorCard) {
        Terminal.warn("Creator card not found.");
        return;
    }

    if (typeof html2canvas === "undefined") {
        Terminal.warn("PNG module is not loaded.");
        setSystemMessage("PNG MODULE ERROR");
        return;
    }

    Terminal.system("PNG capture started.");
    setSystemMessage("PNG CAPTURE");

    try {
        const canvas = await html2canvas(DOM.creatorCard, {
            backgroundColor: null,
            scale: 3,
            useCORS: true
        });

        const link = document.createElement("a");
        link.download = createPngFileName();
        link.href = canvas.toDataURL("image/png");
        link.click();

        Terminal.system("PNG saved.");
        setSystemMessage("PNG SAVED");
    } catch {
        Terminal.warn("PNG capture failed.");
        setSystemMessage("PNG ERROR");
    }
}


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


/*==================================================
    CINEMATIC SCENES
==================================================*/

const Scene = {
    async boot() {
        setAppState("BOOT");
        setRingMode("boot");

        Sound.play("boot");

        Terminal.system(`${SYSTEM.project}`);
        Terminal.system(`Launching ${SYSTEM.name}...`);
        Terminal.system(`${SYSTEM.fullName}`);
        Terminal.system(`Version ${SYSTEM.version}`);

        await sceneStep("POWER CORE", "Power Core..............OK", "system", 310);
        await sceneStep("HUD LINK", "HUD Interface..........OK", "system", 310);
        await sceneStep("A.R.C.S. CORE", "A.R.C.S. Core..........ONLINE", "system", 360);
        await sceneStep("TARGET ENGINE", "Target Engine..........STANDBY", "system", 360);
        await sceneStep("A.R.C.S. ONLINE", "A.R.C.S. online.", "system", 520);
    },

    async auth() {
        setAppState("AUTH");

        Sound.play("auth");

        Terminal.auth("Operator verification started.");

        await sceneStep(
            "AUTHENTICATING",
            "Operator signature.....SCANNING",
            "auth",
            480
        );

        await sceneStep(
            App.settings.operatorName,
            `Operator...............${App.settings.operatorName}`,
            "auth",
            620
        );

        await sceneStep(
            "SIGNATURE MATCH",
            "Signature..............MATCH",
            "auth",
            420
        );

        await sceneStep(
            "ACCESS GRANTED",
            "Access level...........GRANTED",
            "auth",
            520
        );

        await sceneStep(
            "WELCOME",
            `Welcome, ${App.settings.operatorName}.`,
            "auth",
            420
        );
    },

    async database() {
        setAppState("DATABASE");

        Sound.play("database");

        Terminal.database("Archive link established.");

        await sceneStep(
            "DATABASE LINK",
            "Archive connection.....OK",
            "database",
            420
        );

        await sceneStep(
            "VERIFYING",
            `Registered Entries.....${App.entries.length}`,
            "database",
            420
        );

        await sceneStep(
            "RECORD CHECK",
            "Record integrity.......RUNNING",
            "database",
            300
        );

        await checkCards();

        await sceneStep(
            "DATABASE READY",
            "Record integrity.......OK",
            "database",
            560
        );
    },

    async scan() {
        setAppState("SCAN");
        setRingMode("scan");

        Sound.play("scan_loop");

        setAllEntryStatus("SCANNING");

        Terminal.ai("Selection engine activated.");
        Terminal.ai("Candidate analysis started.");

        const sequence = [
            "PATTERN MATCH",
            "TRACE DATA",
            "BALANCE CHECK",
            "RANDOM SEED",
            "TARGET SEARCH",
            "DECISION PATH"
        ];

        const logs = [
            "Pattern matching........RUNNING",
            "Trace analysis..........RUNNING",
            "Balance check...........CALCULATING",
            "Random seed.............GENERATED",
            "Candidate matrix........ACTIVE",
            "Decision path...........LOCKING"
        ];

        const steps = 62;

        for (let i = 0; i < steps; i++) {
            if (i % 13 === 0) {
                const entry = randomEntry();
                setSystemMessage(entry.title);
            } else {
                setSystemMessage(sequence[i % sequence.length]);
            }

            if (i % 12 === 0 && logs[Math.floor(i / 12)]) {
                Terminal.ai(logs[Math.floor(i / 12)]);
            }

            await sleep(26 + i * 2);
        }

        App.selectedIndex = randomIndex();
        App.selectedEntry = App.entries[App.selectedIndex];

        Terminal.ai("Candidate selected.");

        await sleep(300);
    },

    async lock() {
        setAppState("LOCK");
        setRingMode("lock");

        Sound.stop("scan_loop");
        Sound.play("lock");

        setAllEntryStatus("READY");
        setEntryStatus(App.selectedEntry.id, "TARGET LOCK");

        Terminal.lock("Target signature detected.");

        await sceneStep(
            "TARGET FOUND",
            "Target signature........FOUND",
            "lock",
            320
        );

        await sceneStep(
            "IDENTIFYING",
            `Database ID.............${formatId(App.selectedIndex)}`,
            "lock",
            320
        );

        await sceneStep(
            "LOCK COMPLETE",
            `Target locked : ${App.selectedEntry.title}`,
            "lock",
            620
        );
    },

    async result() {
        setAppState("RESULT");

        Sound.play("result");

        const idText = formatId(App.selectedIndex);
        const confidence = createConfidence();

        DOM.resultId.textContent = idText;
        DOM.resultConfidence.textContent = `${confidence}%`;
        DOM.resultStatus.textContent = "LOCKED";

        updateCreatorCard(
            App.selectedEntry,
            idText,
            confidence
        );

        Terminal.result("Operation result received.");
        Terminal.result(`Selected target : ${App.selectedEntry.title}`);
        Terminal.result(`Database ID : ${idText}`);
        Terminal.result(`AI Confidence : ${confidence}%`);

        await revealResultTitle(App.selectedEntry.title);

        Terminal.result("Creator result card ready.");
        Terminal.result("Selection complete.");
    }
};


/*==================================================
    SCENE HELPERS
==================================================*/

async function sceneStep(display, logMessage, logType, wait) {
    setSystemMessage(display);

    if (logMessage) {
        writeSceneLog(logMessage, logType);
    }

    await sleep(wait);
}

function writeSceneLog(message, type) {
    switch (type) {
        case "auth":
            Terminal.auth(message);
            break;

        case "database":
            Terminal.database(message);
            break;

        case "ai":
            Terminal.ai(message);
            break;

        case "lock":
            Terminal.lock(message);
            break;

        case "result":
            Terminal.result(message);
            break;

        default:
            Terminal.system(message);
            break;
    }
}


/*==================================================
    ENGINE
==================================================*/

const Engine = {
    async start() {
        if (App.isRunning) return;

        if (App.entries.length === 0) {
            Terminal.warn("No entry data found.");
            setSystemMessage("NO DATA");
            Sound.play("error");
            return;
        }

        App.isRunning = true;

        DOM.startButton.disabled = true;
        DOM.resetButton.disabled = true;

        resetResultPanel();
        resetCreatorCard();
        closeCreatorPanel();

        try {
            await Scene.boot();
            await Scene.auth();
            await Scene.database();
            await Scene.scan();
            await Scene.lock();
            await Scene.result();
        } finally {
            App.isRunning = false;

            DOM.startButton.disabled = false;
            DOM.resetButton.disabled = false;
        }
    }
};


/*==================================================
    CARD CHECK
==================================================*/

async function checkCards() {
    for (const entry of App.entries) {
        setEntryStatus(entry.id, "CHECKING");
        await sleep(42);
    }

    await sleep(220);

    setAllEntryStatus("READY");
}


/*==================================================
    RESULT TITLE REVEAL
==================================================*/

async function revealResultTitle(title) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789■□◇◆▓▒░";
    const finalText = title;

        DOM.resultTitle.textContent = finalText;

    fitResultTitle(DOM.resultTitle, {
        maxSize: 60,
        minSize: 26,
        maxLines: 3
    });

    for (let i = 0; i < finalText.length; i++) {
        for (let j = 0; j < 3; j++) {
            const display =
                finalText.slice(0, i) +
                chars[Math.floor(Math.random() * chars.length)] +
                "□".repeat(Math.max(finalText.length - i - 1, 0));

            DOM.resultTitle.textContent = display;

            await sleep(28);
        }

        DOM.resultTitle.textContent =
            finalText.slice(0, i + 1) +
            "□".repeat(Math.max(finalText.length - i - 1, 0));

        await sleep(32);
    }

    DOM.resultTitle.textContent = finalText;

}


/*==================================================
    BOOT SCREEN
==================================================*/

function closeBootScreen() {
    if (!DOM.bootScreen) return;

    setTimeout(() => {
        DOM.bootScreen.classList.add("is-hidden");
        Terminal.system("Boot screen closed.");
    }, 2300);
}


/*==================================================
    UTILITY
==================================================*/

function randomEntry() {
    return App.entries[randomIndex()];
}

function randomIndex() {
    return Math.floor(Math.random() * App.entries.length);
}

function formatId(index) {
    return String(index + 1).padStart(4, "0");
}

function createConfidence() {
    if (Math.random() < 0.01) {
        return "100.00";
    }

    const value = 96 + Math.random() * 3.99;

    return value.toFixed(2);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPngFileName() {
    const now = new Date();

    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const h = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    return `arcs-result-${y}${m}${d}-${h}${min}.png`;
}

function escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

function fitResultTitle(element, options = {}) {
    if (!element) return;

    const text = element.textContent.trim();

    const settings = {
        maxSize: options.maxSize || 60,
        minSize: options.minSize || 26,
        maxLines: options.maxLines || 3
    };

    let size = settings.maxSize;

    if (text.length > 40) {
        size = 28;
    } else if (text.length > 30) {
        size = 32;
    } else if (text.length > 22) {
        size = 38;
    } else if (text.length > 14) {
        size = 46;
    }

    size = Math.max(settings.minSize, Math.min(size, settings.maxSize));

    element.style.fontSize = `${size}px`;
    element.style.lineHeight = "1.14";
    element.style.maxHeight = `${size * settings.maxLines * 1.14}px`;
    element.style.overflow = "hidden";
}

function resetTitleFit(element) {
    if (!element) return;

    element.style.fontSize = "";
    element.style.lineHeight = "";
    element.style.maxHeight = "";
    element.style.overflow = "";
}


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


/*==================================================
    INIT
==================================================*/

function init() {
    setAppState("READY");

    setRingMode("idle");

    resetResultPanel();
    resetCreatorCard();

    Terminal.system(`${SYSTEM.project} interface online.`);
    Terminal.system(`${SYSTEM.name} standby.`);

    loadSettings();

    renderSettings();

    loadEntries();

    render();

    Terminal.system("System ready.");

    closeBootScreen();
}

init();
