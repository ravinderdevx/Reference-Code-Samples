/** Filters **/
Demo.filter('split', function () {
    return function (input, s) {
        var delimiter = s || ',';
        var splitArr = input.split(delimiter);
        return splitArr[splitArr.length - 1];
    };
});

Demo.filter('USDFormatCurrency', function () {
    return function (input) {
        if (input) {
            if (input.indexOf('.') === -1) {
                return '$' + input + 'USD';
            } else {
                var currencyArr = input.split('.');
                return '$' + currencyArr[0] + '<sup>' + currencyArr[1] + '</sup> USD';
            }
        }
    };
});

Demo.filter('filterBySCount', function ($filter) {
    return function (input, key, value) {
        if (input) {
            var object = {};
            object[key] = value;

            var result = $filter('filter')(input, object);
            if (result.length > 0) {
                return result[0].SCount;
            } else {
                return 0;
            }
        }
    };
});

Demo.filter('filterByLCount', function ($filter) {
    return function (input, key, value) {
        if (input) {
            var object = {};
            object[key] = value;

            var result = $filter('filter')(input, object);
            if (result.length > 0) {
                return result[0].LCount;
            } else {
                return 0;
            }
        }
    };
});



Demo.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});