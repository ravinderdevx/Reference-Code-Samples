USE [PeakSys]
GO

/****** Object:  StoredProcedure [dbo].[sp_SendDailySummaryEmail]    Script Date: 25/09/2017 13:53:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Saddam Hussain
-- Create date: 21st-April-16
-- Modifi date: 23rd-May-16
-- Description:	This procedure will be used to send a daily summary email to staff 
-- =============================================

CREATE PROCEDURE [dbo].[sp_SendDailySummaryEmail] @companyid AS int
AS
BEGIN

	DECLARE @program varchar( 100 );
	DECLARE @female int;
	DECLARE @male int;
	DECLARE @total int;
	DECLARE @name varchar( 100 );
	DECLARE @movementtype varchar( 25 );
	DECLARE @programentering varchar( 50 );
	DECLARE @programending varchar( 50 );
	DECLARE @movementdate varchar( 50 );
	DECLARE @sendto varchar( max );

	DECLARE @bodytext varchar( max );
	SET @bodytext = '<html><body style="font-family : verdana,Arial, Helvetica, sans-serif;font-size:11px;text-decoration:none;color:#000000;font-weight:normal;"><h2>Currently Active Counts</h2>';
	SET @bodytext = @bodytext + '<table style="text-align:left;"><tr><th>Program</th><th>Female</th><th>Male</th><th>Total</th>';

	DECLARE ProgramCountCursor CURSOR
		FOR SELECT CASE
					   WHEN GROUPING( cpe.Program ) = 0
					   THEN cpe.Program
					   ELSE 'TOTAL'
				   END ,
				   SUM( CASE
							WHEN c.Sex = 'Female'
							THEN 1
							ELSE 0
						END )AS "Female" ,
				   SUM( CASE
							WHEN c.Sex = 'Female'
							THEN 0
							ELSE 1
						END )AS "Male" ,
				   COUNT( cpe.ClientProgramEnrollmentId )AS "Total Count"
			  FROM vClientProgramEnrollments AS cpe INNER JOIN vClients AS c ON cpe.ClientId = c.ClientId
			  WHERE cpe.companyid = @companyid
				AND GETDATE()BETWEEN cpe.startdate
				AND ISNULL( cpe.actualenddate ,GETDATE())
			  GROUP BY cpe.program WITH ROLLUP;

	OPEN ProgramCountCursor;
	FETCH Next FROM ProgramCountCursor INTO @program ,@female ,@male ,@total;
	WHILE(@@fetch_status = 0)
		BEGIN

			SET @bodytext = @bodytext + '<tr>';
			SET @bodytext = @bodytext + '<td>' + @program + '</td>';
			SET @bodytext = @bodytext + '<td>' + CONVERT(varchar ,@female) + '</td>';
			SET @bodytext = @bodytext + '<td>' + CONVERT(varchar ,@male) + '</td>';
			SET @bodytext = @bodytext + '<td>' + CONVERT(varchar ,@total) + '</td>';
			SET @bodytext = @bodytext + '</tr>';

			FETCH Next FROM ProgramCountCursor INTO @program ,@female ,@male ,@total;
		END;

	SET @bodytext = @bodytext + '</table>';

	CLOSE ProgramCountCursor;
	DEALLOCATE ProgramCountCursor;

	SET @bodytext = @bodytext + '<h2>Movements In Prior 24 Hours</h2>';
	SET @bodytext = @bodytext + '<table style="text-align:left;"><tr><th>Name</th><th>Movement Type</th><th>Program Entering</th><th>Program Ending</th><th>Date/Time</th>';

	DECLARE RecentMovementCursor CURSOR
		FOR SELECT c.LastName + ', ' + c.FirstName ,
				   cm.MovementType ,
				   ISNULL( cm.Program_Entering ,'' ) ,
				   ISNULL( cpe.Program ,'' )AS "Program_Ending" ,
				   dbo.fn_FormatDateMMDDYYYYHHMMAMPM( cm.ActualMovementDate )
			  FROM vClientMovements AS cm LEFT JOIN vClientProgramEnrollments AS cpe ON cm.ClientProgramEnrollmentId_Ending = cpe.ClientProgramEnrollmentId
										  LEFT JOIN Programs AS p ON cm.Program_EnteringId = p.ProgramId
										  INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
			  WHERE ISNULL( p.CompanyId ,cpe.CompanyId ) = @companyid
				AND ActualMovementDate >= DATEADD("d" ,-1 ,GETDATE())
			  ORDER BY 2 ,1;

	OPEN RecentMovementCursor;
	FETCH Next FROM RecentMovementCursor INTO @name ,@movementtype ,@programentering ,@programending ,@movementdate;
	WHILE(@@fetch_status = 0)
		BEGIN

			SET @bodytext = @bodytext + '<tr>';
			SET @bodytext = @bodytext + '<td>' + @name + '</td>';
			SET @bodytext = @bodytext + '<td>' + @movementtype + '</td>';
			SET @bodytext = @bodytext + '<td>' + @programentering + '</td>';
			SET @bodytext = @bodytext + '<td>' + @programending + '</td>';
			SET @bodytext = @bodytext + '<td>' + @movementdate + '</td>';

			FETCH Next FROM RecentMovementCursor INTO @name ,@movementtype ,@programentering ,@programending ,@movementdate;
		END;

	SET @bodytext = @bodytext + '</table>';

	CLOSE RecentMovementCursor;
	DEALLOCATE RecentMovementCursor;

	SET @bodytext = @bodytext + '<h2>Upcoming Movements In Next 24 Hours</h2>';
	SET @bodytext = @bodytext + '<table style="text-align:left;"><tr><th>Name</th><th>Movement Type</th><th>Program Entering</th><th>Program Ending</th><th>Date/Time</th>';

	DECLARE UpcomingMovementCursor CURSOR
		FOR SELECT c.LastName + ', ' + c.FirstName ,
				   cm.MovementType ,
				   ISNULL( cm.Program_Entering ,'' ) ,
				   ISNULL( cpe.Program ,'' )AS "Program_Ending" ,
				   dbo.fn_FormatDateMMDDYYYYHHMMAMPM( cm.EstimatedMovementDate )
			  FROM vClientMovements AS cm LEFT JOIN vClientProgramEnrollments AS cpe ON cm.ClientProgramEnrollmentId_Ending = cpe.ClientProgramEnrollmentId
										  LEFT JOIN Programs AS p ON cm.Program_EnteringId = p.ProgramId
										  INNER JOIN Clients AS c ON cm.ClientId = c.ClientId
			  WHERE ISNULL( p.CompanyId ,cpe.CompanyId ) = @companyid
				AND EstimatedMovementDate BETWEEN GETDATE()
				AND DATEADD("d" ,1 ,GETDATE())
				AND ActualMovementDate IS NULL
			  ORDER BY 2 ,1;

	OPEN UpcomingMovementCursor;
	FETCH Next FROM UpcomingMovementCursor INTO @name ,@movementtype ,@programentering ,@programending ,@movementdate;
	WHILE(@@fetch_status = 0)
		BEGIN

			SET @bodytext = @bodytext + '<tr>';
			SET @bodytext = @bodytext + '<td>' + @name + '</td>';
			SET @bodytext = @bodytext + '<td>' + @movementtype + '</td>';
			SET @bodytext = @bodytext + '<td>' + @programentering + '</td>';
			SET @bodytext = @bodytext + '<td>' + @programending + '</td>';
			SET @bodytext = @bodytext + '<td>' + @movementdate + '</td>';

			FETCH Next FROM UpcomingMovementCursor INTO @name ,@movementtype ,@programentering ,@programending ,@movementdate;
		END;

	SET @bodytext = @bodytext + '</table></html></body>';

	CLOSE UpcomingMovementCursor;
	DEALLOCATE UpcomingMovementCursor;

	SELECT @sendto = dbo.fn_GetEmailRecipients( @companyid ,'Daily Counts Summary' );
	EXEC msdb.dbo.sp_send_dbmail @profile_name = 'TotalOffenderManagement' ,@recipients = @sendto ,@subject = 'Total Offender Management Summary' ,@body = @bodytext ,@body_format = 'HTML';

END;
GO


