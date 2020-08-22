Demo.factory("AuthService", ["$http", "$q", "$state", "$localStorage",
function ($http, $q, $state, $localStorage) {
    return  {
        isAdminAuthenticated: function () {
            if ($localStorage.hasOwnProperty('AuthenticatedAdmin')) {
                return true;
            } else {
                return false;
            }
        },
        AdminStore: function (data) {
            $localStorage.AuthenticatedAdmin = data;
        },
        AdminLogin: function (data) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: API.ADMIN_LOGIN_URL,
                data: data,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        AdminLogout: function () {
            delete $localStorage.AuthenticatedAdmin;
        },
        CheckPermission: function (StateName) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: API.CHECK_PERMISSION_URL,
                data: { MenuUrl: StateName },
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        VideoConfirmationToken: function (Token) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: API.VIDEO_CALL_CONFIRMATION_API + "?token=" + Token
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        ValidateVideoToken: function (Token) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: API.VALIDATE_VIDEO_CALL_TOKEN_API + "?token=" + Token
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    };
}]);