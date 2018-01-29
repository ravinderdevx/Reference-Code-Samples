angular.module('DoctorApp')
        .controller('ClientSummaryController', ['$scope', '$rootScope', 'usSpinnerService', 'toaster', '$stateParams', '$state', 'NgTableParams', '$http', 'FileUploader', '$uibModal', 'ClientSummaryService', '$location', 'SchedulerService', function ($scope, $rootScope, usSpinnerService, toaster, $stateParams, $state, NgTableParams, $http, FileUploader, $uibModal, ClientSummaryService, $location, SchedulerService) {
            /*  
                Purpose : Activate current page & LoggedInUserName.
            */
            $scope.$on('clientSummaryState', $rootScope.activePageFunction('Client Summary'));
            //$rootScope.getLoggedInUserNameFun();
            $rootScope.getLoggedInUserNameMenuListFun();

            $scope.clientRegistrationDetail = {};
            $scope.getEmergencyContactList = [];
            $scope.getClientInsuranceDetailList = [];
            $scope.getClientFamilyHealthDetailList = [];
            $scope.getClientVitalSignDetailList = [];
            $scope.getClientAllergyInformationDetailList = [];
            $scope.getClientSocialInformationDetailList = [];
            $scope.getClientVaccineDetailList = [];
            $scope.getClientPrescriptionDetailList = [];
            $scope.getClientProgressNoteList = [];
            $scope.getClientAppointmentDetailList = [];
            $scope.getClientBillingDetailList = [];
            $scope.getClientPayementDetailList = [];

            $scope.isLoadingEmergencyContact = false;
            $scope.isLoadingAppointmentDetail = false;
            $scope.isLoadingClientBasicDetail = false;
            $scope.isLoadingContactDetail = false;
            $scope.isLoadingClientInsuranceDetail = false;
            $scope.isLoadingClientPersonalDetail = false;
            $scope.isLoadingClientFamilyHealthDetail = false;
            $scope.isLoadingClientVitalSignDetail = false;
            $scope.isLoadingClientAllergyInformationDetail = false;
            $scope.isLoadingClientSocialInformationDetail = false;
            $scope.isLoadingClientVaccineDetail = false;
            $scope.isLoadingClientPrescriptionDetail = false;
            $scope.isLoadingClientProgressNote = false;
            $scope.isLoadingClientAppointmentDetail = false;
            $scope.isLoadingClientBillingDetail = false;
            $scope.isLoadingClientPayementDetail = false;

            $scope.clientContactDetail = {};
            $scope.clientPersonalDetail = {};



            /*  
                Created Date:22-11-2016
                Purpose : Get client detail by client id
            */
            $rootScope.getClientDetail = function () {
                $scope.isLoadingClientBasicDetail = true;
                ClientSummaryService.getClientDetailByClientID({ cID: $stateParams.cID }, function (err, response) {
                    if (err == null) {
                        if (response.status == 200) {
                            $scope.clientRegistrationDetail = response.data.pDetail;
                            $rootScope.clientProfileImg = $scope.clientRegistrationDetail.ProfileImg;
                        }
                        else {
                            $rootScope.commonToasterPop('error', 'Error', response.data.Message);
                        }
                    }
                    else {
                        $rootScope.commonErrorFunction(err.status);
                    }
                    $scope.isLoadingClientBasicDetail = false;
                });
            }
            $rootScope.getClientDetail();

            /*
                Created Date:28-11-2016
                Purpose : addEmergencyContact.
            */
            $scope.addEmergencyContact = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/EmergencyContact/EmergencyContact.html', 'EmergencyContactController', { emergencyContactParam: { clientId: $scope.clientRegistrationDetail.CID } });
            }


            /*
                Created Date:28-11-2016
                Purpose : EditEmergnecyContact.
            */
            $scope.editEmergencyContact = function (ECDetail) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/EmergencyContact/EmergencyContact.html', 'EmergencyContactController', { emergencyContactParam: { EmergencyContactDetail: ECDetail } });
            }



            /*
                Created Date:29-11-2016
                Purpose : editRegisterClient.
            */
            $scope.editRegisterClient = function (clientRegistrationDetails) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/RegisterClient/RegisterClient.html', 'RegisterClientController', { registerClientParam: { clientRegistrationDetail: clientRegistrationDetails } });
            }

            /*
                Created Date:28-11-2016
                Purpose : DeleteEmergnecyContact.
            */
            $scope.deleteEmergencyContact = function (ECDetail) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/EmergencyContact/DeleteEmergencyContact/DeleteEmergencyContact.html', 'DeleteContactController', { emergencyContactParam: { EmergencyContactDetail: ECDetail } });
            }

            /*  
                Created Date: 28-11-2016
                Purpose : Get list of Emergncy Contact.
            */
            $scope.getAllEmergencyContactDetail = function () {

                $scope.tableAllEmergencyContactDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        ECID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {

                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.EmergencyContactSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingEmergencyContact = true;
                        return ClientSummaryService.getAllEmergencyContact(inputJson, function (err, response) {
                            if (response.status == 200) {
                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingEmergencyContact = false;
                                $scope.getEmergencyContactList = response.data.rows;
                                $defer.resolve($scope.getEmergencyContactList);
                            } else {
                                $scope.isLoadingEmergencyContact = false;
                            }
                        });
                    }
                });
            }

            $scope.getAllEmergencyContactDetail();

            /*  
                Created Date: 28-11-2016
                Purpose : Refresh list of Emergency Contacts.
            */
            $rootScope.refreshGetAllEmergencyContact = function () {
                $scope.tableAllEmergencyContactDetailParams.reload();
            };



            /*
                Created Date:28-11-2016
                Purpose : Add Client Contact.
            */
            $scope.addClientContact = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/Contact/Contact.html', 'ClientContactController', { ClientContactParam: { ClientContactDetail: { ClientID: $scope.clientRegistrationDetail.CID, Address: null } } });
            }

            /*  
                Created Date:22-11-2016
                Purpose : Get client detail by client id
            */
            $rootScope.getClientContactDetialFun = function () {
                $scope.isLoadingContactDetail = true;

                ClientSummaryService.getClientContactDetial({ ClientID: $stateParams.cID }, function (err, response) {
                    if (err == null) {
                        if (response.status == 200) {
                            $scope.clientContactDetail = response.data.clientContactDetail;
                        }
                        else {
                            $rootScope.commonToasterPop('error', 'Error', response.data.Message);
                        }
                    }
                    else {
                        $rootScope.commonErrorFunction(err.status);
                    }
                    $scope.isLoadingContactDetail = false;
                });
            }
            $rootScope.getClientContactDetialFun();

            /*  
                Created Date:22-11-2016
                Purpose : editClientContact
            */
            $scope.editClientContact = function (clientContactDetail) {
                var clientContactDetailobj = clientContactDetail;
                clientContactDetailobj.ClientID = $scope.clientRegistrationDetail.CID;

                $rootScope.commonModalOpen('/App/Section/PopScreen/Contact/Contact.html', 'ClientContactController', { ClientContactParam: { ClientContactDetail: clientContactDetailobj } });
            }


            /*
                Created Date:30-11-2016
                Purpose : Add Client Personal Detail.
            */
            $scope.addClientPersonalDetailFun = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPersonalDetail/ClientPersonalDetail.html', 'ClientPersonalDetailController', { ClientPersonalDetailParam: { ClientPersonalDetail: { ClientID: $scope.clientRegistrationDetail.CID, Gender: null } } });
            }

            /*  
                Created Date:30-11-2016
                Purpose : Get client personl detail by client id
            */
            $rootScope.getClientPersonalDetailFun = function () {
                $scope.isLoadingClientPersonalDetail = true;

                ClientSummaryService.getClientPersonalDetail({ ClientID: $stateParams.cID }, function (err, response) {
                    if (err == null) {
                        if (response.status == 200) {
                            $scope.clientPersonalDetail = response.data.ClientPersonalDetail;
                        }
                        else {
                            $rootScope.commonToasterPop('error', 'Error', response.data.Message);
                        }
                    }
                    else {
                        $rootScope.commonErrorFunction(err.status);
                    }
                    $scope.isLoadingClientPersonalDetail = false;
                });
            }
            $rootScope.getClientPersonalDetailFun();

            /*  
                Created Date:30-11-2016
                Purpose : edit client personal detail.
            */
            $scope.editClientPersonalDetailFun = function (clientPersonalDetail) {
                var clientPersonalDetailobj = clientPersonalDetail;
                clientPersonalDetailobj.ClientID = $scope.clientRegistrationDetail.CID;
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPersonalDetail/ClientPersonalDetail.html', 'ClientPersonalDetailController', { ClientPersonalDetailParam: { ClientPersonalDetail: clientPersonalDetailobj } });
            }


            /*  
                Created Date: 1-12-2016
                Purpose : Get list of Client Insurance Detail.
            */
            $scope.getAllClientInsuranceDetail = function () {

                $scope.tableAllClientInsuranceDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CInDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {

                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientInsuranceDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientInsuranceDetail = true;
                        return ClientSummaryService.getAllClientInsuranceDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientInsuranceDetail = false;
                                $scope.getClientInsuranceDetailList = response.data.rows;
                                $defer.resolve($scope.getClientInsuranceDetailList);
                            } else {
                                $scope.isLoadingClientInsuranceDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientInsuranceDetail();
            /*
                Created Date:1-12-2016
                Purpose : Add Client Insurance Detail.
            */
            $scope.addClientInsuranceDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientInsuranceDetail/ClientInsuranceDetail.html', 'ClientInsuranceController', { clientInsuranceParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }


            /*
                Created Date:1-12-2016
                Purpose : Edit Client Insurance Detail.
            */
            $scope.editClientInsuranceDetail = function (CIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientInsuranceDetail/ClientInsuranceDetail.html', 'ClientInsuranceController', { clientInsuranceParam: { ClientInsuranceDetail: CIDList } });
            }
            /*
                Created Date:1-12-2016
                Purpose : Delete Client Insurance Detail.
            */
            $scope.deleteClientInsuranceDetail = function (CIDList) {

                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientInsuranceDetail/DeleteClientInsuranceDetail/DeleteClientInsuranceDetail.html', 'DeleteClientInsuranceDetailController', { clientInsuranceParam: { ClientInsuranceDetail: CIDList } });
            }

            /*  
                Created Date: 1-12-2016
                Purpose : Refresh list of Client Insurance Detail.
            */
            $rootScope.refreshGetAllClientInsuranceDetail = function () {
                $scope.tableAllClientInsuranceDetailParams.reload();
            };



            /*  
                Created Date: 1-12-2016
                Purpose : Get list of Client Family Health Detail.
            */
            $scope.getAllClientFamilyHealthDetail = function () {

                $scope.tableAllClientFamilyHealthDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CFHDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {

                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientFamilyHealthDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientFamilyHealthDetail = true;
                        return ClientSummaryService.getAllClientFamilyHealthDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientFamilyHealthDetail = false;
                                $scope.getClientFamilyHealthDetailList = response.data.rows;
                                $defer.resolve($scope.getClientFamilyHealthDetailList);
                            } else {
                                $scope.isLoadingClientFamilyHealthDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientFamilyHealthDetail();
            /*
                Created Date:1-12-2016
                Purpose : Add ClientFamilyHealthDetail.
            */
            $scope.addClientFamilyHealthDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientFamilyHealthDetail/ClientFamilyHealthDetail.html', 'ClientFamilyHealthController', { clientFamilyHealthDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }


            /*
                Created Date:1-12-2016
                Purpose : Edit ClientFamilyHealthDetail.
            */
            $scope.editClientFamilyHealthDetail = function (CFHDList) {

                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientFamilyHealthDetail/ClientFamilyHealthDetail.html', 'ClientFamilyHealthController', { clientFamilyHealthDetailParam: { ClientFamilyHealthDetail: CFHDList } });
            }
            /*
                Created Date:1-12-2016
                Purpose : Delete Client Insurance Detail.
            */
            $scope.deleteClientFamilyHealthDetail = function (CIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientFamilyHealthDetail/DeleteClientFamilyHealthDetail/DeleteClientFamilyHealthDetail.html', 'DeleteFamilyHealthDetailController', { clientFamilyHealthDetailParam: { ClientFamilyHealthDetail: CIDList } });
            }

            /*  
                Created Date: 1-12-2016
                Purpose : Refresh list of FamilyHealthDetail.
            */
            $rootScope.refreshGetAllFamilyHealthDetail = function () {
                $scope.tableAllClientFamilyHealthDetailParams.reload();
            };

            /*  
                Created Date: 2-12-2016
                Purpose : Get list of Client Vital Sign Detail.
            */
            $scope.getAllClientVitalSignDetail = function () {

                $scope.tableAllClientVitalSignDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CFHDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientVitalSignDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientVitalSignDetail = true;
                        return ClientSummaryService.getAllClientVitalSignDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientVitalSignDetail = false;
                                $scope.getClientVitalSignDetailList = response.data.rows;
                                $defer.resolve($scope.getClientVitalSignDetailList);
                            } else {
                                $scope.isLoadingClientVitalSignDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientVitalSignDetail();
            /*  
                Created Date: 2-12-2016
                Purpose : Refresh list of ClientVitalSignDetail.
            */
            $rootScope.refreshGetAllClientVitalSignDetail = function () {
                $scope.tableAllClientVitalSignDetailParams.reload();
            }

            $scope.addClientVitalSignDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVitalSignDetail/ClientVitalSignDetail.html', 'ClientVitalSignDetailController', { clientVitalSignDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*
                Created Date:2-12-2016
                Purpose : Edit ClientVitalSignDetail.
            */
            $scope.editClientVitalSignDetail = function (CVSDList) {

                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVitalSignDetail/ClientVitalSignDetail.html', 'ClientVitalSignDetailController', { clientVitalSignDetailParam: { ClientVitalSignDetail: CVSDList } });
            }
            /*
                Created Date:2-12-2016
                Purpose : Delete ClientVitalSignDetail.
            */
            $scope.deleteClientVitalSignDetail = function (CVSDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVitalSignDetail/DeleteClientVitalSignDetail/DeleteClientVitalSignDetail.html', 'DeleteClientVitalSignDetailController', { clientVitalSignDetailParam: { ClientVitalSignDetail: CVSDList } });
            }


            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of ClientAllergyInformationDetail.
            */
            $scope.getAllClientAllergyInformationDetail = function () {

                $scope.tableAllClientAllergyInformationDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CAIDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientAllergyInformationDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientAllergyInformationDetail = true;
                        return ClientSummaryService.GetAllClientAllergyInformationDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientAllergyInformationDetail = false;
                                $scope.getClientAllergyInformationDetailList = response.data.rows;
                                $defer.resolve($scope.getClientAllergyInformationDetailList);
                            } else {
                                $scope.isLoadingClientAllergyInformationDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientAllergyInformationDetail();
            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of ClientAllergyInformationDetail.
            */
            $rootScope.refreshGetAllClientAllergyInformationDetail = function () {
                $scope.tableAllClientAllergyInformationDetailParams.reload();
            }

            $scope.addClientAllergyInformationDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientAllergyInformationDetail/ClientAllergyInformationDetail.html', 'ClientAllergyInformationDetailController', { clientAllergyInformationDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*
                Created Date:3-12-2016 
                Purpose : Edit ClientAllergyInformationDetail.
            */
            $scope.editClientAllergyInformationDetail = function (CAIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientAllergyInformationDetail/ClientAllergyInformationDetail.html', 'ClientAllergyInformationDetailController', { clientAllergyInformationDetailParam: { ClientAllergyInformationDetail: CAIDList } });
            }
            /*
                Created Date:3-12-2016 
                Purpose : Delete ClientAllergyInformationDetail.
            */
            $scope.deleteClientAllergyInformationDetail = function (CAIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientAllergyInformationDetail/DeleteClientAllergyInformationDetail/DeleteClientAllergyInformationDetail.html', 'DeleteClientAllergyInformationDetailController', { clientAllergyInformationDetailParam: { ClientAllergyInformationDetail: CAIDList } });
            }

            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of ClientSocialInformationDetail.
            */
            $scope.getAllClientSocialInformationDetail = function () {

                $scope.tableAllClientSocialInformationDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CSIDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientSocialInformationDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientSocialInformationDetail = true;
                        return ClientSummaryService.getAllClientSocialInformationDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientSocialInformationDetail = false;
                                $scope.getClientSocialInformationDetailList = response.data.rows;
                                $defer.resolve($scope.getClientSocialInformationDetailList);
                            } else {
                                $scope.isLoadingClientSocialInformationDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientSocialInformationDetail();
            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of ClientSocialInformationDetail.
            */
            $rootScope.refreshGetAllClientSocialInformationDetail = function () {
                debugger;
                $scope.tableAllClientSocialInformationDetailParams.reload();
            }

            $scope.addClientSocialInformationDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientSocialInformationDetail/ClientSocialInformationDetail.html', 'ClientSocialInformationDetailController', { clientSocialInformationDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*
                Created Date:3-12-2016 
                Purpose : Edit ClientSocialInformationDetail.
            */
            $scope.editClientSocialInformationDetail = function (CSIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientSocialInformationDetail/ClientSocialInformationDetail.html', 'ClientSocialInformationDetailController', { clientSocialInformationDetailParam: { ClientSocialInformationDetail: CSIDList } });
            }
            /*
                Created Date:3-12-2016 
                Purpose : Delete ClientSocialInformationDetail.
            */
            $scope.deleteClientSocialInformationDetail = function (CSIDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientSocialInformationDetail/DeleteClientSocialInformationDetail/DeleteClientSocialInformationDetail.html', 'DeleteClientSocialInformationDetailController', { clientSocialInformationDetailParam: { ClientSocialInformationDetail: CSIDList } });
            }

            /*
                Created Date:6-12-2016 
                Purpose : Edit ClientSocialInformationDetail.
            */
            $scope.addClientSocialProfileImage = function () {

                $rootScope.commonModalOpen('/App/Section/PopScreen/ImageUploader/ImageUploader.html', 'ImageUploaderController', { imageUploadParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }


            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of ClientVaccineDetail.
            */
            $scope.getAllClientVaccineDetailFun = function () {

                $scope.tableAllClientVaccineDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CVDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientVaccineDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientVaccineDetail = true;
                        return ClientSummaryService.getAllClientVaccineDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("totalRecords", response.data.totalRecords);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientVaccineDetail = false;
                                $scope.getClientVaccineDetailList = response.data.rows;
                                $defer.resolve($scope.getClientVaccineDetailList);
                            } else {
                                $scope.isLoadingClientVaccineDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientVaccineDetailFun();

            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of ClientVaccineDetail.
            */
            $rootScope.refreshGetAllClientVaccineDetail = function () {
                $scope.tableAllClientVaccineDetailParams.reload();
            }

            $scope.addClientVaccineDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVaccineDetail/ClientVaccineDetail.html', 'ClientVaccineDetailController', { clientVaccineDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*
                Created Date:3-12-2016 
                Purpose : Edit ClientVaccineDetail.
            */
            $scope.editClientVaccineDetail = function (CVDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVaccineDetail/ClientVaccineDetail.html', 'ClientVaccineDetailController', { clientVaccineDetailParam: { ClientVaccineDetail: CVDList } });
            }
            /*
                Created Date:3-12-2016 
                Purpose : Delete ClientVaccineDetail.
            */
            $scope.deleteClientVaccineDetail = function (CVDList) {

                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientVaccineDetail/DeleteClientVaccineDetail/DeleteClientVaccineDetail.html', 'DeleteClientVaccineDetailController', { clientVaccineDetailParam: { ClientVaccineDetail: CVDList } });
            }

            /*
                Created Date:3-12-2016 
                Purpose : Add PrescriptionDetail.
            */
            $scope.addPrescriptionDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPrescriptionDetail/ClientPrescriptionDetail.html', 'ClientPrescriptionDetailController', { clientPrescriptionDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of ClientPrescriptionDetail.
            */
            $scope.getAllClientPrescriptionDetailFun = function () {

                $scope.tableAllClientPrescriptionDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CVDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientPrescriptionDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientPrescriptionDetail = true;
                        return ClientSummaryService.getAllClientPrescriptionDetail(inputJson, function (err, response) {
                            if (response.status == 200) {

                                console.log("Rows", response.data.rows);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientPrescriptionDetail = false;
                                $scope.getClientPrescriptionDetailList = response.data.rows;
                                $defer.resolve($scope.getClientPrescriptionDetailList);
                            } else {
                                $scope.isLoadingClientPrescriptionDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientPrescriptionDetailFun();

            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of Client Prescription Detail.
            */
            $rootScope.refreshGetAllClientPrescriptionDetail = function () {
                $scope.tableAllClientPrescriptionDetailParams.reload();
            }

            /*
                Created Date:3-12-2016 
                Purpose : Edit Client Prescription Detail.
            */
            $scope.editClientPrescriptionDetail = function (CPDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPrescriptionDetail/ClientPrescriptionDetail.html', 'ClientPrescriptionDetailController', { clientPrescriptionDetailParam: { ClientPrescriptionDetail: CPDList } });
            }

            /*
                Created Date:3-12-2016 
                Purpose : Delete Client Prescription Detail.
            */
            $scope.deleteClientPrescriptionDetail = function (CPDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPrescriptionDetail/DeleteClientPrescriptionDetail/DeleteClientPrescriptionDetail.html', 'DeleteClientPrescriptionDetailController', { clientPrescriptionDetailParam: { ClientPrescriptionDetail: CPDList } });
            }


            /*
                Created Date:3-12-2016 
                Purpose : Add client Progress Note.
            */
            $scope.addClientProgressNote = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientProgressNote/ClientProgressNote.html', 'ClientProgressNoteController', { clientProgressNoteParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of Client Progress Note.
            */
            $scope.getAllClientProgressNoteFun = function () {

                $scope.tableAllClientProgressNoteParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CVDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientProgressNoteSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientProgressNote = true;
                        return ClientSummaryService.getAllClientProgressNote(inputJson, function (err, response) {
                            if (response.status == 200) {
                                console.log("Rows", response.data.rows);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientProgressNote = false;
                                $scope.getClientProgressNoteList = response.data.rows;
                                $defer.resolve($scope.getClientProgressNoteList);
                            } else {
                                $scope.isLoadingClientProgressNote = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientProgressNoteFun();

            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of Client Progress Note.
            */
            $rootScope.refreshGetAllClientProgressNote = function () {
                $scope.tableAllClientProgressNoteParams.reload();
            }

            /*
                Created Date:3-12-2016 
                Purpose : Edit client Progress Note.
            */
            $scope.editClientProgressNote = function (CPNList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientProgressNote/ClientProgressNote.html', 'ClientProgressNoteController', { clientProgressNoteParam: { ClientProgressNote: CPNList } });
            }
            /*
                Created Date:3-12-2016 
                Purpose : Delete client Progress Note.
            */
            $scope.deleteClientProgressNote = function (CPNList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientProgressNote/DeleteClientProgressNote/DeleteClientProgressNote.html', 'DeleteClientProgressNoteController', { clientProgressNoteParam: { ClientProgressNote: CPNList } });
            }



            /*  
                Created Date: 3-12-2016 
                Purpose : Get list of Client Appointment Detail.
            */
            $scope.getClientAppointmentDetailFun = function () {

                $scope.tableGetClientAppointmentDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        AppID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientAppointmentDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientAppointmentDetail = true;
                        return ClientSummaryService.getClientAppointmentDetail(inputJson, function (err, response) {
                            if (response.status == 200) {
                                console.log("Rows", response.data.rows);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientAppointmentDetail = false;
                                $scope.getClientAppointmentDetailList = response.data.rows;
                                $defer.resolve($scope.getClientAppointmentDetailList);
                            } else {
                                $scope.isLoadingClientAppointmentDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getClientAppointmentDetailFun();
            /*  
                Created Date: 3-12-2016 
                Purpose : Refresh list of Client Appointment Detail.
            */
            $rootScope.refreshGetClientAppointmentDetail = function () {
                $scope.tableGetClientAppointmentDetailParams.reload();
            }

            /*
                Created Date:14-12-2016
                Purpose : Add new appointment
            */
            $scope.addAppointment = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/Appointment/Appointment.html', 'AppointmentController', { appointmentParam: { clientId: $scope.clientRegistrationDetail.CID } });
            }

            /*
                Created Date:14-12-2016
                Purpose : Edit appointment
            */
            $scope.editAppointment = function (CAD) {
                SchedulerService.getAppointmentDetailByID({ APDID: CAD.AppID }, function (err, response) {
                    if (err == null) {
                        if (response.status == 200) {
                            debugger;
                            var appDetail = response.data.appDetail;
                            appDetail.From = "ClientSummary";
                            $rootScope.commonModalOpen('/App/Section/PopScreen/Appointment/Appointment.html', 'AppointmentController', { appointmentParam: { updateAppointment: appDetail } });
                        }
                    }
                    else {
                        $rootScope.commonErrorFunction(err.status);
                    }
                    usSpinnerService.stop('spinner-1');
                })
            }



            /*  
                Created Date: 19-12-2016
                Purpose : Get list of ClientBillingDetail.
            */
            $scope.getAllClientBillingDetailFun = function () {

                $scope.tableGetClientBillingDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CBDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientBillingDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientBillingDetail = true;
                        return ClientSummaryService.getAllClientBillingDetail(inputJson, function (err, response) {
                            if (response.status == 200) {
                                console.log("Rows", response.data.rows);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientBillingDetail = false;
                                $scope.getClientBillingDetailList = response.data.rows;
                                $defer.resolve($scope.getClientBillingDetailList);
                                $scope.calculateTotalBill($scope.getClientBillingDetailList);
                            } else {
                                $scope.isLoadingClientBillingDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientBillingDetailFun();

            /*  
                Created Date: 19-12-2016
                Purpose : Refresh list of ClientBillingDetail.
            */
            $rootScope.refreshClientBillingDetail = function () {
                $scope.tableGetClientBillingDetailParams.reload();
            }

            /*
                Created Date:19-12-2016
                Purpose : Add ClientBillingDetail.
            */
            $scope.addClientBillingDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientBillingDetail/ClientBillingDetail.html', 'ClientBillingDetailController', { clientBillingDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }
            /*
                Created Date:19-12-2016
                Purpose : Edit ClientBillingDetail.
            */
            $scope.editClientBillingDetail = function (CBDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientBillingDetail/ClientBillingDetail.html', 'ClientBillingDetailController', { clientBillingDetailParam: { ClientBillingDetail: CBDList } });
            }
            /*
                Created Date:19-12-2016
                Purpose : Delete ClientBillingDetail.
            */
            $scope.deleteClientBillingDetail = function (CBDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientBillingDetail/DeleteClientBillingDetail/DeleteClientBillingDetail.html', 'DeleteClientBillingDetailController', { clientBillingDetailParam: { ClientBillingDetail: CBDList } });
            }


            /*
                Created Date:19-12-2016
                Purpose : Add PayementDetail.
            */
            $scope.addPayementDetail = function () {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPaymentDetail/ClientPaymentDetail.html', 'ClientPaymentDetailController', { clientPaymentDetailParam: { ClientID: $scope.clientRegistrationDetail.CID } });
            }

            /*  
                Created Date: 20-12-2016
                Purpose : Get list of ClientPaymentDetail.
            */
            $scope.getAllClientPaymentDetailFun = function () {

                $scope.tableGetClientPayementDetailParams = new NgTableParams({
                    page: 1,
                    count: 5,
                    //count: 10,
                    sorting: {
                        CPDID: "desc"
                    }

                }, {
                    counts: [],
                    getData: function ($defer, params) {
                        var inputJson = {};
                        var GridFilter = {};
                        GridFilter.page = params.page();
                        GridFilter.limit = params.count();
                        GridFilter.orderby = params.orderBy();
                        inputJson.GridFilter = GridFilter;
                        // Search filter
                        var search = {};
                        search.ClientID = $stateParams.cID;
                        inputJson.ClientPaymentDetailSearch = search;
                        console.log("inputJson", inputJson);
                        $scope.isLoadingClientPayementDetail = true;
                        return ClientSummaryService.getAllClientPaymentDetail(inputJson, function (err, response) {
                            if (response.status == 200) {
                                console.log("Rows", response.data.rows);
                                //setting total number of records in table
                                params.total(response.data.totalRecords);
                                $scope.isLoadingClientPayementDetail = false;
                                $scope.getClientPayementDetailList = response.data.rows;
                                $defer.resolve($scope.getClientPayementDetailList);
                                $scope.calculateTotalPayment($scope.getClientPayementDetailList);
                            } else {
                                $scope.isLoadingClientPayementDetail = false;
                            }
                        });
                    }
                });
            }
            $scope.getAllClientPaymentDetailFun();

            /*  
                Created Date: 20-12-2016
                Purpose : Refresh list of ClientPaymentDetail.
            */
            $rootScope.refreshClientPaymentDetail = function () {
                $scope.tableGetClientPayementDetailParams.reload();
            }
            /*
                Created Date:19-12-2016
                Purpose : Edit ClientPaymentDetail.
            */
            $scope.editClientPaymentDetail = function (CPDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPaymentDetail/ClientPaymentDetail.html', 'ClientPaymentDetailController', { clientPaymentDetailParam: { ClientPaymentDetail: CPDList } });
            }

            /*
                Created Date:19-12-2016
                Purpose : Delete ClientPaymentDetail.
            */
            $scope.deleteClientPaymentDetail = function (CPDList) {
                $rootScope.commonModalOpen('/App/Section/PopScreen/ClientPaymentDetail/DeleteClientPaymentDetail/DeleteClientPaymentDetail.html', 'DeleteClientPaymentDetailController', { clientPaymentDetailParam: { ClientPaymentDetail: CPDList } });
            }
            /*  
                Created Date:20-12-2016
                Purpose : calculate total bill.
            */
            $scope.calculateTotalBill = function (ClientBillingDetailList) {
                $rootScope.totalClientBill = 0;
                angular.forEach(ClientBillingDetailList, function (item) {
                    $rootScope.totalClientBill += item.Amount;
                });
                $rootScope.calculateDuePayment($rootScope.totalClientBill, $rootScope.totalClientPayment);
            }
            /*  
                Created Date:20-12-2016
                Purpose : calculate total Payment.
            */
            $scope.calculateTotalPayment = function (ClientPaymentList) {
                $rootScope.totalClientPayment = 0;
                angular.forEach(ClientPaymentList, function (item) {
                    $rootScope.totalClientPayment += item.Amount;
                });
                $rootScope.calculateDuePayment($rootScope.totalClientBill, $rootScope.totalClientPayment);
            }
            
            
        }]);