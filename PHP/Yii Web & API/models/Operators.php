<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "operators".
 *
 * @property string $id
 * @property string $full_name
 * @property string $email
 * @property string $password
 * @property string $phone
 * @property integer $sex
 * @property string $created_at
 */
class Operators extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'operators';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['sex'], 'integer'],
            [['created_at'], 'safe'],
            [['full_name', 'password', 'phone'], 'string', 'max' => 50],
            [['email'], 'string', 'max' => 100],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'full_name' => 'Full Name',
            'email' => 'Email',
            'password' => 'Password',
            'phone' => 'Phone',
            'sex' => '0=>Male, 1 => Female',
            'created_at' => 'Created At',
        ];
    }

    /**
     * @inheritdoc
     * @return OperatorsQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new OperatorsQuery(get_called_class());
    }

    public function extraFields() 
    {
        return [
            'operatorDevices'=>function($model) {
                return $model->operatorDevices;
            }
        ];
    }

    public function getOperatorDevices()
    {
        return $this->hasMany(OperatorDevices::className(), ['operator_id' => 'id']);
    }
}
