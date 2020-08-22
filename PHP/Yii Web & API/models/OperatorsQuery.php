<?php

namespace app\models;

/**
 * This is the ActiveQuery class for [[Operators]].
 *
 * @see Operators
 */
class OperatorsQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * @inheritdoc
     * @return Operators[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Operators|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
