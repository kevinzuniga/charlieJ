angular.module('jne').controller('MapcongresistasCtrl', function ($scope, $timeout, gtvzone, api) {
    $scope.mapCongresista = {
        coorde: {},
        hoverUrl: null,
        imgLoadeds:0,
        regionsTemp:[],
        regions:[

            {
                "id": 2,
                "name": "AMAZONAS",
                "map" :{x:'247',y:'-112',img:'assets/images/amazonas.png'}
            },
            {
                "id": 3,
                "name": "ANCASH",
                "map" :{x:'227',y:'-500',img:'assets/images/ancash.png'}
            },
            {
                "id": 4,
                "name": "APURIMAC",
                "map" :{x:'-189',y:'-904',img:'assets/images/apuramic.png'}
            },
            {
                "id": 5,
                "name": "AREQUIPA",
                "map" :{x:'-191',y:'-1076',img:'assets/images/arequipa.png'}
            },
            {
                "id": 6,
                "name": "AYACUCHO",
                "map" :{x:'-97',y:'-895',img:'assets/images/ayacucho.png'}
            },
            {
                "id": 7,
                "name": "CAJAMARCA",
                "map" :{x:'307',y:'-218',img:'assets/images/cajamarca.png'}
            },
            {
                "id": 8,
                "name": "CUSCO",
                "map" :{x:'-257',y:'-846',img:'assets/images/cusco.png'}
            },
            {
                "id": 9,
                "name": "HUANCAVELICA",
                "map" :{x:'-6',y:'-820',img:'assets/images/huancavelica.png'}
            },
            {
                "id": 10,
                "name": "HUANUCO",
                "map" :{x:'71',y:'-499',img:'assets/images/huanuco.png'}
            },
            {
                "id": 11,
                "name": "ICA",
                "map" :{x:'33',y:'-922',img:'assets/images/ica.png'}
            },
            {
                "id": 12,
                "name": "JUNIN",
                "map" :{x:'-14',y:'-697',img:'assets/images/junin.png'}
            },
            {
                "id": 13,
                "name": "LA LIBERTAD",
                "map" :{x:'279',y:'-372',img:'assets/images/la-libertad.png'}
            },
            {
                "id": 14,
                "name": "LAMBAYEQUE",
                "map" :{x:'418',y:'-229',img:'assets/images/lambayeque.png'}
            },
            {
                "id"  : 1,
                "name": "LIMA",
                "map" :{x:'140',y:'-710',img:'assets/images/lima.png'}
            },
            {
                "id": 15,
                "name": "LORETO",
                "map" :{x:'-107',y:'-58',img:'assets/images/loreto.png'}
            },
            {
                "id": 16,
                "name": "MADRE DE DIOS",
                "map" :{x:'-401',y:'-703',img:'assets/images/madre-de-dios.png'}
            },
            {
                "id": 17,
                "name": "MOQUEGUA",
                "map" :{x:'-383',y:'-1158',img:'assets/images/moquegua.png'}
            },
            {
                "id": 18,
                "name": "PASCO",
                "map" :{x:'29',y:'-578',img:'assets/images/pasco.png'}
            },
            {
                "id": 19,
                "name": "PIURA",
                "map" :{x:'454',y:'-133',img:'assets/images/piura.png'}
            },
            {
                "id": 20,
                "name": "PUNO",
                "map" :{x:'-450',y:'-1005',img:'assets/images/puno.png'}
            },
            {
                "id": 21,
                "name": "SAN MARTIN",
                "map" :{x:'134',y:'-297',img:'assets/images/san-martin.png'}
            },
            {
                "id": 22,
                "name": "TACNA",
                "map" :{x:'-422',y:'-1216',img:'assets/images/tacna.png'}
            },
            {
                "id": 23,
                "name": "TUMBES",
                "map" :{x:'481',y:'-9',img:'assets/images/tumbes.png'}
            },
            {
                "id": 24,
                "name": "UCAYALI",
                "map" :{x:'-165',y:'-495',img:'assets/images/ucayali.png'}
            }
        ],
        loadImage:function(imgurl,i){
            var self=this,
                img = new Image();
            $(img).load(function () {
                $scope.safeApply(function () {
                    self.imgLoadeds++;
                    i++;
                    if(i<24){self.loadImage(self.regions[i],i);img=null;}
                    if(i==24){
                        $scope.safeApply(function () {
                            self.regionsTemp=self.regions
                        });
                        $scope.imgLoadedsGlobal.setImgLoadeds(24);
                    }
                });
                //console.log(self.imgLoadeds);
            }).error(function () {
                // notify the user that the image could not be loaded
            }).attr('src', imgurl.map.img);

        },
        init: function () {
            var self=this;
            self.imgLoadeds=$scope.imgLoadedsGlobal.imgLoadeds;
            console.log("load ",self.imgLoadeds);
            if(self.imgLoadeds==0){
                self.loadImage(self.regions[0],0);
            }else{
                $scope.safeApply(function () {
                    self.regionsTemp=self.regions
                });
            }
            gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-nav-general-js",{}, {
            });
            api.regions.
                get().then(function (res){
                    console.log(res);
                    //self.regions=res.results;
                }, function (err) {
                    console.log(err);
                });
            //self.
        },
        focusRegion: function (coorde) {
            var self = this;
            $scope.safeApply(function () {
                self.coorde = coorde;
                self.hoverUrl = coorde.img;
            });
        },
        ready: function () {
            gtvzone.zone("GENERIC_LAYER", "genericPartidos", "#zone-regiones-js", {},{
                moveSelected: function moveSelected(selectedItem, newSelectedItem) {
                    if (selectedItem != null && newSelectedItem != null) {
                        //console.log(newSelectedItem.attr('ng-mouseenter'),newSelectedItem.attr('data-index'));
                        if (newSelectedItem.attr('ng-mouseenter')) {
                            $scope.mapCongresista.focusRegion($scope.mapCongresista.regions[newSelectedItem.attr('data-index')].map);
                            //$scope.safeApply(function() {
                            //    //newSelectedItem.attr('ng-mouseenter')
                            //    $scope.$eval("mapCongresista.focusRegion("+
                            //        $scope.mapCongresista.regions[newSelectedItem.attr('data-index')].map+
                            //    ")");
                            //});
                        }
                    }
                }
            });
            $timeout(function () {

                var element=$scope.mapCongresista.regions[$('.item-keyboard-region.focus-item-keyboard').attr('data-index')];
                if(element!=undefined){$scope.mapCongresista.focusRegion(element.map);}

            },200);
        }
    };
    $scope.mapCongresista.init();
});
