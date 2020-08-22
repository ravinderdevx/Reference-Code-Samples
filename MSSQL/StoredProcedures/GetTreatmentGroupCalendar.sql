USE [PeakSys]
GO

/****** Object:  StoredProcedure [dbo].[sp_GetTreatmentGroupCalendar]    Script Date: 25/09/2017 13:52:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- sp_GetTreatmentGroupCalendar -1,1,'10/12/2008'
-- =============================================
-- Author:		Saddam Husain
-- Create date: 24th-March-16
-- Description:	This procedure will be used to populate Treatment Group Calendar Page
-- =============================================
CREATE PROCEDURE [dbo].[sp_GetTreatmentGroupCalendar] @buildingid AS int ,
												 @dayweek AS int ,
												 -- 0 for Day and 1 for Week
												 @startdate AS datetime ,
												 @signoutallowedbefore AS int
AS
BEGIN
	DECLARE @starttime AS datetime;
	--PRINT CAST(datepart(dw,@StartDate) AS VARCHAR(50))

	-- This statement will set the date to Sunday of the selected Date week in case its not Sunday
	IF @dayweek = 1
   AND DATEPART( dw ,@startdate ) > 1
		BEGIN
			SET @startdate = DATEADD(d ,1 - DATEPART( dw ,@startdate ) ,@startdate)
		END;

	--print @StartDate 

	-- This statement will set the Start time of the calendar and it can be modified to 00 AM
	SET @starttime = CONVERT(varchar( 10 ) ,@startdate ,101) + ' 07:00:00';

	CREATE TABLE #Temp( SessionTime datetime ,
						WeekDay1 varchar( 5000 ));
	INSERT INTO #Temp( SessionTime )
	VALUES( NULL );

	-- This statement will increment the hour and populate the temporary table to be used in the Grid. 
	-- End Time can be modified later by modifying the limit number below
	WHILE(DATEPART( hh ,@starttime ) < 22)
		BEGIN
			INSERT INTO #Temp( SessionTime )
			VALUES( @starttime );
			SET @starttime = DATEADD(mi ,60 ,@starttime);
		END;

	-- This is the case of Single Day Lookup
	IF @dayweek = 0
		BEGIN
			-- This statement will update the header information of the Grid i.e. WeekDay and Date
			UPDATE #Temp
			SET WeekDay1 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate )) + ' ' + CONVERT(varchar( 5 ) ,@startdate ,101)
			  WHERE SessionTime IS NULL;

			-- This statement will update the Slots with the available Schedule in the TreatmentGroupCalendar for the particular Day Selected
			UPDATE #Temp
			SET WeekDay1 = dbo.fn_GetTreatmentGroupDetail( SessionTime ,@buildingid ,@signoutallowedbefore )
			  WHERE SessionTime IS NOT NULL;

		END
	-- This is the case of Complete Week
	;
	ELSE
		BEGIN
			IF @dayweek = 1
				BEGIN
					-- This will add 6 columns for complete week
					ALTER TABLE #Temp
					ADD WeekDay2 varchar( 5000 );
					ALTER TABLE #Temp
					ADD WeekDay3 varchar( 5000 );
					ALTER TABLE #Temp
					ADD WeekDay4 varchar( 5000 );
					ALTER TABLE #Temp
					ADD WeekDay5 varchar( 5000 );
					ALTER TABLE #Temp
					ADD WeekDay6 varchar( 5000 );
					ALTER TABLE #Temp
					ADD WeekDay7 varchar( 5000 );

					-- This statement will update the header information of the Grid i.e. WeekDay and Date
					UPDATE #Temp
					SET WeekDay1 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate )) + '<br>' + CONVERT(varchar( 5 ) ,@startdate ,101) ,
						WeekDay2 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 1 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,1 ,@startdate) ,101) ,
						WeekDay3 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 2 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,2 ,@startdate) ,101) ,
						WeekDay4 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 3 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,3 ,@startdate) ,101) ,
						WeekDay5 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 4 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,4 ,@startdate) ,101) ,
						WeekDay6 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 5 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,5 ,@startdate) ,101) ,
						WeekDay7 = dbo.fn_GetWeekDay( DATEPART( dw ,@startdate ) + 6 ) + '<br>' + CONVERT(varchar( 5 ) ,DATEADD(d ,6 ,@startdate) ,101)
					  WHERE SessionTime IS NULL;

					-- This statement will update the Slots with the available Schedule in the TreatmentGroupCalendar
					UPDATE #Temp
					SET WeekDay1 = dbo.fn_GetTreatmentGroupDetail( SessionTime ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay2 = dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,1 ,SessionTime) ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay3 = ISNULL( WeekDay3 ,'' ) + dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,2 ,SessionTime) ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay4 = ISNULL( WeekDay4 ,'' ) + dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,3 ,SessionTime) ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay5 = ISNULL( WeekDay5 ,'' ) + dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,4 ,SessionTime) ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay6 = ISNULL( WeekDay6 ,'' ) + dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,5 ,SessionTime) ,@buildingid ,@signoutallowedbefore ) ,
						WeekDay7 = ISNULL( WeekDay7 ,'' ) + dbo.fn_GetTreatmentGroupDetail( DATEADD(d ,6 ,SessionTime) ,@buildingid ,@signoutallowedbefore )
					  WHERE SessionTime IS NOT NULL;

				END
		END;
	SELECT *
	  FROM #Temp;
	DROP TABLE #Temp;
END;

--select * From TreatmentGroupCalendar




GO


