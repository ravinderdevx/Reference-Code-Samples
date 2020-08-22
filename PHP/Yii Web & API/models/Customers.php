<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "customers".
 *
 * @property string $id
 * @property string $full_name
 * @property string $email
 * @property string $facebook_id
 * @property string $password
 * @property string $phone
 * @property integer $sex
 * @property string $api_token
 */
class Customers extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'customers';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['facebook_id', 'sex'], 'integer'],
            [['full_name', 'password', 'phone'], 'string', 'max' => 50],
            [['email'], 'unique',
                'targetAttribute' => ['email'], 
                'targetClass' => Customers::className(),
                'filter' => function ($query) {
                    if (Yii::$app->request->get('id') > 0) {
                        $query->andWhere(['not', ['id'=>Yii::$app->request->get('id')]]);
                    }
                }
            ],
            [['email'], 'string', 'max' => 100],
            [['token'], 'string', 'max' => 1000],
        ];
    }

    public static function getOldEmail($id)
    {
        
        return Customers::findOne($id)->email;
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
            'facebook_id' => 'Facebook ID',
            'password' => 'Password',
            'phone' => 'Phone',
            'sex' => 'Sex',
            'token' => 'token for reset',
        ];
    }

    /**
     * @inheritdoc
     * @return CustomersQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new CustomersQuery(get_called_class());
    }

    public function getAddresses()
    {
        return $this->hasMany(Addresses::className(), ['customer_id' => 'id']);
    }


    public function extraFields() 
    {
        return [
            'addresses'=>function($model){
                return $model->addresses;
            },
            'payments'=>function($model){
                return $model->payments;
            },
            'orders'=>function($model){
                return $model->orders;
            },
            'vault'=>function($model){
                return $model->vault;
            },
            'customerDevices'=>function($model) {
                return $model->customerDevices;
            }
        ];
    }

    public function getPayments()
    {
        return $this->hasMany(Payments::className(), ['customer_id' => 'id']);
    }

    public function getOrders()
    {
        return $this->hasMany(Orders::className(), ['customer_id' => 'id']);
    }

    public function getVault()
    {
        return $this->hasMany(Vault::className(), ['customer_id' => 'id']);
    }
    
    public function getCustomerDevices()
    {
        return $this->hasMany(CustomerDevices::className(), ['customer_id' => 'id']);
    }

}
