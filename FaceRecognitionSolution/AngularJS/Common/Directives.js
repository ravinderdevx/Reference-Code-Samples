Demo.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                })
            });
        }
    }
});

Demo.directive('applyValidate', function () {
    return function (scope, element, attrs) {
        $(element).validate();
    };
});

Demo.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { 'event': event });
                });
                event.preventDefault();
            }
        });
    };
});

Demo.directive('applySwitch', function () {
    return function (scope, element, attrs) {
        element.lc_switch();
    };
});


Demo.directive('applySignature', function () {
    return function (scope, element, attrs) {
        setTimeout(function () {
            element.jSignature({ 'UndoButton': false })
        }, 1000);
    };
});

Demo.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});


Demo.directive('datePicker', function ($window) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            setTimeout(function () {
                debugger;
                var today = new Date();
                var yyyy = today.getFullYear();

                maxDate = 01 + '/' + 31 + '/' + (yyyy-17);

                $(element).daterangepicker({
                    parentEl: "#dobContainer",
                    singleDatePicker: true,
                    showDropdowns: true,
                    maxDate: maxDate,
                    minDate: "01/01/1900",
                    startDate: maxDate,
                    autoUpdateInput: false
                }).val('');

                $(element).on('apply.daterangepicker', function (ev, picker) {
                    $(element).val(picker.startDate.format('MM/DD/YYYY'));

                    ngModelCtrl.$setViewValue(picker.startDate.format('MM/DD/YYYY'));
                    scope.$apply();
                });
            }, 100);
        }
    };
});

Demo.directive('applyPasswordTooltipseter', function () {
    return function (scope, element, attrs) {
        setTimeout(function () {
            $(element).focusin(function () {
                //if ($(element).attr('data-tooltip') == 'true') {
                    var dataBox = $(this).parent().find(".validation-tooltip");
                    //$(this).next('label.error').hide();
                    //$(dataBox).css('top', -($(dataBox).height() / 2));
                    //$(dataBox).css('left', ($(element).width() + 10));
                    dataBox.show();
                //}

                /* Password check */
                $(element).keyup(function () {
                    //var IsValid = true;
                    checkVal = $(this).val();
                    if (checkVal.length >= 8) {
                        $('.passLength').addClass('true');
                    } else {
                        $('.passLength').removeClass('true');
                        //IsValid = false;
                    }

                    if (checkVal.match(/\d+/g) != null) {
                        $('.passNumber').addClass('true');
                    } else {
                        $('.passNumber').removeClass('true');
                       // IsValid = false;
                    }

                    if(checkVal.match(/[A-Z]/) != null){
                        $('.passUppercase').addClass('true');
                    } else{
                        $('.passUppercase').removeClass('true');
                        //IsValid = false;
                    }

                    /*            
                    if(checkVal.match(/[!@#%]/) != null){
                        $('.passSpecial').addClass('true');
                    } else{
                        $('.passSpecial').removeClass('true');
                    }*/
                    
                    if (checkVal.match(/[a-z]/) != null) {
                        $('.passLowercase').addClass('true');
                    } else {
                        $('.passLowercase').removeClass('true');
                        //IsValid = false;
                    }

                    //if (IsValid == true) {
                    //    $(element).siblings('img').removeClass('hide');
                    //} else {
                    //    $(element).siblings('img').addClass('hide');
                    //}
                })
            })

            $(element).focusout(function () {
                var dataBox = $(this).parent().find(".validation-tooltip");
                dataBox.hide();
               
            });

            $(element).blur(function () {
                var elementValue = $(element).val();
                if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(elementValue)) {
                    $(element).siblings('img').removeClass('hide');
                } else {
                    $(element).siblings('img').addClass('hide');
                }
            });
        }, 100);
    };
});
