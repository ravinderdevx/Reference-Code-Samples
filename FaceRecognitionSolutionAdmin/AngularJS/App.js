// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

var Demo = angular.module('DemoAdminApp', ['ngStorage', 'ngValidate', 'ui.router', 'oc.lazyLoad', 'ncy-angular-breadcrumb', 'angular-loading-bar', 'ngDialog', 'toaster', 'ui.bootstrap', 'angucomplete-alt', 'ui.bootstrap.datetimepicker']);

Demo.config(['cfpLoadingBarProvider', '$httpProvider', '$locationProvider', '$validatorProvider', function (cfpLoadingBarProvider, $httpProvider, $locationProvider, $validatorProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 1;

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('authInterceptorService');

    $validatorProvider.addMethod('goodPassword', function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#()_+])[A-Za-z\d$@$!%*?&#()_+]{8,10}/.test(value);
    }, 'Password should contain one uppercase, one lowercase, one number and one special character.');

    $validatorProvider.addMethod("noSpace", function (value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "Spaces are not allowed");
}]);

Demo.run(['$rootScope', '$state', '$stateParams', '$transitions', 'AuthService', function ($rootScope, $state, $stateParams, $transitions, AuthService) {
    $rootScope.Demo_URL = Demo_URL;
    $rootScope.BASE_URL = BASE_URL;

    $rootScope.CurrentYear = (new Date()).getFullYear();

    $rootScope.$on('$stateChangeSuccess', function ($event, toState, toParams) {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
    $rootScope.$state = $state;

    $transitions.onBefore({
        to: function (state) {
            if (state.data != null && state.data.authRequired != null) {
                var RequiredAuthentication = state.data.authRequired;
                var IsAuthenticated = AuthService.isAdminAuthenticated();
               
                if (RequiredAuthentication == true && IsAuthenticated == false) {
                    // User isn’t authenticated
                    $state.transitionTo('AdminLogin');
                    return true;
                } else if (RequiredAuthentication == false && IsAuthenticated == true) {
                    // User is authenticated
                    $state.transitionTo('Admin.Dashboard');
                    return true;
                }
            }
        }
    }, function ($transition) {
        $transition.abort();
    });

    return $rootScope.$stateParams = $stateParams;
}]);
