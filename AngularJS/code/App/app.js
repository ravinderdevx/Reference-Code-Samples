angular.module('app', [
  'ui.router',
  'ui.bootstrap', 
  'ui.utils',
  'ui.checkbox',
  'ngCookies',
  'angularjs-dropdown-multiselect',
  'ngStorage',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngTable',
  'ngStorage',
  'toggle-switch',
  'youtube-embed',
  '720kb.tooltips',
  'ui.jq',
  'oc.lazyLoad',
  'signature',
  'languages',
  'theme',
  'directive',
  'services',
  'stickies',
  'resources',
  'security',
  'templates-app',
  'templates-common',
  'app.constants',
  'app.configs',
  'app.lazyload',
  'app.spinner',
  'app.labels',
  'app.utils',
  'app.filters',
  'app.loggedIn',
  'app.modules',
  'app.pages',
  'app.header',
  'app.footer',
  'daterangepicker'
  //'ngCkeditor'
  //'ngImgCrop'
])

  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .when('', '/')
      .otherwise('');

    var resolveCommon = {
      init: function ($state, $cookieStore, security) {
        security.requestCurrentUser().then(function (user) {
          authToken = $cookieStore.get('userId_' + user.userId);
          if (authToken) {
            $state.go('loggedIn.modules.dashboard');
          }
          // if (user) {
          //   $state.go('loggedIn.modules.dashboard');
          // }
        });
      }
    };

    $stateProvider

      // Layout: Public
      .state('public', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'layouts/structure.tpl.html'
          }
        }
      })

      // Layout: Blank
      .state('blank', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'layouts/blank.tpl.html',
            resolve: resolveCommon
          }
        }
      })

      .state('blank-default', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'layouts/structure.tpl.html',
            resolve: resolveCommon
          }
        }
      })

      .state('blank-views', {
        abstract: true,
        views: {
          'root': {
            templateUrl: 'layouts/blank.tpl.html',
            resolve: {
              init: function (security) {
                if (!security.isAuthenticated()) {
                  security.requestCurrentUser();
                }
              }
            }
          }
        }
      })

      .state('init', {
        url: '/',
        resolve: {
          init: function ($state, $cookieStore, $localStorage, security) {
            return security.requestCurrentUser().then(function () {
              if (security.isAuthenticated()) {
                if (security.isClientManager()) {
                  $state.go('loggedIn.modules.user-manager');
                } else if (security.isParticipant()) {


                  //PD-1553
                  if (!security.currentUser.products.beniCompSelect && !security.currentUser.products.beniCompAdvantage) {

                    $state.go('loggedIn.modules.dashboard');
                  } else if (security.currentUser.products.beniCompSelect && !security.currentUser.products.beniCompAdvantage) {

                    $state.go('loggedIn.modules.submit-claims');

                  } else {

                    //$state.go('loggedIn.modules.health-results.biomarkers');
                    if (security.currentUser.healthResult) {
                      $state.go('loggedIn.modules.dashboard');
                    } else {
                      $state.go('loggedIn.modules.registration');
                    }
                  }




                } else {
                  $state.go('loggedIn.modules.dashboard');
                }
              } else {
                $cookieStore.remove('authToken');
                $state.go('loginForm');
              }
            });
          }
        }
      })

      .state('clientUrl', {
        url: '/:clientUrl',
        resolve: {
          init: function ($state, $stateParams, $cookieStore, $location, security) {
            return security.findEmployerByUrl($stateParams.clientUrl).then(function (employerInfo) {
              if (employerInfo) {
                return security.requestCurrentUser().then(function () {
                  return security.getBrandByClientUrl($stateParams.clientUrl, false).then(function () {
                    if (security.isAuthenticated()) {
                      if (security.isClientManager()) {
                        $state.go('loggedIn.modules.user-manager');
                      } else {
                        $state.go('loggedIn.modules.dashboardClientUrl', { clientUrl: $stateParams.clientUrl });
                      }
                    } else {
                      $cookieStore.remove('authToken');
                      $state.go('loginFormClientUrl', { clientUrl: $stateParams.clientUrl });
                    }
                  });
                });
              } else {
                $location.path('/');
              }
            });
          }
        }
      })

      .state('notFound', {
        url: '{path:.*}',
        resolve: {
          init: function ($state, $location) {
            $location.path('/');
          }
        }
      });
  })

  .run(function ($rootScope, $http, $state, $location, $timeout, Restangular) {

  })

  .controller('AppController', function ($rootScope, $scope, $location, $state, $modal, $stateParams, $timeout, $translate, $stickies, $window, CONFIGS, PATTERNREGEXS, COMPARE, i18nNotifications, security, utils, loadingSpinnerService, STATES) {
    $scope.pageTitle = "PULSE | Adding beats to your life";



    $rootScope.isRefreshToken = false;
    // Check user use app on device
    $rootScope.isUseMobile = false;
    $rootScope.currentAction = "";
    $rootScope.showMenuOnMobile = false;
    $rootScope.isClickSubMenu = false;
    var isMobile = {
      Android: function () {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };
    if (isMobile.any()) {
      $rootScope.isUseMobile = true;
    } else {
      $rootScope.isUseMobile = false;
    }

    $scope.toggleMenuOnMobile = function (action) {
      $rootScope.currentAction = action;
      if ($rootScope.isUseMobile && !$rootScope.isClickSubMenu) {
        $timeout(function () {
          if ($rootScope.showMenuOnMobile) {
            $rootScope.showMenuOnMobile = false;
          } else {
            $rootScope.showMenuOnMobile = true;
          }
        }, 100);
      }
    };


    //Get Name Browser
    $rootScope.nameBrowser = utils.getNameBrowser();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      $rootScope.currentState = toState.name;
    });

    $scope.notifications = i18nNotifications;
    $scope.baseURL = CONFIGS.baseURL();

    $scope.removeNotification = function (notification) {
      i18nNotifications.remove(notification);
    };

    $scope.removeSticky = function (key) {
      $stickies.remove(key);
    };

    //check reload
    $rootScope.isReload = false;

    // Config
    $scope.configs = CONFIGS;

    //COMPARE
    $scope.compare = COMPARE;

    //STATES
    $scope.states = STATES;
    $scope.countries = STATES.countries;

    // Pattern Regex
    $scope.patternRegexs = PATTERNREGEXS;

    $scope.isAuthenticated = security.isAuthenticated();
    $scope.isCookies = security.isCookies();
    $scope.isAdmin = security.isAdmin();
    $scope.isSuperAdmin = security.isSuperAdmin();
    $scope.isClinicalDirector = security.isClinicalDirector();
    $scope.isClientManager = security.isClientManager();
    $scope.isHealthCoachManager = security.isHealthCoachManager();
    $scope.isHealthCoach = security.isHealthCoach();
    $scope.isAgentTheAgent = security.isAgentTheAgent();
    $scope.isEmployer = security.isEmployer();
    $scope.isParticipant = security.isParticipant();
    $scope.isSpouse = security.isSpouse();
    $scope.currentUser = security.currentUser;
   

    $scope.$watch(function () {
      return security.isAuthenticated();
    }, function (isAuthenticated) {
      $scope.isAuthenticated = isAuthenticated;
      $scope.isAdmin = security.isAdmin();
      $scope.isSuperAdmin = security.isSuperAdmin();
      $scope.isClinicalDirector = security.isClinicalDirector();
      $scope.isClientManager = security.isClientManager();
      $scope.isHealthCoachManager = security.isHealthCoachManager();
      $scope.isHealthCoach = security.isHealthCoach();
      $scope.isAgentTheAgent = security.isAgentTheAgent();
      $scope.isEmployer = security.isEmployer();
      $scope.isSpouse = security.isSpouse();
      $scope.isParticipant = security.isParticipant();
      $scope.currentUser = security.currentUser;
    });

    $scope.userManagerRead = function () {
      if (security.isSuperAdmin() || security.isAdmin() || security.isClientManager() || security.isAgentTheAgent() || security.isClinicalDirector() || security.isHealthCoachManager() || security.isHealthCoach()) {
        return true;
      }

      return false;
    };

    // Check BeniCompSelect product for participant
    $scope.isParticipantBeniCompSelect = function () {
      return security.isParticipantBeniCompSelect();
    };

    $scope.isParticipantHaveBeniCompSelect = function () {
      return security.isParticipantHaveBeniCompSelect();
    };

    $scope.isParticipantHaveBeniCompAdvantage = function () {
      return security.isParticipantHaveBeniCompAdvantage();
    };

    // Login
    $scope.goLogin = function () {
      if ($rootScope.isUseMobile && $rootScope.showMenuOnMobile) {
        $rootScope.showMenuOnMobile = false;
      }
      if ($stateParams.clientUrl) {
        $state.go('loginFormClientUrl', { clientUrl: $stateParams.clientUrl });
      } else {
        $state.go('loginForm');
      }
    };

    // Logout
    $scope.logout = function () {
      if ($rootScope.isUseMobile && $rootScope.showMenuOnMobile) {
        $rootScope.showMenuOnMobile = false;
      }
      security.logout();
    };

    // Find account
    $scope.goFindAccount = function () {
      if ($stateParams.clientUrl) {
        $state.go('findAccountFormClientUrl', { clientUrl: $stateParams.clientUrl });
      } else {
        $state.go('findAccountForm');
      }
    };

    // Contact page
    $scope.goContact = function () {
      if ($stateParams.clientUrl) {
        $state.go('modules.contactClientUrl', { clientUrl: $stateParams.clientUrl });
      } else {
        $state.go('modules.contact');
      }
    };

    // Forgot Password page
    $scope.goForgotPassword = function () {
      if ($stateParams.clientUrl) {
        $state.go('forgotPasswordFormClientUrl', { clientUrl: $stateParams.clientUrl });
      } else {
        $state.go('forgotPasswordForm');
      }
    };

    // Forgot Username page
    $scope.goForgotUsername = function () {
      if ($stateParams.clientUrl) {
        $state.go('forgotUsernameFormClientUrl', { clientUrl: $stateParams.clientUrl });
      } else {
        $state.go('forgotUsernameForm');
      }
    };

    // FAQs page
    $scope.goFAQs = function () {
      if ($rootScope.isUseMobile && $rootScope.showMenuOnMobile) {
        $rootScope.showMenuOnMobile = false;
      }
      if (security.isAuthenticated()) {
        $state.go('loggedIn.modules.faqs');
      } else {
        if ($stateParams.clientUrl) {
          $state.go('modules.faqsClientUrl', { clientUrl: $stateParams.clientUrl });
        } else {
          $state.go('public.listFaqs');
        }
      }
    };

    // About page
    $scope.goAbout = function () {
      if ($rootScope.isUseMobile && $rootScope.showMenuOnMobile) {
        $rootScope.showMenuOnMobile = false;
      }
      $state.go('public.pagesAbout');
    };

    // Go to state
    $scope.goToState = function (state) {
      $state.go(state);
    };

    // Open Error
    $scope.openError = function (message) {
      $scope.modal = $modal.open({
        controller: 'ErrorController',
        templateUrl: 'modules/alert/error.tpl.html',
        size: 'sm',
        resolve: {
          message: function () {
            return message;
          }
        }
      });
    };

    // Open Warning
    $scope.openWarning = function (message) {
      $scope.modal = $modal.open({
        controller: 'WarningController',
        templateUrl: 'modules/alert/warning.tpl.html',
        size: 'sm',
        resolve: {
          message: function () {
            return message;
          }
        }
      });
    };

    // Store info sort
    $scope.$on('INFO:sort', function (event, args) {
      $scope.infoSort = args;
    });
    $scope.resetInfoSort = function () {
      if ($scope.infoSort) {
        $scope.infoSort.page = 1;
      }
    };

    // Store info sort client
    $scope.$on('INFO:sortClient', function (event, args) {
      $scope.infoSortClient = args;
    });
    $scope.resetInfoSortClient = function () {
      if ($scope.infoSortClient) {
        $scope.infoSortClient.page = 1;
      }
    };
    $scope.resetAllInfoSort = function () {
      $scope.infoSort = null;
      $scope.infoSortClient = null;
    };

    // Associate state with the current scope's state (highlight current section fix)
    $scope.$state = $state;

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $scope.checkState = utils.checkState($state);

      // Go to top
      angular.element('html').animate({ scrollTop: 0 }, "slow");
      /* Firefox*/
      angular.element('body').animate({ scrollTop: 0 }, "slow");
      /* Chorme*/
    });

    $scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      // Make sure a nice notification message is shown to the user
      i18nNotifications.pushForCurrentRoute('errors.route.changeError', 'error', {}, { rejection: error });
    });

    // TODO: Comment back in when request issues are resolved
    $scope.$on('API:loading:started', function (event, args) {

      var excluded = ['signout'];

      if (excluded.indexOf(args.what) === -1) {
        loadingSpinnerService.spin('main-spinner');
      }
    });

    $scope.$on('API:loading:ended', function (event) {
      loadingSpinnerService.stop('main-spinner');
    });

    $scope.$on('API:refresh:token', function (event, args) {

      if (!$rootScope.isRefreshToken) {

        $rootScope.isRefreshToken = true;
        security.refreshToken(args.refresh_token).then(function (data) {
          $rootScope.isRefreshToken = false;
        }, function (err) {
          $rootScope.isRefreshToken = false;
        });
      }

    });

    // Return to the login screen after 15 min of inactivity
    var timer = null;
    $scope.mouseMove = function () {
      if (timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout(function () {
        if (security.isAuthenticated()) {
          security.logout();
          //$state.go($state.current, {}, {reload: true});
        }
      }, 15 * 60 * 1000); // 15 minutes

      $scope.$on('$destroy', function () {
        $timeout.cancel(timer);
      });
    };

    //Event mouse click
    $scope.mouseClick = function () {
      $timeout(function () {
        if ($rootScope.isUseMobile && $rootScope.showMenuOnMobile) {
          $rootScope.showMenuOnMobile = false;
        }
      }, 200);

    };

    // Date Format
    $scope.dateFormat = function (date) {
      if (!!date) {
        return new Date(date).format("mmmm d, yyyy HH:MM:ss");
      } else {
        return '';
      }
    };

    // Request timeout - disable spinner
    $scope.$on('response:timeout', function (event, rejection) {
      loadingSpinnerService.stop('main-spinner');
  
      $scope.openError($translate.instant('server.error.0'));

      //$stickies.set('login', $translate.instant('server.error.0'), 'danger');
      //$state.go('loginForm');
    });

    angular.element('.loading-first').css("display", "none");

    // Convert birthday to local time
    $scope.parseDateOfBirthToShort = function (date) {
      return utils.dateToShort(utils.parseDateOfBirthToDatePacker(date));
    };

    $scope.getLabelByIncentive = function (incentive, def) {
      if (incentive && incentive.startDate && incentive.endDate) {
        var startDate = utils.dateServerToLocalTime(incentive.startDate);
        var endDate = utils.dateServerToLocalTime(incentive.endDate);
        return new Date(startDate).format('mm/dd/yyyy') + ' - ' + new Date(endDate).format('mm/dd/yyyy');
      }

      return def;
    };
  });