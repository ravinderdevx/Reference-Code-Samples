<?php

use yii\helpers\Url;
use yii\helpers\Html;
use yii\grid\GridView;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $searchModel app\models\OrdersSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Orders';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="orders-index">

    <h1><?= Html::encode($this->title) ?>
        <?= Html::a('Create Orders', ['create'], ['class' => 'btn btn-success pull-right']) ?>
    </h1>
    <?php Pjax::begin(); ?>    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            [
                'header' => 'Customer ID',
                'format' => 'raw',
                'value'=> function ($model, $key, $index, $grid) {
                    $url = Url::to(['customers/view', 'id' => $model->customer_id]);
                    return Html::a($model->customer_id, $url, [     
                        'data-pjax' => '0'
                    ]);
                }
            ],
            [
                'header' => 'Full Name',
                'format' => 'raw',
                'value'=> function ($model, $key, $index, $grid) {
                    $url = Url::to(['customers/view', 'id' => $model->customer_id]);
                    return Html::a($model->customer->full_name, $url, [     
                        'data-pjax' => '0'
                    ]);
                }
            ],
            [
                'header' => 'Vault ID',
                'format' => 'raw',
                'value'=> function ($model, $key, $index, $grid) {
                    $url = Url::to(['vault/view', 'id' => $model->vault_id]);
                    return Html::a($model->vault_id, $url, [     
                        'data-pjax' => '0'
                    ]);
                }
            ],
            [
                'header' => 'Payment ID',
                'format' => 'raw',
                'value'=> function ($model, $key, $index, $grid) {
                    $url = Url::to(['payment/view', 'id' => $model->payment_id]);
                    return Html::a($model->payment_id, $url, [     
                        'data-pjax' => '0'
                    ]);
                }
            ],
            [
                'header' => 'Address ID',
                'format' => 'raw',
                'value'=> function ($model, $key, $index, $grid) {
                    $url = Url::to(['address/view', 'id' => $model->address_id]);
                    return Html::a($model->address_id, $url, [     
                        'data-pjax' => '0'
                    ]);
                }
            ],
            'status',
            'pickup_date',
            'pickup_at_door',
            'pickup_time_from',
            'pickup_time_to',
            'pickup_type',
            'pickup_price',
            'drop_date',
            'drop_at_door',
            'drop_time_from',
            'drop_time_to',
            'drop_type',
            'drop_price',
            'same_day_pickup',
            'next_day_drop',
            'comments',
            'is_completed',
            [
                'class' => 'yii\grid\ActionColumn',
                'template' => '{view} {update} {delete} {viewTasks}',  // the default buttons + your custom button
                'buttons' => [
                    'viewTasks' => function($url, $model, $key) {     // render your custom button
                        $url = Url::to(['task/index', 'order_id' => $model->id]);
                        return Html::a('<span class="glyphicon glyphicon-list"></span>', $url, [     
                            'data-pjax' => '0',
                            'title' => 'Tasks'
                        ]);
                    }
                ]
            ]
        ],
    ]); ?>
<?php Pjax::end(); ?></div>
