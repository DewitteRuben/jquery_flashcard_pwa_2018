import {isEqualToCaseInsensitive} from "./utilities";
import {showToast} from "./gui";
import {CardSet, Highscore, Card} from "./domain";
import localforage from "./libraries/localforage.min"


const STORAGE = {
    STORE: "cardStorage",
    CARDSETS: "cardSets",
    HIGHSCORES: "highscores",
};

export const KEYS = {
    PICTURE: "cardPicture",
    GAME: "currentGame",
    CARD: "editCard",
    SETTINGS: "settings",
    USERNAME: "username",
    CURRENT_CARDSET: "currentCardset"
};

const ERROR = {
    INVALID_NAME_CATEGORY: "Please enter a valid name and category!",
    INVALID_CARDSET: "The cardset name or category is not valid!",
    INVALID_CARD_DETAILS: "The card details are not valid!",
    CARDSET_ALREADY_EXISTS: "A cardset with the same name already exists!",
    CARD_DB_FAIL: "Failed to get card from the database!",
    CARD_ADD_FAIL: "Failed to add card to cardset!",
    CARDSET_ADD_FAIL: "Failed to add cardset to the database!",
    DELETE_CARD_FROM_CARDSET_FAIL: "Failed to delete card from the cardset!",
    STORE_SETTINGS: "Failed to store settings!",
    LOAD_SETTINGS: "Failed to load settings from the database!",
    GET_CARD_BY_ID_FAIL: "Failed to get card by ID!",
};

const MSG = {
    SUCCESSFULLY_SAVED_SETTINGS: "Succesfully saved the settings!",
};

var store = localforage.createInstance({
    name: STORAGE.STORE
});

export function init() {
    store.getItem(STORAGE.CARDSETS).then(function (cardsets) {
        if (!cardsets) {
            console.log("Cardsets storage doesn't exist, creating new storage space...");
            return store.setItem(STORAGE.CARDSETS, new Map());
        }
    }).then(function () {
        store.getItem(STORAGE.HIGHSCORES).then(function (highscores) {
            if (!highscores) {
                console.log("Highscores storage spaces doesn't exist, creating storage space...");
                return store.setItem(STORAGE.HIGHSCORES, []);
            }
        })
    }).catch((err) => {
        console.log(err);
        throw Error("Failed to initialize cardset storage space");
    });
}

export function setHighscoresArr(arr) {
    return store.setItem(STORAGE.HIGHSCORES, arr);
}

function rebuildCardSetMap(cardMap) {
    return function (cardSet, key) {
        let rebuiltCardSet = Object.assign(new CardSet, cardSet);
        rebuiltCardSet.cards = rebuiltCardSet.cards.map(c => Object.assign(new Card, c));
        cardMap.set(key, rebuiltCardSet);
    }
}

export function pGetAllCardsets() {
    return store.getItem(STORAGE.CARDSETS).then(function (result) {
        if (!result) return new Map();
        result.forEach(rebuildCardSetMap(result));
        return result;
    }).catch(function (err) {
        throw Error("Failed to retrieve all cardsets!");
    })
}

function updateNameAndCategory(oldName, newCardset) {
    return function (cardMap) {
        if (!newCardset.isValid()) throw Error(ERROR.INVALID_NAME_CATEGORY);
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

export function pUpdateCardset(cardset) {
    return pGetAllCardsets()
        .then(function (cardMap) {
            cardMap.set(cardset.name, cardset);
            return cardMap;
        }).then(m => pSetCardsetMap(m))
        .then(e => Promise.resolve(`Successfully updated the cardset ${cardset.name}!`))
        .catch(e => {
            console.error(e);
            throw Error(`Failed to update the cardset ${cardset.name}!`);
        });
}

export function pRenameCardset(oldName, newCardset) {
    return pGetAllCardsets()
        .then(updateNameAndCategory(oldName, newCardset))
        .then(m => pSetCardsetMap(m))
        .then(e => Promise.resolve(`Successfully edited the cardset ${oldName}!`))
        .catch(e => {
            console.error(e);
            throw Error(`Failed to update name and category of the cardset ${oldName}`);
        });
}

export function pAddHighscore(highscore) {
    return store.getItem(STORAGE.HIGHSCORES).then(function (highscores) {
        if (!highscores)
            throw Error("There is no highscore object in the database!");
        highscores.push(highscore);
        return highscores;
    }).then(function (updatedHighscores) {
        return store.setItem(STORAGE.HIGHSCORES, updatedHighscores);
    }).then(function () {
        return Promise.resolve("Successfully added highscore entry!");
    })
}


export function rebuildHighscores(arr) {
    return arr.map(score => Object.assign(new Highscore, score));
}

export function pGetAllHighscores() {
    return store.getItem(STORAGE.HIGHSCORES).then(function (highscores) {
        return rebuildHighscores(highscores);
    }).catch(function (err) {
        throw Error("Failed to get all highscores!");
    })
}

export function pSetCardsetMap(map) {
    return store.setItem(STORAGE.CARDSETS, map);
}

export function pAddUpdateCardset(cardset) {
    return pGetAllCardsets().then(function (map) {
        map.set(cardset.name, cardset);
        return store.setItem(STORAGE.CARDSETS, map);
    }).then(function () {
        return Promise.resolve(`Successfully added the ${cardset.name} cardset!`);
    }).catch(function (err) {
        throw Error(ERROR.CARDSET_ADD_FAIL);
    })
}

function isCardsetEqual(a, b) {
    return isEqualToCaseInsensitive(a.name, b.name);
}


export function pAddCardset(newCardset) {
    return pGetAllCardsets().then(function (cardsetMap) {
        if (!newCardset.isValid())
            throw Error(ERROR.INVALID_CARDSET);
        let cardsets = cardsetMap.values();
        for (let cardset of cardsets) {
            if (isCardsetEqual(cardset, newCardset)) {
                throw Error(ERROR.CARDSET_ALREADY_EXISTS);
            }
        }
        return newCardset;
    }).then(function (uniqueCardset) {
        return pAddUpdateCardset(uniqueCardset);
    });
}

export function pDeleteCardFromCardset(cardID) {
    let cardsetName = cardID.split("-")[0];
    return pGetCardset(cardsetName).then(function (cardset) {
        cardset.cards = cardset.cards.filter(c => c.id !== cardID);
        return cardset;
    }).then(function (cardset) {
        return pAddUpdateCardset(cardset);
    }).catch(function (err) {
        throw Error(ERROR.DELETE_CARD_FROM_CARDSET_FAIL);
    });
}

export function pDeleteCardset(key) {
    return pGetAllCardsets().then(function (result) {
        result.delete(key);
        store.setItem(STORAGE.CARDSETS, result);
        return result;
    });
}

export function pAddCardToCardset(card, cardsetName) {
    return pGetCardset(cardsetName).then(function (cardset) {
        if (!card.isValid())
            throw Error(ERROR.INVALID_CARD_DETAILS);
        card.id = cardset.name + "-" + cardset.cards.length;
        cardset.addCard(card);
        return cardset;
    }).then(function (cardset) {
        return pAddUpdateCardset(cardset);
    }).then(function () {
        return Promise.resolve(`Sucessfully added card to the ${cardsetName} cardset!`);
    });
}

export function pUpdateCard(card) {
    if (!card.id) throw Error("Card does not have an ID set!");
    let cardsetID = card.id.split("-")[0];
    return pGetCardset(cardsetID).then(function (cardset) {
        cardset.cards = cardset.cards.filter(c => c.id !== card.id);
        cardset.cards.push(card);
        return cardset;
    }).then(function (updateCardset) {
        return pUpdateCardset(updateCardset);
    }).then(function () {
        return Promise.resolve(`Successfully updated the card ${card.title}!`);
    }).catch(function (err) {
        throw Error("Failed to update card!");
    });
}

export function pGetCardByID(cardID) {
    let cardsetID = cardID.split("-")[0];
    return pGetCardset(cardsetID).then(function (cardset) {
        return cardset.cards.filter(c => c.id === cardID)[0];
    }).catch(function (err) {
        throw Error(ERROR.GET_CARD_BY_ID_FAIL);
    });
}

export function pGetCardset(key) {
    return pGetAllCardsets()
        .then((result) => result.get(key) ? result.get(key) : null)
        .catch((err) => {
            throw Error(ERROR.CARD_DB_FAIL)
        });
}

export function postData(url) {
    return fetch(url, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
    }).then(response => response.json());
}

export function pFileReader(file) {

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (event) => {
            file.data = event.target.result;
            resolve(file);
        };

        reader.onerror = () => {
            // console.log(this);
            return reject(this);
        };

        if (/^image/.test(file.type)) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    })

}

export function storageSavePicture(imageFile) {
    try {
        localStorage.setItem(KEYS.PICTURE, JSON.stringify(imageFile));
    } catch (err) {
        if (err.code === 1014 || err.code === 22) {
            throw Error("File size too big, please upload a smaller file!");
        }
        throw Error("Failed to upload file, please try again!");
    }
}

export function storageGetLoadedPicture() {
    try {
        return JSON.parse(localStorage.getItem(KEYS.PICTURE));
    } catch (err) {
        throw new Error("Failed to get picture!");
    }
}

export function storageClearPictureData() {
    try {
        localStorage.removeItem(KEYS.PICTURE);
    } catch (err) {
        throw Error("Failed to remove the picture from storage!");
    }
}

export function startCurrentGame(cardsetName) {
    return pGetCardset(cardsetName.toString()).then(function (result) {
        if (result.cards.length === 0) {
            throw Error(`Cardset ${cardsetName} has no cards!`);
        }
        return cardsetName;
    }).then(result => store.setItem(KEYS.GAME, cardsetName.toString()));
}

export function getCurrentGame() {
    return store.getItem(KEYS.GAME);
}

function setCurrentCard(cardID) {
    return store.setItem(KEYS.CARD, cardID);
}

export function getCurrentCard() {
    return store.getItem(KEYS.CARD);
}

export function getSettings() {
    if (window.localStorage)
        return JSON.parse(localStorage.getItem(KEYS.SETTINGS));
    return null;
}


export function saveSettings(settings) {
    if (window.localStorage) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
        showToast("Successfully saved settings!", "");
    } else {
        showToast("Settings are not supported by your browser!", "");
    }
}

export function setCurrentEditedCardset(cardsetName) {
    sessionStorage.setItem(KEYS.CURRENT_CARDSET, cardsetName);
}
