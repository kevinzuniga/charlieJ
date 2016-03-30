angular.module('jne')
    .controller('MapcongresistasEspecificaRegionCtrl',
    function ($scope, $timeout,
              gtvzone, $stateParams,
              api, $localstorage) {

        $scope.partMapCER = {
            actual: 0,
            actualY: 0,
            data: {},
            favorites: $localstorage.getObject('favorites') || [],
            storage: {
                all: {},
                womans: {},
                mens: {},
                youngs: {}
            },
            visibleM: {
                all: true,
                womans: false,
                mens: false,
                youngs: false
            },
            elementsRows: [],
            ElementList: $('.item-keyboard-v2.item-members').first(),
            init: function () {
                var self = this;
                gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-nav-general-js", {});

                api.regions.one($stateParams.idRegion.toString())
                    .get()
                    .then(function (res) {
                        //console.log(res);
                        //self.data=self.storage.all=res;

                        self.data=self.storage.all=res;
                        self.storage.womans=api.regions.customGET
                        ($stateParams.idRegion.toString(),{"type": "F"}).$object;
                        self.storage.mens  =api.regions.customGET
                        ($stateParams.idRegion.toString(),{"type": "M"}).$object;
                        self.storage.youngs=api.regions.customGET
                        ($stateParams.idRegion.toString(),{"type": "Y"}).$object;

                        //
                        //self.data = {
                        //    id: res.id,
                        //    image: res.image,
                        //    name: res.name,
                        //    political_parties:[]
                        //};
                        //self.storage.all=self.data;
                        //$scope.safeApply(function () {
                        //    self.data.political_parties = self.sortByFavorites(angular.copy(res.political_parties));
                        //});
                        //self.storage.all=angular.copy(self.data);
                        //self.storage.womans = api.regions.customGET
                        //($stateParams.idRegion.toString(), {"type": "F"}).$object;
                        //self.storage.mens = api.regions.customGET
                        //($stateParams.idRegion.toString(), {"type": "M"}).$object;
                        //self.storage.youngs = api.regions.customGET
                        //($stateParams.idRegion.toString(), {"type": "Y"}).$object;

                    }, function (err) {
                        console.log(err);
                    });
                //self.slider();

            },
            sortByFavorites: function (candidates) {
                var self = this,
                    favoriteTemp=angular.copy(self.favorites),
                    posi,arrayUndefined=[],
                    arrayPartidos=new Array(candidates.length);

                for (var i = 0; i < candidates.length; i++) {
                    posi=favoriteTemp.indexOf(candidates[i].id);
                    if(posi!=-1){
                        arrayPartidos.splice(posi,1,candidates[i]);
                    }else{
                        arrayUndefined.push(candidates[i]);
                    }
                }
                for(var d=0;d<arrayPartidos.length;d++){
                    if(arrayPartidos[d]==undefined){
                        arrayPartidos[d]=arrayUndefined.pop();
                    }
                }
                return arrayPartidos;
            },
            setElemensRows: function (index, numberElements) {
                this.elementsRows[index] = numberElements;
                //console.log(index,numberElements);
                var arrowRight = $($('.list-members-partido-row')[index])
                    .children('.cont-arrow-right')
                    .children('.arrow-right-mapCER');
                if (numberElements < 4) {
                    arrowRight.hide();
                } else {
                    arrowRight.show();
                }
            },
            getElementsRowsX: function (index) {
                return this.elementsRows[index];
            },
            setVisibleB: function (camp) {
                var self = this;
                $scope.safeApply(function () {
                    self.visibleM[camp] = true;
                    if (camp != 'all') {
                        self.visibleM['all'] = false;
                    }
                    if (camp != 'womans') {
                        self.visibleM['womans'] = false;
                    }
                    if (camp != 'mens') {
                        self.visibleM['mens'] = false;
                    }
                    if (camp != 'youngs') {
                        self.visibleM['youngs'] = false;
                    }
                });
                self.slider();
                $('.list-members-partido').css({left: 0 + 'px'});
                //console.log(camp,self.visibleM);
            },
            setVisible: function (camp) {
                var self = this;
                $scope.safeApply(function () {
                    self.data = self.storage[camp];
                    //console.log(self.data);
                    for (var j = 0; j < self.data.political_parties.length; j++) {
                        self.setElemensRows(j, self.data.political_parties[j].congressmen.length);
                    }
                    //console.log(camp,self.data);
                    self.visibleM[camp] = true;
                    if (camp != 'all') {
                        self.visibleM['all'] = false;
                    }
                    if (camp != 'womans') {
                        self.visibleM['womans'] = false;
                    }
                    if (camp != 'mens') {
                        self.visibleM['mens'] = false;
                    }
                    if (camp != 'youngs') {
                        self.visibleM['youngs'] = false;
                    }
                });
                self.slider();
                $('.list-members-partido').css({left: 0 + 'px'});
                //console.log(camp,self.visibleM);
            },
            slider: function () {
                var self = this;

                self.ElementList = $('.item-keyboard-v2.item-members').first().parent();
                //console.log($('.arrow-left-mapCER'));
                $('.arrow-left-mapCER').hide();

                // ************ TEST
                //$('#list-planes-id').css('width','1536px');
                //*********************************************

                $('.arrow-left-mapCER').click(function () {
                    var content = $(this).parent().parent().children('.cont-list-members-partido')
                            .children('.list-members-partido'),
                        arrowRight = $(this).parent().parent()
                            .children('.cont-arrow-right')
                            .children('.arrow-right-mapCER'),
                        indexContainer = $(this).parent().parent().index();


                    if ($(content).offset().left < 0) {
                        $(content).css({left: Math.round($(content).position().left) + self.ElementList.width() + 'px'})

                        //console.log((content).offset().left);

                        if (Math.round($(content).offset().left) == 185) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        }

                        if (self.getElementsRowsX(indexContainer) > 3) {
                            $(arrowRight).show();
                        }

                    }
                });

                $('.arrow-right-mapCER').click(function () {
                    var content = $(this).parent().parent().children('.cont-list-members-partido').children('.list-members-partido'),
                        arrowLeft = $(this).parent().parent()
                            .children('.cont-arrow-left')
                            .children('.arrow-left-mapCER');

                    //console.log(content.width()-(-1)*content.offset().left , self.ElementList.width()*3,content.offset().left);

                    if (content.width() - (-1) * content.offset().left > (self.ElementList.width() * 3 + 185)) {
                        $(content).css({left: $(content).position().left - self.ElementList.width() + 'px'});

                        //console.log(content.width(),(-1)*Math.round(content.offset().left) , self.ElementList.width()*3+190,
                        //            content.width()-(-1)*Math.round(content.offset().left) > self.ElementList.width()*3+190);

                        if (content.width() - (-1) * Math.round(content.offset().left) >= self.ElementList.width() * 3 + 190) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }

                        //var arrowLeft=$(this).parent().parent()
                        //    .children('.cont-arrow-left')
                        //    .children('.arrow-left-mapCER');

                        if ($(content).offset().left < 0) {
                            $(arrowLeft).show();
                        } else {
                            $(arrowLeft).hide();
                        }
                    }
                });
                //console.log(self.ElementList.width());
                $(document).keydown(function (event) {
                    if ($('.item-keyboard-v2.focus-item-keyboard.item-members').offset() != undefined) {
                        var element = $('.item-keyboard-v2.focus-item-keyboard.item-members')
                            , content = element.parent().parent(),
                            rowLeft = content.parent().parent().children('.cont-arrow-left')
                                .children('.arrow-left-mapCER'),
                            rowRight = content.parent().parent().children('.cont-arrow-right')
                                .children('.arrow-right-mapCER');


                        if (element.offset().left < 0 && event.which == 37) {
                            // IZQUIERDAAAA
                            $scope.safeApply(function () {
                                element.parent().parent().css({'left': content.position().left + element.parent().width() + 'px'});
                            });

                            if (Math.round($(content).offset().left) == 185) {
                                rowLeft.hide();
                            } else {
                                rowLeft.show();
                            }
                            //console.log(content.parent().parent().parent().index(),content.parent().parent());
                            if (self.getElementsRowsX(content.parent().parent().parent().index()) > 3) {
                                $(rowRight).show();
                            }
                        }


                        if (element.offset().left > (self.ElementList.width() * 3 + 185) && event.which == 39) {
                            // DERECHAAAA
                            $scope.safeApply(function () {
                                content.css({'left': content.position().left - element.parent().width() + 'px'});
                            });
                            //console.log(content.width(),(-1)*Math.round(content.offset().left) , self.ElementList.width()*3+190,
                            //            content.width()-(-1)*Math.round(content.offset().left) > self.ElementList.width()*3+190);

                            //console.log(rowRight);
                            if (content.width() - (-1) * Math.round(content.offset().left) >= self.ElementList.width() * 3 + 190) {
                                rowRight.show();
                            } else {

                                rowRight.hide();
                            }

                            if ($(content).offset().left < 0) {
                                $(rowLeft).show();
                            } else {
                                $(rowLeft).hide();
                            }
                        }

                        // ************************  ARRIBA  Y ABAJO
                        //console.log(element.offset().top);
                        if (element.offset().top <= 31 && event.which == 38) {
                            $scope.safeApply(function () {
                                $('.cont-lists-partido-js').css({'top': $('.cont-lists-partido-js').position().top + 176 + 'px'});
                                self.actualY--;
                            });
                        }
                        if (element.offset().top > 532 && event.which == 40) {
                            $scope.safeApply(function () {
                                $('.cont-lists-partido-js').css({'top': $('.cont-lists-partido-js').position().top - 176 + 'px'});
                                self.actualY++;
                            })
                        }
                    }
                });
                var container = $('#cont-lists-partido-js'),
                    elementsForView = 3,
                //gridRow = $('.list-members-partido-row')
                    gridRow = $('.cont-list-partidos');
                container.on({
                    'mousewheel': function (event) {
                        console.log("scroll", gridRow.height());
                        container = $('#cont-lists-partido-js');

                        if (event.originalEvent.wheelDelta > 0 && container.position().top < 0) {
                            //$('.btn-slider-clips').removeClass('btn-grid-active');
                            //$('.btn-slider-clips-left').addClass('btn-grid-active');
                            //gridRow.height()
                            container.css({'top': container.position().top + 176 + 'px'});
                            self.actualY++;
                        }
                        if (event.originalEvent.wheelDelta < 0 && container.position().top > (-1) * (container.height() - elementsForView * (gridRow.height()))) {
                            //$('.btn-slider-clips').removeClass('btn-grid-active');
                            //$('.btn-slider-clips-right').addClass('btn-grid-active');

                            container.css({'top': container.position().top - 176 + 'px'});
                            self.actualY++;
                        }
                        if (event.target.id == 'el') return;
                        event.preventDefault();
                        event.stopPropagation();
                    }
                });
                gtvzone.zone("GENERIC_LAYER", "genericRegion", "#zona2", {
                    37: function (selectedItem, newSelected) {
                        //left
                        if (selectedItem.hasClass("first-item-row-grid")) {
                            console.log('first-row-grid');
                            return {
                                status: 'skip'
                            };
                        }
                        if (selectedItem.hasClass("elementSelectDefaultInit")) {
                            console.log('first-row-grid');
                            return {
                                status: 'skip'
                            };
                        }
                        return {
                            status: 'none'
                        };
                    },
                    40: function (selectedItem, newSelected) {
                        //down
                        if (selectedItem.hasClass("cont-btn-back-congress")) {
                            console.log('first-row-grid');
                            gtvzone.globalKeyMappingController.setSelected($('.elementSelectSlider'));
                            //elementSelectSlider
                            return {
                                status: 'skip'
                            };
                        }
                        return {
                            status: 'none'
                        };
                    },
                    39: function (selectedItem, newSelected) {
                        //right
                        //if(newSelected!=undefined){
                        //    if(newSelected.hasClass("btn-class-arrow-no-select")){
                        //        return {
                        //            status: 'skip'
                        //        }
                        //    }
                        //}
                        if (selectedItem.hasClass("last-item-row-grid")) {
                            console.log('last-row-grid');
                            return {
                                status: 'skip'
                            };
                        }
                        return {
                            status: 'none'
                        };
                    }
                });
            }
        };
        $scope.partMapCER.init();
    });
