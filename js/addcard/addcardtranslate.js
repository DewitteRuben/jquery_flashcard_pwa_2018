import {isOnline, getSelectOptionByName, isEmpty} from "../utilities";
import {showToast, object2options} from "../gui";
import {translate, getAllAvailableLanguages} from "./translate";

const MESSAGES = {
    OFFLINE: "Offline mode detected, translation features have been disabled!",
};

function displayOfflineMessage() {
    if (!isOnline())
        showToast(MESSAGES.OFFLINE, "");
}

export function init() {
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
    if (!isEmpty(value)) {
        $progressbar.removeClass("hidden");
        translate(value, targetLanguage).then(function (result) {
            $("#card-ouput-t").val(result.text[0]);
            $("#card-answer").val(result.text[0]);
            $progressbar.addClass("hidden");
        }).catch(err => {
            $progressbar.addClass("hidden");
            showToast(err, "")
        });
    }
}

function evTranslateInput(e) {
    e.preventDefault();
    let value = $.trim($("#card-input-t").val());
    let targetLanguage = getSelectOptionByName("available-languages");
    translateTextField(value, targetLanguage);
}


function evOpenTranslateModal(e) {
    e.preventDefault();
    let $translateModal = $("#translateModal");
    $("#card-input-t").val($("#card-question").val());

    getAllAvailableLanguages().then(function (result) {
        $("#available-languages").html(object2options(result.langs)).formSelect();
    }).then(function () {
        $translateModal.modal().modal("open");
    });
}


function evHandleTranslateButton(e) {
    e.preventDefault();
    $(".btn-translate-modal").attr("disabled", isEmpty($(this).val()) || !isOnline());
}
