<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "operator_devices".
 *
 * @property string $id
 * @property integer $operator_id
 * @property string $device_id
 * @property integer $active
 * @property string $created_at
 */
class OperatorDevices extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'operator_devices';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['operator_id', 'device_id'], 'required'],
            [['operator_id', 'active'], 'integer'],
            [['created_at'], 'safe'],
            [['device_id'], 'string', 'max' => 200],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'operator_id' => 'Operator ID',
            'device_id' => 'Device ID',
            'active' => 'Active',
            'created_at' => 'Created At',
        ];
    }

    /**
     * @inheritdoc
     * @return OperatorDevicesQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new OperatorDevicesQuery(get_called_class());
    }

    public function getOperator()
    {
        return $this->hasOne(Operator::className(), ['id' => 'operator_id']);
    }
}
