Demo.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($locationProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

    $urlRouterProvider.otherwise('/dashboard');

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: true
    });

    $breadcrumbProvider.setOptions({
        prefixStateName: 'Admin.Dashboard',
        includeAbstract: true,
        template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
    });

    $stateProvider
    .state('Admin', {
        abstract: true,
        templateUrl: 'Views/Layouts/Full.html',
        //page title goes here
        ncyBreadcrumb: {
            label: 'Root',
            skip: true
        },
        resolve: {
            loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                // you can lazy load CSS files
                return $ocLazyLoad.load([{
                    serie: true,
                    name: 'Font Awesome',
                    files: ['Assert/css/font-awesome.min.css']
                }, {
                    serie: true,
                    name: 'Simple Line Icons',
                    files: ['Assert/css/simple-line-icons.css']
                }]);
            }]
        },
        data: {
            authRequired: true
        },
        controller: "MainAppController"
    })
    .state('Admin.Dashboard', {
        url: '/dashboard',
        templateUrl: 'Views/Dashboard.html',
        //page title goes here
        ncyBreadcrumb: {
            label: 'Home',
        },
        //page subtitle goes here
        params: { subtitle: 'Welcome to Dashboard' },
        controller: 'AdminDashboardController',
        resolve: {
            loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                // you can lazy load files for an existing module
                return $ocLazyLoad.load([
                  {
                      serie: true,
                      name: 'chart.js',
                      files: [
                        'AppScripts/Libraries/Chart.min.js',
                        'AppScripts/Libraries/angular-chart.min.js'
                      ]
                  },
                ]);
            }],
            loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                // you can lazy load controllers
                return $ocLazyLoad.load({
                    files: ['AppScripts/Controllers/Main.Controller.js']
                });
            }],
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.Dashboard').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/searches');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('AdminLogin', {
        url: '/login',
        templateUrl: 'Views/Login.html',
        resolve: {
            loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    serie: true,
                    name: 'Font Awesome',
                    files: ['Assert/css/font-awesome.min.css']
                }, {
                    serie: true,
                    name: 'Simple Line Icons',
                    files: ['Assert/css/simple-line-icons.css']
                }]);
            }],
        },
        controller: 'AdminLoginController',
        params: { Message: null },
        authenticate:true,
        data: {
            authRequired: false
        }
    })
    .state('AdminVideoConfimation', {
        url: '/video-call-confirmation?videotoken',
        templateUrl: 'Views/VideoConfirmation.html',
        controller: 'AdminVideoConfirmationController',
        params: { Message: null },
        resolve: {
            check: function ($stateParams) {
                if ($stateParams.videotoken == null) {
                    window.location = Demo_URL;
                }
            }
        },
    })
    .state('AdminVideoReschedule', {
        url: '/video-reschedule?videotoken',
        templateUrl: 'Views/VideoReschedule.html',
        controller: 'AdminVideoRescheduleController',
        params: { Message: null },
        resolve: {
            check: function ($stateParams) {
                if ($stateParams.videotoken == null) {
                    window.location = Demo_URL;
                }
            }
        },
    });
}]);
