import {showToast, generateModal} from "../gui";
import {fDefault} from "../utilities";
import {setHighscoresArr, pSetCardsetMap, getSettings, saveSettings} from "../data";

const STORAGE_KEYS = {
    SETTINGS: "settings"
};

const SETTINGS = {
    START_COLLAPSED: "startCollapsed",
    COMPACT_VIEW: "compactViewEnabled"
};

const MESSAGES = {
    DELETE_ALL_DATA: "Are you sure you wish to clear all data? This includes all highscore data and all " +
    "card related data such as all cardsets and cards!",
    DELETE_HIGHSCORE_DATA: "Are you sure you wish to clear all highscore related data?",
    DELETE_CARD_DATA: "Are you sure you wish to clear all card related data? This includes all " +
    "cardsets and cards in these cardsets",
};

export function init() {
    loadSettingsFromStorage();
    $(".form-save-settings").on("submit", evSaveSettings);
    $(".btn-clear-highscores").on("click", evShowClearHighscoreDataModal)
        .next().on("click", evShowClearCardDataModal)
        .next().on("click", evShowClearAllDataModal);
}


function evShowClearAllDataModal(e) {
    e.preventDefault();
    let modalContent = `<p>${MESSAGES.DELETE_ALL_DATA}</p>`;
    generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", evClearAllData, fDefault);
}

function evShowClearHighscoreDataModal(e) {
    e.preventDefault();
    let modalContent = `<p>${MESSAGES.DELETE_HIGHSCORE_DATA}</p>`;
    generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", clearHighscoreData, fDefault);
}

function evShowClearCardDataModal(e) {
    e.preventDefault();
    let modalContent = `<p>${MESSAGES.DELETE_CARD_DATA}</p>`;
    generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", clearCardData, fDefault);
}

function clearHighscoreData(e) {
    e.preventDefault();
    setHighscoresArr([]).then(function () {
        showToast("Successfully cleared all highscore data!", "");
    }).catch(function (err) {
        showToast("Failed to clear highscore data!", "");
    })
}

function clearCardData(e) {
    e.preventDefault();
    pSetCardsetMap(new Map()).then(function () {
        showToast("Successfully cleared all card data!", "");
    }).catch(function () {
        showToast("Failed to clear card data!", "");
    })
}

function evClearAllData(e) {
    e.preventDefault();
    clearCardData(e);
    clearHighscoreData(e);
}

function evSaveSettings(e) {
    e.preventDefault();
    console.log($(this).serializeArray());
    saveSettings($(this).serializeArray());
}

export function startsCollapsed() {
    return getSettings() &&
        getSettings().filter(s => s.name === SETTINGS.START_COLLAPSED).length > 0;
}

export function isCompactViewEnabled() {
    return getSettings() &&
        getSettings().filter(s => s.name === SETTINGS.COMPACT_VIEW).length > 0;
}

function populateFormWithSettings(settings) {
    if (settings)
        settings.forEach((setting) => $(`input[name='${setting.name}']`).prop("checked", setting.value));
}

function loadSettingsFromStorage() {
    populateFormWithSettings(getSettings());
}
