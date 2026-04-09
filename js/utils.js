function convertTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

function hexlifyString(str) {
    return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
}

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

Vue.prototype.$buildUrl = function(paramsObject, preserve = true) {
    const keys = Object.keys(paramsObject);
    const origin = window.location.origin + window.location.pathname;

    let usp;
    if (preserve) {
        usp = new URLSearchParams(window.location.search);
    } else {
        usp = new URLSearchParams();
    }

    keys.forEach((key) => {
        usp.set(key, paramsObject[key]);
    });

    // Set a random value to bust the cache
    usp.set('cachebust', Math.floor(Math.random() * 1000000000000));

    return origin + '?' + usp.toString();
};

Vue.prototype.$truncateString = function(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};

Vue.prototype.$formatTimestamp = convertTimestamp;
