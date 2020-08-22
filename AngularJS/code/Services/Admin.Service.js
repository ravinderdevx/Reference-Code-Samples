Demo.factory("AdminService", ["$http", "$q", "$location",
function ($http, $q, $location) {
    return {
        CallAjaxUsingPostRequest: function (url, dataObject) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        CallAjaxUsingGetRequest: function (url) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        SubmitForm: function (url, formData) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: formData,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    };
}]);