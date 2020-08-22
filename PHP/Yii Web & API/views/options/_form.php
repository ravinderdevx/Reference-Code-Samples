<?php

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model app\models\Options */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="options-form">

    <?php $form = ActiveForm::begin(); ?>

    <?= $form->field($model, 'holidays')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'weekend')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'same_day_pickup_price')->textInput(['maxlength' => true]) ?>

    <?= $form->field($model, 'next_day_delivery_price')->textInput(['maxlength' => true]) ?>

    <div class="form-group">
        <?= Html::submitButton($model->isNewRecord ? 'Create' : 'Update', ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    </div>

    <?php ActiveForm::end(); ?>

</div>
