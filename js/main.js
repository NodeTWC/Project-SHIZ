"use strict";

/*==================================================
    Project SHIZ
    A.M.S.S. v2.0
    Cinematic Sequence Refactor

    js/main.js
==================================================*/

const STORAGE_KEY = "amss_movies_v1";

const App = {
    state: "READY",
    movies: [],
    selectedMovie: null,
    selectedIndex: -1,
    isRunning: false,
    config: {
        soundEnabled: false
    }
};

const DOM = {
    bootScreen: document.getElementById("bootScreen"),

    movieInput: document.getElementById("movieInput"),
    addMovie: document.getElementById("addMovie"),
    clearAllButton: document.getElementById("clearAllButton"),
    movieCards: document.getElementById("movieCards"),
    movieCount: document.getElementById("movieCount"),

    startButton: document.getElementById("startButton"),
    resetButton: document.getElementById("resetButton"),

    systemMessage: document.querySelector("#systemMessage span:last-child"),
    terminal: document.getElementById("terminal"),
    ring: document.getElementById("ring"),

    resultTitle: document.getElementById("resultTitle"),
    resultId: document.getElementById("resultId"),
    resultConfidence: document.getElementById("resultConfidence"),
    resultStatus: document.getElementById("resultStatus")
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

    system(message) {
        this.write(message, "SYSTEM");
    },

    database(message) {
        this.write(message, "DATABASE");
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

function playSound(name) {
    if (!App.config.soundEnabled) return;
    console.log(`sound:${name}`);
}

/*==================================================
    DATABASE
==================================================*/

function saveMovies() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(App.movies));
}

function loadMovies() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
        App.movies = JSON.parse(saved);

        App.movies.forEach(movie => {
            if (!movie.status) {
                movie.status = "READY";
            }
        });

        Terminal.database("Movie database loaded.");
    } catch {
        App.movies = [];
        Terminal.warn("Failed to load movie database.");
    }
}

function addMovie() {
    const title = DOM.movieInput.value.trim();

    if (!title) {
        Terminal.warn("Movie title is empty.");
        setSystemMessage("NO DATA");
        return;
    }

    App.movies.push({
        id: createId(),
        title,
        status: "READY"
    });

    saveMovies();
    DOM.movieInput.value = "";
    render();

    Terminal.database(`Registered : ${title}`);
}

function removeMovie(id) {
    if (App.isRunning) return;

    const movie = App.movies.find(item => item.id === id);

    App.movies = App.movies.filter(item => item.id !== id);

    saveMovies();
    render();

    if (movie) {
        Terminal.database(`Removed : ${movie.title}`);
    }
}

function clearAllMovies() {
    if (App.isRunning) return;

    if (App.movies.length === 0) {
        Terminal.warn("Movie database is already empty.");
        return;
    }

    const confirmed = confirm("登録作品をすべて削除しますか？");

    if (!confirmed) return;

    App.movies = [];
    App.selectedMovie = null;
    App.selectedIndex = -1;

    saveMovies();
    render();

    resetResultPanel();
    setSystemMessage("SYSTEM READY");

    Terminal.database("All movie records cleared.");
}

/*==================================================
    RENDER
==================================================*/

function render() {
    renderCounters();
    renderMovieCards();
}

function renderCounters() {
    DOM.movieCount.textContent = App.movies.length;
}

function renderMovieCards() {
    DOM.movieCards.innerHTML = "";

    App.movies.forEach((movie, index) => {
        const card = document.createElement("div");

        card.className = `movieCard ${getStatusClass(movie.status)}`;
        card.dataset.id = movie.id;

        card.innerHTML = `
            <div class="movieTitle">◆ ${escapeHTML(movie.title)}</div>
            <div class="movieStatus">
                ID : ${formatId(index)} / STATUS : ${movie.status}
            </div>
            <div class="movieBar"></div>
        `;

        card.addEventListener("dblclick", () => {
            removeMovie(movie.id);
        });

        DOM.movieCards.appendChild(card);
    });
}

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

function setAllMovieStatus(status) {
    App.movies.forEach(movie => {
        movie.status = status;
    });

    renderMovieCards();
}

function setMovieStatus(id, status) {
    const movie = App.movies.find(item => item.id === id);

    if (!movie) return;

    movie.status = status;
    renderMovieCards();
}

function resetMovieStatus() {
    App.movies.forEach(movie => {
        movie.status = "READY";
    });

    renderMovieCards();
}

function resetResultPanel() {
    DOM.resultTitle.textContent = "---";
    DOM.resultId.textContent = "----";
    DOM.resultConfidence.textContent = "--.--%";
    DOM.resultStatus.textContent = "LOCKED";
}

function resetSystem() {
    if (App.isRunning) return;

    App.selectedMovie = null;
    App.selectedIndex = -1;

    resetMovieStatus();
    resetResultPanel();

    setAppState("READY");
    setRingMode("idle");
    setSystemMessage("SYSTEM READY");

    Terminal.system("System reset.");
}

/*==================================================
    CINEMATIC SCENES
==================================================*/

const Scene = {
    async boot() {
        setAppState("BOOT");
        setRingMode("boot");
        playSound("boot");

        Terminal.system("Boot sequence started.");

        await sceneMessage("POWER CORE", 420);
        await sceneMessage("AI MODULE", 420);
        await sceneMessage("TARGET ENGINE", 420);
        await sceneMessage("SYSTEM ONLINE", 520);
    },

    async auth() {
        setAppState("AUTH");
        playSound("auth");

        Terminal.auth("Operator verification started.");

        await sceneMessage("AUTHENTICATING", 520);
        await sceneMessage("忠犬しず", 620);

        Terminal.auth("Operator : 忠犬しず");
        Terminal.auth("Access granted.");

        await sceneMessage("ACCESS GRANTED", 560);
    },

    async database() {
        setAppState("DATABASE");
        playSound("connect");

        Terminal.database("Database link established.");
        Terminal.database(`Registered Titles : ${App.movies.length}`);

        await sceneMessage("DATABASE LINK", 500);
        await sceneMessage("VERIFYING RECORDS", 420);

        await checkCards();

        Terminal.database("All movie records verified.");

        await sceneMessage("DATABASE READY", 560);
    },

    async scan() {
        setAppState("SCAN");
        setRingMode("scan");
        playSound("scan");

        setAllMovieStatus("SCANNING");

        Terminal.ai("AI randomizer online.");
        Terminal.ai("Scanning candidate records.");

        const messages = [
            "SEARCHING",
            "ANALYZING",
            "FILTERING",
            "TARGET TRACE",
            "LOCKING"
        ];

        const steps = 62;

        for (let i = 0; i < steps; i++) {
            const movie = randomMovie();

            if (i % 9 === 0) {
                setSystemMessage(movie.title);
            } else {
                setSystemMessage(messages[i % messages.length]);
            }

            await sleep(26 + i * 2);
        }

        App.selectedIndex = randomIndex();
        App.selectedMovie = App.movies[App.selectedIndex];

        await sleep(300);
    },

    async lock() {
        setAppState("LOCK");
        setRingMode("lock");
        playSound("lock");

        setAllMovieStatus("READY");
        setMovieStatus(App.selectedMovie.id, "TARGET LOCK");

        Terminal.lock(`Target locked : ${App.selectedMovie.title}`);

        await sceneMessage("TARGET ACQUIRED", 340);
        await sceneMessage("TARGET LOCK", 620);
    },

    async result() {
        setAppState("RESULT");
        playSound("result");

        const idText = formatId(App.selectedIndex);
        const confidence = createConfidence();

        DOM.resultId.textContent = idText;
        DOM.resultConfidence.textContent = `${confidence}%`;
        DOM.resultStatus.textContent = "LOCKED";

        Terminal.result(`Mission target : ${App.selectedMovie.title}`);
        Terminal.result(`Database ID : ${idText}`);
        Terminal.result(`AI Confidence : ${confidence}%`);

        await revealResultTitle(App.selectedMovie.title);

        Terminal.result("Mission start.");
    }
};

async function sceneMessage(message, wait) {
    setSystemMessage(message);
    await sleep(wait);
}

/*==================================================
    AI ENGINE
==================================================*/

const AIEngine = {
    async start() {
        if (App.isRunning) return;

        if (App.movies.length === 0) {
            Terminal.warn("No movie data found.");
            setSystemMessage("NO DATA");
            playSound("error");
            return;
        }

        App.isRunning = true;
        DOM.startButton.disabled = true;
        DOM.resetButton.disabled = true;

        resetResultPanel();

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
    CARD CHECK SEQUENCE
==================================================*/

async function checkCards() {
    for (const movie of App.movies) {
        setMovieStatus(movie.id, "CHECKING");
        await sleep(42);
    }

    await sleep(220);
    setAllMovieStatus("READY");
}

/*==================================================
    RESULT TITLE REVEAL
==================================================*/

async function revealResultTitle(title) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789■□◇◆▓▒░";
    const finalText = title;

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

function randomMovie() {
    return App.movies[randomIndex()];
}

function randomIndex() {
    return Math.floor(Math.random() * App.movies.length);
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

    return `movie-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/*==================================================
    EVENTS
==================================================*/

DOM.addMovie.addEventListener("click", addMovie);
DOM.clearAllButton.addEventListener("click", clearAllMovies);

DOM.movieInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addMovie();
    }
});

DOM.startButton.addEventListener("click", () => {
    AIEngine.start();
});

DOM.resetButton.addEventListener("click", resetSystem);

/*==================================================
    INIT
==================================================*/

function init() {
    setAppState("READY");
    setRingMode("idle");
    resetResultPanel();

    Terminal.system("Project SHIZ interface online.");

    loadMovies();
    render();

    Terminal.system("A.M.S.S. ready.");

    closeBootScreen();
}

init();
