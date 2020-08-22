<?php
namespace backend\controllers;


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 



use Yii;
use app\models\Addresses;
use app\models\Operators;
use app\models\OperatorDevices;
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

class OperatorsapiController extends ActiveController
{
    public $modelClass = 'app\models\Operators';
    public $enableCsrfValidation = false;

    //returs id of Operator if email and password is corrent
    public function actionAuthenticate($email, $password)
    {
      
        $operator = Operators::find()
        ->where(['email' => $email,'password'=> md5(md5($password)) ])
        ->one();

        
        $operator_id = 0;
        if($operator)
        {
            $operator_id = $operator->id;

            if(isset($_POST['device_id']) && !empty($_POST['device_id'])) {
                $device_id = $_POST['device_id'];
                if(!OperatorDevices::find()->where(['operator_id' => $operator_id, 'device_id'=> TRIM($device_id)])->exists()) {
                    $device = new OperatorDevices();
                    $device->operator_id = $operator_id;
                    $device->device_id = $device_id;
                    $device->save();
                }
            }
        }
        echo $operator_id;die;
    }
    
    public function actionOperatorswithdevices()
    {
        $data = array("Success"=> false, "Message" => "No order items found.");
        
        $listOfOperators = Operators::find()
            ->innerJoinWith('OperatorDevices', false)
            ->select('Operators.id, Operators.full_name, Operators.email')
            ->orderBy(['Operators.full_name' => 'ASC'])
            ->all();

        $data = array("Success"=> true, "Data" => $listOfOperators);
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


    protected function findModel($id)
    {
        if (($model = Operators::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }
}