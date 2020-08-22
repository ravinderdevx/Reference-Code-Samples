Imports Entities
Imports pcm.DataLayer
Public Class POSBusinessLayer
    Private _dlPOSDataLayer As New POSDataLayer


    Dim _returnDebtor As New Debtor

    Public Function GetSelfActivateDetails(ByVal IDNumber As String) As Debtor
        _returnDebtor = _dlPOSDataLayer.GetSelfActivateDetails(IDNumber)
        Return _returnDebtor
    End Function

    Public Function InsertSelfActivated(ByVal DebtorDetails As Debtor) As Debtor
        _returnDebtor = _dlPOSDataLayer.InsertSelfActivated(DebtorDetails)
        Return _returnDebtor
    End Function

    Public Function GetBranchList(Optional ByVal BranchCode As String = "") As DataSet
        Dim _branchListDS As DataSet

        'Get Branch List
        _branchListDS = _dlPOSDataLayer.GetBranchList(BranchCode)
        If _branchListDS Is Nothing Then
            Return Nothing
        End If
        Return _branchListDS
    End Function
End Class
