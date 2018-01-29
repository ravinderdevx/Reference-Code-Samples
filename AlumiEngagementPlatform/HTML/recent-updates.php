<div class="recent_updates animated bounceInUp">
	<h1 class="heading">Recent Updates</h1>
	<div id="publisher-box" ng-if="!showloading && show_publisher_box && type=='all'">
		<div class="story-publisher-box">
			<!--<form method="post" enctype="multipart/form-data" action="" name="timelinepost" class="timeline_post">-->
				<div class="box-header-wrapper">
					<i class="fa fa-edit"></i> <?php echo $this->lang->line('post_textarea_header_label');?>
				</div>
				<div class="inputs-container" id="post-area">
					<textarea class="auto-grow-input" id="text_val" placeholder="Write something... #hashtags" data-height="40" data-copy-to=".story-text-input"></textarea>            
					<input class="story-text-input" type="hidden" name="text" value="" ng-model="story_text" />
					<div class="input-wrapper photo-wrapper" data-group="A">
						<div class="float-left">
							<div class="photos-container">0 photo(s) selected</div>
						</div>
						<div class="float-clear"></div>
					</div>
					<div class="input-wrapper youtube-wrapper" data-group="A">
						<i class="fa fa-film "></i>
						<input class="youtube-input" type="text" ng-keyup="SK_searchYoutube();" value="<?php echo $this->lang->line('post_publisher_youtube_placeholder'); ?>" placeholder="<?php echo $this->lang->line('post_publisher_youtube_placeholder'); ?>" data-placeholder="<?php echo $this->lang->line('post_publisher_youtube_placeholder'); ?>">
						<div class="input-result-wrapper"></div>
					</div>
					<span class="option" onclick="javascript:$('.story-publisher-box').find('input.photo-upload-input').click();">
						<i class="fa fa-camera-retro"></i>
					</span>
					<span class="option youtube" ng-click="toggleMediaGroup('.story-publisher-box .youtube-wrapper');">
                        <i class="fa fa-film"></i>
                    </span>
				</div>
				<div class="more-wrapper">
					<table border="0" width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td width="28px" align="center" valign="middle">								
							</td>
							<td  align="right" valign="middle">
								<div class="col-md-10 pull-right">
									<input type="hidden" class="post_privacy" name="post_privacy[]" value="{{value}}" ng-repeat="value in publisher_box.input.recipient.post_privacy_un" ng-if="publisher_box.input.recipient_exists && publisher_box.input.recipient.type == 'user' && publisher_box.input.recipient.id != loggedInUser"/>
									<select class="post_privacy" multiple="multiple" name="post_privacy[]" onchange="getOptions(this.id);" id="post_privacy_individual" class="form-control selectpicker" ng-if="!publisher_box.input.recipient_exists && publisher_box.input.timeline.type == 'user' && (publisher_box.input.recipient.type != 'group' && publisher_box.input.recipient.type != 'page' && publisher_box.input.recipient.type != 'organisation')" >
										<option value="{{value.privacy_option_id}}" ng-selected="checkInArray(value.privacy_option_id, publisher_box.input.timeline.post_privacy_un)" ng-repeat="value in publisher_box.input.privacyArray">{{value.privacy_option_name}}</option>
									</select>
									<input type="hidden" class="post_privacy" name="post_privacy[1]" value="5" ng-if="!publisher_box.input.recipient_exists && publisher_box.input.timeline.type != 'user'"/>
								</div>
							</td>
							
							<td width="28px" align="right" valign="middle">
								<button class="btn btn-primary btn-sm submit-btn active" name="story_submit_btn" ng-click="SK_registerPost()">
									<i class="fa fa-edit progress-icon fa fa-arrow-circle-o-right"></i> 
									<span><?php echo $this->lang->line('post_button'); ?></span>
								</button>
							</td>
						</tr>
					</table>
				</div>

				<input class="photo-upload-input" id="images" type="file" name="photos[]" accept="image/jpeg,image/png" multiple="multiple" onchange="angular.element(this).scope().SK_writeStoryPhotoUpload(this);" size="20">
				
				<span id='fileInfo'></span>
				
				<input type="hidden" name="timeline_id" value="{{publisher_box.input.timeline.user_id}}" ng-if="publisher_box.input.timeline">
				<input type="hidden" name="recipient_id" value="{{publisher_box.input.recipient.id}}" ng-if="publisher_box.input.recipient_exists">
			<!--</form>-->
		</div>
	</div>
	<?php $this->load->view("company/center-column-bar"); ?>
	<div class="text-center user-news-btn" ng-if="!showloading && showLoadMore" ng-disabled="submitting">
		<a href="javascript:void(0);" ng-scroll="!submitting && SK_loadPreviousPosts(stories[stories.length-1].id,0,10)" threshold="1000" ng-disabled="submitting"><img src="<?php echo base_url('common\images\simple-loader.gif'); ?>" width="35" ng-if="submitting" /></a>
	</div>
</div>
<script>
	$(document).ready(function(){
		var url = window.location.hash;
		url = url.split("/");
		var type   = url[url.length-1];
		
		$(".left-side .nav li").removeClass("active");
		if(type == "photos"){
			$(".left-side .nav li:eq(3)").addClass("active");	
			$(".recent_updates>.heading").text("Photos");
		} else if(type == "videos"){
			$(".left-side .nav li:eq(4)").addClass("active");	
			$(".recent_updates>.heading").text("Videos");
		} else {
			$(".left-side .nav li:eq(2)").addClass("active");	
			$(".recent_updates>.heading").text("Recent Updates");			
		}
	});
</script>