
<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mentors extends CI_Controller
{
    public $inviteArray= array();

	function index() {
		$this->directory();
	}
	
	function directory() {
		$data['title']='Mentors Directory';
		$data['main_content'] = 'mentors/directory';
		$this->load->view('template',$data); 
	}
	
	/***
	 * @j get json list of mentors
	 * available with almabay
	 */
	function getMentorsDirectory(){
		try{
			$uid = (isset($this->session->userdata['user_id']))?$this->session->userdata['user_id']:0;
			
			$filter	=($_GET['filter']!='') ? $_GET['filter'] : '';
			
			$filterArr	=array();
			$filterArrNew   = array();
			if($filter!=''){
				$filterArr      = explode('&', $filter);
				foreach ($filterArr as $key => $value) {
					$allFilters = explode('=', $value);
					if($allFilters[1] != ""){
						$filterArrNew[$allFilters[0]]=urldecode($allFilters[1]);
					}
				}
			}
			
			$result = $this->model_user->getMentorsDirectory($uid, $filterArrNew);
			return $this->output->set_output(json_encode(array('detail'=>$result, 'loggedInUser'=>$uid, 'base_path'=>base_url(), 'statusCode'=>'200')));
		} catch ( Exception $e ) {
			return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
		}
	}
	
	function getMoreMentors($type){
		try{
			$uid = (isset($this->session->userdata['user_id']))?$this->session->userdata['user_id']:0;
			$result = array();
			switch($type){
				case 'verified':
					$result['verified_mentors']	= $this->model_mentor->getVerifiedMentors($uid);
				break;
				
				case 'suggested':
					$result['suggested_mentors']	= $this->model_mentor->getSugesstedMentors($uid);
				break;
				
				case 'others':
					$result['other_mentors']		= $this->model_mentor->getOtherMentors($uid);
				break;
				
				default:
					return $this->output->set_output(json_encode(array('detail'=>'Wrong type !! Try again later.', 'statusCode'=>'417')));
			}
			return $this->output->set_output(json_encode(array('detail'=>$result, 'statusCode'=>'200')));
		} catch ( Exception $e ) {
			return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
		}
	}
	function profile($userName) {
		$userInfo = array();        
        if(!empty($userName)){
			$uid = $userName;
			$userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
		} else if(empty($userName) && $this->socialkit->SK_isLogged()){
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		} else {
			redirect('mentors/directory');
		}
		
        if ($this->socialkit->SK_isLogged()){
			$userInfo['logged'] = true;
        } else {
			$userInfo['logged']	= false;
		}
		
        $user                   = null;
        $config['site_url']     = base_url();
        $config['theme_url']    = '';
        $config['script_path']  = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    = base_url() . 'ajax/socialAjax';
        $userInfo['config']     = $config;
		
		$user = $this->socialkit->SK_getUser($uid, true);
		
		if(!isset($user) || empty($user['id']) || $user['type'] != "user"){
			redirect('mentors/directory');
		}
		
		if( $userInfo['logged'] && ( $this->session->userdata('user_id') != $user['id'] ) ) {
			$this->model_mentor->insertProfileView($uid, $this->session->userdata('user_id'), 'mentor_viewed');	
		}
		
		$userInfo['user'] = $user;
		$data['userInfo']   = $userInfo;	
		$data['main_content'] 	='mentors/profile';
        $this->load->view('template', $data);  
	}
	
	function articles($userName) {
		$userInfo = array();        
        if(!empty($userName)){
			$uid = $userName;
			$userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
		} else if(empty($userName) && $this->socialkit->SK_isLogged()){
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		} else {
			redirect('mentors/directory');
		}
		
		if ($this->socialkit->SK_isLogged()){
			$userInfo['logged'] = true;
        } else {
			$userInfo['logged']     =false;
		}
		$user                   = null;
        $config['site_url']     = base_url();
        $config['theme_url']    = '';
        $config['script_path']  = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    = base_url() . 'ajax/socialAjax';
        $userInfo['config']     = $config;
		
		$user = $this->socialkit->SK_getUser($uid, true);
		if(isset($user['mediaObject']) && count($user['mediaObject'])>0) {
			if($user['mediaObject']['served_from'] == 'media_server')
				$user['user_image'] = $user['mediaObject']['path'].'_s_320.'.$user['mediaObject']['extension'];
			else if($user['mediaObject']['served_from'] == 'media_table')
				$user['user_image'] = $user['mediaObject']['path'].'.'.$user['mediaObject']['extension'];
		} else {
			if($user['gender'] == 'female')
				$user['user_image'] = base_url('common/marvel/images/default-female-avatar.png');
			else 
				$user['user_image'] = base_url('common/marvel/images/default-male-avatar.png');
		}
		if(!isset($user) || empty($user['id']) || $user['type'] != "user"){
			redirect('mentors/directory');
		}
		### Professional Information ###
		$data['professionalInfo']	= $this->model_user->getWorkDetails($uid);
		
		$userInfo['user']			= $user;
		$data['userInfo']			= $userInfo;	
		$data['main_content']		= 'mentors/articles';
		$this->load->view('template', $data);	
	}
	
	
	function questions($userName){
		$userInfo = array();        
        if(!empty($userName)){
			$uid = $userName;
			$userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
		} else if(empty($userName) && $this->socialkit->SK_isLogged()){
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		} else {
			redirect('mentors/directory');
		}
		
		if ($this->socialkit->SK_isLogged()){
			$userInfo['logged'] = true;
        } else {
			$userInfo['logged']     =false;
		}
		$user                   = null;
        $config['site_url']     = base_url();
        $config['theme_url']    = '';
        $config['script_path']  = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    = base_url() . 'ajax/socialAjax';
        $userInfo['config']     = $config;
		
		$user = $this->socialkit->SK_getUser($uid, true);
		if(isset($user['mediaObject']) && count($user['mediaObject'])>0) {
			if($user['mediaObject']['served_from'] == 'media_server')
				$user['user_image'] = $user['mediaObject']['path'].'_s_320.'.$user['mediaObject']['extension'];
			else if($user['mediaObject']['served_from'] == 'media_table')
				$user['user_image'] = $user['mediaObject']['path'].'.'.$user['mediaObject']['extension'];
		} else {
			if($user['gender'] == 'female')
				$user['user_image'] = base_url('common/marvel/images/default-female-avatar.png');
			else 
				$user['user_image'] = base_url('common/marvel/images/default-male-avatar.png');
		}
		if(!isset($user) || empty($user['id']) || $user['type'] != "user"){
			redirect('mentors/directory');
		}
		### Professional Information ###
		$data['professionalInfo']	= $this->model_user->getWorkDetails($uid);
		
		$userInfo['user']			= $user;
		$data['userInfo']			= $userInfo;	
		$data['main_content']		= 'mentors/questions';
		$this->load->view('template', $data);			
	}
	function answers($userName){
		$userInfo = array();        
        if(!empty($userName)){
			$uid = $userName;
			$userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
		} else if(empty($userName) && $this->socialkit->SK_isLogged()){
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		} else {
			redirect('mentors/directory');
		}
		
		if ($this->socialkit->SK_isLogged()){
			$userInfo['logged'] = true;
        } else {
			$userInfo['logged']     =false;
		}
		$user                   = null;
        $config['site_url']     = base_url();
        $config['theme_url']    = '';
        $config['script_path']  = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    = base_url() . 'ajax/socialAjax';
        $userInfo['config']     = $config;
		
		$user = $this->socialkit->SK_getUser($uid, true);
		if(isset($user['mediaObject']) && count($user['mediaObject'])>0) {
			if($user['mediaObject']['served_from'] == 'media_server')
				$user['user_image'] = $user['mediaObject']['path'].'_s_320.'.$user['mediaObject']['extension'];
			else if($user['mediaObject']['served_from'] == 'media_table')
				$user['user_image'] = $user['mediaObject']['path'].'.'.$user['mediaObject']['extension'];
		} else {
			if($user['gender'] == 'female')
				$user['user_image'] = base_url('common/marvel/images/default-female-avatar.png');
			else 
				$user['user_image'] = base_url('common/marvel/images/default-male-avatar.png');
		}
		if(!isset($user) || empty($user['id']) || $user['type'] != "user"){
			redirect('mentors/directory');
		}
		### Professional Information ###
		$data['professionalInfo']	= $this->model_user->getWorkDetails($uid);
		
		$userInfo['user']			= $user;
		$data['userInfo']			= $userInfo;	
		$data['main_content']		= 'mentors/answers';
		$this->load->view('template', $data);				
	}
	
	/****
     * @j list all questions
     * asked from mentor
     */
    function mentorContentDetails($mentor_id, $content_type) {
		$uid = $this->session->userdata['user_id'];
		if($mentor_id !='' && (preg_match('/^[a-f0-9]{32}$/', $mentor_id) || (is_numeric($mentor_id) && $mentor_id >0))){
            if(is_numeric($mentor_id)){
                $input_data['uid'] = md5(md5($mentor_id)) ;
            } else{
                $input_data['uid'] = $mentor_id ;
            }
        } else {
            $input_data['uid'] = md5(md5($uid)) ;
        } 
		
        try{
			$listproductviews   =$this->model_mentor->getMentorContentList($input_data['uid'], $content_type);
            $mentorsCount       =$this->model_user->countUserMentors($input_data['uid'], true);
            $menteesCount       =$this->model_user->countUserMentees($input_data['uid'], true);
            $answers            =$this->model_user->countMentorAnswers($input_data['uid'], true);
            $articles           =$this->model_user->countMentorArticles($input_data['uid']);
            $questions          =$this->model_user->countMentorQuestions($input_data['uid']);
            $views              =$this->model_user->countMentorViews($input_data['uid']);
            $mentorshipAreas    =$this->model_user->getMentorsMentorshipAreas($input_data['uid']);           
            $mentorMenteeRelationStatus =$this->model_user->getMentorMenteeRelation($input_data['uid'], $uid);
            $mentoInfo = $this->socialkit->SK_getUser($input_data['uid'], true);
            $userInfo  = $this->socialkit->SK_getUser($uid, true);
            $domain    = base_url();
            
            foreach( $listproductviews as $key => $value ) {
				$listproductviews[$key]['liked_by_current_user']	= $this->model_user->getQlikeByUser($value['id'], $uid);
                $listproductviews[$key]['likes']      =$this->model_user->getQlikes($value['id'])[0]->likes;
                $listproductviews[$key]['dislikes']   =$this->model_user->getQdislikes($value['id'])[0]->dislikes;
                $listproductviews[$key]['share']      =$this->model_user->getQshares($value['id'])[0]->shares;
                $listproductviews[$key]['comments']   =$this->model_user->getQcomments($value['id'])[0]->comments;
                $listproductviews[$key]['answers']    =$this->model_user->getQanswers($value['id'])[0]->comments;
				if($content_type == "answers"){
					$listproductviews[$key]['asked_by']   = $this->socialkit->SK_getUser($value['mentee_id'], true);
				} else if($content_type == "articles"){
					 $listproductviews[$key]['comments_list']   = $this->commentsOnArticles($value['id']);
				}
            }
			
            return $this->output->set_output(json_encode(array('detail'     =>$listproductviews,
                                                               'mentors'    =>$mentorsCount,
                                                               'mentees'    =>$menteesCount,
                                                               'answers'    =>$answers,
                                                               'articles'   =>$articles,
                                                               'questions'  =>$questions,
                                                               'views'      =>$views,
                                                               'mentorInfo' =>$mentoInfo,
                                                               'userInfo'   =>$userInfo,
                                                               'domain'     =>$domain,
                                                               'mentorMenteeRelation'=>$mentorMenteeRelationStatus,
                                                               'mentorShipAreas'=>$mentorshipAreas)), JSON_UNESCAPED_SLASHES);
        } catch(Exception $e) {
            return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
        }
    }
	/****
     * @j list all questions
     * asked from mentor
     */
    function mentorQaList($mentor_id) {
        $uid = $this->session->userdata['user_id'];
		if($mentor_id != '' && (preg_match('/^[a-f0-9]{32}$/', $mentor_id) || is_numeric($mentor_id))){
            if(is_numeric($mentor_id)){
                $encrypted=false;
            } else{
                $encrypted=true;
            }
        } else {
            $mentor_id=$this->session->userdata('user_id');
			$encrypted=false;
        } 
        try{
			$educationInfo				= $this->model_user->getSchoolDetails($mentor_id);
			$professionalInfo			= $this->model_user->getWorkDetails($mentor_id);
			$articles           		= $this->model_user->getMentorArticlenew($mentor_id, $encrypted);
			$mentorshipAreas    		= $this->getUserMentorshipAreas($mentor_id, $encrypted);
			$mentorInfo					= $this->socialkit->SK_getUser($mentor_id, $encrypted);
			$mentorMenteeRelationStatus = $this->model_user->getMentorMenteeRelation(($encrypted)?$mentor_id:MD5(MD5($mentor_id)), $uid);
			$mentorInfo['followers']	= $this->model_user->countUserMentees($mentor_id, $encrypted)[0]->mentees;
			$mentorInfo['followings']	= $this->model_user->countUserMentors($mentor_id, $encrypted)[0]->mentors;
			$mentorInfo['answers']		= $this->model_user->countMentorAnswers($mentor_id, $encrypted)[0]->MentorTotalAnswers;
			$mentorInfo['views']		= $this->model_user->countMentorViews(($encrypted)?$mentor_id:MD5(MD5($mentor_id)))[0]->MentorTotalViews;
			
			if(isset($mentorInfo['mediaObject']) && count($mentorInfo['mediaObject'])>0) {
				if($mentorInfo['mediaObject']['served_from'] == 'media_server')
					$mentorInfo['user_image'] = $mentorInfo['mediaObject']['path'].'_s_320.'.$mentorInfo['mediaObject']['extension'];
				else if($mentorInfo['mediaObject']['served_from'] == 'media_table')
					$mentorInfo['user_image'] = $mentorInfo['mediaObject']['path'].'.'.$mentorInfo['mediaObject']['extension'];
			} else {
				if($mentorInfo['gender'] == 'female')
					$mentorInfo['user_image'] = base_url('common/marvel/images/default-female-avatar.png');
				else 
					$mentorInfo['user_image'] = base_url('common/marvel/images/default-male-avatar.png');
			}
			if($mentorInfo['mentor_cover_url']==base_url('common/marvel/images/default-mentor-cover.jpg')){
				$mentorInfo['mentor_cover_position'] = 0;
			}
			//pr($mentorInfo);die;
			return $this->output->set_output(json_encode(array(	'mentorInfo'			=>$mentorInfo,
																'articles'  			=>$articles,
																'educationInfo'			=>$educationInfo,
																'professionalInfo'		=>$professionalInfo,
																'mentorshipAreas'		=>$mentorshipAreas, 
																'mentorMenteeRelation'	=>$mentorMenteeRelationStatus,
																'loggedInUser'			=>$uid,
																'base_path'				=>base_url()
															   )), JSON_UNESCAPED_SLASHES);
        } catch(Exception $e) {
            return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
        }
    }
	
	function userMentorshipAreas(){
		try{
			$mentorshipAreas    		= $this->getUserMentorshipAreas($this->session->userdata('user_id'));
			return $this->output->set_output(json_encode(array('mentorshipAreas'=>$mentorshipAreas)), JSON_UNESCAPED_SLASHES);
		} catch(Exception $e) {
            return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
        }
	}
	
	function getUserMentorshipAreas($uid, $encrypted=false){
		$seek_mentorship 	= [];
		$provide_mentorship = [];
		$data				= array();
		$result = $this->life_skills_model->getUserMentorshipAreas($uid, $encrypted);
		
		$d_seek_m_in = $this->life_skills_model->makeSeekMentorshipIn($result[0]['seek_mentorship_in']);
		foreach( $d_seek_m_in as $key => $value ) {
			if( $value !='' ) {
				$seek_mentorship[] = array('id'=>$value->text, 'text'=>$value->text);
			}
		}
		$data['seek_mentorship_in'] = $seek_mentorship;
		
		$d_provide_m_in = $this->life_skills_model->makeProvideMentorshipIn($result[0]['provide_mentorship_in']);
		
		foreach( $d_provide_m_in as $key => $value ) {
			if( $value !='' ) {
				$provide_mentorship[] = array('id'=>$value->text, 'text'=>$value->text);
			}
		}
		$data['provide_mentorship_in'] = $provide_mentorship;	
        return $data;
	}
	
	function commentsOnArticles($article_id){
		$listproductviews   =$this->model_mentor->getArticleCommentsList($article_id);
		foreach( $listproductviews as $key => $value ) {
			$listproductviews[$key]->user = $this->socialkit->SK_getUser($value->commented_by, true);
			$listproductviews[$key]->logged_in_user = $this->session->userdata('user_id');
			$listproductviews[$key]->QComment=$this->socialkit->SK_getMarkup($value->QComment);
		} 
		return $listproductviews;
	}
	/*****
	 * @j handle converation actions between
	 * mentor and mentees
	 */
	function actionControls() {
		try {
			$data 	=$_POST;
			if( $data['task']=='request_again' ) {
				unset($data['task']);
				$request_again = $this->model_user->updateMentorMenteeRelation($data);
				if( $request_again ) {
					return $this->output->set_output(json_encode(array('detail'=>'relation removed, reinsert in progress.', 'success'=>true, 'statusCode'=>200)));
				} else {
					return $this->output->set_output(json_encode(array('detail'=>'oops, something went wrong.', 'error'=>true, 'statusCode'=>200)));
				}
			} else {
				$check 	=$this->model_user->checkIfMentorMenteeAreConnected($data);
				if( $check[0]->active>0 ) {
					return $this->output->set_output(json_encode(array('detail'=>'relation exists', 'status'=>$check[0]->active, 'success'=>true, 'statusCode'=>200)));
				} else {
					return $this->output->set_output(json_encode(array('detail'=>'relation does not exist', 'error'=>true, 'statusCode'=>403)));
				}
			}
		} catch( Exception $e ) {
			return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
		}
	}
	/*****
	 * query set
	 */
	 	 
	function menteeAskedQuestion() {
		if($this->socialkit->SK_isLogged()){
			try {
				$data =$_POST;	
				$templateData = array();
				/****
				 * Server side check if title is set
				 */
				if( $data['title'] =='' || strlen(trim($data['title'])) == 0 ) {
					return $this->output->set_output(json_encode(array('detail'=>'Title is required field.', 'error'=>true, 'statusCode'=>200)));
				}
				$templateData['question'] = $data['title'];
				/****
				 * Server side check if description is set
				 */
				/*if( $data['description'] =='' || strlen(trim($data['description'])) == 0) {
					return $this->output->set_output(json_encode(array('detail'=>'Description is required field.', 'error'=>true, 'statusCode'=>200)));
				} */
				
				if( isset($data['mentor_id']) && $data['tag_fields'] !='' ) {
					return $this->output->set_output(json_encode(array('detail'=>'Kindly choose topics or mentors only.', 'error'=>true, 'statusCode'=>200)));
				}
				
				/****
				 * create tag fields
				 */
				if( $data['tag_fields'] !='' ) {
					$tags = array();
					foreach( explode(",", $data['tag_fields'] ) as $key => $value ) {
						$tags[] = $this->model_mentor->getInsertNewMentorship($value); 
					}
					$data['tag_fields'] = implode(",", $tags);
					
				}
				
				$templateData['shortDesc']  = substr(strip_tags($data['description']),0,200 );
				$templateData['shortDesc'] .= (strlen(strip_tags($data['description']))>200)?'.....':'';
				
				/****
				 * Server side check if description is set
				 */
				if( $data['tag_fields'] =='' && count($data['mentor_id'])==0 ) {
					return $this->output->set_output(json_encode(array('detail'=>'Kindly tag your question to make public or select mentors.', 'error'=>true, 'statusCode'=>200)));
				}
				
				/*****
				 * if article not tagged 
				 */
				if( $data['content_type']=='article' && $data['tag_fields'] =='' ) {
					return $this->output->set_output(json_encode(array('detail'=>'Kindly tag your Article to make public.', 'error'=>true, 'statusCode'=>200)));
				}
				
				
				/**** if file is not attached ****/
				if( $data['qdocs']=='' ) {
					$data['qdocs']=0;
				}
				if( count($data['mentor_id1']) > 0 ) {
					unset($data['tag_fields']);
				} 
				
				/***** check on question privacy type *****/
				if( $data['privacy_type']=='on' || $data['tag_fields']=='') {
					$data['privacy_type']='private';
					$mentors = implode(",", $data['mentor_id']);
				} else {
					$data['privacy_type']='public';
					foreach( explode(",", $data['tag_fields']) as $key => $value ) {
						$mentors[] = $this->model_mentor->getMentorsIdsByMentorShipAreas($value)[0]['mentors'];	
					}
					$mentors = implode(",", array_filter($mentors));
				}
				
				if( $data['q_id'] ) {
					$question = $data['q_id']; 
				} else {
					$question = 0;
				}
				
				unset($data['qdocs']);
				unset($data['_wysihtml5_mode']);
				
				if( count($data['mentor_id']) > 0 ) {
					$temp=array();
					$temp=$data['mentor_id'];
					$data['mentor_id'] = $mentors;
					$lastInsertedId =$this->model_mentor->insertMenteeQuestion($data, $question);
					$data['mentor_id'] = $temp;
					foreach( $data['mentor_id'] as $key=>$value ) {
						$d['mentor_id'] 	=$value;
						$d['q_id'] 			=$lastInsertedId;
						$d['mentee_id'] 	=$data['mentee_id'];
						// get last question inserte or updated id
						$this->model_mentor->insertMenteeQuestionMentor($d, $question);
						if( $_FILES['qdocs'] ) {
							$q_docs = $this->uploadMenteeDocument($lastInsertedId);
						}
					}
				} else {
					if( $data['content_type']=='article' ) {
						$data['mentor_id']=$this->session->userdata['user_id'];
						$data['mentee_id']=$this->session->userdata['user_id'];
					}
					$lastInsertedId = $this->model_mentor->insertMenteeQuestion($data, $question);
					if( $_FILES['qdocs'] ) {
						$q_docs = $this->uploadMenteeDocument($lastInsertedId);
					}
				} 		
					
				if( $lastInsertedId ) {
					$mentee = $this->socialkit->SK_getUser($this->session->userdata['user_id'], true);
					
					$templateData['mentee'] 	 = $mentee['name'];
					if( $data['content_type']=='article' ) {
						$templateData['type_id'] = '46';
						$page 					 = "articleComment";
						$notification_data		 = $this->module->getCustomQryRow("SELECT GROUP_CONCAT(id) AS ids FROM accounts LEFT JOIN tbl_user as tu ON tu.user_id = accounts.id WHERE id IN (SELECT mentee_id FROM mentors WHERE mentee_id<>'".$this->session->userdata('user_id')."' AND mentor_id='".$this->session->userdata('user_id')."' AND active=1) AND type='user' AND active=1 AND tu.status IN ('approved','pending') ORDER BY name")['ids'];
					} else {
						$templateData['type_id'] = '45';
						$page 					 = "viewanswer";
						$notification_data = $this->model_mentor->getNotificationDataOf($lastInsertedId, $data['privacy_type'], $data['tag_fields'], $data['content_type']);
					}
					
					$templateData['questionUrl'] = base_url('user/'.$page.'/'.$lastInsertedId.'');
					$notification_type = '2';
					$user_type = '1';
					
					foreach( explode(",", $notification_data) as $key => $value ) {
						$user = $this->socialkit->SK_getUserInfo($value);
						if( $user ) {
							$this->sendAskQuestionEmailNotification($user['email'], $user['first_name'], $templateData);
							$this->model_mentor->insertMentorshipNotification($user['id'], $data['mentee_id'], $data['content_type'], $notification_type, $user_type, $lastInsertedId, $data['content_type']);
						}
					}
					if( $data['content_type']=='article' ) {
						return $this->output->set_output(json_encode(array('detail'=>'Article posted succesfully.', 'article_id'=> $lastInsertedId,'success'=>true, 'statusCode'=>200)));
					}
					return $this->output->set_output(json_encode(array('detail'=>'Question posted succesfully.', 'question_id'=>$lastInsertedId, 'success'=>true, 'statusCode'=>200)));
				} else {
					return $this->output->set_output(json_encode(array('detail'=>'Oops, somethingd is wrong. Can not submit your question at the moment.', 'error'=>true, 'statusCode'=>200)));
				}
			} catch( Exception $e) {
				return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
			}
		} else {
			return $this->output->set_output(json_encode(array('detail'=>'Please login to continue.', 'statusCode'=>417)));
		}
	}
   
	/*****
	 * @j handle mentee/mentors
	 * query set
	 */
	function askPhoneNumber() {
		try {
				$data = $_POST;
				$where = array('mentee_id' => $data['mentee_id'],'mentor_id'=>$data['mentor_id']);
				$check = $this->model_user->checkIfMentorMenteeAreConnected($where);
				if( $check[0]->num>0 ){
					$url =$data['url'].'user/timeline/'.md5(md5($data['mentee_id']));
					$datainfo  = array(
									'notifier_id'  =>$data['mentee_id'],
									'timeline_id ' =>$data['mentor_id'],
									'text'         =>'Requested  your phone number',
									'url'          =>$url,
									'type'         =>'Ask Phone Number',
									'active'       =>'1',
									'user_type'    =>'1'
								);
			        $lastInsertedId =$this->model_mentor->insertAskPhonenumber($datainfo);
	                $menteeinfo 	=$this->module->getCustomQry("SELECT first_name,last_name FROM tbl_user WHERE user_id=".$data['mentee_id']);
	                $mentorinfo   	=$this->module->getCustomQry("SELECT email FROM tbl_user WHERE user_id=".$data['mentor_id']);
                    $menteename   	=$menteeinfo['first_name'].' '.$menteeinfo['last_name'];
                    $mentoremail  	=$emailtempletinfo['email'];
                    $this-> sendEmailNotifications($menteename,$mentoremail,$url);
				return $this->output->set_output(json_encode(array('detail'=>'relation exists', 'success'=>true, 'statusCode'=>200)));
			} else {
				return $this->output->set_output(json_encode(array('detail'=>'relation does not exist', 'error'=>true, 'statusCode'=>403)));
			}
		} catch( Exception $e ) {
		   return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
		}
	}	
	/*****
	 * upload user doc
	 */
	private function uploadMenteeDocument($lastInsertedId) {
		//echo count($_FILES['qdocs']['name']); die();
		try {
			$saveImage 	=array();  
			$images 	=array();
			$files 		=$_FILES;
			$count 		=count($_FILES['qdocs']['name']);
			$this->load->library('upload');			
			for($i=0; $i<$count; $i++) {				
				$_FILES['qdocs']['name']=time().$files['qdocs']['name'][$i];
				$_FILES['qdocs']['type']=$files['qdocs']['type'][$i];
				$_FILES['qdocs']['tmp_name']=$files['qdocs']['tmp_name'][$i];
				$_FILES['qdocs']['error']=$files['qdocs']['error'][$i];
				$_FILES['qdocs']['size']=$files['qdocs']['size'][$i];
				$this->upload->initialize($this->set_upload_options());		
				$field_name = "images[]";
				if ($this->upload->do_upload("qdocs")==False) {
					if(!$dir_exist)
					  rmdir($config['upload_path']);
					$error =array('error' => $this->upload->display_errors());					
					return array('docStatus'=>false, 'data'=>$error);
				} else {
					$data 					=array('upload_data'=> $this->upload->data());
					$saveImage['doc_of_id'] =$lastInsertedId;
					list($name, $ext) 		=explode(".", $data['upload_data']['file_name']);
					$saveImage['document'] 	='/common/'.explode("/common/", $data['upload_data']['full_path'])[1];
					$saveImage['type'] 		=$data['upload_data']['file_ext'];
					$saveImage['remarks'] 	=$data['upload_data']['file_name'];
					$d[] =$this->model_mentor->saveMenteeQuestionDocumentInfo($saveImage);
				}
			}
			if( $d ) {
				return array('docStatus'=>true, 'data'=>$data);					
			} else {
				return false;
			}
        } catch (Exception $e) {
            return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
        }	
	}
	
	/**
     * SHOWS ALL MENTORS OF USER
     */
    function mentorsList(){
        $sk = array();
        $uid = $this->session->userdata('user_id');
		try{
			if ($this->socialkit->SK_isLogged()) {
				$user = $this->socialkit->SK_getUser($uid, true);
				if (!empty($user['id']) && $user['type'] == "user") {
					$sk['user'] = $user;
					$sk['timeline'] = $user;
					$sk['timeline']['wall_user_id'] = false;
					$sk['logged'] = true;
				}
				//$data['sk'] = $sk;
				//$data['title'] = 'List of Mentors';
				$data['mentors'] = $this->socialkit->SK_getMentor($uid);
				$data['mentorSuggestions'] = $this->model_user->getUserMentorshipSuggestions($uid);
				return $this->output->set_output(json_encode(array('detail'=>$data, 'success'=>true, 'statusCode'=>'200')), JSON_UNESCAPED_SLASHES);
			} else {
				redirect(base_url('login').'?url='.base64_encode(uri_string()));
			}
		} catch( Exception $e ) {
			return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
		}
    }
	
	/****
	 * @j
	 */
	function getQuestionMentorList( $qaid ) {
		try{
			$data = array();
			$question_selected_mentors = $this->model_mentor->getQuestionMentorList($qaid);
			foreach( $question_selected_mentors as $key => $value ) {
				$data[] = array_merge($this->socialkit->SK_getUser($value['mentor_id'], true),array('mentor_status'=>$this->socialkit->SK_isMentor($value['mentor_id']))) ;
			}
			$data = $this->model_user->array_sort_by_column($data, 'name', SORT_ASC) ;
			return $this->output->set_output(json_encode($data), JSON_UNESCAPED_SLASHES);
		} catch( Exception $e ){
            return $this->output->set_output(json_encode(array('detail'=>$e->getMessage(), 'statusCode'=>$e->getCode())));
        }
	}
}
