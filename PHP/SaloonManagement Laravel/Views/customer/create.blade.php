@extends('layouts.app')

@section('content')
<div class="row" ng-controller="NewCustomerController">
    <div class="col-sm-10 col-sm-offset-1 col-xs-12">
        <div class="row">
            <div class="col-sm-12">
                {{-- <h3 class="mb-30">Add New Customer</h3> --}}
                <div ng-class="'alert alert-' + messageObject.type" ng-show="messageObject" ng-bind-html="messageObject.message | unsafe"></div>
                <div class="form-group">
                    <label for="scanLicense">Scan Drivers License Here</label>
            
                    <div class="input-group">
                        <input type="text" class="form-control" name="LicenseScan" placeholder="Scan Drivers License Here"
                            ng-enter="onLicenseScan()" ng-model="scanDriverLicense" ng-disabled="showLoading" />
                        <div class="input-group-btn">
                            <button class="btn btn-primary" ng-click="onLicenseScan()">SCAN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <form name="newCustomerForm" id="newCustomerForm" enctype="multipart/form-data" autocomplete="off"
            ng-submit="!showLoading && saveCustomer()" ng-validate="validationOptions">
            <input type="hidden" name="_token" value="{{ csrf_token() }}">

            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="fname">First Name <span class="red">*</span></label>
                        <input class="form-control" name="FirstName" placeholder="Enter First Name" type="text"
                            ng-model="customerModel.FirstName" ng-disabled="showLoading" />
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="fname">Last Name <span class="red">*</span></label>
                        <input class="form-control" name="LastName" placeholder="Enter Last Name" type="text"
                            ng-model="customerModel.LastName" ng-disabled="showLoading" />
                    </div>
                </div>

                @verbatim
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="fname">Date of Birth <span class="red">*</span></label>
                        
                        <div class="input-group ui-datepicker">
                            <input type="text" 
                                    name="BirthDate"
                                    class="form-control" 
                                    uib-datepicker-popup="{{format}}"
                                    ng-model="customerModel.BirthDate" 
                                    is-open="opened"
                                    datepicker-options="dateOptions"
                                    close-text="Close"
                                    placeholder="MM/DD/YYYY" 
                                    ng-click="opened = true"
                                    readonly="readonly"
                                    />
                            <span class="input-group-addon" ng-click="opened = true">
                                <i class="fa fa-calendar"></i>
                            </span>
                        </div>
                        <label id="BirthDate-error" class="error" for="BirthDate" style="display:none;"></label>
                    </div>
                </div>
                @endverbatim

                @if($WaiveNewCustomerFullInfoRequirement != 1)
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="email">Email <span class="red">*</span></label>
                        <input class="form-control" name="Email" placeholder="Enter Email" type="text"
                            ng-model="customerModel.Email" ng-disabled="showLoading" />
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="fname">Cell Phone Number <span class="red">*</span></label>
                        <input class="form-control" name="CellPhone" placeholder="Enter Cell Phone Number" type="text"
                            ng-model="customerModel.CellPhone" ng-disabled="showLoading" />
                    </div>
                </div>




                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="driverlicense">Driver License #</label>
                        <input class="form-control" name="DriverLicense" placeholder="Enter Driving License" type="text"
                            ng-model="customerModel.DriverLicense" ng-disabled="showLoading" />
                    </div>
                </div>
                @endif
            </div>


            @if($WaiveNewCustomerFullInfoRequirement != 1)
            <div class="row">
                <div class="col-xs-12 col-sm-6">
                    <div class="form-group">
                        <label for="address">Address <span class="red">*</span></label>
                        <input class="form-control" name="Address" placeholder="Enter Address" type="text"
                            ng-model="customerModel.Address" ng-disabled="showLoading" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-2">
                    <div class="form-group">
                        <label for="city">City <span class="red">*</span></label>
                        <input class="form-control" name="City" placeholder="Enter City" type="text"
                            ng-model="customerModel.City" ng-disabled="showLoading" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-2">
                    <div class="form-group">
                        <label for="city">State <span class="red">*</span></label>
                        <input class="form-control" name="State" placeholder="Enter State" type="text"
                            ng-model="customerModel.State" ng-disabled="showLoading" />
                    </div>
                </div>
                <div class="col-xs-12 col-sm-2">
                    <div class="form-group">
                        <label for="city">Zip Code <span class="red">*</span></label>
                        <input class="form-control" name="ZipCode" placeholder="Enter Zip Code" type="text"
                            ng-model="customerModel.ZipCode" ng-disabled="showLoading" />
                    </div>
                </div>
            </div>


            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="scanLicense">Skin Type <span class="red">*</span></label>

                        <textarea rows="6" class="form-control" name="SkinType" placeholder="1 - Always burns easily; never tans
    2 - Always burns easily; tans minimally
    3 - Burns moderately; tans gradually
    4 - Burns minimally; always tans well
    5 - Rarely burns; tans perfectly
    6 - Never burns; deeply pigmented" ng-model="customerModel.SkinType" ng-disabled="showLoading"></textarea>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="email">How did you hear about us? <span class="red">*</span></label>
                        <input class="form-control" name="HowHeardAboutUs" placeholder="How did you hear about us?"
                            type="text" ng-model="customerModel.HowHeardAboutUs" ng-disabled="showLoading" />
                    </div>
                </div>

                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="referredby">Who referred you? <span class="red">*</span></label>
                        <input class="form-control" name="ReferredBy" placeholder="Who referred you?" type="text"
                            ng-model="customerModel.ReferredBy" ng-disabled="showLoading" />
                    </div>
                </div>
            </div>
            @endif

            <div class="row">
                <div class="col-xs-12 col-sm-12">
                    <button class="btn btn-primary pull-right">CREATE ACCOUNT</button>
                </div>
            </div>
        </form>
    </div>
</div>

@verbatim
<script type="text/ng-template" id="ExistingCustomerPopupTemplate">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" ng-click="ngDialog.close()" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Please Check Found Possible Matches</h4>
                <p><strong class="red">Note:</strong> Check to make sure none of the accounts listed below belong to this member before creating a new account.</p>
            </div>

            <div class="modal-body search-matches">
                <div class="customerInfo" ng-repeat="customer in customerList track by $index">
                    <div class="cusDesc d-inline-block">
                        <h3>
                            <a href="javascript:void(0)" data-url="CustomerInfo.php?AccountID={{customer.AccountID}}" onclick="redirect(this.getAttribute('data-url'))">
                                {{customer.FirstName}} {{customer.LastName}}
                            </a>
                        </h3>
                        <h4>
                            <strong>Date of Birth:</strong> {{customer.BirthDate}}
                        </h4>
                        <p>
                            {{customer.Address}}, {{customer.City}}, {{customer.State}}, {{customer.ZipCode}}
                        </p>
                    </div>
                    <div class="selectCustomerBtn">
                        <button type="button" class="btn btn-primary" data-url="CustomerInfo.php?AccountID={{customer.AccountID}}" onclick="redirect(this.getAttribute('data-url'))">SELECT</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-default" ng-click="ngDialog.close()">Back</button>
                <button class="btn btn-primary" ng-click="saveCustomer(true)">No Accounts Match This Member - Create New Account</button>
            </div>
        </div>
    </div>
</script>
@endverbatim

@endsection

@section('pagescripts')
<script src="{{ asset('scripts/controllers/customer.controller.js') }}"></script>
@endsection