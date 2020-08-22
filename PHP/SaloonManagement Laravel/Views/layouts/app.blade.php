<!DOCTYPE html>
<html lang="{{ config('app-locale') }}" ng-app="TanLinkApp">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>{{config('app.name', 'Tan-Link')}}</title>

        
        <!-- Bootstrap -->
        <link rel="stylesheet" href="{{ asset('css/bootstrap/css/bootstrap.min.css') }}"  />
        <link rel="stylesheet" href="{{ asset('css/font-awesome/css/font-awesome.min.css') }}" />
        <link rel="stylesheet" href="{{ asset('css/feather.css') }}" />
        <link rel="stylesheet" href="{{ asset('css/jquery.fancybox.css') }}">
        
        <link href="{{ asset('css/ngDialog.min.css') }}" rel="stylesheet" />
        <link href="{{ asset('css/select2.min.css') }}" rel="stylesheet" />

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

        <script src="{{ asset('js/jquery.validate.js') }}"></script>
        <script src="{{ asset('js/select2.full.min.js') }}"></script>
        <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>

        <!-- AngularJS Libraries -->
        <script src="{{ asset('scripts/libraries/angular.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/angular-animate.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/angular-sanitize.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/ui-bootstrap-tpls-2.5.0.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/ngStorage.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/angular-validate.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/angucomplete-alt.js') }}"></script>
        <script src="{{ asset('scripts/libraries/ngDialog.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/toaster.min.js') }}"></script>
        <script src="{{ asset('scripts/libraries/angular-timeago.js') }}"></script>
        <script src="{{ asset('scripts/libraries/tinymce.js') }}"></script>
        <script src="{{ asset('scripts/libraries/dattimepicker.js') }}"></script>


        <script src="{{ asset('scripts/common/constant.js') }}"></script>
        <script src="{{ asset('scripts/js/common.js') }}"></script>
        <script src="{{ asset('scripts/common/app.js') }}"></script>
        <script src="{{ asset('scripts/common/filters.js') }}"></script>
        <script src="{{ asset('scripts/common/directives.js') }}"></script>

        <script src="{{ asset('scripts/services/auth.service.js') }}"></script>
        <script src="{{ asset('scripts/services/message.service.js') }}"></script>
        <script src="{{ asset('scripts/services/app.service.js') }}"></script>

        @yield('pagescripts')
    </head>
    <body ng-cloak>
        <section class="page">
            <div class="@yield('containerClass', 'container')">
                @yield('content')
            </div>
        </section>
    </body>
</html>
