/** User Controller **/
FPP.controller('UserDashboardController', ['$scope', '$rootScope', '$state', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, ngDialog, $localStorage, UserService, toaster) {

        UserService.CallAuthenticateGetRequest(API.GETUSERDETAIL_URL).then(function (data) {
            if (data.Success == true) {
                $scope.UserDetails = data;
                $scope.UserDetails.AndroidAppLink = ANDROID_APP_LINK;
                $scope.UserDetails.IphoneAppLink = IPHONE_APP_LINK;
                $scope.DMCALinksStatus = $scope.UserDetails.DMCAStatus;
                $scope.LegalActionStatus = $scope.UserDetails.DMCALegalActionStatus;
                $scope.$broadcast('SentUserDetails', $scope.UserDetails);
            } else {
                toaster.pop("error", "", data.Message);
            }
        }, function (error) {

        }).finally(function () {

        });
    }]);

FPP.controller('DashboardHomeController', ['$scope', '$rootScope', '$state', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, ngDialog, $localStorage, UserService, toaster) {

        $scope.$on('SentUserDetails', function (event, data) {
            $scope.UserDetails = data;
            if (!$scope.UserDetails.Status || $scope.UserDetails.Status == "0") {
                if ($scope.UserDetails.AccessDMCANotice !== undefined && $scope.UserDetails.AccessDMCANotice == false) {
                    $state.go("dashboard.DMCA.GenerateNotices");
                }
            } else {
                if ($scope.UserDetails.AccessDMCANotice !== undefined && $scope.UserDetails.AccessDMCANotice == true) {
                    $state.go("dashboard.DMCA.DMCANoticeGenerator");
                }
            }
        });
    }]);

FPP.controller('UserProfileController', ['$scope', '$rootScope', '$location', '$window', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $location, $window, ngDialog, $localStorage, UserService, toaster) {

        $scope.deactivating = false;
        $scope.AndroidAppLink = ANDROID_APP_LINK;
        $scope.IphoneAppLink = IPHONE_APP_LINK;
        UserService.CallAuthenticateGetRequest(API.GETPROFILEDETAIL_URL).then(function (data) {
            if (data.Success == true) {
                $scope.UserDetails = data;
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });


        $scope.DeactivateStatus = function () {
            ngDialog.open({
                template: '/Views/Popups/DeactivateStatusConfirmationPopup.html',
                scope: $scope,
                className: 'confirmation-popup',
                closeByDocument: false
            });
        }

        $scope.CallDeactiveStatus = function () {
            //$scope.deactivating = true;
            //UserService.CallAuthenticateGetRequest(API.DEACTIVATEUSER_URL).then(function (data) {
            //    if (data.Success == true) {
            //        $scope.UserDetails.Status = "0";
            //        $('.ngdialog-close').click();
            //        $('.with-price .lcs_switch').lcs_off();
            //    } else {
            //        toaster.pop('error', '', data.Message);
            //    }
            //}, function (error) {

            //}).finally(function () {
            //    $scope.deactivating = false;
            //});
            if ($scope.UserDetails.PaymentMethod == "Paypal") {
                $window.location.href = PAYPAL_CANCELATION_URL;
            } else {
                $('.ngdialog-close').click();
            }
        }

    }]);

FPP.controller('UserInvoicesController', ['$scope', '$rootScope', '$state', '$http', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, $http, ngDialog, $localStorage, UserService, toaster) {

        $scope.showLoading = true;

        if ($state.current.name == "invoices") {
            $scope.viewAll = true;
        } else {
            $scope.viewAll = false;
        }

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


        UserService.CallAuthenticateGetRequest(API.GETUSERINVOICE_URL + "?viewAll=" + $scope.viewAll).then(function (data) {
            if (data.Success == true) {
                $scope.UserEmail = data.Email;
                $scope.UserInvoices = data.UserInvoices;
            } else {
                toaster.pop('error', '', data.Message);
            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });


        $scope.changeSorting = function (column) {
            var sort = $scope.sort;

            if (sort.column == column) {
                sort.descending = !sort.descending;
                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
            } else {
                sort.column = column;
                sort.descending = false;
                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
            }
        };

        $scope.DownloadInvoice = function (InvoiceId) {
            $http({
                method: 'GET',
                url: API.DOWNLOADINVOICE_URL + '?InvoiceId=' + InvoiceId,
                responseType: 'arraybuffer'
            }).success(function (data, status, headers) {
                debugger;
                headers = headers();
                var contentType = headers['content-type'];

                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data], { type: contentType });
                    var url = window.URL.createObjectURL(blob);

                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", "Invoice.pdf");

                    var clickEvent = new MouseEvent("click", {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                    console.log(ex);
                }
            }).error(function (data) {
                console.log(data);
            });
        }


    }]);

FPP.controller('UserTicketsController', ['$scope', '$rootScope', '$state', '$http', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, $http, ngDialog, $localStorage, UserService, toaster) {

        $scope.showLoading = true;

        if ($state.current.name == "tickets") {
            $scope.viewAll = true;
        } else {
            $scope.viewAll = false;
        }

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };

        UserService.CallAuthenticateGetRequest(API.GETUSERTICKETS_URL + "?viewAll=" + $scope.viewAll).then(function (data) {
            if (data.Success == true) {
                $scope.UserTickets = data.UserTickets;
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });


        $scope.changeSorting = function (column) {
            var sort = $scope.sort;

            if (sort.column == column) {
                sort.descending = !sort.descending;
                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
            } else {
                sort.column = column;
                sort.descending = false;
                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
            }
        };

       

    }]);

FPP.controller('ChangePasswordController', ['$scope', '$rootScope', '$state', '$timeout', '$localStorage', 'UserService', 'AuthService', 'toaster',
    function ($scope, $rootScope, $state, $timeout, $localStorage, UserService, AuthService, toaster) {
        $scope.submitting = false;
        $scope.PasswordFormData = {};

        $scope.ChangePassword = function () {
            if ($('#ChangePasswordForm').valid()) {
                $scope.submitting = true;

                UserService.CallAuthenticatePostRequest(API.CHANGEPASSWORD_URL, $scope.PasswordFormData)
                    .then(function (data) {
                        if (data.Success == true) {
                            $scope.PasswordFormData = {};
                            toaster.pop('success', '', data.Message);
                            delete $localStorage['AuthenticatedUser'];
                            var AuthenticateData = {
                                "Token": data.Token
                            };
                            AuthService.store(AuthenticateData);
                        } else {
                            toaster.pop('error', '', data.Message);
                        }
                    }, function (error) {

                    }).finally(function () {
                        $scope.submitting = false;
                    });
            }
        }

        /** Validation **/
        $scope.validationOptions = {
            rules: {
                OldPassword: {
                    required: true,
                    remote: {
                        url: API.CHEKOLDPASSWORD_URL,
                        type: "GET",
                        headers: {
                            'Authorization': 'Basic ' + $localStorage.AuthenticatedUser.Token,
                        }
                    }
                },
                NewPassword: {
                    required: true,
                    goodPassword: true
                },
                ConfirmNewPassword: {
                    required: true,
                    equalTo: '#newpassword'
                }
            },
            messages: {
                OldPassword: {
                    remote: 'Password is not correct.'
                },
                ConfirmNewPassword: {
                    equalTo: 'Password does not match.'
                }
            }
        };
    }]);

FPP.controller('OpenTicketFormController', ['$scope', '$rootScope', '$state', '$stateParams', '$filter', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, $filter, ngDialog, $localStorage, UserService, toaster) {
        //$scope.files = [];
        //$scope.OpenTicketFormData = {};
        //$scope.Email = $localStorage.AuthenticatedUser.Email;

        UserService.CallAuthenticateGetRequest(API.CHECK_USER_BLOCKED).then(function (data) {
            if (data.Success == true) {
                $scope.Blocked = data.Blocked;
            }
        }, function (error) {

        }).finally(function () {

        });
        
        $scope.showLoading = true;
        UserService.CallAuthenticateGetRequest(API.GET_CURRENT_USER_EMAIL).then(function (data) {
            if (data.Success == true) {
                $scope.Email = data.Email;
            }
        }, function (error) {

        }).finally(function () {
           $scope.showLoading = false;
        });

        $scope.Department = $filter('capitalize')($stateParams.type);
        $scope.Priority = 'Medium';
        $scope.Attachments = [{ name: "" }];

        $scope.SaveTicket = function () {
            if ($('#OpenTicketForm').valid()) {
                $scope.submitting = true;
                var formData = new FormData($('#OpenTicketForm')[0]);
                formData.append("Email", $scope.Email);
                formData.append("Department", $scope.Department);
                formData.append("Priority", $scope.Priority);

                UserService.SubmitForm(API.SAVETICKET_URL, formData).then(function (data) {
                    if (data.Success == true) {
                        $("#OpenTicketForm")[0].reset();

                        $scope.Department = $filter('capitalize')($stateParams.type);
                        $scope.Priority = 'Medium';
                        $scope.Attachments = [{ name: "" }];

                        toaster.pop('success', '', data.Message);
                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.submitting = false;
                });
            }
        }

        $scope.addRow = function (index) {
            if ($scope.Attachments[index].name && $scope.Attachments[index].name != '') {
                var name = { name: "" };
                if ($scope.Attachments.length <= index + 1) {
                    $scope.Attachments.splice(index + 1, 0, name);
                }
            } else {
                toaster.pop('error', '', 'Please attach the file before adding new field.');
            }
        };

        $scope.deleteRow = function ($event, name) {
            var index = $scope.Attachments.indexOf(name);
            if ($event.which == 1)
                $scope.Attachments.splice(index, 1);
        }

        // GET THE FILE INFORMATION.
        $scope.getFileDetails = function (e) {
            debugger;
            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };

        /** Validation **/
        $scope.validationOptions = {
            rules: {
                'Subject': {
                    required: true
                },
                'Department': {
                    required: true
                },
                'Priority': {
                    required: true
                },
                'Message': {
                    required: true
                },
                'file[]': {
                    extension: "jpg|gif|jpeg|png|pdf"
                }
            },
            messages: {
                'file[]': {
                    extension: "Uploaded file format is not valid. Allowed File Extenstions: .jpg, .gif, .jpeg, .png, .pdf."
                }
            }
        };

    }]);

FPP.controller('PaymentController', ['$scope', '$rootScope', '$state', 'ngDialog', '$localStorage', 'UserService', 'APICallService', 'toaster',
    function ($scope, $rootScope, $state, ngDialog, $localStorage, UserService, APICallService, toaster) {
        
        $scope.DiscountPrice = 0;
        $scope.AppliedCoupenCode = '';
        $scope.CouponId = null;
        $scope.DiscoutError = false;
        $scope.DiscoutErrorMessage = '';
        $scope.Tax = null;

        $scope.SelectedLinksCount = $localStorage.PaymentDetails.SelectedLinksCount;
        $scope.SelectedLinks = $localStorage.PaymentDetails.SelectedLinks;
        $scope.TotalAmount = $localStorage.PaymentDetails.TotalOrder;

        $scope.ValidateCouponCode = function () {
            if ($scope.CouponCodeInput && $scope.CouponCodeInput != '') {
                var CouponData = {};
                CouponData.CouponCode = $scope.CouponCodeInput;
                CouponData.TotalAmount = $scope.TotalAmount;


                $scope.ApplyCouponCode = APICallService.CallAjaxUsingPostRequest(API.COUPON_VALIDATE_URL, CouponData);
                $scope.ApplyCouponCode.then(function (data) {
                    if (data.Success == true) {
                        $scope.DiscoutError = false;
                        $scope.DiscountPrice = Number(data.DiscountPrice.toFixed(2));
                        $scope.AppliedCoupenCode = $scope.CouponCodeInput;
                        $scope.CouponCodeInput = '';
                        $scope.CouponId = data.CouponId;
                    } else {
                        $scope.DiscoutError = true;
                        $scope.DiscoutErrorMessage = data.Message;
                        $scope.CouponId = 0;
                    }
                }, function (error) {

                }).finally(function () {

                });
            } else {
                $scope.DiscoutError = false;
            }
        }

        $scope.RemoveCoupen = function () {
            var confirmation = confirm("Do you want to remove coupon ?");
            if (confirmation) {
                $scope.AppliedCoupenCode = '';
                $scope.DiscountPrice = 0;
            }
        }

        $scope.sales_tax_rate = 0;
        $scope.Tax = 0;
        //APICallService.CallAjaxUsingPostRequest(API.GET_LOGGEDINUSER_TAX).then(function (data) {
        //    if (data.Success == true) {
        //        $scope.sales_tax_rate = data.combined_rate;
        //        $scope.Tax = Number(($scope.TotalAmount * $scope.sales_tax_rate).toFixed(2));
        //    } else {
        //        $scope.sales_tax_rate = 0;
        //        $scope.Tax = 0;
        //    }
        //}, function (error) {

        //}).finally(function () {

        //});

        $scope.Pay = function () {
            var RequestData = {};

            if (!$scope.PaymentMethod || $scope.PaymentMethod == '') {
                toaster.pop('error', '', 'Please select payment method.');
                return false;
            }

            if ($scope.SelectedLinksCount == 0) {
                toaster.pop('error', '', 'Please add atleast one link.');
                return false;
            } else {
                RequestData.SelectedLinkDetail = $scope.SelectedLinks;
            }


            var PaymentData = {};
            PaymentData.SalesTax = $scope.Tax;
            PaymentData.PaymentMethod = $scope.PaymentMethod;
            PaymentData.Discount = $scope.DiscountPrice;
            PaymentData.SubTotal = $scope.TotalAmount;
            PaymentData.SaleTaxRate = $scope.sales_tax_rate;

            //if ($scope.PaymentType == 'FACE_RECOGNITION') {
            //    PaymentData.LinksCount = null;
            //    PaymentData.Type = 'Search';
            //} else {
            //    PaymentData.LinksCount = $scope.SelectedLinksCount;
            //    PaymentData.Type = 'Link Removal';
            //    PaymentData.PackageId = 4;
            //}

            PaymentData.LinksCount = $scope.SelectedLinksCount;
            PaymentData.Type = 'Link Removal';
            PaymentData.PackageId = 4;

            PaymentData.TotalOrder = Number((PaymentData.SubTotal + $scope.Tax - $scope.DiscountPrice).toFixed(2));
            PaymentData.CouponId = $scope.CoupenId;

            RequestData.PaymentDetails = PaymentData;

            UserService.CallAuthenticatePostRequest(API.SAVE_PAYMENT_DETAILS_URL, RequestData).then(function (data) {
                $(".loader").show();
                if (data.Success == true) {
                    $localStorage.PaymentDetails.PaymentId = data.PaymentId;
                    if ($scope.PaymentMethod == "Paypal") {
                        $scope.FormDetail = {};
                        $scope.FormDetail.method = "post";
                        $scope.FormDetail.name = "PaymentForm";
                        $scope.FormDetail.action = "https://www.paypal.com/cgi-bin/webscr";

                        $scope.FormDetail.fields = [
                                { "type": "hidden", "name": "cmd", "value": "_xclick" },
                                { "type": "hidden", "name": "currency_code", "value": "USD" },
                                { "type": "hidden", "name": "business", "value": "*****@*****.com" },
                                { "type": "hidden", "name": "return", "value": FPP_URL + "DMCA/payment-confirmation?status=success" },
                                { "type": "hidden", "name": "notify_url", "value": BASE_URL + "DMCAPayment.aspx?source=PayPal" },
                                { "type": "hidden", "name": "cancel_return", "value": FPP_URL + "DMCA/payment-confirmation?status=cancel" }
                        ];

                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "item_name", "value": $scope.SelectedLinksCount + " LINK REMOVAL $ " + PaymentData.TotalOrder + " USD" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "item_number", "value": data.PaymentId });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "no_shipping", "value": "1" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "amount", "value": "0.1" });
                        //$scope.FormDetail.fields.push({ "type": "hidden", "name": "email", "value": $scope.SignupData.Email });

                        $("form[name='" + $scope.FormDetail.name + "']").remove();

                        var PaymentForm = document.createElement("form");

                        PaymentForm.method = $scope.FormDetail.method;
                        PaymentForm.action = $scope.FormDetail.action;
                        PaymentForm.name = $scope.FormDetail.name;

                        angular.forEach($scope.FormDetail.fields, function (Field) {
                            var element = document.createElement("input");
                            element.type = Field.type;
                            element.value = Field.value;
                            element.name = Field.name;
                            PaymentForm.appendChild(element);
                        });

                        document.body.appendChild(PaymentForm);
                        PaymentForm.submit();

                        //delete $localStorage['PaymentDetails'];
                        //$state.go('dashboard.DMCA.PaymentConfirmation', { Completion: true });

                    } else if ($scope.PaymentMethod == "Amazon") {
                        OffAmazonPayments.Button("AmazonPayButton", AMAZON_MERCHANT_ID, {
                            type: "hostedPayment",
                            hostedParametersProvider: function (done) {
                                done(JSON.parse(data.AmazonParamters));
                            },
                            onError: function (errorCode) {
                                console.log(errorCode.getErrorCode() + " " + errorCode.getErrorMessage());
                            }
                        });
                        //$timeout(function () {
                        $("#AmazonPayButton img").trigger("click");
                        //}, 1000);
                    }
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }
    }]);

FPP.controller('LoanController', ['$scope', '$rootScope', '$state', 'ngDialog', '$localStorage', 'UserService', 'toaster',
    function ($scope, $rootScope, $state, ngDialog, $localStorage, UserService, toaster) {

        $scope.SelectedLinksCount = $localStorage.PaymentDetails.SelectedLinksCount;
        $scope.TotalAmount = $localStorage.PaymentDetails.TotalOrder;
    }]);

FPP.controller('StartPlanController', ['$scope', '$rootScope', '$state', 'ngDialog', '$cookies', '$localStorage', 'UserService', 'APICallService', 'toaster',
    function ($scope, $rootScope, $state, ngDialog, $cookies, $localStorage, UserService, APICallService, toaster) {
        
        var DataKey = btoa('PlanData');
      
        var PackObject = $cookies.getObject('PackageSelected');

        $scope.StartPlanData = {};
        $scope.StartPlanData.PaymentDetails = {};
        $scope.StartPlanData.CurrentStep = null;

        UserService.CallAuthenticateGetRequest(API.GET_CURRENT_USER_EMAIL).then(function (data) {
            if (data.Success == true) {
                $rootScope.Email = data.Email;
            }
        }, function (error) {

        }).finally(function () {

        });

        if (PackObject) {
            $rootScope.PlanDetails = {};
            $rootScope.PlanDetails.SelectedPackType = atob(PackObject.Type);
            $rootScope.PlanDetails.SelectPackageId = atob(PackObject.PackageId);
            $rootScope.PlanDetails.SelectPackPrice = PackObject.Price;

            if ($rootScope.PlanDetails.SelectedPackType == 'FACE_RECOGNITION') {
                $rootScope.PlanDetails.SearchAllowed = PackObject.SearchAllowed;
            }

            $scope.StartPlanData.PlanDetails = $rootScope.PlanDetails;
            $cookies.remove("PackageSelected");

            $state.go('StartNow.AccountDetails');
        } else {
            $scope.StartPlanData = $localStorage[DataKey];
            if ($scope.StartPlanData) {
                var CurrentStep = $scope.StartPlanData.CurrentStep;
                $rootScope.PlanDetails = $scope.StartPlanData.PlanDetails;
                
                switch (CurrentStep) {
                    case 3:
                        if ($scope.StartPlanData.PaymentDetails.PaymentId > 0) {
                            APICallService.CallAjaxUsingGetRequest(API.PAYMENT_CONFIRMATION_URL + '?PaymentId=' + $scope.StartPlanData.PaymentDetails.PaymentId, {}).then(function (data) {
                                if (data.Success == true && data.Processed == "Y") {
                                    delete $localStorage[DataKey];
                                    $state.go('StartNow.Completion');
                                }
                            }, function (error) {

                            }).finally(function () {

                            });
                        }
                        $state.go('StartNow.Checkout');
                        break;

                    default:
                        delete $localStorage[DataKey];
                        $state.go('Plans');
                        return false;
                }
            } else {
                $state.go('Plans');
                return false;
            }
        }

        $scope.SelectedPackType = $rootScope.PlanDetails.SelectedPackType;
        $scope.SelectPackPrice = $rootScope.PlanDetails.SelectPackPrice;

        $scope.$on('SavePhotoDetails', function (events, args) {
            $scope.submtting = true;
            $scope.PhotoDetail = {};
            $scope.PhotoDetail = args;
            $scope.PhotoDetail.Email = $scope.Email;
            APICallService.CallAjaxUsingPostRequest(API.SAVE_PHOTO_URL, $scope.PhotoDetail).then(function (data) {
                if (data.Success == true) {
                    $scope.StartPlanData.CurrentStep = 3;
                    $localStorage[DataKey] = $scope.StartPlanData;
                    $state.go('StartNow.Checkout');
                } else {
                    toaster.pop('error', '', data.Message);
                }
            }, function (error) {

            }).finally(function () {
                $scope.submtting = false;
            });
        });

        //$scope.$on('SavePaymentDetails', function (events, args) {
        //    $scope.showLoading = true;
        //    $scope.StartPlanData.PaymentDetails = args;
        //    UserService.CallAuthenticatePostRequest(API.STARTPLAN_URL, $scope.StartPlanData).then(function (data) {
        //        $scope.showLoading = false;
        //        if (data.Success == true) {
        //            delete $localStorage[DataKey];

        //            $state.go('StartNow.Completion');
        //        } else {
        //            toaster.pop('error', 'Error', data.Message);
        //        }
        //    }, function (error) {

        //    }).finally(function () {

        //    });
        //});

        $scope.$on('SavePaymentDetails', function (events, args) {
            $scope.showLoading = true;
            $scope.StartPlanData.PaymentDetails = args;
            if ($scope.StartPlanData.PaymentDetails.PaymentMethod == "Amazon") {
                $(".loader").show();
                var authRequest;
                OffAmazonPayments.Button("AmazonPayButton", AMAZON_MERCHANT_ID, {
                    type: "PwA",
                    authorization: function () {
                        loginOptions = { scope: "profile postal_code payments:widget payments:shipping_address", popup: true };
                        authRequest = amazon.Login.authorize(loginOptions, FPP_URL + "StartNow/amazon-pay");
                    },
                    onError: function (error) {
                        // something bad happened
                    }
                });
                $("#AmazonPayButton img").trigger("click");
            } else if ($scope.StartPlanData.PaymentDetails.PaymentMethod == "Paypal") {
                APICallService.CallAjaxUsingPostRequest(API.SAVE_PAYMENT_DETAILS_URL, $scope.StartPlanData).then(function (data) {
                    $scope.showLoading = false;
                    if (data.Success == true) {
                        $(".loader").show();

                        $scope.StartPlanData.PaymentDetails.PaymentId = data.PaymentId;
                        $localStorage[DataKey] = $scope.StartPlanData;

                        $scope.FormDetail = {};
                        $scope.FormDetail.method = "post";
                        $scope.FormDetail.name = "PaymentForm";
                        $scope.FormDetail.action = "https://www.paypal.com/cgi-bin/webscr";

                        $scope.FormDetail.fields = [
                                { "type": "hidden", "name": "cmd", "value": "_xclick-subscriptions" },
                                { "type": "hidden", "name": "hosted_button_id", "value": "NSZT3F6YVV57Q" },
                                { "type": "hidden", "name": "currency_code", "value": "USD" },
                                { "type": "hidden", "name": "business", "value": "*****@****.com" },
                                { "type": "hidden", "name": "return", "value": FPP_URL + "Plan/StartNow" },
                                { "type": "hidden", "name": "notify_url", "value": BASE_URL + "FRPayment.aspx?source=PayPal" },
                                { "type": "hidden", "name": "cancel_return", "value": FPP_URL + "Plan/StartNow" }
                        ];

                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "item_name", "value": "FACE RECOGNITION : " + $scope.StartPlanData.PlanDetails.SearchAllowed + " Search $ " + $scope.StartPlanData.PlanDetails.SelectPackPrice + " USD" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "item_number", "value": data.PaymentId });
                        //$scope.FormDetail.fields.push({ "type": "hidden", "name": "a3", "value": $scope.StartPlanData.PaymentDetails.TotalOrder });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "a3", "value": "0.01" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "p3", "value": "1" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "t3", "value": "M" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "src", "value": "1" });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "email", "value": $scope.Email });
                        $scope.FormDetail.fields.push({ "type": "hidden", "name": "tax_rates", "value": $scope.StartPlanData.PaymentDetails.SaleTaxRate });

                        $("form[name='" + $scope.FormDetail.name + "']").remove();

                        var PaymentForm = document.createElement("form");

                        PaymentForm.method = $scope.FormDetail.method;
                        PaymentForm.action = $scope.FormDetail.action;
                        PaymentForm.name = $scope.FormDetail.name;

                        angular.forEach($scope.FormDetail.fields, function (Field) {
                            var element = document.createElement("input");
                            element.type = Field.type;
                            element.value = Field.value;
                            element.name = Field.name;
                            PaymentForm.appendChild(element);
                        });

                        document.body.appendChild(PaymentForm);
                        PaymentForm.submit();
                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        });
    }]);

FPP.controller('StartNowPayWithAmazonController', ['$scope', '$rootScope', '$state', 'UserService', 'toaster', '$window', '$localStorage', '$location',
    function ($scope, $rootScope, $state, UserService, toaster, $window, $localStorage, $location) {

        $scope.showLoading = false;
        var DataKey = btoa('PlanData');

        $scope.ConfirmSubscription = function () {
            if ($window.billingAgreementId) {
                $(".loader").show();
                $scope.showLoading = true;
                $scope.Data = $localStorage[DataKey];
                $scope.Data.billingAgreementId = $window.billingAgreementId;
                UserService.CallAuthenticatePostRequest(API.SAVE_PAYMENT_DETAILS_URL, $scope.Data).then(function (data) {
                    if (data.Success == true) {
                        $scope.Data.PaymentDetails.PaymentId = data.PaymentId;
                        $localStorage[DataKey] = $scope.Data;
                        window.location = FPP_URL + "Plan/StartNow";
                    } else {
                        $(".loader").hide();
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.showLoading = false;
                });
            } else {

            }
        }

        $scope.StartOver = function () {
            amazon.Login.logout();
            document.cookie = "amazon_Login_accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            window.location = FPP_URL + "Plan/StartNow";
        }
    }]);
