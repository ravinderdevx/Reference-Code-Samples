<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "customer_devices".
 *
 * @property string $id
 * @property integer $customer_id
 * @property string $device_id
 * @property integer $active
 * @property string $created_at
 */
class CustomerDevices extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'customer_devices';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['customer_id', 'device_id'], 'required'],
            [['customer_id', 'active'], 'integer'],
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
            'customer_id' => 'Customer ID',
            'device_id' => 'Device ID',
            'active' => 'Active',
            'created_at' => 'Created At',
        ];
    }

    /**
     * @inheritdoc
     * @return CustomerDevicesQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new CustomerDevicesQuery(get_called_class());
    }

    public function getCustomer()
    {
        return $this->hasOne(Customer::className(), ['id' => 'customer_id']);
    }
}
