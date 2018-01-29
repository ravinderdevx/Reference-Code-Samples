var FPP = angular.module('DemoApp', ['ui.bootstrap', 'ngSanitize', 'ngCookies', 'ngStorage', 'ui.router', 'ngAnimate', 'ngDialog', 'toaster', 'webcam', 'ngValidate', 'angular-loading-bar', 'signature']);


FPP.config(function ($httpProvider, $cookiesProvider, $validatorProvider, $stateProvider, $urlRouterProvider, $locationProvider, cfpLoadingBarProvider) {
    
    $httpProvider.interceptors.push('authInterceptorService');

    // Set $cookies defaults
    $cookiesProvider.defaults.path = '/';

    //Custom Validator
    $validatorProvider.addMethod('goodPassword', function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/.test(value);
    }, 'Password should contain one uppercase, one lowercase, one number and one special character.');

    $validatorProvider.addMethod("Attachments", function (value, element) {
        return this.optional(element) || /\\([a-z0-9])*\.(jpeg|jpg|gif|png|pdf)/i.test(value);
    }, "Uploaded file format is not valid. Allowed File Extenstions: .jpg, .gif, .jpeg, .png, .pdf.");

    $validatorProvider.addMethod("extension", function (value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
        return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
    }, "Please enter a value with a valid extension.");

    //Turn the spinner on or off:
    cfpLoadingBarProvider.includeSpinner = false;

    $locationProvider.html5Mode(true);

    $stateProvider
		.state('home', {
		    url: '/home',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/Home.html',
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
		.state('aboutus', {
		    url: '/aboutus',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html',
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/AboutUs.html'
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
		.state('services', {
		    url: '/services?token',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/Services.html',
		            controller: 'ServicesController',
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    resolve: {
		        check: function ($location, $stateParams) {
		            if ($stateParams.token == null || $stateParams.token == "true") {
		                $location.path('/invitations');
		            } 
		        }
		    },
		    authenticate: false
		})
        .state('invitations', {
            url: '/invitations',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/Common/Services2.html',
                    controller: 'RegisterationController',
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            authenticate: false
        })
		.state('ncplaws', {
		    url: '/ncplaws',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/NcpLaws.html'
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
		.state('news', {
		    url: '/news',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/News.html',
                    controller:'NewsController'
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
        .state('Support', {
            url: '/support',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/Common/Support.html'
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            authenticate: false
        })
		.state('contact', {
		    url: '/contact',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/ContactUs.html'
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
        .state('TermsCondition', {
            url: '/terms-condition',
            views: {
                "Header": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/HeaderAuthenticate.html';
                        } else {
                            return '/Views/Include/Header.html';
                        }
                    }
                },
                "MainContent": {
                    templateUrl: '/Views/Common/TermsCondition.html'
                },
                "Footer": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/FooterAuthenticate.html';
                        } else {
                            return '/Views/Include/Footer.html';
                        }
                    }
                }
            },
            param: {
                isLoggedIn: null
            },
            resolve: {
                check: function (AuthService, $stateParams) {
                    $stateParams.isLoggedIn = AuthService.isAuthenticated();
                }
            }
        })
        .state('PrivacyPolicy', {
            url: '/privacy-policy',
            views: {
                "Header": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/HeaderAuthenticate.html';
                        } else {
                            return '/Views/Include/Header.html';
                        }
                    }
                },
                "MainContent": {
                    templateUrl: '/Views/Common/PrivacyPolicy.html'
                },
                "Footer": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/FooterAuthenticate.html';
                        } else {
                            return '/Views/Include/Footer.html';
                        }
                    }
                }
            },
            param: {
                isLoggedIn: null
            },
            resolve: {
                check: function (AuthService, $stateParams) {
                    $stateParams.isLoggedIn = AuthService.isAuthenticated();
                }
            }
        })

         .state('ChildPornography', {
             url: '/child-pornography',
             views: {
                 "Header": {
                     templateUrl: function ($stateParams) {
                         if ($stateParams.isLoggedIn) {
                             return '/Views/Include/HeaderAuthenticate.html';
                         } else {
                             return '/Views/Include/Header.html';
                         }
                     }
                 },
                 "MainContent": {
                     templateUrl: '/Views/Common/ChildPornography.html'
                 },
                 "Footer": {
                     templateUrl: function ($stateParams) {
                         if ($stateParams.isLoggedIn) {
                             return '/Views/Include/FooterAuthenticate.html';
                         } else {
                             return '/Views/Include/Footer.html';
                         }
                     }
                 }
             },
             param: {
                 isLoggedIn: null
             },
             resolve: {
                 check: function (AuthService, $stateParams) {
                     $stateParams.isLoggedIn = AuthService.isAuthenticated();
                 }
             }
         })


        .state('FAQ', {
            url: '/faq',
            views: {
                "Header": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/HeaderAuthenticate.html';
                        } else {
                            return '/Views/Include/Header.html';
                        }
                    }
                },
                "MainContent": {
                    templateUrl: '/Views/Common/FAQ.html'
                },
                "Footer": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/FooterAuthenticate.html';
                        } else {
                            return '/Views/Include/Footer.html';
                        }
                    }
                }
            },
            param: {
                isLoggedIn: null
            },
            resolve: {
                check: function (AuthService, $stateParams) {
                    $stateParams.isLoggedIn = AuthService.isAuthenticated();
                }
            }
        })
		.state('login', {
		    url: '/login',
		    views: {
		        "Header": {
		            templateUrl: '/Views/Include/Header.html'
		        },
		        "MainContent": {
		            templateUrl: '/Views/Common/Login.html'
		        },
		        "Footer": {
		            templateUrl: '/Views/Include/Footer.html',
		        }
		    },
		    authenticate: false
		})
        .state('logout', {
            url: '/logout',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/Common/Logout.html'
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            resolve: {
                logout: function (AuthService) {
                    return AuthService.logout();
                }
            }
        })
        .state('ResetPassword', {
            url: '/ResetPassword',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/Common/ResetPassword.html',
                    controller: 'ResetPasswordController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            authenticate: false
        })
        .state('signup', {
            url: '/signup?auth&rapidsState&rapidsStateSignature&form_charset',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/Common/SignUp.html',
                    controller: 'SignUpController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            params: {
                PackageObject: null
            },
            abstract: true,
            authenticate: false
        })
        .state('signup.AccountDetails', {
            url: '',
            views: {
                "SignUpStep": {
                    templateUrl: '/Views/SignUp/SignUpAccountDetails.html',
                    controller: 'AccountDetailsController'
                }
            },
            params: {
                ShowPopup: null
            },
            authenticate: false
        })
        .state('signup.IDPhoto', {
            url: '',
            views: {
                "SignUpStep": {
                    templateUrl: '/Views/SignUp/SignUpIDPhoto.html',
                    controller: 'IDPhotoController'
                }
            },
            authenticate: false
        })
        .state('signup.LinkRemoval', {
            url: '',
            views: {
                "SignUpStep": {
                    templateUrl: '/Views/SignUp/SignUpLinkRemoval.html',
                    controller: 'LinkRemovalController'
                }
            },
            authenticate: false
        })
        .state('signup.Checkout', {
            url: '',
            views: {
                "SignUpStep": {
                    templateUrl: '/Views/SignUp/SignUpCheckout.html',
                    controller: 'CheckoutController'
                }
            },
            authenticate: false
        })
        .state('signup.Completion', {
            url: '',
            views: {
                "SignUpStep": {
                    templateUrl: '/Views/SignUp/SignUpCompletion.html',
                    controller: 'CompletionController'
                }
            },
            authenticate: false
        })
        .state('SignUpCompletion', {
            url: '/completion/:Type',
            views: {
                "Header": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/HeaderAuthenticate.html';
                        } else {
                            return '/Views/Include/Header.html';
                        }
                    }
                },
                "MainContent": {
                    templateUrl: '/Views/Common/SignUpCompletion.html',
                    controller: 'CompletionController'
                },
                "Footer": {
                    templateUrl: function ($stateParams) {
                        if ($stateParams.isLoggedIn) {
                            return '/Views/Include/FooterAuthenticate.html';
                        } else {
                            return '/Views/Include/Footer.html';
                        }
                    }
                }
            },
            param: {
                isLoggedIn: null
            },
            resolve: {
                check: function (AuthService, $stateParams) {
                    $stateParams.isLoggedIn = AuthService.isAuthenticated();
                }
            }
        })
        .state('dashboard', {
            url: '',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/Dashboard.html',
                    controller: 'UserDashboardController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true,
            abstract: true
        })
        .state('dashboard.home', {
            url: '/dashboard',
            views: {
                "DashboardViews": {
                    templateUrl: '/Views/User/Dashboard/Home.html',
                    controller: 'DashboardHomeController'
                }
            },
            authenticate: true
        })
        .state('dashboard.search', {
            url: '/search/:SearchId',
            views: {
                "DashboardViews": {
                    templateUrl: '/Views/User/Dashboard/SearchResults.html',
                    controller: 'SearchResultsController'
                }
            },
            authenticate: true
        })
        .state('dashboard.linkselection', {
            url: '/linkselection',
            views: {
                "DashboardViews": {
                    templateUrl: '/Views/User/Dashboard/LinkSelection.html',
                    controller: 'LinkSelectionController'
                }
            },
            params: {
                PhotosObject: null
            },
            authenticate: true
        })
        .state('dashboard.DMCA', {
            url: '/DMCA',
            views: {
                "DashboardViews": {
                    templateUrl: '/Views/User/Dashboard/DMCA.html',
                    //controller:'DMCAController'
                }
            },
            abstract: true,
            authenticate: true
        })
        .state('dashboard.DMCA.GenerateNotices', {
            url: '/GenerateNotices?filter',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/GeneratedNotices.html',
                    controller:'GenerateNoticesController'

                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.NewRequests', {
            url: '/NewRequests',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/NewRequests.html',
                    controller: 'LinkRemovalRequestController'
                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.Documents', {
            url: '/Documents',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/Documents.html',
                    controller:'DMCADocumentController'
                }
            },
            param: {
                DocumentCount:null
            },
            authenticate: true
        })
        .state('dashboard.DMCA.LinksRemovalNotice', {
            url: '/links-removal-notice',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/Dashboard/LinkSelected.html',
                    controller: 'LinkSelectedController'
                }
            },
            resolve: {
                check: function ($localStorage, $state) {
                    if (!$localStorage.LinkDetails) {
                        $state.go('dashboard.home')
                    }
                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.Payment', {
            url: '/checkout',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/Payment.html',
                    controller: 'PaymentController'
                }
            },
            resolve: {
                check: function ($localStorage, $state) {
                    if (!$localStorage.PaymentDetails) {
                        $state.go('dashboard.home')
                    }
                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.PaymentConfirmation', {
            url: '/payment-confirmation',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/PaymentConfirmation.html',
                    controller: function ($state, $localStorage, APICallService) {
                        debugger;
                        if ($localStorage.PaymentDetails && $localStorage.PaymentDetails.PaymentId > 0) {
                            debugger;
                            APICallService.CallAjaxUsingGetRequest(API.PAYMENT_CONFIRMATION_URL + '?PaymentId=' + $localStorage.PaymentDetails.PaymentId, {}).then(function (data) {
                                if (data.Success == true && data.Processed == "Y") {
                                    delete $localStorage['PaymentDetails'];
                                    $state.go('dashboard.DMCA.PaymentConfirmation');
                                } else {
                                    $state.go('dashboard.DMCA.Payment');
                                }
                            }, function (error) {

                            }).finally(function () {

                            });
                        } else {
                            $state.go('dashboard.home');
                        }
                    }
                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.Loan', {
            url: '/Loan',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/Loan.html',
                    controller: 'LoanController'
                }
            },
            resolve: {
                check: function ($localStorage, $state) {
                    if (!$localStorage.PaymentDetails) {
                        $state.go('dashboard.home')
                    }
                }
            },
            authenticate: true
        })
        .state('dashboard.DMCA.DMCANoticeGenerator', {
            url: '/notice-generator',
            views: {
                "DMCAViews": {
                    templateUrl: '/Views/User/DMCA/DMCANoticeGenerator.html',
                    controller:'DMCANoticeGeneratorController'
                }
            },
            resolve: {
                check: function (UserService, $state) {
                    UserService.CallAuthenticateGetRequest(API.CHECK_ACCESS_ON_NOTICE_URL).then(function (data) {
                        if (data == false) {
                            $state.go("dashboard.DMCA.GenerateNotices");
                        }
                    }, function (error) {

                    }).finally(function () {
                        
                    });
                }
            },
            authenticate: true
        })
        .state('dashboard.LegalAction', {
            url: '/LegalAction',
            views: {
                "DashboardViews": {
                    templateUrl: '/Views/User/Dashboard/LegalAction.html'
                }
            },
            abstract: true,
            authenticate: true
        })
        .state('dashboard.LegalAction.ContactForm', {
            url: '/ContactForm',
            views: {
                "LegalActionViews": {
                    templateUrl: '/Views/User/LegalAction/ContactForm.html',
                    controller:'ContactFormController'
                }
            },
            authenticate: true
        })
        .state('dashboard.LegalAction.Lawsuits', {
            url: '/Lawsuits?filter',
            views: {
                "LegalActionViews": {
                    templateUrl: '/Views/User/LegalAction/Lawsuits.html',
                    controller: 'LawSuitController'
                }
            },
            authenticate: true
        })
        .state('dashboard.LegalAction.Documents', {
            url: '/Documents',
            views: {
                "LegalActionViews": {
                    templateUrl: '/Views/User/LegalAction/Documents.html'
                }
            },
            authenticate: true
        })
        .state('profile', {
            url: '/profile',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/Profile.html',
                    controller: 'UserProfileController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('Plans', {
            url: '/FR/plans',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/Plans.html',
                    controller:'ServicesController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('StartNow', {
            url: '/Plan/StartNow?auth&rapidsState&rapidsStateSignature&form_charset',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/StartNow.html',
                    controller: 'StartPlanController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            abstract:true,
            authenticate: true
        })
        .state('StartNow.AccountDetails', {
            url: '',
            views: {
                "StartNowStep": {
                    templateUrl: '/Views/SignUp/SignUpAccountDetails.html',
                    controller: 'AccountDetailsController'
                }
            },
            authenticate: true
        })
        .state('StartNow.IDPhoto', {
            url: '',
            views: {
                "StartNowStep": {
                    templateUrl: '/Views/SignUp/SignUpIDPhoto.html',
                    controller: 'IDPhotoController'
                }
            },
            authenticate: true
        })
        .state('StartNow.Checkout', {
            url: '',
            views: {
                "StartNowStep": {
                    templateUrl: '/Views/SignUp/SignUpCheckout.html',
                    controller: 'CheckoutController'
                }
            },
            authenticate: true
        })
        .state('StartNow.Completion', {
            url: '',
            views: {
                "StartNowStep": {
                    templateUrl: '/Views/SignUp/SignUpCompletion.html',
                    controller: 'CompletionController'
                }
            },
            authenticate: true
        })
        .state('changepassword', {
            url: '/changepassword',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/ChangePassword.html',
                    controller: 'ChangePasswordController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('invoices', {
            url: '/invoices',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/Invoices.html',
                    controller: 'UserInvoicesController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('Tickets', {
            url: '/tickets',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/Tickets.html',
                    controller: 'UserTicketsController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('openticket', {
            url: '/openticket',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/OpenTicket.html',
                    controller: function ($scope, $rootScope, $state, $localStorage, UserService) {
                        $scope.showLoading = true;
                        UserService.CallAuthenticateGetRequest(API.CHECK_USER_BLOCKED).then(function (data) {
                            if (data.Success == true) {
                                $scope.Blocked = data.Blocked;
                            }
                        }, function (error) {

                        }).finally(function () {
                            $scope.showLoading = false;
                        });
                    }
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('openticketform', {
            url: '/openticketform/:type',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/User/OpenTicketForm.html',
                    controller: 'OpenTicketFormController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            authenticate: true
        })
        .state('SignUpAmazonPay', {
            url: '/signup/amazon-pay',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/Header.html'
                },
                "MainContent": {
                    templateUrl: '/Views/SignUp/Amazon.html',
                    controller: 'SignUpPayWithAmazonController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/Footer.html',
                }
            },
            resolve: {
                check: function ($localStorage, $location, $state) {
                    var DataKey = btoa('RegisterationData');
                    if ($localStorage[DataKey] != null) {
                        if (!$location.search().access_token) {
                            $location.path('/signup');
                        }
                    } else {
                        $location.path('services');
                    }
                }
            },
            authenticate: false
        })
        .state('StartNowAmazonPay', {
            url: '/StartNow/amazon-pay',
            views: {
                "Header": {
                    templateUrl: '/Views/Include/HeaderAuthenticate.html'
                },
                "MainContent": {
                    templateUrl: '/Views/SignUp/Amazon.html',
                    controller: 'StartNowPayWithAmazonController'
                },
                "Footer": {
                    templateUrl: '/Views/Include/FooterAuthenticate.html',
                }
            },
            resolve: {
                check: function ($localStorage, $location) {
                    var DataKey = btoa('PlanData');
                    if ($localStorage[DataKey] != null) {
                        if (!$location.search().access_token) {
                            $location.path('/signup');
                        }
                    } else {
                        $location.path('services');
                    }
                }
            },
            authenticate: true
        });
    $urlRouterProvider.otherwise('/home');
});

FPP.run(function (AuthService, $rootScope, $state, $stateParams, $timeout) {
    $rootScope.$on("$stateChangeStart", function (event, curr, prev) {
        if (typeof isLogin !== undefined) {  
            var authenticated = AuthService.isAuthenticated();
            // Check .state config to determine if authentication is needed 
            // and if so check if User is authenticated
            if (curr.authenticate == true && authenticated == false) {
                // User isn’t authenticated
                event.preventDefault();
                $state.go('login');
            } else if (curr.authenticate == false && authenticated == true) {
                // User is authenticated
                event.preventDefault();
                $state.go('dashboard.home');
            } else if (curr.authenticate == true && authenticated == true) {
                if (curr.name != 'openticket' && curr.name != 'openticketform') {
                    AuthService.isUserBlocked().then(function (data) {
                        if (data.Success == true) {
                            if (data.Blocked == true) {
                                event.preventDefault();
                                $state.go('openticket');
                            }
                        } else {
                            AuthService.logout();
                            event.preventDefault();
                            $state.go('login');
                        }
                    }, function (error) {

                    }).finally(function () {

                    });
                }
            }
            //else {
            //    if (curr.redirectTo) {
            //        event.preventDefault();
            //        $state.go(event.redirectTo, prev);
            //    }
            //}
        }
    });
    $rootScope.IndexCount = "1,108,756";
});
