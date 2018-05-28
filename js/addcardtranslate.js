let addCardTranslateModule = (function () {

    const MESSAGES = {
        OFFLINE:"Offline mode detected, translation features have been disabled!",
    };

    function displayOfflineMessage() {
        if (!UtilModule.isOnline())
            GuiModule.showToast(MESSAGES.OFFLINE, "");
    }

    function init() {
        displayOfflineMessage();
        $(".btn-translate-modal").on("click", evOpenTranslateModal);
        $(".btn-translate-input").on("click", evTranslateInput);
        $("#card-question").on("input", evHandleTranslateButton);
        $(".translate-decline").on("click", evDeclineTranslateOnModalClose);
        $(".modal-close").on("click", evOnTranslateModalClose);
    }

    function evDeclineTranslateOnModalClose(e) {
        e.preventDefault();
        $("#card-answer").val("");
    }

    function evOnTranslateModalClose() {
        $("#translateModal").find("input:not(.dropdown-trigger)").val("");
    }


    function toggleProgressbar() {
        $(".progressbar").toggleClass("hidden");
    }

    function translateTextField(value, targetLanguage) {
        let $progressbar = $(".progressbar");
        if (!UtilModule.isEmpty(value)) {
            $progressbar.removeClass("hidden");
            TranslateModule.translate(value, targetLanguage).then(function (result) {
                console.log(result);
                $("#card-ouput-t").val(result.text[0]);
                $("#card-answer").val(result.text[0]);
                $progressbar.addClass("hidden");
            }).catch(err => {
                $progressbar.addClass("hidden");
                GuiModule.showToast(err, "")
            });
        }
    }

    function evTranslateInput(e) {
        e.preventDefault();
        let value = $.trim($("#card-input-t").val());
        let targetLanguage = UtilModule.getSelectOptionByName("available-languages");
        translateTextField(value, targetLanguage);
    }


    function evOpenTranslateModal(e) {
        e.preventDefault();
        let $translateModal = $("#translateModal");
        $("#card-input-t").val($("#card-question").val());

        TranslateModule.getAllAvailableLanguages().then(function (result) {
            $("#available-languages").html(GuiModule.object2options(result.langs)).formSelect();
        }).then(function () {
            $translateModal.modal().modal("open");
        });
    }


    function evHandleTranslateButton(e) {
        e.preventDefault();
        $(".btn-translate-modal").attr("disabled", UtilModule.isEmpty($(this).val()) || !UtilModule.isOnline());
    }

    return {
        init:init
    }

})();

$(document).ready(function() {
    addCardTranslateModule.init();
});