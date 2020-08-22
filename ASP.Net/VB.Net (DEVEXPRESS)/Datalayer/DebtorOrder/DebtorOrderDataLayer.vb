Imports Entities
Public Class DebtorOrderDataLayer

    Dim RG As New Utilities.clsUtil
    Dim tmpSQL As String
    Dim ds As DataSet

    Public Function GetDebitOrders() As DataTable
        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        tmpSQL = "SELECT debtor_banking.bank_name,debtor_banking.branch_name,debtor_banking.branch_number," &
             "debtor_banking.bank_account_number,debtor_personal.account_number,debtor_personal.title,debtor_personal.initials,debtor_personal.last_name," &
             "financial_balances.current_balance,financial_balances.p30,financial_balances.p90,financial_balances.p60," &
             "financial_balances.p120,financial_balances.p150, " &
             "replace(cast(COALESCE(financial_balances.current_balance, 0) + COALESCE(financial_balances.p30, 0) + COALESCE(financial_balances.p90, 0) + COALESCE(financial_balances.p120, 0) + COALESCE(financial_balances.p150, 0) as money)::text,'$', '') AS owning " &
             "From debtor_banking " &
             "Inner Join debtor_personal ON debtor_banking.account_number = debtor_personal.account_number " &
             "Inner Join financial_balances ON debtor_banking.account_number = financial_balances.account_number AND " &
             "(financial_balances.current_balance + financial_balances.p30 + financial_balances.p60 " &
             "+ financial_balances.p90 + + financial_balances.p120 + financial_balances.p150) > 0 " &
             "Where debtor_banking.payment_type = 'DEBIT ORDER' ORDER BY debtor_personal.account_number ASC"

        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                Return ds.Tables(0)
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

    Public Function getDebtorsSumDetails() As DebtorsSumResponse
        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Dim _DebtorsSumResponse As New DebtorsSumResponse
        Try
            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblTA = ds.Tables(0).Rows(0)("count")
            End If


            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE card_protection = True AND status = 'ACTIVE'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblLCP = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblLCPP = Format(Val(_DebtorsSumResponse.lblLCP) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If


            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'ACTIVE'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblAD = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblAp = Format(Val(_DebtorsSumResponse.lblAD) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'PENDING'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblPend = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblPendP = Format(Val(_DebtorsSumResponse.lblPendP) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'FRAUD'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblFraud = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblFraudP = Format(Val(_DebtorsSumResponse.lblFraud) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If


            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'SUSPENDED'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblSusp = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblSuspP = Format(Val(_DebtorsSumResponse.lblSusp) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'WRITE-OFF'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblWO = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblWOP = Format(Val(_DebtorsSumResponse.lblWO) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'BLOCKED'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblBlock = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblBlockP = Format(Val(_DebtorsSumResponse.lblBlock) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'DECLINED'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblDD = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblDDP = Format(Val(_DebtorsSumResponse.lblDD) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If


            tmpSQL = "SELECT COUNT(account_number) FROM debtor_personal WHERE status = 'LEGAL'"
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                _DebtorsSumResponse.lblLeg = ds.Tables(0).Rows(0)("count")
                If Val(_DebtorsSumResponse.lblTA) <> 0 Then
                    _DebtorsSumResponse.lblLegP = Format(Val(_DebtorsSumResponse.lblLeg) / Val(_DebtorsSumResponse.lblTA) * 100, "0")
                End If
            End If

        Catch ex As Exception
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If
            _DebtorsSumResponse.Success = False
            _DebtorsSumResponse.Message = "Somthing went wrong. Pleast try again."
        Finally
            If (objDBRead IsNot Nothing) Then
                objDBRead.CloseConnection()
            End If
        End Try
        _DebtorsSumResponse.Success = True
        _DebtorsSumResponse.Message = Nothing
        Return _DebtorsSumResponse
    End Function


    Public Function CheckAccountNumber(AccountNumber As String) As DataTable
        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        tmpSQL = "SELECT title,initials,last_name FROM debtor_personal " &
                 "WHERE debtor_personal.account_number = '" & RG.Apos(AccountNumber) & "'"

        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                Return ds.Tables(0)
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
