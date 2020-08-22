<?php

namespace App\Models;

use App\Models\BaseModel;

/**
 * @property int $ProductID
 * @property string $ProductType
 * @property string $ProductCategory
 * @property string $UPC
 * @property string $Name
 * @property string $Description
 * @property string $Keywords
 * @property float $Price
 * @property int $isISAAllowed
 * @property float $CommissionPercent
 * @property float $Cost
 * @property boolean $PriceIncludesTax
 * @property int $IncludeInInventory
 * @property int $IsAvailableOnline
 * @property int $isDiscountAllowed
 * @property string $ImageLink
 * @property boolean $ChargeTax
 */
class Product extends BaseModel
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'product';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'ProductID';

    /**
     * @var array
     */
    protected $fillable = ['ProductType', 'ProductCategory', 'UPC', 'Name', 'Description', 'Keywords', 'Price', 'isISAAllowed', 'CommissionPercent', 'Cost', 'PriceIncludesTax', 'IncludeInInventory', 'IsAvailableOnline', 'isDiscountAllowed', 'ImageLink', 'ChargeTax'];

}
