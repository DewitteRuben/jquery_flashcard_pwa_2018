"use strict";
let addCardModule = (function () {

    let cardTypeToClassMap = {
        "SA": ".singleAnswer",
        "TF": ".trueFalse",
        "MC": ".multipleChoice",
    };

    let cardTypes = {
        SA: "SA",
        TF: "TF",
        MC: "MC"
    };
    
    let MESSAGES = {
        NO_CARDSETS: "No cardsets have been created yet!",
    };

    function init() {
        populateCardsetSelect();
        UtilModule.validateSelect();
        $(".form-add-card").on("submit", evAddCardToCardset);
        $(".link-check-form").on("click", triggerSubmit);
        $(".answer-false").on("click", toggleColor).next().on("click", toggleColor);
        $("select[name='card-types']").on("change", switchChangeHandler);
        $("#input-card-picture").on("change", onImageFileSelect);
        $(".btn-preview-card").on("click", evOpenPreviewCardModal);
        $(".clear-loaded-image").on("click", evClearLoadedImage);
    }

    function getCardFromInput() {
        let $inputCardName = $("#card-name");
        let cName = $inputCardName.val();
        let cAnswer = getAnswer(UtilModule.getSelectOptionByName("card-types"));
        let cType = UtilModule.getSelectOptionByName("card-types");
        let cQuestion = $("#card-question").val();
        let card = new DomainModule.Card(cName, cType, cQuestion, cAnswer);
        card.typeAnswer = $("#checkbox-type-answer").prop("checked");
        card.image = JSON.parse(localStorage.getItem(DataModule.KEYS.PICTURE));
        if (card.isMultipleChoice()) {
            card.answerChoices = choicesInput2Arr($("#card-possible-mc").val(), cAnswer);
        }
        return card;
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

    function resetForm() {
        $(".form-add-card")[0].reset();
        populateCardsetSelect();
        $("#card-types").formSelect();
        M.updateTextFields();
        updateImageSpan();
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

    function updateImageSpan() {
        let imageSpan = $("#imageName");
        let imageFile = DataModule.storageGetLoadedPicture();
        if (imageFile) {
            console.log(imageFile);
            imageSpan.text(imageFile.name).addClass("green-text")
                .next().removeClass("hidden");
        } else {
            imageSpan.removeClass("green-text").text("none");
            imageSpan.next().addClass("hidden");
        }
    }

    function onImageFileSelect(e) {
        let file = $(this)[0].files[0];
        DataModule.pFileReader(file).then(function (imgFile) {
            return new DomainModule.Image(imgFile.name, imgFile.data);
        }).then(function (imageFile) {
            DataModule.storageSavePicture(imageFile);
            updateImageSpan();
        }).catch(function (err) {
            GuiModule.showToast(err, "");
        });
    }

    function previewCard(card) {
        let id = "previewModal";
        let modalContent = `<h4>Preview</h4>
                        ${card.render()}`;
        GuiModule.generateModal("previewModal", modalContent, "", "Close");
    }

    function evOpenPreviewCardModal(e) {
        e.preventDefault();
        let card = getCardFromInput();
        if (card.isValid()) {
            previewCard(card);
        } else {
            GuiModule.showToast("All fields must be filled in before a preview can be shown!", "");
        }
    }

    function evAddCardToCardset(e) {
        e.preventDefault();

        let cSetName = UtilModule.getSelectOptionByName("available-cardsets");
        let card = getCardFromInput();
        console.log(card);
        DataModule.pAddCardToCardset(card, cSetName)
            .then(msg => {
                    resetForm();
                    DataModule.storageClearPictureData();
                    GuiModule.showToast(msg, "")
                }
            ).catch(err => {
                GuiModule.showToast(err, "")
            }
        );
    }

    function evClearLoadedImage(e) {
        e.preventDefault();
        DataModule.storageClearPictureData();
        updateImageSpan();
    }

    return {
        init: init,
        updateImageSpan: updateImageSpan,
        getCardFromInput: getCardFromInput,
    }


})();

$(document).ready(function () {
    addCardModule.init();
});

$(window).on("beforeunload", function () {
    DataModule.storageClearPictureData();
    return undefined; // to prevent unload dialogue message
});