Imports Entities
Public Class POSDataLayer

    Dim RG As New Utilities.clsUtil
    Dim tmpSQL As String
    Dim ds As DataSet
    Dim DebtorDataLayer As New DebtorsDataLayer

    Public Function GetSelfActivateDetails(ByVal IDNumber As String) As Debtor

        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")


        'Dim dlChk As New CashCardDataLayer

        Dim ReturnDebtor As New Debtor


        If RG.ValidID(IDNumber) = False Then
            ReturnDebtor.ReturnMessage = "Invalid ID Number"
            ReturnDebtor.SelfActivate = False
            Return ReturnDebtor
        End If

        ReturnDebtor.SelfActivate = True

        Dim ds As DataSet
        Dim dsB As DataSet

        '2014-08-05
        'Now that the high bad debt stores require a "deposit" on first purchase, they will be allowed to self activate
        'tmpSQL = "SELECT branch_code FROM no_self_activate WHERE branch_code = '" & BranchCode & "'"

        'ds = objDBRead.GetDataSet(tmpSQL)

        'If objDBRead.isR(ds) Then
        '    ReturnDebtor.SelfActivate = False
        'End If
        Dim LostCardCharge As Integer

        tmpSQL = "SELECT lost_card_protection_charge FROM general_settings"
        Try
            dsB = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(dsB) Then
                LostCardCharge = Val(dsB.Tables(0).Rows(0)("lost_card_protection_charge") & "")
            End If
        Catch ex As Exception
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If

            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ex.Message

            Return ReturnDebtor
        End Try


        tmpSQL = "SELECT dp.account_number,dp.first_name,dp.last_name,dp.status,dp.cell_number,dp.itc_rating," &
                 "dp.card_protection,cd.card_number,fcl.credit_limit " &
                 "FROM debtor_personal dp " &
                 "LEFT OUTER JOIN card_details cd ON dp.account_number = cd.account_number " &
                 "LEFT OUTER JOIN financial_credit_limits fcl ON dp.account_number = fcl.account_number " &
                 "WHERE id_number = '" & IDNumber & "'"
        Try
            ds = objDBRead.GetDataSet(tmpSQL)

            If objDBRead.isR(ds) Then
                If ds.Tables(0).Rows(0)("card_number") & "" <> "" Then
                    'Existing Card. Check if the customer has LCP
                    If ds.Tables(0).Rows(0)("card_protection") & "" = False Then
                        ReturnDebtor.PayNewCard = LostCardCharge
                        ReturnDebtor.ReturnMessage = "This customer does not have Lost Card Protection and R" &
                            LostCardCharge & " will be charged to their account to receive a new card. Please ask the customer if they want to proceed!"
                    End If
                    'ReturnDebtor.SelfActivate = False
                End If

                If ds.Tables(0).Rows(0)("status") & "" <> "ACTIVE" Then
                    ReturnDebtor.SelfActivate = False
                End If




                ReturnDebtor.AccountNumber = ds.Tables(0).Rows(0)("account_number") & ""
                ReturnDebtor.FirstName = ds.Tables(0).Rows(0)("first_name") & ""
                ReturnDebtor.LastName = ds.Tables(0).Rows(0)("last_name") & ""
                ReturnDebtor.ContactNumber = ds.Tables(0).Rows(0)("cell_number")
                ReturnDebtor.CreditLimit = ds.Tables(0).Rows(0)("credit_limit") & ""
                ReturnDebtor.CurrentStatus = ds.Tables(0).Rows(0)("status") & ""

                If Val(ds.Tables(0).Rows(0)("credit_limit") & "") > 1500 Then
                    'MsgBox("This account cannot be self activated." & vbCrLf & "Please call the Call Centre to activate.", MsgBoxStyle.Exclamation)
                    'DoButtons(Me, True)
                    'ds.Clear()
                    'Exit Sub
                    If (objDBRead IsNot Nothing) Then
                        objDBRead.CloseConnection()
                    End If
                    ReturnDebtor.SelfActivate = False
                End If

                objDBRead.CloseConnection()
                ds.Clear()
                Return ReturnDebtor

            Else
                If (objDBRead IsNot Nothing) Then
                    objDBRead.CloseConnection()
                End If

                ReturnDebtor.ReturnMessage = "ID Number does not exist on the system"

                ReturnDebtor.SelfActivate = False
                Return ReturnDebtor
            End If
        Catch ex As Exception
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If

            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ex.Message

            Return ReturnDebtor
        End Try

        If (objDBRead IsNot Nothing) Then
            objDBRead.CloseConnection()
        End If

    End Function

    Public Function InsertSelfActivated(ByVal DebtorDetails As Debtor) As Debtor
        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Dim objDBWrite As New dlNpgSQL("PostgreConnectionStringPCMWrite")

        Dim ReturnDebtor As New Debtor
        ReturnDebtor.SelfActivate = True

        Dim ds As DataSet

        tmpSQL = "SELECT card_number,current_status,account_number FROM card_details WHERE card_number = '" & DebtorDetails.CardNumber & "'"
        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                If ds.Tables(0).Rows(0)("current_status") = "STOLEN" Or ds.Tables(0).Rows(0)("current_status") = "LOST" _
                    Or ds.Tables(0).Rows(0)("current_status") = "BLACKLISTED" Then
                    ReturnDebtor.SelfActivate = False
                    ReturnDebtor.ReturnMessage = ("The card that you used has been Blocked by Head Office." & vbCrLf & "Please use another card.")
                    objDBRead.CloseConnection()
                    ds.Clear()
                    Return ReturnDebtor
                End If

                'Card is already in use
                If ds.Tables(0).Rows(0)("account_number") & "" <> "" Then
                    ReturnDebtor.SelfActivate = False
                    'I'm guessing we give this message as if we do say that it is use, the staff will try to buy on it.
                    ReturnDebtor.ReturnMessage = ("The card that you used has been Blocked by Head Office." & vbCrLf & "Please use another card.")
                    objDBRead.CloseConnection()
                    ds.Clear()
                    Return ReturnDebtor
                End If


            Else
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Invalid Card Number.")
                objDBRead.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End If
        Catch ex As Exception
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try


        tmpSQL = "SELECT cell_number,account_number FROM debtor_personal WHERE cell_number = '" & DebtorDetails.ContactNumber & "'"
        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                If ds.Tables(0).Rows(0)("account_number") <> DebtorDetails.AccountNumber Then
                    ReturnDebtor.SelfActivate = False
                    ReturnDebtor.ReturnMessage = ("This Cellphone number already exists in the Database for another account. Please call the Call Centre to assign a Card to this Account.")
                    objDBRead.CloseConnection()
                    ds.Clear()
                    Return ReturnDebtor
                End If
            End If
        Catch ex As Exception
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try

        'Delete all previous cards for this customer
        tmpSQL = "UPDATE card_details SET account_number = NULL, current_status = 'LOST'," &
                 "delivered_by = '" & DebtorDetails.EmployeeNumber & "',assigned_by = '" & DebtorDetails.EmployeeNumber & "'," &
                 "assigned_at_branch = '" & DebtorDetails.BranchCode & "' WHERE account_number = '" & DebtorDetails.AccountNumber & "'"
        Try
            objDBWrite.ExecuteQuery(tmpSQL)
        Catch ex As Exception
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            objDBWrite.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try


        Dim current_period As Integer = 0
        Dim transaction_number As String = ""
        If Val(DebtorDetails.PayNewCard) <> 0 Then
            'Getting a new card
            'Need to charge the customer as they didn't have LCP
            Try
                tmpSQL = "SELECT current_period FROM general_settings"

                ds = objDBRead.GetDataSet(tmpSQL)
                If objDBRead.isR(ds) Then
                    current_period = Val(ds.Tables(0).Rows(0)("current_period"))
                End If
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

            Try
                tmpSQL = "SELECT nextval('enum_journal_debit_seq')"

                ds = objDBWrite.GetDataSet(tmpSQL)
                If objDBWrite.isR(ds) Then
                    transaction_number = ds.Tables(0).Rows(0)("nextval")
                End If
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

            'Post the transaction
            Try
                tmpSQL = "INSERT INTO financial_transactions (sale_date,sale_time,current_period,username,account_number,reference_number," &
                         "transaction_type,transaction_amount,pay_type,branch_code) VALUES " &
                         "('" & Format(Now, "yyyy-MM-dd") & "','" & Format(Now, "HH:mm:ss") & "'," &
                         "'" & current_period & "','WS','" & DebtorDetails.AccountNumber & "'," &
                         "'HO-" & transaction_number & "','LEDD'," &
                         "'" & Val(DebtorDetails.PayNewCard) & "','0000','" & DebtorDetails.BranchCode & "')"

                objDBWrite.ExecuteQuery(tmpSQL)
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

            'Update balances
            Try
                tmpSQL = "UPDATE financial_balances SET total = total + '" & Val(DebtorDetails.PayNewCard) & "'," &
                         "current_balance = '" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "' " &
                         "WHERE account_number = '" & DebtorDetails.AccountNumber & "'"

                objDBWrite.ExecuteQuery(tmpSQL)
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

            'Insert payment plan
            'To charge the full amount in one go might stop people from paying
            Try
                tmpSQL = "INSERT INTO financial_payment_plans (sale_date,sale_time,account_number,reference_number,total_amount,current_period," &
                         "period_1,amount_1,period_2,amount_2,period_3,amount_3,period_4,amount_4,period_5,amount_5,period_6,amount_6) " &
                         "VALUES ('" & Format(Now, "yyyy-MM-dd") & "','" & Format(Now, "HH:mm:ss") & "','" & DebtorDetails.AccountNumber & "'," &
                         "'HO-" & transaction_number & "','" & Val(DebtorDetails.PayNewCard) & "'," &
                         "'" & current_period & "'," &
                         "'" & current_period & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "'," &
                         "'" & current_period + 1 & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "'," &
                         "'" & current_period + 2 & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "'," &
                         "'" & current_period + 3 & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "'," &
                         "'" & current_period + 4 & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "'," &
                         "'" & current_period + 5 & "','" & RG.Numb(Val(DebtorDetails.PayNewCard) / 6) & "')"

                objDBWrite.ExecuteQuery(tmpSQL)
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

            'Insert into credit limits
            Try
                tmpSQL = "UPDATE financial_credit_limits SET balance = balance + " & Val(DebtorDetails.PayNewCard) &
                         "WHERE account_number = '" & DebtorDetails.AccountNumber & "'"

                objDBWrite.ExecuteQuery(tmpSQL)
            Catch ex As Exception
                ReturnDebtor.SelfActivate = False
                ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
                objDBRead.CloseConnection()
                objDBWrite.CloseConnection()
                ds.Clear()
                Return ReturnDebtor
            End Try

        End If

        Dim autoincrease As Boolean = False
        Dim lostcard As Boolean = False

        If DebtorDetails.Autoincrease = True Then
            autoincrease = True
        End If

        If DebtorDetails.LostCard = True Then
            lostcard = True
        End If

        'Check if the customer is already assigned to a branch
        Try
            tmpSQL = "SELECT branch_code FROM debtor_personal WHERE account_number = '" & DebtorDetails.AccountNumber & "'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                If ds.Tables(0).Rows(0)("branch_code") & "" = "" Then
                    'Assign the branch code to the customer
                    tmpSQL = "UPDATE debtor_personal SET branch_code = '" & DebtorDetails.BranchCode & "',auto_increase = '" & autoincrease & "',card_protection = '" & lostcard & "', " &
                         "preferred_language = '" & DebtorDetails.PreferredLanguage & "' WHERE account_number = '" & DebtorDetails.AccountNumber & "'"
                Else
                    tmpSQL = "UPDATE debtor_personal SET auto_increase = '" & autoincrease & "',card_protection = '" & lostcard & "', " &
                         "preferred_language = '" & DebtorDetails.PreferredLanguage & "' WHERE account_number = '" & DebtorDetails.AccountNumber & "'"
                End If
            End If

            objDBWrite.ExecuteQuery(tmpSQL)
        Catch ex As Exception
            objDBRead.CloseConnection()
            objDBWrite.CloseConnection()
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try

        Try
            tmpSQL = "UPDATE card_details SET account_number = '" & DebtorDetails.AccountNumber & "',current_status = 'ACTIVE'," &
                     "delivered_by = '" & DebtorDetails.EmployeeNumber & "',assigned_by = '" & DebtorDetails.EmployeeNumber & "'," &
                     "self_activated = True, assigned_at_branch = '" & DebtorDetails.BranchCode & "' " &
                     "WHERE card_number = '" & DebtorDetails.CardNumber & "'"

            objDBWrite.ExecuteQuery(tmpSQL)
        Catch ex As Exception
            objDBRead.CloseConnection()
            objDBWrite.CloseConnection()
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try

        Try
            tmpSQL = "UPDATE card_dates SET date_assigned = '" & Format(Now, "yyyy-MM-dd") & "' WHERE card_number = '" & DebtorDetails.CardNumber & "'"

            objDBWrite.ExecuteQuery(tmpSQL)
        Catch ex As Exception
            objDBRead.CloseConnection()
            objDBWrite.CloseConnection()
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card not assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try

        Try
            tmpSQL = "INSERT INTO debtor_change_log (change_date,change_time,username,account_number,description,old_value,new_value) " &
                     "VALUES ('" & Format(Now, "yyyy-MM-dd") & "','" & Format(Now, "HH:mm:ss") & "','WEB','" & DebtorDetails.AccountNumber & "'," &
                     "'Card Number: " & DebtorDetails.CardNumber & " assigned by " & DebtorDetails.EmployeeNumber & " at " & DebtorDetails.BranchCode & "'," &
                     "'','')"

            objDBWrite.ExecuteQuery(tmpSQL)
        Catch ex As Exception
            objDBRead.CloseConnection()
            objDBWrite.CloseConnection()
            ReturnDebtor.SelfActivate = False
            ReturnDebtor.ReturnMessage = ("Internal Server Error. Card was still assigned." & vbCrLf & "Error: " & ex.Message)
            objDBRead.CloseConnection()
            ds.Clear()
            Return ReturnDebtor
        End Try


        objDBRead.CloseConnection()
        objDBWrite.CloseConnection()

        Return ReturnDebtor

    End Function

    Public Function GetBranchList(Optional ByVal BranchCode As String = "") As DataSet

        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If BranchCode <> "" Then
            tmpSQL = "SELECT * FROM branch_details WHERE branch_code = '" & BranchCode & "' ORDER BY branch_name"
        Else
            tmpSQL = "Select * FROM branch_details ORDER BY branch_name"
        End If


        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                Return ds
            Else
                Return Nothing
            End If
        Catch ex As Exception
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If
            Return Nothing
        Finally
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If
        End Try
    End Function
End Class
