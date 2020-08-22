@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-sm-12">
        <div class="customerListing">
            @if($NumberOfCustomersFound == 0)
                <div class="alert alert-warning">
                    No Customer Found - try a different name or account number
                </div>
            @elseif($NumberOfCustomersFound == 1)
                <script>
                    redirect('{{$RedirectTo}}')
                </script>
            @elseif($NumberOfCustomersFound > 0)
                @if(count($activeCustomers) > 0)
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h4>Active Members</h4>
                        </div>
                        <div class="panel-body">
                            @foreach($activeCustomers as $row)
                                <div class="customerInfo">
                                    @if ($MemberNameAccount == "PictureIDSearch" && strpos($Matches, ',') == true && $IsEnablePictureIDSearch == 1)
                                        <div class="imageThumb"> <img class="img-thumbnail" src="{{asset('images/nash.jpg')}}" /></div>
                                    @endif
                                    <div class="cusDesc">
                                        <h3>
                                            <a href="javascript:void(0)" onclick="redirect('CustomerInfo.php?AccountID={{$row->AccountID}}&SkipBedSetting={{$SkipBedSetting}}&TanLogTime={{$TanLogTime}}')">
                                                {{$row->FirstName}} {{$row->LastName}} [{{$row->ClubLocation}}]
                                                @if (strtotime($row->LastTanDateTime) !== false)
                                                <h4>
                                                    <strong>Last Tan: </strong>
                                                    <span class="red">{{Date("n/j/Y g:i A", strtotime($row->LastTanDateTime))}} in
                                                            {{$row->LastTanEquipment}}
                                                    </span>
                                                </h4>
                                                @endif
                                            </a>
                                        </h3>
                                        <h4>
                                            <?php
                                                $addressString = "$row->Address,$row->City,$row->State,$row->ZipCode";
                                                $addressArr = array_filter(explode(",", $addressString), function($value) {
                                                                return !empty($value) && trim($value) != "";
                                                            });
                                                
                                                $newAddressString = implode(", ", $addressArr);
                                                echo $newAddressString != "" ? $newAddressString : "Address not available";

                                            ?>
                                            
                                        </h4>
                                        <p>
                                            <?php
                                                $phoneString = "$row->HomePhone,$row->CellPhone,$row->WorkPhone";
                                                $phonesArr = array_filter(explode(",", $phoneString), function($value) {
                                                                return !empty($value) && trim($value) != "";
                                                            });
                                                
                                                $newPhoneString = implode(", ", $phonesArr);

                                            ?>
                                            <strong>Phone:</strong> {{$newPhoneString != "" ? $newPhoneString : "Not avaialble"}}
                                        </p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                @if(count($inactiveCustomers) > 0)
                    <div class="panel panel-primary">
                        <div class="panel-heading">
                            <h4>Non-Active Members</h4>
                        </div>
                        <div class="panel-body">
                            @foreach($inactiveCustomers as $row)
                            <div class="customerInfo">
                                    @if ($MemberNameAccount == "PictureIDSearch" && strpos($Matches, ',') == true && $IsEnablePictureIDSearch == 1)
                                        <div class="imageThumb"> <img class="img-thumbnail" src="{{asset('images/nash.jpg')}}" /></div>
                                    @endif
                                    <div class="cusDesc">
                                        <h3>
                                            <a href="javascript:void(0)"  onclick="redirect('CustomerInfo.php?AccountID={{$row->AccountID}}&SkipBedSetting={{$SkipBedSetting}}&TanLogTime={{$TanLogTime}}')">
                                                {{$row->FirstName}} {{$row->LastName}} [{{$row->ClubLocation}}]
                                                @if (strtotime($row->LastTanDateTime) !== false)
                                                <h4><strong>Last Tan: </strong><span
                                                        class="red">{{Date("n/j/Y g:i A", strtotime($row->LastTanDateTime))}} in
                                                        {{$row->LastTanEquipment}}</span></h4>
                                                @endif
                                            </a>
                                        </h3>
                                        <h4>
                                                <?php
                                                    $addressString = "$row->Address,$row->City,$row->State,$row->ZipCode";
                                                    $addressArr = array_filter(explode(",", $addressString), function($value) {
                                                                    return !empty($value) && trim($value) != "";
                                                                });
                                                    
                                                    $newAddressString = implode(", ", $addressArr);
    
                                                ?>
                                                {{$newAddressString != "" ? $newAddressString : "Address not available" }}
                                            </h4>
                                            <p>
                                                <?php
                                                    $phoneString = "$row->HomePhone,$row->CellPhone,$row->WorkPhone";
                                                    $phonesArr = array_filter(explode(",", $phoneString), function($value) {
                                                                    return !empty($value) && trim($value) != "";
                                                                });
                                                    
                                                    $newPhoneString = implode(", ", $phonesArr);
    
                                                ?>
                                                <strong>Phone:</strong> {{$newPhoneString != "" ? $newPhoneString : "Not avaialble"}}
                                            </p>

                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            @endif
        </div>
    </div>


@endsection