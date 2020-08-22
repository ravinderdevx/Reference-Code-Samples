/// <reference path="../Section/Doctor/DashBoard/DoctorDashBoard.html" />
/// <reference path="../Section/Doctor/DashBoard/DoctorDashBoard.html" />
/// <reference path="../Section/Doctor/DashBoard/DoctorDashBoard.html" />

/// <reference path="../Assets/Liberary/angular-1.5.8/angular.js" />

'use strict';

//'ui.router',
//$stateProvider, $urlRouterProvider,
angular.module('DoctorApp', ['ui.router', 'angularSpinner', 'toaster', 'CommunicationModule', 'ngTable', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'filterApp', 'ngTagsInput', 'angularFileUpload', 'PopModule', 'SchedulerApp', 'ui.calendar', 'ui.bootstrap.datetimepicker', 'CommonModuleApp', 'angucomplete-alt', 'ui.bootstrap.contextMenu', 'ngCookies', 'LoginApp'])
.config(['usSpinnerConfigProvider', '$stateProvider', '$urlRouterProvider', function (usSpinnerConfigProvider, $stateProvider, $urlRouterProvider) {
    var opts = {
        lines: 9 // The number of lines to draw
            ,
        length: 28 // The length of each line
            ,
        width: 14 // The line thickness
            ,
        radius: 42 // The radius of the inner circle
            ,
        scale: 0.5 // Scales overall size of the spinner
            ,
        corners: 1 // Corner roundness (0..1)
            ,
        color: '#000' // #rgb or #rrggbb or array of colors
            ,
        opacity: 0.6 // Opacity of the lines
            ,
        rotate: 0 // The rotation offset
            ,
        direction: 1 // 1: clockwise, -1: counterclockwise
            ,
        speed: 0.9 // Rounds per second
            ,
        trail: 58 // Afterglow percentage
            ,
        fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            ,
        zIndex: 2e9 // The z-index (defaults to 2000000000)
            ,
        className: 'spinner' // The CSS class to assign to the spinner
            ,
        top: '50%' // Top position relative to parent
            ,
        left: '51%' // Left position relative to parent
            ,
        shadow: false // Whether to render a shadow
            ,
        hwaccel: false // Whether to use hardware acceleration
            ,
        position: 'absolute' // Element positioning
    }

    usSpinnerConfigProvider.setDefaults(opts);



    var checkLoginFun = function ($q, $http, $location, $cookies) {
        var deferred = $q.defer();
        debugger;
        var isLogin = $cookies.get('.ASPXAUTH');
        if (isLogin == "" || typeof isLogin != 'undefined') {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + isLogin;
            deferred.resolve();
        }
        else {
            $http.defaults.headers.common['Authorization'] = '';
            window.location = AuthSetting.LoginUrl;
            deferred.reject();
        }
        return deferred.promise;
    }

    $urlRouterProvider.otherwise("/DoctorDashBoard");
    $stateProvider
        .state('NewClientReisteration', {
            url: "/NewClientReisteration",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/ClientRegisteration/ClientRegistration.html",
                    controller: "ClientRegisterationController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }

            }
        })
       .state('DoctorDashBoard', {
           url: "/DoctorDashBoard",
           views: {
               "DoctorContentView": {
                   templateUrl: "/App/Section/Doctor/DashBoard/DoctorDashBoard.html",
                   controller: "DoctorDashBoardController",
                   resolve: {
                       checklogin: checkLoginFun
                   }
               }
           }
       })
        .state('DoctorLogs', {
            url: "/DoctorLogs",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/Logs/Logs.html",
                    controller: "LogsController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
        .state('Billings', {
            url: "/Bilings",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/Billings/Billings.html",
                    controller: "BillingsController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
        .state('Contacts', {
            url: "/Contacts",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/Contacts/DoctorContactsDetail.html",
                    controller: "DoctorContactController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
        .state('Messages', {
            url: "/Messages",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/Messages/Messages.html",
                    controller: "MessagesController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
    .state('ViewProfile', {
        url: "/ViewProfile",
        views: {
            "DoctorContentView": {
                templateUrl: "/App/Section/Doctor/Profile/UserProfile.html",
                controller: "UserProfileController",
                resolve: {
                    checklogin: checkLoginFun
                }
            }
        }
    })
        .state('Clients', {
            url: "/Clients",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/Clients/Clients.html",
                    controller: "ClientMangeController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
       .state('Error404', {
           url: "/Error404",
           views: {
               "DoctorContentView": {
                   templateUrl: "/App/Section/ErrorPages/404/404.html",
                   //controller: "DoctorDashBoardController"
                   resolve: {
                       checklogin: checkLoginFun
                   }
               }
           }
       })
       .state('Error500', {
           url: "/Error500",
           views: {
               "DoctorContentView": {
                   templateUrl: "/App/Section/ErrorPages/500/500.html",
                   //controller: "DoctorDashBoardController"
                   resolve: {
                       checklogin: checkLoginFun
                   }
               }
           }
       })
        .state('Scheduler', {
            url: "/Scheduler",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Scheduler/Scheduler.html",
                    controller: "SchedulerController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
        .state('ClientSummary', {
            url: "/ClientSummary/:cID",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/Doctor/ClientSummary/ClientSummary.html",
                    controller: "ClientSummaryController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        })
    .state('DoctorClientLab', {
        url: "/DoctorClientLab",
        views: {
            "DoctorContentView":
                {
                    templateUrl: "",
                    controller: "",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
        }
    })
        .state('DoctorClientDashBoard', {
            url: "/DoctorClientDashBoard/:cID",
            views: {
                "DoctorContentView":
                    {
                        templateUrl: "/App/Section/Doctor/DoctorClient/DoctorClientDashBoard/DoctorClientDashBoard.html",
                        controller: "DoctorClientDashBoardController",
                        resolve: {
                            checklogin: checkLoginFun
                        }
                    }
            }
        })
        .state('DoctorClientViewProfile', {
            url: "/DoctorClientViewProfile/:cID",
            views: {
                "DoctorContentView":
                    {
                        templateUrl: "/App/Section/Doctor/DoctorClient/DoctorClientProfile/DoctorClientProfile.html",
                        controller: "DoctorClientProfileController",
                        resolve: {
                            checklogin: checkLoginFun
                        }
                    }
            }
        })
        .state('EditDoctorClientViewProfile', {
            url: "/EditDoctorClientViewProfile/:cID",
            views: {
                "DoctorContentView":
                    {
                        templateUrl: "/App/Section/Doctor/DoctorClient/DoctorClientProfile/EditDoctorClientProfile/EditDoctorClientProfile.html",
                        controller: "EditDoctorClientProfileController",
                        resolve: {
                            checklogin: checkLoginFun
                        }
                    }
            }
        })
        .state('DoctorClientAllergies', {
            url: "/DoctorClientAllergies/:cID",
            views: {
                "DoctorContentView":
                    {
                        templateUrl: "/App/Section/Doctor/DoctorClient/DoctorClientAllergies/DoctorClientAllergies.html",
                        controller: "DoctorClientAllergyController",
                        resolve: {
                            checklogin: checkLoginFun
                        }
                    }
            }
        })
        .state('DoctorClientVitals', {
            url: "/DoctorClientVitals/:cID",
            views: {
                "DoctorContentView":
                    {
                        templateUrl: "/App/Section/Doctor/DoctorClient/DoctorClientVital/DoctorClientVital.html",
                        controller: "DoctorClientVitalController",
                        resolve: {
                            checklogin: checkLoginFun
                        }
                    }
            }
        })
        .state('ChangePasswod', {
            url: "/ChangePasswod",
            views: {
                "DoctorContentView": {
                    templateUrl: "/App/Section/ChangePasssword/ChangePassword.html",
                    controller: "ChangePasswordController",
                    resolve: {
                        checklogin: checkLoginFun
                    }
                }
            }
        });
}]);
