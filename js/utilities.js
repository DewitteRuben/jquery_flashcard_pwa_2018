"use strict";

let UtilModule = function () {
    function isEmpty(value) {
        if (value === null || value === undefined) {
            return true;
        }
        if (typeof value === 'string') {
            return $.trim(value).length === 0;
        }
        return false;
    }

    function isEqualToCaseInsensitive(val1, val2) {
        if (typeof val1 === 'string' && typeof val2 === 'string') {
            return val1.toLowerCase() === val2.toLowerCase();
        }
        return val1 === val2;
    }

    function isInArrayLowerCase(arr, val) {
        return arr.some(arrVal => isEqualToCaseInsensitive(arrVal, val));
    }

    function removeDuplicatesArray(arr) {
        return Array.from(new Set(arr.map((e => typeof e === 'string' ? e.toLowerCase() : e))));
    }

    function getUniqueValuesOfObjectsInMap(map, key) {
        let uniques = [];
        map.forEach((item) => {
            console.log(item);
            if (uniques.indexOf(item[key]) < 0) {
                uniques.push(item[key]);
            }
        });
        return uniques;
    }

    function scrollToBottom() {
        $('html,body').animate({scrollTop: document.body.scrollHeight}, "fast");
    }

    function cardsetNameComparator(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    }

    function validateSelect() {
        // hack to make materialize select validate
        $("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});
    }

    function getSelectOptionByName(selectName) {
        return $(`select[name="${selectName}"]`).find("option:selected").val();
    }

    function isOnline() {
        return navigator.onLine;
    }


    return {
        isEmpty: isEmpty,
        isEqualToCaseInsensitive: isEqualToCaseInsensitive,
        isInArrayLowerCase: isInArrayLowerCase,
        removeDuplicatesArray: removeDuplicatesArray,
        scrollToBottom:scrollToBottom,
        cardsetNameComparator:cardsetNameComparator,
        validateSelect:validateSelect,
        isOnline:isOnline,
        getSelectOptionByName:getSelectOptionByName,
        getUniqueValuesOfObjectsInMap: getUniqueValuesOfObjectsInMap,
    }
}();