Imports DevExpress.Web
Imports abc.BusinessLayer
Imports Entities
Public Class reports1
    Inherits System.Web.UI.Page
    Dim _Employee As EmployeeBusinessLayer = New EmployeeBusinessLayer
    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If Not IsPostBack Then
            opt1.Checked = True
            opt2.Checked = False
            txtEmployeeName.ClientEnabled = False
            txtFromDate.ClientEnabled = True
            txtToDate.ClientEnabled = True
            GetReports()
        End If
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)
        If hdWhichButton.Value = "opt1_changed" Then
            opt1_changed()
        End If

        If hdWhichButton.Value = "opt2_changed" Then
            opt2_changed()
        End If

        If hdWhichButton.Value = "Run" Then
            GetReports()
        End If
    End Sub

    Public Function GetReports()

        Dim _ReportList As DataSet
        _ReportList = _Employee.GetReviewsSummary(txtFromDate.Text, txtToDate.Text, txtEmployeeName.Text)
        Session("_ReviewDS") = _ReportList
        gvReview.DataBind()
        If opt1.Checked = True Then
            opt1_changed()
        Else
            opt2_changed()
        End If
        Return Session("_ReviewDS")
    End Function

    Protected Sub gvReview_DataBinding(ByVal sender As Object, ByVal e As EventArgs)
        gvReview.BeginUpdate()
        Dim gridView As ASPxGridView = TryCast(sender, ASPxGridView)
        Dim data As DataSet = Session("_ReviewDS")
        ''gridView.KeyFieldName = "completed_survey_id" 'data.PrimaryKey(0).ColumnName
        gridView.DataSource = data
        gvReview.EndUpdate()

    End Sub
    Public Sub opt1_changed()
        opt2.Checked = False
        txtEmployeeName.Text = ""
        txtEmployeeName.ClientEnabled = False
        txtFromDate.ClientEnabled = True
        txtToDate.ClientEnabled = True
    End Sub

    Public Sub opt2_changed()
        opt1.Checked = False

        txtFromDate.ClientEnabled = False
        txtToDate.ClientEnabled = False
        txtFromDate.Text = ""
        txtToDate.Text = ""
        txtEmployeeName.ClientEnabled = True
    End Sub
End Class