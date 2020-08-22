Imports DevExpress.Web
Imports abc.BusinessLayer
Imports Entities

Public Class AgeAnalysis1

    Inherits System.Web.UI.Page
    Dim _AgeAnalysis As AgeAnalysisBusinessLayer = New AgeAnalysisBusinessLayer

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        InitialiseValues()
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)

        If hdWhichButton.Value = "opt1" Then
            opt1_Click()
        End If

        If hdWhichButton.Value = "opt2" Then
            opt2_Click()
        End If

        If hdWhichButton.Value = "chkAll" Then
            chkAll_Click()
        End If

        If hdWhichButton.Value = "Ok" Then
            cmdOk_Click()
        End If

    End Sub
    Private Sub InitialiseValues()
        cboOther.Items.Clear()
        cboOther.Items.Add("ALL")
        cboOther.Items.Add("BLOCKED")
        cboOther.Items.Add("DEBT REVIEW")
        cboOther.Items.Add("DECEASED")
        cboOther.Items.Add("DECLINED")
        cboOther.Items.Add("FRAUD")
        cboOther.Items.Add("LEGAL")
        cboOther.Items.Add("PENDING")
        cboOther.Items.Add("SUSPENDED")
        cboOther.Items.Add("WRITE-OFF")

        cboPeriod.Items.Clear()
        cboPeriod.Items.Add("")
        cboPeriod.Items.Add("CURRENT")

        Dim getPeriodResponse As GetPeriodResponse
        getPeriodResponse = _AgeAnalysis.GetPeriods()

        Dim perLoop As Long
        For perLoop = getPeriodResponse.Period - 1 To getPeriodResponse.Period - 13 Step -1
            cboPeriod.Items.Add(perLoop)
        Next perLoop

    End Sub

    Private Sub opt1_Click()
        opt2.Checked = False
        cboOther.ClientEnabled = False
        cboOther.Text = ""
    End Sub

    Private Sub opt2_Click()
        opt1.Checked = False
        cboOther.ClientEnabled = True
    End Sub

    Private Sub chkAll_Click()
        If chkAll.Checked = True Then
            txtFrom.ClientEnabled = False
            txtTo.ClientEnabled = False
            txtFrom.Text = "ALL"
            txtTo.Text = "ALL"
        ElseIf chkAll.Value = False Then
            txtFrom.ClientEnabled = True
            txtTo.ClientEnabled = True
            txtFrom.Text = ""
            txtTo.Text = ""

        End If
    End Sub

    Protected Sub cmdOk_Click()
        Dim getAgeAnalysisDetailRequest As New GetAgeAnalysisDetailRequest
        Dim getAgeAnalysisDetailResponse As New GetAgeAnalysisDetailResponse
        Dim lngCounter As Long


        getAgeAnalysisDetailRequest.FromAccount = txtFrom.Text
        getAgeAnalysisDetailRequest.ToAccount = txtTo.Text
        getAgeAnalysisDetailRequest.Period = cboPeriod.Value
        getAgeAnalysisDetailRequest.AllAccounts = chkAll.Checked
        getAgeAnalysisDetailRequest.PrintDebit = chkDeb.Checked
        getAgeAnalysisDetailRequest.PrintZero = chkZero.Checked
        getAgeAnalysisDetailRequest.PrintCredit = chkCred.Checked
        getAgeAnalysisDetailRequest.RageEmployee = chkRageEmployee.Checked
        getAgeAnalysisDetailRequest.ActiveAccount = opt1.Checked
        getAgeAnalysisDetailRequest.CheckOtherStatus = opt2.Checked
        getAgeAnalysisDetailRequest.OtherStatus = cboOther.Value
        getAgeAnalysisDetailRequest.CheckDoubleLine = chkDoubleLine.Checked
        getAgeAnalysisDetailRequest.DoubleLine = txtFile.Text

        getAgeAnalysisDetailResponse = _AgeAnalysis.GetAgeAnalysisDetails(getAgeAnalysisDetailRequest)
        If getAgeAnalysisDetailResponse.Success = True Then
            If getAgeAnalysisDetailResponse.AgeAnalysisDetails IsNot Nothing Then
                For Each dr As DataRow In getAgeAnalysisDetailResponse.AgeAnalysisDetails.Rows
                    lngCounter = 0
                    lngCounter = lngCounter + 1
                    If getAgeAnalysisDetailResponse.LongTotalCount <> 0 Then
                        '''pB.Value = lngCounter / getAgeAnalysisDetailResponse.LongTotalCount * 100
                    End If
                Next
                Session("_AgeAnalysisDS") = getAgeAnalysisDetailResponse.AgeAnalysisDetails
                grdAgeAnalysisDetails.DataBind()
            Else
                dxPopUpError.HeaderText = "Error"
                lblError.Text = "No Details Found"
                dxPopUpError.ShowOnPageLoad = True
                Session("_AgeAnalysisDS") = Nothing
                grdAgeAnalysisDetails.DataBind()
            End If
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = getAgeAnalysisDetailResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        End If

        If getAgeAnalysisDetailRequest.ActiveAccount = True Then
            opt1_Click()
        End If

        If getAgeAnalysisDetailRequest.AllAccounts = True Then
            chkAll_Click()
        End If

    End Sub

    Protected Sub grdAgeAnalysisDetails_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
        Dim data As DataTable = Session("_AgeAnalysisDS")
        ''gridView.KeyFieldName = "completed_survey_id" 'data.PrimaryKey(0).ColumnName
        gridView.DataSource = data


    End Sub
    Protected Sub cmdExportCSV_Click(sender As Object, e As EventArgs) Handles cmdExportCSV.Click
        Exporter.WriteCsvToResponse()
    End Sub
End Class