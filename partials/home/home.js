angular.module('jne')
.controller('HomeCtrl',
            function ($scope,
                      gtvzone,
                      $timeout,
                      $rootScope,
                      sliderFactory,
                      api, $modal,$filter,
                      $localstorage)
{
    $scope.partHome = {
        actual: 0,
        data: [],
        total: null,
        modal: {},
        modalDataTemp: [],
        showModal: $localstorage.get('showModal') || 0,
        favorites: $localstorage.getObject('favorites') || [],
        ElementList: $('.item-height-full-select.item-keyboard-v2').first(),
        next:null,
        init: function () {
            var self = this;

            gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-js", {
            //    elementSelectSlider
                38: function (selectedItem, newSelected){
                    // top
                    gtvzone.globalKeyMappingController.setSelected($('.elementSelectSlider'));
                    return {
                        status: 'skip'
                    };
                }
            });

            api.candidates
                .get()
                .then(function (res) {
                    //console.log(self.data);
                    if (!self.showModal) {
                        self.modalDataTemp = res;
                        self.data=res;
                        self.total = self.data.length;
                        $localstorage.setObject('favorites', []);
                        self.openModalFavorite();
                    }
                    else{
                        self.data = angular.copy(self.sortByFavorites(res));
                        self.total = self.data.length;
                        self.modalDataTemp=self.data;
                    }
                    //self.data = self.sortByFavorites(res.results);
                    //self.total = self.data.length;
                }, function (err) {
                    console.log(err);
                });

            //$('body').click(function(){ alert('test' )})

            //$scope.openModalFavoriteGeneral('.item-nc-logo');
        },
        addElement:function(){
            console.log(sliderFactory.getActual());
        },
        sortByFavorites: function (candidates) {
            var self = this, candidateTemp;
            for (var j = 0; j < self.favorites.length; j++) {
                for (var i = 0; i < candidates.length; i++) {
                    if (candidates[i].id == self.favorites[j]) {
                        candidateTemp = candidates[i];
                        candidates.splice(i, 1);
                        candidates.unshift(candidateTemp);
                        i=candidates.length;
                    }
                }
            }
            return candidates.reverse();
        },
        openModalFavorite: function () {
            var self = this;
            $rootScope.modalOpenGlobal.setBand(true);
            $localstorage.set('showModal',1);
            self.modal = $modal.open({
                templateUrl: 'modals/favorites/favorites.html',
                controller: 'FavoritesCtrl',
                windowClass: 'modal-favorites',
                animation: false,
                size: 'lg',
                resolve: {
                    candidates: function () {
                        return self.modalDataTemp;
                    }
                }
            }).result.then(function (result) {
                console.log("result.then");
            }).finally(function () {
                // MODAL CERRADO

                $rootScope.modalOpenGlobal.setBand(false);
                self.favorites = $localstorage.getObject('favorites');
                self.data      = self.sortByFavorites(angular.copy(self.modalDataTemp));
                self.total     = self.data.length;
                //self.applyFilter();
                gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-js", {});
            });
        },
        slider: function () {

            sliderFactory
                .setValues(
                    $('#list-candidates-id'),
                    this.total,
                    '.item-height-full-select', 5
                );


            gtvzone.zone("GENERIC_LAYER", "genericCandidates", "#zone-candidates-js", {},
                {
                    moveSelected: function moveSelected(selectedItem, newSelectedItem) {
                        if (selectedItem != null && newSelectedItem != null) {
                            selectedItem.toggleClass('grayscale-off');
                            newSelectedItem.toggleClass('grayscale-off');
                        }
                    },
                    leaveZone: function leaveZone(selectedItem) {
                        if (selectedItem != null) {
                            selectedItem.toggleClass('grayscale-off');
                        }

                    }
                }
            );
        }
    };
    $scope.partHome.init();

});
