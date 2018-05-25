// // function deleteCardSet(e) {
// //     let cardsetName = $(this).parent().data("name").toString();
// //     let content = `<p>Are you sure you wish to delete the cardset ${cardsetName}?</p>`;
// //     GuiModule.generateModal("deleteCardsetModal", content, "Decline", "Confirm", deleteCardsetModalHandler(cardsetName));
// // }
// //
// // function deleteCardsetModalHandler(cardsetName) {
// //     return function () {
// //         DataModule.pDeleteCardset(cardsetName).then((result) => {
// //             populateCardSetULCollection();
// //         }).catch(err => GuiModule.showToast(err, ""));
// //     }
// // }
//
// function populateCardSetULCollection() {
//     GuiModule.populateCollectionWithCardsets($(".collection-cardsets"));
// }
//

let addCardsetModule = (function () {

    let MESSAGES = {
        NO_CARDSETS: "No cardsets have been created yet!",
    };

    let URL= {
        ADD_CARD_PAGE:"addcard.html"
    };


    function init() {
        populateCollectionWithCardsets();
        $(".form-add-cardset").on("submit", evAddCardset);
        $(".collection-cardsets").on("click", ".delete-cardset", evShowDeleteCardsetModal)
            .on("click", ".edit-cardset", evShowEditCardsetModal)
            .on("click", ".add-card-cardset", evAddCardToCardset);
        $(".link-check-form").on("click", evTriggerSubmit);
    }

    function populateCollectionWithCardsets() {
        DataModule.pGetAllCardsets().then(cardsetMap =>
            $(".collection-cardsets").html(cardsetMap2collection(cardsetMap)));
    }


    function cardset2CollectionItem(cardset) {
        return `<li class="collection-item" data-cardset="${cardset.name}" data-category="${cardset.category}">
                <a href="#/" class="secondary-content faint-black delete-cardset"><i class="material-icons">delete</i>
                <a href="#/" class="secondary-content faint-black edit-cardset"><i class="material-icons">edit</i></a>
                <div class="relative">
                    <p>Name: ${cardset.name}</p>
                    <p>Category: ${cardset.category}</p>
                    <p>Card${cardset.cards.length > 1 || cardset.cards.length === 0 ? "s" : ""}: ${cardset.cards.length}</p>
                    <a href="#/" class="add-card-cardset faint-black "><i class="material-icons">add</i></a>
                </div>
                </li>`;
    }

    function cardsetMap2collection(cardsetMap) {
        let HTMLString = cardsetMap.size !== 0 ? `<li class="collection-header grey lighten-3"><header>Cardsets</header></li>` :
            `<li class="collection-item">${MESSAGES.NO_CARDSETS}</li>`;
        let cardsets = Array.from(cardsetMap.values()).sort(UtilModule.cardsetNameComparator);
        cardsets.forEach((cardset) => HTMLString += cardset2CollectionItem(cardset));
        return HTMLString;
    }

    function deleteCardsetByID(cardsetName) {
        return function (e) {
            DataModule.pDeleteCardset(cardsetName)
                .then(populateCollectionWithCardsets);
        }
    }

    function evShowDeleteCardsetModal(e) {
        e.preventDefault();
        e.stopPropagation();
        let cardsetName = $(this).parent().data("cardset").toString();
        let content = `<p>Are you sure you wish to delete the cardset ${cardsetName}?</p>`;
        GuiModule.generateModal("deleteCardsetModal", content, "Decline", "Confirm", deleteCardsetByID(cardsetName));
    }

    function evAddCardset(e) {
        e.preventDefault();
        let cardsetName = $("#cardset_name").val();
        let cardsetCategory = $("#cardset_category").val();
        let cardset = new DomainModule.CardSet(cardsetName, cardsetCategory);

        DataModule.pAddCardset(cardset)
            .then(msg => GuiModule.showToast(msg, ""))
            .then(populateCollectionWithCardsets)
            .then(e => {
                $(this)[0].reset();
                UtilModule.scrollToBottom();
            })
            .catch(err => GuiModule.showToast(err, ""));
    }

    function evTriggerSubmit(e) {
        e.preventDefault();
        $(".btn-add-cardset").click();
    }

    function evConfirmCardsetEdit(e) {
        e.preventDefault();
        let $newName = $("#cardset-newName");
        let newName = $newName.val();
        let oldName = $newName.data("oldname").toString();
        let newCategory = $("#cardset-newCategory").val();
        let cardset = new DomainModule.CardSet(newName, newCategory);
        DataModule.pUpdateCardset(oldName, cardset).then(e => {
            populateCollectionWithCardsets();
            GuiModule.showToast(e, "");
        }).catch(err => GuiModule.showToast(err, ""));

    }

    function evShowEditCardsetModal(e) {
        e.preventDefault();
        let oldName = $(this).parent().data("cardset").toString();
        let oldCategory = $(this).parent().data("category").toString();

        let id = "editCardsetNameModal";
        let content = `<h5>Cardset ${oldName}</h5>
            <p>Enter a new name:</p>
            <div class="input-field">
                <label class="active" for="newName">New name:</label>
                <input type="text" data-oldName="${oldName}" value="${oldName}" name="cardset-newName" id="cardset-newName">
            </div>
            <div class="input-field">
                <label class="active" for="newName">New category:</label>
                <input  type="text" value="${oldCategory}" name="cardset-newCategory" id="cardset-newCategory">
            </div>`;

        GuiModule.generateModal(id, content, "Decline", "Confirm", evConfirmCardsetEdit);
    }

    function evAddCardToCardset(e) {
        e.preventDefault();
        e.stopPropagation();
        let cardsetName = $(this).parents(".collection-item").data("cardset");
        DataModule.setCurrentEditedCardset(cardsetName);
        window.location.href = URL.ADD_CARD_PAGE;
    }

    return {
        init: init
    }

})();

$(document).ready(function () {
    addCardsetModule.init();
});