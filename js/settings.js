"use strict";

let settingsModule = (function () {

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

    function init() {
        loadSettingsFromStorage();
        $(".form-save-settings").on("submit", evSaveSettings);
        $(".btn-clear-highscores").on("click", evShowClearHighscoreDataModal)
            .next().on("click", evShowClearCardDataModal)
            .next().on("click", evShowClearAllDataModal);
    }


    function evShowClearAllDataModal(e) {
        e.preventDefault();
        let modalContent = `<p>${MESSAGES.DELETE_ALL_DATA}</p>`;
        GuiModule.generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", evClearAllData, UtilModule.fDefault);
    }

    function evShowClearHighscoreDataModal(e) {
        e.preventDefault();
        let modalContent = `<p>${MESSAGES.DELETE_HIGHSCORE_DATA}</p>`;
        GuiModule.generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", clearHighscoreData, UtilModule.fDefault);
    }

    function evShowClearCardDataModal(e) {
        e.preventDefault();
        let modalContent = `<p>${MESSAGES.DELETE_CARD_DATA}</p>`;
        GuiModule.generateModal("clearAllDataModal", modalContent, "Cancel", "Confirm", clearCardData, UtilModule.fDefault);
    }

    function clearHighscoreData(e) {
        e.preventDefault();
        DataModule.setHighscoresArr([]).then(function () {
            GuiModule.showToast("Successfully cleared all highscore data!", "");
        }).catch(function (err) {
            GuiModule.showToast("Failed to clear highscore data!", "");
        })
    }

    function clearCardData(e) {
        e.preventDefault();
        DataModule.pSetCardsetMap(new Map()).then(function () {
            GuiModule.showToast("Successfully cleared all card data!", "");
        }).catch(function () {
            GuiModule.showToast("Failed to clear card data!", "");
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
        DataModule.saveSettings($(this).serializeArray());
    }

    function startsCollapsed() {
        return DataModule.getSettings() &&
            DataModule.getSettings().filter(s => s.name === SETTINGS.START_COLLAPSED).length > 0;
    }

    function isCompactViewEnabled() {
        return DataModule.getSettings() &&
            DataModule.getSettings().filter(s => s.name === SETTINGS.COMPACT_VIEW).length > 0;
    }

    function populateFormWithSettings(settings) {
        if (settings)
            settings.forEach((setting) => $(`input[name='${setting.name}']`).prop("checked", setting.value));
    }

    function loadSettingsFromStorage() {
        populateFormWithSettings(DataModule.getSettings());
    }

    return {
        init: init,
        startsCollapsed: startsCollapsed,
        isCompactViewEnabled: isCompactViewEnabled
    }
})();

$(document).ready(function () {
    settingsModule.init();
});