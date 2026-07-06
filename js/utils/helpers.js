"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    helpers.js

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
