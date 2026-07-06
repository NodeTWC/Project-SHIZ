"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    terminal.js

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
