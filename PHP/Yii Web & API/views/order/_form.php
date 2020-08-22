<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Orders */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="orders-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'customer_id')->textInput() ?>

    <?= $form->field($model, 'vault_id')->textInput(['maxlength' => true]) ?>
    
    <?= $form->field($model, 'payment_id')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'status')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'pickup_date')->textInput() ?>

    <?= $form->field($model, 'pickup_at_door')->textInput() ?>

    <?= $form->field($model, 'pickup_time_from')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'pickup_time_to')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'pickup_type')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'pickup_price')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'drop_date')->textInput() ?>

    <?= $form->field($model, 'drop_at_door')->textInput() ?>

    <?= $form->field($model, 'drop_time_from')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'drop_time_to')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'drop_type')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'drop_price')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'address_id')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'same_day_pickup')->textInput() ?>

    <?= $form->field($model, 'next_day_drop')->textInput() ?>

    <?= $form->field($model, 'comments')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
