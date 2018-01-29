Demo.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

Demo.filter('SuffixWithPercentage', function () {
    return function (number) {
        if (parseInt(number) > 0) {
            return number + "%";
        } else {
            return "-";
        }
    };
});