// lazyload config
angular.module('app.lazyload', [])
  /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
      wysiwyg: [
        'assets/plugins/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
        'assets/plugins/bootstrap-wysiwyg/external/jquery.hotkeys.js'
      ],
      chosen: [
        'assets/plugins/chosen/chosen.jquery.min.js',
        'assets/plugins/bootstrap-chosen/bootstrap-chosen.css'
      ],
      d3: [
        'assets/plugins/d3/d3.min.js'
      ],
      nvD3: [
        'assets/plugins/nvd3/nv.d3.min.js'
      ]
    }
  )

  // oclazyload config
  .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
      debug: true,
      events: true,
      modules: [
        {
          name: 'ngImgCrop',
          files: [
            'assets/plugins/ng-img-crop/compile/minified/ng-img-crop.js',
            'assets/plugins/ng-img-crop/compile/minified/ng-img-crop.css'
          ]
        },
        {
          name: 'signature',
          files: [
            'assets/plugins/signature_pad/signature_pad.min.js',
            'assets/plugins/angular-signature/src/signature.js'
          ]
        },
        {
          name: 'ngCkeditor',
          files: [
            'assets/plugins/ckeditor/lib/ckeditor.js',
            'assets/plugins/ckeditor/ng-ckeditor.min.js',
            'assets/plugins/ckeditor/ng-ckeditor.css'
          ]
        },
        {
          name: 'nvd3',
          files: [
            'assets/plugins/nvd3/nv.d3.min.css',
            'assets/plugins/angular-nvd3/angular-nvd3.min.js'
          ]
        }
      ]
    });
  }]);