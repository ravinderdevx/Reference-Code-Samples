const API_URL = process.env.REACT_APP_API_URL;

const API_ENDPOINTS = {
  LOGIN: "/AuthAPI/UserLogin",
  CHANGEUSERPASSWORD: "/AuthAPI/ChangeUserPassword",
  GETHELPFULLINKS: "/API/GetHelpfulLinks",
  GETRESOURCELIBRARIES: "/API/GetResourceLibraries",
  DOWNLOADRESOURCELIBRARY: "/API/DownloadResourceLibrary",
  GETACCOUNTSUMMARIES: "/API/GetAccountSummaries",
  GETTODAYAGENDAS: "/API/GetTodaysAgendas",
  GETCLIENTTASKS: "/API/GetClientTasks",
  GETNOTIFICATIONS: "/API/GetNotifications",
  GETCLIENTLEAVEWITHSCHEDULES: "/API/GetClientLeaveWithSchedules",
  GETCLIENTRESIDENTFINANCIALACCOUNTDETAILS:
    "/API/GetClientResidentFinancialAccountDetails",
  UPDATECLIENTTASK: "/API/UpdateClientTask",
  UPDATEACKNOWLEDGES: "/API/UpdateAcknowledges",
  GETGLOBALCODES: "/API/GetGlobalCodes",
  GETVEHICLEDETAILS: "/API/GetVehicleDetails",
  GETDRIVERDETAILS: "/API/GetDriverDetails",
  GETCLIENTRESIDENTFINANCIALACCOUNTS:
    "/API/GetClientResidentFinancialAccounts",
  GETAGENDAFORDATERANGE: "/API/GetAgendaForDateRange",
  GETAUDITDETAILS: "/API/GetAuditDetails",
  VALIDATEAGENDA: "/API/ValidateAgenda",
  GETALLOWABLELEAVES: "/API/GetAllowableLeaveDetails",
  GETDESTINATIONS: "/API/GetDestinations",
  GETLEAVEVALIDATIONCRITERIA: "/API/GetLeaveValidationCriteria",
  GETSCHEDULEPHASERESTRICTIONCRITERIAS:
    "/API/GetSchedulePhaseRestictionCriterias",
  GETVALIDATIONCOPYAGENDA: "/API/ValidateCopyAgenda",
  GETCLIENTMEETINGDETAIL: "/API/GetClientMeetingsDetail",
  GETTREATMENTGROUPDETAIL: "/API/GetTreatmentGroupDetail",
  POSTINSERTMODIFYAGENDA: "/API/InsertModifyAgenda",
  GETSTAFFLOGIN: "/AuthAPI/StaffLogin",
  GETFACEID: "/API/GetFaceId",
  GETCLIENTLOCATIONDETAILS: "/API/GetclientLocationDetails",
  VALIDATEANDINSERTLOCATIONDETAILS: "/API/ValidateAndInsertLocationDetails",
  INSERTCLIENTIMAGE: "/API/InsertClientImage",
  GETKIOSKANNOUNCEMENTS: "/API/GetAnnouncementDetails",
};

export const getApiUrl = (key) => {
  return API_URL + API_ENDPOINTS[key];
};
export const APP_URLS = {
  API_URL,
};
export const source = window.location.hostname;
export const TIMEOUT_IN_MINUTES = process.env.REACT_APP_TIMEOUT_IN_MINUTES;
export const TIMEOUT_IN_DAYS = process.env.REACT_APP_TIMEOUT_IN_DAYS;
export const NOTIFICATION_INTERVAL_IN_SECONDS =
  process.env.REACT_APP_NOTIFICATION_INTERVAL_IN_SECONDS;
export const GOOGLE_ANALYTICS_TRACKINGID =
  process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKINGID;
