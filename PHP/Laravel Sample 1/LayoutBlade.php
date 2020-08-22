<!DOCTYPE html>
<html lang="{{ config('app-locale') }}" ng-app="TanLinkApp">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{config('app.name', 'Tan-Link')}} - {{$SaloonData['BusinessName']}}</title>


    <!-- Bootstrap -->
    <link rel="stylesheet" href="{{ asset('css/bootstrap/css/bootstrap.min.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/font-awesome/css/font-awesome.min.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/feather.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/jquery.fancybox.css') }}">

    <link href="{{ asset('css/custom.css') }}" rel="stylesheet" />

    @yield('pagestyles')

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

    <!-- jQuery 3 -->
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/moment.min.js') }}"></script>
    <script src="{{ asset('js/jquery.fancybox.min.js') }}"></script>

    <!-- Bootstrap 3.3.7 -->
    <script src="{{ asset('js/bootstrap.min.js') }}"></script>

    @yield('pagescripts')
</head>

<body ng-cloak>

    <section class="page">
        <div class="@yield('containerClass', 'container')">
            <div class="row">
                <div class="col-sm-12">
                    <div class="loclogo">
                        <img src="{{ asset('images/tan-link-logo.png') }}" alt="image" width="160"/>
                        <div class="logOut">    
                            <a href="{{ url('/logout') }}"><img src="{{ asset('images/logout.png') }}" alt="image" width="20"/>Logout</a>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="locHead">
                        <h1>{{$BusinessName}}</h1>
                    </div>
                </div>
            </div>
            @yield('content')
        </div>
    </section>
</body>

</html>