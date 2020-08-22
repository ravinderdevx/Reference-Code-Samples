var BASE_URL = "http://localhost:18194/";

var FPP = angular.module('DemoVideoApp', ['ngSanitize', 'ngDialog', 'toaster']);


Demo.controller('VideoAppController', function ($scope, $rootScope, MainService) {
	
	$scope.showLoading = true;
	$scope.Message = "Please wait...";
	
	$scope.getParameterByName = function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	$scope.VideoToken = $scope.getParameterByName('token'); 

	if(!$scope.VideoToken || $scope.VideoToken == ''){
		$(".container").remove();
		$scope.Message = "You have not authorized to access the Demo Video Room.";
		return false;
	} else {
		MainService.CallAjaxUsingPostRequest(BASE_URL+"AdminAPI/CheckVideoCallToken?token="+ $scope.VideoToken).then(function (data) {
			if (data.Success == true) {
				$("#room-name").val(data.Message);
				$("#button-join").click();
				$scope.Message = null;
			} else {
				$(".container").remove();
				$scope.Message = data.Message;
			}
		}, function (error) {

		}).finally(function () {
			$scope.showLoading = false;
		});
	}
});

Demo.factory("MainService", function ($http, $q, $location) {
    return {
        CallAjaxUsingPostRequest: function (url, dataObject) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: { 'Content-Type': 'application/json' }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        CallAjaxUsingGetRequest: function (url) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        SubmitForm: function (url, formData) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: formData,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                defer.resolve(response.data);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    };
});



