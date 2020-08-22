/*
 * @createdby : Saddam 
 * @createdDate: 4-11-2016
*/

//var baseUrl = "https://172.24.0.210:8000";
var baseUrl = "http://localhost:39157";
var webservices = {
    "clientDetailByClientIDUrl": baseUrl + "/api/ClientSummaryAPI/clientDetailByClientID",
    // Account
    "registerUrl": baseUrl + "/api/AccountAPI/Register",
    "testUrl": baseUrl + "/api/AccountAPI/test",
    "loginUrl": baseUrl + "/api/AccountAPI/Login",
    "UploadAttachementUrl": baseUrl + "/api/ReceptionistAPI/UploadAttachement",
    "LogOutUrl": baseUrl + "/api/AccountAPI/LogOut",
    "ChangePasswordUrl": baseUrl + "/api/AccountAPI/ChangePassword",
    "ForgetPasswordUrl": baseUrl + "/api/AccountAPI/ForgetPassword",
    "ForgetPwdEmailSendUrl": baseUrl + "/api/AccountAPI/ForgetPwdEmailSend",

    // DashBoard
    "GetAllTodayRegisterClientUrl": baseUrl + "/api/DoctorAPI/GetAllTodayRegisterClient",
    "GetAllRegisteredClientUrl": baseUrl + "/api/DoctorAPI/GetAllRegisteredClient",
    "GetAllTodayAppointmentsUrl": baseUrl + "/api/DoctorAPI/GetAllTodayAppointments",
    "GetDashBoardInitialRecordListUrl": baseUrl + "/api/DoctorAPI/GetDashBoardInitialRecordList",
    "GetFutureAppointmentUrl": baseUrl + "/api/DoctorAPI/GetFutureAppointment",
    "GetPastWeekTotalClientAddedUrl": baseUrl + "/api/DoctorAPI/GetPastWeekTotalClientAdded",
    "GetPastWeekReceiptDetailUrl": baseUrl + "/api/DoctorAPI/GetPastWeekReceiptDetail",
    "GetLoggedInUserNameUrl": baseUrl + "/api/DoctorAPI/GetLoggedInUserName",
    "GetReceiptMonthReportUrl": baseUrl + "/api/DoctorAPI/GetReceiptMonthReport",

    // Appointment
    "GetDropDownListForSchedulerUrl": baseUrl + "/api/SchedulerAPI/GetDropDownListForScheduler",
    "GetAllEventUrl": baseUrl + "/api/SchedulerAPI/GetAllEvent",
    "GetAppointmentDetailByIDUrl": baseUrl + "/api/SchedulerAPI/GetAppointmentDetailByID",
    "GetAppointmentStatusListUrl": baseUrl + "/api/SchedulerAPI/GetAppointmentStatusList",
    "SaveAppointmentUrl": baseUrl + "/api/SchedulerAPI/SaveAppointment",
    "UpdateAppointmentDetailUrl": baseUrl + "/api/SchedulerAPI/UpdateAppointmentDetail",
    "UpdateAppointmentDatetimeUrl": baseUrl + "/api/SchedulerAPI/UpdateAppointmentDatetime",
    "ChangeAppointmentStatusUrl": baseUrl + "/api/SchedulerAPI/ChangeAppointmentStatus",
    "GetClientAppointmentDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetClientAppointmentDetail",


    // Register client
    "RegisterClientUrl": baseUrl + "/api/DoctorAPI/RegisterClient",
    "UpdateRegisterClientUrl": baseUrl + "/api/ClientSummaryAPI/UpdateRegisterClient",
    "IsClientExistWithSameEmailUrl": baseUrl + "/api/DoctorAPI/IsClientExistWithSameEmail",
    "IsClientExistWithSameSSNUrl": baseUrl + "/api/DoctorAPI/IsClientExistWithSameSSN",


    // DropDown
    "GetAllCountriesUrl": baseUrl + "/api/ClientSummaryAPI/GetAllCountries",
    "GetAllStatesBaseOnCountryIDUrl": baseUrl + "/api/ClientSummaryAPI/GetAllStatesBaseOnCountryID",
    "GetAllCityBaseOnStateIDUrl": baseUrl + "/api/ClientSummaryAPI/GetAllCityBaseOnStateID",
    "GetAllBloodGroupUrl": baseUrl + "/api/ClientSummaryAPI/GetAllBloodGroup",
    "GetAllRelationShipUrl": baseUrl + "/api/ClientSummaryAPI/GetAllRelationShip",
    "GetAllUserDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllUserDetail",
    "GetAllPaymentTypeUrl": baseUrl + "/api/ClientSummaryAPI/GetAllPaymentType",
    

    // Emergnecy Contact 
    "SaveEmergencyContactUrl": baseUrl + "/api/ClientSummaryAPI/SaveEmergencyContact",
    "IsEmergencyContactExistWithSameEmailUrl": baseUrl + "/api/ClientSummaryAPI/IsEmergencyContactExistWithSameEmail",
    "GetAllEmergencyContactUrl": baseUrl + "/api/ClientSummaryAPI/GetAllEmergencyContact",
    "UpdateEmergencyContactUrl": baseUrl + "/api/ClientSummaryAPI/UpdateEmergencyContact",
    "DeleteEmergencyContactUrl": baseUrl + "/api/ClientSummaryAPI/DeleteEmergencyContact",

    // Contact Detail 
    "SaveClientContactUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientContact",
    "GetClientContactDetialUrl": baseUrl + "/api/ClientSummaryAPI/GetClientContactDetial",

    // Personal Detail 
    "SaveClientPersonalDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientPersonalDetail",
    "GetClientPersonalDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetClientPersonalDetail",

    // File upload and save
    "UploadClientProfileImageUrl": baseUrl + "/api/ClientSummaryAPI/UploadClientProfileImage",
    "SaveClientProfileImageUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientProfileImage",
    "GetClientProfileImageUrl": baseUrl + "/api/ClientSummaryAPI/GetClientProfileImage",

    // Insurance Detail
    "GetAllClientInsuranceDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientInsuranceDetail",
    "SaveClientInsuranceDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientInsuranceDetail",
    "UpdateClientInsuranceDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientInsuranceDetail",
    "DeleteClientInsuranceDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientInsuranceDetail",
    "IsClientInsuranceDetailExistWithSameCardNumberUrl": baseUrl + "/api/ClientSummaryAPI/IsClientInsuranceDetailExistWithSameCardNumber",

    // Family Health Detail
    "GetAllClientFamilyHealthDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientFamilyHealthDetail",
    "SaveClientFamilyHealthDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientFamilyHealthDetail",
    "UpdateClientFamilyHealthDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientFamilyHealthDetail",
    "DeleteClientFamilyHealthDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientFamilyHealthDetail",

    // Client Vitalsign Detail
    "GetAllClientVitalSignDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientVitalSignDetail",
    "SaveClientVitalSignDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientVitalSignDetail",
    "UpdateClientVitalSignDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientVitalSignDetail",
    "DeleteClientVitalSignDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientVitalSignDetail",

    // Allergy Information Detail
    "GetAllClientAllergyInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientAllergyInformationDetail",
    "SaveClientAllergyInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientAllergyInformationDetail",
    "UpdateClientAllergyInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientAllergyInformationDetail",
    "DeleteClientAllergyInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientAllergyInformationDetail",

    // Client Social Information Detail
    "GetAllClientSocialInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientSocialInformationDetail",
    "SaveClientSocialInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientSocialInformationDetail",
    "UpdateClientSocialInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientSocialInformationDetail",
    "DeleteClientSocialInformationDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientSocialInformationDetail",

    // ClientVaccineDetail
    "GetAllClientVaccineDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientVaccineDetail",
    "SaveClientVaccineDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientVaccineDetail",
    "UpdateClientVaccineDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientVaccineDetail",
    "DeleteClientVaccineDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientVaccineDetail",

    // ClientPrescription
    "GetAllDrugListUrl": baseUrl + "/api/ClientSummaryAPI/GetAllDrugList",
    "SaveClientPrescriptionDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientPrescriptionDetail",
    "UpdateClientPrescriptionDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientPrescriptionDetail",
    "DeleteClientPrescriptionDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientPrescriptionDetail",
    "GetAllClientPrescriptionDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientPrescriptionDetail",

    // ClientProgressNote
    "SaveClientProgressNoteUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientProgressNote",
    "UpdateClientProgressNoteUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientProgressNote",
    "DeleteClientProgressNoteUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientProgressNote",
    "GetAllClientProgressNoteUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientProgressNote",

    // ClientBillingDetail
    "SaveClientBillingDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientBillingDetail",
    "UpdateClientBillingDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientBillingDetail",
    "DeleteClientBillingDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientBillingDetail",
    "GetAllClientBillingDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientBillingDetail",

    // ClientPaymentDetail
    "SaveClientPaymentDetailUrl": baseUrl + "/api/ClientSummaryAPI/SaveClientPaymentDetail",
    "UpdateClientPaymentDetailUrl": baseUrl + "/api/ClientSummaryAPI/UpdateClientPaymentDetail",
    "DeleteClientPaymentDetailUrl": baseUrl + "/api/ClientSummaryAPI/DeleteClientPaymentDetail",
    "GetAllClientPaymentDetailUrl": baseUrl + "/api/ClientSummaryAPI/GetAllClientPaymentDetail",

    // MenuList
    "GetMenuListUrl": baseUrl + "/api/AccountAPI/GetMenuList",

    "GetDoctorClientMenuListUrl": baseUrl + "/api/AccountAPI/GetDoctorClientMenuList",

    //LogList
    "GetAllAuditLogDetailBySpecificDoctorUrl": baseUrl + "/api/DoctorAPI/GetAllAuditLogDetailBySpecificDoctor",

    //GetClientBillingDetail
    "GetClientBillingDetailUrl": baseUrl + "/api/DoctorAPI/GetClientBillingDetail",

    //GetDoctorContactsDetail
    "GetDoctorContactsDetailUrl": baseUrl + "/api/DoctorAPI/GetDoctorContactsDetail",

    //GetDoctorContactsDetail
    "GetMessagesUrl": baseUrl + "/api/DoctorAPI/GetMessages",

    //GetUserProfileDetail
    "GetUserProfileDetailUrl": baseUrl + "/api/DoctorAPI/GetUserProfileDetail",

    "GetAllClientBasicDetailUrl": baseUrl + "/api/DoctorAPI/GetAllClientBasicDetail",

    // DoctorClient
    "GetClientProfileDataUrl": baseUrl + "/api/DoctorAPI/GetClientProfileData",
    "UpdateClientProfileDataUrl": baseUrl + "/api/DoctorAPI/UpdateClientProfileData"
    


};

var headerConstants = {
    "json": "application/json"
};

var AuthSetting = {
    "DoctorIndexUrl": baseUrl + "/App/Section/Doctor/DoctorIndex.html",
    "LoginUrl": baseUrl + "/App/Section/Account/LoginIndex.html"
};
