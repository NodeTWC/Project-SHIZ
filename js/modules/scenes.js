"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    scenes.js

==================================================*/


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
        minSize: 22,
        maxLines: 4
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
