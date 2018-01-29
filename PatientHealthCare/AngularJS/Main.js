var module = angular.module('MainCaseWorkerApp', ['angucomplete-alt', 'ngSanitize', 'ngDialog', 'ui.bootstrap', 'toaster', 'chart.js']).constant("API", "/");

module.run(function ($rootScope) {
    $rootScope.LivingSituation = null;
    $rootScope.PrimaryCareProviders = null;
    $rootScope.PatientAuto = null;
    $rootScope.Surgeons = null;
    $rootScope.SecondaryContacts = null;
    $rootScope.Caregivers = null;
    $rootScope.Procedures = null;

    $rootScope.PatientMedication = null;
    $rootScope.Medicines = null;
    $rootScope.Frequency = null;
    $rootScope.DosageUnit = null;
    $rootScope.Route = null;

    $rootScope.DemographicInfo = null;
    $rootScope.PatientContactInfo = null;
    $rootScope.PatientQuestions = null;
    $rootScope.IsNewPatient = null;
});

module.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };
}]);

module.directive('datepicker', ['$parse', function ($parse) {
    var directiveDefinitionObject = {
        restrict: 'A',
        link: function postLink(scope, iElement, iAttrs) {
            iElement.datepicker({
                dateFormat: 'mm/dd/yy',
                onSelect: function (dateText, inst) {
                    scope.$apply(function (scope) {
                        $parse(iAttrs.ngModel).assign(scope, dateText);
                    });
                }
            });
        }
    };
    return directiveDefinitionObject;
}]);


module.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var dateFormat = attrs['date'] || 'mm/dd/yy';

            ctrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, dateFormat);
            });
        }
    };
})

module.directive('applyValidate', function () {
    return function (scope, element, attrs) {
        setTimeout(function () {
            $(element).validate();
        }, 100);
    };
});

module.directive('applyDatepicker', function () {
    return function (scope, element, attrs) {
        setTimeout(function () {
            $(element).datepicker({
                dateFormat: 'mm/dd/yy',
            });
        }, 100);
    };
});

module.directive('applyDatepicker', function () {
    return function (scope, element, attrs) {
        setTimeout(function () {
            $(element).datepicker({
                dateFormat: 'mm/dd/yy',
            });
        }, 100);
    };
});

module.directive('applyDatetimepicker', function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attrs) {
                $(element).datetimepicker({
                    onSelectDate: function (ct, $i) {
                        scope.$apply(function (scope) {
                            $parse(attrs.ngModel).assign(scope, $i.val());
                        });
                    },
                    onSelectTime: function (ct, $i) {
                        scope.$apply(function (scope) {
                            $parse(attrs.ngModel).assign(scope, $i.val());
                        });
                    },
                });
        }
    };
});

module.directive('applyEasyPieChart', function ($parse) {
    return function (scope, element, attrs) {
        setTimeout(function () {
            var self = $(element);
            var options = eval('[' + self.attr('ui-options') + ']');
            if ($.isPlainObject(options[0])) {
                options[0] = $.extend({}, options[0]);
            }

            uiLoad.load(jp_config['easyPieChart']).then(function () {
                self['easyPieChart'].apply(self, options);
            });
        }, 100);
    };
});

module.filter('ssnFilter', function () {
    return function (value, mask) {
        var len, val;
        if (mask == null) {
            mask = false;
        }
        if (value) {
            val = value.toString().replace(/\D/g, "");
            len = val.length;
            if (len < 4) {
                return val;
            } else if ((3 < len && len < 6)) {
                if (mask) {
                    return "***-" + (val.substr(3));
                } else {
                    return (val.substr(0, 3)) + "-" + (val.substr(3));
                }
            } else if (len > 5) {
                if (mask) {
                    return "***-**-" + (val.substr(5, 4));
                } else {
                    return (val.substr(0, 3)) + "-" + (val.substr(3, 2)) + "-" + (val.substr(5, 4));
                }
            }
        }
        return value;
    };
}).filter("ssnReverse", function () {
    return function (value) {
        if (!!value) {
            return value.replace(/\D/g, "").substr(0, 9);
        }
        return value;
    };
}).directive('ssnField', function ($filter) {
    var ssnFilter, ssnReverse;
    ssnFilter = $filter('ssnFilter');
    ssnReverse = $filter('ssnReverse');
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var formatter, mask, parser;
            mask = attrs.ssnFieldMask;
            formatter = function (value) {
                return ssnFilter(value);
            };
            parser = function (value) {
                var formatted;
                formatted = ssnReverse(value);
                element.val(ssnFilter(formatted));
                return formatted;
            };
            modelCtrl.$formatters.push(formatter);
            return modelCtrl.$parsers.unshift(parser);
        }
    };
});

module.filter('ageFilter', function () {
    function calculateAge(birthday) { // birthday is a date
        birthday = new Date(birthday);
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    function monthDiff(d1, d2) {
        if (d1 < d2) {
            var months = d2.getMonth() - d1.getMonth();
            return months <= 0 ? 0 : months;
        }
        return 0;
    }

    return function (birthdate) {
        var age = calculateAge(birthdate);
        if (age == 0)
            return monthDiff(birthdate, new Date()) + ' months';

        return age + ' years';
    };
});


module.filter('ceil', function () {
    return function (num) { return Math.ceil(num); }
});

/** GUID Function **/
function generateGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


/*** Angular Controllers ***/

module.controller('DashBoardCtrl', function ($scope, $rootScope, $http, CallService, ngDialog, API, $filter, $compile) {
    $scope.showLoading = true;

    $scope.ScreenType = 'DASHBOARD';

    $scope.priorityPatientsPage = 1;
    $scope.newPatientsPage = 1;
    $scope.engagedPatientsPage = 1;

    $scope.limit = 5;

    $scope.DashboardPatientData = CallService.getDashboardData();
    $scope.DashboardPatientData.then(function (data) {
        if (data.Success == true) {
            $scope.DashboardGraph = data.DashboardGraph[0];

            $scope.EngagedPatientGraph = {
                percent: $scope.DashboardGraph.EngagedPatients,
                lineWidth: 4,
                trackColor: '#e8eff0',
                barColor: '#7266ba',
                scaleColor: false,
                size: 100,
                rotate: 0,
                lineCap: 'butt',
                animate: 1000
            };

            $scope.PriorityPatientGraph = {
                percent: $scope.DashboardGraph.PriorityPatients,
                lineWidth: 4,
                trackColor: '#e8eff0',
                barColor: '#ff9900',
                scaleColor: false,
                size: 100,
                rotate: 0,
                lineCap: 'butt',
                animate: 1000
            };


            $scope.NewPatientGraph = {
                percent: $scope.DashboardGraph.NewPatients,
                lineWidth: 4,
                trackColor: '#e8eff0',
                barColor: '#a3a3c2',
                scaleColor: false,
                size: 100,
                rotate: 0,
                lineCap: 'butt',
                animate: 1000
            };

            $scope.NoComplicationPatientGraph = {
                percent: $scope.DashboardGraph.NoComplicationPatients,
                lineWidth: 4,
                trackColor: '#e8eff0',
                barColor: 'green',
                scaleColor: false,
                size: 100,
                rotate: 0,
                lineCap: 'butt',
                animate: 1000
            };

            $scope.EscalatedPatientGraph = {
                percent: 35,
                lineWidth: 4,
                trackColor: '#e8eff0',
                barColor: 'green',
                scaleColor: false,
                size: 100,
                rotate: 0,
                lineCap: 'butt',
                animate: 1000
            };

            $scope.PriorityPatientsList = data.PriorityPatients;
            $scope.PriorityPatientsTotal = data.PriorityPatients.length;
            $scope.PriorityTotalPage = Math.ceil($scope.PriorityPatientsTotal / $scope.limit);

            $scope.NewPatientsList = data.NewPatients;
            $scope.NewPatientsTotal = data.NewPatients.length;
            $scope.NewTotalPage = Math.ceil($scope.NewPatientsTotal / $scope.limit);

            $scope.EngagedPatientsList = data.EngagedPatients;
            $scope.EngagedPatientsTotal = data.EngagedPatients.length;
            $scope.EngagedTotalPage = Math.ceil($scope.EngagedPatientsTotal / $scope.limit);
        }
    }, function (error) {

    }).finally(function () {
        $scope.showLoading = false;
    });


    $scope.changePatientsList = function (type) {

    }

    $scope.CalculateDays = function (date) {
        var date2 = new Date();
        var date1 = new Date(date);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays + ' Days';
    }

    $scope.BindWeight = function (weightinpounds, responseweight) {
        if (weightinpounds == null && responseweight == null) {
            return '-';
        } else {
            return ((weightinpounds == null ? '-' : weightinpounds) + ' | ' + (responseweight == null ? '-' : responseweight));
        }
    }

    $scope.AddStatusClass = function (statusValue) {
        if (statusValue == '881810002') {
            return 'priority-patients-status';
        } else if (statusValue == '881810001') {
            return 'newly-patients-status';
        } if (statusValue == '881810000') {
            return 'engaged-patients-status';
        } else {
            return '';
        }
    }

    $scope.AddColorClass = function (Value) {
        if (Value >= 0.7) {
            return 'green-bg';
        } else if (Value >= 0.5 && Value < 0.7) {
            return 'orange-bg';
        } if (Value < 0.5) {
            return 'red-bg';
        }
    }

    $scope.AddNote = function (patentId, patientName) {
        $scope.patientId = patentId;
        $scope.patientName = patientName;
        $scope.parentNoteID = null;

        ngDialog.open({
            template: 'NotePopupWindow.html',
            controller: 'SavePatientNoteCtrl',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });
    }

    $scope.AddAppointment = function (patentId, patientName) {
        $scope.patientId = patentId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'AppointmentPopupWindow.html',
            controller: 'SaveAppointmentWithPatientCtrl',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });
    }

    $scope.AddAlert = function (patentId, patientName) {
        $scope.patientId = patentId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'AlertPopupWindow.html',
            controller: 'SavePatientAlertCtrl',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });
    }

    $scope.AddVitals = function (patentId, patientName) {
        $scope.patientId = patentId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'VitalsPopupWindow.html',
            controller: 'SavePatientVitalsCtrl',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup form-popup vital-popup',
            scope: $scope
        });
    }

    $scope.OpenPatientNote = function (patientId, patientName) {
        $scope.showPopupLoading = true;
        $scope.patentId = patientId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'PatientNoteWindow.html',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });

        $scope.notesData = CallService.getNotesList(patientId, patientName);
        $scope.notesData.then(function (data) {
            if (data.Success == true) {
                $scope.Notes = data.noteDetial;
            }
        }, function (error) {

        }).finally(function () {
            $scope.showPopupLoading = false;
        });
    }

    $scope.OpenPatientAppointment = function (patientId, patientName) {
        $scope.showPopupLoading = true;
        $scope.patentId = patientId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'PatientAppointmentWindow.html',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });

        $scope.appointmentData = CallService.getAppointmentList(patientId);
        $scope.appointmentData.then(function (data) {
            if (data.Success == true) {
                $scope.Appointments = data.appointmentDetail;
            }
        }, function (error) {

        }).finally(function () {

        });
    }

    $scope.OpenPatientAlert = function (patientId, patientName) {
        $scope.showPopupLoading = true;
        $scope.patentId = patientId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'PatientAlertWindow.html',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup informatory-popup',
            scope: $scope
        });

        $scope.alertData = CallService.getAlertList(patientId);
        $scope.alertData.then(function (data) {
            if (data.Success == true) {
                $scope.Alerts = data.PatientAlertList;
            }
        }, function (error) {

        }).finally(function () {

        });
    }

    $scope.OpenPatientVitals = function (patientId, patientName) {
        $scope.showPopupLoading = true;
        $scope.patentId = patientId;
        $scope.patientName = patientName;

        ngDialog.open({
            template: 'PatientVitalsWindow.html',
            className: 'ngdialog-theme-default ngdialog-post-windows small-popup vital-popup informatory-popup',
            scope: $scope
        });

        $scope.vitalData = CallService.getVitalsList(patientId);
        $scope.vitalData.then(function (data) {
            if (data.Success == true) {
                $scope.PatientVitals = data.patientVitals;
            }
        }, function (error) {

        }).finally(function () {

        });
    }

    $scope.MarkNoteCompleted = function (noteId, patientId) {
        var url = API + 'api/patientapi/UpdateNoteStatus?noteID=' + noteId + '&patientID=' + patientId + '&status=881810001';
        $scope.changeAlertStatus = CallService.CallAjaxUsingGetRequest(url, {});
        $scope.changeAlertStatus.then(function (data) {
            var today_date = new Date();
            var filtered_date = $filter('date')(today_date, "MMM/dd/yyyy");
            var html = '<span><label class="text-muted green-color" title="Resolved Date"><i class="fa fa-check-circle-o" aria-hidden="true"></i></label> <span class="info-text">' + filtered_date + '</span></span>';
            $("#note-" + noteId + " .action-btns").html($compile(html)($scope))
        }, function (error) {

        }).finally(function () {

        });
    }

    $scope.MarkAlertCompleted = function (alertId, patientId) {
        var url = API + 'api/patientapi/UpdateAlertStatus?alertID=' + alertId + '&patientID=' + patientId + '&status=83181001';
        $scope.changeAlertStatus = CallService.CallAjaxUsingGetRequest(url, {});
        $scope.changeAlertStatus.then(function (data) {
            var today_date = new Date();
            var filtered_date = $filter('date')(today_date, "MMM/dd/yyyy");
            var html = '<span><label class="text-muted green-color" title="Resolved Date"><i class="fa fa-check-circle-o" aria-hidden="true"></i></label> <span class="info-text">' + filtered_date + '</span></span>';
            $("#alert-" + alertId + " .alert-dates").html($compile(html)($scope));
            $("#alert-" + alertId + " .action-btns").remove();
        }, function (error) {

        }).finally(function () {

        });
    }

    $scope.MarkAppointmentCompleted = function (appointmentId, patientId) {
        var url = API + 'api/patientapi/UpdateAppointmentStatus?appointmentID=' + appointmentId + '&patientID=' + patientId + '&status=881110001';
        $scope.changeAppointmentStatus = CallService.CallAjaxUsingGetRequest(url, {});
        $scope.changeAppointmentStatus.then(function (data) {
            var today_date = new Date();
            var filtered_date = $filter('date')(today_date, "MMM/dd/yyyy");
            var html = '<span><label class="text-muted green-color" title="Completed Date"><i class="fa fa-check-circle-o" aria-hidden="true"></i></label> <span class="info-text">' + filtered_date + '</span></span>';
            $("#appointment-" + appointmentId + " .alert-dates").html($compile(html)($scope));
            $("#appointment-" + appointmentId + " .action-btns").remove();
        }, function (error) {

        }).finally(function () {

        });
    }
});

module.controller('DashBoardSidbarCtrl', function ($scope, $rootScope, $http, CallService, ngDialog, API, $filter, $compile) {
    $scope.showChatLoading = false;
    $scope.ChatWithPatient = null;
    
    $scope.Activites = CallService.getRecentActivities();
    $scope.Activites.then(function (data) {
        $scope.RecentActivites = data.AgentActivities;
    }, function (error) {

    }).finally(function () {

    });

    $scope.getChatWithPatient = function () {
        if ($scope.ChatWithPatient == null) {
            var url = API + "api/ConversationAPI/GetAgentRecentChatWithPatientNames";

            $scope.ChatsData = CallService.CallAjaxUsingGetRequest(url, {});
            $scope.ChatsData.then(function (data) {
                $scope.ChatWithPatient = data.CustomPatientWithChat;
            }, function (error) {

            }).finally(function () {

            });
        }
    }

    $scope.getChatDetails = function (patientId) {
        $scope.showChatLoading = true;
        var url = API + "api/ConversationAPI/GetRecentChatsWithPatient/" + patientId;

        $scope.ChatDetail = CallService.CallAjaxUsingGetRequest(url, {});
        $scope.ChatDetail.then(function (data) {
            $scope.PatientConversation = data.ChatConversations;
        }, function (error) {

        }).finally(function () {
            $scope.showChatLoading = false;
        });
    }
});

module.controller('MainCaseWorkerCtrl', function ($scope, $rootScope, $http) {
    $scope.ErrorMessage = '';

    $.ajax({
        url: '/api/PatientAPI/GetPatientById',
        type: 'GET',
        async: false,
        data: {
            id: patientId
        },
        dataType: 'json',
        success: function (response) {
            $scope.ErrorMessage = '';
            $rootScope.LivingSituation = response.OptionSets[0].Options;
            //Lookups Autocompelte
            $rootScope.PrimaryCareProviders = response.PrimaryCareProviders;
            $rootScope.PatientAuto = response.PatientAuto;
            $rootScope.Surgeons = response.Surgeons;
            $rootScope.SecondaryContacts = response.SecondaryContacts;
            $rootScope.Caregivers = response.Caregivers;
            $rootScope.Procedures = response.Procedures;

            $rootScope.PatientMedication = response.PatientMedication;
            $rootScope.Medicines = response.Medicines;
            $rootScope.Frequency = response.OptionSets[1].Options;
            $rootScope.DosageUnit = response.OptionSets[2].Options;
            $rootScope.Route = response.OptionSets[3].Options;

            $rootScope.DemographicInfo = response.demographicInfo;
            $rootScope.PatientContactInfo = response.Patient;
            $rootScope.IsNewPatient = response.Patient.IsNewPatient;

            $rootScope.PatientQuestions = response.PatientQuestions;

            $rootScope.MultiplicityUsageAllergies = response.AllMultiplicitySections.MultiplicitySections[0];
            $rootScope.MultiplicityUsageUsage = response.AllMultiplicitySections.MultiplicitySections[1];
            $rootScope.MultiplicityFamilyHistory = response.AllMultiplicitySections.MultiplicitySections[2];
            $rootScope.MultiplicityPriorTestings = response.AllMultiplicitySections.MultiplicitySections[3];
            $rootScope.MultiplicityPriorSurgeries = response.AllMultiplicitySections.MultiplicitySections[4];
            $rootScope.PatientActivities = response.PatientActivities.Activities;

            $rootScope.Dialog_Prompts = response.BOTPrompts;
            $rootScope.PromptMessages = response.PromptMessages;
            $rootScope.AssignToList = response.AssignTo;
        },
        error: function (error) {
            $scope.ErrorMessage = error.data;
            swal("Error...", error.data, "error");
        }
    });

    $scope.$on('DemographicInformation', function (events, args) {
        $scope.SaveDemographicInformation = args;
    });

    $scope.$on('ContactInformation', function (events, args) {
        $scope.SaveContactInformation = args;
    });

    $scope.$on('MedicalDiagnosis', function (events, args) {
        $scope.SaveMedicalDiagnosis = args;
    });

    $scope.$on('PatientMedication', function (events, args) {
        $scope.SavePatientMedication = args;
    });

    $scope.$on('Allergies', function (events, args) {
        $scope.SaveAllergies = args;
    });

    $scope.$on('Usage', function (events, args) {
        $scope.SaveUsage = args;
    });

    $scope.$on('Screening_GeneralScreening', function (events, args) {
        $scope.SaveScreening_GeneralScreening = args;
    });

    $scope.$on('Screening_MRSAScreening', function (events, args) {
        $scope.SaveScreening_MRSAScreening = args;
    });

    $scope.$on('Screening_EnergyScreening', function (events, args) {
        $scope.SaveScreening_EnergyScreening = args;
    });

    $scope.$on('FamilyHistory', function (events, args) {
        $scope.SaveFamilyHistory = args;
    });

    $scope.$on('PriorTesting', function (events, args) {
        $scope.SavePriorTesting = args;
    });

    $scope.$on('MultiplicityAllergies', function (events, args) {
        $scope.SaveMultiplicityAllergies = args;
    });

    $scope.$on('MultiplicityUsage', function (events, args) {
        $scope.SaveMultiplicityUsage = args;
    });

    $scope.$on('MultiplicityFamilyHistory', function (events, args) {
        $scope.SaveMultiplicityFamilyHistory = args;
    });

    $scope.$on('MultiplicityPriorTesting', function (events, args) {
        $scope.SaveMultiplicityPriorTesting = args;
    });

    $scope.$on('MultiplicityPriorSurgeries', function (events, args) {
        $scope.SaveMultiplicityPriorSurgeries = args;
    });

    $scope.SavePatientInfo = function () {
        debugger;
        $rootScope.$emit("CallSaveDemographic", {
        });

        $rootScope.$emit("CallSaveBasicContact", {});

        $rootScope.$emit("CallSaveMedicalDiagnosis", {});

        $rootScope.$emit("CallSaveMedications", {});

        $rootScope.$emit("CallSaveAllergies", {});
        $rootScope.$emit("CallSaveUsage", {});

        $rootScope.$emit("CallSaveScreening", {});

        $rootScope.$emit("CallSaveFamilyHistory", {});
        $rootScope.$emit("CallSavePriorTesting", {});

        $rootScope.$emit("CallSaveMultiplicityAllergies", {});
        $rootScope.$emit("CallSaveMultiplicityUsage", {});
        $rootScope.$emit("CallSaveMultiplicityFamilyHistory", {});
        $rootScope.$emit("CallSaveMultiplicityPriorTesting", {});
        $rootScope.$emit("CallSaveMultiplicityPriorSurgeries", {});

        $scope.SavePatient();
    }

    $scope.SavePatient = function () {
        debugger;
        if ($("#DemographicInfoForm").is(':visible') && !$("#DemographicInfoForm").valid()) {
            $('#DemographicInformation.panel-collapse:not(".in")').collapse('show');
            return false;
        } else if (!$("#DemographicInfoForm").is(':visible')) {
            $('#DemographicInformation.panel-collapse:not(".in")').collapse('show');
            if ($("#DemographicInfoForm").length > 0) {
                if (!$("#DemographicInfoForm").valid()) {
                    return false;
                }
            }
        }

        var patientSave = {};
        patientSave.demographicsDetails = {};
        patientSave.patientDetails = {};
        patientSave.patientMedication = {};
        patientSave.patientQuestions = [];
        patientSave.patientMultiplicityQuestions = [];

        patientSave.demographicsDetails = $scope.SaveDemographicInformation;

        patientSave.patientDetails = $scope.SaveContactInformation;

        patientSave.patientMedication = $scope.SavePatientMedication;

        patientSave.patientQuestions.push($scope.SaveMedicalDiagnosis);

        patientSave.patientQuestions.push($scope.SaveAllergies);
        patientSave.patientQuestions.push($scope.SaveUsage);

        patientSave.patientQuestions.push($scope.SaveScreening_GeneralScreening);
        patientSave.patientQuestions.push($scope.SaveScreening_MRSAScreening);
        patientSave.patientQuestions.push($scope.SaveScreening_EnergyScreening);

        patientSave.patientQuestions.push($scope.SaveFamilyHistory);
        patientSave.patientQuestions.push($scope.SavePriorTesting);

        patientSave.patientMultiplicityQuestions.push($scope.SaveMultiplicityAllergies);
        patientSave.patientMultiplicityQuestions.push($scope.SaveMultiplicityUsage);
        patientSave.patientMultiplicityQuestions.push($scope.SaveMultiplicityFamilyHistory);
        patientSave.patientMultiplicityQuestions.push($scope.SaveMultiplicityPriorTesting);
        patientSave.patientMultiplicityQuestions.push($scope.SaveMultiplicityPriorSurgeries);


        $http({
            method: 'POST',
            url: '/api/PatientAPI/SavePatientInfo',
            data: JSON.stringify(patientSave),
            ContentType: 'application/json;utf-8',
            datatype: 'json'
        })
        .then(function (response) {
            $scope.ErrorMessage = '';

            $scope.UpdateMedicationRecordStauts();

            $scope.UpdatePatientQuestionsStatus();

            $scope.UpdateMultiplicitySectionsStatus();

        }, function (error) {
            $scope.ErrorMessage = error.data;
            swal("Error...", error.data, "error");
        });
    };

    $scope.UpdateMedicationRecordStauts = function () {
        for (var i = 0; i < $rootScope.PatientMedication.length; i++) {
            if ($rootScope.PatientMedication[i].Medicinedb != null) {
                $rootScope.PatientMedication[i].RecordStatus = 'existing';
            }
        }
    };

    $scope.UpdateMultiplicitySectionsStatus = function () {
        setMultiplicitySectionStatus($rootScope.MultiplicityUsageAllergies.MultiplicitySectionResponses);
        setMultiplicitySectionStatus($rootScope.MultiplicityUsageUsage.MultiplicitySectionResponses);
        setMultiplicitySectionStatus($rootScope.MultiplicityFamilyHistory.MultiplicitySectionResponses);
        setMultiplicitySectionStatus($rootScope.MultiplicityPriorTestings.MultiplicitySectionResponses);
        setMultiplicitySectionStatus($rootScope.MultiplicityPriorSurgeries.MultiplicitySectionResponses);
    };

    function setMultiplicitySectionStatus(sectionResponses) {
        for (var i = 0; i < sectionResponses.length; i++) {
            sectionResponses[i].IsNew = false;
        }
    }

    $scope.UpdatePatientQuestionsStatus = function () {
        $rootScope.PatientContactInfo.IsNewPatient = false;

        //MedicalDiagnosis
        setQuestions($rootScope.PatientQuestions[0].Model.PatientQuestions[0].Questions);
        //Allergies
        setQuestions($rootScope.PatientQuestions[1].Model.PatientQuestions[0].Questions);
        //Usage
        setQuestions($rootScope.PatientQuestions[2].Model.PatientQuestions[0].Questions);

        //General Screening
        setQuestions($rootScope.PatientQuestions[3].Model.PatientQuestions[0].Questions);
        //MRSA Screening
        setQuestions($rootScope.PatientQuestions[3].Model.PatientQuestions[1].Questions);
        //Metabolic Equivalents
        setQuestions($rootScope.PatientQuestions[3].Model.PatientQuestions[2].Questions);

        //Family History 
        setQuestions($rootScope.PatientQuestions[4].Model.PatientQuestions[0].Questions);
        //Prior Testing 
        setQuestions($rootScope.PatientQuestions[5].Model.PatientQuestions[0].Questions);
    }

    function setQuestions(questions) {
        for (var i = 0; i < questions.length; i++) {
            questions[i].IsNewQuestion = false;
            questions[i].OriginalQuestionResponse = questions[i].Questionresponse;

            var subQuestions = questions[i].SubQuestions;

            if (subQuestions != null && subQuestions.length > 0) {
                setQuestions(subQuestions);
            }
        }
    }
});


/** SERVICE CODE **/

module.factory("CallService", function ($http, $q, API) {
    return {
        getContactData: function () {
            var url = API + "api/patientapi/newcontact";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        sendPopupData: function (formData) {
            var url = API + "api/ContactAPI/SaveContacts";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(formData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getDashboardData: function (type) {
            var url = API + "api/PatientAPI/GetDashBoard";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getPatientsList: function (dataObject) {
            var url = API + "api/PatientAPI/GetPatientListing";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: { "Content-Type": "application/json" }
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getNotesList: function (patientId) {
            var url = API + "api/PatientAPI/GetNoteDetailList/" + patientId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getAppointmentList: function (patientId) {
            var url = API + "api/PatientAPI/GetAppointmetDetailList/" + patientId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getAlertList: function (patientId) {
            var url = API + "api/PatientAPI/GetAlertByPatientID/" + patientId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getVitalsList: function (patientId) {
            var url = API + "api/PatientAPI/GetPatientVitals?patientID=" + patientId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getAllActiveAlerts: function () {
            var url = API + "api/PatientAPI/GetAllActiveAlerts";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        callPostMethodWithJSON: function (url, dataObject) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        CallAjaxUsingGetRequest: function (url, dataObject) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                data: dataObject
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getRecentActivities: function () {
            var url = API + "api/AgentAPI/GetAgentRecentActivities";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                debugger;
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                debugger;
                defer.reject(status);
            });
            return defer.promise;
        }
    }
});