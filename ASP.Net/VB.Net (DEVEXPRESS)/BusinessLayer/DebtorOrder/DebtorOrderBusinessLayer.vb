Imports Entities
Imports pcm.DataLayer
Public Class DebtorOrderBusinessLayer
    Private _dlDebitOrder As New DebtorOrderDataLayer

    Public Function GetDebitOrders() As DataTable
        Dim debitorDT As DataTable
        debitorDT = _dlDebitOrder.GetDebitOrders()
        Return debitorDT
    End Function

    Public Function getDebtorsSumDetails() As DebtorsSumResponse
        Dim _DebtorsSumResponse As New DebtorsSumResponse
        _DebtorsSumResponse = _dlDebitOrder.getDebtorsSumDetails()
        Return _DebtorsSumResponse
    End Function

    Public Function CheckAccountNumber(AccountNubmer As String) As DataTable
        Dim _dt As DataTable
        _dt = _dlDebitOrder.CheckAccountNumber(AccountNubmer)
        Return _dt
    End Function

End Class
