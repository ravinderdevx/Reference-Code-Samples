<?php
namespace App\Helpers;


use Illuminate\Support\Arr;
use App\Models\Option;

class OptionHelper
{
    public $Options;

    public function __construct() {
        $this->Options = Option::select('OptionName', 'Param1', 'Param2', 'Param3', 'value')
                                ->get()
                                ->toArray();
    }

    public function getOpt($OptionName, $Param1 = null, $Param2 = null, $Param3 = null) {  
        $where = array();
        $where["OptionName"] = $OptionName;

        if ($Param1 != null) {
            $where["Param1"] = $Param1;
        }

        if ($Param2 != null) {
            $where["Param2"] = $Param2;
        }

        if ($Param3 != null) {
            $where["Param3"] = $Param3;
        }

        $first = Arr::first($this->Options, function ($value, $key) use ($OptionName, $Param1, $Param2, $Param3) {
                if ( 
                    ($value['OptionName'] == $OptionName) &&
                    ($value['Param1'] == $Param1) &&
                    ($value['Param2'] == $Param2) &&
                    ($value['Param3'] == $Param3)
                ) {
                    return $value['value'];
                }
        });

        if(!empty($first)) {
            return $first['value'];
        }
        return null;
    }

    public static function setOpt($OptionName, $Value, $Param1 = null, $Param2 = null, $Param3 = null) {
        $optionDetails = Option::where('OptionName', $OptionName)->firstOrFail();

        $optionDetails->value = $Value;
        if ($Param1 != null) {
            $optionDetails->Param1 = $Param1;
        }

        if ($Param2 != null) {
            $optionDetails->Param2 = $Param2;
        }

        if ($Param3 != null) {
            $optionDetails->Param3 = $Param3;
        }

        $optionDetails->save();
    }
}
