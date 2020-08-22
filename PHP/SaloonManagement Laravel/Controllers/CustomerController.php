<?php

namespace App\Http\Controllers;

use App\Helpers\AuthorizenetHelper;
use App\Helpers\CommonHelper;
use App\Helpers\DataHelper;
use App\Helpers\MailChimpHelper;
use App\Helpers\OptionHelper;
use App\Helpers\ResponseHelper;
use App\Models\AbInfo;
use App\Models\Customer;
use DB;
use Illuminate\Http\Request;
use Redirect;
use Validator;

class CustomerController extends Controller
{

    private $session;

    public function __construct()
    {
        $this->session = UserHelper::session();
    }


    public function search(Request $request)
    {
        $input = array();
        $input["MemberNameAccount"] = $request->input('MemberNameAccount', '');
        $input["SkipBedSetting"] = $request->input('SkipBedSetting', '');
        $input["TanLogTime"] = $request->input('TanLogTime', '');
        $input["Matches"] = $request->input('Matches', '');
        $input["CheckIn"] = $request->input('CheckIn', '');

        $MemberNameAccount = $input["MemberNameAccount"];
        $SearchTerms = explode(" ", trim($MemberNameAccount));

        $SearchQuery = "";
        if (OptionHelper::getOpt("TanEtcSpecialSearch")) {
            $MemberNameAccount = explode(" ", $MemberNameAccount);

            // Birthday search
            $BirthDate = CommonHelper::ConvertDate($MemberNameAccount);
            if ($BirthDate != "") {
                $BirthDateSearch = "OR BirthDate='$BirthDate'";
            } else {
                $BirthDateSearch = "";
            }

            // Email Search
            if (strpos($MemberNameAccount, "@") !== false) {
                $EmailSearch = "OR Email='$MemberNameAccount[0]'";
            } else {
                $EmailSearch = "";
            }

            $SearchQuery = "SELECT * FROM Customer WHERE
                        ((FirstName Like \"%" . substr($MemberNameAccount[0], 0, 3) . "%\" AND LastName Like \"%" . substr($MemberNameAccount[Count($MemberNameAccount) - 1], 0, 3) . "%\")
                        OR AccountID LIKE '%$MemberNameAccount[0]%'
                        OR CellPhone LIKE '%$MemberNameAccount[0]%'
                        OR HomePhone LIKE '%$MemberNameAccount[0]%'
                        OR WorkPhone LIKE '%$MemberNameAccount[0]%' $BirthDateSearch $EmailSearch)
                        AND DeleteCustomer=0
                        ORDER BY FIELD(MemberStatus, 'Active') DESC, FirstName";

            goto SEARCH_TERM_IDENTIFIED;
        }

        $IsName = 1;
        $Name = array();

        for ($i = 0; $i < count($SearchTerms); $i++) {
            if (!ctype_alpha($SearchTerms[$i]) && !stristr($SearchTerms[$i], "'")) {
                $IsName = 0;
                break;
            } else {
                $Name[$i] = $SearchTerms[$i];
            }
        }

        if ($IsName) {
            if (count($Name) == 1) {
                if (OptionHelper::getOpt("AllowFindCustomerSingleSearchTerm")) {
                    $SearchQuery = "SELECT * FROM Customer
                                    WHERE (FirstName Like \"%$Name[0]%\" OR LastName Like \"%$Name[0]%\")
                                    AND DeleteCustomer=0
                                    ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
                } else {
                    $SearchQuery = "SELECT * FROM Customer
                                    WHERE (FirstName='$Name[0]' OR LastName='$Name[0]' OR AccountID='$Name[0]')
                                    AND DeleteCustomer=0
                                    ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
                }
            } else if (count($Name) == 2) {
                $SearchQuery = "SELECT * FROM Customer
                                WHERE (FirstName Like \"" . substr($Name[0], 0, strlen($Name[0])) . "%\"
                                AND LastName Like \"" . substr($Name[1], 0, strlen($Name[1])) . "%\")
                                AND DeleteCustomer=0
                                ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
            }
            goto SEARCH_TERM_IDENTIFIED;
        }

        // Is DOB: 1/1/1980 or 1-1-1980 or 12-1-1980
        if (count($SearchTerms) == 1) {
            $DOB = str_replace(array("/", "\\"), "-", $SearchTerms[0]);
            $DOB = CommonHelper::ConvertDate($DOB);
            if ($DOB != "") {
                $SearchQuery = "SELECT * FROM Customer
                                WHERE BirthDate='$DOB'
                                AND DeleteCustomer=0
                                ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
                goto SEARCH_TERM_IDENTIFIED;
            }
        }

        // Is it a phone number? Could be the account # too so search both
        $isPhoneNumber = 0;
        if (count($SearchTerms) == 1) {
            $PhoneNumber = str_replace(array("(", ")", "-"), "", $SearchTerms[0]);
            if ((strlen($PhoneNumber) == 7 || strlen($PhoneNumber) == 10) && is_numeric($PhoneNumber)) {
                $isPhoneNumber = 1;
            }
        } else if (count($SearchTerms) == 2) {
            $PhoneNumber[0] = str_replace(array("(", ")", "-"), "", $SearchTerms[0]);
            $PhoneNumber[1] = str_replace(array("(", ")", "-"), "", $SearchTerms[1]);
            if (
                strlen($PhoneNumber[0]) == 3 && strlen($PhoneNumber[1]) == 4
                && is_numeric($PhoneNumber[0]) && is_numeric($PhoneNumber[1])
            ) {
                $isPhoneNumber = 1;
                $PhoneNumber = "$PhoneNumber[0]$PhoneNumber[1]";
            }
        } else if (count($SearchTerms) == 3) {
            $PhoneNumber[0] = str_replace(array("(", ")", "-"), "", $SearchTerms[0]);
            $PhoneNumber[1] = str_replace(array("(", ")", "-"), "", $SearchTerms[1]);
            $PhoneNumber[2] = str_replace(array("(", ")", "-"), "", $SearchTerms[2]);

            if (
                strlen($PhoneNumber[0]) == 3 && strlen($PhoneNumber[1]) == 3 && strlen($PhoneNumber[2]) == 4
                && is_numeric($PhoneNumber[0]) && is_numeric($PhoneNumber[1]) && is_numeric($PhoneNumber[2])
            ) {
                $isPhoneNumber = 1;
                $PhoneNumber = "$PhoneNumber[0]$PhoneNumber[1]$PhoneNumber[2]";
            }
        }

        if ($isPhoneNumber) {
            $SearchQuery = "SELECT * FROM Customer WHERE (AccountID='$SearchTerms[0]' OR replace(replace(replace(replace(HomePhone, '-', ''), ' ', ''), '(', ''), ')', '') LIKE '%$PhoneNumber%'" .
                " OR replace(replace(replace(replace(WorkPhone, '-', ''), ' ', ''), '(', ''), ')', '') LIKE '%$PhoneNumber%'" .
                " OR replace(replace(replace(replace(CellPhone, '-', ''), ' ', ''), '(', ''), ')', '') LIKE '%$PhoneNumber%')" .
                " AND DeleteCustomer=0" .
                " ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
            goto SEARCH_TERM_IDENTIFIED;
        }

        // Is it Email?
        if (count($SearchTerms) == 1 && strstr($SearchTerms[0], "@") && strstr($SearchTerms[0], ".")) {
            $SearchQuery = "SELECT * FROM Customer WHERE Email = '$SearchTerms[0]' AND DeleteCustomer=0 ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";
            goto SEARCH_TERM_IDENTIFIED;
        }

        // Is it account number?
        $SearchQuery = "SELECT * FROM Customer WHERE AccountID='$SearchTerms[0]' AND DeleteCustomer=0 ORDER BY LastTanDateTime DESC, FIELD(MemberStatus, 'Active') DESC, FirstName";

        SEARCH_TERM_IDENTIFIED:

        $input["IsEnablePictureIDSearch"] = OptionHelper::getOpt("EnablePictureIDSearch", $this->session["ThisLocation"]);

        if ($MemberNameAccount == "PictureIDSearch" && strpos($input["Matches"], ',') == true && $input["IsEnablePictureIDSearch"] == 1) {
            $matches = explode(",", $input["Matches"]);
            $QueryConditions = "";
            $i = 0;
            foreach ($matches as $match) {
                $AccountID = $match;
                $QueryConditions .= "C.AccountID like '$AccountID'";
                if ($i < count($matches) - 2) {
                    $QueryConditions .= " OR ";
                }
                $i++;
            }

            if (OptionHelper::getOpt("ShowLastTanOnFindCustomer")) {
                $SearchQuery = "SELECT C.FirstName, C.LastName, C.Address, C.City, C.State, C.ZipCode, C.CellPhone, C.HomePhone, C.WorkPhone, C.MemberStatus, C.DeleteCustomer, C.ClubLocation, C.AccountID, C.CustomerPic, O.AccountID AS 'OrderAccountID', DATE_FORMAT(MAX(O.Date), '%m/%d/%Y') AS 'RecentDate', O.OrderType FROM Orders O RIGHT JOIN Customer C ON O.AccountID = C.AccountID WHERE C.DeleteCustomer=0 AND ($QueryConditions) AND (O.OrderType like 'RegularPriceTanning' OR O.OrderType IS NULL) GROUP BY C.AccountID ORDER BY FIELD(C.MemberStatus, 'Active') DESC, C.FirstName";
            } else {
                $SearchQuery = "SELECT * FROM Customer C WHERE ($QueryConditions) AND DeleteCustomer=0 ORDER BY FIELD(MemberStatus, 'Active') DESC, FirstName";
            }
        }

        if ($SearchQuery != "") {
            $result = DB::select(DB::raw($SearchQuery));

            $NumberOfCustomersFound = count($result);
        }

        $data = array();
        $data = $input;
        $data["NumberOfCustomersFound"] = $NumberOfCustomersFound;

        if ($NumberOfCustomersFound == 1) {
            $data["RedirectTo"] = '/CustomerInfo.php?AccountID=' . $result[0]->AccountID . '&SkipBedSetting=' . $input["SkipBedSetting"] . '&TanLogTime=' . $input["TanLogTime"];
        } else if ($NumberOfCustomersFound > 1) {
            $data["activeCustomers"] = array_where($result, function ($customer, $key) {
                return ($customer->MemberStatus == "Active");
            });
            $data["inactiveCustomers"] = array_where($result, function ($customer, $key) {
                return ($customer->MemberStatus != "Active");
            });
        }

        return view('customer.search')->with($data);
    }

    public function create()
    {
        $data = array();
        $data["WaiveNewCustomerFullInfoRequirement"] = OptionHelper::getOpt("WaiveNewCustomerFullInfoRequirement");
        return view('customer.create')->with($data);
    }

    public function createCustomer(Request $request)
    {
        $data = array();
        try {
            $input = $request->input();
            $input["BirthDate"] = date_format(date_create($input["BirthDate"]), "m-d-Y");
            $WaiveNewCustomerFullInfoRequirement = OptionHelper::getOpt("WaiveNewCustomerFullInfoRequirement");

            $rules = [
                'FirstName' => 'required|max:255',
                'LastName' => 'required|max:255',
                'BirthDate' => 'required|date|date_format:m-d-Y',
            ];

            if ($WaiveNewCustomerFullInfoRequirement != 1) {
                $rules = array_merge($rules, [
                    'Address' => 'required',
                    'City' => 'required',
                    'State' => 'required',
                    'ZipCode' => 'required',
                    'CellPhone' => 'required',
                    'Email' => 'required|email',
                    'SkinType' => 'required',
                    'HowHeardAboutUs' => 'required',
                    'ReferredBy' => 'required',
                ]);
            }

            $validator = Validator::make($input, $rules, [
                //   'ScanString.required' => "Please enter scan driver license string",
            ]);

            if (!isset($input["ForceCreate"]) || $input["ForceCreate"] == false) {
                // 1. First search for first name and dob
                // 2. search for last name and dob
                // 3. search for first name, last name and dob
                // 4. Search for first name, last name, dob and cellphone
                // 5. Search for email
                $LastFourOfCellPhone = substr($input["CellPhone"], -4, 4);

                $whereCondition = "(FirstName='" . $input["FirstName"] . "' AND BirthDate='" . $input["BirthDate"] . "')
                                        OR (LastName='" . $input["LastName"] . "' AND BirthDate='" . $input["BirthDate"] . "')
                                            OR (FirstName LIKE '%" . $input["FirstName"] . "%' AND LastName LIKE '%" . $input["LastName"] . "%' AND BirthDate='" . $input["BirthDate"] . "')
                                                OR (FirstName LIKE '%" . $input["FirstName"] . "%' AND LastName LIKE '%" . $input["LastName"] . "%' AND (RIGHT(HomePhone,4)='" . $LastFourOfCellPhone . "' OR RIGHT(CellPhone,4)='" . $LastFourOfCellPhone . "' OR RIGHT(WorkPhone,4)='" . $LastFourOfCellPhone . "'))
                                                    OR (Email='" . $input["Email"] . "' AND Email <> '')";

                $customers = Customer::whereRaw(DB::raw($whereCondition));

                if ($customers->count() > 0) {
                    $data["customerExists"] = true;
                    $data["customers"] = $customers->select('AccountID', 'FirstName', 'LastName', 'BirthDate', 'Address', 'City', 'State', 'ZipCode')->get();

                    return ResponseHelper::sendResponse($data);
                }
            }

            $newAccountId = DataHelper::getNewAccountID();

            $data["customerExists"] = false;
            $data["AccountID"] = $newAccountId;

            $input["AccountID"] = $newAccountId;
            $input["DateJoined"] = Date("Y-m-d");
            $NewMembersDefaultMembershipTypeID = OptionHelper::getOpt("NewMembersDefaultMembershipTypeID");
            $input["MembershipTypeID"] = $NewMembersDefaultMembershipTypeID;
            $input["ClubLocation"] = $this->session["ThisLocation"];
            $input["BirthDate"] = CommonHelper::ConvertDate($input["BirthDate"]);
            $input["MemberStatus"] = "Active";

            // Create Customer
            $customer = Customer::create($input);

            // Create ABInfo
            $abInfo = ABInfo::create(array(
                'AccountID' => $newAccountId,
                'PaymentProfileClubLocation' => $this->session["ThisLocation"])
            );

            if (OptionHelper::getOpt("UseTokens")) {

                $auth = new AuthorizenetHelper($this->session["ThisLocation"]);

                if ($auth->createCustomerProfile($newAccountId,
                    $input["FirstName"],
                    $input["LastName"],
                    $input["Address"],
                    $input["City"],
                    $input["State"],
                    $input["ZipCode"],
                    $input["Email"],
                    $CustomerProfileID,
                    $CCPaymentProfileID1,
                    $BankPaymentProfileID1,
                    $CCPaymentProfileID2,
                    $BankPaymentProfileID2,
                    $Error)
                ) {

                    $abInfo->CustomerProfileID = $CustomerProfileID;
                    $abInfo->CCPaymentProfileID1 = $CCPaymentProfileID1;
                    $abInfo->BankPaymentProfileID1 = $BankPaymentProfileID1;
                    $abInfo->CCPaymentProfileID2 = $CCPaymentProfileID2;
                    $abInfo->BankPaymentProfileID2 = $BankPaymentProfileID2;

                    // Update abinfo
                    $abInfo->save();
                }
            }

            if (OptionHelper::getOpt("MailChimpAPIKey") != "") {
                $list_id = OptionHelper::getOpt("MailChimpListID");

                $MembershipDesc = DataHelper::GetMembershipDescFromID($NewMembersDefaultMembershipTypeID, 0);
                $BirthDate = Date("m/d", strtotime(CommonHelper::ConvertDate($input["BirthDate"])));

                $mailChimpHelper = new MailChimpHelper(OptionHelper::getOpt("MailChimpAPIKey"));

                $mergeFields = array(
                    "FNAME" => $input["FirstName"],
                    "LNAME" => $input["LastName"],
                    "CLUB" => $this->session["ThisLocation"],
                    "JOINED" => Date("Y-m-d"),
                    "STATUS" => "Active",
                    "CANCEL" => "",
                    "PACKAGE" => $MembershipDesc,
                    "PASTDUE" => "0",
                    "BDAY" => $BirthDate,
                    "CELL" => $input["CellPhone"],
                );
                
                $result = $mailChimpHelper->addMemberToList($list_id, $input["Email"], $mergeFields);
            }
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse($data, "Customer created successfully");
    }

    public function scanDriverLicense(Request $request)
    {
        $data = array();
        try {
            $input = $request->all();

            $validator = Validator::make($input, [
                'ScanString' => 'required',
            ], [
                'ScanString.required' => "Please enter scan driver license string",
            ]);

            if ($validator->fails()) {
                return ResponseHelper::sendError("validation_error", $validator->errors());
            }

            $parseList = sscanf($input["ScanString"], "%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s");
            $parseList = implode(" ", $parseList);

            switch (OptionHelper::getOpt("LicenseScanState")) {
                case "TX":
                case "OH":
                case "LA":
                    $data['State'] = substr($parseList, 1, 2);
                    $parseList = substr($parseList, 3);

                    $data['City'] = substr($parseList, 0, strpos($parseList, "^"));
                    $parseList = substr($parseList, strpos($parseList, "^") + 1);

                    $data['LastName'] = substr($parseList, 0, strpos($parseList, "$"));
                    $parseList = substr($parseList, strpos($parseList, "$") + 1);
                    $data['LastName'] = str_replace("$", " ", $data['LastName']);

                    $data['FirstName'] = trim(substr($parseList, 0, strpos($parseList, "^")));
                    $parseList = substr($parseList, strpos($parseList, "^") + 1);
                    $data['FirstName'] = str_replace("$", " ", $data['FirstName']);

                    $data['Address'] = str_replace("$", " ", substr($parseList, 0, strpos($parseList, "^")));
                    $parseList = substr($parseList, strpos($parseList, ";") + 7);

                    $data['DriverLicense'] = substr($parseList, 0, strpos($parseList, "="));
                    $parseList = substr($parseList, strpos($parseList, "=") + 1);

                    $data['IDExpirationDate'] = substr($parseList, 0, 4);
                    $parseList = substr($parseList, 4);

                    $DOB = substr($parseList, 0, 8);
                    $data['BirthDate'] = substr($DOB, 4, 2) . "-" . substr($DOB, 6, 2) . "-" . substr($DOB, 0, 4);
                    $parseList = substr($parseList, strpos($parseList, "?") + 4);

                    $data['ZipCode'] = substr($parseList, 0, 5);
                    break;
                /*

                case "LA":
                $data['State']= substr($parseList,1,2);
                $parseList = substr($parseList, 3);

                $data['City'] = substr($parseList,0, strpos($parseList,"^"));
                $parseList = substr($parseList, strpos($parseList,"^")+1);

                $data['LastName'] = substr($parseList,0, strpos($parseList,"$"));
                $parseList = substr($parseList, strpos($parseList,"$")+1);
                $data['LastName'] = str_replace("$"," ", $data['LastName']);

                $data['FirstName'] = trim(substr($parseList,0, strpos($parseList,"^")));
                $parseList = substr($parseList, strpos($parseList,"^")+1);
                $data['FirstName'] = str_replace("$"," ", $data['FirstName']);

                $data['Address'] = str_replace("$"," ", substr($parseList,0, strpos($parseList,"^")));
                $parseList = substr($parseList, strpos($parseList,";")+7);

                $data['DriverLicense'] = substr($parseList,0, strpos($parseList,"="));
                $parseList = substr($parseList, strpos($parseList,"=")+1);

                $data['IDExpirationDate'] = substr($parseList,0, 4);
                $parseList = substr($parseList, 4);

                $DOB = substr($parseList,0, 8);
                $data['BirthDate'] = substr($DOB,4, 2) . "-" . substr($DOB,6, 2) . "-" . substr($DOB,0, 4);
                $parseList = substr($parseList, strpos($parseList,"%")+3);

                $data['ZipCode'] = substr($parseList,0, 5);
                break; */

                case "WA":
                    //JAMES;STEWART;COSTON;12/03/1959;1;070;;HAZ;;;4040 NW 18TH CIR;;CAMAS;WA;98607-7947;COSTOJS416RC;;;;636045;11/13/2016;12032022;;
                    $data['FirstName'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['MiddleName'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['LastName'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['BirthDate'] = substr($parseList, 0, 10);
                    $data['BirthDate'] = str_replace("/", "-", $data['BirthDate']);
                    $parseList = substr($parseList, strpos($parseList, ";;") + 2);

                    $data['EyeColor'] = substr($parseList, 0, 3);
                    $parseList = substr($parseList, strpos($parseList, ";") + 3);

                    $data['Address'] = substr($parseList, 0, strpos($parseList, ";;"));
                    $parseList = substr($parseList, strpos($parseList, ";;") + 2);

                    $data['City'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['State'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['ZipCode'] = substr($parseList, 0, strpos($parseList, ";"));
                    $parseList = substr($parseList, strpos($parseList, ";") + 1);

                    $data['DriverLicense'] = "";
                    break;

                case "MI":
                case "NY":
                    /*                 "@

                    ANSI 636032030002DL00410214ZM02550027DLDCA
                    DCB
                    DCD
                    DBA12042019
                    DCSSMITH
                    DCTALYSSACHEY
                    DBD08012017
                    DBB12041998
                    DBC2
                    DAY
                    DAU
                    DAG15351 PARQUET DR
                    DAICLINTON TOWNSHIP
                    DAJMI
                    DAK480383185
                    DAQS 530 064 115 924
                    DCF
                    DCG
                    DCH
                    DAH
                    DCKS530064115924199812042019

                    ZMZMARev 01-21-2011
                    ZMB01"; */

                    $parseList = substr($parseList, strpos($parseList, "DCS") + 3);

                    $data['LastName'] = substr($parseList, 0, strpos($parseList, "DCT"));
                    $parseList = substr($parseList, strpos($parseList, "DCT") + 3);

                    $data['FirstName'] = substr($parseList, 0, strpos($parseList, "DBD"));
                    $parseList = substr($parseList, strpos($parseList, "DBB") + 3);

                    $DOB = substr($parseList, 0, 8);
                    $data['BirthDate'] = substr($DOB, 0, 2) . "-" . substr($DOB, 2, 2) . "-" . substr($DOB, 4, 4);
                    $parseList = substr($parseList, strpos($parseList, "DAG") + 3);

                    if (strstr($parseList, "DAHDAI")) {
                        $data['Address'] = substr($parseList, 0, strpos($parseList, "DAH"));
                        $parseList = substr($parseList, strpos($parseList, "DAI") + 3);
                    } else {
                        $data['Address'] = substr($parseList, 0, strpos($parseList, "DAI"));
                        $parseList = substr($parseList, strpos($parseList, "DAI") + 3);
                    }

                    $data['City'] = substr($parseList, 0, strpos($parseList, "DAJ"));
                    $parseList = substr($parseList, strpos($parseList, "DAJ") + 3);

                    $data['State'] = substr($parseList, 0, strpos($parseList, "DAK"));
                    $parseList = substr($parseList, strpos($parseList, "DAK") + 3);

                    $data['ZipCode'] = substr($parseList, 0, strpos($parseList, "DAQ"));
                    $parseList = substr($parseList, strpos($parseList, "DAQ") + 3);

                    $data['DriverLicense'] = substr($parseList, 0, strpos($parseList, "DCF"));
                    break;

                default:
                    return ResponseHelper::sendError("License Scan State is not added in options.");
            }
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse($data);
    }

    public function scanCustomerID($scanCustomerID)
    {
        if ($this->session["kioskpc"] == 1) {
            $customers = Customer::where('CustomerScanID', $scanCustomerID); // Query("SELECT AccountID FROM Customer WHERE CustomerScanID='$scanCustomerID'");

            $customersCount = $customers->count();

            if ($customersCount == 1) {
                $customer = $customers->get();
                $this->session["CustomerAccountID"] = $customer->AccountID;
                return Redirect::to('/CustomerInfo.php?AccountID=' . $this->session["CustomerAccountID"]);
            } else if ($customersCount > 1) {
                echo "<div class='row'><div class='col-lg-3'></div><div class='col-lg-6' style='text-align: center;'><h2>Too many matches.</div><div class='col-lg-3'></div></div>";
                return Redirect::to('/index.php');
            } else {
                echo "<div class='row'><div class='col-lg-3'></div><div class='col-lg-6' style='text-align: center;'><h2>No Customers Found.</div><div class='col-lg-3'></div></div>";
                return Redirect::to('/index.php');
            }
        }
    }
}
