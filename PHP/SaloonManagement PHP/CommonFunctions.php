<?
function ActiveEmployees($SelectName, $OnSelect)
{
	$query="SELECT * FROM Employee WHERE Active=1 ORDER BY Name ASC";
	$result=Query($query);

	$Select = "<select class='form-control' id='$SelectName' name='$SelectName' onChange='$OnSelect'>";
	$Select .= "<option value=''>--</option>\r\n";
	while ($row = mysql_fetch_object($result))
	{	
		$Select .= "<option $selected value='" . $row->Name . "'>" . $row->Name . "</option>\r\n";
	}
	$Select .= "</select>";
	return $Select;
}

function GetMembershipDescFromID($MembershipTypeID, $ShowPrice=1)
{
	if ($MembershipTypeID != "")
	{
		$query="SELECT * FROM MembershipType WHERE MembershipTypeID='$MembershipTypeID'";
      	$result = Query($query) or die("Error with GetMembershipDescFromID, contact Tan-Link immediately. Provider the error text: <BR><BR><B>" . mysql_error());
		$row = mysql_fetch_object($result);
		$TotalMembershipPrice = $row->Price + $row->TanTax + $row->SalesTax;
		$MembershipDesc = $row->MembershipDesc;
		mysql_free_result($result);
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

function GetMembershipLevelFromID($MembershipTypeID)
{
	if ($MembershipTypeID != "")
	{
		$query="SELECT * FROM MembershipType WHERE MembershipTypeID='$MembershipTypeID'";
   		$result = Query($query) or die("Error with GetMembershipDescFromID, contact Tan-Link immediately. Provider the error text: <BR><BR><B>" . mysql_error());
		$row = mysql_fetch_object($result);

		$MembershipLevel = $row->MembershipLevel;
		mysql_free_result($result);
		return $MembershipLevel;
	}
	return "";
}

function ConvertDate($Date)
{
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

function Query($query, $DieOnFailure, $File, $Function, $Line)
{
	global $database,$mail, $OwnerEmail, $OwnerName, $TechnicalContactEmail, $TechnicalContact, $Opt;

	$result = mysql_query($query);
	if ($result)
	{
		return $result;
	}
	else
	{
		$FailureLog = "$File:$Function:$Line <br><br>$query<br><br>" . mysql_error();
		try 
		{
			$mail->AddAddress($TechnicalContactEmail, $TechnicalContact);
			$mail->Subject = "SYSTEM ERROR: $database:$File:$Function:$Line";
			$mail->Body = $FailureLog;
			$mail->Send();
		}
		catch (phpmailerException $e) 
		{
		  AddStickyNote("Email Failed for $FirstName $LastName ($Email)", Date("Y-m-d H:i"), $Opt->getOpt("TechContact"), array($Opt->getOpt("TechContact")));
		}	
			
		echo "<div class=\"alert alert-danger\" role=\"alert\" align=center>There has been an error with the system. Please report what you were doing when you received this error.</div> $FailureLog";
		if ($DieOnFailure) exit;
		return false;
	}
	
}

function export_report($query, $ReportHeading, $header="", $colwidth="", $FieldsToTotal)
{
	$result = Query ($query,
					 $DieOnFailure=true,
					 __FILE__, __FUNCTION__, __LINE__);
	$NumberOfFields = mysql_num_fields($result);
	for ($i = 0; $i < $NumberOfFields; $i++)
	{
		$field_info = mysql_fetch_field($result, $i);
		$FieldHeading[$i] = $field_info->name;
	}
	
	while ($row = mysql_fetch_row($result))
	{
		$i = 0;
		foreach ($row AS $v)
		{
			$LineEntry[$FieldHeading[$i++]] = $v;
		}
		$ExportData[] = $LineEntry;
	}
	
	exportToExcel($ExportData, "test export");
}

function exportToExcel($data, $filename)
{
  header("Content-Disposition: attachment; filename=\"$filename\"");
  header("Content-Type: text/csv");

  $out = fopen("php://output", 'w');

  $flag = false;
  foreach($data as $row) {
    if(!$flag) {
      	fputcsv($out, array_keys($row), ',', '"');
      	$flag = true;
    }
    array_walk($row, __NAMESPACE__ . '\cleanData');
    fputcsv($out, array_values($row), ',', '"');
  }

  fclose($out);
}

function cleanData(&$str)
{
	if($str == 't') $str = 'TRUE';
	if($str == 'f') $str = 'FALSE';
	if(preg_match("/^0/", $str) || preg_match("/^\+?\d{8,}$/", $str) || preg_match("/^\d{4}.\d{1,2}.\d{1,2}/", $str)) {
	  $str = "'$str";
	}
	if(strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"';
}

function getNewAccountID()
{
	//New Account Number
	$result = Query ("select max(cast(accountid as unsigned)) as MaxAccountID from customer",
		   $DieOnFailure=true,
		   __FILE__, __FUNCTION__, __LINE__);
	$MaxAccountID = mysql_fetch_object($result)->MaxAccountID;
	
	$query = "show variables like 'auto_increment%'";
	$result = Query ("show variables like 'auto_increment%'",
		   $DieOnFailure=true,
		   __FILE__, __FUNCTION__, __LINE__);

	while ($row = mysql_fetch_assoc($result)) {
	  	if ($row['Variable_name'] == "auto_increment_increment") $AII=$row[Value];
	  	if ($row['Variable_name'] == "auto_increment_offset") $AIO=$row[Value];
	}
	
	$NextAccountID = $AIO + $AII * ceil($MaxAccountID/$AII);
	return $NextAccountID;
}

function AllowEFTFreeze($AccountID, &$DisallowReason)
{
	$query = "SELECT C.NextDraftDate, C.NextDraftAmount, C.MembershipStartDate, C.PastDueAmount
			  FROM Customer C, MembershipType M 
			  WHERE C.MembershipTypeID=M.MembershipTypeID 
			  AND C.AccountID = '$AccountID'";
	
	$result = Query ($query);
	$row = mysql_fetch_object($result);
	
	if ($row->PastDueAmount > 0)
	{
		$DisallowReason = "The account has a Past Due Balance of $" . number_format($row->PastDueAmount, 2, '.', '');
		return false;
	}
	
	if ($row->NextDraftAmount <= 0)
	{
		$DisallowReason = "Account is not eligible for freeze. Next Draft Amount is $" . number_format($row->NextDraftAmount, 2, '.', '');
		return false;
	}
	
	if (strtotime($row->NextDraftDate) === false)
	{
		$DisallowReason = "Account is not eligible for freeze. Next Draft Date is missing or invalid.";
		return false;
	}
	
	$DisallowReason = "";
	return true;
}

function sendPostData($url, $postdata = array())
{
	$data = '';
	while(list($key, $value) = each($postdata)) 
	{  
		$data .= $key . '=' . urlencode($value) . '&';
	}  	

	$data = substr($data, 0, -1);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_HEADER, FALSE);
	curl_setopt($ch, CURLOPT_POST, TRUE);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt ($ch, CURLOPT_TIMEOUT, 300);
	curl_setopt ($ch, CURLOPT_DNS_USE_GLOBAL_CACHE,FALSE);
	curl_setopt ($ch, CURLOPT_SSLVERSION, 6);
	curl_setopt ($ch, CURLOPT_RETURNTRANSFER,TRUE);

	$result = curl_exec($ch);
	$commError = curl_error($ch);
	$commInfo = @curl_getinfo($ch);

	curl_close($ch);
	
	echo $result;
	$xmlfile = $result;
	$ob= simplexml_load_string($xmlfile);
	$json  = json_encode($ob);
	$arrayData = json_decode($json, true);
	return $arrayData;
}
?>