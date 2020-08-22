<?php

namespace app\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\Orders;

/**
 * OrdersSearch represents the model behind the search form about `app\models\Orders`.
 */
class OrdersSearch extends Orders
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'customer_id', 'payment_id', 'status', 'pickup_at_door', 'pickup_time_from', 'pickup_time_to', 'pickup_type', 'drop_at_door', 'drop_time_from', 'drop_time_to', 'drop_type', 'address_id', 'same_day_pickup', 'next_day_drop', 'is_completed'], 'integer'],
            [['pickup_date', 'drop_date', 'comments'], 'safe'],
            [['pickup_price', 'drop_price'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = Orders::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'payment_id' => $this->payment_id,
            'status' => $this->status,
            'pickup_date' => $this->pickup_date,
            'pickup_at_door' => $this->pickup_at_door,
            'pickup_time_from' => $this->pickup_time_from,
            'pickup_time_to' => $this->pickup_time_to,
            'pickup_type' => $this->pickup_type,
            'pickup_price' => $this->pickup_price,
            'drop_date' => $this->drop_date,
            'drop_at_door' => $this->drop_at_door,
            'drop_time_from' => $this->drop_time_from,
            'drop_time_to' => $this->drop_time_to,
            'drop_type' => $this->drop_type,
            'drop_price' => $this->drop_price,
            'address_id' => $this->address_id,
            'same_day_pickup' => $this->same_day_pickup,
            'next_day_drop' => $this->next_day_drop,
            'is_completed'  => $this->is_completed,
        ]);
        $query->joinWith(['customer']);
        $query->andFilterWhere(['like', 'customer.name', $this->customer_id]);
        $query->andFilterWhere(['like', 'comments', $this->comments]);

        return $dataProvider;
    }
}
