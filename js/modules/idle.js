/*==================================================

    AI IDLE SYSTEM
    Version 3.7

==================================================*/

let timer = null;
let running = false;

const POSITIONS = [
    { x: 8,  y: 12 },
    { x: 72, y: 18 },
    { x: 15, y: 62 },
    { x: 75, y: 70 },
    { x: 45, y: 25 },
    { x: 42, y: 74 }
];

const HEADERS = [
    "DATABASE",
    "NETWORK",
    "SYSTEM",
    "MEMORY",
    "CACHE",
    "INDEX",
    "ARCHIVE",
    "NODE",
    "PROCESS",
    "SECURITY"
];

const COMMANDS = [
    "checking...",
    "sync...",
    "verifying...",
    "mapping...",
    "loading...",
    "optimizing...",
    "compressing...",
    "analyzing...",
    "rebuilding...",
    "ping..."
];

const RESULTS = [
    "OK",
    "complete",
    "verified",
    "stable",
    "success",
    "ready",
    "cached"
];

/*==================================================
    PUBLIC
==================================================*/

export function startIdle(){

    if(running) return;

    running = true;

    scheduleNext();

}

export function stopIdle(){

    running = false;

    clearTimeout(timer);

}

/*==================================================
    LOOP
==================================================*/

function scheduleNext(){

    if(!running) return;

    const delay =
        random(5000,12000);

    timer = setTimeout(async ()=>{

        await spawnWindow();

        scheduleNext();

    },delay);

}

/*==================================================
    WINDOW
==================================================*/

async function spawnWindow(){

    const pos =
        randomItem(POSITIONS);

    const header =
        randomItem(HEADERS);

    const command =
        randomItem(COMMANDS);

    const result =
        randomItem(RESULTS);

    const win =
        document.createElement("div");

    win.className = "idle-window";

    win.style.left = pos.x + "%";
    win.style.top = pos.y + "%";

    win.innerHTML = `
        <div class="idle-title">${header}</div>
        <div class="idle-line command">&gt; </div>
        <div class="idle-line result">&gt; </div>
    `;

    document.body.appendChild(win);

    requestAnimationFrame(()=>{

        win.classList.add("show");

    });

    const commandElement =
        win.querySelector(".command");

    const resultElement =
        win.querySelector(".result");

    await typeText(commandElement,command);

    await wait(400);

    await typeText(resultElement,result);

    await wait(2500);

    win.classList.remove("show");

    await wait(400);

    win.remove();

}

/*==================================================
    TYPE
==================================================*/

function typeText(element,text,speed=30){

    return new Promise(resolve=>{

        let index = 0;

        const timer = setInterval(()=>{

            element.textContent =
                "> " + text.substring(0,index);

            index++;

            if(index>text.length){

                clearInterval(timer);

                resolve();

            }

        },speed);

    });

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
