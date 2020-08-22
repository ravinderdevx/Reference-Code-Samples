@extends("layouts.basic")

@section("containerClass", "container")

@section("content")

<section class="locationPage">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="locPanel">
                    <div class="panel-group">
                        <div class="panel panel-default">
                            <div class="panel-heading">Pick Location</div>
                            <div class="panel-body">
                                @foreach ($Locations as $key => $row)
                                <div class="locBtn">    
                                    <a class="btn btn-default" href="{{url('/clublocation/'.$row['ClubLocation'])}}">{{$row['ClubLocation']}}</a>
                                </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section("pagescripts")
<script src="{{ asset("scripts/controllers/home.controller.js") }}"></script>
@endsection