<?php

namespace App\Http\Controllers;

use DB;

use Illuminate\Http\Request;

use App\Helpers\UserHelper;
use App\Helpers\OptionHelper;
use App\Helpers\CommonHelper;
use App\Helpers\ResponseHelper;

use App\Models\Notice;
use App\Models\Schedule;
use App\Models\Timecard;

class HomeController extends Controller
{
    private $session;

    public function __construct()
    {
        $this->session = UserHelper::session();
    }

    public function index()
    {
        $data = array();

        $data["session"] = $this->session;
        $data["DisableDisplayOfBeds"] = OptionHelper::getOpt("DisableDisplayOfBeds");
        $data["SecurityLevelShowSalesTickerWhenNoTimerFound"] = OptionHelper::getOpt("SecurityLevelShowSalesTickerWhenNoTimerFound");
        $data["HasPermSecurityLevelShowSalesTickerWhenNoTimerFound"] = UserHelper::hasPerm($data["SecurityLevelShowSalesTickerWhenNoTimerFound"]);

        /* Variable for Set Timer From Computer */

        $data["TimerScript"] = "";
        $data["TimerLocalIP"] = "";
        $data["TimerLocalPort1"] = "";
        $data["TimerLocalPort1Type"] = "";
        $data["TimerLocalPort2"] = "";
        $data["TimerLocalPort2Type"] = "";

        if ((isset($this->session["slavepc"]) && $this->session["slavepc"] == 1) || (isset($this->session["slavepc"]) && $this->session["kioskpc"] == 1)) {
            $data["LocalTimerHostName"] = OptionHelper::getOpt("TimerLocalMasterIP", $this->session["ThisLocation"]);
        } else if (OptionHelper::getOpt("Localhost", $this->session["ThisLocation"]) != "") {
            $data["LocalTimerHostName"] = OptionHelper::getOpt("Localhost", $this->session["ThisLocation"]);
        } else if (OptionHelper::getOpt("Localhost") != "") {
            $data["LocalTimerHostName"] = OptionHelper::getOpt("Localhost");
        } else {
            $data["LocalTimerHostName"] = "localhost";
        }
        
        $data["IsSetTimerFromComputer"] = OptionHelper::getOpt("SetTimerFromComputer", $this->session["ThisLocation"]);
        
        if($data["IsSetTimerFromComputer"]) {
            $data["TimerScript"] = OptionHelper::getOpt("TimerScript");
            $data["TimerLocalIP"] = $data["LocalTimerHostName"];
            $data["TimerLocalPort1"] = OptionHelper::getOpt("TimerLocalPort1", $this->session["ThisLocation"]);;
            $data["TimerLocalPort1Type"] = OptionHelper::getOpt("TimerLocalPort1Type", $this->session["ThisLocation"]);;
            $data["TimerLocalPort2"] = OptionHelper::getOpt("TimerLocalPort2", $this->session["ThisLocation"]);;
            $data["TimerLocalPort2Type"] = OptionHelper::getOpt("TimerLocalPort2Type", $this->session["ThisLocation"]);;
        }

        /* End Variable for Set Timer From Computer */

        $data["kioskPcMode"] = isset($this->session["kioskpc"]) && $this->session["kioskpc"] == 1 ? true : false;
        $data["customStoreLogo"] = OptionHelper::getOpt("CustomStoreLogo");
        $data["isSystemLocal"] = CommonHelper::isSystemLocal();

        // Get Checked List Items

        $result; 
        $today = Date("Y-m-d");

		if (OptionHelper::getOpt("UseTimeClockForChecklists") == 0) {
            $result = Schedule::whereRaw(DB::raw("Date(ShiftStart)='".$today."' AND ClubLocation='".$this->session["ThisLocation"]."'"));
		} else {
            $result = Timecard::whereRaw(DB::raw("Date(DateTime)='".$today."' AND ClubLocation='".$this->session["ThisLocation"]."'"));	
		}
        
        $checkEmployeeShiftItemsCount = $result->where('EmployeeName', $this->session["EmployeeName"])->count();

        if($checkEmployeeShiftItemsCount > 0) {
            $data["checkedListItemsExist"] = true;
            $data["checkedListItems"] = Checklist::where(['Status' => 'PENDING', 'ClubLocation' => $this->session["ThisLocation"]])
                                                    ->whereRaw("(EmployeesRestrictedTo IS NULL OR EmployeesRestrictedTo = '') OR  FIND_IN_SET(?,EmployeesRestrictedTo)", [$this->session["EmployeeName"]])
                                                    ->get();
        } else {
            $data["checkedListItemsExist"] = false;

            $maximumNumberOfNotices = OptionHelper::getOpt("MaximumNumberOfNotices");
            $clubLocations = explode(",", OptionHelper::getOpt("ListOfAllLocations"));
            $noticeLocations = $clubLocations;
            
            if (UserHelper::hasPerm(OptionHelper::getOpt("AllowUpdateCustomerScanID")) && OptionHelper::getOpt("AllowUpdateCustomerScanID")>0)
            {
                $noticeLocations[] = "Kiosk";
            }

            $hasSecurityLevelChangeNoticePermission = UserHelper::hasPerm(OptionHelper::getOpt("SecurityLevelChangeNotice"));
            
            $data["noticeLocations"] = $noticeLocations;
            $data["hasSecurityLevelChangeNoticePermission"] = $hasSecurityLevelChangeNoticePermission;
            $data["maximumNumberOfNotices"] = $maximumNumberOfNotices;

            if ($hasSecurityLevelChangeNoticePermission) {
                $result = Notice::oderBy('NoticeID');
            } else {
                $result = Notice::whereRaw(DB::raw("LOCATE('" . (isset($this->session["kioskpc"]) && $this->session["kioskpc"] == 1 ? 'Kiosk' : $this->session["ThisLocation"]). "', ClubLocation) > 0"))->orderBy('NoticeID');
            }
            
            $data["notices"] = $result->take($maximumNumberOfNotices)->get();
        }


        // Store Stats

        $employeeName = $this->session["EmployeeName"];
        $todaysDate = Date("Y-m-d");
        
        $maximumNumberOfStatsOnMainPage = OptionHelper::getOpt("MaximumNumberOfStatsOnMainPage");
        $firstItemInList = true;
        
        $goalDateRange = "";
        $goalTrackingRotateBasedOnStartDate = OptionHelper::getOpt("GoalTrackingRotateBasedOnStartDate");
        if (strtotime($goalTrackingRotateBasedOnStartDate) !== false)
        {
            $goalDateRange = Date("n/j/y", strtotime($GoalTrackingRotateBasedOnStartDate)) . " - " . Date("n/j/y", strtotime(OptionHelper::getOpt("GoalTrackingRotateBasedOnEndDate")));
        }

        //echo '<pre>';print_r($data);die;
        return view('home')->with($data);
    }

    public function setTimerPresent() {
        try {
            setSession('TimerPresent', 1);
        }  catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse([], "Timer set successfully");
    }
}
