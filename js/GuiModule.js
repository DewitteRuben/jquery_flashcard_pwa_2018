
"use strict";

let GuiModule = function () {

    let MESSAGES = {
        CHOOSE_CARDSET: "Choose a cardset",
        NO_CARDSETS: "No cardsets have been created yet!",
        FRONT: "FRONT",
        BACK: "BACK",
        OFFLINE:"Currently working offline!"
    };


    function loadingSpinner() {
        return $(`<div class="preloader-background">
        <div class="preloader-wrapper active">
            <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div>
                <div class="gap-patch">
                    <div class="circle"></div>
                </div>
                <div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
            </div>
        </div>
    </div>`);
    }

    function showModal(id, content, btn1, btn2) {
        let contentString = `<div id="${id}" class="modal">
                    <div class="modal-content">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <a href="#/" id="modal-${id}-${btn1}" class="modal-close waves-effect waves-green btn-flat btn1">${btn1}</a>
                        <a href="#/" id="modal-${id}-${btn2}" class="modal-close waves-effect waves-green btn-flat btn2">${btn2}</a>
                    </div>
                </div>`;
        $("body").append($(contentString));
    }

    function generateModal(id, content, btn1, btn2, btn2ClickHandler) {
        GuiModule.showModal(id, content, btn1, btn2);
        $(`#modal-${id}-${btn2}`).on("click", btn2ClickHandler);
        let $modal = $(`#${id}`);
        M.Modal.init($modal[0], {"onCloseEnd": removeModalOnClose, "preventScrolling": true});
        $modal.modal("open");
    }


    function object2options(object) {
        let HTMLString = "";
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                HTMLString += `<option value="${key}">${object[key]}</option>`
            }
        }
        return HTMLString;
    }


    function populateRadioAnswers(card) {
        $(".radioAnswerButtons").html(answer2radiobtns(card));
    }

    function answer2radiobtns(card) {
        let HTMLString = "";
        if (card.isMultipleChoice()) {
            card.answerChoices.forEach(function (answer, index) {
                HTMLString += `<label class="btn-block">
                            <input value="${index}" class="with-gap" name="radioAnswer" type="radio" />
                            <span>${answer}</span>
                        </label>`;
            });
        }
        return HTMLString;
    }

    function toggleGameUIControls(disable) {
        $(".answerControls").find(".btn").each(function () {
            if (disable)
                $(this).addClass("disabled");
            else
                $(this).removeClass("disabled");
        });
        $("#game-type-answer").prop("disabled", disable);
    }

    let cardTypeToControlClass = {
        "SA": ".singleAnswerControls",
        "TF": ".trueFalseControls",
        "MC": ".multipleChoiceControls",
        "TA": ".typeAnswerControls"
    };

    function switchGameUIControls(card) {
        let $controls = $(".answerControls");
        $controls.find(".control").addClass("hidden");
        $controls.find(cardTypeToControlClass[card.typeAnswer ? "TA" : card.type])
            .removeClass("hidden");
        if (card.type === "MC") {
            populateRadioAnswers(card);
        }
    }

    function setSmileyState(game) {
        let curCard = game.getCurrentCard();
        let $smiley = $(".smiley");
        $smiley.removeClass("faint-black")
            .removeClass("green-text")
            .removeClass("red-text");

        let color = "faint-black";
        let state = "sentiment_neutral";
        if (game.hasBeenAnswered(curCard) && game.hasBeenCorrectlyAnswered(curCard)) {
            state = "sentiment_very_satisfied";
            color = "green-text";
        } else if (game.hasBeenAnswered(curCard)) {
            state = "sentiment_very_dissatisfied";
            color = "red-text";
        }
        $smiley.text(state).addClass(color);

    }

    function cardImage2ImageTag(card) {
        return $(`<img class="card-play-image responsive-img" src="${card.image ? card.image : ""}" alt="${card.title}-image">`);
    }

    function toggleCardImage(game) {
        let card = game.getCurrentCard();
        $(".card-play-image").remove();
        let $cardPlay = $(".card-content");
        if (card.image && game.isFront) {
            $cardPlay.append(cardImage2ImageTag(card));
        }
    }

    function updateGameCardLayout(game) {
        let curCard = game.getCurrentCard();
        $(".card-name").text(curCard.title);
        $(".card-qa").text(game.isFront ? curCard.question : curCard.answer);
        $(".card-side").text(game.isFront ? MESSAGES.FRONT : MESSAGES.BACK);
        $(".gameCardsAnswered").text(`Answered: ${game.getAnsweredCards().length}/${game.cardset.cards.length}`);
        $(".gameCardsCorrectlyAnswered").text(`Correct: ${game.getCorrectCards().length}/${game.cardset.cards.length}`);
        setSmileyState(game);
        toggleGameUIControls(game.hasBeenAnswered(curCard));
        toggleCardImage(game);
        switchGameUIControls(curCard);
    }

    /*-------------------------------------------------------------------------------------------/
     */

    function removeModalOnClose() {
        $(this)[0].$el.remove();
    }

    function showOfflineMessage() {
        if (!sessionStorage.getItem("isOffline")) {
            showToast(MESSAGES.OFFLINE, "");
            sessionStorage.setItem("isOffline", "true");
        }
    }

    function showToast(text, classOpt) {
        M.toast({html: text, classes: classOpt})
    }

    return {
        updateGameCardLayout: updateGameCardLayout,
        showModal: showModal,
        object2options: object2options,
        showToast: showToast,
        populateRadioAnswers: populateRadioAnswers,
        generateModal: generateModal,
        loadingSpinner: loadingSpinner,
    }

}();

$(document).ready(function () {
});