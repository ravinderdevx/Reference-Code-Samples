Imports DevExpress.Web
Imports Entities
Imports App.BusinessLayer

Public Class questions
    Inherits System.Web.UI.Page

    Public Shared _Survey As SurveyBusinessLayer = New SurveyBusinessLayer
    Public Shared survey_id As String

    Private Sub hud_PreInit(sender As Object, e As System.EventArgs) Handles Me.PreInit
        DevExpress.Web.ASPxWebControl.GlobalTheme = "Office2010Blue"
    End Sub

    Protected Sub ASPxCallback1_Callback(ByVal sender As Object, ByVal e As CallbackEventArgsBase)
        survey_id = Request.QueryString("survey_id")
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

        survey_id = Request.QueryString("survey_id")
        If survey_id = "" Then
            Response.Redirect("~/survey/listing.aspx")
        End If
    End Sub

    <System.Web.Services.WebMethod()>
    Public Shared Function GetAllQuestionsBySurveyId() As GetAllQuestionsResponse
        Dim getAllQuestionsResponse As New GetAllQuestionsResponse
        getAllQuestionsResponse = _Survey.GetAllQuestionsBySurveyId(survey_id)

        Return getAllQuestionsResponse
    End Function

    <System.Web.Services.WebMethod()>
    Public Shared Function SaveQuestion(ByVal SaveQuestionRequest As String) As BaseResponse
        Dim SaveQuestionResponse As New BaseResponse
        'Dim survey_id As String = survey_id
        'Dim survey_id As String = HttpContext.Current.Request.QueryString("survey_id")
        SaveQuestionResponse = _Survey.SaveQuestion(survey_id, SaveQuestionRequest)

        Return SaveQuestionResponse
    End Function

    <System.Web.Services.WebMethod()>
    Public Shared Function EditQuestion(ByVal question_id As String) As GetSelectedQuestionResponse
        Dim getSelectedQuestionResponse As New GetSelectedQuestionResponse
        getSelectedQuestionResponse = _Survey.EditQuestion(question_id)
        Return getSelectedQuestionResponse
    End Function

    <System.Web.Services.WebMethod()>
    Public Shared Function DeleteQuestion(ByVal question_id As String) As BaseResponse
        Dim deletequestionResponse As New BaseResponse
        deletequestionResponse = _Survey.DeleteQuestion(question_id)
        Return deletequestionResponse
    End Function


    <System.Web.Services.WebMethod()>
    Public Shared Function DeleteOption(ByVal question_id As String, option_id As Integer) As BaseResponse
        Dim deleteOptionResponse As New BaseResponse
        deleteOptionResponse = _Survey.DeleteOption(question_id, option_id)
        Return deleteOptionResponse
    End Function
End Class