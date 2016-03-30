angular.module('jne', ['ui.bootstrap', 'ui.utils', 'ui.router', 'restangular', 'ngAnimate'/*,'templates'*/]);

angular.module('jne').config(function ($stateProvider, $urlRouterProvider,
                                       $locationProvider, $httpProvider,
                                       RestangularProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'partials/home//home.html'
    });
    $stateProvider.state('candidato', {
        url: '/candidato/:idParty',
        templateUrl: 'partials/candidato//candidato.html'
    });
    $stateProvider.state('partidos', {
        url: '/partidos',
        templateUrl: 'partials/partidos//partidos.html'
    });
    $stateProvider.state('debates', {
        url: '/debates',
        templateUrl: 'partials/debates//debates.html'
    });
    $stateProvider.state('planes', {
        url: '/planes',
        templateUrl: 'partials/planes//planes.html'
    });
    $stateProvider.state('mapCongresistas', {
        url: '/mapCongresistas',
        templateUrl: 'partials/mapCongresistas//mapCongresistas.html'
    });
    $stateProvider.state('partidos_profile', {
        url: '/partidos/:idpartido',
        templateUrl: 'partials/partidos_profile//partidos_profile.html'
    });
    $stateProvider.state('mapCongresistas_especifica_region', {
        url: '/mapCongresistas/:idRegion',
        templateUrl: 'partials/mapCongresistas_especifica_region//mapCongresistas_especifica_region.html'
    });
    $stateProvider.state('mapCongresistas_selecciona_congresista', {
        url: '/mapCongresistas/:idRegion/:idCongresista',
        templateUrl: 'partials/mapCongresistas_selecciona_congresista//mapCongresistas_selecciona_congresista.html'
    });
    $stateProvider.state('playerjne', {
        url: '/playerjne/:idvideo/:url',
        templateUrl: 'partials/playerjne//playerjne.html'
    });
    $stateProvider.state('grid_debates', {
        url: '/grid_debates/:from/:idCategory',
        templateUrl: 'partials/grid_debates//grid_debates.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');

    RestangularProvider.setDefaultHttpFields({cache: true});
});

angular.module('jne').run(function ($rootScope, $state,
                                    gtvzone, $window,$filter,
                                    $timeout, Restangular,
                                    $http, $modal, api,
                                    sliderFactory) {

    $rootScope.safeApply = function (fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    //$http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
    Restangular.setBaseUrl('http://162.243.97.201/api/v1');
    Restangular.setRequestSuffix('/');

    gtvzone.globalKeyMappingController = new gtv.jq.KeyController();
    gtvzone.globalKeyMappingController.start();

    $rootScope.actualSlider = 0;
    $rootScope.setActualSlider = function (val) {
        $rootScope.safeApply(function () {
            $rootScope.actualSlider = $rootScope.actualSlider + val;
        })
    };

    $rootScope.transit = function (state, params) {
        $state.go(state, params);
        //$rootScope.tab.init($window.location);
    };

    $rootScope.btnBackViews = function () {
        $window.history.back();
    };
    $rootScope.modalOpenGlobal = {
        band: false,
        setBand: function (val) {
            this.band = val;
        }
    };

    $rootScope.tab = {
        current: null,
        init: function (url, params) {
            var self = this;
            switch (url) {
                case "/home":
                    self.current = 1;
                    break;
                case "/partidos":
                    self.current = 2;
                    break;
                case "/debates":
                    self.current = 2;
                    break;
                case "/grid_debates/:from/:idCategory":
                    if (params.from == "1") {
                        self.current = 3;
                    }
                    if (params.from == "2") {
                        self.current = 2;
                    }
                    break;
                case "/planes":
                    self.current = 4;
                    break;
                case "/mapCongresistas":
                    self.current = 5;
                    break;
            }
            //console.log(url, self.current);
        }
    };

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

        $rootScope.tab.init(to.url, toParams);
        $rootScope.playerif = true;

        if (from.name == "playerjne") {
            clearInterval(gtvzone.timer);
            if ($rootScope.playerapi != undefined) {

                $rootScope.playerapi.unload();
            }
            $timeout(function () {
                $rootScope.safeApply(function () {
                    $rootScope.playerif = false;
                })
            })
        }

        if (to.name == "playerjne") {
            $timeout(function () {
                $rootScope.safeApply(function () {
                    $rootScope.playerif = true;
                })
            })
        } else {
            $timeout(function () {
                $rootScope.safeApply(function () {
                    $rootScope.playerif = false;
                })
            })
        }

        $rootScope.previousState_name = from.name;
        $rootScope.previousState_params = fromParams;
    });

    $rootScope.imgLoadedsGlobal = {
        imgLoadeds: 0,
        setImgLoadeds: function (val) {
            this.imgLoadeds = val;
        }
    };

    $rootScope.applyFilter=function(data){
        $filter('favoritesX')(data);
    };
    $rootScope.openModalFavoriteGeneral = function (selectIDfavorite, candidatos) {
        $rootScope.modalOpenGlobal.setBand(true);
        var idZona = $(selectIDfavorite).parent().parent().attr('id');
        $modal.open({
            templateUrl: 'modals/favorites/favorites.html',
            controller: 'FavoritesCtrl',
            windowClass: 'modal-favorites',
            animation: false,
            size: 'lg',
            resolve: {
                candidates: function () {
                    return api.candidates.get();
                }
            }
        }).result.then(function (result) {
            }).finally(function () {
                $rootScope.modalOpenGlobal.setBand(false);

                $rootScope.applyFilter(candidatos);

                // MODAL CERRADO
                //self.favorites = $localstorage.getObject('favorites');
                //self.data      = self.sortByFavorites(angular.copy(self.modalDataTemp));
                //self.total     = self.data.length;
                gtvzone.zone("GENERIC_LAYER", "genericZona", "#" + idZona, {});
            });
    };

    $(document).keydown(function (event) {
            sliderFactory.keyDownApp(event);
    });
});
angular.module('jne').filter("urlMoment", function () {
    return function (urlIncorrect) {
        if (urlIncorrect != undefined) {
            return "http://" + urlIncorrect.substring(37);
        }
    }
});

