import {postData} from "../data";
let API_KEY = "trnsl.1.1.20180519T143130Z.2169786538de90eb.23ca89f814d0ef54f6ee93e5b62d6ae557db4856";

export function getAllAvailableLanguages() {
    let URL = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${API_KEY}&ui=nl`;
    return postData(URL).then(function (result) {
        if (result) {
            if (!result.hasOwnProperty("code"))
                return result;
            throw Error("Failed to translate, reason: " + result.message);
        }
        throw Error("Failed to receive a response from the translation service.");
    });
}

export function translate(text, to) {
    let URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${text}&lang=${to}`;
    return postData(URL).then(function (result) {
        if (result) {
            if (result.code === 200)
                return result;
            throw Error("Failed to translate, reason: " + result.message);
        }
        throw Error("Failed to receive a response from the translation service.");
    });
}