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

    function initAminsition() {
        $(".animsition").animsition({
            inClass: 'fade-in',
            outClass: 'fade-out',
            inDuration: 800,
            outDuration: 800,
            linkElement: '.animsition-link',
            // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
            loading: true,
            loadingParentElement: 'body', //animsition wrapper element
            loadingClass: 'animsition-loading',
            loadingInner: '', // e.g '<img src="loading.svg" />'
            timeout: false,
            timeoutCountdown: 5000,
            onLoadEvent: true,
            browser: [ 'animation-duration', '-webkit-animation-duration'],
            // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
            // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
            overlay : false,
            overlayClass : 'animsition-overlay-slide',
            overlayParentElement : 'body',
            transition: function(url){ window.location.href = url; }
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
        initAminsition:initAminsition
    }
}();