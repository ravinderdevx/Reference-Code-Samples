module.controller('ChatHistoryController', function ($scope, $rootScope, $http, ChatHistoryService) {
    $scope.showLoading = true;
    $scope.ChatHistoryData = ChatHistoryService.getChatHistory();
    $scope.ChatHistoryData.then(function (data) {
        debugger;
        $scope.PendingChats = data.PendingMessages;
        $scope.ReceivedChats = data.ReceivedMessages;
        $scope.ChatConversations = data.ChatConversations;
    }, function (error) {

    }).finally(function () {
        $scope.showLoading = false;
    });
});

module.factory("ChatHistoryService", function ($http, $q, API) {
    return {
        getChatHistory: function (patientId) {
            patientId = 'EBC24DD0-80A0-4D7B-8763-BDC2CE1F36AF';
            var url = API + "api/Conversation/GetPatientReceivedMsgAndConversation/" + patientId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, header, config) {
                defer.resolve(data);
            }).error(function (data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }
    }
});