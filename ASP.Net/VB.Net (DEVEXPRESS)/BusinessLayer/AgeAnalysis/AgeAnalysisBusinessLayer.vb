Imports Entities
Imports pcm.DataLayer
Public Class AgeAnalysisBusinessLayer
    Private _dlAgeAnalysis As New AgeAnalysisDataLayer

    Public Function GetDetails(_getDetailsRequest As GetDetailsRequest) As GetDetailsResponse
        Dim _getDetailsResponse As GetDetailsResponse
        _getDetailsResponse = _dlAgeAnalysis.GetDetails(_getDetailsRequest)
        Return _getDetailsResponse
    End Function
    Public Function GetQuery(_queryRequest As QueryRequest) As QueryResponse
        Dim _queryResponse As QueryResponse
        _queryResponse = _dlAgeAnalysis.GetQuery(_queryRequest)
        Return _queryResponse
    End Function

    Public Function GetReport(_reportRequest As ReportRequest) As ReportResponse
        Dim _reportResponse As ReportResponse
        _reportResponse = _dlAgeAnalysis.GetReport(_reportRequest)
        Return _reportResponse
    End Function

    Public Function GetPeriods() As GetPeriodResponse
        Dim _periodResponse As GetPeriodResponse
        _periodResponse = _dlAgeAnalysis.GetReport()
        Return _periodResponse
    End Function


    Public Function GetAgeAnalysisDetails(_getAgeAnalysisDetailRequest As GetAgeAnalysisDetailRequest) As GetAgeAnalysisDetailResponse
        Dim _ageAnalysisDetailResponse As GetAgeAnalysisDetailResponse
        _ageAnalysisDetailResponse = _dlAgeAnalysis.GetAgeAnalysisDetails(_getAgeAnalysisDetailRequest)
        Return _ageAnalysisDetailResponse
    End Function

    Public Function GetCardDetails(_giftCardDetailsRequest As GiftCardDetailsRequest) As GiftCardDetailsResponse
        Dim _giftCardDetailsResponse As GiftCardDetailsResponse
        _giftCardDetailsResponse = _dlAgeAnalysis.GetCardDetails(_giftCardDetailsRequest)
        Return _giftCardDetailsResponse
    End Function

End Class