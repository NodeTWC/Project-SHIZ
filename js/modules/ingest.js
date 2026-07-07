"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    ingest.js
    DATABASE INGEST SYSTEM

==================================================*/

const Ingest = {
    isActive: false,

    async handleFile(file) {
        if (!file) return;

        if (App.isRunning || this.isActive) {
            Terminal.warn("Ingest rejected : system busy.");
            setSystemMessage("SYSTEM BUSY");
            return;
        }

        if (!file.name.toLowerCase().endsWith(".txt")) {
            Terminal.warn("Invalid file format. TXT required.");
            setSystemMessage("IMPORT ERROR");
            return;
        }

        this.isActive = true;

        try {
            setAppState("INGEST");
            setSystemMessage("DATABASE INGEST");

            Terminal.system("DATABASE INGEST request received.");
            Terminal.database(`File detected : ${file.name}`);
            Terminal.database("Verifying file format...");

            await sleep(400);

            const text = await file.text();
            const entries = this.parseText(text);

            if (entries.length === 0) {
                Terminal.warn("No valid entries found.");
                setSystemMessage("NO DATA");
                return;
            }

            Terminal.database("Format OK.");
            Terminal.database(`Entries detected : ${entries.length}`);

            await this.showStep("SCANNING...", 700);
            await this.showStep("INDEXING...", 700);
            await this.registerEntries(entries);
            await this.complete(entries.length);

        } catch (error) {
            Terminal.warn("Ingest failed.");
            console.error(error);
            setSystemMessage("IMPORT ERROR");
        } finally {
            await sleep(900);

            this.isActive = false;

            setAppState("READY");
            setRingMode("idle");
            setSystemMessage("SYSTEM READY");
        }
    },

    parseText(text) {
        return text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
    },

    async showStep(message, wait) {
        setSystemMessage(message);
        Terminal.database(message);
        await sleep(wait);
    },

    async registerEntries(entries) {
        setSystemMessage("REGISTERING...");
        Terminal.database("Registering entries...");

        entries.forEach(title => {
            App.entries.push({
                id: createId(),
                title,
                status: "READY"
            });
        });

        saveEntries();
        render();

        Terminal.database(`${entries.length} entries registered.`);
    },

    async complete(count) {
        setSystemMessage("COMPLETE!");
        Terminal.result(`DATABASE INGEST complete : ${count} entries added.`);
        Sound.play("result");
        await sleep(900);
    },

    showReady() {
        if (App.isRunning || this.isActive) return;

        setSystemMessage("DATABASE INGEST READY");
    },

    hideReady() {
        if (App.isRunning || this.isActive) return;

        setSystemMessage("SYSTEM READY");
    }
};
