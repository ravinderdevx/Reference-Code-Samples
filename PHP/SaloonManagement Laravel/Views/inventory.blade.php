@extends('layouts.app')

@section('content')
@verbatim
<div class="row" ng-controller="InventoryController">
    <div class="alert" ng-class="messageObject.Class" ng-bind="messageObject.Text" ng-show="messageObject"></div>
    <div class="col-sm-12">
        <div class="productListing">
            <h3>Product List</h3>
            <button class="btn btn-primary" ng-click="openAddProductPopup(-1)">ADD</button>
            <div class="row">
                <div class="col-sm-6 col-xs-12 pull-left">
                    <select class="form-control pagesize_options" ng-model="PageSize"
                        ng-options="selectedItem*1 as selectedItem for selectedItem in PageSizeOptions"
                        ng-change="searchInventories()"></select>
                    <strong> Records</strong>
                </div>
                <div class="col-sm-4 col-sm-offset-2 col-xs-12 pull-right">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search" ng-model="search"
                            ng-enter="searchInventories()" />
                        <div class="input-group-addon" ng-click="searchInventories()">
                            <span class="input-group-text"><i class="glyphicon glyphicon-search"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="box box-primary">
            <!-- /.box-header -->
            <div id="PointsListing" class="box-body no-padding">
                <table class="table table-bordered table-striped" id="ContentTable">
                    <thead>
                        <tr>
                            <th class="sorting" ng-click="changeSorting('ProductCategory')">
                                <span class="sortable"
                                    ng-class="sort.column=='ProductCategory'?sort.className:''">Category</span>
                            </th>
                            <th class="sorting" ng-click="changeSorting('UPC')">
                                <span class="sortable" ng-class="sort.column=='UPC'?sort.className:''">UPC</span>
                            </th>
                            <th class="sorting" ng-click="changeSorting('Name')">
                                <span class="sortable" ng-class="sort.column=='Name'?sort.className:''">Name</span>
                            </th>
                            <th><span>Price</span></th>
                            <th><span>Charge Tax</span></th>
                            <th><span>Cost</span></th>
                            <th><span>Commission</span></th>
                            <th><span>Stock</span></th>
                            <th ng-if="enableOnlineStore && enableOnlineStore != ''"><span>Available Online</span></th>
                            <th ng-if="enableOnlineStore && enableOnlineStore != ''"><span>Image</span></th>
                            <th><span>Action</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="inventory in inventoryList track by $index"
                            ng-show="!showLoading && inventoryList.length > 0">
                            <td>{{inventory.ProductCategory}}</td>
                            <td>{{inventory.UPC}}</td>
                            <td>{{inventory.Name}}</td>
                            <td>{{inventory.Price | currency : "$" : 2}}</td>
                            <td>{{inventory.ChargeTax?'Yes':'No'}}</td>
                            <td>{{inventory.Cost | currency : "$" : 2}}</td>
                            <td>{{inventory.CommissionPercent}}</td>
                            <td>{{inventory.IncludeInInventory?'Yes':'No'}}</td>
                            <td ng-if="enableOnlineStore && enableOnlineStore != ''">
                                {{inventory.IsAvailableOnline?'Yes':'No'}}</td>
                            <td ng-if="enableOnlineStore && enableOnlineStore != ''">
                                <div class="imageSection">
                                    <a rel="ligthbox" href="{{inventory.ImageLink}}" apply-fancybox
                                        ng-if="inventory.ImageLink">
                                        <img ng-src="{{inventory.ImageLink}}" class="ImageProduct" height="50"
                                            width="50" />
                                    </a>

                                    <img src="<?php echo asset('images/no-image.jpg'); ?>" class="ImageProduct"
                                        height="50" width="50" ng-if="!inventory.ImageLink" />
                                </div>
                            </td>
                            <td class="ellipse action-btns">
                                <a href="javascript:void(0)" class="text-primary" title="EDIT"
                                    ng-click="openAddProductPopup($index)"><i class="feather icon-edit"></i></a>
                                <a href="javascript:void(0)" class="text-danger" title="IMAGE DELETE"
                                    ng-click="deleteProductImage(inventory.ProductID, $index)"
                                    ng-if="inventory.ImageLink"><i class="feather icon-file-minus"></i></a>
                            </td>
                        </tr>
                        <tr ng-show="showLoading || (!inventoryList || inventoryList.length == 0)">
                            <td colspan="{{colspan}}" ng-if="!showLoading && inventoryList.length == 0">
                                <center>No data found.</center>
                            </td>
                            <td colspan="{{colspan}}" ng-if="showLoading">
                                <center>Please Wait While Data is Loading...</center>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="tableFooter" ng-show="!showLoading && TotalItems > PageSize">
                    <div class="row">
                        <div class="col-md-4 mt-1">
                            <span class="page-number-info">
                                <strong>Page : </strong> {{PageNo}}/{{TotalPage}}</span>
                        </div>
                        <div class="col-md-8">
                            <ul class="pagination-sm pull-right m-0" uib-pagination force-ellipses="true"
                                boundary-links="true" total-items="TotalItems" ng-model="PageNo"
                                ng-change="getInventories()" max-size="maxSize" items-per-page="PageSize"></ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /.box-body -->
        </div>
    </div>
</div>
@endverbatim


<script type="text/ng-template" id="ProductPopupTemplate">
    <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form name="productForm" id="productForm" enctype="multipart/form-data" autocomplete="off" ng-submit="!submitting && saveProduct()" ng-validate="validationOptions">
                    
                    <div class="modal-header bg-primary">
                        <button type="button" class="close" data-dismiss="modal" ng-click="ngDialog.close()" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4 class="modal-title">@{{productModel.id > 0?'Update':'Add'}} Product</h4>
                    </div>
                    <div class="modal-body">
                        <div ng-class="'alert alert-' + popupMessage.type" ng-show="popupMessage" ng-bind-html="popupMessage.message | unsafe"></div>

                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="upc">UPC Code</label>
                                    <input class="form-control" name="UPC" placeholder="Enter UPC Code" type="text" ng-model="productModel.UPC" ng-disabled="submitting" />
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input class="form-control" name="Name" placeholder="Enter Name" type="text" ng-model="productModel.Name" ng-disabled="submitting" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea class="form-control" name="Description" type="text" ui-tinymce="tinymceOptions" ng-model="productModel.Description" ng-disabled="submitting"></textarea>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="category">Category</label>
                                    <select class="form-control" name="ProductCategory" ng-model="productModel.ProductCategory" ng-disabled="submitting">
                                        <option value="">Select Category</option>
                                        @foreach($categories as $category)
                                            <option value="{{$category->ProductCategory}}">{{$category->ProductCategory}}</option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="price">Price</label>
                                    <input class="form-control" name="Price" placeholder="Enter Price" type="number" min="0" ng-model="productModel.Price" ng-disabled="submitting" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-6" ng-if="!productModel.id || (productModel.id > 0 && updateProductCostPermission)">
                                <div class="form-group">
                                    <label for="cost">Cost</label>
                                    <input class="form-control" name="Cost" placeholder="Enter Cost" type="number" min="0" ng-model="productModel.Cost" ng-disabled="submitting" />
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="commission">Commission %</label>
                                    <input class="form-control" name="CommissionPercent" placeholder="Enter Commission Percent" min="0" type="number" ng-model="productModel.CommissionPercent" ng-disabled="submitting" />
                                </div>
                            </div>
                            
                            <div class="col-sm-6" ng-if="!productModel.id || (productModel.id > 0 && (enableOnlineStore && enableOnlineStore != ''))">
                                <div class="form-group">
                                    <label for="cost">Upload Image</label>
                                    <input class="form-control" name="image" type="file" ng-disabled="submitting" />
                                </div>
                            </div>

                            <div ng-if="productModel.id > 0">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="commission">Charge Tax</label>
                                        <div class="quesInput">
                                            <label>
                                                <input type="radio" name="ChargeTax" value="1" ng-model="productModel.ChargeTax" ng-disabled="submitting" /> Yes
                                                <span class="checkmark"></span>
                                            </label>
                                            <label>
                                                <input type="radio" name="ChargeTax" value="0" ng-model="productModel.ChargeTax" ng-disabled="submitting"  /> No
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label for="commission">Include In Inventory</label>
                                        <div class="quesInput">
                                            <label>
                                                <input type="radio" name="IncludeInInventory" value="1" ng-model="productModel.IncludeInInventory" ng-disabled="submitting" /> Yes
                                                <span class="checkmark"></span>
                                            </label>
                                            <label>
                                                <input type="radio" name="IncludeInInventory" value="0" ng-model="productModel.IncludeInInventory" ng-disabled="submitting" /> No
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6" ng-if="enableOnlineStore && enableOnlineStore != ''">
                                    <div class="form-group">
                                        <label for="commission">Available Online</label>
                                        <div class="quesInput">
                                            <label>
                                                Yes
                                                <input type="radio" name="IsAvailableOnline" value="1" ng-model="productModel.IsAvailableOnline" ng-disabled="submitting" />
                                                <span class="checkmark"></span>
                                            </label>
                                            <label>
                                                No
                                                <input type="radio" name="IsAvailableOnline" value="0" ng-model="productModel.IsAvailableOnline" ng-disabled="submitting" />
                                                <span class="checkmark"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-sm btn-primary" ng-disabled="submitting">
                            Save
                        </button>
                        <button type="button" class="btn btn-sm btn-default" ng-click="ngDialog.close()" ng-disabled="submitting">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
            <!-- /.modal-content -->
        </div>
    </script>
@endsection

@section('pagescripts')
<script src="{{ asset('scripts/controllers/inventory.controller.js') }}"></script>
@endsection