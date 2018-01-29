Demo.controller('MainAppController', ['$scope', '$rootScope', '$state', '$localStorage', 'AuthService', 'AdminService', 'ngDialog', '$timeout',
    function ($scope, $rootScope, $state, $localStorage, AuthService, AdminService, ngDialog, $timeout) {

        $scope.showLoading = false;
        $scope.ngDialog = ngDialog;
        $scope.ShowDropdownMenu = false;

        $scope.LogOut = function () {
            AuthService.AdminLogout($scope.LoginData);
            $state.go('AdminLogin', { Message: { "Class": "alert-success", "Text": "Logout successfully." } });
        }

        AdminService.CallAjaxUsingGetRequest(API.GET_USER_MENU).then(function (data) {
            if (data.Success == true) {
                $scope.menudetail = data.menudetail;
                $rootScope.Userdetail = data.userdetail;
            }
        }, function (error) {

        }).finally(function () {

        });


        $scope.ChangePasswordPopUp = function () {
            ngDialog.open({
                template: 'Views/Popups/AdminChangePassword.html',
                scope: $scope,
                className: 'forgot-password-popup',
                controller:'AdminChangePasswordController',
                closeByDocument: true

            });
        }

        $scope.ToggleMenu = function () {
            $scope.ShowDropdownMenu = !$scope.ShowDropdownMenu;
        }

        
    }]);

Demo.controller('AdminChangePasswordController', ['$scope', '$rootScope', '$state', '$localStorage', 'AuthService', 'AdminService', 'ngDialog', '$timeout',
    function ($scope, $rootScope, $state, $localStorage, AuthService, AdminService, ngDialog, $timeout) {

        $scope.FormData = {};
        $scope.Submitting = false;
        $scope.Alert = { "AlertClass": null, "AlertMsg": null };

        $scope.ChangePassword = function () {
            if ($("#ChangePasswordForm").valid()) {
                $scope.Submitting = true;

                AdminService.CallAjaxUsingPostRequest(API.CHANGEADMINPASSWORD_API, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        $scope.Alert.AlertMsg = 'Password changed successfully.';
                        $scope.Alert.AlertClass = 'alert-success';
                        var AuthenticateData = {
                            "Token": data.Token
                        };

                        AuthService.AdminStore(AuthenticateData);
                        $timeout(function () {
                            $scope.ngDialog.close();
                        }, 2000);
                    } else {
                        $scope.Alert.AlertMsg = data.Message;
                        $scope.Alert.AlertClass = 'alert-danger';
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }

        $scope.ChangePasswordValidation = {
            rules: {
                oldpassword: {
                    required: true
                },
                newpassword: {
                    required: true,
                    minlength: 8,
                    goodPassword: true
                },
                confirmpassword: {
                    equalTo: "#newpassword",
                    required: true
                }
            }
        }
    }]);

Demo.controller('AdminVideoConfirmationController', ['$scope', '$rootScope', '$location', '$localStorage', 'AuthService', 'ngDialog', '$timeout',
    function ($scope, $rootScope, $location, $localStorage, AuthService, ngDialog, $timeout) {

        $scope.showLoading = true;
        $scope.Message = { Text: null, Class: null };
      
        AuthService.VideoConfirmationToken($location.search().videotoken).then(function (data) {
            if (data.Success == true) {
                $scope.Message.Text = data.Message;
                $scope.Message.Class = "alert-success";
            } else {
                $scope.Message.Text = data.Message;
                $scope.Message.Class = "alert-danger";
            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });
    }]);

Demo.controller('AdminVideoRescheduleController', ['$scope', '$rootScope', '$location', '$localStorage', 'AuthService', 'AdminService', 'ngDialog', '$timeout', '$filter',
    function ($scope, $rootScope, $location, $localStorage, AuthService, AdminService, ngDialog, $timeout, $filter) {

        $scope.showLoading = true;
        $scope.IsTokenValid = false;
        $scope.Message = { Text: null, Class: null };

        $scope.VideoToken = $location.search().videotoken;

        AuthService.ValidateVideoToken($scope.VideoToken).then(function (data) {
            if (data.Success == true) {
                $scope.Message.Text = "Reschedule your video call";
                $scope.Message.Class = "alert-success";
                $scope.IsTokenValid = true;
            } else {
                $scope.Message.Text = data.Message;
                $scope.Message.Class = "alert-danger";
            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });


        $scope.ngDialog = ngDialog;

        $scope.Alert = { "AlertClass": null, "AlertMsg": null };

        $scope.dateTimeNow = function () {
            $scope.date = new Date();
        };

        $scope.dateTimeNow();

        $scope.dateOptions = {
            showWeeks: false,
            startingDay: 0
        };

        // Disable weekend selection
        $scope.disabled = function (calendarDate, mode) {
            return mode === 'day' && (calendarDate.getDay() === 0 || calendarDate.getDay() === 6);
        };

        $scope.open = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpened = true;
        };

        $scope.dateOpened = false;
        $scope.hourStep = 1;
        $scope.format = "dd-MMM-yyyy";
        $scope.minuteStep = 15;
        // add min-time="minTime" to datetimepicker to use this value 
        $scope.minTime = new Date(0, 0, 0, Math.max(1, $scope.date.getHours() - 2), 0, 0, 0);

        $scope.showMeridian = true;
        $scope.timeToggleMode = function () {
            $scope.showMeridian = !$scope.showMeridian;
        };

        $scope.Scheduling = false;
        $scope.RescheduleVideoCall = function () {
            var SelectedTimeZione = $("#TimeZone").val();
            if (!$scope.date || $scope.date == '') {
                $scope.Alert.AlertMsg = 'Please select date and time.';
                $scope.Alert.AlertClass = 'alert-danger';
                return false;
            }

            if (!SelectedTimeZione || SelectedTimeZione == '') {
                $scope.Alert.AlertMsg = 'Please select timezone.';
                $scope.Alert.AlertClass = 'alert-danger';
                return false;
            }

            $scope.Scheduling = true;
            var RescheduleVideoRequest = {};
            RescheduleVideoRequest.DateTime = $filter('date')($scope.date, "yyyy-MM-dd HH:mm:ss");
            RescheduleVideoRequest.TimeZone = $("#TimeZone").val();

            AdminService.CallAjaxUsingPostRequest(API.RESCHEDULE_VIDEO_CALL_URL + "?token=" + $scope.VideoToken, RescheduleVideoRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.Message.Text = 'Video call rescheduled successfully.';
                    $scope.Message.Class = 'alert-success';
                    $scope.IsTokenValid = false;
                } else {
                    $scope.Message.Text = data.Message;
                    $scope.Message.Class = 'alert-danger';
                }
            }, function (error) {

            }).finally(function () {
                $scope.Scheduling = false;
            });
        }
    }]);