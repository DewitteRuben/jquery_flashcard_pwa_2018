import {init as addCardInit} from "./addcard"
import {init as addCardTranslateInit} from "./addcardtranslate"
import {init as editCardInit} from "./editcard"
import {storageClearPictureData} from "../data";

$(document).ready(function() {
    addCardInit();
    editCardInit();
    addCardTranslateInit();
});

$(window).on("beforeunload", function () {
    storageClearPictureData();
    sessionStorage.removeItem("editingCard");
    return undefined; // to prevent unload dialogue message
});