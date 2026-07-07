"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.7

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

    const header = randomItem(HEADERS);

    const command = randomItem(COMMANDS);

    const result = randomItem(RESULTS);

    const win = document.createElement("div");

    win.className = "idle-window";

    win.style.left = pos.x + "%";
    win.style.top = pos.y + "%";

    win.innerHTML = `

        <div class="idle-title">

            ${header}

        </div>

        <div class="idle-line command">

            >

        </div>

        <div class="idle-line result">

            >

        </div>

    `;

    document.body.appendChild(win);

    requestAnimationFrame(()=>{

        win.classList.add("show");

    });

    const commandLine =
        win.querySelector(".command");

    const resultLine =
        win.querySelector(".result");

    await type(commandLine,command);

    await wait(350);

    await type(resultLine,result);

    await wait(2500);

    win.classList.remove("show");

    await wait(400);

    win.remove();

}


/*==================================================
    TYPE EFFECT
==================================================*/

async function type(element,text){

    element.innerHTML = '&gt; <span class="cursor">█</span>';

    for(let i=0;i<text.length;i++){

        element.textContent += text[i];

        await wait(28);

    }

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
