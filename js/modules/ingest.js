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
            this.setCore("A.R.C.S.", "SYSTEM BUSY");
            return;
        }

        if (!file.name.toLowerCase().endsWith(".txt")) {
            Terminal.warn("Invalid file format. TXT required.");
            this.setCore("DATABASE", "IMPORT ERROR");
            await sleep(900);
            this.restoreReady();
            return;
        }

        this.isActive = true;

        try {
            setAppState("INGEST");
            setRingMode("scan");

            this.setCore("DATABASE", "INGEST");

            Terminal.database("FILE DETECTED");
            Terminal.database("VERIFYING FORMAT...");

            await sleep(420);

            const text = await file.text();
            const entries = this.parseText(text);

            if (entries.length === 0) {
                Terminal.warn("No valid entries found.");
                this.setCore("DATABASE", "NO DATA");
                await sleep(900);
                return;
            }

            Terminal.database("FORMAT VERIFIED");
            Terminal.database("DATABASE INGEST");

            await this.showProgress("SCANNING...", "████░░░░░░", 620);
            await this.showProgress("INDEXING...", "███████░░░", 620);
            await this.showProgress("REGISTERING...", "██████████", 620);

            this.registerEntries(entries);

            await this.complete();

        } catch (error) {
            Terminal.warn("INGEST FAILED");
            console.error(error);

            this.setCore("DATABASE", "IMPORT ERROR");

            await sleep(900);
        } finally {
            this.isActive = false;

            await sleep(600);

            this.restoreReady();
        }
    },

    parseText(text) {
        return text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
    },

    async showProgress(label, bar, wait) {
        this.setCore("DATABASE", `${label}\n${bar}`);

        Terminal.database(label);

        await sleep(wait);
    },

    registerEntries(entries) {
        entries.forEach(title => {
            App.entries.push({
                id: createId(),
                title,
                status: "READY"
            });
        });

        saveEntries();
        render();

        Terminal.database("DATABASE UPDATED");
    },

    async complete() {
        this.setCore("DATABASE", "COMPLETE!");
        Sound.play("result");

        await sleep(700);

        this.setCore("DATABASE", "UPDATED");

        await sleep(700);
    },

    showReady() {
        if (App.isRunning || this.isActive) return;

        this.setCore("DATABASE", "INGEST READY");
    },

    hideReady() {
        if (App.isRunning || this.isActive) return;

        this.restoreReady();
    },

    restoreReady() {
        setAppState("READY");
        setRingMode("idle");
        this.setCore("A.R.C.S.", "SYSTEM READY");
    },

    setCore(title, message) {
        const titleElement =
            document.querySelector("#systemMessage span:first-child");

        if (titleElement) {
            titleElement.textContent = title;
        }

        setSystemMessage(message);
    }
};
