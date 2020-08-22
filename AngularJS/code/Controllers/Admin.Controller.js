// controller.js

Demo.controller('AdminLoginController', ['$scope', '$rootScope', '$state', '$stateParams', '$localStorage', 'AuthService', 'AdminService',
    function ($scope, $rootScope, $state, $stateParams, $localStorage, AuthService, AdminService) {
        debugger;
        $scope.showLoading = false;

        $scope.Message = $stateParams.Message || {};

        $scope.FPP_URL = FPP_URL;
        $scope.LoginData = { "Email": null, "Password": null };

        $scope.Login = function () {
            if ($("#LoginForm").valid()) {
                $scope.showLoading = true;
                AuthService.AdminLogin($scope.LoginData).then(function (data) {
                    if (data.Success == true) {
                        var AuthenticateData = {
                            "Token": data.Token
                        };

                        AuthService.AdminStore(AuthenticateData);
                        $state.go('Admin.Dashboard');
                    } else {
                        $scope.Message.Class = "alert alert-danger";
                        $scope.Message.Text = data.Message;
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.showLoading = false;
                });
            }
        }

        /** Validation **/
        $scope.validationOptions = {
            rules: {
                'Email': { required: true, email: true },
                'Password': { required: true }
            },
            messages: {
                'Email': { 'required': 'Please enter username', 'email': 'Username or email is not valid' },
                'Password': { 'required': "Please enter password" }
            },
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent(".input-group"));
            }
        };

    }]);

Demo.controller('AdminSearchResultsController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;
        $scope.showLoadMoreFaces = true;

        $scope.ngDialog = ngDialog;

        $scope.Message = $stateParams.Message;

        $scope.SelectedTag = null;

        $scope.limit = 48;
        $scope.PageNumber = 1;

        $scope.noSelectedItems = 0;

        AdminService.CallAjaxUsingGetRequest(API.FILTER_SEARCH_RESULT + "?PageNumber=" + $scope.PageNumber).then(function (data) {
            if (data.Success == true) {
                $scope.SearchFaces = data.searchFaces;

                if ($scope.SearchFaces.length < $scope.limit) {
                    $scope.showLoadMore = false;
                }
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
            $scope.showLoadMoreFaces = false;
        });

        $scope.$watch('SearchFaces', function () {
            var no = 0;
            $scope.selectedFaces = [];

            if ($scope.SearchFaces) {
                for (var i = 0; i < $scope.SearchFaces.length; i++) {
                    if ($scope.SearchFaces[i].selected === true) {
                        $scope.selectedFaces.push($scope.SearchFaces[i]);
                        no++;
                    }
                }
                $scope.noSelectedItems = no;
            }
        }, true);

        $scope.TakeAction = function (Action) {
            if ($scope.noSelectedItems > 0) {
                var ConfirmationRequest = {};
                ConfirmationRequest.SelectedFaces = $scope.selectedFaces;
                ConfirmationRequest.Action = Action;

                $state.go('Admin.Confirmation', { ConfirmationResults: ConfirmationRequest });
            } else {
                toaster.pop('error', '', 'Please select atleast one image.');
            }
        }

        $scope.myPagingFunction = function () {
            if ($scope.showLoadMore && !$scope.showLoadMoreFaces) {
                $scope.showLoadMoreFaces = true;
                $scope.PageNumber += 1;
                AdminService.CallAjaxUsingGetRequest(API.FILTER_SEARCH_RESULT + "?PageNumber=" + $scope.PageNumber).then(function (data) {
                    if (data.Success == true) {
                        if (data.searchFaces.length > 0) {
                            $scope.SearchFaces.push.apply($scope.SearchFaces, data.searchFaces);
                        }
                        if (data.searchFaces.length < $scope.limit) {
                            $scope.showLoadMore = false;
                        }
                    } else {

                    }
                }, function (error) {

                }).finally(function () {
                    $scope.showLoadMoreFaces = false;
                });
            }
        }

        $scope.OpenTagPopup = function () {
            if ($scope.noSelectedItems == 0) {
                toaster.pop('error', '', 'Please select atleast one image.');
                return false;
            }

            ngDialog.open({
                template: 'Views/Popups/ApplyTagPopup.html',
                scope: $scope,
                controller: 'ApplyTagController',
                className: 'tagging-popup',
                closeByDocument: false
            });
        }

    }]);

Demo.controller('AdminVerifiedFacesController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;
        $scope.showLoadMoreFaces = true;

        $scope.ngDialog = ngDialog;

        $scope.Message = $stateParams.Message;

        $scope.SelectedTag = null;

        $scope.limit = 48;
        $scope.PageNumber = 1;

        $scope.noSelectedItems = 0;

        var VerifiedFacesRequest = {};
        VerifiedFacesRequest.PageNumber = $scope.PageNumber;

        AdminService.CallAjaxUsingPostRequest(API.GET_VERIFIED_FACES_API, VerifiedFacesRequest).then(function (data) {
            if (data.Success == true) {
                $scope.SearchFaces = data.searchFaces;

                if ($scope.SearchFaces.length < $scope.limit) {
                    $scope.showLoadMore = false;
                }
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
            $scope.showLoadMoreFaces = false;
        });

        AdminService.CallAjaxUsingGetRequest(API.GET_TEAM_API).then(function (data) {
            if (data.Success == true) {
                $scope.TeamListing = data.resultdata;
            }
        }, function (error) {

        }).finally(function () {

        });

        
        $scope.ApplyFilter = function () {
            $scope.PageNumber = 1;
            var VerifiedFacesRequest = {};
            VerifiedFacesRequest.PageNumber = $scope.PageNumber;
            VerifiedFacesRequest.TeamMemberId = parseInt($scope.TeamMemberId);

            AdminService.CallAjaxUsingPostRequest(API.GET_VERIFIED_FACES_API, VerifiedFacesRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.SearchFaces = data.searchFaces;

                    if ($scope.SearchFaces.length < $scope.limit) {
                        $scope.showLoadMore = false;
                    }
                } else {

                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });
        }

        $scope.myPagingFunction = function () {
            if ($scope.showLoadMore && !$scope.showLoadMoreFaces) {
                $scope.showLoadMoreFaces = true;
                $scope.PageNumber += 1;
                var VerifiedFacesRequest = {};
                VerifiedFacesRequest.PageNumber = $scope.PageNumber;

                if ($scope.TeamMemberId)
                    VerifiedFacesRequest.TeamMemberId = parseInt($scope.TeamMemberId);

                AdminService.CallAjaxUsingPostRequest(API.GET_VERIFIED_FACES_API, VerifiedFacesRequest).then(function (data) {
                    if (data.Success == true) {
                        if (data.searchFaces.length > 0) {
                            $scope.SearchFaces.push.apply($scope.SearchFaces, data.searchFaces);
                        }
                        if (data.searchFaces.length < $scope.limit) {
                            $scope.showLoadMore = false;
                        }
                    } else {

                    }
                }, function (error) {

                }).finally(function () {
                    $scope.showLoadMoreFaces = false;
                });
            }
        }

        $scope.$watch('SearchFaces', function () {
            var no = 0;
            $scope.selectedFaces = [];

            if ($scope.SearchFaces) {
                for (var i = 0; i < $scope.SearchFaces.length; i++) {
                    if ($scope.SearchFaces[i].selected === true) {
                        $scope.selectedFaces.push($scope.SearchFaces[i]);
                        no++;
                    }
                }
                $scope.noSelectedItems = no;
            }
        }, true);

        $scope.OpenTagPopup = function () {
            if ($scope.noSelectedItems == 0) {
                toaster.pop('error', '', 'Please select atleast one image.');
                return false;
            }

            ngDialog.open({
                template: 'Views/Popups/ApplyTagPopup.html',
                scope: $scope,
                controller: 'ApplyTagController',
                className: 'tagging-popup',
                closeByDocument: false
            });
        }

        $scope.RemoveTags = function () {
            var confirmation = confirm("Do you want to remove tags?");
            if (confirmation) {
                var ConfirmationRequest = {};
                ConfirmationRequest.faceImage = $scope.selectedFaces;
                ConfirmationRequest.Tags = null;

                AdminService.CallAjaxUsingPostRequest(API.APPLY_TAG_URL, ConfirmationRequest).then(function (data) {
                    if (data.Success == true) {
                        for (var i = 0; i < $scope.selectedFaces.length; i++) {
                            var index = $scope.SearchFaces.findIndex(x=>x.resultid == $scope.selectedFaces[i].resultid);
                            if (index !== -1) {
                                $scope.SearchFaces[index].selected = false;
                                $scope.SearchFaces[index].tagsString = null;
                                $scope.SearchFaces[index].tags = null;
                            }
                        }

                        $scope.SelectedTags = [];
                        $scope.selectedFaces = [];
                        $scope.noSelectedItems = 0;

                        $scope.ngDialog.close();

                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }
    }]);

Demo.controller('ApplyTagController', ['$scope', '$rootScope', 'AdminService', 'toaster', '$timeout',
    function ($scope, $rootScope, AdminService, toaster, $timeout) {

        $scope.LodingTags = true;
        $scope.Applying = false;

        $scope.BASE_URL = BASE_URL;

        $scope.FancyBoxOption = {
            'titleShow': false
        };

        AdminService.CallAjaxUsingGetRequest(API.GET_TAGS_API + "?q=").then(function (data) {
            if (data.Success == true) {
                $scope.TagsList = data.TagsData;
                for (var i = 0; i < $scope.TagsList.length; i++) {
                    if ($scope.selectedFaces.length == 1 && $scope.selectedFaces[0].tags.length > 0 && $scope.selectedFaces[0].tags.indexOf($scope.TagsList[i].TagId) > -1) {
                        $scope.TagsList[i].selected = true;
                    }
                }
            }
        }, function (error) {

        }).finally(function () {
            $scope.LodingTags = false;
        });

        $scope.$watch('TagsList', function () {
            var no = 0;
            $scope.SelectedTags = [];

            if ($scope.TagsList) {
                for (var i = 0; i < $scope.TagsList.length; i++) {
                    if ($scope.TagsList[i].selected === true) {
                        $scope.SelectedTags.push($scope.TagsList[i]);
                        no++;
                    }
                }
                $scope.noSelectedTags = no;
            }
        }, true);

        $scope.ApplyTag = function () {
            if ($scope.SelectedTags.length == 0) {
                toaster.pop('error', '', 'Please select any tag before applying.');
                return false;
            }

            var ConfirmationRequest = {};
            ConfirmationRequest.faceImage = $scope.selectedFaces;
            ConfirmationRequest.Tags = $scope.SelectedTags;
            $scope.Applying = true;
            AdminService.CallAjaxUsingPostRequest(API.APPLY_TAG_URL, ConfirmationRequest).then(function (data) {
                debugger;
                if (data.Success == true) {
                    var TagsString = "";
                    var TagsArr = [];
                    for (var i = 0; i < $scope.SelectedTags.length; i++) {
                        TagsString += TagsString == "" ? $scope.SelectedTags[i].TagName : ", " + $scope.SelectedTags[i].TagName;
                        TagsArr.push($scope.SelectedTags[i].TagId);
                    }

                    for (var i = 0; i < $scope.selectedFaces.length; i++) {
                        var index = $scope.SearchFaces.findIndex(x=>x.resultid == $scope.selectedFaces[i].resultid);
                        if (index !== -1) {
                            $scope.SearchFaces[index].selected = false;
                            $scope.SearchFaces[index].tagsString = TagsString;
                            $scope.SearchFaces[index].tags = TagsArr;
                        }
                    }
                    $scope.SelectedTags = [];
                    $scope.selectedFaces = [];
                    $scope.noSelectedItems = 0;
                    $timeout(function () { $(".icon-tag").popover(); }, 500)

                    $scope.ngDialog.close();

                } else {
                    toaster.pop('error', '', data.Message);
                }
            }, function (error) {

            }).finally(function () {
                $scope.Applying = false;
            });
        }
    }]);

Demo.controller('AdminSearchReportController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var searchReportRequest = {};
        searchReportRequest.PageNo = $scope.PageNo;
        searchReportRequest.PageSize = $scope.PageSize;
        searchReportRequest.HitRecordid = $scope.FilterBySearchId;
        searchReportRequest.UserEmail = $scope.FilterByEmail;
        searchReportRequest.Status = $scope.FilterByStatus;
        searchReportRequest.ControllerEmail = $scope.FilterByController;
        searchReportRequest.DateTime = $filter('date')($scope.FilterByDate, "yyyy-MM-dd");

        AdminService.CallAjaxUsingPostRequest(API.ALL_SEARCH_REPORTS, searchReportRequest).then(function (data) {
            if (data.Success == true) {
                $scope.SearchReports = data.searchReport;
                $scope.TotalItems = data.totalcount;
                $scope.ControllerEmail = data.ControllerEmail;
                $scope.ControllerId = data.ControllerId;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        AdminService.CallAjaxUsingGetRequest(API.GET_SEARCH_MANAGEMENT_TEAM_LIST + "?searchString=").then(function (data) {
            if (data.Success == true) {
                $scope.ControllerData = data.UserByRoles;
            }
        }, function (error) {

        }).finally(function () {

        });

        $scope.StatusData = [
            { Name: 'All', Value: 'A' },
            { Name: 'Pending', Value: 'P' },
            { Name: 'In Progress', Value: 'I' },
            { Name: 'Completed', Value: 'C' }
        ];

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var searchReportRequest = {};
            searchReportRequest.PageNo = $scope.PageNo;
            searchReportRequest.PageSize = $scope.PageSize;
            searchReportRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            searchReportRequest.SortColumn = $scope.sort.column;
            searchReportRequest.HitRecordid = $scope.FilterBySearchId;
            searchReportRequest.UserEmail = $scope.FilterByEmail;
            searchReportRequest.Status = $scope.FilterByStatus;
            searchReportRequest.ControllerEmail = $scope.FilterByController;
            searchReportRequest.DateTime = $filter('date')($scope.FilterByDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.ALL_SEARCH_REPORTS, searchReportRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.SearchReports = data.searchReport;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.AssignController = function (SearchId, index) {
            $scope.ShowSearch(SearchId, $scope.AssignController[index]);
        }

        $scope.ReAssignController = function (SearchId, index) {
            var ReAssignControllerRequest = {};
            ReAssignControllerRequest.Hitrecord = SearchId;
            ReAssignControllerRequest.ControllerUserId = $scope.ReAssignController[index];

            AdminService.CallAjaxUsingPostRequest(API.ASSIGN_CONTROLLER, ReAssignControllerRequest).then(function (data) {
                if (data.Success == true) {
                    if (data.IsAssigned && data.IsRedirect) {
                        $state.go("Admin.ManageUserSearch", { SearchId: SearchId });
                    } else {
                        if (data.IsAssigned) {
                            $scope.Template = "ASSIGNED";

                            var UserIndex = $scope.ControllerData.findIndex(x=>x.UserId == $scope.ReAssignController[index]);
                            var SearchIndex = $scope.SearchReports.findIndex(x=>x.hitrecordid == SearchId);

                            $scope.SearchReports[SearchIndex].status = 'P';
                            $scope.SearchReports[SearchIndex].controlleremail = $scope.ControllerData[UserIndex].Email;
                            $scope.ReAssignController[index] = null;
                        } else {
                            $scope.Template = "NOT_ASSIGNED";
                        }

                        ngDialog.open({
                            template: 'Views/Popups/SearchAsignPopup.html',
                            scope: $scope,
                            className: 'confirmation-popup',
                            closeByDocument: false
                        });
                    }
                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.ShowSearch = function (SearchId, ControllerId) {
            var AssignControllerRequest = {};
            AssignControllerRequest.Hitrecord = SearchId;
            AssignControllerRequest.ControllerUserId = ControllerId;

            AdminService.CallAjaxUsingPostRequest(API.ASSIGN_CONTROLLER, AssignControllerRequest).then(function (data) {
                if (data.Success == true) {
                    if (data.IsAssigned && data.IsRedirect) {
                        $state.go("Admin.ManageUserSearch", { SearchId: SearchId });
                    } else {
                        if (data.IsAssigned) {
                            debugger;
                            $scope.Template = "ASSIGNED";

                            var UserIndex = $scope.ControllerData.findIndex(x=>x.UserId == ControllerId);
                            var SearchIndex = $scope.SearchReports.findIndex(x=>x.hitrecordid == SearchId);

                            $scope.SearchReports[SearchIndex].status = 'P';
                            $scope.SearchReports[SearchIndex].controlleremail = $scope.ControllerData[UserIndex].Email;
                        } else {
                            $scope.Template = "NOT_ASSIGNED";
                        }

                        ngDialog.open({
                            template: 'Views/Popups/SearchAsignPopup.html',
                            scope: $scope,
                            className: 'confirmation-popup',
                            closeByDocument: false
                        });
                    }
                }
            }, function (error) {

            }).finally(function () {

            });
        }

    }]);

Demo.controller('AdminUserSearchController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster) {

        if (!$stateParams.SearchId || $stateParams.SearchId == 0) {
            $state.go('Admin.SearchManagement');
        } else {
            $scope.showLoading = true;
            $scope.showLoadMore = true;
            $scope.Blocked = false;

            $scope.FilterInput = null;

            $scope.hitrecordId = $stateParams.SearchId;
            $scope.Message = $stateParams.Message;

            $scope.PageNo = 1;
            $scope.PageSize = 16;
            $scope.maxSize = 0;

            $scope.noSelectedItems = 0;
            $scope.noFlagedItems = 0;

            var UserResultRequest = {};
            UserResultRequest.HitrecordId = $stateParams.SearchId;
            UserResultRequest.PageNumber = $scope.PageNo;

            AdminService.CallAjaxUsingPostRequest(API.USER_SEARCH_RESULT, UserResultRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.SearchFaces = data.searchFaces;
                    $scope.TotalItems = data.totalCount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });

            var userFacesRequest = {};
            userFacesRequest.hitrecordId = $stateParams.SearchId;

            AdminService.CallAjaxUsingPostRequest(API.USER_FACES, userFacesRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.userFaces = data.UserFaces;
                } else {
                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });

            $scope.$watch('SearchFaces', function () {
                var SelectedFacesCount = 0;
                var FlagedFacesCount = 0;
                $scope.selectedFaces = [];
                $scope.FlagedFaces = [];

                if ($scope.SearchFaces) {
                    for (var i = 0; i < $scope.SearchFaces.length; i++) {
                        if ($scope.SearchFaces[i].selected === true) {
                            $scope.selectedFaces.push($scope.SearchFaces[i]);
                            SelectedFacesCount++;
                        }
                        //else {
                        //    var index = $scope.selectedFaces.findIndex(x=>x.resultid == $scope.SearchFaces[i].resultid);
                        //    if (index !== -1) {
                        //        $scope.selectedFaces.splice(index, 1);
                        //        SelectedFacesCount--;
                        //    }
                        //}

                        if ($scope.SearchFaces[i].flaged === true) {
                            $scope.FlagedFaces.push($scope.SearchFaces[i]);
                            FlagedFacesCount++;
                        }
                        //else {
                        //    var index = $scope.FlagedFaces.findIndex(x=>x.resultid == $scope.SearchFaces[i].resultid);
                        //    if (index !== -1) {
                        //        $scope.FlagedFaces.splice(index, 1);
                        //        SelectedFacesCount--;
                        //    }
                        //}
                    }
                    $scope.noSelectedItems = SelectedFacesCount;
                    $scope.noFlagedItems = FlagedFacesCount;
                }
            }, true);

            $scope.TakeAction = function (Action) {
                if ($scope.noSelectedItems > 0) {
                    var ConfirmationRequest = {};
                    ConfirmationRequest.SelectedFaces = $scope.selectedFaces;
                    ConfirmationRequest.FlagedFaces = $scope.FlagedFaces;
                    ConfirmationRequest.Action = Action;
                    ConfirmationRequest.HitRecordId = $stateParams.SearchId;
                    ConfirmationRequest.UserFaces = $scope.userFaces;

                    $state.go('Admin.Confirmation', { ConfirmationResults: ConfirmationRequest });
                } else {
                    if (Action == 4) {
                        var ConfirmationRequest = {};
                        ConfirmationRequest.SelectedFaces = $scope.selectedFaces;
                        ConfirmationRequest.Action = Action;
                        ConfirmationRequest.HitRecordId = $stateParams.SearchId;
                        ConfirmationRequest.UserFaces = $scope.userFaces;
                        $state.go('Admin.Confirmation', { ConfirmationResults: ConfirmationRequest });
                    } else {
                        toaster.pop('error', '', 'Please select atleast one image.');
                    }
                }
            }

            $scope.myPagingFunction = function () {
                //var UserResultRequest = {};
                //UserResultRequest.HitrecordId = $stateParams.SearchId;
                //UserResultRequest.PageNumber = $scope.PageNo;

                //AdminService.CallAjaxUsingPostRequest(API.USER_SEARCH_RESULT, UserResultRequest).then(function (data) {
                //    if (data.Success == true) {
                //        $scope.SearchFaces = data.searchFaces;
                //        $scope.TotalItems = data.totalCount;
                //        $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                //    } else {

                //    }
                //}, function (error) {

                //}).finally(function () {
                //    $scope.showLoading = false;
                //});
            }
        }

        $scope.ApplyFilter = function (totalcount) {
            $scope.FilterOnChange();
            $scope.TotalItems = totalcount;
            $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
        }

        $scope.FilterOnChange = function (e) {
            if ($scope.FilterInput) {
                if (e !== undefined && e.tags != null) {
                    var FilterArr = $scope.FilterInput.split(",");
                    var conditionString = true;
                    angular.forEach(FilterArr, function (value, key) {
                        if (conditionString == true) {
                            conditionString = e.tags.indexOf(value) > -1;
                        }
                    });
                    return conditionString;
                } else {
                    return false;
                }

            } else {
                return true;
            }

        }

        $scope.ConfirmationBlockUserPopup = function () {
            ngDialog.open({
                template: 'Views/Popups/BlockUserPopup.html',
                scope: $scope,
                className: 'confirmation-popup',
                closeByDocument: false
            });
        }

        $scope.BlockUser = function () {
            $scope.Blocking = true;
            var BlockUserRequest = {};
            BlockUserRequest.UserId = $scope.userFaces.id;
            BlockUserRequest.Active = "Y";

            AdminService.CallAjaxUsingPostRequest(API.ACTIVE_DEACTIVE_CUSTOMER_API, BlockUserRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.Message = { "Class": "alert-success", "Text": "User Blocked Successfully." };
                    $scope.Blocked = true;
                } else {
                    $scope.Message = { "Class": "alert-error", "Text": data.Message };
                }
            }, function (error) {

            }).finally(function () {
                $('.ngdialog-close').click();
                $scope.Blocking = false;
            });
        }

        $scope.OpenVideoSchedulePopup = function () {
            ngDialog.open({
                template: 'Views/Popups/VideoSchedulingPopup.html',
                controller: 'VideoScheduleController',
                scope: $scope,
                closeByDocument: false
            });
        }

        $scope.OpenBlurImagePopup = function (FaceDetail, index) {
            $scope.SingleFaceImage = FaceDetail;
            $scope.CurrentIndex = index;
            ngDialog.open({
                template: 'Views/Popups/BlurImagePopup.html',
                scope: $scope,
                controller: 'ImageBlurController',
                closeByDocument: false
            });
        }

    }]);

Demo.controller('VideoScheduleController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$timeout', '$filter',
function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $timeout, $filter) {

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
        $scope.ScheduleVideoCallWithUser = function () {
            var SelectedTimeZione = $("#TimeZone").val();
            if (!$scope.date || $scope.date == '') {
                $scope.Alert.AlertMsg = 'Please select date and time.';
                $scope.Alert.AlertClass = 'alert-danger';
                return false;
            }

            //if (!SelectedTimeZione || SelectedTimeZione == '') {
            //    $scope.Alert.AlertMsg = 'Please select timezone.';
            //    $scope.Alert.AlertClass = 'alert-danger';
            //    return false;
            //}

            $scope.Scheduling = true;
            var ScheduleVideoRequest = {};
            ScheduleVideoRequest.UserId = $scope.userFaces.id;
            ScheduleVideoRequest.UserEmail = $scope.userFaces.email;
            ScheduleVideoRequest.DateTime = $filter('date')($scope.date, "yyyy-MM-dd HH:mm:ss");
            ScheduleVideoRequest.TimeZone = $("#TimeZone").val();

            AdminService.CallAjaxUsingPostRequest(API.SCHEDULE_VIDEO_CALL_URL, ScheduleVideoRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.Alert.AlertMsg = 'Video call scheduled successfully.';
                    $scope.Alert.AlertClass = 'alert-success';
                    $timeout(function () {
                        $scope.ngDialog.close();
                    }, 2000);
                } else {
                    $scope.Alert.AlertMsg = data.Message;
                    $scope.Alert.AlertClass = 'alert-danger';
                }
            }, function (error) {

            }).finally(function () {
                $scope.Scheduling = false;
            });
        }

    }]);

Demo.controller('ActionConfirmationController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster) {
        if (!$stateParams.ConfirmationResults || $stateParams.ConfirmationResults.length == 0) {
            $state.go('Admin.FaceManagement.UnprocessedFaces');
        } else {
            debugger;
            $scope.Results = $stateParams.ConfirmationResults;
            $scope.SelectedVerifiedFaces = $scope.Results.SelectedFaces;
            $scope.SelectedFlagFaces = $scope.Results.FlagedFaces;
            $scope.Action = $scope.Results.Action;
            $scope.HitRecordId = $scope.Results.HitRecordId;
            $scope.userFaces = $scope.Results.UserFaces;
        }

        $scope.$watch('SelectedVerifiedFaces', function () {
            $scope.SearchFaces = [];

            if ($scope.SelectedVerifiedFaces) {
                for (var i = 0; i < $scope.SelectedVerifiedFaces.length; i++) {
                    if ($scope.SelectedVerifiedFaces[i].selected === true) {
                        $scope.SearchFaces.push($scope.SelectedVerifiedFaces[i]);
                    }
                }
            }
        }, true);


        $scope.$watch('SelectedFlagFaces', function () {
            $scope.FlagedFaces = [];

            if ($scope.SelectedFlagFaces) {
                for (var i = 0; i < $scope.SelectedFlagFaces.length; i++) {
                    if ($scope.SelectedFlagFaces[i].flaged === true) {
                        $scope.FlagedFaces.push($scope.SelectedFlagFaces[i]);
                    }
                }
            }
        }, true);

        $scope.ConfirmAction = function () {
            if ($scope.SearchFaces.length > 0 || $scope.Action == 4) {
                ngDialog.open({
                    template: 'Views/Popups/BigConfirmationPopup.html',
                    scope: $scope,
                    className: 'confirmation-popup big-popup',
                    closeByDocument: false
                });
            } else {
                toaster.pop('error', '', 'Please select atleast one verified image.')
            }
        }

        $scope.CallToAction = function () {
            var ProcessRequest = {};
            ProcessRequest.SelectedFaces = $scope.SearchFaces;
            ProcessRequest.FlagedFaces = $scope.FlagedFaces;
            ProcessRequest.Action = $scope.Action;
            ProcessRequest.HitRecordId = $scope.HitRecordId;

            AdminService.CallAjaxUsingPostRequest(API.PROCESS_SEARCH_LIST, ProcessRequest).then(function (data) {
                if (data.Success == true) {
                    $('.ngdialog-close').click();
                    if ($scope.Action == 3 || $scope.Action == 4) {
                        $state.go("Admin.SearchManagement",
                                        { Message: { "Class": "alert-success", "Text": "Search processed successfully." } }
                                 );
                    } else {
                        var MessageText = ($scope.Action == 1) ? "Fake images deleted successfully" : "Child Pornography images deleted successfully.";

                        if ($scope.HitRecordId > 0) {
                            $state.go("Admin.ManageUserSearch",
                                       { SearchId: $scope.HitRecordId, Message: { "Class": "alert-success", "Text": MessageText } }
                                );
                        } else {
                            $state.go("Admin.FaceManagement.UnprocessedFaces",
                                       { Message: { "Class": "alert-success", "Text": MessageText } }
                                );
                        }
                    }
                } else {
                    toaster.pop('error', '', data.Message);
                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });
        }
    }]);

Demo.controller('ImageBlurController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.submitting = false;
        $scope.ngDialog = ngDialog;

        $scope.Message = $stateParams.Message;

        $scope.Selection = { "x1": null, "y1": null, "x2": null, "y2": null, "width": null, "height": null, "MultipleFaceBiometricId": $scope.SingleFaceImage.resultid }

        $scope.ApplyBlur = function () {
            $scope.Selection.x1 = $('input[name="x1"]').val();
            $scope.Selection.y1 = $('input[name="y1"]').val();
            $scope.Selection.x2 = $('input[name="x2"]').val();
            $scope.Selection.y2 = $('input[name="y2"]').val();

            $scope.Selection.width = $('input[name="width"]').val();
            $scope.Selection.height = $('input[name="height"]').val();

            if ($scope.Selection.x1 > 0 && $scope.Selection.y1 > 0 && $scope.Selection.x2 > 0 && $scope.Selection.y2 > 0 && $scope.Selection.width > 0 && $scope.Selection.height > 0) {
                $scope.submitting = true;
                AdminService.CallAjaxUsingPostRequest(API.BLUR_USER_IMAGE, $scope.Selection).then(function (data) {
                    if (data.Success == true) {
                        var findIndex = ($scope.PageNo - 1)*$scope.PageSize + $scope.CurrentIndex;
                        $scope.SearchFaces[findIndex].replace = data.BlurImagePath
                        $('#SelectedImage').imgAreaSelect({ remove: true })
                        $scope.ngDialog.close();
                    } else {
                        toaster.pop('error', '', 'Some issue occured while blurring the image.');
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.submitting = false;
                });
            } else {
                toaster.pop('error', '', 'Please make selection befor blurring image.')
            }
        }

        $scope.ClosePopup = function () {
            $('#SelectedImage').imgAreaSelect({ remove: true })
            $scope.ngDialog.close();
        }

    }]);

Demo.controller('AdminChildAbuseController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var searchReportRequest = {};
        searchReportRequest.PageNo = $scope.PageNo;
        searchReportRequest.PageSize = $scope.PageSize;
        searchReportRequest.ChildAbuseLinkId = $scope.FilterByLinkId;
        searchReportRequest.Email = $scope.FilterByController;
        searchReportRequest.DateTime = $filter('date')($scope.FilterByDate, "yyyy-MM-dd");

        AdminService.CallAjaxUsingPostRequest(API.GET_CHILD_ABUSE_LINKS, searchReportRequest).then(function (data) {
            if (data.Success == true) {
                $scope.LinkDetails = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        AdminService.CallAjaxUsingGetRequest(API.GET_CONTROLLER_LIST + "?Role=controller&searchString=").then(function (data) {
            if (data.Success == true) {
                $scope.ControllerData = data.UserByRoles;
            }
        }, function (error) {

        }).finally(function () {

        });


        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var searchReportRequest = {};
            searchReportRequest.PageNo = $scope.PageNo;
            searchReportRequest.PageSize = $scope.PageSize;
            searchReportRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            searchReportRequest.SortColumn = $scope.sort.column;
            searchReportRequest.ChildAbuseLinkId = $scope.FilterByLinkId;
            searchReportRequest.Email = $scope.FilterByController;
            searchReportRequest.DateTime = $filter('date')($scope.FilterByDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.GET_CHILD_ABUSE_LINKS, searchReportRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.LinkDetails = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

    }]);

//Demo.controller('AdminUsersController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
//    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

//        $scope.showLoading = true;
//        $scope.showLoadMore = true;

//        $scope.Message = $stateParams.Message;

//        $scope.today = function () {
//            return $scope.FilterByDate = new Date();
//        };

//        $scope.clear = function () {
//            return $scope.FilterByDate = null;
//        };

//        $scope.open = function ($event) {
//            $event.preventDefault();
//            $event.stopPropagation();
//            console.log('..');
//            return $scope.opened = true;
//        };
//        $scope.dateOptions = {
//            'year-format': "'yy'",
//            'starting-day': 1,
//            showWeeks: false
//        };
//        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
//        $scope.format = $scope.formats[0];


//        $scope.Filter = {
//            "SearchId": null,
//            "Email": null,
//            "Date": null
//        };

//        $scope.PageNo = 1;
//        $scope.PageSize = 10;
//        $scope.maxSize = 5;

//        var usersListRequest = {};
//        usersListRequest.PageNo = $scope.PageNo;
//        usersListRequest.PageSize = $scope.PageSize;

//        AdminService.CallAjaxUsingPostRequest(API.USERS_LISTING_API, usersListRequest).then(function (data) {
//            if (data.Success == true) {
//                debugger;
//                $scope.UserListing = data.resultdata;
//                $scope.TotalItems = data.totalcount;
//                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
//            } else {

//            }
//        }, function (error) {

//        }).finally(function () {
//            $scope.showLoading = false;
//        });

//        $scope.sort = {
//            column: '',
//            descending: false,
//            className: 'sort_asc'
//        };


//        $scope.changeSorting = function (column) {
//            var sort = $scope.sort;

//            if (sort.column == column) {
//                sort.descending = !sort.descending;
//                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
//            } else {
//                sort.column = column;
//                sort.descending = false;
//                sort.className = sort.descending ? 'sort_desc' : 'sort_asc';
//            }

//            $scope.ApplyFilter();
//        };


//        $scope.PageChanged = function () {
//            $scope.ApplyFilter();
//        }

//        $scope.ApplyFilter = function () {
//            debugger;
//            var usersListRequest = {};
//            usersListRequest.PageNo = $scope.PageNo;
//            usersListRequest.PageSize = $scope.PageSize;
//            usersListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
//            usersListRequest.SortColumn = $scope.sort.column;
//            usersListRequest.UserId = $scope.FilterByUserId;
//            usersListRequest.Email = $scope.FilterByEmail;
//            usersListRequest.RoleName = $scope.FilterByRoleName;
//            usersListRequest.FirstName = $scope.FilterByFirstName;
//            usersListRequest.LastName = $scope.FilterByLastName;
//            usersListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

//            AdminService.CallAjaxUsingPostRequest(API.USERS_LISTING_API, usersListRequest).then(function (data) {
//                if (data.Success == true) {
//                    $scope.UserListing = data.resultdata;
//                    $scope.TotalItems = data.totalcount;
//                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
//                } else {

//                }
//            }, function (error) {

//            }).finally(function () {

//            });
//        }
//    }]);


Demo.controller('AdminUsersController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;

        $scope.ngDialog = ngDialog;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var usersListRequest = {};
        usersListRequest.PageNo = $scope.PageNo;
        usersListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.USERS_LISTING_API, usersListRequest).then(function (data) {
            if (data.Success == true) {
                debugger;
                $scope.UserListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });


        AdminService.CallAjaxUsingGetRequest(API.GET_ROLES_API).then(function (data) {
            if (data.Success == true) {
                $scope.RoleListing = data.resultdata;
            } else {

            }
        }, function (error) {

        }).finally(function () {

        });

        // Convert the myOptions object into a usable array whenever it changes
        $scope.$watchCollection('RoleListing', function () {
            $scope.myFixedOptions = [];
            angular.forEach($scope.RoleListing, function (value, key) {
                $scope.myFixedOptions.push({ key: parseInt(value.RoleId, 10), value: value.RoleName });
            });
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var usersListRequest = {};
            usersListRequest.PageNo = $scope.PageNo;
            usersListRequest.PageSize = $scope.PageSize;
            usersListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            usersListRequest.SortColumn = $scope.sort.column;
            usersListRequest.UserId = $scope.FilterByUserId;
            usersListRequest.Email = $scope.FilterByEmail;
            usersListRequest.RoleId = $scope.FilterByRoleId;
            usersListRequest.FirstName = $scope.FilterByFirstName;
            usersListRequest.LastName = $scope.FilterByLastName;
            usersListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.USERS_LISTING_API, usersListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.UserListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.myFunction = function (UserId, $index) {
            var confirmation = confirm("Are you sure you want to delete it?");

            if (confirmation) {
                $scope.DeleteAdminUser(UserId, $index);
            }

        };
        $scope.DeleteAdminUser = function (UserId, index) {
            var deleterequest = {};
            deleterequest.UserId = UserId;

            AdminService.CallAjaxUsingPostRequest(API.DELETE_ADMINUSER_API, deleterequest).then(function (data) {
                if (data.Success == true) {
                    $scope.UserListing.splice(index, 1);
                    //$scope.Counts = data.dashboardCounts;
                } else {
                    toaster.pop('error', '', data.Message)
                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.UpdateAdminUser = {};
        $scope.PopUp = function (UserListing, index) {
            $scope.UpdateAdminUser = UserListing;
            $scope.UpdateAdminUser.UserEmail = $scope.UpdateAdminUser.Email;
            $scope.UpdateAdminUser.UserFirstName = $scope.UpdateAdminUser.FirstName;
            $scope.UpdateAdminUser.UserLastName = $scope.UpdateAdminUser.LastName;
            $scope.UpdateAdminUser.UserRoleName = $scope.UpdateAdminUser.RoleName;
            $scope.UpdateAdminUser.UserRoleId = $scope.UpdateAdminUser.RoleId;
            $scope.CurrentIndex = index;
            ngDialog.open({
                template: 'Views/Popups/UpdateAdminUser.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }
        $scope.Submitting = false;
        $scope.CallUpdateAdminUser = function () {
            if ($("#UpdateAdminUserForm").valid()) {
                $scope.Submitting = true;
                var UserData = {
                    "UserId": $scope.UpdateAdminUser.UserId,
                    "Email": $scope.UpdateAdminUser.UserEmail,
                    "FirstName": $scope.UpdateAdminUser.UserFirstName,
                    "LastName": $scope.UpdateAdminUser.UserLastName,
                    "RoleId": $scope.UpdateAdminUser.UserRoleId
                };
                AdminService.CallAjaxUsingPostRequest(API.UPDATEADMIN_USER_API, UserData).then(function (data) {
                    if (data.Success == true) {
                        $scope.ngDialog.close();
                        var index = $scope.RoleListing.findIndex(x=>x.RoleId == $scope.UpdateAdminUser.UserRoleId);
                        UserData.RoleName = (index > -1) ? $scope.RoleListing[index].RoleName : '';

                        $scope.UserListing[$scope.CurrentIndex].Email = UserData.Email;
                        $scope.UserListing[$scope.CurrentIndex].FirstName = UserData.FirstName;
                        $scope.UserListing[$scope.CurrentIndex].LastName = UserData.LastName;
                        $scope.UserListing[$scope.CurrentIndex].RoleId = UserData.RoleId;
                        $scope.UserListing[$scope.CurrentIndex].RoleName = UserData.RoleName;
                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });

            };
        }
        $scope.FormData = {};

        $scope.AddAdminUserPopUp = function () {
            $scope.FormData = {};
            ngDialog.open({
                template: 'Views/Popups/AdminUserInsertion.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false

            });
        }
        $scope.Submitting = false;

        $scope.SaveUser = function () {
            debugger;
            if ($("#AddAdminUserForm").valid()) {

                $scope.Submitting = true;

                AdminService.CallAjaxUsingPostRequest(API.CREATE_ADMIN_USER, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        $scope.UserListing.push(data.NewUserDetails);
                        $scope.ngDialog.close()
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }

        $scope.confirm = function (Users, $index) {
            debugger;
            // $scope.Customer = CustomerListing;
            if (Users.Active == "Y") {
                var Confirmation = confirm("Are you sure you want to deactivate it?");
            }
            else {
                var Confirmation = confirm("Are you sure you want to activate it");

            }
            if (Confirmation) {
                $scope.ChangeStatus(Users, $index);
            }
            // end
        };
        $scope.ChangeStatus = function (Users, index) {
            var Request = {};
            Request.UserId = Users.UserId;
            Request.Active = (Users.Active == "Y") ? "N" : "Y";

            AdminService.CallAjaxUsingPostRequest(API.ACTIVE_DEACTIVE_ADMINUSER_API, Request).then(function (data) {
                $scope.UserListing[index].Active = ($scope.UserListing[index].Active == "Y") ? "N" : "Y";
            }, function (error) {

            }).finally(function () {

            });
        }


        /** Validation **/
        $scope.validationOptionsForAddAdminUser = {
            rules: {
                fname: {
                    required: true,
                },
                lname: {
                    required: true,
                },
                email: {
                    required: true,
                    email: true,
                    remote: {
                        url: API.CHECK_ADDUSER_EMAIL_EXISTS_API,
                        type: "GET"
                    }
                },
                password: {
                    required: true,
                },
                role: {
                    required: true,
                }
            },
            messages: {
                email: {
                    remote: "Email  already exist."
                }
            }
        };


        $scope.validationOptionsForUpdateAdminUser = {
            rules: {
                fname: {
                    required: true,
                },
                lname: {
                    required: true,
                },
                email: {
                    required: true,
                    email: true,
                    remote: {
                        url: API.CHECK_EMAIL_EXISTS,
                        type: "GET",
                        data: { UserId: function () { return $scope.UpdateAdminUser.UserId } }
                    }
                },

                role: {
                    required: true,
                }
            },
            messages: {
                email: {
                    remote: "Email  already exist."
                }
            }
        };
    }]);

Demo.controller('AdminTagsController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.BASE_URL = BASE_URL;

        $scope.ngDialog = ngDialog;

        $scope.Message = $stateParams.Message;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var TagsListRequest = {};
        TagsListRequest.PageNo = $scope.PageNo;
        TagsListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.TAGS_LISTING_API, TagsListRequest).then(function (data) {
            if (data.Success == true) {
                $scope.TagListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };

        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var TagsListRequest = {};
            TagsListRequest.PageNo = $scope.PageNo;
            TagsListRequest.PageSize = $scope.PageSize;
            TagsListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            TagsListRequest.SortColumn = $scope.sort.column;
            TagsListRequest.TagId = $scope.FilterByTagId;
            TagsListRequest.TagName = $scope.FilterByTagName;
            TagsListRequest.Active = $scope.FilterByActive;
            TagsListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.TAGS_LISTING_API, TagsListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.TagListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.myFunction = function (TagId, $index) {
            var confirmation = confirm("Are you sure you want to delete it?");

            if (confirmation) {
                $scope.DeleteAdminTag(TagId, $index);
            }

        };
        $scope.DeleteAdminTag = function (TagId, index) {
            debugger;
            var deleterequest = {};
            deleterequest.TagId = TagId;

            AdminService.CallAjaxUsingPostRequest(API.DELETETAG_URL, deleterequest).then(function (data) {
                if (data.Success == true) {
                    $scope.TagListing.splice(index, 1);
                    //$scope.Counts = data.dashboardCounts;
                } else {
                    toaster.pop('error', '', data.Message)
                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.ChangeStatus = function (Tags, index) {
            var Request = {};
            Request.TagId = Tags.TagId;
            Request.Active = (Tags.Active == "Y") ? "N" : "Y";

            AdminService.CallAjaxUsingPostRequest(API.ACTIVETAG_URL, Request).then(function (data) {
                $scope.TagListing[index].Active = ($scope.TagListing[index].Active == "Y") ? "N" : "Y";
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.OpenAddTagPopup = function () {
            ngDialog.open({
                template: 'Views/Popups/AddTagPopup.html',
                scope: $scope,
                closeByDocument: false
            });
        }

        $scope.SaveNewTag = function () {
            if ($('#AddTagForm').valid()) {
                $scope.Submitting = true;
                var formData = new FormData($('#AddTagForm')[0]);

                AdminService.SubmitForm(API.SAVETAG_URL, formData).then(function (data) {
                    if (data.Success == true) {
                        $scope.ngDialog.close();
                        $scope.TagListing.push(data.NewTag);
                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }
        $scope.validationOptionsForAddAdminTag = {
            rules: {
                tagname: {
                    required: true,
                },
                imagefilepath: {
                    required: true,
                }
            },
        };
    }]);

Demo.controller('AdminRolesController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;
        $scope.ngDialog = ngDialog;
        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var usersListRequest = {};
        usersListRequest.PageNo = $scope.PageNo;
        usersListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.GETALLROLES_API, usersListRequest).then(function (data) {
            if (data.Success == true) {
                debugger;
                $scope.RoleListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            debugger;
            var rolesListRequest = {};
            rolesListRequest.PageNo = $scope.PageNo;
            rolesListRequest.PageSize = $scope.PageSize;
            rolesListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            rolesListRequest.SortColumn = $scope.sort.column;
            rolesListRequest.RoleId = $scope.FilterByRoleId;
            rolesListRequest.RoleName = $scope.FilterByRoleName;
            rolesListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.GETALLROLES_API, rolesListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.RoleListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.DeleteRoleConfirmation = function (RoleId, $index) {
            var confirmation = confirm("Are you sure you want to delete it?");

            if (confirmation) {
                $scope.DeleteRole(RoleId, $index);
            }

        };

        $scope.DeleteRole = function (RoleId, index) {
            var deleterequest = {};
            deleterequest.RoleId = RoleId;
            AdminService.CallAjaxUsingPostRequest(API.DELETEROLES_API, deleterequest).then(function (data) {
                if (data.Success == true) {
                    $scope.RoleListing.splice(index, 1);
                    //$scope.Counts = data.dashboardCounts;
                } else {
                    toaster.pop('error', '', data.Message)
                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.UpdateRolePopup = function (RoleListing, index) {
            $scope.UpdateRoles = RoleListing;
            $scope.UpdateRoles.Role = $scope.UpdateRoles.RoleName;
            $scope.UpdateRoles.RoleId = $scope.UpdateRoles.RoleId;
            $scope.CurrentIndex = index;

            ngDialog.open({
                template: 'Views/Popups/UpdateAdminRole.html',
                scope: $scope,
                className: 'forgot-password-popup',
                controller: 'RoleController',
                closeByDocument: false
            });
        }

        $scope.confirm = function (Roles, $index) {
            // $scope.Customer = CustomerListing;
            if (Roles.Active == "Y") {
                var Confirmation = confirm("Are you sure you want to deactivate it?");
            }
            else {
                var Confirmation = confirm("Are you sure you want to activate it");

            }
            if (Confirmation) {
                $scope.ChangeStatus(Roles, $index);
            }
            // end
        };

        $scope.ChangeStatus = function (Roles, index) {
            var Request = {};
            Request.RoleId = Roles.RoleId;
            Request.Active = (Roles.Active == "Y") ? "N" : "Y";
            AdminService.CallAjaxUsingPostRequest(API.ACTIVE_DEACTIVE_ROLES_API, Request).then(function (data) {
                $scope.RoleListing[index].Active = ($scope.RoleListing[index].Active == "Y") ? "N" : "Y";
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.AddNewRolePopUp = function () {
            $scope.FormData = {};
            ngDialog.open({
                template: 'Views/Popups/AdminRoleInsertion.html',
                scope: $scope,
                className: 'forgot-password-popup',
                controller: 'RoleController',
                closeByDocument: false
            });
        }
    }]);

Demo.controller('RoleController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.Submitting = false;

        $scope.FormData = {};

        AdminService.CallAjaxUsingGetRequest(API.GET_All_SCREEN_LIST + "?RoleId=" + ($scope.UpdateRoles ? $scope.UpdateRoles.RoleId : 0)).then(function (data) {
            if (data.Success == true) {
                $scope.nodes = data.ScreenList;
            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.AddNewRole = function () {
            if ($("#AddAdminRoleForm").valid()) {
                var MenuIds = [];
                angular.forEach($scope.nodes, function (value, key) {
                    if ($scope.nodes[key].ischecked) {
                        MenuIds.push($scope.nodes[key].MenuId);
                        if ($scope.nodes[key].children) {
                            angular.forEach($scope.nodes[key].children, function (v, k) {
                                if ($scope.nodes[key].children[k].ischecked) {
                                    MenuIds.push($scope.nodes[key].children[k].MenuId);
                                }
                            });
                        }
                    }
                });

                if (MenuIds.length == 0) {
                    toaster.pop('error', '', 'Please select atleast one screen before creating role.');
                    return false;
                }

                $scope.Submitting = true;
                $scope.FormData.MenuIds = MenuIds;

                AdminService.CallAjaxUsingPostRequest(API.CREATE_ROLE_API, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        $scope.RoleListing.push(data.NewRoleDetails);
                        $scope.ngDialog.close();
                    }
                },
                function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }

        $scope.UpdateAdminRole = function () {
            var MenuIds = [];
            angular.forEach($scope.nodes, function (value, key) {
                if ($scope.nodes[key].ischecked) {
                    MenuIds.push($scope.nodes[key].MenuId);
                    if ($scope.nodes[key].children) {
                        angular.forEach($scope.nodes[key].children, function (v, k) {
                            if ($scope.nodes[key].children[k].ischecked) {
                                MenuIds.push($scope.nodes[key].children[k].MenuId);
                            }
                        });
                    }
                }
            });

            if (MenuIds.length == 0) {
                toaster.pop('error', '', 'Please select atleast one screen before creating role.');
                return false;
            }

            $scope.Submitting = true;

            var RoleData = {
                "RoleName": $scope.UpdateRoles.Role,
                "RoleId": $scope.UpdateRoles.RoleId,
                "MenuIds": MenuIds
            };

            AdminService.CallAjaxUsingPostRequest(API.UPDATE_ROLES_API, RoleData).then(function (data) {
                if (data.Success == true) {
                    $scope.RoleListing[$scope.CurrentIndex].RoleName = $scope.UpdateRoles.Role;
                    $scope.ngDialog.close();
                } else {
                    toaster.pop('error', '', data.Message);
                }
            }, function (error) {

            }).finally(function () {
                $scope.Submitting = false;
            });

        };

        $scope.validationOptionsForAddAdminRole = {
            rules: {
                role: {
                    required: true,
                    remote: {
                        url: API.CHECK_ROLE_EXISTS,
                        type: "GET"
                    }
                },
            },
            messages: {
                role: {
                    remote: "Role already exists."
                }
            }
        }
    }]);

Demo.controller('AdminCustomersController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;

        $scope.ngDialog = ngDialog;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var customersListRequest = {};
        customersListRequest.PageNo = $scope.PageNo;
        customersListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.GET_ALL_CUSTOMERS_API, customersListRequest).then(function (data) {
            if (data.Success == true) {
                $scope.CustomerListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var customersListRequest = {};
            customersListRequest.PageNo = $scope.PageNo;
            customersListRequest.PageSize = $scope.PageSize;
            customersListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            customersListRequest.SortColumn = $scope.sort.column;
            customersListRequest.id = $scope.FilterById;
            customersListRequest.Email = $scope.FilterByEmail;
            customersListRequest.Blocked = $scope.FilterByBlocked;
            customersListRequest.FirstName = $scope.FilterByFirstName;
            customersListRequest.LastName = $scope.FilterByLastName;
            customersListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.GET_ALL_CUSTOMERS_API, customersListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.CustomerListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.myFunction = function (id, $index) {
            var confirmation = confirm("Are you sure you want to delete it?");

            if (confirmation) {
                $scope.DeleteCustomer(id, $index);
            }

        };
        $scope.DeleteCustomer = function (id, index) {
            debugger;
            var deleterequest = {};
            deleterequest.id = id;
            AdminService.CallAjaxUsingPostRequest(API.DELETE_CUSTOMER_API, deleterequest).then(function (data) {
                if (data.Success == true) {
                    $scope.CustomerListing.splice(index, 1);
                    //$scope.Counts = data.dashboardCounts;
                } else {
                    toaster.pop('error', '', data.Message)
                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.UpdateCustomerPopup = function (CustomerListing, index) {
            $scope.UpdateCustomer = CustomerListing;
            $scope.UpdateCustomer.UserEmail = $scope.UpdateCustomer.Email;
            $scope.UpdateCustomer.UserFirstName = $scope.UpdateCustomer.FirstName;
            $scope.UpdateCustomer.UserLastName = $scope.UpdateCustomer.LastName;
            $scope.CurrentIndex = index;

            ngDialog.open({
                template: 'Views/Popups/UpdateCustomer.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }

        $scope.Submitting = false;
        $scope.Update = function () {
            if ($("#UpdateCustomerForm").valid()) {
                $scope.Submitting = true;
                var CustomerData = {
                    "id": $scope.UpdateCustomer.id,
                    "Email": $scope.UpdateCustomer.UserEmail,
                    "FirstName": $scope.UpdateCustomer.UserFirstName,
                    "LastName": $scope.UpdateCustomer.UserLastName,

                };
                AdminService.CallAjaxUsingPostRequest(API.UPDATE_CUSTOMER_API, CustomerData).then(function (data) {
                    if (data.Success == true) {
                        $scope.ngDialog.close();
                        $scope.CustomerListing[$scope.CurrentIndex].Email = CustomerData.Email;
                        $scope.CustomerListing[$scope.CurrentIndex].FirstName = CustomerData.FirstName;
                        $scope.CustomerListing[$scope.CurrentIndex].LastName = CustomerData.LastName;
                    } else {
                        toaster.pop('error', '', data.Message)
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });

            }
        };

        $scope.confirm = function (Customers, $index) {
            if (Customers.Blocked == "Y") {
                var Confirmation = confirm("Are you sure you want to deactivate it?");
            } else {
                var Confirmation = confirm("Are you sure you want to activate it");

            }
            if (Confirmation) {
                $scope.ChangeStatus(Customers, $index);
            }
        };

        $scope.ChangeStatus = function (Customers, index) {
            debugger;
            var Request = {};
            Request.id = Customers.id;
            Request.Blocked = (Customers.Blocked == "Y") ? "N" : "Y";

            AdminService.CallAjaxUsingPostRequest(API.ACTIVE_DEACTIVE_CUSTOMER_API, Request).then(function (data) {
                $scope.CustomerListing[index].Blocked = ($scope.CustomerListing[index].Blocked == "Y") ? "N" : "Y";
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.validationOptionsForCustomer = {
            rules: {
                fname: {
                    required: true,

                },
                lname: {
                    required: true,
                },
                email: {
                    required: true,

                    remote: {
                        url: API.CHECK_CUSTOMER_EMAIL_API,
                        type: "GET",
                        data: { id: function () { return $scope.UpdateCustomer.id } }
                    }
                },
            },
            messages: {
                email: {
                    remote: "Email already exist."
                },

            }
        }
    }]);

Demo.controller('AdminDashboardController', ['$scope', '$rootScope', 'AdminService', 'toaster', function ($scope, $rootScope, AdminService, toaster) {

    AdminService.CallAjaxUsingGetRequest(API.DASHBOARDDETAILS_API).then(function (data) {
        if (data.Success == true) {
            $scope.Counts = data.counts;
            $scope.Stats = data.stats;
            $scope.$broadcast('CouponGraphValues', { CouponStats: $scope.Stats.coupon_stats });
            $scope.$broadcast('AllUserGraphValues', { AllUserStats: $scope.Stats.all_user_stats });
            $scope.$broadcast('FRGraphValues', { FRStats: $scope.Stats.fr_user_stats });
            $scope.$broadcast('DMCAGraphValues', { DMCAStats: $scope.Stats.dmca_user_stats });
            $scope.$broadcast('SubscriptionsGraphValues', { SubscriptionStats: $scope.Stats.subscriptions_stats });
            $scope.$broadcast('PaymentsGraphValues', { PaymentStats: $scope.Stats.payments_stats });
            $scope.$broadcast('TicketsGraphValues', { TicketStats: $scope.Stats.tickets_stats });
        } else {
            toaster.pop('error', '', data.Message)
        }
    }, function (error) {

    }).finally(function () {

    });
}]);

Demo.controller('UsersRegistrationManagement', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var UsersRegistrationListRequest = {};
        UsersRegistrationListRequest.PageNo = $scope.PageNo;
        UsersRegistrationListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.USERS_REGISTRATION_EMAIL_API, UsersRegistrationListRequest).then(function (data) {
            if (data.Success == true) {
                debugger;
                $scope.UsersRegistrationListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            debugger;
            var UsersRegistrationListRequest = {};
            UsersRegistrationListRequest.PageNo = $scope.PageNo;
            UsersRegistrationListRequest.PageSize = $scope.PageSize;
            UsersRegistrationListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            UsersRegistrationListRequest.SortColumn = $scope.sort.column;
            UsersRegistrationListRequest.UserEmailRegistrationId = $scope.FilterByUserEmailRegistrationId;
            UsersRegistrationListRequest.Email = $scope.FilterByEmail;
            UsersRegistrationListRequest.IsProcessed = $scope.FilterByIsProcessed;
            UsersRegistrationListRequest.CreatedDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.USERS_REGISTRATION_EMAIL_API, UsersRegistrationListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.UsersRegistrationListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

        $scope.toggleAll = function () {
            debugger;
            var toggleStatus = $scope.isAllSelected;
            angular.forEach($scope.UsersRegistrationListing, function (itm) {
                debugger;
                itm.selected = toggleStatus;
                $scope.SelectedUser.push(itm);
            });

        }


        $scope.$watch('UsersRegistrationListing', function () {
            debugger;
            var no = 0;
            $scope.SelectedUser = [];

            if ($scope.UsersRegistrationListing) {
                for (var i = 0; i < $scope.UsersRegistrationListing.length; i++) {
                    if ($scope.UsersRegistrationListing[i].selected === true) {
                        $scope.SelectedUser.push($scope.UsersRegistrationListing[i]);
                        no++;
                    }
                }
                $scope.noSelectedItems = no;
            }
        }, true);

        $scope.SendInviteToMultipleUser = function () {
            if ($scope.noSelectedItems == 0) {
                toaster.pop('error', '', 'Please select atleast one recipient.');
                return false;
            }

            $scope.SelectedUserList = { "SelectedUser": $scope.SelectedUser };
            AdminService.CallAjaxUsingPostRequest(API.SEND_EMAIL_SELECTED_USER, $scope.SelectedUserList).then(function (data) {
                if (data.Success == true) {
                    $scope.ApplyFilter();
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

    }]);

Demo.controller('VideoSchedulingListManagementController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;

        $scope.Message = $stateParams.Message;
        $scope.ngDialog = ngDialog;
        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];


        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var usersListRequest = {};
        usersListRequest.PageNo = $scope.PageNo;
        usersListRequest.PageSize = $scope.PageSize;



        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }



        var videoSchedulingListRequest = {};
        videoSchedulingListRequest.PageNo = $scope.PageNo;
        videoSchedulingListRequest.PageSize = $scope.PageSize;


        AdminService.CallAjaxUsingPostRequest(API.GET_VIDEO_SCHEDULING_API, videoSchedulingListRequest).then(function (data) {
            if (data.Success == true) {
                $scope.videoSchedulingList = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });
        $scope.ApplyFilter = function () {
            var videoScheduling = {};
            videoScheduling.PageNo = $scope.PageNo;
            videoScheduling.PageSize = $scope.PageSize;
            videoScheduling.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            videoScheduling.SortColumn = $scope.sort.column;
            videoScheduling.VideoRoomId = $scope.FilterByVideoRoomId;
            videoScheduling.RoomName = $scope.FilterByRoomName;
            videoScheduling.UserEmail = $scope.FilterByUserEmail;
            videoScheduling.ControllerEmail = $scope.FilterByControllerEmail;
            videoScheduling.ScheduleDate = $filter('date')($scope.FilterByCreatedDate, "yyyy-MM-dd");


            AdminService.CallAjaxUsingPostRequest(API.GET_VIDEO_SCHEDULING_API, videoScheduling).then(function (data) {
                debugger;
                if (data.Success == true) {
                    $scope.videoSchedulingList = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });

        }
    }]);

Demo.controller('AdminCouponController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$filter', '$timeout',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $filter, $timeout) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;
        $scope.Submitting = false;

        $scope.Message = $stateParams.Message;

        $scope.ngDialog = ngDialog;

        $scope.popup = {
            opened: false
        };

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };

        $scope.openpopup = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.popup.opened = true;
        }

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };

        $scope.datePopupOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false,
            minDate: new Date()
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.FormData = {};
        $scope.CurrentIndex = null;

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var couponListRequest = {};
        couponListRequest.PageNo = $scope.PageNo;
        couponListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.GET_ALL_COUPONS_API, couponListRequest).then(function (data) {
            if (data.Success == true) {
                $scope.CouponListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var couponListRequest = {};
            couponListRequest.PageNo = $scope.PageNo;
            couponListRequest.PageSize = $scope.PageSize;
            couponListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            couponListRequest.SortColumn = $scope.sort.column;
            couponListRequest.CouponId = $scope.FilterByCouponId>0?$scope.FilterByCouponId:0;
            couponListRequest.CouponName = $scope.FilterByCouponName;
            couponListRequest.CouponCode = $scope.FilterByCouponCode;
            couponListRequest.Active = $scope.FilterByActive;
            couponListRequest.ExpiryDate = $filter('date')($scope.FilterByExpiryDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.GET_ALL_COUPONS_API, couponListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.CouponListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }

        /** Validation **/
        $scope.validationOptionsForCouponForm = {
            rules: {
                'cname': { required: true },
                'ccode': { required: true },
                'cpercentage': { required: true, number: true },
                'cexipry': { date: true }
            },
            errorPlacement: function (error, element) {
                if (element.parent(".input-group").length == 1)
                    error.insertAfter(element.parent(".input-group"));
                else
                    error.insertAfter(element);
            }
        };


        $scope.AddCouponPopup = function () {
            $scope.Alert = { "AlertClass": null, "AlertMsg": null };
            $scope.FormData = {};
            ngDialog.open({
                template: 'Views/Popups/CouponPopup.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }

        $scope.SaveCoupon = function (form) {
            if (form.validate()) {
                if (!$scope.FormData.ExpiryDate && !$scope.FormData.NoExpiry) {
                    $scope.Alert.AlertClass = "alert alert-danger";
                    $scope.Alert.AlertMsg = "Please select the validity of coupon.";
                    return false;
                }

                $scope.Submitting = true;
                AdminService.CallAjaxUsingPostRequest(API.CREATE_UPDATE_COUPONS_API, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        if ($scope.FormData.CouponId > 0) {
                            angular.copy($scope.FormData, $scope.CouponListing[$scope.CurrentIndex]);
                        } else {
                            $scope.CouponListing.push(data.NewCouponDetails);
                        }
                        $scope.Alert.AlertClass = "alert alert-success";
                        $scope.Alert.AlertMsg = data.Message;
                        $timeout(function () { $scope.ngDialog.close(); }, 2000);
                    } else {
                        $scope.Alert.AlertClass = "alert alert-danger";
                        $scope.Alert.AlertMsg = data.Message;
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }


        $scope.CouponPopUp = function (coupon, index) {
            $scope.Alert = { "AlertClass": null, "AlertMsg": null };
            angular.copy(coupon, $scope.FormData);

            $scope.FormData.ExpiryDate = $scope.FormData.ExpiryDate ? new Date($filter('date')($scope.FormData.ExpiryDate, "yyyy-MM-dd")) : $scope.FormData.ExpiryDate;
            $scope.CurrentIndex = index;

            ngDialog.open({
                template: 'Views/Popups/CouponPopup.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }

        $scope.DeleteCoupon = function (CouponId, index) {
            var confirmation = confirm("Are you sure you want to delete it?");

            if (confirmation) {
                var deleterequest = {};
                deleterequest.CouponId = CouponId;
                AdminService.CallAjaxUsingPostRequest(API.DELETE_COUPONS_API, deleterequest).then(function (data) {
                    if (data.Success == true) {
                        $scope.CouponListing.splice(index, 1);
                    } else {
                        toaster.pop('error', '', data.Message)
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }

        $scope.ChangeStatus = function (Coupons, index) {
            if (Coupons.Active == "Y") {
                var Confirmation = confirm("Are you sure you want to deactivate it?");
            } else {
                var Confirmation = confirm("Are you sure you want to activate it");
            }

            if (Confirmation) {
                var Request = {};
                Request.CouponId = Coupons.CouponId;
                Request.Active = (Coupons.Active == "Y") ? "N" : "Y";

                AdminService.CallAjaxUsingPostRequest(API.TOGGLE_COUPON_API, Request).then(function (data) {
                    $scope.CouponListing[index].Active = ($scope.CouponListing[index].Active == "Y") ? "N" : "Y";
                }, function (error) {

                }).finally(function () {

                });
            }
        }

        $scope.IsChecked = function () {
            if ($scope.FormData.NoExpiry) {
                $scope.FormData.ExpiryDate = null;
            }
        }
    }]);



Demo.controller('AdminReferrerController', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster', '$timeout', '$filter',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster, $timeout, $filter) {

        $scope.showLoading = true;
        $scope.showLoadMore = true;
        $scope.Submitting = false;

        $scope.Message = $stateParams.Message;

        $scope.ngDialog = ngDialog;

        $scope.popup = {
            opened: false
        };

        $scope.today = function () {
            return $scope.FilterByDate = new Date();
        };

        $scope.clear = function () {
            return $scope.FilterByDate = null;
        };

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.opened = true;
        };

        $scope.openpopup = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            console.log('..');
            return $scope.popup.opened = true;
        }

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false
        };

        $scope.datePopupOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            showWeeks: false,
            minDate: new Date()
        };

        $scope.formats = ['dd-MMM-yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.popupformat = $scope.formats[1];

        $scope.Filter = {
            "SearchId": null,
            "Email": null,
            "Date": null
        };

        $scope.FormData = {};
        $scope.CurrentIndex = null;

        $scope.PageNo = 1;
        $scope.PageSize = 10;
        $scope.maxSize = 5;

        var couponListRequest = {};
        couponListRequest.PageNo = $scope.PageNo;
        couponListRequest.PageSize = $scope.PageSize;

        AdminService.CallAjaxUsingPostRequest(API.GET_ALL_REFERRAL_COUPONS_API, couponListRequest).then(function (data) {
            if (data.Success == true) {
                $scope.ReferralListing = data.resultdata;
                $scope.TotalItems = data.totalcount;
                $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
            } else {

            }
        }, function (error) {

        }).finally(function () {
            $scope.showLoading = false;
        });

        $scope.sort = {
            column: '',
            descending: false,
            className: 'sort_asc'
        };


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

            $scope.ApplyFilter();
        };


        $scope.PageChanged = function () {
            $scope.ApplyFilter();
        }

        $scope.ApplyFilter = function () {
            var couponListRequest = {};
            couponListRequest.PageNo = $scope.PageNo;
            couponListRequest.PageSize = $scope.PageSize;
            couponListRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
            couponListRequest.SortColumn = $scope.sort.column;
            couponListRequest.ReferralId = $scope.FilterByReferralId;
            couponListRequest.FirstName = $scope.FilterByFirstName;
            couponListRequest.Discount = $scope.FilterByDiscount;
            couponListRequest.ProfitPercentage = $scope.FilterByProfitPercentage;
            couponListRequest.Active = $scope.FilterByActive;
            couponListRequest.CouponCode = $scope.FilterByCouponCode;
            couponListRequest.ExpiryDate = $filter('date')($scope.FilterByExpiryDate, "yyyy-MM-dd");

            AdminService.CallAjaxUsingPostRequest(API.GET_ALL_REFERRAL_COUPONS_API, couponListRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.ReferralListing = data.resultdata;
                    $scope.TotalItems = data.totalcount;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {

            });
        }
        $scope.AddReferrerPopup = function () {
            $scope.Alert = { "AlertClass": null, "AlertMsg": null };
            $scope.FormData = {};
            ngDialog.open({
                template: 'Views/Popups/ReferrerPopup.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false

            });
        }

        $scope.UpdateReferrerPopUp = function (referrer, index) {
            $scope.Alert = { "AlertClass": null, "AlertMsg": null };
            angular.copy(referrer, $scope.FormData);

            $scope.FormData.ExpiryDate = $scope.FormData.ExpiryDate ? new Date($filter('date')($scope.FormData.ExpiryDate, "yyyy-MM-dd")) : $scope.FormData.ExpiryDate;
            $scope.CurrentIndex = index;

            ngDialog.open({
                template: 'Views/Popups/referrerPopup.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }

        $scope.SaveReferrer = function (form) {
            if (form.validate()) {
                debugger;
                if (!$scope.FormData.ExpiryDate && !$scope.FormData.NoExpiry) {
                    $scope.Alert.AlertClass = "alert alert-danger";
                    $scope.Alert.AlertMsg = "Please select the validity of coupon.";
                    return false;
                }

                $scope.Submitting = true;
                AdminService.CallAjaxUsingPostRequest(API.CREATE_UPDATE_REFERRAL_API, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        if ($scope.FormData.ReferralId > 0) {
                            angular.copy($scope.FormData, $scope.ReferralListing[$scope.CurrentIndex]);
                        } else {
                            $scope.ReferralListing.push(data.NewReferralCouponDetails);
                        }
                        $scope.Alert.AlertClass = "alert alert-success";
                        $scope.Alert.AlertMsg = data.Message;
                        $timeout(function () { $scope.ngDialog.close(); }, 2000);
                    } else {
                        $scope.Alert.AlertClass = "alert alert-danger";
                        $scope.Alert.AlertMsg = data.Message;
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }
        }


        $scope.DeleteReferrer = function (ReferralId, index) {
            var confirmation = confirm("Are you sure you want to delete it?");
            if (confirmation) {
                var deleterequest = {};
                deleterequest.ReferralId = ReferralId;
                AdminService.CallAjaxUsingPostRequest(API.DELETE_REFERRAL_API, deleterequest).then(function (data) {
                    if (data.Success == true) {
                        $scope.ReferralListing.splice(index, 1);
                    } else {
                        toaster.pop('error', '', data.Message)
                    }
                }, function (error) {

                }).finally(function () {

                });
            }
        }

        $scope.ToggleActivation = function (ReferralCoupons, index) {
            if (ReferralCoupons.Active == "Y") {
                var Confirmation = confirm("Are you sure you want to deactivate it?");
            } else {
                var Confirmation = confirm("Are you sure you want to activate it");
            }

            if (Confirmation) {
                var Request = {};
                Request.ReferralId = ReferralCoupons.ReferralId;
                Request.Active = (ReferralCoupons.Active == "Y") ? "N" : "Y";

                AdminService.CallAjaxUsingPostRequest(API.TOGGLE_REFERRAL_API, Request).then(function (data) {
                    $scope.ReferralListing[index].Active = ($scope.ReferralListing[index].Active == "Y") ? "N" : "Y";
                }, function (error) {

                }).finally(function () {

                });
            }
        }

        $scope.Submitting = false;
        $scope.SaveReferralCoupon = function () {
            if ($("#AddAdminReferralCouponForm").valid()) {

                $scope.Submitting = true;

                AdminService.CallAjaxUsingPostRequest(API.CREATE_UPDATE_REFERRAL_API, $scope.FormData).then(function (data) {
                    if (data.Success == true) {
                        if ($scope.FormData.ReferralId > 0) {
                            $scope.ReferralListing[$scope.CurrentIndex] = $scope.FormData;
                        } else {
                            $scope.ReferralListing.push(data.NewReferralCouponDetails);
                        }
                        $scope.Alert.AlertClass = "alert alert-success";
                        $scope.Alert.AlertMsg = data.Message;
                        $timeout(function () { $scope.ngDialog.close(); }, 3000);
                    } else {
                        $scope.Alert.AlertClass = "alert alert-danger";
                        $scope.Alert.AlertMsg = data.Message;
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });
            }

        }


        $scope.UpdateAdminReferralCoupon = {};
        $scope.ReferralCouponPopUp = function (ReferralListing, index) {
            debugger;
            $scope.UpdateAdminReferralCoupon = ReferralListing;
            $scope.UpdateAdminReferralCoupon.ReferralFirstName = $scope.UpdateAdminReferralCoupon.FirstName;
            $scope.UpdateAdminReferralCoupon.ReferralLastName = $scope.UpdateAdminReferralCoupon.LastName;
            $scope.UpdateAdminReferralCoupon.ReferralEmail = $scope.UpdateAdminReferralCoupon.Email;
            $scope.UpdateAdminReferralCoupon.ReferralDiscount = $scope.UpdateAdminReferralCoupon.Discount;
            $scope.UpdateAdminReferralCoupon.ReferralProfitPercentage = $scope.UpdateAdminReferralCoupon.ProfitPercentage;
            $scope.UpdateAdminReferralCoupon.ReferralExpiryDate = $scope.UpdateAdminReferralCoupon.ExpiryDate;

            $scope.UpdateAdminReferralCoupon.CurrentIndex = index;
            ngDialog.open({
                template: 'Views/Popups/UpdateReferralCoupon.html',
                scope: $scope,
                className: 'forgot-password-popup',
                closeByDocument: false
            });
        }

        $scope.Submitting = false;
        $scope.CallUpdateAdminReferralCoupon = function () {
            if ($("#UpdateAdminReferralCouponForm").valid()) {
                debugger;
                $scope.Submitting = true;
                var UserData = {
                    "ReferralId": $scope.UpdateAdminReferralCoupon.ReferralId,
                    "Email": $scope.UpdateAdminReferralCoupon.ReferralEmail,
                    "FirstName": $scope.UpdateAdminReferralCoupon.ReferralFirstName,
                    "LastName": $scope.UpdateAdminReferralCoupon.ReferralLastName,
                    "Discount": $scope.UpdateAdminReferralCoupon.ReferralDiscount,
                    "ProfitPercentage": $scope.UpdateAdminReferralCoupon.ReferralProfitPercentage,
                    "ExpiryDateTime": $scope.UpdateAdminReferralCoupon.ReferralExpiryDate


                };
                AdminService.CallAjaxUsingPostRequest(API.CREATE_UPDATE_REFERRAL_API, UserData).then(function (data) {
                    debugger;
                    if (data.Success == true) {
                        $scope.ngDialog.close();
                        var index = $scope.ReferralListing.findIndex(x=>x.ReferralId == $scope.UpdateAdminReferralCoupon.ReferralId);
                        //UserData.RoleName = (index > -1) ? $scope.ReferralListing[index].RoleName : '';

                        $scope.ReferralListing[$scope.CurrentIndex].Email = UserData.Email;
                        $scope.ReferralListing[$scope.CurrentIndex].FirstName = UserData.FirstName;
                        $scope.ReferralListing[$scope.CurrentIndex].LastName = UserData.LastName;
                        $scope.ReferralListing[$scope.CurrentIndex].ReferralId = UserData.ReferralId;
                        $scope.ReferralListing[$scope.CurrentIndex].Discount = UserData.RoleName;
                        $scope.ReferralListing[$scope.CurrentIndex].ProfitPercentage = UserData.ProfitPercentage;
                        $scope.ReferralListing[$scope.CurrentIndex].ExpiryDateTime = UserData.ExpiryDateTime;

                    } else {
                        toaster.pop('error', '', data.Message);
                    }
                }, function (error) {

                }).finally(function () {
                    $scope.Submitting = false;
                });

            };
        }

        $scope.IsChecked = function () {
            if ($scope.FormData.NoExpiry) {
                $scope.FormData.ExpiryDate = null;
            }
        }

        /** Validation **/
        $scope.validationOptionsForReferrerForm = {
            rules: {
                'fname': { required: true },
                'lname': { required: true },
                'email': { required: true, email: true, },
                'discount': { required: true, number: true },
                'profit': { required: true, number: true }
            },
            errorPlacement: function (error, element) {
                if (element.parent(".input-group").length == 1)
                    error.insertAfter(element.parent(".input-group"));
                else
                    error.insertAfter(element);
            }
        };

    }]);


Demo.controller('AdminReferrerDetails', ['$scope', '$rootScope', '$state', '$stateParams', 'ngDialog', '$localStorage', 'AdminService', 'toaster',
    function ($scope, $rootScope, $state, $stateParams, ngDialog, $localStorage, AdminService, toaster) {

        if (!$stateParams.ReferrerId || $stateParams.ReferrerId == 0) {
            $state.go('Admin.CouponManagement.Referrer');
        } else {
            $scope.showLoading = true;
            $scope.showLoadMore = true;

            $scope.BASE_URL = BASE_URL;

            $scope.ngDialog = ngDialog;

            $scope.Message = $stateParams.Message;

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                console.log('..');
                return $scope.opened = true;
            };

            $scope.PageNo = 1;
            $scope.PageSize = 10;
            $scope.maxSize = 5;

            var ReferralUserRequest = {};
            ReferralUserRequest.PageNo = $scope.PageNo;
            ReferralUserRequest.PageSize = $scope.PageSize;
            ReferralUserRequest.ReferralId = $stateParams.ReferrerId;


            AdminService.CallAjaxUsingPostRequest(API.GET_REFERRER_DETAILS, ReferralUserRequest).then(function (data) {
                if (data.Success == true) {
                    $scope.ReferralUserList = data.record.resultdata;
                    $scope.TotalItems = data.record.totalcount;
                    $scope.AmountList = data.amount;
                    $scope.RefferalAgent = data.referral;
                    $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                } else {

                }
            }, function (error) {

            }).finally(function () {
                $scope.showLoading = false;
            });

            $scope.sort = {
                column: '',
                descending: false,
                className: 'sort_asc'
            };


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

                $scope.ApplyFilter();
            };

            $scope.PageChanged = function () {
                $scope.ApplyFilter();
            }

            $scope.ApplyFilter = function () {
                var ReferralUserRequest = {};
                ReferralUserRequest.PageNo = $scope.PageNo;
                ReferralUserRequest.PageSize = $scope.PageSize;
                ReferralUserRequest.SortOrder = $scope.sort.descending ? 'DESC' : 'ASC';
                ReferralUserRequest.SortColumn = $scope.sort.column;
                ReferralUserRequest.UserId = $scope.FilterByUserId;
                ReferralUserRequest.FirstName = $scope.FilterByFirstName;
                ReferralUserRequest.LastName = $scope.FilterByLastName;
                

                AdminService.CallAjaxUsingPostRequest(API.Get_All_Referral_UserList, ReferralUserRequest).then(function (data) {
                    if (data.Success == true) {
                        $scope.ReferralUserList = data.record.resultdata;
                        $scope.AmountList = data.amount;
                        $scope.RefferalAgent = data.referral;
                        $scope.TotalItems = data.record.totalcount;
                        $scope.TotalPage = Math.ceil($scope.TotalItems / $scope.PageSize);
                    } else {

                    }
                }, function (error) {

                }).finally(function () {
                    $scope.showLoading = false;
                });
            }

            $scope.ToggleActivation = function (ReferralUser, index) { 
                if (ReferralUser.is_cleared == "Y") {
                    var Confirmation = confirm("Do you want to mark this unpaid ?");
                } else {
                    var Confirmation = confirm("Do you want to mark this paid  ");
                }

                if (Confirmation) {
                    var Request = {};
                    Request.Id = ReferralUser.id;
                    Request.PaymentId = ReferralUser.PaymentId
                    Request.Status = (ReferralUser.is_cleared == "Y") ? "N" : "Y";

                    AdminService.CallAjaxUsingPostRequest(API.UPDATE_PAYMENT_CLEARENCE_API, Request).then(function (data) {
                        $scope.ReferralUserList[index].is_cleared = ($scope.ReferralUserList[index].is_cleared == "Y") ? "N" : "Y";
                    }, function (error) {

                    }).finally(function () {

                    });
                }
            }
        }
    }]);