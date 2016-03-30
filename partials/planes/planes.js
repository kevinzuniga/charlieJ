angular.module('jne')
.controller('PlanesCtrl', function ($scope,
                                        gtvzone,
                                        $timeout,
                                        sliderFactory,
                                        api,
                                        $localstorage) {
        $scope.partPlanes = {
            actual: 0,
            data: [],
            total: null,
            ElementList: $('.item-height-50-select.item-keyboard-v2').first(),
            favorites: $localstorage.getObject('favorites') || [],
            init: function () {
                var self = this;
                gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-nav-general-js", {});

                //$scope.openModalFavoriteGeneral('.item-nc-logo');

                api.governmentPlanes
                    .get()
                    .then(function (res) {
                        //console.log(res);
                        self.data = res;
                        self.total = res.length;
                    }, function (err) {
                        console.log(err);
                    });
                //self.slider();
            },
            slider: function () {

                $scope.applyFilter(this.data);

                sliderFactory
                    .setValues(
                        $('#list-planes-id'),
                        (this.total % 2 == 0 ? Math.floor(this.total/2) :Math.floor((this.total / 2) + 1)),
                        '.item-height-50-select', 5
                    );
                gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-nav-general-js", {
                    38: function (selectedItem, newSelected){
                        // top
                        gtvzone.globalKeyMappingController.setSelected($('.elementSelectSlider'));
                        return {
                            status: 'skip'
                        };
                    }
                });
                gtvzone.zone("GENERIC_LAYER", "genericPartidos", "#zone-planes-js", {},
                    {
                        moveSelected: function moveSelected(selectedItem, newSelectedItem) {
                            if (selectedItem != null && newSelectedItem != null) {
                                selectedItem.removeClass('grayscale-off');
                                newSelectedItem.toggleClass('grayscale-off');
                            }
                        },
                        leaveZone: function leaveZone(selectedItem) {
                            if (selectedItem != null) {
                                selectedItem.removeClass('grayscale-off');
                            }

                        }
                    }
                );
            }

        };
        $scope.partPlanes.init();

    });
