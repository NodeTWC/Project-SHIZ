"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.7
    AI IDLE SYSTEM

    idle.js

==================================================*/


/*==================================================
    IDLE DATA
==================================================*/

const POSITIONS = [
    { x: 8,  y: 10 },
    { x: 70, y: 14 },
    { x: 12, y: 60 },
    { x: 72, y: 66 },
    { x: 42, y: 24 },
    { x: 45, y: 72 }
];

const NODE_PREFIX = [
    "ARC",
    "CORE",
    "SIG",
    "MEM",
    "NET",
    "IDX",
    "SYS",
    "TGT",
    "AUX",
    "OBS"
];

const NODE_STATUS = [
    "ACTIVE",
    "ONLINE",
    "SYNC",
    "MONITOR",
    "STABLE"
];

const HEADERS = [
    "DATABASE CACHE",
    "SYSTEM CORE",
    "MEMORY",
    "NETWORK",
    "SECURITY",
    "PROCESS",
    "A.R.C.S. NODE",
    "TARGET MEMORY",
    "SIGNATURE CACHE",
    "CACHE INDEX"
];

const COMMANDS = [
    "checking...",
    "syncing...",
    "verifying...",
    "rebuilding...",
    "optimizing...",
    "analyzing...",
    "compressing...",
    "mapping...",
    "heartbeat...",
    "indexing..."
];

const RESULTS = [
    "OK",
    "verified",
    "complete",
    "stable",
    "cached",
    "online",
    "ready"
];


/*==================================================
    STATE
==================================================*/

let running = false;
let timer = null;


/*==================================================
    PUBLIC
==================================================*/

export function startIdle(){

    if(running) return;

    running = true;

    schedule();

}

export function stopIdle(){

    running = false;

    clearTimeout(timer);

}


/*==================================================
    LOOP
==================================================*/

function schedule(){

    if(!running) return;

    timer = setTimeout(async()=>{

        await createWindow();

        schedule();

    },random(5000,10000));

}


/*==================================================
    WINDOW
==================================================*/

async function createWindow(){

    if(!running) return;

    const pos = randomItem(POSITIONS);

    const node =
        randomItem(NODE_PREFIX) +
        "-" +
        String(random(1,99)).padStart(2,"0");

    const status = randomItem(NODE_STATUS);

    const header = randomItem(HEADERS);
    const command = randomItem(COMMANDS);
    const result = randomItem(RESULTS);

    const win = document.createElement("div");

    win.className = "idle-window";

    win.style.left = pos.x + "%";
    win.style.top = pos.y + "%";

    win.innerHTML = `
        <div class="idle-header">
            <div class="idle-node">${node}</div>
            <div class="idle-state">${status}</div>
        </div>

        <div class="idle-title">${header}</div>

        <div class="idle-line command">&gt;</div>
        <div class="idle-line result">&gt;</div>
    `;
        document.body.appendChild(win);

    requestAnimationFrame(()=>{

        win.classList.add("show");

    });

    const commandLine = win.querySelector(".command");
    const resultLine = win.querySelector(".result");

    await type(commandLine,command);

    await wait(350);

    await type(resultLine,result);

    await wait(2600);

    win.classList.remove("show");

    await wait(400);

    win.remove();

}


/*==================================================
    TYPE EFFECT
==================================================*/

async function type(element,text){

    element.innerHTML =
        '&gt; <span class="cursor">█</span>';

    await wait(160);

    for(let i=0;i<text.length;i++){

        element.innerHTML =
            "&gt; " +
            text.substring(0,i+1) +
            '<span class="cursor">█</span>';

        await wait(28);

    }

    await wait(180);

    element.textContent =
        "> " + text;

}


/*==================================================
    UTIL
==================================================*/

function wait(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}

function random(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

function randomItem(array){

    return array[

        Math.floor(

            Math.random()*array.length

        )

    ];

}
