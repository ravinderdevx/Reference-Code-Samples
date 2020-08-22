using Core.SYS_Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CoreInterfaces;
using Core.DataContracts.Responses;
using Core.DataContracts.Requests;
using Core.DatabaseOps;
using Core.SYS_Enums;
using Core.Configuration;
using Core.SYS_Objects;
using Core.SYS_Interfaces;
using NodaTime;
using NodaTime.Text;
using DotNetClassExtensions;
using System.IO;

namespace SCImplementations
{
    public class SC_Org_Appointments : ISC_Org_Appointments
    {
        public IDCR_Added Create_Org_Appointment(IDcCreateAppointment request_obj, IUtils utils, IValidation validation, ICalendarTimeRange ICalendarTimeRange, IDcCalendarTimeRange IDcCalendarTimeRange, IDcOrgResourceId IDcOrgResourceId, IDCResourceTimeRange IDCResourceTimeRange, IResourceTimeRange IResourceTimeRange, IDcResourceTSO IDcResourceTSO, IDcCalendarTSO IDcCalendarTSO, ITsoResourceId ITsoResourceId, IOrgTsoCalendarId IOrgTsoCalendarId, IDcCalendarsTSOs IDcCalendarsTSOs, IListOfOrgTsoCalendarIds IListOfOrgTsoCalendarIds, IDcTso IDcTso, IDcMapResourceAppointment IDcMapResourceAppointment, IDcMapCalendarAppointment IDcMapCalendarAppointment, IDcCreateRepeat IDcCreateRepeat, IDcMapRepeatAppointment IDcMapRepeatAppointment, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, IDcTsoId IDcTsoId, IDcTsos IDcTsos, IDcOrgId IDcOrgId, IDcCalendarId IDcCalendarId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Added resp = new DCR_Added();
            //string vem = String.Empty;
            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Create_Org_Appointment), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcCreateAppointment)))
            {
                //if (!Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointment)) { resp.SetResponsePermissionDenied(); resp.Result = ENUM_Cmd_Add_Result.Not_Added; return resp; }
                if (!validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointment))
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                if (request_obj.resourceIdList.Count == 0 && request_obj.calendarIdList.Count == 0)
                {
                    resp.SetResponseInvalidParameter();
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                //check to see if we can add the appointment if we cant add that no point checking anything else
                #region validation routines
                DateTimeZone appointmentTimeZone = DateTimeZoneProviders.Tzdb[request_obj.timeZoneIANA];
                Instant startInstant = Instant.FromDateTimeUtc(DateTime.Parse(request_obj.start).ToUniversalTime());
                ZonedDateTime start = new ZonedDateTime(startInstant, appointmentTimeZone);
                Instant endInstant = Instant.FromDateTimeUtc(DateTime.Parse(request_obj.end).ToUniversalTime());
                ZonedDateTime end = new ZonedDateTime(endInstant, appointmentTimeZone);
                BaseInstantStartStop tre = new BaseInstantStartStop();
                tre.start = InstantPattern.ExtendedIsoPattern.Parse(request_obj.start).Value;
                tre.stop = InstantPattern.ExtendedIsoPattern.Parse(request_obj.end).Value;

                Instant futureMaxRange = Instant.FromDateTimeUtc(DateTime.Parse(request_obj.end).ToUniversalTime());

                //foreach (BaseRepeatOptions repeatRule in request_obj.repeatRuleOptions)
                foreach (IRepeatOptions repeatRule in request_obj.repeatRuleOptions)
                {
                    Instant repeatRuleEndInstant = InstantPattern.ExtendedIsoPattern.Parse(repeatRule.end).Value;// Instant.FromDateTimeUtc(DateTime.Parse(repeatRule.end).ToUniversalTime());
                    if (futureMaxRange < repeatRuleEndInstant)
                    {
                        futureMaxRange = repeatRuleEndInstant;
                    }
                }

                #region check that the request doesnt have calendars and resource id's specified
                if (request_obj.resourceIdList.Count > 0 && request_obj.calendarIdList.Count > 0)
                {
                    //this is invalid
                    resp.SetResponseInvalidParameter();
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                #endregion

                #region generate all the new time scale objs
                //List<BaseInstantStartStop> completeNewBaseInstantList = new List<BaseInstantStartStop>();
                List<IInstantStartStop> completeNewBaseInstantList = new List<IInstantStartStop>();
                completeNewBaseInstantList.Add(tre);
                //check to see if there are any repeat rules
                //List<BaseInstantStartStop> listOfRepeatRuleTimePeriods = new List<BaseInstantStartStop>();
                List<IInstantStartStop> listOfRepeatRuleTimePeriods = new List<IInstantStartStop>();
                for (int i = 0; i < request_obj.repeatRuleOptions.Count; i++)
                {
                    //if there are repeat rules then generate the repeated time periods
                    BaseStartStop trange = new BaseStartStop();
                    trange.start = request_obj.start;
                    trange.end = request_obj.end;
                    //DCR_Org_TimePeriod_List fullTsoList = Utils.GenerateRepeatTimePeriods(request_obj.coreProj, trange, request_obj.repeatRuleOptions[i], request_obj.timeZoneIANA, true);
                    List<IInstantStartStop> fullTsoList = utils.GenerateRepeatTimePeriods(request_obj.coreProj, coreSc, trange, request_obj.repeatRuleOptions[i], request_obj.timeZoneIANA, true, coreDb);
                    //if (fullTsoList.func_status != ENUM_Cmd_Status.ok)
                    //{
                    //    resp.StatusAndMessage_CopyFrom(fullTsoList);
                    //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    //    return resp;
                    //}
                    //listOfRepeatRuleTimePeriods.AddRange(fullTsoList.TimePeriods);
                    //completeNewBaseInstantList.AddRange(fullTsoList.TimePeriods);
                    listOfRepeatRuleTimePeriods.AddRange(fullTsoList);
                    completeNewBaseInstantList.AddRange(fullTsoList);
                }
                #endregion
                #region read all the calendars linked to the appointment
                //Dictionary<int, List<BaseTSo>> currentCalendarTso = new Dictionary<int, List<BaseTSo>>();
                //Dictionary<int, BaseOrgCalendar> calendarDetailList = new Dictionary<int, BaseOrgCalendar>();

                Dictionary<int, List<ITSO>> currentCalendarTso = new Dictionary<int, List<ITSO>>();
                Dictionary<int, ICalendar> calendarDetailList = new Dictionary<int, ICalendar>();
                //this is a complex structure it consists of the caledar id, then a list of the resource ids which also contain the time periods as well
                //Dictionary<int, Dictionary<int, List<BaseTSo>>> calendarResourceTSOMaps = new Dictionary<int, Dictionary<int, List<BaseTSo>>>();
                //List<BaseTSo> completeAlreadyAllocatedTimes = new List<BaseTSo>();
                //List<BaseTSo> TSOsWhichCanConflict = new List<BaseTSo>();

                Dictionary<int, Dictionary<int, List<ITSO>>> calendarResourceTSOMaps = new Dictionary<int, Dictionary<int, List<ITSO>>>();
                List<ITSO> completeAlreadyAllocatedTimes = new List<ITSO>();
                List<ITSO> TSOsWhichCanConflict = new List<ITSO>();


                foreach (int calendarId in request_obj.calendarIdList)
                {
                    #region read the calendar details
                    DC_Org_Calendar_ID dcCalendarId = new DC_Org_Calendar_ID(request_obj.coreProj);
                    dcCalendarId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    dcCalendarId.orgId = request_obj.orgId;
                    dcCalendarId.calendarId = calendarId;

                    IDcrCalendar calendarData = coreSc.Read_Org_Calendar_By_Calendar_ID(IDcCalendarId, validation, utils, IDcCalendarId, IDcCalendarId, coreSc, coreDb);

                    if (calendarData.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.StatusAndMessage_CopyFrom(calendarData);
                        return resp;
                    }
                    BaseOrgCalendar calendarDetails = new BaseOrgCalendar(calendarData);
                    calendarDetailList.Add(calendarData.calendarId, calendarDetails);
                    #endregion
                    #region get the calendar tsos
                    DC_Org_Calendar_Time_Range calendarIdRequest = new DC_Org_Calendar_Time_Range(request_obj.coreProj);
                    calendarIdRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    calendarIdRequest.orgId = request_obj.orgId;
                    calendarIdRequest.calendarId = calendarId;
                    calendarIdRequest.start = request_obj.start;
                    calendarIdRequest.end = futureMaxRange.ToDateTimeUtc().ISO8601Str();

                    IDcrTsoList calendarTSos = coreSc.Read_TimePeriods_For_Calendar_Between_DateTime(IDcCalendarTimeRange, utils, ICalendarTimeRange, validation, coreSc,coreDb);

                    if (calendarTSos.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.StatusAndMessage_CopyFrom(calendarTSos);
                        return resp;
                    }
                    currentCalendarTso.Add(calendarId, calendarTSos.timeScaleList);
                    //currentCalendarTso.Add(calendarId, calendarTSos.timeScaleList);
                    #endregion
                    #region store the calendartsos into the main already allocated list of tsos
                    completeAlreadyAllocatedTimes.AddRange(calendarTSos.timeScaleList);
                    TSOsWhichCanConflict.AddRange(calendarTSos.timeScaleList);
                    #endregion
                    #region find the resources linked to the current looped calendar and get all of there tso's into lists

                    IDcrIdList calendarResMaps = coreSc.Read_All_Org_Calendar_Resource_Mappings_By_Calendar_ID(IDcCalendarId, validation, utils, coreSc, coreDb);

                    if (calendarResMaps.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.StatusAndMessage_CopyFrom(calendarResMaps);
                        return resp;
                    }
                    foreach (int resourceId in calendarResMaps.ListOfIDs)
                    {
                        DC_Org_Resource_ID resourceIdObj = new DC_Org_Resource_ID(request_obj.coreProj);
                        resourceIdObj.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resourceIdObj.orgId = request_obj.orgId;
                        resourceIdObj.resourceId = resourceId;
                        //DCR_Org_Resource resourceDetails = SC_Org_Resources.Read_Resource_By_ID(resourceIdObj);
                        IDcrResource resourceDetails = coreSc.Read_Resource_By_ID(IDcOrgResourceId, utils, validation, coreSc,coreDb);
                        if (resourceDetails.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(resourceDetails);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }

                        DC_Org_Resource_Time_Range resourceTimeRange = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                        resourceTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resourceTimeRange.orgId = request_obj.orgId;
                        resourceTimeRange.resourceId = resourceId;
                        resourceTimeRange.start = request_obj.start;
                        resourceTimeRange.end = futureMaxRange.ToDateTimeUtc().ISO8601Str();

                        //IDcrTsoList resourceTSOs = ISCTSO.Read_TimePeriods_For_Resource_Between_DateTime(IDCResourceTimeRange,dbs,dbo,utils,IResourceTimeRange,validation, IDatabaseOperationsTSO, dbValid);
                        IDcrTsoList resourceTSOs = coreSc.Read_TimePeriods_For_Resource_Between_DateTime(IDCResourceTimeRange, utils, IResourceTimeRange, validation, coreSc,coreDb);
                        if (resourceTSOs.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(resourceTSOs);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }
                        //Dictionary<int, List<BaseTSo>> resTsoDic = new Dictionary<int, List<BaseTSo>>();
                        Dictionary<int, List<ITSO>> resTsoDic = new Dictionary<int, List<ITSO>>();
                        resTsoDic.Add(resourceId, resourceTSOs.timeScaleList);
                        calendarResourceTSOMaps.Add(calendarId, resTsoDic);
                        #region store the calendar resource tsos into the main allocated tso list
                        completeAlreadyAllocatedTimes.AddRange(resourceTSOs.timeScaleList);
                        if (resourceDetails.allowsOverlaps != Enum_SYS_BookingOverlap.OverLappingAllowed)
                        {
                            TSOsWhichCanConflict.AddRange(resourceTSOs.timeScaleList);
                        }
                        #endregion
                    }
                    #endregion
                }
                #endregion

                #region read all the resources and current resource time periods
                //loop all the resources and collect the current time periods and resource data
                //Dictionary<int, List<BaseTSo>> currentResourceTso = new Dictionary<int, List<BaseTSo>>();
                //Dictionary<int, BaseOrgResource> resourceDetailList = new Dictionary<int, BaseOrgResource>();
                Dictionary<int, List<ITSO>> currentResourceTso = new Dictionary<int, List<ITSO>>();
                Dictionary<int, BaseOrgResource> resourceDetailList = new Dictionary<int, BaseOrgResource>();
                foreach (int resourceId in request_obj.resourceIdList)
                {
                    DC_Org_Resource_ID dcResourceId = new DC_Org_Resource_ID(request_obj.coreProj);
                    dcResourceId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    dcResourceId.orgId = request_obj.orgId;
                    dcResourceId.resourceId = resourceId;
                    //DCR_Org_Resource resourceData = SC_Org_Resources.Read_Resource_By_ID(dcResourceId);
                    IDcrResource resourceData = coreSc.Read_Resource_By_ID(IDcOrgResourceId, utils, validation, coreSc,coreDb);
                    if (resourceData.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.StatusAndMessage_CopyFrom(resourceData);
                        return resp;
                    }
                    BaseOrgResource resourceDetails = new BaseOrgResource(resourceData);
                    resourceDetailList.Add(resourceData.resourceId, resourceDetails);
                    DC_Org_Resource_Time_Range resourceIdRequest = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                    resourceIdRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    resourceIdRequest.orgId = request_obj.orgId;
                    resourceIdRequest.resourceId = resourceId;
                    resourceIdRequest.start = request_obj.start;
                    resourceIdRequest.end = futureMaxRange.ToDateTimeUtc().ISO8601Str();


                    IDcrTsoList resourceTSos = coreSc.Read_TimePeriods_For_Resource_Between_DateTime(IDCResourceTimeRange, utils, IResourceTimeRange, validation, coreSc,coreDb);

                    if (resourceTSos.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.StatusAndMessage_CopyFrom(resourceTSos);
                        return resp;
                    }

                    //currentResourceTso.Add(resourceId, resourceTSos.timeScaleList);
                    currentResourceTso.Add(resourceId, resourceTSos.timeScaleList);
                    completeAlreadyAllocatedTimes.AddRange(resourceTSos.timeScaleList);
                    if (resourceData.allowsOverlaps != Enum_SYS_BookingOverlap.OverLappingAllowed)
                    {
                        TSOsWhichCanConflict.AddRange(resourceTSos.timeScaleList);
                    }

                    #region check to see if there are too many appointments for this user on a specific day
                    //DCR_Base checkLimits = Utils.Check_Daily_Max_Not_Exceeded(request_obj.coreProj, resourceTSos.timeScaleList, (int)resourceDetails.maxDailyUserSlots, request_obj.creatorId, -1, completeNewBaseInstantList);
                    IDCR_Base checkLimits = utils.Check_Daily_Max_Not_Exceeded(request_obj.coreProj, coreSc,resourceTSos.timeScaleList, (int)resourceDetails.maxDailyUserSlots, request_obj.creatorId, -1, validation, completeNewBaseInstantList,coreDb);
                    if (checkLimits.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(checkLimits);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion

                }
                #endregion

                #region check for conflicts in the newly generated lists and the old lists
                //List<BaseTSo> conflictList = Utils.GetConflictingTimePeriods(TSOsWhichCanConflict, completeNewBaseInstantList);
                List<ITSO> conflictList = utils.GetConflictingTimePeriods(TSOsWhichCanConflict, completeNewBaseInstantList);
                #endregion
                #region if no conflicts proceed otherwise return 

                if (conflictList.Count != 0)
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                #endregion

                #region check to see if it will be a resource appointment or whether it will be a calendar appointment as it cant be both
                if (request_obj.resourceIdList.Count > 0)
                {
                    //its a resource appointment check there are no calendars currently mapped
                    if (calendarDetailList.Count > 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                }
                else if (request_obj.calendarIdList.Count > 0)
                {
                    //its a calendar appointment check there are no resources currently mapped
                    if (resourceDetailList.Count > 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                }
                else
                {
                    //its not a resource or calendar appointment so will not map it to any so that means we dont need to make any checks
                }
                #endregion



                #endregion
                //if everything is ok and we have made it this far we now need create and generate the timescaleobj entries
                #region firstly generate the appointment
                int out_new_appointment_id;
                //if (DatabaseOperations_Appointments.Create_Appointment(request_obj.coreProj, request_obj, out out_new_appointment_id) != ENUM_DB_Status.DB_SUCCESS)
                if (coreDb.Create_Appointment(request_obj.coreProj, request_obj, out out_new_appointment_id) != ENUM_DB_Status.DB_SUCCESS)
                {
                    resp.SetResponseServerError();
                    resp.NewRecordID = -1;
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                #endregion
                #region generate the time period
                DC_Create_Time_Scale_Obj createTSO = new DC_Create_Time_Scale_Obj(request_obj.coreProj);
                createTSO.appointmentId = out_new_appointment_id;
                createTSO.calendarIdList = new List<int>();
                createTSO.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                createTSO.dateOfGeneration = DateTime.Now.OrijDTStr();
                createTSO.durationMilliseconds = request_obj.durationMilliseconds;
                createTSO.end = request_obj.end;
                createTSO.exceptionId = 0;
                createTSO.orgId = request_obj.orgId;
                createTSO.repeatId = 0;
                createTSO.resourceIdList = new List<int>();
                createTSO.start = request_obj.start;
                //DCR_Added createdTSO = SC_TSO.Create_TimePeriod(createTSO);
                List<ITimeStartEnd> ListITimeStartEnd = new List<ITimeStartEnd>();
                IDCR_Added createdTSO = coreSc.Create_TimePeriod(IDcTso, validation, IDcResourceTSO, IDcCalendarTSO, IDcResourceTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, utils, ListITimeStartEnd, IListOfOrgTsoCalendarIds,
                    coreSc, coreDb);
                if (createdTSO.func_status != ENUM_Cmd_Status.ok)
                {
                    resp.StatusAndMessage_CopyFrom(createdTSO);
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
                #endregion
                #region link the appointment to the resources
                //then generate the map from appointment to resource
                foreach (int resourceId in request_obj.resourceIdList)
                {
                    DC_Org_Resource_Appointment_Id createOrgAppointmentMap = new DC_Org_Resource_Appointment_Id(request_obj.coreProj);
                    createOrgAppointmentMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createOrgAppointmentMap.appointmentId = out_new_appointment_id;
                    createOrgAppointmentMap.orgId = request_obj.orgId;
                    createOrgAppointmentMap.resourceId = resourceId;
                    //DCR_Added addedMap = SC_Org_Appointments.Create_Org_Appointment_Resource_Mapping(createOrgAppointmentMap);
                    IDCR_Added addedMap = coreSc.Create_Org_Appointment_Resource_Mapping(IDcMapResourceAppointment, utils, validation, IDcOrgResourceId, IDcAppointmentId, IDCResourceTimeRange, IResourceTimeRange, IDcOrgId, IDcResourceTSO, ITsoResourceId, coreSc, coreDb);
                    if (addedMap.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(addedMap);
                        resp.NewRecordID = -1;
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                }
                #endregion
                #region link the appointment to the calendar
                foreach (int calendarId in request_obj.calendarIdList)
                {
                    DC_Org_Calendar_Appointment_ID createOrgAppointmentMap = new DC_Org_Calendar_Appointment_ID(request_obj.coreProj);
                    createOrgAppointmentMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createOrgAppointmentMap.appointmentId = out_new_appointment_id;
                    createOrgAppointmentMap.orgId = request_obj.orgId;
                    createOrgAppointmentMap.calendarId = calendarId;
                    //DCR_Added addedMap = SC_Org_Appointments.Create_Org_Appointment_Calendar_Mapping(createOrgAppointmentMap);
                    IDCR_Added addedMap = coreSc.Create_Org_Appointment_Calendar_Mapping(IDcMapCalendarAppointment, utils, validation, IDcAppointmentId, IDcRepeatId, IDCResourceTimeRange, IDcTsoId, IDcCalendarTimeRange, IDcResourceTSO, IDcCalendarTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, IListOfOrgTsoCalendarIds, ICalendarTimeRange,
                        IDcOrgId, coreSc, coreDb);
                    if (addedMap.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(addedMap);
                        resp.NewRecordID = -1;
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                }
                #endregion
                #region create all the repeat objects
                //this creates all the repeat rule objects
                for (int i = 0; i < request_obj.repeatRuleOptions.Count; i++)
                {
                    DC_Create_Org_RepeatRule createRepeatRule = new DC_Create_Org_RepeatRule(request_obj.coreProj);
                    createRepeatRule.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createRepeatRule.creatorId = request_obj.cmd_user_id;
                    createRepeatRule.end = request_obj.repeatRuleOptions[i].end;
                    createRepeatRule.maxOccurances = request_obj.repeatRuleOptions[i].maxOccurances;
                    createRepeatRule.orgId = request_obj.repeatRuleOptions[i].orgId;
                    createRepeatRule.repeatDay = request_obj.repeatRuleOptions[i].repeatDay;
                    createRepeatRule.repeatType = request_obj.repeatRuleOptions[i].repeatType;
                    createRepeatRule.repeatMonth = request_obj.repeatRuleOptions[i].repeatMonth;
                    createRepeatRule.repeatWeek = request_obj.repeatRuleOptions[i].repeatWeek;
                    createRepeatRule.repeatWeekDays = request_obj.repeatRuleOptions[i].repeatWeekDays;
                    createRepeatRule.repeatYear = request_obj.repeatRuleOptions[i].repeatYear;
                    createRepeatRule.start = request_obj.repeatRuleOptions[i].start;
                    createRepeatRule.modifier = request_obj.repeatRuleOptions[i].modifier;

                    //DCR_Added repeatAdded = SC_Org_Repeat.Create_Repeat(createRepeatRule);
                    IDCR_Added repeatAdded = coreSc.Create_Repeat(IDcCreateRepeat, utils, validation, coreSc, coreDb);
                    if (repeatAdded.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(repeatAdded);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #region link the appointment to the repeat object, this should also generate the extra time scale objs
                    DC_Create_Repeat_Appointment_Mapping createAppRepMap = new DC_Create_Repeat_Appointment_Mapping(request_obj.coreProj);
                    createAppRepMap.appointmentId = out_new_appointment_id;
                    createAppRepMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createAppRepMap.creatorId = request_obj.cmd_user_id;
                    createAppRepMap.orgId = request_obj.orgId;
                    createAppRepMap.repeatId = repeatAdded.NewRecordID;
                    //DCR_Added createdAppRepMap = SC_Org_Appointments.Create_Org_Appointment_Repeat_Map(createAppRepMap);
                    IDCR_Added createdAppRepMap = coreSc.Create_Org_Appointment_Repeat_Map(IDcMapRepeatAppointment,
                        utils, validation, IDcAppointmentId, IDcRepeatId, IDCResourceTimeRange, IDcTsoId, IDcCalendarTimeRange,
                        IDcResourceTSO, IDcCalendarTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs,
                        IDcCalendarId, IDcOrgResourceId, IListOfOrgTsoCalendarIds, IDcTso, IDcTsos,
                        coreSc, coreDb);
                    if (createdAppRepMap.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(createdAppRepMap);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                }
                #endregion
                resp.Result = ENUM_Cmd_Add_Result.Added;
                resp.NewRecordID = out_new_appointment_id;
                resp.SetResponseOk();
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
            }
            return resp;
        
    }

        public IDcrInt Read_Appointment_Count_For_User_ID(IDcOrgMemberId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Int resp = new DCR_Int();

            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcOrgMemberId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAppointmentCountByUserId))
                {
                    int appointmentCount;
                    if (coreDb.Read_Appointment_Count_For_User_ID(request_obj.coreProj, request_obj.userId, out appointmentCount) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.numberVal = appointmentCount;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDcrInt Read_Appointment_Count_For_Service_ID(IDcOrgServiceId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Int resp = new DCR_Int();            
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcServiceId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAppointmentCountByServiceId))
                {
                    int appointmentCount;
                    if (coreDb.Read_Appointment_Count_For_Service_ID(request_obj.coreProj, request_obj.serviceId, out appointmentCount) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.numberVal = appointmentCount;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDcrIdList Read_All_Org_Resource_Appointment_Mappings_By_Resource_ID(IDcOrgResourceId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
         
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcOrgResourceId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAllOrgResourceAppointmentMappingsByResourceID))
                {
                    List<int> listOfResourceIds;
             
                    if (coreDb.Read_Resource_Appointment_Mappings(request_obj.coreProj, request_obj, out listOfResourceIds) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = listOfResourceIds;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDcrIdList Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils,  request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAllOrgAppointmentResourceMappingsByAppointmentID))
                {
                    List<int> listOfResourceIds;

                    if (coreDb.Read_Appointment_Resource_Mappings(request_obj.coreProj, request_obj, out listOfResourceIds) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = listOfResourceIds;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }

            return resp;
        }


        public IDcrIdList Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAllOrgAppointmentCalendarMAppingsByAppointmentID))
                {
                    List<int> listOfCalendarIds;
                    if (coreDb.Read_Appointment_Calendar_Mappings(request_obj.coreProj, request_obj, out listOfCalendarIds) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = listOfCalendarIds;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }

            return resp;
        }

        public IDcrIdList Read_All_Org_Appointment_TSoIds_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAllOrgAppointmentTSOIdsByAppointmentID))
                {
                    List<int> tsoIdList;
                    if (coreDb.Read_All_Appointment_TSos(request_obj.coreProj, request_obj.appointmentId, out tsoIdList) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = tsoIdList;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDcrAppointment Read_Appointment_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            IDcrAppointment resp = new DCR_OrgAppointment();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils,  request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb,utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgAppointmentOptionsByAppointmentID))
                {
                    IAppointment appointmentData = new BaseAppointment();

                    if (coreDb.Read_Appointment(request_obj.coreProj, request_obj, appointmentData) == ENUM_DB_Status.DB_SUCCESS)
                    {

                        DC_Org_Appointment_Id exId = new DC_Org_Appointment_Id(request_obj.coreProj);
                        exId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        exId.appointmentId = appointmentData.appointmentId;
                        exId.orgId = request_obj.orgId;
                        resp.creatorId = appointmentData.creatorId;
                        resp.appointmentId = appointmentData.appointmentId;
                        resp.appointmentTitle = appointmentData.appointmentTitle;
                        resp.timeZoneIANA = appointmentData.timeZoneIANA;
                        resp.orgId = request_obj.orgId;
                        resp.durationMilliseconds = appointmentData.durationMilliseconds;
                        resp.appointmentTitle = appointmentData.appointmentTitle;
                        resp.start = appointmentData.start;
                        resp.end = appointmentData.end;
                        resp.timeZoneIANA = appointmentData.timeZoneIANA;
                        resp.appointmentType = appointmentData.appointmentType;
                        //resp.creatorEmail = DatabaseOperations.GetLoginNameFromUserID(request_obj.coreProj, resp.creatorId);
                        //resp.creatorEmail = dbs.GetLoginNameFromUserID(request_obj.coreProj, resp.creatorId);
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDCR_Delete Delete_All_Org_Resource_Appointment_Mappings_By_Resource_ID(IDcOrgResourceId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
           
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcOrgResourceId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteAllOrgResourceAppointmentMappingsByResourceID))
                {
                    if (coreDb.Delete_All_Resource_Appointment_Mappings(request_obj.coreProj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseOk();
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                return resp;
            }
            return resp;
        }

        public IDCR_Delete Delete_All_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, IDcAppointmentRepeatId IDcAppointmentRepeatId, IDcTsoId IDcTsoId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils,  request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteAllOrgAppointmentRepeatMappingsByAppointmentID))
                {
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.orgId = request_obj.orgId;

                    IDcrIdList repeatMappings = coreSc.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(request_obj, utils, validation, coreSc, coreDb);

                    if (repeatMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(repeatMappings);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    foreach (int repeatId in repeatMappings.ListOfIDs)
                    {
                        //we are basically removing the link from the time periods from the appointments
                        DC_Org_Appointment_Repeat_Id appointmentRepeatId = new DC_Org_Appointment_Repeat_Id(request_obj.coreProj);
                        appointmentRepeatId.appointmentId = request_obj.appointmentId;
                        appointmentRepeatId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        appointmentRepeatId.orgId = request_obj.orgId;
                        appointmentRepeatId.repeatId = repeatId;

                        IDcrIdList tsoIds = coreSc.Read_All_Appointment_TSoIds_Filter_By_Repeat_ID(IDcAppointmentRepeatId, utils, validation, coreSc, coreDb);
                        if (tsoIds.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(tsoIds);
                            resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                            return resp;
                        }
                        foreach (int tsoId in tsoIds.ListOfIDs)
                        {
                            DC_Org_TSO_ID tsoIdReq = new DC_Org_TSO_ID(request_obj.coreProj);
                            tsoIdReq.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            tsoIdReq.orgId = request_obj.orgId;
                            tsoIdReq.tsoId = tsoId;

                            IDCR_Delete deleteTSO = coreSc.Delete_TimePeriod(IDcTsoId, coreSc, coreDb);
                            if (deleteTSO.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(deleteTSO);
                                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                                return resp;
                            }
                        }
                    }
                    if (coreDb.Delete_All_Appointment_Repeat_Mappings(request_obj.coreProj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseOk();
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
            }
            return resp;
        }

        public IDCR_Delete Delete_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, IDcAppointmentRepeatId IDcAppointmentRepeatId, IDcTSOResourceId IDcTSOResourceId, ICoreSc coreSc,ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils,  request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteAllOrgAppointmentResourceMappingsByAppointmentID))
                {
                    
                    IDcrIdList appointmentTSOids = coreSc.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(request_obj, utils, validation, coreSc,coreDb);
                    if (appointmentTSOids.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentTSOids);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    
                    IDcrIdList resourceIds = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(request_obj, utils, validation, coreSc, coreDb);
                    if (resourceIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceIds);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    DC_Org_TSO_Resource_Id resTSO = new DC_Org_TSO_Resource_Id(request_obj.coreProj);
                    resTSO.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    resTSO.orgId = request_obj.orgId;
                    foreach (int resourceId in resourceIds.ListOfIDs)
                    {
                        resTSO.resourceId = resourceId;
                        foreach (int tsoId in appointmentTSOids.ListOfIDs)
                        {
                            resTSO.tsoId = tsoId;
                            //DCR_Delete deletedTimePeriodMap = SC_TSO.Delete_TimePeriod_Resource_Map(resTSO);
                            IDCR_Delete deletedTimePeriodMap = coreSc.Delete_TimePeriod_Resource_Map(IDcTSOResourceId,coreDb);
                            if (deletedTimePeriodMap.func_status != ENUM_Cmd_Status.ok || deletedTimePeriodMap.Result != ENUM_Cmd_Delete_State.Deleted)
                            {
                                resp.StatusAndMessage_CopyFrom(deletedTimePeriodMap);
                                resp.Result = deletedTimePeriodMap.Result;
                                return resp;
                            }
                        }
                    }
                    if (coreDb.Delete_All_Appointment_Resource_Mappings(request_obj.coreProj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseOk();
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                return resp;
            }
            return resp;
        }

        public IDCR_Delete Delete_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, IDcCalendarId IDcCalendarId, IDcTSOCalendarId IDcTSOCalendarId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();

            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcAppointmentId)))
            {

                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteAllOrgAppointmentCalendarMappingsByAppointmentID))
                {

                    IDcrIdList appointmentCalendarList = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(request_obj, utils, validation, coreSc, coreDb);
                    if (appointmentCalendarList.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentCalendarList);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }

                    foreach (int calendarId in appointmentCalendarList.ListOfIDs)
                    {
                        DC_Org_Calendar_ID calendarIdRequest = new DC_Org_Calendar_ID(request_obj.coreProj);
                        calendarIdRequest.calendarId = calendarId;
                        calendarIdRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        calendarIdRequest.orgId = request_obj.orgId;

                        IDcrTsoList calendarTSOs = coreSc.Read_All_TimePeriods_For_Calendar(IDcCalendarId, utils, validation, coreSc, coreDb);

                        if (calendarTSOs.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(calendarTSOs);
                            resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                            return resp;
                        }

                        foreach (ITSO tsoDetails in calendarTSOs.timeScaleList)
                        {
                            if (tsoDetails.appointmentId == request_obj.appointmentId)
                            {
                                DC_Org_TSO_Calendar_Id tsoCalendarId = new DC_Org_TSO_Calendar_Id(request_obj.coreProj);
                                tsoCalendarId.calendarId = calendarId;
                                tsoCalendarId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                                tsoCalendarId.orgId = request_obj.orgId;
                                tsoCalendarId.tsoId = tsoDetails.tsoId;

                                IDCR_Delete deletedTSO = coreSc.Delete_TimePeriod_Calendar_Map(IDcTSOCalendarId, coreDb);
                                if (deletedTSO.func_status != ENUM_Cmd_Status.ok)
                                {
                                    resp.StatusAndMessage_CopyFrom(deletedTSO);
                                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                                    return resp;
                                }
                            }
                        }
                    }

                    if (coreDb.Delete_All_Appointment_Calendar_Mappings(request_obj.coreProj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseOk();
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                return resp;
            }
            return resp;
        }

        public IDCR_Delete Delete_Appointment_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, IDcAppointmentRepeatId IDcAppointmentRepeatId, IDcTsoId IDcTsoId, IDcTSOCalendarId IDcTSOCalendarId, IDcTSOResourceId IDcTSOResourceId, IDcCalendarId IDcCalendarId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcAppointmentId)))
            {   
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb,utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteAppointmentByAppointmentID))
                {
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.orgId = request_obj.orgId;
                    //remove the all tso objects
                    //DCR_Delete deleteExTsoMaps = SC_Org_Appointments.Delete_All_Appointment_TSO_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deleteExTsoMaps = coreSc.Delete_All_Appointment_TSO_Mappings_By_Appointment_ID(request_obj, utils, validation, IDcTsoId, coreSc, coreDb);
                    if (deleteExTsoMaps.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deleteExTsoMaps);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    //remove the link to the repeats
                    //DCR_Delete deletedExRepMaps = SC_Org_Appointments.Delete_All_Appointment_Repeat_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deletedExRepMaps = coreSc.Delete_All_Appointment_Repeat_Mappings_By_Appointment_ID(request_obj, utils, validation, IDcAppointmentRepeatId, IDcTsoId, coreSc, coreDb);
                    if (deletedExRepMaps.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deletedExRepMaps);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    //remove the link to the resources
                    //DCR_Delete deletedExResMaps = SC_Org_Appointments.Delete_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deletedExResMaps = coreSc.Delete_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(request_obj, utils, validation, IDcAppointmentRepeatId, IDcTSOResourceId, coreSc, coreDb);
                    if (deletedExResMaps.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deletedExResMaps);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    //DCR_Delete deletedExCalMaps = SC_Org_Appointments.Delete_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deletedExCalMaps = coreSc.Delete_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(request_obj, utils, validation, IDcCalendarId, IDcTSOCalendarId, coreSc, coreDb);
                    if (deletedExCalMaps.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deletedExCalMaps);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    //remove the appointment details
                    if (coreDb.Delete_Appointment(request_obj.coreProj, request_obj.appointmentId) != ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        resp.SetResponseServerError();
                        return resp;
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                        resp.SetResponseOk();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
            }
            return resp;
        }

        public IDcrAddedList Create_Appointment_Repeats_Map(IDcMapRepeatsAppointment request_obj, IUtils utils, IValidation validation, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, IDCResourceTimeRange IDCResourceTimeRange, IDcTsoId IDcTsoId, IDcResourceTSO IDcResourceTSO, IDcCalendarTSO IDcCalendarTSO, ITsoResourceId ITsoResourceId, IOrgTsoCalendarId IOrgTsoCalendarId, IDcCalendarsTSOs IDcCalendarsTSOs, IDcCalendarId IDcCalendarId, IDcOrgResourceId IDcOrgResourceId, IListOfOrgTsoCalendarIds IListOfOrgTsoCalendarIds, IDcTso IDcTso, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_AddedList resp = new DCR_AddedList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcMapRepeatsAppointment)) && request_obj.repeatIds.Count > 0)
            {
                
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb,utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgRepeatsAppointmentMap))
                {
                    //read the appointmentd details
                    //read the appointment data
                    DC_Org_Appointment_Id appointmentRequest = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentRequest.appointmentId = request_obj.appointmentId;
                    appointmentRequest.orgId = request_obj.orgId;
                    //DCR_Org_AppointmentOptions appointmentDetails = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(appointmentRequest);
                    //DCR_Id_List listOfResourcesMappedToAppointment = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentRequest);
                    IDcrAppointment appointmentDetails = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    IDcrIdList listOfResourcesMappedToAppointment = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);

                    //Dictionary<int, List<BaseInstantStartStop>> repeatTimePeriods = new Dictionary<int, List<BaseInstantStartStop>>();
                    Dictionary<int, List<IInstantStartStop>> repeatTimePeriods = new Dictionary<int, List<IInstantStartStop>>();
                    foreach (int repeatId in request_obj.repeatIds)
                    {
                        //loop the repeats
                        //read the repeat data
                        DC_Org_Repeat_Id reqRepeatId = new DC_Org_Repeat_Id(request_obj.coreProj);
                        reqRepeatId.cmd_user_id = request_obj.cmd_user_id;
                        reqRepeatId.orgId = request_obj.orgId;
                        reqRepeatId.repeatId = repeatId;


                        IDcrRepeat repeatDetails = coreSc.Read_Repeat(IDcRepeatId, utils, validation, coreSc, coreDb);
                        if (repeatDetails.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(repeatDetails);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }
                        //the repeat rule shouldnt really be allowed to have a start date for before the appointment
                        if (DateTime.Parse(repeatDetails.end) < DateTime.Parse(appointmentDetails.start))
                        {
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            resp.NewRecordIDs.Clear();
                            resp.SetResponsePermissionDenied();
                            return resp;
                        }
                        //create a tmp copy of the repeated events for the system configured boundary
                        BaseStartStop eventStartStop = new BaseStartStop();
                        eventStartStop.start = DateTime.Parse(appointmentDetails.start).ToUniversalTime().ISO8601Str();
                        eventStartStop.end = DateTime.Parse(appointmentDetails.end).ToUniversalTime().ISO8601Str();
                        //DCR_OrgTimePeriodList generatedRepeatTimePeriods = new DCR_OrgTimePeriodList();
                        List<IInstantStartStop> generatedRepeatTimePeriods = new List<IInstantStartStop>();

                        //generatedRepeatTimePeriods = Utils.GenerateRepeatTimePeriods(request_obj.coreProj, eventStartStop, repeatDetails, appointmentDetails.timeZoneIANA, true);
                        generatedRepeatTimePeriods = utils.GenerateRepeatTimePeriods(request_obj.coreProj, coreSc, eventStartStop, repeatDetails, appointmentDetails.timeZoneIANA, true, coreDb);


                        //repeatTimePeriods.Add(repeatId, generatedRepeatTimePeriods.TimePeriods);
                        repeatTimePeriods.Add(repeatId, generatedRepeatTimePeriods);
                        //TODO: fix bug here due things going over the year boundary from today.....................
                        //if (generatedRepeatTimePeriods.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    resp.StatusAndMessage_CopyFrom(generatedRepeatTimePeriods);
                        //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        //    return resp;
                        //}

                        foreach (int resourceId in listOfResourcesMappedToAppointment.ListOfIDs)
                        {
                            DC_Org_Resource_Time_Range resourceTimeRange = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                            resourceTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            resourceTimeRange.orgId = request_obj.orgId;
                            resourceTimeRange.resourceId = resourceId;

                            resourceTimeRange.start = DateTime.Parse(appointmentDetails.start).OrijDTStr();

                            LocalDateTime tmp = LocalDateTime.FromDateTime(DateTime.Parse(appointmentDetails.start).ToUniversalTime()).PlusDays(GeneralConfig.MAX_GENERATE_FUTURE_IN_DAYS);
                            tmp = new LocalDateTime(tmp.Year, tmp.Month, tmp.Day, 23, 59, 59, 0);
                            resourceTimeRange.end = tmp.InUtc().ToDateTimeUtc().ISO8601Str();

                            //test to see if any of the resources have tso which conflict with the new appointments
                            //DCR_Id_List readTSoIds = SC_Org_Resources.Read_Resource_TSOs_By_Resource_ID_TimeRange(resourceTimeRange);
                            IDcrIdList readTSoIds = coreSc.Read_Resource_TSOs_By_Resource_ID_TimeRange(IDCResourceTimeRange, utils, validation, coreSc, coreDb);
                            if (readTSoIds.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(readTSoIds);
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                resp.NewRecordIDs.Clear();
                                return resp;
                            }
                            //List<BaseTSo> tsoDetails = new List<BaseTSo>();
                            List<ITSO> tsoDetails = new List<ITSO>();
                            foreach (int tsoId in readTSoIds.ListOfIDs)
                            {
                                DC_Org_TSO_ID tsoIdReq = new DC_Org_TSO_ID(request_obj.coreProj);
                                tsoIdReq.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                                tsoIdReq.orgId = request_obj.orgId;
                                tsoIdReq.tsoId = tsoId;

                                //DCR_Org_TSO tsoData = SC_TSO.Read_TSo(tsoIdReq);
                                IDcrTSO tsoData = coreSc.Read_TSo(IDcTsoId, utils, validation, coreSc, coreDb);

                                if (tsoData.func_status != ENUM_Cmd_Status.ok)
                                {
                                    resp.StatusAndMessage_CopyFrom(tsoData);
                                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                    resp.NewRecordIDs.Clear();
                                    return resp;
                                }
                                if (tsoData.repeatId == -1 && tsoData.appointmentId == request_obj.appointmentId)
                                {
                                    //skip the appointment obj itself as that will be part of the new repeat ex map
                                }
                                else
                                {
                                    tsoDetails.Add(new BaseTSo(tsoData));
                                }
                            }

                            //DCR_TimePeriod_List conflicts = Utils.GetConflictingTimePeriods(Utils.CONVERT_BaseTSOToInstantList(tsoDetails), generatedRepeatTimePeriods.TimePeriods);
                            List<IInstantStartStop> conflicts = utils.GetConflictingTimePeriods(utils.CONVERT_ITSOListToInstantList(tsoDetails), generatedRepeatTimePeriods);
                            //if (conflicts.func_status != ENUM_Cmd_Status.ok)
                            //{
                            //    resp.StatusAndMessage_CopyFrom(conflicts);
                            //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            //    resp.NewRecordIDs.Clear();
                            //    return resp;
                            //}

                            if (conflicts.Count != 0)
                            {
                                resp.SetResponsePermissionDenied();
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                resp.NewRecordIDs.Clear();
                                return resp;
                            }
                        }
                    }

                    foreach (int repeatId in request_obj.repeatIds)
                    {
                        DC_Create_Repeat_Appointment_Mapping createRepeatAppointmentMap = new DC_Create_Repeat_Appointment_Mapping(request_obj.coreProj);
                        createRepeatAppointmentMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        createRepeatAppointmentMap.creatorId = request_obj.creatorId;
                        createRepeatAppointmentMap.appointmentId = request_obj.appointmentId;
                        createRepeatAppointmentMap.orgId = request_obj.orgId;
                        createRepeatAppointmentMap.repeatId = repeatId;
                        int repeatedAppointmentRepeatMap;
                        
                        if (coreDb.Create_Appointment_Repeat_Map(request_obj.coreProj, request_obj, IDcRepeatId, out repeatedAppointmentRepeatMap) != ENUM_DB_Status.DB_SUCCESS)
                        {
                            resp.SetResponseServerError();
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }

                        //generate the new appointment events for the configured system boundary
                        //foreach (BaseInstantStartStop timeRange in repeatTimePeriods[repeatId])
                        foreach (IInstantStartStop timeRange in repeatTimePeriods[repeatId])
                        {
                            DC_Create_Time_Scale_Obj createTso = new DC_Create_Time_Scale_Obj(request_obj.coreProj);
                            createTso.appointmentId = request_obj.appointmentId;
                            createTso.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            createTso.dateOfGeneration = DateTime.Now.ToUniversalTime().ISO8601Str();
                            createTso.durationMilliseconds = (long)timeRange.stop.Minus(timeRange.start).ToTimeSpan().TotalMilliseconds;
                            createTso.appointmentId = request_obj.appointmentId;
                            createTso.repeatId = repeatId;
                            createTso.exceptionId = 0;
                            createTso.resourceIdList = listOfResourcesMappedToAppointment.ListOfIDs;
                            createTso.start = timeRange.start.ToDateTimeUtc().ISO8601Str();
                            createTso.end = timeRange.stop.ToDateTimeUtc().ISO8601Str();
                            createTso.orgId = request_obj.orgId;
                            //DCR_Added createdTso = SC_TSO.Create_TimePeriod(createTso);
                            List<ITimeStartEnd> ListITimeStartEnd = new List<ITimeStartEnd>();
                            IDCR_Added createdTSO = coreSc.Create_TimePeriod(IDcTso, validation, IDcResourceTSO, IDcCalendarTSO, IDcResourceTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, utils, ListITimeStartEnd, IListOfOrgTsoCalendarIds, coreSc, coreDb);
                            if (createdTSO.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(createdTSO);
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                return resp;
                            }
                        }
                        resp.NewRecordIDs.Add(repeatedAppointmentRepeatMap);
                    }
                    resp.Result = ENUM_Cmd_Add_Result.Added;
                    resp.SetResponseOk();
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
            }

            return resp;
        }

        public IDCR_Added Create_Org_Appointment_Calendar_Mapping(IDcMapCalendarAppointment request_obj, IUtils utils, IValidation validation, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, IDCResourceTimeRange IDCResourceTimeRange, IDcTsoId IDcTsoId, IDcCalendarTimeRange IDcCalendarTimeRange, IDcResourceTSO IDcResourceTSO, IDcCalendarTSO IDcCalendarTSO, ITsoResourceId ITsoResourceId, IOrgTsoCalendarId IOrgTsoCalendarId, IDcCalendarsTSOs IDcCalendarsTSOs, IDcCalendarId IDcCalendarId, IDcOrgResourceId IDcOrgResourceId, IListOfOrgTsoCalendarIds IListOfOrgTsoCalendarIds, ICalendarTimeRange ICalendarTimeRange, IDcOrgId IDcOrgId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Added resp = new DCR_Added();

            DateTime startTime = DateTime.Now;
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcMapCalendarAppointment)))
            {
                
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb,  utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointmentCalendarMapping))
                {
                    #region read the appointment details
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.orgId = request_obj.orgId;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    //DCR_Org_AppointmentOptions appointmentData = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(appointmentId);
                    IDcrAppointment appointmentData = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentData.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentData);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }
                    #endregion
                    #region read all the resources to the appointment make sure it == 0
                    //DCR_Id_List resourceIds = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList resourceIds = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (resourceIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceIds);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    if (resourceIds.ListOfIDs.Count > 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                    #region read all the calendars mapped to the appointment
                    //DCR_Id_List calendarsAlreadyMapped = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList calendarsAlreadyMapped = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (calendarsAlreadyMapped.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarsAlreadyMapped);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }

                    #endregion
                    #region check to see if the calendar is already mapped to the appointment
                    if (calendarsAlreadyMapped.ListOfIDs.Contains(request_obj.calendarId))
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Already_Added;
                        resp.SetResponseOk();

                        return resp;
                    }
                    #endregion
                    #region read the calendar which will be mapped
                    DC_Org_Calendar_ID dc_o_r_i = new DC_Org_Calendar_ID(request_obj.coreProj);
                    dc_o_r_i.cmd_user_id = request_obj.cmd_user_id;
                    dc_o_r_i.orgId = request_obj.orgId;
                    dc_o_r_i.calendarId = request_obj.calendarId;
                    //DCR_Org_Calendar calendarDetails = SC_Org_Calendars.Read_Org_Calendar_By_Calendar_ID(dc_o_r_i);
                    IDcrCalendar calendarDetails = coreSc.Read_Org_Calendar_By_Calendar_ID(IDcCalendarId, validation, utils, IDcCalendarId, IDcCalendarId, coreSc, coreDb);
                    if (calendarDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarDetails);
                        resp.NewRecordID = -1;
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }
                    #endregion
                    #region read TSO's already generated and mapped to the appointment

                    IDcrTsoList appointmentTSOs = coreSc.Read_All_TimePeriods_For_Appointment(IDcAppointmentId, utils, validation, coreSc, coreDb);

                    if (appointmentTSOs.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentTSOs);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }

                    //List<BaseInstantStartStop> currentAppointmentTimePeriods = new List<BaseInstantStartStop>();
                    List<IInstantStartStop> currentAppointmentTimePeriods = new List<IInstantStartStop>();
                    //foreach (BaseTSo tso in appointmentTSOs.timeScaleList)
                    foreach (ITSO tso in appointmentTSOs.timeScaleList)
                    {
                        BaseInstantStartStop tr = new BaseInstantStartStop();
                        tr.start = InstantPattern.ExtendedIsoPattern.Parse(tso.start).Value;
                        tr.stop = InstantPattern.ExtendedIsoPattern.Parse(tso.end).Value;
                        currentAppointmentTimePeriods.Add(tr);
                    }
                    #endregion
                    DC_Org_ID orgId = new DC_Org_ID(request_obj.coreProj);
                    orgId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    orgId.orgId = request_obj.orgId;
                    //DCR_Org orgDetails = SC_Org.Read_Org_By_Org_ID(orgId);
                    IDcrOrg orgDetails = coreSc.Read_Org_By_Org_ID(IDcOrgId, validation, utils, coreSc, coreDb);
                    if (orgDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(orgDetails);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }


                    #region do this if the calendar does not allow overlapping

                    #region check if they conflict with the old TSO objects
                    DC_Org_Calendar_Time_Range calendarTimeRange2 = new DC_Org_Calendar_Time_Range(request_obj.coreProj);
                    calendarTimeRange2.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    calendarTimeRange2.orgId = request_obj.orgId;
                    calendarTimeRange2.calendarId = request_obj.calendarId;
                    calendarTimeRange2.start = appointmentData.start;
                    calendarTimeRange2.end = DateTime.Now.AddDays(GeneralConfig.MAX_GENERATE_FUTURE_IN_DAYS).ToUniversalTime().ISO8601Str();
                    //DCR_Org_TSO_List calendarTSOs = SC_TSO.Read_TimePeriods_For_Calendar_Between_DateTime(calendarTimeRange2);
                    IDcrTsoList calendarTSos = coreSc.Read_TimePeriods_For_Calendar_Between_DateTime(IDcCalendarTimeRange, utils, ICalendarTimeRange, validation, coreSc, coreDb);

                    if (calendarTSos.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarTSos);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }
                    //List<BaseInstantStartStop> calendarTimeRanges = new List<BaseInstantStartStop>();
                    List<IInstantStartStop> calendarTimeRanges = new List<IInstantStartStop>();
                    //foreach (BaseTSo tsoDetails in calendarTSOs.timeScaleList)
                    foreach (ITSO tsoDetails in calendarTSos.timeScaleList)
                    {
                        if (tsoDetails.appointmentId != request_obj.appointmentId)
                        {
                            BaseInstantStartStop tr = new BaseInstantStartStop();
                            tr.start = InstantPattern.ExtendedIsoPattern.Parse(tsoDetails.start).Value;
                            tr.stop = InstantPattern.ExtendedIsoPattern.Parse(tsoDetails.end).Value;
                            calendarTimeRanges.Add(tr);
                        }
                    }
                    #endregion

                    #region if they conflict then disallow the add otherwise add the map to the existing appointment TSOS
                    //DCR_TimePeriod_List conflicts = Utils.GetConflictingTimePeriods(calendarTimeRanges, currentAppointmentTimePeriods);
                    List<IInstantStartStop> conflicts = utils.GetConflictingTimePeriods(calendarTimeRanges, currentAppointmentTimePeriods);
                    //if (conflicts.func_status != ENUM_Cmd_Status.ok)
                    //{
                    //    resp.StatusAndMessage_CopyFrom(conflicts);
                    //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                    //    return resp;
                    //}
                    if (conflicts.Count != 0)
                    {
                        //there are conflicts so cannot add
                        resp.SetResponsePermissionDenied();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                        return resp;
                    }
                    #endregion
                    #region read all the calendars resources
                    DC_Org_Calendar_ID calendarId = new DC_Org_Calendar_ID(request_obj.coreProj);
                    calendarId.calendarId = request_obj.calendarId;
                    calendarId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    calendarId.orgId = request_obj.orgId;

                    IDcrIdList calendarResIds = coreSc.Read_All_Org_Calendar_Resource_Mappings_By_Calendar_ID(IDcCalendarId, validation, utils, coreSc,coreDb);

                    if (calendarResIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarResIds);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion

                    #region loop all the calendar resources and make sure the appointment tsos are not too far in the future
                    DateTime currentTime = DateTime.Now;

                    foreach (int resId in calendarResIds.ListOfIDs)
                    {
                        DC_Org_Resource_ID resourceId = new DC_Org_Resource_ID(request_obj.coreProj);
                        resourceId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resourceId.orgId = request_obj.orgId;
                        resourceId.resourceId = resId;
                        //DCR_Org_Resource resourceDetails = SC_Org_Resources.Read_Resource_By_ID(resourceId);
                        IDcrResource resourceDetails = coreSc.Read_Resource_By_ID(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                        if (resourceDetails.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(resourceDetails);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }
                        DateTime resourceMaxTime = currentTime.AddMilliseconds(resourceDetails.maxAppointmentFutureTimeInMs).ToUniversalTime();
                        if (resourceDetails.maxAppointmentFutureTimeInMs != 0)
                        {
                            foreach (BaseTSo tsoDetails in appointmentTSOs.timeScaleList)
                            {
                                if (resourceMaxTime < DateTime.Parse(tsoDetails.end).ToUniversalTime())
                                {
                                    resp.SetResponseInvalidParameter();
                                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                    return resp;
                                }
                            }
                        }
                    }
                    #endregion

                    #endregion
                    #region create the link for the appointment + calendar in the db
                    //foreach (BaseTSo tso in appointmentTSOs.timeScaleList)
                    foreach (ITSO tso in appointmentTSOs.timeScaleList)
                    {
                        DC_Create_Org_Calendar_TimeScaleObj_Mapping resTsoMap = new DC_Create_Org_Calendar_TimeScaleObj_Mapping(request_obj.coreProj);
                        resTsoMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resTsoMap.orgId = request_obj.orgId;
                        resTsoMap.calendarId = request_obj.calendarId;
                        resTsoMap.tsoId = tso.tsoId;
                        //DCR_Added createdTsoResMap = SC_TSO.Create_TimePeriod_Calendar_Map(resTsoMap);
                        List<ITimeStartEnd> ListITimeStartEnd = new List<ITimeStartEnd>();
                        IDCR_Added createdTsoResMap = coreSc.Create_TimePeriod_Calendar_Map(IDcCalendarTSO, validation, IDcResourceTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, utils, ListITimeStartEnd, IListOfOrgTsoCalendarIds, coreSc, coreDb);

                        if (createdTsoResMap.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(createdTsoResMap);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;

                            return resp;
                        }
                    }
                    int newMappingID;
                    if (coreDb.Create_Calendar_Appointment_Mapping(request_obj.coreProj, request_obj, request_obj, out newMappingID) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.NewRecordID = newMappingID;
                        resp.Result = ENUM_Cmd_Add_Result.Added;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        resp.SetResponseServerError();
                    }
                    #endregion
                }
                else
                {
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    resp.SetResponsePermissionDenied();
                    //return resp;
                }
            }
            else
            {

                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDCR_Added Create_Org_Appointment_Repeat_Map(IDcMapRepeatAppointment request_obj, IUtils utils, IValidation validation, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, IDCResourceTimeRange IDCResourceTimeRange, IDcTsoId IDcTsoId, IDcCalendarTimeRange IDcCalendarTimeRange, IDcResourceTSO IDcResourceTSO, IDcCalendarTSO IDcCalendarTSO, ITsoResourceId ITsoResourceId, IOrgTsoCalendarId IOrgTsoCalendarId, IDcCalendarsTSOs IDcCalendarsTSOs, IDcCalendarId IDcCalendarId, IDcOrgResourceId IDcOrgResourceId, IListOfOrgTsoCalendarIds IListOfOrgTsoCalendarIds, IDcTso IDcTso, IDcTsos IDcTsos, ICoreSc coreSc, ICoreDatabase coreDb)
        {

            DCR_Added resp = new DCR_Added();


            if (validation.Is_Valid(request_obj.coreProj, coreSc,coreDb, utils,request_obj, typeof(IDcMapRepeatAppointment)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc,coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointmentRepeatMap))
                {
                    //TODO: check the return values of the reads
                    #region read the appointment data
                    DC_Org_Appointment_Id appointmentRequest = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentRequest.appointmentId = request_obj.appointmentId;
                    appointmentRequest.orgId = request_obj.orgId;

                    IDcrAppointment appointmentDetails = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    #endregion
                    #region read the repeat data
                    DC_Org_Repeat_Id reqRepeatId = new DC_Org_Repeat_Id(request_obj.coreProj);
                    reqRepeatId.cmd_user_id = request_obj.cmd_user_id;
                    reqRepeatId.orgId = request_obj.orgId;
                    reqRepeatId.repeatId = request_obj.repeatId;

                    //DCR_Repeat repeatDetails = SC_Org_Repeat.Read_Repeat(reqRepeatId);
                    IDcrRepeat repeatDetails = coreSc.Read_Repeat(IDcRepeatId, utils, validation, coreSc, coreDb);
                    if (repeatDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(repeatDetails);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                    #region read the appointment repeat mappings
                    //DCR_Id_List appointmentsRepeatAlreadyMapd = SC_Org_Appointments.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(appointmentRequest);
                    IDcrIdList appointmentsRepeatAlreadyMapd = coreSc.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentsRepeatAlreadyMapd.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentsRepeatAlreadyMapd);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    if (appointmentsRepeatAlreadyMapd.ListOfIDs.Contains(reqRepeatId.repeatId))
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Already_Added;
                        resp.SetResponsePermissionDenied();
                        return resp;
                    }
                    #endregion
                    //the repeat rule shouldnt really be allowed to have a start date for before the appointment
                    #region create a tmp copy of the repeated events for the system configured boundary
                    BaseStartStop eventStartStop = new BaseStartStop();
                    eventStartStop.start = DateTime.Parse(appointmentDetails.start).ToUniversalTime().ISO8601Str();
                    eventStartStop.end = DateTime.Parse(appointmentDetails.end).ToUniversalTime().ISO8601Str();
                    //DCR_Org_TimePeriod_List generatedRepeatTimePeriods = Utils.GenerateRepeatTimePeriods(request_obj.coreProj, eventStartStop, repeatDetails, appointmentDetails.timeZoneIANA, true);
                    List<IInstantStartStop> generatedRepeatTimePeriods = utils.GenerateRepeatTimePeriods(request_obj.coreProj, coreSc, eventStartStop, repeatDetails, appointmentDetails.timeZoneIANA, true, coreDb);
                    //TODO: fix bug here due things going over the year boundary from today.....................
                    //if (generatedRepeatTimePeriods.func_status != ENUM_Cmd_Status.ok)
                    //{
                    //    resp.StatusAndMessage_CopyFrom(generatedRepeatTimePeriods);
                    //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    //    return resp;
                    //}
                    #endregion
                    #region check to see if the appointment is linked to any resources
                    //DCR_Id_List listOfResourcesMappedToAppointment = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentRequest);
                    IDcrIdList listOfResourcesMappedToAppointment = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (listOfResourcesMappedToAppointment.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(listOfResourcesMappedToAppointment);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                    #region check to see if the appointment is linked to any calendars
                    //DCR_Id_List listOfCalendarsMappedToAppointment = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentRequest);
                    IDcrIdList listOfCalendarsMappedToAppointment = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (listOfCalendarsMappedToAppointment.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(listOfCalendarsMappedToAppointment);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                    #region loop all the resources and check for conflicts in the time period we are concerned with
                    foreach (int resourceId in listOfResourcesMappedToAppointment.ListOfIDs)
                    {
                        DC_Org_Resource_Time_Range resourceTimeRange = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                        resourceTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resourceTimeRange.orgId = request_obj.orgId;
                        resourceTimeRange.resourceId = resourceId;
                        resourceTimeRange.start = DateTime.Parse(appointmentDetails.start).OrijDTStr();
                        DateTime tmp = DateTime.Parse(appointmentDetails.start).AddDays(GeneralConfig.MAX_GENERATE_FUTURE_IN_DAYS).ToUniversalTime();
                        tmp = new DateTime(tmp.Year, tmp.Month, tmp.Day, 23, 59, 59).ToUniversalTime();
                        resourceTimeRange.end = tmp.ISO8601Str();
                        //resourceTimeRange.durationMilliseconds = (long)(DateTime.Parse(resourceTimeRange.end) - DateTime.Parse(resourceTimeRange.start)).TotalMilliseconds;

                        //test to see if any of the resources have tso which conflict with the new appointments
                        //DCR_Id_List readTSoIds = SC_Org_Resources.Read_Resource_TSOs_By_Resource_ID_TimeRange(resourceTimeRange);
                        IDcrIdList readTSoIds = coreSc.Read_Resource_TSOs_By_Resource_ID_TimeRange(IDCResourceTimeRange, utils, validation, coreSc, coreDb);


                        if (readTSoIds.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(readTSoIds);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }
                        //List<BaseTSo> tsoDetails = new List<BaseTSo>();
                        List<ITSO> tsoDetails = new List<ITSO>();
                        foreach (int tsoId in readTSoIds.ListOfIDs)
                        {
                            DC_Org_TSO_ID tsoIdReq = new DC_Org_TSO_ID(request_obj.coreProj);
                            tsoIdReq.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            tsoIdReq.orgId = request_obj.orgId;
                            tsoIdReq.tsoId = tsoId;
                            //DCR_Org_TSO tsoData = SC_TSO.Read_TSo(tsoIdReq);
                            IDcrTSO tsoData = coreSc.Read_TSo(IDcTsoId, utils, validation, coreSc, coreDb);
                            if (tsoData.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(tsoData);
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                return resp;
                            }
                            if ((tsoData.repeatId == -1 || tsoData.repeatId == 0) && tsoData.appointmentId == request_obj.appointmentId)
                            {
                                //skip the appointment obj itself as that will be part of the new repeat ex map
                            }
                            else
                            {
                                tsoDetails.Add(new BaseTSo(tsoData));
                            }
                        }

                        //DCR_TimePeriod_List conflicts = Utils.GetConflictingTimePeriods(Utils.CONVERT_BaseTSOToInstantList(tsoDetails), generatedRepeatTimePeriods.TimePeriods);
                        List<IInstantStartStop> conflicts = utils.GetConflictingTimePeriods(utils.CONVERT_ITSOListToInstantList(tsoDetails), generatedRepeatTimePeriods);
                        //if (conflicts.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    resp.StatusAndMessage_CopyFrom(conflicts);
                        //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        //    return resp;
                        //}

                        if (conflicts.Count != 0)
                        {
                            resp.SetResponsePermissionDenied();
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }

                    }
                    #endregion
                    #region loop all the calendars and check for conflicts in the time period
                    foreach (int calendarId in listOfCalendarsMappedToAppointment.ListOfIDs)
                    {
                        DC_Org_Calendar_Time_Range calendarTimeRange = new DC_Org_Calendar_Time_Range(request_obj.coreProj);
                        calendarTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        calendarTimeRange.orgId = request_obj.orgId;
                        calendarTimeRange.calendarId = calendarId;
                        calendarTimeRange.start = appointmentDetails.start;
                        calendarTimeRange.end = Instant.FromDateTimeUtc(DateTime.Now.ToUniversalTime()).Plus(Duration.FromStandardDays(GeneralConfig.MAX_GENERATE_FUTURE_IN_DAYS)).ToDateTimeUtc().ISO8601Str();
                        //calendarTimeRange.durationMilliseconds = (long)(DateTime.Parse(calendarTimeRange.end) - DateTime.Parse(calendarTimeRange.start)).TotalMilliseconds;

                        //test to see if any of the calendars have tso which conflict with the new appointments
                        //DCR_Id_List readTSoIds = SC_Org_Calendars.Read_Org_Calendar_TSOs_By_Calendar_ID_And_TimeRange(calendarTimeRange);
                        IDcrIdList readTSoIds = coreSc.Read_Org_Calendar_TSOs_By_Calendar_ID_And_TimeRange(IDcCalendarTimeRange, validation, utils, IDcCalendarTimeRange, IDcCalendarTimeRange, coreSc, coreDb);
                        if (readTSoIds.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(readTSoIds);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }
                        //List<BaseTSo> tsoDetails = new List<BaseTSo>();
                        List<ITSO> tsoDetails = new List<ITSO>();
                        foreach (int tsoId in readTSoIds.ListOfIDs)
                        {
                            DC_Org_TSO_ID tsoIdReq = new DC_Org_TSO_ID(request_obj.coreProj);
                            tsoIdReq.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            tsoIdReq.orgId = request_obj.orgId;
                            tsoIdReq.tsoId = tsoId;
                            //DCR_Org_TSO tsoData = SC_TSO.Read_TSo(tsoIdReq);
                            IDcrTSO tsoData = coreSc.Read_TSo(IDcTsoId, utils, validation, coreSc, coreDb);

                            if (tsoData.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(tsoData);
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                return resp;
                            }
                            if (tsoData.repeatId == -1 && tsoData.appointmentId == request_obj.appointmentId)
                            {
                                //skip the appointment obj itself as that will be part of the new repeat ex map
                            }
                            else
                            {
                                tsoDetails.Add(new BaseTSo(tsoData));
                            }
                        }

                        //DCR_TimePeriod_List conflicts = Utils.GetConflictingTimePeriods(Utils.CONVERT_BaseTSOToInstantList(tsoDetails), generatedRepeatTimePeriods.TimePeriods);
                        List<IInstantStartStop> conflicts = utils.GetConflictingTimePeriods(utils.CONVERT_ITSOListToInstantList(tsoDetails), generatedRepeatTimePeriods);
                        //if (conflicts.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    resp.StatusAndMessage_CopyFrom(conflicts);
                        //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        //    return resp;
                        //}

                        // Need to resolve
                        if (conflicts.Count != 0)
                        {
                            resp.SetResponsePermissionDenied();
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            return resp;
                        }

                    }
                    #endregion
                    //if no conflicts occur proceed to map the repeat rule with the appointment
                    DC_Create_Repeat_Appointment_Mapping createRepeatAppointmentMap = new DC_Create_Repeat_Appointment_Mapping(request_obj.coreProj);
                    createRepeatAppointmentMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createRepeatAppointmentMap.creatorId = request_obj.creatorId;
                    createRepeatAppointmentMap.appointmentId = request_obj.appointmentId;
                    createRepeatAppointmentMap.orgId = request_obj.orgId;
                    createRepeatAppointmentMap.repeatId = request_obj.repeatId;
                    int repeatedAppointmentRepeatMap;
                    //if (DatabaseOperations_Appointments.Create_Appointment_Repeat_Map(createRepeatAppointmentMap, out repeatedAppointmentRepeatMap) != ENUM_DB_Status.DB_SUCCESS)
                    if (coreDb.Create_Appointment_Repeat_Map(request_obj.coreProj, request_obj, IDcRepeatId, out repeatedAppointmentRepeatMap) != ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }

                    //generate the new appointment events for the configured system boundary
                    DC_Create_Time_Scale_Objs createTimeScaleObjs = new DC_Create_Time_Scale_Objs(request_obj.coreProj);
                    createTimeScaleObjs.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createTimeScaleObjs.orgId = request_obj.orgId;
                    //foreach (BaseInstantStartStop timeRange in generatedRepeatTimePeriods.TimePeriods)
                    foreach (IInstantStartStop timeRange in generatedRepeatTimePeriods)
                    {
                        BaseTsoOptions createTso = new BaseTsoOptions();
                        createTso.exceptionId = 0;
                        createTso.dateOfGeneration = DateTime.Now.ToUniversalTime().ISO8601Str();
                        createTso.durationMilliseconds = (long)timeRange.stop.Minus(timeRange.start).ToTimeSpan().TotalMilliseconds;
                        createTso.appointmentId = request_obj.appointmentId;
                        createTso.repeatId = request_obj.repeatId;
                        createTso.start = timeRange.start.ToDateTimeUtc().ISO8601Str();
                        createTso.end = timeRange.stop.ToDateTimeUtc().ISO8601Str();
                        createTso.orgId = request_obj.orgId;
                        createTimeScaleObjs.listOfTSOOptions.Add(createTso);
                    }
                    createTimeScaleObjs.resourceIdList = listOfResourcesMappedToAppointment.ListOfIDs;
                    createTimeScaleObjs.calendarIdList = listOfCalendarsMappedToAppointment.ListOfIDs;
                    //DCR_Added_List createdTSOS = SC_TSO.Create_Org_TimeScaleObjects(createTimeScaleObjs);
                    List<ITimeStartEnd> ListITimeStartEnd = new List<ITimeStartEnd>();
                    IDcrAddedList createdTSOS = coreSc.Create_Org_TimeScaleObjects(IDcTsos, validation, IDcResourceTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, utils, ListITimeStartEnd, IListOfOrgTsoCalendarIds, coreSc, coreDb);

                    if (createdTSOS.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(createdTSOS);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }

                    resp.Result = ENUM_Cmd_Add_Result.Added;
                    resp.NewRecordID = repeatedAppointmentRepeatMap;
                    resp.SetResponseOk();

                }
                else
                {
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    resp.SetResponsePermissionDenied();
                }
            }


            else
            {
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDCR_Added Create_Org_Appointment_Resource_Mapping(IDcMapResourceAppointment request_obj, IUtils utils, IValidation validation, IDcOrgResourceId IDcOrgResourceId, IDcAppointmentId IDcAppointmentId, IDCResourceTimeRange IDCResourceTimeRange, IResourceTimeRange IResourceTimeRange, IDcOrgId IDcOrgId, IDcResourceTSO IDcResourceTSO, ITsoResourceId ITsoResourceId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Added resp = new DCR_Added();

            DateTime startTime = DateTime.Now;
            //string vem = String.Empty;

            File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Called" + Environment.NewLine);
            //if (Validation.Is_Valid(request_obj.coeProj, request_obj, typeof(DC_Org_Resource_Appointment_Id), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcMapResourceAppointment)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointmentResourceMapping))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_createOrgAppointmentResourceMapping))
                {
                    DC_Org_Resource_ID dc_o_r_i = new DC_Org_Resource_ID(request_obj.coreProj);
                    dc_o_r_i.cmd_user_id = request_obj.cmd_user_id;
                    dc_o_r_i.orgId = request_obj.orgId;
                    dc_o_r_i.resourceId = request_obj.resourceId;

                    //IDcrResourceAppointmentList appointmentList = ISCOrgResources.Read_All_Resource_Appointments_By_Resource_ID(IDcOrgResourceId, dbs, dbo, IDatabaseOperationsResources, utils, dbValid, validation, ISCOrgAppointments, dbi, IDatabaseOperationsAppointments, ISCTSO, IDatabaseOperationsTSO);
                    IDcrResourceAppointmentList appointmentList = coreSc.Read_All_Resource_Appointments_By_Resource_ID(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                    if (appointmentList.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentList);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    //foreach (BaseAppointmentComplete appointmentDetails in appointmentList.Appointments)
                    foreach (IAppointmentComplete appointmentDetails in appointmentList.ResourceAppointments[0].listOfAppointments)
                    {
                        if (appointmentDetails.appointmentId == request_obj.appointmentId)
                        {
                            resp.SetResponseOk();
                            resp.Result = ENUM_Cmd_Add_Result.Already_Added;
                            return resp;
                        }
                    }
                    File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Request Was Valid" + Environment.NewLine);
                    #region read the appointment details
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.orgId = request_obj.orgId;
                    appointmentId.appointmentId = request_obj.appointmentId;


                    IDcrAppointment appointmentData = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentData.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentData);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read AppointmentOptions" + Environment.NewLine);
                        return resp;
                    }
                    #endregion
                    #region read all the calendars to the appointment
                    //DCR_Id_List calendarIds = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList calendarIds = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (calendarIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarIds);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    if (calendarIds.ListOfIDs.Count > 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        return resp;
                    }
                    #endregion
                    #region read all the resources mapped to the appointment
                    //DCR_Id_List resourcesAlreadyMapped = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList resourcesAlreadyMapped = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (resourcesAlreadyMapped.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourcesAlreadyMapped);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read Resource Mappings" + Environment.NewLine);
                        return resp;
                    }

                    #endregion
                    #region check to see if the resource is already mapped to the appointment
                    if (resourcesAlreadyMapped.ListOfIDs.Contains(request_obj.resourceId))
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Already_Added;
                        resp.SetResponseOk();
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Appointment Already Mapped" + Environment.NewLine);
                        return resp;
                    }
                    #endregion
                    #region read the resource which will be mapped
                    //DCR_Org_Resource resourceDetails = SC_Org_Resources.Read_Resource_By_ID(dc_o_r_i);
                    IDcrResource resourceDetails = coreSc.Read_Resource_By_ID(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                    if (resourceDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceDetails);
                        resp.NewRecordID = -1;
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read Resource" + Environment.NewLine);
                        return resp;
                    }
                    #endregion
                    #region read TSO's already generated and mapped to the appointment
                    //DCR_Org_TSO_List appointmentTSOs = SC_TSO.Read_All_TimePeriods_For_Appointment(appointmentId);
                    IDcrTsoList appointmentTSOs = coreSc.Read_All_TimePeriods_For_Appointment(IDcAppointmentId, utils,  validation, coreSc, coreDb);
                    if (appointmentTSOs.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentTSOs);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read Appointment TimePeriods" + Environment.NewLine);
                        return resp;
                    }

                    //List<BaseInstantStartStop> currentAppointmentTimePeriods = new List<BaseInstantStartStop>();
                    List<IInstantStartStop> currentAppointmentTimePeriods = new List<IInstantStartStop>();
                    //foreach (BaseTSo tso in appointmentTSOs.timeScaleList)
                    foreach (ITSO tso in appointmentTSOs.timeScaleList)
                    {
                        BaseInstantStartStop tr = new BaseInstantStartStop();
                        tr.start = InstantPattern.ExtendedIsoPattern.Parse(tso.start).Value;//DateTime.Parse(tso.start).ToUniversalTime();
                        tr.stop = InstantPattern.ExtendedIsoPattern.Parse(tso.end).Value;//DateTime.Parse(tso.end).ToUniversalTime();
                        currentAppointmentTimePeriods.Add(tr);
                    }
                    #endregion

                    #region check to see if the user already has appointments mapped to this day
                    //==========
                    //read all the current resource tso's
                    int currentDayAppointments = 0;
                    DC_Org_Resource_Time_Range resourceTimeRange = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                    resourceTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    resourceTimeRange.start = InstantPattern.ExtendedIsoPattern.Parse(appointmentData.start).Value.Minus(Duration.FromStandardDays(30)).ToDateTimeUtc().StartOfDayUTC().ISO8601Str();
                    resourceTimeRange.end = InstantPattern.ExtendedIsoPattern.Parse(appointmentData.end).Value.Plus(Duration.FromStandardDays(30)).ToDateTimeUtc().EndOfDayUTC().ISO8601Str();
                    resourceTimeRange.orgId = request_obj.orgId;
                    resourceTimeRange.resourceId = request_obj.resourceId;
                    IDcrTsoList resourceTSOList = coreSc.Read_TimePeriods_For_Resource_Between_DateTime(IDCResourceTimeRange, utils, IResourceTimeRange, validation, coreSc, coreDb);

                    if (resourceTSOList.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceTSOList);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read Resource TimePeriods" + Environment.NewLine);
                        return resp;
                    }
                    List<BaseInstantStartStop> currentResourceTimePeriods = new List<BaseInstantStartStop>();
                    //foreach (BaseTSo tso in resourceTSOList.timeScaleList)
                    foreach (ITSO tso in resourceTSOList.timeScaleList)
                    {
                        BaseInstantStartStop tr = new BaseInstantStartStop();
                        tr.start = InstantPattern.ExtendedIsoPattern.Parse(tso.start).Value;
                        tr.stop = InstantPattern.ExtendedIsoPattern.Parse(tso.end).Value;
                        currentResourceTimePeriods.Add(tr);
                    }
                    DC_Org_ID orgId = new DC_Org_ID(request_obj.coreProj);
                    orgId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    orgId.orgId = request_obj.orgId;
                    //DCR_Org orgDetails = SC_Org.Read_Org_By_Org_ID(orgId);
                    IDcrOrg orgDetails = coreSc.Read_Org_By_Org_ID(IDcOrgId, validation, utils, coreSc, coreDb);
                    if (orgDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(orgDetails);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Org Details" + Environment.NewLine);
                        return resp;
                    }
                    //no need to check to see if there is a cap just skip the check completely
                    //if (request_obj.cmd_user_id != orgDetails.Org.Org_Creator_ID && request_obj.cmd_user_id != GeneralConfig.SYSTEM_WILDCARD_INT)
                    if (request_obj.cmd_user_id != orgDetails.creatorId && request_obj.cmd_user_id != GeneralConfig.SYSTEM_WILDCARD_INT)
                    {
                        //DCR_Base checkLimits = Utils.Check_Daily_Max_Not_Exceeded(request_obj.coreProj, resourceTSOList.timeScaleList, (int)resourceDetails.maxDailyUserSlots, appointmentData.creatorId, appointmentData.appointmentId, currentAppointmentTimePeriods);
                        IDCR_Base checkLimits = utils.Check_Daily_Max_Not_Exceeded(request_obj.coreProj, coreSc , resourceTSOList.timeScaleList, (int)resourceDetails.maxDailyUserSlots, appointmentData.creatorId, appointmentData.appointmentId, validation, currentAppointmentTimePeriods, coreDb);
                        if (checkLimits.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            resp.StatusAndMessage_CopyFrom(checkLimits);
                            return resp;
                        }
                    }


                    #endregion
                    #region loop all the resource details and check the appointment tsos are not too far in the future for the resource
                    if (resourceDetails.maxAppointmentFutureTimeInMs != 0)
                    {
                        Instant currentTime = Instant.FromDateTimeUtc(DateTime.Now.ToUniversalTime());
                        Instant resourceLimit = currentTime.Plus(Duration.FromMilliseconds(resourceDetails.maxAppointmentFutureTimeInMs));
                        foreach (BaseInstantStartStop tr in currentAppointmentTimePeriods)
                        {
                            if (resourceLimit < tr.stop)
                            {
                                resp.SetResponseInvalidParameter();
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                return resp;
                            }
                        }
                    }
                    #endregion

                    #region if the resource to be mapped allows overlapping then just create the TSO objects
                    if (resourceDetails.allowsOverlaps == Enum_SYS_BookingOverlap.OverLappingAllowed)
                    {
                        int newMapId;
                        //update all the TSO's
                        foreach (BaseTSo appointmentTSO in appointmentTSOs.timeScaleList)
                        {
                            DC_Create_Org_Resource_TimeScaleObj_Mapping createTimeScaleResMap = new DC_Create_Org_Resource_TimeScaleObj_Mapping(request_obj.coreProj);
                            createTimeScaleResMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            createTimeScaleResMap.orgId = request_obj.orgId;
                            createTimeScaleResMap.resourceId = request_obj.resourceId;
                            createTimeScaleResMap.tsoId = appointmentTSO.tsoId;
                            //IDCR_Added addedResTSOMap = ISCTSO.Create_TimePeriod_Resource_Map(IDcResourceTSO, ITsoResourceId, validation, IDatabaseOperationsTSO, dbs, dbo, utils, dbValid);
                            IDCR_Added addedResTSOMap = coreSc.Create_TimePeriod_Resource_Map(IDcResourceTSO, utils, ITsoResourceId, validation, coreSc, coreDb);

                            if (addedResTSOMap.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(addedResTSOMap);
                                resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                                File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Could Not Create TimePeriod Resource Map" + Environment.NewLine);
                                return resp;
                            }
                        }


                        if (coreDb.Create_Resource_Appointment_Mapping(request_obj.coreProj, request_obj, request_obj, out newMapId) == ENUM_DB_Status.DB_SUCCESS)
                        {
                            resp.Result = ENUM_Cmd_Add_Result.Added;
                            resp.NewRecordID = newMapId;
                            resp.SetResponseOk();
                            File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Created Resource Appointment Mapping - Woot!" + Environment.NewLine);
                            return resp;
                        }
                        else
                        {
                            resp.SetResponseServerError();
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Create Resource Appointment Mapping" + Environment.NewLine);
                            return resp;
                        }
                    }
                    #endregion
                    #region do this if the resource does not allow overlapping
                    #region get all the current appointment TSOs
                    //TODO: this might not need doing see above = currentAppointmentTimePeriods
                    #endregion

                    #region check if they conflict with the old TSO objects
                    DC_Org_Resource_Time_Range resourceTimeRange2 = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                    resourceTimeRange2.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    resourceTimeRange2.orgId = request_obj.orgId;
                    resourceTimeRange2.resourceId = request_obj.resourceId;
                    resourceTimeRange2.start = appointmentData.start;
                    resourceTimeRange2.end = DateTime.Now.AddDays(GeneralConfig.MAX_GENERATE_FUTURE_IN_DAYS).ToUniversalTime().ISO8601Str();

                    IDcrTsoList resourceTSOs = coreSc.Read_TimePeriods_For_Resource_Between_DateTime(IDCResourceTimeRange, utils, IResourceTimeRange, validation, coreSc, coreDb);

                    if (resourceTSOs.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceTSOs);
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Failed To Read Timeperiods For Resource Between DateTime" + Environment.NewLine);
                        return resp;
                    }
                    //List<BaseInstantStartStop> resourceTimeRanges = new List<BaseInstantStartStop>();
                    List<IInstantStartStop> resourceTimeRanges = new List<IInstantStartStop>();
                    //foreach (BaseTSo tsoDetails in resourceTSOs.timeScaleList)
                    foreach (ITSO tsoDetails in resourceTSOs.timeScaleList)
                    {
                        BaseInstantStartStop tr = new BaseInstantStartStop();
                        tr.start = InstantPattern.ExtendedIsoPattern.Parse(tsoDetails.start).Value;
                        tr.stop = InstantPattern.ExtendedIsoPattern.Parse(tsoDetails.end).Value;
                        resourceTimeRanges.Add(tr);
                    }
                    #endregion

                    #region if they conflict then disallow the add otherwise add the map to the existing appointment TSOS
                    //DCR_TimePeriod_List conflicts = Utils.GetConflictingTimePeriods(resourceTimeRanges, currentAppointmentTimePeriods);
                    List<IInstantStartStop> conflicts = utils.GetConflictingTimePeriods(resourceTimeRanges, currentAppointmentTimePeriods);
                    //if (conflicts.func_status != ENUM_Cmd_Status.ok)
                    //{
                    //    resp.StatusAndMessage_CopyFrom(conflicts);
                    //    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    //    File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Could not read Conflicting Time Periods" + Environment.NewLine);
                    //    return resp;
                    //}
                    if (conflicts.Count != 0)
                    {
                        //there are conflicts so cannot add
                        resp.SetResponsePermissionDenied();
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - The new time periods conflict with the old time periods" + Environment.NewLine);
                        return resp;
                    }
                    #endregion

                    #region create the link for the appointment + resource in the db
                    //foreach (BaseTSo tso in appointmentTSOs.timeScaleList)
                    foreach (ITSO tso in appointmentTSOs.timeScaleList)
                    {
                        DC_Create_Org_Resource_TimeScaleObj_Mapping resTsoMap = new DC_Create_Org_Resource_TimeScaleObj_Mapping(request_obj.coreProj);
                        resTsoMap.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resTsoMap.orgId = request_obj.orgId;
                        resTsoMap.resourceId = request_obj.resourceId;
                        resTsoMap.tsoId = tso.tsoId;

                        IDCR_Added createdTsoResMap = coreSc.Create_TimePeriod_Resource_Map(IDcResourceTSO, utils, ITsoResourceId, validation, coreSc, coreDb);

                        if (createdTsoResMap.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(createdTsoResMap);
                            resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                            File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Couldnt create the timeperiod resource map" + Environment.NewLine);
                            return resp;
                        }
                    }
                    int newMappingID;
                    if (coreDb.Create_Resource_Appointment_Mapping(request_obj.coreProj, request_obj, request_obj, out newMappingID) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.NewRecordID = newMappingID;
                        resp.Result = ENUM_Cmd_Add_Result.Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Created the resource appointment map -  Woot!!" + Environment.NewLine);
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                        File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Created the resource appointment map -  Woot!!" + Environment.NewLine);
                        resp.SetResponseServerError();
                    }
                    #endregion
                    #endregion
                }
                else
                {
                    File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Permission Denied" + Environment.NewLine);
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Add_Result.Not_Added;
                    return resp;
                }
            }
            else
            {
                File.AppendAllText(GeneralConfig.logFile, DateTime.Now.Ticks + " - Create_Appointment_Resource_Mapping - SC_Org_Appointments.cs - Invalid Request Parameters" + Environment.NewLine);
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDcrResourceAppointmentList Read_Org_Resources_Appointments_Between_DateTime(IDcOrgResourcesTimeRange request_obj, IUtils utils, IValidation validation, IResourcesTimeRange IResourcesTimeRange, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            IDcrResourceAppointmentList resp = new DCR_OrgResourcesAppointmentList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils,  request_obj, typeof(IDcOrgResourcesTimeRange)))
            {
                
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgResourceAppointmentsByResourceIDAndTimeRange))
                {
                    //TODO: check the range isnt huge
                    //TODO: check that the date is not = to min or too far in the future
                    List<BaseAppointmentComplete> appointments;
                    //get the time periods between the range
                    //loop the time periods and identify the unique appointment ids
                    //read the appointment details
                    //DC_Org_Resources_Time_Range modifiedRequest = new DC_Org_Resources_Time_Range(request_obj.coreProj, request_obj);
                    DC_Org_Resources_Time_Range modifiedRequest = new DC_Org_Resources_Time_Range(request_obj.coreProj);
                    modifiedRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;


                    IDcrResourcesTsoList resourceTimePeriods = coreSc.Read_TimePeriods_For_Resources_Between_DateTime(request_obj, utils, IResourcesTimeRange, validation, coreSc, coreDb);

                    if (resourceTimePeriods.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceTimePeriods);
                        return resp;
                    }

                    for (int i = 0; i < request_obj.resourceIdList.Count; i++)
                    {
                        Dictionary<int, List<ITSO>> unfiltered_timescaleObjs = new Dictionary<int, List<ITSO>>();
                        //foreach (BaseTSo tso in resourceTimePeriods.resourceTSOList[request_obj.resourceIdList[i]])
                        foreach (ITSO tso in resourceTimePeriods.resourceTSOList[request_obj.resourceIdList[i]])
                        {
                            if (tso.appointmentId != 0)
                            {
                                if (unfiltered_timescaleObjs.ContainsKey(tso.appointmentId))
                                {
                                    unfiltered_timescaleObjs[tso.appointmentId].Add(tso);
                                }
                                else
                                {
                                    List<ITSO> tmpList = new List<ITSO>();
                                    tmpList.Add(tso);
                                    unfiltered_timescaleObjs.Add(tso.appointmentId, tmpList);
                                }
                            }
                        }
                        //List<BaseAppointmentComplete> resApps = new List<BaseAppointmentComplete>();
                        List<IAppointmentComplete> resApps = new List<IAppointmentComplete>();
                        foreach (int exId in unfiltered_timescaleObjs.Keys)
                        {
                            DC_Org_Appointment_Id exRead = new DC_Org_Appointment_Id(request_obj.coreProj);
                            exRead.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            exRead.appointmentId = exId;
                            exRead.orgId = request_obj.orgId;
                            //DCR_Org_AppointmentOptions readAppointment = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(exRead);
                            IDcrAppointment readAppointment = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                            if (readAppointment.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(readAppointment);
                                return resp;
                            }
                            BaseAppointmentComplete baseAppointmentData = new BaseAppointmentComplete();
                            baseAppointmentData.creatorId = readAppointment.creatorId;
                            //baseAppointmentData.creatorEmail = readAppointment.creatorEmail;
                            baseAppointmentData.durationMilliseconds = readAppointment.durationMilliseconds;
                            baseAppointmentData.appointmentId = readAppointment.appointmentId;
                            baseAppointmentData.appointmentTitle = readAppointment.appointmentTitle;
                            baseAppointmentData.orgId = readAppointment.orgId;
                            baseAppointmentData.start = readAppointment.start;
                            baseAppointmentData.end = readAppointment.end;
                            baseAppointmentData.appointmentType = readAppointment.appointmentType;

                            //DCR_Id_List resourceMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(exRead);
                            IDcrIdList resourceMappedList = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                            if (resourceMappedList.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(resourceMappedList);
                                return resp;
                            }
                            baseAppointmentData.resourceIdList = resourceMappedList.ListOfIDs;

                            //DCR_Id_List calendarMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(exRead);
                            IDcrIdList calendarMappedList = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                            if (calendarMappedList.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(calendarMappedList);
                                return resp;
                            }
                            baseAppointmentData.calendarIdList = calendarMappedList.ListOfIDs;

                            //DCR_Id_List repeatMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(exRead);
                            IDcrIdList repeatMappedList = coreSc.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                            if (repeatMappedList.func_status != ENUM_Cmd_Status.ok)
                            {
                                //resp.StatusAndMessage_CopyFrom(calendarMappedList);
                                resp.StatusAndMessage_CopyFrom(repeatMappedList);

                                return resp;
                            }
                            foreach (int repeatId in repeatMappedList.ListOfIDs)
                            {
                                DC_Org_Repeat_Id repeatIdObj = new DC_Org_Repeat_Id(request_obj.coreProj);
                                repeatIdObj.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                                repeatIdObj.orgId = request_obj.orgId;
                                repeatIdObj.repeatId = repeatId;
                                //DCR_Repeat repeatDetails = SC_Org_Repeat.Read_Repeat(repeatIdObj);
                                IDcrRepeat repeatDetails = coreSc.Read_Repeat(IDcRepeatId, utils, validation, coreSc, coreDb);
                                if (repeatDetails.func_status != ENUM_Cmd_Status.ok)
                                {
                                    resp.StatusAndMessage_CopyFrom(repeatDetails);
                                    return resp;
                                }
                                else
                                {
                                    baseAppointmentData.repeatRules.Add(new BaseRepeat(repeatDetails));
                                }
                            }


                            foreach (ITSO tso in unfiltered_timescaleObjs[exId])
                            {
                                BaseTSo btso = new BaseTSo();
                                btso.appointmentId = tso.appointmentId;
                                btso.dateOfGeneration = tso.dateOfGeneration;
                                btso.durationMilliseconds = tso.durationMilliseconds;
                                btso.appointmentId = tso.appointmentId;
                                btso.orgId = tso.orgId;
                                btso.repeatId = tso.repeatId;
                                //btso.resourceIdList = tso.resourceIdList;
                                btso.start = tso.start;
                                btso.end = tso.end;
                                btso.tsoId = tso.tsoId;
                                btso.bookableSlot = false;
                                baseAppointmentData.timeScaleList.Add(btso);

                            }
                            resApps.Add(baseAppointmentData);
                        }

                        //BaseResourceAppointmentComplete resApCompl = new BaseResourceAppointmentComplete();
                        BaseResourceAppointmentComplete resApCompl = new BaseResourceAppointmentComplete();
                        resApCompl.resourceId = request_obj.resourceIdList[i];
                        resApCompl.listOfAppointments = resApps;
                        resp.ResourceAppointments.Add(resApCompl);
                    }
                    //resp.orgId = request_obj.orgId;
                    resp.SetResponseOk();
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDcrResourceAppointmentList Read_Org_Resource_Appointments_Between_DateTime(IDCResourceTimeRange request_obj, IUtils utils, IValidation validation, IResourceTimeRange IResourceTimeRange, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            IDcrResourceAppointmentList resp = new DCR_OrgResourceAppointmentList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils,  request_obj, typeof(IDCResourceTimeRange)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgResourceAppointmentsByResourceIDAndTimeRange))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgResourceAppointmentsByResourceIDAndTimeRange))
                {
                    //TODO: check the range isnt huge
                    //TODO: check that the date is not = to min or too far in the future
                    List<BaseAppointmentComplete> appointments;
                    //get the time periods between the range
                    //loop the time periods and identify the unique appointment ids
                    //read the appointment details
                    //DC_Org_Resource_Time_Range modifiedRequest = new DC_Org_Resource_Time_Range(request_obj.coreProj, request_obj);
                    DC_Org_Resource_Time_Range modifiedRequest = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                    modifiedRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;

                    //IDcrTsoList resourceTimePeriods = SC_TSO.Read_TimePeriods_For_Resource_Between_DateTime(modifiedRequest);
                    IDcrTsoList resourceTimePeriods = coreSc.Read_TimePeriods_For_Resource_Between_DateTime(request_obj, utils, IResourceTimeRange, validation, coreSc, coreDb);
                    if (resourceTimePeriods.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceTimePeriods);
                        return resp;
                    }

                    //there is a bug here in that we return multiple TSOs with the same ID this is where you left off.

                    Dictionary<int, List<ITSO>> unfiltered_timescaleObjs = new Dictionary<int, List<ITSO>>();
                    //foreach (BaseTSo tso in resourceTimePeriods.timeScaleList)
                    foreach (ITSO tso in resourceTimePeriods.timeScaleList)
                    {
                        if (tso.appointmentId != 0)
                        {
                            if (unfiltered_timescaleObjs.ContainsKey(tso.appointmentId))
                            {
                                unfiltered_timescaleObjs[tso.appointmentId].Add(tso);
                            }
                            else
                            {
                                List<ITSO> tmpList = new List<ITSO>();
                                tmpList.Add(tso);
                                unfiltered_timescaleObjs.Add(tso.appointmentId, tmpList);
                            }
                        }
                    }

                    foreach (int exId in unfiltered_timescaleObjs.Keys)
                    {
                        DC_Org_Appointment_Id exRead = new DC_Org_Appointment_Id(request_obj.coreProj);
                        exRead.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        exRead.appointmentId = exId;
                        exRead.orgId = request_obj.orgId;
                        //DCR_Org_AppointmentOptions readAppointment = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(exRead);
                        IDcrAppointment readAppointment = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (readAppointment.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(readAppointment);
                            return resp;
                        }
                        IAppointmentComplete baseAppointmentData = new BaseAppointmentComplete();
                        baseAppointmentData.creatorId = readAppointment.creatorId;
                        baseAppointmentData.creatorEmail = coreDb.GetLoginNameFromUserID(request_obj.coreProj, readAppointment.creatorId);
                        baseAppointmentData.durationMilliseconds = readAppointment.durationMilliseconds;
                        baseAppointmentData.appointmentId = readAppointment.appointmentId;
                        baseAppointmentData.appointmentTitle = readAppointment.appointmentTitle;
                        baseAppointmentData.orgId = readAppointment.orgId;
                        baseAppointmentData.start = readAppointment.start;
                        baseAppointmentData.end = readAppointment.end;
                        baseAppointmentData.appointmentType = readAppointment.appointmentType;

                        //DCR_Id_List resourceMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(exRead);
                        IDcrIdList resourceMappedList = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (resourceMappedList.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(resourceMappedList);
                            return resp;
                        }
                        baseAppointmentData.resourceIdList = resourceMappedList.ListOfIDs;

                        //DCR_Id_List calendarMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(exRead);
                        IDcrIdList calendarMappedList = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (calendarMappedList.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(calendarMappedList);
                            return resp;
                        }
                        baseAppointmentData.calendarIdList = calendarMappedList.ListOfIDs;

                        //DCR_Id_List repeatMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(exRead);
                        IDcrIdList repeatMappedList = coreSc.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (repeatMappedList.func_status != ENUM_Cmd_Status.ok)
                        {
                            //resp.StatusAndMessage_CopyFrom(calendarMappedList);
                            resp.StatusAndMessage_CopyFrom(repeatMappedList);
                            return resp;
                        }
                        foreach (int repeatId in repeatMappedList.ListOfIDs)
                        {
                            DC_Org_Repeat_Id repeatIdObj = new DC_Org_Repeat_Id(request_obj.coreProj);
                            repeatIdObj.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            repeatIdObj.orgId = request_obj.orgId;
                            repeatIdObj.repeatId = repeatId;
                            //DCR_Repeat repeatDetails = SC_Org_Repeat.Read_Repeat(repeatIdObj);
                            IDcrRepeat repeatDetails = coreSc.Read_Repeat(IDcRepeatId, utils, validation, coreSc, coreDb);
                            if (repeatDetails.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(repeatDetails);
                                return resp;
                            }
                            else
                            {
                                baseAppointmentData.repeatRules.Add(new BaseRepeat(repeatDetails));
                            }
                        }


                        foreach (ITSO tso in unfiltered_timescaleObjs[exId])
                        {
                            BaseTSo btso = new BaseTSo();
                            btso.appointmentId = tso.appointmentId;
                            btso.dateOfGeneration = tso.dateOfGeneration;
                            btso.durationMilliseconds = tso.durationMilliseconds;
                            btso.appointmentId = tso.appointmentId;
                            btso.orgId = tso.orgId;
                            btso.repeatId = tso.repeatId;
                            //btso.resourceIdList = tso.resourceIdList;
                            btso.start = tso.start;
                            btso.end = tso.end;
                            btso.tsoId = tso.tsoId;
                            btso.bookableSlot = false;
                            baseAppointmentData.timeScaleList.Add(btso);

                        }
                        IResourceAppointmentComplete baseResApCom = new BaseResourceAppointmentComplete();
                        baseResApCom.resourceId = request_obj.resourceId;
                        baseResApCom.listOfAppointments.Add(baseAppointmentData);
                        resp.ResourceAppointments.Add(baseResApCom);
                    }

                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
                resp.SetResponseOk();
            }
            else
            {
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDcrCalendarAppointmentList Read_Org_Calendar_Appointments_Between_TimeRange(IDcCalendarTimeRange request_obj, IUtils utils, IValidation validation, ICalendarTimeRange ICalendarTimeRange, IDcAppointmentId IDcAppointmentId, IDcRepeatId IDcRepeatId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            IDcrCalendarAppointmentList resp = new DCR_OrgCalendarAppointmentList();
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Org_Calendar_Time_Range), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcCalendarTimeRange)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgCalendarAppointmentsBetweenTimeRange))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readOrgCalendarAppointmentsBetweenTimeRange))
                {
                    //TODO: check the range isnt huge
                    //TODO: check that the date is not = to min or too far in the future
                    List<BaseAppointmentComplete> appointments;
                    //get the time periods between the range
                    //loop the time periods and identify the unique appointment ids
                    //read the appointment details
                    //DC_Org_Calendar_Time_Range modifiedRequest = new DC_Org_Calendar_Time_Range(request_obj.coreProj, request_obj);
                    DC_Org_Calendar_Time_Range modifiedRequest = new DC_Org_Calendar_Time_Range(request_obj.coreProj);
                    modifiedRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;

                    //DCR_Org_TSO_List calendarTimePeriods = SC_TSO.Read_TimePeriods_For_Calendar_Between_DateTime(modifiedRequest);
                    IDcrTsoList calendarTimePeriods = coreSc.Read_TimePeriods_For_Calendar_Between_DateTime(request_obj, utils, ICalendarTimeRange, validation, coreSc, coreDb);
                    if (calendarTimePeriods.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarTimePeriods);
                        return resp;
                    }
                    Dictionary<int, List<ITSO>> unfiltered_timescaleObjs = new Dictionary<int, List<ITSO>>();
                    //foreach (BaseTSo tso in calendarTimePeriods.timeScaleList)
                    foreach (ITSO tso in calendarTimePeriods.timeScaleList)
                    {
                        if (tso.appointmentId != 0)
                        {
                            if (unfiltered_timescaleObjs.ContainsKey(tso.appointmentId))
                            {
                                unfiltered_timescaleObjs[tso.appointmentId].Add(tso);
                            }
                            else
                            {
                                List<ITSO> tmpList = new List<ITSO>();
                                tmpList.Add(tso);
                                unfiltered_timescaleObjs.Add(tso.appointmentId, tmpList);
                            }
                        }
                    }

                    foreach (int exId in unfiltered_timescaleObjs.Keys)
                    {
                        DC_Org_Appointment_Id appId = new DC_Org_Appointment_Id(request_obj.coreProj);
                        appId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        appId.appointmentId = exId;
                        appId.orgId = request_obj.orgId;
                        //DCR_Org_AppointmentOptions readAppointment = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(appId);
                        IDcrAppointment readAppointment = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (readAppointment.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(readAppointment);
                            return resp;
                        }
                        BaseAppointmentComplete baseAppointmentData = new BaseAppointmentComplete();
                        baseAppointmentData.creatorId = readAppointment.creatorId;
                        baseAppointmentData.creatorEmail = coreDb.GetLoginNameFromUserID(request_obj.coreProj, readAppointment.creatorId);
                        baseAppointmentData.durationMilliseconds = readAppointment.durationMilliseconds;
                        baseAppointmentData.appointmentId = readAppointment.appointmentId;
                        baseAppointmentData.appointmentTitle = readAppointment.appointmentTitle;
                        baseAppointmentData.orgId = readAppointment.orgId;
                        baseAppointmentData.start = readAppointment.start;
                        baseAppointmentData.end = readAppointment.end;
                        baseAppointmentData.appointmentType = readAppointment.appointmentType;

                        //DCR_Id_List calendarMappedList = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appId);
                        IDcrIdList calendarMappedList = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                        if (calendarMappedList.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(calendarMappedList);
                            return resp;
                        }
                        baseAppointmentData.calendarIdList = calendarMappedList.ListOfIDs;
                        foreach (ITSO tso in unfiltered_timescaleObjs[exId])
                        {
                            BaseTSo btso = new BaseTSo();
                            btso.appointmentId = tso.appointmentId;
                            btso.dateOfGeneration = tso.dateOfGeneration;
                            btso.durationMilliseconds = tso.durationMilliseconds;
                            btso.appointmentId = tso.appointmentId;
                            btso.orgId = tso.orgId;
                            btso.repeatId = tso.repeatId;
                            //btso.calendarIdList = tso.calendarIdList;
                            btso.start = tso.start;
                            btso.end = tso.end;
                            btso.tsoId = tso.tsoId;
                            btso.bookableSlot = false;
                            baseAppointmentData.timeScaleList.Add(btso);

                        }
                        //DCR_Id_List repeatIds = SC_Org_Appointments.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(appId);
                        IDcrIdList repeatIds = coreSc.Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);

                        if (repeatIds.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(repeatIds);
                            return resp;
                        }
                        foreach (int repeatId in repeatIds.ListOfIDs)
                        {
                            DC_Org_Repeat_Id repeatIdObj = new DC_Org_Repeat_Id(request_obj.coreProj);
                            repeatIdObj.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            repeatIdObj.orgId = request_obj.orgId;
                            repeatIdObj.repeatId = repeatId;
                            //DCR_Repeat repeatDetails = SC_Org_Repeat.Read_Repeat(repeatIdObj);
                            IDcrRepeat repeatDetails = coreSc.Read_Repeat(IDcRepeatId, utils, validation, coreSc, coreDb);
                            if (repeatDetails.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(repeatDetails);
                                return resp;
                            }
                            baseAppointmentData.repeatRules.Add(new BaseRepeat(repeatDetails));
                        }
                        resp.listOfAppointments.Add(baseAppointmentData);
                    }

                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
                resp.orgId = request_obj.orgId;
                resp.calendarId = request_obj.calendarId;
                resp.SetResponseOk();
            }
            else
            {
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }


        public IDCR_Delete Delete_Org_Appointment_Resource_Mapping(IDcResourceAppointmentId request_obj, IUtils utils, IValidation validation, IDCResourceTimeRange IDCResourceTimeRange, IDcAppointmentId IDcAppointmentId, IDcTsoId IDcTsoId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Org_Resource_Appointment_Id), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils, request_obj, typeof(IDcResourceAppointmentId)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteOrgAppointmentResourceMapping))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteOrgAppointmentResourceMapping))
                {
                    //TODO: this function can be optimized
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.orgId = request_obj.orgId;
                    DC_Org_Resource_Time_Range resourceTimeRange = new DC_Org_Resource_Time_Range(request_obj.coreProj);
                    resourceTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    resourceTimeRange.orgId = request_obj.orgId;
                    resourceTimeRange.resourceId = request_obj.resourceId;
                    resourceTimeRange.start = GeneralConfig.DEFAULT_SYSTEM_MIN_DATE;
                    resourceTimeRange.end = GeneralConfig.DEFAULT_SYSTEM_MAX_DATE;
                    //DCR_Id_List resourceTSOs = SC_Org_Resources.Read_Resource_TSOs_By_Resource_ID_TimeRange(resourceTimeRange);
                    IDcrIdList resourceTSOs = coreSc.Read_Resource_TSOs_By_Resource_ID_TimeRange(IDCResourceTimeRange, utils, validation, coreSc, coreDb);
                    if (resourceTSOs.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(resourceTSOs);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }

                    //DCR_Id_List appointmentIds = SC_Org_Appointments.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(appointmentId);
                    IDcrIdList appointmentIds = coreSc.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentIds);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }

                    List<int> matchedTSOids = resourceTSOs.ListOfIDs.Intersect(appointmentIds.ListOfIDs).ToList();
                    if (matchedTSOids.Count >= 0)
                    {
                        //there are tsos to be removed
                        DC_Org_TSO_ID deleteTso = new DC_Org_TSO_ID(request_obj.coreProj);
                        deleteTso.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        deleteTso.orgId = request_obj.orgId;
                        foreach (int tsoId in matchedTSOids)
                        {
                            deleteTso.tsoId = tsoId;
                            //DCR_Delete deletedTso = SC_TSO.Delete_TimePeriod(deleteTso);
                            IDCR_Delete deletedTso = coreSc.Delete_TimePeriod(IDcTsoId, coreSc, coreDb);
                            if (deletedTso.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(deletedTso);
                                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                                return resp;
                            }
                        }
                    }
                    if (coreDb.Delete_Appointment_Resource_Mapping(request_obj.coreProj, request_obj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                        resp.SetResponseOk();
                        return resp;
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
            }
            return resp;
        }

        public IDCR_Delete Delete_Org_Appointment_Calendar_Mapping(IDcMapCalendarAppointment request_obj, IUtils utils, IValidation validation, ICalendarTimeRange ICalendarTimeRange, IDcCalendarTimeRange IDcCalendarTimeRange, IDcAppointmentId IDcAppointmentId, IDcTsoId IDcTsoId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils,  request_obj, typeof(IDcMapCalendarAppointment)))
            {
                
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteOrgAppointmentCalendarMapping))
                {
                    //TODO: this function can be optimized
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.orgId = request_obj.orgId;
                    DC_Org_Calendar_Time_Range calendarTimeRange = new DC_Org_Calendar_Time_Range(request_obj.coreProj);
                    calendarTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    calendarTimeRange.orgId = request_obj.orgId;
                    calendarTimeRange.calendarId = request_obj.calendarId;
                    calendarTimeRange.start = GeneralConfig.DEFAULT_SYSTEM_MIN_DATE;
                    calendarTimeRange.end = GeneralConfig.DEFAULT_SYSTEM_MAX_DATE;
                    //DCR_Id_List calendarTSOs = SC_Org_Calendars.Read_Org_Calendar_TSOs_By_Calendar_ID_And_TimeRange(calendarTimeRange);
                    IDcrIdList calendarTSOs = coreSc.Read_Org_Calendar_TSOs_By_Calendar_ID_And_TimeRange(IDcCalendarTimeRange, validation, utils, IDcCalendarTimeRange, IDcCalendarTimeRange, coreSc, coreDb);

                    if (calendarTSOs.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(calendarTSOs);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }

                    //DCR_Id_List appointmentIds = SC_Org_Appointments.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(appointmentId);
                    IDcrIdList appointmentIds = coreSc.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentIds);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }

                    List<int> matchedTSOids = calendarTSOs.ListOfIDs.Intersect(appointmentIds.ListOfIDs).ToList();
                    if (matchedTSOids.Count >= 0)
                    {
                        //there are tsos to be removed
                        DC_Org_TSO_ID deleteTso = new DC_Org_TSO_ID(request_obj.coreProj);
                        deleteTso.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        deleteTso.orgId = request_obj.orgId;
                        foreach (int tsoId in matchedTSOids)
                        {
                            deleteTso.tsoId = tsoId;
                            //DCR_Delete deletedTso = SC_TSO.Delete_TimePeriod(deleteTso);
                            IDCR_Delete deletedTso = coreSc.Delete_TimePeriod(IDcTsoId, coreSc, coreDb);
                            if (deletedTso.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(deletedTso);
                                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                                return resp;
                            }
                        }
                    }
                    if (coreDb.Delete_Appointment_Calendar_Mapping(request_obj.coreProj, request_obj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                        resp.SetResponseOk();
                        return resp;
                    }
                    else
                    {
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
            }
            return resp;
        }


        public IDcrIdList Read_All_Org_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
            
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcAppointmentId)))
            {
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils,  request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_readAllOrgAppointmentRepeatMappingsByAppointmentID))
                {
                    List<int> repeatIds;
                    if (coreDb.Read_Appointment_Repeat_Mappings(request_obj.coreProj, request_obj, out repeatIds) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = repeatIds;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        return resp;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }

        public IDCR_Update Update_Appointment(IDcUpdateAppointment request_obj, IUtils utils, IValidation validation, IDcAppointmentId IDcAppointmentId, IDcCalendarId IDcCalendarId, IDcOrgResourceId IDcOrgResourceId, IDcTSOResourceId IDcTSOResourceId, IDcAppointmentRepeatId IDcAppointmentRepeatId, IDcTSOCalendarId IDcTSOCalendarId, IDcTsoId IDcTsoId, ITSO ITSO, IUpdateTSO IUpdateTSO, IDcCreateRepeat IDcCreateRepeat, IDcCalendarTimeRange IDcCalendarTimeRange, IDcResourceTSO IDcResourceTSO, IDcCalendarTSO IDcCalendarTSO, ITsoResourceId ITsoResourceId, IOrgTsoCalendarId IOrgTsoCalendarId, IDcCalendarsTSOs IDcCalendarsTSOs, IDcRepeatId IDcRepeatId, IDCResourceTimeRange IDCResourceTimeRange, IListOfOrgTsoCalendarIds IListOfOrgTsoCalendarIds, IDcTso IDcTso, IDcTsos IDcTsos, IDcMapRepeatAppointment IDcMapRepeatAppointment, IResourceTimeRange IResourceTimeRange, IDcOrgId IDcOrgId, ICalendarTimeRange ICalendarTimeRange, IDcMapResourceAppointment IDcMapResourceAppointment, IDcMapCalendarAppointment IDcMapCalendarAppointment, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Update resp = new DCR_Update();
            //TODO: check that appointmentId adjustments are allowed if the appointmentId being modified is ok
            //TODO: infact i think you have alot more validation to do when updating the appointmentId times
            //TODO: make it more generic so the same functionality can be used for appointments
            //TODO: check that the appointmentId is owned by the command issuer
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Update_Org_Appointment), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcUpdateAppointment)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_updateAppointment))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_updateAppointment))
                {
                    if (request_obj.calendarIdList.Count == 0 && request_obj.resourceIdList.Count == 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #region read the previous appointment options
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.orgId = request_obj.orgId;
                    //DCR_Org_AppointmentOptions appointmentOptions = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(appointmentId);
                    IDcrAppointment appointmentOptions = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);

                    if (appointmentOptions.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentOptions);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion
                    #region compare the appointment options for differences and make sure RO are the same
                    //check that the read only stuff hasnt changed
                    if (request_obj.creatorId != appointmentOptions.creatorId ||
                        request_obj.orgId != appointmentOptions.orgId
                      )
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    //the rest is either checked later or irrelevant and can be just written to the database
                    #endregion

                    #region read the previous appointment resource mappings
                    //DCR_Id_List currentAppointmentResourceMappings = SC_Org_Appointments.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList currentAppointmentResourceMappings = coreSc.Read_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (currentAppointmentResourceMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(currentAppointmentResourceMappings);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion
                    #region read the previous appointment calendar mappings
                    //DCR_Id_List currentAppointmentCalendarMappings = SC_Org_Appointments.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentId);
                    IDcrIdList currentAppointmentCalendarMappings = coreSc.Read_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (currentAppointmentCalendarMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(currentAppointmentCalendarMappings);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region make sure calendars and resources arent both mapped
                    if (request_obj.calendarIdList.Count > 0 && request_obj.resourceIdList.Count > 0)
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region read the current repeat instances
                    IDcrTsoList originalAppointmentTSOList = coreSc.Read_All_TimePeriods_For_Appointment(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (originalAppointmentTSOList.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(originalAppointmentTSOList);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    if (originalAppointmentTSOList.timeScaleList.Count != 1)
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region we are definitely making an update so lets generate the new tso objects
                    BaseInstantStartStop appointmentTR = new BaseInstantStartStop();

                    appointmentTR.start = InstantPattern.ExtendedIsoPattern.Parse(request_obj.start).Value;
                    appointmentTR.stop = InstantPattern.ExtendedIsoPattern.Parse(request_obj.end).Value;

                    //List<BaseInstantStartStop> allTSOs = new List<BaseInstantStartStop>();
                    List<IInstantStartStop> allTSOs = new List<IInstantStartStop>();

                    allTSOs.Add(appointmentTR);
                    //List<List<BaseInstantStartStop>> repeatTSOs = new List<List<BaseInstantStartStop>>();
                    List<IInstantStartStop> repeatTSOs = new List<IInstantStartStop>();
                    for (int i = 0; i < request_obj.repeatRuleOptions.Count; i++)
                    {
                        //if there are repeat rules then generate the repeated time periods
                        BaseStartStop trange = new BaseStartStop();
                        trange.start = request_obj.start;
                        trange.end = request_obj.end;
                        //DCR_Org_TimePeriod_List fullTsoList = Utils.GenerateRepeatTimePeriods(request_obj.coreProj, trange, request_obj.repeatRuleOptions[i], request_obj.timeZoneIANA, true);
                        List<IInstantStartStop> fullTsoList = utils.GenerateRepeatTimePeriods(request_obj.coreProj, coreSc, trange, request_obj.repeatRuleOptions[i], request_obj.timeZoneIANA, true, coreDb);
                        //if (fullTsoList.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    resp.StatusAndMessage_CopyFrom(fullTsoList);
                        //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        //    return resp;
                        //}
                        //foreach (BaseInstantStartStop tr in fullTsoList.TimePeriods)



                        foreach (IInstantStartStop tr in fullTsoList)
                        {
                            //i think this will need to be removed as it will occur below
                            //allTSOs.Add(tr);
                            repeatTSOs.Add(tr);
                        }
                    }
                    #endregion

                    //depending on the update type we need to generate a different set of events
                    #region Update according to ENUM_Repeat_UpdateType

                    IDcrTSO tsoDetail = null;

                    if (request_obj.tsoId > 0)
                    {
                        //call this witht he request_obj.tsoId
                        IDcTsoId.tsoId = request_obj.tsoId;
                        tsoDetail = coreSc.Read_TSo(IDcTsoId, utils, validation, coreSc, coreDb);
                        if (tsoDetail.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(tsoDetail);
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                    }
                    if (request_obj.updateAppointmentType == ENUM_Repeat_UpdateType.Update_All)
                    {
                        //no special logic we just generate a new set with the new data
                        foreach (IInstantStartStop tr in repeatTSOs)
                        {
                            allTSOs.Add(tr);
                        }
                    }
                    else if (request_obj.updateAppointmentType == ENUM_Repeat_UpdateType.Update_All_After_Tsoid)
                    {
                        //if this is set we need to only update the tso's which appear after the tsoId specified in the request object which should be found in originalAppointmentTSOList
                        //loop the originalAppointmentTSOList
                        //add all of the entries into allTSOs until reaching the tsoId specified
                        //then add all of the entries in repeatTSOs which occur after the end date of the tsoid specified into allTSOs
                        if (tsoDetail == null)
                        {
                            resp.SetResponseServerError();
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                        List<ITSO> listOfITSO = originalAppointmentTSOList.timeScaleList.Where(x => InstantPattern.ExtendedIsoPattern.Parse(x.end).Value < InstantPattern.ExtendedIsoPattern.Parse(tsoDetail.start).Value).ToList();

                        allTSOs.AddRange(utils.CONVERT_ITSOListToInstantList(listOfITSO));
                        allTSOs.AddRange(repeatTSOs.Where(x => x.start > InstantPattern.ExtendedIsoPattern.Parse(tsoDetail.end).Value));

                    }
                    else if (request_obj.updateAppointmentType == ENUM_Repeat_UpdateType.Update_Single_Tsoid)
                    {
                        //if this is set we need to only update the single tso's which match the tsoId specified in originalAppointmentTSOList
                        //loop the originalAppointmentTSOList
                        //add all of the entries into allTSOs until reaching the tsoId specified 
                        //modify the tsoid event
                        //continue looping and add into allTSOs
                        if (tsoDetail == null)
                        {
                            resp.SetResponseServerError();
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                        List<ITSO> listOfITSO = originalAppointmentTSOList.timeScaleList.Where(x => x.tsoId == tsoDetail.tsoId).ToList();
                        allTSOs.AddRange(utils.CONVERT_ITSOListToInstantList(listOfITSO));
                        BaseTSo tsoNew = new BaseTSo((ITSO)tsoDetail);
                        tsoNew.start = request_obj.start;
                        tsoNew.end = request_obj.end;
                        allTSOs.AddRange(utils.CONVERT_ITSOListToInstantList(new List<ITSO>() { tsoNew }));

                    }
                    else
                    {
                        resp.SetResponseInvalidParameter();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }

                    #endregion
                    //Below here no need to change, it just creates the new objects from allTSOs

                    #region check that the repeat config doesnt cause an overlap
                    //foreach (BaseInstantStartStop trToCheck in allTSOs)
                    foreach (IInstantStartStop trToCheck in allTSOs)
                    {
                        //List<BaseInstantStartStop> alreadyAllocatedTSOList = new List<BaseInstantStartStop>();
                        List<IInstantStartStop> alreadyAllocatedTSOList = new List<IInstantStartStop>();
                        alreadyAllocatedTSOList.Add(trToCheck);
                        //List<BaseInstantStartStop> filterdTSOs = Utils.COPY_TimePeriodCollection(allTSOs);
                        List<IInstantStartStop> filterdTSOs = utils.COPY_TimePeriodCollection(allTSOs);

                        filterdTSOs.Remove(trToCheck);
                        //DCR_TimePeriod_List selfConflictList = Utils.GetConflictingTimePeriods(alreadyAllocatedTSOList, filterdTSOs);
                        List<IInstantStartStop> selfConflictList = utils.GetConflictingTimePeriods(alreadyAllocatedTSOList, filterdTSOs);
                        //if (selfConflictList.func_status != ENUM_Cmd_Status.ok)
                        //{
                        //    resp.StatusAndMessage_CopyFrom(selfConflictList);
                        //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        //    return resp;
                        //}
                        //if (selfConflictList.TimePeriods.Count > 0)
                        // Need to resolve
                        if (selfConflictList.Count > 0)
                        {
                            resp.SetResponseInvalidParameter();
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                    }
                    #endregion

                    #region we are linking calendars
                    if (request_obj.calendarIdList.Count > 0)
                    {
                        DC_Org_Calendar_ID calendarTimeRange = new DC_Org_Calendar_ID(request_obj.coreProj);
                        calendarTimeRange.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        //calendarTimeRange.start = GeneralConfig.DEFAULT_SYSTEM_MIN_DATE;
                        //calendarTimeRange.end = GeneralConfig.DEFAULT_SYSTEM_MAX_DATE;
                        calendarTimeRange.orgId = request_obj.orgId;
                        foreach (int calendarId in request_obj.calendarIdList)
                        {
                            calendarTimeRange.calendarId = calendarId;

                            //IDcrTsoList calendarTSOs = ISCTSO.Read_All_TimePeriods_For_Calendar(IDcCalendarId, validation, dbs, dbo, utils, IDatabaseOperationsTSO,dbValid);
                            IDcrTsoList calendarTSOs = coreSc.Read_All_TimePeriods_For_Calendar(IDcCalendarId, utils, validation, coreSc, coreDb);
                            if (calendarTSOs.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(calendarTSOs);
                                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                return resp;
                            }
                            #region filter out the tso's belonging to the appointment we are updating as they will be changed or are not valid conflicts
                            //List<BaseTSo> listOfTimePeriodsBelongingToOtherAppointments = new List<BaseTSo>();
                            List<ITSO> listOfTimePeriodsBelongingToOtherAppointments = new List<ITSO>();

                            //foreach (BaseTSo tsoData in calendarTSOs.timeScaleList)
                            foreach (ITSO tsoData in calendarTSOs.timeScaleList)
                            {
                                if (tsoData.appointmentId != request_obj.appointmentId)
                                {
                                    listOfTimePeriodsBelongingToOtherAppointments.Add(tsoData);
                                }
                            }
                            #endregion
                            //DCR_TimePeriod_List conflictList = Utils.GetConflictingTimePeriods(Utils.CONVERT_BaseTSOToInstantList(listOfTimePeriodsBelongingToOtherAppointments), allTSOs);
                            List<IInstantStartStop> conflictList = utils.GetConflictingTimePeriods(utils.CONVERT_ITSOListToInstantList(listOfTimePeriodsBelongingToOtherAppointments), allTSOs);
                            //if (conflictList.func_status != ENUM_Cmd_Status.ok)
                            //{
                            //    resp.StatusAndMessage_CopyFrom(conflictList);
                            //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            //    return resp;
                            //}
                            //if (conflictList.TimePeriods.Count > 0)

                            //Need to resolve
                            if (conflictList.Count > 0)
                            {
                                resp.SetResponsePermissionDenied();
                                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                return resp;
                            }
                            #region we need to check all the objects the calendar is also linked to can accept the new modifications
                            #region check the resources can take the new calendar appointment
                            DC_Org_Calendar_ID calendarIdRequest = new DC_Org_Calendar_ID(request_obj.coreProj);
                            calendarIdRequest.calendarId = calendarId;
                            calendarIdRequest.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            calendarIdRequest.orgId = request_obj.orgId;

                            //IDcrIdList calendarResourceIdList = ISCOrgCalendars.Read_All_Org_Calendar_Resource_Mappings_By_Calendar_ID(IDcCalendarId, dbs, dbo, IDatabaseOperationsCalendars, utils, dbValid, validation);
                            IDcrIdList calendarResourceIdList = coreSc.Read_All_Org_Calendar_Resource_Mappings_By_Calendar_ID(IDcCalendarId, validation, utils, coreSc, coreDb);
                            if (calendarResourceIdList.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(calendarResourceIdList);
                                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                return resp;
                            }
                            DC_Org_Resource_ID resourceId = new DC_Org_Resource_ID(request_obj.coreProj);
                            resourceId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                            resourceId.orgId = request_obj.orgId;
                            foreach (int resId in calendarResourceIdList.ListOfIDs)
                            {
                                resourceId.resourceId = resId;
                                //DCR_Org_TSO_List resTsoList = SC_TSO.Read_All_TimePeriods_For_Resource(resourceId);
                                IDcrTsoList resTsoList = coreSc.Read_All_TimePeriods_For_Resource(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                                if (resTsoList.func_status != ENUM_Cmd_Status.ok)
                                {
                                    resp.StatusAndMessage_CopyFrom(resTsoList);
                                    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                    return resp;
                                }
                                //List<BaseInstantStartStop> tpc = new List<BaseInstantStartStop>();
                                List<IInstantStartStop> tpc = new List<IInstantStartStop>();
                                //foreach (BaseTSo tsoDetails in resTsoList.timeScaleList)
                                foreach (ITSO tsoDetails in resTsoList.timeScaleList)
                                {
                                    if (tsoDetails.appointmentId != request_obj.appointmentId)
                                    {
                                        //tpc.Add(Utils.CONVERT_ITSoToTimeRange(tsoDetails));
                                        tpc.Add(utils.CONVERT_ITSoToTimeRange(tsoDetails));
                                    }
                                }
                                //DCR_TimePeriod_List conflictedTimePeriods = Utils.GetConflictingTimePeriods(tpc, allTSOs);
                                List<IInstantStartStop> conflictedTimePeriods = utils.GetConflictingTimePeriods(tpc, allTSOs);
                                //if (conflictedTimePeriods.func_status != ENUM_Cmd_Status.ok)
                                //{
                                //    resp.StatusAndMessage_CopyFrom(conflictedTimePeriods);
                                //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                //    return resp;
                                //}
                                // need to resolve
                                if (conflictedTimePeriods.Count > 0)
                                {
                                    resp.SetResponseInvalidParameter();
                                    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                    return resp;
                                }

                            }
                            #endregion
                            #endregion
                        }
                    }
                    #endregion

                    #region we are linking resources
                    else if (request_obj.resourceIdList.Count > 0)
                    {
                        DC_Org_Resource_ID resourceId = new DC_Org_Resource_ID(request_obj.coreProj);
                        resourceId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        resourceId.orgId = request_obj.orgId;
                        foreach (int resId in request_obj.resourceIdList)
                        {
                            resourceId.resourceId = resId;
                            //DCR_Org_TSO_List resTsoList = SC_TSO.Read_All_TimePeriods_For_Resource(resourceId);
                            IDcrTsoList resTsoList = coreSc.Read_All_TimePeriods_For_Resource(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                            if (resTsoList.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(resTsoList);
                                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                return resp;
                            }
                            #region filter out the tso's belonging to the appointment we are updating as they will be changed or are not valid conflicts
                            //List<BaseInstantStartStop> tpc = new List<BaseInstantStartStop>();
                            List<IInstantStartStop> tpc = new List<IInstantStartStop>();
                            //foreach (BaseTSo tsoDetails in resTsoList.timeScaleList)
                            foreach (ITSO tsoDetails in resTsoList.timeScaleList)
                            {
                                if (tsoDetails.appointmentId != request_obj.appointmentId)
                                {
                                    //tpc.Add(Utils.CONVERT_ITSoToTimeRange(tsoDetails));
                                    tpc.Add(utils.CONVERT_ITSoToTimeRange(tsoDetails));
                                }
                            }
                            #endregion
                            //DCR_TimePeriod_List conflictedTimePeriods = Utils.GetConflictingTimePeriods(tpc, allTSOs);
                            List<IInstantStartStop> conflictedTimePeriods = utils.GetConflictingTimePeriods(tpc, allTSOs);
                            //if (conflictedTimePeriods.func_status != ENUM_Cmd_Status.ok)
                            //{
                            //    resp.StatusAndMessage_CopyFrom(conflictedTimePeriods);
                            //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            //    return resp;
                            //}
                            //if (conflictedTimePeriods.Count > 0)
                            //{
                            //    resp.SetResponseInvalidParameter();
                            //    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            //    return resp;
                            //}

                            //DCR_Org_Resource resourceDetail = SC_Org_Resources.Read_Resource_By_ID(resourceId);
                            IDcrResource resourceDetail = coreSc.Read_Resource_By_ID(IDcOrgResourceId, utils, validation, coreSc, coreDb);
                            if (resourceDetail.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(resourceDetail);
                                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                return resp;
                            }
                            Instant currentTime = Instant.FromDateTimeUtc(DateTime.Now.ToUniversalTime());

                            if (resourceDetail.maxAppointmentFutureTimeInMs != 0)
                            {
                                Instant resourceLimit = currentTime.Plus(Duration.FromMilliseconds(resourceDetail.maxAppointmentFutureTimeInMs));
                                foreach (BaseInstantStartStop tsoDetails in allTSOs)
                                {
                                    if (resourceLimit < tsoDetails.stop)
                                    {
                                        resp.SetResponseInvalidParameter();
                                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                                        return resp;
                                    }
                                }
                            }
                        }
                    }
                    #endregion

                    #region there are no resources or calendars to be linked
                    else
                    {
                        //no need to verify or check anything
                    }
                    #endregion


                    #region delete all the resource mappings to the appointment
                    //DCR_Delete deleteAppointmentResourceMappings = SC_Org_Appointments.Delete_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deleteAppointmentResourceMappings = coreSc.Delete_All_Org_Appointment_Resource_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, IDcAppointmentRepeatId, IDcTSOResourceId, coreSc, coreDb);
                    if (deleteAppointmentResourceMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deleteAppointmentResourceMappings);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion
                    #region delete all the calendar mappings to the appointment
                    //DCR_Delete deleteAppointmentCalendarMappings = SC_Org_Appointments.Delete_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deleteAppointmentCalendarMappings = coreSc.Delete_All_Org_Appointment_Calendar_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, IDcCalendarId, IDcTSOCalendarId, coreSc, coreDb);
                    if (deleteAppointmentCalendarMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deleteAppointmentCalendarMappings);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion
                    #region delete all the repeat rules mapped to the appointment
                    //DCR_Delete deleteAppointmentRepMappings = SC_Org_Appointments.Delete_All_Appointment_Repeat_Mappings_By_Appointment_ID(appointmentId);
                    IDCR_Delete deleteAppointmentRepMappings = coreSc.Delete_All_Appointment_Repeat_Mappings_By_Appointment_ID(IDcAppointmentId, utils, validation, IDcAppointmentRepeatId, IDcTsoId, coreSc, coreDb);
                    if (deleteAppointmentRepMappings.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(deleteAppointmentRepMappings);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region if the appointment options have changed update them
                    if (coreDb.Update_AppointmentOptions(request_obj.coreProj, request_obj) != ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region update the only remaining TSO and original appointment tso to the details updated above
                    //DCR_Org_TSO_List originalAppointmentTSOList = SC_TSO.Read_All_TimePeriods_For_Appointment(appointmentId);

                    DC_Org_TSO updateTSO = new DC_Org_TSO(request_obj.coreProj);
                    updateTSO.appointmentId = request_obj.appointmentId;
                    updateTSO.tsoId = originalAppointmentTSOList.timeScaleList[0].tsoId;
                    updateTSO.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    updateTSO.dateOfGeneration = DateTime.Now.OrijDTStr();
                    updateTSO.durationMilliseconds = request_obj.durationMilliseconds;
                    updateTSO.end = request_obj.end;
                    updateTSO.exceptionId = 0;
                    updateTSO.orgId = request_obj.orgId;
                    updateTSO.repeatId = 0;
                    updateTSO.start = request_obj.start;
                    //DCR_Update updatedTSO = SC_TSO.Update_TimePeriod(updateTSO);
                    IDCR_Update updatedTSO = coreSc.Update_TimePeriod(IUpdateTSO, utils, validation, ITSO, coreSc, coreDb);
                    if (updatedTSO.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(updatedTSO);
                        resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                        return resp;
                    }
                    #endregion

                    #region update the repeat rules
                    //create repeat then map it
                    DC_Create_Repeat_Appointment_Mapping createAppointmentRepMapping = new DC_Create_Repeat_Appointment_Mapping(request_obj.coreProj);
                    createAppointmentRepMapping.appointmentId = request_obj.appointmentId;
                    createAppointmentRepMapping.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createAppointmentRepMapping.orgId = request_obj.orgId;
                    //foreach (BaseRepeatOptions repeatRule in request_obj.repeatRuleOptions)
                    foreach (IRepeatOptions repeatRule in request_obj.repeatRuleOptions)
                    {
                        //DC_Create_Org_RepeatRule createRepeatRule = new DC_Create_Org_RepeatRule(request_obj.coreProj, repeatRule);
                        DC_Create_Org_RepeatRule createRepeatRule = new DC_Create_Org_RepeatRule(request_obj.coreProj);
                        createRepeatRule.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        createRepeatRule.creatorId = request_obj.cmd_user_id;
                        //DCR_Added createdRepeatRule = SC_Org_Repeat.Create_Repeat(createRepeatRule);
                        IDCR_Added createdRepeatRule = coreSc.Create_Repeat(IDcCreateRepeat, utils, validation, coreSc, coreDb);
                        if (createdRepeatRule.func_status != ENUM_Cmd_Status.ok)
                        {
                            //resp.SetResponseServerError();
                            resp.StatusAndMessage_CopyFrom(createdRepeatRule);
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                        createAppointmentRepMapping.repeatId = createdRepeatRule.NewRecordID;
                        createAppointmentRepMapping.creatorId = request_obj.creatorId;
                        IDCR_Added createdAppResMap = coreSc.Create_Org_Appointment_Repeat_Map(IDcMapRepeatAppointment, utils, validation, IDcAppointmentId, IDcRepeatId, IDCResourceTimeRange, IDcTsoId, IDcCalendarTimeRange, IDcResourceTSO, IDcCalendarTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, IListOfOrgTsoCalendarIds, IDcTso, IDcTsos, coreSc, coreDb);
                        if (createdAppResMap.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(createdAppResMap);
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                    }
                    #endregion

                    #region update the resource maps

                    DC_Org_Resource_Appointment_Id createAppointmentMapping = new DC_Org_Resource_Appointment_Id(request_obj.coreProj);
                    createAppointmentMapping.appointmentId = request_obj.appointmentId;
                    createAppointmentMapping.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createAppointmentMapping.orgId = request_obj.orgId;
                    foreach (int resourceId in request_obj.resourceIdList)
                    {
                        createAppointmentMapping.resourceId = resourceId;
                        //DCR_Added createdAppResMap = SC_Org_Appointments.Create_Org_Appointment_Resource_Mapping(createAppointmentMapping);
                        IDCR_Added createdAppResMap = coreSc.Create_Org_Appointment_Resource_Mapping(IDcMapResourceAppointment, utils, validation, IDcOrgResourceId, IDcAppointmentId, IDCResourceTimeRange, IResourceTimeRange, IDcOrgId, IDcResourceTSO, ITsoResourceId, coreSc, coreDb);
                        if (createdAppResMap.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(createdAppResMap);
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                    }
                    #endregion

                    #region update the calendar mappings

                    DC_Org_Calendar_Appointment_ID createCalendarAppointmentMapping = new DC_Org_Calendar_Appointment_ID(request_obj.coreProj);
                    createCalendarAppointmentMapping.appointmentId = request_obj.appointmentId;
                    createCalendarAppointmentMapping.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    createCalendarAppointmentMapping.orgId = request_obj.orgId;
                    foreach (int calendarId in request_obj.calendarIdList)
                    {
                        createCalendarAppointmentMapping.calendarId = calendarId;
                        //DCR_Added createdAppResMap = SC_Org_Appointments.Create_Org_Appointment_Calendar_Mapping(createCalendarAppointmentMapping);
                        IDCR_Added createdAppResMap = coreSc.Create_Org_Appointment_Calendar_Mapping(IDcMapCalendarAppointment, utils, validation, IDcAppointmentId, IDcRepeatId, IDCResourceTimeRange, IDcTsoId, IDcCalendarTimeRange, IDcResourceTSO, IDcCalendarTSO, ITsoResourceId, IOrgTsoCalendarId, IDcCalendarsTSOs, IDcCalendarId, IDcOrgResourceId, IListOfOrgTsoCalendarIds, ICalendarTimeRange, IDcOrgId, coreSc, coreDb);
                        if (createdAppResMap.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(createdAppResMap);
                            resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                            return resp;
                        }
                    }
                    #endregion
                    resp.SetResponseOk();
                    resp.Result = ENUM_Cmd_Update_Result.Updated;
                }
                else
                {
                    resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                    resp.SetResponsePermissionDenied();
                    return resp;
                }
            }
            else
            {
                resp.Result = ENUM_Cmd_Update_Result.Not_Updated;
                resp.SetResponseInvalidParameter();
                return resp;
            }
            return resp;
        }
        public IDcrIdList Read_All_Appointment_TSoIds_Filter_By_Repeat_ID(IDcAppointmentRepeatId request_obj, IUtils utils, IValidation validation, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_IdList resp = new DCR_IdList();
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Org_Appointment_Repeat_Id), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils,  request_obj, typeof(IDcAppointmentRepeatId)))
            {
                if (request_obj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                {
                    List<int> tsoIds;
                    if (coreDb.Read_All_TimePeriod_Appointment_Repeat_Maps(request_obj.coreProj, request_obj.appointmentId, request_obj.repeatId, out tsoIds) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.ListOfIDs = tsoIds;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDCR_Delete Delete_Org_Appointment_Repeat_Mapping(IDcAppointmentRepeatId request_obj, IUtils utils, IValidation validation, IDcAppointmentId IDcAppointmentId, IDcTsoId IDcTsoId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Org_Appointment_Repeat_Id), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb,utils,  request_obj, typeof(IDcAppointmentRepeatId)))
            {
                //if (Validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteOrgAppointmentRepeatMApping))
                if (validation.Permissions_User_Can_Do_Core_Action(request_obj.coreProj, coreSc, coreDb, utils, request_obj.cmd_user_id, request_obj.orgId, ENUM_Core_Function.CF_deleteOrgAppointmentRepeatMApping))
                {
                    DC_Org_Appointment_Id appointmentId = new DC_Org_Appointment_Id(request_obj.coreProj);
                    appointmentId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    appointmentId.appointmentId = request_obj.appointmentId;
                    appointmentId.orgId = request_obj.orgId;
                    //DCR_Org_AppointmentOptions appointmentDetails = SC_Org_Appointments.Read_Appointment_By_Appointment_ID(appointmentId);
                    IDcrAppointment appointmentDetails = coreSc.Read_Appointment_By_Appointment_ID(IDcAppointmentId, utils, validation, coreSc, coreDb);
                    if (appointmentDetails.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentDetails);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    DC_Org_Appointment_Repeat_Id exRepId = new DC_Org_Appointment_Repeat_Id(request_obj.coreProj);
                    exRepId.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                    exRepId.appointmentId = request_obj.appointmentId;
                    exRepId.orgId = request_obj.orgId;
                    exRepId.repeatId = request_obj.repeatId;
                    //DCR_Id_List exRepeatTSOIds = SC_Org_Appointments.Read_All_Appointment_TSoIds_Filter_By_Repeat_ID(exRepId);
                    IDcrIdList exRepeatTSOIds = coreSc.Read_All_Appointment_TSoIds_Filter_By_Repeat_ID(request_obj, utils, validation, coreSc, coreDb);
                    if (exRepeatTSOIds.func_status != ENUM_Cmd_Status.ok)
                    {
                        resp.StatusAndMessage_CopyFrom(exRepeatTSOIds);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                        return resp;
                    }
                    foreach (int mappedTso in exRepeatTSOIds.ListOfIDs)
                    {
                        DC_Org_TSO_ID deleteMe = new DC_Org_TSO_ID(request_obj.coreProj);
                        deleteMe.cmd_user_id = GeneralConfig.SYSTEM_WILDCARD_INT;
                        deleteMe.orgId = request_obj.orgId;
                        deleteMe.tsoId = mappedTso;
                        //DCR_Delete deletedTso = SC_TSO.Delete_TimePeriod(deleteMe);
                        IDCR_Delete deletedTso = coreSc.Delete_TimePeriod(IDcTsoId, coreSc, coreDb);
                        if (deletedTso.func_status != ENUM_Cmd_Status.ok)
                        {
                            resp.StatusAndMessage_CopyFrom(deletedTso);
                            resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                            return resp;
                        }
                    }
                    if (coreDb.Delete_Appointment_Repeat_Mapping(request_obj.coreProj, request_obj, request_obj) == ENUM_DB_Status.DB_SUCCESS)
                    {
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                        resp.SetResponseOk();
                    }
                    else
                    {
                        resp.SetResponseServerError();
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    }
                }
                else
                {
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    resp.SetResponsePermissionDenied();
                }
            }
            else
            {
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                resp.SetResponseInvalidParameter();
            }
            return resp;
        }

        public IDCR_Delete Delete_All_Appointment_TSO_Mappings_By_Appointment_ID(IDcAppointmentId request_obj, IUtils utils, IValidation validation, IDcTsoId IDcTsoId, ICoreSc coreSc, ICoreDatabase coreDb)
        {
            DCR_Delete resp = new DCR_Delete();
            //string vem = String.Empty;

            //if (Validation.Is_Valid(request_obj.coreProj, request_obj, typeof(DC_Org_Appointment_Id), out vem))
            if (validation.Is_Valid(request_obj.coreProj, coreSc, coreDb, utils, request_obj, typeof(IDcAppointmentId)))
            {
                if (request_obj.cmd_user_id == GeneralConfig.SYSTEM_WILDCARD_INT)
                {
                    //DCR_Id_List appointmentTsos = SC_Org_Appointments.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(request_obj);
                    IDcrIdList appointmentTsos = coreSc.Read_All_Org_Appointment_TSoIds_By_Appointment_ID(request_obj, utils, validation, coreSc, coreDb);
                    if (appointmentTsos.func_status == ENUM_Cmd_Status.ok)
                    {
                        foreach (int tsoId in appointmentTsos.ListOfIDs)
                        {
                            DC_Org_TSO_ID deleteTso = new DC_Org_TSO_ID(request_obj.coreProj);
                            deleteTso.cmd_user_id = request_obj.cmd_user_id;
                            deleteTso.orgId = request_obj.orgId;
                            deleteTso.tsoId = tsoId;
                            //DCR_Delete delTso = SC_TSO.Delete_TimePeriod(deleteTso);
                            IDCR_Delete delTso = coreSc.Delete_TimePeriod(IDcTsoId, coreSc, coreDb);
                            if (delTso.func_status != ENUM_Cmd_Status.ok)
                            {
                                resp.StatusAndMessage_CopyFrom(delTso);
                                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                                return resp;
                            }
                        }
                        resp.SetResponseOk();
                        resp.Result = ENUM_Cmd_Delete_State.Deleted;
                    }
                    else
                    {
                        resp.StatusAndMessage_CopyFrom(appointmentTsos);
                        resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                    }
                }
                else
                {
                    resp.SetResponsePermissionDenied();
                    resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
                }
            }
            else
            {
                resp.SetResponseInvalidParameter();
                resp.Result = ENUM_Cmd_Delete_State.NotDeleted;
            }
            return resp;
        }

        
        
    }
}
