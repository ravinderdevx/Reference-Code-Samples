var BA = angular.module('almabay',['ngStorage', 'LocalStorageModule', 'toastr', 'ngSanitize', 'ngDialog', 'ngRoute', 'ngCookies', 'ui.bootstrap'])
.constant("API", "/");

BA.config(function($routeProvider) {
	$routeProvider
	.when("/", {
        templateUrl : "/user/accountSettingsView/basic-details",
		controller: 'basicDetailsController'
    })
    .when("/basic-details", {
        templateUrl : "/user/accountSettingsView/basic-details",
		controller: 'basicDetailsController'
    })
	.when("/contact-details", {
        templateUrl : "/user/accountSettingsView/contact-details",
		controller: 'contactDetailsController'
    })
	.when("/work-details", {
        templateUrl : "/user/accountSettingsView/work-details",
		controller: 'workDetailsController'
    })
	.when("/education-details", {
        templateUrl : "/user/accountSettingsView/education-details",
		controller: 'educationDetailsController'
    })
	.when("/account-notifications", {
		templateUrl : "/user/accountSettingsView/account-notifications",
		controller: 'notificationController'
    })
	.when("/technical-skills", {
		templateUrl : "/user/accountSettingsView/technical-skills",
		controller: 'LifeSkillsTechnicalController'
    })
	.when("/business-skills", {
		templateUrl : "/user/accountSettingsView/business-skills",
		controller: 'LifeSkillsBusinessController'
    })
	.when("/interpersonal-skills", {
		templateUrl : "/user/accountSettingsView/interpersonal-skills",
		controller: 'LifeSkillsInterPersonalController'
    })
	.when("/career-goals", {
		templateUrl : "/user/accountSettingsView/career-goals",
		controller: 'CareerGoalsController'
    })
	.when("/privacy-settings", {
		templateUrl : "/user/accountSettingsView/privacy-settings",
		controller: 'privacySettingsController'
    })
	.when("/change-invite-code", {
		templateUrl : "/user/accountSettingsView/change-invite-code",
		controller: 'userInviteCodeController'
    })
	.when("/change-password", {
		templateUrl : "/user/accountSettingsView/change-password",
		controller: 'passwordChangeController'
    })
	.when("/swot-analysis", {
		templateUrl : "/user/accountSettingsView/swot-analysis",
		controller: 'swotanalysisrcontroller'
    })
	.when("/company-overview", {
		templateUrl : "/user/companyView/about",
    })
	.when("/company-jobs", {
		templateUrl : "/user/companyView/jobs",
		controller	: "companyJobsController"
    })
	.when("/company-recent-updates", {
		templateUrl : "/user/companyView/recent-updates",
		controller	: "recentUpdatesController"
    })
	.when("/company-recent-updates/:type", {
		templateUrl : "/user/companyView/recent-updates",
		controller	: "recentUpdatesController"
    })
	.when("/company-job-post", {
		templateUrl : "/user/companyView/add-job",
		controller	: "companyAddJobController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/company-job-post/:id/:userid", {
		templateUrl : "/user/companyView/add-job",
		controller	: "companyAddJobController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url		= $location.absUrl();
				check_url	= url.split("/");
				user_id		= check_url[check_url.length-1];
				if(user_id == 1){
					$location.path('/company-jobs');
				}
				
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-jobs');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/add-company-leaders", {
		templateUrl : "/user/companyView/add-leaders",
		controller	: "addCompanyLeadersController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/add-company-admins", {
		templateUrl : "/user/companyView/add-admins",
		controller	: "addCompanyAdminsController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/manage-company-admins", {
		templateUrl : "/user/companyView/admin-list",
		controller	: "companyAdminListingController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/company-admin-panel", {
		controller	: "companyEditController",
		templateUrl : "/user/companyView/company-admin-panel",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/company-followers", {
		controller	: "companyFollowersController",
		templateUrl : "/user/companyView/company-follower-list",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfAdmin(username).then(function(data) {
					if(data.admin != 'admin'){
						$location.path('/company-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-overview", {
		templateUrl : "/event/view/event-overview",
    })
	.when("/edit-event", {
		templateUrl : "/event/view/edit-event",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-activity", {
		templateUrl : "/event/view/add-event-activity",
		controller	: "eventActivityController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-activity/:id", {
		templateUrl : "/event/view/edit-event-activity",
		controller	: "eventActivityController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-sponsor", {
		templateUrl : "/event/view/event-sponsor",
		controller	: "eventSponsorController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-sponsor/:id", {
		templateUrl : "/event/view/event-sponsor",
		controller	: "eventSponsorController",
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/event-tickets", {
		templateUrl : "/event/view/event-tickets",
		controller	: "eventTicketsController"
    })
	.when("/interested-people", {
		templateUrl : "/event/view/event-people-list",
		controller	: "eventPeopleListController",
		params:  'interested',
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/going-people", {
		templateUrl : "/event/view/event-people-list",
		controller	: "eventPeopleListController",
		params:  'going',
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/invited-people", {
		templateUrl : "/event/view/event-people-list",
		controller	: "eventPeopleListController",
		params:  'invited',
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/participants-people/:id", {
		templateUrl : "/event/view/event-people-list",
		controller	: "eventPeopleListController",
		params:  'participants',
		resolve:{
			"checkIfAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var username   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var username   = url[url.length-1];
				}
				mediaService.checkIfEventAdmin(username).then(function(data) {
					if(!data.admin){
						$location.path('/event-overview');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/group-discussion", {
		templateUrl : "/groups/groupView/discussion"
    })
	.when("/group-discussion/:type", {
		templateUrl : "/groups/groupView/discussion"
    })
	.when("/group-members", {
		templateUrl : "/groups/groupView/members",
		controller:"groupPeoplesController",
		params:  'members'
    })
	.when("/group-admins", {
		templateUrl : "/groups/groupView/members",
		controller:"groupPeoplesController",
		params:  'admins',
		resolve:{
			"checkIfGroupAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var group_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var group_id   = url[url.length-1];
				}
				mediaService.checkIfGroupAdmin(group_id).then(function(data) {
					if(!data.admin){
						$location.path('/group-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/group-requests", {
		templateUrl : "/groups/groupView/members",
		controller:"groupPeoplesController",
		params:  'requests',
		resolve:{
			"checkIfGroupAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var group_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var group_id   = url[url.length-1];
				}
				mediaService.checkIfGroupAdmin(group_id).then(function(data) {
					if(!data.admin){
						$location.path('/group-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/add-group-members", {
		templateUrl : "/groups/groupView/members",
		controller:"groupPeoplesController",
		params:  'add_members',
		resolve:{
			"checkUserCanAddMembers":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var group_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var group_id   = url[url.length-1];
				}
				mediaService.checkAddPermissionInGroup(group_id).then(function(data) {
					if(!data.autorized){
						$location.path('/group-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/group-settings", {
		templateUrl : "/groups/groupView/settings",
		resolve:{
			"checkIfGroupAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var group_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var group_id   = url[url.length-1];
				}
				mediaService.checkIfGroupAdmin(group_id).then(function(data) {
					if(!data.admin){
						$location.path('/group-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/page-discussion", {
		templateUrl : "/pages/pageView/discussion"
    })
	.when("/page-discussion/:type", {
		templateUrl : "/pages/pageView/discussion"
    })
	.when("/page-likes", {
		templateUrl : "/pages/pageView/members",
		controller:"pagePeoplesController",
		params:  'members'
    })
	.when("/page-admins", {
		templateUrl : "/pages/pageView/members",
		controller:"pagePeoplesController",
		params:  'admins',
		resolve:{
			"checkIfPageAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var page_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var page_id   = url[url.length-1];
				}
				mediaService.checkIfPageAdmin(page_id).then(function(data) {
					if(!data.admin || data.role != 'admin'){
						$location.path('/page-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/page-messages", {
		templateUrl : "/pages/pageView/messages",
		controller:"messagesController",
		resolve:{
			"checkIfPageAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var page_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var page_id   = url[url.length-1];
				}
				mediaService.checkIfPageAdmin(page_id).then(function(data) {
					if(!data.admin){
						$location.path('/page-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/add-page-members", {
		templateUrl : "/pages/pageView/members",
		controller:"pagePeoplesController",
		params:  'add_admins',
		resolve:{
			"checkIfPageAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var page_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var page_id   = url[url.length-1];
				}
				mediaService.checkIfPageAdmin(page_id).then(function(data) {
					if(!data.admin || data.role != 'admin'){
						$location.path('/page-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.when("/page-settings", {
		templateUrl : "/pages/pageView/settings",
		resolve:{
			"checkIfPageAdmin":function(mediaService, $location){ 
				var url = $location.absUrl();
		
				if(url.indexOf('#') === -1){
					url = url.split("/");
					var page_id   = url[url.length-1];
				} else {
					url = url.split("#");
					url = url[0].split("/");
					var page_id   = url[url.length-1];
				}
				mediaService.checkIfPageAdmin(page_id).then(function(data) {
					if(!data.admin){
						$location.path('/page-discussion');
					}
				}, function(error){
							
				}).finally(function(){
					
				});
			}
		}
    })
	.otherwise({
		redirectTo	: function() {
			var pathArray = window.location.pathname.split( '/' );
			var base_url  = window.location.origin;
			if(pathArray[1]=='company'){
				window.location = base_url;
			} else if(pathArray[1]=='user' && pathArray[2]=='events'){
				window.location = base_url+'/user/events';
			} else {
				window.location = base_url+'/user/account';
			}	
        }
	});
});	

BA.directive('storyAlbum', ['mediaService', function (service) {
    return {
		template:
		'<div class="photos-wrapper grid" id="pic-wrapper" apply-collage>'+
			'<div class="grid-sizer"></div>'+
			'<div class="collage-wrapper">'+
				'<div class="Collage">'+
					'<img ng-src="{{photo.path}}" width="500px" post-id="{{photo.post_id}}" onclick="javascript:SK_openLightbox(this.getAttribute(\'post-id\'), \'album\');"  alt="Photo" ng-repeat="photo in story.media"/>'+
				'</div>'+
				'<span class="count" post-id="{{story.media[0].post_id}}" onclick="javascript:SK_openLightbox(this.getAttribute(\'post-id\'), \'album\');" ng-if="count>6">+{{count-6}}</span>'+
			'</div>'+
		'</div>',
        restrict: 'E',
		replace:true,
        scope: {
            media: "=media",
        },
        link: function($scope, element, $attrs, form) {
            service.SK_getAlbumImages($scope.media).then(function (result) {
				$scope.story		= result.data;
				$scope.count		= result.media_num;
			}, function(error){
						
			}).finally(function(){
				
			});
        }
    };
}]);

/*BA.directive('commentPublisherBox', ['mediaService', function (service) {
    return {
        template:
            '<a href="{{story.comments.publisher_box.input.timeline.url}}" target="_blank" class="user-pic">'+
				'<img class="avatar" mediaobject="{{story.comments.publisher_box.input.timeline.mediaObject}}" width="32px" height="32px" w="64" s="s" gender="{{story.comments.publisher_box.input.timeline.gender}}" data-userid="{{story.comments.publisher_box.input.timeline.id}}" data-type="{{story.comments.publisher_box.input.timeline.type}}" ng-class="(story.comments.publisher_box.input.timeline.id != loggedInUser)?\'allow-user-tultip\':\'\'" media-server-image-offline/>'+
			'</a>'+
			'<div class="comment-box">'+
				'<form class="comment-textarea" method="post" enctype="multipart/form-data">'+
					'<textarea id="comment-area-{{story.comments.publisher_box.input.post.id}}" class="form-control auto-grow-input" name="text" placeholder="Write a comment... Press enter to post" data-placeholder="Write a comment... Press enter to post" data-height="24" ng-keyup="$event.keyCode == 13 && SK_registerComment(story.comments.publisher_box.input.post.id, story.comments.publisher_box.input.timeline.user_id, key)">Write a comment... Press enter to post</textarea>'+
				'</form>'+
			'</div>',
        restrict: 'E',
        scope: {
            type: "=type",
            id: "=id",
            storyid: "=storyid",
        },
        link: function($scope, $element, $attrs, form) {
            service.SK_getCommentPublisherBox($scope.storyid, $scope.id, $scope.type).then(function (result) {
				$scope.story = '';
			}, function(error){
						
			}).finally(function(){
				
			});
        }
    };
}]);*/

BA.directive('applyGooglePlaces', function() {
	return function(scope, element, attrs) {
		var autocomplete;
		autocomplete = new google.maps.places.Autocomplete(
			document.getElementById(attrs.id),
			{ types: ['geocode'] }
		);
	};
});


BA.directive('customClick', function() {
    return {
        link: function(scope, element, attrs) {
			element.click(function(){
				setTimeout(function(){
					$('.stories-wrapper .story').each(function(){
						var divHeight = $(this).find('.story-text').css('max-height','').height();
						var lineHeight = 23;
						var lines = Math.ceil(divHeight / lineHeight);
						if(lines>5){
							$(this).find('.story-text').css('max-height',divHeight)
							var story_text = $(this).find('.text-wrapper')
							story_text.find('.more-story-text').removeClass('hide');
							story_text.find('.dots-story-text').removeClass('hide');
							story_text.find('.story-text').addClass('show-less-text');
						}
						var comments_container = $(this).find('.comments-wrapper');
						comments_container.children('.comment-wrapper').each(function(){
							commentDivHeight = $(this).find('.comment-text').css('max-height','').height();
							var lineHeight = 20;
							var lines = Math.ceil(commentDivHeight / lineHeight);
							if(lines>3){
								$(this).find('.comment-text').css('max-height',commentDivHeight)
								$(this).find('.more-story-text').removeClass('hide');
								$(this).find('.dots-story-text').removeClass('hide');
								$(this).find('.comment-text').addClass('show-less-text');
							}
						});
					});
					element.unbind('click');
				}, 500);
			}); 
        }
    }
});

BA.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter, {'event': event});
				});
				event.preventDefault();
			}
		});
	};
});

BA.directive('applySelectpicker', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).selectpicker();
		},100);
	};
});

BA.directive('applyMultiselect', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).multiSelect({
				selectableHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='Search...'>",
				selectionHeader: "<input type='text' class='search-input' autocomplete='off' placeholder='Search...'>",
				afterInit: function(ms){
					var that = this,
						$selectableSearch = that.$selectableUl.prev(),
						$selectionSearch = that.$selectionUl.prev(),
						selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
						selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

					that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
					.on('keydown', function(e){
					  if (e.which === 40){
						that.$selectableUl.focus();
						return false;
					  }
					});

					that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
					.on('keydown', function(e){
					  if (e.which == 40){
						that.$selectionUl.focus();
						return false;
					  }
					});
			  },
			  afterSelect: function(){
				this.qs1.cache();
				this.qs2.cache();
			  },
			  afterDeselect: function(){
				this.qs1.cache();
				this.qs2.cache();
			  }
			});
		},100);
	};
});

BA.directive('applyBootstrapTultip', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).tooltip({placement: "bottom", html: true});
		},100);
	};
});
BA.directive('applyTultip', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).tooltip();
		},100);
	};
});

BA.directive('applyFancybox', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).fancybox({loop: false});
		},500);
	};
});

BA.directive('applyCollage', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).masonry({
				itemSelector: '.grid-item',
				percentPosition: true,
				columnWidth: '.grid-sizer'
			});
			$(element).find('.Collage').collagePlus({'targetHeight' : 160});
		},3000);
	};
});

BA.directive('applyGrid', function() {
	return function(scope, element, attrs) {
		setTimeout(function(){
			$(element).masonry({
			  itemSelector: '.grid-item',
			  percentPosition: true,
			  columnWidth: '.grid-sizer'
			});
		},500);
	};
});

BA.directive('applyCarousel', function() {
	return function(scope, element, attrs) {
		if($(window).width()>=991){
			setTimeout(function(){
				$(element).owlCarousel({
					items:1,
					loop:false,
					slideSpeed : 500,
					slideBy: 1,
					nav:true,
					navText:['',''],
					dots:false,
					responsive:{
						900:{
							items:1,
							slideSpeed : 500,
							nav:true,
							navText:['',''],
							dots:false,
						},
						600:{
							items:4,
							slideSpeed : 500,
							nav:true,
							navText:['',''],
							dots:false,
						}
					}
				}).removeClass('visibility');
			},1000);
		}
	};
});

BA.directive('ngScroll', function($window) {
    return {
        link : function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);
            var doc = jQuery(document);
			var scrollAllowed = true;
            angular.element(document).bind('scroll', function() {
				if ((doc.scrollTop() + offset >= doc.innerHeight() - $window.innerHeight - offset) && scrollAllowed) {
					scope.$apply(attrs.ngScroll);
					//scrollAllowed = false;
					setTimeout(function(){
						scrollAllowed = true;
					}, 1500);
				} 
            });
        }
    };
});

BA.directive('popupNgScroll', function($window) {
    return {
        link : function(scope, element, attrs) {
            var offset	= parseInt(attrs.threshold) || 0;
            var doc 	= jQuery(attrs.scrollElement);
			var scrollAllowed = true;
            angular.element(attrs.scrollElement).bind('scroll', function() {
				if ((doc.prop('scrollHeight')-(doc.scrollTop()+doc.innerHeight()) <= offset) && scrollAllowed) {
					scope.$apply(attrs.popupNgScroll);
					//scrollAllowed = false;
					setTimeout(function(){
						scrollAllowed = true;
					}, 1500);
				} 
            });
        }
    };
});
BA.directive('niceScrollManager', function() {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            setTimeout(function () {
                $(element).mCustomScrollbar(scope.$eval(attrs.niceScrollManager));
            }, 1000);
        }
    };
});

BA.directive("scrolling", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 100) {
                 scope.loadmore();
             } else {
                 console.log('Header is in view.');
             }
            scope.$apply();
        });
    };
});

BA.directive('wysihtmlEditor', function($window) {
    return {
		restrict: 'AE',
        link: function postLink(scope, element, attrs) {
            setTimeout(function () {
                $(element).wysihtml5({
									autoLink:             true,
									parserRules:          { tags: { br: {}, span: {}, div: {}, p: {}, b:{}, ul:{}, ol:{}, h1:{}, h2:{} }, classes: {} },
									parser:               wysihtml5.dom.parse,
									composerClassName:    "wysihtml5-editor",
									bodyClassName:        "wysihtml5-supported",
									useLineBreaks:        true,							
								});
            }, 1500);
        }
    };
});
BA.directive('mentorsWysihtmlEditor', function($window) {
    return {
		restrict: 'AE',
        link: function postLink(scope, element, attrs) {
            setTimeout(function () {
                $(element).wysihtml5({
									autoLink:             true,
									parserRules:          { tags: { br: {}, span: {}, div: {}, p: {}, b:{}, ul:{}, ol:{}, h1:{}, h2:{} }, classes: {} },
									parser:               wysihtml5.dom.parse,
									composerClassName:    "wysihtml5-editor",
									bodyClassName:        "wysihtml5-supported",
									useLineBreaks:        true,	
									events: {
										"blur": function() {
											$('.dropdown a').click(function(){
												clearTimeout(timeoutId);
											});
											
											var timeoutId = setTimeout(function () {
												$('#mentor-profile .summary-box .action-buttons .update-icon').trigger('click');
											},200);									
										}
									}	
								});
            }, 1500);
        }
    };
});
BA.directive('applyWysihtmlEditor', function($window) {
    return {
		restrict: 'AE',
        link: function postLink(scope, element, attrs) {
            setTimeout(function () {
                $(element).wysihtml5({
									autoLink:             true,
									parserRules:          { tags: { br: {}, span: {}, div: {}, p: {}, b:{}, ul:{}, ol:{}, h1:{}, h2:{} }, classes: {} },
									parser:               wysihtml5.dom.parse,
									composerClassName:    "wysihtml5-editor",
									bodyClassName:        "wysihtml5-supported",
									useLineBreaks:        true,
									stylesheets: ['/common/css/account-setting.css'],
									events: {
										"load": function() { 
											$('.wysihtml5-toolbar .dropdown a').attr('href','javascript:void(0)');
											$('.about-section .wysihtml5-toolbar').addClass('hide');
										},
										"focus": function() {
											if($('.select2Custom').hasClass('showtags')){
												if($('#basic-details-form .input-field .showtags').siblings('input[type="hidden"]').hasClass('single')){
													data = $('#basic-details-form .input-field .showtags').siblings('input[type="hidden"]').val();
													$('#basic-details-form .input-field .showtags').select2('val',data);
												} else {
													data = $('#basic-details-form .input-field .showtags').siblings('input[type="hidden"]').attr('data');
													$('#basic-details-form .input-field .showtags').select2('data',JSON.parse(data));
												}
												$('#basic-details-form .input-field .showtags').removeClass('showtags');
												$('.right-icon').removeClass('hide');
												$('.loader-icon').addClass('hide');
												$('.update-icon').addClass('hide');
												$('.close-icon').addClass('hide');
												$('.form-group').removeClass('active');
											}
											$('.form-group').removeClass('active');
											$('.about-section').addClass('active');
											$('.about-section .close-icon').removeClass('hide');
											$('.about-section .update-icon').removeClass('hide');
											$('.about-section .right-icon').addClass('hide');
											setTimeout(function(){
												$('.about-section .wysihtml5-toolbar').removeClass('hide');	
												$('.about-section .wysihtml5-sandbox').css({'border':'1px solid #ed8f00','background-color':'#fff','border-radius':'0px','padding': '12px 0px 12px 12px; !important'}).addClass('focused');
											},100);
										},
										"blur": function() {
											$('.about-section').removeClass('active');
											$('.dropdown a').click(function(){
												$('.about-section .wysihtml5-sandbox').css({'border':'1px solid #ed8f00','background-color':'#fff','border-radius':'0px'});
												clearTimeout(timeoutId);
											});
											
											var timeoutId = setTimeout(function () {
												if(!$window.click_in_progress){
														$('.about-section .wysihtml5-toolbar').addClass('hide');
														$('.about-section .update-icon').trigger('mousedown');
												}
											},200);									
										}
									}								
								});
            }, 1500);
        }
    };
});
BA.directive('tinyMceEditor', function() {
    return {
		restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
				tinymce.remove();
                tinyMCE.init({
					paste_as_text: true,
					selector: '#'+attrs.id,
					theme: "modern",
					entity_encoding : "raw",
					plugins: [
								"paste",
								"lists link charmap anchor",
								"wordcount visualblocks visualchars"
							],
					setup: function(editor) {
						editor.on('change', function(e) {
							tinymce.triggerSave();
							$("#" + editor.id).valid();
							editor.addShortcut("ctrl+u", "", "");
						});
						
					},
					toolbar1: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist",
					image_advtab: false,
					//invalid_elements :'br,p',
					//cleanup: true,
					//remove_linebreaks: false,
					//convert_newlines_to_brs: true,
					menubar:false,
					//inline_styles: false,
					//force_br_newlines : false,
				   // force_p_newlines : true,
					//forced_root_block : false,
					templates: [
						{title: 'Test template 1', content: 'Test 1'},
						{title: 'Test template 2', content: 'Test 2'}
					]
				});
			},1000);
		}
    }
});

BA.directive('applyEditable', function() {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            setTimeout(function () {
                $(element).editable({
					inputclass: 'first_name',
					url: '/ajax/socialAjax?t=user&a=update_info_new',
					params: function (params) {  //params already contain `name`, `value` and `pk`
						console.log(params.value);
						var data = {};
						data['form_type'] = 'basic';
						data[params.name] = params.value;
						return data;
					},
					validate: function(value){
						$('.first_name').rules('add',{
							required: true,
							first_name: true
						});
						$flag = $('.first_name').validate();
						if (!flag) {
							alert('Please insert valid mail');
						}
					},					
					send:'always'
				});
            }, 1000);
        }
    };
});

BA.directive('datePicker', function($window) {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            setTimeout(function () {
                $(element).datepicker({
					yearRange: "1920:",
					showAnim: "clip",
					dateFormat: "d M, yy",
					maxDate: '-15Y',
					changeMonth: true,
					changeYear: true,
					onSelect: function() {
						$window.click_in_progress = true;
						setTimeout(function(){
							$("a[data-input='#dob'].update-icon").trigger("mousedown");
							setTimeout(function(){
								$window.click_in_progress = false;
							},500);
						},100);
					}
				});
            }, 1000);
        }
    };
});

BA.directive('applyUserPassion', function($parse) {
    return {
        restrict: 'AE',
           link: function (scope, element, attrs) {  
			setTimeout(function () {
				var dat = $parse(attrs.data)(scope);
				$(element).select2({
					placeholder:"Click here to enter your passions",
					tags:[],
					multiple:true,
					allowClear: true,
					createSearchChoice: function(term, data) {
						if ($(data).filter(function() {
						  return this.text.localeCompare(term) === 0;
						}).length === 0) {
							var pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9.&+#' /-]*$/);
							if(term.trim() != '' && pattern.test(term)){
							  return {
								id: term.trim(),
								text: term.trim()
							  };
							} 
						}
					},
					formatNoMatches: function () {
						return "Please enter valid characters";
					},
					ajax: {
						url: "/user/passion",
						dataType: 'json',
						type: "GET",
						quietMillis: 250,
						data: function (term) {
							return {
								q: term
							};
						},
						results: function (data) {
							return {
								results: $.map(data, function (item) {
									return {
										id: item.interests,
										text: item.interests
									}
								})
							};
						}
					},
					dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
					escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in 
				}).select2("data",dat);
			}, 1000);
        }
    };
});
BA.directive('applyUserHobbies', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
			setTimeout(function(){
				var dat = $parse(attrs.data)(scope);
				$(el).select2({
					placeholder:"Click here to enter your hobbies",
					tags:[],
					multiple:true,
					allowClear: true,
					createSearchChoice: function(term, data) {
						if ($(data).filter(function() {
						  return this.text.localeCompare(term) === 0;
						}).length === 0) {
							var pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9.&+#' /-]*$/);
							if(term.trim() != '' && pattern.test(term)){
							  return {
								id: term.trim(),
								text: term.trim()
							  };
							} 			
						}
					},
					formatNoMatches: function () {
						return "Please enter valid characters";
					},
					ajax: {
						url: '/user/hobbie',
						dataType: 'json',
						type: "GET",
						quietMillis: 250,
						data: function (term) {
							return {
								q: term
							};
						},
						results: function (data) {
							return {
								results: $.map(data, function (item) {
									return {
										text: item.hobby,
										id: item.hobby
									}
								})
							};
						}, 
					}
				}).select2("data",dat);
			},1000);	
        }
    };
});
BA.filter('unique', function() {
    return function(collection, keyname) {
        var output = [], 
        keys   = [];
        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
   };
});

BA.filter('numberFormatter', function() {
    return function(num, digits) {
		var si = [
			{ value: 1E18, symbol: "E" },
			{ value: 1E15, symbol: "P" },
			{ value: 1E12, symbol: "T" },
			{ value: 1E9,  symbol: "G" },
			{ value: 1E6,  symbol: "M" },
			{ value: 1E3,  symbol: "k" }
		], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
		for (i = 0; i < si.length; i++) {
			if (num >= si[i].value) {
			  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
			}
		}
		return parseFloat(num).toFixed(digits).replace(rx, "$1");
   };
});

BA.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip({html: 'true', container: 'body'});
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

BA.directive('eventsCalender', function($parse){
    return {
        restrict: 'AE',
        link: function(scope, element, attrs){
            setTimeout(function () {
                var d = $parse(attrs.data)(scope);
				if(d[0] !== undefined ){
					var date = d[0].start.split(' ')[0];
				} else {
					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; //January is 0!
					var yyyy = today.getFullYear();

					if(dd<10) {
						dd='0'+dd
					} 

					if(mm<10) {
						mm='0'+mm
					} 

					var date = yyyy+'-'+mm+'-'+dd;
				}
                $(element).fullCalendar({
                    header: {
                        left    :'prev,next today',
                        center  :'title',
                        right   :'month,agendaWeek,agendaDay'
                    },
                    defaultDate: date,
                    editable: true,
                    eventLimit: true, // allow "more" link when too many events
                    events: d,
                    eventRender: function(event, element) {
						$('#calendar').fullCalendar('option', 'height', 400);
                         $(element).tooltip({title: event.title, placement:'top', position:'fixed'});
                    },
					eventClick: function(event) {
						window.open(event.url, '_blank');
						return false;
					},
                });
            }, 2000);
        }
    };
});

BA.directive('angDatepicker', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).datetimepicker({
                format:'Y-m-d H:i:s'
            });
        }
    };
});

BA.directive('splitArray', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            
            ngModel.$formatters.push(function(value) {
                if (value) {
                    return (value || '').join("\n");
                }
            });
        }
    };
});

BA.directive('customPopover', function ($compile) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
			if(attrs.popoverHtml != '' && attrs.popoverHtml != '<p></p>'){
				$(el).popover({
					trigger: 'hover',
					html: true,
					//content: attrs.popoverHtml,
					content : function() {
						return $compile(attrs.popoverHtml)(scope);
					},
					placement: attrs.popoverPlacement,
				});
			}
        }
    };
});

BA.directive('mentorListing', function ($compile) {
    return {
        restrict: 'AE',
        template: '<almausersp style="position:absolute;overflow:hidden;" get-all="" mid="{{label}}" w="175" h="s"></almausersp>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'hover',
                html: true,
                //content: attrs.popoverHtml,
                content : function() {
                    return $compile(attrs.popoverHtml)(scope);
                },
                placement: attrs.popoverPlacement,
            });
        }
    };
});

BA.directive('reachAnalysis', function ($parse, $rootScope) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            console.log($rootScope.TestArray);
            var dat = $parse(attrs.data)(scope);
            console.log(dat);
            google.setOnLoadCallback(drawChart(dat));
            function drawChart(dat) {
                console.log(dat);
                var data = google.visualization.arrayToDataTable(dat);
                var options = {
                  title: 'Reach Analysis',
                  curveType: 'function',
                  legend: { position: 'bottom' }
                };
                var chart = new google.visualization.LineChart(document.getElementById("reach_curve_chart"));
                chart.draw(data, options);
            }
        }
    };
});

BA.filter('getById', function() {
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].institute_id == +id) {
              return input[i];
            }
        }
        return null;
    };
});

BA.filter('split', function() {
    return function(input, s) {
      var delimiter = s || ',';
      return input.split(delimiter);
    };
});

BA.directive('scrollBottom', function ($compile) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {            
            var hr = el[0].querySelector('ul.messages');
            
        }
    };
});

BA.directive('textEditor', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            $(el).wysihtml5({
			"style": true,"font-styles": false,"emphasis": true,"html": false,"color": true,"useLineBreaks":false
			});
        }
    };
});

BA.factory('Utils', function($q) {
    return {
        isImage: function(src) {
            var deferred = $q.defer();
            var image = new Image();
            image.onerror = function() {
                deferred.resolve(false);
            };
            image.onload = function() {
                deferred.resolve(true);
            };
            image.src = src;
            return deferred.promise;
        }
    };
});

BA.factory('almabayChat', function($q) {
    return {
        isImage: function(src) {
            var deferred = $q.defer();
            var image = new Image();
            image.onerror = function() {
                deferred.resolve(false);
            };
            image.onload = function() {
                deferred.resolve(true);
            };
            image.src = src;
            return deferred.promise;
        }
    };
});

BA.directive('applyProficiency', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {            
            var dat = $parse(attrs.data)(scope);
            $(el).select2({
                placeholder: "Select proficiency level.",
                ajax: {
                    // instead of writing the function to execute the request we use Select2's convenient helper
                    url: "/life_skills_api/getProficiencyLevels",
                    dataType: 'json',
                    quietMillis: 250,
                    data: function (term) {
                                        return {
                                                q: term
                                        };
                    },
                    results: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    text: item.name,
                                    id: item.id
                                };
                            })
                        };
                    },
                    cache: true
                },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "") {
                        $.ajax("/life_skills_api/getProficiencyLevels" + id, {
                            dataType: "json"
                        }).done(function(data) { callback(data); });
                    }
                },
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; }, // we do not want to escape markup since we are displaying html in results
                
            })
            .select2("data", {id:dat.proficiency_id, text:dat.prof_name});
        }
    };
});

BA.directive('applyProficiencyWithLogo', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {            
            var dat = $parse(attrs.data)(scope);
			if(dat !== undefined && dat.proficiency_id != ''){
				//data_text = '<img src="/common/uploads/emoticon/'+dat.prof_name+'.png" style="width:25px; height:25px;margin-right:5px;" />'+dat.prof_name,
				dat = {id:dat.proficiency_id,text:dat.prof_name};
			} 
			function formatProficiency (proficiency) {
			  if (!proficiency.id) { return proficiency.text; }
			  var $proficiency = $(
				'<img src="/common/uploads/emoticon/'+proficiency.text+'.png" style="width:25px; height:25px;margin-right:5px;" />\
				<span class="proficiency-text">'+ proficiency.text+'</span>'
			  );
			  return $proficiency;
			};
            $(el).select2({
                placeholder: "Select proficiency level.",
                ajax: {
                    // instead of writing the function to execute the request we use Select2's convenient helper
                    url: "/life_skills_api/getProficiencyLevels",
                    dataType: 'json',
                    quietMillis: 250,
                    data: function (term) {
                                        return {
                                                q: term
                                        };
                    },
                    results: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    text: item.name,
                                    id: item.id
                                };
                            })
                        };
                    },
                    cache: true
                },
				
				formatResult: formatProficiency,
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; }, // we do not want to escape markup since we are displaying html in results 
            }).select2("data", (dat !== undefined && dat.proficiency_id != '')?dat:'')
        }
    };
});

BA.directive('addjobLevels', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {            
            var dat = $parse(attrs.data)(scope);
            $(el).select2({
                placeholder: "Select Work level.",
                ajax: {
                    // instead of writing the function to execute the request we use Select2's convenient helper
                    url: "/life_skills_api/getWorkLevels",
                    dataType: 'json',
                    quietMillis: 250,
                    data: function (term) {
                                        return {
                                                q: term
                                        };
                    },
                    results: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    text: item.name,
                                    id: item.id
                                };
                            })
                        };
                    },
                    cache: true
                },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "") {
                        $.ajax("/life_skills_api/getWorkLevels" + id, {
                            dataType: "json"
                        }).done(function(data) { callback(data); });
                    }
                },
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; }, // we do not want to escape markup since we are displaying html in results
                
            })
            .select2("data", {id:dat.id, text:name});
        }
    };
});

BA.directive('adminWorkLevels', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {  
            $(el).select2({
                placeholder: "Select Work level.",
                ajax: {
                    // instead of writing the function to execute the request we use Select2's convenient helper
                    url: "/user/getWorkLevels",
                    dataType: 'json',
                    quietMillis: 250,
                    data: function (term) {
                                        return {
                                                q: term
                                        };
                    },
                    results: function (data) {
                        return {
                            results: $.map(data, function (item) {
                                return {
                                    text: item.name,
                                    id: item.id
                                };
                            })
                        };
                    },
                    cache: true
                },
                initSelection: function(element, callback) {
                    var id = $(element).val();
                    if (id !== "") {
                        $.ajax("/user/getWorkLevels" + id, {
                            dataType: "json"
                        }).done(function(data) { callback(data); });
                    }
                },
                dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                escapeMarkup: function (m) { return m; }, // we do not want to escape markup since we are displaying html in results
                
            });
        }
    };
});

BA.directive('applyTechnical', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {  
			setTimeout(function () { 
				var dat = $parse(attrs.data)(scope);
				$(el).select2({
					multiple:false,
					createSearchChoice: function(term, data) {
						if ($(data).filter(function() {
						  return this.text.localeCompare(term) === 0;
						}).length === 0) {
							var pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9.&+#' /-]*$/);
							if(term.trim() != '' && pattern.test(term)){
							  return {
								id: term,
								text: term
							  };
							} 
						}
					},
					formatNoMatches: function () {
						return "Please enter valid characters";
					},
					placeholder: "Select your skill.",
					minimumInputLength: 2,
					formatInputTooShort: function () {
						return "Please enter atleast 2 characters";
					},
					ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
						url: "/life_skills_api/getKeySkills",
						dataType: 'json',
						quietMillis: 250,
						data: function (term) {
											return {
													q: term
											};
						},
						results: function (data) {
							return {
								results: $.map(data, function (item) {
									return {
										text: item.name,
										id: item.name
									};
								})
							};
						},
						cache: true
					},
					dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
					escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
				})
				.select2("data", (dat !== undefined)?{id:dat.skill_name, text:dat.skill_name}:'');
			},100);	
        }
    };
});

BA.directive('applyTechnicalwhatsnew', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {
            setTimeout(function () { 
                var dat = $parse(attrs.info)(scope);
                $(el).select2({
                    tags: [],
                    placeholder: "Choose from technical background.",
                    //minimumInputLength: 3,
                    ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
                        url: "/life_skills_api/getKeySkills",
                        dataType: 'json',
                        quietMillis: 250,
                        data: function (term) {
                                            return {
                                                    q: term
                                            };
                        },
                        results: function (data) {
                            return {
                                results: $.map(data, function (item) {
                                    return {
                                        text: item.name,
                                        id: item.name
                                    };
                                })
                            };
                        },
                        cache: true
                    },
                    initSelection: function(element, callback) {
                        var id = $(element).val();
                        if (id !== "") {
                            $.ajax("/life_skills_api/getKeySkills" + id, {
                                dataType: "json"
                            }).done(function(data) { callback(data); });
                        }                    
                    },
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
                })
                .select2("data", dat);
            }, 1000);
        }
    };
});
