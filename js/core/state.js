"use strict";

/*==================================================
    APP STATE
==================================================*/

const App = {
    state: "READY",

    entries: [],
    selectedEntry: null,
    selectedIndex: -1,

    isRunning: false,

    settings: {
        operatorName: "忠犬しず"
    },

    config: {
        soundEnabled: false,
        volume: 0.6
    }
};

