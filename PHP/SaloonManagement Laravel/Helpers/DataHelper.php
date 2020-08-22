<?php
namespace App\Helpers;

use DB;

use App\Models\Customer;
use App\Models\MembershipType;

class DataHelper
{
    public static function getNewAccountID()
	{
        //New Account Number
        $accountIDObj = Customer::select(DB::raw("max(cast(accountid as unsigned)) as MaxAccountID"))->first();
    
        $result = DB::select("show variables like 'auto_increment%'");
        
        $AII = "";
        $AIO = "";

        foreach($result as $row) {
            if ($row->Variable_name == "auto_increment_increment") $AII=$row->Value;
            if ($row->Variable_name == "auto_increment_offset") $AIO=$row->Value;
        }
		
        $NextAccountID = $AIO + $AII * CEIL($accountIDObj->MaxAccountID/$AII);
        
		return $NextAccountID;
	}

	public static function GetMembershipDescFromID($MembershipTypeID, $ShowPrice = 1) {
		if ($MembershipTypeID != "")
		{
			$result = MembershipType::findOrFail($MembershipTypeID);

			$TotalMembershipPrice = $result->Price + $result->TanTax + $result->SalesTax;
			$MembershipDesc = $result->MembershipDesc;

			if ($ShowPrice)
			{
				return "$MembershipDesc ($" . number_format($TotalMembershipPrice, 2, '.', '') . ")";
			}
			else
			{
				return "$MembershipDesc";
			}
		}
		return "";	
	}
}