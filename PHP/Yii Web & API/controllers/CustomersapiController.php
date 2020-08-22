<?php
namespace backend\controllers;


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 



use Yii;
use app\models\Addresses;
use app\models\Customers;
use app\models\CustomerSearch;
use app\models\CustomerDevices;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\rest\ActiveController;
use yii\filters\auth\HttpBasicAuth; // to enable cors
use yii\filters\AccessControl;
use common\models\LoginForm;
use yii\web\Response;
use yii\helpers\ArrayHelper;
use yii\helpers\Url;
use backend\assets\components\GeneralHelper;
use backend\assets\components\FirebaseHelper;

class CustomersapiController extends ActiveController
{
    public $modelClass = 'app\models\Customers';
    public $enableCsrfValidation = false;

    //returs id of customer if email and password is corrent
    public function actionAuthenticate($email, $password)
    {
      
        $customer = Customers::find()
        ->where(['email' => $email,'password'=> $password ])
        ->one();

        
        $customer_id = 0;
        if($customer)
        {
            $customer_id = $customer->id;

            if(isset($_POST['device_id']) && !empty($_POST['device_id'])) {
                $device_id = $_POST['device_id'];
                if(!CustomerDevices::find()->where(['customer_id' => $customer_id, 'device_id'=> TRIM($device_id)])->exists()) {
                    $device = new CustomerDevices();
                    $device->customer_id = $customer_id;
                    $device->device_id = $device_id;
                    $device->save();
                }
            }
        }
        echo $customer_id;die;
    }


    public function actionFb_login_register()
    {
        $response = array("Success" => false, "Message" => "Invalid request.");
        $data = Yii::$app->request->post();
        if (Yii::$app->request->isPost && isset($data['facebook_id']) && !empty($data['facebook_id'])) {
            $customer = Customers::find()
                ->where(['email' => $data['email'], 'facebook_id'=> $data['facebook_id'] ])
                ->one();

            if($customer) {
                $response = array("Success"=> true, "Data" => $customer);
            } else {
                $newCustomer = new Customer();
                $newCustomer->full_name = $data['full_name'];
                $newCustomer->email = $data['email'];
                $newCustomer->facebook_id = $data['facebook_id'];
                $newCustomer->sex = $data['sex'];

                if($newCustomer->save()) {
                    $response = array("Success"=> true, "Data" => $newCustomer);
                } else {
                    $response = array("Success"=> false, "Message" => "Error while registering from Facebook!!!");
                }
            }
        }
        return $response;
    }

    public function actionCustomerswithdevices()
    {
        $data = array("Success"=> false, "Message" => "No order items found.");
        
        $listOfCustomers = Customers::find()
            ->innerJoinWith('customerDevices', false)
            ->select('customers.id, customers.full_name, customers.email')
            ->orderBy(['customers.full_name' => 'ASC'])
            ->all();

        $data = array("Success"=> true, "Data" => $listOfCustomers);
        return $data;
    }


    /**
     * List of allowed domains.
     * Note: Restriction works only for AJAX (using CORS, is not secure).
     *
     * @return array List of domains, that can access to this API
     */
    public static function allowedDomains()
    {
        return [
            '*',                        // star allows all domains
            // 'http://test1.example.com',
            // 'http://test2.example.com',
        ];
    }

    protected function verbs()
    {
        return [
            'index' => ['GET', 'HEAD'],
            'view' => ['GET', 'HEAD'],
            'create' => ['PUT', 'POST','OPTIONS'],
            'update' => ['PUT', 'PATCH','OPTIONS'],
            'delete' => ['DELETE'],
        ];
    }

    public function actionAdduserinfo() {
        try 
        {
            $response = array("Success"=> false, "Message" => "Invalid request.");

            $data = Yii::$app->request->post();
            if (Yii::$app->request->isPost && !empty($data)) {
                if(isset($data['id']) && $data['id'] > 0) {
                    $model = $this->findModel($data['id']);
                } else {
                    $model = new Customers();
                }

                $model->full_name = $data['full_name'];
                $model->phone = $data['phone'];
                
                if($model->save()) {
                    if(isset($data['address_id']) && $data['address_id'] > 0) {
                        $addressModel = $this->findAddressModel($data['address_id']);
                    } else {
                        $addressModel = new Addresses();
                    }

                    $addressModel->customer_id = $model->id;
                    $addressModel->city_id = $data['city_id'];

                    $addressModel->save();

                    $data['id'] = $model->id;
                    $data['address_id'] = $addressModel->id;

                    $response = array("Success"=> true, "Message" => "User information saved successfully.", "Data" => $data);
                } else {
                    $response = array("Success"=> false, "Message" => "Error while saving record.");
                }
            }
        } catch(Exception $ex) {
            $response = array("Success"=> false, "Message" => $ex->message);
        }

        return $response;
    } 

    public function actionForgotpassword()
	{
        $response = array("Success"=> false, "Message" => "Invalid request.");

        $data = Yii::$app->request->post();
        if (Yii::$app->request->isPost && isset($data['email']) && !empty($data['email'])) {
            $getEmail = $data['email'];
            $getModel = Customers::find()->where(['email'=>$getEmail])->one();
            
            if($getModel)
            {
                $getToken = rand(0, 99999);
                $getTime = date("H:i:s");

                $salt = GeneralHelper::generateSalt();

                $getModel->token = md5($salt.$getToken.$getTime);
                $getModel->save();

                // Send Email
                $subject="Reset Password";

                $mail_content="You have successfully reset your password<br/>
                    <a href='". Url::base(true).'/auth/reset?token='.$getModel->token."'>Click Here to Reset Password</a>";

                $headers = "Content-Type: text/html; charset=UTF-8\r\n";
            
                mail($getEmail, $subject, $mail_content, $headers);
                
                // Yii::$app->mailer->compose()
                // ->setFrom([Yii::$app->params['supportEmail'] => 'Eazywash'])
                // ->setTo($getEmail)
                // ->setSubject($subject)
                // ->setHtmlBody($mail_content)
                // ->send();
    
                $response = array("Success"=> true, "Message" => "Reset password link is sent to email.");
            } else {
                $response = array("Success"=> false, "Message" => "No details found");
            } 

        }
        return $response;
    }


    public function actionChangepassword($customer_id)
	{
        $response = array("Success"=> false, "Message" => "Invalid request.");

        $data = Yii::$app->request->post();
        
        if (!Yii::$app->request->isPost) {
            return $response;
        }

        if(!isset($data['old_password']) || empty($data['old_password'])) {
            $response = array("Success"=> false, "Message" => "Please enter old passowrd.");
            return $response;
        }

        $old_password = $data['old_password'];

        if(!isset($data['new_password']) || empty($data['new_password'])) {
            $response = array("Success"=> false, "Message" => "Please enter new passowrd.");
            return $response;
        }

        $new_password = $data['new_password'];

        if(!isset($data['cpassword']) || empty($data['cpassword'])) {
            $response = array("Success"=> false, "Message" => "Please enter confirm passowrd.");
            return $response;
        }

        if($data['new_password'] != $data['cpassword']) {
            $response = array("Success"=> false, "Message" => "Password and confirm password does not match.");
            return $response;
        }

        $model = $this->findModel($customer_id);
        
        
        if($model->password != $old_password) {
            $response = array("Success"=> false, "Message" => "Entered old password is incorrect.");
            return $response;
        }

        if($model->password == $new_password) {
            $response = array("Success"=> false, "Message" => "New password is same as old passoword.");
            return $response;
        }
        
        $model->password = $new_password;
        $model->save();
       
        $response = array("Success"=> true, "Message" => "Password changed successfully");
        return $response;
    }

    public function actionResetpassword()
	{
        $response = array("Success"=> false, "Message" => "Invalid request.");

        $data = Yii::$app->request->post();
        
        if (!Yii::$app->request->isPost || (!isset($data['token']) || empty($data['token']))) {
            return $response;
        }


        if(!isset($data['password']) || empty($data['password'])) {
            $response = array("Success"=> false, "Message" => "Please enter passowrd.");
            return $response;
        }

        if(!isset($data['cpassword']) || empty($data['cpassword'])) {
            $response = array("Success"=> false, "Message" => "Please enter confirm passowrd.");
            return $response;
        }

        if($data['password'] != $data['cpassword']) {
            $response = array("Success"=> false, "Message" => "Password and confirm password does not match.");
            return $response;
        }

        $token = $data['token'];
        $password = $data['password'];

        $model = Customers::find()->where(['token'=>$token])->one();

        if($model === null) {
            $response = array("Success"=> false, "Message" => "Token is invalid");
            return $response;
        }

        $model->token=null;
        $model->password=$password;
        $model->save();
       
        $response = array("Success"=> true, "Message" => "Password reset successfully");
        return $response;
    }

   

    public function actionSendnotification()
    {
        $data = array("Success"=> false, "Message" => "Invalid request method.");

        if ( Yii::$app->request->isPost) {
            $data = Yii::$app->request->post();

            if(isset($data['sent_to']) && $data['sent_to'] == "all") {
                $d_ids = Customers::find()
                ->innerJoinWith('customerDevices', false)
                ->select('GROUP_CONCAT(DISTINCT customer_devices.device_id) as device_ids')
                ->asArray()
                ->one();
            } else {
                
                if(isset($data['user_id']) && $data['user_id'] > 0) {
                    $user_id = $data['user_id'];

                    $d_ids = Customers::find()
                            ->innerJoinWith('customerDevices', false)
                            ->select('DISTINCT GROUP_CONCAT(customer_devices.device_id) as device_ids')
                            ->where (['customers.id' => $user_id])
                            ->asArray()
                            ->one();
                } else {
                    $data = array("Success"=> false, "Message" => "User id not found.");
                    return $data;
                }
            }

            $device_ids = [];
            
            if(isset($d_ids['device_ids']) && !empty($d_ids['device_ids']))
                $device_ids = explode(',',$d_ids['device_ids']);

            if(COUNT($device_ids) == 0) {
                $data = array("Success"=> false, "Message" => "No devices ids found.");
                return $data;
            } 

            $notification_data = [
                "title" => $data['title'],
                "body" => $data['message']
            ];


            $result = array();
            $result = FirebaseHelper::sendPushNotification($device_ids, $notification_data);
            return $result;
        }

        return $data;
    }


    protected function findModel($id)
    {
        if (($model = Customers::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    protected function findAddressModel($id)
    {
        if (($model = Addresses::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

}