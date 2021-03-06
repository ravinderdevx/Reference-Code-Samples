
/****** Object:  StoredProcedure [dbo].[sp_GetClientKioskDataSync]    Script Date: 06/24/2019 4:59:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--sp_helptext sp_GetClientKioskDataSync
--exec sp_GetClientKioskDataSync @ClientId=91,@TableName=N'Agenda',@CompanyId=1  
-- sp_GetClientKioskDataSync 'ClientEmergencyContacts',69, 1,-1  
--select * from 
--update subkioskone..ClientContacts set RecordDeleted = 'y'

ALTER PROCEDURE [dbo].[sp_GetClientKioskDataSync] @tablename AS varchar(250), @clientid int, @companyid int, @keyid int= NULL
AS
BEGIN

    DECLARE @jsonparams AS varchar(max) = '';
    SET @jsonparams = '{"TableName": "' + @tablename + '","ClientId": ' + CAST(@clientid AS varchar(10)) + '}';

    DECLARE @key                 nvarchar(50), 
            @secret              nvarchar(50), 
            @apiconnectionstring nvarchar(250), 
            @cloudapiurl         nvarchar(250),  
            --@companyid           int,  
            @synclogidsch        int, 
            @ldataxml            xml           = NULL, 
            @synclogidleave      int;

    SELECT @key = CompanyIdentifier, 
           @secret = KioskSecret, 
           @apiconnectionstring = ApiConnectionString, 
           @cloudapiurl = CloudApiUrl
      FROM CompanyConfigurations
     WHERE ReferenceId = @companyid;

    BEGIN TRY
        DECLARE @lapiurl      nvarchar(255) = @cloudapiurl, 
                @lapimethod   nvarchar(255) = '/TomAPI/GetKioskData', 
                @lcallmethod  nvarchar(255) = 'POST', 
                @lsource      nvarchar(100) = @apiconnectionstring, 
                @lkey         nvarchar(100) = @key, 
                @lsecret      nvarchar(100) = @secret, 
                @ljsonparams  nvarchar(max) = @jsonparams, 
                @lapiresponse nvarchar(max) = NULL;

        DECLARE @lsucess AS  bit, 
                @lmessage AS varchar(250) = NULL;

        DECLARE @status char(1) = 'E';

        BEGIN  ----fetching newly reuested leaves for syncing.                
            EXEC sp_InsertModifyMetaDataLog 
                 NULL, 
                 @tablename, 
                 -1, 
                 @companyid, 
                 NULL, 
                 'N', 
                 'P', 
                 'admin', 
                 -1, 
                 'TomRex';

            SET @synclogidleave = @@identity;

            SELECT @lapiurl = @cloudapiurl, 
                   @lapimethod = @lapimethod, 
                   @lcallmethod = 'POST', 
                   @lsource = @apiconnectionstring, 
                   @lkey = @key, 
                   @lsecret = @secret, 
                   @ljsonparams = @jsonparams, 
                   @lapiresponse = NULL;

            EXEC sp_CallCloudAPI 
                 @apiurl = @lapiurl, 
                 @apimethod = @lapimethod, 
                 @callmethod = @lcallmethod, 
                 @source = @lsource, 
                 @key = @lkey, 
                 @secret = @lsecret, 
                 @jsonparams = @ljsonparams, 
                 @apiresponse = @lapiresponse OUTPUT;  
            -- SELECT @lapiresponse;  

            EXEC sp_GetClrResult 
                 @lapiresponse, 
                 @lsucess OUT, 
                 @lmessage OUT, 
                 @ldataxml OUT;

            SET @status = 'E';
            IF @lsucess = 1
            BEGIN
                SET @status = 'S';
                SET @lmessage = CASE
                                    WHEN ISNULL(@lmessage, '') = ''
                                    THEN 'Request processed successfully.'
                                    ELSE @lmessage
                                END;
                EXEC sp_InsertModifyKioskMetaData 
                     @ldataxml, 
                     @tablename, 
                     @companyid;
            END;
        END;

        IF @lsucess = 1 ----Inserting Schedule in tomrex.                     
        BEGIN
            SET @status = 'S';
            SET @lmessage = CASE
                                WHEN ISNULL(@lmessage, '') = ''
                                THEN 'Request processed successfully.'
                                ELSE @lmessage
                            END;
        END;
    END TRY
    BEGIN CATCH
        SET @lmessage = ERROR_MESSAGE();
    END CATCH;
    DECLARE @doc nvarchar(max)= CAST(@ldataxml AS nvarchar(max));
    EXEC sp_InsertModifyMetaDataLog 
         @doc, 
         @tablename, 
         -1, 
         @companyid, 
         @lmessage, 
         'N', 
         @status, 
         'admin', 
         @synclogidleave, 
         'TomRex';

    DECLARE @idoc int;

    EXEC sp_xml_preparedocument 
         @idoc OUTPUT, 
         @doc;
    DECLARE @id int;

    IF(@tablename = 'ClientEmergencyContacts')
    BEGIN

        DECLARE @rexclientemergencycontacts TABLE(Id int, ClientId int, Name varchar(255), ClientVehicleId int, DepartTransMode int, RecordDeleted char(1), CompanyId int);

        INSERT INTO @rexclientemergencycontacts(Id, 
                                                ClientId, 
                                                Name, 
                                                ClientVehicleId, 
                                                DepartTransMode, 
                                                RecordDeleted, 
                                                CompanyId)
        SELECT Id, 
               ClientId, 
               Name, 
               ClientVehicleId, 
               DepartTransMode, 
               RecordDeleted, 
               @companyid
          FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientEmergencyContacts', 3) WITH(Id int, ClientId int, Name varchar(255), ClientVehicleId int, DepartTransMode int, RecordDeleted char(1));

        SELECT CASE
                   WHEN ISNULL(Tom.Name, '') <> ISNULL(Rex.Name, '')
                   THEN 'Y'
                   ELSE CASE
                            WHEN ISNULL(Tom.ClientVehicleId, '') <> ISNULL(Rex.ClientVehicleId, '')
                            THEN 'Y'
                            ELSE CASE
                                     WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                     THEN 'Y'
                                     ELSE 'N'
                                 END
                        END
               END AS IsChanged,
               CASE
                   WHEN ISNULL(Tom.ClientEmergencyContactId, '') = ''
                   THEN 'N'
                   ELSE 'Y'
               END AS TomRecordExist,
               CASE
                   WHEN ISNULL(Rex.Id, '') = ''
                   THEN 'N'
                   ELSE 'Y'
               END AS RexRecordExist, 
               Tom.ClientEmergencyContactId AS Tom_Id, 
               Tom.ClientId, 
               Tom.Name, 
               Tom.ClientVehicleId,'Y' SyncTOM, 
               Tom.RecordDeleted, 
               ' ' AS ' ', 
               Rex.Id, 
               Rex.ClientId, 
               Rex.Name, 
               Rex.ClientVehicleId, 'N' SyncTOMREX, 
               Rex.RecordDeleted
          FROM ClientEmergencyContacts AS Tom
          FULL JOIN @rexclientemergencycontacts AS Rex ON Tom.ClientEmergencyContactId = Rex.Id
                                                          AND Tom.ClientId = Rex.ClientId
         WHERE Tom.ClientId = @clientid
               OR Rex.ClientId = @clientid
        ORDER BY Tom_Id, 
                 Id;
    END;
        ELSE
    BEGIN
        IF(@tablename = 'ClientGroupRegistrations')
        BEGIN
            DECLARE @rexclientgroupregistrations TABLE(Id int, ClientId int, Name varchar(255), TreatmentGroupId int, StartDate datetime, EndDate datetime, RecordDeleted char(1), CompanyId int);

            INSERT INTO @rexclientgroupregistrations(Id, 
                                                     ClientId, 
                                                     TreatmentGroupId, 
                                                     StartDate, 
                                                     EndDate, 
                                                     RecordDeleted, 
                                                     CompanyId)
            SELECT Id, 
                   ClientId, 
                   TreatmentGroupId, 
                   StartDate, 
                   EndDate, 
                   RecordDeleted, 
                   @companyid
              FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientGroupRegistrations', 3) WITH(Id int, ClientId int, Name varchar(255), TreatmentGroupId int, StartDate datetime, EndDate datetime, RecordDeleted char(1));

            SELECT CASE
                       WHEN ISNULL(CPE.ClientId, '') <> ISNULL(Rex.ClientId, '')
                       THEN 'Y'
                       ELSE CASE
                                WHEN ISNULL(Tom.TreatmentGroupId, '') <> ISNULL(Rex.TreatmentGroupId, '')
                                THEN 'Y'
                                ELSE CASE
                                         WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                         THEN 'Y'
                                         ELSE CASE
                                                  WHEN ISNULL(Tom.StartDate, '') <> ISNULL(Rex.StartDate, '')
                                                  THEN 'Y'
                                                  ELSE CASE
                                                           WHEN ISNULL(Tom.EndDate, '') <> ISNULL(Rex.EndDate, '')
                                                           THEN 'Y'
                                                           ELSE 'N'
                                                       END
                                              END
                                     END
                            END
                   END AS IsChanged,
                   CASE
                       WHEN ISNULL(Tom.ClientGroupRegistrationId, '') = ''
                       THEN 'N'
                       ELSE 'Y'
                   END AS TomRecordExist,
                   CASE
                       WHEN ISNULL(Rex.Id, '') = ''
                       THEN 'N'
                       ELSE 'Y'
                   END AS RexRecordExist, 
                   Tom.ClientGroupRegistrationId AS TOM_Id, 
                   CPE.ClientId, 
                   Tom.TreatmentGroupId, 
                   Tom.RecordDeleted, 
                   Tom.StartDate, 
                   Tom.EndDate,'Y' SyncTOM, 
                   ' ' AS ' ', 
                   Rex.Id, 
                   Rex.ClientId, 
                   Rex.TreatmentGroupId, 
                   Rex.RecordDeleted, 
                   Rex.StartDate, 
                   Rex.EndDate, 'N' SyncTOMREX
              FROM ClientGroupRegistrations AS Tom
              INNER JOIN ClientProgramEnrollments AS CPE ON Tom.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
              FULL JOIN @rexclientgroupregistrations AS Rex ON Tom.ClientGroupRegistrationId = Rex.Id
             WHERE CPE.ClientId = @clientid;
        END;
            ELSE
        BEGIN
            IF(@tablename = 'ClientVehicles')
            BEGIN
                DECLARE @rexclientvehicles TABLE(Id int, ClientId int, VehicleDescription varchar(250), RecordDeleted char(1), CompanyId int);
                INSERT INTO @rexclientvehicles(Id, 
                                               ClientId, 
                                               VehicleDescription, 
                                               RecordDeleted, 
                                               CompanyId)
                SELECT Id, 
                       ClientId, 
                       VehicleDescription, 
                       RecordDeleted, 
                       @companyid
                  FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientVehicles', 3) WITH(Id int, ClientId int, VehicleDescription varchar(250), RecordDeleted char(1));

                SELECT CASE
                           WHEN ISNULL(Tom.ClientId, '') <> ISNULL(Rex.ClientId, '')
                           THEN 'Y'
                           ELSE CASE
                                    WHEN ISNULL(Tom.ClientVehicleId, '') <> ISNULL(Rex.Id, '')
                                    THEN 'Y'
                                    ELSE CASE
                                             WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                             THEN 'Y'
                                             ELSE 'N'
                                         END
                                END
                       END AS IsChanged,
                       CASE
                           WHEN ISNULL(Tom.ClientVehicleId, '') = ''
                           THEN 'N'
                           ELSE 'Y'
                       END AS TomRecordExist,
                       CASE
                           WHEN ISNULL(Rex.Id, '') = ''
                           THEN 'N'
                           ELSE 'Y'
                       END AS RexRecordExist, 
                       Tom.ClientVehicleId AS TOM_Id, 
                       Tom.ClientId, 
                       CAST(Tom.Year AS varchar) + ' ' + gc1.CodeName + ' ' + Tom.Model + ' (' + gc2.CodeName + ' ' + Tom.PlateNumber + ')' AS VehicleDescription, 
                       Tom.RecordDeleted,'Y' SyncTOM, 
                       ' ' AS ' ', 
                       Rex.Id, 
                       Rex.ClientId, 
                       Rex.VehicleDescription, 
                       Rex.RecordDeleted, 'N' SyncTOMREX
                  FROM ClientVehicles AS Tom
                  INNER JOIN GlobalCodes AS gc1 ON Tom.Make = gc1.GlobalCodeId
                  LEFT JOIN GlobalCodes AS gc2 ON Tom.PlateState = gc2.GlobalCodeId
                  FULL JOIN @rexclientvehicles AS Rex ON Tom.ClientVehicleId = Rex.Id
                                                         AND Tom.ClientId = Rex.ClientId
                 WHERE Tom.ClientId = @clientid
                       AND CompanyId = @companyid
                       OR Rex.ClientId = @clientid
                ORDER BY Tom_Id, 
                         Id;
            END;
                ELSE
            BEGIN
                IF(@tablename = 'KioskProfiles')
                BEGIN
                    DECLARE @kioskprofiles TABLE(ClientId int, CompanyId int, PhaseId int, RecordDeleted char(1), UserName varchar(50));

                    DECLARE @clientprogramphaseid int;

                    SELECT TOP 1 @clientprogramphaseid = ProgramPhaseId -- @ClientProgramPhaseId = CPP.ClientProgramPhaseId   
                      FROM ClientProgramEnrollments AS CPE
                      INNER JOIN Programs AS P ON P.ProgramId = CPE.ProgramId
                      INNER JOIN ClientProgramPhases AS CPP ON CPE.ClientProgramEnrollmentId = CPP.ClientProgramEnrollmentId
                                                               AND cpp.RecordDeleted = 'N'
                                                               AND cpp.Active = 'Y'
                                                               AND CPP.StartDate < GETDATE()
                                                               AND ISNULL(CPP.EndDate, '12/31/2099') > GETDATE()
                     WHERE CPE.ClientId = @clientid
                           AND CPE.StartDate <= GETDATE()
                           AND (CPE.ActualEndDate IS NULL
                                OR CPE.ActualEndDate >= GETDATE())
                           AND P.CompanyId = @companyid
                    ORDER BY CPE.StartDate DESC, 
                             CPE.ClientProgramEnrollmentId;

                    INSERT INTO @kioskprofiles(ClientId, 
                                               CompanyId, 
                                               PhaseId, 
                                               UserName)
                    SELECT ClientId, 
                           @companyid AS CompanyId, 
                           PhaseId, 
                           UserName
                      FROM OPENXML(@idoc, '/DataXML/MainDataSet/KioskProfiles', 3) WITH(ClientId int, PhaseId int, RecordDeleted char(1), UserName varchar(50));

                    SELECT CASE
                               WHEN ISNULL(Tom.KioskUsername, '') <> ISNULL(Rex.UserName, '')
                               THEN 'Y'
                               ELSE CASE
                                        WHEN ISNULL(@clientprogramphaseid, '') <> ISNULL(Rex.PhaseId, '')
                                        THEN 'Y'
                                        ELSE 'N'
                                    END
                           END AS IsChanged,
                           CASE
                               WHEN ISNULL(Tom.ClientId, '') = ''
                               THEN 'N'
                               ELSE 'Y'
                           END AS TomRecordExist,
                           CASE
                               WHEN ISNULL(Rex.ClientId, '') = ''
                               THEN 'N'
                               ELSE 'Y'
                           END AS RexRecordExist, 
                           Tom.ClientId AS Tom_Id, 
                           Tom.ClientId, 
                           Tom.CompanyId, 
                           @clientprogramphaseid AS ClientProgramPhaseId, 
                           Tom.KioskUsername,'Y' SyncTOM, 
                           ' ' AS ' ', 
                           Rex.ClientId AS Id, 
                           Rex.ClientId, 
                           @companyid AS CompanyId, 
                           Rex.PhaseId, 
                           Rex.UserName, 'N' SyncTOMREX
                      FROM KioskProfiles AS Tom
                      FULL JOIN @kioskprofiles AS Rex ON Tom.ClientId = Rex.ClientId
                                                         AND Tom.ClientId = Rex.ClientId
                     WHERE Tom.ClientId = @clientid
                           AND Tom.CompanyId = @companyid
                           OR Rex.ClientId = @clientid
                    ORDER BY Tom_Id, 
                             Id;
                END;
                    ELSE
                BEGIN
                    IF(@tablename = 'ClientJobHistory')
                    BEGIN
                        DECLARE @clientjobhistory TABLE(Id int, ClientId int, EmployerId int, StartDate datetime, EndDate datetime, RecordDeleted char(1));
                        INSERT INTO @clientjobhistory(Id, 
                                                      ClientId, 
                                                      EmployerId, 
                                                      StartDate, 
                                                      EndDate, 
                                                      RecordDeleted)
                        SELECT Id, 
                               ClientId, 
                               EmployerId, 
                               StartDate, 
                               EndDate, 
                               RecordDeleted
                          FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientJobHistory', 3) WITH(Id int, ClientId int, EmployerId int, StartDate datetime, EndDate datetime, RecordDeleted char(1));

                        SELECT CASE
                                   WHEN ISNULL(Tom.StartDate, '') <> ISNULL(Rex.StartDate, '')
                                   THEN 'Y'
                                   ELSE CASE
                                            WHEN ISNULL(Tom.EndDate, '') <> ISNULL(Rex.EndDate, '')
                                            THEN 'Y'
                                            ELSE CASE
                                                     WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                     THEN 'Y'
                                                     ELSE 'N'
                                                 END
                                        END
                               END AS IsChanged,
                               CASE
                                   WHEN ISNULL(Tom.EmployerId, '') = ''
                                   THEN 'N'
                                   ELSE 'Y'
                               END AS TomRecordExist,
                               CASE
                                   WHEN ISNULL(Rex.Id, '') = ''
                                   THEN 'N'
                                   ELSE 'Y'
                               END AS RexRecordExist, 
                               Tom.ClientJobHistoryId AS TOM_Id, 
                               Tom.ClientId, 
                               Tom.EmployerId, 
                               Tom.StartDate, 
                               Tom.EndDate, 
                               Tom.RecordDeleted,'Y' SyncTOM, 
                               ' ' AS ' ', 
                               Rex.Id, 
                               Rex.ClientId, 
                               Rex.EmployerId, 
                               Rex.StartDate, 
                               Rex.EndDate, 
                               Rex.RecordDeleted, 'N' SyncTOMREX
                          FROM ClientJobHistory AS Tom
                          FULL JOIN @clientjobhistory AS Rex ON Tom.ClientJobHistoryId = Rex.Id
                                                                AND Tom.ClientId = Rex.ClientId
                         WHERE Tom.ClientId = @clientid
                               AND Tom.CompanyId = @companyid
                               OR Rex.ClientId = @clientid
                        ORDER BY Tom_Id, 
                                 Id;
                    END;
                        ELSE
                    BEGIN
                        IF(@tablename = 'CalendarMeetings')
                        BEGIN
                            DECLARE @rexcalendarmeetings TABLE(Id int, ClientId int, MeetingType int, Title varchar(510), StartTime datetime, EndTime datetime, MasterReference int, CalendarId int, RecordDeleted char(1));
                            INSERT INTO @rexcalendarmeetings(Id, 
                                                             ClientId, 
                                                             MeetingType, 
                                                             Title, 
                                                             StartTime, 
                                                             EndTime, 
                                                             MasterReference, 
                                                             CalendarId, 
                                                             RecordDeleted)
                            SELECT Id, 
                                   ClientId, 
                                   MeetingType, 
                                   Title, 
                                   StartTime, 
                                   EndTime, 
                                   MasterReference, 
                                   CalendarId, 
                                   RecordDeleted
                              FROM OPENXML(@idoc, '/DataXML/MainDataSet/CalendarMeetings', 3) WITH(Id int, ClientId int, MeetingType int, Title varchar(510), StartTime datetime, EndTime datetime, MasterReference int, CalendarId int, RecordDeleted char(1));

                            --select * into rexPPP1 from @RexCalendarMeetings  

                            SELECT CASE
                                       WHEN ISNULL(Tom.StartTime, '') <> ISNULL(Rex.StartTime, '')
                                       THEN 'Y'
                                       ELSE CASE
                                                WHEN ISNULL(Tom.EndTime, '') <> ISNULL(Rex.EndTime, '')
                                                THEN 'Y'
                                                ELSE CASE
                                                         WHEN ISNULL(Tom.MeetingType, '') <> ISNULL(Rex.MeetingType, '')
                                                         THEN 'Y'
                                                         ELSE CASE
                                                                  WHEN ISNULL(Tom.Title, '') <> ISNULL(Rex.Title, '')
                                                                  THEN 'Y'
                                                                  ELSE CASE
                                                                           WHEN ISNULL(Tom.MasterReference, -1) <> ISNULL(Rex.MasterReference, -1)
                                                                           THEN 'Y'
                                                                           ELSE CASE
                                                                                    WHEN ISNULL(Tom.CalendarId, '') <> ISNULL(Rex.CalendarId, '')
                                                                                    THEN 'Y'
                                                                                    ELSE CASE
                                                                                             WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                                                             THEN 'Y'
                                                                                             ELSE 'N'
                                                                                         END
                                                                                END
                                                                       END
                                                              END
                                                     END
                                            END
                                   END AS IsChanged,
                                   CASE
                                       WHEN ISNULL(Tom.MeetingId, '') = ''
                                       THEN 'N'
                                       ELSE 'Y'
                                   END AS TomRecordExist,
                                   CASE
                                       WHEN ISNULL(Rex.Id, '') = ''
                                       THEN 'N'
                                       ELSE 'Y'
                                   END AS RexRecordExist, 
                                   Tom.MeetingId AS TOM_Id, 
                                   Tom.ClientId, 
                                   Tom.MeetingType, 
                                   Tom.Title, 
                                   Tom.StartTime, 
                                   Tom.EndTime, 
                                   Tom.RecordDeleted, 
                                   Tom.MasterReference, 
                                   Tom.CalendarId,'Y' SyncTOM, 
                                   ' ' AS ' ', 
                                   Rex.Id AS Id, 
                                   Rex.ClientId, 
                                   Rex.MeetingType, 
                                   Rex.Title, 
                                   Rex.StartTime, 
                                   Rex.EndTime, 
                                   Rex.RecordDeleted, 
                                   Rex.MasterReference, 
                                   Rex.CalendarId, 'N' SyncTOMREX
                              FROM CalendarMeetings AS Tom
                              INNER JOIN Calendars AS C ON Tom.CalendarId = C.CalendarId
                              FULL JOIN @rexcalendarmeetings AS Rex ON Tom.MeetingId = Rex.Id
                                                                       AND Tom.ClientId = Rex.ClientId
                             WHERE Tom.ClientId = @clientid
                                   AND C.CompanyId = @companyid
                                   OR Rex.ClientId = @clientid
                            ORDER BY Tom_Id, 
                                     Id;
                        END;
                            ELSE
                        BEGIN
                            IF(@tablename = 'ClientPassSites')
                            BEGIN
                                DECLARE @rexclientpasssites TABLE(Id int, ClientId int, PassSite varchar(50), DestinationType int, ContactName varchar(50), Address varchar(100), PhoneNumber varchar(12), RecordDeleted char(1));
                                INSERT INTO @rexclientpasssites(Id, 
                                                                ClientId, 
                                                                PassSite, 
                                                                DestinationType, 
                                                                ContactName, 
                                                                Address, 
                                                                PhoneNumber, 
                                                                RecordDeleted)
                                SELECT Id, 
                                       ClientId, 
                                       PassSite, 
                                       DestinationType, 
                                       ContactName, 
                                       Address, 
                                       PhoneNumber, 
                                       RecordDeleted
                                  FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientPassSites', 3) WITH(Id int, ClientId int, PassSite varchar(50), DestinationType int, ContactName varchar(50), Address varchar(100), PhoneNumber varchar(12), RecordDeleted char(1));

                                DECLARE @destinationtype int;
                                SELECT @destinationtype = GlobalCodeId
                                  FROM GlobalCodes AS GC
                                  INNER JOIN GlobalCodeCategories AS GCC ON GC.CategoryId = GCC.CategoryId
                                 WHERE CategoryName = 'ScheduleType'
                                       AND CodeName = 'Pass Site';

                                SELECT CASE
                                           WHEN ISNULL(Tom.PassSite, '') <> ISNULL(Rex.PassSite, '')
                                           THEN 'Y'
                                           ELSE CASE
                                                    WHEN ISNULL(@destinationtype, '') <> ISNULL(Rex.DestinationType, '')
                                                    THEN 'Y'
                                                    ELSE CASE
                                                             WHEN ISNULL(Tom.ContactName, '') <> ISNULL(Rex.ContactName, '')
                                                             THEN 'Y'
                                                             ELSE CASE
                                                                      WHEN ISNULL(Tom.Address, '') <> ISNULL(Rex.Address, '')
                                                                      THEN 'Y'
                                                                      ELSE CASE
                                                                               WHEN ISNULL(Tom.PhoneNumber, '') <> ISNULL(Rex.PhoneNumber, '')
                                                                               THEN 'Y'
                                                                               ELSE CASE
                                                                                        WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                                                        THEN 'Y'
                                                                                        ELSE 'N'
                                                                                    END
                                                                           END
                                                                  END
                                                         END
                                                END
                                       END AS IsChanged,
                                       CASE
                                           WHEN ISNULL(Tom.ClientPassSitesId, '') = ''
                                           THEN 'N'
                                           ELSE 'Y'
                                       END AS TomRecordExist,
                                       CASE
                                           WHEN ISNULL(Rex.Id, '') = ''
                                           THEN 'N'
                                           ELSE 'Y'
                                       END AS RexRecordExist, 
                                       Tom.ClientPassSitesId AS TOM_Id, 
                                       Tom.ClientId, 
                                       Tom.PassSite, 
                                       @destinationtype AS DestinationType, 
                                       Tom.ContactName, 
                                       Tom.Address, 
                                       Tom.PhoneNumber, 
                                       TOM.RecordDeleted,'Y' SyncTOM, 
                                       ' ' AS ' ', 
                                       Rex.Id AS Id, 
                                       Rex.ClientId, 
                                       Rex.PassSite, 
                                       Rex.DestinationType, 
                                       Rex.ContactName, 
                                       Rex.Address, 
                                       Rex.PhoneNumber, 
                                       Rex.RecordDeleted,
                                       'N' SyncTOMREX
                                  FROM ClientPassSites AS Tom
                                  INNER JOIN KioskProfiles AS KP ON KP.ClientId = Tom.ClientId
                                  FULL JOIN @rexclientpasssites AS Rex ON Tom.ClientPassSitesId = Rex.Id
                                                                          AND Rex.ClientId = Tom.ClientId
                                 WHERE Tom.ClientId = @clientid
                                       AND KP.CompanyId = @companyid
                                       OR Rex.ClientId = @clientid
                                ORDER BY Tom_Id, 
                                         Rex.Id;
                            END;
                                ELSE
                            BEGIN
                                IF(@tablename = 'KioskClientReminder')
                                BEGIN
                                    DECLARE @rexkioskclientreminder TABLE(Id int, ClientId int, TaskDescription int, Comments varchar(max), DueDate date, Completed char(1));
                                    INSERT INTO @rexkioskclientreminder(Id, 
                                                                        ClientId, 
                                                                        TaskDescription, 
                                                                        Comments, 
                                                                        DueDate, 
                                                                        Completed)
                                    SELECT Id, 
                                           ClientId, 
                                           TaskDescription, 
                                           Comments, 
                                           DueDate, 
                                           Completed
                                      FROM OPENXML(@idoc, '/DataXML/MainDataSet/KioskClientReminder', 3) WITH(Id int, ClientId int, TaskDescription int, Comments varchar(max), DueDate date, Completed char(1));

                                    SELECT CASE
                                               WHEN ISNULL(Tom.TaskDescription, '') <> ISNULL(Rex.TaskDescription, '')
                                               THEN 'Y'
                                               ELSE CASE
                                                        WHEN ISNULL(Tom.DueDate, '') <> ISNULL(Rex.DueDate, '')
                                                        THEN 'Y'
                                                        ELSE CASE
                                                                 WHEN ISNULL(Tom.Completed, '') <> ISNULL(Rex.Completed, '')
                                                                 THEN 'Y'
                                                                 ELSE CASE
                                                                          WHEN ISNULL(Tom.Comments, '') <> ISNULL(Rex.Comments, '')
                                                                          THEN 'Y'
                                                                          ELSE 'N'
                                                                      END
                                                             END
                                                    END
                                           END AS IsChanged,
                                           CASE
                                               WHEN ISNULL(Tom.Id, '') = ''
                                               THEN 'N'
                                               ELSE 'Y'
                                           END AS TomRecordExist,
                                           CASE
                                               WHEN ISNULL(Rex.Id, '') = ''
                                               THEN 'N'
                                               ELSE 'Y'
                                           END AS RexRecordExist, 
                                           Tom.Id AS TOM_Id, 
                                           Tom.ClientId, 
                                           Tom.TaskDescription, 
                                           Tom.Comments, 
                                           Tom.DueDate, 
                                           TOM.Completed,'Y' SyncTOM, 
                                           ' ' AS ' ', 
                                           Rex.Id AS Id, 
                                           Rex.ClientId, 
                                           Rex.TaskDescription, 
                                           Rex.Comments, 
                                           Rex.DueDate, 
                                           Rex.Completed, 'N' SyncTOMREX
                                      FROM KioskClientReminder AS Tom
                                      FULL JOIN @rexkioskclientreminder AS Rex ON Tom.Id = Rex.Id
                                                                                  AND Rex.ClientId = Tom.ClientId
                                     WHERE Tom.ClientId = @clientid
                                           AND Tom.CompanyId = @companyid
                                           OR Rex.ClientId = @clientid
                                    ORDER BY Tom_Id, 
                                             Id;
                                END;
                                    ELSE
                                BEGIN
                                    IF(@tablename = 'ClientResidentFinancialAccounts')
                                    BEGIN
                                        DECLARE @rexclientresidentfinancialaccounts TABLE(Id int, ClientId int, ResidentFinancialAccountTypeId int, AccountDescription varchar(50), CurrentBalance decimal(10, 2), OpenDate date, CloseDate date);
                                        INSERT INTO @rexclientresidentfinancialaccounts(Id, 
                                                                                        ClientId, 
                                                                                        ResidentFinancialAccountTypeId, 
                                                                                        AccountDescription, 
                                                                                        CurrentBalance, 
                                                                                        OpenDate, 
                                                                                        CloseDate)
                                        SELECT ClientResidentFinancialAccountId, 
                                               ClientId, 
                                               ResidentFinancialAccountTypeId, 
                                               AccountDescription, 
                                               CurrentBalance, 
                                               OpenDate, 
                                               CloseDate
                                          FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientResidentFinancialAccounts', 3) WITH(ClientResidentFinancialAccountId int, ClientId int, ResidentFinancialAccountTypeId int, AccountDescription varchar(50), CurrentBalance decimal(10, 2), OpenDate date, CloseDate date);

                                        SELECT CASE
                                                   WHEN ISNULL(Tom.ResidentFinancialAccountType, '') <> ISNULL(Rex.ResidentFinancialAccountTypeId, '')
                                                   THEN 'Y'
                                                   ELSE CASE
                                                            WHEN ISNULL(dbo.fn_GetResidentClientFinancialBalance(Tom.Clientid, Tom.residentfinancialaccounttype, Tom.clientresidentfinancialaccountid), 0) <> ISNULL(Rex.CurrentBalance, 0)
                                                            THEN 'Y'
                                                            ELSE CASE
                                                                     WHEN ISNULL(Tom.OpenDate, '') <> ISNULL(Rex.OpenDate, '')
                                                                     THEN 'Y'
                                                                     ELSE CASE
                                                                              WHEN ISNULL(Tom.CloseDate, '') <> ISNULL(Rex.CloseDate, '')
                                                                              THEN 'Y'
                                                                              ELSE CASE
                                                                                       WHEN ISNULL(Tom.AccountDescription, '') <> ISNULL(Rex.AccountDescription, '')
                                                                                       THEN 'Y'
                                                                                       ELSE 'N'
                                                                                   END
                                                                          END
                                                                 END
                                                        END
                                               END AS IsChanged,
                                               CASE
                                                   WHEN ISNULL(Tom.ClientResidentFinancialAccountId, '') = ''
                                                   THEN 'N'
                                                   ELSE 'Y'
                                               END AS TomRecordExist,
                                               CASE
                                                   WHEN ISNULL(Rex.Id, '') = ''
                                                   THEN 'N'
                                                   ELSE 'Y'
                                               END AS RexRecordExist, 
                                               Tom.ClientResidentFinancialAccountId AS TOM_Id, 
                                               Tom.ClientId, 
                                               Tom.ResidentFinancialAccountType, 
                                               Tom.AccountDescription, 
                                               dbo.fn_GetResidentClientFinancialBalance(Tom.Clientid, Tom.residentfinancialaccounttype, Tom.clientresidentfinancialaccountid) AS CurrentBalance, 
                                               TOM.OpenDate, 
                                               TOM.CloseDate,'Y' SyncTOM, 
                                               ' ' AS ' ', 
                                               Rex.Id, 
                                               Rex.ClientId, 
                                               Rex.ResidentFinancialAccountTypeId, 
                                               Rex.AccountDescription, 
                                               Rex.CurrentBalance, 
                                               Rex.OpenDate, 
                                               Rex.CloseDate, 'N' SyncTOMREX
                                          FROM ClientResidentFinancialAccounts AS Tom
                                          FULL JOIN @rexclientresidentfinancialaccounts AS Rex ON Tom.ClientResidentFinancialAccountId = Rex.Id
                                                                                                  AND Tom.ClientId = Rex.ClientId
                                         WHERE Tom.ClientId = @clientid
                                               AND Tom.CompanyId = @companyid
                                               OR Rex.ClientId = @clientid
                                        ORDER BY Tom_Id, 
                                                 Id;
                                    END;
                                        ELSE
                                    BEGIN
                                        IF(@tablename = 'ClientResidentFinancialAccountDetails')
                                        BEGIN
                                            DECLARE @rexclientresidentfinancialaccountdetails TABLE(Id int, ClientId int, ClientResidentFinancialAccountId int, TransactionDate datetime, TransactionTypeRFId int, TransactionAmount decimal(9, 2), EmployerId int, CheckDate date, GrossPay decimal(9, 2), NetPay decimal(9, 2), Payee varchar(200), TransferFromAccount int, TransferToAccount int, RecordDeleted char(1));

                                            INSERT INTO @rexclientresidentfinancialaccountdetails(Id, 
                                                                                                  ClientResidentFinancialAccountId, 
                                                                                                  TransactionDate, 
                                                                                                  TransactionTypeRFId, 
                                                                                                  TransactionAmount, 
                                                                                                  EmployerId, 
                                                                                                  CheckDate, 
                                                                                                  GrossPay, 
                                                                                                  NetPay, 
                                                                                                  Payee, 
                                                                                                  TransferFromAccount, 
                                                                                                  TransferToAccount, 
                                                                                                  RecordDeleted)
                                            SELECT Id, 
                                                   ClientResidentFinancialAccountId, 
                                                   TransactionDate, 
                                                   TransactionTypeRFId, 
                                                   TransactionAmount, 
                                                   EmployerId, 
                                                   CheckDate, 
                                                   GrossPay, 
                                                   NetPay, 
                                                   Payee, 
                                                   TransferFromAccount, 
                                                   TransferToAccount, 
                                                   RecordDeleted
                                              FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientResidentFinancialAccountDetails', 3) WITH(Id int, ClientId int, ClientResidentFinancialAccountId int, TransactionDate datetime, TransactionTypeRFId int, TransactionAmount decimal(9, 2), EmployerId int, CheckDate date, GrossPay decimal(9, 2), NetPay decimal(9, 2), Payee varchar(200), TransferFromAccount int, TransferToAccount int, RecordDeleted char(1));  
                                            --select * into RexPP from @RexClientResidentFinancialAccountDetails  
                                            SELECT CASE
                                                       WHEN ISNULL(Tom.ClientResidentFinancialAccountId, '') <> ISNULL(Rex.ClientResidentFinancialAccountId, '')
                                                       THEN 'Y'
                                                       ELSE CASE
                                                                WHEN ISNULL(Tom.TransactionDate, '') <> ISNULL(Rex.TransactionDate, '')
                                                                THEN 'Y'
                                                                ELSE CASE
                                                                         WHEN ISNULL(Tom.TransactionTypeRFId, '') <> ISNULL(Rex.TransactionTypeRFId, '')
                                                                         THEN 'Y'
                                                                         ELSE CASE
                                                                                  WHEN ISNULL(Tom.TransactionAmount, '') <> ISNULL(Rex.TransactionAmount, '')
                                                                                  THEN 'Y'
                                                                                  ELSE CASE
                                                                                           WHEN ISNULL(Tom.CheckDate, '') <> ISNULL(Rex.CheckDate, '')
                                                                                           THEN 'Y'
                                                                                           ELSE CASE
                                                                                                    WHEN ISNULL(Tom.NetPay, -1) <> ISNULL(Rex.NetPay, -1)
                                                                                                    THEN 'Y'
                                                                                                    ELSE CASE
                                                                                                             WHEN ISNULL(Tom.Payee, '') <> ISNULL(Rex.Payee, '')
                                                                                                             THEN 'Y'
                                                                                                             ELSE CASE
                                                                                                                      WHEN ISNULL(Tom.TransferFromAccount, '') <> ISNULL(Rex.TransferFromAccount, '')
                                                                                                                      THEN 'Y'
                                                                                                                      ELSE CASE
                                                                                                                               WHEN ISNULL(Tom.TransferToAccount, '') <> ISNULL(Rex.TransferToAccount, '')
                                                                                                                               THEN 'Y'
                                                                                                                               ELSE CASE
                                                                                                                                        WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                                                                                                        THEN 'Y'
                                                                                                                                        ELSE 'N'
                                                                                                                                    END
                                                                                                                           END
                                                                                                                  END
                                                                                                         END
                                                                                                END
                                                                                       END
                                                                              END
                                                                     END
                                                            END
                                                   END AS IsChanged,
                                                   CASE
                                                       WHEN ISNULL(Tom.ClientResidentFinancialAccountId, '') = ''
                                                       THEN 'N'
                                                       ELSE 'Y'
                                                   END AS TomRecordExist,
                                                   CASE
                                                       WHEN ISNULL(Rex.ClientResidentFinancialAccountId, '') = ''
                                                       THEN 'N'
                                                       ELSE 'Y'
                                                   END AS RexRecordExist, 
                                                   Tom.ClientResidentFinancialAccountDetailId AS TOM_Id, 
                                                   Tom.ClientResidentFinancialAccountId, 
                                                   Tom.TransactionDate, 
                                                   Tom.TransactionTypeRFId, 
                                                   Tom.TransactionAmount, 
                                                   Tom.EmployerId, 
                                                   Tom.CheckDate, 
                                                   Tom.GrossPay, 
                                                   Tom.NetPay, 
                                                   Tom.Payee, 
                                                   Tom.TransferFromAccount, 
                                                   Tom.TransferToAccount, 
                                                   Tom.RecordDeleted,'Y' SyncTOM, 
                                                   ' ' AS ' ', 
                                                   Rex.Id, 
                                                   Rex.ClientResidentFinancialAccountId, 
                                                   Rex.TransactionDate, 
                                                   Rex.TransactionTypeRFId, 
                                                   Rex.TransactionAmount, 
                                                   Rex.EmployerId, 
                                                   Rex.CheckDate, 
                                                   Rex.GrossPay, 
                                                   Rex.NetPay, 
                                                   Rex.Payee, 
                                                   Rex.TransferFromAccount, 
                                                   Rex.TransferToAccount, 
                                                   Rex.RecordDeleted, 'N' SyncTOMREX
                                              FROM ClientResidentFinancialAccountDetails AS Tom
                                              INNER JOIN ClientResidentFinancialAccounts AS CFA ON Tom.ClientResidentFinancialAccountId = CFA.ClientResidentFinancialAccountId
                                              FULL JOIN @rexclientresidentfinancialaccountdetails AS Rex ON Tom.ClientResidentFinancialAccountDetailId = Rex.Id
                                             WHERE CFA.ClientId = @clientid
                                                   AND CFA.CompanyId = @companyid;
                                        END;
                                            ELSE
                                        BEGIN
                                            IF(@tablename = 'Leaves')
                                            BEGIN
                                                DECLARE @rexclientleaves TABLE(Id int, ClientId int, LeaveType int, ScheduledDeparture datetime, DepartTransMode int, DepartTransDetails varchar(100), DepartTransDriver int, DepartTransVehicle int, DepartTravelTime int, ScheduledReturn datetime, ReturnTransMode int, ReturnTransDetails varchar(100), ReturnTransDriver int, ReturnTransVehicle int, ReturnTravelTime int, RecordDeleted char(1), Comments varchar(max));
                                                INSERT INTO @rexclientleaves(Id, 
                                                                             ClientId, 
                                                                             LeaveType, 
                                                                             ScheduledDeparture, 
                                                                             DepartTransMode, 
                                                                             DepartTransDetails, 
                                                                             DepartTransDriver, 
                                                                             DepartTransVehicle, 
                                                                             DepartTravelTime, 
                                                                             ScheduledReturn, 
                                                                             ReturnTransMode, 
                                                                             ReturnTransDetails, 
                                                                             ReturnTransDriver, 
                                                                             ReturnTransVehicle, 
                                                                             ReturnTravelTime, 
                                                                             RecordDeleted, 
                                                                             Comments)
                                                SELECT ClientLeaveId AS Id, 
                                                       ClientId, 
                                                       LeaveType, 
                                                       ScheduledDeparture, 
                                                       DepartTransMode, 
                                                       DepartTransDetails, 
                                                       DepartTransDriver, 
                                                       DepartTransVehicle, 
                                                       DepartTravelTime, 
                                                       ScheduledReturn, 
                                                       ReturnTransMode, 
                                                       ReturnTransDetails, 
                                                       ReturnTransDriver, 
                                                       ReturnTransVehicle, 
                                                       ReturnTravelTime, 
                                                       RecordDeleted, 
                                                       Comments
                                                  FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientLeaves', 3) WITH(ClientLeaveId int, ClientId int, LeaveType int, ScheduledDeparture datetime, DepartTransMode int, DepartTransDetails varchar(100), DepartTransDriver int, DepartTransVehicle int, DepartTravelTime int, ScheduledReturn datetime, ReturnTransMode int, ReturnTransDetails varchar(100), ReturnTransDriver int, ReturnTransVehicle int, ReturnTravelTime int, RecordDeleted char(1), Comments varchar(max));

                                                SELECT CASE
                                                           WHEN ISNULL(Tom.LeaveType, '') <> ISNULL(Rex.LeaveType, '')
                                                           THEN 'Y'
                                                           ELSE CASE
                                                                    WHEN ISNULL(Tom.ScheduledDeparture, '') <> ISNULL(Rex.ScheduledDeparture, '')
                                                                    THEN 'Y'
                                                                    ELSE CASE
                                                                             WHEN ISNULL(Tom.DepartTravelTime, '') <> ISNULL(Rex.DepartTravelTime, '')
                                                                             THEN 'Y'
                                                                             ELSE CASE
                                                                                      WHEN ISNULL(Tom.ScheduledReturn, '') <> ISNULL(Rex.ScheduledReturn, '')
                                                                                      THEN 'Y'
                                                                                      ELSE CASE
                                                                                               WHEN ISNULL(Tom.ReturnTravelTime, '') <> ISNULL(Rex.ReturnTravelTime, '')
                                                                                               THEN 'Y'
                                                                                               ELSE CASE
                                                                                                        WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                                                                        THEN 'Y'
                                                                                                        ELSE CASE
                                                                                                                 WHEN ISNULL(Tom.DepartTransMode, '') <> ISNULL(Rex.DepartTransMode, '')
                                                                                                                 THEN 'Y'
                                                                                                                 ELSE CASE
                                                                                                                          WHEN ISNULL(Tom.ReturnTransMode, '') <> ISNULL(Rex.ReturnTransMode, '')
                                                                                                                          THEN 'Y'
                                                                                                                          ELSE CASE
                                                                                                                                   WHEN ISNULL(Tom.DepartTransDriver, '') <> ISNULL(Rex.DepartTransDriver, '')
                                                                                                                                   THEN 'Y'
                                                                                                                                   ELSE CASE
                                                                                                                                            WHEN ISNULL(Tom.ReturnTransDriver, '') <> ISNULL(Rex.ReturnTransDriver, '')
                                                                                                                                            THEN 'Y'
                                                                                                                                            ELSE 'N'
                                                                                                                                        END
                                                                                                                               END
                                                                                                                      END
                                                                                                             END
                                                                                                    END
                                                                                           END
                                                                                  END
                                                                         END
                                                                END
                                                       END AS IsChanged,
                                                       CASE
                                                           WHEN ISNULL(Tom.ClientLeaveId, '') = ''
                                                           THEN 'N'
                                                           ELSE 'Y'
                                                       END AS TomRecordExist,
                                                       CASE
                                                           WHEN ISNULL(Rex.Id, '') = ''
                                                           THEN 'N'
                                                           ELSE 'Y'
                                                       END AS RexRecordExist, 
                                                       Tom.ClientLeaveId AS TOM_Id, 
                                                       Tom.ClientId, 
                                                       Tom.LeaveType, 
                                                       Tom.ScheduledDeparture, 
                                                       Tom.DepartTransMode, 
                                                       Tom.DepartTransDetails, 
                                                       Tom.DepartTransDriver, 
                                                       Tom.DepartTransVehicle, 
                                                       Tom.DepartTravelTime, 
                                                       Tom.ScheduledReturn, 
                                                       Tom.ReturnTransMode, 
                                                       Tom.ReturnTransDetails, 
                                                       Tom.ReturnTransDriver, 
                                                       Tom.ReturnTransVehicle, 
                                                       Tom.ReturnTravelTime, 
                                                       Tom.RecordDeleted, 
                                                       Tom.Comments,'Y' SyncTOM, 
                                                       ' ' AS ' ', 
                                                       Rex.Id, 
                                                       Rex.ClientId, 
                                                       Rex.LeaveType, 
                                                       Rex.ScheduledDeparture, 
                                                       Rex.DepartTransMode, 
                                                       Rex.DepartTransDetails, 
                                                       Rex.DepartTransDriver, 
                                                       Rex.DepartTransVehicle, 
                                                       Rex.DepartTravelTime, 
                                                       Rex.ScheduledReturn, 
                                                       Rex.ReturnTransMode, 
                                                       Rex.ReturnTransDetails, 
                                                       Rex.ReturnTransDriver, 
                                                       Rex.ReturnTransVehicle, 
                                                       Rex.ReturnTravelTime, 
                                                       Rex.RecordDeleted, 
                                                       Rex.Comments, 
													   'N' SyncTOMREX
                                                  FROM ClientLeaves AS Tom
                                                  INNER JOIN KioskProfiles AS KP ON Tom.ClientId = KP.ClientId
                                                  FULL JOIN @rexclientleaves AS Rex ON Tom.ClientLeaveId = Rex.Id
                                                 WHERE Tom.ClientId = @clientid
                                                       AND KP.CompanyId = @companyid
                                                       OR Rex.ClientId = @clientid
                                                ORDER BY Tom_Id, 
                                                         Id;
                                            END;
                                                ELSE
                                            BEGIN
                                                IF(@tablename = 'LeaveSchedules')
                                                BEGIN
                                                    DECLARE @rexclientleaveschedules TABLE(Id int, ClientId int, ClientLeaveId int, ScheduleType int, ScheduleDestinationKey int, StartDate datetime, EndDate datetime, ReturnsToCenter char(1), InterimTransMode int, InterimTransDetails varchar(100), InterimTransDriver int, InterimTransVehicle int, InterimTravelTime int, DestinationType int, Comments varchar(max), RecordDeleted char(1));
                                                    INSERT INTO @rexclientleaveschedules(Id, 
                                                                                         ClientId, 
                                                                                         ClientLeaveId, 
                                                                                         ScheduleType, 
                                                                                         ScheduleDestinationKey, 
                                                                                         StartDate, 
                                                                                         EndDate, 
                                                                                         ReturnsToCenter, 
                                                                                         InterimTransMode, 
                                                                                         InterimTransDetails, 
                                                                                         InterimTransDriver, 
                                                                                         InterimTransVehicle, 
                                                                                         InterimTravelTime, 
                                                                                         DestinationType, 
                                                                                         Comments, 
                                                                                         RecordDeleted)
                                                    SELECT ClientLeaveScheduleId, 
                                                           ClientId, 
                                                           ClientLeaveId, 
                                                           ScheduleType, 
                                                           ScheduleDestinationKey, 
                                                           StartDate, 
                                                           EndDate, 
                                                           ReturnsToCenter, 
                                                           InterimTransMode, 
                                                           InterimTransDetails, 
                                                           InterimTransDriver, 
                                                           InterimTransVehicle, 
                                                           InterimTravelTime, 
                                                           DestinationType, 
                                                           Comments, 
                                                           RecordDeleted
                                                      FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientLeaveSchedules', 3) WITH(ClientLeaveScheduleId int, ClientId int, ClientLeaveId int, ScheduleType int, ScheduleDestinationKey int, StartDate datetime, EndDate datetime, ReturnsToCenter char(1), InterimTransMode int, InterimTransDetails varchar(100), InterimTransDriver int, InterimTransVehicle int, InterimTravelTime int, DestinationType int, Comments varchar(max), RecordDeleted char(1));
			
                                                    SELECT CASE
                                                               WHEN ISNULL(Tom.ClientLeaveId, '') <> ISNULL(Rex.ClientLeaveId, '')
                                                               THEN 'Y'
                                                               ELSE CASE
                                                                        WHEN ISNULL(Tom.ScheduleType, '') <> ISNULL(Rex.ScheduleType, '')
                                                                        THEN 'Y'
                                                                        ELSE CASE
                                                                                 WHEN ISNULL(Tom.ScheduleDestinationKey, '') <> ISNULL(Rex.ScheduleDestinationKey, '')
                                                                                 THEN 'Y'
                                                                                 ELSE CASE
                                                                                          WHEN ISNULL(Tom.StartDate, '') <> ISNULL(Rex.StartDate, '')
                                                                                          THEN 'Y'
                                                                                          ELSE CASE
                                                                                                   WHEN ISNULL(Tom.EndDate, '') <> ISNULL(Rex.EndDate, '')
                                                                                                   THEN 'Y'
                                                                                                   ELSE CASE
                                                                                                            WHEN ISNULL(Tom.RecordDeleted, '') <> ISNULL(Rex.RecordDeleted, '')
                                                                                                            THEN 'Y'
                                                                                                            ELSE CASE
                                                                                                                     WHEN ISNULL(Tom.InterimTransMode, '') <> ISNULL(Rex.InterimTransMode, '')
                                                                                                                     THEN 'Y'
                                                                                                                     ELSE CASE
                                                                                                                              WHEN ISNULL(Tom.InterimTravelTime, '') <> ISNULL(Rex.InterimTravelTime, '')
                                                                                                                              THEN 'Y'
                                                                                                                              ELSE CASE
                                                                                                                                       WHEN ISNULL(Tom.DestinationType, '') <> ISNULL(Rex.DestinationType, '')
                                                                                                                                       THEN 'Y'
                                                                                                                                       ELSE CASE
                                                                                                                                                WHEN ISNULL(Tom.InterimTransDriver, '') <> ISNULL(Rex.InterimTransDriver, '')
                                                                                                                                                THEN 'Y'
                                                                                                                                                ELSE 'N'
                                                                                                                                            END
                                                                                                                                   END
                                                                                                                          END
                                                                                                                 END
                                                                                                        END
                                                                                               END
                                                                                      END
                                                                             END
                                                                    END
                                                           END AS IsChanged,
                                                           CASE
                                                               WHEN ISNULL(Tom.ClientLeaveId, '') = ''
                                                               THEN 'N'
                                                               ELSE 'Y'
                                                           END AS TomRecordExist,
                                                           CASE
                                                               WHEN ISNULL(Rex.ClientLeaveId, '') = ''
                                                               THEN 'N'
                                                               ELSE 'Y'
                                                           END AS RexRecordExist, 
                                                           Tom.ClientLeaveScheduleId AS TOM_Id, 
                                                           Tom.ClientLeaveId, 
                                                           Tom.ScheduleType, 
                                                           Tom.ScheduleDestinationKey, 
                                                           Tom.StartDate, 
                                                           Tom.EndDate, 
                                                           Tom.ReturnsToCenter, 
                                                           Tom.InterimTransMode, 
                                                           Tom.InterimTransDetails, 
                                                           Tom.InterimTransDriver, 
                                                           Tom.InterimTransVehicle, 
                                                           Tom.InterimTravelTime, 
                                                           Tom.RecordDeleted, 
                                                           Tom.DestinationType, 
                                                           Tom.Comments,
														   'Y' SyncTOM, 
                                                           ' ' AS ' ', 
                                                           Rex.Id, 
                                                           Rex.ClientLeaveId, 
                                                           Rex.ScheduleType, 
                                                           Rex.ScheduleDestinationKey, 
                                                           Rex.StartDate, 
                                                           Rex.EndDate, 
                                                           Rex.ReturnsToCenter, 
                                                           Rex.InterimTransMode, 
                                                           Rex.InterimTransDetails, 
                                                           Rex.InterimTransDriver, 
                                                           Rex.InterimTransVehicle, 
                                                           Rex.InterimTravelTime, 
                                                           Rex.RecordDeleted, 
                                                           Rex.DestinationType, 
                                                           Rex.Comments, 
														   'N' SyncTOMREX
                                                      FROM ClientLeaveSchedules AS Tom
                                                      INNER JOIN ClientLeaves AS L ON Tom.ClientLeaveId = L.ClientLeaveId
                                                      INNER JOIN KioskProfiles AS KP ON KP.ClientId = L.ClientId
                                                      FULL JOIN @rexclientleaveschedules AS Rex ON Tom.KioskKey = Rex.Id
                                                                                                   AND L.ClientId = Rex.ClientId
                                                     WHERE L.ClientId = @clientid
                                                           AND KP.CompanyId = @companyid
                                                           OR Rex.ClientId = @clientid;
                                                END;
                                                    ELSE
                                                BEGIN
                                                    IF(@tablename = 'Agenda')
                                                    BEGIN
                                                        DECLARE @rexleaves TABLE(Id int, ClientId int, LeaveType int, ScheduledDeparture datetime, DepartTransMode int, DepartTransDriver int, DepartTransVehicle int, DepartTravelTime int, ScheduledReturn datetime, ReturnTransMode int, ReturnTransDetails varchar(100), ReturnTransDriver int, ReturnTransVehicle int, ReturnTravelTime int, RecordDeleted char(1), Comments varchar(max), RequestStatus int, AgendaStatus varchar(50));

                                                        INSERT INTO @rexleaves(Id, 
                                                                               ClientId, 
                                                                               LeaveType, 
                                                                               ScheduledDeparture, 
                                                                               DepartTransMode, --DepartTransDetails,  
                                                                               DepartTransDriver, 
                                                                               DepartTransVehicle, 
                                                                               DepartTravelTime, 
                                                                               ScheduledReturn, 
                                                                               ReturnTransMode, 
                                                                               ReturnTransDetails, 
                                                                               ReturnTransDriver, 
                                                                               ReturnTransVehicle, 
                                                                               ReturnTravelTime, 
                                                                               RecordDeleted, 
                                                                               Comments, 
                                                                               RequestStatus, 
                                                                               AgendaStatus)
                                                        SELECT Id, 
                                                               ClientId, 
                                                               LeaveType, 
                                                               ScheduledDeparture, 
                                                               DepartTransMode, --DepartTransDetails,  
                                                               DepartTransDriver, 
                                                               DepartTransVehicle, 
                                                               DepartTravelTime, 
                                                               ScheduledReturn, 
                                                               ReturnTransMode, 
                                                               ReturnTransDetails, 
                                                               ReturnTransDriver, 
                                                               ReturnTransVehicle, 
                                                               ReturnTravelTime, 
                                                               RecordDeleted, 
                                                               Comments, 
                                                               RequestStatus, 
                                                               AgendaStatus
                                                          FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientLeaves', 3) WITH(Id int, ClientId int, LeaveType int, ScheduledDeparture datetime, DepartTransMode int, DepartTransDetails varchar(100), DepartTransDriver int, DepartTransVehicle int, DepartTravelTime int, ScheduledReturn datetime, ReturnTransMode int, ReturnTransDetails varchar(100), ReturnTransDriver int, ReturnTransVehicle int, ReturnTravelTime int, RecordDeleted char(1), Comments varchar(max), RequestStatus int, AgendaStatus varchar(50));
													
                                                        IF(ISNULL(@keyid, '') <> ''
                                                           AND @keyid > 0)
                                                        BEGIN  
															EXEC sp_InsertModifyKioskClientLeavesAndSchedules  
															 @idoc,  
															 @doc,  
															 @companyid; 
                                                            --select * from KioskClientLeaves Where KioskId =4  
                --                                            UPDATE Tom
                --                                              SET 
                --                                                  LeaveType = Rex.LeaveType, 
                --                                                  ScheduledDeparture = Rex.ScheduledDeparture, 
                --                                                  DepartTransMode = Rex.DepartTransMode, 
                --                                                  DepartTransDriver = Rex.DepartTransDriver, 
                --                                                  DepartTransVehicle = Rex.DepartTransVehicle, 
                --                                                  DepartTravelTime = Rex.DepartTravelTime, 
                --                                                  ScheduledReturn = Rex.ScheduledReturn, 
                --                                                  ReturnTransMode = Rex.ReturnTransMode, 
                --                                                  ReturnTransDetails = Rex.ReturnTransDetails, 
                --                                                  ReturnTransDriver = Rex.ReturnTransDriver, 
                --                                                  ReturnTransVehicle = Rex.ReturnTransVehicle, 
                --                                                  ReturnTravelTime = Rex.ReturnTravelTime, 
                --                                                  Comments = Rex.Comments, 
                --                                                  AgendaStatus = Rex.RequestStatus
                --                                              FROM KioskClientLeaves Tom
                --                                              INNER JOIN @rexleaves Rex ON Tom.KioskId = Rex.Id
                --                                             WHERE KioskId = @keyid ;

															 --INSERT INTO KioskClientLeaves (KioskId, ClientId, LeaveType, ScheduledDeparture, DepartTransMode, DepartTransDriver, DepartTransVehicle, 
																--	DepartTravelTime, ScheduledReturn, ReturnTransMode, ReturnTransDetails, ReturnTransDriver, ReturnTransVehicle, 
																--	ReturnTravelTime, Comments, AgendaStatus, CompanyId, CreatedDate)
																--	SELECT Id, ClientId, LeaveType, ScheduledDeparture, DepartTransMode, DepartTransDriver, DepartTransVehicle, 
																--	DepartTravelTime, ScheduledReturn, ReturnTransMode, ReturnTransDetails, ReturnTransDriver, ReturnTransVehicle, 
																--	ReturnTravelTime, Comments, RequestStatus, @companyid CompanyId, Getdate() CreatedDate 
																--	FROM @rexleaves Rex Where Id = @keyid and not Exists(select 1 from KioskClientLeaves where KioskId = Rex.Id);
															
                                                        END;

                                                        SELECT CASE
                                                                   WHEN ISNULL(Tom.LeaveType, '') <> ISNULL(Rex.LeaveType, '')
                                                                   THEN 'Y'
                                                                   ELSE CASE
                                                                            WHEN ISNULL(Tom.ScheduledDeparture, '') <> ISNULL(Rex.ScheduledDeparture, '')
                                                                            THEN 'Y'
                                                                            ELSE CASE
                                                                                     WHEN ISNULL(Tom.DepartTravelTime, -1) <> ISNULL(Rex.DepartTravelTime, -1)
                                                                                     THEN 'Y'
                                                                                     ELSE CASE
                                                                                              WHEN ISNULL(Tom.ScheduledReturn, '') <> ISNULL(Rex.ScheduledReturn, '')
                                                                                              THEN 'Y'
                                                                                              ELSE CASE
                                                                                                       WHEN ISNULL(Tom.ReturnTravelTime, '') <> ISNULL(Rex.ReturnTravelTime, '')
                                                                                                       THEN 'Y'
                                                                                                       ELSE CASE
                                                                                                                WHEN ISNULL(Tom.DepartTransMode, '') <> ISNULL(Rex.DepartTransMode, '')
                                                                                                                THEN 'Y'
                                                                                                                ELSE CASE
                                                                                                                         WHEN ISNULL(Tom.ReturnTransMode, '') <> ISNULL(Rex.ReturnTransMode, '')
                                                                                                                         THEN 'Y'
                                                                                                                         ELSE CASE WHEN (ISNULL(Tom.DepartTransDriver, '') <> ISNULL(Rex.DepartTransDriver, '') OR ISNULL(Tom.ReturnTransDriver, '') <> ISNULL(Rex.ReturnTransDriver, ''))
                                                                                                                                  THEN 'Y'
                                                                                                                                  ELSE CASE
                                                                                                                                           WHEN ISNULL(Tom.Comments, '') <> ISNULL(Rex.Comments, '')
                                                                                                                                            THEN 'Y'  
																																				ELSE CASE WHEN (ISNULL(Rex.AgendaStatus,'')<> ISNULL(GC.CodeName,'') AND ISNULL(GC.CodeName,'Requested')<>'')
																																				--((ISNULL(GC.CodeName,'') = 'Approved'AND Rex.AgendaStatus = 'Review')
																																				--		OR (ISNULL(GC.CodeName,'') = 'Deny' AND Rex.AgendaStatus = 'Review') 
																																				--		Or (Rex.AgendaStatus = 'Requested' and ISNULL(GC.CodeName,'') <> 'Requested'))
																																					THEN 'Y'
																																					ELSE 'N'
																																				END
                                                                                                                                       END
                                                                                                                              END
                                                                                                                     END
                                                                                                            END
                                                                                                   END
                                                                                          END
                                                                                 END
                                                                        END
                                                              END  AS IsChanged,
                                                               CASE
                                                                   WHEN ISNULL(Tom.KioskId, '') = ''
                                                                   THEN 'N'
                                                                   ELSE 'Y'
                                                               END AS TomRecordExist,
                                                               CASE
                                                                   WHEN ISNULL(Rex.Id, '') = ''
                                                                   THEN 'N'
                                                                   ELSE 'Y'
                                                               END AS RexRecordExist, 
                                                               Tom.KioskId AS TOM_Id, 
                                                               Tom.ClientId, 
                                                               Tom.LeaveType, 
                                                               Tom.ScheduledDeparture, 
                                                               Tom.DepartTransMode, 
                                                               Tom.DepartTransDriver, 
                                                               Tom.DepartTransVehicle, 
                                                               Tom.DepartTravelTime, 
                                                               Tom.ScheduledReturn, 
                                                               Tom.ReturnTransMode, 
                                                               Tom.ReturnTransDetails, 
                                                               Tom.ReturnTransDriver, 
                                                               Tom.ReturnTransVehicle, 
                                                               Tom.ReturnTravelTime, 
                                                               Tom.Comments, 
                                                               GC.CodeName AS AgendaStatus,
                                                               CASE
                                                                   WHEN((GC.CodeName = 'Approved'
                                                                         AND Rex.AgendaStatus = 'Review'
                                                                        )
                                                                        OR (GC.CodeName = 'Deny'
                                                                            AND Rex.AgendaStatus = 'Review'
                                                                           ))
                                                                   THEN 'Y'
                                                                   ELSE 'N'
                                                               END AS SyncTOM, 
                                                               ' ' AS ' ', 
                                                               Rex.Id, 
                                                               Rex.ClientId, 
                                                               Rex.LeaveType, 
                                                               Rex.ScheduledDeparture, 
                                                               Rex.DepartTransMode, 
                                                               Rex.DepartTransDriver, 
                                                               Rex.DepartTransVehicle, 
                                                               Rex.DepartTravelTime, 
                                                               Rex.ScheduledReturn, 
                                                               Rex.ReturnTransMode, 
                                                               Rex.ReturnTransDetails, 
                                                               Rex.ReturnTransDriver, 
                                                               Rex.ReturnTransVehicle, 
                                                               Rex.ReturnTravelTime, 
                                                               Rex.Comments, 
                                                               Rex.AgendaStatus,
                                                               CASE
                                                                   WHEN((GC.CodeName = 'Deny'
                                                                         AND Rex.AgendaStatus = 'Requested'
                                                                        )
                                                                        OR ISNULL(GC.CodeName, '') = '')
                                                                   THEN 'Y'
                                                                   ELSE 'N'
                                                               END AS SyncTOMREX
                                                          FROM KioskClientLeaves AS Tom
                                                          LEFT JOIN GlobalCodes AS GC ON Tom.AgendaStatus = GC.GlobalCodeId
                                                          FULL JOIN @rexleaves AS Rex ON Tom.KioskId = Rex.Id
                                                                                         AND Tom.ClientId = Rex.ClientId
                                                         WHERE Tom.ClientId = @clientid
														 AND GC.CodeName IN ('Requested', 'Deny')
                                                               AND Tom.CompanyId = @companyid
                                                               OR Rex.ClientId = @clientid
                                                        ORDER BY Tom_Id, 
                                                                 Id;
                                                    END;
                                                        ELSE
                                                    BEGIN
                                                        IF(@tablename = 'AgendaSchedule')
                                                        BEGIN
                                                            DECLARE @rexleaveschedules TABLE(Id int, ClientId int, ClientLeaveId int, ScheduleType int, ScheduleDestinationKey int, StartDate datetime, EndDate datetime, ReturnsToCenter char(1), InterimTransMode int, InterimTransDetails varchar(100), InterimTransDriver int, InterimTransVehicle int, InterimTravelTime int, DestinationType int, Comments varchar(max), RecordDeleted char(1), AgendaStatus varchar(50));
                                                            INSERT INTO @rexleaveschedules(Id, 
                                                                                           ClientId, 
                                                                                           ClientLeaveId, 
                                                                                           ScheduleType, 
                                                                                           ScheduleDestinationKey, 
                                                                                           StartDate, 
                                                                                           EndDate, 
                                                                                           ReturnsToCenter, 
                                                                                           InterimTransMode, 
                                                                                           InterimTransDetails, 
                                                                                           InterimTransDriver, 
                                                                                           InterimTransVehicle, 
                                                                                           InterimTravelTime, 
                                                                                           DestinationType, 
                                                                                           Comments, 
                                                                                           RecordDeleted, 
                                                                                           AgendaStatus)
                                                            SELECT Id, 
                                                                   ClientId, 
                                                                   ClientLeaveId, 
                                                                   ScheduleType, 
                                                                   ScheduleDestinationKey, 
                                                                   StartDate, 
                                                                   EndDate, 
                                                                   ReturnsToCenter, 
                                                                   InterimTransMode, 
                                                                   InterimTransDetails, 
                                                                   InterimTransDriver, 
                                                                   InterimTransVehicle, 
                                                                   InterimTravelTime, 
                                                                   DestinationType, 
                                                                   Comments, 
                                                                   RecordDeleted, 
                                                                   AgendaStatus
                                                              FROM OPENXML(@idoc, '/DataXML/MainDataSet/ClientLeaveSchedules', 3) WITH(Id int, ClientId int, ClientLeaveId int, ScheduleType int, ScheduleDestinationKey int, StartDate datetime, EndDate datetime, ReturnsToCenter char(1), InterimTransMode int, InterimTransDetails varchar(100), InterimTransDriver int, InterimTransVehicle int, InterimTravelTime int, DestinationType int, Comments varchar(max), RecordDeleted char(1), AgendaStatus varchar(50));   
                                                        --  select * into RexPPP from @RexLeaveSchedules  --select * from rexPPP
                                                            IF(ISNULL(@keyid, '') <> ''
                                                               AND @keyid > 0)
                                                            BEGIN  
                                                                --select * from KioskClientLeaveSchedules Where KioskClientLeaveId =4  
                                                                UPDATE Tom
                                                                  SET 
                                                                      ScheduleType = Rex.ScheduleType, 
                                                                      ScheduleDestinationKey = Rex.ScheduleDestinationKey, 
                                                                      StartDate = Rex.StartDate, 
                                                                      EndDate = Rex.EndDate, 
                                                                      ReturnsToCenter = Rex.ReturnsToCenter, 
                                                                      InterimTransMode = Rex.InterimTransMode, 
                                                                      InterimTransDetails = Rex.InterimTransDetails, 
                                                                      InterimTransDriver = Rex.InterimTransDriver, 
                                                                      InterimTransVehicle = Rex.InterimTravelTime, 
                                                                      InterimTravelTime = Rex.InterimTravelTime, 
                                                                      DestinationType = Rex.DestinationType, 
                                                                      Comments = Rex.Comments
                                                                  FROM KioskClientLeaveSchedules Tom
                                                                  INNER JOIN @rexleaveschedules Rex ON Tom.KioskClientLeaveScheduleId = Rex.Id
                                                                 WHERE KioskClientLeaveScheduleId = @keyid;
																insert into KioskClientLeaveSchedules(KioskClientLeaveScheduleId, 
                                                                                           ClientId, 
                                                                                           KioskClientLeaveId, 
                                                                                           ScheduleType, 
                                                                                           ScheduleDestinationKey, 
                                                                                           StartDate, 
                                                                                           EndDate, 
                                                                                           ReturnsToCenter, 
                                                                                           InterimTransMode, 
                                                                                           InterimTransDetails, 
                                                                                           InterimTransDriver, 
                                                                                           InterimTransVehicle, 
                                                                                           InterimTravelTime, 
                                                                                           DestinationType, 
                                                                                           Comments,                                                                                           
                                                                                           CompanyId)
																			select Id, 
                                                                                           ClientId, 
                                                                                           ClientLeaveId, 
                                                                                           ScheduleType, 
                                                                                           ScheduleDestinationKey, 
                                                                                           StartDate, 
                                                                                           EndDate, 
                                                                                           ReturnsToCenter, 
                                                                                           InterimTransMode, 
                                                                                           InterimTransDetails, 
                                                                                           InterimTransDriver, 
                                                                                           InterimTransVehicle, 
                                                                                           InterimTravelTime, 
                                                                                           DestinationType, 
                                                                                           Comments, 
                                                                                           @companyid from @rexleaveschedules Rex
																						   Where Id = @keyid and not Exists(select 1 from KioskClientLeaveSchedules where KioskClientLeaveScheduleId = Rex.Id)
                                                            END;

                                                            SELECT CASE
                                                                       WHEN ISNULL(Tom.KioskClientLeaveId, '') <> ISNULL(Rex.ClientLeaveId, '')
                                                                       THEN 'Y'
                                                                       ELSE CASE
                                                                                WHEN ISNULL(Tom.ScheduleType, '') <> ISNULL(Rex.ScheduleType, '')
                                                                                THEN 'Y'
                                                                                ELSE CASE
                                                                                         WHEN ISNULL(Tom.ScheduleDestinationKey, '') <> ISNULL(Rex.ScheduleDestinationKey, '')
                                                                                         THEN 'Y'
                                                                                         ELSE CASE
                                                                                                  WHEN ISNULL(Tom.StartDate, '') <> ISNULL(Rex.StartDate, '')
                                                                                                  THEN 'Y'
                                                                                                  ELSE CASE
                                                                                                           WHEN ISNULL(Tom.EndDate, '') <> ISNULL(Rex.EndDate, '')
                                                                                                           THEN 'Y'
                                                                                                           ELSE CASE
                                                                                                                    WHEN ((ISNULL(Tom.InterimTransMode, '') <> ISNULL(Rex.InterimTransMode, '')) or (ISNULL(Tom.InterimTravelTime, '') <> ISNULL(Rex.InterimTravelTime, '')))
                                                                                                                    THEN 'Y'
																														ELSE CASE
                                                                                                                                      WHEN ISNULL(Tom.DestinationType, '') <> ISNULL(Rex.DestinationType, '')
                                                                                                                                      THEN 'Y'
                                                                                                                                      ELSE CASE
                                                                                                                                               WHEN ISNULL(Tom.InterimTransDriver, '') <> ISNULL(Rex.InterimTransDriver, '')
                                                                                                                                               THEN 'Y'
                                                                                                                                               ELSE CASE
                                                                                                                                               WHEN ISNULL(Tom.Comments, '') <> ISNULL(Rex.Comments, '')
                                                                                                                                               THEN 'Y'
                                                                                                                                               ELSE CASE WHEN((ISNULL(GC.CodeName,'') = 'Approved'AND Rex.AgendaStatus = 'Review')
																																								OR (ISNULL(GC.CodeName,'') = 'Deny' AND Rex.AgendaStatus = 'Review') 
																																								Or (Rex.AgendaStatus = 'Requested' and ISNULL(GC.CodeName,'') <> 'Requested'))
																																						   THEN 'Y'
																																						   ELSE 'N'

																																				END

                                                                                                                                          END
                                                                                                                                  END
                                                                                                                         END
                                                                                                                END
                                                                                                       END
                                                                                              END
                                                                                     END
                                                                            END
                                                                   END AS IsChanged,
                                                                   CASE
                                                                       WHEN ISNULL(Tom.KioskClientLeaveId, '') = ''
                                                                       THEN 'N'
                                                                       ELSE 'Y'
                                                                   END AS TomRecordExist,
                                                                   CASE
                                                                       WHEN ISNULL(Rex.ClientLeaveId, '') = ''
                                                                       THEN 'N'
                                                                       ELSE 'Y'
                                                                   END AS RexRecordExist, 
                                                                   Tom.KioskClientLeaveScheduleId AS TOM_Id, 
                                                                   Tom.KioskClientLeaveId AS ClientLeaveId, 
                                                                   Tom.ScheduleType, 
                                                                   Tom.ScheduleDestinationKey, 
                                                                   Tom.StartDate, 
                                                                   Tom.EndDate, 
                                                                   Tom.ReturnsToCenter, 
                                                                   Tom.InterimTransMode, 
                                                                   Tom.InterimTransDetails, 
                                                                   Tom.InterimTransDriver, 
                                                                   Tom.InterimTransVehicle, 
                                                                   Tom.InterimTravelTime, 
                                                                   Tom.DestinationType, 
                                                                   Tom.Comments,
                                                                   CASE
                                                                       WHEN((GC.CodeName = 'Approved'
                                                                             AND Rex.AgendaStatus = 'Review'
                                                                            )
                                                                            OR (GC.CodeName = 'Deny'
                                                                                AND Rex.AgendaStatus = 'Review'
                                                                               ))
                                                                       THEN 'Y'
                                                                       ELSE 'N' 
                                                                   END AS SyncTOM, 
                                                                   ' ' AS ' ', 
                                                                   Rex.Id, 
                                                                   Rex.ClientLeaveId, 
                                                                   Rex.ScheduleType, 
                                                                   Rex.ScheduleDestinationKey, 
                                                                   Rex.StartDate, 
                                                                   Rex.EndDate, 
                                                                   Rex.ReturnsToCenter, 
                                                                   Rex.InterimTransMode, 
                                                                   Rex.InterimTransDetails, 
                                                                   Rex.InterimTransDriver, 
                                                                   Rex.InterimTransVehicle, 
                                                                   Rex.InterimTravelTime, 
                                                                   Rex.DestinationType, 
                                                                   Rex.Comments,
                                                                   CASE
                                                                       WHEN((GC.CodeName = 'Deny'
                                                                             AND Rex.AgendaStatus = 'Requested'
                                                                            )
                                                                            OR ISNULL(GC.CodeName, '') = '')
                                                                       THEN 'Y'
                                                                       ELSE 'N'
                                                                   END AS SyncTOMREX
                                                              FROM KioskClientLeaveSchedules AS Tom
                                                              INNER JOIN KioskClientLeaves AS L ON Tom.KioskClientLeaveId = L.KioskId
                                                              INNER JOIN GlobalCodes AS GC ON L.AgendaStatus = GC.GlobalCodeId
                                                              FULL JOIN @rexleaveschedules AS Rex ON Tom.KioskClientLeaveScheduleId = Rex.Id
                                                                                                     AND L.ClientId = Rex.ClientId
                                                             WHERE L.ClientId = @clientid
                                                                   AND Tom.CompanyId = @companyid AND GC.CodeName IN ('Requested', 'Deny')
																   OR Rex.ClientId = @clientid;
                                                        END;
                                                    END;
                                                END;
                                            END;
                                        END;
                                    END;
                                END;
                            END;
                        END;
                    END;
                END;
            END;
        END;
    END;
END;

