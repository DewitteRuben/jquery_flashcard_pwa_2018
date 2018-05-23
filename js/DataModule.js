let DataModule = function () {

    const STORAGE = {
        STORE: "cardStorage",
        CARDSETS: "cardSets",
    };

    const KEYS = {
        PICTURE: "cardPicture",
        GAME: "currentGame",
        CARD: "editCard",
    };

    var store = localforage.createInstance({
        name: STORAGE.STORE
    });

    (function initCardSets() {
        store.getItem(STORAGE.CARDSETS, function (err, value) {
            if (!err && value === null) {
                store.setItem(STORAGE.CARDSETS, new Map());
            }
        });
    }());

    function rebuildCardSetMap(cardMap) {
        return function (cardSet, key) {
            let rebuiltCardSet = Object.assign(new DomainModule.CardSet, cardSet);
            rebuiltCardSet.cards = rebuiltCardSet.cards.map(c => Object.assign(new DomainModule.Card, c));
            cardMap.set(key, rebuiltCardSet);
        }
    }

    function getAllCardSets(cb) {
        store.getItem(STORAGE.CARDSETS, function (err, cardMap) {
            if (err === null) {
                cardMap.forEach(rebuildCardSetMap(cardMap));
                cb(cardMap, null);
            } else {
                cb(err, true);
            }
        });
    }


    function pGetAllCardsets() {
        return store.getItem(STORAGE.CARDSETS).then(function (result) {
            result.forEach(rebuildCardSetMap(result));
            return result;
        }).catch(function (err) {
            return Promise.reject(err);
        })
    }

    function updateNameAndCategory(oldName, newCardset) {
        return function (cardMap) {
            if (!newCardset.isValid()) return Promise.reject("Please enter a valid name and category!");
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

    function pUpdateCardInCardset(card, cardsetName) {
        return pGetCardset(cardsetName).then(function (cardset) {
            let oldCard = cardset.cards.filter(c => c.id === card.id)[0];
        })
    }

    function pSetCardsetMap(map) {
        return store.setItem(STORAGE.CARDSETS, map);
    }

    function pRenameExistingCardset(oldName, newName) {
        pGetAllCardsets().then(function (result) {
            console.log(result);
        })
    }


    function addCardToCardSet(card, cardsetName, cb) {
        getCardSet(cardsetName, function (cardset, err) {
            if (err) {
                cb(err, true);
            } else {
                card.id = cardset.name + "-" + cardset.cards.length;
                cardset.addCard(card);
                addUpdateCardSet(cardset, function (result) {
                    cb(cardset, null);
                });
            }
        })
    }

    function pAddUpdateCardset(cardset) {
        return pGetAllCardsets().then(function (map) {
            map.set(cardset.name, cardset);
            store.setItem(STORAGE.CARDSETS, map);
            return Promise.resolve(`Successfully added the ${cardset.name} cardset!`);
        }).catch(function (err) {
            return Promise.reject("Failed to add cardset to the database!");
        })
    }

    function isCardsetEqual(a, b) {
        return UtilModule.isEqualToCaseInsensitive(a.name, b.name);
    }


    function pAddCardset(newCardset) {
        return pGetAllCardsets().then(function (cardsetMap) {
            if (!newCardset.isValid())
                return Promise.reject("The cardset name or category is not valid!");
            let cardsets = cardsetMap.values();
            for (let cardset of cardsets) {
                if (isCardsetEqual(cardset, newCardset))
                    return Promise.reject("A cardset with the same name already exists!");
            }
            return newCardset;
        }).then(uniqueCardset => pAddUpdateCardset(uniqueCardset)).catch(err => Promise.reject(err));
    }

    function addUpdateCardSet(cardSet, cb) {
        getAllCardSets(function (cardMap, err) {
            if (err) {

            } else {
                cardMap.set(cardSet.name, cardSet);
                console.log(cardMap);
                store.setItem(STORAGE.CARDSETS, cardMap, cb);
            }
        })
    }

    function pDeleteCardFromCardset(cardID) {
        let cardsetName = cardID.split("-")[0];
        return pGetCardset(cardsetName).then(function (cardset) {
            cardset.cards = cardset.cards.filter(c => c.id !== cardID);
            return cardset;
        }).then(function (cardset) {
            return pAddUpdateCardset(cardset);
        }).catch(function (err) {
            return new Promise.reject("Failed to delete card from cardset!");
            // return new Promise.reject(err);
        });
    }

    function deleteCardSet(key, cb) {
        getAllCardSets(function (cardMap, err) {
            if (err) {

            } else {
                cardMap.delete(key);
                store.setItem(STORAGE.CARDSETS, cardMap, cb);
            }
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
                return Promise.reject("The details entered were not valid!");
            card.id = cardset.name + "-" + cardset.cards.length;
            cardset.addCard(card);
            return cardset;
        }).then(function(cardset) {
            return pAddUpdateCardset(cardset);
        }).catch((err) => Promise.reject("Failed to add card to cardset!"))
    }

    function pGetCardset(key) {
        return pGetAllCardsets()
            .then((result) => result.get(key) ? result.get(key) : null)
            .catch((err) => Promise.reject("Failed to get card from the database!"));
    }

    function getCardSet(key, cb) {
        getAllCardSets(function (cardSet, err) {
            if (err) {
                cb(err, true);
            } else {
                cb(cardSet.get(key), null);
            }
        });
    }

    function pUpdateCategoryAndNameCardset(newCategory, newName) {

    }

    function postData(url) {
        // Default options are marked with *
        return fetch(url, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
            .then(response => response.json()) // parses response to JSON
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

    function pgetCardByID(cardID) {
        let cardsetID = cardID.split("-")[0];
        return pGetCardset(cardsetID).then(function (result) {
            return result.cards.filter(c => c.id === cardID)[0];
        });
    }

    function clearPictureData() {
        return store.removeItem(KEYS.PICTURE);
    }

    function getPictureData() {
        return store.getItem(KEYS.PICTURE);
    }

    function ensureUniqueCategoryEntry(cardsetName, category) {
        return function (map) {
            for (let [key, value] of map) {
                let cardset = value;
                if (UtilModule.isEqualToCaseInsensitive(cardset.name, cardsetName))
                    return Promise.reject("A cardset with that name already exists!");
                if (UtilModule.isEqualToCaseInsensitive(category, cardset.category)) {
                    category = cardset.category;
                }
            }
            return new DomainModule.CardSet(cardsetName, category);
        }
    }

    function startCurrentGame(cardsetName) {
        return pGetCardset(cardsetName.toString()).then(function (result) {
            if (result.cards.length === 0) {
                return Promise.reject(`Cardset ${cardsetName} has no cards!`);
            }
            return cardsetName;
        }).then(result => store.setItem(KEYS.GAME, cardsetName.toString()));
    }

    function clearCurrentGame() {
        return store.removeItem(KEYS.GAME);
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

    return {
        getAllCardSets: getAllCardSets,
        addUpdateCardSet: addUpdateCardSet,
        getCardSet: getCardSet,
        addCardToCardSet: addCardToCardSet,
        deleteCardSet: deleteCardSet,
        postData: postData,
        pFileReader: pFileReader,
        savePicture: savePicture,
        clearPictureData: clearPictureData,
        getPictureData: getPictureData,
        pSetCardsetMap: pSetCardsetMap,
        startCurrentGame: startCurrentGame,
        clearCurrentGame: clearCurrentGame,
        getCurrentGame: getCurrentGame,
        pDeleteCardFromCardset: pDeleteCardFromCardset,
        setCurrentCard: setCurrentCard,
        pgetCardByID: pgetCardByID,
        pGetAllCardsets: pGetAllCardsets,
        getCurrentCard: getCurrentCard,
        pUpdateCardset: pUpdateCardset,
        pAddCardToCardset:pAddCardToCardset,
        pGetCardset: pGetCardset,
        pAddCardset:pAddCardset,
        pDeleteCardset: pDeleteCardset,
        pUpdateCardInCardset: pUpdateCardInCardset,
        pAddUpdateCardset: pAddUpdateCardset,
        ensureUniqueCategoryEntry: ensureUniqueCategoryEntry
    }
}();