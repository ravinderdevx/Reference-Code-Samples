<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "orders".
 *
 * @property string $id
 * @property integer $customer_id
 * @property string $payment_id
 * @property string $status
 * @property string $pickup_date
 * @property integer $pickup_at_door
 * @property string $pickup_time_from
 * @property string $pickup_time_to
 * @property string $pickup_type
 * @property string $pickup_price
 * @property string $drop_date
 * @property integer $drop_at_door
 * @property string $drop_time_from
 * @property string $drop_time_to
 * @property string $drop_type
 * @property string $drop_price
 * @property string $address_id
 * @property integer $same_day_pickup
 * @property integer $next_day_drop
 * @property string $comments
 */
class Orders extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'orders';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['customer_id', 'pickup_date', 'pickup_time_from', 'pickup_time_to', 'pickup_type', 'pickup_price', 'drop_date', 'drop_time_from', 'drop_time_to', 'drop_type', 'drop_price', 'address_id', 'same_day_pickup', 'next_day_drop'], 'required'],
            [['customer_id', 'vault_id', 'payment_id', 'status', 'pickup_at_door', 'pickup_time_from', 'pickup_time_to', 'pickup_type', 'drop_at_door', 'drop_time_from', 'drop_time_to', 'drop_type', 'address_id', 'same_day_pickup', 'next_day_drop', 'pickup_close_id', 'pickup_close_other_id','is_completed'], 'integer'],
            [['pickup_date', 'drop_date'], 'safe'],
            [['pickup_price', 'drop_price'], 'number'],
            [['comments', 'pickup_close_comments'], 'string', 'max' => 1000],
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
            'vault_id' => 'Vault ID',
            'payment_id' => 'Payment ID',
            'status' => 'Status',
            'pickup_date' => 'Pickup Date',
            'pickup_at_door' => 'Pickup At Door',
            'pickup_time_from' => 'Pickup Time From',
            'pickup_time_to' => 'Pickup Time To',
            'pickup_type' => 'Pickup Type',
            'pickup_price' => 'Pickup Price',
            'drop_date' => 'Drop Date',
            'drop_at_door' => 'Drop At Door',
            'drop_time_from' => 'Drop Time From',
            'drop_time_to' => 'Drop Time To',
            'drop_type' => 'Drop Type',
            'drop_price' => 'Drop Price',
            'address_id' => 'Address ID',
            'same_day_pickup' => 'Same Day Pickup',
            'next_day_drop' => 'Next Day Drop',
            'comments' => 'Comments',
            'is_completed' => 'Is Completed'
        ];
    }

    /**
     * @inheritdoc
     * @return OrdersQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new OrdersQuery(get_called_class());
    }

    public function extraFields() 
    {
        return [
            'address'=>function($model){
                return $model->address;
            },
            'customer'=>function($model){
                return $model->customer;
            },
            'vault'=>function($model){
                return $model->vault;
            },
            'tasks'=>function($model){
                return $model->tasks;
            },
            'items'=>function($model){
                return $model->items;
            },
            'payments'=>function($model){
                return $model->payments;
            },
        ];
    }

    public function getCustomer()
    {
        return $this->hasOne(Customers::className(), ['id' => 'customer_id']);
    }

    public function getAddress()
    {
        return $this->hasOne(Addresses::className(), ['id' => 'address_id']);
    }

    public function getVault()
    {
        return $this->hasOne(Vault::className(), ['id' => 'vault_id']);
    }

    public function getTasks()
    {
        return $this->hasMany(Tasks::className(), ['order_id' => 'id']);
    }

    public function getItems()
    {
        return $this->hasMany(OrderItems::className(), ['order_id' => 'id']);
    }

    public function getPayments()
    {
        return $this->hasOne(Payments::className(), ['id' => 'payment_id']);
    }
}
