CREATE PROCEDURE [dbo].[sp_GetClientLevelsList] @clientsecuritylevelid AS int ,
												   @clientprogramenrollmentid AS int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SELECT C.ClientSecurityLevelId ,
		   C.ClientProgramEnrollmentId ,
		   S.SecurityLevel ,
		   SUBSTRING( CONVERT(varchar( 13 ) ,C.StartDate ,101) ,0 ,12 )AS StartDate ,
		   C.SecurityLevelId ,
		   C.Active ,
		   SUBSTRING( CONVERT(varchar( 13 ) ,C.EndDate ,101) ,0 ,12 )AS EndDate ,
		   P.Program + ' (' + SUBSTRING( CONVERT(varchar( 13 ) ,CPE.StartDate ,101) ,0 ,12 ) + ' - ' + CASE
																										   WHEN CPE.ActualEndDate IS NULL
																										   THEN SUBSTRING( CONVERT(varchar( 13 ) ,GETDATE() ,101) ,0 ,12 ) + ')'
																										   ELSE SUBSTRING( CONVERT(varchar( 13 ) ,CPE.ActualEndDate ,101) ,0 ,12 ) + ')'
																									   END AS Enrollment ,
		   CASE C.RecordDeleted
			   WHEN 'N'
			   THEN 'deleteIcon.gif'
			   ELSE 'True.gif'
		   END AS DeleteImage ,
		   CASE C.RecordDeleted
			   WHEN 'N'
			   THEN 'Delete'
			   ELSE 'Rollback Delete'
		   END AS DeleteImageTitle
	  FROM ClientSecurityLevel AS C INNER JOIN SecurityLevel AS S ON C.SecurityLevelId = S.SecurityLevelId
									INNER JOIN ClientProgramEnrollments AS CPE ON C.ClientPRogramEnrollmentId = CPE.ClientProgramEnrollmentId
									INNER JOIN Programs AS P ON CPE.ProgramId = P.ProgramId
	  WHERE S.RecordDeleted = 'N'
		AND C.RecordDeleted = 'N'
		AND ( CPE.ClientProgramEnrollmentId = @clientprogramenrollmentid
		   OR ISNULL( @clientprogramenrollmentid ,-1 ) < 1 )
		AND ( ClientSecurityLevelId = @clientsecuritylevelid
		   OR ISNULL( @clientsecuritylevelid ,-1 ) < 1 )
	  ORDER BY C.StartDate;
END;
GO