<?php
namespace backend\controllers;

header("Access-Control-Allow-Origin: *");

use Yii;
use app\models\Orders;
use app\models\OrdersSearch;
use app\models\Tasks;
use app\models\Operators;
use app\models\OperatorDevices;
use yii\rest\ActiveController;
use backend\assets\components\FirebaseHelper;
// to enable cors

class OrdersapiController extends ActiveController
{
    public $modelClass = 'app\models\Orders';
    public $enableCsrfValidation = false;

    public function actionTest()
    {
        echo 123;
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
            '*', // star allows all domains
            // 'http://test1.example.com',
            // 'http://test2.example.com',
        ];
    }

/**
 * @inheritdoc
 */
    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // remove authentication filter
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);

        // add CORS filter
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::className(),
        ];

        // re-add authentication filter
        $behaviors['authenticator'] = $auth;
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors['authenticator']['except'] = ['options'];

        return $behaviors;
    }

    public function actionCreateorder()
    {
        try
        {
            $response = array("Success" => false, "Message" => "Invalid request.");
            $data = Yii::$app->request->post();
            
            if (Yii::$app->request->isPost) {
                $update_mode = false;
                $is_completed = isset($data['is_completed']) && $data['is_completed'] == true? true: false;

                if(isset($data['id']) && $data['id'] > 0) {
                    $model = $this->findModel($data['id']);
                    $update_mode = true;
                } else {
                    $model = new Orders();
                }

                $data = Yii::$app->request->post();

                $model->customer_id = $data['customer_id'];
                $model->status = isset($data['status'])? $data['status']: 0;
                $model->pickup_date = $data['pickup_date'];
                $model->pickup_at_door = $data['pickup_at_door'];
                $model->pickup_time_from = $data['pickup_time_from'];
                $model->pickup_time_to = $data['pickup_time_to'];
                $model->pickup_type = $data['pickup_type'];
                $model->pickup_price = $data['pickup_price'];
                $model->address_id = $data['address_id'];
                $model->same_day_pickup = $data['same_day_pickup'];
                $model->vault_id = isset($data['vault_id'])? $data['vault_id']: null;
                $model->drop_date = isset($data['drop_date'])? $data['drop_date']: null;
                $model->drop_at_door = isset($data['drop_at_door'])? $data['drop_at_door']: null;
                $model->drop_time_from = isset($data['drop_time_from'])? $data['drop_time_from']: null;
                $model->drop_time_to = isset($data['drop_time_to'])? $data['drop_time_to']: null;
                $model->drop_type = isset($data['drop_type'])? $data['drop_type']: null;
                $model->drop_price = isset($data['drop_price'])? $data['drop_price']: null;
                $model->next_day_drop = isset($data['next_day_drop'])? $data['next_day_drop']: null;
                $model->comments = isset($data['comments'])? $data['comments']: null;
                $model->is_completed = $is_completed;

                if ($model->save(false)) {
                    if($is_completed == true) {
                        $pickup_task = new Tasks();
                        $pickup_task->order_id = $model->id;
                        $pickup_task->type = 1;
                        $pickup_task->status = 0;
                        $pickup_task->at = date('Y-m-d H:i:s');
                        $pickup_task->save();

                        $drop_task = new Tasks();
                        $drop_task->order_id = $model->id;
                        $drop_task->type = 2;
                        $drop_task->status = 0;
                        $drop_task->at = date('Y-m-d H:i:s');
                        $drop_task->save();

                        if($model->pickup_date == date('Y-m-d')) {
                            // Send Notifications
                            
                            $notification_data = [
                                "title" => "Pickup order created today",
                                "body" => "Pickup order created today"
                            ];

                            $this->sendNotificationToOperator($notification_data);
                            
                        }

                        $response = array("Success" => true, "Message" => "Order created successfully", "data"=> $model);
                    } else {
                        $response = array("Success" => true, "Message" => "Order saved successfully", "data"=> $model);
                    }
                } else {
                    $response = array("Success" => false, "Message" => "Error while creating order");
                }
            }
        } 
        catch(Exception $exception) {
            $response = array("Success" => false, "Message" => $exception->message);
        }

        return $response;
    }

    
    private function sendNotificationToOperator($notification_data)
    {
        
        $d_ids = Operators::find()
                            ->innerJoinWith('operatorDevices', false)
                            ->select('DISTINCT GROUP_CONCAT(operator_devices.device_id) as device_ids')
                            ->asArray()
                            ->one();

        $device_ids = [];
        
        if(isset($d_ids['device_ids']) && !empty($d_ids['device_ids']))
            $device_ids = explode(',',$d_ids['device_ids']);

        if(COUNT($device_ids) > 0) {
            $result = array();
            $result = FirebaseHelper::sendPushNotification($device_ids, $notification_data);

        } 
        
    }

    protected function findModel($id)
    {
        if (($model = Orders::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

}
