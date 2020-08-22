CREATE PROCEDURE [dbo].[sp_CreateFeeFromWorkFlow] @programid AS int, @feetype AS int, @feeamount AS decimal(9, 2), @dueafter AS int, @comments AS varchar(max), @queuestepactionid AS int, @keyid AS int
AS
BEGIN
    DECLARE @clientid AS int;
    DECLARE @clientprogramenrollmentid AS int;
    DECLARE @companyid AS int;
    DECLARE @primarykey AS varchar(256);
    DECLARE @transactiontypecfid AS int;
    DECLARE @duedate AS datetime;
    DECLARE @transactiondate AS datetime;
    SET @transactiontypecfid = -1;
    SET @transactiondate = GETDATE();
BEGIN TRY
    SELECT @primarykey = dbo.fn_GetPrimaryKey(WorkFlowEvents.PrimaryTable)
      FROM WorkFlowEvents
      INNER JOIN WorkFlows ON WorkFlowEvents.WorkFlowEventId = WorkFlows.WorkFlowEventId
      INNER JOIN WorkFlowSteps ON WorkFlowSteps.WorkFlowId = WorkFlows.WorkFlowId
      INNER JOIN QueueSteps ON QueueSteps.WorkFlowStepId = WorkFlowSteps.WorkFlowStepId
      INNER JOIN QueueStepActions ON QueueSteps.QueueStepId = QueueStepActions.QueueStepId
     WHERE QueueStepActions.QueueStepActionId = @queuestepactionid;
    IF @primarykey = 'ClientProgramEnrollmentId'
    BEGIN
        SELECT @clientid = CPE.ClientId,
               @clientprogramenrollmentid = CPE.ClientProgramEnrollmentId,
               @companyid = P.CompanyId
          FROM ClientProgramEnrollments AS CPE
          INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId
         WHERE CPE.ClientProgramEnrollmentId = @keyid AND
               P.ProgramId = @programid;
    END;
    IF @primarykey = 'MeetingId'
    BEGIN
        SELECT @clientprogramenrollmentid = cm.ClientProgramEnrollmentId,
               @clientid = cm.ClientId,
               @companyid = p.CompanyId
          FROM CalendarMeetings AS cm
          INNER JOIN ClientProgramEnrollments AS cpe ON cm.ClientProgramEnrollmentId = cpe.ClientProgramEnrollmentId
          INNER JOIN Programs AS p ON cpe.ProgramId = p.ProgramId
         WHERE cm.MeetingId = @keyid;
    END;
    IF @primarykey = 'ClientGroupRegistrationId'
    BEGIN
        SELECT @clientprogramenrollmentid = CGR.ClientProgramEnrollmentId,
               @clientid = CPE.ClientId,
               @companyid = P.CompanyId
          FROM ClientGroupRegistrations AS CGR
          INNER JOIN ClientProgramEnrollments AS CPE ON CGR.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId
         WHERE CGR.ClientGroupRegistrationId = @keyid AND
               P.ProgramId = @programid;
    END;
    IF @primarykey = 'ClientProgramPhaseId'
    BEGIN
        SELECT @clientprogramenrollmentid = CPP.ClientProgramEnrollmentId,
               @clientid = CPE.ClientId,
               @companyid = P.CompanyId
          FROM ClientProgramPhases AS CPP
          INNER JOIN ClientProgramEnrollments AS CPE ON CPP.ClientProgramEnrollmentId = CPE.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId
         WHERE CPP.ClientProgramPhaseId = @keyid;
    END;
    IF @primarykey = 'ClientSessionNoteId'
    BEGIN
        SELECT @clientprogramenrollmentid = CGR.ClientProgramEnrollmentId,
               @clientid = CPE.ClientId,
               @companyid = P.CompanyId
          FROM ClientSessionNotes AS CSN
          INNER JOIN ClientGroupRegistrations AS CGR ON CGR.ClientGroupRegistrationId = CSN.ClientGroupRegistrationId
          INNER JOIN ClientProgramEnrollments AS CPE ON CPE.ClientProgramEnrollmentId = CGR.ClientProgramEnrollmentId
          INNER JOIN Programs AS P ON P.ProgramId = CPE.ProgramId
		  INNER JOIN GlobalCodes GC on P.AccountingType = GC.GlobalCodeId AND GC.CodeName = 'Community'
		  INNER JOIN FeeTypes AS FT ON P.ProgramId = FT.ProgramId
         WHERE ClientSessionNoteId = @keyid;
    END;
    SELECT @transactiontypecfid = TransactionTypeCFId
      FROM TransactionTypesCF
     WHERE TransactionTypeCF = 'Fee';
    SET @duedate = DATEADD(d, ISNULL(@dueafter, 0), CONVERT(date, GETDATE()));
    IF @clientid IS NOT NULL AND
       @clientprogramenrollmentid IS NOT NULL
    BEGIN
        PRINT @feetype;
        EXEC sp_CreateClientCommunityFinancialRecordForWorkFlow
             @clientid,
             @clientprogramenrollmentid,
             @feetype,
             @transactiontypecfid,
             @transactiondate,
             @feeamount,
             @duedate,
             @comments,
             'admin';
    END;
END TRY
BEGIN CATCH
    DECLARE @error varchar(8000);
    SET @error = CONVERT(varchar, ERROR_NUMBER()) + '*****' + CONVERT(varchar(4000), ERROR_MESSAGE()) + '*****' + ISNULL(CONVERT(varchar, ERROR_PROCEDURE()), 'sp_CreateSecurityProcedureFromWorkFlow') + '*****' + CONVERT(varchar, ERROR_LINE()) + '*****ERROR_SEVERITY=' + CONVERT(varchar, ERROR_SEVERITY()) + '*****ERROR_STATE=' + CONVERT(varchar, ERROR_STATE());
    RAISERROR(@error, -- Message text.                                         
    16, -- Severity.                                         
    1 -- State.                                         
    );
END CATCH;
END;

GO