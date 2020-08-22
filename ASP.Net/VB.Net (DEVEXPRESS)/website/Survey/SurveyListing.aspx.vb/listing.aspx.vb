Imports DevExpress.Web
Imports App.BusinessLayer
Imports Entities

Public Class listing
    Inherits System.Web.UI.Page

    Private _SurveyList As DataSet = Nothing

    Dim _Survey As SurveyBusinessLayer = New SurveyBusinessLayer

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
            Session("username") = "Adam"
        End If

        If Not IsPostBack Then
            Session.Remove("_SureveyDS")
            GetSurvey()
        End If
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)

        If hdWhichButton.Value = "OpenAddSurveyPopup" Then
            OpenCreateSurveyPopup()
        End If

        If hdWhichButton.Value = "OpenEditSurveyPopup" Then
            OpenEditSurveyPopup()
        End If

        If hdWhichButton.Value = "CreateSurvey" Then
            CreateSurvey()
        End If

        If hdWhichButton.Value = "EditSurvey" Then
            OpenEditSurveyPopup()
        End If

        If hdWhichButton.Value = "DeleteSurvey" Then
            DeleteSurvey()
        End If

        If hdWhichButton.Value = "EditSurveyQuestions" Then
            EditSurveyQuestions()
        End If

    End Sub

    Protected Sub OpenCreateSurveyPopup()
        txtNameOfSurvey.Text = ""
        cboTypeOfSurvey.Text = ""
        chkIsActive.Checked = False
        cboTimeAllowed.Text = ""
        HDSurveyId.Value = ""

        SurveyPopup.HeaderText = "Create Survey"
        surveyBtn.Text = "Create"
        SurveyPopup.ShowOnPageLoad = True
    End Sub

    Protected Sub OpenEditSurveyPopup()
        Dim selectedValues = New List(Of Object)()

        selectedValues = Nothing

        selectedValues = grdSurveyListing.GetSelectedFieldValues("survey_id")

        If selectedValues.Count > 0 Then
            Dim strSurveyId As String = selectedValues(selectedValues.Count - 1)
            Dim _surveyDetailsResponse As New SurveyDetailsResponse
            _surveyDetailsResponse = _Survey.GetSelectedSurveyDetails(strSurveyId)

            If (_surveyDetailsResponse.Success = False) Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = _surveyDetailsResponse.Message
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            End If

            Dim _dt As DataTable = _surveyDetailsResponse.GetSelectedSurveyResponse

            If _dt.Rows.Count = 0 Then
                Exit Sub
            End If


            txtNameOfSurvey.Text = _dt.Rows(_dt.Rows.Count - 1)("survey_name")
            cboTypeOfSurvey.Text = _dt.Rows(_dt.Rows.Count - 1)("type_of_survey")
            chkIsActive.Checked = _dt.Rows(_dt.Rows.Count - 1)("is_active")
            cboTimeAllowed.Text = _dt.Rows(_dt.Rows.Count - 1)("max_time_allowed")

            HDSurveyId.Value = _dt.Rows(_dt.Rows.Count - 1)("survey_id")

            SurveyPopup.HeaderText = "Update Survey"
            surveyBtn.Text = "Update"
            SurveyPopup.ShowOnPageLoad = True

        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "Please select record to perform action"
            dxPopUpError.ShowOnPageLoad = True
        End If
    End Sub

    Private Sub GetSurvey()
        _SurveyList = _Survey.GetSurveyList()

        Session("_SureveyDS") = _SurveyList
        grdSurveyListing.DataBind()
    End Sub

    Protected Sub CreateSurvey()
        Dim _SaveSurveyRequest As New SaveSurveyRequest
        _SaveSurveyRequest = CreateNewSurveyRequest()

        Dim saveSurveyResponse As New SaveSurveyResponse
        saveSurveyResponse = _Survey.SaveSurvey(_SaveSurveyRequest)
        If saveSurveyResponse.Success = False Then
            dxPopUpError.HeaderText = "Error"
            lblError.Text = saveSurveyResponse.Message
            dxPopUpError.ShowOnPageLoad = True
        Else
            'Response.Redirect("SurveyQuestions.aspx?survey_id=" + saveSurveyResponse.SurveyId)
            If saveSurveyResponse.IsRedirect = True Then
                ASPxWebControl.RedirectOnCallback("questions.aspx?survey_id=" + saveSurveyResponse.SurveyId)
            Else
                GetSurvey()

                SurveyPopup.ShowOnPageLoad = False

                dxPopUpError.HeaderText = "Success"
                lblError.Text = saveSurveyResponse.Message
                dxPopUpError.ShowOnPageLoad = True
            End If
        End If
    End Sub

    Protected Sub DeleteSurvey()
        Dim selectedValues = New List(Of Object)()

        selectedValues = Nothing

        selectedValues = grdSurveyListing.GetSelectedFieldValues("survey_id")

        If selectedValues.Count > 0 Then
            Dim deleteSurveyResponse As New BaseResponse

            Dim survey_id As String = selectedValues(selectedValues.Count - 1)
            deleteSurveyResponse = _Survey.DeleteSurvey(survey_id)

            If (deleteSurveyResponse.Success = False) Then
                dxPopUpError.HeaderText = "Error"
                lblError.Text = deleteSurveyResponse.Message
                dxPopUpError.ShowOnPageLoad = True
                Exit Sub
            Else
                GetSurvey()

                dxPopUpError.HeaderText = "Success"
                lblError.Text = deleteSurveyResponse.Message
                dxPopUpError.ShowOnPageLoad = True
            End If
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "Please select record to perform action"
            dxPopUpError.ShowOnPageLoad = True
        End If
    End Sub

    Protected Sub EditSurveyQuestions()
        Dim selectedValues = New List(Of Object)()

        selectedValues = Nothing

        selectedValues = grdSurveyListing.GetSelectedFieldValues("survey_id")

        If selectedValues.Count > 0 Then
            Dim survey_id As String = selectedValues(selectedValues.Count - 1)
            ASPxWebControl.RedirectOnCallback("questions.aspx?survey_id=" + survey_id)
        Else
            dxPopUpError.HeaderText = "Error"
            lblError.Text = "Please select record to perform action"
            dxPopUpError.ShowOnPageLoad = True
        End If
    End Sub


    Public Function CreateNewSurveyRequest() As SaveSurveyRequest
        Dim _SaveSurveyRequest As New SaveSurveyRequest
        _SaveSurveyRequest.SurveyName = txtNameOfSurvey.Text
        _SaveSurveyRequest.TypeOfSurvey = cboTypeOfSurvey.Value
        _SaveSurveyRequest.IsActive = chkIsActive.Checked
        _SaveSurveyRequest.MaxTimeAllowed = cboTimeAllowed.Value
        _SaveSurveyRequest.SurveyId = HDSurveyId.Value
        _SaveSurveyRequest.CreatedBy = 1
        Return _SaveSurveyRequest
    End Function

    Protected Sub gridSurveyListing_DataBinding(ByVal sender As Object, ByVal e As EventArgs)

        If IsNothing(Session("_SureveyDS")) Then
            grdSurveyListing.DataSource = Nothing
        Else
            grdSurveyListing.DataSource = Session("_SureveyDS")
        End If
    End Sub
End Class