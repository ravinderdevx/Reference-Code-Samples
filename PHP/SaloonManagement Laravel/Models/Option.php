<?php

namespace App\Models;

use App\Models\BaseModel;

/**
 * @property int $OptionID
 * @property string $OptionName
 * @property string $InternalDocs
 * @property string $Param1
 * @property string $Param2
 * @property string $Param3
 * @property string $Value
 * @property string $Description
 * @property string $Heading
 */
class Option extends BaseModel
{
    /**
     * The primary key for the model.
     * 
     * @var string
     */
    protected $primaryKey = 'OptionID';

    /**
     * @var array
     */
    protected $fillable = ['OptionName', 'InternalDocs', 'Param1', 'Param2', 'Param3', 'Value', 'Description', 'Heading'];

}
