"use strict";

/*==================================================
    Project SHIZ
    A.M.S.S. v2.1
    Operation Sequence Update

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

        Terminal.database("Local archive loaded.");
    } catch {
        App.movies = [];
        Terminal.warn("Failed to load local archive.");
    }
}

function addMovie() {
    const title = DOM.movieInput.value.trim();

    if (!title) {
        Terminal.warn("Empty title rejected.");
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

    Terminal.database(`Record registered : ${title}`);
}

function removeMovie(id) {
    if (App.isRunning) return;

    const movie = App.movies.find(item => item.id === id);

    App.movies = App.movies.filter(item => item.id !== id);

    saveMovies();
    render();

    if (movie) {
        Terminal.database(`Record removed : ${movie.title}`);
    }
}

function clearAllMovies() {
    if (App.isRunning) return;

    if (App.movies.length === 0) {
        Terminal.warn("Archive already empty.");
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

    Terminal.database("All records cleared.");
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

    Terminal.system("Operation reset. Awaiting command.");
}

/*==================================================
    CINEMATIC SCENES
==================================================*/

const Scene = {
    async boot() {
        setAppState("BOOT");
        setRingMode("boot");
        playSound("boot");

        Terminal.system("Boot sequence initiated.");

        await sceneStep("POWER CORE", "Power Core..............OK", "system", 310);
        await sceneStep("HUD LINK", "HUD Interface..........OK", "system", 310);
        await sceneStep("AI MODULE", "AI Module..............ONLINE", "system", 360);
        await sceneStep("TARGET ENGINE", "Target Engine..........STANDBY", "system", 360);
        await sceneStep("SYSTEM ONLINE", "A.M.S.S. online.", "system", 520);
    },

    async auth() {
        setAppState("AUTH");
        playSound("auth");

        Terminal.auth("Operator verification started.");

        await sceneStep("AUTHENTICATING", "Operator signature.....SCANNING", "auth", 480);
        await sceneStep("忠犬しず", "Operator : 忠犬しず", "auth", 600);
        await sceneStep("ACCESS GRANTED", "Access level...........GRANTED", "auth", 620);
    },

    async database() {
        setAppState("DATABASE");
        playSound("connect");

        Terminal.database("Archive link established.");

        await sceneStep("DATABASE LINK", "Archive connection.....OK", "database", 420);
        await sceneStep("VERIFYING", `Registered Titles......${App.movies.length}`, "database", 420);
        await sceneStep("RECORD CHECK", "Record integrity.......RUNNING", "database", 300);

        await checkCards();

        await sceneStep("DATABASE READY", "Record integrity.......OK", "database", 560);
    },

    async scan() {
        setAppState("SCAN");
        setRingMode("scan");
        playSound("scan");

        setAllMovieStatus("SCANNING");

        Terminal.ai("Selection engine activated.");
        Terminal.ai("Candidate analysis started.");

        const sequence = [
            "PATTERN MATCH",
            "GENRE TRACE",
            "BALANCE CHECK",
            "RANDOM SEED",
            "TARGET SEARCH",
            "DECISION PATH"
        ];

        const logs = [
            "Pattern matching........RUNNING",
            "Genre trace.............RUNNING",
            "Viewer balance..........CALCULATING",
            "Random seed.............GENERATED",
            "Candidate matrix........ACTIVE",
            "Decision path...........LOCKING"
        ];

        const steps = 62;

        for (let i = 0; i < steps; i++) {
            if (i % 13 === 0) {
                const movie = randomMovie();
                setSystemMessage(movie.title);
            } else {
                setSystemMessage(sequence[i % sequence.length]);
            }

            if (i % 12 === 0 && logs[Math.floor(i / 12)]) {
                Terminal.ai(logs[Math.floor(i / 12)]);
            }

            await sleep(26 + i * 2);
        }

        App.selectedIndex = randomIndex();
        App.selectedMovie = App.movies[App.selectedIndex];

        Terminal.ai("Candidate selected.");
        await sleep(300);
    },

    async lock() {
        setAppState("LOCK");
        setRingMode("lock");
        playSound("lock");

        setAllMovieStatus("READY");
        setMovieStatus(App.selectedMovie.id, "TARGET LOCK");

        Terminal.lock("Target signature detected.");

        await sceneStep("TARGET FOUND", "Target signature........FOUND", "lock", 320);
        await sceneStep("IDENTIFYING", `Database ID.............${formatId(App.selectedIndex)}`, "lock", 320);
        await sceneStep("LOCK COMPLETE", `Target locked : ${App.selectedMovie.title}`, "lock", 620);
    },

    async result() {
        setAppState("RESULT");
        playSound("result");

        const idText = formatId(App.selectedIndex);
        const confidence = createConfidence();

        DOM.resultId.textContent = idText;
        DOM.resultConfidence.textContent = `${confidence}%`;
        DOM.resultStatus.textContent = "LOCKED";

        Terminal.result("Operation result received.");
        Terminal.result(`Mission target : ${App.selectedMovie.title}`);
        Terminal.result(`Database ID : ${idText}`);
        Terminal.result(`AI Confidence : ${confidence}%`);

        await revealResultTitle(App.selectedMovie.title);

        Terminal.result("Mission ready.");
    }
};

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
