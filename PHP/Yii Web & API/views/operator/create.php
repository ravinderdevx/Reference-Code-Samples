<?php

use yii\helpers\Html;


/* @var $this yii\web\View */
/* @var $model app\models\Operators */

$this->title = 'Create Operators';
$this->params['breadcrumbs'][] = ['label' => 'Operators', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="operators-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
