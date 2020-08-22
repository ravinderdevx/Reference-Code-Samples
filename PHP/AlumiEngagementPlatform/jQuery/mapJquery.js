$(document).ready(function() {
	$("#editor-elements").mCustomScrollbar({theme:"dark", autoHideScrollbar: true});
	var headerHeight=$('.navbar.main').outerHeight()+$(".top-warning").outerHeight();
	$('#search_map, #side-menu').outerHeight($(window).outerHeight() - headerHeight - 2);
	$('#side-menu').outerHeight($(window).outerHeight() - headerHeight - 2);
	$("#side-menu").css('left',-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth()));
	$("#content").css('overflow','hidden');
	$(document).on('click','.bt', function(){
		$('input[type="file"]').val('');
	});
	$('body').addClass('maps-page');
	$('div.feedback-fixed').remove();
	$('.dropdown-toggle').click(function(e){
		e.stopPropagation();
	});
	$('.dropdown-toggle').dropdown();
	
	if($("#mobile-map").is(":visible")){
		$(".job-position").remove();
		$('.map-width').after('<div id="jobdetailoverlay" class="ngdialog-overlay" style="display:none;"></div>');
	} else {
		$("#mobile-map").remove();
	}
	$("#mobile-map .heart-toggle").click(function(){
		showUserShortListJobs();		
	});
	function split( val ) {
      return val.split( /\|\s*/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }
	
	/******* AutoComplete for Location filter *******/	  
    $( "#locationLabel" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
			event.preventDefault();
        }
      })
      .autocomplete({
        source: function( request, response ) {
			var selectedIDs=$("#location").val();
			$.ajax({
				url: "/jobs/cities",
				data: {q: extractLast( request.term ), selected:selectedIDs},
				dataType: "json",
				success: function( data ) {
					if(data.length > 0){
						response( $.map( data, function( item ) {
							return {
								label: item.city,
								value: item.city_id
							};
						}));
					} else {
						response([{ label: 'No results found.', value: -1}]);
					}
				}
			});
        },
        search: function(event, ui) {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 2 ) {
            return false;
          }
		  var widget = $(this).data('ui-autocomplete').menu.element;
		  id     = widget.attr('id');
		  var interval = setInterval(function(){
			if($('#'+id).is(':visible')){
				$('.ui-autocomplete').scrollTop(0); 
				clearInterval(interval);
			}
		  });
        },
        focus: function(event, ui) {
			event.preventDefault();
		},
        select: function( event, ui ) {
			if (ui.item.value == -1) {	
				return false;
			}
			var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.label );
			// add placeholder to get the comma-and-space at the end
			terms.push( "" );
			this.value = terms.join( " | " );
			if($("#location").val()==""){
				$("#location").val(ui.item.value);
			} else {
			var temp=$("#location").val();
				$("#location").val(temp+','+ui.item.value);  
			}
			return false;
        },
		appendTo: $('#locationLabel').parents('.form-group')
	});
	/******* AutoComplete for Company filter *******/
	
	$( "#companyLabel" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
			event.preventDefault();
        }
      })
      .autocomplete({
        source: function( request, response ) {
			var selectedIDs=$("#company").val();
			$.ajax({
				url: "/life_skills_api/getCompanyTags",
				data: {q: extractLast( request.term ), limit:20, page:1, selected:selectedIDs},
				dataType: "json",
				success: function( data ) {
					if(data.results.length > 0){
						response( $.map( data.results, function( item ) {
							return {
								label: item.name,
								value: item.id
							}
						}));
					} else {
						response([{ label: 'No results found.', value: -1}]);
					}
				}
			});
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 2 ) {
            return false;
          }
		  var widget = $(this).data('ui-autocomplete').menu.element;
		  id     = widget.attr('id');
		  var interval = setInterval(function(){
			if($('#'+id).is(':visible')){
				$('.ui-autocomplete').scrollTop(0); 
				clearInterval(interval);
			}
		  });
        },
        focus: function(event, ui) {
			event.preventDefault();
		},
        select: function( event, ui ) {
			if (ui.item.value == -1) {	
				return false;
			}
			var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.label );
			// add placeholder to get the comma-and-space at the end
			terms.push( "" );
			this.value = terms.join( " | " );
			if($("#company").val()==""){
				$("#company").val(ui.item.value);
			} else {
			var temp=$("#company").val();
				$("#company").val(temp+','+ui.item.value);  
			}
			return false;
        },
		appendTo: $('#companyLabel').parents('.form-group')
	});
	
	/******* AutoComplete for Company filter *******/
	
	$( "#categoryLabel" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
			event.preventDefault();
        }
      })
      .autocomplete({
        source: function( request, response ) {
			var selectedIDs=$("#category").val();
			$.ajax({
				url: "/jobs/categories",
				data: {q: extractLast( request.term ), selected:selectedIDs},
				dataType: "json",
				success: function( data ) {
					if(data.length > 0){
						response( $.map( data, function( item ) {
							return {
								label: item.name,
								value: item.id
							};
						}));
					}else{
						response([{ label: 'No results found.', value: -1}]);
					}	
				}		
			});
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 2 ) {
            return false;
          }
		  var widget = $(this).data('ui-autocomplete').menu.element;
		  id     = widget.attr('id');
		  var interval = setInterval(function(){
			if($('#'+id).is(':visible')){
				$('.ui-autocomplete').scrollTop(0); 
				clearInterval(interval);
			}
		  });
        },
        focus: function(event, ui) {
			event.preventDefault();
		},
        select: function( event, ui ) {
			if (ui.item.value == -1) {	
				return false;
			}
			var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.label );
			// add placeholder to get the comma-and-space at the end
			terms.push( "" );
			this.value = terms.join( " | " );
			if($("#category").val()==""){
				$("#category").val(ui.item.value);
			} else {
			var temp=$("#category").val();
				$("#category").val(temp+','+ui.item.value);  
			}
			return false;
        },
		appendTo: $('#categoryLabel').parents('.form-group')
	});
	
	/******* AutoComplete for Skill filter *******/
	
	$( "#skillsetLabel" )
      // don't navigate away from the field on tab when selecting an item
      .on( "keydown", function( event ) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
			event.preventDefault();
        }
      })
      .autocomplete({
        source: function( request, response ) {
			var selectedIDs=$("#skillset").val();
			$.ajax({
				url: "/life_skills_api/getSkillTags",
				data: {q: extractLast( request.term ), limit:50, page:1, selected:selectedIDs},
				dataType: "json",
				success: function( data ) {
					if(data.results.length > 0){
						response( $.map( data.results, function( item ) {
							return {
								label: item.name,
								value: item.name
							}
						}));
					}else{
						response([{ label: 'No results found.', value: -1}]);
					}
				}
			});
        },
        search: function() {
          // custom minLength
          var term = extractLast( this.value );
          if ( term.length < 2 ) {
            return false;
          }
		  var widget = $(this).data('ui-autocomplete').menu.element;
		  id     = widget.attr('id');
		  var interval = setInterval(function(){
			if($('#'+id).is(':visible')){
				$('.ui-autocomplete').scrollTop(0); 
				clearInterval(interval);
			}
		  });
        },
        focus: function(event, ui) {
			event.preventDefault();
			//$(".hiddenLi").remove();
		},
        select: function( event, ui ) {
			if (ui.item.value == -1) {	
				return false;
			}
			var terms = split( this.value );
			// remove the current input
			terms.pop();
			// add the selected item
			terms.push( ui.item.label );
			// add placeholder to get the comma-and-space at the end
			terms.push( "" );
			this.value = terms.join( " | " );
			if($("#skillset").val()==""){
				$("#skillset").val(ui.item.value);
			} else {
			var temp=$("#skillset").val();
				$("#skillset").val(temp+','+ui.item.value);  
			}
			return false;
        },
		appendTo: $('#skillsetLabel').parents('.form-group')
	});
	$(".ui-autocomplete").mouseenter(function(){     
	   $("#editor-elements").mCustomScrollbar("disable"); 
	}).mouseleave(function(){
	   $("#editor-elements").mCustomScrollbar("update");
	});
	$('#jobs_map_btn').click(function(e){
		$('.close-btn').trigger("click");
		var error=filterValidate();
		if(error==1){
			return false;
		}
		$('#jobs_map_btn .fa-spinner').removeClass('hide');
		$('#jobs_map_btn .fa-spinner').attr('disable','disable');
		var zoomLevel = map.getZoom();
		var text = ' as Per Your Search Criteria';
		if(!$("#filter-modal").hasClass("show-modal")){
			getResults(zoomLevel, infowindow, map, 'yes', text, function(data){
				if(typeof(data) !== "undefined" && data !== null){
					if(data.length>0){
						$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth())},{
							complete: function() {
								$(".arrow-right").removeClass("arrow-left");
								$('.map-block').animate({'margin-left':0});
							}
						});
						$(".arrow span").removeClass("arrow-down").addClass("arrow-icon");
						$(".custom-navigation").hide();
					}
					else {
						$("#filterError").html("No Jobs Found"+text+".").removeClass("hide");
					}
					map.setCenter(new google.maps.LatLng(21, 78));
				} else {
					$("#filterError").html("No Jobs Found"+text+".").removeClass("hide");
				}
			});	
		} else {
			var filtertxt='';
			filtertxt=$(".filter_jobmap input[type=hidden], .filter_jobmap select").serialize();
			var radiusdata = $("#radius-search-form").serialize();
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
					clearAllMarkers();
					var results = JSON.parse(res);
					if(typeof(results.jobs) != "undefined" && results.jobs !== null){
						if(results.jobs.length>0){
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
							$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth())},{
								complete: function() {
									$(".arrow-right").removeClass("arrow-left");
									$('.map-block').animate({'margin-left':0});
								}
							});
							$(".arrow span").removeClass("arrow-down").addClass("arrow-icon");
							$(".custom-navigation").hide();
						} else {
							$("#filterError").html("No Jobs Found"+text+".").removeClass("hide");
						}
					} else {
						$("#filterError").html("No Jobs Found"+text+".").removeClass("hide");
					}
				}
			});
		}
		$('#jobs_map_btn .fa-spinner').addClass('hide');
		$('#jobs_map_btn .fa-spinner').attr('disable',false);		
    });
	
	$(document).on('click','.transparent-layer, #map-job-detail .nav-tabs, #map-job-detail .title-box', function(){
		if($(".text-message").is(":visible")){
			$(".text-message .col-md-9 .attach-input:nth-child(2) .radio-btn").trigger("click");
			$(".text-message textarea").val('').css('border-color','');
			$(".err").hide();
			//$(".text-message input[type=file]").val('').addClass("hide");
			$(".ask-referral,.text-message") .css('display','none');		
			//$(".uploadBox").addClass("hide");
			$(".apply-btn, .recommend-btn").css("display","table-cell");
			$(".request-referral-btn").show();
			$('.transparent-layer').hide();
		}
	});
	$(this).on("click",'.transparent-layer',function(){
		$('.transparent-layer').css('display','none');
	});
	$('#map-job-detail .apply-btn').click(function(){
		var d=$('#applyToField').attr('value');
		if(d=='null null'){
			$('#applyToField').attr('value','Almabay');
		}
	});
	
    /* full heart left animation */
    $(".full-heart").click(function(){
    	$(this).closest(".panel-box").hide("slide",{direction:'left'},500).css('border-bottom','#fff');    	
    });
	
	$("#editor-features .nav-tabs li").click(function(){
		var tab = $(this).attr("data-rel");
		if(tab == 'shortlist'){
			$("#JobsMsg").addClass("hide");
			$("#shortJobsMsg").removeClass("hide");
		} else {
			$("#shortJobsMsg").addClass("hide");
			$("#JobsMsg").removeClass("hide");
		}
	});
	
	// Side Controls Jquery Code 
	
	$(".flex-item-grow.toggler").click(function(){
		if($("#help-menu").is(":visible")){
			$("#help-menu").hide('slide', {direction: 'down'});
			$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
			$('.map-block').animate({'margin-left':0});
			$(".arrow-right").removeClass("arrow-left");
			setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","")},500);
		} else {
			if( $("#side-menu").hasClass("show-filters") || $("#side-menu").hasClass("show-both")){
				$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth())}, { 
					complete: function() {
						$('.map-block').animate({'margin-left':0});
						$(".arrow-right").removeClass("arrow-left");
					}
				});
				
			} else if( $("#side-menu").hasClass("show-results") ){
				$("#editor-elements").removeClass("hide");
				$("#side-menu").removeClass("show-results").addClass("show-both").animate({'left':0});
				$(".arrow-right").addClass("arrow-left");
			} else {
				$("#editor-elements").removeClass("hide");
				$("#side-menu").addClass("show-filters").animate({'left':-$("#editor-features").outerWidth()}, { 
					complete: function() {
						$('.map-block').animate({'margin-left':$("#editor-elements").outerWidth()});
						$(".arrow-right").addClass("arrow-left");
					}
				});
				
			}
		}	
    }); 
	$(".heart-toggle").click(function(){
		if($("#help-menu").is(":visible")){
			$("#help-menu").hide('slide', {direction: 'down'});
			$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
			$('.map-block').animate({'margin-left':0});
			$(".arrow-right").removeClass("arrow-left");
			setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","");},500);
		} else {
			if($("#side-menu").hasClass("show-both") || $("#side-menu").hasClass("show-results")){
				$("#side-menu").removeClass("show-both").removeClass("show-filters").removeClass("show-results").animate({'left':-($("#editor-features").outerWidth())},{
					complete: function() {
						$('.map-block').animate({'margin-left':'0'});
						$(".arrow-right").removeClass("arrow-left");
					}
				});
			} else if( $("#side-menu").hasClass("show-filters") ){
				$("#editor-features .nav-tabs li:first-child a").trigger("click");
				$("#side-menu").removeClass("show-filters").addClass("show-both").animate({'left':0},{
					complete: function() {
						//$('.map-block').animate({'margin-left':$("#side-menu").outerWidth()});
						$(".arrow-right").addClass("arrow-left");
					}
				});
				if(!$("#mobile-map").is(":visible")){
					showUserShortListJobs();
				}
			} else {
				$("#editor-features .nav-tabs li:first-child a").trigger("click");
				$("#side-menu").addClass("show-results").animate({'left':0},{
					complete: function() {
						$('.map-block').animate({'margin-left':$("#editor-features").outerWidth()});
						$("#editor-elements").addClass("hide");
					}
				});
				if(!$("#mobile-map").is(":visible")){
					showUserShortListJobs();
				}
			}
		}
		
	});
	$(".filter").click(function(){
		if($("#help-menu").is(":visible")){
			$("#help-menu").hide('slide', {direction: 'down'});
			$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
			$('.map-block').animate({'margin-left':0});
			$(".arrow-right").removeClass("arrow-left");
			setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","")},500);
		} else {
			if ( $("#side-menu").hasClass("show-both") ){
				$("#side-menu").addClass("show-results").removeClass("show-filters").removeClass("show-both").animate({'left':0},{
					complete: function() {
						$(".arrow-right").removeClass("arrow-left");
						//$('.map-block').animate({'margin-left':0});
						$("#editor-elements").addClass("hide");
					}
				});
			} else if( $("#side-menu").hasClass("show-filters") ){
				$("#side-menu").removeClass("show-filters").removeClass("show-both").removeClass("show-results").animate({'left':-($("#editor-elements").outerWidth()+$("#editor-features").outerWidth())},{
					complete: function() {
						$(".arrow-right").removeClass("arrow-left");
						$('.map-block').animate({'margin-left':0});
					}
				});
			} else if( $("#side-menu").hasClass("show-results") ){
				$("#editor-elements").removeClass("hide");
				$("#side-menu").removeClass("show-results").addClass("show-both").animate({'left':0},{
					complete: function() {
						$(".arrow-right").addClass("arrow-left");
					}
				});
			} else {
				$("#editor-elements").removeClass("hide");
				$("#side-menu").addClass("show-filters").animate({'left':-$("#editor-features").outerWidth()},{
					complete: function() {
						$(".arrow-right").addClass("arrow-left");
						$('.map-block').animate({'margin-left':$("#editor-elements").outerWidth()});
					}
				});
			}
		}
			
    }); 
	$(".help").click(function(){
		if($("#help-menu").is(":visible")){
			$("#help-menu").hide('slide', {direction: 'down'});
			$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
			$('.map-block').animate({'margin-left':0});
			$(".arrow-right").removeClass("arrow-left");
			setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","");},500);
		}else {
			$("#editor-elements, #editor-features").css("visibility","hidden");
			$("#editor-elements").removeClass('hide')
			$("#side-menu").css("left","0").removeClass('show-both').removeClass('show-results').removeClass('show-filters');
			$("#side-menu").css("left","0");
			$("#help-menu").show('slide', {direction: 'down'});
			$(".arrow-right").addClass("arrow-left");
		}
	});
	$(".help-close-icon").click(function(){
		$("#help-menu").hide('slide', {direction: 'down'});
		$("#side-menu").css("left",-($("#side-menu").outerWidth()-$("#side-controls").outerWidth()));
		$('.map-block').animate({'margin-left':0});
		$(".arrow-right").removeClass("arrow-left");
		setTimeout(function(){$("#editor-elements, #editor-features").css("visibility","");},500);
	});
	$('#resetfilterButton').click(function(){
		$('.filter_jobmap .form-control').val('');
	});
	$('.resetFilter').click(function(){
		if($("#mobile-map").is(":visible")) {
			$('.custom-navigation li').removeClass('active');
			$('.hiddenForm').hide();
			$('#mobile-map .shortlist').hide();
			$(".arrow span").removeClass("arrow-down").addClass("arrow-icon");
			$("#mobile-map .arrow").trigger("click");
		}
		$('.filter_jobmap').find('input:text').attr('style','');
		$(".filter_jobmap input, .filter_jobmap select").css("border-color", "");
		$('.scroll-y').mCustomScrollbar('scrollTo', 'top');
		$('#filterError').addClass("hide");
		$('.filter_jobmap .form-control').val('');
		$('#filter-modal #showhide').hide();
		$("#locationLabel").attr('disabled',false).val('');
		$("#filter-modal").removeClass("show-modal");
		$("#search-location").addClass("hide");
		$('#search-location').val('');
		if(typeof(circle) != "undefined" && circle !== null){
			circle.setMap(null);
		}
		hideSidePannel();
		clearAllMarkers();
		map.setCenter(new google.maps.LatLng(21, 78));
		map.setOptions({minZoom:MIN_ZOOM_LEVEL, zoom:MIN_ZOOM_LEVEL});
		var zoomLevel = map.getZoom();
		getResults(zoomLevel, infowindow, map, 'yes');
	});
	/* right box hide */
	$("#map-job-detail .close-btn").click(function(){
		$("#map-job-detail").css('display','none');
		$('#jobdetailoverlay').hide();
	});
	
	
	/* Request Referral on Job Details Popup */
	
	$('.ask-referral').click(function(){
		$(".alert").addClass("hide");
		$(".err").hide();
		$(".scroll-position textarea").css('border-color','');
		var referralArr=[];
		if($(".multi-refer-message").is(":visible")){
			$("input[class=referralCheckbox]").each(function() {
				var value=$(this).val();
				if(value!==""){
					referralArr.push(value);
				}
			});
			var referralMsg		=$(".multi-refer-message #multiReferralMsg").val();
			var fileAttach		=$('.multi-refer-message #resumeMulti').val();
			var resumeOpt		=$(".multi-refer-message input[name='resumeOptMulti']:checked").val();
			var file 			=$('.multi-refer-message input[type="file"]').val();
			if($('.multi-refer-message #resumeMulti')[0].files[0]!==null && fileAttach !=""){
				var file_size = $('.multi-refer-message #resumeMulti')[0].files[0].size;
			}
			/* Validations */
			
			var exts = ['doc','docx','rtf','odt','pdf'];
		
			if(referralArr===null || referralArr.length === 0){
				$('.alert').removeClass('hide').addClass('alert-danger').html('<button data-dismiss="alert" class="close" type="button">×</button>Please select atleast 1 recipient');
				return false;
			}
			
			if(referralMsg.trim() === ''){
				$('#multiReferralMsg').css('border-color','red').focus();
				$('#multiReferralMsg').siblings(".errorMsg").show().html("Message field is required.");
				//jqXHR.abort(event);
				return false;
			}
			
			if(resumeOpt==='attach' && (fileAttach==='' || fileAttach===null)){
				$('.multi-refer-message input[type=file]').focus().parent().siblings(".errorUpload").show().html("Please attach your latest resume.");
				return false;
			}
			
			if ( file ) {
				// split file name at dot
				var get_ext = file.split('.');
				// reverse name to check extension
				get_ext = get_ext.reverse();
				// check file type is valid as given in 'exts' array
				if ( $.inArray ( get_ext[0].toLowerCase(), exts ) < 0 ){
					$('.multi-refer-message input[type=file]').focus().parent().siblings(".errorUpload").show().html("Kindly attach a valid file e.g doc,docx,rtf,odt,pdf.");
					return false;
				}
			}
			if(file_size>500000) {
				$('.multi-refer-message input[type=file]').focus().parent().siblings(".errorUpload").show().html("File size is exceed than limit.");
				return false;
			}
			var file_data = $('.multi-refer-message input[type=file]').prop("files")[0];
		} else {
			var dataArr=[];
			$(".scroll-position .panel-box").each(function(){
				var referalBox=$(this).find(".text-message").is(':visible');
				if(referalBox){
					var userID			=	$(this).find("input[name=user_id]").val();
					referralArr.push(userID);
					dataArr['referralMsg']		=	$(this).find("#referralMsg_"+userID).val();
					dataArr['fileAttach']		=	$(this).find('#resume_'+userID).val();
					if($(this).find('.uploadBox')[0].files[0]!=null && (dataArr['fileAttach']=='' || dataArr['fileAttach']==null) ){
						dataArr['file_size']= $(this).find('.uploadBox')[0].files[0].size;
					}
					dataArr['resumeOpt']		=	$(this).find("input[class='radio-btn']:checked").val();
					dataArr['file'] 			=	$(this).find('input[type="file"]').val();
					return false;
				}
			});
			var referralMsg = dataArr['referralMsg'];
			var fileAttach  = dataArr['fileAttach'];
			var resumeOpt   = dataArr['resumeOpt'];
			var file        = dataArr['file'];
			var file_size   = dataArr['file_size'];
			
			/* Validations */
			
			var exts = ['doc','docx','rtf','odt','pdf'];
		
			if(referralArr==null || referralArr.length == 0){
				$('.alert').removeClass('hide').addClass('alert-danger').html('<button data-dismiss="alert" class="close" type="button">×</button>Please select friends');
				return false;
			}
			
			var jobmsg= $('#referralMsg_'+referralArr[0]).val().trim();
			if(jobmsg == ''){
				$('#referralMsg_'+referralArr[0]).css('border-color','red').focus();
				$('#referralMsg_'+referralArr[0]).siblings(".errorMsg").show().html("Message field is empty or invalid input has been entered.");
				//jqXHR.abort(event);
				return false;
			}
			//for job resume uploaded or not validation
			if(resumeOpt=='attach' && (fileAttach=='' || fileAttach==null)){
				$('#resume_'+referralArr[0]).focus().parent().siblings(".errorUpload").show().html("Please attach your latest resume.");
				return false;
			}
			if ( file ) {
				// split file name at dot
				var get_ext = file.split('.');
				// reverse name to check extension
				get_ext = get_ext.reverse();
				// check file type is valid as given in 'exts' array
				if ( $.inArray ( get_ext[0].toLowerCase(), exts ) < 0 ){
					$('#resume_'+referralArr[0]).focus().parent().siblings(".errorUpload").show().html("Kindly attach a valid file e.g doc, docx, rtf, odt, pdf.");
					return false;
				}
			}
			if(file_size>500000) {
				$('#resume_'+referralArr[0]).focus().parent().siblings(".errorUpload").show().html("File size is exceed than limit.");
				return false;
			}
			var file_data = $("#resume_"+referralArr[0]).prop("files")[0];
		}
		
		var jobID=$("#singleJobId").val();
		
		var form_data = new FormData(); 
		form_data.append('preSelectedOptions',referralArr);
		form_data.append('referralMsg', referralMsg);
		form_data.append('resumeOpt', resumeOpt);
		form_data.append('resume', file_data);
		$('.ask-referral').attr('disabled','disabled');
		$.ajax({
			type: "POST",
			url: "/jobs/requestReferralModel/"+jobID,
			contentType: false,
			processData: false,
			data: form_data, 
			cache: false,
			success: function(resp){
				if(resp=='success'){
					$('.alert').removeClass('hide').addClass('alert-success').html('<button data-dismiss="alert" class="close" type="button">×</button>Request for referral has been sent successfully');
					setTimeout(function(){$('.alert-success').addClass('hide')},5000);
					
					if($(".multi-refer-message").is(":visible")){
						$("#your-referral .checkbox").removeClass("checkbox-toggle");
						$('#your-referral .media-left').css('padding-left','0px');
						$(".checkbox-custom i").removeClass("checked");
						$(".ask-referral").css('display','none');
						$(".apply-btn, .recommend-btn").css("display","table-cell");
						$(".request-referral-btn").show();
						$(".scroll-position .multi-refer-message").addClass("hide");
						$("input[class=referralCheckbox]").val('');
						$("#multiReferralMsg").val('');	
						$("#resumeMulti").val('').addClass("hide");
					} else {
						$(".text-message").hide();
						$(".apply-btn, .recommend-btn").css("display","table-cell");
						$(".request-referral-btn").show();
						$(".ask-referral").css("display","none");
						$(".transparent-layer").css("display","none");
					}
					$.each(referralArr, function(index, value){
						$(".pb_"+value+" .transparent-layer").show();
					});
					setTimeout(function(){
						var delay=0;
						$.each(referralArr, function(index, value){
							$('.pb_'+value).hide('slide',{direction:'right'}, delay+500);
							delay+=500;
						});
						var count=parseInt($('.request-referral').text().trim().split(" ")[0])-referralArr.length;

						if(count <= 0){
							$('#your-referral .multiple').remove();
						}
						else if(count == 1){
							$('#your-referral .multiple .request-referral').html(count+' Request Referral');
							$('#your-referral .multiple .multiple-selection').remove();
						}
						else{
							$('#your-referral .multiple .request-referral').html(count+' Request Referral');
						}
					}, 300);
					
				} else if(resp=='error'){
					$('.alert').removeClass('hide').addClass('alert-danger').html('<button data-dismiss="alert" class="close" type="button">×</button>Unable to process your request kindly check required fields are missing.');
					return false;
				} 
				$('.ask-referral').attr('disabled',false);
			}
		});
	});
	// Radius Search Jquery
	$("#radius").keyup(function(event){
		if(event.keyCode == 13){ 
		   var radius = $(this).val();
			var unit = $("#units").val();
			if(unit == 0){
				if(radius<20){
					$(this).val(20.00);
				}
			} else {
				if(radius<=12){
					$(this).val(13.00);
				}
			}
		}
		var radius = $(this).val();
		var unit = $("#units").val();
		if(unit == 0){
			if(radius<20){
				return false;
			}
		} else {
			if(radius<=12){
				return false;
			} else {
				radius = radius * 1.609344;
			}
		}
		var latitude = $("#latitude").val();
		var longitude = $("#longitude").val();
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
		clearAllMarkers();
	});
	$("#radius").blur(function(){
		var radius = $(this).val();
		var unit = $("#units").val();
		if(unit == 0){
			if(radius<20){
				$(this).val(20.00);
			}
		} else {
			if(radius<=12){
				$(this).val(13.00);
			}
		}
	});
	$("#units").change(function(){
		var unit = $("#units").val();
		if(unit == 0){
			$('#radius').val(20.00);
		} else{
			$('#radius').val(13.00);
		}
	});
	$(".close-modal").click(function(){
		clearAllMarkers();
		$('#search-location').val('');
		$('#filter-modal #showhide').hide();
		$("#filter-modal").removeClass("show-modal");
		$("#search-location").addClass("hide");
		$("#locationLabel").attr('disabled',false).val('');
		if(typeof(circle) != "undefined" && circle !== null){
			circle.setMap(null);
		}
		map.setOptions({minZoom:MIN_ZOOM_LEVEL, zoom:MIN_ZOOM_LEVEL});
	});
	$(".job_detail").click(function(){
		$(".text-message").hide();
		$(".apply-btn, .recommend-btn").css("display","table-cell");
		$(".request-referral-btn").show();
		$(".ask-referral").css("display","none");
		$(".transparent-layer").css("display","none");
	});
	$(".filter_jobmap input, .filter-alumni-map select").focus(function(){
		$(this).css("border-color", "");
	});
	/* Mobile JS */
	$("#mobile-map .arrow-icon").click(function(){
		if($(this).hasClass("arrow-icon")){
			$(this).removeClass("arrow-icon").addClass("arrow-down");
			$(".custom-navigation").show();
		}
		else {
			$(this).removeClass("arrow-down").addClass("arrow-icon");
			$(".custom-navigation").hide();
		 }    	
	});
	$(this).on("click", ".arrow-box", function(){ 
		if($("#mobile-map").is(":visible")) {
			map.setCenter(new google.maps.LatLng(21, 78));
		}
	});
	$("#mobile-map .custom-navigation li .label-container").click(function(){
		if($(this).parent().find('.hiddenForm').length){
			if($(this).parent().hasClass("active")){
				$(this).parent().removeClass("active");
				$(this).parent().find('.hiddenForm').hide();
			} else {
				$("#mobile-map .custom-navigation li").removeClass("active");
				$("#mobile-map .custom-navigation li .hiddenForm").hide();
				$(this).parent().addClass("active");
				$(this).parent().find('.hiddenForm').show();
			}
		} else if($(this).parent('li').hasClass("search-redious")){
			$(".arrow span").removeClass("arrow-down").addClass("arrow-icon");
			$(".custom-navigation").hide();
		} else {
			$(".custom-navigation").hide();
			$("#mobile-map .shortlist").show();
			$(".arrow span").removeClass("arrow-down").addClass("arrow-icon");
		}
	});
	$(".arrow-box").click(function(){
		$("#mobile-map .shortlist").slideUp();
	});
});