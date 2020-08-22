<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\OrdersSearch */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="orders-search">

    <?php $form = ActiveForm::begin([
        'action' => ['index'],
        'method' => 'get',
    ]); ?>

    <?= $form->field($model, 'id') ?>

    <?= $form->field($model, 'customer_id') ?>

    <?= $form->field($model, 'payment_id') ?>

    <?= $form->field($model, 'status') ?>

    <?= $form->field($model, 'pickup_date') ?>

    <?php // echo $form->field($model, 'pickup_at_door') ?>

    <?php // echo $form->field($model, 'pickup_time_from') ?>

    <?php // echo $form->field($model, 'pickup_time_to') ?>

    <?php // echo $form->field($model, 'pickup_type') ?>

    <?php // echo $form->field($model, 'pickup_price') ?>

    <?php // echo $form->field($model, 'drop_date') ?>

    <?php // echo $form->field($model, 'drop_at_door') ?>

    <?php // echo $form->field($model, 'drop_time_from') ?>

    <?php // echo $form->field($model, 'drop_time_to') ?>

    <?php // echo $form->field($model, 'drop_type') ?>

    <?php // echo $form->field($model, 'drop_price') ?>

    <?php // echo $form->field($model, 'address_id') ?>

    <?php // echo $form->field($model, 'same_day_pickup') ?>

    <?php // echo $form->field($model, 'next_day_drop') ?>

    <?php // echo $form->field($model, 'comments') ?>

    <div class="form-group">
        <?= Html::submitButton('Search', ['class' => 'btn btn-primary']) ?>
        <?= Html::resetButton('Reset', ['class' => 'btn btn-default']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
