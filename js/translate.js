let TranslateModule = function () {
    let API_KEY = "trnsl.1.1.20180519T143130Z.2169786538de90eb.23ca89f814d0ef54f6ee93e5b62d6ae557db4856";


    function getAllAvailableLanguages() {
        let URL = `https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${API_KEY}&ui=nl`;
        return DataModule.postData(URL).then(function (result) {
            if (result) {
                if (!result.hasOwnProperty("code"))
                    return result;
                return Promise.reject("Failed to translate, reason: " + result.message);
            }
            return Promise.reject("Failed to receive a response from the translation service.");
        });
    }

    function translate(text, to) {
        let URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&text=${text}&lang=${to}`;
        return DataModule.postData(URL).then(function (result) {
            if (result) {
                if (result.code === 200)
                    return result;
                return Promise.reject("Failed to translate, reason: " + result.message);
            }
            return Promise.reject("Failed to receive a response from the translation service.");
        });
    }

    return {
        translate: translate,
        getAllAvailableLanguages: getAllAvailableLanguages,
    }

}();