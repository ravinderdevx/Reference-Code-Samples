<?php
namespace App\Helpers;

class CommonHelper
{
	public static function ConvertDate($Date)
	{
		//Convert from YYYY-MM-DD to MM-DD-YYYY and vice versa
		
		$regex1 = '/\d{4}-\d{1,2}-\d{1,2}/'; 
		$regex2 = '/\d{1,2}-\d{1,2}-\d{4}/';
		$regex3 = '/\d{4}\/\d{1,2}\/\d{1,2}/'; 
		$regex4 = '/\d{1,2}\/\d{1,2}\/\d{4}/';
	
		if (preg_match($regex1, $Date))
		{
			return Date("n-j-Y", strtotime($Date));
		}
		else if (preg_match($regex3, $Date))
		{
			return Date("n-j-Y", strtotime($Date));
		}
		else if (preg_match($regex2, $Date))
		{
			$OldDate=explode("-",$Date);
			return Date("Y-m-d", strtotime("$OldDate[2]-$OldDate[0]-$OldDate[1]"));
		}
		else if (preg_match($regex4, $Date))
		{
			$OldDate=explode("/",$Date);
			return Date("Y-m-d", strtotime("$OldDate[2]-$OldDate[0]-$OldDate[1]"));
		}
		else return "";
	}

	public static function timeDifference($firstTime, $lastTime)
	{
		// convert to unix timestamps
		$firstTime=strtotime($firstTime);
		$lastTime=strtotime($lastTime);
	
		// perform subtraction to get the difference (in seconds) between times
		$timeDiff=$lastTime-$firstTime;
	
		// return the difference
		return $timeDiff;
	}
	

	public static function isSystemLocal()
	{
		if (! stristr($_SERVER['SERVER_NAME'], "tan-link.com") && $_SERVER['SERVER_NAME'] != "")
		{
			return true;
		}
		return false;
	}
}