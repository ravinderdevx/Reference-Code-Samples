Imports DevExpress.Web
Imports abc.BusinessLayer

Public Class debtor_order
    Inherits System.Web.UI.Page

    Dim _blDebtorOrder As DebtorOrderBusinessLayer = New DebtorOrderBusinessLayer

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        Dim url As String = Request.Url.AbsoluteUri

        If Not HttpContext.Current.IsDebuggingEnabled Then
            If Session("username") = "" Then
                If Not IsCallback Then
                    Response.Redirect("~/Intranet/Default.aspx")
                Else
                    ASPxWebControl.RedirectOnCallback("~/Intranet/Default.aspx")
                End If
            End If
        Else
            Session("username") = "Demo"
        End If

        If Not IsPostBack Then
            Session("debtorOrderDS") = ""
            Session("debtorOrderDS") = _blDebtorOrder.GetDebitOrders()
            grdDebtorOrderDetails.DataBind()
        End If
    End Sub

    'Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)
    '    If hdWhichButton.Value = "Submit" Then
    '        cmdOk_Click()
    '    End If
    'End Sub

    'Private Sub cmdOk_Click()
    'Dim CurOwe As String

    '    cmdOk.Enabled = False
    '    cmdCancel.Enabled = False

    '    lblStatus.Text = "Please Wait..."

    '    _blDebtorOrder.GetDebitOrders()



    'Set Fso = New Scripting.FileSystemObject
    'Set Strm = Fso.OpenTextFile(App.Path & "\Temp" & Mi & ".html", ForWriting, True)

    'CreateHeader "Debit Order"

    'Strm.WriteLine "<h2 align=""center""><strong>Debtor Debit Order Report At " & Format(Now, "yyyy-MM-dd") & "</strong></h2>"

    'Strm.WriteLine "<table border=""0"" cellspacing=""0"" cellpadding=""0"" class=""whiteB txtA12"">"

    'Strm.WriteLine "<tr class=""greyB blackF"">"
    'Strm.WriteLine "<td class=""t r b l"" width=""80"">Account Number</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""120"">Name</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""120"">Bank Name</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""120"">Branch Name</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""80"">Branch Code</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""90"">Bank Acc Number</td>"
    'Strm.WriteLine "<td class=""t r b"" width=""80"">Owing</td>"
    'Strm.WriteLine "</tr>"

    'dTotal = "0"

    '    tmpSQL = "SELECT debtor_banking.bank_name,debtor_banking.branch_name,debtor_banking.branch_number," &
    '             "debtor_banking.bank_account_number,debtor_personal.account_number,debtor_personal.title,debtor_personal.initials,debtor_personal.last_name," &
    '             "financial_balances.current_balance,financial_balances.p30,financial_balances.p90,financial_balances.p60," &
    '             "financial_balances.p120,financial_balances.p150 " &
    '             "From debtor_banking " &
    '             "Inner Join debtor_personal ON debtor_banking.account_number = debtor_personal.account_number " &
    '             "Inner Join financial_balances ON debtor_banking.account_number = financial_balances.account_number AND " &
    '             "(financial_balances.current_balance + financial_balances.p30 + financial_balances.p60 " &
    '             "+ financial_balances.p90 + + financial_balances.p120 + financial_balances.p150) > 0 " &
    '             "Where debtor_banking.payment_type = 'DEBIT ORDER' ORDER BY debtor_personal.account_number ASC"
    '    NEX 1321
    'If isR(1321) Then
    '        Do While Not rS(1321).EOF

    '            CurOwe = Val(rS(1321).Fields("current_balance")) + Val(rS(1321).Fields("p30")) + Val(rS(1321).Fields("p90")) + Val(rS(1321).Fields("p120")) + Val(rS(1321).Fields("p150"))

    '            Strm.WriteLine "<tr class=""whiteB blackF"">"
    '        Strm.WriteLine "<td class=""r b l"">" & rS(1321).Fields("account_number") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & rS(1321).Fields("title") & " " & rS(1321).Fields("initials") & " " & rS(1321).Fields("last_name") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & rS(1321).Fields("bank_name") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & rS(1321).Fields("branch_name") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & rS(1321).Fields("branch_number") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & rS(1321).Fields("bank_account_number") & "&nbsp</td>"
    '        Strm.WriteLine "<td class=""r b"">" & Format(Val(CurOwe), "0.00") & "&nbsp</td>"
    '        Strm.WriteLine "</tr>"

    '        dTotal = Val(dTotal) + Val(CurOwe)

    '            DoEvents
    '            rS(1321).MoveNext
    '        Loop
    '    End If
    '    NCL 1321

    'Strm.WriteLine "</table>"

    'Strm.WriteLine "<pre></pre>"

    'Strm.WriteLine "<table border=""0"" cellspacing=""0"" cellpadding=""0"" class=""whiteB txtA14"">"
    'Strm.WriteLine "<tr class=""whiteB blackF"">"
    'Strm.WriteLine "<td width=""50""><strong>Total</strong></td>"
    'Strm.WriteLine "<td width=""120""><strong>" & Format(Val(dTotal), "0.00") & "</strong></td>"
    'Strm.WriteLine "</tr>"
    'Strm.WriteLine "</table>"

    'lblStatus = ""

    'Set Strm = Nothing
    'Set Fso = Nothing

    'cmdOk.Enabled = True
    '    cmdCancel.Enabled = True

    '    frmView.txtView.Navigate App.Path & "\Temp" & Mi & ".html"
    'frmView.Show vbModal


    '        Exit Sub

    'cmdOk_Click_Error:
    '        cmdOk.Enabled = True
    '        cmdCancel.Enabled = True
    '        MsgBox "Error " & Err.Number & " (" & Err.Description & ") in procedure cmdOk_Click of Form frmDebitOrder"
    'End Sub


    Protected Sub grdDebtorOrderDetails_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
        Dim data As DataTable = Session("debtorOrderDS")
        gridView.DataSource = data
    End Sub

    Protected Sub cmdExportCSV_Click(sender As Object, e As EventArgs) Handles cmdExportCSV.Click
        Exporter.WriteCsvToResponse()
    End Sub
End Class