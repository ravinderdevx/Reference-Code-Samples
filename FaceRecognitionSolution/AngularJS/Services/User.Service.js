FPP.factory("UserService", ["$http", "$q", "$localStorage", "$state",
function ($http, $q, $localStorage, $location) {
    return {
        CallAuthenticatePostRequest: function (url, dataObject) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        CallAuthenticateGetRequest: function (url) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
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
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }
    };
}]);