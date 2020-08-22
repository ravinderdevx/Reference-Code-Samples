<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[CustomerDevices]].
 *
 * @see CustomerDevices
 */
class CustomerDevicesQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return CustomerDevices[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return CustomerDevices|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
