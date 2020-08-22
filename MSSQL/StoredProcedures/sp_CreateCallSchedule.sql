CREATE PROCEDURE [dbo].[sp_CreateCallSchedule] @period AS varchar(50)
AS
BEGIN

    DECLARE @callcodeid AS int = -1;
    DECLARE @excludedayexists AS bit = 0;
    DECLARE @sql AS nvarchar(500) = '';
    DECLARE @parmdefinition nvarchar(500) = N'@ParamCallCodeId int, @NewCallCodeIdOut int OUTPUT';
    DECLARE @newcallcodeid AS int = -1;
    DECLARE @roundofvalue AS decimal(5, 2) = 1.25;
    DECLARE @createdby AS varchar(50) = 'CallCodeSecurity-'+@period;
    DECLARE @maxnumberofprocsperday AS decimal(5, 2) = -1;
    DECLARE @numberofcallcodesalreadyscheduled AS int = -1;
    DECLARE @roundoffmaxnumberofcallcodesperday AS int = -1;
    DECLARE @callcodes AS int = -1;
    DECLARE @callcodeschedulingfrequency AS int = -1;
    DECLARE @maximumnumberofsearches AS decimal(5, 2) = -1;
    DECLARE @numberofsearches AS decimal(5, 2) = -1;

    DECLARE @scheduleddate AS datetime;
    DECLARE @scheduledstartdate AS datetime;
    DECLARE @tempfrequency AS int;
    DECLARE @mainfrequency AS int;
    DECLARE @procedurestatus AS int;
    DECLARE @callcodeschedule AS TABLE(CallCodeId int, ScheduledDate datetime);
    
    IF UPPER(@period) IN('WEEKLY', 'EVEN WEEKS', 'ODD WEEKS')
    BEGIN
        SET @scheduledstartdate = DATEADD(d, 7 - DATEPART(dw, GETDATE()), GETDATE());
        SET @mainfrequency = 7;
    END;

    IF UPPER(@period) = 'MONTHLY'
    BEGIN
        PRINT 'FFF';
        SET @scheduledstartdate = CAST(DATEPART(m, DATEADD(m, 1, GETDATE())) AS varchar(2)) + '/01/' + CAST(DATEPART(yyyy, DATEADD(m, 1, GETDATE())) AS varchar(4));
        SET @mainfrequency = DATEDIFF(d, @scheduledstartdate, DATEADD(m, 1, @scheduledstartdate));
        SET @scheduledstartdate = DATEADD(d, -1, @scheduledstartdate);
    END

    DECLARE CallCodeCursor CURSOR
    FOR SELECT C.CallCodeId,
               C.SchedulingFrequency
          FROM CallCodes AS C
          INNER JOIN GlobalCodes AS G ON C.SchedulingPeriod = G.GlobalCodeId
          INNER JOIN GlobalCodeCategories AS GC ON GC.CategoryId = G.CategoryId
         WHERE GC.CategoryName = 'SecuritySchedulingPeriod' AND
               G.CodeName = @period AND
               C.RecordDeleted = 'N';

    BEGIN TRY
        OPEN CallCodeCursor;
        FETCH NEXT FROM CallCodeCursor INTO @callcodeid,
                                            @callcodeschedulingfrequency;
        WHILE(@@fetch_status = 0)
        BEGIN
            IF NOT EXISTS
                         (SELECT S.CallCodeId
                            FROM CallCodeSchedule AS S
                           WHERE S.ScheduleDate > @scheduledstartdate AND
                                 EXISTS
                                       (SELECT C.CallCodeId
                                          FROM CallCodes AS C
                                         WHERE C.CallCodeId = @callcodeid AND
                                               C.CallCodeId = S.CallCodeId
                                       )
                         )
            BEGIN

                SELECT @roundoffmaxnumberofcallcodesperday = CONVERT(int, ROUND(CONVERT(decimal(5, 2), SUM(C.SchedulingFrequency * dbo.fn_GetExcludeDaysCount(CallCodeId))
                                                                                       ) / CONVERT(decimal(5, 2), @mainfrequency
                                                                                                  ) * @roundofvalue + .49, 0)
                                                                    )
                  FROM CallCodes AS C
                  INNER JOIN GlobalCodes AS G ON C.SchedulingPeriod = G.GlobalCodeId
                  INNER JOIN GlobalCodeCategories AS GC ON GC.CategoryId = G.CategoryId
                 WHERE GC.CategoryName = 'SecuritySchedulingPeriod' AND
                       G.CodeName = @period AND
                       C.RecordDeleted = 'N';
                SET @tempfrequency = 0;
                WHILE @tempfrequency < @callcodeschedulingfrequency
                BEGIN

                    SET @scheduleddate = DATEADD(d, dbo.fn_GetRandomNumber(1, @mainfrequency), CONVERT(varchar(10), @scheduledstartdate, 101));

                    SELECT @numberofcallcodesalreadyscheduled = ISNULL(COUNT(CallCodeId), -1)
                      FROM @callcodeschedule
                     WHERE ScheduledDate = @scheduleddate AND
                           CallCodeId = @callcodeid;

                    IF @numberofcallcodesalreadyscheduled < @roundoffmaxnumberofcallcodesperday
                    BEGIN

                        SET @newcallcodeid = -1;

                        SET @sql = 'Select @NewCallCodeIdOut = isnull(CallCodeId,0) from CallCodes where Exclude'+dbo.fn_GetFullWeekDay(DATEPART(weekday, @scheduleddate))+'=''Y'' and CallCodeId= @ParamCallCodeId and RecordDeleted = ''N''';
				    --print @SQL;

                        EXEC sp_ExecuteSQL @sql, @parmdefinition, @paramcallcodeid = @callcodeid, @newcallcodeidout = @newcallcodeid OUTPUT;

                        IF((NOT EXISTS
                                      (SELECT CallCodeId
                                         FROM @callcodeschedule
                                        WHERE CallCodeId = @callcodeid AND
                                              ScheduledDate = @scheduleddate
                                      )
                           ) AND
                           @newcallcodeid = -1
                          )
                        BEGIN
                            INSERT INTO @callcodeschedule
                            VALUES(@callcodeid, @scheduleddate);
                            SET @tempfrequency = @tempfrequency + 1;
                        END;
                    END;
                END;
            END;

            FETCH NEXT FROM CallCodeCursor INTO @callcodeid,
                                                @callcodeschedulingfrequency;
        END;

		--Closing Cursor

        CLOSE CallCodeCursor;
        DEALLOCATE CallCodeCursor;

        INSERT INTO CallCodeSchedule(CallCodeId,
                                     ScheduleDate,
                                     Active,
                                     CreatedBy,
                                     CreatedDate,
                                     ModifiedBy,
                                     ModifiedDate)
        SELECT CallCodeId,
               ScheduledDate,
               'Y',
               @createdby,
               GETDATE(),
               @createdby,
               GETDATE()
          FROM @callcodeschedule
        ORDER BY ScheduledDate;

        EXEC sp_InsertJobLog 'Call Code Schedule', @@rowcount, 'sp_CreateCallCodeSchedule', NULL;

    END TRY
    BEGIN CATCH
        DECLARE @error varchar(8000);
        SET @error = CONVERT(varchar, ERROR_NUMBER()
                            )+'*****'+CONVERT(varchar(4000), ERROR_MESSAGE()
                                             )+'*****'+ISNULL(CONVERT(varchar, ERROR_PROCEDURE()
                                                                     ), 'sp_CreateCallCodeSchedule'
                                                             )+'*****'+CONVERT(varchar, ERROR_LINE()
                                                                              )+'*****ERROR_SEVERITY='+CONVERT(varchar, ERROR_SEVERITY()
             )+'*****ERROR_STATE='+CONVERT(varchar, ERROR_STATE()
                                          );
        EXEC sp_InsertJobLog 'Call Code Schedule', NULL, 'sp_CreateCallCodeSchedule', @error;
        RAISERROR(@error, -- Message text
			 16, -- Severity
			 1 -- State
		  );
    END CATCH;
END;






GO


