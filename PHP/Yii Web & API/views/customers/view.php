<?php

use yii\helpers\Html;
use yii\helpers\Url;
use yii\widgets\DetailView;
use yii\grid\GridView;
use yii\widgets\Pjax;

/* @var $this yii\web\View */
/* @var $model app\models\Customers */

$this->title = "Details";
$this->params['breadcrumbs'][] = ['label' => 'Customers', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="customers-view">

    <h1>
        Basic <?= Html::encode($this->title) ?>

        <p class="pull-right">
            <?= Html::a('Update', ['update', 'id' => $model->id], ['class' => 'btn btn-primary']) ?>
            <?= Html::a('Delete', ['delete', 'id' => $model->id], [
                'class' => 'btn btn-danger',
                'data' => [
                    'confirm' => 'Are you sure you want to delete this item?',
                    'method' => 'post',
                ],
            ]) ?>
        </p>
    </h1>


    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            'full_name',
            'email:email',
            'password',
            'phone',
            'sex',
            'facebook_id'
        ],
    ]) ?>

</div>

<div class="addresses-index">

<h1>
    Addresses
    <?= Html::a('Create Address', ['address/create', 'customer_id' => $model->id], ['class' => 'btn btn-success pull-right']) ?>
</h1>

<?php Pjax::begin(); ?>    
<?= GridView::widget([
    'dataProvider' => $addressDataProvider,
    'filterModel' => $addressSearchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],

        'id',
        'street_name',
        'pobox',
        'floor',
        'unit_number',
        'as_default',
        [
            'attribute' => 'City',
            'value'=>'city.title', //relation name with their attribute
        ],

        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{view} {update} {delete}',  // the default buttons + your custom button
            'buttons' => [
                'view' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['address/view', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-eye-open"></span>', $url, [     
                        'data-pjax' => '0',
                        'title' => 'View'
                    ]);
                },
                'update' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['address/update', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-pencil"></span>', $url, [     
                        'data-pjax' => '0',
                        'title' => 'update'
                    ]);
                },
                'delete' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['address/delete', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-trash"></span>', $url, [     
                        'title' => 'Delete'
                    ]);
                }
            ]
        ]
    ],
]); ?>
<?php Pjax::end(); ?>
</div>

<div class="vault-index">

<h1>
    Vaults
</h1>

<?php Pjax::begin(); ?>    
<?= GridView::widget([
    'dataProvider' => $vaultDataProvider,
    'filterModel' => $vaultSearchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],

        'id',
        'name',
        'number',
        'transact',
        'payment_type',
        'expiry_date',
        'expiry_month',
        'expiry_year',

        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{view} {delete}',  // the default buttons + your custom button
            'buttons' => [
                'view' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['vault/view', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-eye-open"></span>', $url, [     
                        'data-pjax' => '0',
                        'title' => 'View'
                    ]);
                },
                'delete' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['vault/delete', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-trash"></span>', $url, [     
                        'title' => 'Delete'
                    ]);
                }
            ]
        ]
    ],
]); ?>
<?php Pjax::end(); ?>
</div>


<h1>
    Payments
</h1>

<?php Pjax::begin(); ?>    
<?= GridView::widget([
    'dataProvider' => $paymentDataProvider,
    'filterModel' => $paymentSearchModel,
    'columns' => [
        ['class' => 'yii\grid\SerialColumn'],

        'id',
        'customer_id',
        'vault_id',
        'transaction_id',
        'amount',
        'created_at',

        [
            'class' => 'yii\grid\ActionColumn',
            'template' => '{view} {delete}',  // the default buttons + your custom button
            'buttons' => [
                'view' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['payment/view', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-eye-open"></span>', $url, [     
                        'data-pjax' => '0',
                        'title' => 'View'
                    ]);
                },
                'delete' => function($url, $model, $key) {     // render your custom button
                    $url = Url::to(['payment/delete', 'id' => $model->id]);
                    return Html::a('<span class="glyphicon glyphicon-trash"></span>', $url, [     
                        'title' => 'Delete'
                    ]);
                }
            ]
        ]
    ],
]); ?>
<?php Pjax::end(); ?>
</div>