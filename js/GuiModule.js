let GuiModule = function () {

    let MESSAGES = {
        CHOOSE_CARDSET: "Choose a cardset",
        NO_CARDSETS: "No cardsets have been created yet!",
        FRONT: "FRONT",
        BACK: "BACK"
    };

    // function populateCollectionWithCardsets($collection) {
    //     DataModule.pGetAllCardsets().then(cardsetMap => $collection.html(cardsetMap2collection(cardsetMap)));
    // }

    // function populateDynamicAddcardSelects() {
    //     populateSelectWithDatabaseCardset($("select[name='available-cardsets']"));
    //     initTranslateSelect($("#available-languages"));
    // }

    // function populateSelectWithCardsetMap($select, cardsetMap) {
    //     $select.html(cardsetMap2SelectOptions(cardsetMap));
    //     if (sessionStorage.getItem('currentCardset')) {
    //         let cardsetName = sessionStorage.getItem('currentCardset');
    //         $select.find("option").filter(function (index, el) {
    //             if ($(el).val() === cardsetName) {
    //                 $(el).prop("selected", true);
    //             }
    //         });
    //     }
    //     // materialize css library forces you to reinitalize the select
    //     $select.formSelect();
    // }

    // function populateSelectWithDatabaseCardset($select) {
    //     DataModule.getAllCardSets((cardsetMap) => {
    //         populateSelectWithCardsetMap($select, cardsetMap);
    //     });
    // }


    function repopulateCardsetsIndex() {
        populateListAllCards($(".cards"), () => true);
        generateTabsFromCategories($(".tabs"));
        location.reload();
    }


    // function generateTabsFromCategories($tabs) {
    //     DataModule.getAllCardSets(function (cardsetMap, err) {
    //         if (!err) {
    //             let allTabHTML = `<li data-category="ALL" class="tab"><a href="#tab-all">ALL</a></li>`;
    //             let categories = UtilModule.getUniqueValuesOfObjectsInMap(cardsetMap, "category");
    //             let $allTab = $(allTabHTML);
    //             let $generatedTabs = $(categories2tabs(categories));
    //             $tabs.append($allTab).append($generatedTabs);
    //             $('.tabs').tabs();
    //         }
    //     });
    // }

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

    function renameCardsetInMap(oldName, newName, newCategory) {
        return function (cardMap) {
            let tempObj = cardMap.get(oldName);
            cardMap.delete(oldName);
            cardMap.set(newName, tempObj);
            cardMap.forEach(function (cardset) {
                if (cardset.name === oldName) {
                    cardset.name = newName;
                    cardset.category = newCategory;
                    cardset.cards.forEach(function (card) {
                        card.id = newName + "-" + card.id.split("-")[1];
                    })
                }
            });
            return cardMap;
        };
    }

    //$(this).parents(".cardset").data("cardset");

    // function deleteCardsetPredicate(cardsetName, home) {
    //     let content = `<p>Are you sure you wish to delete the cardset ${cardsetName}?</p>`;
    //     GuiModule.generateModal("deleteCardsetModal", content, "Decline", "Confirm", deleteCardsetModalHandler(cardsetName, home));
    // }

    // function homeDeleteCardsetHandler(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     let cardsetName = $(this).parents(".cardset").data("cardset").toString();
    //     deleteCardsetPredicate(cardsetName, true);
    // }

    // function deleteCardsetHandler(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     let cardsetName = $(this).parent().data("cardset").toString();
    //     deleteCardsetPredicate(cardsetName, false);
    // }


    // function deleteCardsetModalHandler(cardsetName, home) {
    //     return function () {
    //         DataModule.pDeleteCardset(cardsetName).then((result) => {
    //             if (home)
    //                 populateListAllCards($(".cards"), () => true);
    //             else
    //                 populateCardSetULCollection();
    //         }).catch(err => GuiModule.showToast(err, ""));
    //     }
    // }
    //
    //
    // function confirmCardsetNameChangePredicate(oldName, home) {
    //     return function (e) {
    //         e.preventDefault();
    //         let newName = $("#cardset-newName").val();
    //         let newCategory = $("#cardset-newCategory").val();
    //         if (!UtilModule.isEmpty(newName) && !UtilModule.isEmpty(newCategory)) {
    //             DataModule.pGetAllCardsets()
    //                 .then(renameCardsetInMap(oldName, newName, newCategory))
    //                 .then(map => DataModule.pSetCardsetMap(map))
    //                 .then(e => {
    //                     if (home) repopulateCardsetsIndex(); else populateCardSetULCollection();
    //                 });
    //         } else {
    //             GuiModule.showToast("Please enter a valid name and category!", "");
    //         }
    //     }
    // }
    //
    //
    // function showEditCardsetPredicate(oldName, oldCategory, home) {
    //     let id = "editCardsetNameModal";
    //     let title = `Cardset ${oldName}`;
    //     let content = `<h5>${title}</h5>
    //         <p>Enter a new name:</p>
    //         <div class="input-field">
    //             <label class="active" for="newName">New name:</label>
    //             <input type="text" value="${oldName}" name="cardset-newName" id="cardset-newName">
    //         </div>
    //         <div class="input-field">
    //             <label class="active" for="newName">New category:</label>
    //             <input  type="text" value="${oldCategory}" name="cardset-newCategory" id="cardset-newCategory">
    //         </div>`;
    //
    //     generateModal(id, content, "Decline", "Confirm", confirmCardsetNameChangePredicate(oldName, home));
    // }

    // function showEditCardsetNameModal(e) {
    //     let oldName = $(this).parent().data("cardset");
    //     let oldCategory = $(this).parent().data("category");
    //     showEditCardsetPredicate(oldName, oldCategory, false);
    // }
    //
    // function showHomeEditCardsetNameModal(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     let oldName = $(this).parents(".cardset").data("cardset");
    //     let oldCategory = $(this).parents(".cardset").data("category");
    //     showEditCardsetPredicate(oldName, oldCategory, true);
    // }

    function generateModal(id, content, btn1, btn2, btn2ClickHandler) {
        GuiModule.showModal(id, content, btn1, btn2);
        $(`#modal-${id}-${btn2}`).on("click", btn2ClickHandler);
        let $modal = $(`#${id}`);
        M.Modal.init($modal[0], {"onCloseEnd": removeModalOnClose});
        $modal.modal("open");
    }

    function cardsetMap2collection(cardsetMap) {
        let HTMLString = cardsetMap.size !== 0 ? `<li class="collection-header grey lighten-3"><header>Cardsets</header></li>` :
            `<li class="collection-item">${MESSAGES.NO_CARDSETS}</li>`;
        cardsetMap.forEach(function (cardset) {
            HTMLString += `<li class="collection-item" data-cardset="${cardset.name}" data-category="${cardset.category}">
                <a href="#/" class="secondary-content faint-black delete-cardset"><i class="material-icons">delete</i>
                <a href="#/" class="secondary-content faint-black edit-cardset"><i class="material-icons">edit</i></a>
                <div>
                    <p>Name: ${cardset.name}</p>
                    <p>Category: ${cardset.category}</p>
                    <p>Card${cardset.cards.length > 1 || cardset.cards.length === 0 ? "s" : ""}: ${cardset.cards.length}</p>
                </div>
                </li>`;
        });
        return HTMLString;
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

    // function initTranslateSelect($select) {
    //     TranslateModule.getAllAvailableLanguages().then(function (result) {
    //         $select.html(object2options(result.langs)).formSelect();
    //     });
    // }

    function cardsetMap2SelectOptions(cardsetMap) {
        let HTMLString = "";
        HTMLString += cardsetMap.size !== 0 ? "" : `<option value="" disabled selected>${MESSAGES.NO_CARDSETS}</option>`;
        cardsetMap.forEach(function (cardset) {
            HTMLString += `<option value="${cardset.name}">${cardset.name} (${cardset.cards.length} cards)</option>`;
        });
        return HTMLString;
    }

    // function populateListAllCards($cards, fFilter) {
    //     DataModule.getAllCardSets(function (cardsetMap, err) {
    //         if (err) {
    //
    //         } else {
    //             populateCardsList($cards, cardsetMap, fFilter);
    //         }
    //     })
    // }

    function bindCardsetEventHandlers() {
        $(".collapsible").collapsible();
        $(".collapsible-header").on("click", toggleHide);
        $(".home-add-cardset")
            .on("click", headerAddCardCardset)
            .next()
            .on("click", showHomeEditCardsetNameModal)
            .next()
            .on("click", homeDeleteCardsetHandler)
            .next()
            .on("click", headerPlayCardset);
    }


    function headerPlayCardset(e) {
        e.stopPropagation();
        let cardSetName = $(this).parents("section").data("cardset");
        DataModule.startCurrentGame(cardSetName).then(function (result) {
            window.location.href = "cardgame.html";
        }).catch(err => GuiModule.showToast(err, ""));
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
        return $(`<img class="card-play-image" src="${card.image ? card.image : ""}" alt="${card.title}-image">`);
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


        // TODO display for example with color that card was answered correctly
    }

    /*-------------------------------------------------------------------------------------------/
     */



    function headerAddCardCardset(e) {
        e.preventDefault();
        e.stopPropagation();
        let cardsetName = $(this).parents("section").data("cardset");
        sessionStorage.setItem("currentCardset", cardsetName);
        $(".nav-addcard").click();
    }

    function removeModalOnClose() {
        $(this)[0].$el.remove();
    }


    function previewCard(card) {
        let id = "previewModal";
        let modalContent = `<h4>Preview</h4>
                        ${card.render()}`;
        GuiModule.showModal("previewModal", modalContent, "Close", "Close");
        let $modal = $(`#${id}`);
        M.Modal.init($modal[0], {
            "onCloseEnd": function () {
                $(this)[0].$el.remove();
            }
        });
        $modal.modal("open");
    }

    function headerDeleteCardset(e) {
        e.stopPropagation();
    }

    function showToast(text, classOpt) {
        M.toast({html: text, classes: classOpt})
    }

    return {
        updateGameCardLayout: updateGameCardLayout,
        showModal: showModal,
        object2options:object2options,
        showToast: showToast,
        previewCard: previewCard,
        populateRadioAnswers: populateRadioAnswers,
        generateModal: generateModal,
    }

}();

$(document).ready(function () {
});