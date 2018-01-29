Demo.factory('authInterceptorService', ['$q', '$injector', '$localStorage', function ($q, $injector, $localStorage) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            var authData = $localStorage.AuthenticatedAdmin;
            
            if (authData) {
                config.headers.Authorization = 'Basic ' + authData.Token;
            }

            return config;
        },
        responseError :function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('AuthService');
                var state = $injector.get('$state');
                
                authService.AdminLogout();
                state.go('AdminLogin', { Message: {"Class":"alert-danger", "Text":"Please Login again."}});
            }
            return $q.reject(rejection);
        }
    };
}]);