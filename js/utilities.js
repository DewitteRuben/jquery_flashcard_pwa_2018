
export function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return $.trim(value).length === 0;
    }
    return false;
}

export function isEqualToCaseInsensitive(val1, val2) {
    if (typeof val1 === 'string' && typeof val2 === 'string') {
        return val1.toLowerCase() === val2.toLowerCase();
    }
    return val1 === val2;
}

export function isInArrayLowerCase(arr, val) {
    return arr.some(arrVal => isEqualToCaseInsensitive(arrVal, val));
}

export function removeDuplicatesArray(arr) {
    return Array.from(new Set(arr.map((e => typeof e === 'string' ? e.toLowerCase() : e))));
}

export function getUniqueValuesOfObjectsInMap(map, key) {
    let uniques = [];
    map.forEach((item) => {
        console.log(item);
        if (uniques.indexOf(item[key]) < 0) {
            uniques.push(item[key]);
        }
    });
    return uniques;
}

export function scrollToBottom() {
    $('html,body').animate({scrollTop: document.body.scrollHeight}, "fast");
}

export function cardsetNameComparator(a, b) {
    if (a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    if (a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

export function validateSelect() {
    // hack to make materialize select validate
    $("select[required]").css({display: "block", height: 0, padding: 0, width: 0, position: 'absolute'});
}

export function getSelectOptionByName(selectName) {
    return $(`select[name="${selectName}"]`).find("option:selected").val();
}

export function isOnline() {
    return navigator.onLine;
}

export function fDefault(e) {
    e.preventDefault();
    return undefined;
}