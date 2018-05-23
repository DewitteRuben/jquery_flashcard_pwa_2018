let addCardModule = (function () {

    let cardTypeToClassMap = {
        "SA": ".singleAnswer",
        "TF": ".trueFalse",
        "MC": ".multipleChoice",
    };

    function init() {
        populateCardsetSelect();
        populateLanguagesSelect();
        UtilModule.validateSelect();
        $(".form-add-card").on("submit", evAddCardToCardset);
        $(".link-check-form").on("click", triggerSubmit);
        $(".answer-false").on("click", toggleColor).next().on("click", toggleColor);
        $("select[name='card-types']").on("change", switchChangeHandler);
        $(".btn-translate-modal").on("click", openTranslateModal);
        $(".btn-translate-input").on("click", translateInput);
        $("#card-question").on("input", handleTranslateButton);
        $("#input-card-picture").on("change", onImageFileSelect);
        $(".btn-preview-card").on("click", previewCard);
        $(".translate-decline").on("click", declineTranslateOnModalClose);
        $(".modal-close").on("click", onTranslateModalClose);
    }

    function getCardFromInput() {
        let $inputCardName = $("#card-name");
        let cName = $inputCardName.val();
        let cAnswer = getAnswer(getSelectedOptionByName("card-types"));
        let cType = getSelectedOptionByName("card-types");
        let cQuestion = $("#card-question").val();
        let card = new DomainModule.Card(cName, cType, cQuestion, cAnswer);
        card.typeAnswer = $("#checkbox-type-answer").prop("checked");

        if (card.isMultipleChoice()) {
            card.answerChoices = choicesInput2Arr($("#card-possible-mc").val(), cAnswer);
        }

        return DataModule.getPictureData().then((result) => {
            card.image = result;
            return card;
        });
    }

    function choicesInput2Arr(input, cAnswer) {
        let arr = input.split(",")
            .map(a => $.trim(a))
            .filter(a => !UtilModule.isEmpty(a));
        if (!UtilModule.isInArrayLowerCase(arr, cAnswer)) arr.push(cAnswer);
        return UtilModule.removeDuplicatesArray(arr);
    }


    function populateCardsetSelect() {
        DataModule.pGetAllCardsets()
            .then(cardsetMap2OptionsHTML)
            .then(populateSelectWithCardsetMap($("select[name='available-cardsets']")));
    }

    function populateLanguagesSelect() {
        TranslateModule.getAllAvailableLanguages().then(function (result) {
            $("#available-languages").html(GuiModule.object2options(result.langs)).formSelect();
        });
    }

    function cardsetMap2OptionsHTML(cardsetMap) {
        let HTMLString = "";
        HTMLString += cardsetMap.size !== 0 ? "" : `<option value="" disabled selected>${MESSAGES.NO_CARDSETS}</option>`;
        cardsetMap.forEach(function (cardset) {
            HTMLString += `<option value="${cardset.name}">${cardset.name} (${cardset.cards.length} cards)</option>`;
        });
        return HTMLString;
    }

    function populateSelectWithCardsetMap($select) {
        return function (HTMLString) {
            $select.html(HTMLString);
            if (sessionStorage.getItem('currentCardset')) {
                let cardsetName = sessionStorage.getItem('currentCardset');
                $select.find("option").filter(function (index, el) {
                    if ($(el).val() === cardsetName) {
                        $(el).prop("selected", true);
                    }
                });
            }
            // materialize css library forces you to reinitalize the select
            $select.formSelect();
        };
    }

    function resetImageStatusSpan() {
        $("#imageName")
            .text("none")
            .removeClass();
    }

    function resetForm() {
        $(".form-add-card")[0].reset();
        populateCardsetSelect();
        $("#card-types").formSelect();
        M.updateTextFields();
        resetImageStatusSpan();
    }

    function getAnswer(cardType) {
        switch (cardType) {
            case "TF":
                return $(".trueFalse").find("a:not(.grey)").data("value");
            case "MC":
                return $.trim($("#card-answer-mc").val());
            case "SA":
                return $.trim($("#card-answer").val());
        }
    }


    function switchAnswerUI(cardType) {
        let $formInput = $(".formAnswerInput");
        $formInput.find("input:not([type='checkbox']), select").prop("required", false);
        $formInput.find(".answerInput").addClass("hidden");
        $formInput.find(cardTypeToClassMap[cardType])
            .removeClass("hidden")
            .find("input:not([type='checkbox']), select")
            .prop("required", true);
    }

    function getSelectedOptionByName(selectName) {
        return $(`select[name="${selectName}"]`).find("option:selected").val();
    }

    function triggerSubmit(e) {
        e.preventDefault();
        $(".btn-add-card").click();
    }

    function toggleColor(e) {
        e.preventDefault();
        $(this).toggleClass("grey");
        if (!$(this).siblings().hasClass("grey")) {
            $(this).siblings().addClass("grey");
        }
    }

    function switchChangeHandler(e) {
        switchAnswerUI($(this).find("option:selected").val());
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

    function translateInput(e) {
        e.preventDefault();
        let value = $.trim($("#card-input-t").val());
        let targetLanguage = getSelectedOptionByName("available-languages");
        translateTextField(value, targetLanguage);
    }

    function openTranslateModal(e) {
        e.preventDefault();
        let $translateModal = $("#translateModal");
        $("#card-input-t").val($("#card-question").val());
        $translateModal.modal().modal("open");
    }

    function handleTranslateButton(e) {
        e.preventDefault();
        $(".btn-translate-modal").attr("disabled", UtilModule.isEmpty($(this).val()));
    }

    function onImageFileSelect(e) {
        let file = $(this)[0].files[0];

        DataModule.pFileReader(file).then(function (result) {
            $("#imageName").text(result.name)
                .addClass("green-text");
            return result;
        }).then(function (result) {
            return DataModule.savePicture(result.data);
        }).then(function () {
            GuiModule.showToast("Succesfully uploaded the picture!", "");
        }).catch(function () {
            GuiModule.showToast("Failed to upload picture, please try again!", "");
        })
    }

    function previewCard(e) {
        e.preventDefault();
        getCardFromInput().then(function (card) {
            if (card.isValid()) {
                GuiModule.previewCard(card);
            } else {
                GuiModule.showToast("All fields must be filled in before a preview can be shown!", "");
            }
        });
    }

    function declineTranslateOnModalClose(e) {
        e.preventDefault();
        $("#card-answer").val("");
    }

    function onTranslateModalClose() {
        $("#translateModal").find("input:not(.dropdown-trigger)").val("");
    }


    function evAddCardToCardset(e) {
        e.preventDefault();
        let cSetName = getSelectedOptionByName("available-cardsets");
        getCardFromInput().then((card) =>
            DataModule.pAddCardToCardset(card, cSetName).then(resetForm).then(DataModule.clearPictureData)
        ).then(e =>
            GuiModule.showToast(`Sucessfully added card to the ${cSetName} cardset!`, "")
        ).catch(err => GuiModule.showToast(err, ""));
    }

    return {
        init:init
    }


})();

$(document).ready(function () {
    addCardModule.init();
});

$(window).on("beforeunload", function () {
    DataModule.clearPictureData();
    return undefined; // to prevent unload dialogue message
});





















/*
function addCardToCardset(e) {
    e.preventDefault();
    let cSetName = getSelectedOptionByName("available-cardsets");
    getCardFromInput().then(function (card) {
        if (card.isValid()) {
            DataModule.addCardToCardSet(card, cSetName, function (updatedCardset, err) {
                if (err) {

                } else {
                    resetAddCardForm(e.target);
                    DataModule.clearPictureData().then(function () {
                        GuiModule.showToast(`Sucessfully added card to the ${cSetName} cardset!`, "")
                    });
                }
            });
        } else {
            GuiModule.showToast(`Please ensure every field is filled in!`, "")
        }
    });
}

function resetAddCardForm(form) {
    form.reset();
    GuiModule.populateDynamicAddcardSelects();
    $("#card-types").formSelect();
    M.updateTextFields();
    $("#imageName")
        .text("none")
        .removeClass();
}

function choicesInput2Arr(input, cAnswer) {
    let arr = input.split(",")
        .map(a => $.trim(a))
        .filter(a => !UtilModule.isEmpty(a));
    if (!UtilModule.isInArrayLowerCase(arr, cAnswer)) arr.push(cAnswer);
    return UtilModule.removeDuplicatesArray(arr);
}

function getCardFromInput() {
    let $inputCardName = $("#card-name");
    let cName = $inputCardName.val();
    let cAnswer = getAnswer(getSelectedOptionByName("card-types"));
    let cType = getSelectedOptionByName("card-types");
    let cQuestion = $("#card-question").val();
    let card = new DomainModule.Card(cName, cType, cQuestion, cAnswer);
    card.typeAnswer = $("#checkbox-type-answer").prop("checked");

    if (card.isMultipleChoice()) {
        card.answerChoices = choicesInput2Arr($("#card-possible-mc").val(), cAnswer);
    }

    return DataModule.getPictureData().then((result) => {
        card.image = result;
        return card;
    });
}


function getAnswer(cardType) {
    switch (cardType) {
        case "TF":
            return $(".trueFalse").find("a:not(.grey)").data("value");
        case "MC":
            return $.trim($("#card-answer-mc").val());
        case "SA":
            return $.trim($("#card-answer").val());
    }
}

let cardTypeToClassMap = {
    "SA": ".singleAnswer",
    "TF": ".trueFalse",
    "MC": ".multipleChoice",
};

function switchAnswerUI(cardType) {
    let $formInput = $(".formAnswerInput");
    $formInput.find("input:not([type='checkbox']), select").prop("required", false);
    $formInput.find(".answerInput").addClass("hidden");
    $formInput.find(cardTypeToClassMap[cardType])
        .removeClass("hidden")
        .find("input:not([type='checkbox']), select")
        .prop("required", true);
}

function getSelectedOptionByName(selectName) {
    return $(`select[name="${selectName}"]`).find("option:selected").val();
}

function triggerSubmit(e) {
    e.preventDefault();
    $(".btn-add-card").click();
}

function toggleColor(e) {
    e.preventDefault();
    $(this).toggleClass("grey");
    if (!$(this).siblings().hasClass("grey")) {
        $(this).siblings().addClass("grey");
    }
}

function switchChangeHandler(e) {
    switchAnswerUI($(this).find("option:selected").val());
}

function toggleProgressbar() {
    $(".progressbar").toggleClass("hidden");
}


function translateTextField(value, targetLanguage) {
    if (!UtilModule.isEmpty(value)) {
        toggleProgressbar();
        TranslateModule.translate(value, targetLanguage).then(function (result) {
            console.log(result);
            $("#card-ouput-t").val(result.text[0]);
            $("#card-answer").val(result.text[0]);
            toggleProgressbar();
        }).catch(function (error) {
            GuiModule.showToast("Failed to translate, please check your internet connection!", "");
        });
    }
}

function translateInput(e) {
    e.preventDefault();
    let value = $.trim($("#card-input-t").val());
    let targetLanguage = getSelectedOptionByName("available-languages");
    translateTextField(value, targetLanguage);
}

function openTranslateModal(e) {
    e.preventDefault();
    let $translateModal = $("#translateModal");
    $("#card-input-t").val($("#card-question").val());
    $translateModal.modal().modal("open");
}

function handleTranslateButton(e) {
    e.preventDefault();
    $(".btn-translate-modal").attr("disabled", UtilModule.isEmpty($(this).val()));
}

function onImageFileSelect(e) {
    let file = $(this)[0].files[0];

    DataModule.pFileReader(file).then(function (result) {
        $("#imageName").text(result.name)
            .addClass("green-text");
        return result;
    }).then(function (result) {
        return DataModule.savePicture(result.data);
    }).then(function () {
        GuiModule.showToast("Succesfully uploaded the picture!", "");
    }).catch(function () {
        GuiModule.showToast("Failed to upload picture, please try again!", "");
    })
}

function previewCard(e) {
    e.preventDefault();
    getCardFromInput().then(function (card) {
        if (card.isValid()) {
            GuiModule.previewCard(card);
        } else {
            GuiModule.showToast("All fields must be filled in before a preview can be shown!", "");
        }
    });
}

function declineTranslateOnModalClose(e) {
    e.preventDefault();
    $("#card-answer").val("");
}

function onTranslateModalClose() {
    $("#translateModal").find("input:not(.dropdown-trigger)").val("");
}
*/








