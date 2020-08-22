<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[OperatorDevices]].
 *
 * @see OperatorDevices
 */
class OperatorDevicesQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return OperatorDevices[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return OperatorDevices|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
