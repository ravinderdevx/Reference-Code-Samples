CREATE PROCEDURE [dbo].[sp_GetDashboard] @clientid AS int, @userid AS int  
AS  
BEGIN  
  
 -- Pull Leave Section  
    SELECT L.ClientLeaveId,  
           CASE  
               WHEN ActualReturn IS NOT NULL  
                    OR (ScheduledDeparture < DATEADD(MINUTE, -30, GETDATE())  
                        AND ActualDeparture IS NULL)  
               THEN 'Gray'  
               ELSE 'Black'  
             END AS Color,  
           G.CodeName AS "LeaveType",  
           SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledDeparture), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledDeparture), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledDeparture)))+' - '
+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledReturn), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledReturn), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledReturn))) AS "LeaveTimeSpan",  
           G.CodeName+':&nbsp;&nbsp;&nbsp;'+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledDeparture), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledDeparture), 11, LEN(dbo.fn_FormatDateWithUserPreference(@user
id, L.ScheduledDeparture)))+' - '+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledReturn), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledReturn), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, L.ScheduledR
eturn))) AS LeaveText,  
           ActualDeparture,  
           ActualReturn,  
           CASE  
               WHEN lsc.TotalSchedules = 0  
                    OR lsc.ExternalScheduleCount > 0  
               THEN 'false'  
               ELSE 'true'  
           END AS SignOutAllowed  
      FROM ClientLeaves AS L  
      INNER JOIN GlobalCodes AS G ON L.LeaveType = G.GlobalCodeId  
      INNER JOIN  
                (  
           SELECT c.ClientLeaveId,  
                  COUNT(cls.ClientLeaveScheduleId) AS "TotalSchedules",  
                  SUM(CASE  
                          WHEN GC.CodeName IN('Staff Appointment', 'Meeting', 'Treatment')  
                               OR GC.CodeName IS NULL  
                          THEN 0  
                          ELSE 1  
                      END) AS "ExternalScheduleCount",  
                  SUM(CASE  
                          WHEN GC.CodeName IN('Staff Appointment', 'Meeting', 'Treatment')  
                          THEN 1  
                          ELSE 0  
                      END) AS "InternalScheduleCount"  
             FROM ClientLeaves AS c  
             LEFT JOIN ClientLeaveSchedules AS cls ON c.ClientLeaveId = cls.ClientLeaveId  
                                                      AND cls.RecordDeleted = 'N'  
             LEFT JOIN GlobalCodes AS GC ON cls.ScheduleType = GC.GlobalCodeId  
            WHERE c.ClientId = @clientid  
            GROUP BY c.ClientLeaveId  
                ) AS lsc ON L.ClientLeaveId = lsc.ClientLeaveId  
     WHERE(  
  -- Leave scheduled today and not left yet. Exclude today's old leaves that were never signed out.  
          (CAST(GETDATE() AS date) = CAST(L.ScheduledDeparture AS date)  
           AND L.ActualDeparture IS NULL  
          )  
          OR -- Currently out on leave  
          (CAST(L.ScheduledDeparture AS date) < GETDATE()  
           AND L.ActualDeparture IS NOT NULL  
           AND L.ActualReturn IS NULL  
          )  
          OR -- Returned from leave today  
          (CAST(L.ActualReturn AS date) = CAST(GETDATE() AS date)))  
          AND L.RecordDeleted = 'N'  
          AND L.ClientID = @clientid  
    ORDER BY L.ScheduledDeparture;  
  
  
 -- Pull Leave Schedule Section  
    SELECT CLS.ClientLeaveScheduleId,  
           L.ClientLeaveId,  
           ISNULL(DT.CodeName, G.CodeName) AS ScheduleType,  
     --substring(dbo.fn_FormatDateWithUserPreference(@UserId,CLS.StartDate),11,len(dbo.fn_FormatDateWithUserPreference(@UserId,CLS.StartDate)))  + ' - ' +  
           substring(dbo.fn_FormatDateWithUserPreference(@userid, CLS.StartDate), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, CLS.StartDate), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, CLS.StartDate)))+' - '+SUBSTRING(dbo.fn_For
matDateWithUserPreference(@userid, CLS.EndDate), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, CLS.EndDate), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, CLS.EndDate))) AS ScheduleText,  
           D.Destination  
      FROM ClientLeaveSchedules AS CLS  
      INNER JOIN GlobalCodes AS G ON CLS.ScheduleType = G.GlobalCodeID  
      INNER JOIN ClientLeaves AS L ON L.ClientLeaveId = CLS.ClientLeaveId  
      LEFT JOIN GlobalCodes AS DT ON CLS.DestinationType = DT.GlobalCodeId  
      LEFT JOIN Destinations AS D ON CLS.ScheduleDestinationKey = D.DestinationId  
     WHERE(  
  -- Leave scheduled today and not left yet. Exclude today's old leaves that were never signed out.  
          (CAST(GETDATE() AS date) = CAST(L.ScheduledDeparture AS date)  
           AND L.ActualDeparture IS NULL  
          )  
          OR -- Currently out on leave  
          (CAST(L.ScheduledDeparture AS date) < GETDATE()  
           AND L.ActualDeparture IS NOT NULL  
           AND L.ActualReturn IS NULL  
          )  
          OR -- Returned from leave today  
          (CAST(L.ActualReturn AS date) = CAST(GETDATE() AS date)))  
          AND CLS.RecordDeleted = 'N'  
          AND L.ClientId = @clientid  
    ORDER BY CLS.StartDate;  
  
  
 -- Pull Treatment Section  
    SELECT T.TreatmentGroupId,  
           T.TreatmentGroup,  
           CASE  
               WHEN CAST(CONVERT(varchar(10), TGC.SessionDateTime, 101) AS datetime) = CAST(CONVERT(varchar(10), GETDATE(), 101) AS datetime)  
               THEN T.TReatmentGroup+':'+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime)))+' - '+ISNULL(SUBSTRING(dbo.fn_FormatDateWithUserPreference(@u
serid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)))), '')  
               ELSE T.TReatmentGroup+':'+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, T
GC.SessionDateTime)))+' - '+ISNULL(SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)), 0, 6) + SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime
)), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)))), '')  
             END AS TreatmentText,  
           CASE  
               WHEN CAST(CONVERT(varchar(10), TGC.SessionDateTime, 101) AS datetime) = CAST(CONVERT(varchar(10), GETDATE(), 101) AS datetime)  
               THEN SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime)))+' - '+ISNULL(SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC
.SessionLength, TGC.SessionDateTime)), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)))), '')  
               ELSE SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 0, 6)+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime), 11, LEN(dbo.fn_FormatDateWithUserPreference(@userid, TGC.SessionDateTime)))
+' - '+ISNULL(SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)), 0, 6) + SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)), 11, LEN(dbo.fn_Fo
rmatDateWithUserPreference(@userid, DATEADD(n, TGC.SessionLength, TGC.SessionDateTime)))), '')  
                    END AS TreatmentGroupTime,  
           'Gray' AS Color,  
           TGC.TreatmentGroupCalendarId,  
           TGC.SessionDateTime  
      FROM TreatmentGroups AS T  
      INNER JOIN ClientGroupRegistrations AS CGR ON T.TreatmentGroupId = CGR.TreatmentGroupId  
      INNER JOIN ClientProgramEnrollments AS CPE ON CGR.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId  
      INNER JOIN TreatmentGroupCalendar AS TGC ON T.TreatmentGroupId = TGC.TreatmentGroupId  
     WHERE(CONVERT(date, TGC.SessionDateTime) = CONVERT(date, GETDATE())  
           OR CONVERT(date, GETDATE()) BETWEEN CONVERT(date, TGC.SessionDateTime) AND CONVERT(date, ISNULL(DATEADD(n, TGC.SessionLength, TGC.SessionDateTime), GETDATE())))  
          AND CPE.ClientId = @clientid  
          AND CGR.StartDate <= GETDATE()  
          AND ISNULL(CGR.EndDate, GETDATE()) >= GETDATE()  
          AND CGR.RecordDeleted = 'N'  
          AND TGC.SessionDateTime >= DATEADD(n, -1 * TGC.SessionLength, GETDATE())  
          AND T.TreatmentGroupId NOT IN  
                                       (  
                                        SELECT T.TreatmentGroupId  
                                          FROM TreatmentGroups AS T  
                                          INNER JOIN ClientLeaveSchedules AS CLS ON T.TreatmentGroupId = CLS.ScheduleDestinationKey  
                                          INNER JOIN GlobalCodes AS G ON CLS.ScheduleType = G.GlobalCodeId  
                                          INNER JOIN ClientLeaves AS CL ON CLS.ClientLeaveId = CL.ClientLeaveId  
                                                                           AND CL.ClientId = @clientid  
                                         WHERE G.CodeName = 'Treatment'  
                                               AND GETDATE() BETWEEN CLS.StartDate AND CLS.EndDate  
                                       )  
    ORDER BY TGC.SessionDateTime;  
  
   
 -- Sign Out Hold Section  
    SELECT CSOH.ClientHoldId,  
           'Sign Out Hold in effect until '+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, CSOH.EndDate), 0, 6)+' at '+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, CSOH.EndDate), 12, 5) AS SignOutText  
      FROM ClientSignOutHolds AS CSOH  
     WHERE GETDATE() BETWEEN CSOH.StartDate AND CSOH.EndDate  
           AND CSOH.Active = 'Y'  
           AND CSOH.ClientId = @clientid  
           AND CSOH.RecordDeleted = 'N';  
  
  
 -- Security Flag Section  
    SELECT CSF.ClientSecurityFlagId,  
           CSF.SecurityFlagId,  
           CSF.Comments,  
           SF.SecurityFlag,  
           SF.AllowDashboardDismiss  
      FROM ClientSecurityFlags AS CSF  
      INNER JOIN SecurityFlags AS SF ON CSF.SecurityFlagId = SF.SecurityFlagId  
     WHERE SF.ShowOnDashboard = 'Y'  
           AND ISNULL(CSF.StartDate, '1/1/1900') < GETDATE()  
           AND ISNULL(CSF.EndDate, '12/31/2099') > GETDATE()  
           AND CSF.ClientId = @clientid  
           AND CSF.Active = 'Y'  
           AND CSF.RecordDeleted = 'N'  
           AND SF.Active = 'Y'  
           AND SF.RecordDeleted = 'N';  
  
  
 -- Get Client's Secured Medication Log Date  
    SELECT TOP 1 'Secured Med last taken on '+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, cml.LogDate), 0, 6)+' at '+SUBSTRING(dbo.fn_FormatDateWithUserPreference(@userid, cml.LogDate), 12, 5) AS "LogDate"  
      FROM ClientMedicationLog AS cml  
      INNER JOIN ClientPrescriptions AS cp ON cml.ClientPrescriptionId = cp.ClientPrescriptionId  
      INNER JOIN Medications AS m ON cp.MedicationId = m.MedicationId  
      INNER JOIN GlobalCodes AS gc ON cml.LogType = gc.GlobalCodeId  
     WHERE cp.ClientId = @clientid  
           AND m.SecuredMedication = 'Y'  
           AND DATEADD(hour, 48, cml.LogDate) >= GETDATE()  
           AND gc.CodeName = 'Issue'  
           AND cml.RecordDeleted = 'N'  
    ORDER BY cml.LogDate DESC;  
  
      
 -- Get client's meetings  
    SELECT cm.MeetingId,  
           SUBSTRING(CONVERT(varchar, cm.StartTime, 108), 1, 5)+' - '+SUBSTRING(CONVERT(varchar, cm.EndTime, 108), 1, 5) AS "MeetingTime",  
           cm.Title+ISNULL(' ('+gc.CodeName+')', '') AS "MeetingText",  
           cm.StartTime  
      FROM CalendarMeetings AS cm  
      LEFT JOIN GlobalCodes AS gc ON cm.MeetingLocation = gc.GlobalCodeId  
     WHERE ClientId = @clientid  
           AND CAST(GETDATE() AS date) BETWEEN CAST(cm.StartTime AS date) AND CAST(cm.EndTime AS date)  
           AND cm.RecordDeleted = 'N'  
           AND NOT EXISTS  
                         (  
                          SELECT CLS.ClientLeaveScheduleId  
                            FROM ClientLeaveSchedules AS CLS  
                            INNER JOIN GlobalCodes AS G ON CLS.ScheduleType = G.GlobalCodeId  
                                                           AND G.CodeName = 'Meeting'  
                           WHERE CLS.ScheduleDestinationKey = CM.MeetingId  
                                 AND CLS.RecordDeleted = 'N'  
                         )  
    ORDER BY StartTime;  
END;