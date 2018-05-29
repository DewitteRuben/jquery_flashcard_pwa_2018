import {CardSet} from "../domain";
import {
    pGetAllCardsets,
    pDeleteCardFromCardset,
    pDeleteCardset,
    pRenameCardset,
    pGetCardByID,
    setCurrentEditedCardset, startCurrentGame
} from "../data";
import {showToast, loadingSpinner, generateModal} from "../gui";
import {getUniqueValuesOfObjectsInMap, cardsetNameComparator, isEmpty, fDefault} from "../utilities";

const CATEGORY = {
    ALL: "ALL"
};

const HTML = {
    LI_ALL_TAB: `<li data-category="ALL" class="tab"><a href="#tab-all">ALL</a></li>`,
    UL_EMPTY_CARDSET: `<ul class="collection with-header collection-cardsets">
                <li class="center collection-item">No cardsets have been created yet, tap the <i class="material-icons">create_new_folder</i> button to add a cardset!<li>
                <li class="center sick-blue"><a style="display:block; padding-top: 5px;"class="white-text" href="addcardset.html">
                    <i class="material-icons">create_new_folder</i>
                        </a></li>
                </ul>`,
    ADD_CARDSET_BUTTON: `<section>
                <ul class="collapsible">
                    <li class="collection-item center-align sick-blue"><a style="display:block; padding-top: 5px;"class="white-text" href="addcardset.html">
                    <i class="material-icons">create_new_folder</i>
                        </a></li>
                </ul>
                </section>`
};

const URL = {
    GAME_PAGE: "cardgame.html",
    ADD_CARD_PAGE: "addcard.html"
};

export function init() {
    let $tabs = $(".tabs");
    let $cards = $(".cards");
    initCardsetsList($cards, CATEGORY.ALL);
    initCategoryTabs($tabs);
    $tabs.on("click", ".tab", evChangingTabs);
    $cards.on("click", ".delete-card-collection-item", evTriggerCardDelete);
    $cards.on("click", ".edit-card-collection-item", evTriggerCardEdit);
    $cards.on("click", ".image-card-collection-item", evShowImageModal);
}

function initCategoryTabs() {
    pGetAllCardsets()
        .then(cardsetCategories2TabElements)
        .then(populateTabsElementWithTabs)
        .catch(err => console.log(err, ""));
}

function populateTabsElementWithTabs($filteredTabs) {
    let $allTab = $(HTML.LI_ALL_TAB);

    let $tabs = $('.tabs');
    if ($tabs.hasClass("initalized")) {
        $tabs.removeClass("initalized");
        $tabs.tabs("destroy");
    }

    $tabs
        .html("")
        .append($allTab)
        .append($filteredTabs)
        .addClass("initalized")
        .tabs()
        .tabs("select", "tab-all");
}


function cardsetCategories2TabElements(cardsetMap) {
    let categories = getUniqueValuesOfObjectsInMap(cardsetMap, "category").sort();
    return $(categories2tabs(categories));
}

function categories2tabs(cArray) {
    return cArray.map(c => `<li data-category="${c}" class="tab"><a href="#tab-filtered">${c}</a></li>`).join("");
}


function cardsetMap2CardsetArrByCategory(category) {
    return function (cardsetMap) {
        let values = Array.from(cardsetMap.values());
        return values.filter(cardsetIsOfCategory(category)).sort(cardsetNameComparator);
    }
}

function arrByCategory2HTMLString(filteredCardsets) {
    return filteredCardsets.map(cs => cs.render()).join("");
}


function populateCardsetsList($list) {
    return function (HTMLString) {
        if (!isEmpty(HTMLString)) {
            HTMLString += HTML.ADD_CARDSET_BUTTON;
            $list.html(HTMLString);
        } else {
            $(".cards").html(HTML.UL_EMPTY_CARDSET);
            $(".cards-filtered").html("");
        }
    }
}

function cardsetIsOfCategory(category) {
    return function (cardset) {
        return cardset.category === category || category === CATEGORY.ALL;
    }
}

function deleteCardByID(cardID) {
    return function (e) {
        pDeleteCardFromCardset(cardID)
            .then(e => init())
            .catch(err => showToast(err, ""));
    }
}

function deleteCardsetByID(cardsetName) {
    return function (e) {
        pDeleteCardset(cardsetName)
            .then(e => init());
    }
}


function showLoadingCircle(cardsetMap) {
    $(".card-view").addClass("hidden");
    $("main .row").append(loadingSpinner());
    return cardsetMap;
}

function fadeOutLoadingCircle() {
    $(".preloader-background").fadeOut("slow", function () {
        $(".card-view").removeClass("hidden");
        $(this).remove();
    });
}


function initCardsetsList($list, category) {
    pGetAllCardsets()
        .then(showLoadingCircle)
        .then(cardsetMap2CardsetArrByCategory(category))
        .then(arrByCategory2HTMLString)
        .then(populateCardsetsList($list))
        .then(bindCardsetEventHandlers)
        .then(fadeOutLoadingCircle)
        .catch(err => console.log(err));
}

function headerAddCardCardset(e) {
    e.preventDefault();
    e.stopPropagation();
    let cardsetName = $(this).parents("section").data("cardset");
    setCurrentEditedCardset(cardsetName);
    window.location.href = URL.ADD_CARD_PAGE;
}

function showEditCardsetModal(oldName, oldCategory) {
    let id = "editCardsetNameModal";
    let content = `<h5>Cardset ${oldName}</h5>
            <p>Enter a new name:</p>
            <div class="input-field">
                <label class="active" for="newName">New name:</label>
                <input type="text" value="${oldName}" name="cardset-newName" id="cardset-newName">
            </div>
            <div class="input-field">
                <label class="active" for="newName">New category:</label>
                <input  type="text" value="${oldCategory}" name="cardset-newCategory" id="cardset-newCategory">
            </div>`;
    generateModal(id, content, "Decline", "Confirm", evConfirmCardsetNameChangePredicate(oldName), fDefault);
}


function evShowEditCardsetModal(e) {
    e.preventDefault();
    e.stopPropagation();
    let oldName = $(this).parents(".cardset").data("cardset");
    let oldCategory = $(this).parents(".cardset").data("category");
    showEditCardsetModal(oldName, oldCategory);
}

function showDeleteCardModal(cardID, cardTitle) {
    let modalContent = `<h5>${cardTitle}</h5>
        <p>Are you sure you want to delete the card "${cardTitle}" from the cardset "${cardID.split("-")[0]}"?</p>`;
    generateModal("deleteModal", modalContent, "Decline", "Confirm", deleteCardByID(cardID));
}

function evShowDeleteCardsetModal(e) {
    e.preventDefault();
    e.stopPropagation();
    let cardsetName = $(this).parents(".cardset").data("cardset").toString();
    let content = `<p>Are you sure you wish to delete the cardset ${cardsetName}?</p>`;
    generateModal("deleteCardsetModal", content, "Decline", "Confirm", deleteCardsetByID(cardsetName), fDefault);
}


function evInitNewGame(e) {
    e.preventDefault();
    e.stopPropagation();
    let cardSetName = $(this).parents("section").data("cardset");
    startCurrentGame(cardSetName).then((result) => {
        window.location.href = URL.GAME_PAGE;
    }).catch(err => showToast(err, ""));
}

function bindCardsetEventHandlers() {
    $(".collapsible").collapsible();
    $(".collapsible-header").off().on("click", evToggleHide);
    $(".home-add-cardset").off().on("click", headerAddCardCardset)
        .next().off().on("click", evShowEditCardsetModal)
        .next().off().on("click", evShowDeleteCardsetModal)
        .next().off().on("click", evInitNewGame);
}

function evToggleHide(e) {
    e.preventDefault();
    $(this).toggleClass("closed");
    $(this).find("a.home-hide-cardset")
        .find("i")
        .text($(this).hasClass("closed") ? "arrow_drop_down" : "arrow_drop_up");
}


function evConfirmCardsetNameChangePredicate(oldName) {
    return function (e) {
        e.preventDefault();
        let newName = $("#cardset-newName").val();
        let newCategory = $("#cardset-newCategory").val();
        let cardset = new CardSet(newName, newCategory);
        pRenameCardset(oldName, cardset).then(
            e => {
                initCardsetsList($(".cards"), CATEGORY.ALL);
                initCategoryTabs($(".tabs"));
            }
        ).catch(err => showToast(err, ""));
    }
}


function evTriggerCardDelete(e) {
    e.preventDefault();
    let cardID = $(this).parent().attr("id");
    let cardTitle = $(this).siblings(".card-content").find(".card-title").text();
    console.log(cardID, cardTitle);
    showDeleteCardModal(cardID, cardTitle);
}


function evChangingTabs(e) {
    e.preventDefault();
    let category = $(this).data("category");
    initCardsetsList($(".cards-filtered"), category);
}


function evShowImageModal(e) {
    e.preventDefault();
    let cardID = $(this).parent().data("card");
    pGetCardByID(cardID).then(function (card) {
        return card.image;
    }).then(function (imageFile) {
        let modalContent = `<img class="responsive-img" src="${imageFile.data}" alt="card-image" title="card-image"/>`;
        generateModal("imageModal", modalContent, "", "Close", fDefault, fDefault);
    }).catch(function (err) {
        showToast(err, "");
    })
}


function evTriggerCardEdit(e) {
    e.preventDefault();
    let cardID = $(this).parent().attr("id");
    pGetCardByID(cardID).then(function (card) {
        sessionStorage.setItem("editingCard", JSON.stringify(card));
        return card;
    }).then(function (card) {
        window.location.href = URL.ADD_CARD_PAGE;
    }).catch(err => showToast(err, ""));
}