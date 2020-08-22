Public Class DataTableResponse
    Inherits BaseResponse
    Public Property Detail As DataTable
End Class

Public Class DeleteRequest
    Public Property Branch As String
    Public Property User As String
End Class


Public Class SaveUserRequest
    Public Property Branch As String
    Public Property User As String
    Public Property Password As String
    Public Property HeadOfficeUser As Boolean
    Public Property ShopUser As Boolean
    Public Property LockToBranch As Boolean

End Class
