<?php

namespace App\Http\Controllers;

use App\Helpers\OptionHelper;
use App\Helpers\ResponseHelper;
use App\Helpers\UserHelper;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductInventory;
use DB;
use File;
use Illuminate\Http\Request;
use Response;
use Validator;

class InventoryController extends Controller
{
    private $session;

    public function __construct()
    {
        $this->session = UserHelper::session();
    }

    public function index()
    {
        $data = array();
        $data['categories'] = ProductCategory::orderBy('ProductCategory')->get();
        return view('inventory')->with($data);
    }

    public function searchInventories(Request $request)
    {
        $data = array();

        try {
            $searchInput = $request->input('search', '');
            $sort_by = $request->input('sort_by', '');
            $sort_order = $request->input('sort_order', 'DESC');
            $offset = $request->input('offset', 0);
            $limit = $request->input('limit', 10);

            $query = null;
            if (!empty($searchInput)) {
                $query = Product::where('Name', 'LIKE', '%' . $searchInput . '%')
                    ->orWhere('UPC', $searchInput)
                    ->orWhere('ProductCategory', $searchInput);
            } else {
                $query = $data["inventories"] = Product::where('ProductID', '>', 0);
            }

            $data["totalRecords"] = $query->count();

            if($sort_by != '') {
                $query = $query->orderBy($sort_by, $sort_order);
            } else {
                $query = $query->orderBy(DB::raw('FIELD(IncludeInInventory, 1, 0), Name'));
            }

            $data["inventories"] = $query->skip($offset)
                                        ->take($limit)
                                        ->get();

            $data["enableOnlineStore"] = OptionHelper::getOpt("EnableOnlineStore");
            $data["updateProductCostPermission"] = UserHelper::hasPerm(OptionHelper::getOpt("SecurityLevelUpdateProductCost"));

        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse($data);
    }

    public function addProduct(Request $request)
    {
        try
        {
            $validationResult = $this->validateInventory($request);

            if ($validationResult['success'] == false) {
                return ResponseHelper::sendError($validationResult['message'], $validationResult['data']);
            }
            // $existingProductsCount = Product::where(['UPC' => $input["UPC"]])->where('UPC', '<>', '')->count();

            // if($existingProductsCount > 0) {
            //     return $this->sendError('Product already exists.');
            // }
            $input = $request->all();
            $input["ProductType"] = "Products";
            $input["UPC"] = strlen($input["UPC"]) == 0 ? "" : $input["UPC"];
            $input["Keywords"] = implode(",", explode(" ", $input["Name"]));
            $input["PriceIncludesTax"] = OptionHelper::getOpt("PriceIncludesTax") ? 1 : 0;

            // Create Product
            $product = Product::create($input);

            // Upload & Update Product Image
            $this->uploadProductImage($request, $product);

            $ClubLocations = explode(",", OptionHelper::getOpt("ListOfAllLocations"));

            $productInventories = array();
            foreach ($ClubLocations as $ClubLocation) {
                $inventory = array(
                    "ProductID" => $product->ProductID,
                    "ClubLocation" => $ClubLocation,
                    "EmployeeName" => $this->session["EmployeeName"],
                    "Quantity" => 0,
                    "RequestQty" => 0,
                    "Notes" => "New Product Added",
                );
                array_push($productInventories, $inventory);
            }

            // Insert in Product Inventory
            ProductInventory::insert($productInventories);
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse([], "Product created successfully.");
    }

    public function updateProduct(Request $request, $id)
    {
        try
        {
            $validationResult = $this->validateInventory($request, $id);

            if ($validationResult['success'] == false) {
                return ResponseHelper::sendError($validationResult['message'], $validationResult['data']);
            }

            $input = $request->all();
            $product = Product::findOrFail($id);
            $product->Name = $input["Name"];
            $product->Keywords = implode(",", explode(" ", $input["Name"]));
            $product->UPC = strlen($input["UPC"]) == 0 ? "" : $input["UPC"];
            $product->Description = $input["Description"];
            $product->Price = $input["Price"];
            $product->CommissionPercent = $input["CommissionPercent"];
            $product->ChargeTax = $input["ChargeTax"];
            $product->IncludeInInventory = $input["IncludeInInventory"];

            $enableOnlineStore = OptionHelper::getOpt("EnableOnlineStore");
            if ($enableOnlineStore && $enableOnlineStore != "") {
                $product->IsAvailableOnline = $input["IsAvailableOnline"];
            }

            $canUpdateCost = UserHelper::hasPerm(OptionHelper::getOpt("SecurityLevelUpdateProductCost"));
            if ($canUpdateCost) {
                $product->Cost = $input["Cost"];
            }

            // Update Product
            $product->save();

            // Upload & Update Product Image
            $this->uploadProductImage($request, $product);
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse([], "Product updated successfully.");
    }

    public function deleteProductImage($id) {
        try {
            $product = Product::findOrFail($id);

            // Remove old image from server
            $this->removeOldProductImage($product->ImageLink);
            
            $product->ImageLink = null;
            
            // Update product
            $product->save();
        } catch (Exception $e) {
            return ResponseHelper::sendError($e->getMessage());
        }

        return ResponseHelper::sendResponse([], "Product image deleted successfully.");
    }

    private function validateInventory(Request $request, $id = -1)
    {
        $result = array(
            'success' => true,
            'message' => null,
            'data' => []
        );
        $validator = Validator::make($request->all(), [
            'UPC' => 'unique:product' . ($id > 0 ? ',UPC,' . $id . ',ProductID' : ''),
            'Name' => 'required|max:255',
            'ProductCategory' => 'required',
            'Price' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'Cost' => ($id == -1 ? 'required' : '') . '|regex:/^\d+(\.\d{1,2})?$/',
            'CommissionPercent' => 'required|regex:/^\d+(\.\d{1,2})?$/',
        ], [
            'UPC.unique' => ($id > 0 ? 'Product with this UPC codey already exists.' : 'Product with already exists.'),
        ]);

        if ($validator->fails()) {
            return array(
                'success' => false,
                'message' => 'validation_error',
                'data' => $validator->errors(),
            );
        }

        $input = $request->all();

        if ((strlen($input["UPC"]) > 0 && strlen($input["UPC"]) != 12) || ctype_alpha($input["UPC"])) {
            return array(
                'success' => false,
                'message' => 'UPC must be 12 Digits long, numbers only. Otherwise leave empty.',
                'data' => []
            );
            return ResponseHelper::sendError();
        }

        return $result;
    }

    private function uploadProductImage(Request $request, $product)
    {
        if ($request->hasFile('image')) {
            if ($product->ImageLink != null) {
                $this->removeOldProductImage($product->ImageLink);
            }

            $imageName = 'pkg_' . $product->ProductID . '.' . $request->image->getClientOriginalExtension();

            $DocumentsDirectory = OptionHelper::getOpt("DocumentsDirectory");
            $productsDirectory = "$DocumentsDirectory/Documents";

            if (!File::isDirectory($productsDirectory)) {
                File::makeDirectory($productsDirectory, 0777, true, true);
            }

            $request->image->move($productsDirectory, $imageName);

            $product->ImageLink = $productsDirectory . '/' . $imageName;

            // Update Product
            $product->save();
        }
    }

    private function removeOldProductImage($productImage) {
        $productImage = public_path($productImage); // get previous image from folder
        if (File::exists($productImage)) { // unlink or remove previous image from folder
            unlink($productImage);
        }
    }

}
