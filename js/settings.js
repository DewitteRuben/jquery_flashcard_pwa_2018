let settingsModule = (function () {

    let STORAGE_KEYS = {
        SETTINGS: "settings"
    };

    let SETTINGS = {
        START_COLLAPSED: "startCollapsed",
        COMPACT_VIEW: "compactViewEnabled"
    };

    function init() {
        loadSettingsFromStorage();
        $(".form-save-settings").on("submit", saveSettings);
    }

    function saveSettings(e) {
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