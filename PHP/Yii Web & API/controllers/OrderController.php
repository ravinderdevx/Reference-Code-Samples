<?php

namespace backend\controllers;

use Yii;
use app\models\Orders;
use app\models\OrdersSearch;
use app\models\OrderItemsSearch;
use app\models\Tasks;
use app\models\Payments;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * OrderController implements the CRUD actions for Orders model.
 */
class OrderController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    /**
     * Lists all Orders models.
     * @return mixed
     */
    public function actionIndex()
    {
        $searchModel = new OrdersSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);

        $get_data = Yii::$app->request->get();
        if(isset($get_data['customer_id']) && $get_data['customer_id'] > 0) {
            $dataProvider->query->andFilterWhere(['customer_id'=> $get_data['customer_id']]); 
        }

        return $this->render('index', [
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single Orders model.
     * @param string $id
     * @return mixed
     */
    public function actionView($id)
    {
     
        $searchModel = new OrderItemsSearch();
        $dataProvider = $searchModel->search(Yii::$app->request->queryParams);
        $dataProvider->query->andFilterWhere(['order_id'=> $id]); 

        return $this->render('view', [
            'model' => $this->findModel($id),
            'searchModel' => $searchModel,
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Creates a new Orders model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Orders();

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('create', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Updates an existing Orders model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param string $id
     * @return mixed
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        } else {
            return $this->render('update', [
                'model' => $model,
            ]);
        }
    }

    /**
     * Deletes an existing Orders model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param string $id
     * @return mixed
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the Orders model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param string $id
     * @return Orders the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Orders::findOne($id)) !== null) {
            return $model;
        } else {
            throw new NotFoundHttpException('The requested page does not exist.');
        }
    }

    public function actionPaymentcallback() 
    {
        if(!empty($_GET))
        {
            if(isset($_GET["reason"]) && $_GET["reason"] > 0) {
                // Error
                return $this->render('payment_error');
            } else {
                $model = $this->findModel($_GET["orderid"]);

                $payment = new Payments();
                $payment->customer_id = $model->customer_id;
                $payment->vault_id = $model->vault_id;
                $payment->transaction_id = isset($_GET["transact"])?$_GET["transact"]:null;
                $payment->amount = isset($_GET["amount"])?$_GET["amount"]:null;
                $payment->description = isset($_GET["ordertext"])?$_GET["ordertext"]:null;
                $payment->status = 1;
                $payment->save();

                $task = Tasks::find()->Where(array("order_id" => $model->id, "type" => 2))->one();
                $task->status = 1;
                $task->save();

                
                $model->status = 2;
                $model->payment_id = $payment->id;
                $model->save();
                
                return $this->render('payment_success');
            }
        }
    }
}
