<?php

namespace App\Http\Controllers;

use DB;
use Exception;
use Session;
use Illuminate\Http\Request;

use App\Helpers\CommonHelper;
use App\Helpers\OptionHelper;
use App\Helpers\ResponseHelper;
use App\Helpers\UserHelper;

use App\Models\ClubLocation;
use App\Models\Notice;
use App\Models\ProductOrder;
use App\Models\ProductCategory;

class HomeController extends BaseController
{

    public function __construct()
    {
        parent::__construct();
    }

    public function index() {
        $data = array();
        $data['categories'] = ProductCategory::orderBy('ProductCategory')->get();
        return view('inventory.index')->with($data);
    }

    //Get club location
    public function clublocation($client, $location = null) {
        if (isset($location) && $location != '') {
            session(["ThisLocation" => $location]);
            return redirect("/");
        } else {
            $data["Locations"] = ClubLocation::where("ClubName", $this->SaloonData["BusinessName"])->orderBy("ClubLocation")->get()->toArray();
            $data['BusinessName'] = $this->SaloonData['BusinessName'];

            if (Count($data["Locations"]) == 1) {
                session(["ThisLocation" => $data["Locations"][0]["ClubLocation"]]);
                return redirect("/");
            } else {
                return view("home.clublocation")->with($data);
            }
        }
    }

    //Get Notices
    public function getNotice(Request $request) {
        $data = array();
        try {
            $maximumNumberOfNotices = $this->OptionHelper->getOpt("MaximumNumberOfNotices");
            $hasSecurityLevelChangeNoticePermission = UserHelper::hasPerm($this->OptionHelper->getOpt("SecurityLevelChangeNotice"));
            $clubLocations = explode(",", $this->OptionHelper->getOpt("ListOfAllLocations"));
            $noticeLocations = $clubLocations;

            if (UserHelper::hasPerm($this->OptionHelper->getOpt("AllowUpdateCustomerScanID")) && $this->OptionHelper->getOpt("AllowUpdateCustomerScanID") > 0) {
                $noticeLocations[] = "Kiosk";
            }

            $data["noticeLocations"] = $noticeLocations;
            $data["hasSecurityLevelChangeNoticePermission"] = $hasSecurityLevelChangeNoticePermission;
            $data["maximumNumberOfNotices"] = $maximumNumberOfNotices;

            if ($hasSecurityLevelChangeNoticePermission) {
                $result = Notice::orderBy('NoticeID');
            } else {
                $result = Notice::whereRaw(DB::raw("LOCATE('" . (isset($this->Session["kioskpc"]) && $this->Session["kioskpc"] == 1 ? 'Kiosk' : $this->Session["ThisLocation"]) . "', ClubLocation) > 0"))->orderBy('NoticeID');
            }

            $data["notices"] = $result->take($maximumNumberOfNotices)->get();
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }
        return ResponseHelper::sendResponse($data);
    }

    //Edit Notice
    public function editNotice(Request $request) {
        $orderData = array();
        try {
            $requestData = $request->all();

            $query = Notice::where('NoticeID', $requestData['id'])
                ->update(array('Notice' => $requestData['notice']));

            if (isset($query) && $query) {
                $orderData['notice'] = $requestData['notice'];
                $message = "Notice Updated Successfully.";
            } else {
                throw new Exception("Something went wrong. Please try after sometime.", 1);
            }

        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }
        return ResponseHelper::sendResponse($orderData, $message);
    }

    //Change Notice States
    public function toggleNotice(Request $request) {
        $data = array();
        try {
            $requestData = $request->all();
            $State = $requestData['State'];
            $Locations = explode(",", $notices['ClubLocation']);

            $notices = Notice::where('NoticeID', $requestData['NoticeID'])
                ->first()
                ->toArray();


            if (isset($State) && $State == "ON" && !in_array($requestData['ClubLocation'], $Locations)) {
                $Locations[] = $requestData['ClubLocation'];
            } else {
                $Locations = array_diff($Locations, array($requestData['ClubLocation']));
            }

            $Locations = implode(",", $Locations);
            $query = Notice::where('NoticeID', $requestData['NoticeID'])
                ->update(array('ClubLocation' => $Locations));

            if (isset($query) && $query) {
                $data['ClubLocation'] = $Locations;
                $message = "Notice Updated Successfully.";
            } else {
                throw new Exception("Something went wrong. Please try after sometime.", 1);
            }
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }
        return ResponseHelper::sendResponse($data, $message);
    }

    //Add new order
    public function AddOrder(Request $request) {
        $orderData = array();
        try {
            $requestData = $request->all();
            $ProductID = $requestData['ProductID'];
            $ClubLocation = $requestData['ClubLocation'];
            $Quantity = $requestData['Quantity'];
            $TodayDateTime = Date("Y-m-d H:i:s");
            $message = "";

            $insertArray = array(
                            'ProductID'     => $requestData['ProductID'],
                            'ClubLocation'  => $requestData['ClubLocation'],
                            'Quantity'      => $requestData['Quantity'],
                            'EmployeeName'  => $this->Session['EmployeeName'],
                            'DateTime'      => $TodayDateTime,
                            'Status'        => 'PENDING'
                        );

            $insertOrder = ProductOrder::insert($insertArray);
            if(isset($insertOrder) && $insertOrder){
                $message = "Order added successfully.";
            } else {
                throw new Exception("Something went wrong. Please try after sometime.", 1);
            }

        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }
        return ResponseHelper::sendResponse($orderData, $message);
    }

    //Remove order
    public function RemoveOrder(Request $request) {
        $orderData = array();
        try {
            $requestData = $request->all();
            $ProductID = $requestData['ProductID'];
            $ClubLocation = $requestData['ClubLocation'];

            $deleteOrder = ProductOrder::where(array('ClubLocation' => $ClubLocation, 'ProductID' => $ProductID))->delete();
            if(isset($deleteOrder) && $deleteOrder){
                $query = Product::select('Product.ProductID', 'Product.Name', 'Product.Price', 'ProductInventory.ClubLocation', 'ProductInventory.Quantity', 'ProductOrder.Quantity  AS PendingQty')
                        ->Join('ProductInventory', 'product.ProductID', '=', 'ProductInventory.ProductID')
                        ->leftjoin("ProductOrder",function($join){
                            $join->on("ProductOrder.ProductID","=","product.ProductID")
                                ->on("ProductOrder.ClubLocation","=","ProductInventory.ClubLocation");
                        })
                        ->where('Product.IncludeInInventory', 1)
                        ->orderBy('Name', 'ASC');

            $orderData["totalRecords"] = $query->count();
            $orderData["inventoryData"] = $query->groupBy('Product.ProductID')
                                        ->skip(0)
                                        ->take(10)
                                        ->get();

            $message = "Order deleted successfully.";
            } else {
                throw new Exception("Something went wrong. Please try after sometime.", 1);
            }

        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }
        return ResponseHelper::sendResponse($orderData, $message);
    }

}
