FPP.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
    $stateProvider
    .state('Admin.SearchManagement', {
        url: '/searches-management',
        templateUrl: 'Views/ManageSearches.html',
        ncyBreadcrumb: {
            label: 'Search Management'
        },
        params: { Message: null },
        controller: 'AdminSearchReportController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.SearchManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    } 
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.ManageUserSearch', {
        url: '/manage-user-search',
        templateUrl: 'Views/ManageUserSearch.html',
        ncyBreadcrumb: {
            label: 'User Search'
        },
        params: { SearchId: null, Message: null },
        controller: 'AdminUserSearchController'
    })
    .state('Admin.FaceManagement', {
        url: '/face-management',
        templateUrl: '<ui-view></ui-view>',
        ncyBreadcrumb: {
            label: 'Face Management'
        },
        abstract:true,
        params: { Message: null },
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.FaceManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.FaceManagement.UnprocessedFaces', {
        url: '/unprocessed-faces',
        templateUrl: 'Views/UnprocessedFaces.html',
        ncyBreadcrumb: {
            label: 'Unprocessed Faces'
        },
        params: { Message: null },
        controller: 'AdminSearchResultsController',
    })
    .state('Admin.FaceManagement.ProcessedFaces', {
        url: '/processed-faces',
        templateUrl: 'Views/ProcessedFaces.html',
        ncyBreadcrumb: {
            label: 'Processed Faces'
        },
        params: { SearchId: null, Message: null },
        controller: 'AdminVerifiedFacesController'
    })
    .state('Admin.Confirmation', {
        url: '/confirmation',
        templateUrl: 'Views/Confirmation.html',
        params: { ConfirmationResults: null },
        ncyBreadcrumb: {
            label: 'Confirmation'
        },
        controller: 'ActionConfirmationController',
    })
    .state('Admin.ChildAbuseLinks', {
        url: "/child-abuse-links",
        templateUrl: 'Views/ChildAbuseLinksListing.html',
        ncyBreadcrumb: {
            label: 'Child Pornography Links'
        },
        controller: 'AdminChildAbuseController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.ChildAbuseLinks').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.UserManagement', {
        url: '/user-management',
        templateUrl: 'Views/UserManagement.html',
        ncyBreadcrumb: {
            label: 'User Management'
        },
        params: { Message: null },
        controller: 'AdminUsersController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.UserManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.TagsManagement', {
        url: '/tags-management',
        templateUrl: 'Views/TagsManagement.html',
        ncyBreadcrumb: {
            label: 'Tags Management'
        },
        params: { Message: null },
        controller: 'AdminTagsController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.TagsManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }

    })
     .state('Admin.RolesManagement', {
         url: '/roles-management',
         templateUrl: 'Views/RolesManagement.html',
         ncyBreadcrumb: {
             label: 'Role Management'
         },
         params: { Message: null },
         controller: 'AdminRolesController',
         resolve: {
             CheckAccessPermission: function (AuthService, $location) {
                 AuthService.CheckPermission('Admin.RolesManagement').then(function (data) {
                     if (data.isValid != true) {
                         $location.path('/dashboard');
                     }
                 }, function (error) {

                 }).finally(function () {

                 });
             }
         }
     })
    .state('Admin.CustomerManagement', {
        url: '/customer-management',
        templateUrl: 'Views/CustomerManagement.html',
        ncyBreadcrumb: {
            label: 'Customer Management'
        },
        params: { Message: null },
        controller: 'AdminCustomersController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.CustomerManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.UsersEmailRegistration', {
        url: '/users-registration',
        templateUrl: 'Views/UserEmailRegistration.html',
        ncyBreadcrumb: {
            label: 'Users Registrations'
        },
        params: { Message: null },
        controller: 'UsersRegistrationManagement',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.UsersEmailRegistration').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.VideoSchedulings', {
        url: '/video-scheduling-list',
        templateUrl: 'Views/VideoSchedulings.html',
        ncyBreadcrumb: {
            label: 'Video Schedulings'
        },
        params: { SearchId: null, Message: null },
        controller: 'VideoSchedulingListManagementController',
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.UsersEmailRegistration').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.CouponManagement', {
        url: '/coupon-management',
        templateUrl: '<ui-view></ui-view>',
        ncyBreadcrumb: {
            label: 'Coupon Management'
        },
        abstract:true,
        resolve: {
            CheckAccessPermission: function (AuthService, $location) {
                AuthService.CheckPermission('Admin.CouponManagement').then(function (data) {
                    if (data.isValid != true) {
                        $location.path('/dashboard');
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    })
    .state('Admin.CouponManagement.UserCoupons', {
        url: '/user-coupons',
        templateUrl: 'Views/CouponManagement.html',
        ncyBreadcrumb: {
            label: 'User Coupons'
        },
        params: { Message: null },
        controller: 'AdminCouponController'
    })
    .state('Admin.CouponManagement.Referrer', {
        url: '/referer-coupons',
        templateUrl: 'Views/ReferrerManagement.html',
        ncyBreadcrumb: {
            label: 'Referrer Coupons'
        },
        params: { Message: null },
        controller: 'AdminReferrerController'
    })
    .state('Admin.CouponManagement.ReferrerDetails', {
        url: '/referrer-details',
        templateUrl: 'Views/ReferrerDetails.html',
        ncyBreadcrumb: {
            label: 'Referrer Details'
        },
        params: { ReferrerId: null, Message: null },
        controller: 'AdminReferrerDetails'
    })
    .state('Admin.Video', {
        url: '/video-call',
        templateUrl: 'Views/Video/quickstart/public/index.html',
        ncyBreadcrumb: {
            label: 'Video Call'
        }
    })
    .state('Admin.ScreenListing', {
         url: '/screen-list',
         templateUrl: 'Views/ScreenListing.html',
         ncyBreadcrumb: {
             label: 'Screen Listing'
         },
         params: { Message: null },
         controller: 'AdminScreenController'
    });
}]);
