
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

Demo.directive('ngScroll', function ($window) {
    return {
        link: function (scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var e = jQuery(element[0]);
            var doc = jQuery(document);
            var scrollAllowed = true;
            angular.element(document).bind('scroll', function () {
                if ((doc.scrollTop() + offset >= doc.innerHeight() - $window.innerHeight - offset) && scrollAllowed) {
                    scope.$apply(attrs.ngScroll);
                    //scrollAllowed = false;
                    setTimeout(function () {
                        scrollAllowed = true;
                    }, 1500);
                }
            });
        }
    };
});

Demo.directive('datepicker', ['$parse', function ($parse) {
    var directiveDefinitionObject = {
        restrict: 'A',
        link: function postLink(scope, iElement, iAttrs) {
            iElement.datepicker({
                dateFormat: 'mm/dd/yy',
                onSelect: function (dateText, inst) {
                    scope.$apply(function (scope) {
                        $parse(iAttrs.ngModel).assign(scope, dateText);
                    });
                }
            });
        }
    };
    return directiveDefinitionObject;
}]);


Demo.directive('applySelect2', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                //var url = $parse(attrs.applySelect2)(scope);
                $(element).select2({
                    placeholder: "Click here to enter your tags",
                    tags: [],
                    multiple: true,
                    allowClear: true,
                    createSearchChoice: function (term, data) {
                        if ($(data).filter(function () {
						  return this.text.localeCompare(term) === 0;
                        }).length === 0) {
                            var pattern = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9.&+#' /-]*$/);
                            if (term.trim() != '' && pattern.test(term)) {
                                return {
                                    id: term.trim(),
                                    text: term.trim()
                                };
                            }
                        }
                    },
                    formatNoMatches: function () {
                        return "Please enter valid characters";
                    },
                    ajax: {
                        url: API.GET_TAGS_API,
                        dataType: 'json',
                        type: "GET",
                        quietMillis: 250,
                        data: function (term) {
                            return {
                                q: term
                            };
                        },
                        results: function (data) {
                            return {
                                results: $.map(data.TagsData, function (item) {
                                    return {
                                        id: item.TagName,
                                        text: item.TagName
                                    }
                                })
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in 
                });
            }, 1000);
        }
    };
});

Demo.directive('select2', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                //var url = $parse(attrs.applySelect2)(scope);
                $(element).select2({
                    placeholder: "Click here to enter your tags",
                    tags: [],
                    multiple: true,
                    allowClear: true,
                    ajax: {
                        url: API.GET_TAGS_API,
                        dataType: 'json',
                        type: "GET",
                        quietMillis: 250,
                        data: function (term) {
                            return {
                                q: term
                            };
                        },
                        results: function (data) {
                            return {
                                results: $.map(data.TagsData, function (item) {
                                    return {
                                        id: item.TagId,
                                        text: item.TagName
                                    }
                                })
                            };
                        }
                    },
                    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
                    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in 
                });
            }, 1000);
        }
    };
});

Demo.directive('applyTooltip', ['$parse', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).tooltip();
            }, 500);
        }
    };
}]);

Demo.directive('applyImgAreaSelection', ['$parse', function ($parse) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).imgAreaSelect({
                    handles: true,
                    onSelectEnd: function (img, selection) {
                        $('input[name="x1"]').val(selection.x1);
                        $('input[name="y1"]').val(selection.y1);
                        $('input[name="x2"]').val(selection.x2);
                        $('input[name="y2"]').val(selection.y2);

                        $('input[name="width"]').val(selection.width);
                        $('input[name="height"]').val(selection.height);
                    }
                });
            }, 500);
        }
    };
}]);

Demo.directive('applyFancybox', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).fancyboxPlus();
            }, 1000);
        }
    }
});


Demo.directive('treeView', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            localNodes: '=model',
            localClick: '&click'
        },
        link: function (scope, tElement, tAttrs, transclude) {
            var maxLevels = (angular.isUndefined(tAttrs.maxlevels)) ? 10 : tAttrs.maxlevels;
            var hasCheckBox = (angular.isUndefined(tAttrs.checkbox)) ? false : true;
            scope.showItems = [];

            scope.showHide = function (ulId) {
                var hideThis = document.getElementById(ulId);
                var showHide = angular.element(hideThis).attr('class');
                angular.element(hideThis).attr('class', (showHide === 'show' ? 'hide' : 'show'));
            }

            scope.showIcon = function (node) {
                if (!angular.isUndefined(node.children)) return true;
            }

            scope.checkIfChildren = function (node) {
                if (!angular.isUndefined(node.children)) return true;
            }

            /////////////////////////////////////////////////
            /// SELECT ALL CHILDRENS
            // as seen at: http://jsfiddle.net/incutonez/D8vhb/5/
            function parentCheckChange(item) {
                for (var i in item.children) {
                    item.children[i].ischecked = item.ischecked;
                    if (item.children[i].children) {
                        parentCheckChange(item.children[i]);
                    }
                }
            }

            scope.checkChange = function (node) {
                if (node.children) {
                    parentCheckChange(node);
                }
            }

            /////////////////////////////////////////////////

            function renderTreeView(collection, level, max) {
                var text = '';
                text += '<li ng-repeat="n in ' + collection + '" >';
                text += '<span ng-show=showIcon(n) class="show-hide"></span>';
                text += '<span ng-show=!showIcon(n) style="padding-right: 13px"></span>';

                if (hasCheckBox) {
                    text += '<input class="tree-checkbox" type=checkbox ng-model=n.ischecked ng-change=checkChange(n)>';
                }


                //text += '<span class="edit" ng-click=localClick({node:n})><i class="fa fa-pencil"></i></span>'


                text += '<label>{{n.MenuText}}</label>';

                if (level < max) {
                    text += '<ul id="{{n.MenuId}}" ng-if=checkIfChildren(n)>' + renderTreeView('n.children', level + 1, max) + '</ul></li>';
                } else {
                    text += '</li>';
                }

                return text;
            }// end renderTreeView();

            try {
                var text = '<ul class="tree-view-wrapper">';
                text += renderTreeView('localNodes', 1, maxLevels);
                text += '</ul>';
                tElement.html(text);
                $compile(tElement.contents())(scope);
            }
            catch (err) {
                tElement.html('<b>ERROR!!!</b> - ' + err);
                $compile(tElement.contents())(scope);
            }
        }
    };
});

Demo.directive('applyTimezone', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).timezones();
                $(element).select2();
            }, 1000);
        }
    }
});

Demo.directive('applyOnSelect', function () {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            setTimeout(function () {
                $(element).select2();
            }, 1000);
        }
    }
});