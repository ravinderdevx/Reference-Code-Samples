BA.controller ('mentorsDirectoryController', ['$scope', '$rootScope', '$http', 'LifeSkills', 'API', 'toastr', '$location', 'filterFilter', '$timeout', '$compile',
                        function($scope, $rootScope, $http, LifeSkills, API, toastr, $location, filterFilter, $timeout, $compile){
    $scope.offset   	= 0;
    $scope.v_offset   	= 0;
    $scope.s_offset   	= 0;
    $scope.o_offset   	= 0;
	
	$scope.limit		= 12;
	$scope.c_limit		= 6;
	
	$scope.showLoadMore	= true;
	$scope.showLoadMore_v	= true;
	$scope.showLoadMore_s	= true;
	$scope.showLoadMore_o	= true;
    $scope.showLoading	= true;
    $scope.filtering	= false;
	
	var url     		= $location.absUrl();
	var urlArr			= url.split('/');
	
	$scope.mentors				= [];
	$scope.verified_mentors		= [];
	$scope.suggested_mentors	= [];
	$scope.other_mentors		= [];
	
	var filter = $('#filter-form').serialize();
    $scope.mentors = LifeSkills.getMentorsDirectory(filter, $scope.offset);
    $scope.mentors.then(function(data) {
		$scope.type 			= data.detail.type;
		if($scope.type == 'uncategorized'){
			$scope.mentors		= data.detail.mentors;
			$scope.count		= data.detail.total;
			$scope.loggedInUser	= data.loggedInUser;
			$scope.base_path	= data.base_path;
			$scope.offset += $scope.limit;
			if($scope.mentors.length < $scope.limit  || $scope.mentors.length==$scope.count){
				$scope.showLoadMore=false;
			} else {
				$scope.showLoadMore=true;
			}
		} else {
			$scope.verified_mentors		= data.detail.verified_mentors;
			$scope.suggested_mentors	= data.detail.suggested_mentors;
			$scope.other_mentors		= data.detail.other_mentors;
			$scope.loggedInUser	= data.loggedInUser;
			$scope.base_path	= data.base_path;
			
			$scope.v_offset 		+= $scope.c_limit;
			$scope.s_offset 		+= $scope.c_limit;
			$scope.o_offset 		+= $scope.limit;
			
			$scope.showLoadMore	  = false;
			$scope.showLoadMore_v = ($scope.verified_mentors.length < $scope.c_limit)?false:true;
			$scope.showLoadMore_s = ($scope.suggested_mentors.length < $scope.c_limit)?false:true;
			$scope.showLoadMore_o = ($scope.other_mentors.length < $scope.limit)?false:true;
			
		}
    }, function(error) {

    }).finally(function() {
        $scope.showLoading = false;
    });
	
	$scope.showMore = function(object){
		if($('.view-all-skills').hasClass('show-less-skills')){
			$scope.limit = 1;
			$('.view-all-skills').removeClass('show-less-skills').text('..... Show all');
		} else {
			$scope.limit = object.split(',').length;
			$('.view-all-skills').addClass('show-less-skills').text('Show less');
		}
	};
	
	$scope.getDetail = function(data){
		if(data.companyname !== null && data.companyname !== ""){
			if(data.designation !== null && data.designation !== "" && data.currently_working_here == '1'){
				return 'Working as '+data.designation+' at '+data.companyname+'';
			} else if(data.designation !== null && data.designation !== "" && data.year_to>0 && data.year_to !== null) {
				return 'Worked as '+data.designation+' at '+data.companyname+' in '+data.year_to+'';
			} else if(data.year_to>0 && data.year_to !== null && data.currently_working_here != "1") {
				return 'Worked at '+data.companyname+' in '+data.year_to+'';
			}  else if( data.currently_working_here == "1") {
				return 'Working as at '+data.companyname+'';
			} else {
				return 'Worked at '+data.companyname+'';
			}
		} else {
			return '';
		} 
	};
	
	$scope.loadMoreMentors = function(type){
		switch(type){
			case 'verified':
				$scope.searching_v = true;
				$timeout(function(){
					$scope.moreMentorsList   = LifeSkills.getMoreMentors(type, $scope.v_offset);
					$scope.moreMentorsList.then(function(data){
						$scope.v_offset += $scope.c_limit;
						$scope.verified_mentors.push.apply($scope.verified_mentors,data.detail.verified_mentors);	
						if(data.detail.verified_mentors.length < $scope.c_limit){
							$scope.showLoadMore_v=false;
						} else {
							$scope.showLoadMore_v=true;
						}
					},function(error) {

					}).finally(function() {
						$scope.searching_v = false;
					});
				},2000);
			break;
			
			case 'suggested':
				$scope.searching_s = true;
				$timeout(function(){
					$scope.moreMentorsList   = LifeSkills.getMoreMentors(type, $scope.s_offset);
					$scope.moreMentorsList.then(function(data){
						$scope.s_offset += $scope.c_limit;
						$scope.suggested_mentors.push.apply($scope.suggested_mentors,data.detail.suggested_mentors);	
						if(data.detail.suggested_mentors.length < $scope.c_limit){
							$scope.showLoadMore_s=false;
						} else {
							$scope.showLoadMore_s=true;
						}
					},function(error) {

					}).finally(function() {
						$scope.searching_s = false;
					});
				},2000);
			break;
			
			case 'others':
				$scope.searching_o = true;
				$timeout(function(){
					$scope.moreMentorsList   = LifeSkills.getMoreMentors(type, $scope.o_offset);
					$scope.moreMentorsList.then(function(data){
						$scope.o_offset += $scope.limit;
						$scope.other_mentors.push.apply($scope.other_mentors,data.detail.other_mentors);	
						if(data.detail.other_mentors.length < $scope.limit){
							$scope.showLoadMore_o=false;
						} else {
							$scope.showLoadMore_o=true;
						}
					},function(error) {

					}).finally(function() {
						$scope.searching_o = false;
					});
				},2000);
			break;
			
			default:
				$scope.searching = true;
				$timeout(function(){
					filter = $('#filter-form').serialize();
					$scope.moreUsersList   = LifeSkills.getMentorsDirectory(filter, $scope.offset);
					$scope.moreUsersList.then(function(data){
						$scope.offset += $scope.limit;
						$scope.mentors.push.apply($scope.mentors,data.detail.mentors);	
						if(data.detail.mentors.length < $scope.limit || $scope.mentors.length==$scope.count){
							$scope.showLoadMore=false;
						} else {
							$scope.showLoadMore=true;
						}
					},function(error) {

					}).finally(function() {
						$scope.searching = false;
					});
				},2000);
		}
	};
	
	$scope.findMentorsByFilter = function(){
		var filter 	= $('#filter-form').serialize();
		var success = false;
		
		if(filter!=''){
			filterArrNew	= filter.split('&');
			$.each(filterArrNew, function(index, value){
				allFilters	= value.split('=');
				if(allFilters[1]!=''){
					success = true;
				}
			});
		}
		
		if(!success){
			toastr.error('Please apply atleast one filter.');
			return false;
		}
			
		$("html,body").animate({scrollTop:$(".jobs-infomation").offset().top}, 300, function(){
			$scope.showLoading   = true;
		});
		$timeout(function(){
			$scope.filtering	 = true;
			
			$scope.offset = 0;
			$scope.filterMentorList  	 = LifeSkills.getMentorsDirectory(filter, 0); // Service to return all friend suggestions
			$scope.filterMentorList.then(function(data){
				$scope.type 		= data.detail.type;
				$scope.mentors		= data.detail.mentors;
				$scope.count		= data.detail.total;
				$scope.loggedInUser	= data.loggedInUser;
				$scope.base_path	= data.base_path;
				$scope.offset += $scope.limit;
				if($scope.mentors.length < $scope.limit  || $scope.mentors.length==$scope.count){
					$scope.showLoadMore=false;
				} else {
					$scope.showLoadMore=true;
				}
				$scope.showLoading	= false;
				$scope.filtering	= false;
			},function(error) {

			}).finally(function() {
				if($(window).width()<=991){
					$('#filter-result-user').removeClass('show');
					$('.refine_search_bg').hide();
					$('body').removeClass('overflow-hidden');
				}
			});
		}, 1000);
	};	
	
	$scope.resetForm = function(){
		$("html,body").animate({scrollTop:$(".jobs-infomation").offset().top}, 300, function(){
			$scope.showLoading   = true;
		});
		$timeout(function(){
			$('#filter-form')[0].reset();
			$('#s2id_industries').select2('data','');
			$('#s2id_mentorship_areas').select2('data','');
			$('#s2id_locations').select2('data','');
			
			$scope.offset   	= 0;
			$scope.v_offset   	= 0;
			$scope.s_offset   	= 0;
			$scope.o_offset   	= 0;
			
			$scope.showLoadMore		= true;
			$scope.showLoadMore_v	= true;
			$scope.showLoadMore_s	= true;
			$scope.showLoadMore_o	= true;
			
			$scope.mentors				= [];
			$scope.verified_mentors		= [];
			$scope.suggested_mentors	= [];
			$scope.other_mentors		= [];
			
			var filter = $('#filter-form').serialize();
			$scope.mentors = LifeSkills.getMentorsDirectory(filter, $scope.offset);
			$scope.mentors.then(function(data) {
				$scope.type 			= data.detail.type;
				if($scope.type == 'uncategorized'){
					$scope.mentors		= data.detail.mentors;
					$scope.count		= data.detail.total;
					$scope.loggedInUser	= data.loggedInUser;
					$scope.base_path	= data.base_path;
					$scope.offset += $scope.limit;
					if($scope.mentors.length < $scope.limit  || $scope.mentors.length==$scope.count){
						$scope.showLoadMore=false;
					} else {
						$scope.showLoadMore=true;
					}
				} else {
					$scope.verified_mentors		= data.detail.verified_mentors;
					$scope.suggested_mentors	= data.detail.suggested_mentors;
					$scope.other_mentors		= data.detail.other_mentors;
					$scope.loggedInUser	= data.loggedInUser;
					$scope.base_path	= data.base_path;
					
					$scope.v_offset 		+= $scope.c_limit;
					$scope.s_offset 		+= $scope.c_limit;
					$scope.o_offset 		+= $scope.limit;
					
					$scope.showLoadMore	  = false;
					$scope.showLoadMore_v = ($scope.verified_mentors.length < $scope.c_limit)?false:true;
					$scope.showLoadMore_s = ($scope.suggested_mentors.length < $scope.c_limit)?false:true;
					$scope.showLoadMore_o = ($scope.other_mentors.length < $scope.limit)?false:true;
					
				}
			}, function(error) {

			}).finally(function() {
				$scope.showLoading = false;
			});
		}, 1000);
	}
	
	$scope.addMentor = function(mentor, type, encrypt_userid){
		var html		= '';
		if(type=='remove'){
			$r=confirm('Do you want to remove Mentor?');
			if ($r==true){ }else{ return false }
				$('#spinner'+mentor).removeClass('hide');
				html='<button class="mentorsButton add" data-toggle="dropdown"\
						type="button"\
						class="btn btn-default btn-sm" ng-click="addMentor('+mentor+', \'add\',\''+encrypt_userid+'\')">\
						<i class="fa fa-spinner fa-spin hide" id="spinner'+mentor+'"></i>\
						Follow Mentor</button>';
		} else{
				$('#spinner'+mentor).removeClass('hide');
				html='<div class="dropdown mentor"><button class="mentorsButton mentor your-mentor" id="addMentorButton'+mentor+'" data-toggle="dropdown"\
							type="button"\
							class="btn btn-default btn-sm mentor"\
							id="yourmentor">\
							<i class="fa fa-spinner fa-spin hide" id="spinner'+mentor+'"></i>\
							Following\
							<span class="caret"></span>\
					</button>\
					<ul class="dropdown-menu">\
						<li><a href="/mentors/profile/'+encrypt_userid+'" target="_blank">View Profile</a></li>\
						<li><a href="javascript:void(0)" mentor="'+mentor+'" ng-click="sendMessageToMentor(\''+$scope.base_path+'\','+mentor+','+$scope.loggedInUser+')">Send Message</a></li>\
						<li><a href="javascript:void(0)" mentor="'+mentor+'" ng-click="raiseQuestionToMentor(\''+$scope.base_path+'\','+mentor+','+$scope.loggedInUser+')">Ask Question</a></li>\
						<li class="divider" role="separator"></li>\
						<li><a href="javascript:void(0)" ng-click="addMentor('+mentor+', \'remove\',\''+encrypt_userid+'\')">Unfollow Mentor</a></li>\
					</ul></div>';
		}
		$scope.Mentoradd  	 = LifeSkills.SK_registerMentor(mentor); 
		$scope.Mentoradd.then(function(data){
			if(data == 'Please log in to continue!'){
				bootbox.confirm("Dear guest user you need to login first before sending 'become my mentor' request.", function(result) {
					if ( result ) {
						var landingUrl = "http://" + window.location.host + "/login?url=bWVudG9ycy9kaXJlY3Rvcnk=";
						window.location.href = landingUrl;
					}
				});
			}
			if (data.status == 200) {					
				$("#addMentorButtonH"+mentor).html($compile(html)($scope));
			}
			if(data.html == 'insert'){
				toastr.success('Mentor added Successfully');
			}
		}).finally(function() {
			setTimeout(function(){
				$('#spinner'+mentor).addClass('hide');
			},500);
		});
	}
	$scope.sendMessageToMentor = function(domain, mentor, mentee) {
		var sendMessage = bootbox.dialog({
			title: "Send your message to your mentor. | <small>Be specific while sending message and get instant response.</small>",
			message: '<div class="row">  ' +
				'<div class="col-md-12"> ' +
				'<div id="preview"></div>'+
				'<form class="form-horizontal" action="'+domain+'ajax/socialAjax?t=message&a=send_message" method="POST" name="sendMessageToMentor" id="sendMessageToMentor"> ' +
				'<div class="form-group"> ' +
				'<label class="col-md-2 control-label" for="name">Subject <span class="error">*</span></label> ' +
				'<div class="col-md-8"> ' +
				'<input id="subject" onkeypress="return event.keyCode != 13" name="subject" type="text" placeholder="Your Message is about..." class="form-control input-md" info="Message Subject" /> ' +
				'<input id="mentor" name="recipient_id" type="hidden" value="'+mentor+'" /> ' +
				'<input id="mentee" name="timeline_id" type="hidden" value="'+mentee+'" /> ' +
				'</div> </div>' +
				'<div class="form-group"> ' +
				'<label class="col-md-2 control-label" for="awesomeness">Message <span class="error">*</span></label> ' +
				'<div class="col-md-8">' +
				'<textarea name="text" id="message" cols="50" rows="5" class="form-control" placeholder="Enter your message here." info="Message Body"></textarea>' +
				'</div>'+
				'</div>' +
				'</form></div></div>',
			buttons: {
				success: {
					label: "Send Message",
					className: "btn btn-primary btn-sm",
					callback: callback
				},
				danger: {
					label: "Cancel",
					className: "btn-default btn-sm",
					callback: function() {
					  //toastr.success("Sending new message to your mentor aborted.");
					}
				}
			},
			onEscape: function() {
				
			}
		});
		/****
		 * call back function handle sending message request
		 */
		function callback() {
			var can_submit_from = false;
			$("#sendMessageToMentor").ajaxForm({
				target: "#preview",
				beforeSubmit: function(arr, $form, options){
					var can_submit_from = true;
					$.each(arr, function(key, value){
						if ( value.value=='' ) {
							can_submit_from =  false;
							toastr.error($('input[name='+value.name+'], textarea[name='+value.name+']').attr('info')+" is required field.");
							return false;
						}
					});
					if(can_submit_from){
						/*****
						* Check if the user's sending messages to mentor
						* has relation among them
						*/
						var MentorMenteeRelated = false;
						$.ajax({
							method: "POST",
							url: domain+"mentors/actionControls",
							data: { mentor_id: mentor, mentee_id: mentee }
						}).done(function( msg ) {
							var d = JSON.parse(msg);
							if ( d.success ) {
								//yes, users are connected through mentor mentee relation
								MentorMenteeRelated = true;
							}
							if (d.error) {
								//no, users are not connected through mentor mentee relation
								MentorMenteeRelated = false;
							}
							if ( !MentorMenteeRelated ) {
								//toastr.error("huhh, cheating? You can only send message to your mentor");
							}
							return MentorMenteeRelated;
						});
						return true;
					} else {
					   return false; //ti will stop your submission.
					}
				},
				success: function(data) {
					if ( data.status==200 ) {
						toastr.success("Your message has been sent successfully, you will get notified, thanks");
						$("button.bootbox-close-button").trigger('click');
						$("button.bootbox-close-button").trigger('click');
						return true;
					} 
				else {
						toastr.error("Oops, something went wrong. Can't dispatch your message at the moment. Kindly try after some time.");
						return false;
					}
				}
			}).submit();
				if (!can_submit_from) {
					//code
					return false;
				} else {
					return true;
				}
		}
	};
	
	$scope.raiseQuestionToMentor = function(domain, mentor, mentee) {    
		bootbox.dialog({
			title: function(){            
				return "Send your question to your mentor. | <small>Be specific while sending question and get instant response.</small>";
			},
			message: function(){
				var form = '<div class="row">  ' +
				'<div class="col-md-12" id="asking-mentor"> ' +
				'<div id="preview"></div>'+
				'<form class="form-horizontal" action="'+domain+'mentors/menteeAskedQuestion" method="POST" name="sendMessageToMentor" id="sendMessageToMentor"> ' +
				'<div class="form-group"> ' + 
				'<h2 class="heading">Ask Mentor</h2>' +
				'<div class="col-md-12"> ' +
				'<input id="subject" name="title" type="text" placeholder="Enter your question here" class="form-control input-md enter-question" info="Message Subject" /> ' +
				'<input id="mentor" name="mentor_id[]" type="hidden" value="'+mentor+'" /> ' +
				'<input id="mentee" name="mentee_id" type="hidden" value="'+mentee+'" /> ' +
				'</div> </div>' +
				'<div class="form-group"> ' +            
				'<div class="col-md-12">' +
				'<textarea name="description" id="question_body" cols="50" rows="5" class="form-control describtion" placeholder="Description" info="Message Body"></textarea>' +
				'</div>'+
				'</div>'+           
				'<div class="form-group"> ' +            
				'<div class="col-md-12">'+
					'<div class="drag-drop">' +
						'<div class="image-upload">' +
							'<label for="file-input">'  +
								'Attach files from your computer' +
							'</label>' +
							'<input id="file-input" type="file" name="qdocs" onchange="displayFileName(this.value)" multiple="multiple" /><span id="fileInfo"></span>' +
							'<input type="hidden" name="content_type" value="question" />' +
						'</div>' +                    
					'</div>' +
				'</div>'+
				'</div>'+
				 '<div class="form-group hide"> ' +            
					 '<div class="col-md-12">'+
							'<div class="checkbox">' +
								'<label>' +
								'<input type="checkbox" name="privacy_type" onchange="toggleTagFields(this.value)" id="makeQuestionPublic"> Keep it public' +
								'</label>' +
							  '</div>' +
					 '</div>' +
				  '</div>   ' +
				'<div class="form-group hide" id="showPublictaggs"> ' +            
				'<div class="col-md-12">'+
				'<div id="make_q_public"><small class="topics">Topics</small>'+
				'<input type="text" onclick="prePopulateFields(this)" name="tag_field" id="tag_field" class="form-control" />'+
				'<input type="hidden" name="tag_fields" id="tag_fields" class="form-control" placeholder="Add Tags to your question." data="{}" style="width:100%;"/>'+
				'</div></div>'+
				'</div>'+
				'</form></div></div>';
				return form;
			},
			buttons: {
				success: {
					label: "Submit Question",
					className: "btn btn-primary btn-sm submit-question",
					callback: callback
				},
				danger: {
					label: "Cancel",
					className: "btn-danger btn-sm hide",
					callback: function() {
						//toastr.success("Sending new message to your mentor aborted.");
					}
				}
			},
			onEscape: function() {
				
			}
		});    
		/****
		 * call back function handle
		 * ask question request
		 */
		function callback() {
			var can_submit_from = false;
			$("#sendMessageToMentor").ajaxForm({
				//target:"#preview",
				beforeSubmit : function(arr, $form, options){                             
					if ($("#subject").val()=='') {
						//code
						can_submit_from =  false;
						toastr.error("Question title is required field.");				
						return false;
					}                
					if (!$("#subject").val().replace(/\s/g, '').length) {
						//code
						can_submit_from =  false;
						toastr.error("Invalid title, Kindly recheck and submit again.");				
						return false;
					} 
					return true;
				},
				success: function(data) {
					var d = JSON.parse(data);
					if ( d.statusCode==200 && d.success ) {
						toastr.success("Your Question has been sent successfully, you will get notified, thanks");
						$(".bootbox-close-button").trigger('click');
						return true;
					}
					if( d.statusCode==200 && d.error ) {
						toastr.error("Oops, something went wrong. Can't dispatch your message at the moment. Kindly try after some time.");
						return false;
					}
				}
			}).submit();
			if (!can_submit_from) {
				//code
				return false;
			} else {
				return true;
			}
		}
	};

}]);

BA.filter('count', function() {
    return function(collection, key) {
      var out = "test";
      for (var i = 0; i < collection.length; i++) {
          //console.log(collection[i].pants);
          //var out = myApp.filter('filter')(collection[i].pants, "42", true);
      }
      return out;
    };
});
BA.controller ('reviewsListController', ['$scope','$location', '$rootScope', '$http', 'UserService', 'Utils',
                        function($scope, $location, $rootScope, $http, UserService, Utils) {
    var url = $location.absUrl();
    url = url.split("#");
    url = url[0].split("/");
    var param_1   = url[url.length-1];
    
    console.log(param_1);
							
    $scope.reviewsListData   = UserService.reviewslist(param_1); // Service to return all reviewslist
    $scope.loading = true;
    $scope.dataLength   = 0;
    var limitStep       = 6;
    $scope.limit        = limitStep;
    $scope.loadmore     = function() {
        $scope.limit    += limitStep;
    };
    /***
     * Reviews  list all 
     */
    $scope.reviewsListData.then(function(data){
        $scope.results      = data;
    },function(error) {
        //toastr.error(error+': Invalid credentials given.');
    }).finally(function() {
        $scope.loading = false;
    });    
}]);

BA.controller ('mentorProfileController', ['$scope','$location', '$rootScope', '$http', '$timeout', 'UserService', 'LifeSkills', 'Utils', 'toastr', '$compile', 
 function($scope, $location, $rootScope, $http, $timeout, UserService, LifeSkills, Utils, toastr, $compile) {
	$scope.showLoading			= true;
	$scope.educationLimit		= 2;
	$scope.experienceLimit		= 2;
	
	$scope.submitting			= false;
	$scope.submitted			= false;
	
	$scope.workSubmitting		= false;
	$scope.workSubmitted		= false;
	
	$scope.educationSubmitting	= false;
	$scope.educationSubmitted	= false;
	
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
    $scope.mentorQaList =UserService.mentorQaList(param_1); // Service to return all reviewslist
	$scope.mentorQaList.then(function(data){
		$scope.articles  				= data.articles;
		$scope.mentorInfo  				= data.mentorInfo;
		$scope.summery					= $scope.mentorInfo.about;
        $scope.publicUserEducation		= data.educationInfo;
        $scope.publicUserProfessional  	= data.professionalInfo;
        $scope.mentorshipAreas  		= data.mentorshipAreas;
		$scope.mentorMenteeRelation     = data.mentorMenteeRelation;
		$scope.loggedInUser				= data.loggedInUser;
		$scope.base_path				= data.base_path;
    },function(error) {
       
    }).finally(function() {
		$timeout(function(){
			$scope.showLoading	= false;
		}, 1000);
    });
	
	/** Work Functions **/
	$scope.saveUserProfession = function(row_id, index){
		var data={};
		data['formType'] ='work';
		if(row_id !== undefined && row_id>0){
			type 							= 'editinfonew';
			success_message 				= "User Profession updated Successfully";
			form_id 						= $("#editWork-"+row_id);
			data['user_profession_id']		= row_id;
			form_data 						= form_id.serialize();
		} else {
			success_message 				= "User Profession added Successfully";
			type 							= 'addinfonew';
			form_id 						= $('#add-work');
			form_data 						= form_id.serialize();
		}
		
		var tempArr = form_data.split("&");
		$.each(tempArr, function(index, value){
			var temp = value.split("=");
			data[temp[0]] = decodeURIComponent(temp[1]).split('+').join(' ');
		});
		
		var all_month = "JanFebMarAprMayJunJulAugSepOctNovDec";
		if(data.year_from!=''){
			var d=data.year_from.split('-');
			data['year_from']=d[1];
			data['month_from']=all_month.indexOf(d[0]) / 3 + 1;
		}
		if(data.year_to!=""){
			var d=data.year_to.split('-');
			data['year_to']=d[1];
			data['month_to']=all_month.indexOf(d[0]) / 3 + 1;
		}
		if($(window).width()>767){
			var scroll_value = $(".navbar.main").outerHeight();
		} else {
			var scroll_value = 0;
		}
		var isvalidate=form_id.valid();
		if(!isvalidate){
			$timeout(function(){
				$('html, body').animate({
					scrollTop: form_id.find('.error:visible').eq('0').siblings('.heading').offset().top-scroll_value
				}, 300);
			},200);
			return false;
		}

		if(data.currently_working_here == '1'){
			data['year_to']='';
		} else if(data.year_to == ''){
			toastr.error('Please add your to year if your are not currenty working in this organization');
			return false;
		}
		
		$scope.workSubmitting = true;
		form_id.find('#s2id_company_name').select2("disable");
		form_id.find('#s2id_industry').select2("disable");
		form_id.find('#s2id_department').select2("disable");
		form_id.find('#s2id_level_name').select2("disable");
		form_id.find('#s2id_location').select2("disable");
		form_id.find('#s2id_institute_type').select2("disable");
		
		$timeout(function(){
			$scope.save = UserService.updateUserDetail(data, type); 
			$scope.save.then(function(result) {
				 if(result.status==200){
					$scope.workSubmitting	= false;
					$scope.workSubmitted	= true;
					//toastr.success(success_message);
					$timeout(function(){
						form_id.hide('fade',{direction:'up'},500);
						$(".add-Workplace").removeClass('hide');
						$timeout(function(){
							form_id.find('#s2id_company_name').select2("enable");
							form_id.find('#s2id_industry').select2("enable");
							form_id.find('#s2id_department').select2("enable");
							form_id.find('#s2id_level_name').select2("enable");
							form_id.find('#s2id_location').select2("enable");
							form_id.find('#s2id_institute_type').select2("enable");
							$scope.workSubmitted=false;
							if(type == 'editinfonew'){
								$scope.publicUserProfessional[index] = result.detail[0];
								
								$('html, body').animate({
									scrollTop: $("#work-"+row_id).offset().top-scroll_value
								}, 500);
							} else {
								$scope.publicUserProfessional.push.apply($scope.publicUserProfessional,result.detail);
								
								$('html, body').animate({
									scrollTop: $("#add-work").offset().top-scroll_value
								}, 500);
							}
							$(".add-Workplace").show();
						},500);
					},500);
				 } else if(result.status==417){
					toastr.error('check enter values');
				 }
			}).finally(function() {
				
			});
		},500);	
	}
	
	$scope.removeWork=function(id, index){
		var confirmation = confirm('Do you want to remove your work?');
		if(confirmation){
			$('#work-'+id).css('pointer-events','none');
			var data={};
			data['t'] = 'user';
			data['a'] = 'removeinfo';
			data['q'] = id; 
			data['r'] = 'work';
			$scope.remove = UserService.removeUserWorkInfo(data); 
			$scope.remove.then(function(data) {
				 if(data.status==200){
					$timeout(function(){
						$('#work-'+id).css('background-color','rgba(255,0,0,0.1)').hide("fade",{direction:'up'},500);
						$timeout(function(){
							$scope.publicUserProfessional.splice(index, 1);
						},500);						
					},200);
				 }	else {
					$('#work-'+id).css('pointer-events','');
				 }
			});
		}
	};
	
	/** Education functions **/
	$scope.saveUserQualification=function(row_id, index){
		var data={};
		data['formType'] ='school';
		if(row_id !== undefined && row_id>0){
			type ='editinfonew';
			success_message = "User Qualification updated Successfully";
			form_id = $("#editSchool-"+row_id);
			data['user_qualification_id'] =row_id;
			form_data = form_id.serialize();
		} else {
			success_message = "User Qualification added Successfully";
			type ='addinfonew';
			form_id = $('.add-education');
			form_data = form_id.serialize();
		}
		form_id.find('.error').addClass('hide');
		
		var tempArr = form_data.split("&");
		$.each(tempArr, function(index, value){
			var temp = value.split("=");
			data[temp[0]] = decodeURIComponent(temp[1]).split('+').join(' ');
		});
		
		if(data.institute_id == '' || data.institute_id<=0){
			form_id.find('.Institute-error').removeClass('hide');
			return false;
		}
		
		if(form_id.find('#Qualification').is(":visible") && data.qualification_type == ''){
			form_id.find('.qualification-error').removeClass('hide');
			return false;
		}
		
		if(data.currently_studing_here==1){
			data['to_year']='';
		} else if(data.to_year == ''){
			form_id.find('.Passout-error').removeClass('hide');
			return false;
		}
		if($(window).width()>767){
			var scroll_value = $(".navbar.main").outerHeight();
		} else {
			var scroll_value = 0;
		}		$scope.submitting = true;
		form_id.find('#s2id_Education').select2("disable");
		form_id.find('#s2id_Institute').select2("disable");
		form_id.find('#s2id_Passout').select2("disable");
		form_id.find('#s2id_Qualification').select2("disable");
		form_id.find('#s2id_Field').select2("disable");
		form_id.find('#s2id_specialization').select2("disable");
		
		$timeout(function(){
			$scope.save = UserService.updateUserDetail(data, type); 
			$scope.save.then(function(result) {
				 if(result.status==200){
					$scope.submitting = false;
					$scope.submitted=true;
					//toastr.success(success_message);
					$timeout(function(){
						form_id.hide('fade',{direction:'up'},500);
						$(".education-workspace").removeClass('hide');
						$('.education-details .form-group').css('pointer-events','');
						$('.education-details .inner-education-form').css('pointer-events','');
						$timeout(function(){
							$scope.submitted=false;
							form_id.find('#s2id_Education').select2("enable");
							form_id.find('#s2id_Institute').select2("enable");
							form_id.find('#s2id_Passout').select2("enable");
							form_id.find('#s2id_Qualification').select2("enable");
							form_id.find('#s2id_Field').select2("enable");
							form_id.find('#s2id_specialization').select2("enable");
							if(type == 'editinfonew'){
								$scope.publicUserEducation[index] = result.detail[0];
								
								$('html, body').animate({
									scrollTop: $("#school-"+row_id).offset().top-scroll_value
								}, 500);
							} else {
								$scope.publicUserEducation.push.apply($scope.publicUserEducation,result.detail);
								
								$('html, body').animate({
									scrollTop: $(".add-education").offset().top-scroll_value
								}, 500);
							}
							$(".add-Workplace").show();
						},500);
					},500);
				 } else if(result.status==417){
					form_id.find('#s2id_Education').select2("enable");
					form_id.find('#s2id_Institute').select2("enable");
					form_id.find('#s2id_Passout').select2("enable");
					form_id.find('#s2id_Qualification').select2("enable");
					form_id.find('#s2id_Field').select2("enable");
					$scope.submitting = false;		
					toastr.error('check enter values');
				 }
			}).finally(function() {
				
			});
		},500);	
	};
	
	$scope.removeEducation=function(id, index){
		var confirmation = confirm('Do you want to remove your qualification?');
		if(confirmation){
			$('#school-'+id).css('pointer-events','none');
			var data={};
			data['t'] = 'user';
			data['a'] = 'removeinfo';
			data['q'] = id; 
			data['r'] = 'school';
			$scope.remove = UserService.removeUserQualification(data); 
			$scope.remove.then(function(data) {
				 if(data.status==200){
					$timeout(function(){
						$('#school-'+id).css('background-color','rgba(255,0,0,0.1)').hide("fade",{direction:'up'},500);	
						$timeout(function(){
							$scope.publicUserEducation.splice(index, 1);
						},500);
					},200);
				 }	else {
					$('#school-'+id).css('pointer-events','');
				 }
			});
		}
	};
	
	$scope.removing = false;
	$scope.addMentor = function(mentor,type){
		var html		= '';
		if(type=='remove'){
			$r=confirm('Do you want to remove Mentor?');
			if ($r==true){ }else{ return false }
				html =	'<a class="btn btn-primary btn-select btn-select-light" ng-click="addMentor('+mentor+',\'add\')" ng-disabled="removing">\
							<span class="btn-select-value"><i class="fa fa-spinner fa-spin" ng-if="removing"></i> Follow Mentor</span>\
							<span class="btn-select-arrow glyphicon glyphicon-plus"></span>\
						</a>';
		} else{
				html =	'<a class="btn btn-primary btn-select btn-select-light" data-toggle="dropdown" ng-disabled="removing">\
							<span class="btn-select-value"><i class="glyphicon glyphicon-ok" ng-if="!removing"></i><i class="fa fa-spinner fa-spin" ng-if="removing"></i> Following</span>\
							<span class="btn-select-arrow glyphicon glyphicon-chevron-down"></span>\
						</a>\
						<ul class="dropdown-menu">\
							<li><a href="javascript:void(0)" ng-click="sendMessageToMentor(\''+$scope.base_path+'\', '+mentor+', '+$scope.loggedInUser+')">Send Message</a></li>\
							<li><a href="javascript:void(0)" ng-click="raiseQuestionToMentor(\''+$scope.base_path+'\', '+mentor+', '+$scope.loggedInUser+')">Ask Question</a></li>\
							<li><a href="javascript:void(0)" ng-click="addMentor('+mentor+', \'remove\')" id="remove-mentor-button">Unfollow Mentor</a></li>\
						</ul>';
		}
		$scope.removing = true;
		
		$scope.Mentoradd  	 = LifeSkills.SK_registerMentor(mentor); 
		$scope.Mentoradd.then(function(data){
			if(data == 'Please log in to continue!'){
				bootbox.confirm("Dear guest user you need to login first before sending 'become my mentor' request.", function(result) {
					if ( result ) {
						var landingUrl = "http://" + window.location.host + "/login?url=bWVudG9ycy9kaXJlY3Rvcnk=";
						window.location.href = landingUrl;
					}
				});
			}
			if (data.status == 200) {	
				$scope.removing = false;			
				$("#follow-button").html($compile(html)($scope));
			}
			if(data.html == 'insert'){
				toastr.success('Mentor added Successfully');
			}else if(data.html == 'delete'){
				toastr.success('Mentor removed Successfully');
			}
		}).finally(function() {
				
		});
	}
	
	$scope.workedTime = function(data){
		var from_date = new Date(data.year_from+'-'+data.month_from);
		if(data.currently_working_here == '1' || data.year_to =='0'){
			var end_date = new Date();
		} else {
			var end_date = new Date(data.year_to+'-'+data.month_to);
		}
		var diff_date	= new Date(end_date - from_date);
		var no_of_years = diff_date.toISOString().slice(0, 4) - 1970;
		var no_of_months= diff_date.getMonth();
		var no_of_days	= diff_date.getDate();
		if(no_of_years>0 || no_of_months >0){
			var text = "("+no_of_years+" ";
			text += (no_of_years>1)?"years ":"year ";
			text += no_of_months
			text += (no_of_months>1)?" months)":" month)";
			return text;
		} else {
			return '';
		}
	}
	
	$scope.expand = function(type){
		if(type=='education'){
			$scope.educationLimit = $scope.publicUserEducation.length;
			$scope.showLessForEducation = true;
		} else if(type=='experience'){
			$scope.experienceLimit = $scope.publicUserProfessional.length;
			$scope.showLessForExperience = true;
		}
	}
	
	$scope.collapse = function(type){
		if(type=='education'){
			$scope.educationLimit = 2;
			$scope.showLessForEducation = false;
		} else if(type=='experience'){ 
			$scope.experienceLimit = 2;
			$scope.showLessForExperience = false;
		}
	}	
	
	$scope.showHide = function(button_class){
		if($(button_class).siblings('.story-text').hasClass('show-less-text')){
			$(button_class).siblings('.story-text').removeClass('show-less-text');
			$(button_class).siblings('.dots-story-text').addClass('hide');
			$(button_class).html('<span class="button-text">Show Less</span> <span class="glyphicon glyphicon-chevron-up arrow-up"></span>');
		} else {
			$(button_class).siblings('.story-text').addClass('show-less-text');
			$(button_class).siblings('.dots-story-text').removeClass('hide');
			$(button_class).html('<span class="button-text">Show More</span> <span class="glyphicon glyphicon-chevron-down arrow-up"></span>');
		}
	}
	$scope.formatDate = function(date){
		date = date.split(' ')[0].split('-');
		date = date[1]+'/'+date[2]+'/'+date[0];
        var dateOut = new Date(date);
        return dateOut;
    };
		
	$scope.sendMessageToMentor = function(domain, mentor, mentee) {
    var sendMessage = bootbox.dialog({
        title: "Send your message to your mentor. | <small>Be specific while sending message and get instant response.</small>",
        message: '<div class="row">  ' +
            '<div class="col-md-12"> ' +
            '<div id="preview"></div>'+
            '<form class="form-horizontal" action="'+domain+'ajax/socialAjax?t=message&a=send_message" method="POST" name="sendMessageToMentor" id="sendMessageToMentor"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="name">Subject <span class="error">*</span></label> ' +
            '<div class="col-md-8"> ' +
            '<input id="subject" onkeypress="return event.keyCode != 13" name="subject" type="text" placeholder="Your Message is about..." class="form-control input-md" info="Message Subject" /> ' +
            '<input id="mentor" name="recipient_id" type="hidden" value="'+mentor+'" /> ' +
            '<input id="mentee" name="timeline_id" type="hidden" value="'+mentee+'" /> ' +
            '</div> </div>' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="awesomeness">Message <span class="error">*</span></label> ' +
            '<div class="col-md-8">' +
            '<textarea name="text" id="message" cols="50" rows="5" class="form-control" placeholder="Enter your message here." info="Message Body"></textarea>' +
            '</div>'+
            '</div>' +
            '</form></div></div>',
        buttons: {
            success: {
                label: "Send Message",
                className: "btn btn-primary btn-sm",
                callback: callback
            },
            danger: {
                label: "Cancel",
                className: "btn-default btn-sm",
                callback: function() {
                  //toastr.success("Sending new message to your mentor aborted.");
                }
            }
        },
        onEscape: function() {
        }
    });
    /****
     * call back function handle sending message request
     */
    function callback() {
        var can_submit_from = false;
        $("#sendMessageToMentor").ajaxForm({
            target: "#preview",
            beforeSubmit: function(arr, $form, options){
                var can_submit_from = true;
                $.each(arr, function(key, value){
                    if ( value.value=='' ) {
                        can_submit_from =  false;
                        toastr.error($('input[name='+value.name+'], textarea[name='+value.name+']').attr('info')+" is required field.");
						return false;
                    }
                });
                if(can_submit_from){
                    /*****
                    * Check if the user's sending messages to mentor
                    * has relation among them
                    */
                    var MentorMenteeRelated = false;
                    $.ajax({
                        method: "POST",
                        url: domain+"mentors/actionControls",
                        data: { mentor_id: mentor, mentee_id: mentee }
                    }).done(function( msg ) {
                        var d = JSON.parse(msg);
                        if ( d.success ) {
                            //yes, users are connected through mentor mentee relation
                            MentorMenteeRelated = true;
                        }
                        if (d.error) {
                            //no, users are not connected through mentor mentee relation
                            MentorMenteeRelated = false;
                        }
                        if ( !MentorMenteeRelated ) {
                            //toastr.error("huhh, cheating? You can only send message to your mentor");
                        }
                        return MentorMenteeRelated;
                    });
                    return true;
                } else {
                   return false; //ti will stop your submission.
                }
            },
            success: function(data) {
                if ( data.status==200 ) {
                    toastr.success("Your message has been sent successfully, you will get notified, thanks");
                    $("button.bootbox-close-button").trigger('click');
                    $("button.bootbox-close-button").trigger('click');
                    return true;
                } 
			else {
                    toastr.error("Oops, something went wrong. Can't dispatch your message at the moment. Kindly try after some time.");
                    return false;
                }
            }
        }).submit();
				if (!can_submit_from) {
					//code
					return false;
				} else {
					return true;
				}
			}
		}
	$scope.raiseQuestionToMentor = function(domain, mentor, mentee) {    
		bootbox.dialog({
			title: function(){            
				return "Send your question to your mentor. | <small>Be specific while sending question and get instant response.</small>";
			},
			message: function(){
				var form = '<div class="row">  ' +
				'<div class="col-md-12" id="asking-mentor"> ' +
				'<div id="preview"></div>'+
				'<form class="form-horizontal" action="'+domain+'mentors/menteeAskedQuestion" method="POST" name="sendMessageToMentor" id="sendMessageToMentor"> ' +
				'<div class="form-group"> ' + 
				'<h2 class="heading">Ask Mentor</h2>' +
				'<div class="col-md-12"> ' +
				'<input id="subject" name="title" type="text" placeholder="Enter your question here" class="form-control input-md enter-question" info="Message Subject" /> ' +
				'<input id="mentor" name="mentor_id[]" type="hidden" value="'+mentor+'" /> ' +
				'<input id="mentee" name="mentee_id" type="hidden" value="'+mentee+'" /> ' +
				'</div> </div>' +
				'<div class="form-group"> ' +            
				'<div class="col-md-12">' +
				'<textarea name="description" id="question_body" cols="50" rows="5" class="form-control describtion" placeholder="Description" info="Message Body"></textarea>' +
				'</div>'+
				'</div>'+           
				'<div class="form-group"> ' +            
				'<div class="col-md-12">'+
					'<div class="drag-drop">' +
						'<div class="image-upload">' +
							'<label for="file-input">'  +
								'Attach files from your computer' +
							'</label>' +
							'<input id="file-input" type="file" name="qdocs" onchange="displayFileName(this.value)" multiple="multiple" /><span id="fileInfo"></span>' +
							'<input type="hidden" name="content_type" value="question" />' +
						'</div>' +                    
					'</div>' +
				'</div>'+
				'</div>'+
				 '<div class="form-group hide"> ' +            
					 '<div class="col-md-12">'+
							'<div class="checkbox">' +
								'<label>' +
								'<input type="checkbox" name="privacy_type" onchange="toggleTagFields(this.value)" id="makeQuestionPublic"> Keep it public' +
								'</label>' +
							  '</div>' +
					 '</div>' +
				  '</div>   ' +
				'<div class="form-group hide" id="showPublictaggs"> ' +            
				'<div class="col-md-12">'+
				'<div id="make_q_public"><small class="topics">Topics</small>'+
				'<input type="text" onclick="prePopulateFields(this)" name="tag_field" id="tag_field" class="form-control" />'+
				'<input type="hidden" name="tag_fields" id="tag_fields" class="form-control" placeholder="Add Tags to your question." data="{}" style="width:100%;"/>'+
				'</div></div>'+
				'</div>'+
				'</form></div></div>';
				return form;
			},
			buttons: {
				success: {
					label: "Submit Question",
					className: "btn btn-primary btn-sm submit-question",
					callback: callback
				},
				danger: {
					label: "Cancel",
					className: "btn-danger btn-sm hide",
					callback: function() {
						//toastr.success("Sending new message to your mentor aborted.");
					}
				}
			},
			onEscape: function() {
				
			}
		});    
		/****
		 * call back function handle
		 * ask question request
		 */
		function callback() {
			var can_submit_from = false;
			$("#sendMessageToMentor").ajaxForm({
				//target:"#preview",
				beforeSubmit : function(arr, $form, options){                             
					if ($("#subject").val()=='') {
						//code
						can_submit_from =  false;
						toastr.error("Question title is required field.");				
						return false;
					}                
					if (!$("#subject").val().replace(/\s/g, '').length) {
						//code
						can_submit_from =  false;
						toastr.error("Invalid title, Kindly recheck and submit again.");				
						return false;
					} 
					return true;
				},
				success: function(data) {
					var d = JSON.parse(data);
					if ( d.statusCode==200 && d.success ) {
						toastr.success("Your Question has been sent successfully, you will get notified, thanks");
						$(".bootbox-close-button").trigger('click');
						return true;
					}
					if( d.statusCode==200 && d.error ) {
						toastr.error("Oops, something went wrong. Can't dispatch your message at the moment. Kindly try after some time.");
						return false;
					}
				}
			}).submit();
			if (!can_submit_from) {
				//code
				return false;
			} else {
				return true;
			}
		}
		
		// call pre-populate, tag fields in input box 
		$("#tag_field").trigger('click');
		$("textarea#question_body").wysihtml5({"style": true,"font-styles": true,"emphasis": true,"html": true,"color": true,"useLineBreaks":false});
		$("a[title='Insert image'], a[title='Link']").addClass('hide');
	}
	
	$scope.saveDetails = function(field, form_type){
		var fieldID				= '#'+field;
		var field_value			= $(".edit-"+field+" "+fieldID).val();
		if(form_type == 'career_goals'){
			$(".edit-"+field+" "+fieldID).select2('disable');
		} else {
			$(".about-content .story-text").removeClass("show-less-text");
			$(".about-content .more-story-text").addClass("hide");
		}
		
		$('.buttons-'+field+' .loader-icon').removeClass('hide');
		$('.buttons-'+field+' .loader-icon').siblings().addClass('hide');
		
		var data={};
		data[field]			=	field_value;
		data['form_type']	=	form_type;  
		
		$timeout(function(){
			$scope.updateInfo = LifeSkills.saveUserMentorshipAreas(data); 
			$scope.updateInfo.then(function(data) {
				if(data.status==200){
					$('.buttons-'+field+' .loader-icon').addClass('hide');
					$('.buttons-'+field+' .success-icon').css('display','none').removeClass('hide').fadeIn('slow');
					if(form_type == 'career_goals'){
						$timeout(function(){
							$scope.userMentorshipAreas = LifeSkills.getUserMentorshipAreas();
							$scope.userMentorshipAreas.then(function(data){
								$(".edit-"+field+" "+fieldID).select2('enable');
								$('.buttons-'+field+' .close-icon').trigger("click");
								$timeout(function(){
									$scope.mentorshipAreas  	= data.mentorshipAreas;
								},1000);
							}).finally(function() {
						
							});
						},1000);
					} else {
						$('.buttons-'+field+' .close-icon').trigger("click");
						$timeout(function(){
							$scope.summery = field_value;
							$timeout(function(){
								var divHeight = $(".about-content").find('.story-text').height();
								$(".about-content").find('.story-text').css('max-height',divHeight);
								var lineHeight = 23;
								var lines = Math.ceil(divHeight / lineHeight);
								if(lines>5){
									var story_text = $(".about-content");
									story_text.find('.more-story-text').removeClass('hide');
									story_text.find('.story-text').addClass('show-less-text');
								}
							},100);
						},1000);
					}
				} else {
					$(fieldID).select2('enable');
				}
			}).finally(function() {
				
			});
		}, 1000);
	}	
}]);

 /*********** Filter Controller ***********/
 
BA.controller ('mentorsFilterController', ['$scope', '$rootScope', '$http', 'LifeSkills', 'API', 'toastr', '$location', 'filterFilter',
                        function($scope, $rootScope, $http, LifeSkills, API, toastr, $location, filterFilter){
    
    $scope.showLoading = true
    $scope.mentorshipAreas          = {};
    $scope.mentorshipLocations      = {};
    $scope.mentorshipCategory       = {};
    
    $scope.mentors = LifeSkills.getUserMentorsDirectory();
    $scope.mentors.then(function(data) {
        $scope.mentorsData = data;
        $scope.players = $scope.mentorsData.detail.mentors;
        
        // Watch the pants that are selected
        $scope.$watch(function () {
            return {
                players     :$scope.players,
				usePants    :$scope.mentorshipCategory,
                useShirts   :$scope.mentorshipAreas,
                useShoes    :$scope.mentorshipLocations
            }
        }, function (value) {
            var selected;
            
            $scope.count = function (prop, value) {
                return function (el) {
                    return el[prop] == value;
                };
            };
            
            $scope.pantsGroup       = $scope.mentorsData.detail.all_industries;
            var filterAfterPants    = [];        
            selected = false;
            for (var j in $scope.players) {
                var p = $scope.players[j];
                for (var l in $scope.mentorshipCategory) {
                    if ($scope.mentorshipCategory[l]) {
                        selected = true;
                        if (p.industry[0] && p.industry[0].industry.indexOf(l) != -1){
                            filterAfterPants.push(p);
                            break;
                        }
                    }
                }        
            }
            
            if (!selected) {
                filterAfterPants = $scope.players;
            }
    
            $scope.shirtsGroup = $scope.mentorsData.detail.all_skills;
            var filterAfterShirts = [];        
            selected = false;
            for (var j in filterAfterPants) {
                var p = filterAfterPants[j];
                for (var l in $scope.mentorshipAreas) {
                    if ($scope.mentorshipAreas[l]) {
                        selected = true;
                        if (p.skills[0] && p.skills[0].name.indexOf(l) != -1){
                            filterAfterShirts.push(p);
                            break;
                        }
                    }
                }       
            }
            
            if (!selected) {
                filterAfterShirts = filterAfterPants;
            }
    
            $scope.shoesGroup       = $scope.mentorsData.detail.all_locations;
            var filterAfterShoes    = [];        
            selected = false;
            for (var j in filterAfterShirts) {
                var p = filterAfterShirts[j];
                for (var l in $scope.mentorshipLocations) {
                    if ($scope.mentorshipLocations[l]) {
                        selected = true;
						
                        if (p.where_provide[0].city && p.where_provide[0].city.indexOf(l) != -1){
                            filterAfterShoes.push(p);
                            break;
                        }
                    }
                }    
            }
            if (!selected) {
                filterAfterShoes = filterAfterShirts;
            }        
    
            $scope.filteredPlayers = filterAfterShoes;        
        }, true);
        
        $scope.$watch('filtered', function (newValue) {
            if (angular.isArray(newValue)) {
                console.log(newValue.length);
            }
        }, true);
        
        $scope.removeMentor = function(mentorData, index) {
			var answer = confirm("Do you want to remove your mentor ?");
			if ( answer ) {
				$scope.mentorRemove = LifeSkills.removeMentor(mentorData);
				$scope.mentorRemove.then(function( data ){
					var d = data;
					if ( d.detail && d.statusCode==200 ) {
						//code
						toastr.success(d.detail);
						$scope.filteredPlayers.splice(index, 1);
					}
					if ( d.error && d.statusCode==200 ) {
						toastr.error(d.message+', can not remove the comment.');
					}               
				},function(error) {
					//toastr.error(error+': Invalid credentials given.');
				}).finally(function() {
					$scope.loading  =false;
				});
			}
        }
    }, function(error) {

    }).finally(function() {
        $scope.showLoading = false
    });
}]);

BA.controller('pymk', ['$scope', '$rootScope', '$http', 'UserService', 'Utils', '$timeout',
                        function($scope, $rootScope, $http, UserService, Utils, $timeout){
	$scope.showLoading  = true;
	$scope.showLoadMore = true;
	$scope.searching    = false;
	
	$scope.offset = 0;
	$scope.suggestedFriendsList   = UserService.friendbySuggestion($scope.offset, 20); // Service to return all friend suggestions
    $scope.suggestedFriendsList.then(function(data){
		$scope.suggestedFriends = data.friends;
		$scope.totalSuggestions = data.total_count;
		$scope.offset = $scope.offset + $scope.suggestedFriends.length;
		if($scope.totalSuggestions<=20){
			$scope.showLoadMore=false;
		}
    },function(error) {

    }).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},1000);
    }); 
	$scope.addFriend = function(userid, index){ 
		btn = $('.friend-btn-'+userid);
		btn.attr('disabled','disabled');
		btn.find('i').removeClass('hide');
		$timeout(function(){
			$scope.addFriends = UserService.SK_registerFollow(userid);
			$scope.addFriends.then(function(data){
				if (data.status == 200) {
					$scope.offset = $scope.offset-1; 
					btn.find('i').addClass('hide');
					
					$timeout(function(){
						toastr.success('Friend Request Sent Successfully');
						btn.html('<i class="fa fa-check progress-icon"></i> Requested').css('background-color','#fbb03d');
					},500);
					
					if($scope.showLoadMore){
						$scope.singleSuggestedFriend   = UserService.friendbySuggestion($scope.offset, 1); // Service to return all friend suggestions
						$scope.singleSuggestedFriend.then(function(data){
							$scope.offset = $scope.offset + data.friends.length;
							$timeout(function(){
								btn.attr('disabled',false);
								$('#friend-container-'+userid).hide("fade",{direction:'down'},600);
								$timeout(function(){
									$scope.suggestedFriends.push.apply($scope.suggestedFriends,data.friends);
									$scope.suggestedFriends.splice(index, 1);
								},800);
							},1000);
							if(data.friends.length==0 || data.total_count==$scope.suggestedFriends.length){
								$scope.showLoadMore=false;
							}
						},function(error) {

						}).finally(function() {
							
						});
					} else {
						$timeout(function(){
							btn.attr('disabled',false);
							$('#friend-container-'+userid).hide("fade",{direction:'down'},600);
							$timeout(function(){
								$scope.suggestedFriends.splice(index, 1);
							},800);
						},1000);
					}
				}
			},function(error){
				
			}).finally(function(){
			});
		},1000);
	};
	$scope.moreSuggestions = function(){
		$scope.searching = true;
		$('.btn-load-more i').removeClass('hide');
		$timeout(function(){
			$scope.moreSuggestedFriendsList   = UserService.friendbySuggestion($scope.offset, 20);
			$scope.moreSuggestedFriendsList.then(function(data){
				$scope.offset = $scope.offset + data.friends.length;
				$scope.suggestedFriends.push.apply($scope.suggestedFriends,data.friends);
				if(data.friends.length==0 || data.friends.length<20 || data.total_count==$scope.suggestedFriends.length){
					$scope.showLoadMore=false;
				}
				$('.btn-load-more i').addClass('hide');
			},function(error) {

			}).finally(function() {
				$scope.searching = false;
			});
		},1000);
	};
}]);
BA.controller('timelineFriendsPageController', ['$scope', '$compile', '$http', 'UserService', 'toastr', '$location', 'Utils', '$timeout',
                        function($scope, $compile, $http, UserService, toastr, $location, Utils, $timeout){
	var url     = $location.absUrl(); 
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var uid   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var uid   = url[url.length-1];
    }
	$scope.timeline_id = uid;
	$scope.showLoading   = true;
	$scope.friendsList   = UserService.timelineFriends(uid); // Service to return all friend suggestions
    $scope.friendsList.then(function(data){
		$scope.logged_in_user   = data.detail.logged_in_user;
		$scope.friends 			= data.detail.friends;
		$scope.mutual_friends   = data.detail.mutual_friends;
    },function(error) {

    }).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},1000);
    });
	$scope.request_actions = function(id, type, index){
		var friend_text = "";
		var element = (type=='mutual')?$(".following-"+id):$(".follow-"+id);
		friend_text = element.find("span.follow-text").text();
		console.log
		if(friend_text=='Unfriend'){
			$r=confirm('Do you want to remove your friend?');
			if ($r==true){ }else{ return false }
			element.parents('.dropdown-menu').siblings().html('<i class="fa fa-spinner fa-spin"></i> Requesting').attr('disabled',true);
		} else if(friend_text=="Requested"){
			$r=confirm('Do you want to remove request?');
			if ($r==true){ }else{ return false }
			element.html('<i class="fa fa-spinner fa-spin"></i> Requesting').attr('disabled',true);
		} else {
			element.html('<i class="fa fa-spinner fa-spin"></i> Requesting').attr('disabled',true);
		}
		
		$timeout(function(){
			$scope.friendsRequest   = UserService.SK_registerFollow(id); // Service to return all friend suggestions
			$scope.friendsRequest.then(function(data){
				if(data.status == 200){
					if(type=='mutual' && friend_text=='Unfriend'){
						$timeout(function(){
							$('#friend-block-'+id).hide("fade",{direction:'down'},600);
							toastr.success("Friend removed Successfully");
							$timeout(function(){
								$scope.mutual_friends.splice(index,1);
							},800);
						},1000);
					} else if(friend_text=='Unfriend'){
						element.parents('.dropdown-menu').siblings().remove();
						element.parents('.dropdown-menu').before(
																$compile('<button type="button" data-toggle="dropdown" class="friend-btn full-width-class"><a href="javascript:void(0);" class="follow-'+id+'" ng-click="request_actions('+id+',\'friend\');">\
																		<i class="fa fa-plus progress-icon"></i> <span class="follow-text">Add Friend</span>\
																	</a></button>')($scope)
																);
						element.parents('.dropdown-menu').remove();
						toastr.success("Friend removed Successfully");
					} else {
						if(friend_text=="Requested"){
							element.html('<i class="fa fa-plus progress-icon"></i> <span class="follow-text">Add Friend</span>');
							toastr.success("Friend request removed Successfully");
						} else {
							element.html('<i class="fa fa-check progress-icon"></i> <span class="follow-text">Requested</span>');
							toastr.success("Friend request sent Successfully");
						}
					}
				} else {
					if(friend_text.trim()=='Unfriend'){
						element.parents('.dropdown-menu').siblings().html('Your Friend <span class="caret"></span>').attr('disabled',false);
					} else if(friend_text.trim()=='Requested') {
						element.html('<i class="fa fa-check progress-icon"></i> <span class="follow-text">Requested</span>').attr('disabled',true);
					} else {
						element.html('<i class="fa fa-plus progress-icon"></i> <span class="follow-text">Add Friend</span>').attr('disabled',true);
					}
				}
			},function(error) {

			}).finally(function() {
				
			});
		},1000);
	};
}]);
BA.controller('userDirectoryController', ['$scope', '$compile', '$http', 'UserService', 'toastr', '$location', 'Utils', '$timeout',
                        function($scope, $compile, $http, UserService, toastr, $location, Utils, $timeout){
	$scope.offset		 = 0;
	$scope.showLoading   = true;
	$scope.showLoadMore	 = true;
	$scope.filtering	 = false;
	var filter = $('#filter-form').serialize();
	
	$scope.usersList  	 = UserService.userDirectory(filter, $scope.offset); // Service to return all friend suggestions
    $scope.usersList.then(function(data){
		$scope.users 		= data.detail.users;
		$scope.users_count	= data.detail.total;
		$scope.offset = $scope.offset + $scope.users.length;
		if($scope.users_count<=20){
			$scope.showLoadMore=false;
		} else {
			$scope.showLoadMore=true;
		}
    },function(error) {

    }).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},2000);
    });
	
	$scope.findUserByFilter = function(){
		$("html,body").animate({scrollTop:0}, 300);
		$timeout(function(){
			$scope.showLoading   = true;
			$scope.filtering	 = true;
			var flag = 1;
			$('#filter-form .input-group>input[type="text"]').each(function(){
				if($(this).val() != '' && $(this).val().trim() != ''){
					flag = 0;
					return false;
				}
			});
			if(flag == 1){
				if($('input[name=alumni]:checked').val() == 'all')
				$('#only-alumni').trigger('click');
			}
			var filter = $('#filter-form').serialize();
			$scope.offset = 0;
			$scope.usersList  	 = UserService.userDirectory(filter, 0); // Service to return all friend suggestions
			$scope.usersList.then(function(data){
				$scope.users 		= data.detail.users;
				$scope.users_count	= data.detail.total;
				$scope.offset = $scope.offset + $scope.users.length;
				if($scope.users_count<=20){
					$scope.showLoadMore=false;
				} else {
					$scope.showLoadMore=true;
				}
			},function(error) {

			}).finally(function() {
				$timeout(function(){
					if($(window).width()<=991){
						$('#right-panel-result').removeClass('show');
						$('.refine_search_bg').hide();
						$('body').removeClass('overflow-hidden');
					}
					$scope.showLoading	= false;
					$scope.filtering	= false;
				},2000);
			});
		}, 300);
	};
	
	$scope.loadMoreUsers = function(){
		$scope.searching = true;
		$('.btn-load-more i').removeClass('hide');
		$timeout(function(){
			filter = $('#filter-form').serialize();
			$scope.moreUsersList   = UserService.userDirectory(filter, $scope.offset);
			$scope.moreUsersList.then(function(data){
				$scope.offset = $scope.offset + data.detail.users.length;
				$scope.users.push.apply($scope.users,data.detail.users);
				if(data.detail.users.length==0 || data.detail.users.length<20 || data.detail.total_count==$scope.users.length){
					$scope.showLoadMore=false;
				} else {
					$scope.showLoadMore=true;
				}
				$('.btn-load-more i').addClass('hide');
			},function(error) {

			}).finally(function() {
				$scope.searching = false;
			});
		},2000);
	};
	$scope.getDetail = function(data, type){
		if(type == 'education'){
			if(data.institute_name !== null && data.institute_name !== ""){
				if(data.field_name !== null && data.field_name != "" && data.field_name !== undefined && data.currently_studing_here == '1'){
					return '<i class="fa fa-graduation-cap align"></i> Studying '+data.field_name+' at <span class="info">'+data.institute_name+'</span>';
				} else if(data.field_name !== null && data.field_name != "" && data.field_name !== undefined && data.to_year !== null && data.to_year > 0 && data.currently_studing_here == "0" ) {
					return '<i class="fa fa-graduation-cap align"></i> Studied '+data.field_name+' at <span class="info">'+data.institute_name+'</span> in <span class="info">'+data.to_year+'</span>';
				} else if(data.field_name !== null && data.field_name != "" && data.field_name !== undefined) {
					return '<i class="fa fa-graduation-cap align"></i> Studied '+data.field_name+' at <span class="info">'+data.institute_name+'</span>';
				} else if(data.currently_studing_here == "0" && data.to_year !== null && data.to_year > 0) {
					return '<i class="fa fa-graduation-cap align"></i> Studied at <span class="info">'+data.institute_name+'</span> in <span class="info">'+data.to_year+'</span>';
				} else if(data.currently_studing_here == "1"){
					return '<i class="fa fa-graduation-cap align"></i><span> Studying at <span class="info">'+data.institute_name+'</span>';
				} else {
					return '<i class="fa fa-graduation-cap align"></i> Studied at <span class="info">'+data.institute_name+'</span>';
				}
			} else {
				return '';
			} 
		} else if( type == 'professional'){
			if(data.companyname !== null && data.companyname !== ""){
				if(data.designation !== null && data.designation !== "" && data.currently_working_here == '1'){
					return '<i class="fa fa-briefcase align" ></i> Working as '+data.designation+' at <span class="info">'+data.companyname+'</span>';
				} else if(data.designation !== null && data.designation !== "" && data.year_to>0 && data.year_to !== null) {
					return '<i class="fa fa-briefcase align"></i> Worked as '+data.designation+' at <span class="info">'+data.companyname+'</span> in <span class="info">'+data.year_to+'</span>';
				} else if(data.year_to>0 && data.year_to !== null && data.currently_working_here != "1") {
					return '<i class="fa fa-briefcase align"></i> Worked at <span class="info">'+data.companyname+'</span> in <span class="info">'+data.year_to+'</span>';
				}  else if( data.currently_working_here == "1") {
					return '<i class="fa fa-briefcase align"></i> Working as at <span class="info">'+data.companyname+'</span>';
				} else {
					return '<i class="fa fa-briefcase align"></i> Worked at <span class="info">'+data.companyname+'</span>';
				}
			} else {
				return '';
			} 
		}
	};
}]);
BA.controller ('inviteController', ['$scope', '$rootScope', '$http', 'UserService', 'Utils', '$timeout','$window','$cookies','$cookieStore', 'ngDialog', '$location',
                        function($scope, $rootScope, $http, UserService, Utils, $timeout, $window, $cookies, $cookieStore, ngDialog, $location) {
	
	$scope.limit        		= 12; 
	$scope.offset				= 0;
	$scope.noSelectedContacts	= 0;
	$scope.customEmail			= {};
	$scope.customEmail['to']	= '';
	
	$scope.submitted			= false;
	$scope.submitting			= false;
	$scope.showLoadMore 		= true;
	$scope.customEmailError		= false;
	$scope.openingPopup 		= false;
	
	var url	= $location.absUrl();
	var hash=''; 
    if(url.indexOf('#') === -1){
        url = url.split("/");
    } else {
        url = url.split("#");
		hash= url[1];
        url = url[0].split("/");
    }
	if(url[3] == 'invite'){
		$scope.section			= 'website';
		$scope.section_id		= 0;
	} else if(url[3] == 'groups' || url[3] == 'pages'){
		$scope.showLoading 		= true;
		$scope.section			= (url[3] == 'groups')?'group':'page';
		$scope.section_id		= url[url.length-1];
		$timeout(function(){
			$scope.groupInfo		= UserService.getGroupOrPageDetails($scope.section_id, $scope.section, 1); // Service to return all friend suggestions
			$scope.groupInfo.then(function(data){
				$scope.info			= data;
				$scope.showLoading 	= false;
			},function(error) {

			}).finally(function() {
				
			});
		},1000);
	} else if(url[3] == 'event'){
		$scope.showLoading 		= true;
		$scope.section			= 'event';
		$scope.section_id		= url[url.length-1];
		$timeout(function(){
			$scope.eventInfo		= UserService.getEventDetails($scope.section_id); // Service to return all friend suggestions
			$scope.eventInfo.then(function(data){
				$scope.info			= data;
				$scope.showLoading 	= false;
			},function(error) {

			}).finally(function() {
				
			});
		},1000);
	}
	
    $scope.loadmore     = function() {
		if(!$scope.ajaxLoading){
			$scope.offset		+= $scope.limit; 
			$scope.ajaxLoading 	 = true; 
			$scope.searching	 = true;
			
			$timeout(function(){
				$scope.moreFriendsList = UserService.importedFriendsList($scope.section_id, $scope.section, $scope.offset, $scope.limit);
				$scope.moreFriendsList.then(function( data ){
					$scope.importedFriends.push.apply($scope.importedFriends,data.users);
					if( data.users.length==0 || data.length<$scope.limit){
						$scope.showLoadMore = false;
					}
				}, function(error) {
		
				}).finally(function() {
					$scope.ajaxLoading = false; 
					$scope.searching=false;
				});
			}, 1000);
		}
    }
	
	$scope.importedFriendsList   = UserService.importedFriendsList($scope.section_id, $scope.section, $scope.offset, $scope.limit); // Service to return all friend suggestions
    $scope.importedFriendsList.then(function(data){
		$scope.importedFriends   = data.users;
		$scope.logged			 = data.logged;
		if($scope.importedFriends.length>0 && $cookies.invitePopUpForLoggedOutUser == 'success'){
			$scope.displayImportDialog();
		} 
    },function(error) {

    }).finally(function() {
		
    });
	
	$scope.deleteImport = function( importee, index) {
		var confirmation = confirm("Do you want to remove?");
		if(confirmation){
			$scope.importedFriendsList  = UserService.removeFriendsListImport(importee);
			$timeout(function(){
				$scope.importedFriends.splice(index,1);
			},3000);
		}
	}
	
	//$cookies.importPopUp = 'cookei1';
	
	$scope.displayImportDialog = function(source) {
		$scope.openingPopup = true;
		$timeout(function () {
			$scope.importedFriendsList   = UserService.importedFriendsList($scope.section_id, $scope.section, 0, 0, source); // Service to return all friend suggestions
			$scope.importedFriendsList.then(function(data){
				$scope.inviteFriendsData    = data.users;
				if($scope.inviteFriendsData.length > 0 ){ 
					$scope.importedFriends.push.apply($scope.importedFriends, $scope.inviteFriendsData);
					if($scope.logged){
						$cookieStore.remove("invitePopUpForLoggedOutUser");
						$scope.noSelectedContacts	= $scope.inviteFriendsData.length;
						$scope.modalInstance = ngDialog.open({
							template: 'iniviteDialog.html',
							className: 'ngdialog-theme-default ng-dialog-referral-popup-container',
							data: $scope.inviteFriendsData,
							scope:$scope
						});
					} else {
						if($cookies.invitePopUpForLoggedOutUser != 'success'){
							var oneHour = new Date();
							oneHour.setTime(oneHour.getTime()+(1*60*60*1000));
							document.cookie = "invitePopUpForLoggedOutUser=success; expires="+oneHour+"; path=/";
						
							$scope.modalInstance = ngDialog.open({
								template: 'signInOrSingUpDialog.html',
								className: 'ngdialog-theme-default ng-dialog-referral-popup-container',
								scope:$scope,
								showClose:false,
								closeByDocument: false
							});
						}
					}
				}
			},function(error) {
		
			}).finally(function() {
				$scope.openingPopup = false;
			});
		}, 1000);
	}
	
	$scope.OpenPopupWindow = function ( link, title, w, h, source ) {
		// Fixes dual-screen position                         Most browsers      Firefox
		var dualScreenLeft 	= window.screenLeft != undefined ? window.screenLeft : screen.left;
		var dualScreenTop 	= window.screenTop != undefined ? window.screenTop : screen.top;
	
		var width 			= window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height 			= window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
	
		var left 			= ((width / 2) - (w / 2)) + dualScreenLeft;
		var top 			= ((height / 2) - (h / 2)) + dualScreenTop;
		var newWindow 		= window.open(link, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
		
		// Puts focus on the newWindow
		if (window.focus) {
			newWindow.focus();
		}
		window.CallParentfunction= function () {  
			$scope.displayImportDialog(source);
		} 
		$cookies.importPopUp = 'cookei2';
		
		/*$timeout(function(){
			newWindow.addEventListener("unload", $scope.displayImportDialog(source));
		},4000);
		 newWindow.onbeforeunload = function(){
			$scope.displayImportDialog(source);
		} 
		//newWindow.addEventListener("unload", $scope.displayImportDialog(source));
		newWindow.onunload = $scope.displayImportDialog(source);*/
    }
	
	$scope.addCustomEmail = function(){
		if( $("#invite-friends .inner-box .box").length == 0 ){
			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if($scope.customEmail.to == '' || !regex.test($scope.customEmail.to)){
				$scope.customEmailError		= true;
				return false;
			} else {
				$scope.customEmailError		= false;
			}
			$scope.customInvite	= true;
			var values			= {};

			values['to'] 		= $scope.customEmail.to;
			values['toName']	= $scope.customEmail.to.split("@")[0];
			values['status']	= '0';
			values['section']	= $scope.section;
			values['section_id']= $scope.section_id;
			if($scope.customEmail.to.split("@")[1] == "gmail.com"){
				values['source']= 'google';
			} else {
				values['source']= 'yahoo';
			}
			$timeout(function(){
				$scope.addFriend	= UserService.inviteFriend(values);
				$scope.addFriend.then(function(data){
					$scope.importedFriends.unshift(data);
					var popupData	= [];
					popupData[0]	= data;
					$scope.customEmail.to	= '';
					$scope.customInvite = false;
					$scope.modalInstance = ngDialog.open({
						template: 'iniviteDialog.html',
						className: 'ngdialog-theme-default ng-dialog-referral-popup-container',
						data: popupData,
						scope:$scope
					});
				},function(error){
					
				}).finally(function(){
					
				});
			},1000);
		}
	}
	
	$scope.openInvitePopup = function(data){
		if($scope.logged){
			var contact = [];
			contact[0] = data;
			$scope.noSelectedContacts = 1;
			$scope.modalInstance = ngDialog.open({
				template: 'iniviteDialog.html',
				className: 'ngdialog-theme-default ng-dialog-referral-popup-container',
				data: contact,
				scope:$scope
			});
		} else {
			$scope.modalInstance = ngDialog.open({
				template: 'signInOrSingUpDialog.html',
				className: 'ngdialog-theme-default ng-dialog-referral-popup-container',
				scope:$scope
			});
		}
	}
	
	$scope.send_invites = function(){
		$(".wysihtml5-sandbox").css('border-color','rgb(239, 239, 239)');
		$('.error').addClass('hide');
		
		var invite_message = tinymce.get('invite-message').getContent();
		
		if($('.checkbox-custom:checked').length == 0){
			$('.error.recipient_error').removeClass('hide');
			return false;
		}
		if(invite_message == '' || invite_message.trim() == ''){
			$(".wysihtml5-sandbox").css('border-color','#eb6a5a');
			$('.error.message_error').removeClass('hide');
			return false;
		}
		var id =[];
		$('.checkbox-custom:checked').each(function() {
		   id.push($(this).val());
		});
		
		var data = {};
		data['id'] 		= id;
		data['status']	= '1';
		data['message']	= $("#invite-message").val();
		
		$scope.submitting = true;
		$timeout(function(){
			$scope.sendInvitation = UserService.send_invites(data);
			$scope.sendInvitation.then(function(data){
				$scope.submitting = false;
				if(data.statusCode == 200){
					$scope.submitted = true;
					$("#customEmail").val('');
					$scope.offset = 0;
					$scope.refreshFriendsList   = UserService.importedFriendsList($scope.section_id, $scope.section, $scope.offset, $scope.limit); // Service to return all friend suggestions
					$scope.refreshFriendsList.then(function(data){
						$scope.importedFriends   = data.users;
						$timeout(function(){
							$scope.modalInstance.close();
							$scope.submitted = false;
						},1000);
					},function(error) {

					}).finally(function() {
						
					});
				}
			}, function(error){
				
			}).finally(function(){
				
			});
		},1000);
	}
	
	$scope.doIfChecked = function(index){
		if($('#checkbox-' + index).is(":checked")){
			$scope.noSelectedContacts += 1;
		} else {
			$scope.noSelectedContacts -= 1;
		}
		count_of_checkbox 			= $("#myModal .checkbox-custom").length; 
		count_of_checked_checkbox	= $("#myModal .checkbox-custom:checked").length; 
		if(count_of_checkbox == count_of_checked_checkbox){
			$('#selectAll').prop('checked', true);
			$('#checkAll').text('Deselect All');
			$scope.checkedAll = true;
		} else {
			$('#selectAll').prop('checked', false);
			$('#checkAll').text('Select All');
			$scope.checkedAll = false;
		}
	}
	
	$scope.selectAll = function(value){
		if($("#selectAll").is(":checked")){
			$scope.noSelectedContacts = $scope.inviteFriendsData.length;
		} else {
			$scope.noSelectedContacts = 0;
		}
		$('input:checkbox').prop('checked', value);
	}
}]);

BA.controller ('mentorsContentController', ['$scope','$location', '$rootScope', '$http', 'UserService', 'LifeSkills', 'Utils', 'toastr', '$timeout', 
 function($scope, $location, $rootScope, $http, UserService, LifeSkills, Utils, toastr, $timeout) {
	$scope.loading      =true;
    $scope.dataLength   =0;
    var limitStep       =5; 
	
    var url             = $location.absUrl();
    url                 = url.split("#");
    url                 = url[0].split("/");

    var user_id         = (url[url.length-1]!='')?url[url.length-1]:0;
    var content_type    = url[url.length-2];
    $scope.url = url;
	
    $scope.mentorQaList =UserService.mentorContentDetails(user_id, content_type); // Service to return all reviewslist
    $scope.mentorQaList.then(function(data){
        $scope.results  =data;
        $scope.submitComment =function(d, e) {
		
            $("#commentsOnQ"+d.id).ajaxForm({
			
                beforeSubmit: function(arr, $form, options){
                    var can_submit_from = true;
                    $.each(arr, function(key, value){
                        if ( value.value=='' || value.value.trim()==0){
                            can_submit_from =  false;
                            toastr.error("Kindly write something in comment box before submitting.");
                        }
                    });
                    if( can_submit_from ){
					
                        return true; //it will continue your submission.
                    } else {
					
                        return false; //ti will stop your submission.
                    }
                },
                success: function(data){
                    var d = JSON.parse(data);
					
                    if (d.success && d.statusCode==200) {
                        //code
                        //$scope.comments.push(d.detail);
						$scope.latestComments.push(d.detail);
                        $(".QComments").val('');
                        //var elem = $(".commentsDivision");
                        //if (elem[0].scrollHeight - elem.scrollTop() != elem.outerHeight()) {
                            //console.log("bottom");
                            var height = 0;
                            $('.commentsDivision span').each(function(i, value){
                                height += parseInt($(this).height());
								
                            });                        
                            height += '';
                            $('.commentsDivision').animate({scrollTop: height});
                        //}
                        toastr.success("Your Comment posted successfully.");
                        //window.location.href = '/mentor/profile/'+param_1;
                        //$scope.loadmore();
                    }
                    if (d.error && d.statusCode==200) {
                        //code
                        toastr.error("Can not post your comment at the moment, please try later.");
                    }
                }
            }).submit();
        };
        $scope.showQuestions = function(type) {
			$scope.searchInMentorData = type;
		};
  
        $scope.likeQuestionAnswer   =function(entity) {
            $.ajax({
                type    :'POST',
                url     :'/mentors/likeQuestionAnswer',
                data    :{q_id:entity.id, answer_id:0, answered_by:0, type:'like'},
                success :function(data) {
                    var d = JSON.parse(data);
                    if ( d.success && d.statusCode==200 ) {
						if(d.already_like=="1"){
							//toastr.success("Already marked as helpful.");
						} else {
							toastr.success("Marked as helpful, Success !");
							entity.likes = d.count[0].count;							
							var html = '<a href="javascript:void(0)" class="good" title="You marked as helpful"><span></span>Helpful(<strong id="answer'+entity.id+'likes">'+d.count[0].count+'</strong>)</a>';
							$("#likeQuestionButton_"+entity.id).parents(".helpfull-text").html(html);
						}
                    }
                }
            });
        };
        $scope.dislikeQuestionAnswer =function(entity){
            $.ajax({
                type    :'POST',
                url     :'/mentors/likeQuestionAnswer',
                data    :{q_id:entity.id, answer_id:'', answered_by:'', type:'dislike'},
                success :function(data) {
                    var d = JSON.parse(data);
                    if ( d.success && d.statusCode==200 ) {
                        //code
                        //toastr.success("You have successfully done dislike operation");
                        entity.dislikes = d.count[0].count;
                    } 
                }
            });
        };
        $scope.addMentor = function(mentor, mentee, domain, relation) {
			var entity={'user_id':mentor.id};
			$timeout(function(){
				$scope.addMentors = LifeSkills.addMentor(entity);
				$scope.addMentors.then(function(data){
					if (data.status == 200) {
						toastr.success('Mentor added Successfully');
						$('.dropdown .mentorsButton').text('Following Mentor');
						$('.mentorsButton').append('<span>'+data.Followers+'</span>');
						$('.dropdown').css('pointer-events','none');
					}
				},function(error){
					
				}).finally(function(){
					setTimeout(function(){
						location.reload();	
					},1000);					
				});
			},500);
			/* var sendMessage = bootbox.dialog({
                title: "Adding My Mentor",
                message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<div id="preview"></div>'+
                    '<form class="form-horizontal" action="/ajax/socialAjax?t=follow&a=mentor" method="POST" name="sendMessageToMentor" id="sendMessageToMentor"> ' +
                    '<div class="form-group"> ' +
                    '<div class="col-md-6"> ' +
                    '<input id="mentor" name="following_id" type="hidden" value="'+mentor.id+'" /> ' +
                    '</div> </div>' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-2 control-label" for="awesomeness">Message*</label> ' +
                    '<div class="col-md-8">' +
                    '<textarea name="text" id="message" cols="50" rows="5" class="form-control" placeholder="Enter your message here." info="Message Body">Hello '+mentor.first_name+' '+mentor.last_name+', I find your experience so high that I add you to mentor me with your expertise.</textarea>' +
                    '</div>'+
                    '</div>' +
                    '</form></div></div>',
                buttons: {
                    success: {
                        label: "Send",
                        className: "btn btn-primary btn-sm",
                        callback: callback
                    },
                    danger: {
                        label: "Cancel",
                        className: "btn-danger btn-sm",
                        callback: function() {
                          //toastr.success("Sending request to mentor aborted by user.");
                        }
                    }
                },
                onEscape: function() {
                    
                }
            }); 
			 
            function callback(args) {
                //code
                var can_submit_from = false;
                $("#sendMessageToMentor").ajaxForm({
                    target: "#preview",
                    beforeSubmit: function(arr, $form, options){
                        var can_submit_from = true;
                        $.each(arr, function(key, value){
                            if ( value.value.trim()=='') {
                                can_submit_from =  false;
                                toastr.error($('input[name='+value.name+'], textarea[name='+value.name+']').attr('info')+" is required field.");
								return false;
                            }
                        });
                        if(can_submit_from){        
                            if ( relation.related==0 ) {
                                return true;
                            }                            
                            if ( relation.related==1 && relation.active==0 ) {
                                //code
                                var answer = confirm("You have already sent the request, do you want to send request again ?");
                            }                            
                            if ( answer ) {
                                //code
                                $.ajax({
                                    method: "POST",
                                    url: domain+"/mentors/actionControls",
                                    data: { mentor_id: mentor.id, mentee_id: mentee.id, task:'request_again', active:0 }
                                }).done(function( msg) {
                                });
                                return true;
                            } else {
                                return false;
                            }                            
                        } else {
                           return false; //ti will stop your submission.
                        }
                    },
                    success: function(data) {
                        if ( data.status==200 && data.html=='insert') {
                            toastr.success("Mentor has been added successfully.");
                            $("button.bootbox-close-button").trigger('click');
                            $("button.bootbox-close-button").trigger('click');
                            //$scope.results.mentorMenteeRelation[0].active=0;
                            location.reload();
                            return true;
                        } else {
                            toastr.error("Oops, something went wrong. Can't dispatch your message at the moment. Kindly try after some time.");
                            return false;
                        }
                    }
                }).submit();
                if (!can_submit_from) {
                    //code
                    return false;
                } else {
                    return true;
                }
            }   */    
        }
	
		$scope.removeMentor = function(id, buttonid) {   
			if(buttonid == 'requested_btn'){
				var answer = confirm("Do you want to remove mentor request?");
			} else {
				var answer = confirm("Do you want to remove your mentor ?");
			}
           
			if ( answer ) {
				var mentorData={'user_id':id};
				$('#'+buttonid).attr('disabled', 'disabled');
				$scope.mentors  =LifeSkills.addMentor(mentorData);
				$scope.mentors.then(function(data) {
					if (data=='Please log in to continue!') {
						bootbox.confirm("Dear guest user you need to login first before sending 'become my mentor' request.", function(result) {
							if ( result ) {
								var landingUrl = "http://" + window.location.host + "/login?url=bWVudG9ycy9kaXJlY3Rvcnk=";
								window.location.href = landingUrl;
							}
						});
					}else if (data.status==200 && data.html=="delete") {
						
						if(buttonid == 'requested_btn'){
							toastr.success("Mentor request removed Successfully");
						} else {
							toastr.success("Mentor Remove Successfully");
						}
						setTimeout(function(){
							location.reload();	
						},2000);
					}
				},function(error) {

				}).finally(function() {
					
				});
			}
        }
    },function(error) {
        //toastr.error(error+': Invalid credentials given.');
    }).finally(function() {
        $scope.loading  =false;
    });
    $scope.latestComments = [];

	$scope.removeComment = function(comment, type, index) {
		var confirmation = confirm("Do You Want to Delete Your Comment ?");
		if(confirmation){
			$scope.removeUserComment = UserService.removeUserComment(comment);
			$scope.removeUserComment.then(function( data ){
				$scope.commentStatus = data;
				var d = data;
				if ( d.success && d.statusCode==200 ) {
					//code
					toastr.success('Comment removed successfully.');
					if(type=="comment"){
						$scope.comments.splice(index, 1);
					} else if(type=="latestComments"){
						$scope.latestComments.splice(index, 1);
					}
				}
				if ( d.error && d.statusCode==200 ) {
					toastr.error(d.message+', can not remove the comment.');
				}                
			},function(error) {
				//toastr.error(error+': Invalid credentials given.');
			}).finally(function() {
				$scope.loading  =false;
			});
		}
	};  
    $scope.limit        =limitStep;
    $scope.loadmore     =function() {
        $scope.limit    += limitStep;
    };
}]);

BA.controller ('companyPageController', ['$scope','$location', '$compile', '$http', '$timeout', 'UserService', 'LifeSkills', 'Utils', 'toastr', 
 function($scope, $location, $compile, $http, $timeout, UserService, LifeSkills, Utils, toastr) {
	$scope.showLoading		= true;
	$scope.submitting		= false;
	$scope.submittingForm	= false;
	$scope.submitted		= false;
	$scope.educationLimit	= 2;
	$scope.experienceLimit	= 2;
	
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
	
	$scope.companyInfo =UserService.getCompanyInfo(param_1); // Service to return all reviewslist
	$scope.companyInfo.then(function(data){
		$scope.info 					= data.companyInfo;
		$scope.relationStatus    		= data.relationStatus;
		$scope.admin					= data.admin;
		
		$scope.org_type = {'org_type':$scope.info.institute_type};
		
    },function(error) {
        //toastr.error(error+': Invalid credentials given.');
    }).finally(function() {
		$timeout(function(){
			$scope.showLoading	= false;
		}, 1000);
    });
	
	// Follow
	$scope.SK_registerFollow = function(id, action) {
		var html		= '';
		if(action =='unfollow'){
			$r=confirm('Do you want to unfollow company?');
			if ($r==true){ }else{ return false }
			html='<a class="btn btn-primary follow-btn" style="padding: 6px 30px;font-size: 16px;border-radius: 2px;" ng-disabled="submitting" ng-click="SK_registerFollow('+id+')">\
						<i class="fa fa-spinner fa-spin" ng-show="submitting"></i>\
						<span class="button_text"> Follow</span>\
					</a>';
		} else{
			html='<a class="btn btn-primary btn-select btn-select-light" ng-disabled="submitting" data-toggle="dropdown">\
					<span class="btn-select-value">\
						<i class="glyphicon glyphicon-ok" ng-show="!submitting"></i>\
						<i class="fa fa-spinner fa-spin" ng-show="submitting"></i>\
						<span class="button_text"> Following</span>\
					</span>\
					<span class="btn-select-arrow glyphicon glyphicon-chevron-down"></span>\
				</a>\
				<ul class="dropdown-menu">\
					<li ng-click="SK_registerFollow('+id+', \'unfollow\')"><a href="javascript:void(0)" id="remove-mentor-button">Unfollow</a></li>\
				</ul>';
		}
		
		$scope.submitting = true;
		
		$scope.follow = UserService.SK_registerFollow(id); // Service to return all reviewslist
		$scope.follow.then(function(data){
			if (data.status == 200) {
				$("#follow-"+id).html($compile(html)($scope));
				$("#followers-count").html(data.Followers);
			}
			$scope.submitting = false;
		},function(error) {
			
		}).finally(function() {
			
		});
	};
	$scope.getTypeOfIndustry = function(insitute_type){
		if(insitute_type == "institute" || insitute_type == "college"){
			return "Educational Institute";
		} else if(insitute_type == "company"){
			return "Corporate";
		} else if(insitute_type == "ngo"){
			return "Non Government";
		} else if(insitute_type == "npo"){
			return "Non Profit";
		} else if(insitute_type == "gov_agency"){
			return "Government Agencies";
		} else if(insitute_type == "professionals"){
			return "Professionals";
		} else if(insitute_type == "entrepreneur"){
			return "Entrepreneur";
		} else {
			return "others";
		}
	}
	$scope.expand = function(type){
		if(type=='education'){
			$scope.educationLimit = $scope.publicUserEducation.length;
			$scope.showLessForEducation = true;
		} else if(type=='experience'){
			$scope.experienceLimit = $scope.publicUserProfessional.length;
			$scope.showLessForExperience = true;
		}
	}
	
	$scope.collapse = function(type){
		if(type=='education'){
			$scope.educationLimit = 2;
			$scope.showLessForEducation = false;
		} else if(type=='experience'){ 
			$scope.experienceLimit = 2;
			$scope.showLessForExperience = false;
		}
	}	
	
	$scope.showHide = function(){
		if($("#company-overview").hasClass("collapsed")){
			$("#company-overview").removeClass("collapsed");
			$("#about-hide-panel").html('Hide Details <span class="glyphicon glyphicon-chevron-up arrow-up"></span>');
		} else {
			$("#company-overview").addClass("collapsed");
			$("#about-hide-panel").html('Show Details <span class="glyphicon glyphicon-chevron-down arrow-up"></span>');
		}
	}
	
	$scope.saveCompanyInfo = function(){
		$scope.submittingForm = true;
		var data		= {};
		var form_data	= $('#company-deails').serialize();
		var tempArr		= form_data.split("&");
		$.each(tempArr, function(index, value){
			var temp = value.split("=");
			data[temp[0]] = decodeURIComponent(temp[1]).split('+').join(' ');
		});
		if($("#company-deails").valid()){
			$scope.saveInfo = UserService.saveCompanyInfo($scope.info.institute_id, data); // Service to return all reviewslist
			$scope.saveInfo.then(function(data){
				$scope.submittingForm	= false;
				$scope.submitted		= true;
				if (data.status == 200 && data.affected_rows>0) {
					toastr.success('Data Updated Successfully');
					$scope.info = data.companyInfo;
				} 
			},function(error) {
				
			}).finally(function() {
				$timeout(function(){
					$scope.submitted = false;
				}, 1500);
			});
		}else{
			$scope.submittingForm	= false;
		}
	}
}]);	

BA.controller ('companyJobsController', ['$scope','$location', '$compile', '$http', '$timeout', 'UserService', 'LifeSkills', 'Utils', 'toastr', 'ngDialog', 
 function($scope, $location, $compile, $http, $timeout, UserService, LifeSkills, Utils, toastr, ngDialog) {
	$scope.showLoading		= true;
	$scope.submitting		= false;
	$scope.showLoadMore		= true;
	$scope.searching		= false;
	
	$scope.offset			= 0;
	$scope.limit			= 10;
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
	
    $scope.companyJoblist = UserService.companyJobsList(param_1, $scope.offset, $scope.limit); // Service to return all reviewslist
	$scope.companyJoblist.then(function(data){
		$scope.jobs			= 	data.jobsList.jobsList;
		$scope.jobs_count	= 	data.jobsList.total_jobs;
		$scope.user_id		=   data.user_id;
		$scope.admin		=   data.role;
		$scope.offset		+= 	$scope.limit;
		$scope.encrypted_url = data.encrypted_url;
		if($scope.jobs.length<$scope.limit){
			$scope.showLoadMore = false;
		}
    },function(error) {
        //toastr.error(error+': Invalid credentials given.');
    }).finally(function() {
		$timeout(function(){
			$scope.showLoading	= false;
		}, 1000);
    });
	
	$scope.loadMoreJobs = function(){
		$scope.searching		= true;
		$scope.moreJoblist = UserService.companyJobsList(param_1, $scope.offset, $scope.limit); // Service to return all reviewslist
		$scope.moreJoblist.then(function(data){
			$scope.jobs.push.apply($scope.jobs, data.jobsList.jobsList);
			$scope.offset		+=		$scope.limit;
			if(data.jobsList.jobsList.length<$scope.limit || $scope.jobs.length==data.jobsList.total_jobs){
				$scope.showLoadMore = false;
			}
		},function(error) {
			//toastr.error(error+': Invalid credentials given.');
		}).finally(function() {
			$scope.searching		= false;
		});
	}
	
	$scope.applyModal= function(id) {
		$scope.jobid = id;
		ngDialog.open({
			template: '/user/companyView/apply-job',
			className: 'ngdialog-theme-default',
			controller: 'applyJobDialogController',
			scope: $scope,
		});
	};
}]);


BA.controller ('applyJobDialogController', ['$scope', '$http', 'UserService', 'ngDialog', '$timeout',
                        function($scope, $http, UserService, filterFilter, ngDialog, $timeout){
		$scope.showLoading 		= true;
		$scope.uploadNewResume  = false;
		$scope.jobdata = UserService.getApplyJobData($scope.jobid, 1);
		$scope.jobdata.then(function(data){
			$scope.jobInfo=data.details.jobInfo;
			$scope.jobResume=data.details.jobResume;
			if($scope.jobResume.ID === undefined || $scope.jobResume.ID === null || $scope.jobResume.ID == ''){
				$scope.uploadNewResume = true;
			}
		});
		
		$scope.applyJob = function(dataid){
			var jobsub=$('#jobsub').val();
			var jobmsg=$('#jobmsg').val();
			var fileAttach=$('#resume').val();
			var jobresume=$("input[name='resumeOpt']").is(":checked");
			var resumeOpt=$("input[name='resumeOpt']:checked").val();
			var exts = ['doc','docx','rtf','odt','pdf'];
			
			if($('#resume')[0].files[0]!=null){
				var file_size = $('#resume')[0].files[0].size;
			}
			
			//for job sub validation
			if(jobsub=='' || jobsub==null || !/\S/.test(jobsub)){
				$('#jobsub').css('border-color', 'red').focus();
				$("#subject_error").removeClass('hide');
				return false;
			} else {
				$('#jobsub').css('border-color', '');
				$("#subject_error").addClass('hide');
			}
			
			//for job message validation
			if(jobmsg=='' || jobmsg==null || !/\S/.test(jobmsg)){
				$('#jobmsg').css('border-color', '#ff0000').focus();
				$("#message_error").removeClass('hide');
				return false;
			} else {
				$('#jobmsg').css('border-color', '');
				$("#message_error").addClass('hide');
			}
			
			//for job resume validation
			if(jobresume==false){
				alert("Please attach your resume or Use existing resume");
				return false;
			} 
			
			//for job resume uploaded or not validation
			if(resumeOpt=='attach' && (fileAttach=='' || fileAttach==null)){
				$('#resume').focus();
				$("#resume_upload_error").html("Please attach your latest Resume.").removeClass("hide");
				return false;
			} else {
				$("#resume_upload_error").addClass("hide");
			}
			
			if ( fileAttach ) {
				// split file name at dot
				var get_ext = fileAttach.split('.');
				// reverse name to check extension
				get_ext = get_ext.reverse();
				// check file type is valid as given in 'exts' array
				if ( $.inArray ( get_ext[0].toLowerCase(), exts ) < 0 ){
					$('#resume').focus();
					$("#resume_upload_error").html( 'Invalid file type, kindly attach a valid file e.g doc,docx,rtf,odt,pdf' ).removeClass('hide');
					return false;
				} else {
					$("#resume_upload_error").addClass("hide");
				}
			}
			
			if(file_size>500000) {
				$('#resume_'+dataid).focus();
				$("#file_error").html("File size is exceed than limit.").removeClass('error');
				return false;
			} else {
				$("#resume_upload_error").addClass("hide");
			}
			
			$('#apply').attr('disabled','disabled');
			
			var form_data = new FormData(); 
			form_data.append('resume', $('#resume').prop('files')[0]);
			form_data.append('jobsub', jobsub);
			form_data.append('jobmsg', jobmsg);
			form_data.append('resumeOpt', resumeOpt);
			
			$.ajax({
				type: "POST",
				url: "/jobs/applyjob/"+dataid, 
				contentType: false,
				processData: false,
				data: form_data, 
				cache: false,
				success: function(resp){
					var d  = JSON.parse(resp);
					if(d.status=='success'){
						$('#showMsg').html('Job Appllication has been sent Successfully.').removeClass('hide').addClass('alert-success').show();
						$('#applyForm').trigger('reset');
						$("#job-btn-"+dataid).after('<div class="pull-right" id="job-btn">\
														<span class="apply-btn"></span>\
														<span class="quick-btn">Already Applied</span> \
													</div>');
						$("#job-btn-"+dataid).remove();
						setTimeout(function(){
							$('div.ngdialog-close').click();
							$('#apply').attr('disabled',false);
						}, 1000);
					} else if(d.status=='error'){
						$('#showMsg').html('Invalid input data, unable to process your job application with provided information.').removeClass('hide').addClass('alert-danger').show();
						$('#apply').attr('disabled',false);
					} else if(d.status=='warning'){
						$('#showMsg').html('You have already applied for this job.').removeClass('hide').addClass('alert-success').show();
						$('#applyForm').trigger('reset');                
						setTimeout(function(){$('#apply').attr('disabled',false);$('div.ngdialog-close').click()}, 1000);
					}
					
				}
			});	
		}
		
		$scope.showUpload = function(radioName, uploadID){
			$("input[type=file]").val('');
			$('#showMsg4').hide();
			var checkVal = $("input[name='"+radioName+"']:checked").val();
			if(checkVal=='used'){
				$('#'+uploadID).addClass('hide');
				$("#resume_upload_error").addClass("hide");
			} else {
				$('#'+uploadID).removeClass('hide');	
			}		
		}
}]);

BA.controller ('companyFollowersController', ['$scope', '$routeParams', '$http', 'UserService', 'API', 'toastr', '$location', '$timeout', 'ngDialog', '$compile', '$route',
		function($scope, $routeParams, $http, UserService, API, toastr, $location, $timeout, ngDialog, $compile, $route){
			
		//$scope.showLoading	= true;
		$scope.showLoadbtn	= true;
		$scope.searching	= false;
	
		$scope.submitting 	= false;
		
		$scope.offset		= 0;
		$scope.limit		= 5;
		
		var url = $location.absUrl();
		if(url.indexOf('#') === -1){
			url = url.split("/");
			var username   = url[url.length-1];
		} else {
			url = url.split("#");
			url = url[0].split("/");
			var username   = url[url.length-1];
		}
		
		$scope.followers = UserService.getCompanyFollowersList(username, $scope.offset, $scope.limit); // Service to return all user's groups
		$scope.followers.then(function(data){
			if(data.status == 200){
				$scope.followersList	=	data.detail;
				$scope.timeline_id		=	data.timeline_id;
				$scope.loggedInUser		=	data.loggedInUser;
				$scope.offset 			+=	$scope.limit;
				if($scope.followersList.length < $scope.limit){
					$scope.showLoadbtn = false;
				}
			} else {
				window.location.hash = 'company-overview';
			}
		},function(error) {
			
		}).finally(function() {
			$scope.showLoading = false;
		});
		
		$scope.loadMoreFollower = function(){
			$scope.searching = true;	
			$scope.morefollowers = UserService.getCompanyFollowersList(username, $scope.offset, $scope.limit); // Service to return all user's groups
			$scope.morefollowers.then(function(data){
				$scope.followersList.push.apply($scope.followersList,data.detail);
				$scope.offset +=$scope.limit;
				if(data.detail.length < $scope.limit){
					$scope.showLoadbtn = false;
				}
			},function(error) {
				
			}).finally(function() {
				$scope.showLoading = false;
				$scope.searching = false;				
			});
		}
		
		$scope.oneMoreData = function(){
			$scope.onefollowers = UserService.getCompanyFollowersList(username, $scope.offset, $scope.limit); // Service to return all user's groups
			$scope.onefollowers.then(function(data){
				$scope.followersList.push.apply($scope.followersList,data.detail);
				$scope.offset +=1;
				if(data.detail.length == 0){
					$scope.showLoadbtn = false;
				}
			},function(error) {
				
			}).finally(function() {
				
			});		
		}
		
		$scope.removeMember = function(id,index){
			$scope.remove = UserService.removeCompanyFollower($scope.timeline_id, id); // Service to return all user's groups
			$scope.remove.then(function(data){	
				if(data.status == 200){
					$scope.offset 				-=	1;
					$timeout(function(){
						$('#people-box-'+id).css('background-color','rgba(255,0,0,0.1)').hide("fade",{direction:'up'},500);					
						$timeout(function(){
							$scope.followersList.splice(index, 1);
							$scope.oneMoreData();
						},1000)
					},200);
				} else {
					toastr.error(data.detail);
				}
			},function(error) {
				
			}).finally(function() {
				$timeout(function(){	
				
				},1000);
			});
		}
		
		$scope.SK_registerFollow = function(following_id, action){
			var html = "";
			if(action=='follow'){
				html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="!submitting && SK_registerFollow('+following_id+',\'remove-request\');">\
							<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-check progress-icon"></i> <span class="follow-text">Requested</span>\
						</a>';
			} else if(action=='unfollow'){
				$r=confirm('Do you want to remove your friend?');
				if ($r==true){ 
					html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="!submitting && SK_registerFollow('+following_id+',\'follow\');">\
								<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus progress-icon"></i> <span class="follow-text">Add Friend</span>\
							</a>';
				} else {
					return false;
				}
			} else if(action == "remove-request"){
				$r=confirm('Do you want to remove request?');
				if ($r==true){
					html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="!submitting && SK_registerFollow('+following_id+',\'follow\');">\
								<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus progress-icon"></i> <span class="follow-text">Add Friend</span>\
							</a>';
				} else{ 
					return false;
				}
			}
			$scope.submitting = true;
			$(".follow-"+following_id+" .fa-spin").removeClass('hide');
			$(".follow-"+following_id+" .progress-icon").addClass('hide');
			$scope.register = UserService.SK_registerFollow(following_id); // Service to return all reviewslist
			$scope.register.then(function(data){
				if (data.status == 200) {
					$(".follow-"+following_id+" .fa-spin").addClass('hide');
					$(".follow-"+following_id).after($compile(html)($scope));
					$(".follow-"+following_id+":first-child").remove();
				}
			}).finally(function() {
				$scope.submitting	= false;
			});
		}
}]);

BA.controller ('recentUpdatesController', ['$scope', '$routeParams', '$window', '$interval', '$location', '$compile', '$http', '$timeout', 'UserService', 'ngDialog', 'Utils', 'toastr','$sce', 
 function($scope, $routeParams, $window, $interval, $location, $compile, $http, $timeout, UserService, ngDialog, Utils, toastr, $sce) {
	$scope.showloading		= true;
	$scope.showLoadMore		= true;
	$scope.windowLoading	= false;
	
	var soundcloud_query = '';
	var youtube_query = '';
	
	
	$scope.submitted		= false;
	$scope.sumbitting		= false;
	$scope.loadingComments	= false;
	
	$scope.limit			= 10;
	
	var url = $location.absUrl();
	
    if(url.indexOf('#') === -1){
        url = url.split("/");
		var section 		= url[3];
        var user_id   		= (url[url.length-1]!='')?url[url.length-1]:0;
    } else {
        url = url.split("#");
        url = url[0].split("/");
		var section 		= url[3];
        var user_id   		= (url[url.length-1]!='')?url[url.length-1]:0;
    }
	
	if(section == "user" && url[4] == "story"){
		$scope.loaderArr	= [0];
		$scope.story_id 	= url[5];
		
		$scope.stories		= [];
		$scope.singleStory = UserService.SK_getStory($scope.story_id); // Service to return all reviewslist
		$scope.singleStory.then(function(data){
			if(data.statusCode==200){
				$scope.stories	=  data.stories;
			} else {
				$window.location.href = '/user';
			}				
		},function(error) {
			
		}).finally(function() {
			$scope.showloading			= false;	
			$scope.showLoadMore			= false;
			$scope.show_publisher_box	= false;
		}); 
		
		$scope.SK_loadNewPosts = function(){
			
		}
		
	} else {
		if((section == "user" && url[4] == "timeline") || (section == "mentors" && url[4] == "profile")){
			var timeline		= 1;
		} else {
			var timeline		= 0;
		}
		if($routeParams.type !== undefined){
			$scope.type 		= $routeParams.type;
		} else {
			$scope.type 		= "all";
		}
		$scope.loaderArr	= [0,1,2];
		$scope.stories			= [];
		
		$scope.stories = UserService.SK_getStories(user_id, section, timeline, $scope.type); // Service to return all reviewslist
		$scope.stories.then(function(data){
			$scope.stories				=  data.stories;
			if($scope.stories.length==0){
				$scope.showLoadMore		=  false;
			}		
		},function(error) {
			
		}).finally(function() {
			$scope.showloading		= false;		
		}); 
		
		$scope.storiyPublisherBox = UserService.SK_getStoryPublisherBox(user_id, section, timeline, $scope.type); // Service to return all reviewslist
		$scope.storiyPublisherBox.then(function(data){
			$scope.timeline_id			=  data.timeline_id;
			$scope.loggedInUser			=  data.loggedInUser;
			$scope.publisher_box		=  data.post_publisher_box;
			$scope.show_publisher_box	=  data.show_publisher_box;
			$scope.emoticons			=  data.emoticons;
			if(section == 'company'){
				$scope.encrypted_url = data.encrypted_url;
			}
		},function(error) {
			
		}).finally(function() {
			
		});
		
		
		$scope.SK_loadNewPosts = function () {
			if($scope.stories.length>0){
				$scope.newStoriesData =UserService.SK_loadPosts(($scope.timeline_id == $scope.loggedInUser && !timeline)?0:$scope.timeline_id, 0, $scope.stories[0].id, $scope.type, $scope.limit); // Service to return all reviewslist
				$scope.newStoriesData.then(function(data){
					if(data.status == 200){				
						data.stories.push.apply(data.stories,$scope.stories);
						$scope.stories = data.stories;
					}
				},function(error) {
					
				}).finally(function() {
					
				});
			}
		}
		$scope.SK_loadPreviousPosts = function(after_post_id, before_post_id, limit){
			$scope.submitting	= true;
			$scope.priviousPosts = UserService.SK_loadPosts(($scope.timeline_id == $scope.loggedInUser && !timeline)?0:$scope.timeline_id, after_post_id, before_post_id, $scope.type, limit); // Service to return all reviewslist
			$scope.priviousPosts.then(function(data){
				$scope.submitting	= false;
				if (data.status == 200) {
					if(data.stories.length == 0){
						$scope.showLoadMore = false;
					}
					$scope.stories.push.apply($scope.stories, data.stories);
				}
			}).finally(function() {
				
			});
		}
		
		$interval($scope.SK_loadNewPosts, 60000);
		
		$scope.SK_registerPost = function(){
			var photos_field	= $('#publisher-box .story-publisher-box #images').val();
			var files_field		= $('#publisher-box .story-publisher-box #files').val();
			var text_value		= $('#publisher-box #post-area .auto-grow-input').val();
			var timeline_id		= $('#publisher-box .story-publisher-box input[name="timeline_id"]').val();
			var recipient_id	= $('#publisher-box .story-publisher-box input[name="recipient_id"]').val();
			var post_privacy	= $('#publisher-box .story-publisher-box .post_privacy').val();
			var textarea_value	= text_value.trim();
			
			var youtube_value		= "";
			var soundcloud_value	= "";
			var google_place_value  = "";
						
			if ($('input[name*="soundcloud_uri"]').length) {
				var soundcloud_value  = $('input[name*="soundcloud_uri"]').val().trim();
				var soundcloud_title  = $('input[name*="soundcloud_title"]').val().trim();
			}
			if($('input[name*="youtube_video_id"]').length){
				var youtube_value  = $('input[name*="youtube_video_id"]').val().trim();
				var youtube_title  = $('input[name*="youtube_title"]').val().trim();
			}
			if($('input[name*="google_map_name"]').length){
				var google_place_value  = $('input[name*="google_map_name"]').val().trim();
			} 
		
			if(textarea_value.length < 1 && textarea_value == '' && photos_field == '' && files_field == '' && youtube_value == '' && soundcloud_value == '' && google_place_value == ''){
				toastr.error('This status update appears to be blank. Please write something or attach photo to update your status.');
				return false;
			}
			
			if(post_privacy == null || post_privacy == "" || post_privacy == undefined){
				toastr.error("Please select privacy before publishing post");
				return false;
			}
			
			var payload = new FormData();
			if(photos_field){
				var _validImageFileExtensions= ["jpg","jpeg","png","gif"];
				var image_files_data			= $('#publisher-box .story-publisher-box #images')[0].files;
				var imagefilecount				= image_files_data.length;
				if(imagefilecount>20){
					toastr.error( "Sorry, maximum 20 images are allowed to be uploaded at one time." );
					return false;
				}
				for(var i=0; i< imagefilecount; i++){
					var get_ext = image_files_data[i].name.split('.');
					get_ext = get_ext.reverse();
					if ( $.inArray ( get_ext[0].toLowerCase(), _validImageFileExtensions ) < 0 ){
						toastr.error( "Sorry, attached image is invalid, allowed file formats are as follows: " + _validImageFileExtensions.join(", ") );
						return false;
					} else if(image_files_data[i].size>5247764){
						toastr.error( "Sorry, Maximum image size limit is 5MB." );
						return false;
					} else {
						payload.append('photos[]', image_files_data[i]);
					}
				}
			}
			
			if(files_field){
				var _validFileExtensions= ["doc","docx","rtf","odt","txt","xml","xps","xls","xlsx","csv","ods","pdf","vcf","odp","pps","ppsx","ppt","pptx","pptm"];
				var files_data			= $('#publisher-box .story-publisher-box #files')[0].files;
				var filecount			= files_data.length;
				if(filecount>20){
					toastr.error( "Sorry, maximum 20 files are allowed to be uploaded at one time." );
					return false;
				}
				for(var i=0; i< filecount; i++){
					var get_ext = files_data[i].name.split('.');
					get_ext = get_ext.reverse();
					if ( $.inArray ( get_ext[0].toLowerCase(), _validFileExtensions ) < 0 ){
						toastr.error( "Sorry, attached file is invalid, allowed file formats are as follows: " + _validFileExtensions.join(", ") );
						return false;
					} else if(files_data[i].size>5247764){
						toastr.error( "Sorry, Maximum file size limit is 5MB." );
						return false;
					} else {
						payload.append('files[]', files_data[i]);
					}
				}
			}
			
			if(youtube_value != ''){
				payload.append('youtube_title', youtube_title);
				payload.append('youtube_video_id', youtube_value);
			}
			
			if(soundcloud_value != ''){
				payload.append('soundcloud_title', soundcloud_title);
				payload.append('soundcloud_uri', soundcloud_value);
			}
			
			if(google_place_value != ''){
				payload.append('google_map_name', google_place_value);
			}
			
			payload.append('text', text_value);
			payload.append('timeline_id', timeline_id);
			payload.append('recipient_id', recipient_id);
			
			if(!Array.isArray(post_privacy)){
				post_privacy = $('#publisher-box .story-publisher-box .post_privacy').map(function() { return this.value; }).get();
			} 
			for(var i=0;i<post_privacy.length;i++){
				payload.append('post_privacy[]',post_privacy[i]);
			}
			
			main_wrapper = $('.story-publisher-box');
			textarea 	= main_wrapper.find('textarea');
			inputs 		= main_wrapper.find('input[type="text"]');
			button 		= main_wrapper.find('button.submit-btn');
			
			button_default_text = button.find('span').text();
			
			textarea.attr('disabled', true);
			inputs.attr('disabled', true);
			button.attr('disabled', true).find('span').text('Processing');
			
			$scope.registerStory = UserService.SK_registerPost(payload); // Service to return all reviewslist
			$scope.registerStory.then(function(data){
				if(data.status == 200){
					$(".story-publisher-box textarea").attr('style','');
					data.stories.push.apply(data.stories, $scope.stories);
					$scope.stories = data.stories;
				}
				main_wrapper.find('input[name="text"]').val('');
				main_wrapper.find("input.photo-upload-input").val('');
				main_wrapper.find("input.google-map-input").val('');
				
				textarea.val('');

				main_wrapper
					.find('.story-text-input')
					.val('')
					
					.end().find('.result-container')
					.remove()
					
					.end().find('.input-wrapper')
						.find('.result-container')
						.remove()
						
						.end()
						.find('.input-result-wrapper')
						.empty()
						
						.end().find('input')
						.show()
						.val('')
						
						.end().find('.remove-btn')
						.remove()
						
						.end().find('.youtube-link')
						.remove()
					.end().slideUp();
				
				textarea.removeAttr('disabled');
				inputs.removeAttr('disabled');
				
				button
					.removeAttr('disabled')
					.find('span').text(button_default_text);
			},function(error) {
				
			}).finally(function() {

			}); 
		}
		
		$scope.SK_writeStoryPhotoUpload = function(input) {
			$("input.file-upload-input").val('');
			parent_wrapper = $('.story-publisher-box');
			input_wrapper = parent_wrapper.find('.photo-wrapper');
			group_id = input_wrapper.attr('data-group');
			parent_wrapper.find('.photos-container').text(input.files.length + ' photo(s) selected');
			input_wrapper.find('.float-left').after($compile('<span class="remove-btn" ng-click="SK_removeSelectedPhoto()"><i class="fa fa-times"></i></span>')($scope));
			$('.input-wrapper[data-group=' + group_id + ']').slideUp();
			input_wrapper.slideDown();
		}
		
		// file On Upload Function
		$scope.SK_writeStoryFileUpload = function(input) {
			$("input.photo-upload-input").val('');
			parent_wrapper = $('.story-publisher-box');
			input_wrapper = parent_wrapper.find('.file-wrapper');
			group_id = input_wrapper.attr('data-group');
			parent_wrapper.find('.files-container').text(input.files.length + ' file(s) selected');
			input_wrapper.find('.float-left').after($compile('<span class="remove-btn" ng-click="SK_removeSelectedFile()"><i class="fa fa-times"></i></span>')($scope));
			$('.input-wrapper[data-group=' + group_id + ']').slideUp();
			input_wrapper.slideDown();
		}
		
		$scope.SK_removeSelectedPhoto  = function(){
			$("input.photo-upload-input").val('');
			parent_wrapper = $('.story-publisher-box');
			input_wrapper = parent_wrapper.find('.photo-wrapper');
			input_wrapper.find('.remove-btn').remove();
			group_id = input_wrapper.attr('data-group');
			$('.input-wrapper[data-group=' + group_id + ']').slideUp();
		}
		
		$scope.SK_removeSelectedFile  = function(){
			$("input.file-upload-input").val('');
			parent_wrapper = $('.story-publisher-box');
			input_wrapper = parent_wrapper.find('.file-wrapper');
			input_wrapper.find('.remove-btn').remove();
			group_id = input_wrapper.attr('data-group');
			$('.input-wrapper[data-group=' + group_id + ']').slideUp();
		}
		
		
		$scope.toggleMediaGroup = function(chosen_input_selector) {
			input_wrapper = $(chosen_input_selector);
			group_id = input_wrapper.attr('data-group');
			if (input_wrapper.css('display') == "none") {
				$('.input-wrapper[data-group=' + group_id + ']')
					.slideUp()
					.find('input').val('').show()
					.end()
					.find('.result-container').remove()
					.end()
					.find('.remove-btn').remove();
				input_wrapper.slideDown();
			} else {
				$('.input-wrapper[data-group=' + group_id + ']').slideUp();
			}
		}
		
		$scope.SK_addEmoToInput = function(code,input) {
			inputTag = $(input);
			inputVal = inputTag.val();
			if (typeof(inputTag.attr('placeholder')) != "undefined") {
				inputPlaceholder = inputTag.attr('placeholder');
				
				if (inputPlaceholder == inputVal) {
					inputTag.val('');
					inputVal = inputTag.val();
				}
				
			}
			
			if (inputVal.length == 0) {
				inputTag.val(code + ' ');
			} else {
				var cursor=document.getElementById('text_val').selectionStart;
				var starttext=inputVal.substring(0,cursor);
				var endtext=inputVal.substring(cursor,inputVal.length);
			   inputTag.val(starttext + ' ' + code + endtext);
			}    
			inputTag.keyup();
		}
		
		// Youtube Search
		$scope.SK_searchYoutube = function() {
			main_wrapper = $('.story-publisher-box');
			youtube_wrapper = main_wrapper.find('.youtube-wrapper');
			query = main_wrapper.find('.youtube-wrapper .youtube-input').val();
			
			if (query != youtube_query) {
				$("input.photo-upload-input").val('');
				$("input.file-upload-input").val('');
				
				result_wrapper = youtube_wrapper.find('.input-result-wrapper');
				youtube_query = query;
				
				if (query.length == 0) {
					result_wrapper.slideUp(function(){
						$(this).html('');
					});
				} else {
					result_wrapper.html('<div class="loading-wrapper"><i class="fa fa-spinner"></i> Searching...</div>').slideDown();
					setTimeout(function () {
						if (youtube_query == query) {
							$scope.SK_getYoutube(query);
						}
					}, 1500);
				}
			}
		}
		
		$scope.SK_getYoutube = function(query) {
			main_wrapper = $('.story-publisher-box');
			youtube_wrapper = main_wrapper.find('.youtube-wrapper');
			result_wrapper = youtube_wrapper.find('.input-result-wrapper');
			
			if (query.length == 0) {
				result_wrapper.slideUp(function () {
					$(this).html('');
				});
			} else {
				query = query.replace("http://", "").replace("https://", "");
				result_wrapper.html('<div class="loading-wrapper"><i class="fa fa-spinner"></i> Searching...</div>').slideDown();
				
				$scope.search = UserService.SK_youtubeSearch(query); // Service to return all reviewslist
				$scope.search.then(function(data){
					if (data.status == 200) {
						if (data.type == "embed") {
							youtube_wrapper
							.find('.youtube-link')
							.remove()
							.end()
							.find('input.youtube-input')
							.after('<input class="youtube-link" type="hidden" name="youtube_video_id" value="' + query + '">')
							result_wrapper.slideUp();
						} else if (data.type == "api") {
							var html = '';
							for(var i=0;i<data.detail.length;i++){
								html+='<div class="api-data-wrapper youtube-api-data" ng-click="SK_addYoutubeData(\''+data.detail[i].id.videoId+'\',\''+data.detail[i].snippet.title.replace(/'|"/gi,' ')+'\')">\
								<table border="0" width="100%" cellspacing="0" cellpadding="0">\
								<tr><td width="40px" align="left" valign="middle">';
								
								if (data.detail[i].snippet.thumbnails.default.url != "") {
									html+='<img class="thumbnail" src="'+data.detail[i].snippet.thumbnails.default.url+'" width="32px" height="32px" valign="middle" alt="Youtube">';
								} else {										
									html+='<img class="thumbnail" width="32px" height="32px" valign="middle" alt="Youtube">';
								}
									
								html+='</td><td align="left" valign="middle"><div class="name">'+data.detail[i].snippet.title+'</div>';
								
								if (data.detail[i].category !== undefined && data.detail[i].category[1].label != "") {
									html+='<div class="info">'+data.detail[i].category[1].label+'</div>';
								}
								html+='</td></tr></table></div>';
							}
							result_wrapper.html($compile(html)($scope));
						}
					} else {
						result_wrapper.html('<div class="no-wrapper">No result found!/div>');
					}
				}, function(error){
					
				}).finally(function(){
					
				});
			}
		}
		
		$scope.SK_addYoutubeData = function(id,title) {
			$('.story-publisher-box').find('.youtube-wrapper')
				.append($compile('<span class="remove-btn" ng-click="SK_removeYoutubeData();"><i class="fa fa-times"></i></span>')($scope))
				.find('input.youtube-input')
					.hide()
					.after('<div class="result-container"><span class="title">' + title.substr(0,70) + '</span><i class="fa fa-check"></i><input type="hidden" name="youtube_title" value="' + title + '"><input type="hidden" name="youtube_video_id" value="' + id + '"></div>')
					.val('')
				.end().find('.input-result-wrapper')
					.slideUp('fast',function(){
						$(this).html('');
			});
		}
		
		$scope.SK_removeYoutubeData = function() {
			$('.story-publisher-box').find('.youtube-wrapper')
				.find('.result-container')
					.remove()
				.end().find('input.youtube-input')
					.show()
					.focus()
				.end().find('.remove-btn')
					.remove();
		}
		
		// SoundCloud Search
		$scope.SK_searchSoundcloud = function() {
			main_wrapper = $('.story-publisher-box');
			soundcloud_wrapper = main_wrapper.find('.soundcloud-wrapper');
			query = main_wrapper.find('.soundcloud-wrapper .soundcloud-input').val();
			if (query != soundcloud_query) {
				$("input.photo-upload-input").val('');
				$("input.file-upload-input").val('');
				result_wrapper = soundcloud_wrapper.find('.input-result-wrapper');
				soundcloud_query = query;
				
				if (query.length == 0) {
					result_wrapper.slideUp(function(){
						$(this).html('');
					});
				} else {
					result_wrapper.html('<div class="loading-wrapper"><i class="fa fa-spinner"></i> Searching...</div>').slideDown();
					setTimeout(function () {
						if (soundcloud_query == query) {
							$scope.SK_getSoundcloud(query);
						}
					}, 1500);
				}
			}
		}

		$scope.SK_getSoundcloud = function(query) {
			main_wrapper = $('.story-publisher-box');
			soundcloud_wrapper = main_wrapper.find('.soundcloud-wrapper');
			result_wrapper = soundcloud_wrapper.find('.input-result-wrapper');
			
			if (query.length == 0) {
				result_wrapper.slideUp(function () {
					$(this).html('');
				});
			} else {
				query = query.replace("http://", "").replace("https://", "");
				result_wrapper.html('<div class="loading-wrapper"><i class="fa fa-spinner"></i> Searching...</div>').slideDown();
				
				
				$scope.searchSoundcloud = UserService.SK_soundcloudSearch(query); // Service to return all reviewslist
				$scope.searchSoundcloud.then(function(data){
					if (data.status == 200) {
						if (data.type == "embed") {
							soundcloud_wrapper
							.find('input.soundcloud-input')
							.hide()
							.after('<div class="result-container"><span class="title">https://' + query + '</span><i class="fa fa-check"></i><input type="hidden" name="soundcloud_title" value="Embedded"><input type="hidden" name="soundcloud_uri" value="' + data.sc_uri + '"></div>')
							.val('');
							result_wrapper.slideUp(function () {
								$(this).html('');
							});
						} else if (data.type == "api") {
							var html = '';
							for(var i=0;i<data.detail.length;i++){
								html+='<div class="api-data-wrapper soundcloud-api-data" ng-click="SK_addSoundcloudData(\''+data.detail[i].title.replace(/'|"/gi,' ')+'\',\''+data.detail[i].uri+'\')">\
								<table border="0" width="100%" cellspacing="0" cellpadding="0">\
								<tr><td width="40px" align="left" valign="middle">';
								
								if (data.detail[i].artwork_url != null && data.detail[i].artwork_url != "") {
									html+='<img class="thumbnail" src="'+data.detail[i].artwork_url+'" width="32px" height="32px" valign="middle" alt="Image">';
								} else {										
									html+='<img class="thumbnail" width="32px" height="32px" valign="middle">';
								}
									
								html+='</td><td align="left" valign="middle"><div class="name">'+data.detail[i].title+'</div>';
								
								if (data.detail[i].genre != null &&  data.detail[i].genre != "") {
									html+='<div class="info">'+data.detail[i].genre+'</div>';
								}
								html+='</td></tr></table></div>';
							}
							result_wrapper.html($compile(html)($scope));
						}
					} else {
						result_wrapper.html('<div class="no-wrapper">No result found!</div>');
					}
				}, function(error){
					
				}).finally(function(){
					
				});
			}
		}

		$scope.SK_addSoundcloudData = function(title,uri) {
			$('.story-publisher-box').find('.soundcloud-wrapper')
				.append($compile('<span class="remove-btn" ng-click="SK_removeSoundcloudData();"><i class="fa fa-times"></i></span>')($scope))
				
				.find('input.soundcloud-input')
					.hide()
					.after('<div class="result-container"><span class="title">' + title.substr(0,70) + '</span><i class="fa fa-check"></i><input type="hidden" name="soundcloud_title" value="' + title + '"><input type="hidden" name="soundcloud_uri" value="' + uri + '"></div>')
					.val('')
					
				.end().find('.input-result-wrapper')
					.slideUp(function () {
						$(this).html('');
					});
		}
		$scope.SK_removeSoundcloudData = function() {
			$('.story-publisher-box').find('.soundcloud-wrapper')
				.find('.result-container')
					.remove()
				.end().find('input.soundcloud-input')
					.show()
					.focus()
				.end().find('.remove-btn')
					.remove();
		}
	}
	
	$scope.SK_getFilesImageByExtension = function(file_extension){
		if(file_extension=='pdf'){ 
			return '/common/images/file-icons/pdf.png';
		} else if(file_extension=='xls' || file_extension=='xlsx'){
			return '/common/images/file-icons/xls.png';
		} else if(file_extension=='docx'|| file_extension=='doc'){
			return '/common/images/file-icons/doc1.png';
		} else if(file_extension=='pptx'|| file_extension=='ppt'){
			return '/common/images/file-icons/ppt.png';
		} else if(file_extension=='odt'){
			return '/common/images/file-icons/odt.png';
		} else if(file_extension=='ods'){ 
			return '/common/images/file-icons/ods.png';
		} else if(file_extension=='csv'){  
			return '/common/images/file-icons/csv.png';
		} else if(file_extension=='rtf'){  
			return '/common/images/file-icons/rtf.png';
		}
	}
	
	$scope.SK_deleteFile = function(album_id, post_id) {
		var check =  confirm('Do you want to delete this file?');
		if(check == true){
			$scope.deleteFile = UserService.SK_deleteFile(album_id, post_id);
			$scope.deleteFile.then(function(data){
				if(data.statusCode==200){
					toastr.success(data.detail);
					location.reload();
				} else {
					toastr.error(data.detail);
					return false;
				}
			}, function(error){
				
			}).finally(function(){
				
			});
		} 
	}
	
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	
	$scope.SK_registerLike = function(id){
		$('.story_'+id+' .story-like-btn').css('pointer-events','none');
		$scope.likeUnlike = UserService.SK_registerPostLike(id); // Service to return all reviewslist
		$scope.likeUnlike.then(function(data){
			if(data.status == 200){
				$scope.totalCount=data.count;
				$scope.unlike=data.unlike;
				$('.story_'+id+' .story-like-activity .like-activity').text($scope.totalCount+' Likes');
				if($scope.unlike == true){
					$('.story_'+id+' .story-like-btn').removeClass('opt-active').addClass('opt').attr('title','Like');				
				}else{
					$('.story_'+id+' .story-like-btn').removeClass('opt').addClass('opt-active').attr('title','Unlike'); 
				}
			}
			$('.story_'+id+' .story-like-btn').css('pointer-events','auto');
		}).finally(function() {
			
		});
	}
	
	$scope.SK_registerShare = function(id){
		var action = $('.story_'+id+' .story-share-btn').attr('title');
		if(action == 'Unshare'){
			var confirmation = confirm('Do you want to unshare post?');
			if(!confirmation){
				return false;
			}
		}
		
		$('.story_'+id+' .story-share-btn').css('pointer-events','none');
		$scope.sharedata = UserService.SK_registerPostShare(id); // Service to return all reviewslist
		$scope.sharedata.then(function(data){
			if(data.status == 200){
				$scope.countShare=data.count;
				$scope.unshare=data.unshare;
				$('.story_'+id+' .story-share-activity .share-activity').text($scope.countShare+' Share');
				if($scope.unshare == true){
					$('.story_'+id+' .story-share-btn').removeClass('opt-active').addClass('opt').attr('title','Share');
					toastr.success('Post has been unshared successfully');	
					
					$scope.stories = $.grep($scope.stories, function(element, index){return (element.type1=='story' && element.via_type=='share' && element.post_id == id && element.timeline_id==$scope.loggedInUser)}, true);
				} else {
					$('.story_'+id+' .story-share-btn').removeClass('opt').addClass('opt-active').attr('title','Unshare'); 
					toastr.success('Post has been shared successfully');
					$timeout(function(){
						$scope.SK_loadNewPosts();
						$('body').animate({scrollTop:$("#stories").offset().top},500);
					},2000);
				}
			}
			$('.story_'+id+' .story-share-btn').css('pointer-events','auto');
		}).finally(function() {
			
		});
	}
	
	$scope.SK_shareSharedStory = function(post_id) {
		$scope.sharedata = UserService.SK_shareSharedStory(post_id);
		$scope.sharedata.then(function(data){
			if (data.status == 200) {
				$scope.SK_loadNewPosts();
				$('body').animate({scrollTop:$("#stories").offset().top},500);
				toastr.success('Post has been shared successfully');
			}
		}).finally(function() {
			
		});
	}

	$scope.SK_showComment = function(id){
		if(!$('.comment-publisher-box-'+id).is(':visible')){
			$('.comment-publisher-box-'+id).slideDown();
		} 
		$('.comment-publisher-box-'+id+' textarea').focus();
	}
	
	$scope.SK_deletePostWindow = function(post_id, post_type, redirect_page, index){
		var data = {};
		$scope.post_id			= post_id;
		$scope.post_type		= post_type;
		$scope.redirect_page	= redirect_page;
		$scope.index			= index;
		ngDialog.open({
			template: 'deletePostWindow.html',
			className: 'ngdialog-theme-default ngdialog-post-windows',
			scope: $scope,
		});
	}
	
	$scope.SK_getStoryShares = function(post_id){
		$scope.windowLoading	= true;
		ngDialog.open({
			template: 'postShareWindow.html',
			className: 'ngdialog-theme-default ngdialog-post-windows',
			scope: $scope,
		});
		$scope.postShareData	= UserService.getStoryShares(post_id); // Service to return all reviewslist
		$scope.postShareData.then(function(data){
			$scope.share_data	= data.details.share_data;
		}).finally(function() {
			$scope.windowLoading	= false;
		});
	}
	
	$scope.SK_getStoryLikes = function(post_id){
		$scope.windowLoading	= true;
		ngDialog.open({
			template: 'postLikeWindow.html',
			className: 'ngdialog-theme-default ngdialog-post-windows',
			scope: $scope,
		});
		$scope.postShareData	= UserService.getStoryLikes(post_id); // Service to return all reviewslist
		$scope.postShareData.then(function(data){
			$scope.like_data	= data.details.like_data;
		}).finally(function() {
			$scope.windowLoading	= false;
		});
	}
	
	$scope.SK_openLightbox = function(post_id, album_type){
		$scope.windowLoading	= true;
		ngDialog.open({
			template: 'lightbox.html',
			className: 'ngdialog-theme-default ngdialog-post-windows',
			scope: $scope,
		});
		$scope.lightBoxData	= UserService.SK_openLightbox(post_id, album_type); // Service to return all reviewslist
		$scope.lightBoxData.then(function(data){
			$scope.lb_story	= data.detail;
		}).finally(function() {
			$scope.windowLoading	= false;
		});
	}
	
	$scope.SK_deletePost = function(post_id, post_type, redirect_page, index){
		$(".ngdialog-close").click();
		$scope.deletePostData = UserService.SK_deletePost(post_id, redirect_page); // Service to return all reviewslist
		$scope.deletePostData.then(function(data){
			if (data.status == 200) {
				if (data.post_type == "story") {
					if (redirect_page === 'home_page') {
					   window.location = '/user';
					}else{
						$('#story_'+post_id).slideUp(function(){
							$(this).parent('.story_'+post_id).remove();
						});
						$('.photo_' + post_id).fadeOut(function(){
							$(this).remove();
						});
						$timeout(function(){
							$scope.stories.splice(index, 1);
						},1500);
					}
				} else if (data.post_type == "comment") {
					$('[id="comment_'+post_id+'"]').slideUp(function(){
						$(this).remove();
						$('#story_'+data.parent_post+" .activity-wrapper .numComments").html(data.count+" Comments");
					});
					$timeout(function(){
						var keys		= index.split('~');
						var story_key	= keys[0];
						var comment_key = keys[1];
						$scope.stories[story_key].comments.data.splice(comment_key, 1);
					},1500);
				}
			}
		}).finally(function() {
			
		});
	}
	
	$scope.SK_reportPost = function(post_id, post_type){
		main_wrapper =  $('[id="'+post_type+'_'+post_id+'"]');
		main_wrapper.find('.dropdown').css('pointer-events','none');
		$scope.reportPost = UserService.SK_reportPost(post_id); // Service to return all reviewslist
		$scope.reportPost.then(function(data){
			main_wrapper.find('.dropdown').css('pointer-events','');
			if (data.status == 200) {
				if(post_type=='comment'){
					main_wrapper.find('.dropdown').text('Reported!').fadeOut(1500);
				} else {
					main_wrapper.find('.media .dropdown').find('.report-btn').remove();
				}
			}
		}).finally(function() {
			
		});
	}
	
	$scope.deletePostText = function(post_type){
		if(post_type=='comment'){
			return "Delete comment?";
		} else if(post_type=='image'){
			return "Are you sure you want to delete this image?";
		} else if(post_type=='file'){
			return "Are you sure you want to delete this File with Post?";
		} else {
			return "Delete post?";
		}
	}
	$scope.checkInArray =  function(id, array){
        if($.inArray(id, array) > -1){
			return true;
		} else {
			return false;
		}
    }
	$scope.SK_registerComment = function(post_id, timeline_id, index){
		$('#comment-area-'+post_id).attr("disabled", "disabled"); 
		var comment_text			= $("#comment-area-"+post_id).val();
		
		if(comment_text == '' || comment_text == null || !/\S/.test(comment_text)){
			toastr.error('Please write something to post your comment');			
			setTimeout(function(){
				$('#comment-area-'+post_id).attr("disabled", false); 
			},1000);
			return false;
		}
		
		$('#comment-area-'+post_id).val('');
		
		var data = {};
		data['text'] 		= comment_text;
		data['timeline_id'] = timeline_id;
		
		$scope.commentPost = UserService.SK_registerComment(post_id, data); // Service to return all reviewslist
		$scope.commentPost.then(function(data){
			if (data.status == 200) {
				$scope.stories[index].comments.data.push.apply($scope.stories[index].comments.data,data.comment);
				$('#story_'+post_id+" .activity-wrapper .numComments").html(data.count+" Comments");
			}
		}).finally(function() {
			setTimeout(function(){				
				$('#comment-area-'+post_id).attr("disabled", false); 
			},300);		
		});
	}
	
	$scope.SK_registerCommentLike = function(id){
		$('#comment-like-'+id).css('pointer-events','none');
		$scope.likeUnlike = UserService.CommentLikeUnlike(id); // Service to return all reviewslist
		$scope.likeUnlike.then(function(data){
			$scope.likeCount=data.count;
			$scope.unlike=data.unlike;
		}).finally(function() {
			$('#comment-like-'+id).css('pointer-events','auto');
			$('#comment-like-'+id+' .comment-like-activity span').html($scope.likeCount+' Likes');
			if($scope.unlike == true){
				$('#comment-like-'+id+' .comment-like-btn').removeClass('opt-active').addClass('opt').attr('title','Like');				
			} else {
				$('#comment-like-'+id+' .comment-like-btn').removeClass('opt').addClass('opt-active').attr('title','Unlike'); 
			}
		});
	}

	$scope.SK_registerFollow = function(following_id, action){
		var html = "";
		if(action=='follow'){
			html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="SK_registerFollow('+following_id+',\'remove-request\');">\
						<i class="fa fa-spinner fa-spin" ng-if="submitting"></i> <i class="fa fa-check progress-icon" ng-if="!submitting"></i> <span class="follow-text">Requested</span>\
					</a>';
		} else if(action=='unfollow'){
			$r=confirm('Do you want to remove your friend?');
			if ($r==true){ 
				html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="SK_registerFollow('+following_id+',\'follow\');">\
							<i class="fa fa-spinner fa-spin" ng-if="submitting"></i> <i class="fa fa-plus progress-icon" ng-if="!submitting"></i> <span class="follow-text">Add Friend</span>\
						</a>';
			} else {
				return false;
			}
		} else if(action == "remove-request"){
			$r=confirm('Do you want to remove request?');
			if ($r==true){
				html = '<a href="javascript:void(0);" class="follow-'+following_id+'" ng-click="SK_registerFollow('+following_id+',\'follow\');">\
							<i class="fa fa-spinner fa-spin" ng-if="submitting"></i> <i class="fa fa-plus progress-icon" ng-if="!submitting"></i> <span class="follow-text">Add Friend</span>\
						</a>';
			} else{ 
				return false;
			}
		}
		
		$scope.submitting	= true;
		$scope.register = UserService.SK_registerFollow(following_id); // Service to return all reviewslist
		$scope.register.then(function(data){
			$scope.submitting	= false;
			if (data.status == 200) {
				$(".follow-"+following_id).after($compile(html)($scope));
				$(".follow-"+following_id+":first-child").remove();
			}
		}).finally(function() {
			
		});
	}
	
	$scope.SK_loadPreviousComments = function(post_id, after_comment_id, before_comment_id, limit, index){
		$scope.loadingComments	= true;
		$scope.priviousComments = UserService.SK_loadPreviousComments(post_id, after_comment_id, before_comment_id, limit); // Service to return all reviewslist
		$scope.priviousComments.then(function(data){
			$scope.loadingComments	= false;
			if (data.status == 200) {
				if(data.details.length < 5){
					$("#story_"+post_id+" .comments-container .view-more-wrapper").fadeOut(function(){
						$(this).remove();
					});
				}
				data.details.push.apply(data.details, $scope.stories[index].comments.data);
				$scope.stories[index].comments.data = data.details;
			}
		}).finally(function() {
			
		});
	}
	
	$scope.SK_registerStoryFollow = function(id){
		$scope.storyfollow  = UserService.SK_registerStoryFollow(id); // Service to return all friend suggestions
			$scope.storyfollow.then(function(data){
				if(data.status == 200){
					if(data.followed != 1){
						$('.follow-post-'+id+' a span').text('Follow this post');
					}else{						
						$('.follow-post-'+id+' a span').text('Unfollow this post');
					}
				}
		},function(error) {

		}).finally(function() {
		});    
	}
	
}]);



BA.controller ('friend_request', ['$scope','$rootScope', '$http', 'UserService', 'Utils',
                        function($scope, $rootScope, $http, UserService, Utils) {    
    $scope.friendbySuggestion   = UserService.friendReqest(); // Service to return all friend suggestions
    $scope.friendbySuggestion.then(function(data){
	$scope.results       = data.freindRequest;
    $scope.requestcount  = data.freindRequest.length;
	$scope.limitTo = 3;
    },function(error) {

    }).finally(function() {
        $scope.loading = false;
    });    
}]);

BA.controller ('mentor_request', ['$scope','$rootScope', '$http', 'UserService', 'Utils',
                        function($scope, $rootScope, $http, UserService, Utils) {    
    $scope.mentor_request   = UserService.mentorrequest(); // Service to return all friend suggestions
    $scope.mentor_request.then(function(data){
		$scope.mentorresults      = data.mentorrequest;
    },function(error) {

    }).finally(function() {
        $scope.loading = false;
    });    
}]);
BA.controller ('friend_requestsent', ['$scope','$rootScope', '$http', 'UserService', 'Utils',
                        function($scope, $rootScope, $http, UserService, Utils) {    
    $scope.friendReqestsent   = UserService.friendReqestsent(); // Service to return all friend suggestions
    $scope.friendReqestsent.then(function(data){
	$scope.results           = data.freindRequestsent;
	$scope.requestsentcount  = data.freindRequestsent.length;
	$scope.limitTo = 3;
    },function(error) {

    }).finally(function() {
        $scope.loading = false;
    });    
}]);

BA.controller ('companyEditController', ['$scope','$location', '$compile', '$http', '$timeout', 'UserService', 'LifeSkills', 'Utils', 'toastr', 'ngDialog', 
				function($scope, $location, $compile, $http, $timeout, UserService, LifeSkills, Utils, toastr, ngDialog) {
		$scope.EditCompany = function(){
			var data={};
			data['Company']	    = $scope.Company;
			data['Description'] = $scope.Description;
			data['admins'] 		= $scope.admins; 
			
			$scope.companyEdit = UserService.companyEdit(data); // Service to return all reviewslist
			$scope.companyEdit.then(function(data){
				console.log(data);			
			}).finally(function() {
				
			});			
		}
}]);
BA.controller ('companyAddJobController', ['$routeParams', '$scope','$location', '$compile', '$http', '$timeout', 'UserService', 'LifeSkills', 'Utils', 'toastr', 'ngDialog', 
				function($routeParams, $scope, $location, $compile, $http, $timeout, UserService, LifeSkills, Utils, toastr, ngDialog) {
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
	
	//var landingUrl = "http://" + window.location.host + "/company/index/"+param_1+"+#/company-jobs";
	if($routeParams.id !== undefined){
		$scope.id = $routeParams.id;
		$scope.userid = $routeParams.userid;
		jobUrl='/jobs/addJob/'+$scope.id;
		
			$scope.detail = UserService.getEditDetailJob($scope.id,$scope.userid); // Service to return all reviewslist
			$scope.detail.then(function(data){
				$scope.jobs=data.details.details;
				$scope.jobsdata=data.details;
				$scope.admin=data.admin;
			},function(error) {
				
			}).finally(function() {
				$scope.showloading		= false;
			});
	} else {
		jobUrl='/jobs/addJob';
	}
	
	$scope.saveData = function(){
		var url     = $location.absUrl();
		var urlArr= url.split('/');
		var base_path=urlArr[2];
			if($("#addJobFrm").valid()){		
				$.ajax({
					type: "POST",
					url: jobUrl,
					data: $('#addJobFrm').serialize() ,
					cache: false,
					beforeSend: function(){
						$('.preloader').show(); 
					},	
					success: function(responce){
							$('.preloader').hide(); 	
							if(responce=='success'){
								$('#addJobFrm').trigger('reset');
								$('#addJobFrm').find('.select2-container').select2('data', '');
								$('#addJobFrm').find('.selectpicker').selectpicker('refresh');
								$('#addJobFrm').find('.checkbox-custom i').removeClass('checked');
								$('.innerAddJob .message-content').html('<div class="alert alert-success"><button data-dismiss="alert" class="close" type="button">×</button>Job Posted Successfully</div>');
								setTimeout(function(){
									$('.alert-success').hide();
								}, 5000);
							} else if(responce=='successEdit') {
								$('.innerAddJob .message-content').html('<div class="alert alert-success"><button data-dismiss="alert" class="close" type="button">×</button>Job has been edited successfully</div>');
								setTimeout(function(){
									var landingUrl = "http://" + window.location.host + "/company/index/"+param_1+"#/company-jobs";
									window.location.href = landingUrl;
								}, 2000);
							} else if(responce=='blank') {
								$('#job_desc-error').show().html('Please enter job description');
							} else {
								$('.innerAddJob .message-content').html('<div class="alert alert-danger"><button data-dismiss="alert" class="close" type="button">×</button>There is some error</div>');
							}
							$("html,body").animate({scrollTop:$('.innerAddJob .message-content').offset().top}, '1000', 'swing');
						}
					});
			}
		}
}]);

BA.controller ('connectionsInCompanyController',['$scope','$location', '$rootScope', '$http', 'UserService', 'Utils', 'toastr', '$timeout', 
											function($scope, $location, $rootScope, $http, UserService, Utils, toastr, $timeout) {
	$scope.showLoading  = true;
	var url = $location.absUrl();    
	if(url.indexOf('#') === -1){
		url = url.split("/");
		var param_1   = url[url.length-1];
	} else {
		url = url.split("#");
		url = url[0].split("/");
		var param_1   = url[url.length-1];
	}
	$scope.limit = 4;
	
	$scope.follow = UserService.getUserConnectionsList(param_1); // Service to return all reviewslist
	$scope.follow.then(function(data){	
		$scope.connection	= data.detail.data;
		$scope.count		= data.detail.total;
		$scope.loggedInUser	= data.loggedInUser;
	}).finally(function() {
		$scope.showLoading  = false;
	});
	
	$scope.showLessConnection = true;
	$scope.expand = function(){
		$scope.limit = $scope.connection.length;
		$scope.showLessConnection = false;
	}
	
	$scope.collapse = function(){
		$scope.limit = 4;
		$scope.showLessConnection = true;
	}	
}]);	

BA.controller ('companyAdminListingController',['$scope','$location', '$rootScope', '$http', 'UserService', 'Utils', 'toastr', '$timeout', 
											function($scope, $location, $rootScope, $http, UserService, Utils, toastr, $timeout) {
	$scope.showLoading  = true;
	$scope.searching	= false;
	$scope.showLoadbtn  = true;
	
	var url = $location.absUrl();    
	if(url.indexOf('#') === -1){
		url = url.split("/");
		var param_1   = url[url.length-1];
	} else {
		url = url.split("#");
		url = url[0].split("/");
		var param_1   = url[url.length-1];
	}
	$scope.offset	= 0;
	$scope.limit	= 5;
	
	$scope.list = UserService.getAdminsList(param_1, $scope.offset, $scope.limit); // Service to return all reviewslist
	$scope.list.then(function(data){	
		$scope.admins		= data.detail.data;
		$scope.loggedInUser	= data.loggedInUser;
		$scope.offset		+= $scope.limit;
		if($scope.admins.length<$scope.limit){
			$scope.showLoadbtn  = false;
		}
	}).finally(function() {
		$scope.showLoading  = false;
	});
	
	$scope.loadMoreAdmin = function(){
		$scope.searching	= true;
		$scope.loadList = UserService.getAdminsList(param_1, $scope.offset, $scope.limit); // Service to return all reviewslist
		$scope.loadList.then(function(data){	
			$scope.admins.push.apply($scope.admins, data.detail.data);
			$scope.offset		+= $scope.limit;
			if(data.detail.data.length<$scope.limit){
				$scope.showLoadbtn  = false;
			}
		}).finally(function() {
			$scope.searching  = false;
		});
	}
	
	$scope.removeAdmin		= function(company_id, admin_id, index){
		var confirmation	= confirm("Do you want to remove ?");
		if(confirmation){
			$scope.delLeader = UserService.removeComapnyAdmin(company_id, admin_id); // Service to return all user's groups		
			$scope.delLeader.then(function(data){
				if(data.statusCode==200){
					$timeout(function(){
						$('#people-box-'+admin_id).css('background-color','rgba(255,0,0,0.1)').hide("fade",{direction:'up'},500);					
						
						if(admin_id==$scope.loggedInUser){
							window.location.reload(); 
						} else {
							$scope.offset		-= 1;
							if($scope.showLoadbtn){
								$scope.loadSingleList = UserService.getAdminsList(param_1, $scope.offset, 1); // Service to return all reviewslist
								$scope.loadSingleList.then(function(data){	
									$scope.admins.push.apply($scope.admins, data.detail.data);
									$scope.offset		+= 1;
									if(data.detail.data.length==0){
										$scope.showLoadbtn  = false;
									}
								}).finally(function() {
									$scope.searching  = false;
								});
							}
							$timeout(function(){
								$scope.admins.splice(index, 1);
							},1000);
						}
					},200);
				} else {
					toastr.error(data.detail);
				}
			},function(error) {
				//toastr.error(error+': Invalid credentials given.');
			}).finally(function() {

			});	
		}	
	}	
}]);

BA.controller ('leadersInCompanyController',['$scope','$location', '$rootScope', '$http', 'UserService', 'Utils', 'toastr', '$timeout', 
											function($scope, $location, $rootScope, $http, UserService, Utils, toastr, $timeout) {
	$scope.showLoading  = true;
	var url = $location.absUrl();    
	if(url.indexOf('#') === -1){
		url = url.split("/");
		var param_1   = url[url.length-1];
	} else {
		url = url.split("#");
		url = url[0].split("/");
		var param_1   = url[url.length-1];
	}
	$scope.limit = 4;
	
	$scope.list = UserService.getLeadersList(param_1); // Service to return all reviewslist
	$scope.list.then(function(data){	
		$scope.leaders		= data.detail.data;
		$scope.count		= data.detail.total;
		$scope.loggedInUser	= data.loggedInUser;
	}).finally(function() {
		$scope.showLoading  = false;
	});
	
	$scope.removeLeader = function(company_id, leader_id, index){
		var confirmation = confirm("Do you want to remove ?");
		if(confirmation){
			$scope.delLeader = UserService.removeLeader(company_id, leader_id); // Service to return all user's groups		
			$scope.delLeader.then(function(data){
				if(data.statusCode==200){
					$timeout(function(){
						$('#leader-'+leader_id).css('background-color','rgba(255,0,0,0.1)').hide("fade",{direction:'up'},500);					
						$timeout(function(){
							$scope.leaders.splice(index, 1);
						},1000)
					},200);
				} else {
					toastr.error(data.detail);
				}
			},function(error) {
				//toastr.error(error+': Invalid credentials given.');
			}).finally(function() {

			});	
		}	
	}	
}]);

BA.controller ('addCompanyLeadersController',['$scope','$location', '$rootScope', '$http', 'UserService', 'API', 'Utils', 'toastr', '$timeout', 
											function($scope, $location, $rootScope, $http, UserService, API, Utils, toastr, $timeout) {
	$scope.showLoading  = true;
	$scope.submitting = false;
	var url = $location.absUrl();    
	if(url.indexOf('#') === -1){
		url = url.split("/");
		var param_1   = url[url.length-1];
	} else {
		url = url.split("#");
		url = url[0].split("/");
		var param_1   = url[url.length-1];
	}
	$scope.limit = 4;
	
	$scope.list = UserService.getLeadersIds(param_1); // Service to return all reviewslist
	$scope.list.then(function(data){	
		$scope.leader_ids	= data.detail;
	}).finally(function() {
		$scope.showLoading  = false;
	});
	
	
	$scope.addLeaders	= function(){
		if($('#add_leaders').valid()){
			$scope.submitting = true;
			$scope.actionUrl = API + 'company/addLeaders';
			var formData = new FormData($('#add_leaders')[0]);
			$scope.submitForm = UserService.submitForm($scope.actionUrl, formData);
			$scope.submitForm.then(function(d){
				$scope.submitting = false;
				
				if(d.statusCode=='200'){
					$('.innerAddJob .message-content').html('<div class="alert alert-success">'+d.detail+'</div>');
					
					$timeout(function(){
						window.location.hash="company-overview"
					}, 2000);
				} else {
					toastr.error(d.detail);
				}
			},function(error){
				
			}).finally(function(){
				
			});
		}
	}
}]);

BA.controller ('addCompanyAdminsController',['$scope','$location', '$rootScope', '$http', 'UserService', 'API', 'Utils', 'toastr', '$timeout', 
											function($scope, $location, $rootScope, $http, UserService, API, Utils, toastr, $timeout) {
	$scope.showLoading  = true;
	$scope.submitting = false;
	var url = $location.absUrl();    
	if(url.indexOf('#') === -1){
		url = url.split("/");
		var param_1   = url[url.length-1];
	} else {
		url = url.split("#");
		url = url[0].split("/");
		var param_1   = url[url.length-1];
	}
	$scope.limit = 4;
	
	$scope.list = UserService.getAdminsIds(param_1); // Service to return all reviewslist
	$scope.list.then(function(data){	
		$scope.admins_ids	= data.detail;
	}).finally(function() {
		$scope.showLoading  = false;
	});
	
	
	$scope.addAdmins	= function(){
		if($('#add_admins').valid()){
			$scope.submitting = true;
			$scope.actionUrl = API + 'company/addAdmins';
			var formData = new FormData($('#add_admins')[0]);
			$scope.submitForm = UserService.submitForm($scope.actionUrl, formData);
			$scope.submitForm.then(function(d){
				$scope.submitting = false;
				
				if(d.statusCode=='200'){
					$('.innerAddJob .message-content').html('<div class="alert alert-success">'+d.detail+'</div>');
					
					$timeout(function(){
						window.location.hash="manage-company-admins"
					}, 2000);
				} else {
					toastr.error(d.detail);
				}
			},function(error){
				
			}).finally(function(){
				
			});
		}
	}
}]);

BA.controller ('CompanyManagedByUserController', ['$scope', '$rootScope', '$http', 'UserService', '$timeout',
                        function($scope, $rootScope, $http, UserService, $timeout, $confirm) {
		$scope.showLoading = true;	
		$scope.showLoadMore=true;
		$scope.showLoadingResult=false;
		$scope.offset   = 0;
		
		$scope.manageCompany = UserService.manageCompanyData($scope.offset, 6); // Service to return all user's groups		
		$scope.manageCompany.then(function(data){
			$scope.usercompanys  = data.detail.userCompany;
			if($scope.usercompanys.length<6){
				$scope.showLoadMore=false;
			}else{
				$scope.offset += 6;
			}
		},function(error) {
			
		}).finally(function() {
			$timeout(function(){
				$scope.showLoading = false;
			},2000);
		});
		
		$scope.getMoreCompData = function () {
			$('#magne-btn').css('pointer-events','none');
			$scope.showLoadingResult=true;
			if($scope.offset == 6){
				$(".managepagec").mCustomScrollbar({theme:"minimal-dark", autoHideScrollbar: true});
			}
			$timeout(function(){
				$scope.manageCompany = UserService.manageCompanyData($scope.offset, 6); // Service to return all user's groups		
				$scope.manageCompany.then(function(data){
					$('#magne-btn').css('pointer-events','auto');
					$scope.usercompanys.push.apply($scope.usercompanys,data.detail.userCompany);
					$('.managepagec.mCustomScrollbar').mCustomScrollbar('scrollTo', 'bottom');
					if(data.detail.userCompany.length<6){
						$scope.showLoadMore=false;
					}else{
						$scope.offset += 6;
					}
				},function(error) {
					
				}).finally(function() {
					$scope.showLoadingResult=false;
				});	
			},1000);
		}
		var delay = (function(){
		  var timer = 0;
		  return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		  };
		})(); 
		$scope.searchFilter = function(value){
			delay(function(){
				$scope.search = UserService.SearchMangeCompany(value);
				$scope.search.then(function(data) {
					console.log(data.detail.userCompany);
					$scope.usercompanys  = data.detail.userCompany;
				}, function(error) {
					console.log(error);
				}).finally(function() {
					
				});
			},500);
		}		
}]);

BA.controller ('userCompanyController', ['$scope', '$rootScope', '$http', 'UserService', '$timeout', '$location',
                        function($scope, $rootScope, $http, UserService, $timeout, $location) {		
						
	$scope.showLoading = true;
	$scope.showLoadMore=true;
	$scope.showLoadingResult=false;
    $scope.offset   = 0;
	$scope.userid	 = 1;
	
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }

	if(param_1 == "companies"){
		$scope.limit = 12;
	} else {
		$scope.limit = 4;
	}
	$scope.userCompany = UserService.myJoinCompany($scope.offset,$scope.limit,$scope.userid); // Service to return all user's groups		
	$scope.userCompany.then(function(data){
		$scope.company  	 = data.detail.userCompany;
		$scope.pagedata  	 = data.detail.userCompany.length;
		if($scope.company.length<$scope.limit){
			$scope.showLoadMore=false;
		}
		$scope.offset += $scope.limit;
	},function(error) {
		//toastr.error(error+': Invalid credentials given.');
	}).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},2000);
	});
	
	 $scope.getMoreCompData = function () {
		if(param_1 != "companies" || (!$scope.showLoadingResult && $("#list-tab .nav-tabs li:first-child").hasClass("active"))){
			$scope.showLoadingResult=true;
			$timeout(function(){
				$scope.userCompany = UserService.myJoinCompany($scope.offset,$scope.limit,$scope.userid); // Service to return all user's groups		
				$scope.userCompany.then(function(data){
					$scope.company.push.apply($scope.company,data.detail.userCompany);
					if(data.detail.userCompany.length<$scope.limit){
						$scope.showLoadMore=false;
					}
					$scope.offset += $scope.limit;
					$timeout(function(){
						$scope.showLoadingResult=false;
					},1000);
				},function(error) {
					
				}).finally(function() {
					
				});
			},1000);
		}
	}
	$scope.unFollowComp = function(id, index) {	
			var conf=confirm('Do you want unfollow this company?');
			if(conf){
				$scope.leftFromPage = UserService.SK_registerFollow(id);
				$scope.leftFromPage.then(function(data){
					if(data.status == 200){
						$scope.offset-=1;
						$scope.loadMoreGroup = UserService.myJoinCompany($scope.offset, 1, $scope.userid); // Service to return all user's groups		
						$scope.loadMoreGroup.then(function(data){
							if(data.statusCode == 200){
								$('.company-join #row-'+id).css('background-color','rgba(255,0,0,0.1)').hide('fade',{direction:'up'},500);
								$timeout(function(){
									$scope.company.splice(index, 1);
									$scope.company.push.apply($scope.company,data.detail.userCompany);
								},500);
								if(data.detail.userCompany.length==0){
									$scope.showLoadMore=false;
								}
								$scope.offset += 1;
							}
						},function(error) {
							
						}).finally(function() {
							
						});	
					}
					
				},function(error) {

				}).finally(function() {
					
				});
			}
		};
		var delay = (function(){
		  var timer = 0;
		  return function(callback, ms){
			clearTimeout (timer);
			timer = setTimeout(callback, ms);
		  };
		})(); 
		$scope.searchFilter = function(value){
			delay(function(){
				$scope.search = UserService.SearchJoinCompany(value);
				$scope.search.then(function(data) {
					$scope.company  	 = data.detail.userCompany;
				}, function(error) {
					console.log(error);
				}).finally(function() {
					
				});
			},500);
		}				
}]);

BA.controller ('userCompanySuggestionController', ['$scope', '$rootScope', '$http', 'UserService', '$timeout', '$location',
function($scope, $rootScope, $http, UserService, $timeout, $location,  $window) {
    /***
     * Call service to list all friends by suggestion
     */		
	$scope.showLoading 	= true;
	$scope.showLoadMore = true;
	$scope.ajaxLoading  = false;
	
	$scope.offset = 0;
	var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
	if(param_1 == "companies"){
		$scope.limit = 20;
	} else {
		$scope.limit = 4;
	}
	
    $scope.userCompanySuggestions = UserService.UserCompanySussgestData($scope.offset, $scope.limit); // Service to return all user's groups
    $scope.userCompanySuggestions.then(function(data){
		$scope.companysuggestion  = data.detail.companysuggestion;
		if($scope.companysuggestion.length<$scope.limit){
			$scope.showLoadMore=false;
		} 
		$scope.offset += $scope.limit;
    },function(error) {
        
    }).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},1000);
    });
	
	$scope.joinCompany=function(id, index){
		$('#discover .Join-btn').css('pointer-events','none');
		$('.joinbtn-'+id).addClass('hide');
		$('.spiner-'+id).removeClass('hide');
		$scope.leftFromPage = UserService.SK_registerFollow(id);
		$scope.leftFromPage.then(function(data){
			if(data.status == 200){
				$scope.offset-=1;
				$scope.loadMoreGroup = UserService.UserCompanySussgestData($scope.offset, 1); // Service to return all user's groups		
				$scope.loadMoreGroup.then(function(data){
					if(data.statusCode == 200){
						$('#row-'+id).css('background-color','rgba(255,0,0,0.1)').html('Company Liked successfully').show('fade',{direction:'up'},1500);
						$('#row-'+id).css('background-color','rgba(255,0,0,0.1)').hide('fade',{direction:'up'},1500);
						$('#discover .Join-btn').css('pointer-events','auto');
						$timeout(function(){
							$scope.companysuggestion.splice(index, 1);
							$scope.companysuggestion.push.apply($scope.companysuggestion,data.detail.companysuggestion);
						},1500);
						if(data.detail.companysuggestion.length==0){
							$scope.showLoadMore=false;
						}
						$scope.offset += 1;
					}
				},function(error) {
					
				}).finally(function() {
					
				});	
			}
			
		},function(error) {

		}).finally(function() {
			
		});
	}	
	$scope.loadMoreCompany = function(){
		if(!$scope.ajaxLoading && $("#list-tab .nav-tabs li:nth-child(2)").hasClass('active')){
			$scope.ajaxLoading  = true;
			$(".nav.navbar-nav").css('pointer-events','none');
			$scope.UserCompanyData = UserService.UserCompanySussgestData($scope.offset, $scope.limit); // Service to return all user's groups
			$scope.UserCompanyData.then(function(data){
				$(".nav.navbar-nav").css('pointer-events','auto');
				$scope.offset += $scope.limit;
				$scope.companysuggestion.push.apply($scope.companysuggestion,data.detail.companysuggestion);
				if(data.detail.companysuggestion.length<$scope.limit){
					$scope.showLoadMore=false;
				}
				$timeout(function(){
					$scope.ajaxLoading  = false;
				},1000);
			},function(){
				
			}).finally(function(){
				
			});
		}
	} 
}]);

BA.controller ('mentorsProfileController', ['$scope', '$rootScope', '$http', 'LifeSkills', 'API', 'toastr', '$location', 'filterFilter', '$compile',
                        function($scope, $rootScope, $http, LifeSkills, API, toastr, $location, filterFilter, $compile){
    var url = $location.absUrl();
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }

	if(url[4] == 'profile' && url[5] == '' || url[5] == undefined){
		var userid=1;
	}else{
		var userid=url[5];
	}
	
    $scope.showLoading = true;	
	$scope.showLoadMore=true;
	$scope.showLoadingResult=false;
	
    $scope.mentorshipAreas          = {};
    $scope.mentorshipLocations      = {};
    $scope.mentorshipCategory       = {};
    
	$scope.offset = 0;
	
    $scope.mentors = LifeSkills.getMentorsDirectoryList($scope.offset,6,userid);
    $scope.mentors.then(function(data) {
        $scope.mentorsData = data.detail;
		if($scope.mentorsData.length<6){
			$scope.showLoadMore=false;
		}else{
			$scope.offset += 6;
		}
    }, function(error) {

    }).finally(function() {
        $scope.showLoading = false
    });
	$scope.removeMentor = function(mentor){
		var mentor_text=$(".mentor-"+mentor+" span.mentor-text").html();
		if(mentor_text.trim()=='Unfollow Mentor'){
			$r=confirm('Do you want to remove mentor?');
			if ($r==true){ }else{ return false }
		}
		$scope.submitting	= true;
		element				= $('.mentor-' + mentor);
		element.find(".fa-spinner").removeClass('hide');
		element.find(".fa-plus").addClass('hide');		
		$scope.Mentoradd  	 = LifeSkills.SK_registerMentor(mentor); 
		$scope.Mentoradd.then(function(data){
			if(data.status == 200){
				$('#followMentor-'+mentor).html(data.Followers + ' Followers');
				if(data.html == 'insert'){
				   element.html('<i class="fa fa-spinner fa-spin hide"></i> <span class="mentor-text">Unfollow Mentor</span>');
				}else if(data.html == 'delete'){
					element.html('<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus"></i> <span class="mentor-text">Follow Mentor</span>');
				}
			}	
		}).finally(function() {
			$scope.submitting	= false;
			element.find(".fa-spinner").addClass('hide');
			element.find(".fa-plus").removeClass('hide');
		});
	}
	$scope.getMoreMentorData = function(mentor, index){	
			$('#magne-btn').css('pointer-events','none');			
			if($scope.offset == 6){
				$(".managepagec").mCustomScrollbar({theme:"minimal-dark", autoHideScrollbar: true});
			}
			$scope.Mentoradd  	 = LifeSkills.getMentorsDirectoryList($scope.offset,6,userid); 
			$scope.Mentoradd.then(function(data){		
				//$scope.mentorsData 			= data.detail;
				$scope.mentorsData.push.apply($scope.mentorsData,data.detail);
				$('#magne-btn').css('pointer-events','auto');
				$('.managepagec.mCustomScrollbar').mCustomScrollbar('scrollTo', 'bottom');
				if(data.detail.length<6){
					$scope.showLoadMore=false;
				}else{
					$scope.offset += 6;
				}
			}).finally(function() {
				$scope.showLoadMore=false;
			});
		}
}]);

BA.controller ('userCompanyControllerNew', ['$scope', '$rootScope', '$http', 'UserService', '$timeout', '$location',
                        function($scope, $rootScope, $http, UserService, $timeout, $location) {		
						
	$scope.showLoading = true;
	$scope.showLoadMore=true;
	$scope.showLoadingResult=false;
    $scope.offset   = 0;
	$scope.limit 	= 6;
	
  var url = $location.absUrl();
    
    if(url.indexOf('#') === -1){
        url = url.split("/");
        var param_1   = url[url.length-1];
    } else {
        url = url.split("#");
        url = url[0].split("/");
        var param_1   = url[url.length-1];
    }
	if(url[4] == 'profile' && url[5] == '' || url[5] == undefined){
		var userid=1;
	}else{
		var userid=url[5];
	}

	
	$scope.userCompany = UserService.myJoinCompany($scope.offset, $scope.limit, userid); // Service to return all user's groups		
	$scope.userCompany.then(function(data){
		$scope.company  	 = data.detail.userCompany;
		$scope.pagedata  	 = data.detail.userCompany.length;
		if($scope.company.length<$scope.limit){
			$scope.showLoadMore=false;
		}
		$scope.offset += $scope.limit;
	},function(error) {
		//toastr.error(error+': Invalid credentials given.');
	}).finally(function() {
		$timeout(function(){
			$scope.showLoading = false;
		},2000);
	});
	
	 $scope.getMoreCompanyData = function () {		
		$scope.showLoadingResult=true;
			if($scope.offset == 6){
				$(".managepagec").mCustomScrollbar({theme:"minimal-dark", autoHideScrollbar: true});
			}
			$timeout(function(){
				$scope.userCompany = UserService.myJoinCompany($scope.offset,$scope.limit, userid); // Service to return all user's groups		
				$scope.userCompany.then(function(data){
					$scope.company.push.apply($scope.company,data.detail.userCompany);
					if(data.detail.userCompany.length<$scope.limit){
						$scope.showLoadMore=false;
					}
					$scope.offset += $scope.limit;
					$timeout(function(){
						$('.managepagec.mCustomScrollbar').mCustomScrollbar('scrollTo', 'bottom');
						$scope.showLoadingResult=false;
					},1000);
				},function(error) {
					
				}).finally(function() {
					
				});
			},1000);
		}
		$scope.removeCompany = function(id, index) {	
				var mentor_text=$(".mentor-"+id+" span.mentor-text").html();
				if(mentor_text.trim()=='Unfollow'){
					$r=confirm('Do you want to unfollow?');
					if ($r==true){ }else{ return false }
				}
				$scope.submitting	= true;
				element				= $('.mentor-' + id);
				element.find(".fa-spinner").removeClass('hide');
				element.find(".fa-plus").addClass('hide');
				
				$scope.leftFromPage = UserService.SK_registerFollow(id);
				$scope.leftFromPage.then(function(data){
					if(data.status == 200){
						$('#followCount-'+id).html(data.Followers + ' Followers');
						if(data.is_CompStauts==true){
							element.html('<i class="fa fa-spinner fa-spin hide"></i> <span class="mentor-text">Unfollow</span>');
						}else{
							element.html('<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus"></i> <span class="mentor-text">Follow</span>');
						}
					}
				},function(error) {

				}).finally(function() {
					$scope.submitting	= true;
					element.find(".fa-spinner").addClass('hide');
					element.find(".fa-plus").removeClass('hide');
				});
			}
}]);	
/* EOF */