<script src="<?=base_url('common/marvel/javascript/bootbox.js'); ?>"></script>
<script src="<?php echo base_url('common/javascripts/mentor_timeline_controls.js'); ?>"></script>
<link rel="stylesheet" href="<?php echo base_url('common/marvel/css/animate.css?v=1.0');?>" />
<section id="mentor-profile" ng-controller="mentorProfileController">
  	<!--<div class="mentor-profile-bg" style="background:url({{mentorInfo.cover_image}}) no-repeat center center/cover;"></div><!-- mentor profile bg -->
	<div class="cover-wrapper" id="cover-background">
		<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
		<form class="cover-form hidden" method="post" enctype="multipart/form-data">
			<input class="cover-image-input hidden" id="coverImageFile" type="file" name="image" accept="image/jpeg,image/png" onchange="SK_changeCover(this)">
			<input class="cover-position" name="position" value="<?php echo $userInfo['user']['mentor_cover_position']; ?>" type="hidden">
			<input name="timeline_id" value="<?php echo $userInfo['user']['id']; ?>" type="hidden">
			<input name="MentorCoverId" value="{{mentorInfo.mentor_cover_id}}" type="hidden">
		</form>
		<?php endif; ?>
		<div class="cover-bg-images" ng-if="!showLoading">
			<img class="cover-bg-image" src="{{mentorInfo.mentor_cover_url}}" alt="image" style="top: {{mentorInfo.mentor_cover_position+'px'}};">
			<input type="hidden" class="cover-bg-src-backup" value="{{mentorInfo.mentor_cover_url}}" />
			<input type="hidden" class="cover-bg-position-backup" value="{{mentorInfo.mentor_cover_position}}" />
			<input type="hidden" class="coverbg_id" value="{{mentorInfo.mentor_cover_id}}"/>
			<div class="cover-progress hide"></div>
		</div>
		<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
		<div class="cover-bg-controls" ng-show="!showLoading">
			<div class="cover-bg-controls-edit hide">
				<button class="cover-bg-cancel-button" title="Cancel" type="button"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
				<label class="cover-bg-change-button" onclick="SK_removeCover();">Remove Image</label>
				<label class="cover-bg-change-button" for="coverImageFile">Change Image</label>
				<label class="cover-bg-save-button" type="button" onclick="SK_saveCover()">Save</label>
			</div>
			<div class="cover-bg-upload">
				<a class="cover-bg-upload-button info" title="Use a JPG & PNG types of images" onclick="SK_coverOptions();">
					<span class="glyphicon glyphicon-camera" aria-hidden="true"></span> <span class="cover-bg-upload-button-text info">Edit Background</span>
				</a>
			</div>
		</div>
		<?php endif; ?>
	</div>
	<div class="blank_div"></div>
	<div class="container">
		<div class="row">
			<div class="<?php echo ($userInfo['logged'])?'col-md-9':'col-md-12'; ?>  main-content-container">
				<div class="loading-loader" ng-if="showLoading">
					<div class="profile-info">
						<div class="mentors pull-left" style="width:98%;">
							<div class="media">
								<div class="media-left">
									<a class="left-conel" style="width:245px;display:inline-block;">
										<div class="progress" style="height: 245px;margin-bottom:0 !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</a>
								</div>
								<div class="media-body">
									<h4 class="media-heading name" style="width:50%;">
										<div class="progress" style="height: 25px; margin-bottom: 30px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h4>
									<h5 class="designation">
										<div class="progress" style="height: 12px; margin-bottom: 15px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h5>
									<h5 class="designation" style="width:80%;">
										<div class="progress" style="height: 12px; margin-bottom: 15px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h5>
									<h5 class="designation" style="width:70%;">
										<div class="progress" style="height: 12px; margin-bottom: 15px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h5>
									<h5 class="designation" style="width:60%;">
										<div class="progress" style="height: 12px; margin-bottom: 15px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h5>
									<h5 class="designation" style="width:50%;">
										<div class="progress" style="height: 12px; margin-bottom: 0px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</h5>
								</div>
							</div> <!-- media end -->								
						</div> <!-- mentors -->	
						<span class="clearfix"></span>
					</div> <!-- profile-info -->
					
					<div class="profile-action" style="padding:18px 0;margin-top:-5px;">
					</div> <!-- profile-action -->
					
					<div class="article">
						<div class="pull-left heading">Article</div>
						<span class="clearfix"></span>
						<div ng-repeat="i in [1,2,3]" style="width:100%;display:inline-block;">
							<div class="media pull-left" >
								<div class="media-left">
									<a class="left-conel" style="width:46px;display:inline-block;">
										<div class="progress" style="height: 57px;margin-bottom:0 !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</a>
								</div>
								<div class="media-body">
									<div class="progress" style="height: 13px; margin-bottom: 10px !important;">
										<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
										</div>
									</div>
									<div class="progress" style="height: 9px; margin-bottom: 8px !important;">
										<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
										</div>
									</div>
									<div class="progress" style="height: 9px;margin-bottom: 8px !important;">
										<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
										</div>
									</div>
									
								</div>
							</div> <!-- media end -->
						</div>
					</div>
				</div>
				<div class="content-container" ng-if="!showLoading">
					<?php 
						if($userInfo['logged'] && $this->session->userdata('user_id') != $userInfo['user']['id']): 
							$this->load->view('common/add-mentorship-areas'); 
						endif;
					?>
					<div class="profile-info">
						<div class="mentors pull-left">
							<div class="media">
								<div class="media-left">
									<div class="avatar-container coverUpdate">
										<img src="{{mentorInfo.user_image}}" class="media-object" alt="{{mentorInfo.name}}" width="245px" style="max-height:245px;">									
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']){ ?>
											<div class="avatar-wrapper">
												<label class="avatar-change-text" for="avatarImageFile">
													<i class="fa fa-camera" title="<?php echo $this->lang->line('change_avatar_label'); ?>" ></i>
													<span class="upload-image">Update Profile Picture</span>
												</label>
												<form class="change-avatar-form" method="post" enctype="multipart/form-data">
													<input class="change-avatar-input hidden" id="avatarImageFile" type="file" name="image" accept="image/jpeg,image/png" onchange="SK_saveAvatar();">
													<input name="timeline_id" value="<?php echo $userInfo['user']['id']; ?>" type="hidden">
												</form>
											</div>
											<div class="cover-progress hide"></div>
										<?php } ?>
									</div>
								</div>
								<div class="media-body">
									<h4 class="media-heading name" title="{{mentorInfo.name}}" ng-show="mentorInfo.name != ''">
										{{mentorInfo.name | limitTo:20}}{{(mentorInfo.name.length>20)?'...':''}}
										<img class="verified" alt="mentees" src="../../../common/images/mentor-verified-orange.png" data-toggle="tooltip" title="Verified" style="vertical-align: top;" ng-if="mentorInfo.mentor_verified=='1'">
									</h4>
									<h5 class="designation" title="{{publicUserProfessional[0].designation+' at '+publicUserProfessional[0].organisation}}" ng-show="publicUserProfessional.length>0">{{(publicUserProfessional[0].designation+' at '+publicUserProfessional[0].organisation) | limitTo:40}}{{((publicUserProfessional[0].designation+' at '+publicUserProfessional[0].organisation).length>40)?'...':''}}</h5>
									<h6 class="address" title="{{mentorInfo.current_city}}" ng-show="mentorInfo.current_city != '' && mentorInfo.current_city != '0'">{{mentorInfo.current_city | limitTo:40}}{{(mentorInfo.current_city.length>40)?'...':''}}</h6>
									<div class="details" title="{{publicUserEducation[0].institute_name}}" ng-show="publicUserEducation.length>0">
										<span class="title">Education</span>{{publicUserEducation[0].institute_name | limitTo:40}}{{(publicUserEducation[0].institute_name.length>40)?'...':''}}
									</div>
									<div class="details" title="{{publicUserProfessional[0].organisation}}" ng-show="publicUserProfessional.length>0">
										<span class="title">Current</span>{{publicUserProfessional[0].organisation | limitTo:40}}{{(publicUserProfessional[0].organisation.length>40)?'...':''}}
									</div>
									<div class="details" title="{{mentorInfo.website}}" ng-show="mentorInfo.website != '' && mentorInfo.website !== null">
										<span class="title">Website</span><a href="{{mentorInfo.website}}" target="_blank">{{mentorInfo.website | limitTo:40}}{{(mentorInfo.website.length>40)?'...':''}}</a>
									</div>
									<div class="row">
							<?php if($userInfo['logged'] && $this->session->userdata('user_id') != $userInfo['user']['id']): ?>
										<div class="col-md-4 dropdown" id="follow-button" ng-if="mentorMenteeRelation[0].active==1">
											<a class="btn btn-primary btn-select btn-select-light" data-toggle="dropdown" ng-disabled="removing">
												<span class="btn-select-value"><i class="glyphicon glyphicon-ok" ng-if="!removing"></i><i class="fa fa-spinner fa-spin" ng-if="removing"></i> Following</span>
												<span class='btn-select-arrow glyphicon glyphicon-chevron-down'></span>
											</a>
											<ul class="dropdown-menu">
												<li><a href="javascript:void(0)" ng-click="sendMessageToMentor('<?php echo base_url(); ?>', mentorInfo.id, '<?php echo $this->session->userdata['user_id']; ?>')">Send Message</a></li>
												<li><a href="javascript:void(0)" ng-click="raiseQuestionToMentor('<?php echo base_url(); ?>', mentorInfo.id, '<?php echo $this->session->userdata['user_id']; ?>')">Ask Question</a></li>
												<li><a href="javascript:void(0)" ng-click="addMentor(mentorInfo.id, 'remove')" id="remove-mentor-button">Unfollow Mentor</a></li>
											</ul>
										</div>
										<div class="col-md-4" id="follow-button" ng-if="mentorMenteeRelation[0].active!=1">
											<a class="btn btn-primary btn-select btn-select-light" ng-click="addMentor(mentorInfo.id,'add')" ng-disabled="removing">
												<span class="btn-select-value"><i class="fa fa-spinner fa-spin" ng-if="removing"></i> Follow Mentor</span>
												<span class='btn-select-arrow glyphicon glyphicon-plus'></span>
											</a>
										</div>
										<div class="col-md-8"  ng-if="mentorMenteeRelation[0].active!=1">
											<div class="know-mentor" title="{{mentorInfo.name}}">
												Know {{mentorInfo.first_name | limitTo:15}}{{(mentorInfo.first_name.length>15)?'...':''}}?
											</div>
											<a href="javascript:void(0)" mentor="<?php echo $userInfo['user']['id']; ?>"  ng-click="sendMessageToMentor('<?php echo base_url(); ?>', mentorInfo.id, '<?php echo $this->session->userdata['user_id']; ?>')" class="send-message">Send Message</a>
										</div>
							<?php elseif(!$userInfo['logged']): ?>
										<div class="col-md-3" id="follow-button">
											<a class="btn btn-primary btn-select btn-select-light" href="<?php echo base_url('login').'?url='.base64_encode(uri_string()); ?>">
												<span class="btn-select-value">Follow Mentor</span>
												<span class='btn-select-arrow glyphicon glyphicon glyphicon-plus'></span>
											</a>
										</div>
										<div class="col-md-4" title="{{mentorInfo.name}}">
											<div class="know-mentor">
													Know {{mentorInfo.first_name | limitTo:15}}{{(mentorInfo.first_name.length>15)?'...':''}}?
											</div>
											<a href="javascript:void(0)" onclick="sendMessageConfirmLogin('<?php echo base_url('login').'?url='.base64_encode(uri_string()); ?>')" class="send-message">Send Message</a>
										</div>
							<?php endif; ?>
									</div>
								</div>
							</div> <!-- media end -->								
						</div> <!-- mentors -->	
						<div class="total pull-right">
							<div class="number">
								<?php if($this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<a href="<?php echo base_url('user/mentees'); ?>" target="_blank">
										{{mentorInfo.followers}}<span class="inner-text">Followers</span>
									</a>		
								<?php else: ?>
										{{mentorInfo.followers}}<span class="inner-text">Followers</span>
								<?php endif; ?>
							</div>
							<div class="number">
								<?php if($this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<a href="<?php echo base_url('user/mentors'); ?>" target="_blank">
										{{mentorInfo.followings}}<span class="inner-text">Followings</span>
									</a>		
								<?php else: ?>
										{{mentorInfo.followings}}<span class="inner-text">Followings</span>
								<?php endif; ?>
							</div>
							<div class="number">
							<a href="<?php echo base_url('mentors/answers/'); ?>/{{mentorInfo.encrypted_id}}" target="_blank">
								{{mentorInfo.answers}}<span class="inner-text">Answers</span>
							</a>	
							</div>
							<div class="number">
								{{mentorInfo.views}}<span class="inner-text">Views</span>
							</div>
						</div>
						<span class="clearfix"></span>
					</div> <!-- profile-info -->

					<div class="profile-action">
						<!--<div class="pull-left profile-url hide">
						  <span class="url-icon"></span>https://www.almabay.com/nishant-kango
						</div>-->
						<ul class="navbar-nav nav pull-right">
						  <?php if($userInfo['logged'] && $this->session->userdata('user_id') != $userInfo['user']['id']): ?>
						  <li>
							<a href="<?php echo base_url("mentors/profile/".MD5(MD5($this->session->userdata('user_id'))));?>" target="_blank">My Profile</a>
						  </li>
						  <li>
							<a href="<?php echo base_url("user/myArticles"); ?>" target="_blank">My Articles</a>
						  </li>
						  <?php endif ?>
						  <li>
							<a href="/user/writeArticle" target="_blank">Write an Article</a>
						  </li>
						  <li>
							<a href="/mentors/questions/{{mentorInfo.encrypted_id}}" target="_blank">Questions</a>
						  </li> 						 
						</ul>
						<!--<div class="pull-right view hide" title="{{mentorInfo.name}}">
							View {{mentorInfo.first_name | limitTo:15}}{{(mentorInfo.first_name.length>15)?'...':''}}’s <a href="/user/timeline/{{mentorInfo.encrypted_id}}" target="_blank" class="social">Social Profile</a>
						</div>-->
						<span class="clearfix"></span>
					</div> <!-- profile-action -->
					
					<div class="article" ng-show="articles.length>0">
						<div class="pull-left heading">Article</div>
						<a class="pull-right see-more" ng-show="articles.length>0" href="/mentors/articles/{{mentorInfo.encrypted_id}}" target="_blank">See more</a>
						<span class="clearfix"></span>
						<div ng-repeat="art in articles | limitTo:3">
							<a href="/user/articleComment/{{art.id}}" target="_blank">
								<div class="media pull-left">
									  <div class="media-left">	
										 <div class="custom-calender" title="{{formatDate(art.added_on) |  date:'dd-MMM-yyyy' }}">
											  <span class="month" ng-bind="formatDate(art.added_on) | date:'MMM'">
											  </span>
											  <span class="date" ng-bind="formatDate(art.added_on) | date:'dd'">
											  </span>
											  <span class="year" ng-bind="formatDate(art.added_on) | date:'yyyy'">
											  </span>
										 </div>
									  </div>
									  <div class="media-body">
										<h4 class="media-heading title">{{art.title | limitTo:50}}{{(art.title.length>50)?'...':''}}</h4>		   
										<div class="describtion">{{art.description | htmlToPlaintext}}</div>			   
									  </div>
								</div> <!-- media end -->
								<span class="checkbox pull-right"></span>	
								<span class="clearfix"></span>
							</a>
						</div>
					</div> <!-- article -->	
				</div>
				<section class="custom-tab group-list" id="group-list" ng-controller="mentorsProfileController" ng-hide="mentorsData.length =='' || mentorsData.length =='0'">					
					<div class="inner-group">
						<div class="row">
							<div class="col-sm-8">
								<div class="heading">
									Following
								</div>
							</div>                    
						</div> <!-- row end -->
						<div class="row">
							<div class="loading-loader" ng-show="showLoading">
								<div class="inner-box" ng-repeat="i in [1, 2, 3, 4, 5, 6]">
									<div class="media" style="width:80%;">
										<div class="media-left">
											<a class="left-conel" style="width:72px;display:inline-block;">
												<div class="progress" style="height: 72px;margin-bottom:0 !important;">
													<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
													</div>
												</div>
											</a>
										</div>
										<div class="media-body">
											<div class="progress" style="height: 9px; margin: 5px 0 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
											<div class="progress" style="height: 9px; margin-bottom: 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
											<div class="progress" style="height: 9px; margin-bottom: 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
										</div>
									</div>		
								</div>
							</div>
							<div class="col-md-12" ng-show="!showLoading"> 
								<div class="main-box clearfix managepagec">
									<div class="inner-box mentor-follow" id="mentor-follow" ng-repeat="g in mentorsData track by $index">
										<div class="media">
											<div class="media-left">
												<a href="" target="_blank" class="left-conel" data-type="page" data-userid="{{g.id}}"> 
													<img mid="{{g.avatar_id}}" w="64" s="s" class="media-object" alt="{{g.name}}" width="100%" media-server-image />
												</a>
											</div>
											<div class="media-body">
												<h4 class="media-heading">
													<a href="<?php echo base_url('mentors/profile'); ?>/{{g.encrypted_id}}" target="_blank" title="{{g.name}}" ng-bind-html="g.name"></a>
												</h4>
												<p ng-if="g.count != '' || g.count !='0'" id="followMentor-{{g.id}}">{{g.count}} {{(g.count>1)?'Followers':'Follower'}}</p>											
												<?php if($userInfo['logged']): ?>
													<a id="unfollows-{{g.id}}" ng-if="g.mentorMenteeRelation == true" href="javascript:void(0);" class="mentor-{{g.id}}"  ng-click="removeMentor(g.id);" ng-disabled="submitting" ng-if="people.mentor_status">
														<i class="fa fa-spinner fa-spin hide"></i> <span class="mentor-text">Unfollow Mentor</span>
													</a>
													<a id="follows-{{g.id}}" ng-if="g.mentorMenteeRelation == false || g.mentorMenteeRelation == null" href="javascript:void(0);" class="mentor-{{g.id}}" ng-click="removeMentor(g.id);" ng-disabled="submitting" ng-if="!people.mentor_status">
														<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus progress-icon"></i> <span class="mentor-text">Follow Mentor</span>
													</a>
												<?php elseif(!$userInfo['logged']): ?>
													<a id="unfollows-{{g.id}}" ng-if="g.mentorMenteeRelation == true" href="<?php echo base_url('login').'?url='.base64_encode(uri_string()); ?>" class="mentor-{{g.id}}" ng-disabled="submitting" ng-if="people.mentor_status">
														<i class="fa fa-spinner fa-spin hide"></i> <span class="mentor-text">Unfollow Mentor</span>
													</a>
													<a id="follows-{{g.id}}" ng-if="g.mentorMenteeRelation == false || g.mentorMenteeRelation == null" href="<?php echo base_url('login').'?url='.base64_encode(uri_string()); ?>" class="mentor-{{g.id}}" ng-disabled="submitting" ng-if="!people.mentor_status">
														<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus progress-icon"></i> <span class="mentor-text">Follow Mentor</span>
													</a>
												<?php endif; ?>
											</div>											
										</div>								 
									</div> 
								</div> <!-- main box end -->
								<div class="clearfix"></div>
								<a id="magne-btn" ng-click="getMoreMentorData();" ng-if="showLoadMore && !showLoading" ng-disabled="showLoadingResult" class="load-more-btn" >
									<i class="fa fa-spinner fa-spin" ng-if="showLoadingResult"></i> Load More
								</a>
						  </div>
						</div>
					</div> 
				</section>	
				
				<section class="custom-tab group-list" id="group-list" ng-controller="userCompanyControllerNew" ng-hide="company.length =='' || company.length =='0'">					
					<div class="inner-group">
						<div class="row">
							<div class="col-sm-8">
								<div class="heading">
									Companies
								</div>
							</div>                      
						</div> <!-- row end -->
						<div class="row company-join">
							<div class="loading-loader" ng-show="showLoading">
								<div class="inner-box" ng-repeat="i in [1, 2, 3, 4, 5, 6]">
									<div class="media" style="width:80%;">
										<div class="media-left">
											<a class="left-conel" style="width:72px;display:inline-block;">
												<div class="progress" style="height: 72px;margin-bottom:0 !important;">
													<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
													</div>
												</div>
											</a>
										</div>
										<div class="media-body">
											<div class="progress" style="height: 9px; margin: 5px 0 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
											<div class="progress" style="height: 9px; margin-bottom: 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
											<div class="progress" style="height: 9px; margin-bottom: 8px !important;">
												<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
												</div>
											</div>
										</div>
									</div>		
								</div>
							</div>
							<div class="col-md-12" ng-show="!showLoading"> 
								<div class="main-box clearfix managepagec">
									<div class="inner-box mentor-follow" id="mentor-follow" ng-repeat="g in company track by $index" id="row-{{g.id}}">
										<div class="media">
											<div class="media-left">
												<a href="/company/index/{{g.username}}" target="_blank" target="_blank" class="left-conel" data-type="Company" data-userid="{{g.id}}">
													<img ng-if="g.avatar_id !=0" err-src="/common/uploads/institute_logo/institute-dummy.jpg" mid="{{g.avatar_id}}" class="" w="72" s="s" o="false" type="organisation" alt="{{g.name}}" width="100%" media-server-image/>	
													<img ng-if="g.avatar_id ==0" err-src="/common/uploads/institute_logo/institute-dummy.jpg" ng-src="/common/uploads/institute_logo/{{g.logo}}"  width="100%" alt="Photo"/>	
												</a>
											</div>
											<div class="media-body">
												<h4 class="media-heading">
													<a href="/company/index/{{g.username}}" target="_blank" title="{{g.name}}">{{g.name | limitTo:40}} {{(g.name.length > 40)?'...':''}}</a>
												</h4>
												
												<p ng-if="g.count!=0" id="followCount-{{g.id}}">{{g.count}} {{(g.count>1)?'Followers':'Follower'}}</p>
												
												<a ng-if="g.admin[0].follow == 1" id="unfollows-{{g.id}}" ng-if="g.mentorMenteeRelation == true" href="javascript:void(0);" class="mentor-{{g.id}}"  ng-click="removeCompany(g.id,$index);" ng-disabled="submitting" ng-if="people.mentor_status">
													<i class="fa fa-spinner fa-spin hide"></i> <span class="mentor-text">Unfollow</span>
												</a>
												<a ng-if="g.admin[0].follow != 1" id="follows-{{g.id}}" ng-if="g.mentorMenteeRelation == false || g.mentorMenteeRelation == null" href="javascript:void(0);" class="mentor-{{g.id}}" ng-click="removeCompany(g.id,$index);" ng-disabled="submitting" ng-if="!people.mentor_status">
													<i class="fa fa-spinner fa-spin hide"></i> <i class="fa fa-plus progress-icon"></i> <span class="mentor-text">Follow</span>
												</a>
												
											</div>
										</div>
									</div> 
								</div> <!-- main box end -->
								<div class="clearfix"></div>
								<a id="magne-btn" ng-click="getMoreCompanyData();" ng-if="showLoadMore && !showLoading" ng-disabled="showLoadingResult" class="load-more-btn" >
									<i class="fa fa-spinner fa-spin" ng-if="showLoadingResult"></i> Load More
								</a>
						  </div>
						</div>
					</div> 
				</section>
				
				<section class="custom-tab">
					<ul id="myTabs" class="nav nav-tabs" role="tablist">
						<li class="active" role="presentation">
							<a id="home-tab" href="#home" role="tab" data-toggle="tab" aria-controls="home" aria-expanded="true">Background</a>
						</li>
						<li role="presentation">
							<a id="profile-tab" href="#profiles" role="tab" data-toggle="tab" aria-controls="profiles">Mentorship Area</a>
						</li>
						<?php if($userInfo['logged']): ?>
						<li role="recentupdate">
							<a id="profile-update" href="#recent-update" role="tab" data-toggle="tab" aria-controls="recent-update" custom-click="">Recent Updates</a>
						</li>
						<?php endif; ?>
					</ul>
					<div class="tab-content" id="myTabContent">				
						
						<div class="tab-pane fade in active" role="tabpanel" id="home" aria-labelledby="home-tab">
							<div class="loading-loader" ng-if="showLoading">
								<div class="summary-box" style="margin-bottom:20px;">
									<h4 class="heading" style="margin-bottom:20px;">Summary</h4>
									<div style="width:98%;padding:0 20px;" ng-repeat="i in [1,2,3,4]">
										<div class="progress" style="height: 10px; margin-bottom: 12px !important;">
											<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
											</div>
										</div>
									</div>
								</div>
								<div class="inner-box">
									<h4 class="heading" style="margin-bottom:20px;">Experience</h4>
									<div class="box clearfix" ng-repeat="i in [1, 2]">
										<div class="box-content">
											<div class="pull-left" style="width:70%;display:inline-block;">
												<div>
													<div class="progress" style="height: 14px; margin-bottom: 12px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 9px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 9px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 0px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
											</div>
											<div class="pull-right" style="width:30%;display:inline-block;">
												<a style="width:75px;float:right;margin:0px 20px 0 0;">
													<div class="progress" style="height: 75px;margin-bottom:0 !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
								<div class="inner-box">
									<h4 class="heading" style="margin-bottom:20px;">Education</h4>
									<div class="box clearfix" ng-repeat="i in [1, 2]">
										<div class="box-content">
											<div class="pull-left" style="width:70%;display:inline-block;">
												<div>
													<div class="progress" style="height: 14px; margin-bottom: 12px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 9px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 9px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
												<div>
													<div class="progress" style="height: 8px; margin-bottom: 0px !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</div>
											</div>
											<div class="pull-right" style="width:30%;display:inline-block;">
												<a style="width:75px;float:right;margin:0 20px 0 0;">
													<div class="progress" style="height: 75px;margin-bottom:0 !important;">
														<div class="progress-bar progress-bar-striped2 active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
														</div>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="content-container" ng-show="!showLoading">
								<div class="summary-box text-wrapper" ng-if="summery.length > 0 && summery!=null"> 
									<h4 class="heading">
										Summary
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
										<span class="action-buttons buttons-about pull-right">
											<a class="fa fa-pencil edit-icon" title="EDIT" onclick="edit_mode('about','open','')"></a>
											<a class="fa fa fa-check update-icon hide" title="SAVE" ng-click="saveDetails('about', 'basic');"></a>
											<a class="fa fa fa-times close-icon hide" title="CANCEL" onclick="edit_mode('about','close','');"></a>
											<a class="fa fa-spinner fa-pulse loader-icon hide" title="PROCESSING" ></a>
											<a class="fa fa-check-circle success-icon hide" title="SUCCESS" ></a>
										</span>
										<?php endif; ?>
									</h4>
									<div class="about-content" show-less-text>
										<div class="summery story-text" ng-bind-html="summery">
										</div>
										<!-- <span class="dots-story-text hide">.....  </span> -->
										<div class="hide-panel text-center more-story-text hide" ng-click="showHide('.more-story-text');">
											<span class="button-text">Show More</span> <span class="glyphicon glyphicon-chevron-down arrow-up"></span>
										</div>
										<div class="not_enough_content_to_show" ng-if="summery==''">
											<div class="row mentor-profile-detail white-background">
												<div class="col-md-12">	
													<div class="error-inner clearfix">                                      
														<div class="text-center"><img src="/common/img/small-error.png" width="105px"></div>				
														<p class="text-center">No summary avaliable at the moment.</p>		 
													</div>
												</div>
											</div>	
										</div>
									</div>
									<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<div class="edit-about">
										<textarea name="about" id="about" cols="5" ng-bind-html="summery" style="width:100%;" mentors-wysihtml-editor></textarea>
									</div>
									<?php endif; ?>
								</div>
								<div class="inner-box" id="working-details">
									<h4 class="heading">
										Experience
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
										<a href="javascript:void(0);" class="add-Workplace pull-right" onclick="userForm('#add-work','work');">+ Add a Workplace</a>
										<?php endif; ?>
									</h4>
									<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<div class="box clearfix">
										<form class="work-workapace" id="add-work" work-form-validate>
											<h2>Fill Working Information</h2> 
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Organization Type <span class="star">*</span>
													</div>
													<input type="text" class="form-control Organization select2Custom input-field" id="institute_type" name="institute_type" organisation-type>
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Enter name of your company <span class="star">*</span>
													</div>
													<input name="company_name" type="text" id="company_name" class="form-control input-field select2Custom" apply-work-company />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Industry <span class="star">*</span>
													</div>
													<input type="text" name="industry" id="industry" class="form-control input-field select2Custom" apply-work-industry />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Department/Functional Area <span class="star">*</span>
													</div>
													<input type="text" name="functional_area" id="department" class="form-control input-field select2Custom" apply-work-category />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Grade/Level <span class="star">*</span>
													</div>
													<input type="text" name="level_name" id="level_name" class="form-control input-field select2Custom" grade-level />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Designation/Position <span class="star">*</span>
													</div>
													<input type="text" name="position" id="position" class="form-control input-field" ng-disabled="workSubmitting" placeholder="Enter your designation"/>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Location  <span class="star">*</span>
													</div>
													<input type="text" name="city" id="location" class="form-control input-field select2Custom" apply-work-location>
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Description
													</div>
													<textarea class="col-md-12 col-xs-12 form-control" name="job_description" id="description" placeholder="Write about your profession..." ng-disabled="workSubmitting"></textarea>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Time Period
													</div>                    				
												</div>	
												<div class="col-md-2 col-xs-12 year from">
													<div class="input-field">
														From
													</div>
												</div>		
												<div class="col-md-4">
													<div class="input-field">
														<label class="calender right-icon pull-right" for="year_from1"></label>
														<span class="input-date">
															<input type="text" name="year_from" id="year_from1" class="year_from pull-left" readonly="readonly" placeholder="MM-YYYY" ng-disabled="workSubmitting" work-date-picker>	
														</span>
													</div>
												</div>
												<div class="col-md-2 year col-xs-12">
													<div class="input-field text-center">
														To
													</div>
												</div>
												<div class="col-md-4">
													<div class="input-field">
														<span class="input-date">
															<label class="calender right-icon present-calender pull-right" for="year_to1"></label>
															<input type="text" name="year_to" id="year_to1" class="year_to pull-left" readonly="readonly" placeholder="MM-YYYY" ng-disabled="workSubmitting" work-date-picker>	
														</span>
														<span class="present hide">
															Present
														</span>
													</div>
												</div>              			
											</div>
											<div class="form-group">
												<div class="col-md-6">              				
													 <div class="custom-checkbox">
													<input type="checkbox" name="currently_working_here" id="cb1" class="currently_working_here" value="1" ng-disabled="workSubmitting" >
													<label for="cb1">I currently working here.</label>
												</div>
												</div>
												<div class="col-md-6">
													<a class="btn btn-default cancel-btn" onclick="userForm('#add-work','work');" href="javascript:void(0)" ng-disabled="workSubmitting">Cancel</a>
													<a href="javascript:void(0);" class="save-btn" ng-click="saveUserProfession()" ng-disabled="workSubmitting" ng-if="!workSubmitted"><i class="fa fa-spinner fa-spin" ng-if="workSubmitting"></i> SAVE</a>
													<a href="javascript:void(0);" class="save-btn submitted-btn" ng-disabled="workSubmitting" ng-if="workSubmitted"><i class="fa fa-check-circle" ng-if="workSubmitted"></i> SAVED</a>
												</div>
											</div>
										</form>	
									</div>
									<?php endif; ?>
									<div class="box clearfix animated" id="work-{{e.user_profession_id}}" ng-repeat="e in publicUserProfessional | limitTo:experienceLimit" ng-class="($index>1 && showLessForExperience)?'fadeIn':(!showLessForExperience)?'fadeIn':''">
										<div class="box-content">
											<div class="pull-left">
												<h4 class="degree-mention" ng-if="e.designation != ''">
													{{e.designation}}
												</h4> 
												<h5 ng-if="e.company_page==null || e.company_page==''">{{e.organisation}}</h5>
												<a href="/company/index/{{e.company_page}}" target="_blank"><h5 ng-if="e.company_page!=null && e.company_page!=''">{{e.organisation}}</h5></a>
												<h6 ng-if="e.currently_working_here=='1'">
													{{e.month_from | monthName}}, {{e.year_from}} - PRESENT <span ng-bind="workedTime(e)"></span> <span ng-if="e.city_name != '' && e.city_name !== null"> | {{e.city_name}}</span>
												</h6>
												<h6 ng-if="e.currently_working_here!='1'">
													{{e.month_from | monthName}}, {{e.year_from}} - {{e.month_to | monthName}}, {{e.year_to}} <span ng-bind="workedTime(e)"></span> <span ng-if="e.city_name != '' && e.city_name !== null"> | {{e.city_name}}</span>
												</h6>
											</div>
											<div class="pull-right" title="{{e.organisation}}" ng-if="e.company_page==null || e.company_page==''">
												<img class="logo" src="/common/uploads/institute_logo/company-dummy.png" alt="{{e.organisation}}" ng-if="e.logo==null || e.logo=='' || e.logo=='0'">
												<img class="logo" src="/common/uploads/institute_logo/{{e.logo}}" alt="{{e.organisation}}" ng-if="e.logo!=null && e.logo!='' && e.logo!='0'">
											</div>
											<a class="pull-right" title="{{e.organisation}}" href="/company/index/{{e.company_page}}" ng-if="e.company_page!=null && e.company_page!=''">
												<img class="logo" src="/common/uploads/institute_logo/company-dummy.png" alt="{{e.organisation}}" ng-if="e.logo==null || e.logo=='' || e.logo=='0'">
												<img class="logo" src="/common/uploads/institute_logo/{{e.logo}}" alt="{{e.organisation}}" ng-if="e.logo!=null && e.logo!='' && e.logo!='0'">
											</a>
											<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
											<div class="inner-box"> <!-- inner box start -->
												<div class="icon-container">
													<div class="recycle-icon" ng-click="removeWork(e.user_profession_id, $index)">
														<i class="fa fa-trash-o"></i>
													</div>
													<div class="edit-icon" onclick="userForm('#editWork-'+this.getAttribute('data-id'), 'work');" data-id="{{e.user_profession_id}}">
														<i class="fa fa-pencil"></i>
													</div>
												</div>
											</div>
											<?php endif; ?>
										</div>
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
										<form class="work-workapace" id="editWork-{{e.user_profession_id}}" work-form-validate>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Organization Type <span class="star">*</span>
													</div>
													<input type="text" class="form-control select2Custom input-field" id="institute_type" name="institute_type" data="{{e}}" organisation-type>
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Enter name of your company <span class="star">*</span>
													</div>
													<input name="company_name" type="text" id="company_name" class="form-control input-field select2Custom" data="{{e}}" apply-work-company />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Industry <span class="star">*</span>
													</div>
													<input type="text" name="industry" id="industry" class="form-control input-field select2Custom" data="{{e}}" apply-work-industry>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Department/Functional Area <span class="star">*</span>
													</div>
													<input type="text" name="functional_area" id="department" class="form-control input-field select2Custom" data="{{e}}" apply-work-category>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Grade/Level <span class="star">*</span>
													</div>
													<input type="text" name="level_name" id="level_name" class="form-control input-field select2Custom" data="{{e}}" grade-level>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Designation/Position <span class="star">*</span>
													</div>
													<input type="text" name="position" id="position" class="form-control input-field" value="{{e.designation}}" data="{{wi.designation}}" ng-disabled="workSubmitting" placeholder="Enter your designation" />	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Location  <span class="star">*</span>
													</div>
													<input type="text" name="city" id="location" class="form-control input-field select2Custom" data="{{e}}" apply-work-location >	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Description
													</div>
													<textarea class="form-control col-md-12 col-xs-12" name="job_description" id="description" placeholder="Write about your profession..." ng-disabled="workSubmitting" data="{{wi.job_profile}}" placeholder="Enter your Description">{{e.job_profile}}</textarea>	
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12">
													<div class="heading">
														Time Period
													</div>                    				
												</div>
												<div class="col-md-2 col-xs-12 year from">
													<div class="input-field">
														From
													</div>
												</div>
												<div class="col-md-4">
													<div class="input-field">
														<label class="calender right-icon pull-right" for="year_from_{{e.user_profession_id}}"></label>
														<span class="input-date">
															<input type="text" work-date-picker name="year_from" id="year_from_{{e.user_profession_id}}" class="year_from pull-left" readonly="readonly" data="{{e.month_from_name+'-'+e.year_from}}" placeholder="MM-YYYY" value="{{e.month_from_name+'-'+e.year_from}}" ng-disabled="workSubmitting">	
														</span>
													</div>
												</div>
												<div class="col-md-2 col-xs-12 year">
													<div class="input-field text-center">
														To
													</div>
												</div>
												<div class="col-md-4">
													<div class="input-field">
														<span class="input-date" ng-class="(e.currently_working_here =='1')?'hide':''">
															<label class="calender right-icon pull-right" for="year_to_{{e.user_profession_id}}"></label>
															<input type="text" work-date-picker name="year_to" id="year_to_{{e.user_profession_id}}" class="year_to pull-left" readonly="readonly" value="{{e.month_to_name+'-'+e.year_to}}" placeholder="MM-YYYY" data="{{e.month_to_name+'-'+e.year_to}}" ng-disabled="workSubmitting">	
														</span>
														<span class="present" ng-class="(e.currently_working_here !='1')?'hide':''">
															Present
														</span>
													</div>
												</div>                  			
											</div>
											<div class="form-group">
												<div class="col-md-6 col-xs-12">  
													<div class="custom-checkbox">
														<input type="checkbox" name="currently_working_here" id="cb_{{e.user_profession_id}}" class="currently_working_here" ng-checked="e.currently_working_here=='1'" value="1" ng-disabled="workSubmitting" data="{{e.currently_working_here}}">
														<label for="cb_{{e.user_profession_id}}">I currently working here.</label>
													</div>
												</div>
												<div class="col-md-6">
													<a class="btn btn-default cancel-btn" onclick="userForm('#editWork-'+this.getAttribute('data-id'),'work');" data-id="{{e.user_profession_id}}" href="javascript:void(0)" ng-disabled="workSubmitting">Cancel</a>
													<a href="javascript:void(0);" class="save-btn" ng-click="saveUserProfession(e.user_profession_id, $index);" ng-disabled="workSubmitting" ng-if="!workSubmitted"><i class="fa fa-spinner fa-spin" ng-if="workSubmitting"></i> SAVE</a>
													<a href="javascript:void(0);" class="save-btn submitted-btn" ng-disabled="workSubmitting" ng-if="workSubmitted"><i class="fa fa-check-circle" ></i> SAVED</a>
												</div>
											</div>
										</form>
										<?php endif; ?>
									</div>
									<div class="hide-panel text-center" ng-if="publicUserProfessional.length>2 && !showLessForExperience" ng-click="expand('experience')">
										<span class="button-text">Show More</span> <span class="glyphicon glyphicon-chevron-down arrow-up"></span>
									</div>
									<div class="hide-panel text-center" ng-if="publicUserProfessional.length>2 && showLessForExperience" ng-click="collapse('experience')">
										<span class="button-text">Show Less</span> <span class="glyphicon glyphicon-chevron-up arrow-up"></span>
									</div>
									<div class="not_enough_content_to_show" ng-if="publicUserProfessional.length==0">
										<div class="row mentor-profile-detail white-background">
											<div class="col-md-12">	
												<div class="error-inner clearfix">                                      
													<div class="text-center"><img src="/common/img/small-error.png" width="105px"></div>				
													<p class="text-center">No Professional details are avaliable at the moment.</p>		 
												</div>
											</div>
										</div>	
									</div>
								</div>
								<div class="inner-box" id="education-details" ng-show="!showLoading">
									<h4 class="heading">
										Education
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
										<a href="javascript:void(0);" class="add-Workplace education-workspace pull-right" onclick="userForm('.add-education','education');">+ Add an Educational Information</a>		
										<?php endif; ?>
									</h4>
									<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<div class="box clearfix">
										<form class="add-education edit-place">
											 <h2>Fill Education Infomation</h2> 
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Institute Name <span class="star">*</span>
														</div>						
														<input type="text" id="Institute" class="form-control input-field select2Custom" name="institute_id" institute-list-with-logo>						
														<div class="Institute-error error hide">This field is Required.</div>
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Department
														</div>
														<input class="form-control input-field select2Custom" id="department" name="department" institute-departments-with-logo />					
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Course / Program
														</div>
														<input id="Education" type="text" class="form-control input-field select2Custom" name="course_name" apply-course />						
													</div>
												</div>
												<div class="customCourse hide">
													<div class="form-group">
														<div class="col-md-12 col-xs-12">
															<div class="heading">
																Qualification Level <span class="star">*</span>
															</div>
															<input class="form-control qualifications input-field select2Custom" id="Qualification" name="qualification_type" qualification-level />											
															<div class="qualification-error error hide">This field is Required.</div>
														</div>
													</div>
													<div class="form-group">
														<div class="col-md-12 col-xs-12">
															<div class="heading">
																Field of study
															</div>
															<input id="Field" class="form-control input-field select2Custom" placeholder="Enter your field of study" name="field_of_study" type="text" field-study/>						
														</div>
													</div>
													<div class="form-group">
														<div class="col-md-12 col-xs-12">
															<div class="heading">
																Specialization
															</div>
															<input id="specialization" class="form-control input-field select2Custom" placeholder="Enter your specialization" name="specialization" type="text" apply-specialization/>						
														</div>
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Registration Number
														</div>
														<input type="text" id="reg_id" class="form-control" name="reg_id" placeholder="Enter registration number (Optional)" ng-disabled="submitting">						
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Passout Batch <span class="star">*</span>
														</div>
														<div id="year_from_present"></div>
														<div class="passout-batch">
															<input id="Passout" class="form-control input-field select2Custom" name="to_year" passout-year/>		
															<div class="error hide Passout-error">Please add your passout year if your are not currenty studing in this institute.</div>
														</div>
														<span class="present input-field hide">Present</span> 
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-6 col-sm-12">             				
														 <div class="custom-checkbox">
															<input type="checkbox" name="currently_studing_here" id="cbe1" class="currently_studing_here" value="1" ng-disabled="submitting">
															<label for="cbe1">I currently studying here.</label>
														 </div>
													</div>
													
													<div class="col-md-6 col-sm-12">
														<a class="btn btn-default cancel-btn" onclick="userForm('.add-education', 'education');" href="javascript:void(0)" ng-disabled="submitting">Cancel</a>
														<a class="btn btn-primary save-btn" ng-click="saveUserQualification();" ng-disabled="submitting" ng-if="!submitted">
															<i class="fa fa-spinner fa-spin" ng-if="submitting"></i> Save
														</a>
														<a class="btn btn-primary submitted-btn" ng-if="submitted">
															<i class="fa fa-check-circle" ng-if="submitted"></i> Saved
														</a>
													</div>
												</div>
										</form>
									</div>
									<?php endif; ?>
									<div class="box animated clearfix" id="school-{{e.user_qualification_id}}" ng-repeat="e in publicUserEducation | limitTo:educationLimit"  ng-class="($index>1 && showLessForEducation)?'fadeIn':(!showLessForEducation)?'fadeIn':''">
										<div class="box-content">
											<div class="pull-left">
												<h4 class="degree-mention" ng-if="e.course_name != '' && e.course_name !== null && e.currently_studing_here=='1'">
													Currently Studying in {{e.course_name}}
												</h4> 
												<h4 class="degree-mention" ng-if="e.course_name != '' && e.course_name !== null && e.currently_studing_here!='1'">
													Studied {{e.course_name}} in {{e.to_year}}
												</h4> 
												<h5 ng-if="e.company_page==null || e.company_page==''">{{e.institute_name}}</h5>
												<a href="/company/index/{{e.company_page}}" target="_blank"><h5 ng-if="e.company_page!=null && e.company_page!=''">{{e.institute_name}}</h5></a>
												<h6>
													<span ng-if="e.currently_studing_here=='1'">PRESENT | {{e.city_name}}</span>
													<span ng-if="e.currently_studing_here!='1'">{{e.to_year}} | {{e.city_name}}</span>
												</h6>
											</div>
											<div class="pull-right" title="{{e.institute_name}}" ng-if="e.company_page==null || e.company_page==''">
												<img class="logo" src="/common/uploads/institute_logo/institute-dummy.jpg" alt="{{e.institute_name}}" ng-if="e.logo==null || e.logo=='' || e.logo=='0'">
												<img class="logo" src="/common/uploads/institute_logo/{{e.logo}}" alt="{{e.institute_name}}" ng-if="e.logo!=null && e.logo!='' && e.logo!='0'">
											</div>
											<a class="pull-right" title="{{e.institute_name}}" href="/company/index/{{e.company_page}}" ng-if="e.company_page!=null && e.company_page!=''">
												<img class="logo" src="/common/uploads/institute_logo/institute-dummy.jpg" alt="{{e.institute_name}}" ng-if="e.logo==null || e.logo=='' || e.logo=='0'">
												<img class="logo" src="/common/uploads/institute_logo/{{e.logo}}" alt="{{e.institute_name}}" ng-if="e.logo!=null && e.logo!='' && e.logo!='0'">
											</a>
											<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
											<div class="inner-box"> <!-- inner box start -->
												<div class="recycle-icon" ng-click="removeEducation(e.user_qualification_id, $index)">
													<i class="fa fa-trash-o"></i>
												</div>
												<div class="edit-icon" onclick="userForm('#editSchool-'+this.getAttribute('data-id'),'education');" data-id="{{e.user_qualification_id}}">
													<i class="fa fa-pencil"></i>
												</div>
											</div> <!-- inner box end --> 
											<?php endif; ?>
										</div>
										
										<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
										<form class="edit-form edit-place" id="editSchool-{{e.user_qualification_id}}">
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Institute Name <span class="star">*</span>
													</div>	
													<input type="text" name="institute_id" id="Institute" class="form-control input-field select2Custom" data="{{e}}" institute-list-with-logo>						
													<div class="Institute-error error hide">This field is Required.</div> 
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Department
													</div>
													<input class="form-control input-field select2Custom" id="department" name="department" data="{{e}}" institute-departments-with-logo />					
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Course / Program
													</div>
													<input id="Education" type="text" class="form-control input-field select2Custom" name="course_name" data="{{e}}" apply-course />						
												</div>
											</div>
											<div class="customCourse hide">
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Qualification Level <span class="star">*</span>
														</div>
														<input class="form-control qualifications input-field select2Custom" id="Qualification" name="qualification_type" qualification-level />											
														<div class="qualification-error error hide">This field is Required.</div>
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Field of study
														</div>
														<input id="Field" class="form-control input-field select2Custom" placeholder="Enter your field of study" name="field_of_study" type="text" field-study/>						
													</div>
												</div>
												<div class="form-group">
													<div class="col-md-12 col-xs-12">
														<div class="heading">
															Specialization
														</div>
														<input id="specialization" class="form-control input-field select2Custom" placeholder="Enter your specialization" name="specialization" type="text" apply-specialization/>						
													</div>
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Registration Number
													</div>
													<input type="text" id="reg_id" class="form-control" name="reg_id" placeholder="Enter registration number (Optional)" value="{{e.reg_id}}" data="{{e}}" ng-disabled="submitting">						
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-12 col-xs-12">
													<div class="heading">
														Passout Batch <span class="star">*</span>
													</div>
													<div id="year_from_present"></div>
													<div class="passout-batch" ng-class="(e.currently_studing_here == '1')?'hide':''">
														<input id="Passout" class="form-control input-field select2Custom" name="to_year" data="{{e}}" passout-year/>				
														<div class="error hide Passout-error">Please add your passout year if your are not currenty studing in this institute.</div>
													</div>
													<span class="present input-field" ng-class="(e.currently_studing_here != '1')?'hide':''">Present</span> 
												</div>
											</div>
											<div class="form-group">
												<div class="col-md-6 col-sm-12"> 
													<div class="custom-checkbox">
														<input type="checkbox" name="currently_studing_here" id="cb_{{e.user_qualification_id}}" class="currently_studing_here" value="1" ng-checked="e.currently_studing_here == '1'" data="{{e.currently_studing_here}}" ng-disabled="submitting">
														<label for="cb_{{e.user_qualification_id}}">I currently studying here.</label>
													</div>
												</div>
												<div class="col-md-6 col-sm-12"> 
													<a class="btn btn-default cancel-btn" data-id="{{e.user_qualification_id}}" onclick="userForm('#editSchool-'+this.getAttribute('data-id'),'education');" href="javascript:void(0)" ng-disabled="submitting">Cancel</a>
													<a class="btn btn-primary save-btn" value="submit" ng-click="saveUserQualification(e.user_qualification_id, $index);" ng-disabled="submitting" ng-if="!submitted">
														<i class="fa fa-spinner fa-spin" ng-if="submitting"></i> Save
													</a>
													<a class="btn btn-primary submitted-btn" ng-if="submitted">
														<i class="fa fa-check-circle" ng-if="submitted"></i> Saved
													</a>
												</div>
											</div>
										</form> <!-- edit-form end -->
										<?php endif; ?>
									</div>
									
									<div class="hide-panel text-center" ng-if="publicUserEducation.length>2 && !showLessForEducation" ng-click="expand('education')">
										<span class="button-text">Show More</span> <span class="glyphicon glyphicon-chevron-down arrow-up"></span>
									</div>
									<div class="hide-panel text-center" ng-if="publicUserEducation.length>2 && showLessForEducation" ng-click="collapse('education')">
										<span class="button-text">Show Less</span> <span class="glyphicon glyphicon-chevron-up arrow-up"></span>
									</div>
									
									<div class="not_enough_content_to_show no-result-found" ng-if="publicUserEducation.length==0">
										<div class="row mentor-profile-detail white-background">
											<div class="col-md-12">	
												<div class="error-inner clearfix">                                      
													<div class="text-center"><img src="/common/img/small-error.png" width="105px"></div>				
													<p class="text-center">No Educational details are avaliable at the moment.</p>		 
												</div>
											</div>
										</div>	
									</div>
								</div>
							</div>
						</div> <!-- first-tab -->
						<div class="tab-pane fade" role="tabpanel" id="profiles" aria-labelledby="profile-tab">
							<div class="provide-mentorship-container">
								<h3 class="arrow-left">
									Expertise in
									<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<span class="action-buttons buttons-provide_mentorship_in pull-right">
										<a class="fa fa-pencil edit-icon" title="EDIT" onclick="edit_mode('provide_mentorship_in','open','select2')"></a>
										<a class="fa fa fa-check update-icon hide" title="SAVE" ng-click="saveDetails('provide_mentorship_in', 'career_goals');"></a>
										<a class="fa fa fa-times close-icon hide" title="CANCEL" onclick="edit_mode('provide_mentorship_in','close','');"></a>
										<a class="fa fa-spinner fa-pulse loader-icon hide" title="PROCESSING"></a>
										<a class="fa fa-check-circle success-icon hide" title="SUCCESS"></a>
									</span>
									<?php endif; ?>
								</h3>
								<span href="javascript:void(0);" class="custom-btn provide_mentorship_in-content" ng-repeat="area in mentorshipAreas.provide_mentorship_in">
									{{area.text}}
								</span>
								
								<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
								<span class="provide_mentorship_in-content" ng-if="mentorshipAreas.provide_mentorship_in.length==0">No areas added where you expertise. Click above icon to add areas.</span>
								<div class="row edit-provide_mentorship_in input-field">
									<div class="col-sm-12">
										<input type="text" class="form-control select2Custom" name="provide_mentorship_in" id="provide_mentorship_in" data="{{mentorshipAreas.provide_mentorship_in}}" apply-mentorshipprovide-areas/>               
									</div>
								</div> <!-- row end -->
								<?php else : ?>
									<span class="provide_mentorship_in-content" ng-if="mentorshipAreas.provide_mentorship_in.length==0">No expertise areas added at the moment.</span>
								<?php endif; ?>
							</div>
							<div class="seek-mentorship-conainer">
								<h3 class="arrow-left" style="margin-top:20px;">
									Keen to learn
									<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
									<span class="action-buttons arrow-left buttons-seek_mentorship_in pull-right">
										<a class="fa fa-pencil edit-icon" title="EDIT" onclick="edit_mode('seek_mentorship_in','open','select2')"></a>
										<a class="fa fa fa-check update-icon hide" title="SAVE" ng-click="saveDetails('seek_mentorship_in', 'career_goals');"></a>
										<a class="fa fa fa-times close-icon hide" title="CANCEL" onclick="edit_mode('seek_mentorship_in','close','');"></a>
										<a class="fa fa-spinner fa-pulse loader-icon hide" title="PROCESSING"></a>
										<a class="fa fa-check-circle success-icon hide" title="SUCCESS"></a>
									</span>
									<?php endif; ?>
								</h3>
								<span href="javascript:void(0);" class="custom-btn seek_mentorship_in-content" ng-repeat="area in mentorshipAreas.seek_mentorship_in">
									{{area.text}}
								</span>
								<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
								<span class="seek_mentorship_in-content" ng-if="mentorshipAreas.seek_mentorship_in.length==0">No areas added where you want to learn.  Click above icon to add areas.</span>
								<div class="row edit-seek_mentorship_in input-field">
									<div class="col-sm-12">
										<input type="text" class="form-control select2Custom" name="seek_mentorship_in" id="seek_mentorship_in" data="{{mentorshipAreas.seek_mentorship_in}}" apply-mentorshipseek-areas/>               
										<span class="error hide" id="seek_mentorship_in_error" style="width:100%;float:left;margin-left:5px;">Please select mentorship areas</span>
									</div>
								</div> <!-- row end -->
								<?php else : ?>
									<span class="seek_mentorship_in-content" ng-if="mentorshipAreas.seek_mentorship_in.length==0">No learning areas added at the moment.</span>
								<?php endif; ?>
							</div>
						 </div> <!-- second tab -->
						<?php if($userInfo['logged']): ?>
						<div class="tab-pane fade" role="tabpanel" id="recent-update" aria-labelledby="profile-update">
							<?php echo $this->load->view('user/include/recent-updates'); ?>
						</div>
						<?php endif; ?>
					</div>
				</section>
			</div> <!-- col-md-9 end -->
			<?php
				if($userInfo['logged']):
					$this->load->view("user/include/mentorship_right_column_bar"); 
				endif;
			?>
		</div>	<!-- row end -->
	</div><!-- container --> 
</section>
<style>
.group-list#group-list{
	padding-bottom:0px;
}
#group-list .managepagec{
	max-height:250px;
}	
#group-list .right-panel{
	margin-top:15px;
}
.select2-container-multi.form-control{height:auto;}
.select2-drop {
	border-color: #efefef;
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.176) !important;
}
.select2-search {
	padding-left: 0;
	padding-right: 0;
}
.select2-search input {
	background-color: #fff !important;
}
.select2-search input {
	height: 35px !important;
	background: url(/common/images/search-icon.png) no-repeat scroll 98% 8px;
}
.profile-action ul>li>a{ color:#222222; }
.profile-action ul>li>a:hover{ color:#fbae38; }
</style>
<script>
$(document).ready(function (){
	window_width = $(window).width();
	$('.cover-wrapper').height(window_width * 0.23);
	$('.blank_div').height(window_width * 0.15);
	$('.cover-bg-controls').css('margin-top',window_width * 0.06+'px');
});
</script>
<?php if($userInfo['logged'] && $this->session->userdata('user_id') == $userInfo['user']['id']): ?>
<script>
function SK_coverOptions() {
	cover_wrapper			= $('.cover-wrapper');
	cover_position_input	= $('input.cover-position');
	cover_image				=  cover_wrapper.find('img');

	cover_wrapper.addClass('edit');
	cover_wrapper.find('.cover-bg-upload').addClass('hide');
	cover_wrapper.find('.cover-bg-controls-edit').removeClass('hide');
	cover_image.draggable({
        scroll: false,
        axis: "y",
        cursor: "s-resize",
        drag: function(event, ui) {
            y1 = cover_wrapper.height();
            y2 = cover_wrapper.find('img').height();
            
            if (ui.position.top >= 0) {
                ui.position.top = 0;
            } else if (ui.position.top <= (y1-y2)) {
                ui.position.top = y1-y2;
            }
        },
        stop: function(event, ui) {
            cover_position_input.val(ui.position.top);
			cover_image.css('top',ui.position.top);
        }
    });
}

function SK_changeCover(upload_field){
	var exts = ['jpg','jpeg','png'];
	
	file = $(upload_field).val();
	if(file){
		var get_ext = file.split('.');
		get_ext = get_ext.reverse();
		
		if ( $.inArray ( get_ext[0].toLowerCase(), exts ) < 0 ){
			toastr.error("Please use PNG or JPG types of images");
			return false;
		}
		
		if (upload_field.files && upload_field.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('.cover-wrapper').find('img').attr('src', e.target.result).css('top','0px');
			};
			reader.readAsDataURL(upload_field.files[0]);
		}
	}
}

function SK_removeCover(){
	var cover_id	= $('.coverbg_id').val();
	if(cover_id == 0){
		return false;
	}
	$.ajax({
		method: "POST",
		url: SK_source() + '?t=cover&a=remove_mentor_cover',
		beforeSend: function() {
			$('.cover-bg-controls-edit').addClass('hide');
			$('.cover-wrapper .cover-progress')
				.hide()
				.removeClass('hide')
				.html('<span>0% <?php echo $this->lang->line('uploaded'); ?>...</span>')
				.fadeIn('fast');	
				setTimeout(function () {
					$('.cover-wrapper .cover-progress').html('<span><?php echo $this->lang->line('processing'); ?>..</span>');
					
					setTimeout(function () {
						$('.cover-wrapper .cover-progress').html('<span><?php echo $this->lang->line('please_wait'); ?>...</span>');
					},1000);
				},500);
		},
		success: function( responseText ){
			setTimeout(function () {
				if (responseText.status == 200) {
					$('.coverbg_id').val(responseText.mentor_cover_id);
					$('.cover-wrapper .cover-progress').fadeOut('fast', function(){
						$(this).addClass('hide').html('').css('display','');
					});
					$(".cover-bg-src-backup").val(responseText.mentor_cover_url + '?' + new Date().getTime());
					$(".cover-bg-position-backup").val(responseText.mentor_cover_position);
					$('.cover-bg-cancel-button').trigger('click');
				} else {
					$('.cover-bg-controls-edit').removeClass('hide');
					$('.cover-wrapper .cover-progress').fadeOut('fast', function(){
						$(this).addClass('hide').html('');
					});
				}
			},2000);
		}
	});
}
function SK_saveCover(){
	upload_field = $('.cover-image-input').val();
	old_position = $('.cover-bg-position-backup').val();
	new_position = $('.cover-position').val();
	if(upload_field != '' || new_position != old_position){
		$('form.cover-form').submit();
	} else {
		$('.cover-bg-cancel-button').trigger('click');
	}
}

$('form.cover-form').ajaxForm({
	url: SK_source() + '?t=cover&a=change_mentor_cover',
	beforeSend: function() {
		$('.cover-bg-controls-edit').addClass('hide');
		$('.cover-wrapper .cover-progress')
			.hide()
			.removeClass('hide')
			.html('<span>0% <?php echo $this->lang->line('uploaded'); ?>...</span>')
			.fadeIn('fast');
	},
	uploadProgress: function(event, position, total, percentComplete) {
		var percentVal = percentComplete + '%';
		$('.cover-wrapper .cover-progress').html('<span>'+percentVal + ' <?php echo $this->lang->line('uploaded'); ?>...</span>');
		
		if (percentComplete == 100) {
			setTimeout(function () {
				$('.cover-wrapper .cover-progress').html('<span><?php echo $this->lang->line('processing'); ?>..</span>');
				
				setTimeout(function () {
					$('.cover-wrapper .cover-progress').html('<span><?php echo $this->lang->line('please_wait'); ?>...</span>');
				},2000);
			},500);
		}
	},
	success: function(responseText) {
		if (responseText.status == 200) {
			$('.cover-wrapper .cover-progress').fadeOut('fast', function(){
				$(this).addClass('hide').html('').css('display','');
			});
			if($('.cover-image-input').val() != ''){
				$(".cover-bg-src-backup").val(responseText.mentor_cover_url + '?' + new Date().getTime());
			}
			$(".cover-bg-position-backup").val(responseText.mentor_cover_position);
			$('.coverbg_id').val(responseText.mentor_cover_id);
			$('.cover-bg-cancel-button').trigger('click');
		} else {
			$('.cover-bg-controls-edit').removeClass('hide');
			$('.cover-wrapper .cover-progress').fadeOut('fast', function(){
				$(this).addClass('hide').html('');
			});
		}
	}
});

function SK_saveAvatar(){
	$('form.change-avatar-form').ajaxForm({
        url: SK_source() + '?t=avatar&a=new',
        beforeSend: function () {
           $('.cover-bg-controls-edit').addClass('hide');
			$('.avatar-container .cover-progress')
				.hide()
				.removeClass('hide')
				.html('<span>0% <?php echo $this->lang->line('uploaded'); ?>...</span>')
				.fadeIn('fast');
				setTimeout(function () {
					$('.avatar-container .cover-progress').html('<span><?php echo $this->lang->line('processing'); ?>..</span>');
					setTimeout(function () {
						$('.avatar-container .cover-progress').html('<span><?php echo $this->lang->line('please_wait'); ?>...</span>');
					},1000);
				},500);
        },
        success: function (responseText) {
				$('.avatar-container .cover-progress').fadeOut('fast', function(){
					$(this).addClass('hide').html('').css('display','');
				});
				if (responseText.status == 200) {
					$('.avatar-container').find('img.media-object')
							.attr('src', responseText.avatar_url)
							.load(function () {
								$('.avatar-progress-wrapper').fadeOut('fast').addClass('hidden').html('');
								$('.avatar-change-wrapper').removeClass('hidden');
							});
				} else {
					$('.avatar-progress-wrapper').fadeOut('fast').addClass('hidden').html('');
					$('.avatar-change-wrapper').removeClass('hidden');
				}
        }
    }).submit();
}
$(document).on("click",".cover-bg-cancel-button", function(){
	cover_wrapper	= $('.cover-wrapper');
	cover_image		=  cover_wrapper.find('img');
	cover_image.attr('src', cover_wrapper.find('.cover-bg-src-backup').val()).css('top',cover_wrapper.find('.cover-bg-position-backup').val()+'px').draggable('destroy');
	cover_wrapper.removeClass('edit');
	cover_wrapper.find('.cover-bg-upload').removeClass('hide');
	cover_wrapper.find('.cover-bg-controls-edit').addClass('hide');
	cover_wrapper.find('.cover-image-input').val('');
	cover_wrapper.find('.cover-position').val(cover_wrapper.find('.cover-bg-position-backup').val());
});

function edit_mode(element, action, type){
	if(action == "open"){
		$("."+element+"-content").fadeOut(300, function(){
			$(".buttons-"+element+" .edit-icon").addClass("hide");
			$(".buttons-"+element+" .update-icon").removeClass("hide");
			$(".buttons-"+element+" .close-icon").removeClass("hide");
			$(".edit-"+element).fadeIn(300, function(){
				if(type == "select2"){
					var data = $(".edit-"+element+" #"+element).attr("data");
					$(".edit-"+element+" #"+element).select2("data", (data !== undefined && data != "")?JSON.parse(data):"");
				} 
			});
		});
	} else {
		$(".edit-"+element).fadeOut(300, function(){
			$(".buttons-"+element+" .edit-icon").removeClass("hide");
			$(".buttons-"+element+" .update-icon, .buttons-"+element+" .close-icon, .buttons-"+element+" .success-icon, .buttons-"+element+" .loader-icon").addClass("hide");
			$("."+element+"-content").fadeIn(300);
		});
	}
}
</script>
<script src="<?php echo base_url() ?>common/js/register.js?v=v1.9.6&sv=v0.0.1"></script>
<?php endif;?>	