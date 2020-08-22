
Public Class GetDetailsRequest
    Public Property FromAccount As String
    Public Property ToAccount As String
    Public Property CheckAll As Boolean
    Public Property ActiveOnly As Boolean
    Public Property OtherStatus As Boolean
    Public Property Other As String


    Public Property AccountsOpenedBetween As Boolean
    Public Property StartDate As String
    Public Property EndDate As String
    Public Property LastTransaction As Boolean
    Public Property LastDateTransaction As String


    Public Property CboCurrent As String
    Public Property WhereCurrent As String
    Public Property CheckCurrentUse As Boolean

    Public Property Cbo30Days As String
    Public Property Where30Days As String
    Public Property CheckUse30 As Boolean

    Public Property Cbo60Days As String
    Public Property Where60Days As String
    Public Property CheckUse60 As Boolean

    Public Property Cbo90Days As String
    Public Property Where90Days As String
    Public Property CheckUse90 As Boolean

    Public Property Cbo120Days As String
    Public Property Where120Days As String
    Public Property CheckUse120 As Boolean

    Public Property Cbo150Days As String
    Public Property Where150Days As String
    Public Property CheckUse150 As Boolean

    Public Property CboTotal As String
    Public Property Wheretotal As String
    Public Property CheckUsetotal As Boolean


    Public Property TickOn As Boolean
    Public Property TickOff As Boolean

End Class


Public Class GetDetailsResponse
    Inherits BaseResponse
    Public Property GetSelectedResponse As DataTable
End Class

Public Class QueryRequest
    Public Property AccountStartDate As String
    Public Property AccountEndDate As String
    Public Property SalesStartDate As String
    Public Property SalesEndDate As String
    Public Property PaymentStartDate As String
    Public Property PaymentEndDate As String
    Public Property NeverPaid As Boolean
    Public Property MoreLessThan As String
    Public Property Amount As String
    Public Property File As String
End Class
Public Class QueryResponse
    Inherits BaseResponse
    Public Property GetQueryDetails As DataTable
End Class

Public Class ReportRequest
    Public Property CboMonth As String
    Public Property CboYear As String
    Public Property CboStatus As String
    Public Property FileName As String
    Public Property Score As String
    Public Property CheckBadDebtStoresonly As Boolean
    Public Property CheckThickFilesOnly As Boolean
    Public Property CheckMaleOnly As Boolean
    Public Property CheckIncludeAllPeriods As Boolean
    Public Property CheckZeroes As Boolean
End Class

Public Class ReportResponse
    Inherits BaseResponse
    Public Property CSV As String
End Class

Public Class GetPeriodResponse
    Inherits BaseResponse
    Public Property Period As Integer

End Class

Public Class GetAgeAnalysisDetailRequest
    Public Property FromAccount As String
    Public Property ToAccount As String
    Public Property Period As String
    Public Property AllAccounts As Boolean
    Public Property PrintDebit As Boolean
    Public Property PrintZero As Boolean

    Public Property PrintCredit As Boolean
    Public Property RageEmployee As Boolean
    Public Property ActiveAccount As Boolean
    Public Property CheckOtherStatus As Boolean
    Public Property OtherStatus As String
    Public Property CheckDoubleLine As Boolean
    Public Property DoubleLine As String
End Class

Public Class GetAgeAnalysisDetailResponse
    Inherits BaseResponse
    Public Property AgeAnalysisDetails As DataTable
    Public Property LongTotalCount As Long
End Class

Public Class GiftCardDetailsRequest
    Public Property CardNumber As String
End Class

Public Class GiftCardDetailsResponse
    Inherits BaseResponse
    Public Property GiftCardDetails As DataTable
    Public Property CardTransactions As DataTable
End Class