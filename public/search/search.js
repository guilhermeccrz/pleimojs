define('search',
[
    'jquery',
    'angular',
    'angular_route',
    'jquery_placeholder'
],
function($, angular){

    var searchApp = angular.module('pleimoApp.searchApp', ['ngRoute']);

    searchApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/search', {
                templateUrl: '/search/main',
                controller: 'SearchCtrl'
            })
            .when('/search/albums', {
                templateUrl: '/search/detail/albums',
                controller: 'MoreCtrl'
            })
            .when('/search/artists', {
                templateUrl: '/search/detail/artists',
                controller: 'MoreCtrl'
            })
            .when('/search/products', {
                templateUrl: '/search/detail/products',
                controller: 'MoreCtrl'
            })
            .when('/search/radios', {
                templateUrl: '/search/detail/radios',
                controller: 'MoreCtrl'
            })
            .when('/search/related', {
                templateUrl: '/search/detail/related',
                controller: 'MoreCtrl'
            })
            .when('/search/songs', {
                templateUrl: '/search/detail/songs',
                controller: 'MoreCtrl'
            })
            .when('/search/videos', {
                templateUrl: '/search/detail/videos',
                controller: 'MoreCtrl'
            });

        //$locationProvider.hashPrefix('!');
        //$locationProvider.html5Mode(true);
    }]);

    searchApp.controller('MainCtrl', ['$scope', '$route', '$routeParams', '$location', '$rootScope', function($scope, $route, $routeParams, $location, $rootScope) {

        $scope.$route       = $route;
        $scope.$location    = $location;
        $scope.$routeParams = $routeParams;
        $scope.q            = ($routeParams.q) ? $routeParams.q : '';

        $scope.$watch('q', function(newVal, oldVal)
        {
            if (newVal != '')
            {
                $location.path('/search');
                $location.search('q', newVal);

            } else
            {
                $location.path('/');
                $location.search('q', null);
            }

        });

        $scope.clickSearch = function()
        {
            $location.path('/search');
            $location.search('q', $('#q').val());
        };

        $scope.keySearch = function($event)
        {
            if ($event.keyCode == 13) {
                $location.path('/search');
                $location.search('q', $('#q').val());
            }
        }
     }]);

    searchApp.filter('artistgenre', function()
    {
        return function(input, item)
        {
            var result = input;

            if (item.artist.country && item.artist.country != '')
            {
                result += ' | ' + item.artist.country;
            }

            return result;
        };
    });

    searchApp.filter('croptext', function()
    {
        return function(input, qty)
        {
            var result = input;

            if (input.length > qty) {
                result = result.substr(0, qty);
                result +='...';
            }

            return result;
        };

    });

    searchApp.factory('SearchService', function() {
        return {
            templates  : {
                "album"     : "/search/album",
                "artist"    : "/search/artist",
                "product"   : "/search/product",
                "radio"     : "/search/radio",
                "song"      : "/search/song",
                "video"     : "/search/video",

                "albums"    : "/search/more/albums",
                "artists"   : "/search/more/artists",
                "products"  : "/search/more/products",
                "radios"    : "/search/more/radios",
                //"related"   : "/search/more/related",
                "songs"     : "/search/more/songs",
                "videos"    : "/search/more/videos"
            },
            json : {
                "/search/artists" 	: "http://api.pleimo.com/search/artist/json",
                "/search/albums" 	: "http://api.pleimo.com/search/album/json",
                "/search/radios" 	: "http://api.pleimo.com/search/radio/json",
                "/search/songs" 	: "http://api.pleimo.com/search/song/json",
                //"/search/related" 	: "http://api.pleimo.com/search/all/json",
                "/search/videos" 	: "http://api.pleimo.com/search/video/json",
                "/search/products"    : "http://api.pleimo.com/search/product/json"
            },

            load : function(params, url, $scope, $http) {
                $http({
                        method: 'GET',
                        url:     url,
                        params: params
                    }).success(function(data, status, headers, config) {
                        $scope.$emit('searchLoaded', data);
                    }).error(function(data, status, headers, config) {
                        $scope.status = status;
                    });
            }
        };
    });

    searchApp.controller('SearchCtrl', ['$scope', '$http', '$routeParams', 'SearchService', function($scope, $http, $routeParams, SearchService) {

        $scope.params  = $routeParams;
        $scope.q       = ($routeParams.q) ? $routeParams.q : '';

        $scope.items           = {};
        $scope.moreresults     = {};
        $scope.url             = '/search/artist';

        $scope.$on('searchLoaded', function(event, data)
        {
            $('#top-result').removeClass('loading');
            $('#result').show();

            $scope.items        = data.results;
            $scope.moreresults  = data.more;

        });

        if ($scope.q != '')
        {
            SearchService.load({q: $scope.q, api_key:'bd7203c61a13f6a8a6a039255cd26359'}, 'http://api.pleimo.com/search/all/json', $scope, $http);

            $('#q').val($scope.q);

            //pleimo.Search.open();
        }

        $scope.$watch('q', function(newVal, oldVal)
        {
            if (newVal && newVal != '')
            {
                $('#top-result').show();
                $('#top-result').addClass('loading');

                SearchService.load({q: newVal, api_key:'bd7203c61a13f6a8a6a039255cd26359'}, 'http://api.pleimo.com/search/all/json', $scope, $http);
            } else {
                $('#top-result').hide();
                $('#result').hide();
            }
        });
    }]);

    searchApp.controller('MoreCtrl', ['$scope', '$http', '$routeParams', '$location', 'SearchService', function($scope, $http, $routeParams, $location, SearchService) {

        $scope.params   = $routeParams;
        $scope.q        = ($routeParams.q) ? $routeParams.q : '';

        $scope.$watch('q', function(newVal, oldVal)
        {

            if (newVal && newVal != '')
            {
                $scope.$on('searchLoaded', function(event, data) {
                    $scope.topresults = data.totalfound;
                    $scope.results = data.results;
                });

                SearchService.load({q: newVal , api_key:'bd7203c61a13f6a8a6a039255cd26359' }, SearchService.json[$location.path()], $scope, $http);
            }

        });

    }]);

    searchApp.directive('searchMore', function($location)
    {
        return {
            replace: false,
            scope: {
                value: "@searchMore"
            },
            restrict: 'A',
            link: function($scope, $element, $attrs)
            {
                var href = $location.path().toLowerCase();
                    href += (href.substr(href.length - 1) == '/') ? $scope.value : '/' + $scope.value;
                    href += '?q=' + $location.search().q;

                $element.attr('href', href);

            }
        }
    });

    searchApp.directive('searchBack', function($location) {
        return {
            replace: false,
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                var href = '/search?q=' + $location.search().q;
                $element.attr('href', href);
            }
        }
    });

    searchApp.directive('urlInclude', ['$compile', 'SearchService', function($compile, SearchService) {
        return {
            replace : true,
            scope : true,
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                $scope.currPage = SearchService.templates[$scope.item.type];

                var DOM = angular.element(
                    "<div ng-include='currPage'> \n" +
                    "</div>");
                var $e =$compile(DOM)($scope);
                $element.replaceWith($e);
            }
       }
    }]);

    searchApp.directive('searchHover', function() {
        return {
            replace : true,
            scope : false,
            restrict: 'C',
            link: function(scope, element, attrs) {
                element.bind('mouseover', function() {
                    $(this).parents('.item').find('div.hover').show();
                });

                element.bind('mouseout', function() {
                    $(this).parents('.item').find('div.hover').hide();
                });
            }
        }
    });

    searchApp.directive('permalink', function()
    {

        return {
            scope: {
                action:'@',
                permalink:'@permalink'
            },
            link: function(scope,elm,attrs){
                var elPermalink;
                var attrElement = $(elm);

                if(attrElement.hasClass('load')){
                    attrs.$observe('permalink',function(value){
                        elPermalink = value;
                        elm.removeAttr('data-permalink');
                        attrElement.attr('data-href',value);
                    });
                }

            }
        }

    });

    /*angular.element(document).ready(function() {
        angular.resumeBootstrap(['pleimoApp.searchApp']);
    });*/

    return searchApp;
});
