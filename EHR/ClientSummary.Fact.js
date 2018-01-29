/// <reference path="../../../Assets/Liberary/angular-1.5.8/angular.min.js" />
'use strict';
angular.module('DoctorApp')
                .factory('ClientSummaryService', ['$http', 'communicationService', function ($http, communicationService) {
                    var service = {};
                    // Start Register Client
                    service.getClientDetailByClientID = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.clientDetailByClientIDUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateRegisterClient = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateRegisterClientUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Register Client


                    // Start Emergency Contact Service
                    service.saveEmergencyContact = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveEmergencyContactUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.isEmergencyContactExistWithSameEmail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.IsEmergencyContactExistWithSameEmailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getAllEmergencyContact = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllEmergencyContactUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateEmergencyContact = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateEmergencyContactUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    
                    service.deleteEmergencyContact = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteEmergencyContactUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Emergency Contact Service

                    // Start DropDownList
                    service.getDropDownListForRelation = function (callback) {
                        
                        communicationService.resultViaGet(webservices.GetAllRelationShipUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getCountriesDropDownList = function (callback) {
                        
                        communicationService.resultViaGet(webservices.GetAllCountriesUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };
                    
                    service.getAllStatesBaseOnCountryID = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllStatesBaseOnCountryIDUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    
                    service.getAllCityBaseOnStateID = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllCityBaseOnStateIDUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getAllBloodGroup = function (callback) {
                        
                        communicationService.resultViaGet(webservices.GetAllBloodGroupUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getAllUserDetail = function (callback) {

                        communicationService.resultViaGet(webservices.GetAllUserDetailUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getAllPaymentType = function (callback) {

                        communicationService.resultViaGet(webservices.GetAllPaymentTypeUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };
                    
                    // EOF DropDownList

                    // Start ClientContact
                    service.saveClientContact = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientContactUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getClientContactDetial = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetClientContactDetialUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF ClientContact
                    
                    // Start ClientPersonalDetail
                    service.saveClientPersonalDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientPersonalDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getClientPersonalDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetClientPersonalDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF ClientPersonalDetail

                    // Start Client Insurance Detail
                    service.getAllClientInsuranceDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllClientInsuranceDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientInsuranceDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientInsuranceDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientInsuranceDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateClientInsuranceDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientInsuranceDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteClientInsuranceDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.isClientInsuranceDetailExistWithSameCardNumber = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.IsClientInsuranceDetailExistWithSameCardNumberUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    
                    // EOF Client Insurance Detail Service


                    // Start Client Family Health Detail
                    service.getAllClientFamilyHealthDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllClientFamilyHealthDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientFamilyHealthDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientFamilyHealthDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientFamilyHealthDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateClientFamilyHealthDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientFamilyHealthDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteClientFamilyHealthDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Family Health Detail

                    // Start Client Vitalsign Detail
                    service.getAllClientVitalSignDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllClientVitalSignDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientVitalSignDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientVitalSignDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientVitalSignDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateClientVitalSignDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientVitalSignDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteClientVitalSignDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Vitalsign Detail

                    // Start Client AllergyInformation Detail
                    service.GetAllClientAllergyInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllClientAllergyInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientAllergyInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientAllergyInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientAllergyInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateClientAllergyInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientAllergyInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteClientAllergyInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Allergy Information Detail

                    // Start Client Social Information Detail
                    service.getAllClientSocialInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.GetAllClientSocialInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientSocialInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.SaveClientSocialInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientSocialInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.UpdateClientSocialInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientSocialInformationDetail = function (postData, callback) {
                        
                        communicationService.resultViaPost(webservices.DeleteClientSocialInformationDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Social Information Detail


                    // File
                    service.saveClientProfileImage = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientProfileImageUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.getClientProfileImage = function (postData, callback) {

                        communicationService.resultViaPost(webservices.GetClientProfileImageUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF File Section

                    // Start Client Vaccine Detail
                    service.getAllClientVaccineDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.GetAllClientVaccineDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientVaccineDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientVaccineDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientVaccineDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.UpdateClientVaccineDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientVaccineDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.DeleteClientVaccineDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Vaccine Detail


                    // Start Client Prescription Detail
                    service.getAllClientPrescriptionDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.GetAllClientPrescriptionDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.saveClientPrescriptionDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientPrescriptionDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientPrescriptionDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.UpdateClientPrescriptionDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientPrescriptionDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.DeleteClientPrescriptionDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getAllDrugList = function (callback) {

                        communicationService.resultViaGet(webservices.GetAllDrugListUrl, headerConstants.json, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF Client Prescription Detail


                    // ClientProgressNote
                    service.saveClientProgressNote = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientProgressNoteUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientProgressNote = function (postData, callback) {

                        communicationService.resultViaPost(webservices.UpdateClientProgressNoteUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientProgressNote = function (postData, callback) {

                        communicationService.resultViaPost(webservices.DeleteClientProgressNoteUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getAllClientProgressNote = function (postData, callback) {
                        communicationService.resultViaPost(webservices.GetAllClientProgressNoteUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF ClientProgressNote

                    // ClientAppointmentDetail
                    service.getClientAppointmentDetail = function (postData, callback) {
                        communicationService.resultViaPost(webservices.GetClientAppointmentDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF ClientAppointmentDetail

                    // ClientBillingDetail
                    service.saveClientBillingDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientBillingDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientBillingDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.UpdateClientBillingDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientBillingDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.DeleteClientBillingDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getAllClientBillingDetail = function (postData, callback) {
                        communicationService.resultViaPost(webservices.GetAllClientBillingDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF ClientBillingDetail

                    
                    //  ClientPaymentDetail
                    service.saveClientPaymentDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.SaveClientPaymentDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.updateClientPaymentDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.UpdateClientPaymentDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    service.deleteClientPaymentDetail = function (postData, callback) {

                        communicationService.resultViaPost(webservices.DeleteClientPaymentDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };

                    service.getAllClientPaymentDetail = function (postData, callback) {
                        communicationService.resultViaPost(webservices.GetAllClientPaymentDetailUrl, headerConstants.json, postData, function (err, response) {
                            callback(err, response);
                        });
                    };
                    // EOF  ClientPaymentDetail

                    return service;

                }]);