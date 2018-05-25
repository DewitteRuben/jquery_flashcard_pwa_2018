let DataModule = function () {

    const STORAGE = {
        STORE: "cardStorage",
        CARDSETS: "cardSets",
    };

    const KEYS = {
        PICTURE: "cardPicture",
        GAME: "currentGame",
        CARD: "editCard",
        SETTINGS:"settings",
        CURRENT_CARDSET:"currentCardset"
    };

    const ERROR = {
        INVALID_NAME_CATEGORY: "Please enter a valid name and category!",
        INVALID_CARDSET: "The cardset name or category is not valid!",
        INVALID_CARD_DETAILS:"The card details are not valid!",
        CARDSET_ALREADY_EXISTS: "A cardset with the same name already exists!",
        CARD_DB_FAIL:"Failed to get card from the database!",
        CARD_ADD_FAIL:"Failed to add card to cardset!",
        CARDSET_ADD_FAIL:"Failed to add cardset to the database!",
        DELETE_CARD_FROM_CARDSET_FAIL:"Failed to delete card from the cardset!",
        STORE_SETTINGS:"Failed to store settings!",
        LOAD_SETTINGS:"Failed to load settings from the database!"
    };

    const MSG = {
        SUCCESSFULLY_SAVED_SETTINGS:"Succesfully saved the settings!",
    }

    var store = localforage.createInstance({
        name: STORAGE.STORE
    });

    function init() {
        store.getItem(STORAGE.CARDSETS).then(function(cardsets) {
            if (!cardsets) {
                console.log("Cardsets storage doesn't exist, creating new storage space...");
                store.setItem(STORAGE.CARDSETS, new Map());
            }
        }).catch(err => Promise.reject(err));
    }

    function rebuildCardSetMap(cardMap) {
        return function (cardSet, key) {
            let rebuiltCardSet = Object.assign(new DomainModule.CardSet, cardSet);
            rebuiltCardSet.cards = rebuiltCardSet.cards.map(c => Object.assign(new DomainModule.Card, c));
            cardMap.set(key, rebuiltCardSet);
        }
    }

    function pGetAllCardsets() {
        return store.getItem(STORAGE.CARDSETS).then(function (result) {
            GuiModule.showToast("trying new vers", "");
            if (!result) return new Map();
            let cardsets = Array.from(result.values());
            cardsets.forEach(rebuildCardSetMap(result));
            return result;
        }).catch(function (err) {
            return Promise.reject(err);
        })
    }

    function updateNameAndCategory(oldName, newCardset) {
        return function (cardMap) {
            if (!newCardset.isValid()) return Promise.reject(ERROR.INVALID_NAME_CATEGORY);
            let tempObj = cardMap.get(oldName);
            cardMap.delete(oldName);
            cardMap.set(newCardset.name, tempObj);
            cardMap.forEach(function (cardset) {
                if (cardset.name === oldName) {
                    cardset.name = newCardset.name;
                    cardset.category = newCardset.category;
                    cardset.cards.forEach(function (card) {
                        card.id = newCardset.name + "-" + card.id.split("-")[1];
                    })
                }
            });
            return cardMap;
        };
    }

    function pUpdateCardset(oldName, newCardset) {
        return pGetAllCardsets()
            .then(updateNameAndCategory(oldName, newCardset))
            .then(m => pSetCardsetMap(m))
            .then(e => Promise.resolve(`Successfully edited the cardset ${oldName}!`))
            .catch(e => Promise.reject(`Failed to update name and category of the cardset ${oldName}`));
    }

    function pSetCardsetMap(map) {
        return store.setItem(STORAGE.CARDSETS, map);
    }

    function pAddUpdateCardset(cardset) {
        return pGetAllCardsets().then(function (map) {
            map.set(cardset.name, cardset);
            store.setItem(STORAGE.CARDSETS, map);
            return Promise.resolve(`Successfully added the ${cardset.name} cardset!`);
        }).catch(function (err) {
            return Promise.reject(ERROR.CARDSET_ADD_FAIL);
        })
    }

    function isCardsetEqual(a, b) {
        return UtilModule.isEqualToCaseInsensitive(a.name, b.name);
    }


    function pAddCardset(newCardset) {
        return pGetAllCardsets().then(function (cardsetMap) {
            if (!newCardset.isValid())
                return Promise.reject(ERROR.INVALID_CARDSET);
            let cardsets = cardsetMap.values();
            for (let cardset of cardsets) {
                if (isCardsetEqual(cardset, newCardset))
                    return Promise.reject(ERROR.CARDSET_ALREADY_EXISTS);
            }
            return newCardset;
        }).then(uniqueCardset => pAddUpdateCardset(uniqueCardset)).catch(err => Promise.reject(err));
    }

    function pDeleteCardFromCardset(cardID) {
        let cardsetName = cardID.split("-")[0];
        return pGetCardset(cardsetName).then(function (cardset) {
            cardset.cards = cardset.cards.filter(c => c.id !== cardID);
            return cardset;
        }).then(function (cardset) {
            return pAddUpdateCardset(cardset);
        }).catch(function (err) {
            return Promise.reject(ERROR.DELETE_CARD_FROM_CARDSET_FAIL);
        });
    }

    function pDeleteCardset(key) {
        return pGetAllCardsets().then(function (result) {
            result.delete(key);
            store.setItem(STORAGE.CARDSETS, result);
            return result;
        });
    }

    function pAddCardToCardset(card, cardsetName) {
        return pGetCardset(cardsetName).then(function (cardset) {
            if (!card.isValid())
                return Promise.reject(ERROR.INVALID_CARD_DETAILS);
            card.id = cardset.name + "-" + cardset.cards.length;
            cardset.addCard(card);
            return cardset;
        }).then(function (cardset) {
            return pAddUpdateCardset(cardset);
        }).catch((err) => Promise.reject(ERROR.CARD_ADD_FAIL));
    }

    function pGetCardset(key) {
        return pGetAllCardsets()
            .then((result) => result.get(key) ? result.get(key) : null)
            .catch((err) => Promise.reject(ERROR.CARD_DB_FAIL));
    }

    function postData(url) {
        return fetch(url, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
        }).then(response => response.json());
    }

    function savePicture(base64url) {
        return store.setItem(KEYS.PICTURE, base64url);
    }

    function pFileReader(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (event) => {
                file.data = event.target.result;
                resolve(file);
            };

            reader.onerror = () => {
                return reject(this);
            };

            if (/^image/.test(file.type)) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    function clearPictureData() {
        return store.removeItem(KEYS.PICTURE);
    }

    function getPictureData() {
        return store.getItem(KEYS.PICTURE);
    }

    function startCurrentGame(cardsetName) {
        return pGetCardset(cardsetName.toString()).then(function (result) {
            if (result.cards.length === 0) {
                return Promise.reject(`Cardset ${cardsetName} has no cards!`);
            }
            return cardsetName;
        }).then(result => store.setItem(KEYS.GAME, cardsetName.toString()));
    }

    function getCurrentGame() {
        return store.getItem(KEYS.GAME);
    }

    function setCurrentCard(cardID) {
        return store.setItem(KEYS.CARD, cardID);
    }

    function getCurrentCard() {
        return store.getItem(KEYS.CARD);
    }

    function getSettings() {
        if (window.localStorage)
            return JSON.parse(localStorage.getItem(KEYS.SETTINGS));
        return null;
    }

    function saveSettings(settings) {
        if (window.localStorage) {
            localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
            GuiModule.showToast("Successfully saved settings!", "");
        } else
            GuiModule.showToast("Settings are not supported by your browser!", "");
    }

    function setCurrentEditedCardset(cardsetName) {
        sessionStorage.setItem(KEYS.CURRENT_CARDSET, cardsetName);
    }

    return {
        postData: postData,
        pGetCardset: pGetCardset,
        pFileReader: pFileReader,
        savePicture: savePicture,
        clearPictureData: clearPictureData,
        getPictureData: getPictureData,
        startCurrentGame: startCurrentGame,
        getCurrentGame: getCurrentGame,
        pDeleteCardFromCardset: pDeleteCardFromCardset,
        pGetAllCardsets: pGetAllCardsets,
        getCurrentCard: getCurrentCard,
        pUpdateCardset: pUpdateCardset,
        pAddCardToCardset: pAddCardToCardset,
        pAddCardset: pAddCardset,
        getSettings:getSettings,
        saveSettings:saveSettings,
        setCurrentEditedCardset:setCurrentEditedCardset,
        pDeleteCardset: pDeleteCardset,
        store:store,
        init:init
    }
}();

$(document).ready(function() {
    DataModule.init();
});