<?php
if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User extends CI_Controller {

    /**
     *  LISTS MODEL DATA INTO A TABLE
     */
	 
    function index($userName = false) {
      //  $uid = $this->session->userdata('user_id');die();
       // $this->session->set_userdata('school', $id);
		$this->wall($userName);
    }

    /**
     *  LISTS USER WALL
     * @param string $userName 
     */
    function wall($userName = false) {
        $sk = array();
        $uid = $this->session->userdata('user_id');
        // Login verification and user stats update
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        $data['account_status'] = $this->session->userdata('account_status');
        if ($this->socialkit->SK_isLogged()) { 
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") { 
                $sk['user'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = true;
                ####PRECAUTION MEASURE TO MAKE THE USER FOLLOW HIMSELF IF HIS NOT, SO THAT HE CAN SEE HIS OWN PROFILE STREAM
                if (!$this->socialkit->SK_isFollowing($user['id'], $user['id'])) {
                    $query_three = "DELETE FROM " . DB_FOLLOWERS . " WHERE follower_id=" . $user['id'] . " AND following_id=" . $user['id'];
                    $sql_query_three = $this->db->query($query_three);
                    $query_four = "INSERT INTO " . DB_FOLLOWERS . " (active,follower_id,following_id,time) VALUES (1," . $user['id'] . "," . $user['id'] . "," . time() . ")";
                    $sql_query_four = $this->db->query($query_four);
                }
                $sk['privacyArray'] = $this->model_user->getPrivacyOptions();
            }
            $data['sk'] = $sk;
            $this->load->view('user/homenew', $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    function welcome(){
        if($this->session->userdata('user_id')!='' && $this->session->userdata('firstTimeWelcomeMsg')=="yes"){
            $data = array('page_title'=>'Welcome To AlmaBay');
            $this->load->view('user/welcome',$data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));    
        }
    }
    /*
     * LIST USER TIMELINE BASED ON EITHER USERNAME/EMAIL/USERID
     */
    function timelineold($userName = false){
        $sk = array();
        $uid = $this->session->userdata('user_id');
        
        if(!empty($userName))
        {
            $uid = $userName;
            $sk['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
        }
        // Login verification and user stats update 
        
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        $privacyArray='';
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if(!isset($user) || empty($user)){
                    show_404();
            }
            //echo '<pre>'; print_r($user); die;
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user'] = $user;  
                $privacyArray = $this->model_user->getPrivacyOptions();
                $sk['privacyArray'] = $privacyArray;                
                $sk['logged'] = true;
            }
            $data['sk'] = $sk;
            $data['privacyArray'] = $privacyArray;
            //pr($sk); die;
            $this->load->view('user/timeline', $data);  
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()) );
        }
    }
    
    /*
    * TIMELINE OF FRIEND/UNFRIEND USER 
    */
    function timeline($userName = false, $page=1)
    {
        $userInfo = array();        
        if(!empty($userName)){
            $uid = $userName;
            $userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
        } else {
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		}
        // Login verification and user stats update 
        $userInfo['logged']     =false;
        $user                   =null;
        $config['site_url']     =base_url();
        $config['theme_url']    ='';
        $config['script_path']  =str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    =base_url() . 'ajax/socialAjax';
        $userInfo['config']     =$config;
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if(!isset($user) || empty($user)){
                show_404();
            }
            if (!empty($user['id']) && $user['type'] == "user") {                 
                $leftBarSide = $this->commonTimelineQry($uid);
                $userInfo['user'] = $user; 
                $userInfo['logged'] = true;
                
                ### Posted Jobs ###
                $perpage        = 10;
                $page           = ($this->uri->segment(4)) ? $this->uri->segment(4) : 1;  
                $offset         = ($page - 1) * $perpage;
                $totalRecQry  = $this->module->getCustomQryRow("SELECT COUNT(*) as numRows FROM jobs_list WHERE jobs_list.status='1' AND jobs_list.added_by='0' AND md5(md5(jobs_list.userid)) = '".$uid."'");
                $totalRecords = $totalRecQry['numRows'];
                $jobPosted = $this->jobs_model->postedJobList($offset,$perpage,$uid,'yes',true); 
               
            }
			$userInfo['privacyArray'] = $this->model_user->getPrivacyOptions();
			
            $data   = array(
                          'userInfo'=>$userInfo,
                          'totalRecords'=>$totalRecords,
                          'timelineJobInfo'=>$jobPosted
                        );				
            $data   = array_merge($data,$leftBarSide);
            $this->load->view('user/timelinenew', $data);  
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    /**
     * SHOWS ALL FRIENDS OF USER
     */
    function friends($uid=''){
		$userInfo = array();
        if($uid==''){
            $uid = $this->session->userdata('user_id'); 
            $layoutView = 'user/friends';
        } else {
            $layoutView = 'user/timelinefriends';
            // Login verification and user stats update
			$user = null;
			$sk = array();
			$config['site_url'] 	=base_url();
			$config['theme_url'] 	='';
			$config['script_path'] 	=str_replace('index.php', '', $_SERVER['PHP_SELF']);
			$config['ajax_path'] 	=base_url() . 'ajax/socialAjax';
            $userInfo['logged'] = false;
            $userInfo['config'] = $config;
			$user = $this->socialkit->SK_getUser($uid, true);
			$sk['logged'] = false;
            $sk['config'] = $config;
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user'] = $userInfo['user'] = $user;
                $sk['timeline'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = $userInfo['logged'] = true;
                $userInfo['timeline']['wall_user_id'] = $uid;//TIMELINE ID IS USER_ID and is double md5 ed
            }
            $data['sk']=$sk;
        }
        if ($this->socialkit->SK_isLogged()) {
            $data['title']      ='Friends List';
            $data['userInfo']   =$userInfo;
            $this->load->view($layoutView, $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    /*
    * INFORMATION ABOUT USER 
    */
    function about($userName)
    {
        $userInfo = array();        
        if(!empty($userName))
		{
			$uid = $userName;
			$userInfo['timeline']['wall_user_id'] = $userName;//TIMELINE ID IS USER_ID and is double md5 ed
		} else {
			$uid = MD5(MD5($this->session->userdata('user_id')));
			$userInfo['timeline']['wall_user_id'] = MD5(MD5($this->session->userdata('user_id')));//TIMELINE ID IS USER_ID and is double md5 ed
		}
        
        // Login verification and user stats update 
        $userInfo['logged']     =false;
        $user                   =null;
        $config['site_url']     =base_url();
        $config['theme_url']    ='';
        $config['script_path']  =str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path']    =base_url() . 'ajax/socialAjax';
        $userInfo['config']     =$config;
		
        if ($this->socialkit->SK_isLogged()){
            $user = $this->socialkit->SK_getUser($uid, true);
            if(!isset($user) || empty($user)){
                show_404();
            }
            if (!empty($user['id']) && $user['type'] == "user"){                 
                $userInfo['user'] = $user; 
                $userInfo['logged'] = true;
				 $userInfo['user'] = $user;
            }
			$userInfo['user'] = $user;
			
            $data   = array(
                          'userInfo'=>$userInfo
                        );				
            $this->load->view('user/about', $data);  
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
	
    /**
     * SHOWS ALL MENTORS OF USER
     */
    
    function mentors(){
        $uid = $this->session->userdata('user_id');
        // Login verification and user stats update
        if ($this->socialkit->SK_isLogged()) {
            $data['title'] = 'List of Mentors';
            $data['mentorSuggestions'] = $this->model_user->getUserMentorshipSuggestions($uid);
            $this->load->view('user/mentors', $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    
    /**
     * SHOWS ALL MENTEES OF USER
     */
    
    function mentees(){
        $uid = $this->session->userdata('user_id');
        if ($this->socialkit->SK_isLogged()) {
            $data['title']      = 'List of Mentees';
            $this->load->view('user/mentees', $data);
            
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }

    /**
     *  SHOWS A RECORD VIEW
     */
    function show($id) {
        $blogDetails = $this->model_tbl_blog->get($id);
        $data['blogDetails'] = $blogDetails;
        //$fields = $this->model_tbl_blog->fields( TRUE );
        $datePublish = $blogDetails['datePublish'];
        $date = date("Y-d-F", strtotime($datePublish));
        $explodedate = explode('-', $date);
        $data['date'] = $explodedate;
        $this->load->view('admin/blog/edit', $data);
    }

  
    /*
     * SHOWS A STORY PAGE FOR FULL STORY
     */
    function story($id){
		if(is_numeric($id) && $id>0){
			$uid					= $this->session->userdata('user_id');
			$sk						= array();
			$config['site_url'] 	= base_url();
			$config['theme_url'] 	= '';
			$config['script_path'] 	= str_replace('index.php', '', $_SERVER['PHP_SELF']);
			$config['ajax_path'] 	= base_url() . 'ajax/socialAjax';
			$sk['config'] 			= $config;
			$sk['logged'] 			= false;
			if ($this->socialkit->SK_isLogged()) {
				$sk['logged']	= true;
				$user			= $this->socialkit->SK_getUserInfo($uid);
				if (!empty($user['id']) && $user['type'] == "user") {
					$sk['user'] = $user;
					$query_two = "UPDATE " . DB_ACCOUNTS . " SET last_logged=" . time() . " WHERE id=" . $user['id'];
					$sql_query_two = $this->db->query($query_two);
				}
				$sk['post']['id'] = $this->socialkit->SK_secureEncode($id);
				$data['sk'] = $sk;
				$this->load->view('user/story', $data);
			} else {
				redirect(base_url('login').'?url='.base64_encode(uri_string()));
			}
		} else {
			if ($this->socialkit->SK_isLogged()) {
				redirect('user');
			} else {
				redirect(base_url('login').'?url='.base64_encode(uri_string()));
			}
		}
    }
    
    /*
     * SHOWS ALL NOTIFICATIONS
    */
    function notifications(){
        $this->session->set_userdata('notify_offset', '0');
        $offset_session=  $this->session->userdata('notify_offset');
        $sk = array();
        $uid = $this->session->userdata('user_id');
        // Login verification and user stats update
        $logged = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user'] = $user;
                $logged = true;
                $query_two = "UPDATE " . DB_ACCOUNTS . " SET last_logged=" . time() . " WHERE id=" . $user['id'];
                $sql_query_two = $this->db->query($query_two);
            }
            $sk['logged'] = $logged;
            $sk['notifications'] = $this->socialkit->SK_getNotifications(array('all'=>true), $offset_session ,50);
			
            $data['sk'] = $sk;
            $this->load->view('user/notifications', $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    
    /*
     * GETS ALBUM DATA BASED ON ID
     * @ param  $json = true for ajax based json format
     */
    function collection($album_id, $uid, $json = false){
		$albuminfo = $this->db->get_where(DB_MEDIA,array('id'=>$album_id))->row()->id;
        if(empty($albuminfo)){
			redirect('user/albums/'.md5(md5($this->session->userdata('user_id'))));
		}
		$config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $user = null;
        $layoutView = 'user/timelineUserAlbum';
		$sk['uid'] = $uid;
        // Login verification and user stats update
        $userInfo = array();
        $userInfo['logged'] = false;
        $userInfo['config'] = $config;
        if ($this->socialkit->SK_isLogged()){
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user"){
                $sk['user'] = $userInfo['user'] = $user;
                $sk['timeline'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = $userInfo['logged'] = true;
                $userInfo['timeline']['wall_user_id'] = $uid;//TIMELINE ID IS USER_ID and is double md5 ed
            }
            $query_one = "SELECT id,name,descr,timeline_id,album_privacy,user_album_type FROM " . DB_MEDIA . " WHERE id=" . $album_id . " AND `type`='album' AND temp=0 AND active=1";
            $sql_query_one = $this->db->query($query_one);
			$album = $sql_query_one->result();
			$sk['album'] = (array) $album[0];
			$current_user	= MD5(MD5($this->session->userdata('user_id')));
			$data['timeline_id']	= $uid;
			$all_photos=$this->db->query("SELECT a.id as post_id,a.post_privacy, a.post_id as postid,b.id FROM posts AS a
														JOIN  ". constant('DB_MEDIA') ." AS b on a.media_id=b.id
														WHERE b.album_id='".$album_id."' AND b.type='photo' AND a.active ='1'
														ORDER BY a.id DESC  ")->result_array();
			
			$data['photos_count']	= sizeof($all_photos);
			$data['photos'] = array();
			if($uid != $current_user){
				$friend 		= $this->socialkit->SK_isFollowing($uid, 0, true);
				$mentor 		= $this->socialkit->SK_isMentor($current_user, $uid, true);
				$mentee 		= $this->socialkit->SK_isMentee($current_user, $uid, true);
				//pr($all_photos);die;
				//pr($sk['photos'] = $this->socialkit->SK_getAlbumPhotos($album_id));die;
				foreach($all_photos as $key=>&$photo){
					$post_privacy	= unserialize($photo['post_privacy']);
					if(in_array('5',$post_privacy)){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					} else if(in_array('1',$post_privacy) && $uid == $current_user){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					} else if(in_array('2',$post_privacy) && $friend){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					} else if(in_array('3',$post_privacy) && $mentor){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					} else if(in_array('4',$post_privacy) && $mentee){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					}  else if($post_privacy == '' || $post_privacy == 0){
						$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						$sk['photos'][] = $photo;
					}
				}
			} else {
				foreach($all_photos as $key=>&$photo){
					$photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
					$sk['photos'][] = $photo;
				}
				//$sk['photos'] = $this->socialkit->SK_getAlbumPhotos($album_id);
			}
            $data = array('sk'=>$sk, 'title'=>'Album', 'userInfo'=>$userInfo);
            if($json == true){
                header('Content-type: text/json');
                header('Content-type: application/json');
                echo json_encode($sk);
            } else {
                $this->load->view($layoutView, $data);
            }
        } else {
              redirect(base_url('login').'?url='.base64_encode(uri_string()));
            }
    }
    /*
     * GETS ALBUM DATA BASED ON ID
     * @ param  $json = true for ajax based json format
     */
    function album($album_id, $json = false){
		if(!empty($album_id) && $album_id>0){
			$albuminfo = $this->db->get_where(DB_MEDIA,array('id'=>$album_id))->row()->id;
			if(empty($albuminfo)){
				redirect('user/albums');
			}
		  $timeline_id =	$this->db->get_where(DB_MEDIA,array('id'=>$album_id))->row()->timeline_id;
			$query_one = "SELECT id,name,descr,timeline_id,album_privacy,user_album_type FROM " . DB_MEDIA . " WHERE id=" . $album_id . " AND `type`='album' AND temp=0 AND active=1";
			$sql_query_one = $this->db->query($query_one);
			if ($sql_query_one->num_rows == 1){
				$sk  = array();
				$uid = $this->session->userdata('user_id');
				// Login verification and user stats update
				$sk['logged'] = false;
				$user = null;
				$config['site_url'] = base_url();
				$config['theme_url'] = '';
				$config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
				$config['ajax_path'] = base_url() . 'ajax/socialAjax';
				$sk['config'] = $config;
				if ($this->socialkit->SK_isLogged()) {
					$user = $this->socialkit->SK_getUser($uid, true);
					if (!empty($user['id']) && $user['type'] == "user") {
						$sk['user'] = $user;
						$sk['timeline'] = $user;
						$sk['timeline']['wall_user_id'] = false;
						$sk['logged'] = true;
					}
					$album = $sql_query_one->result();
					$sk['album'] = (array) $album[0];
					$sk['privacyArray']     = $this->model_user->getPrivacyOptions();
					if($timeline_id ==$uid){
					//$sk['photos'] = $this->socialkit->SK_getAlbumPhotos($album_id);
					$all_photos=$this->db->query("SELECT a.id as post_id,a.post_privacy, a.post_id as postid,b.id FROM posts AS a
														JOIN  ". constant('DB_MEDIA') ." AS b on a.media_id=b.id
														WHERE b.album_id='".$album_id."' AND b.type='photo' AND a.active ='1'
														ORDER BY a.id DESC  ")->result_array();
						foreach($all_photos as $key=>&$photo){
						    $photo['complete_url'] = $this->module->getImageNow($photo['id'], 320, 's');
						    $sk['photos'][] = $photo;
				        }
					}
					else{
					    redirect('user/albums');  
					}
					$data['sk'] = $sk;
					if($json == true) {
						header('Content-type: text/json');
						header('Content-type: application/json');
						foreach($sk['photos'] as $key=>$photos){
							$sk['photos'][$key]['complete_url']=$this->module->getImageNow($photos['id'],150,'s'); 
						}
						echo json_encode($sk);
					} else {
						$this->load->view('user/album', $data);  
					}
				} else{
					redirect(base_url('login').'?url='.base64_encode(uri_string()));
				}
			} else {
				if($json == true) {
					$error = array(
							'status'=>417,
							'message'=>'Album id not exist'
					);
					header('Content-type: text/json');
					header('Content-type: application/json');
					echo json_encode($error);
				} else {
					redirect('user/albums');  
				} 
			}
		} else {
			if($json == true) {
				$error = array(
						'status'=>417,
						'message'=>'Album is mandatory'
				);
				header('Content-type: text/json');
				header('Content-type: application/json');
				echo json_encode($error);
			} else {
				redirect('user/albums');  
			} 
		}
    }
   
    
    /*
     * LISTS ALL ALBUMS OF A USER
     * @ param  $timeLineId to view a particular users albums
     */
    function albums($timeLineId = false){ 
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $user = null;
        $leftBarSide = array();
        if($timeLineId==false){
            $uid = $this->session->userdata('user_id'); 
            $layoutView = 'user/albums';
            // Login verification and user stats update
            $sk = array();
            $sk['logged'] = false;
            $sk['config'] = $config;
            $cond = "timeline_id='".$uid."'";
        } else {
            $uid = $timeLineId;
            $layoutView = 'user/timelineUserAlbums';
            // Login verification and user stats update
            $userInfo = array();
            $userInfo['logged'] = false;
            $userInfo['config'] = $config;
            $cond = "md5(md5(timeline_id))='".$uid."'";
        }
        
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user'] = $userInfo['user'] = $user;
                $sk['timeline'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = $userInfo['logged'] = true;
                $userInfo['timeline']['wall_user_id'] = $uid;//TIMELINE ID IS USER_ID and is double md5 ed
				 $userInfo['user'] = $user; 
                $leftBarSide = $this->commonTimelineQry($uid);
               $sk['timeline_id'] = $user['id'];
            }
	                           /*(
                                SELECT CONCAT_WS('.', url, extension) photo 
                                    FROM media 
                                        WHERE album_id=m.id AND `type`='photo' AND temp=0 
                                    ORDER BY id DESC LIMIT 1 
                            )*/
	   
            $sqlAlbum = "SELECT id,name,descr,album_id,album_privacy, 
                            (
							SELECT CONCAT_WS('.', b.url, b.extension) photo   FROM posts AS a
														JOIN  ". constant('DB_MEDIA') ." AS b on a.media_id=b.id
														WHERE b.album_id=m.id AND b.type='photo' AND a.active ='1'
														ORDER BY a.id DESC   LIMIT 1     
                            ) photo
                            FROM " . DB_MEDIA . " m
                            WHERE ".$cond." AND `type`='album' AND temp=0 AND active=1";
            $sql_query_one = $this->db->query($sqlAlbum);
            if ($sql_query_one->num_rows >= 1) {
                $albums = $sql_query_one->result_array();
                // pr($albums);die;
				$sk['albums']= (array) $albums; 
            }
            
            $data = array('sk'=>$sk, 'title'=>'List of Albums', 'userInfo'=>$userInfo);
            //pr($data); die;           
            $this->load->view($layoutView, $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
        
    }
    
    function create_album(){
        $sk = array();
        $uid = $this->session->userdata('user_id');
        // Login verification and user stats update
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user'] = $user;
                $sk['timeline'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = true;
            }
            $data['sk'] = $sk;
            //$this->load->view('user/mentors', $data);
            $this->load->view('user/create_album', $data);
            
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
	/****Edit elbum cfunction ***/
	function edit_album($album_id='0'){
        $sk = array();
		
        $uid = $this->session->userdata('user_id');
        // Login verification and user stats update
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
				$sk['album_info'] = $this->db->get_where(DB_MEDIA,array('id'=>$album_id))->result_array();
                $sk['user'] = $user;
                $sk['timeline'] = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged'] = true;
            }
            $data['sk'] = $sk;
		
            //$this->load->view('user/mentors', $data);
            $this->load->view('user/edit_album', $data);
            
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
    
    function profile(){
        $this->account();
    }
	function account(){
		$uid = $this->session->userdata('user_id');
        $sk = array();
        // Login verification and user stats update
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        if ($this->socialkit->SK_isLogged()) {
            $user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user']             = $user;
                $sk['user']['enc_id']   = md5(md5($this->session->userdata('user_id')));
                $sk['timeline']         = $user;
                $sk['timeline']['wall_user_id'] = false;
                $sk['logged']           = true;                       
            }
            $data['sk'] = $sk;
            $data['title'] = 'My Account';
            $this->load->view('user/account', $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
    }
	
	function userBasicInfo(){
		$uid = $this->session->userdata('user_id');
		if ($this->socialkit->SK_isLogged()) {
			$userInfo	= $this->model_user->getUserBasicInfo($uid);
			$userInfo['resume']   = $this->jobs_model->getResume($uid);
			$userInfo['logged']           = true;
			$userInfo['json_city_data'] = json_encode(array('text'=>$userInfo['city_name'],'id'=>$userInfo['current_city']));
			
			$intrests=array();
			foreach(explode(',',$userInfo['interests']) as $key=>$val){
				if($val != ''){
					$intrests[$key]['text']=$val;
					$intrests[$key]['id']=$val;
				}
			}
			$userInfo['json_passion']=json_encode($intrests);
			
			$hobbies=array();
			foreach(explode(',',$userInfo['hobbies']) as $key=>$val){
				if($val != ''){
					$hobbies[$key]['text']=$val;
					$hobbies[$key]['id']=$val;
				}
			}
			$userInfo['json_hobbies']=json_encode($hobbies);	
            $data = $userInfo;
			return $this->output->set_output(json_encode(array('detail'=>$data, 'statusCode'=>'200')));
		}
	}
	
	function userContactInfo(){
		$uid = $this->session->userdata('user_id');
		if ($this->socialkit->SK_isLogged()) {
            $user = $this->model_user->getUserContactInfo($uid);
			$data = array();
            $data = $user;
			return $this->output->set_output(json_encode(array('detail'=>$data, 'statusCode'=>'200')));
		}
	}
	
	function pymk(){
		$uid = $this->session->userdata('user_id');
        $sk = array();
        // Login verification and user stats update
        $sk['logged'] = false;
        $user = null;
        $config['site_url'] = base_url();
        $config['theme_url'] = '';
        $config['script_path'] = str_replace('index.php', '', $_SERVER['PHP_SELF']);
        $config['ajax_path'] = base_url() . 'ajax/socialAjax';
        $sk['config'] = $config;
        if ($this->socialkit->SK_isLogged()) {
			$user = $this->socialkit->SK_getUser($uid, true);
            if (!empty($user['id']) && $user['type'] == "user") {
                $sk['user']             = $user;                     
            }
            $data['sk'] = $sk;
			$data['title'] = 'People You May Know';
            $this->load->view('user/people-you-may-know', $data);
        } else {
            redirect(base_url('login').'?url='.base64_encode(uri_string()));
        }
	}
}
?>