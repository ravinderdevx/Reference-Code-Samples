
Imports Entities
Imports pcm.DataLayer
Public Class EmployeeBusinessLayer
    Private _dlEmployee As New EmployeeDataLayer
    Private _baseResponse As New BaseResponse

    Public Function GetEmployees(Field As String, Criteria As String) As DataTable
        Dim _getEmployeeResponse As DataTable
        _getEmployeeResponse = _dlEmployee.GetEmployees(Field, Criteria)
        Return _getEmployeeResponse
    End Function

    Public Function SaveNotes(_employeeNoteRequest As EmployeeNoteRequest) As BaseResponse
        _baseResponse = _dlEmployee.SaveNotes(_employeeNoteRequest)
        Return _baseResponse
    End Function

    Public Function GetReviewsSummary(ByVal StartDate As String, ByVal EndDate As String, Name As String) As DataSet
        Return _dlEmployee.ReturnReviewsSummary(StartDate, EndDate, Name)
    End Function
End Class
