BA.factory("UserService", ["$http", "$q", "$localStorage", "localStorageService", 'API',
                           function($http, $q, $localStorage, localStorageService, API) {
    return {
		SK_registerPost: function(formData) {
            var url = API + "ajax/socialAjax?t=post&a=new&without_html=1";
            var defer = $q.defer();
            $http.post(url, formData, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			})
			.success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SearchMangeCompany: function(value) {
            var url     = "/jobs/manageCompanyData";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param({filter:value}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchJoinCompany: function(value) {
            var url     = "/jobs/myJoinCompany";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param({filter:value}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchManagePages: function(offset, limit, value) {
            var url = API + "user/managePages?offset="+offset+"&limit="+limit+"&filter="+value;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchLikePages: function(offset, limit, value) {
           var url = API + "user/userLikePages?offset="+offset+"&limit="+limit+"&filter="+value;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchJoineGroup: function(offset, limit, value) {
           var url = API + "api/service/usergroups?offset="+offset+"&limit="+limit+"&filter="+value;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchGroupMange: function(offset, limit, value) {
           var url = API + "user/manageGroups?offset="+offset+"&limit="+limit+"&filter="+value;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		getSimilarCompanySuggestion: function(data, offset, limit) {
           var url = API + "api/service/similar-company-pages-suggestion?username="+data+"&offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                data: $.param({companyName:data}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getUserConnectionsList: function(username) {
           var url = API + "api/service/user-connections-in-company";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({username:username}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getLeadersList: function(username) {
           var url = API + "api/service/leaders-in-company";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({username:username}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getAdminsList: function(username, offset, limit) {
           var url = API + "api/service/admins-in-company?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({username:username}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_registerFollow: function(following_id) {
            var url = API + "ajax/socialAjax?t=follow&a=follow&without_html=1";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({following_id:following_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_youtubeSearch: function(query) {
            var url     = API + "ajax/socialAjax?t=youtube_search&q="+query+"&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_soundcloudSearch: function(query) {
            var url     = API + "ajax/socialAjax?t=soundcloud_search&q="+query+"&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_loadPosts: function(timeline_id, after_id, before_id, type, limit) {
            var url     = API + "ajax/socialAjax?t=post&a=filter&timeline_id="+timeline_id+"&after_id="+after_id+"&before_id="+before_id+"&type="+type+"&limit="+limit+"&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        friendbySuggestion: function(offset, limit) {
            var url = API + "api/service/friend-by-suggestion?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		suggestedFriends: function(type, offset, limit) {
            var url = API + "api/suggestedFriends/"+type+"?q="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_deleteFile: function(album_id, post_id) {
            var url     = API + "user/delete_file";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({album_id:album_id,post_id:post_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		groupJoin: function(group_id) {
            var url     = API + "ajax/socialAjax?t=follow&a=follow";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({following_id:group_id, type: 'map'}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		leftFromOwnGroup: function(id) {
            var url = API + "ajax/socialAjax?t=group&a=remove_admin";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({group_id:id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		mentorbySuggestion: function() {
            var url = API + "api/service/mentor-by-suggestion";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        friendbyLocation: function() {
            var url = API + "api/service/friend-by-location";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        friendbySkills: function() {
            var url = API + "api/service/friend-by-skills";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        myGroups: function(offset, limit) {
            var url = API + "api/service/usergroups?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
		myPages: function(offset, limit) {
            var url = API + "user/userLikePages?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		instituteGroups: function(offset) {
            var url = API + "api/service/userinstitutegroups";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		GroupsPageinstitute: function() {
            var url = API + "api/service/GroupsPageinstituteslider";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SimilierGroupsInstitute: function(group_id) {
            var url = API + "api/service/SimilierGroupsInstitute?group_id="+group_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        manageGroups: function(offset, limit) {
            var url = API + "user/manageGroups?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
		manageCompanyData: function(offset, limit) {
            var url = API + "jobs/manageCompanyData?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		myJoinCompany: function(offset, limit, userid) {
            var url = API + "jobs/myJoinCompany?offset="+offset+"&limit="+limit+"&userid="+userid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		UserCompanySussgestData: function(offset, limit) {
            var url = API + "jobs/UserCompanySussgestData?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },		
		managePages: function(offset, limit) {
            var url = API + "user/managePages?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		usergroupsuggestions: function(offset,limit) {
            var url = API + "api/service/usergroupsuggestions?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userPageSuggestions: function(offset,limit) {
            var url = API + "user/userPageSuggestions?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		usergroupfriends: function() {
            var url = API + "user/usergroupfriends";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getInviteeList: function(offset,limit,search,eid) {
            var url = API + "event/getInviteeListForEvent?q="+offset+"&limit="+limit+"&search="+search+"&event_id="+eid
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userfollowers: function(offset) {
            var url = API + "api/service/userfollowers?q="+offset;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		sendEventInvites: function(event_id, ids){
			var url = API + "event/sendInvite";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'event_id':event_id,'ids':ids}),
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		usermentors: function() {
            var url = API + "api/service/usermentors";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        reviewslist: function(pid) {
            var url = API + "shop/reviews/"+pid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
			//alert(data);
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        answerList: function(qaid) {
            var url     =API + "user/reviewsanser/"+qaid;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorQaList: function(qaid) {
            var url     =API + "mentors/mentorQaList/"+qaid;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
	    mentorContentDetails: function(qaid, content_type) {
            var url     =API + "mentors/mentorContentDetails/"+qaid+"/"+content_type;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        mentorQaCommentsList: function(qaid) {
            var url     =API + "user/mentorQaCommentsList/"+qaid;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorQalikesCount: function(qaid) {
            var url     =API + "user/mentorQalikesCount/"+qaid;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorAnswerRequests: function(qaid, o){
			if( o === undefined){o=0;} 
            var url     =API + "user/mentorQaListRequests/"+qaid+"?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorQuestionsForMe: function(qaid, o) {
			if( o === undefined){o=0;} 
            var url     =API + "user/mentorQaListSuggestedQuestions/"+qaid+"?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorArticlesList: function(qaid, o) {
			if( o === undefined){o=0;} 
            var url     =API + "user/mentorArticlesList/"+qaid+"?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{uid: qaid},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getUserMentorList: function() {
            var url     =API + "mentors/mentorsList";
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getUserMentorFeed: function(o) {
			if( o === undefined){o=0;} 
            var url     =API + "mentors/getUserMentorFeeds?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getListQuestionsHasMyAnswers: function(o) {
			if( o === undefined){o=0;} 
            var url     =API + "mentors/getListQuestionsHasMyAnswers?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getUserQaDetailsList: function(o) {
			if( o === undefined){o=0;} 
            var url     =API + "mentors/getUserQaDetailsList?o="+o;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getQuestionMentorList: function(identity) {
            var url     =API + "mentors/getQuestionMentorList/"+identity;
            var defer   =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        deleteDocument: function(identity) {
            var url     =API + "mentors/deleteDocument/";
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{did: identity},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        mentorGetSingleArticle: function(identity) {
            var url     =API + "mentors/getArticle/"+identity;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{did: identity},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getNewsNotification: function(identity) {
            var url     =API + "user/getNewsnotifications";
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{did: identity},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
        getUserAppointments: function(identity) {
            var url     =API + "user/getUserAppointments";
            var defer   =$q.defer();
            $http({
                method: 'POST',
                data:{did: identity},
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		UserCompanyData: function(offset, limit) {
            var url     =API + "api/service/suggested-company-pages?offset="+offset+"&limit="+limit;
            var defer   =$q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getJobSearchResults: function(identity) {
            var url   =API + "jobs/search/"+identity;
            var defer =$q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeUserComment: function(identity) {
            var url = API + "mentors/QaOperations";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data:{comment: identity, operation:'removeComment'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		timelineFriends: function(uid) {
            var url     = API + "user/userTimelineFriendsData/"+uid;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userDirectory: function(filter, offset) {
            var url     = API + "user/getUserDirectory/"+"?filter="+encodeURIComponent(filter)+"&offset="+offset;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		CreateNewGroup: function(data) {
            var url     = API + "ajax/socialAjax?t=group&a=createnew";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		CreateNewPage: function(data) {
            var url     = API + "ajax/socialAjax?t=page&a=createnew";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		mathgroupname: function(data) {
            var url     = API + "ajax/socialAjax?t=username&a=check"+"&q="+data
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		importedFriendsList: function(section_id, section, offset, limit, source) {
			source  = (source === undefined)?'':source;
            var url     = API + "invite/importedFriendsList/"+section_id+"/"+section+"/"+offset+"/"+limit+"?source="+source;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getGroupOrPageDetails: function(id, type, encrypted) {
            var url     = API + "user/getGroupOrPageDetails/"+id+"/"+type+"/"+encrypted;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getEventDetails: function(id) {
            var url     = API + "user/getEventDetails/"+id;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        removeFriendsListImport: function(importee) {
            var url     = API + "invite/removeFriendsListImport/"+importee.id;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		send_invites: function(data){
			var url     = API + "invite/send_invites/";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getPageCategories:function(){
			var url     = API + "pages/get_page_categories/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		}, 
		inviteFriend: function(data){
			var url     = API + "invite/insertCustomInvites"
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		CheckPageName: function(data) {
            var url     = API + "ajax/socialAjax?t=username&a=check"+"&q="+data
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getCompanyInfo: function(username) {
            var url     = API + "company/getCompanyInfo/"+username;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		saveCompanyInfo: function(insitute_id, data) {
            var url     = API + "company/saveCompanyInfo/"+insitute_id;
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getOnlyCompanyInfo: function(username) {
            var url     = API + "company/getOnlyCompanyInfo/"+username;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		companyJobsList: function(username, offset, limit) {
            var url     = API + "company/getCompanyJobsList/"+username+"/"+offset+"/"+limit;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getCompanyFollowersList: function(username, offset, limit){
			var url = API + "company/getCompanyFollowersList/"+username+"?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		removeCompanyFollower: function(timeline_id, user_id){
			var url = API + "company/remove_follower";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'timeline_id':timeline_id,'user_id':user_id}),
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		SK_getStory: function(story_id) {
            var url     = API + "user/getStory/"+story_id;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_getStories: function(id, section, timeline, type) {
            var url     = API + "user/getStories/"+id+"/"+section+"/"+timeline+"/"+type;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_getStoryPublisherBox: function(id, section, timeline, type) {
            var url     = API + "user/getStoryPublisherBox/"+id+"/"+section+"/"+timeline+"/"+type;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getApplyJobData: function(jobid, json) {
            var url     = API + "jobs/applyModel/"+jobid+"/"+json;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_registerPostLike: function(id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+id+"&a=like&without_html=1"
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_registerPostShare: function(id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+id+"&a=share&without_html=1"
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_shareSharedStory: function(id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+id+"&a=share-shared-story"
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_loadPreviousComments: function(post_id, after_comment_id, before_comment_id, limit) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+post_id+"&a=load_previous_comments&after_comment_id="+after_comment_id+"&before_comment_id="+before_comment_id+"&limit="+limit;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_deletePost: function(id, param) {
            var url     = API + "ajax/socialAjax?t=post&a=delete&post_id="+id+"&images="+param;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_reportPost: function(post_id) {
            var url     = API + "ajax/socialAjax?t=post&a=report&post_id="+post_id;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_registerComment: function(post_id, data) {
            var url     = API + "ajax/socialAjax?t=post&a=comment&post_id="+post_id+"&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_openLightbox: function(post_id, album_type) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+post_id+"&a=lightbox&album_type="+album_type+"&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getStoryShares: function(post_id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+post_id+"&a=share_window&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getStoryLikes: function(post_id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+post_id+"&a=like_window&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		CommentLikeUnlike: function(id) {
            var url = API +  "ajax/socialAjax?t=post&post_id="+id+"&a=like&without_html=1";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_getMessageRecipients: function(id, section) {
            var url     = API + "user/getMessageRecipients/"+id+"/"+section;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		CheckUpdatesOfCompany: function(id) {
            var url =	API + "ajax/socialAjax?t=post&a=filter&before_id="+id+"&without_html=1";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },

		friendReqest: function() {
            var url = API + "user/userPendingRequests";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		mentorrequest: function() {
            var url = API + "user/userPendingMentorRequests";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		friendReqestsent: function() {
            var url = API + "user/userSendRequests";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		companyEdit: function(data) {
            var url =	API + "company/companyEdit";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getEditDetailJob: function(jobId,userid) {
            var url =	API + "jobs/edit/"+jobId+"/"+userid+'/"1"';
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		updateUserDetail: function(data, type) {
            var url     = API + "ajax/socialAjax?t=user&a="+type;
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeUserQualification: function(data) {
            var url     = API + "ajax/socialAjax?t=user&a=removeinfo&q="+data['q']+"&r=school";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeUserWorkInfo: function(data) {
            var url     = API + "ajax/socialAjax?t=user&a=removeinfo&q="+data['q']+"&r=work";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		SK_registerStoryFollow: function(id) {
            var url     = API + "ajax/socialAjax?t=post&post_id="+id+"&a=follow&without_html=1";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param({following_id:id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		anniversaryList: function(offset, limit) {
            var url = API + "user/anniversaryList?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userEventListing: function(filter, offset) {
            var url = API + "user/userEventsList"+"?filter="+encodeURIComponent(filter)+"&offset="+offset;;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getEventCategories: function(filter, offset) {
            var url = API + "event/eventCategories";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		eventsDetails: function(id) {
            var url = API + "event/eventDetails/"+id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getEventActivites: function(id) {
            var url = API + "event/getEventActivites/"+id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userActivityOnEvent: function(event_id, activity_type) {
            var url = API + "event/userActivity?event_id="+event_id+"&activity_type="+activity_type;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userParticipationOnActivity: function(event_id, activity_id, activity_type) {
            var url = API + "event/userParticipationOnActivity?event_id="+event_id+"&activity_id="+activity_id+"&activity_type="+activity_type;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getSingleActivity: function(event_id, activity_id) {
            var url = API + "event/getSingleActivity/"+event_id+'/'+activity_id;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		deleteEventActivity: function(activity_id) {
            var url = API + "event/deleteEventActivity/"+activity_id;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getSingleSponsor: function(event_id, sponser_id) {
            var url = API + "event/getSingleSponsorData/"+event_id+"/"+sponser_id;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		deleteEventSponsor: function(sponsor_id) {
            var url = API + "event/deleteEventSponsor/"+sponsor_id;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		submitForm: function(url, formData){
			var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: formData,
				headers: {'Content-Type': undefined}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getEventPeopleList: function(event_id, activity_id, people_type, offset, limit){
			var url = API + "event/getEventPeopleList?offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'event_id':event_id,'activity_id':activity_id,'type':people_type}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		removeEventInvitation: function(user_id, event_id){
			var url = API + "event/removeInvite";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'event_id':event_id,'user_id':user_id}),
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		removeParticipant: function(user_id, event_id, act_id){
			var url = API + "event/removeParticipant";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'event_id':event_id,'act_id':act_id,'user_id':user_id}),
				headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getParticipanList: function(offset,limit,id,event_id){
			var url = API + "event/getParticipanList?offset="+offset+"&limit="+limit+"&id="+id+"&event_id="+event_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getGroupPeopleListing: function(group_id, type, search, offset, limit){
			var url = API + "groups/getPeopleList/"+group_id+"?q="+search+"&offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'type':type}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getGroupSettingDetail: function(group_id){
			var url = API + "groups/getGroupSettingDetail/"+group_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				data:$.param({}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getGroupDetail: function(group_id){
			var url = API + "groups/getGroupDetail/"+group_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				data:$.param({}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getPagePeopleListing: function(page_id, type, search, offset, limit){
			var url = API + "pages/getPeopleList/"+page_id+"?q="+search+"&offset="+offset+"&limit="+limit;
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data:$.param({'type':type}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getPageSettingDetail: function(page_id){
			var url = API + "pages/getPageSettingDetail/"+page_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				data:$.param({}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getPageDetail: function(page_id){
			var url = API + "pages/getPageDetail/"+page_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				data:$.param({}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		callAjaxMethod: function(url, dataObject) {
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(dataObject),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		callAjaxGetMethod: function(url, dataObject) {
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: dataObject
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		callJsonMethod: function(url, dataObject) {
			console.log(dataObject);
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: dataObject,
                headers: {'Content-Type': 'application/json'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		getLeadersIds: function(username) {
            var url = API + "company/getLeadersIds/"+username;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getAdminsIds: function(username) {
            var url = API + "company/getAdminsIds/"+username;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeLeader: function(company_id, user_id) {
            var url = API + "company/remove_leader/"+company_id+"/"+user_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeComapnyAdmin: function(company_id, user_id) {
            var url = API + "company/remove_admin/"+company_id+"/"+user_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getEventTickets: function(event_id) {
            var url = API + "event/eventTickets/"+event_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
    };
}]);

BA.factory("LifeSkills", ["$http", "$q", "$localStorage", "localStorageService", 'API',
                           function($http, $q, $localStorage, localStorageService, API) {
    return {
        list: function(identityId) {
            var url = API + "life_skills_api/getUserProfificency/"+identityId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        delete: function(id) {
            var url = API + "life_skills_api/deleteUserProfificency/"+id;
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        listBusiness: function(identityId) {
            var url = API + "life_skills_api/getUserProfificency/"+identityId;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        userCareerGoals: function() {
            var url = API + "life_skills_api/getUserCareerGoals/";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        swotAnalysis: function() {
            var url = API + "life_skills_api/getUserSwot";
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        userProfileData: function(public_user_id, indentiyId) {
            var url = API + "life_skills_api/getPublicUserProfileLifeSkillData/"+indentiyId+"/"+public_user_id;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getMentorsDirectory: function(filter,offset) {
            var url     = API + "mentors/getMentorsDirectory/"+"?filter="+encodeURIComponent(filter)+"&offset="+offset;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
		getMoreMentors: function(type,offset) {
            var url     = API + "mentors/getMoreMentors/"+type+"?offset="+offset;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        addMentor: function(indentiyId) {
            var url     = API + "ajax/socialAjax?t=follow&a=mentor";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({following_id:indentiyId.user_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SK_registerMentor: function(user_id) {
            var url     = API + "ajax/socialAjax?t=follow&a=mentor";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param({following_id:user_id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getUserClasses: function(indentiyId, a, c) {
            var url     = "/admin/news/getUserClasses/"+indentiyId+"/"+a+"/"+c;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getArticleInfo: function(indentiyId) {
            var url     = "/admin/news/getArticleInfo/"+indentiyId;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getNewsInfo: function(indentiyId) {
            var url     = "/admin/news/getNewsInfo/"+indentiyId;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		getWhatsNewInfo: function() {
            var url     = "/news/getWhatsNewInfo/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		SearchWhatsNewInfo: function(value) {
            var url     = "/news/SearchWhatsNewInfo";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
				data: $.param({filter:value}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		getWhatsNewInfoSingle: function(indentiyId) {
            var url     = "/news/getWhatsNewInfoSingle/"+indentiyId;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        userGetWhatsNew: function(indentiyId) {
            var url     = "/user/getWhatsNewInfo";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		getUserMentorsDirectory: function(indentiyId) {
            var url     = API + "user/getUserMentorsDirectory/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getMentorsDirectoryList: function(offset,limit,userid) {
            var url     = API + "user/getMentorsDirectoryList?offset="+offset+"&limit="+limit+"&userid="+userid;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getUserMenteesDirectory: function(indentiyId) {
            var url     = API + "user/getUserMenteesDirectory/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getUserFriendsDirectory: function(indentiyId) {
            var url     = API + "user/getUserFriendsDirectory/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getUserConnectionsData: function(uid) {
            var url     = API + "user/getUserConnectionsData/"+uid;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getJobsDirectory: function( identity, o, type, filter, offset) {
            if ( !offset ) {
                offset = 0;
            }
            var url     = API + "jobs/advanceSearch/"+identity+"?q="+o+"&type="+type+"&offset="+offset;
            var defer   = $q.defer();
            $http({
                method: 'post',
                url: url,
				data:{'filter':filter},
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getAllJobIndustries: function( identity, o ) {
            var url     = API + "jobs/getAllJobIndustries/"+identity+"?q="+o;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getAllJobSkills: function( identity, o ) {
            var url     = API + "jobs/getAllJobSkills/"+identity+"?q="+o;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getAllJobCompanies: function( identity, o ) {
            var url     = API + "jobs/getAllJobCompanies/"+identity+"?q="+o;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getAllJobLocations: function( identity, o ) {
            var url     = API + "jobs/getAllJobLocations/"+identity+"?q="+o;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getSearchingJobsDirectory: function(job_type,type,skills,location,industry,companies,min_exp,max_exp,min_ctc,max_ctc,offset,jof) {
            var url     = API + "jobs/advanceSearchingOneMoreTime/";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: {'job_type':job_type,'type':type,'skills':skills,'location':location,'industry':industry,'companies':companies,'min_exp':min_exp, 'max_exp':max_exp, 'min_ctc':min_ctc, 'max_ctc':max_ctc,'offset':offset,'jof':jof},
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
        getUserTimelineJobs: function( identity,o ) {
			if( o === undefined){o=0;} 
            var url     = API + "jobs/userTimelineJobs?q="+o;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
		getUserTimelineJobsNew: function(offset,limit) {
            var url     = API + "jobs/userTimelineJobsNew?offset="+offset+"&limit="+limit;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        applyOnJob: function(d, t) {
            var url     = API + "jobs/applyModel/"+d.id;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        AccountSettingPage: function() {
            var url     = API + "user/accountsetting";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeArticleComment: function(identity) {
            var url = API + "admin/news/removeArticleComment";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data:{comment: identity, operation:'removeComment'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeMentee: function(identity) {
            var url = API + "user/removeMentee";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data:{userData: identity}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeMentor: function(identity) {
            var url = API + "user/removeMentor";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data:{userData: identity}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		removeFriend: function(identity) {
            var url = API + "user/removeFriend";
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data:{userData: identity}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getAlumnisData: function() {
            var url     = API + "api/getallalumnisdata/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getCountConnectedAlumni: function() {
            var url     = API + "api/getCountConnectedAlumni/";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        }, 
		getReferralList:function(jobid) {
			var url		= API + "jobs/requestReferralModel/"+jobid;
			var defer	= $q.defer();
			$http({
				method:	'GET',
				url:url 
			}).success(function(data, status, header, config){
				defer.resolve(data);
			}).error(function(data, status, header, config){
				defer.reject(status);
			});
			return defer.promise;
		},
		getRecommendList:function(jobid) {
			var url		= API + "jobs/recommendModel/"+jobid+"/1";
			var defer	= $q.defer();
			$http({
				method:	'GET',
				url:url 
			}).success(function(data, status, header, config){
				defer.resolve(data);
			}).error(function(data, status, header, config){
				defer.reject(status);
			});
			return defer.promise;
		},
		jobDeatils: function(jobid) {
            var url = API + "jobs/singleJobDetails/"+jobid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userEducationData: function(uid) {
            var url = API + "user/getSchoolDetails/"+uid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userProfessionalData: function(uid) {
            var url = API + "user/getWorkDetails/"+uid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		userPhotosData: function(uid) {
            var url = API + "user/getUserPhotos/"+uid;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		checkUserMentorshipAreas: function(){
			var url     = API + "life_skills_api/checkUserMentorshipAreas";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		saveUserMentorshipAreas: function(data) {
            var url     = API + "ajax/socialAjax?t=user&a=update_info_new";
            var defer   = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getUserMentorshipAreas:function(){
			var url     = API + "mentors/userMentorshipAreas";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url,
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
		},
		getJobFair: function(filter,offset) {
            var url = API + "jobfair/getJobFairData/"+"?filter="+encodeURIComponent(filter)+"&offset="+offset;
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
				//data: {filter: filter, offset: offset},
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
		getCampusNewsDetail: function(indentiyId) {
            var url     = "/campus/getCampusNewsDetail/"+indentiyId;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		userCampusNews: function() {
            var url     = "/campus/getUserCampusNews";
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
		campusNewsListing: function(offset, limit) {
            var url     = "/campus/getCampusNewsListing?offset="+offset+"&limit="+limit;
            var defer   = $q.defer();
            $http({
                method: 'GET',
                url: url
            }).success(function(data, status, header, config) {
                defer.resolve(data);
            }).error(function(data, status, header, config) {
                defer.reject(status);
            });
            return defer.promise; 
        },
    };  
}]);
