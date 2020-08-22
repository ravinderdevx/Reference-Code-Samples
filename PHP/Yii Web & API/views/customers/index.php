<?php

use yii\helpers\Html;
use yii\helpers\Url;
use yii\grid\GridView;
use yii\widgets\Pjax;
/* @var $this yii\web\View */
/* @var $searchModel app\models\CustomerSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Customers';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="customers-index">

    <h1>
        <?= Html::encode($this->title) ?>
        <?= Html::a('Create Customer', ['create'], ['class' => 'btn btn-success pull-right']) ?>
    </h1>
    <?php Pjax::begin(); ?>    
    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            'id',
            'full_name',
            'email:email',
            'password',
            'phone',

            [
                'class' => 'yii\grid\ActionColumn',
                'template' => '{view} {update} {delete} {viewOrders}',  // the default buttons + your custom button
                'buttons' => [
                    'viewOrders' => function($url, $model, $key) {     // render your custom button
                        $url = Url::to(['order/index', 'customer_id' => $model->id]);
                        return Html::a('<span class="glyphicon glyphicon-list"></span>', $url, [     
                            'data-pjax' => '0',
                            'title' => 'Orders'
                        ]);
                    }
                ]
            ]
        ],
    ]); ?>
    <?php Pjax::end(); ?>
</div>
