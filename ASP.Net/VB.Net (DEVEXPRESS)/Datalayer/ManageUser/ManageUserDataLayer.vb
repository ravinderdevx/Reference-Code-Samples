Imports Entities
Imports Newtonsoft.Json
Imports Npgsql
Imports Npgsql.Logging
Imports pcm.DataLayer.dlLoggingNpgSQL
Public Class ManageUserDataLayer
    Inherits DataAccessLayerBase

    Dim RG As New Utilities.clsUtil
    Dim tmpSQL As String
    Dim ds As DataSet
    Dim DebtorDataLayer As New DebtorsDataLayer
    Dim dataTableResponse As New DataTableResponse


    Public Function GetBranchDetails() As DataTableResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Try
            tmpSQL = "SELECT branch_code,branch_name FROM branch_details ORDER BY branch_code ASC"
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                dataTableResponse.Detail = ds.Tables(0)
                dataTableResponse.Success = True
            Else
                dataTableResponse.Success = False
                dataTableResponse.Message = "No Branch Found"
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            dataTableResponse.Message = "Something Went Wrong"
            dataTableResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return dataTableResponse
    End Function

    Public Function GetUserPermissions(ByVal BranchCode() As String, User As String) As DataTableResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")
        Try
            If User = "" Then
                tmpSQL = "SELECT * FROM user_permissions WHERE branch_code = '" & RG.Apos(BranchCode(0).ToString.ToUpper) & "' ORDER BY user_name ASC"
            Else
                tmpSQL = "SELECT * FROM user_permissions WHERE branch_code = '" & RG.Apos(BranchCode(0).ToString.ToUpper) & "' AND user_name = '" & RG.Apos(User.ToUpper) & "' ORDER BY user_name ASC"
            End If
            tmpSQL = tmpSQL
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                dataTableResponse.Detail = ds.Tables(0)
                dataTableResponse.Success = True
                dataTableResponse.Message = "Success"
            Else
                dataTableResponse.Success = False
                dataTableResponse.Message = "No Detail Found"
            End If
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            dataTableResponse.Message = "Something Went Wrong"
            dataTableResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return dataTableResponse

    End Function

    Public Function DeleteUser(deleteRequest As DeleteRequest, BranchCode() As String) As DataTableResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If deleteRequest.Branch = "" Then
            dataTableResponse.Message = "Please select a branch before continuing"
            dataTableResponse.Success = False
            Return dataTableResponse
        End If

        If deleteRequest.User = "" Then
            dataTableResponse.Message = "Please input or select a user before continuing"
            dataTableResponse.Success = False
            Return dataTableResponse
        End If

        'If MsgBox("Are you sure you want to change user file and delete User: " & cboUser.Text & " in Branch: " & cboShop.Text & "?", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
        '    Exit Sub

        Try
            tmpSQL = "DELETE FROM user_permissions WHERE branch_code = '" & RG.Apos(BranchCode(0).ToUpper) & "' AND user_name = '" & RG.Apos(deleteRequest.User.ToUpper) & "'"
            objDB.ExecuteQuery(tmpSQL)
            dataTableResponse.Success = True
            dataTableResponse.Message = "User Deleted."
        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            dataTableResponse.Message = "Something Went Wrong"
            dataTableResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return dataTableResponse



    End Function

    Public Function SaveUser(saveUserRequest As SaveUserRequest, BranchCode() As String, strPOS As String, strMaint As String, strTrans As String, strOther As String) As DataTableResponse
        Dim objDB As New dlNpgSQL("PostgreConnectionStringPositiveRead")

        If saveUserRequest.Branch = "" Then
            dataTableResponse.Message = "Please select a branch before continuing"
            dataTableResponse.Success = False
            Return dataTableResponse
        End If

        If saveUserRequest.User = "" Then
            dataTableResponse.Message = "Please input or select a user before continuing"
            dataTableResponse.Success = False
            Return dataTableResponse
        End If

        If saveUserRequest.Password = "" Then
            dataTableResponse.Message = "Please input a password before continuing"
            dataTableResponse.Success = False
            Return dataTableResponse
        End If

        Try
            tmpSQL = "SELECT * FROM user_permissions WHERE user_name = '" & RG.Apos(saveUserRequest.User.ToUpper) & "' AND branch_code <> '" & BranchCode(0).ToUpper & "'"
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                dataTableResponse.Detail = ds.Tables(0).Rows(ds.Tables(0).Rows.Count - 1)("user_name")
                dataTableResponse.Success = False
                dataTableResponse.Message = "User: " & saveUserRequest.User.ToUpper & " already exists on the system. Please select another username."
                Return dataTableResponse
            End If


            'tmpSQL = "SELECT * FROM branch_details WHERE branch_code = '" & RG.Apos(BranchCode(0).ToUpper) & "'"
            'ds = objDB.GetDataSet(tmpSQL)
            'If objDB.isR(ds) Then
            '    If ds.Tables(0).Rows(0)("is_head_office") & "" = True Then
            '        If saveUserRequest.ShopUser = True Then
            '            dataTableResponse.Success = False
            '            dataTableResponse.Message = "You cannot add a shop user to a Head Office branch"
            '            Return dataTableResponse
            '        End If
            '    Else
            '        If saveUserRequest.HeadOfficeUser = True Then
            '            dataTableResponse.Success = False
            '            dataTableResponse.Message = "You cannot add a Head Office user to a shop branch"
            '            Return dataTableResponse
            '        End If
            '    End If
            'End If



            tmpSQL = "SELECT user_name FROM user_permissions WHERE branch_code = '" & RG.Apos(BranchCode(0).ToUpper) & "' AND user_name = '" & RG.Apos(saveUserRequest.User) & "'"
            ds = objDB.GetDataSet(tmpSQL)
            If objDB.isR(ds) Then
                ds.Clear()
                tmpSQL = "UPDATE user_permissions SET user_password = '" & RG.Apos(saveUserRequest.Password.ToUpper) & "'," &
                         "is_locked_to_branch = '" & saveUserRequest.LockToBranch & "'," &
                         "is_head_office_user = '" & saveUserRequest.HeadOfficeUser & "'," &
                         "pos_sequence = '" & strPOS & "'," &
                         "maintenance_sequence = '" & strMaint & "'," &
                         "transaction_sequence = '" & strTrans & "'," &
                         "other_permissions_sequence = '" & strOther & "'," &
                         "updated = '" & Today() & "'" &
                         " WHERE branch_code = '" & RG.Apos(BranchCode(0).ToUpper) & "' AND user_name = '" & RG.Apos(saveUserRequest.User.ToUpper) & "'"
                objDB.ExecuteQuery(tmpSQL)
            Else

                tmpSQL = "INSERT INTO user_permissions (branch_code,user_name,user_password,is_locked_to_branch,is_head_office_user," &
                         "pos_sequence,maintenance_sequence,transaction_sequence,other_permissions_sequence,inserted) VALUES " &
                         "('" & RG.Apos(BranchCode(0).ToUpper) & "','" & RG.Apos(saveUserRequest.User.ToUpper) & "','" & RG.Apos(saveUserRequest.Password.ToUpper) & "'," &
                         "'" & saveUserRequest.LockToBranch & " ','" & saveUserRequest.HeadOfficeUser & "','" & strPOS & "','" & strMaint & "','" & strTrans & "','" & strOther & "'," &
                         "'" & Today() & "')"
                objDB.ExecuteQuery(tmpSQL)

            End If

            dataTableResponse.Message = "User file updated"
            dataTableResponse.Success = True

        Catch ex As Exception
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
            dataTableResponse.Message = "Something Went Wrong"
            dataTableResponse.Success = False
        Finally
            If (objDB IsNot Nothing) Then
                objDB.CloseConnection()
            End If
        End Try
        Return dataTableResponse
    End Function
End Class
