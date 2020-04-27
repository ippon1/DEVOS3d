/**
 * @author Richard
 */

var winWidth;
var winHeight;

var NEW_LINE = "\n";
var CONNECTION_ERROR_MSG = "Verbindung zum Server fehlgeschlagen!";

var offlineMode = false;
// Common functions

var currentDragObject = null;
var currentDragX = -1;
var currentDragY = -1;

var MODE = "DESKTOP";
var MOBILE_MAX_WIDTH = 600;
var TABLET_MAX_WIDTH = 1024;
var CONTINUE_BTN_WIDTH = 64;

/**
 * @author T.J. Crowder; https://stackoverflow.com/posts/9329446/revisions
 * @param array
 * @param prop
 * @returns {boolean}
 */
function arrayHasOwnIndex(array, prop) {
    return array.hasOwnProperty(prop) && /^0$|^[1-9]\d*$/.test(prop) && prop <= 4294967294; // 2^32 - 2
}

function toggleFullscreenMode(state) {
    var element = document.documentElement;
    if (state) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

String.prototype.regexIndexOf = function (regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
};

String.prototype.regexLastIndexOf = function (regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if (typeof (startpos) == "undefined") {
        startpos = this.length;
    } else if (startpos < 0) {
        startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while ((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
};

function isFunction(obj) {
    if (typeof obj === "function") {
        return true;
    }
    else {
        return false;
    }
}

function countAttribsInObj(obj) {
    if (obj == null) {
        return 0;
    }
    else {
        var cnt = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cnt++;
            }
        }
        return cnt;
    }
}

function isDataURL(s) {
    return !!(String(s)).match(isDataURL.regex);
}

isDataURL.regex = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i;

function getFileExtension(fileName) {
    if (fileName == null) {
        return null;
    }

    var extension = null;
    if (fileName.indexOf(".") > -1) {
        extension = fileName.split('.').pop();
        if (extension != null && extension != "") {
            extension = extension.toUpperCase();
            return extension;
        }
    }
    return extension;
}

function getMode() {
    var width = getWinSize().width;
    if (width <= MOBILE_MAX_WIDTH) {
        MODE = "MOBILE";
    }
    else if (width > MOBILE_MAX_WIDTH && width <= TABLET_MAX_WIDTH) {
        MODE = "TABLET";
    }
    else if (width > TABLET_MAX_WIDTH) {
        MODE = "DESKTOP";
    }
}

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Number.prototype.formatBytes = function () {
    var units = ['B', 'KB', 'MB', 'GB', 'TB'],
        bytes = this,
        i;

    for (i = 0; bytes >= 1024 && i < 4; i++) {
        bytes /= 1024;
    }

    return bytes.toFixed(2) + units[i];
};

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) {
        return setTimeout(f, 1000 / 60)
    } // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function (requestID) {
        clearTimeout(requestID)
    } //fall back

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function (predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return k.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return k;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return -1.
            return -1;
        }
    });
}

function NOW() {
    return (new Date()).getTime();
}

function logNOW(id, t1) {
    if (t1 != null) {
        console.log(id != null ? (id + ": " + ((new Date()).getTime() - t1)) : ((new Date()).getTime() - t1));
    }
}

function getIsoDateString(date, withTime, withDecSeconds) {
    var retStr = date.getUTCFullYear()
        + '-' + pad(date.getUTCMonth() + 1, 2)
        + '-' + pad(date.getUTCDate(), 2);
    if (withTime) {
        retStr = retStr + 'T' + pad(date.getUTCHours(), 2)
            + ':' + pad(date.getUTCMinutes(), 2)
            + ':' + pad(date.getUTCSeconds(), 2);
        if (withDecSeconds) {
            retStr = retStr + '.' + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5);
        }
    }
    retStr = retStr + 'Z';
    return retStr;
}

(function () {

    /**
     * Decimal adjustment of a number.
     *
     * @param   {String}    type    The type of adjustment.
     * @param   {Number}    value   The number.
     * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number}            The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

})();

function JSTR(obj) {
    return JSON.stringify(obj);
}

function isLocalHost() {
    if (window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("127.0.0.1") > -1) {
        return true;
    }
    else {
        return false;
    }
}

if (window.getComputedStyle) {
    window.getStyleValue = function (element, prop) {
        var computedStyle = window.getComputedStyle(element, null);
        if (!computedStyle) return null;
        if (computedStyle.getPropertyValue) {
            return computedStyle.getPropertyValue(prop);
        } else if (computedStyle.getAttribute) {
            return computedStyle.getAttribute(prop);
        } else if (computedStyle[prop]) {
            return computedStyle[prop];
        }
        ;
    };
}
// jQuery JavaScript Library v1.9.0
// http://www.minhacienda.gov.co/portal/pls/portal/PORTAL.wwsbr_imt_services.GenericView?p_docname=6240612.JS&p_type=DOC&p_viewservice=VAHWSTH&p_searchstring=
// For IE8 or less
else if (document.documentElement.currentStyle) {
    var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
        rposition = /^(top|right|bottom|left)$/,
        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    window.getStyleValue = function (element, prop) {
        var left, rsLeft,
            ret = element.currentStyle && element.currentStyle[prop],
            style = element.style;

        if (ret == null && style && style[prop]) {
            ret = style[prop];
        }
        if (rnumnonpx.test(ret) && !rposition.test(prop)) {
            left = style.left;
            rsLeft = element.runtimeStyle && element.runtimeStyle.left;
            if (rsLeft) {
                element.runtimeStyle.left = element.currentStyle.left;
            }
            style.left = prop === "fontSize" ? "1rem" : ret;
            ret = style.pixelLeft + "px";
            style.left = left;
            if (rsLeft) {
                element.runtimeStyle.left = rsLeft;
            }
        }
        return ret === "" ? "auto" : ret;
    };
}
;

var supports = (function () {
    var div = CREL('div'),
        vendors = 'Khtml Ms O Moz Webkit'.split(' '),
        len = vendors.length;

    return function (prop) {
        if (prop in div.style) return true;

        prop = prop.replace(/^[a-z]/, function (val) {
            return val.toUpperCase();
        });

        while (len--) {
            if (vendors[len] + prop in div.style) {
                // browser supports box-shadow. Do what you need.
                // Or use a bang (!) to test if the browser doesn't.
                return true;
            }
        }
        return false;
    };
})();

function cleanUrl() {
    var url = window.location.href;
    if (url == null || url == "") {
        return MAIN_PAGE_URL;
    }
    if (url.indexOf("#mainDiv") > -1) {
        url = url.substring(0, url.indexOf("#mainDiv"));
    }
    else if (url.indexOf("?section=") > -1) {
        url = url.substring(0, url.indexOf("?section="));
    }
    return url;
}

/** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function () {
        return this * Math.PI / 180;
    };
}


/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function () {
        return this * 180 / Math.PI;
    };
}

document.getHTML = function (who, deep) {
    if (!who || !who.tagName) return '';
    var txt, ax, el = CREL("div");
    el.appendChild(who.cloneNode(false));
    txt = el.innerHTML;
    if (deep) {
        ax = txt.indexOf('>') + 1;
        txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
    }
    el = null;
    return txt;
}

navigator.getType = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) return 'Opera ' + tem[1];
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var QueryString = function () {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search != null ? window.location.search.substring(1) : null;
    var vars = query != null ? query.split("&") : null;
    if (vars != null) {
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
    }
    else {
        query_string = new Object();
    }
    return query_string;
}();

var cookieManager =
    {
        set: function (name, value, expireDays) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + expireDays);

            document.cookie = name + "=" + escape(value) +
                ((!expireDays) ? "" : ";expires=" + expireDate.toGMTString());
        },

        get: function (key) {
            var start, end;

            if (document.cookie.length > 0) {
                start = document.cookie.indexOf(key + "=");

                if (start != -1) {
                    start = start + key.length + 1;
                    end = document.cookie.indexOf(";", start);

                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(start, end));
                }
            }
            return "";
        },

        remove: function (key) {
            this.set(key, '', -1);
        }
    }

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

String.prototype.startsWith = function (prefix) {
    return 0 == this.indexOf(prefix)
}

Array.prototype.insert = function (index) {
    if (typeof this.splice == "undefined") {
        return this;
    }
    this.splice.apply(this, [index, 0].concat(
        Array.prototype.slice.call(arguments, 1)));
    return this;
};

var randHex = function (len) {
    var maxlen = 8,
        min = Math.pow(16, Math.min(len, maxlen) - 1),
        max = Math.pow(16, Math.min(len, maxlen)) - 1,
        n = Math.floor(Math.random() * (max - min + 1)) + min,
        r = n.toString(16);
    while (r.length < len) {
        r = r + randHex(len - maxlen);
    }
    return r;
};

String.prototype.hexEncode = function () {
    var hex, i;

    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }

    return result
}

String.prototype.hexDecode = function () {
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function checksum(s) {
    var i;
    var chk = 0x12345678;

    for (i = 0; i < s.length; i++) {
        chk += (s.charCodeAt(i) * (i + 1));
    }

    return chk;
}

function isArray(testValue) {
    return testValue == null ? false : Array.isArray(testValue);
    //if(testValue===null){return false;}
    //if(Object.prototype.toString.call(testValue) == '[object Array]'){return true;}
    //return false;
}

function isAnyNonNullValueInArray(testValue) {
    if (testValue === null || isEmptyArray(testValue)) {
        return false;
    }
    for (var i = 0; i < testValue.length; i++) {
        var valObj = testValue[i];
        if (valObj != null && valObj.value !== null && valObj.value !== "") {
            return true;
        }
    }
    return false;
}

function isEmptyArray(testValue) {
    if (testValue === undefined || testValue === null) {
        return true;
    }
    if (Object.prototype.toString.call(testValue) != '[object Array]') {
        return true;
    }
    else {
        if (testValue.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }
}

function invertArray(arr) {
    if (arr == null || arr.length <= 1) {
        return arr;
    }
    var newArr = new Array();
    for (var i = arr.length - 1; i >= 0; i--) {
        newArr.push(arr[i]);
    }
    return newArr;
}

function stringToArray(str) {
    var elemArray = [];
    if (str.indexOf(";") > -1) {
        elemArray = str.split(";");
    }
    else if (str.indexOf("|") > -1) {
        elemArray = str.split("|");
    }
    else if (str.indexOf(",") > -1) {
        elemArray = str.split(",");
    }
    else if (str.indexOf("-") > -1) {
        elemArray = str.split("-");
    }

    if (elemArray.length == 0) {
        return null;
    }
    else {
        return elemArray;
    }
}

function createAndInitArray(length, defValue) {
    if (length == null) {
        return new Array();
    }
    var arr = new Array();
    for (var i = 0; i < length; i++) {
        arr.push(defValue);
    }
    return arr;
}

function checkKeyPress(event) {
    var keyCode = event.which || event.keyCode;

    if (keyCode != null) {
        if (keyCode == 27) {
            if (currentEditDbObj != undefined && currentEditDbObj != null) {
                closeEdit();
            }
            closeMenus();
        }
        else if ((keyCode == 32 || keyCode == 13) && document.activeElement != null) {
            if (menus !== undefined) {
                menus.subMenus.openSubMenuByKey(event);
            }
        }
        /*else if((keyCode==40||keyCode==38||keyCode==37||keyCode==39)&&document.activeElement!=null)
        {
            if(menus!==undefined){menus.navigateMenuByKey(keyCode);}
        }*/
    }
}

function sortList(array, attribName) {
    array.sort(function (a, b) {
        return Number(a[attribName]) == Number(b[attribName])
            ? 0
            : (Number(a[attribName]) > Number(b[attribName]) ? 1 : -1);
    });
    return array;
}

function sortSelect(selElem, attributes) {
    var tmpAry = new Array();
    for (var i = 0; i < selElem.options.length; i++) {
        tmpAry[i] = new Array();
        for (var j = 0; j < attributes.length; j++) {
            if (attributes[j] == "text") {
                tmpAry[i][j] = GIHTML(selElem.options[i]);
            }
            else if (attributes[j] == "style") {
                tmpAry[i][j] = selElem.options[i].style;
            }
            else {
                tmpAry[i][j] = GA(selElem.options[i], attributes[j]);
            }
        }
    }

    tmpAry.sort(function (a, b) {
        a = a[0];
        b = b[0];
        a = a != null ? String(a).toUpperCase() : "";
        b = b != null ? String(b).toUpperCase() : "";
        //console.log(a+":"+b)
        if (a == b) {
            return 0;
        }
        else if (a > b) {
            return 1;
        }
        else if (a < b) {
            return -1;
        }
        else {
            return 0;
        }
    });

    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
        var op = CREL("option");
        for (var j = 0; j < attributes.length; j++) {
            if (attributes[j] == "text") {
                SIHTML(op, tmpAry[i][j]);
            }
            else if (attributes[j] == "style") {
                op.style = tmpAry[i][j];
            }
            else {
                SA(op, attributes[j], tmpAry[i][j]);
            }
        }
        selElem.options[i] = op;
    }
    return;
}

function urlExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status != 404;
    }
    catch (e) {
        return false;
    }
}

function htmlDecode(input) {
    var e = CREL('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function openXhro(type, url, dataType,
                  downProgress, downComplete, downError, downAbort, downEnd,
                  upProgress, upComplete, upError, upAbort, upEnd) {
    try {
        var xhro = getXhro();

        xhro = reqObs.setXhroObserverObj(reqObs.createXhroObserverObj(xhro, url, type,
            downProgress, downComplete, downError, downAbort, downEnd,
            upProgress, upComplete, upError, upAbort, upEnd));

        xhro.open(type, url, true);
        if (dataType == "text") {
            //xhro.setRequestHeader('Content-type', 'text/plain; charset='+CURRENT_CHARSET.toUpperCase());
            xhro.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=' + CURRENT_CHARSET.toUpperCase());
        }

        return xhro;
    }
    catch (e) {
        var errMsg = "Fehler beim Erstellen einer neuen Server-Verbindung: " + e;
        logger.error(errMsg);
        alert(errMsg);
    }
}

function getXhro() {
    var xhro = new XMLHttpRequest();
    return xhro;
}

function convertValueToNumber(value, defaultValue) {
    if (value === null || value === "") {
        return defaultValue != null ? defaultValue : null;
    }
    var newValue = value;

    if (isNaN(newValue)) {
        if (newValue.indexOf !== undefined) {
            if (newValue.indexOf(",") > -1) {
                newValue = newValue.replace(",", ".");
            }
            newValue = newValue.replace(/[^\d.-]/g, '');
        }
        else {
            return defaultValue;
        }
    }

    if (isNaN(newValue)) {
        if (typeof value == "string") {
            if (value.indexOf(",") > -1 && value.indexOf(".") > -1 && getConfigElement("kmFormatValue") == "true") {
                value = value.replace(".", "");
                value = value.replace(",", ".");
                value = Number(value);
                return value;
            }
            else if (value.indexOf(",") > -1 && value.indexOf(".") == -1) {
                value = Number(value.replace(",", "."));
                return value;
            }
            else {
                return defaultValue != null ? defaultValue : null;
            }
        }
        else if (typeof value == "number") {
            return defaultValue != null ? defaultValue : null;
        }
    }
    else {
        return Number(newValue);
    }
}

function getFreeLocalStorage() {
    if (localStorage != undefined) {
        var str1MB = Array(1048576).join('x');
        var stepSize = 1048576;
        var stop = false;
        var storeTest = "";
        var delta = str1MB;
        var direction = 1;
        var oldResult = true;
        var result = true;
        localStorage.clear();

        do {
            try {
                if (direction == 1) {
                    storeTest = storeTest + delta;
                }
                else {
                    storeTest = storeTest.substring(0, (storeTest.length - stepSize));
                }
                localStorage.setItem("t", storeTest);
                localStorage.removeItem("t");
                result = true;

                if (result != oldResult) {
                    if (stepSize > 64) {
                        stepSize = stepSize / 2;
                        delta = delta.substring(0, (delta.length / 2));
                        direction = direction * -1;
                    }
                    else {
                        stop = true;
                    }
                }
                oldResult = result;
            }
            catch (e) {
                result = false;
                //alert(storeTest.length+":"+result+"->"+e);

                if (result != oldResult) {
                    if (stepSize > 64) {
                        stepSize = stepSize / 2;
                        delta = delta.substring(0, (delta.length / 2));
                        direction = direction * -1;
                    }
                    else {
                        stop = true;
                    }
                }
                oldResult = result;

                localStorage.clear();
            }
        } while (!stop);
        alert(storeTest.length);
    }
}

function getSafariVersion() {
    var isSafari = navigator.getType != null ? (navigator.getType.toLowerCase().indexOf("safari") > -1) : false;
    if (isSafari) {
        var safariVersion = Number(navigator.getType.toLowerCase().replace("safari", "").trim());
        logger.info("Safari Version " + safariVersion + " erkannt.");
        return isNaN(safariVersion) ? null : safariVersion;
    }
    else {
        return null;
    }
}

function getOperaVersion() {
    var isOpera = navigator.getType != null ? (navigator.getType.toLowerCase().indexOf("opera") > -1) : false;
    if (isOpera) {
        var operaVersion = Number(navigator.getType.toLowerCase().replace("opera", "").trim());
        logger.info("Opera Version " + operaVersion + " erkannt.");
        return isNaN(operaVersion) ? null : operaVersion;
    }
    else {
        return null;
    }
}

function getFFversion() {
    var isFF = navigator.getType != null ? (navigator.getType.toLowerCase().indexOf("firefox") > -1) : false;
    if (isFF) {
        var ffVersion = Number(navigator.getType.toLowerCase().replace("firefox", "").trim());
        logger.info("FireFox Version " + ffVersion + " erkannt.");
        return isNaN(ffVersion) ? null : ffVersion;
    }
    else {
        return null;
    }
}

function checkIfEmptyArray(array) {
    if (array == null || array == "") {
        return true;
    }
    if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] != null && array[i] != "") {
                return false;
            }
        }
    }
    return true;
}

function createTableAndBody(tableId, theadId, tbodyId) {
    var table = CREL("table");
    table.id = tableId;
    if (theadId != null) {
        var thead = CREL("thead");
        thead.id = theadId;
    }
    var tbody = CREL("tbody");
    tbody.id = tbodyId;
    if (theadId != null) {
        AC(table, thead);
    }
    AC(table, tbody);
    return table;
}

function formatNumberToString(number, decPlaces) {
    if (number === null || number === "") {
        return null;
    }
    var number = number.toFixed(decPlaces) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? ',' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }

    return x1 + x2;
}

function setUserButton(id, top, left, size, iconNormal, iconActive, state, ppFunction) {
    REMEL(GEBI(id));
    var button;
    if (state) {
        button = iconActive;
    }
    else {
        button = iconNormal;
    }

    SA(button, "name", "userButton");
    button.id = id;
    button.className = "button";
    button.style.top = top + "px";
    button.style.left = left + "px";
    button.style.width = size + "px";
    button.style.height = size + "px";
    button.style.zIndex = 3001;
    button.onclick = ppFunction;

    AC(document.body, button);
}

function detectPhone() {
    var useragent = navigator.userAgent.toLowerCase();
    if (useragent.indexOf("iphone") > -1) {
        return true;
    }
    else if (useragent.indexOf("ipod") > -1) {
        return true;
    }
    //else if( useragent.indexOf("ipad")>-1 ){return true;}
    else if (useragent.indexOf("android") > -1) {
        return true;
    }
    else {
        return false;
    }
}

function detectGeoLocation() {
    return (navigator.geolocation || ("geolocation" in navigator));
}

function detectTouchMode() {
    var iosVersion = getIosVersion();
    if (iosVersion != null && window.Touch) {
        touchMode = true;
    }
    else if (getOperaVersion() != null) {
        touchMode = true;
    }
    else {
        touchMode = !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
    }
}

function hasGetUserMedia() {
    return ((navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia));
}

function gotVideoSources(sourceInfos) {

}

function displayVideoStream(videoElementId) {
    if (GEBI(videoElementId) != null) {
        /*if (typeof MediaStreamTrack !== 'undefined' &&
		    typeof MediaStreamTrack.getSources !== 'undefined')
		{
		  MediaStreamTrack.getSources(gotVideoSources);
		}*/

        var video = GEBI(videoElementId);
        video.style.display = "";
        SA(video, "autoplay", "autoplay");
        mediaStreamObj = null;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        var constraints =
            {
                audio: false,
                video: true
            };


        navigator.getUserMedia(constraints, function (stream) {
            window.stream = stream;
            mediaStreamObj = stream;
            // stream available to console
            if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            }
            else {
                video.src = stream;
            }
        }, showVideoError);
    }
}

function showVideoError(err) {
    alert("Die Kamera kann nicht geöffnet werden. Grund: " + err.name);
    mediaStreamObj = null;
}

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function CRIMEL(src) {
    var img = CREL("img");
    SA(img, "src", "." + src);
    return img;
}

function cleanElement(id, element) {
    var elem = id == null ? element : GEBI(id);
    if (elem != null) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }
    return elem;
}

function cleanElementNodes(id) {
    var elem = GEBI(id);
    if (elem != null) {
        var nodes = getChildNodesNotText(elem);
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }
    return elem;
}

function cleanElementForElem(elem) {
    if (elem != null) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }
}

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
}

// I needed the opposite function today, so adding here too:
function htmlUnescape(str) {
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&#x2F;/g, '/');
}

function refreshScript(src) {
    var scriptElement = CREL('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = src + '?' + (new Date).getTime();
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

function SEDISABLED(elem, state) {
    if (elem == null) {
        return elem;
    }
    if (state === true) {
        SA(elem, "disabled", "disabled");
    }
    else if (state === false) {
        RA(elem, "disabled");
    }
    return elem;
}

function REMEL(elem) {
    if (elem != null) {
        var par = elem.parentNode;
        if (par != null) {
            par.removeChild(elem);
        }
    }
    return elem;
}

function AC(el, child) {
    if (el != null) {
        try {
            el.appendChild(child);
            return el;
        }
        catch (e) {
            //alert(e+" -> "+el+" ("+el.id+"), child: "+child+" ("+child.id+")");
        }
    }
    else {
        //alert("AC -> Element ist null!: "+child+" ("+child.id+")");
    }
}

function SANS(ns, el, id, val) {
    if (el != null) {
        el.setAttributeNS(ns, id, val);
        return el;
    }
    else {
        //alert("SANS -> Element ist null!: "+ns+","+id+","+val);
    }
}

function SA(el, id, val) {
    if (el != null) {
        el.setAttribute(id, val);
        return el;
    }
    else {
        //alert("SA -> Element ist null!: "+id+","+val);
    }
}

function GA(el, id) {
    if (el != null) {
        return el.getAttribute(id);
    }
    else {
        return null;
    }
}

function createDummy() {
    var dummy = CREL("div");
    dummy["checked"] = false;
    dummy["options"] = [];
    dummy["value"] = null;
    dummy["parentNode"] = CREL("div");
    dummy["selectedIndex"] = -1;
    dummy["rows"] = [];
    var child = CREL("div");
    dummy["children"] = [child];
    return dummy;
}

function GEBI(id, useDummy) {
    if (id != null) {
        var elm = document.getElementById(id);
        if (useDummy && elm == null) {
            if (console) {
                console.log("Dummy created. Element with ID '" + id + "' not found in document.");
            }

            return createDummy();
        }
        return elm;
    }
    else {
        if (useDummy) {
            if (console) {
                console.log("Dummy created. Element with ID '" + id + "' not found in document.");
            }

            return createDummy();
        }
        return elm;
    }
}

function CREL(type) {
    return document.createElement(type);
}

function CRTXT(txt) {
    return document.createTextNode(txt);
}

function RA(el, id) {
    if (el == null) {
        return null;
    }
    el.removeAttribute(id);
    return el;
}

function SIHTML(el, text) {
    if (el == null) {
        return null;
    }
    el.innerHTML = text;
    return el;
}

function GIHTML(el) {
    if (el == null) {
        return null;
    }
    try {
        var val = el.innerHTML;
        return val;
    }
    catch (e) {
        //alert("GIHTML Fehler!")
        return null;
    }
    return null;
}

function CREMPTYOPT(emptyId, emptyText, emptyValue) {
    var option = CREL("option");
    option.id = emptyId;
    SA(option, "value", emptyValue);
    SIHTML(option, emptyText);
    return option;
}

function getKeyFromEvent(event) {
    if (!event) {
        event = window.event;
    }
    var keyCode = event.which || event.keyCode;
    return keyCode;
}

function getElementFromEvent(event) {
    if (!event) {
        event = window.event;
    }
    var elem = event.target ? event.target : event.srcElement;
    return elem;
}

function getIdFromEvent(event) {
    if (event == null) {
        return null;
    }
    var elem = getElementFromEvent(event);
    if (elem != null) {
        return elem.getAttribute("id");
    }
    else {
        return null;
    }
}

function getCurrentElementFromEvent(event) {
    if (!event) {
        event = window.event;
    }
    var elem = event.currentTarget;
    return elem;
}

function getCurrentIdFromEvent(event) {
    if (event == null) {
        return null;
    }
    var elem = getCurrentElementFromEvent(event);
    if (elem != null) {
        return elem.getAttribute("id");
    }
    else {
        return null;
    }
}

function isChildOf(child, parent, dontCheckSelf) {
    if (dontCheckSelf == null && child === parent) {
        return false;
    }
    if (parent == null || child == null || child.parentNode == null) {
        return false;
    }
    else {
        if (child.parentNode == parent) {
            return true;
        }
        else {
            return isChildOf(child.parentNode, parent, true);
        }
    }
}

function getChildNodesNotText(element) {
    var retArray = new Array();
    if (element == null) {
        return retArray;
    }
    else {
        if (element.hasChildNodes()) {
            for (var i = 0; i < element.childNodes.length; i++) {
                var el = element.childNodes[i];
                if (el != null && el != "[object Text]") {
                    retArray.push(el);
                }
            }
        }
    }
    return retArray;
}

function getFirstChildNotText(element) {
    if (element == null) {
        return null;
    }
    else {
        if (element.hasChildNodes()) {
            for (var i = 0; i < element.childNodes.length; i++) {
                var el = element.childNodes[i];
                if (el != null && el != "[object Text]") {
                    return el;
                }
            }
        }
    }
    return null;
}

function menuOver(event) {
    var elem = getElementFromEvent(event);
    if (elem != null) {
        elem.className = elem.className.replace("Off", "On");
    }
}

function menuOut(event) {
    var elem = getElementFromEvent(event);
    if (elem != null) {
        elem.className = elem.className.replace("On", "Off");
    }
}

function getPosition(element) {
    var elem = element, tagname = "", x = 0, y = 0;
    if (elem == null) {
        return {"x": 0, "y": 0};
    }
    while ((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
        y += elem.offsetTop;
        x += elem.offsetLeft;
        tagname = elem.tagName.toUpperCase();
        if (tagname == "BODY") {
            elem = 0;
        }
        if (typeof(elem) == "object") {
            if (typeof(elem.offsetParent) == "object") {
                elem = elem.offsetParent;
                if (elem == null) {
                    break;
                }
            }
        }
    }
    position = new Object();
    position.x = x;
    position.y = y;
    return position;
}

function getSize(element) {
    var size = new Object();
    if (element == null) {
        size.width = 0;
        size.height = 0;
    }
    else {
        if (element.clientHeight) {
            size.width = element.clientWidth;
            size.height = element.clientHeight;
        }
        else {
            if (element.offsetHeight) {
                size.width = element.offsetWidth;
                size.height = element.offsetHeight;
            }
            else {
                size.width = 0;
                size.height = 0;
            }
        }
    }
    return size;
}

function getScreenSizeAvailable() {
    var o = new Object();
    o.width = window.screen.availWidth;
    o.height = window.screen.availHeight;
    return o;
}

function getScreenSizeAbsoulte() {
    var o = new Object();
    o.width = window.screen.width;
    o.height = window.screen.height;
    return o;
}


function getWinSize() {
    var size = new Object();
    var width = 0, height = 0;
    var win = window;
    var doc = document;

    if (win != null && typeof(win.innerWidth) == 'number') {
        //Non-IE
        width = win.innerWidth;
        height = win.innerHeight;
    }
    else if (doc.documentElement && (doc.documentElement.clientWidth || doc.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        width = doc.documentElement.clientWidth;
        height = doc.documentElement.clientHeight;
    }
    else if (doc.body && (doc.body.clientWidth || doc.body.clientHeight)) {
        //IE 4 compatible
        width = doc.body.clientWidth;
        height = doc.body.clientHeight;
    }

    size.width = width;
    size.height = height;

    return size;
}

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : null;
}

function getIeVersion() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return null;
}

function getOperaVersion() {
    if (window.opera) {
        return window.opera;
    }
}

function getIosVersion() {
    var version = null;
    var res = navigator.userAgent.match(/; CPU.*OS (\d_\d)/);
    if (res) {
        var strVer = res[res.length - 1];
        strVer = strVer.replace("_", ".");
        version = strVer * 1;
    }
    return version;
}

// A not visible element affects the layout
function setElementVisible(pElement, pVisible) {
    if (pElement != null) pElement.style.visibility = (pVisible ? 'visible' : 'hidden');
}


function isElementVisible(pElement) {
    if (pElement != null) return pElement.style.visibility != 'hidden';
    return false;
}


function setElementDisplayedLang(pId, pDisplayed) {
    var elem = GEBI(pId + "_" + language);
    setElementDisplayed(elem, pDisplayed);
}

// A not displayed element doesn't affect the layout
function setElementDisplayed(pElement, pDisplayed) {
    if (pElement != null) {
        pElement.style.display = (pDisplayed ? '' : 'none');
    }
}


function isElementDisplayed(pElement) {
    if (pElement != null) return pElement.style.display != 'none';
    return false;
}


function setEnabled(pElement, pEnabled) {
    if (pElement != null) pElement.disabled = (pEnabled ? false : true);
}


function isEnabled(pElement) {
    if (pElement != null) return !pElement.disabled;
    return false;
}

function setElementValueById(pElementId, pValue) {
    setElementValue(GEBI(pElementId), pValue);
}

function setElementValue(pElement, pValue) {
    if (pValue == null || pValue.length == 0) pValue = '';
    if (pElement != null) pElement.value = pValue;
}

function removeAllChildren(pNode) {
    if ((pNode != null) && pNode.hasChildNodes()) {
        while (pNode.hasChildNodes()) pNode.removeChild(pNode.lastChild);
    }
}

function setNodeStyle(pNode, pColor, pBackgroundColor, pFontWeight, pCursor) {
    if (pNode != null) {
        if (pColor != null) pNode.style.color = pColor;
        if (pBackgroundColor != null) pNode.style.backgroundColor = pBackgroundColor;
        if (pFontWeight != null) pNode.style.fontWeight = pFontWeight;
        if (pCursor != null) pNode.style.cursor = pCursor;
    }
}

function createTextLink(id, name, text, onclickMethod, toolTip) {
    var link = CREL('a');
    if (id != null) link.id = id;
    if (name != null) link.name = name;
    link.appendChild(document.createTextNode(text));
    link.onclick = onclickMethod;
    link.title = toolTip;
    link.alt = toolTip;
    link.onmouseover = function () {
        this.style.cursor = 'pointer';
    };

    return link;
}

function getNumberAsString(pNumber, length) {
    var numberString = pNumber.toString();
    for (var i = 0; i < (length - numberString.length); i++) numberString = '0' + numberString;
    return numberString;
}

function getElementValueById(pElementId) {
    if (pElementId != null) {
        var element = GEBI(pElementId);
        if (element != null) return element.value;
    }
    return null;
}

function createIntegerComboBoxEntryArray(pStartIndex, pEndIndex, pValueLength) {
    var array = new Array();
    for (var i = pStartIndex; i <= pEndIndex; i++) array.push(createComboBoxEntry(i, getNumberAsString(i, pValueLength)));
    return array;
}

function createComboBoxEntry(pId, pValue) {
    return {"id": pId, "value": pValue};
}

function createComboBox(id, name, width, valueArray, onchangeMethod, className) {
    var comboBox = CREL('select');
    if (id != null) comboBox.id = id;
    if (name != null) comboBox.name = name;
    if (className != null) comboBox.className = className;
    comboBox.style.width = width;
    if (onchangeMethod != null) comboBox.onchange = onchangeMethod;
//      setValuesForComboBox(comboBox, valueArray);
    if (valueArray != null) setSelectList(comboBox, valueArray, 0, null, '');
    return comboBox;
}

function selectOtherComboBoxEntryById(pId, pDependentId, pStep) {
    var comboBox = GEBI(pId);
    if (comboBox != null) {
        var newSelectedIndex = comboBox.selectedIndex + pStep;
        if ((pDependentId == null) && (newSelectedIndex >= 0) && (newSelectedIndex < comboBox.options.length)) {
        }
        else if (newSelectedIndex < 0) {
            newSelectedIndex = comboBox.options.length + newSelectedIndex;
            selectOtherComboBoxEntryById(pDependentId, null, pStep);
        }
        else if (newSelectedIndex >= comboBox.options.length) {
            newSelectedIndex = newSelectedIndex - comboBox.options.length;
            selectOtherComboBoxEntryById(pDependentId, null, pStep);
        }
        comboBox.selectedIndex = newSelectedIndex;
    }
}

function setSelectList(pSelectElement, pRequestResultObject, pStartIndex, pNullText, pNullValue) {
    setSelectListValueAttribute(pSelectElement, pRequestResultObject, pStartIndex, pNullText, pNullValue, null);
}

function setSelectListValueAttribute(pSelectElement, pRequestResultObject, pStartIndex,
                                     pNullText, pNullValue, pValueAttribute) {
    if (pRequestResultObject != null && pSelectElement != null && pSelectElement.tagName != null && pSelectElement.tagName.toUpperCase() == 'SELECT') {
        pSelectElement.length = 0;
        var selectElement = document.createDocumentFragment();
        if (pNullText != null) {
            appendToSelectElement(selectElement, pNullValue, pNullText);
        }
        for (var i = pStartIndex; i < pRequestResultObject.length; i++) {
            appendToSelectElement(selectElement,
                pRequestResultObject[i].id,
                (pValueAttribute != null ? pRequestResultObject[i][pValueAttribute] : pRequestResultObject[i].value),
                pRequestResultObject[i].displayColor,
                pRequestResultObject[i].tooltip);
        }
        pSelectElement.appendChild(selectElement.cloneNode(true));
        if (pNullText != null) pSelectElement.value = pNullValue;
    }
}

function appendToSelectElement(pSelectElement, pValue, pContent, pDisplayColor, pTooltip) {
    var newOption = CREL("option");
    newOption.value = pValue;
    if (pDisplayColor) newOption.style.color = pDisplayColor;
    if (pTooltip) newOption.title = pTooltip;
    newOption.appendChild(document.createTextNode(pContent));
    pSelectElement.appendChild(newOption);
}

function createTable(pId, pName, pTableHead, pTableBody, pTableFoot, pResetPaddingAndSpacing) {
    var table = CREL('table');
    if (pId != null) table.id = pId;
    if (pName != null) table.name = pName;
    if (pTableHead) table.appendChild(CREL('thead'));
    if (pTableBody) table.appendChild(CREL('tbody'));
    if (pTableFoot) table.appendChild(CREL('tfoot'));
    if (pResetPaddingAndSpacing) {
        table.cellPadding = '0px';
        table.cellSpacing = '0px';
    }
    return table;
}

function addComponentToTable(pTable, pComponent, pNewRow, pNewColumn) {
    addComponentToTableExtended(pTable, pComponent, pNewRow, pNewColumn, null, null);
}


function addComponentToTableExtended(pTable, pComponent, pNewRow, pNewColumn, pRowSpan, pColSpan) {
    if ((pTable != null) && (pComponent != null)) {
        var tableRow;
        var tableColumn;
        if (pNewRow) tableRow = pTable.insertRow(-1);
        else tableRow = pTable.rows[pTable.rows.length - 1];
        if (pNewColumn) tableColumn = tableRow.insertCell(-1);
        else tableColumn = tableRow.cells[tableRow.cells.length - 1];

        if (pRowSpan != null) tableColumn.rowSpan = pRowSpan;
        if (pColSpan != null) tableColumn.colSpan = pColSpan;

        tableColumn.appendChild(pComponent);
    }
}

function setTableParameter(pTable, pBorder, pRules) {
    if (pTable != null) {
        //            if (pBorderColor != null) pTable.borderColor = pBorderColor;
        //            if (pBorderStyle != null) pTable.borderStyle = pBorderStyle;
        if (pBorder != null) pTable.style.border = pBorder;
        if (pRules != null) pTable.rules = pRules;
    }
}

function createTextfield(id, name, size, width, type, readOnly, className) {
    var textfield = CREL('input');
    if (id != null) textfield.id = id;
    if (name != null) textfield.name = name;
    textfield.type = type;
    if (size > 0) {
        textfield.size = size;
        textfield.maxLength = size;
    }
    if (width != null) textfield.style.width = width;
    if (readOnly) textfield.readOnly = 'readonly';
    if (className != null) textfield.className = className;
    return textfield;
}

/*
function createButton(id, name, text, onclickMethod, tooltip)
{
  var button = document.createElement('input');
  if (id != null) button.id = id;
  if (name != null) button.name = name;
  button.type = 'button';
  button.value = text;
  button.className="btn";
  button.onclick = onclickMethod;
  if (tooltip != null)
  {
     button.title = tooltip;
     button.alt = tooltip;
  }
  return button;
}
*/
function createDate(year, month, dayOfMonth, hour, minute, second) {
    if (isNaN(year) || isNaN(month) || isNaN(dayOfMonth) || isNaN(hour) || isNaN(minute) || isNaN(second)) return null;
    var date = new Date();
    date.setDate(1);           // First day of month to avoid problems with February, 28th and 29th
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(dayOfMonth);
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);
    date.setMilliseconds(0);
    if ((year != date.getFullYear()) || (month != date.getMonth()) || (dayOfMonth != date.getDate()) ||
        (hour != date.getHours()) || (minute != date.getMinutes()) || (second != date.getSeconds())) return null;

    return date;
}

function getMaximumNumberOfDaysOfMonthAndYear(pMonth, pYear) {
    var maxDate = 31;
    var date = new Date();
    date.setDate(1);           // First day of month to avoid problems with February, 28th and 29th
    date.setFullYear(pYear);
    date.setMonth(pMonth);
    date.setDate(maxDate);
    var diff = maxDate - date.getDate();
    if (date.getDate() != maxDate) {
        return (diff);
    }
    else {
        return maxDate;
    }
}

// date/time format: 'YYYY.MM.DD HH24:MI', e.g. 2009.10.08 14:07
function getDateTimeFromString(dateTimeString, yearFirst, dateTimeSeparator, considerSeconds) {
    var date;
    if (dateTimeString != null) {
        try {
            var firstPointIdx = dateTimeString.indexOf('.');
            var secondPointIdx = dateTimeString.indexOf('.', firstPointIdx + 1);
            var separatorIdx = dateTimeString.indexOf(dateTimeSeparator);
            var firstColonIdx = dateTimeString.indexOf(':');
            var secondColonIdx = dateTimeString.indexOf(':', firstColonIdx + 1);
            if (!considerSeconds) {
                if (secondColonIdx != -1) return null;
                else secondColonIdx = dateTimeString.length;
            }
            var firstNumber = new Number(dateTimeString.substring(0, firstPointIdx), 10);
            var secondNumber = new Number(dateTimeString.substring(firstPointIdx + 1, secondPointIdx), 10);
            var thirdNumber = new Number(dateTimeString.substring(secondPointIdx + 1, separatorIdx), 10);
            var fourthNumber = new Number(dateTimeString.substring(separatorIdx + 1, firstColonIdx), 10);
            var fifthNumber = new Number(dateTimeString.substring(firstColonIdx + 1, secondColonIdx), 10);
            var sixthNumber = considerSeconds ? new Number(dateTimeString.substring(secondColonIdx + 1, dateTimeString.length), 10) : 0;

            if (yearFirst) date = createDate(firstNumber, secondNumber - 1, thirdNumber, fourthNumber, fifthNumber, sixthNumber);
            else date = createDate(thirdNumber, secondNumber - 1, firstNumber, fourthNumber, fifthNumber, sixthNumber);
        }
        catch (e) {
            logger.error("Fehler beim Konvertieren von String zu Datum/Zeit: " + e);
            return null;
        }
    }

    return date;
}

function getDateFromString(dateString, yearFirst) {
    var date;
    if (dateString != null) {
        try {
            var firstPointIdx = dateString.indexOf('.');
            var secondPointIdx = dateString.indexOf('.', firstPointIdx + 1);
            var firstNumber = new Number(dateString.substring(0, firstPointIdx), 10);
            var secondNumber = new Number(dateString.substring(firstPointIdx + 1, secondPointIdx), 10);
            var thirdNumber = new Number(dateString.substring(secondPointIdx + 1, dateString.length), 10);

            if (yearFirst) date = createDate(firstNumber, secondNumber - 1, thirdNumber, 0, 0, 0);
            else date = createDate(thirdNumber, secondNumber - 1, firstNumber, 0, 0, 0);
        }
        catch (e) {
            logger.error("Fehler beim Konvertieren von String zu Datum: " + e);
            return null;
        }
    }

    return date;
}

// date/time format: 'YYYY.MM.DD HH24:MI', e.g. 2009.10.08 14:07
function getDateTimeAsString(date, yearFirst, dateTimeSeparator, displayTime, displaySeconds) {
    var dateTimeString = null;
    if (yearFirst) {
        dateTimeString = getNumberAsString(date.getFullYear(), 4) + '.' +
            getNumberAsString(date.getMonth() + 1, 2) + '.' +
            getNumberAsString(date.getDate(), 2);
    }
    else {
        dateTimeString = getNumberAsString(date.getDate(), 2) + '.' +
            getNumberAsString(date.getMonth() + 1, 2) + '.' +
            getNumberAsString(date.getFullYear(), 4);
    }
    if (displayTime) {
        dateTimeString += dateTimeSeparator + getNumberAsString(date.getHours(), 2) + ':' +
            getNumberAsString(date.getMinutes(), 2);
        if (displaySeconds) dateTimeString += ':' + getNumberAsString(date.getSeconds(), 2);
    }
    return dateTimeString;
}

function calculateAge(date, unit, decimals, rounding) {
    if (date == null) {
        return null;
    }
    /*
	Ultimate Age calculator script- By JavaScript Kit (http://www.javascriptkit.com)
	Over 200+ free scripts here!
	Credit must stay intact for use
	*/

    var one_day = 1000 * 60 * 60 * 24;
    var one_month = 1000 * 60 * 60 * 24 * 30;
    var one_year = 1000 * 60 * 60 * 24 * 30 * 12;

    var yr = date.getFullYear();
    var mon = date.getMonth();
    var day = date.getDate();

    today = new Date();
    var pastdate = date;

    var countunit = unit;

    var finalunit = (countunit == "days") ? one_day : (countunit == "months") ? one_month : one_year;
    var decimals = (decimals <= 0) ? 1 : decimals * 10;

    if (unit != "years") {
        if (rounding == "rounddown") {
            return Math.floor((today.getTime() - pastdate.getTime()) / (finalunit) * decimals) / decimals;
        }
        else {
            return Math.ceil((today.getTime() - pastdate.getTime()) / (finalunit) * decimals) / decimals;
        }
    }
    else {
        var yearspast = today.getFullYear() - yr - 1;
        var tail = (today.getMonth() > mon - 1 || today.getMonth() == mon - 1 && today.getDate() >= day) ? 1 : 0;
        pastdate.setFullYear(today.getFullYear());
        var pastdate2 = new Date(today.getFullYear() - 1, mon - 1, day);
        tail = (tail == 1) ? tail + Math.floor((today.getTime() - pastdate.getTime()) / (finalunit) * decimals) / decimals : Math.floor((today.getTime() - pastdate2.getTime()) / (finalunit) * decimals) / decimals
        return yearspast + tail;
    }

    //Sample usage
    //displayage (year, month, day, unit, decimals, rounding)
    //Unit can be "years", "months", or "days"
    //Decimals specifies demical places to round to (ie: 2)
    //Rounding can be "roundup" or "rounddown"

    //displayage(1997, 11, 24, "years", 0, "rounddown")
}

function doSimpleRequest(type, reqUrl, ppFunction, showError, showResponse, isJson, paramArrayString, dataType) {
    doSimpleRequestExtended(type, reqUrl, ppFunction, showError, showResponse, isJson, paramArrayString, false, dataType);
}

function doSimpleRequestStringBlob(type, reqUrl, ppFunction, showError, showResponse, isJson, dbToSaveString) {
    var fd = new FormData();
    var data = new Blob([dbToSaveString], {type: "text/plain;charset=" + CURRENT_CHARSET});
    fd.append("data", data);

    var xhro = openXhro(type, reqUrl, "file");

    xhro.onreadystatechange = function () {
        if (xhro.readyState == 4 && xhro.status == 200) {
            offlineMode = false;
            var retVal = xhro.responseText;

            if (showResponse) {
                if (retVal != null && typeof retVal !== "object" && retVal != "") {
                    alertResponse(retVal);
                }
            }

            if (ppFunction != null) {
                ppFunction(retVal);
            }
        }
        else if (xhro.readyState == 4 && xhro.status == 404) {
            offlineMode = true;
            if (showError) {
                connectionError();
            }

            if (ppFunction != null) {
                ppFunction(null);
            }
        }
    }

    xhro.send(fd);
}

function doSimpleRequestExtended(type, reqUrl, ppFunction, showError, showResponse, isJson, paramArrayString, getXML, dataType) {
    var xhro = openXhro(type, reqUrl, dataType);

    if (showError) {
        xhro.addEventListener("error", function () {
            connectionError(ppFunction);
        }, false);
    }
    if (isJson) {
        xhro.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    if (paramArrayString != null) {
        //paramArrayString=paramArrayString.substring(0,1369300);
        //xhro.setRequestHeader("Content-length", paramArrayString.length);
        //xhro.setRequestHeader("Connection", "close");
    }

    xhro.onreadystatechange = function () {
        if (xhro.readyState == 4 && xhro.status == 200) {
            offlineMode = false;
            var retVal = null;

            if (getXML) {
                var data = xhro.responseXML;
                if (!data || !data.documentElement) {
                    data = xhro.responseText;
                }
                retVal = data;
            }
            else {
                retVal = xhro.responseText;
            }

            if (showResponse) {
                if (retVal != null && typeof retVal !== "object" && retVal != "") {
                    alertResponse(retVal);
                }
            }

            if (ppFunction != null) {
                ppFunction(retVal);
            }
        }
        else if (xhro.readyState == 4 && xhro.status == 404) {
            offlineMode = true;
            if (showError) {
                connectionError();
            }

            if (ppFunction != null) {
                ppFunction(null);
            }
        }
    }

    if (paramArrayString != null) {
        xhro.send(paramArrayString);
    }
    else {
        xhro.send(null);
    }
}

function alertResponse(response) {
    alert(response);
}

function connectionError(ppFunction) {
    alert(CONNECTION_ERROR_MSG);
    if (ppFunction != null) {
        ppFunction(null);
    }
}

/* --- deprecated
function getRequest()
{
	var xmlHttp;

  try
  {
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
	    //Internet Explorer
	try
	{
	  xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch(e)
	{
	  try
	  {
	    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }
	  catch(e)
	  {
	    alert("Ihr Browser unterstützt kein AJAX!")
	        return false;
	      }
	    }
	  }
	  return xmlHttp;
}
*/
function loadFile(fileName, ppFunction, ppFunction2) {
    var php = GET_FILE_CONTENT_URL + "?filename=" + fileName;
    var req = openXhro("GET", php, "text");
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            ppFunction(req.responseText, ppFunction2);
        }
    }
    req.send(null);
}

function REDIR(url) {
    if (url != null && url != "") {
        window.location.href = url;
    }
    else {
        window.location.href = window.location.href;
    }
}

function createPostParam(name, value) {
    var o = new Object();
    o.name = name;
    o.value = value;
    return o;
}

function showGlassPaneWithPpF(state, ppFunction, optionalText, parentElement) {
    showGlassPane(state, true, optionalText == null ? "Daten werden geladen..." : optionalText, parentElement == null ? null : parentElement, null, "./images/ajax-loader.gif", "glassPanePpF", false, 100000);
    if (typeof ppFunction == "function") {
        window.setTimeout(ppFunction, 100);
    }
}

function showGlassPane(pEnable, pCenterTextVertical, pDisplayText, pParentElement, pClickHandler,
                       pImagePath, pId, pModalDialog, pZindex, ppFunction, fontSize) //added by RN
{
    /*
  pEnable [boolean]               ... enable/disable glass pane
  pCenterTextVertical [boolean]   ... center text on page vertically. if false: top of text = 14px -> center of header
  pDisplayText [string]           ... text to display on glass pane
  pParentElement [html element]   ... element to which the glass pane div is added. if null: document.body
  pClickHandler [function ref]    ... function to call when user clicks on glass pane
  pImagePath [string]             ... relative path to image shown on glass pane
  pId [string]                    ... ID of the glass pane
  pModalDialog [boolean]          ... use 'true', if glass pane is shown on the parent window of a dialog

  enable:
  e.g.: showGlassPane(true,true,"Bitte warten...",null,null,"/sam/images/ajax-loader.gif","someId",false);
  disable:
  e.g.: showGlassPane(false,null,null,null,null,null,"someId",false);
  */
    if (fontSize == null) {
        fontSize = "1rem";
    }

    var glassPane;
    var glassPaneText;
    var glassPaneImg;
    var parentIsDiv = false;
    var IE = (navigator.appVersion.indexOf("MSIE") == -1) ? false : true;
    var glassPaneParent;

    if (pId) {
        idAddition = "_" + pId;
    }
    else {
        idAddition = "";
    }

    if (pModalDialog && !pEnable) {
        glassPane = window.opener.document.getElementById("glassPaneDiv" + idAddition);
        glassPaneText = window.opener.document.getElementById("glassPaneTextDiv" + idAddition);
        glassPaneImg = window.opener.document.getElementById("glassPaneImgDiv" + idAddition);
        glassPaneParent = window.opener.document.body;
    }
    else {
        glassPane = GEBI("glassPaneDiv" + idAddition);
        glassPaneText = GEBI("glassPaneTextDiv" + idAddition);
        glassPaneImg = GEBI("glassPaneImgDiv" + idAddition);
        glassPaneParent = document.body;
    }

    if (pParentElement != null) {
        glassPaneParent = pParentElement;
        parentIsDiv = true;
    }
    else {
        glassPaneParent = document.body;
        parentIsDiv = false;
    }

    if (pEnable && glassPane == null) {
        glassPane = CREL("div");
        var viewportwidth;
        var viewportheight;
        var x0 = 0;
        var y0 = 0;

        if (parentIsDiv) {
            var size = getSize(glassPaneParent);
            viewportwidth = size.width;
            viewportheight = size.height;
            var position = getPosition(glassPaneParent);

            if (glassPaneParent != null && glassPaneParent.id != null && glassPaneParent.className == "window") {
                x0 = 0;
                y0 = 0;
            }
            else {
                x0 = position.x;
                y0 = position.y;
            }
        }
        else {
            viewportwidth = getWinSize().width;
            viewportheight = getWinSize().height;
            x0 = 0;
            y0 = 0;
        }

        glassPane.className = "glassPaneDiv";

        var styleString = "position:absolute; width:" + viewportwidth + "px;height:" + viewportheight + "px;";
        styleString += "left:" + x0 + "px;top:" + y0 + "px;" + (pZindex != null ? "z-index:" + pZindex + ";" : "");

        if (IE) {
            glassPane.style.width = viewportwidth + "px";
            glassPane.style.height = viewportheight + "px";
            glassPane.style.top = y0 + "px";
            glassPane.style.left = x0 + "px";
            if (pZindex != null) {
                glassPane.style.zIndex = pZindex;
            }
        }
        else {
            glassPane.setAttribute("style", styleString);
        }

        glassPane.setAttribute("id", "glassPaneDiv" + idAddition);

        if (pClickHandler != null) {
            glassPane.onclick = function (event) {
                pClickHandler(event)
            };
        }
        glassPaneParent.appendChild(glassPane);
        var textTop = 0;
        var textWidth = 0;
        var textHeight = 0;

        if (pDisplayText != null) {
            var textDiv = CREL("div");
            textDiv.setAttribute("id", "glassPaneTextDiv" + idAddition);
            textDiv.className = "glassPaneTextDiv";
            SIHTML(textDiv, pDisplayText);
            textDiv.style.fontSize = fontSize;

            glassPaneParent.appendChild(textDiv);
            glassPaneText = GEBI("glassPaneTextDiv" + idAddition);

            if (glassPaneText != null) {
                var textSize = getSize(glassPaneText);
                textWidth = textSize.width;
                textHeight = textSize.height;
            }
            else {
                textWidth = 0;
                textHeight = 0;
            }

            var textDivWidth = 0;
            if (!isNaN(textWidth)) {
                textDivWidth = textWidth * 1.5;
            }


            var textDivTop = y0 + viewportheight / 2 - textHeight;
            if (pCenterTextVertical && !isNaN(textDivTop)) {
                textDiv.style.top = textDivTop + "px";
            }
            else {
                textDiv.style.top = "5px";
                textDivTop = y0 + 5;
            }
            var textDivLeft = x0 + (viewportwidth - textDivWidth) / 2;
            if (!isNaN(textDivLeft)) {
                glassPaneText.style.left = textDivLeft + "px";
            }
            else {
                glassPaneText.style.left = "5px";
            }

            glassPaneText.style.width = textDivWidth + "px";
            if (pZindex != null) {
                glassPaneText.style.zIndex = pZindex + 1;
            }

            textTop = textDivTop;
        }

        if (pImagePath != null) {
            var imgDiv = CREL("div");

            var img = CREL("img");
            img.setAttribute("id", "waitImage" + idAddition);
            img.src = pImagePath;
            imgDiv.appendChild(img);
            imgDiv.setAttribute("id", "glassPaneImgDiv" + idAddition);
            imgDiv.className = "glassPaneImageDiv";

            glassPaneParent.appendChild(imgDiv);
            waitImg = GEBI("waitImage" + idAddition);
            glassPaneImg = GEBI("glassPaneImgDiv" + idAddition);
            var imgSize = getSize(waitImg);
            var imgWidth = imgSize.width;
            var imgHeight = imgSize.height;
            var imgTop;
            if (textTop == 0) {
                imgTop = y0 + viewportheight / 2 - imgHeight;
            }
            else {
                imgTop = textTop + textHeight + 5;
            }

            if (IE) {
                if (isNaN(imgTop)) {
                    imgTop = 5;
                }
                imgDiv.style.top = imgTop + "px";
            }
            else {
                var imgStyleString = "top:" + imgTop + "px;";
                imgDiv.setAttribute("style", imgStyleString);
            }

            if (IE) {
                var styleLeft = x0 + (viewportwidth - imgWidth) / 2;
                if (isNaN(styleLeft)) {
                    styleLeft = 0;
                }
                glassPaneImg.style.left = styleLeft + "px";
                if (pZindex != null) {
                    glassPaneImg.style.zIndex = pZindex + 1;
                }
            }
            else {
                glassPaneImg.setAttribute("style", glassPaneImg.getAttribute("style") + ("left:" + (x0 + (viewportwidth - imgWidth) / 2) + "px;") + (pZindex != null ? "z-index:" + (pZindex + 1) : ""));
            }
        }
        //alert("uuu")
        if (ppFunction != null) {
            window.setTimeout(ppFunction, 100);
        }
    }
    else if (!pEnable) {
        glassPane = GEBI("glassPaneDiv" + idAddition);
        glassPaneText = GEBI("glassPaneTextDiv" + idAddition);
        glassPaneImg = GEBI("glassPaneImgDiv" + idAddition);

        REMEL(GEBI("glassPaneDiv" + idAddition));
        REMEL(GEBI("glassPaneTextDiv" + idAddition));
        REMEL(GEBI("glassPaneImgDiv" + idAddition));
    }
}

function isOpenWindow(pWindow) {
    return (pWindow != null) && !pWindow.closed;
}

function getWindowPropertyEnabledString(pEnabled) {
    return (pEnabled ? 'yes' : 'no');
}

function getWindowWidth(pWindow) {
    if (isOpenWindow(pWindow)) {
        if (pWindow.window.innerWidth)                     // Mozilla Firefox
        {
            return pWindow.window.innerWidth;
        }
        else return pWindow.document.body.offsetWidth;     // Internet Explorer
    }
    else return -1;
}


function getWindowHeight(pWindow) {
    if (isOpenWindow(pWindow)) {
        if (pWindow.window.innerHeight)                    // Mozilla Firefox
        {
            return pWindow.window.innerHeight;
        }
        else return pWindow.document.body.offsetHeight;    // Internet Explorer
    }
    else return -1;
}


function getWindowOffsetX(pWindow) {
    if (pWindow.screenLeft) return pWindow.screenLeft;
    return pWindow.screenX;
}


function getWindowOffsetY(pWindow) {
    if (pWindow.screenTop) return pWindow.screenTop;
    return pWindow.screenY;
}

function openWindow(pUrl, pWindowName, pOffsetX, pOffsetY, pWindowWidth, pWindowHeight,
                    pDisplayScrollBars, pResizable, pDisplayStatus, pDisplayToolbar,
                    pDisplayMenuBar, pDependent, pIsModalWindow) {
    var newWindow;
    var offsetX;
    var offsetY;
    offsetX = pOffsetX;
//      if (offsetX < 0) offsetX = (screen.width - pWindowWidth)/2;
    var windowOffsetX = getWindowOffsetX(window);
    if (windowOffsetX == undefined) windowOffsetX = 0;
    if (offsetX < 0) offsetX = Math.max(0, getWindowWidth(window) / 2 + windowOffsetX - pWindowWidth / 2);
    offsetY = pOffsetY;
    if (offsetY < 0) offsetY = (screen.height - pWindowHeight) / 2;
    if (window.showModalDialog && pIsModalWindow) {
        newWindow = window.showModalDialog(pUrl, pWindowName,//,
            "dialogWidth=" + pWindowWidth + "px" +
            ";dialogHeight=" + pWindowHeight + "px" +
            ";dialogTop=" + offsetY + "px" +
            ";dialogLeft=" + offsetX + "px" +
            ";resizable=" + getWindowPropertyEnabledString(pResizable) +
            ";center=off" +
            ";width=" + pWindowWidth + "px" +
            ";height=" + pWindowHeight + "px" +
            ";left=" + offsetX + "px" +
            ";top=" + offsetY + "px" +
            ";scroll=" + getWindowPropertyEnabledString(pDisplayScrollBars) +
            ";scrollbars=" + getWindowPropertyEnabledString(pDisplayScrollBars) +
            ";status=" + getWindowPropertyEnabledString(pDisplayStatus) +
            ";toolbar=" + getWindowPropertyEnabledString(pDisplayToolbar) +
            ";menubar=" + getWindowPropertyEnabledString(pDisplayMenuBar) +
            ";dependent=" + getWindowPropertyEnabledString(pDependent));
    }
    else {
        newWindow = window.open(pUrl, pWindowName,
            "width=" + pWindowWidth + "px" +
            ",height=" + pWindowHeight + "px" +
            ",left=" + offsetX + "px" +
            ",top=" + offsetY + "px" +
            ",scrollbars=" + getWindowPropertyEnabledString(pDisplayScrollBars) +
            ",resizable=" + getWindowPropertyEnabledString(pResizable) +
            ",status=" + getWindowPropertyEnabledString(pDisplayStatus) +
            ",toolbar=" + getWindowPropertyEnabledString(pDisplayToolbar) +
            ",menubar=" + getWindowPropertyEnabledString(pDisplayMenuBar) +
            ",dependent=" + getWindowPropertyEnabledString(pDependent));
    }
    if (!pIsModalWindow) newWindow.focus();
    return newWindow;
}

function openCalendarFrom() {
    openDateTimeEditor("inputAnreise", false, false, " ", false, "./", language);
}

function openCalendarTo() {
    openDateTimeEditor("inputAbreise", false, false, " ", false, "./", language);
}

function getParam(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function createSpecialText(outerElem, text, largeFontSize, smallFontSize, fontFace, fontColor) {
    var textArray = text.split(" ");
    if (textArray.length > 0) {
        for (j = 0; j < textArray.length; j++) {
            for (var i = 0; i < 2; i++) {
                var font = CREL("font");
                SA(font, "face", fontFace);
                SA(font, "color", fontColor);

                if (i == 0) {
                    SA(font, "size", largeFontSize);
                    font.innerHTML = textArray[j].substring(0, 1);
                }
                else {
                    SA(font, "size", smallFontSize);
                    font.innerHTML = "<b>" + textArray[j].substring(1, textArray[j].length) + (j == textArray[j].length - 1 ? "" : " ") + "<\/b>";
                }

                AC(outerElem, font);
            }
        }
    }
}

function clearElements(elementArray) {
    if (elementArray == null || elementArray.length == 0) {
        return;
    }

    for (var i = 0; i < elementArray.length; i++) {
        clearElement(elementArray[i]);
    }
}

function clearElement(outerElement) {
    if (outerElement != null) {
        while (outerElement.firstChild) {
            outerElement.removeChild(outerElement.firstChild);
        }
    }
}

function screenshotMap(targetElem) {
    var nodesToRecover = [];
    var svgElemColl = targetElem.getElementsByTagName('svg');
    var svgElem = new Array();
    for (var i = 0; i < svgElemColl.length; i++) {
        svgElem.push(svgElemColl[i]);
    }
    var serializer = new XMLSerializer();
    //alert(svgElem.length)
    //convert all svg's to canvas, filling an arrays for turn back canvas to svg
    svgElem.forEach(function (node, index) {
        var parentNode = node.parentNode;

        //skip nested svg's in "parent" svg, canvg will handle "parent"
        if (parentNode != null && parentNode.tagName != 'DIV') {
            return true;
        }

        nodesToRecover.push({
            parent: parentNode,
            child: node
        });

        var canvas = CREL('canvas');
        var svg = parentNode.querySelector('svg');
        var svgString = serializer.serializeToString(svg);
        svgString = svgString.replace(/filter=/g, "filterOri=").replace(/<filter/g, "<filterOri").replace(/\/filter>/g, "\/filterOri>");
        //console.log(svgString)
        //canvg lib
        canvg(canvas, svgString,
            {
                ignoreMouse: true, ignoreAnimation: true
            });

        parentNode.removeChild(node);
        parentNode.appendChild(canvas);
    });

    //html2canvas lib, "screenshot map" download file
    html2canvas(targetElem, {
        //allowTaint: true,
        //useCORS:true,
        onrendered: function (canvas) {
            var project = getProject();

            var dateTimeFormatStringFromConfig = getConfigElement("DateTimeFormat");
            var dateTimeString = "";
            if (dateTimeFormatStringFromConfig != null) {
                var sdf = new SimpleDateFormat(dateTimeFormatStringFromConfig);
                dateTimeString = sdf.format(new Date());
            }
            else {
                dateTimeString = getDateTimeAsString(new Date(), true, "_", true, false).replace(/\./g, "-").replace(":", "");
            }

            canvas.toBlob(function (blob) {
                saveAsQuestion(blob, ".jpg", "Screenshot_" + project.title + "_" + dateTimeString + ".jpg");
            }, "image/jpeg", 1);

            showGlassPane(false, true, "Screenshot wird erstellt...", null, null, "./images/ajax-loader.gif", "screenshot", false, 53000);

            //removing canvas, turn back svg's
            var canvasElemColl = targetElem.getElementsByTagName('canvas');
            var canvasElem = new Array();
            for (var i = 0; i < canvasElemColl.length; i++) {
                canvasElem.push(canvasElemColl[i]);
            }
            canvasElem.forEach(function (node, index) {
                var parentNode = node.parentNode;
                parentNode.removeChild(node);
                parentNode.appendChild(nodesToRecover[index].child);
            });
        }
    });
}

function base64_encode(data) {
    //  discuss at: http://phpjs.org/functions/base64_encode/
    // original by: Tyler Akins (http://rumkin.com)
    // improved by: Bayron Guevara
    // improved by: Thunder.m
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Rafał Kukawski (http://kukawski.pl)
    // bugfixed by: Pellentesque Malesuada
    //   example 1: base64_encode('Kevin van Zonneveld');
    //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    //   example 2: base64_encode('a');
    //   returns 2: 'YQ=='
    //   example 3: base64_encode('✓ à la mode');
    //   returns 3: '4pyTIMOgIGxhIG1vZGU='

    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = unescape(encodeURIComponent(data));

    do {
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            })).replace(/\+/g, "#PL#");
    }
    catch (e) {
        logger.error("b64EncodeUnicode: " + e);
        return str;
    }
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    try {
        return decodeURIComponent(atob(str.replace(/#PL#/g, "+")).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    catch (e) {
        logger.error("b64DecodeUnicode: " + e);
        return str;
    }
}

function base64_decode(data) {
    //  discuss at: http://phpjs.org/functions/base64_decode/
    // original by: Tyler Akins (http://rumkin.com)
    // improved by: Thunder.m
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Onno Marsman
    // bugfixed by: Pellentesque Malesuada
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: base64_decode('YQ===');
    //   returns 2: 'a'
    //   example 3: base64_decode('4pyTIMOgIGxhIG1vZGU=');
    //   returns 3: '✓ à la mode'

    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {
        // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
}

function drawInlineSVG(canvas, rawSVG, callback, size) {
    var ctx = canvas != null ? canvas.getContext("2d") : null;
    if (ctx == null) {
        callback(null);
        return;
    }
    //console.log(rawSVG);
    //rawSVG="<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 255.12 170'><title>fin</title><g class='cls-1'><g id='Ebene_2' data-name='Ebene 2'><path class='cls-2' d='M239.73,116.49l-.36-16.14a.74.74,0,0,0,0-.16l-1.28-5.32L235.2,78.78a.74.74,0,0,0-.63-.58L220,78a.74.74,0,0,0-.83.8l0,1.41a.74.74,0,0,1-.77.8l-12.56-.5a.74.74,0,0,1-.69-.58l-5.83-25s-.25-1-.32-1.35.21-.62.66-.62l1.6-.19c.51,0,.56-1.08.56-1.59l-.09-.91a.74.74,0,0,0-.74-.74l-38.28-.18a.74.74,0,0,1-.66-.4,22.26,22.26,0,0,0-1.63-2.81.73.73,0,0,1,.26-1.08c4.55-2.29,11.52-2.93,12-3h.06L198.22,42a.74.74,0,0,0,.74-.74V35.86a.74.74,0,0,0-.33-.62h0a4.6,4.6,0,0,0-2.55-.77H163a7.06,7.06,0,0,0-3.07.6l-.07,0-11,7.18c-5.6,3.22-12.92,9.76-13.49,10.27l-.08.06-6.66,4.56a10,10,0,0,1-3.94,1.49h-.07L48.3,58.55h0c-4.24.23-6,1.42-6.28,1.59l-.07,0L28,68.11a41,41,0,0,1-12.35,4.46H7.28a.74.74,0,0,0-.74.71l-.08,1.77a.74.74,0,0,0,.13.46l2.32,3.34a.74.74,0,0,0,1,.22l2-1.15a.74.74,0,0,1,.51-.08l8.32,1.81c.33.06,1.33.25,1.55.74a21.69,21.69,0,0,1,.78,3.47c.15.69,1.24,1.06,2,.14l2-2.14c.38-.51,1.31-.14,1.59,0l9.23,3,.1,0,15.32,2.72h0c4.12.44,5.53,1.32,6.59,2.75.53.72,1.3,2.64,2.16,2.83,1,.25,1.61-.83,1.74-1,1.23-1.3,2.27-2.82,6.52-2.94a.76.76,0,0,1,.49.2l3.89,4a.74.74,0,0,1-.49,1.25A28.57,28.57,0,0,0,47.9,123.48c0,15.91,12.65,28.8,28.24,28.8s28.24-12.89,28.24-28.8c0-.08,0-.67-.05-1.2a.74.74,0,0,1,.84-.77l1.24.16h0L111,122a.74.74,0,0,1,.62.44l.36.81a.74.74,0,0,1-.14.81c-3.53,3.72-.2,6.45.13,6.71l.05,0a4.22,4.22,0,0,0,5.51-.35.74.74,0,0,1,1.24.42v0a.74.74,0,0,0,.73.62h22.88a.74.74,0,0,0,.74-.7l.1-1.62a.74.74,0,0,1,.71-.7l7.62-.32a.74.74,0,0,1,.76.6c.13.66.28,1.27.44,1.82A28.15,28.15,0,0,0,208.18,127c.06.17.09.26.09.26l31.53-.37a.74.74,0,0,1,.24,0l1.6.53a.74.74,0,0,0,.84-.27l2.35-3.29a.74.74,0,0,0,.14-.38l.14-2a.74.74,0,0,0-.28-.63L240,117.06A.74.74,0,0,1,239.73,116.49Z'/><path class='cls-3' d='M17.25,72.4l60-37.61h40.59l25.13,11.54s-7.68,6.29-14.15,11.36c-.93.73-2,.94-4.65.93l-77.2-.13a7.52,7.52,0,0,0-2.85.94L28.54,68.36S20.6,72.34,17.25,72.4Z'/><path class='cls-4' d='M180.47,94.43c-15.6,0-28.24,12.89-28.24,28.8S164.87,152,180.47,152s28.24-12.89,28.24-28.8S196.07,94.43,180.47,94.43Zm0,41.76c-6.84,0-12.41-5.82-12.41-13s5.57-13,12.41-13,12.41,5.82,12.41,13S187.32,136.2,180.47,136.2Z'/><path class='cls-4' d='M76.46,95c-15.6,0-28.24,12.89-28.24,28.8s12.65,28.8,28.24,28.8,28.24-12.89,28.24-28.8S92.06,95,76.46,95Zm0,41.76c-6.84,0-12.41-5.82-12.41-13s5.57-13,12.41-13,12.41,5.82,12.41,13S83.31,136.72,76.46,136.72Z'/><path class='cls-4' d='M160.83,45.15a50.06,50.06,0,0,1,12-3h.06L198.32,42a.74.74,0,0,0,.74-.74V35.86a.74.74,0,0,0-.33-.62h0a4.6,4.6,0,0,0-2.55-.77H163.07a7.06,7.06,0,0,0-3.07.6l-.07,0-11,7.18c-5.6,3.22-12.92,9.76-13.49,10.27l-.08.06-6.66,4.56a10,10,0,0,1-3.94,1.49h-.07L48.4,58.55h0c-4.24.23-6,1.42-6.28,1.59l-.07,0L28.15,68.11A41,41,0,0,1,15.8,72.57H7.38a.74.74,0,0,0-.74.71l-.08,1.77a.74.74,0,0,0,.13.46L9,78.85a.74.74,0,0,0,1,.22l2-1.15a.74.74,0,0,1,.51-.08l8.32,1.81c.33.06,1.33.25,1.55.74a21.69,21.69,0,0,1,.78,3.47c.15.69,1.24,1.06,2,.14l2-2.14c.38-.51,1.31-.14,1.59,0l9.23,3,.1,0,15.32,2.72h0c4.12.44,5.53,1.32,6.59,2.75.53.72,1.3,2.64,2.16,2.83,1,.25,1.61-.83,1.74-1,1.23-1.3,2.27-2.82,6.52-2.94a.76.76,0,0,1,.49.2L76.5,92l21.33,4.5s28.33,4.5,37.5,3.67l3-11.83,3.83.83L153.5,52.83S156.32,47.13,160.83,45.15Z'/></g></g></svg>";
    //rawSvg="<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='30' width='200'><text x='0' y='15' fill='red'>I love SVG!</text>Sorry, your browser does not support inline SVG.</svg>";
    var svg = new Blob([rawSVG], {type: "image/svg+xml;charset=utf-8"}),
        domURL = self.URL || self.webkitURL || self,
        url = domURL.createObjectURL(svg),
        img = new Image;

    img.onload = function () {
        canvas.width = img.width == 0 ? size.width : img.width;
        canvas.height = img.height == 0 ? size.height : img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this, 0, 0);
        domURL.revokeObjectURL(url);
        callback(canvas.toDataURL());
        img = null;
        svg = null;
    };

    img.src = url;
}

function setTransform(element, rotationArg, scaleArg, skewXArg, skewYArg) {
    var transfromString = ("rotate(" + rotationArg + "deg ) scale(" + scaleArg
        + ") skewX(" + skewXArg + "deg ) skewY(" + skewYArg + "deg )");

    // now attach that variable to each prefixed style
    element.style.webkitTransform = transfromString;
    element.style.MozTransform = transfromString;
    element.style.msTransform = transfromString;
    element.style.OTransform = transfromString;
    element.style.transform = transfromString;
}

function setTransformArg(element, elTransformArg) {
    var transfromString = ("rotate(" + elTransformArg.rot + "deg ) scale("
        + elTransformArg.sca + ") skewX(" + elTransformArg.skx + "deg ) skewY("
        + elTransformArg.sky + "deg )");

    // now attach that variable to each prefixed style
    element.style.webkitTransform = transfromString;
    element.style.MozTransform = transfromString;
    element.style.msTransform = transfromString;
    element.style.OTransform = transfromString;
    element.style.transform = transfromString;
}

function setRadioValue(name, id, value, state) {
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (id != null && radios[i].id == id || value != null && radios[i].value == value) {
            if (state) {
                SA(radios[i], "checked", "checked");
                radios[i].checked = true;
            }
            else {
                RA(radios[i], "checked");
                radios[i].checked = false;
            }
        }
    }
}

function getRadioValue(name) {
    var radios = document.getElementsByName(name);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return (radios[i].value);
            break;
        }
    }
    return null;
}

function addDragDropEvents(element, dragStart, drag, drop) {
    if (element == null) {
        return;
    }
    var isMobile = isMobileDevice();
    if (isMobile) {
        element.addEventListener("touchstart", dragStart);
        element.addEventListener("touchmove", drag);
        element.addEventListener("touchend", drop);
    }
    else {
        element.addEventListener("mousedown", dragStart);
        element.addEventListener("mousemove", drag);
        element.addEventListener("mouseup", drop);
    }
}

function isMobileDevice() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    else {
        return false;
    }
}

function compassHeading(alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;
    var rC = -cB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
        compassHeading += Math.PI;
    } else if (rA < 0) {
        compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
}

function correctAlpha(alpha) {
    if (alpha != null) {
        alpha = 360 - alpha;
    }

    if (alpha != null && compassOffset !== null && compassOffset !== 0) {
        alpha = alpha + Number(compassOffset);
        if (alpha > 360) {
            alpha = alpha - 360;
        }
        else if (alpha < 0) {
            alpha = alpha + 360;
        }
    }

    return alpha;
}

function correctBeta(beta) {
    if (beta != null && betaOffset != null) {
        beta = beta + Number(betaOffset);
    }
    return beta;
}

function correctGamma(gamma) {
    if (gamma != null && gammaOffset != null) {
        gamma = gamma + Number(gammaOffset);
    }
    return gamma;
}

function setStatusRowOK(id, state, text) {
    if (state) {
        GEBI(id, true).style.display = "";
        if (text == null) {
            GEBI(id + "Td", true).innerHTML = "OK";
        }
        else {
            GEBI(id + "Td", true).innerHTML = "OK - " + text;
        }
        GEBI(id, true).className = "statusRowOk";
    }
    else {
        GEBI(id, true).style.display = "none";
    }
}

function setStatusRowERROR(id, state, text) {
    if (state) {
        GEBI(id, true).style.display = "";
        GEBI(id + "Td", true).innerHTML = "FEHLER" + (text != null ? " - " + text : "");
        GEBI(id, true).className = "statusRowError";
    }
    else {
        GEBI(id, true).style.display = "none";
    }
}

function showModalDiv(id, state, relWidth, relHeight, zIndexGP,
                      zIndex, specialGPid, closeFunction, scaleToContent, forceWidth,
                      postResizeFunction, positionTopZero, dockedTo) {
    showGlassPane(state, true, null, null, null, null, specialGPid != null ? specialGPid : "wait", false, zIndexGP);

    if (state) {
        var confObj = windows.getConfigObjectFromArray(id);
        if (confObj != null) {
            windows.showWindowDiv(confObj);
        }
        else {
            var div = GEBI(id);
            if (div == null) {
                div = GEBI("window_div_" + id, true);
            }
            div.style.height = "";
            div.style.width = "";
            var widthMultFactor = 1;//GUI_ZOOM_FACTOR;
            if (forceWidth === true) {
                widthMultFactor = 1;
            }
            var confObj = windows.createWinConfigObj(id, null, relWidth * widthMultFactor, relHeight, positionTopZero ? -1 : null,
                null, true, zIndex, false, true,
                closeFunction, true, true, true, false,
                null, scaleToContent, null, postResizeFunction, dockedTo);
            confObj = windows.modifyDiv(confObj, div);
            confObj.state = "opened";
        }
    }
    else {
        closeMenus();
        var confObj = windows.getConfigObjectFromArray(id);

        windows.hideWindowDiv(confObj);

        if (isMobileDevice()) {
            document.body.removeEventListener("touchstart", this.startDrag);
            document.body.removeEventListener("touchmove", this.moveDrag);
            document.body.removeEventListener("touchend", this.endDrag);
        }
        else {
            document.body.removeEventListener("mousedown", this.startDrag);
            document.body.removeEventListener("mousemove", this.moveDrag);
            document.body.removeEventListener("mouseup", this.endDrag);
        }
    }
}

function showDiv(id, state, relWidth, relHeight, zIndexGP,
                 specialGPid, closeFunction, isModifiedDiv, scaleToContent, closeParam,
                 positionTopZero, forceWidth, postResizeFunction, dockedTo, resizeable) {
    var confObj = windows.getConfigObjectFromArray(id);
    if (resizeable == null) {
        resizeable = true;
    }
    if (state) {
        if (isModifiedDiv) {
            if (confObj != null) {
                windows.showWindowDiv(confObj);
            }
            else {
                var div = GEBI(id);
                if (div == null) {
                    div = GEBI("window_div_" + id);
                }
                if (div == null) {
                    return;
                }

                div.style.height = "";
                div.style.width = "";
                var widthMultFactor = 1;//GUI_ZOOM_FACTOR;
                if (forceWidth === true) {
                    widthMultFactor = 1;
                }
                var confObj = windows.createWinConfigObj(id, null, relWidth * widthMultFactor, relHeight, positionTopZero ? -1 : null,
                    null, true, 52000, false, true,
                    closeFunction, true, false, false, false,
                    null, scaleToContent, closeParam, postResizeFunction, dockedTo,
                    resizeable);
                confObj = windows.modifyDiv(confObj, div);
                confObj.state = "opened";
            }
        }
        else {
            var div = GEBI(id);
            showGlassPane(state, true, null, null, null, null, specialGPid != null ? specialGPid : "wait", false, zIndexGP);

            if (div != null && state && div.style.display != "") {
                div.style.display = "";

                var divWidth = relWidth != null ? getWinSize().width * relWidth * GUI_ZOOM_FACTOR : null;
                var divHeight = relHeight != null ? getWinSize().height * relHeight * GUI_ZOOM_FACTOR : null;

                if (divWidth != null) {
                    div.style.left = (getWinSize().width - divWidth) / 2 + "px";
                    div.style.width = divWidth + "px";
                }
                else {
                    div.style.left = (getWinSize().width - getSize(div).width) / 2 + "px";
                }

                if (divHeight != null) {
                    div.style.top = (getWinSize().height - divHeight) / 4 + "px";
                    div.style.height = divHeight + "px";
                }
                else {
                    div.style.top = (getWinSize().height - getSize(div).height) / 4 + "px";
                }

                REMEL(GEBI(id + "_closeBtn"));
                if (closeFunction != null) {
                    var closeBtn = createCloseImgButton(id + "_closeBtn", "X", closeFunction, false, true, false, null);
                    closeBtn.style.position = "absolute";
                    closeBtn.style.zIndex = "50999";
                    document.body.appendChild(closeBtn);
                    closeBtn.style.left = getPosition(div).x + getSize(div).width - getSize(closeBtn).width / 2 + 14 + "px";
                    closeBtn.style.top = getPosition(div).y - getSize(closeBtn).height / 2 + "px";
                }
            }
        }
    }
    else {
        closeMenus();
        var confObj = windows.getConfigObjectFromArray(id);
        if (confObj != null) {
            windows.hideWindowDiv(confObj);

            if (isMobileDevice()) {
                document.body.removeEventListener("touchstart", this.startDrag);
                document.body.removeEventListener("touchmove", this.moveDrag);
                document.body.removeEventListener("touchend", this.endDrag);
            }
            else {
                document.body.removeEventListener("mousedown", this.startDrag);
                document.body.removeEventListener("mousemove", this.moveDrag);
                document.body.removeEventListener("mouseup", this.endDrag);
            }
        }

        var div = GEBI(id);
        if (div == null) {
            div = GEBI("window_div_" + id);
        }
        if (div == null) {
            return;
        }
        else {
            div.style.display = "none";
            REMEL(GEBI(id + "_closeBtn"));
        }
    }
}

function getDateTimeString() {
    var dateTimeFormatStringFromConfig = getConfigElement("DateTimeFormat");
    if (dateTimeFormatStringFromConfig != null) {
        var sdf = new SimpleDateFormat(dateTimeFormatStringFromConfig);
        return sdf.format(new Date());
    }
    else {
        return getDateTimeAsString(new Date(), true, "_", true, false).replace(/\./g, "-").replace(":", "");
    }
}

function getDefaultProjectFileName(projectObj) {
    if (projectObj == null) {
        return "project";
    }

    if (projectObj.title != null) {
        return projectObj.title;
    }

    if (projectObj.id != null) {
        return projectObj.id;
    }

    return "project";
}

function getFilenameFromPath(path) {
    if (path == null) {
        return null;
    }
    if (path.indexOf("/") == -1 && path.indexOf(".") > -1) {
        return path;
    }
    var fileName = path.substring(path.lastIndexOf("/") + 1, path.length);
    return fileName;
}

function getFilename(prefix, dateTimeformat, postfix, extension, addDateTime) {
    var dateTimeString = "";
    if (dateTimeformat != null) {
        dateTimeString = new SimpleDateFormat(dateTimeformat);
    }
    else {
        var dateTimeFormatStringFromConfig = getConfigElement("DateTimeFormat");

        if (dateTimeFormatStringFromConfig != null) {
            var sdf = new SimpleDateFormat(dateTimeFormatStringFromConfig);
            dateTimeString = sdf.format(new Date());
        }
        else {
            dateTimeString = getDateTimeAsString(new Date(), true, "_", true, false).replace(/\./g, "-").replace(":", "");
        }
    }

    var fileName = "default";
    if (getConfigElement("addDateTimeToFilename") == "true" || addDateTime) {
        if (prefix.substring(prefix.length - 1, prefix.length) != "_") {
            prefix = prefix + "_";
        }

        fileName = (prefix != null ? prefix : "") + dateTimeString + (postfix != null ? postfix : "") + (extension != null ? ("." + extension) : "");
    }
    else {
        fileName = (prefix != null ? prefix : "") + (postfix != null ? "_" + postfix : "") + (extension != null ? ("." + extension) : "");
    }
    return fileName;
}

function isJsonObjString(str) {
    if (str == null) {
        return false;
    }
    str = String(str);
    if (str.startsWith("{") && str.endsWith("}")) {
        return true;
    }
    return false;
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        //logger.error("JSON-String ungueltig! -> "+str);
        return false;
    }
    return true;
}

function correctJsonData(data) {
    if (data == null) {
        return null;
    }
    if (data.substring(0, 1) != "{") {
        var bracketIndex = data.indexOf("{");
        if (bracketIndex > -1) {
            data = data.substring(bracketIndex, data.length);
        }
    }

    if (data.substring(data.length - 1, data.length) != "}") {
        var bracketIndex = data.length;
        for (var i = data.length; i > 0; i--) {
            if (data.substring(i - 1, i) == "}") {
                data = data.substring(0, i);
                break;
            }
        }
    }

    return data;
}

function correctBase64Str(str) {
    if (str == null) {
        return null;
    }
    str = str.replace(/ /g, '+');
    return str;
}

function cancelEvent(e, c) {
    e.returnValue = false;
    if (e.preventDefault) {
        e.preventDefault();
    }

    if (c) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    }
};

function askForNewFilename(extension, filename) {
    var newFileName = prompt("Bitte geben sie einen Dateinamen ein" + (extension != null ? ". (Erweiterung: '" + extension + "'):" : ":"), filename);
    if (newFileName == null || newFileName == "") {
        return null;
    }

    if (extension != null) {
        if (!newFileName.toUpperCase().endsWith(extension.toUpperCase())) {
            newFileName = newFileName + extension;
        }
    }

    return newFileName;
}

function saveAsQuestion(blob, extension, filename) {
    var newFileName = prompt("Bitte geben sie einen Dateinamen ein" + (extension != null ? ". (Erweiterung: '" + extension + "'):" : ":"), filename);
    if (newFileName == null || newFileName == "") {
        return;
    }

    if (extension != null) {
        if (!newFileName.toUpperCase().endsWith(extension.toUpperCase())) {
            newFileName = newFileName + extension;
        }
    }

    saveAs(blob, newFileName);
}

function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

function selectElementData(event, type, duration) {
    if (event != null) {
        var elem = getElementFromEvent(event);
        if (elem != null) {
            var content = GIHTML(elem);
            if (content != null) {
                var oriCol = elem.style.color;
                elem.style.color = "red";
                var contentString = content;
                if (type == "numberOnly") {
                    contentString = contentString.replace(/[^a-zA-Z0-9.]+/g, " ");
                    contentString = contentString.trim();
                }

                var selection = window.getSelection();
                selection.removeAllRanges();
                var range = document.createRange();

                var newElem = CREL("td");
                newElem.id = "tempCopyElem_" + NOW();
                SIHTML(newElem, contentString);
                AC(document.body, newElem);
                range.selectNode(newElem);
                selection.addRange(range);
                window.setTimeout(function () {
                    REMEL(GEBI(newElem.id));
                    elem.style.color = oriCol;
                }, (duration == null ? 1000 : duration));
            }
        }
    }
}

function searchInChildren(element, id, name, className, retArray, partOnly) {
    if (element == null || (id == null && name == null && className == null)) {
        return retArray;
    }

    var children = element.children;
    if (children == null || children.length == undefined) {
        return retArray;
    }

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (id != null) {
            if (child != null) {
                if (partOnly && (child.id != null && child.id.indexOf(id) > -1) || !partOnly && child.id == id) {
                    retArray.push(child);
                }
            }
        }
        else if (name != null) {
            if (child != null && GA(child, "name") == name) {
                if (partOnly && (GA(child, "name") != null && GA(child, "name").indexOf(name) > -1) || !partOnly && GA(child, "name") == name) {
                    retArray.push(child);
                }
            }
        }
        else if (className != null) {
            if (child != null && child.className == className) {
                if (partOnly && (child.className != null && child.className.indexOf(className) > -1) || !partOnly && child.className == className) {
                    retArray.push(child);
                }
            }
        }
        var childChildren = child.children;
        if (childChildren != null && childChildren.length > 0) {
            retArray = searchInChildren(child, id, name, className, retArray, partOnly);
        }
    }
    return retArray;
}

function radians(n) {
    return n * (Math.PI / 180);
}

function degrees(n) {
    return n * (180 / Math.PI);
}

function calculateBearing(startLat, startLong, endLat, endLong) {
    startLat = radians(startLat);
    startLong = radians(startLong);
    endLat = radians(endLat);
    endLong = radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
        if (dLong > 0.0)
            dLong = -(2.0 * Math.PI - dLong);
        else
            dLong = (2.0 * Math.PI + dLong);
    }

    return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function convertValToOtherVal(value, value1, value2, value3, value4) {
    if (value == value1) {
        return value3;
    }
    else if (value == value2) {
        return value4;
    }
    else {
        return value;
    }
}

function makeId(length) {
    if (length == null) {
        length = 8;
    }
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function CLO(obj) {
    return cloneObj(obj);
}

function cloneArray(arr) {
    if (arr == null) {
        return null;
    }
    return arr.slice();
}

function cloneObj(obj) {
    if (obj == null) {
        return null;
    }
    try {
        return JSON.parse(JSON.stringify(obj))
        //return (typeof obj === 'object')?Object.assign({}, obj):(Array.isArray(obj)?obj.slice():JSON.parse(JSON.stringify(obj)));
    }
    catch (e) {
        logger.error("Fehler beim Klonen des Objekts!\n" + e);
        return null;
    }
}

function resourceExists(url) {
    var http = getXhro();
    if (url != null) {
        url = url.replace(/\r/g, "");
    }

    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

/** Compat functions, mainly for IE8 */

// From: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function forEach(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError("this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (Object.prototype.hasOwnProperty.call(O, k)) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

/*! getEmPixels  | Author: Tyson Matanich (http://matanich.com), 2013 | License: MIT */
(function (n, t) {
    "use strict";
    var i = "!important;",
        r = "position:absolute" + i + "visibility:hidden" + i + "width:1rem" + i + "font-size:1rem" + i + "padding:0" + i;
    window.getEmPixels = function (u) {
        var f, e, o;
        return u || (u = f = n.createElement("body"), f.style.cssText = "font-size:1rem" + i, t.insertBefore(f, n.body)), e = n.createElement("i"), e.style.cssText = r, u.appendChild(e), o = e.clientWidth, f ? t.removeChild(f) : u.removeChild(e), o
    }
})(document, document.documentElement);

/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 *
 * Description: Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 */

Element.prototype.isVisible = function () {

    'use strict';

    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode,
            VISIBLE_PADDING = 2;

        if (!_elementInDocument(el)) {
            return false;
        }

        //-- Return true for document node
        if (9 === p.nodeType) {
            return true;
        }

        //-- Return false if our element is invisible
        if (
            '0' === _getStyle(el, 'opacity') ||
            'none' === _getStyle(el, 'display') ||
            'hidden' === _getStyle(el, 'visibility')
        ) {
            return false;
        }

        if (
            'undefined' === typeof(t) ||
            'undefined' === typeof(r) ||
            'undefined' === typeof(b) ||
            'undefined' === typeof(l) ||
            'undefined' === typeof(w) ||
            'undefined' === typeof(h)
        ) {
            t = el.offsetTop;
            l = el.offsetLeft;
            b = t + el.offsetHeight;
            r = l + el.offsetWidth;
            w = el.offsetWidth;
            h = el.offsetHeight;
        }
        //-- If we have a parent, let's continue:
        if (p) {
            //-- Check if the parent can hide its children.
            if (('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow'))) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if (el.offsetParent === p) {
                l += p.offsetLeft;
                t += p.offsetTop;
            }
            //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }

    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
        if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[property];
        }
        if (el.currentStyle) {
            return el.currentStyle[property];
        }
    }

    function _elementInDocument(element) {
        while (element = element.parentNode) {
            if (element == document) {
                return true;
            }
        }
        return false;
    }

    return _isVisible(this);

};

var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

function printCanvas(canvas, width, height) {
    var dataUrl = canvas.toDataURL(); //attempt to save base64 string to server using this var
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Code</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open('', '', "width=" + width + ",height=" + height);
    printWin.document.open();
    printWin.document.write(windowContent);
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
}

function simulate(element, eventName) {
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents') {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

function changeCSS(cssFile, cssLinkIndex) {
    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = CREL("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function sortSelect(selElem, attributes) {
    var tmpAry = new Array();
    for (var i = 0; i < selElem.options.length; i++) {
        tmpAry[i] = new Array();
        for (var j = 0; j < attributes.length; j++) {
            if (attributes[j] == "text") {
                tmpAry[i][j] = GIHTML(selElem.options[i]);
            }
            else {
                tmpAry[i][j] = GA(selElem.options[i], attributes[j]);
            }
        }
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
        var op = CREL("option");
        for (var j = 0; j < attributes.length; j++) {
            if (attributes[j] == "text") {
                SIHTML(op, tmpAry[i][j]);
            }
            else {
                SA(op, attributes[j], tmpAry[i][j]);
            }
        }
        selElem.options[i] = op;
    }
    return;
}

function getBodyScrollTop() {
    var e1 = document.documentElement;
    var e2 = document.body.parentNode;
    var e3 = document.body;

    var st = e1 !== undefined ? e1.scrollTop : null;
    if (st === null || st === 0) {
        st = e2 !== undefined ? e2.scrollTop : null;
        if (st === null || st === 0) {
            st = e3 !== undefined ? e3.scrollTop : 0;
            return st;
        }
        else if (st > 0) {
            return st;
        }
    }
    else if (st > 0) {
        return st;
    }
}

function exportObjByFormat(exportFormat, obj, csvSeperator, csvLineSeperator, fileName) {
    if (exportFormat == "CSV") {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var expString = "";

            var csvSep = csvSeperator;
            var csvListSep = csvLineSeperator;

            showGP(true, null, null);
            window.setTimeout(function () {
                for (var i = 0; i < obj.length; i++) {
                    var rowStr = i + csvSep + obj[i] + "\r\n";
                    expString = expString + rowStr;
                }

                var indexToSaveString = expString;
                var blob = new Blob([indexToSaveString], {type: "text/plain;charset=utf-8"});
                saveAs(blob, fileName + ".csv");
                showGP(false, null, null);
            }, 10);
        }
        else {
            alert("Das zu exportierende Objekt ist kein Array! Export als CSV nicht möglich.");
            return null;
        }
    }
    else if (exportFormat == "XML") {
        showGP(true, null, null);
        window.setTimeout(function () {
            var indexToSaveString = json2xml.convert(obj);
            var blob = new Blob([indexToSaveString], {type: "text/plain;charset=utf-8"});
            saveAs(blob, fileName + ".xml");
            showGP(false, null, null);
        }, 10);
    }
    else if (exportFormat == "JSON") {
        showGP(true, null, null);
        window.setTimeout(function () {
            var indexToSaveString = JSON.stringify(obj);
            var blob = new Blob([indexToSaveString], {type: "text/plain;charset=utf-8"});
            saveAs(blob, fileName + ".json");
            showGP(false, null, null);
        }, 10);
    }
    else {
        alert("'" + exportFormat + "' wird nicht unterstützt. Bitte wählen sie CSV, XML oder JSON.");
        return null;
    }
}

function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {type: contentType});
}

function utf8_decode(str_data) {
    //  discuss at: http://phpjs.org/functions/utf8_decode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    //    input by: Aman Gupta
    //    input by: Brett Zamir (http://brett-zamir.me)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Norman "zEh" Fuchs
    // bugfixed by: hitwork
    // bugfixed by: Onno Marsman
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: kirilloid
    // bugfixed by: w35l3y (http://www.wesley.eti.br)
    //   example 1: utf8_decode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [],
        i = 0,
        c1 = 0,
        seqlen = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i) & 0xFF;
        seqlen = 0;

        // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
        if (c1 <= 0xBF) {
            c1 = (c1 & 0x7F);
            seqlen = 1;
        } else if (c1 <= 0xDF) {
            c1 = (c1 & 0x1F);
            seqlen = 2;
        } else if (c1 <= 0xEF) {
            c1 = (c1 & 0x0F);
            seqlen = 3;
        } else {
            c1 = (c1 & 0x07);
            seqlen = 4;
        }

        for (var ai = 1; ai < seqlen; ++ai) {
            c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
        }

        if (seqlen == 4) {
            c1 -= 0x10000;
            tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
        } else {
            tmp_arr.push(String.fromCharCode(c1));
        }

        i += seqlen;
    }

    return tmp_arr.join("");
}

function isIE() {
    return detectIE() !== false;
}

function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 (aka Edge) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function getMouseXY(e) {
    var ev = e;
    if (isMobileDevice()) {
        var touches = e.changedTouches[0];
        ev = touches;
    }

    if (detectIE()) { // grab the x-y pos.s if browser is IE
        tempX = ev.clientX + document.body.scrollLeft
        tempY = ev.clientY + document.body.scrollTop
    } else {  // grab the x-y pos.s if browser is NS
        tempX = ev.pageX
        tempY = ev.pageY
    }
    // catch possible negative values in NS4
    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }
    // show the position values in the form named Show
    // in the text fields named MouseX and MouseY
    return {x: tempX, y: tempY}
}

function normalCdf(X) {   //HASTINGS.  MAX ERROR = .000001
    var T = 1 / (1 + .2316419 * Math.abs(X));
    var D = .3989423 * Math.exp(-X * X / 2);
    var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
        Prob = 1 - Prob;
    }
    return Prob;
}

function stopDefault(evt) {
    evt = evt || window.event;
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    } else if (window.event && window.event.returnValue) {
        window.event.returnValue = false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

var newFormData = function newFormData() {
    if (window.FormData == undefined) {
        this.processData = true;
        this.contentType = 'application/x-www-form-urlencoded';
        this.append = function (name, value) {
            this[name] = value == undefined ? "" : value;
            return true;
        }
    }
    else {
        var formdata = new FormData();
        formdata.processData = false;
        formdata.contentType = false;
        return formdata;
    }
}

function sizeof(object) {
    if (object !== null && typeof (object) === 'object') {
        if (Buffer.isBuffer(object)) {
            return object.length;
        }
        else {
            var bytes = 0;
            for (var key in object) {

                if (!Object.hasOwnProperty.call(object, key)) {
                    continue;
                }

                bytes += sizeof(key);
                try {
                    bytes += sizeof(object[key]);
                } catch (ex) {
                    if (ex instanceof RangeError) {
                        // circular reference detected, final result might be incorrect
                        // let's be nice and not throw an exception
                        bytes = 0;
                    }
                }
            }
            return bytes;
        }
    } else if (typeof (object) === 'string') {
        return object.length * 2;
    } else if (typeof (object) === 'boolean') {
        return 4;
    } else if (typeof (object) === 'number') {
        return 8;
    } else {
        return 0;
    }
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return {"hours": hours, "minutes": minutes, "seconds": seconds, "milliseconds": milliseconds};
}

var progBar =
    {
        /*
	async function calc()
	{
		var pBar=progBar.init("test");
	    var valu;
	    for(var i=0;i<100000000;i++)
	    {
	    	valu=1/100000000*i;
	    	if(i%10000000==0)
	    	{
	    		await pBar.update(pBar,valu);
	    	}
	    }
	    pBar.finish();
	}
	*/
        init: function (idParam) {
            REMEL(GEBI("progressBar_" + idParam));
            var progDiv = CREL("div");
            progDiv.id = "progressBar_" + idParam;
            progDiv.className = "progBarDiv";

            var pBar =
                {
                    id: idParam,
                    value: 0,
                    oldValue: 0,
                    prog: new ProgressBar.Circle(progDiv,
                        {
                            color: '#000000',
                            strokeWidth: 10,
                            trailWidth: null,
                            trailColor: null,
                            fill: 'rgba(200, 200, 200, 1)',
                            easing: 'easeInOut',
                            duration: 1000,
                            text: {
                                className: "progressText",
                                autoStyleContainer: false
                            },
                            from: {color: '#77FF77', a: 0},
                            to: {color: '#77FF77', a: 0},
                            step: function (state, circle) {
                                circle.path.setAttribute('stroke', state.color);
                                var value = Math.round(circle.value() * 100);
                                circle.setText(value);
                                //circle.text.style.color=state.color;
                            }
                        }),

                    update: function (pBar, value) {
                        return new Promise(function (resolve, reject) {
                            window.setTimeout(function () {
                                //var dispVal=Math.round(value*100)/100;
                                pBar.prog.set(value);
                                resolve();
                            }, 0);
                        });
                    },

                    finish: function () {
                        pBar.prog.set(1);
                        window.setTimeout(function () {
                            pBar.prog.destroy();
                            pBar.prog = null;
                            REMEL(GEBI("progressBar_" + pBar.id));
                        }, 250);
                    }
                };
            pBar.prog.text.style.fontSize = "2rem";

            AC(document.body, progDiv);
            return pBar;
        }
    };

var glassPane =
    {
        //{"text":"Text","parent":parentElement,"icon":true,"container":containerElement}
        show: function (confObj) {
            var o = {};
            var text = confObj.text;
            var rect = confObj.parent.getBoundingClientRect();
            var top = "50%";
            var containerTop = confObj.container != null ? getPosition(confObj.container).y : 0;

            if (confObj.parent == null) {
                confObj.parent = document.body;
                id = "body";
            }
            else {
                id = confObj.parent.id;
                var parTop = getPosition(confObj.parent).y;
                var parHeight = getSize(confObj.parent).height;
                top = parTop + parHeight / 2 - containerTop + "px";
            }

            confObj.parent.className = confObj.parent.className + (confObj.parent.className.indexOf(" gpBlur") < 0 ? (confObj.parent.className == "" ? "gpBlur" : " gpBlur") : "");

            var textDiv = null;
            if (text != null || confObj.icon) {
                textDiv = CREL("div");
                textDiv.id = "gpText_" + id;
                textDiv.className = "gpText";
                textDiv.style.zIndex = Number(confObj.parent.style.zIndex) > 0 ? Number(confObj.parent.style.zIndex) + 100 : 1000000;
                if (text != null) {
                    var span = CREL("span");
                    span.style.verticalAlign = "middle";
                    span.style.paddingRight = "0.5rem";
                    SIHTML(span, text);
                    AC(textDiv, span);
                }
            }

            if (confObj.icon) {
                var ico = CREL("i");
                ico.className = "fas fa-spinner-third fa-color-brightActive fa-fw fa-2x fa-spin";
                ico.style.verticalAlign = "middle";
                if (textDiv != null) {
                    AC(textDiv, ico);
                }
            }

            if (textDiv != null) {
                textDiv.style.top = top;
                if (confObj.container != null) {
                    AC(confObj.container, textDiv);
                }
                else {
                    AC(document.body, textDiv);
                }
            }

            o.confObj = confObj;
            o.textDiv = textDiv;
            o.animationTime = 500;
            o.close = function () {
                if (this.textDiv != null) {
                    this.textDiv.style.opacity = 0;
                    this.textDiv.style.left = "0%";

                    var removeGp = function (confObj, textDiv) {
                        confObj.parent.className = confObj.parent.className.replace(/ gpBlur/g, "").replace(/gpBlur/g, "");
                        REMEL(textDiv);
                    };

                    var that = this;
                    window.setTimeout(function () {
                        removeGp(that.confObj, that.textDiv);
                    }, this.animationTime);
                }
                else {
                    this.confObj.parent.className = this.confObj.parent.className.replace(/ gpBlur/g, "").replace(/gpBlur/g, "");
                }
            };

            if (textDiv != null) {
                window.setTimeout(function () {
                    textDiv.style.opacity = 1;
                    textDiv.style.left = "25%";
                }, 1);
            }

            confObj.parent.glassPane = o;
            if (confObj.ppFunction != null) {
                window.setTimeout(function () {
                    confObj.ppFunction(o);
                }, 10);
            }
            else {
                return o;
            }
        },

        closeAll: function () {
            var glassPanes = document.body.querySelectorAll(".gpBlur");
            if (glassPanes != null) {
                for (var i = 0; i < glassPanes.length; i++) {
                    glassPanes[i].className = glassPanes[i].className.replace(/ gpBlur/g, "");
                    REMEL(GEBI("gpText_" + glassPanes[i].id));
                }
            }
            document.body.className = document.body.className.replace(/gpBlur/g, "");
            REMEL(GEBI("gpText_body"));
        }
    };
// END --------------------------------------------------------------------------------------------------

/**
 * Checks if value is an integer
 * @param value: number to be checked
 * @returns {boolean} returns true if value is an int
 */
let isInt = function (value) {
    let x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};


/**
 * Checks if object is empty
 * @param obj: to be checked if empty
 * @returns {boolean} returns true if object is empty
 */
let isEmptyObject = function(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
};