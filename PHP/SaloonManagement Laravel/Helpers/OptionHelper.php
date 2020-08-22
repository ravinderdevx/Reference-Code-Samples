<?php
namespace App\Helpers;

use App\Models\Option;

class OptionHelper
{
    public static function getOpt($OptionName, $Param1 = null, $Param2 = null, $Param3 = null)
    {
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

        $result = Option::where($where)->first();

        if ($result != null) {
            return $result->Value;
        }

        return null;
    }

    public static function setOpt($OptionName, $Value, $Param1 = null, $Param2 = null, $Param3 = null)
    {
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
