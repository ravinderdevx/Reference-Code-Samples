<?php

namespace App\Models;

use App\Models\BaseModel;

/**
 * @property string $DateTime
 * @property int $ID
 * @property string $ClubLocation
 * @property int $ProductID
 * @property string $EmployeeName
 * @property string $Status
 * @property int $Quantity
 */
class ProductOrder extends BaseModel
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'productorder';

    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'ID';

    /**
     * Indicates if the IDs are auto-incrementing.
     * 
     * @var bool
     */
    protected $fillable = ['DateTime', 
                            'ClubLocation', 
                            'ProductID', 
                            'EmployeeName', 
                            'Status', 
                            'Quantity'
                        ];

}
