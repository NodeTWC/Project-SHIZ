"use strict";

/*==================================================

    PROJECT SHIZ
    A.R.C.S.

    Version 3.4.0 Modular Edition

    state.js

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
        volume: 0.7
    }
};
