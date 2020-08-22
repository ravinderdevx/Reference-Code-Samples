<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "payments".
 *
 * @property string $id
 * @property integer $customer_id
 * @property string $vault_id
 * @property string $transaction_id
 * @property string $amount
 * @property string $description
 * @property integer $status
 * @property string $created_at
 */
class Payments extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'payments';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['customer_id', 'vault_id', 'amount', 'description'], 'required'],
            [['customer_id', 'vault_id', 'status'], 'integer'],
            [['amount'], 'number'],
            [['description'], 'string'],
            [['created_at'], 'safe'],
            [['transaction_id'], 'string', 'max' => 50],
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
            'transaction_id' => 'Transaction ID',
            'amount' => 'Amount',
            'description' => 'Description',
            'status' => '0=>Unsuccessful, 1=>Successful',
            'created_at' => 'Created At',
        ];
    }

    /**
     * @inheritdoc
     * @return PaymentsQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new PaymentsQuery(get_called_class());
    }
}
