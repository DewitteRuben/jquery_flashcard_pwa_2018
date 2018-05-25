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

    Object.filter = (obj, predicate) =>
        Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {});

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


    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }


    return {
        isEmpty: isEmpty,
        isEqualToCaseInsensitive: isEqualToCaseInsensitive,
        isInArrayLowerCase: isInArrayLowerCase,
        removeDuplicatesArray: removeDuplicatesArray,
        scrollToBottom:scrollToBottom,
        cardsetNameComparator:cardsetNameComparator,
        validateSelect:validateSelect,
        getUniqueValuesOfObjectsInMap: getUniqueValuesOfObjectsInMap,
    }
}();