/****** Object:  UserDefinedFunction [dbo].[fn_GetWorkflowActionDetailDescription]    Script Date: 06/25/2019 3:24:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ravinder
-- Create date:	10/19/2015
-- Description:	Gets description of what a workflow step action does
-- =============================================
ALTER FUNCTION [dbo].[fn_GetWorkflowActionDetailDescription]
(
	@WorkflowStepActionId int, 
	@WorkflowActionId int
)
RETURNS varchar(max)
AS
BEGIN
    DECLARE @desc varchar(max)
    SET @desc = '';

    DECLARE @action varchar(50);
    
    SELECT @action = ActionDescription
    FROM WorkFlowActions 
    WHERE WorkFlowActionId = @WorkflowActionId;

    SELECT @desc = CASE WFA.ActionDescription
	   WHEN 'Create Fee' THEN P.Program + ': ' + FT.FeeType + '. $' + CAST( WFSA.ColumnMoney1 AS varchar( 9 )) + ' due ' + CASE
																								    WHEN WFSA.ExecutionOffsetDays > 0 THEN CAST( WFSA.ExecutionOffsetDays AS varchar( 5 )) + ' day(s) After '
																								    WHEN WFSA.ExecutionOffsetDays <= 0 THEN CAST((-1 * WFSA.ExecutionOffsetDays)AS varchar( 5 )) + ' day(s) Before '
																								    END + WFEOF.ColumnName
	   WHEN 'Create Task' THEN G.CodeName + ' assigned to ' + ISNULL( CASE G1.CodeName
														  WHEN 'Specific Staff' THEN U.LastName + ', ' + U.FirstName
														  WHEN 'Clients Case Manager' THEN G1.CodeName
														  WHEN 'Clients Secondary Case Manager' THEN G1.CodeName
														  END , '' ) + ' ' + CASE
																		  WHEN WFSA.ExecutionOffsetDays > 0 THEN CAST( WFSA.ExecutionOffsetDays AS varchar( 5 )) + ' day(s) After '
																		  WHEN WFSA.ExecutionOffsetDays <= 0 THEN CAST((-1 * WFSA.ExecutionOffsetDays)AS varchar( 5 )) + ' day(s) Before '
																		  END + WFEOF.ColumnName
	   WHEN 'Send Email' THEN 'Send Email to ' + ISNULL( CASE G.CodeName
												WHEN 'Specific Staff' THEN U.LastName + ', ' + U.FirstName
												WHEN 'Clients Case Manager' THEN G.CodeName
												WHEN 'Clients Secondary Case Manager' THEN G.CodeName
												WHEN 'External Email' THEN WFSA.ColumnText1
												END , '' ) + ' ' + CASE
															 WHEN WFSA.ExecutionOffsetDays > 0 THEN CAST( WFSA.ExecutionOffsetDays AS varchar( 5 )) + ' day(s) After '
															 WHEN WFSA.ExecutionOffsetDays <= 0 THEN CAST((-1 * WFSA.ExecutionOffsetDays)AS varchar( 5 )) + ' day(s) Before '
															 END + WFEOF.ColumnName
	   WHEN 'Create Alert' THEN 'Create Alert ' +CASE
										  WHEN WFSA.ExecutionOffsetDays > 0 THEN CAST( WFSA.ExecutionOffsetDays AS varchar( 5 )) + ' day(s) After '
										  WHEN WFSA.ExecutionOffsetDays <= 0 THEN CAST((-1 * WFSA.ExecutionOffsetDays)AS varchar( 5 )) + ' day(s) Before '
										  END + WFEOF.ColumnName + ' that expires after ' + CAST( ISNULL( WFSA.ColumnInteger1 , '' )AS varchar( 3 )) + ' day(s)'
	   WHEN 'Create Security Procedure' THEN 'Schedule ' + G.CodeName + ' ' + CASE
																WHEN WFSA.ExecutionOffsetDays > 0 THEN CAST( WFSA.ExecutionOffsetDays AS varchar( 5 )) + ' day(s) After '
																WHEN WFSA.ExecutionOffsetDays <= 0 THEN CAST((-1 * WFSA.ExecutionOffsetDays)AS varchar( 5 )) + ' day(s) Before '
																END + WFEOF.ColumnName
	   WHEN 'Complete Task' THEN 'Complete Task: ' + G.CodeName
	   WHEN 'Cancel Task' THEN 'Cancel Task: ' + G.CodeName
    ELSE G.CodeName END
    FROM WorkFlowStepActions AS WFSA 
	   INNER JOIN WorkFlowActions AS WFA ON WFSA.WorkFlowActionId = WFA.WorkFlowActionId
	   LEFT JOIN GlobalCodes AS G ON WFSA.ColumnGlobalCode1 = G.GlobalCodeID
	   LEFT JOIN GlobalCodes AS G1 ON WFSA.ColumnGlobalCode2 = G1.GlobalCodeID
	   LEFT JOIN Users AS U ON WFSA.ColumnInteger1 = U.UserId
	   LEFT JOIN Programs AS P ON WFSA.ColumnInteger1 = P.ProgramId
	   LEFT JOIN FeeTypes AS FT ON WFSA.ColumnInteger2 = FT.FeeTypeId
	   LEFT JOIN WorkflowEventOffsetFields AS WFEOF ON WFSA.WorkFlowEventOffSetFieldId = WFEOF.WorkflowEventOffsetFieldId
    WHERE WFSA.WorkFlowStepActionId = @WorkflowStepActionId;

    RETURN @desc;

END
