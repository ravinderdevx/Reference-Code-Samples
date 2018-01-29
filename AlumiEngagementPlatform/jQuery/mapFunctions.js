function clearAllMarkers() {
	for(var i=0; i<markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// If the map position is out of range, move it back
function checkBounds(map) {
	var latNorth = map.getBounds().getNorthEast().lat();
	var latSouth = map.getBounds().getSouthWest().lat();
	var newLat;

	if(latNorth<85 && latSouth>-85)     /* in both side -> it's ok */
		return;
	else {
		if(latNorth>85 && latSouth<-85)   /* out both side -> it's ok */
			return;
		else {
			if(latNorth>85)   
				newLat =  map.getCenter().lat() - (latNorth-85);   /* too north, centering */
			if(latSouth<-85) 
				newLat =  map.getCenter().lat() - (latSouth+85);   /* too south, centering */
		}   
	}
	if(newLat) {
		var newCenter= new google.maps.LatLng( newLat ,map.getCenter().lng() );
		map.setCenter(newCenter);
	}   
}

function createMarker(result, infowindow, map, network, jobCount, text) {
	if( network === undefined){network=false;}
	if( jobCount === undefined){jobCount=0;}
	if( text === undefined){text='';}
	
	if(network){
		var icon = {
			url: '/common/images/network-marker.png' 
		};
		var labelsClass="networkLabels";
		var labelContent='<label title="Jobs in your Network'+text+'">'+result.count+'</label>';
		var mainClass="";
		if(result.count<10){
			labelsClass+=" nw10";
			mainClass="10";
		} else if(result.count>=10 && result.count<100){
			labelsClass+=" nw100";
			mainClass="100";
		} else if(result.count>=100 && result.count<500){
			labelsClass+=" lt500"; 
			mainClass="500";
		} else if(result.count>=500 && result.count<1000){
			labelsClass+=" nw1000";
			mainClass="1000";
		} else if(result.count>=1000 && result.count<5000){
			labelsClass+=" nw5000";
			mainClass="5000";
		} else if(result.count>=5000 && result.count<10000){
			labelsClass+=" nw10000";
			mainClass="10000";
		} 
		
		if(jobCount<10){
			labelsClass+=" marker"+mainClass+"w10";
		} else if(jobCount>=10 && jobCount<100){
			labelsClass+=" marker"+mainClass+"w100";
		} else if(jobCount>=100 && jobCount<500){
			labelsClass+=" marker"+mainClass+"w500";
		} else if(jobCount>=500 && jobCount<1000){
			labelsClass+=" marker"+mainClass+"w1000";
		} else if(jobCount>=1000 && jobCount<5000){
			labelsClass+=" marker"+mainClass+"w5000";
		} else if(jobCount>=5000 && jobCount<10000){
			labelsClass+=" marker"+mainClass+"w10000";
		}
		
		var marker = new MarkerWithLabel({
			position: new google.maps.LatLng(result.latitude, result.longitude),
			map: map,
			labelContent: labelContent,
			icon: 'image',
			labelAnchor: {'x': 7, 'y': 28},
			title: result['name'],
			labelClass: labelsClass
		});
	} else {
		var icon = {
			url: '/common/images/big-marker.png'
		};
		var labelsClass="labels";
		if(result.count<10){
			icon.scaledSize = new google.maps.Size(40, 40);
			labelsClass+=" lt10";
		} else if(result.count>=10 && result.count<100){
			icon.scaledSize = new google.maps.Size(45, 45);
			labelsClass+=" lt100";
		} else if(result.count>=100 && result.count<500){
			icon.scaledSize = new google.maps.Size(55, 55);
			labelsClass+=" lt500"; 
		} else if(result.count>=500 && result.count<1000){
			icon.scaledSize = new google.maps.Size(60, 60);
			labelsClass+=" lt1000";
		} else if(result.count>=1000 && result.count<5000){
			icon.scaledSize = new google.maps.Size(68, 68);
			labelsClass+=" lt5000";
		} else if(result.count>=5000 && result.count<10000){
			icon.scaledSize = new google.maps.Size(72, 72);
			labelsClass+=" lt10000";
		}
		var marker = new MarkerWithLabel({
			position: new google.maps.LatLng(result.latitude, result.longitude),
			map: map,
			labelContent: '<span title="Total Jobs in '+result['name']+text+'">'+result.count+'</span>',
			icon: icon,
			labelAnchor: {'x': 7, 'y': 28},
			title: result['name'],
			labelClass: labelsClass
		});
	}
	$("#title").keyup(function (e) {
		if (e.which == 13) {
		 openInfoWindow(map, marker, infowindow);
		}
	});

	google.maps.event.addListener(marker, 'click', function() {
	 openInfoWindow(map, marker, infowindow);
	});
	//google.maps.event.addListener(map, 'drag', checkLatitude);
	if(result['name'] == 'Pune') {
		demo_marker = marker;
	}
	if(result['name'] == 'India'){
		demo_country_marker = marker;
	}
	return marker;
}
function getResults(zoomLevel, infowindow, map, filter, text, callback) {
    if( text === undefined ){ text = '';}
	filter = typeof filter !== 'undefined' ? filter : 'no';
    if(!$("#filter-modal").hasClass("show-modal") || filter === "yes"){
        var filtertxt='';
        filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();

        if(zoomLevel < 5) {
            newPlaceType='country';
        } else if (zoomLevel>4 && zoomLevel<7) {
            newPlaceType='state';
        } else if (zoomLevel>6) {
            newPlaceType='city';
        }
		
        
        if(newPlaceType!=CURRENT_PLACE_TYPE || filter=='yes') {
            CURRENT_PLACE_TYPE = newPlaceType;
            $.ajax({
				crossDomain: true,
				url: "/user/jobmapdata",
				data: {'q': '', 'pt': CURRENT_PLACE_TYPE, 'filter': filtertxt},
				success: function(res) {
					clearAllMarkers();
					var results = JSON.parse(res);
					if(typeof(results.userDetails) !== "undefined" && results.userDetails !== null){
						$(".radiusSearch").attr("onclick","radiusSearch("+results.userDetails.latitude+", "+results.userDetails.longitude+", '"+results.userDetails.city+"', '"+results.userDetails.username+"')");
					} else {
						$(".radiusSearch").attr("onclick","radiusSearch(0, 0, '', '')");
					}
					if(typeof(results.jobs) !== "undefined" && results.jobs !== null){
						for(var i=0; i<results.jobs.length;i++)
						{
							var newmarker = createMarker(results.jobs[i], infowindow, map, false, 0, text);
							markers.push(newmarker);
							if(typeof(results.networkJobs) != "undefined" && results.networkJobs != null){
								for(var j=0; j<results.networkJobs.length;j++)
								{ 
									if(results.networkJobs[j].name == results.jobs[i].name){
										var netmarker = createMarker(results.networkJobs[j], infowindow, map, true, results.jobs[i].count, text);
										markers.push(netmarker);
									}
								}
							}
						}
					}
					if(typeof(callback) !== "undefined" && callback !== null){
						callback(results.jobs);
					}
				}
            });
        }
    }
}

function openInfoWindow(map, markerItem, infowindow) {
	if($("#mobile-map").is(":visible")){
		$('#mobile-map #editor-features').show();
		$('#mobile-map .arrow-box').hide();
	}else{
		if($("#help-menu").is(":visible")){
			$("#help-menu").hide('slide', {direction: 'down'});
			$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
			$('.map-block').animate({'margin-left':0});
			$(".arrow-right").removeClass("arrow-left");
			$("#side-menu").removeClass("show-filters").removeClass("show-results").removeClass("show-both");
			setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","");},500);
		} else {
			if( $("#side-menu").hasClass("show-filters") ){
				$("#side-menu").removeClass("show-filters").addClass("show-both").animate({'left':0},{
					complete: function() {
						//$('.map-block').animate({'margin-left':$("#side-menu").outerWidth()});
						$(".arrow-right").addClass("arrow-left");
					}
				});
			} else if( $("#side-menu").hasClass("show-both") || $("#side-menu").hasClass("show-results") ){

			} else {
				if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
					$("#editor-elements").addClass("hide");
				}
				$("#side-menu").addClass("show-results").animate({'left':0},{
					complete: function() {
						$('.map-block').animate({'margin-left':$("#editor-features").outerWidth()});
						$("#editor-elements").addClass("hide");
					}
				});
			}
		}
	}
	$("#jobsMsg, #shortJobsMsg").addClass("hide");
	$("#editor-features .nav-tabs li:last-child a").trigger("click");
	var filtertxt='';
	filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();
	var filters = filtertxt.split('&');
	var filterslength=filters.length;
	var filterResult='';
	$.each(filters, function(index, value){
		var filter = value.split('=')[1];
		if(filter !==''){
			if(index>0 && filterResult !==''){
				filterResult+='&'+value;
			} else {
				filterResult+=value;	
			}
		}
		
	});
	var loderContent 	= '';
	var loaderAlumniMsg ='';
	
	var conditionValue = markerItem.labelContent.match(/\d+/)[0];
	if(conditionValue>10){
		conditionValue = 10;
	}
	
	for(var i=0; i<conditionValue; i++){
		loderContent+='<div class="loader-panel-box user-profile-dummy" style="background:#fff !important;"><div class="user-profile-container"><div class="user-profile" style="margin-right: 0;width:75px;"><div class="progress" style="height: 75px;"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div></div><div class="user-profile-detail-container"><div class="user-profile-detail loader-sidebar"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 top-row"><div class="user-name" style="width:60%;"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div><div class="loader-btn"style="width:12%;"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div></div></div></div>';
	}
	$('.tab-content #profile').html(loderContent);
	loaderAlumniMsg+='<div style="width:100%;float:left"><div class="user-name" style="width:100%;float: left;"><div class="progress" style="height: 10px"><div class="progress-bar progress-bar-striped2 active  role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%;"></div></div></div>';		
	$('#editor-features #JobsMsg').css('background-color','#f1f2f4').html(loaderAlumniMsg);
	setTimeout(function(){
		var ajaxURL="";
		var netJobsMsg="";
		if(markerItem.labelClass.indexOf("networkLabels")>=0){
			ajaxURL="/user/listJobs/"+true;
			$("#JobsMsg").removeClass('hide').removeClass('message-box').addClass('second-box');
			netJobsMsg+="your network in ";
		} else {
			ajaxURL="/user/listJobs/";
			$("#JobsMsg").removeClass('hide').removeClass('second-box').addClass('message-box');
		}
		$.ajax({
			crossDomain: true,
			url: ajaxURL,
			data: {
				'place': markerItem.title, 
				'q': '', 
				'pt': CURRENT_PLACE_TYPE,
				'filter': filtertxt
			},
			success: function(html) {
				var aData = JSON.parse(html);
				var searchlocation='';
				var searchid='';
				switch(newPlaceType){
					case 'country':
						searchlocation='country';
						searchid=aData.jobList.results[0]['country_id'];
					break;
					case 'state':
						searchlocation='state';
						searchid=aData.jobList.results[0]['state_id'];
					break;
					case 'city':
						searchlocation='location';
						searchid=aData.jobList.results[0]['city_id'];
					break;
				}
				if(aData.jobList.loggedIn){
					$('#side-menu .nav-justified li:last-child, #mobile-map .nav-justified li:last-child').show();
				}
				var jobsData=[];
				var count=[];
				$.each(aData, function(index,value){
					jData = value.results;
					jobsData[index]='<div class="job_list_container"><div class="data-container">';
					count[index]=(jData !== null && jData !== '')?jData.length:0;
					if(jData !== null && jData !== ''){
						for(var i = 0; i < jData.length; i++) {	
							jobsData[index]+='<div class="panel-box job_'+jData[i].id+'"><div class="media"><div class="media-left"><a href="javascript:void(0);">';
												if(jData[i].logo!==''){
													jobsData[index] +=  '<img class="media-object" src="'+jData[i].logo+'"  width="70px">';
												}else{
													jobsData[index] +=	'<img class="media-object" src="/common/images/hall-ticketcompany-logo-default.png" width="70px" height="70px;">';
												}
									jobsData[index]+='</a></div><div class="media-body"><a href="javascript:void(0);" class="media-heading pull-left" onclick="jobDetails('+jData[i].id+')";>'+jData[i].job_title+'</a>';
												if(aData.jobList.loggedIn){
													if(jData[i].status==1){
														jobsData[index]+= '<a href="javascript:void(0);" class="pull-right heartAnimation heart" id="like1" value="" rel="unlike" onclick="likejobDetails(this,'+jData[i].id+',\''+netJobsMsg+markerItem.title+'\')" title="Remove shortlisted job"> </a>';
													}else{
														jobsData[index]+= '<a href="javascript:void(0);" class="pull-right heart" id="like1" value="" rel="like" onclick="likejobDetails(this,'+jData[i].id+',\''+netJobsMsg+markerItem.title+'\')" title="Shortlist this job"> </a>';	
													}
												}
												jobsData[index]+= '<div class="clearfix"></div>';
												if(jData[i].company !==null){
													if(jData[i].company_page !== null && jData[i].company_page != ''){
														jobsData[index]+='<div class="describtion"><a href="/company/index/'+jData[i].company_page+'" target="_blank" title="'+jData[i].company+'">'+jData[i].company.substring(0,30)+(jData[i].company.length>30?'...':'')+'</a></div>';
													} else {
														jobsData[index]+='<div class="describtion" title="'+jData[i].company+'"> '+jData[i].company.substring(0,30)+(jData[i].company.length>30?'...':'')+' </div>';	
													}
												}
												jobsData[index]+='<div class="describtion"> '+jData[i].city+', '+jData[i].state+' </div></div></div></div>';
						}
					}else{
						jobsData[index]+='';
					}
					jobsData[index]+='</div>';
					if(index == 'jobList'){
						if(value.total>count[index]){
							jobsData[index]  += '<div class="row"><button class="btn-load-more" id="load_more_btn" onclick="loadMoreJobs(this, \''+ajaxURL+'\', \''+markerItem.title+'\', \''+netJobsMsg+'\');"> <i class="fa fa-spinner fa-spin hide" ></i> Load More</button></div>';
						}
					} else {
						if(value.total>count[index]){
							jobsData[index]  += '<div class="row"><button class="btn-load-more" id="load_more_btn" onclick="loadMoreJobs(this, \'\', \'\',\'\', \'shortlisted\');"> <i class="fa fa-spinner fa-spin hide" ></i> Load More</button></div>';
						}
					}
					jobsData[index]+='</div>';
				});
				
				var avaliableJobsMsg='';
				avaliableJobsMsg+=aData.jobList.total+' job(s) available in '+netJobsMsg+markerItem.title;
				if(aData.jobList.total>50){
					if(filterResult !==''){
						avaliableJobsMsg+='<div class="pull-right" id="pull-right"><a href="/jobs/search/'+searchlocation+'/'+searchid+'?'+filterResult+'" target="_blank">View all</a></div>';
					} else {
						avaliableJobsMsg+='<div class="pull-right" id="pull-right"><a href="/jobs/search/'+searchlocation+'/'+searchid+'" target="_blank">View all</a></div>';
					}
				}
				if(typeof(aData.shortList) != "undefined" && aData.shortList !== null){
					if( aData.shortList.total=== null || aData.shortList.total === 0 ) {
						$("#shortJobsMsg").html('You have not shortlisted any Job in '+netJobsMsg+markerItem.title);
					} else {
						$("#shortJobsMsg").html(aData.shortList.total+' job(s) shortlisted in '+netJobsMsg+markerItem.title);
					}
				}
				
				$('.tab-content #profile').html(jobsData['jobList']);
				$('.tab-content #home').html(jobsData['shortList']);
				$('.nav-tabs .jobs-count').html(count['jobList']);
				$('.nav-tabs .filter_count').html(count['shortList']);
				$("#JobsMsg").css('background-color','').html(avaliableJobsMsg);
				//$(".spinner-loader").hide();
				var profileHeight=$("#side-menu").height()-$(".nav-tabs.nav-justified").outerHeight(true)-$(".search-panel").outerHeight(true)-$("#JobsMsg").outerHeight(true);
				$(".job_list_container").css('max-height',profileHeight);
				$(".job_list_container").mCustomScrollbar({theme:"dark"});
				//$('#mobile-map .shortlist-icon').trigger("click");
				if($("#mobile-map").is(":visible")){
					$('#mobile-map .arrow-box').show();
					$("#mobile-map .nav-tabs li:last-child a").trigger("click");
					$("#mobile-map #editor-features").show();
					var docheight=$(window).height();
					var tabheight=($('.navbar').outerHeight(true)+2*($('.arrow').outerHeight(true))+90);
					var countheihgt=docheight-tabheight;
					$('#mobile-map .job_list_container').css('max-height',countheihgt);
				}
			}
		});
	},1000);
}
function jobDetails(jobid){
	$("#map-job-detail").hide('slide',{direction:'right'},300);
	$(".ask-referral,.text-message") .css('display','none');	
	$(".apply-btn, .recommend-btn").css("display","table-cell");
	$(".request-referral-btn").show();
	$('.transparent-layer').css('display','none');
	//var loguserid="<?php echo $this->session->userdata('user_id'); ?>";
	$.ajax({
		crossDomain: true,
		url: "/jobs/singleJobDetails/"+jobid+"/"+true,
		success: function(response) {
			var Data = JSON.parse(response);
			var jobDetails = Data.jobInfo;
			var keyskills=Data.jobKeys;
			var keys='';
			if( (typeof keyskills === "object") && (keyskills !== null) ){
				$.each(keyskills, function(index, value){
					keys+='<a href="javascript:void(0)">'+value.name+'</a>';
				});
			} else {
				$.each(keyskills.split(','), function(index, value){
					keys+='<a href="javascript:void(0)">'+value+'</a>';
				});
			}
			$("#map-job-detail").show('slide',{direction:'right'},300);
			$("#map-job-detail .nav-tabs li:first-child a").trigger("click");
			
			/***** Job Details *******/
			var html='';
			html+='<input type="hidden" value="'+jobid+'" id="singleJobId"/>';
			html+='<div class="info"><div class="media"><div class="media-left"><a href="javascript:void(0);">';
						if(jobDetails.logo!=''){
							html +=  '<img class="media-object" src="'+jobDetails.logo+'"  width="70px">';
						}else{
							html +=	'<img class="media-object" src="/common/images/hall-ticketcompany-logo-default.png" width="70px" height="70px;">';
						}
				html += '</a></div><div class="media-body">';
					  if(jobDetails.name !== null && jobDetails.name !==""){
							if(jobDetails.company_page !== null && jobDetails.company_page != ''){
								html +='<div class="media-heading tex">Company: <a href="/company/index/'+jobDetails.company_page+'" target="_blank" title="'+jobDetails.name+'">'+jobDetails.name.substring(0,30)+(jobDetails.name.length>30?'...':'')+'</a></div>';
							} else {
								html +='<div class="media-heading tex" title="'+jobDetails.name+'">Company: '+jobDetails.name.substring(0,30)+(jobDetails.name.length>30?'...':'')+' </div>';	
							}
					  } else {
						html += '<div class="media-heading tex">Company: Not Avaliable</div>';  
					  }
					  if(jobDetails.added_by=='0'){
						if(jobDetails.first_name !==null && jobDetails.last_name !== null){
							html += '<h6>Posted By: <span id="posted-by">'+jobDetails.first_name+' '+jobDetails.last_name+'</span></h6>';
						}
					  } else if(jobDetails.added_by=='1') {
						  html += '<h6>Posted By: <span id="posted-by">Almabay</span></h6>';
					  }else {
							html += '<h6>Posted By: <span id="posted-by">Not Avaliable</span></h6>';
						}
					     
				html += '<h6>Posted On: <span class="ajax-time" title="'+jobDetails.date_time+'">'+jobDetails.date_time+'</span></h6></div></div><div class="jobs-info clearfix"><ul class="nav navbar-nav"><li><a href="javascript:void(0);"><i class="fa fa-map-marker" aria-hidden="true"></i> <span id="job-location" title="Location"> '+jobDetails.city+' </span></a></li>';
				if(jobDetails.hr_email!=='' && jobDetails.hr_email!==null){
				html	+=	'<li><a href="javascript:void(0);"><i class="fa fa-envelope" aria-hidden="true"></i><span id="job-mail" title="E-Mail Address"> '+jobDetails.hr_email+'</span></a></li>';
				}				
				if(jobDetails.contact_number!==""){
					html += '<li><a href="javascript:void(0);"><i class="fa fa-phone" aria-hidden="true"></i><span id="job-contact" title="Contact No"> '+jobDetails.contact_number+'</span></a></li>';
				}
				html	+=	'</ul></div><div class="clearfix"><ul class="nav navbar-nav company-requirement"><li><span class="total" id="range-exp">'+jobDetails.min_exp+'-'+jobDetails.max_exp+' (yrs)</span><div class="experience">Experience</div></li>';
				if( jobDetails.max_ctc !=0 && jobDetails.max_ctc !=='' && jobDetails.max_ctc !==null){
					html+='<li><span class="total" id="range-ctc">'+jobDetails.min_ctc+'-'+jobDetails.max_ctc+' (Lacs)</span><div class="experience">Package</div></li>';
				}
				html+=	'<li style="text-align: center;"><span class="total" id="openings">'+jobDetails.open_positions+'</span><div class="experience">Openings</div></li>';
						html+='</ul></div><div class="desc_scroll">';
				if(jobDetails.job_info!=='' && jobDetails.job_info !==null){
					html+='<div class="describtion"><h5>Description</h5><div id="job-description">'+jobDetails.job_info+'</div></div>';
				}
				html+='<div class="keyskill" id ="job-skills"><h5>Key Skills</h5>'+keys+'</div></div></div>';
				
			/******** Referral List **********/
			
			if(Data.sk!==null && Data.sk!==''){
				var friendsList = Data.friendList;
				friendsData='';
				if(friendsList && friendsList.length !=0){
					friendsData+='<div class="multiple clearfix"><div class="request-referral"> '+friendsList.length+' Request Referral </div>';
					if(friendsList.length>1){				
					friendsData+='<div class="multiple-selection">Multiple Selection <a href="javascript:void(0);" class="multiple-icon" onclick="selectMultipleOption();"></a></div>';
					}
					friendsData+='</div><div class="alert hide"></div><div class="scroll-position">';
					$.each(friendsList, function(index,value){
						friendsData+='<div class="panel-box pb_'+value.user_id+'"><div class="media"><div class="checkbox"><label class="checkbox-custom"><input id="checkbox_'+value.user_id+'" type="hidden" name="referralCheckbox[]" class="referralCheckbox"><i class="fa fa-fw fa-square-o" onclick="checkMark(this, \'checkbox_'+value.user_id+'\','+value.user_id+');"></i></label></div><div class="media-left"><a href="/user/timeline/'+value.encrypted+'" target="_blank"><img width="70px" height="70px;" alt="'+value.name+'" src="'+value.imageUrl+'" class="media-object"></a></div><div class="media-body"><a class="media-heading pull-left" href="/user/timeline/'+value.encrypted+'" target="_blank">'+value.name+'</a>';
												if(value.mentorWithYou!==null){
													friendsData+='<a class="pull-right meting-icon" href="javascript:void(0);" title="Your mentor since '+value.mentorWithYou+'"> </a>';
												}
												if(value.batchMateWithYou!==null){
													friendsData+='<a class="pull-right graduation-icon" href="javascript:void(0);" title="Studied at '+value.batchMateWithYou+'"> </a>';
												}
												if(value.workedTogther!==null){
													friendsData+='<a class="pull-right profession-icon" href="javascript:void(0);" title="Worked at '+value.workedTogther+'"> </a>';
												}
												if(value.friendWithYou!==null){
													friendsData+='<a class="pull-right person-icon" href="javascript:void(0);" title="Your friend since '+value.friendWithYou+'"> </a>';
												}
								friendsData+='<div class="clearfix"></div><div class="describtion">';
												if(value.designation !== null && value.designation !== ""){
													friendsData  +=	value.designation;
												}
												if(value.institute !==null && value.institute !== ""){
													if(value.designation !== null && value.designation !== ""){
														friendsData+=' At '+value.institute;
													} else {
														friendsData+=value.institute;
													} 
												}
								friendsData+='</div><div class="describtion">';
												if(value.year_from !== null && value.year_to !== null){
													var currentYear = (new Date).getFullYear();
													if(value.year_to == 0 ||  value.year_to == currentYear){
														friendsData  +=	' ('+value.year_from+'-Present)';
													} else {
														friendsData  +=	' ('+value.year_from+'-'+value.year_to+')';
													}
												} else if(value.year_to !== null ){
													friendsData  +=	' ('+value.year_to+')';
												}
												friendsData+='</div>';
												if(value.location !== null){
													friendsData  +=	'<div class="describtion"><strong>Location: </strong>'+value.location+'</div>';
												}
												friendsData  +='<div class="text-message">\
													<input type="hidden" name="user_id" value="'+value.user_id+'">\
													<textarea name="referralMsg" class="form-control" rows="3" placeholder="Message" id="referralMsg_'+value.user_id+'"></textarea>\
													<div class="err errorMsg"></div>\
													 <div>\
													 <div class="row">\
														<div class="col-md-3">\
															<h4 class="resume-text">Resume: </h4>\
														</div>\
														<div class="col-md-9">\
															<div class="attach-input space-top">';
																if( Data.jobResume !== '' && Data.jobResume !==  null  ){
																	friendsData  +='<input type="radio" name="resumeOpt_'+value.user_id+'" value="attach" class="radio-btn" onclick="showUpload(\'resumeOpt_'+value.user_id+'\',\'resume_'+value.user_id+'\');">\
																	<span>Attach latest resume</span>\
																	<div class="fileUpload btn">\
																	<input type="file" name="resume" id="resume_'+value.user_id+'" class="uploadBox hide" accept="doc,docx,pdf">';
																} else {
																	friendsData  +='<input type="radio" name="resumeOpt_'+value.user_id+'" value="attach" class="radio-btn" onclick="showUpload(\'resumeOpt_'+value.user_id+'\',\'resume_'+value.user_id+'\');" checked="checked">\
																	<span>Attach latest resume</span>\
																	<div class="fileUpload btn">\
																	<input type="file" name="resume" id="resume_'+value.user_id+'" class="uploadBox" accept="doc,docx,pdf">';
																}
																friendsData  +='</div> \
															  <div class="max-size">Max upload size is 500kb</div>\
															  <div class="err errorUpload"></div>\
															</div>';
															
														if( Data.jobResume !== '' && Data.jobResume !==  null ){
															var filenamearr=Data.jobResume.name.split(".");
															var ext=filenamearr[filenamearr.length-1];
															friendsData  +=	'<div class="attach-input">\
																				<input type="radio" class="radio-btn bt" name="resumeOpt_'+value.user_id+'" value="used" onclick="showUpload(\'resumeOpt_'+value.user_id+'\',\'resume_'+value.user_id+'\');" checked="checked" > Use&nbsp;&nbsp;&nbsp;\
																				<a target="_blank" href="/jobs/download/'+Data.jobResume.name+'/'+Data.jobResume.ID+'">Resume-'+Data.sk.user.first_name+' '+Data.sk.user.last_name+'.'+ext+'</a>\
																			</div>';
														} 
														friendsData  +=	'</div></div></div></div>\
												 <a href="javascript:void(0);" class="request-referral-btn" onclick="referral_click(this)">Request Referral </a>\
											</div>\
										</div>\
										<div class="transparent-layer"></div>\
								</div>';
					});
					friendsData+='<div class="multi-refer-message hide">\
									<textarea name="multiReferralMsg" class="form-control" rows="3" placeholder="Message" id="multiReferralMsg"></textarea>\
									<div class="err errorMsg"></div>\
									 <div>\
									 <div class="row">\
										<div class="col-md-3">\
											<h4 class="resume-text">Resume: </h4>\
										</div>\
										<div class="col-md-9">\
											<div class="attach-input space-top">';
											if( Data.jobResume !== '' && Data.jobResume !==  null ){
												friendsData+='<input type="radio" name="resumeOptMulti" value="attach" onclick="showUpload(\'resumeOptMulti\', \'resumeMulti\');" >\
												<span>Attach latest resume</span>\
												<div class="fileUpload btn">\
													<input type="file" name="resumeMulti" id="resumeMulti" class="uploadBox hide" accept="doc,docx,pdf">\
												</div>';
											} else {
												friendsData+='<input type="radio" name="resumeOptMulti" value="attach" onclick="showUpload(\'resumeOptMulti\', \'resumeMulti\');" checked="checked">\
												<span>Attach latest resume</span>\
												<div class="fileUpload btn">\
													<input type="file" name="resumeMulti" id="resumeMulti" class="uploadBox" accept="doc,docx,pdf">\
												</div>';
											}
											friendsData+='<div class="max-size">Max upload size is 500kb</div>\
															<div class="err errorUpload"></div></div>';
											
										if( Data.jobResume !== '' && Data.jobResume !==  null ){
											var filenamearr=Data.jobResume.name.split(".");
											var ext=filenamearr[filenamearr.length-1];
											friendsData  +=	'<div class="attach-input">\
																<input type="radio" name="resumeOptMulti" value="used" onclick="showUpload(\'resumeOptMulti\',\'resumeMulti\');" checked="checked" class="bt"> Use&nbsp;&nbsp;&nbsp;\
																<a target="_blank" href="/jobs/download/'+Data.jobResume.name+'">Resume-'+Data.sk.user.first_name+' '+Data.sk.user.last_name+'.'+ext+'</a>\
															</div>';
										} 
										friendsData  +=	'</div></div></div></div>';
					friendsData+='</div>';
					
				} else {
					friendsData+='<div class="multiple clearfix"> At the moment, we can\'t find any referral for this job. Please check back later. </div><div class="scroll-position"></div>';
				}
				$("#map-job-detail #your-referral").html(friendsData);
				$(".scroll-position").mCustomScrollbar({theme:"dark"});
			}
			$("#map-job-detail #job-details").html(html);
			$("#map-job-detail #job-title").html(jobDetails.job_title);
			$("#map-job-detail .desc_scroll").mCustomScrollbar({theme:"dark"});
					
			if(Data.jobApply == 1){
				$('.apply-btn').html('<i class="fa fa-check"></i> ALREADY APPLIED');
				$('.apply-btn').attr('onclick',false);
				$('.apply-btn').attr('data-target',false);
				$('.apply-btn').addClass('transparent');
			}else if(Data.jobApply == 0){
				$('.apply-btn').removeClass('transparent');
				$('.apply-btn').attr('data-target','#apply-form');
				$('.apply-btn').html('<span class="apply-now-btn"></span> APPLY NOW');
			}
			if(jobDetails.userid == Data.loggedIn){
				$('.apply-btn').hide();
				$('.recommend-btn').addClass('recom');
				$('#map-job-detail .nav-tabs').css('display','none');
			}else{
				$('.recommend-btn').removeClass('recom');
				$('#map-job-detail .nav-tabs').css('display','block');
			}
			$('#sign-in').attr('href',jobDetails.enc);
			if(Data.sk!=null && Data.sk!=''){
				/*********** Apply Modal Content **************/
				var html='';	
				html+='<div class="innerAll">\
											<div class="form-group">\
												<label for="applyToField">To</label>\
												<input type="text" class="form-control" id="applyToField" value="'+Data.jobInfo.first_name+' '+Data.jobInfo.last_name+'" placeholder="Alma Bay" disabled>\
											</div>\
											<div class="form-group">\
												<label for="subject">Subject</label>\
												<input type="text" class="form-control" id="jobsub" value="'+Data.sk.timeline.first_name+'- Job application for '+Data.jobInfo.job_title+'" placeholder="Email" disabled>\
												<div class="hide" id="showMsg3"></div>\
											</div>\
											<div class="form-group">\
												<label for="exampleInputEmail1">Message</label>\
												<textarea class="form-control" rows="3" id="jobmsg" placeholder="Write your content here"></textarea>\
												<div class="hide" id="showMsg"></div>\
											</div>\
											<div class="row">\
												<div class="col-md-3">\
												<h4 class="resume-text">Resume: </h4>\
												</div>\
										 <div class="row">\
											<div class="col-md-3">\
												<h4 class="resume-text"></h4>\
											</div>\
											<div class="col-md-12">\
												<div class="attach-input space-top">\
													<input type="radio" name="applyResumeOpt" id="resumeopt" value="attach" onclick="showUpload(\'applyResumeOpt\', \'resume_'+jobid+'\');" >\
													<span>Attach latest resume</span>\
													<div class="hide" id="showMsg4"></div>\
													<div class="fileUpload btn">\
														<input type="file" name="resume" id="resume_'+jobid+'" class="uploadBox hide" accept="doc,docx,pdf">\
													</div> \
												  <div class="max-size">Max upload size is 500kb</div>\
												  <div class="err errorApplyUpload"></div>\
												</div>';
											if( Data.jobResume !== '' && Data.jobResume !==  null ){
												var filenamearr=Data.jobResume.name.split(".");
												var ext=filenamearr[filenamearr.length-1];
												html+=	'<div class="attach-input">\
																	<input type="radio" name="applyResumeOpt" id="resumeopt2" value="used" onclick="showUpload(\'applyResumeOpt\', \'resume_'+jobid+'\');" checked="checked"> Use&nbsp;&nbsp;&nbsp;\
																	<a target="_blank" href="/jobs/download/'+Data.jobResume.name+'/'+Data.jobResume.ID+'">Resume-'+Data.sk.user.first_name+' '+Data.sk.user.last_name+'.'+ext+'</a>\
																</div>';
											} 
										html+='</div></div>\
											</div>\
									</div>';
				$('#apply-form .modal-body').html(html);
				$('#apply-form .modal-title').html(Data.jobInfo.job_title);
				$('#apply-form .apply-btn').attr('onclick','applyModal('+jobid+')');
				$('#applyForm .apply-btn').attr('disabled',false);
				/*********** Recommend Modal Content **************/
				$("#map-job-detail .recommend-btn").attr('onclick', 'recommendRequest('+jobid+')');	
				if($("#mobile-map").is(":visible")){
					$('#jobdetailoverlay').show();
				}
			}
					
		}
	});
}


// End of Google Function //

//Start of circle Draw Function on google map //
/** 
 * A distance widget that will display a circle that can be resized and will
 * provide the radius in km.
 *
 * @param {google.maps.Map} map The map on which to attach the distance widget.
 *
 * @constructor
 */
function DistanceWidget(map, radius) {
	this.set('map', map);
	this.set('position', map.getCenter());

	var marker = new google.maps.Marker({
		icon: {
			url: '/common/images/center-nod.png',
			scaledSize : new google.maps.Size(22, 22),
			anchor: new google.maps.Point(8, 12),
		},
		title: 'Move me!',
		draggable: true,
		cursor: 'all-scroll'
		
	});

	// Bind the marker map property to the DistanceWidget map property 
	marker.bindTo('map', this);

	// Bind the marker position property to the DistanceWidget position 
	// property 
	marker.bindTo('position', this);
	
	marker.bindTo('center', this, 'position');
	// Create a new radius widget 
	var radiusWidget = new RadiusWidget(radius);

	// Bind the radiusWidget map to the DistanceWidget map 
	radiusWidget.bindTo('map', this);

	// Bind the radiusWidget center to the DistanceWidget position 
	radiusWidget.bindTo('center', this, 'position');

	// Bind to the radiusWidgets' distance property 
	this.bindTo('distance', radiusWidget);

	// Bind to the radiusWidgets' bounds property 
	this.bindTo('bounds', radiusWidget);
}
DistanceWidget.prototype = new google.maps.MVCObject();

/** 
 * A radius widget that add a circle to a map and centers on a marker.
 *
 * @constructor
 */

function RadiusWidget(radius) {
	circle = new google.maps.Circle({
		strokeWeight: 1,
		strokeColor:"#FBAE38",
		strokeOpacity:0.9,
		fillColor:"#FFCD81",
		draggable:true
	});

	// Set the distance property value, default to 20km. 
	this.set('distance', radius);

	// Bind the RadiusWidget bounds property to the circle bounds property. 
	this.bindTo('bounds', circle);

	// Bind the circle center to the RadiusWidget center property 
	circle.bindTo('center', this);

	// Bind the circle map to the RadiusWidget map 
	circle.bindTo('map', this);

	// Bind the circle radius property to the RadiusWidget radius property 
	circle.bindTo('radius', this);

	this.addSizer_();
}
RadiusWidget.prototype = new google.maps.MVCObject();

/** 
 * Update the radius when the distance has changed.
 */
RadiusWidget.prototype.distance_changed = function() {
	if(this.get('distance')>=20){
	  this.set('radius', this.get('distance') * 1000);
	} else {
		this.set('radius', 20000);
	}
};
/** 
 * Add the sizer marker to the map.
 *
 * @private
 */
RadiusWidget.prototype.addSizer_ = function() {
	var sizer = new google.maps.Marker({
		icon: {
			url:'/common/images/resizer.png',
			scaledSize : new google.maps.Size(24, 24),
			anchor: new google.maps.Point(13, 13)
		},
		title: 'Drag me!',
		draggable: true,
		cursor: 'e-resize',
		raiseOnDrag: false
	});

	sizer.bindTo('map', this);
	sizer.bindTo('position', this, 'sizer_position');
	var me=this;	
	google.maps.event.addListener(sizer, 'drag', function() {
		me.setDistance();
	});
};

/** 
 * Update the center of the circle and position the sizer back on the line.
 *
 * Position is bound to the DistanceWidget so this is expected to change when
 * the position of the distance widget is changed.
 */
RadiusWidget.prototype.center_changed = function() {
	var bounds = this.get('bounds');
	// Bounds might not always be set so check that it exists first. 
	if (bounds) {
		var lng = bounds.getNorthEast().lng();
		// Put the sizer at center, right on the circle. 
		var position = new google.maps.LatLng(this.get('center').lat(), lng);
		this.set('sizer_position', position);
	}
};

/** 
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
	if (!p1 || !p2) {
		return 0;
	}
	var R = 6371; // Radius of the Earth in km 
	var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
	var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
};


/** 
 * Set the distance of the circle based on the position of the sizer.
 */
RadiusWidget.prototype.setDistance = function() {
	// As the sizer is being dragged, its position changes.  Because the 
	// RadiusWidget's sizer_position is bound to the sizer's position, it will 
	// change as well. 
	var pos = this.get('sizer_position');
	var center = this.get('center');
	var distance = this.distanceBetweenPoints_(center, pos);
	if(distance>=20){
		// Set the distance property for any objects that are bound to it 
		this.set('distance', distance);
	} else {
		// Set the distance property for any objects that are bound to it 
		this.set('distance', 20);
		var bounds = this.get('bounds');
		var lng = bounds.getNorthEast().lng();

		// Put the sizer at center, right on the circle. 
		var position = new google.maps.LatLng(this.get('center').lat(), lng);
		this.set('sizer_position', position);
	}
};

function displayInfo(widget) {
	var position = widget.get('position').toUrlValue(8).split(',');
	$("#latitude").val(position[0]);
	$("#longitude").val(position[1]);
	var unit = $("#units").val();
	if(unit==0){
		$("#radius").val((widget.get('distance')/1).toFixed(2));
	} else {
		$("#radius").val((widget.get('distance')/1.609344).toFixed(2));
	}
	$('#search-location').val('');
	//	console.log('Position: ' + widget.get('position').toUrlValue(8) + ', distance: ' + widget.get('distance').toFixed(3));
}

// Main Function of Jobs Map //
function applyModal(jobid){
	$("#apply-form .err").hide();
	$("#apply-form textarea").css('border-color','');
	var jobsub=$('#jobsub').val().trim();
	var jobmsg=$('#jobmsg').val();
	var jobresume=$("input[name='applyResumeOpt']").is(":checked");
	var fileAttach=$('#resume_'+jobid).val();
	var resumeOpt=$("input[name='applyResumeOpt']:checked").val();
	var file = $('#apply-form #resume_'+jobid).val();
	var exts = ['doc','docx','rtf','odt','pdf'];
	
	if($('#resume_'+jobid)[0].files[0]!==null && fileAttach != "" ){
		var file_size = $('#resume_'+jobid)[0].files[0].size;
	}
	
	if(jobmsg < 1){
		$('#showMsg').html('Message field is empty or invalid input has been entered').removeClass('hide').addClass('err errorMsg').show();
		$('#jobmsg').css('border-color','#ff0000');
		return false;
	}
	
	//for job sub validation
	if(jobsub < 1){
		$('#showMsg3').html('Application subject field is required, either subject field is empty or invalid input has been entered.').removeClass('hide').addClass('err errorMsg').show();
		//setTimeout(function(){$('#showMsg').hide()},2000);
		return false;
	} 
	
	//for job resume validation
	if(jobresume===false){
		$('#resumeopt').prop('checked',true);
		$('#resume').removeClass('hide');
		return false;
	} 
	
	//for job resume uploaded or not validation
	if(resumeOpt==='attach' && (fileAttach==='' || fileAttach===null)){
		//$('#resume').focus();
		$('#resume_'+jobid).focus().parent().siblings(".errorApplyUpload").show().html("Please attach your latest resume.");
		return false;
	}
	
	if ( file ) {
		// split file name at dot
		var get_ext = file.split('.');
		// reverse name to check extension
		get_ext = get_ext.reverse();
		// check file type is valid as given in 'exts' array
		if ( $.inArray ( get_ext[0].toLowerCase(), exts ) < 0 ){
			/* $('#showMsg4').html('Resume file format is not valid, kindly attach a valid file e.g doc,docx,rtf,odt,pdf').removeClass('hide').addClass('err errorMsg').show(); */
			$('#resume_'+jobid).focus();
			$(".errorApplyUpload").show().html("Kindly attach a valid file e.g doc, docx, rtf, odt, pdf.");
			return false;
		}
	}
	if(file_size>500000) {
		$(".errorApplyUpload").show().html("File size is exceed than limit.");
		return false;
	}
	
	var form_data = new FormData();
	form_data.append('resume', $('#resume_'+jobid).prop('files')[0]);
	form_data.append('jobsub', jobsub);
	form_data.append('jobmsg', jobmsg);
	form_data.append('resumeOpt', resumeOpt);
	$('#applyForm .apply-btn').attr('disabled','disabled');
	$('#applyForm .apply-btn').attr('onclick',false);
	$.ajax({
		type: "POST",
		url: "/jobs/applyjob/"+jobid, 
		contentType: false,
		processData: false,
		data: form_data,
		cache: false,
		success: function(resp){
			var d  = JSON.parse(resp);
			if(d.status=='success'){
				$('#showMsg1').html('Job Appllication has been sent Successfully.').removeClass('hide').addClass('alert-success').show();
				$('#applyForm').trigger('reset');
				setTimeout(function(){$('#showMsg1').hide()},1000);
				setTimeout(function(){$('.err').hide()},800);
				setTimeout(function(){$('.modal').click()}, 2000);
				$('#applymodal').attr('data-target',false);
				$('#applymodal').html('<i class="fa fa-check"></i> ALREADY APPLIED');
				$('#applymodal').addClass('transparent');
				if($(".alert-success").is(":visible")){
					$('#applyForm .apply-btn').attr('onclick',false);
				}
				$("#applyOn"+d.job).after("<a class='btn applied-btn'><i class='fa fa-check'></i> Application Sent</a>").promise().done(function(){
					$(this).removeAttr('ng-dialog ng-dialog-class ng-dialog-close-previous id ');
					$(this).removeClass('btn-primary ng-isolate-scope').addClass('applied-btn');
					$(this).attr('href', '/jobs/applied');
					$(this).hide();
				});
			} else if(d.status=='error'){
				//$('#showMsg').html('Invalid input data, unable to process your job application with provided information.').removeClass('hide').addClass('alert-danger').show();
			} else if(d.status=='warning'){
				$('#showMsg').html('You have already applied for this job.').removeClass('hide').addClass('alert-success').show();
				$('#applyForm').trigger('reset');                
				setTimeout(function(){$('div.ngdialog-close').click()}, 1000);
			}
		}
	});	
}

function referral_click(element){
	$(".ask-referral").css('display','block');
	$(element).siblings('.text-message').css('display','block');
	$(element).css("display","none");
	$(".apply-btn, .recommend-btn").css("display","none");
	$(element).parents('.panel-box').siblings('.panel-box').find('.transparent-layer').css('display','block');
}

function recommendRequest(jobid){
	$('#showMsg2').addClass('hide');
	$.ajax({
		url:'/jobs/recommendModel/'+jobid+'/'+true,
		dataType:'json',
		success:function(response){
			$('.border-top').addClass('hide');
			$('#recomends-btn .send-btn').removeClass('hide');
			var recommendData = response.friendList;
			var recommendModal='';
			if(recommendData!=null){
				recommendModal  +=  '<div class="widget-body">\
						<h5 class="text-center heading-tittle">Select friends from list </h5>\
							<select multiple id="preSelectedOptions" class="multiselect" name="preSelectedOptions[]">';
								$.each(recommendData, function(index, value){
									recommendModal  +=	'<option value="'+value.id+'">'+value.name+'</option>';
								});
				recommendModal  += '</select></div>';
			} else { 
				recommendModal += '<h5>All Friends are recommended.</h5>';
				$('.border-top').removeClass('hide');
				$('#recomends-btn .send-btn').addClass('hide');
			}
			$("#recomends-btn .modal-body .widget").html(recommendModal);
			$("#recomends-btn .send-btn").attr('onclick', 'recommendModal('+jobid+')');
			$("#recomends-btn").modal();
			$('.multiselect').multiSelect('refresh');
			$('#recomends-btn .send-btn').attr('disabled',false);
		}
	});
	//setTimeout(function(){$('.multiselect').multiSelect('refresh');},200);
}

function recommendModal(jobid){
	if ($("#preSelectedOptions option:selected").length>0) {
		$('#recomends-btn .send-btn').attr('disabled','disabled');
		$.ajax({
			type: "POST",
			url: '/jobs/recommendModel/'+jobid,
			data: $("#recommendForm").serialize(),
			success: function(resp){
				if(resp=='success'){
					$('#showMsg2').html('Recommended Successfully').removeClass('hide alert-danger').addClass('alert-success').show();
					setTimeout(function(){$('#showMsg2').hide()},1000);
					$('#recommendForm').trigger('reset');
					setTimeout(function(){
						$('#recomends-btn .close-btn').trigger('click');
					},1000);
					//jobDetails(jobid);
				} else if(resp=='error'){
					$('#showMsg2').html('Unable to process your request').removeClass('hide alert-success').addClass('alert-danger').show();
				}
			}
		});
	} else {
		$('#showMsg2').html('Please select atleast one person').removeClass('hide').addClass('alert-danger').show();
	}
}

function likejobDetails(element,jobid, msg, shortlist){
	if( shortlist === undefined ){shortlist=false;}
	var A=$(element).attr("id");
	var B=A.split("like");
	var messageID=B[1];
	var C=parseInt($("#likeCount"+messageID).html());
	var D=$(element).attr("rel");
	var status=(D === 'like')?1:0;
	var action=true;
	if(D !== 'like'){ 
		var message='Are you sure you want to remove shortlisted job?';
		action=confirm(message);
	}
	if(action){
		$(element).css("background-position","")
		 $.ajax({
			url: "/jobs/savelikejob/"+jobid+"/"+status, 
			success: function(response){
				if(response == 'success'){
					var count=parseInt($('.filter_count').text());
					if(D === 'like'){  
						$("#likeCount"+messageID).html(C+1);
						$(element).addClass("heartAnimation").attr("rel","unlike");
						$(element).addClass("heartAnimation").attr("title","Remove shortlisted job");
						var job='<div class="panel-box job_'+jobid+'">';
						job+=$("#profile .job_"+jobid).html();
						job+='</div>';
						
						$("#home .mCSB_container").prepend(job);
						$("#home .job_"+jobid+" .heart").addClass("heartAnimation").attr("rel","unlike");
						$("#home .job_"+jobid+" .heart").css("background-position","");
						count=count+1;
						//$( ".heart-tab-icon" ).effect( "bounce", {direction:'down', times:3}, 1000);
					} else {
						$("#home .job_"+jobid).hide('slide', {direction: 'left'});
						$("#likeCount"+messageID).html(C-1);
						$("#profile .job_"+jobid+" .heart").removeClass("heartAnimation").attr("rel","like");
						$("#profile .job_"+jobid+" .heart").removeClass("heartAnimation").attr("title","Shortlist this job");
						$("#profile .job_"+jobid+" .heart").css("background-position","left");
						count=count-1;
					}
					if( count== null || count <= 0 ) {
						if(shortlist){
							$("#shortJobsMsg").html('You have not shortlisted any Job');
						} else {
							$("#shortJobsMsg").html('You have not shortlisted any Job in '+msg);
						}
					} else {
						if(shortlist){
							$("#shortJobsMsg").html('All Over '+count+' job(s) shortlisted jobs.');
						} else {
							$("#shortJobsMsg").html(count+' job(s) shortlisted in '+msg);
						}
					}
					$('.filter_count').html(count);
				}
			}
		 });
	}
}

function autoCompleteValidate(element, hiddenField, event){
	if(event.keyCode==8){
		var extractValue = $(element).val().split( /\|\s*/ ).pop();
		if(extractValue == "" ){
			event.preventDefault();
			var text = $(element).val().split('|');
			text = $.map(text, $.trim);
			text= text.filter(function(v){return v!==''}).slice(0, -1).join(" | ");
			if(text != ""){
				text+=" | ";
			}
			$(element).val(text);
			
			var hidden = $("#"+hiddenField).val().split(",");
			hidden = $.map(hidden, $.trim);
			hidden= hidden.filter(function(v){return v!==''}).slice(0, -1).join(",");
			$("#"+hiddenField).val(hidden);
		}
	}
	if(event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 220 || event.keyCode == 46 ){
		event.preventDefault();
	}
}

function showUpload(radioName, uploadID){
	$("input[type=file]").val('');
	$('#showMsg4').hide();
	var checkVal = $("input[name='"+radioName+"']:checked").val();
	if(checkVal=='used'){
		$('#'+uploadID).addClass('hide');
		$('.err').hide();
	}else {
		$('.err').show();
		$('#'+uploadID).removeClass('hide');	
	}		
}

function selectMultipleOption(){
	if($("#your-referral .checkbox").hasClass("checkbox-toggle")){
		$("#your-referral .checkbox").removeClass("checkbox-toggle");
		$("#your-referral .media-left").css("padding-left","0px");
		$("input[class=referralCheckbox]").val("");
		$(".checkbox-custom i").removeClass("checked");
		$("#map-job-detail .ask-referral").css("display","none");
		$(".request-referral-btn").show();
		$(".apply-btn, .recommend-btn").css("display","table-cell");
		$(".scroll-position .multi-refer-message").addClass("hide");
	}else {
		$(".scroll-position .transparent-layer, .text-message").hide();
		$("#your-referral .checkbox").addClass("checkbox-toggle");
		$("#your-referral .media-left").css("padding-left","5px");
		$(".apply-btn, .recommend-btn, .request-referral-btn").hide();
		$("#map-job-detail .ask-referral").css("display","block");
		$(".scroll-position .multi-refer-message").removeClass("hide");
	}	
}
function checkMark(element, checkboxId, userID){
	$(element).toggleClass("checked");
	if( $("#"+checkboxId).val()){
		$("#"+checkboxId).val("");
	} else {
		$("#"+checkboxId).val(userID);
	}
}

function filterValidate(){
	$("#filterError").addClass("hide");
	$(".filter_jobmap input, .filter_jobmap select").css("border-color", "");
	var error=0;
	var errorMsg="";
	var locationLabel=$("#locationLabel").val();
	var location=$('#location').val();
	var companyLabel=$("#companyLabel").val();
	var company=$('#company').val();
	var skillsetLabel=$("#skillsetLabel").val();
	var skillset=$('#skillset').val();
	var categoryLabel=$("#categoryLabel").val();
	var category=$('#category').val();
	var min_exp=$(".min_exp" ).val();
	var max_exp=$(".max_exp" ).val();
	var min_ctc=$(".min_ctc" ).val();
	var max_ctc=$(".max_ctc" ).val();
	
	//IF ALL FIELDS ARE BLANK
	
	// NOT SELECTED FROM DROP DOWN LIST //
	if(!$("#filter-modal").hasClass("show-modal")){
		if(locationLabel==="" && companyLabel==="" && skillsetLabel==="" && categoryLabel==="" && min_exp==="" && max_exp==="" && min_ctc ==="" && max_ctc===""){
			errorMsg="Kindly select at least one filter.";
			error=1;
			$(".filter_jobmap input, .filter_jobmap select").css("border-color", "#ff0000");
		}
		if( (locationLabel!=="" && location==="") && error ===0 ){
			errorMsg="Text is not allowed. Please Select location from List.";
			error=1;
			$(".filter_jobmap #locationLabel").css("border-color", "#ff0000");
		}
	} else {
		if(companyLabel==="" && skillsetLabel==="" && categoryLabel==="" && min_exp==="" && max_exp==="" && min_ctc ==="" && max_ctc===""){
			errorMsg="Kindly select at least one filter.";
			error=1;
			$(".filter_jobmap input, .filter_jobmap select").not("#locationLabel").css("border-color", "#ff0000");
		}
	}
	if( (companyLabel!=="" && company==="") && error ===0){
		errorMsg="Text is not allowed. Please Select company from list.";
		error=1;
		$(".filter_jobmap #companyLabel").css("border-color", "#ff0000");
	}
	if( (skillsetLabel!=="" && skillset==="") && error ===0){
		errorMsg="Text is not allowed. Please Select skills from List.";
		error=1;
		$(".filter_jobmap #skillsetLabel").css("border-color", "#ff0000");
	}
	if( (categoryLabel!=="" && category==="") && error ===0){
		errorMsg="Text is not allowed. Please Select Category from List.";
		error=1;
	}
	
	// NOT SELECTED FROM DROP DOWN LIST END //
	
	// SELECT BOX ERRORS //
	if( (parseInt(min_exp) > parseInt(max_exp)) && error ===0 ){
		errorMsg="Oops, wrong experience range.";
		$(".min_exp").css("border-color", "#ff0000");
		error=1;
	} 
	if( (parseInt(min_ctc) > parseInt(max_ctc)) && error ===0 ){
		errorMsg="Oops, wrong salary range.";
		$(".min_ctc, .max_ctc").css("border-color", "#ff0000");
		error=1;
	}
	if((parseInt(min_exp)>0 && max_exp==="") && error ===0){
		errorMsg="Please Select Maximum Experience.";
		$(".max_exp").css("border-color", "#ff0000");
		error=1;
	} 
	if((parseInt(max_exp)>0 && min_exp==="") && error ===0){
		errorMsg="Please Select Minimum Experience.";
		$(".min_exp").css("border-color", "#ff0000");
		error=1;
	}
	if((parseInt(min_ctc)>0 && max_ctc==="") && error ===0){
		errorMsg="Please Select Maximum CTC.";
		$(".max_ctc").css("border-color", "#ff0000");
		error=1;
	} 
	if((parseInt(max_ctc)>0 && min_ctc==="") && error ===0){
		errorMsg="Please Select Minimum CTC.";
		$(".min_ctc").css("border-color", "#ff0000");
		error=1;
	}
	// SELECT BOX ERRORS ENDS//
	if(error == 1){
		$("#filterError").html(errorMsg).removeClass("hide");
		$('.menu-right-hidden').animate({ scrollTop: 0 }, 600);
	}
	return error;
}
function showUserShortListJobs(){
	$('#side-menu .nav-justified li:last-child, #mobile-map .nav-justified li:last-child').hide();
	var filtertxt='';
	filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();
	$.ajax({
		crossDomain: true,
		url: "/user/shortListedJobsOfUser",
		data:{'filter': filtertxt},
		success: function(res) {
			var results = JSON.parse(res);
			if(typeof(results.shortList) != "undefined" && results.shortList !== null){
				var jobsData='';
				jData = results.shortList.results;
				jobsData='<div class="job_list_container"><div class="data-container">';
				var count=(jData != null && jData != '')?jData.length:0;
				
				if(jData != null && jData != ''){
					for(var i = 0; i < jData.length; i++) {
						jobsData+='<div class="panel-box job_'+jData[i].id+'">\
										<div class="media">\
										  <div class="media-left">\
											<a href="javascript:void(0);">';
											if(jData[i].logo!=''){
												jobsData +=  '<img class="media-object" src="'+jData[i].logo+'" width="70px">';
											}else{
												jobsData +=	'<img class="media-object" src="/common/images/hall-ticketcompany-logo-default.png" width="70px" height="70px;">';
											}
								jobsData+='</a>\
										  </div>\
										  <div class="media-body">\
											<a href="javascript:void(0);" class="media-heading pull-left" onclick="jobDetails('+jData[i].id+')";>'+jData[i].job_title+'</a>\
												<a href="javascript:void(0);" class="pull-right heart heartAnimation" id="like1" value="" rel="unlike" onclick="likejobDetails(this,'+jData[i].id+',\'\',true)" title="Remove shortlisted job"> </a>\
											<div class="clearfix"></div>';
											if(jData[i].company !=null){
											 jobsData+='<div class="describtion"> '+jData[i].company+' </div>';
											}
											jobsData+='<div class="describtion"> '+jData[i].city+', '+jData[i].state+' </div>\
										  </div>\
										</div>\
								</div>';
					}
				}else{
					jobsData+='';
				}
				jobsData+='</div>';
				if(results.shortList.total>jData.length){
					jobsData  += '<div class="row"><button class="btn-load-more" id="load_more_btn" onclick="loadMoreJobs(this, \'\', \'\',\'\', \'shortlisted\');"> <i class="fa fa-spinner fa-spin hide" ></i> Load More</button></div>';
				}
				jobsData+='</div>';
				$('.tab-content #home').html(jobsData);
				$('.nav-tabs .filter_count').html(count);	
				var profileHeight=$("#side-menu").height()-$(".nav-tabs.nav-justified").outerHeight(true)-$(".search-panel").outerHeight(true)-$("#shortJobsMsg").outerHeight(true);
				$(".job_list_container").css('max-height',profileHeight);
				$(".job_list_container").mCustomScrollbar({theme:"dark"});
				if(results.shortList.total == 0 || results.shortList.total == null){
					$("#shortJobsMsg").html('You have not shortlisted any Job');
				} else {
					$("#shortJobsMsg").html('All over '+results.shortList.total+' job(s) shortlisted.');
				}
				var docheight=$(window).height();
				var tabheight=($('.navbar').outerHeight(true)+2*($('.arrow').outerHeight(true))+100);
				var countheihgt=docheight-tabheight;
			$('#mobile-map .job_list_container').css('max-height',countheihgt);
			} else {
				$('.nav-tabs .filter_count').html('0');
			}
		} 
	});
}

// Radius Search Function 
function radiusSearch(latitude, longitude, cityname, username){
	if($("#mobile-map").is(":visible")) {
		$('.arrow-box').trigger("click");
	} else {
		hideSidePannel();
	}
	if($("#filter-modal").hasClass("show-modal")){
		clearAllMarkers();
		$('#search-location').val('');
		$("#search-location").addClass("hide");
		$('#filter-modal #showhide').hide();
		$("#filter-modal").removeClass("show-modal");
		$("#locationLabel").attr('disabled',false).val('');
		if(typeof(circle) != "undefined" && circle !== null){
			circle.setMap(null);
		}
		map.setOptions({minZoom:MIN_ZOOM_LEVEL, zoom:MIN_ZOOM_LEVEL});
	} else {
		/* Create the search box and link it to the UI element. */
		$("#locationLabel").attr('disabled','disabled');
		var input = document.getElementById('search-location');
		var searchBox = new google.maps.places.SearchBox(input);
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

		map.addListener('bounds_changed', function() {
		  searchBox.setBounds(map.getBounds());
		});
		
		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();
			if (places.length == 0) {
				return;
			}
			var radius = $("#radius").val();
			
			places.forEach(function(place) {
				if (!place.geometry) {
				  console.log("Returned place contains no geometry");
				  return;
				}
				$("#locationLabel").val(input.value)
				var latitude = place.geometry.location.lat();
				var longitude = place.geometry.location.lng();
				$("#latitude").val(latitude);
				$("#longitude").val(longitude);
				if(typeof(circle) != "undefined" && circle !== null){
					circle.setMap(null);
				}
				var panPoint = new google.maps.LatLng(latitude, longitude);
				map.panTo(panPoint);
				var distanceWidget = new DistanceWidget(map, radius);
				google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
					displayInfo(distanceWidget);
				});
				google.maps.event.addListener(distanceWidget, 'position_changed', function() {
					displayInfo(distanceWidget);
				});
				CURRENT_PLACE_TYPE='city';
				map.setOptions({minZoom:8, zoom:10});
				clearAllMarkers();
				
				jobSearchByRadius();
			});
		});
		$("#filter-modal").addClass("show-modal");
		$("#search-location").removeClass("hide");
		var radius = 20.00;
		$("#radius").val(radius);
		if(latitude==0 || latitude==null || longitude == 0 || longitude==null ){
			if( navigator.userAgent.indexOf("Chrome") != -1 && window.location.protocol != "https:" ){
				latitude  = 30.73331480;
				longitude = 76.77941790;
				var panPoint = new google.maps.LatLng(latitude, longitude);
				map.panTo(panPoint);
				$("#latitude").val(latitude);
				$("#longitude").val(longitude);
				if(typeof(circle) != "undefined" && circle !== null){
					circle.setMap(null);
				}
				
				var distanceWidget = new DistanceWidget(map, radius);
				google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
					displayInfo(distanceWidget);
				});
				google.maps.event.addListener(distanceWidget, 'position_changed', function() {
					displayInfo(distanceWidget);
				});
			} else {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var panPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
						map.panTo(panPoint);
						$("#latitude").val(position.coords.latitude);
						$("#longitude").val(position.coords.longitude);
						if(typeof(circle) != "undefined" && circle !== null){
							circle.setMap(null);
						}
						//map.setOptions({minZoom:8, zoom:10});
				
						var distanceWidget = new DistanceWidget(map, radius);
						google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
							displayInfo(distanceWidget);
						});
						google.maps.event.addListener(distanceWidget, 'position_changed', function() {
							displayInfo(distanceWidget);
						});
					});
				} else {
					alert('Browser doesn\'t support Geolocation');
				}
			}
		} else {
			var panPoint = new google.maps.LatLng(latitude, longitude);
			map.panTo(panPoint);
			$("#latitude").val(latitude);
			$("#longitude").val(longitude);
			if(typeof(circle) != "undefined" && circle !== null){
				circle.setMap(null);
			}
			//map.setOptions({minZoom:8, zoom:10});
			
			var distanceWidget = new DistanceWidget(map, radius);
			google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
				displayInfo(distanceWidget);
			});
			google.maps.event.addListener(distanceWidget, 'position_changed', function() {
				displayInfo(distanceWidget);
			});
		}
		CURRENT_PLACE_TYPE='city';
		map.setOptions({minZoom:8, zoom:10});
		jobSearchByRadius();
	}
}

function jobSearchByRadius(){
	e = $.Event('keyup');
    e.keyCode = 13; 
    $('#radius').trigger(e);
	$('.close-btn').trigger('click');
	clearAllMarkers();
	map.setCenter(new google.maps.LatLng($("#latitude").val(), $("#longitude").val()));
	map.setOptions({minZoom:8, zoom:10});

	var filtertxt='';
    filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();
	var radiusdata = $("#radius-search-form").serialize();
	$('#filter-modal .fa-spinner').removeClass('hide');
	$('#filter-modal .btn-default').attr( "disabled", "disabled" );
	$.ajax({
		crossDomain: true,
		url: "/user/jobmapdata/"+true,
		data: {
			'q': '',
			'pt': 'city',
			'filter': filtertxt,
			'radiusData':radiusdata
		},
		success: function(res) {
			$('#filter-modal .fa-spinner').addClass('hide');
			$('#filter-modal .btn-default').attr( "disabled",false );
			clearAllMarkers();
			var results = JSON.parse(res);
			//console.log(results);
			if(typeof(results.jobs) != "undefined" && results.jobs !== null){
				$('#filter-modal #showhide').hide('slide', {direction:'down'});
				for(var i=0; i<results.jobs.length;i++)
				{
					var newmarker = createMarker(results.jobs[i], infowindow, map);
					markers.push(newmarker);
					if(results.networkJobs != null){
						for(var j=0; j<results.networkJobs.length;j++)
						{ 
							if(results.networkJobs[j].name == results.jobs[i].name){
								var netmarker = createMarker(results.networkJobs[j], infowindow, map, true, results.jobs[i].count);
								markers.push(netmarker);
							}
						}
					}
				}
			}else{
				$('#filter-modal #showhide').css('padding','5px 15px').show('slide', {direction:'down'});
			}
		}
	});
}
function hideSidePannel(){
	if($("#side-menu").hasClass('show-both') || $("#side-menu").hasClass('show-filters')){
		$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth())},{
		complete: function() {
				$(".arrow-right").removeClass("arrow-left");
				$('.map-block').animate({'margin-left':0});
			}
		});
	} else if($("#side-menu").hasClass('show-results')){
		$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-$("#editor-features").outerWidth()},{
		complete: function() {
				$(".arrow-right").removeClass("arrow-left");
				$('.map-block').animate({'margin-left':0});
			}
		});
	} 
}
function setCursorPosition(element){
	var element = $(element)[0];
    if (element.setSelectionRange) {
        var len = $(element).val().length * 2;
        element.setSelectionRange(len, len);
    }
    else {
        $(element).val($(element).val());
        $(element).focus();
    }
    element.scrollTop = 9999;
}

function loadMoreJobs(button, ajaxURL, place, netJobsMsg, type){
	$(button).attr('disabled','disabled');
	$(button).find('.fa').removeClass('hide');
	
	var filtertxt='';
	filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();
	
	if(type =='shortlisted'){
		ajaxURL = '/user/shortListedJobsOfUser';
		offset = $('#home .data-container .panel-box').length;
		data = {
			'filter':filtertxt,
			'offset': offset
		};
	} else {
		offset = $('#profile .data-container .panel-box').length;
		data = {
			'place': place, 
			'q': '', 
			'pt': CURRENT_PLACE_TYPE,
			'filter': filtertxt,
			'offset': offset
		};
	}
	
	$.ajax({
		crossDomain: true,
		url: ajaxURL,
		data:data,
		success:function(html){
			var aData = JSON.parse(html);
			
			if(type =='shortlisted'){
				Data = aData.shortList;
			} else {
				var searchlocation='';
				var searchid='';
				switch(newPlaceType){
					case 'country':
						searchlocation='country';
						searchid=aData.jobList.results[0]['country_id'];
					break;
					case 'state':
						searchlocation='state';
						searchid=aData.jobList.results[0]['state_id'];
					break;
					case 'city':
						searchlocation='location';
						searchid=aData.jobList.results[0]['city_id'];
					break;
				}
				Data = aData.jobList;
			}
			jData = Data.results;
			jobsData='';
			if(jData !== null && jData !== ''){
				for(var i = 0; i < jData.length; i++) {	
					jobsData+='<div class="panel-box job_'+jData[i].id+'"><div class="media"><div class="media-left"><a href="javascript:void(0);">';
								if(jData[i].logo!=''){
									jobsData +=  '<img class="media-object" src="'+jData[i].logo+'" width="70px">';
								}else{
									jobsData +=	'<img class="media-object" src="/common/images/hall-ticketcompany-logo-default.png"  width="70px" height="70px;">';
								}
					jobsData+='</a></div><div class="media-body"><a href="javascript:void(0);" class="media-heading pull-left" onclick="jobDetails('+jData[i].id+')";>'+jData[i].job_title+'</a>';
								if(type =='shortlisted'){
									jobsData+='<a href="javascript:void(0);" class="pull-right heart heartAnimation" id="like1" value="" rel="unlike" onclick="likejobDetails(this,'+jData[i].id+',\'\',true)" title="Remove shortlisted job"> </a>';
								} else {
									if(Data.loggedIn){
										if(jData[i].status==1){
											jobsData+= '<a href="javascript:void(0);" class="pull-right heartAnimation heart" id="like1" value="" rel="unlike" onclick="likejobDetails(this,'+jData[i].id+',\''+netJobsMsg+place+'\')" title="Remove shortlisted job"> </a>';
										}else{
											jobsData+= '<a href="javascript:void(0);" class="pull-right heart" id="like1" value="" rel="like" onclick="likejobDetails(this,'+jData[i].id+',\''+netJobsMsg+place+'\')" title="Shortlist this job"> </a>';	
										}
									}
								}
								jobsData+= '<div class="clearfix"></div>';
								if(jData[i].company !==null){
								 jobsData+='<div class="describtion"> '+jData[i].company+' </div>';
								}
								jobsData+='<div class="describtion"> '+jData[i].city+', '+jData[i].state+' </div></div></div></div>';
				}
			}
			if(type =='shortlisted'){
				$('#home .data-container').append(jobsData);
				$('.nav-tabs .filter_count').html(jData.length+offset);
			} else {
				$('#profile .data-container').append(jobsData);
				$('.nav-tabs .jobs-count').html(jData.length+offset);
			}
			if(Data.total<=jData.length+offset){
				if(type =='shortlisted'){
					$('#home .job_list_container .row').remove();
				} else {
					$('#profile .job_list_container .row').remove();
				}
			} else {
				$(button).attr('disabled',false);
				$(button).find('.fa').addClass('hide');
			}
			$("#side-menu .job_list_container").mCustomScrollbar("update");
		}
	});

}