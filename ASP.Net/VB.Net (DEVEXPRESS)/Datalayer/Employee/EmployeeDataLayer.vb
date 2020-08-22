Imports Entities
Public Class EmployeeDataLayer

    Dim RG As New Utilities.clsUtil
    Dim tmpSQL As String
    Dim ds As DataSet
    Private _baseResponse As New BaseResponse
    Dim DebtorDataLayer As New DebtorsDataLayer


    Public Function GetEmployees(Field As String, Criteria As String) As DataTable
        Dim GetEmployeesResponse As DataTable

        Dim objDBRead As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If Field = "" Then

            _baseResponse.Message = "Please specify a Search Field."
            _baseResponse.Success = False
            Return Nothing
        End If

        If Criteria = "" Then
            _baseResponse.Message = "Please enter a search criteria."
            _baseResponse.Success = False
            Return Nothing
        End If

        If Field = "Employee Number" Then
            tmpSQL = "Select employee_number,first_name,last_name FROM employee_details WHERE employee_number Like '" & Criteria & "%' "


        ElseIf Field = "First Name" Then
            tmpSQL = "Select employee_number,first_name,last_name FROM employee_details WHERE first_name Like '" & Criteria & "%' "


        ElseIf Field = "Last Name" Then

            tmpSQL = "Select employee_number,first_name,last_name FROM employee_details WHERE last_name Like '" & Criteria & "%' "

        End If

        Try
            ds = objDBRead.GetDataSet(tmpSQL)
            If objDBRead.isR(ds) Then
                GetEmployeesResponse = ds.Tables(0)
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

        Return GetEmployeesResponse

    End Function

    Public Function SaveNotes(employeeNoteRequest As EmployeeNoteRequest) As BaseResponse


        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If employeeNoteRequest.EmployeeName = "" Then
            _baseResponse.Success = False
            _baseResponse.Message = "Please enter Employee number."
            Return _baseResponse
        End If

        If employeeNoteRequest.TypeOfReport = "" Then
            _baseResponse.Success = False
            _baseResponse.Message = "Please select Type of report."
            Return _baseResponse
        End If

        If employeeNoteRequest.TypeOfReport = "Warning" And employeeNoteRequest.Warning = "" Then
            _baseResponse.Success = False
            _baseResponse.Message = "Please select warning."
            Return _baseResponse
        End If

        If employeeNoteRequest.TypeOfReport = "Review" And employeeNoteRequest.Rating = "0" Then
            _baseResponse.Success = False
            _baseResponse.Message = "Please select rating."
            Return _baseResponse
        End If

        If employeeNoteRequest.Note = "" Then
            _baseResponse.Success = False
            _baseResponse.Message = "Please enter the notes."
            Return _baseResponse
        End If

        Try
            If employeeNoteRequest.TypeOfReport = "Warning" Then
                tmpSQL = "INSERT INTO employee_reviews (employee_number,type_of_comment,time_stamp,comment,user_name,type_of_warning) VALUES " &
           "('" & RG.Apos(employeeNoteRequest.EmployeeNumber) & "','" & RG.Apos(employeeNoteRequest.TypeOfReport) & "','" & Now() & "','" & RG.Apos(employeeNoteRequest.Note) & "','" & RG.Apos(employeeNoteRequest.EmployeeName) & "','" & RG.Apos(employeeNoteRequest.Warning) & "')"
            Else
                tmpSQL = "INSERT INTO employee_reviews (employee_number,type_of_comment,rating,time_stamp,comment,user_name) VALUES " &
          "('" & RG.Apos(employeeNoteRequest.EmployeeNumber) & "','" & RG.Apos(employeeNoteRequest.TypeOfReport) & "','" & RG.Apos(employeeNoteRequest.Rating) & "','" & Now() & "','" & RG.Apos(employeeNoteRequest.Note) & "','" & RG.Apos(employeeNoteRequest.EmployeeName) & "')"
            End If

            objDB.ExecuteQuery(tmpSQL)

        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            _baseResponse.Success = False
            _baseResponse.Message = "Something Went Wrong"
            Return _baseResponse
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try

        _baseResponse.Success = True
        Return _baseResponse
    End Function

    Public Function ReturnReviewsSummary(ByVal StartDate As String, ByVal EndDate As String, Name As String) As DataSet
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Dim WhereCondition As String = ""
        Try
            If StartDate <> "" And EndDate <> "" Then
                If WhereCondition = "" Then
                    WhereCondition &= " WHERE er.time_stamp between '" & StartDate & " 00:00:00' and '" & EndDate & " 23:59:59'"
                Else
                    WhereCondition &= " AND er.time_stamp between '" & StartDate & " 00:00:00' and '" & EndDate & " 23:59:59'"
                End If
            End If

            If Name IsNot Nothing And Name <> "" Then
                If WhereCondition = "" Then
                    WhereCondition &= " WHERE concat(ed.first_name,' ', ed.last_name) ILIKE '%" & Name & "%'"
                Else
                    WhereCondition &= " AND concat(ed.first_name,' ', ed.last_name) ILIKE '%" & Name & "%'"
                End If
            End If

            tmpSQL = "select er.employee_number,
                     er.type_of_comment,
                    er.rating,
                    er.comment,
                    er.time_stamp,
                    er.type_of_warning,
                    concat(ed.first_name,' ', ed.last_name) as name
                    from public.employee_reviews as er
                    join public.employee_details as ed  on ed.employee_number=er.employee_number" & WhereCondition & " ORDER BY er.time_stamp DESC"

            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                Return ds
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
    End Function

End Class
