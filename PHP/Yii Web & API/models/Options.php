<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "options".
 *
 * @property string $id
 * @property string $holidays
 * @property string $weekend
 * @property string $same_day_pickup_price
 * @property string $next_day_delivery_price
 */
class Options extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'options';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['holidays', 'weekend'], 'required'],
            [['same_day_pickup_price', 'next_day_delivery_price'], 'double'],
            [['holidays'], 'string', 'max' => 1000],
            [['weekend'], 'string', 'max' => 10],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'holidays' => 'Holidays',
            'weekend' => 'Weekend',
            'same_day_pickup_price' => 'Same Day Pickup Price',
            'next_day_delivery_price' => 'Next Day Delivery Price',
        ];
    }

    /**
     * @inheritdoc
     * @return OptionsQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new OptionsQuery(get_called_class());
    }
}
