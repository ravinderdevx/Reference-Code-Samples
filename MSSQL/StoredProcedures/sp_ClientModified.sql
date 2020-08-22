CREATE PROCEDURE [dbo].[sp_ClientModified] @clientprescriptionid AS int ,
												  @binnumber AS int ,
												  @oldbinnumber AS int ,
												  @prescriptionnumber AS varchar( 50 ) ,
												  @oldprescriptionnumber AS varchar( 50 ) ,
												  @medicationid AS int ,
												  @oldmedicationid AS int ,
												  @physicianid AS int ,
												  @oldphysicianid AS int ,
												  @medicationtype AS int ,
												  @oldmedicationtype AS int ,
												  @dosage AS varchar( 50 ) ,
												  @olddosage AS varchar( 50 ) ,
												  @frequency AS varchar( 50 ) ,
												  @oldfrequency AS varchar( 50 ) ,
												  @initialquantity AS decimal( 6 ,2 ) ,
												  @oldinitialquantity AS decimal( 6 ,2 ) ,
												  @comments AS varchar( max ) ,
												  @oldcomments AS varchar( max ) ,
												  @active AS char( 1 ) ,
												  @oldactive AS char( 1 ) ,
												  @notfordispense AS char( 1 ) ,
												  @oldnotfordispense AS char( 1 ) ,
												  @modifiedby AS varchar( 50 ) ,
												  @userid AS int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	--select * from ClientPrescriptions
	DECLARE @clientmedicationlogid AS int;
	SET @clientmedicationlogid = -1;
	DECLARE @todaysdate AS datetime;
	SET @todaysdate = GETDATE();
	DECLARE @logcomments AS varchar( max );
	DECLARE @logtype AS int;
	SET @logtype = -1;
	DECLARE @quantityonhand AS decimal( 6 ,2 );
	SET @quantityonhand = 0.00;
	SELECT @quantityonhand = dbo.fn_GetMedicationQuantityOnHand( @clientprescriptionid );
	SET @logcomments = '';
	IF @binnumber <> @oldbinnumber
		BEGIN
			SET @logcomments = @logcomments + 'Medication Bin changed from "' + ( SELECT BinNumber
																					FROM MedicationBins
																					WHERE MedicationBinId = @oldbinnumber ) + '" to "' + ( SELECT BinNumber
																																			 FROM MedicationBins
																																			 WHERE MedicationBinId = @binnumber ) + '"<br>'
		END;
	IF @medicationid <> @oldmedicationid
		BEGIN
			SET @logcomments = @logcomments + 'Medication changed from "' + ( SELECT MedicationName
																				FROM Medications
																				WHERE MedicationId = @oldmedicationid ) + '" to "' + ( SELECT MedicationName
																																		 FROM Medications
																																		 WHERE MedicationId = @medicationid ) + '"<br>'
		END;
	IF @dosage <> @olddosage
		BEGIN
			SET @logcomments = @logcomments + 'Dosage changed from "' + @olddosage + '" to "' + @dosage + '"<br>'
		END;
	IF @frequency <> @oldfrequency
		BEGIN
			SET @logcomments = @logcomments + 'Frequency changed from "' + @oldfrequency + '" to "' + @frequency + '"<br>'
		END;
	IF @physicianid <> @oldphysicianid
		BEGIN
			SET @logcomments = @logcomments + 'Physician changed from "' + ( SELECT PhysicianName
																			   FROM Physicians
																			   WHERE PhysicianId = @oldphysicianid ) + '" to "' + ( SELECT PhysicianName
																																	  FROM Physicians
																																	  WHERE PhysicianId = @physicianid ) + '"<br>'
		END;
	IF @medicationtype <> @oldmedicationtype
		BEGIN
			SET @logcomments = @logcomments + 'MedicationType changed from "' + ( SELECT CodeName
																					FROM GlobalCodes
																					WHERE GlobalCodeId = @oldmedicationtype ) + '" to "' + ( SELECT CodeName
																																			   FROM GlobalCodes
																																			   WHERE GlobalCodeId = @medicationtype ) + '"<br>'
		END;
	IF @initialquantity <> @oldinitialquantity
		BEGIN
			SET @logcomments = @logcomments + 'Initial Quantity changed from "' + CAST(@oldinitialquantity AS varchar( 10 )) + '" to "' + CAST(@initialquantity AS varchar( 10 )) + '"<br>'
		END;
	IF @comments <> @oldcomments
		BEGIN
			SET @logcomments = @logcomments + 'Comments changed from "' + @oldcomments + '" to "' + @comments + '"<br>'
		END;
	IF @notfordispense <> @oldnotfordispense
		BEGIN
			SET @logcomments = @logcomments + 'Do Not Issue changed from "' + @oldnotfordispense + '" to "' + @notfordispense + '"<br>'
		END;

	IF LEN( @logcomments ) > 0
		BEGIN
			SET @logcomments = SUBSTRING( @logcomments ,1 ,LEN( @logcomments ) - 4 )
		END;

	IF EXISTS( SELECT ClientMedicationLogId
				 FROM ClientMedicationLog
				 WHERE ClientPrescriptionId = @clientprescriptionid )
		BEGIN
			SELECT @logtype = G.GlobalCodeId
			  FROM GlobalCodes AS G INNER JOIN GlobalCodeCategories AS GC ON G.CategoryId = GC.CategoryID
			  WHERE GC.CategoryName = 'LogType'
				AND G.CodeName = 'Rx Edit';
			EXEC sp_InsertClientMedicationLog @clientmedicationlogid ,@clientprescriptionid ,@todaysdate ,@logtype ,0 ,@quantityonhand ,@userid ,@logcomments ,@modifiedby;
		END;
	ELSE
		BEGIN
			SELECT @logtype = G.GlobalCodeId
			  FROM GlobalCodes AS G INNER JOIN GlobalCodeCategories AS GC ON G.CategoryId = GC.CategoryID
			  WHERE GC.CategoryName = 'LogType'
				AND G.CodeName = 'Rx Add';
			EXEC sp_InsertClientMedicationLog @clientmedicationlogid ,@clientprescriptionid ,@todaysdate ,@logtype ,@initialquantity ,@initialquantity ,@userid ,@logcomments ,@modifiedby;
		END;

END;




GO



