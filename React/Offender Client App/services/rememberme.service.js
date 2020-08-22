

const get = (name) => {
    var gCookieVal = document.cookie.split("; ");
    for (var i = 0; i < gCookieVal.length; i++) {
        // a name/value pair (a crumb) is separated by an equal sign
        var gCrumb = gCookieVal[i].split("=");
        if (name === gCrumb[0]) {
            var value = unescape(gCrumb[1]);
            return value;
        }
    }
    // a cookie with the requested name does not exist
    return null;
}

const store = (name, values) => {
    var cookie = name + '=';
    if (typeof values === 'object') {
        var expires = '';
        cookie += (typeof values.value === 'object') ? unescape(values.value) + ';' : values.value + ';';
        if (values.expires) {
            var date = new Date();
            date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 * 1000));
            expires = date.toGMTString();
        }
        cookie += (!values.session) ? 'expires=' + expires + ';' : '';
        cookie += (values.path) ? 'path=' + values.path + ';' : '';
        cookie += (values.secure) ? 'secure;' : '';
    } else {
        cookie += values + ';';
    }
    document.cookie = cookie;
}

const remove = (name) => {
    document.cookie.remove(name);

}

export const rememberMeService = {
    get,
    store, remove
}

