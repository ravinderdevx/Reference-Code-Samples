Imports Entities
Imports Newtonsoft.Json
Imports Npgsql
Imports Npgsql.Logging
Imports pcm.DataLayer.dlLoggingNpgSQL
Public Class AgeAnalysisDataLayer
    Inherits DataAccessLayerBase

    Dim RG As New Utilities.clsUtil
    Dim tmpSQL As String
    Dim ds As DataSet
    Dim DebtorDataLayer As New DebtorsDataLayer
    Dim getDetailsResponse As New GetDetailsResponse
    Dim queryResponse As New QueryResponse
    Dim reportResponse As New ReportResponse
    Dim getPeriodResponse As New GetPeriodResponse
    Dim getAgeAnalysisDetailResponse As New GetAgeAnalysisDetailResponse
    Dim giftCardDetailsResponse As New GiftCardDetailsResponse

    Public Function GetDetails(_getDetailsRequest As GetDetailsRequest) As GetDetailsResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If _getDetailsRequest.CheckAll = False Then
            'If Val(_getDetailsRequest.FromAccount) <= 0 Then
            '    getDetailsResponse.Success = False
            '    getDetailsResponse.Message = "Please enter a proper account range."
            '    Return getDetailsResponse
            'End If

            'If Val(_getDetailsRequest.ToAccount) <= 0 Then
            '    getDetailsResponse.Success = False
            '    getDetailsResponse.Message = "Please enter a proper account range."
            '    Return getDetailsResponse
            'End If

            'If Val(_getDetailsRequest.FromAccount) > Val(_getDetailsRequest.ToAccount) Then
            '    getDetailsResponse.Success = False
            '    getDetailsResponse.Message = "Please select a proper account range."
            '    Return getDetailsResponse
            'End If
        End If

        If _getDetailsRequest.ActiveOnly = False And _getDetailsRequest.OtherStatus = False Then
            getDetailsResponse.Success = False
            getDetailsResponse.Message = "Please select a Status option."
            Return getDetailsResponse
        End If

        If _getDetailsRequest.OtherStatus = True And _getDetailsRequest.Other = "" Then
            getDetailsResponse.Message = "Please select an option for Other Status"
            getDetailsResponse.Success = False
            Return getDetailsResponse
        End If

        If _getDetailsRequest.CheckCurrentUse = True Then
            If _getDetailsRequest.CboCurrent = "" Or Val(_getDetailsRequest.WhereCurrent) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUse30 = True Then
            If _getDetailsRequest.Cbo30Days = "" Or Val(_getDetailsRequest.Where30Days) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUse60 = True Then
            If _getDetailsRequest.Cbo60Days = "" Or Val(_getDetailsRequest.Where60Days) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUse90 = True Then
            If _getDetailsRequest.Cbo90Days = "" Or Val(_getDetailsRequest.Where90Days) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUse120 = True Then
            If _getDetailsRequest.Cbo120Days = "" Or Val(_getDetailsRequest.Where120Days) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUse150 = True Then
            If _getDetailsRequest.Cbo150Days = "" Or Val(_getDetailsRequest.Where150Days) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.CheckUsetotal = True Then
            If _getDetailsRequest.CboTotal = "" Or Val(_getDetailsRequest.Wheretotal) <= 0 Then
                getDetailsResponse.Message = "Please select corresponding option and fill value"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If


        If _getDetailsRequest.AccountsOpenedBetween = True Then
            tmpSQL = tmpSQL & " AND date_of_creation BETWEEN '" & _getDetailsRequest.StartDate & "' AND '" & _getDetailsRequest.EndDate & "'"
            If _getDetailsRequest.StartDate = "" Or _getDetailsRequest.EndDate = "" Then
                getDetailsResponse.Message = "Please select start date and end date"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If

        If _getDetailsRequest.LastTransaction = True Then
            tmpSQL = tmpSQL & " AND date_of_last_transaction >= '" & _getDetailsRequest.LastDateTransaction & "'"
            If _getDetailsRequest.LastDateTransaction = "" Then
                getDetailsResponse.Message = "Please select last transaction date"
                getDetailsResponse.Success = False
                Return getDetailsResponse
            End If
        End If


        tmpSQL = "Select " &
             "COUNT(Case When f.current_balance <> 0 And p30 = 0 And p60 = 0 And p90 = 0 And p120 = 0 And p150 = 0 Then p.account_number End) As number_of_current," &
             "COUNT(Case When p30 <> 0 And p60 = 0 And p90 = 0 And p120 = 0 And p150 = 0 Then p.account_number End) As number_of_30," &
             "COUNT(Case When p60 <> 0 And p90 = 0 And p120 = 0 And p150 = 0 Then p.account_number End) As number_of_60," &
             "COUNT(Case When p90 <> 0 And p120 = 0 And p150 = 0 Then p.account_number End) As number_of_90," &
             "COUNT(Case When p120 <> 0 And p150 = 0 Then p.account_number End) As number_of_120," &
             "COUNT(Case When p150 <> 0 Then p.account_number End) As number_of_150," &
             "COUNT(p.account_number) As number_of_accounts," &
             "replace(replace(cast(ceil(SUM(f.total)) as money)::text,'$', ''), '.00', '') As total,replace(replace(cast(ceil(SUM(f.current_balance)) as money)::text,'$', ''), '.00', '') As balance,replace(replace(cast(ceil(SUM(f.p30)) as money)::text,'$', ''), '.00', '') As p30," &
             "replace(replace(cast(ceil(SUM(f.p60)) as money)::text,'$', ''), '.00', '') As p60,replace(replace(cast(ceil(SUM(f.p90)) as money)::text,'$', ''), '.00', '') As p90,replace(replace(cast(ceil(SUM(f.p120)) as money)::text,'$', ''), '.00', '') As p120,replace(replace(cast(ceil(SUM(f.p150)) as money)::text,'$', ''), '.00', '') As p150 " &
             "FROM financial_balances f " &
             "INNER JOIN debtor_personal p On f.account_number = p.account_number "

        Dim AddedJoin As Boolean
        AddedJoin = False

        If _getDetailsRequest.AccountsOpenedBetween = True Then
            tmpSQL = tmpSQL & "INNER JOIN debtor_dates dd On dd.account_number = p.account_number "
            AddedJoin = True
        End If

        If AddedJoin = False Then
            If _getDetailsRequest.LastTransaction = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_dates dd On dd.account_number = p.account_number "
            End If
        End If

        tmpSQL = tmpSQL & "WHERE p.account_number <> ''"

        If _getDetailsRequest.ActiveOnly = True Then 'Active Customers Only
            tmpSQL = tmpSQL & " AND p.status = 'ACTIVE'"
        Else 'Option of a Status
            If _getDetailsRequest.Other <> "ALL" Then 'This will be a huge report
                tmpSQL = tmpSQL & " AND p.status = '" & _getDetailsRequest.Other & "'"
            End If
        End If

        'If _getDetailsRequest.CheckAll = False Then
        '    tmpSQL = tmpSQL & " AND p.account_number >= '" & _getDetailsRequest.FromAccount & "' AND p.account_number <= '" & _getDetailsRequest.ToAccount & "'"
        'End If

        If _getDetailsRequest.TickOn = True Then
            If _getDetailsRequest.TickOff = False Then
                tmpSQL = tmpSQL & " AND p.show_on_age_analysis = 'True'"
            End If
        Else
            If _getDetailsRequest.TickOff = True Then
                tmpSQL = tmpSQL & " AND p.show_on_age_analysis = 'False'"
            End If
        End If

        If _getDetailsRequest.CheckCurrentUse = True Then

            tmpSQL = tmpSQL & " AND current_balance " & _getDetailsRequest.CboCurrent & " " & _getDetailsRequest.WhereCurrent
        End If

        If _getDetailsRequest.CheckUse30 = True Then
            tmpSQL = tmpSQL & " AND p30 " & _getDetailsRequest.Cbo30Days & " " & _getDetailsRequest.Where30Days
        End If

        If _getDetailsRequest.CheckUse60 = True Then
            tmpSQL = tmpSQL & " AND p60 " & _getDetailsRequest.Cbo60Days & " " & _getDetailsRequest.Where60Days
        End If

        If _getDetailsRequest.CheckUse90 = True Then
            tmpSQL = tmpSQL & " AND p90 " & _getDetailsRequest.Cbo90Days & " " & _getDetailsRequest.Where90Days
        End If

        If _getDetailsRequest.CheckUse120 = True Then
            tmpSQL = tmpSQL & " AND p120 " & _getDetailsRequest.Cbo120Days & " " & _getDetailsRequest.Where120Days
        End If

        If _getDetailsRequest.CheckUse150 = True Then
            tmpSQL = tmpSQL & " AND p150 " & _getDetailsRequest.Cbo150Days & " " & _getDetailsRequest.Where150Days
        End If

        If _getDetailsRequest.CheckUsetotal = True Then
            tmpSQL = tmpSQL & " AND total " & _getDetailsRequest.CboTotal & " " & _getDetailsRequest.Wheretotal
        End If

        If _getDetailsRequest.AccountsOpenedBetween = True Then
            tmpSQL = tmpSQL & " AND date_of_creation BETWEEN '" & _getDetailsRequest.StartDate & "' AND '" & _getDetailsRequest.EndDate & "'"
        End If

        If _getDetailsRequest.LastTransaction = True Then
            tmpSQL = tmpSQL & " AND date_of_last_transaction >= '" & _getDetailsRequest.LastDateTransaction & "'"
        End If

        Try
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                getDetailsResponse.GetSelectedResponse = ds.Tables(0)
            Else
                Return Nothing
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            Return Nothing
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        getDetailsResponse.Success = True
        Return getDetailsResponse
    End Function

    Public Function GetQuery(_queryRequest As QueryRequest) As QueryResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If Not RG.ValidDate(_queryRequest.AccountStartDate) Then
            queryResponse.Message = "Invalid Account Start Date."
            queryResponse.Success = False
            Return queryResponse
        End If

        If Not RG.ValidDate(_queryRequest.AccountEndDate) Then
            queryResponse.Message = "Invalid Account End Date."
            queryResponse.Success = False
            Return queryResponse
        End If

        If Not RG.ValidDate(_queryRequest.SalesStartDate) Then
            queryResponse.Message = "Invalid Sales Start Date."
            queryResponse.Success = False
            Return queryResponse
        End If

        If Not RG.ValidDate(_queryRequest.SalesEndDate) Then
            queryResponse.Message = "Invalid Sales End Date."
            queryResponse.Success = False
            Return queryResponse
        End If

        If Not RG.ValidDate(_queryRequest.PaymentStartDate) Then
            queryResponse.Message = "Invalid Payment Start Date."
            queryResponse.Success = False
            Return queryResponse
        End If
        If Not RG.ValidDate(_queryRequest.PaymentEndDate) Then
            queryResponse.Message = "Invalid Payment End Date."
            queryResponse.Success = False
            Return queryResponse
        End If

        If _queryRequest.NeverPaid = False Then
            If _queryRequest.Amount = "" Then
                queryResponse.Message = "Please fill in an amount of payment."
                queryResponse.Success = False
                Return queryResponse
            End If

            If _queryRequest.MoreLessThan = "" Then
                queryResponse.Message = "Please select >= or <= from the dropdown."
                queryResponse.Success = False
                Return queryResponse
            End If
        End If

        If _queryRequest.File = "" Then
            queryResponse.Message = "Please select a valid file."
            queryResponse.Success = False
            Return queryResponse
        End If


        If _queryRequest.NeverPaid = True Then
            tmpSQL = "SELECT * FROM (" &
                 "SELECT p.account_number,MAX(p.cell_number) AS cell_number," &
                 "MAX(p.credit_limit) AS credit_limit,MAX(p.itc_rating) AS rating," &
                 "SUM(CASE WHEN t.transaction_type = 'SALE' THEN t.transaction_amount end) AS sales," &
                 "SUM(CASE WHEN t.transaction_type = 'PAY' THEN t.transaction_amount end) as payments " &
                 "FROM debtor_personal p " &
                 "LEFT OUTER JOIN financial_transactions t ON p.account_number = t.account_number " &
                 "LEFT OUTER JOIN debtor_dates d ON p.account_number = d.account_number " &
                 "WHERE ((t.transaction_type = 'SALE' AND t.sale_date " &
                 "BETWEEN '" & RG.ConvertDate(_queryRequest.SalesStartDate) & "' AND '" & RG.ConvertDate(_queryRequest.SalesEndDate) & "') " &
                 "OR (t.transaction_type = 'PAY' AND t.sale_date " &
                 "BETWEEN '" & RG.ConvertDate(_queryRequest.PaymentStartDate) & "' AND '" & RG.ConvertDate(_queryRequest.PaymentEndDate) & "')) " &
                 "AND d.date_of_creation BETWEEN '" & RG.ConvertDate(_queryRequest.AccountStartDate) & "' AND " &
                 "'" & RG.ConvertDate(_queryRequest.AccountEndDate) & "' " &
                 "GROUP BY p.account_number) foo where foo.payments is null ORDER BY foo.account_number ASC;"

        Else
            tmpSQL = "SELECT * FROM (" &
                 "SELECT p.account_number,MAX(p.cell_number)  AS cell_number," &
                 "MAX(p.credit_limit) AS credit_limit,MAX(p.itc_rating) AS rating," &
                 "SUM(CASE WHEN t.transaction_type = 'SALE' THEN t.transaction_amount end) AS sales," &
                 "SUM(CASE WHEN t.transaction_type = 'PAY' THEN t.transaction_amount end) as payments " &
                 "FROM debtor_personal p " &
                 "LEFT OUTER JOIN financial_transactions t ON p.account_number = t.account_number " &
                 "LEFT OUTER JOIN debtor_dates d ON p.account_number = d.account_number " &
                 "WHERE ((t.transaction_type = 'SALE' AND t.sale_date " &
                 "BETWEEN '" & _queryRequest.SalesStartDate & "' AND '" & _queryRequest.SalesEndDate & "') " &
                 "OR (t.transaction_type = 'PAY' AND t.sale_date " &
                 "BETWEEN '" & _queryRequest.PaymentStartDate & "' AND '" & _queryRequest.PaymentEndDate & "')) " &
                 "AND d.date_of_creation BETWEEN '" & _queryRequest.AccountStartDate & "' AND " &
                 "'" & _queryRequest.AccountEndDate & "' " &
                 "GROUP BY p.account_number) foo WHERE " &
                 "foo.payments " & _queryRequest.MoreLessThan & " " & _queryRequest.Amount & " ORDER BY foo.account_number ASC;"
        End If
        Try
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                queryResponse.GetQueryDetails = ds.Tables(0)
                queryResponse.Message = "Record  found."
                queryResponse.Success = True
            Else
                queryResponse.Message = "Record not found."
                queryResponse.Success = False
            End If

        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            queryResponse.Message = "Report Completed"
            queryResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return queryResponse
    End Function

    Public Function GetReport(_reportRequest As ReportRequest) As ReportResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Dim tmpMonthInt As String
        Dim NextMonth As String
        Dim NextYear As String
        Dim csv As String = String.Empty
        If _reportRequest.FileName = "" Then
            reportResponse.Message = "Please select a valid file."
            reportResponse.Success = False
            Return reportResponse
        End If

        If _reportRequest.CboMonth = "" Then
            reportResponse.Message = "Please select a Month."
            reportResponse.Success = False
            Return reportResponse
        End If


        If _reportRequest.CboYear = "" Then
            reportResponse.Message = "Please select a Year."
            reportResponse.Success = False
            Return reportResponse
        End If


        If _reportRequest.CboStatus = "" Then
            reportResponse.Message = "Please select a Status."
            reportResponse.Success = False
            Return reportResponse
        End If

        Select Case _reportRequest.CboMonth

            Case "January"
                tmpMonthInt = "01"
                NextMonth = "02"
                NextYear = _reportRequest.CboYear
            Case "February"
                tmpMonthInt = "02"
                NextMonth = "03"
                NextYear = _reportRequest.CboYear
            Case "March"
                tmpMonthInt = "03"
                NextMonth = "04"
                NextYear = _reportRequest.CboYear
            Case "April"
                tmpMonthInt = "04"
                NextMonth = "05"
                NextYear = _reportRequest.CboYear
            Case "May"
                tmpMonthInt = "05"
                NextMonth = "06"
                NextYear = _reportRequest.CboYear
            Case "June"
                tmpMonthInt = "06"
                NextMonth = "07"
                NextYear = _reportRequest.CboYear
            Case "July"
                tmpMonthInt = "07"
                NextMonth = "08"
                NextYear = _reportRequest.CboYear
            Case "August"
                tmpMonthInt = "08"
                NextMonth = "09"
                NextYear = _reportRequest.CboYear
            Case "September"
                tmpMonthInt = "09"
                NextMonth = "10"
                NextYear = _reportRequest.CboYear
            Case "October"
                tmpMonthInt = "10"
                NextMonth = "11"
                NextYear = _reportRequest.CboYear
            Case "November"
                tmpMonthInt = "11"
                NextMonth = "12"
                NextYear = _reportRequest.CboYear
            Case "December"
                tmpMonthInt = "12"
                NextMonth = "01"
                NextYear = Val(_reportRequest.CboYear) + 1
        End Select

        Try
            'Take care of the blanks which would cause a numeric error
            tmpSQL = "UPDATE debtor_personal SET itc_rating = DEFAULT where itc_rating = ''"
            objDB.ExecuteQuery(tmpSQL)

            'Get the internal period for the month
            Dim internal_period As Integer

            tmpSQL = "SELECT internal_period FROM internal_period_to_date WHERE real_month = '" & _reportRequest.CboMonth & "' " &
                     "AND real_year = '" & _reportRequest.CboYear & "'"
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    internal_period = Val(dr("internal_period") & "")
                Next
            End If

            Dim number_of_accounts As String
            Dim credit_limit_average As String
            Dim average_rating As String
            Dim zero_count As String

            ''lblStatus = "Getting Header"


            'Get the heading counts
            tmpSQL = "SELECT COUNT(dp.account_number) AS number_of_accounts," &
                     "AVG(financial_credit_limits.credit_limit) AS credit_limit_average," &
                     "AVG(CASE WHEN cast(itc_rating as integer) > 100 THEN cast(itc_rating as integer) END) AS average_rating, "

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & "COUNT(CASE WHEN cast(itc_rating as integer) > 5 THEN itc_rating END) AS zero_count "
            Else
                If _reportRequest.Score = "" Then
                    tmpSQL = tmpSQL & "COUNT(CASE WHEN cast(itc_rating as integer) < 100 THEN itc_rating END) AS zero_count "
                Else
                    tmpSQL = tmpSQL & "COUNT(CASE WHEN itc_rating = '" & _reportRequest.Score & "' THEN itc_rating END) AS zero_count "
                End If
            End If

            tmpSQL = tmpSQL & "FROM debtor_personal dp " &
         "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
         "INNER JOIN financial_balances ON dp.account_number = financial_balances.account_number " &
         "INNER JOIN financial_credit_limits ON dp.account_number = financial_credit_limits.account_number "


            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON dp.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11' " &
                              "AND total_spent > 0 "

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                  "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If
            '''mychanges
            If _reportRequest.CheckZeroes = True Then
                tmpSQL = tmpSQL & " AND itc_rating = '0'"
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows

                    number_of_accounts = RG.Num(dr("number_of_accounts").ToString)
                    credit_limit_average = RG.Num(dr("credit_limit_average").ToString)
                    average_rating = RG.Num(dr("average_rating").ToString)
                    zero_count = RG.Num(dr("zero_count").ToString)
                Next
            End If

            '''csv skipped '''''
            '          Set Fso = New Scripting.FileSystemObject
            'Set Strm = Fso.OpenTextFile(txtFile, ForWriting, True)

            csv &= "Vintage Report"
            csv &= vbCr & vbLf

            csv &= "Date Of Report:," & Format(Now, "yyyy-MM-dd")
            csv &= vbCr & vbLf

            csv &= "For Period:," & _reportRequest.CboMonth & " " & _reportRequest.CboYear
            csv &= vbCr & vbLf

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            csv &= "Accounts Opened:," & number_of_accounts
            csv &= vbCr & vbLf

            csv &= "Average Score (> 100):," & average_rating
            csv &= vbCr & vbLf

            If _reportRequest.CheckThickFilesOnly = True Then
                csv &= "# of Accounts Score > 5 :," & zero_count
            Else
                If _reportRequest.Score = "" Then
                    csv &= "# of Accounts < 100:," & zero_count
                Else
                    csv &= "# of Accounts Score: " & _reportRequest.Score & "," & zero_count
                End If
            End If
            csv &= vbCr & vbLf

            csv &= "Average Credit Limit:," & credit_limit_average
            csv &= vbCr & vbLf

            If _reportRequest.Score <> "" Then
                csv &= "Score:," & _reportRequest.Score
                csv &= vbCr & vbLf
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            'CURRENT
            '==========================================================================================================================================
            '' lblStatus = "CURRENT"

            tmpSQL = "SELECT " &
                     "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_balances.account_number END) AS p60_overdue," &
                     "COUNT(CASE WHEN p90 > 15 AND p120 + p150 < 15 THEN financial_balances.account_number END) AS p90_overdue," &
                     "COUNT(CASE WHEN p120 > 15 AND p150 < 15 THEN financial_balances.account_number END) AS p120_overdue," &
                     "COUNT(CASE WHEN p150 > 15 THEN financial_balances.account_number END) AS p150_overdue," &
                     "SUM(total) AS total_balance," &
                     "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                     "SUM(CASE WHEN p90 > 15 AND p120 + p150 < 15 THEN total END) AS p90_overdue_balance, " &
                     "SUM(CASE WHEN p120 > 15 AND p150 < 15 THEN total END) AS p120_overdue_balance, " &
                     "SUM(CASE WHEN p150 > 15 THEN total END) AS p150_overdue_balance " &
                     "FROM financial_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE financial_balances.account_number IN " &
                     "(SELECT dp.account_number " &
                     "FROM debtor_personal dp "

            tmpSQL = tmpSQL & "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                     "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                  "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            'If chkZeroes.value = 1 Then
            '    tmpSQL = tmpSQL & " AND itc_rating = '0'"
            'End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows

                    csv &= "#A/cs 60+ dpd  @ CURRENT:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ CURRENT:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 120+ dpd  @ CURRENT:," & RG.Num(dr("p120_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 150+ dpd  @ CURRENT:," & RG.Num(dr("p150_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ CURRENT:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ CURRENT:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ CURRENT:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 120+dpd @ CURRENT:," & RG.Num(dr("p120_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 150+dpd @ CURRENT:," & RG.Num(dr("p150_overdue_balance").ToString & "") & vbCr & vbLf
                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            If _reportRequest.CheckIncludeAllPeriods = True Then
                '==========================================================================================================================================
                '2 MOB
                '==========================================================================================================================================
                ''lblStatus = "2 MOB"

                tmpSQL = "SELECT " &
                         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                         "SUM(total) AS total_balance," &
                         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                         "FROM financial_closing_balances "

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
                End If

                tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 2 & "' " &
                                  "AND financial_closing_balances.account_number IN " &
                                  "(SELECT dp.account_number " &
                                  "FROM debtor_personal dp " &
                                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

                If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                    tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
                Else
                    If _reportRequest.CboStatus <> "ALL" Then
                        tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                    End If
                End If

                If _reportRequest.CheckThickFilesOnly = True Then
                    tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
                Else

                    If _reportRequest.Score <> "" Then
                        tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                    End If
                End If

                If _reportRequest.CheckMaleOnly = True Then
                    tmpSQL = tmpSQL & " AND gender = 'MALE'"
                End If


                tmpSQL = tmpSQL & ")"

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
                End If

                ds = objDB.GetDataSet(tmpSQL)
                If objDB.isR(ds) Then
                    For Each dr As DataRow In ds.Tables(0).Rows


                        csv &= "#A/cs 60+ dpd  @ 2MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                        csv &= "#A/cs 90+ dpd  @ 2MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                        csv &= "Total balance @ 2MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 60+dpd @ 2MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 90+dpd @ 2MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                    Next
                End If

                csv &= vbCr & vbLf
                csv &= vbCr & vbLf

                '==========================================================================================================================================
            End If


            '==========================================================================================================================================
            '3 MOB
            '==========================================================================================================================================
            ''lblStatus = "3 MOB"

            tmpSQL = "SELECT " &
                     "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                     "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                     "SUM(total) AS total_balance," &
                     "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                     "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                     "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 3 & "' " &
                              "AND financial_closing_balances.account_number IN " &
                              "(SELECT dp.account_number " &
                              "FROM debtor_personal dp " &
                              "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                              "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                  "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows

                    csv &= "#A/cs 60+ dpd  @ 3MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 3MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 3MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 3MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 3MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf
                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            If _reportRequest.CheckIncludeAllPeriods = True Then
                '==========================================================================================================================================
                '4 MOB
                '==========================================================================================================================================
                ''lblStatus = "4 MOB"

                tmpSQL = "SELECT " &
                         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                         "SUM(total) AS total_balance," &
                         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                         "FROM financial_closing_balances "

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
                End If

                tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 4 & "' " &
                                  "AND financial_closing_balances.account_number IN " &
                                  "(SELECT dp.account_number " &
                                  "FROM debtor_personal dp " &
                                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

                If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                    tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
                Else
                    If _reportRequest.CboStatus <> "ALL" Then
                        tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                    End If
                End If

                If _reportRequest.CheckThickFilesOnly = True Then
                    tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
                Else
                    If _reportRequest.Score <> "" Then
                        tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                    End If
                End If

                If _reportRequest.CheckMaleOnly = True Then
                    tmpSQL = tmpSQL & " AND gender = 'MALE'"
                End If


                tmpSQL = tmpSQL & ")"

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
                End If

                ds = objDB.GetDataSet(tmpSQL)
                If objDB.isR(ds) Then
                    For Each dr As DataRow In ds.Tables(0).Rows
                        csv &= "#A/cs 60+ dpd  @ 4MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                        csv &= "#A/cs 90+ dpd  @ 4MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                        csv &= "Total balance @ 4MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 60+dpd @ 4MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 90+dpd @ 4MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                    Next
                End If

                csv &= vbCr & vbLf
                csv &= vbCr & vbLf

                '==========================================================================================================================================

                '==========================================================================================================================================
                '5 MOB
                '==========================================================================================================================================
                'lblStatus = "5 MOB"

                tmpSQL = "SELECT " &
                         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                         "SUM(total) AS total_balance," &
                         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                         "FROM financial_closing_balances "

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
                End If

                tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 5 & "' " &
                                  "AND financial_closing_balances.account_number IN " &
                                  "(SELECT dp.account_number " &
                                  "FROM debtor_personal dp " &
                                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

                If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                    tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
                Else
                    If _reportRequest.CboStatus <> "ALL" Then
                        tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                    End If
                End If

                If _reportRequest.CheckThickFilesOnly = True Then
                    tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
                Else
                    If _reportRequest.Score = "" Then
                        tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                    End If
                End If

                If _reportRequest.CheckMaleOnly = True Then
                    tmpSQL = tmpSQL & " AND gender = 'MALE'"
                End If


                tmpSQL = tmpSQL & ")"

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
                End If

                ds = objDB.GetDataSet(tmpSQL)
                If objDB.isR(ds) Then
                    For Each dr As DataRow In ds.Tables(0).Rows
                        csv &= "#A/cs 60+ dpd  @ 5MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                        csv &= "#A/cs 90+ dpd  @ 5MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                        csv &= "Total balance @ 5MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 60+dpd @ 5MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 90+dpd @ 5MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                    Next
                End If

                csv &= vbCr & vbLf
                csv &= vbCr & vbLf


                '==========================================================================================================================================

            End If


            '==========================================================================================================================================
            '6 MOB
            '==========================================================================================================================================
            ''lblStatus = "6 MOB"

            tmpSQL = "SELECT " &
             "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
             "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
             "SUM(total) AS total_balance," &
             "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
             "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
             "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 6 & "' " &
                      "AND financial_closing_balances.account_number IN " &
                      "(SELECT dp.account_number " &
                      "FROM debtor_personal dp " &
                      "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                      "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                          "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 6MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 6MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 6MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 6MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 6MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf
                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            '==========================================================================================================================================

            If _reportRequest.CheckIncludeAllPeriods = True Then

                '==========================================================================================================================================
                '7 MOB
                '==========================================================================================================================================
                ''lblStatus = "7 MOB"

                tmpSQL = "SELECT " &
                 "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                 "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                 "SUM(total) AS total_balance," &
                 "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                 "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                 "FROM financial_closing_balances "

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
                End If

                tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 7 & "' " &
                          "AND financial_closing_balances.account_number IN " &
                          "(SELECT dp.account_number " &
                          "FROM debtor_personal dp " &
                          "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                          "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

                If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                    tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                              "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
                Else
                    If _reportRequest.CboStatus <> "ALL" Then
                        tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                    End If
                End If

                If _reportRequest.CheckThickFilesOnly = True Then
                    tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
                Else
                    If _reportRequest.Score <> "" Then
                        tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                    End If
                End If

                If _reportRequest.CheckMaleOnly = True Then
                    tmpSQL = tmpSQL & " AND gender = 'MALE'"
                End If


                tmpSQL = tmpSQL & ")"

                If _reportRequest.CheckBadDebtStoresonly = True Then
                    tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
                End If
                ds = objDB.GetDataSet(tmpSQL)
                If objDB.isR(ds) Then
                    For Each dr As DataRow In ds.Tables(0).Rows
                        csv &= "#A/cs 60+ dpd  @ 7MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                        csv &= "#A/cs 90+ dpd  @ 7MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                        csv &= "Total balance @ 7MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 60+dpd @ 7MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                        csv &= "Total balance 90+dpd @ 7MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf
                    Next
                End If

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            '==========================================================================================================================================

            '==========================================================================================================================================
            '8 MOB
            '==========================================================================================================================================
            'lblStatus = "8 MOB"

            tmpSQL = "SELECT " &
                 "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
                 "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
                 "SUM(total) AS total_balance," &
                 "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
                 "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
                 "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 8 & "' " &
                      "AND financial_closing_balances.account_number IN " &
                      "(SELECT dp.account_number " &
                      "FROM debtor_personal dp " &
                      "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                      "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                          "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 8MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 8MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 8MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 8MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 8MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            '==========================================================================================================================================

            '==========================================================================================================================================
            '9 MOB
            '==========================================================================================================================================
            ''lblStatus = "9 MOB"

            tmpSQL = "SELECT " &
             "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
             "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
             "SUM(total) AS total_balance," &
             "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
             "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
             "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 9 & "' " &
                      "AND financial_closing_balances.account_number IN " &
                      "(SELECT dp.account_number " &
                      "FROM debtor_personal dp " &
                      "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                      "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                          "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 9MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 9MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 9MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 9MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 9MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            '==========================================================================================================================================

            '==========================================================================================================================================
            '10 MOB
            '==========================================================================================================================================
            '' lblStatus = "10 MOB"


            tmpSQL = "SELECT " &
             "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
             "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
             "SUM(total) AS total_balance," &
             "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
             "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
             "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 10 & "' " &
                      "AND financial_closing_balances.account_number IN " &
                      "(SELECT dp.account_number " &
                      "FROM debtor_personal dp " &
                      "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                      "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                          "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 10MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 10MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 10MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 10MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 10MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            '==========================================================================================================================================

            '==========================================================================================================================================
            '11 MOB
            '==========================================================================================================================================
            ''lblStatus = "11 MOB"


            tmpSQL = "SELECT " &
             "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
             "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
             "SUM(total) AS total_balance," &
             "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 < 15 THEN total END) AS p60_overdue_balance, " &
             "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
             "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 11 & "' " &
                      "AND financial_closing_balances.account_number IN " &
                      "(SELECT dp.account_number " &
                      "FROM debtor_personal dp " &
                      "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                      "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                          "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 11MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 11MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 11MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 11MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 11MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            ''==========================================================================================================================================
            '    End If

            '    '==========================================================================================================================================
            '    '12 MOB
            '    '==========================================================================================================================================
            '    lblStatus = "12 MOB"


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN total END) AS p60_overdue_balance, " &
         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 12 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp " &
                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 12MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 12MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 12MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 12MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 12MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p150 > 30 THEN financial_closing_balances.account_number END) AS number_of_overdue_accounts," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p150 > 30 THEN total END) AS overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 12 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp "

            tmpSQL = tmpSQL & "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
         "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If
            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If
            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 30+ dpd  @ 12MOB:," & RG.Num(dr("number_of_overdue_accounts").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 12MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 150+dpd @ 12MOB:," & RG.Num(dr("overdue_balance").ToString & "") & vbCr & vbLf
                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            ''==========================================================================================================================================

            '        '==========================================================================================================================================

            '        '==========================================================================================================================================
            '        '18 MOB
            '        '==========================================================================================================================================
            '        lblStatus = "18 MOB"


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN total END) AS p60_overdue_balance, " &
         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 18 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp " &
                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 18MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 18MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 18MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 18MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 18MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p150 > 30 THEN financial_closing_balances.account_number END) AS number_of_overdue_accounts," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p150 > 30 THEN total END) AS overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 18 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp "

            tmpSQL = tmpSQL & "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
         "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If
            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If
            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 30+ dpd  @ 18MOB:," & RG.Num(dr("number_of_overdue_accounts").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 18MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 150+dpd @ 18MOB:," & RG.Num(dr("overdue_balance").ToString & "") & vbCr & vbLf
                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            ''==========================================================================================================================================

            '        '==========================================================================================================================================
            '        '24 MOB
            '        '==========================================================================================================================================
            '        lblStatus = "24 MOB"


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN total END) AS p60_overdue_balance, " &
         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 24 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp " &
                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 24MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 24MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 24MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 24MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 24MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf

                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p150 > 30 THEN financial_closing_balances.account_number END) AS number_of_overdue_accounts," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p150 > 30 THEN total END) AS overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 24 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp "

            tmpSQL = tmpSQL & "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
         "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If
            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If
            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 30+ dpd  @ 24MOB:," & RG.Num(dr("number_of_overdue_accounts").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 24MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 150+dpd @ 24MOB:," & RG.Num(dr("overdue_balance").ToString & "") & vbCr & vbLf

                Next
            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

            '==========================================================================================================================================


            '==========================================================================================================================================
            '36 MOB
            '==========================================================================================================================================
            ''lblStatus = "36 MOB"


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN financial_closing_balances.account_number END) AS p60_overdue," &
         "COUNT(CASE WHEN p90 > 15 THEN financial_closing_balances.account_number END) AS p90_overdue," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p60 > 15 AND p90 + p120 + p150 <15 THEN total END) AS p60_overdue_balance, " &
         "SUM(CASE WHEN p90 > 15 THEN total END) AS p90_overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 36 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp " &
                  "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
                  "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If

            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If

            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If


            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 60+ dpd  @ 36MOB:," & RG.Num(dr("p60_overdue").ToString & "") & vbCr & vbLf
                    csv &= "#A/cs 90+ dpd  @ 36MOB:," & RG.Num(dr("p90_overdue").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 36MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 60+dpd @ 36MOB:," & RG.Num(dr("p60_overdue_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 90+dpd @ 36MOB:," & RG.Num(dr("p90_overdue_balance").ToString & "") & vbCr & vbLf
                Next

            End If

            csv &= vbCr & vbLf
            csv &= vbCr & vbLf


            tmpSQL = "SELECT " &
         "COUNT(CASE WHEN p150 > 30 THEN financial_closing_balances.account_number END) AS number_of_overdue_accounts," &
         "SUM(total) AS total_balance," &
         "SUM(CASE WHEN p150 > 30 THEN total END) AS overdue_balance " &
         "FROM financial_closing_balances "

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & "INNER JOIN debtor_first_purchase dfp ON financial_closing_balances.account_number = dfp.account_number "
            End If

            tmpSQL = tmpSQL & "WHERE current_period = '" & Val(internal_period) + 36 & "' " &
                  "AND financial_closing_balances.account_number IN " &
                  "(SELECT dp.account_number " &
                  "FROM debtor_personal dp "

            tmpSQL = tmpSQL & "INNER JOIN debtor_dates ON dp.account_number = debtor_dates.account_number " &
         "WHERE date_of_creation BETWEEN '" & _reportRequest.CboYear & "-" & tmpMonthInt & "-12' AND '" & NextYear & "-" & NextMonth & "-11'"

            If _reportRequest.CboStatus = "A,L,D,DR,C,F,WO,B" Then
                tmpSQL = tmpSQL & " AND (status = 'ACTIVE' OR status = 'LEGAL' OR status = 'DECEASED' OR status = 'DEBT REVIEW' " &
                      "OR status = 'CLOSED' OR status = 'FRAUD' OR status = 'WRITE-OFF' OR status = 'BLOCKED')"
            Else
                If _reportRequest.CboStatus <> "ALL" Then
                    tmpSQL = tmpSQL & " AND status = '" & _reportRequest.CboStatus & "'"
                End If
            End If
            If _reportRequest.CheckThickFilesOnly = True Then
                tmpSQL = tmpSQL & " AND cast(itc_rating as integer) > 5 "
            Else
                If _reportRequest.Score <> "" Then
                    tmpSQL = tmpSQL & " AND itc_rating = '" & _reportRequest.Score & "'"
                End If
            End If
            If _reportRequest.CheckMaleOnly = True Then
                tmpSQL = tmpSQL & " AND gender = 'MALE'"
            End If

            tmpSQL = tmpSQL & ")"

            If _reportRequest.CheckBadDebtStoresonly = True Then
                tmpSQL = tmpSQL & " AND first_purchase IN (SELECT branch_code FROM no_self_activate)"
            End If

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                For Each dr As DataRow In ds.Tables(0).Rows
                    csv &= "#A/cs 30+ dpd  @ 36MOB:," & RG.Num(dr("number_of_overdue_accounts").ToString & "") & vbCr & vbLf
                    csv &= "Total balance @ 36MOB:," & RG.Num(dr("total_balance").ToString & "") & vbCr & vbLf
                    csv &= "Total balance 150+dpd @ 36MOB:," & RG.Num(dr("overdue_balance").ToString & "") & vbCr & vbLf
                Next

            End If
            csv &= vbCr & vbLf
            csv &= vbCr & vbLf

        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            queryResponse.Message = "Report Completed"
            queryResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        reportResponse.CSV = csv
        reportResponse.Success = True
        Return reportResponse
    End Function

    Public Function GetReport() As GetPeriodResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Try
            tmpSQL = "SELECT current_period FROM general_settings"
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                Dim CurrentPeriod As Integer
                CurrentPeriod = ds.Tables(0).Rows(ds.Tables(0).Rows.Count - 1)("current_period")
                getPeriodResponse.Success = True
                getPeriodResponse.Period = CurrentPeriod
            Else
                getPeriodResponse.Success = False
                getPeriodResponse.Message = "No Period set in Database."
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            queryResponse.Message = ""
            queryResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return getPeriodResponse
    End Function

    Public Function GetAgeAnalysisDetails(_getAgeAnalysisDetailRequest As GetAgeAnalysisDetailRequest) As GetAgeAnalysisDetailResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")


        If Val(_getAgeAnalysisDetailRequest.FromAccount) > Val(_getAgeAnalysisDetailRequest.ToAccount) Then
            getAgeAnalysisDetailResponse.Message = "Please select a proper account range."
            getAgeAnalysisDetailResponse.Success = False
            Return getAgeAnalysisDetailResponse
        End If

        If _getAgeAnalysisDetailRequest.ActiveAccount = False And _getAgeAnalysisDetailRequest.CheckOtherStatus = False Then
            getAgeAnalysisDetailResponse.Message = "Please select a Status option."
            getAgeAnalysisDetailResponse.Success = False
            Return getAgeAnalysisDetailResponse
        End If

        If _getAgeAnalysisDetailRequest.CheckOtherStatus = True And _getAgeAnalysisDetailRequest.OtherStatus = "" Then
            getAgeAnalysisDetailResponse.Message = "Please select an option for ""Other Status"" "
            getAgeAnalysisDetailResponse.Success = False
            Return getAgeAnalysisDetailResponse
        End If

        If _getAgeAnalysisDetailRequest.DoubleLine = "" Then
            getAgeAnalysisDetailResponse.Message = "Please select a valid file."
            getAgeAnalysisDetailResponse.Success = False
            Return getAgeAnalysisDetailResponse
        End If

        If _getAgeAnalysisDetailRequest.Period = "" Then
            _getAgeAnalysisDetailRequest.Period = "CURRENT"
        End If


        Dim strTmpSQL As String

        If _getAgeAnalysisDetailRequest.Period = "CURRENT" Then
            tmpSQL = "SELECT count(debtor_personal.account_number) " &
                     "FROM " &
                     "debtor_personal " &
                     "LEFT OUTER JOIN financial_balances " &
                     "ON debtor_personal.account_number = financial_balances.account_number " &
                     "WHERE debtor_personal.account_number <> ''"
            strTmpSQL = "SELECT debtor_personal.account_number,debtor_personal.first_name,debtor_personal.last_name,debtor_personal.cell_number,financial_balances.total," &
                        "financial_balances.current_balance,financial_balances.p30,financial_balances.p60,financial_balances.p90,financial_balances.p120," &
                        "financial_balances.p150,debtor_dates.date_of_last_payment,debtor_dates.date_of_last_transaction " &
                        "FROM " &
                        "debtor_personal " &
                        "LEFT OUTER JOIN financial_balances ON debtor_personal.account_number = financial_balances.account_number " &
                        "LEFT OUTER JOIN debtor_dates ON debtor_personal.account_number = debtor_dates.account_number " &
                        "WHERE debtor_personal.account_number <> ''" 'This is some nonsense to avoid the problem with where to use the AND
        Else
            tmpSQL = "SELECT count(debtor_personal.account_number) " &
                     "FROM " &
                     "debtor_personal " &
                     "LEFT OUTER JOIN financial_closing_balances " &
                     "ON debtor_personal.account_number = financial_closing_balances.account_number " &
                     "WHERE debtor_personal.account_number <> '' AND " &
                     "financial_closing_balances.current_period = '" & _getAgeAnalysisDetailRequest.Period & "'"
            strTmpSQL = "SELECT debtor_personal.account_number,debtor_personal.first_name,debtor_personal.last_name,debtor_personal.cell_number,financial_closing_balances.total," &
                        "financial_closing_balances.current_balance,financial_closing_balances.p30,financial_closing_balances.p60,financial_closing_balances.p90,financial_closing_balances.p120," &
                        "financial_closing_balances.p150,debtor_dates.date_of_last_payment,debtor_dates.date_of_last_transaction " &
                        "FROM " &
                        "debtor_personal " &
                        "LEFT OUTER JOIN financial_closing_balances " &
                        "ON debtor_personal.account_number = financial_closing_balances.account_number " &
                        "LEFT OUTER JOIN financial_balances ON debtor_personal.account_number = financial_balances.account_number " &
                        "LEFT OUTER JOIN debtor_dates ON debtor_personal.account_number = debtor_dates.account_number " &
                        "WHERE financial_closing_balances.current_period = '" & _getAgeAnalysisDetailRequest.Period & "'"
        End If

        If _getAgeAnalysisDetailRequest.ActiveAccount = True Then 'Active Customers Only
            tmpSQL = tmpSQL & " AND status = 'ACTIVE'"
            strTmpSQL = strTmpSQL & " AND status = 'ACTIVE'"
        Else 'Option of a Status
            tmpSQL = tmpSQL & " AND status = '" & _getAgeAnalysisDetailRequest.OtherStatus & "'"
            strTmpSQL = strTmpSQL & " AND status = '" & _getAgeAnalysisDetailRequest.OtherStatus & "'"
        End If

        If _getAgeAnalysisDetailRequest.AllAccounts = False Then
            tmpSQL = tmpSQL & " AND debtor_personal.account_number >= '" & _getAgeAnalysisDetailRequest.FromAccount & "' AND debtor_personal.account_number <= '" & _getAgeAnalysisDetailRequest.ToAccount & "'"
            strTmpSQL = strTmpSQL & " AND debtor_personal.account_number >= '" & _getAgeAnalysisDetailRequest.FromAccount & "' AND debtor_personal.account_number <= '" & _getAgeAnalysisDetailRequest.ToAccount & "'"
        End If

        'If _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = False Then
        '    tmpSQL = tmpSQL & " AND total = 0"
        '    strTmpSQL = strTmpSQL & " AND total = 0"
        'ElseIf _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = False Then
        '    tmpSQL = tmpSQL & " AND total >= 0"
        '    strTmpSQL = strTmpSQL & " AND total >= 0"
        'ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = False Then
        '    tmpSQL = tmpSQL & " AND total > 0"
        '    strTmpSQL = strTmpSQL & " AND total > 0"
        'ElseIf _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = True Then
        '    tmpSQL = tmpSQL & " AND total <= 0"
        '    strTmpSQL = strTmpSQL & " AND total <= 0"
        'ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = True Then
        '    tmpSQL = tmpSQL & " AND total > 0"
        '    strTmpSQL = strTmpSQL & " AND total > 0"
        'ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = True Then
        '    tmpSQL = tmpSQL & " AND total < 0"
        '    strTmpSQL = strTmpSQL & " AND total < 0"
        'End If

        If _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = False Then
            tmpSQL = tmpSQL & " AND financial_balances.total = 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total = 0"
        ElseIf _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = False Then
            tmpSQL = tmpSQL & " AND financial_balances.total >= 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total >= 0"
        ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = False Then
            tmpSQL = tmpSQL & " AND financial_balances.total > 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total > 0"
        ElseIf _getAgeAnalysisDetailRequest.PrintZero = True And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = True Then
            tmpSQL = tmpSQL & " AND financial_balances.total <= 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total <= 0"
        ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = True And _getAgeAnalysisDetailRequest.PrintDebit = True Then
            tmpSQL = tmpSQL & " AND financial_balances.total > 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total > 0"
        ElseIf _getAgeAnalysisDetailRequest.PrintZero = False And _getAgeAnalysisDetailRequest.PrintCredit = False And _getAgeAnalysisDetailRequest.PrintDebit = True Then
            tmpSQL = tmpSQL & " AND financial_balances.total < 0"
            strTmpSQL = strTmpSQL & " AND financial_balances.total < 0"
        End If

        tmpSQL = tmpSQL & " AND is_rage_employee = '" & _getAgeAnalysisDetailRequest.RageEmployee & "'"
        strTmpSQL = strTmpSQL & " AND is_rage_employee = '" & _getAgeAnalysisDetailRequest.RageEmployee & "'"

        tmpSQL = tmpSQL & " AND debtor_personal.show_on_age_analysis = True"
        strTmpSQL = strTmpSQL & " AND debtor_personal.show_on_age_analysis = True ORDER BY debtor_personal.account_number ASC"

        Try
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                getAgeAnalysisDetailResponse.LongTotalCount = ds.Tables(0).Rows(ds.Tables(0).Rows.Count - 1)("count")
            End If


            tmpSQL = strTmpSQL
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                getAgeAnalysisDetailResponse.AgeAnalysisDetails = ds.Tables(0)
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            getAgeAnalysisDetailResponse.Success = False
            getAgeAnalysisDetailResponse.Message = "Something Went Wrong"
            Return getAgeAnalysisDetailResponse
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        getAgeAnalysisDetailResponse.Success = True
        Return getAgeAnalysisDetailResponse

    End Function

    Public Function GetCardDetails(_giftCardDetailsRequest As GiftCardDetailsRequest) As GiftCardDetailsResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If _giftCardDetailsRequest.CardNumber = "" Then
            giftCardDetailsResponse.Message = "Please specify an Card Number before you continue."
            giftCardDetailsResponse.Success = False
            Return giftCardDetailsResponse
        End If

        tmpSQL = "SELECT card_dates.date_created,card_dates.date_modified,card_dates.date_last_used,card_details.current_status," &
                 "card_gift_cards.balance,card_gift_cards.total_spent,card_details.created_by " &
                 "From card_dates " &
                 "Inner Join card_details ON card_details.card_number = card_dates.card_number " &
                 "Inner Join card_gift_cards ON card_details.card_number = card_gift_cards.card_number " &
                 "Where card_details.card_number = '" & RG.Apos(_giftCardDetailsRequest.CardNumber) & "'"

        Try
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                giftCardDetailsResponse.GiftCardDetails = ds.Tables(0)
            End If
            tmpSQL = "SELECT * FROM financial_transactions WHERE account_number = '" & RG.Apos(_giftCardDetailsRequest.CardNumber) & "' ORDER BY financial_transactions_id ASC"

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                giftCardDetailsResponse.CardTransactions = ds.Tables(0)
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            giftCardDetailsResponse.Success = False
            giftCardDetailsResponse.Message = "Something Went Wrong"
            Return giftCardDetailsResponse
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try

        giftCardDetailsResponse.Success = True
        Return giftCardDetailsResponse

    End Function


End Class
