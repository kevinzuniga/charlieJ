angular.module('jne').controller('GridDebatesCtrl', function ($scope, gtvzone, api, $stateParams) {
    $scope.gridDebates = {
        ElementList: $('.item-keyboard-v2.gl-item-selectable').first(),
        data: [],
        from: $stateParams.from,
        fromText:'debate',
        nextPage: null,
        topicsId: {},
        rows:[],
        showVideos:false,
        init: function () {
            var self = this, servicio;

            if (self.from == 1) {

                self.showVideos=false;
                $('.message-void-debates').show();

                self.fromText='debate';
                $('.grid-elements-cont')
                    .css({
                        'background-image': 'url(/assets/images/debatejne.png), ' +
                        'url(../assets/images/debatejne.png)'
                    });
                servicio = api.debates.one('videos');
            }
            if (self.from == 2) {
                self.fromText='forum';
                self.showVideos=true;
                $('.grid-elements-cont')
                    .css({
                        'background-image': 'url(/assets/images/forosydebates.png), ' +
                        'url(../assets/images/forosydebates.png)'
                    });
                //servicio = api.forums.one('topics').one($stateParams.idCategory.toString()).one('videos_forum');
                ///topics/:id/videos_forum/
                //servicio = api.debates;
                servicio = api.forums.one('organizers').one($stateParams.idCategory.toString()).one('videos');
                //    organizers/:id/videos/
            }
            servicio
            .get()
            .then(function (res) {
                //console.log(res);
                self.data = res;
                if (self.from == 1) {
                    self.data = self.getTopics(res);
                }
                if (self.from == 2) {
                    self.data = self.getTopics(res.topics);
                }
                console.log(self.getTopics(self.data));
            }, function (err) {
                console.log(err);
            });

            gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-js", {});
        },
        countElement:function(index,numberElements){
            this.rows[index]=numberElements;

            $($('.grid-row')[index]).children('.grid-list-viewport').children('.grid-list').css({'width':(numberElements)*300+'px'});
            if(numberElements<5){
                $($('.grid-row')[index]).children('.item-arrow-right')
                    .children('.item-arrow-right-select').children('img').hide();
            }
        },
        getElementsRowsX:function(index){
            return this.rows[index];
        },
        getTopics:function(topics){
            var filterTopics=[],
                band;
            for(var i=0;i<topics.length;i++){
                band=true;
                for(var j=0;j<topics[i].political_parties.length;j++){
                    if(topics[i].political_parties[j].videos!=null){
                        if(band){
                            filterTopics.push({
                                id:     topics[i].id,
                                image:  topics[i].image,
                                name:   topics[i].name,
                                political_parties:[]
                            });
                            band=false;
                        }
                        filterTopics[filterTopics.length-1].political_parties.push({
                            id:     topics[i].political_parties[j].id,
                            logo:   topics[i].political_parties[j].logo,
                            name:   topics[i].political_parties[j].name,
                            videos: topics[i].political_parties[j].videos
                        })
                    }
                }
            }
            return filterTopics;
        },
        slider: function () {
            var self = this,
                widthBorder=4;
            //console.log('slider');
            self.ElementList = $('.item-keyboard-v2.gl-item-selectable').first();

            $('.item-arrow-left-select img').hide();
            //  ------------------ FLECHA IZQUIERDA / LEFT

            $('.item-arrow-left-select img').click(function () {
                var content=$(this).parent().parent().parent().children('.grid-list-viewport').children('.grid-list'),
                    indexContainer=$(this).parent().parent().parent().index();

                if($(content).offset().left<0){

                    $(content).css({left:$(content).position().left+self.ElementList.width()+ widthBorder + 'px'});

                    if($(content).offset().left==38){
                        $(this).hide();
                    }else{
                        $(this).show();
                    }

                    var arrowRight=$(this).parent().parent().parent()
                                    .children('.item-arrow-right')
                                    .children('.item-arrow-right-select').children('img');


                    if(self.getElementsRowsX(indexContainer)>4){
                        $(arrowRight).show();
                    }
                }
            });
            //  ------------------ FLECHA DERECHA / RIGHT

            $('.item-arrow-right-select img').click(function () {
                var content=$(this).parent().parent().parent().children('.grid-list-viewport').children('.grid-list');

                if(content.width()-(-1)*(content.offset().left-38) > ((self.ElementList.width()+widthBorder)*4)){

                    $(content).css({left:$(content).position().left-self.ElementList.width()-widthBorder + 'px'});

                    if(content.width()-(-1)*(content.offset().left-38) <= (self.ElementList.width()+widthBorder)*4){
                        $(this).hide();
                    }

                    var arrowLeft=$(this).parent().parent().parent()
                                         .children('.item-arrow-left')
                                         .children('.item-arrow-left-select').children('img');

                    if($(content).offset().left<0){
                        $(arrowLeft).show();
                    }else{
                        $(arrowLeft).hide();
                    }
                }
            });

            $(document).keydown(function (event) {
                if ($('.item-keyboard-v2.focus-item-keyboard.gl-item-selectable').offset() != undefined) {
                    var element = $('.item-keyboard-v2.focus-item-keyboard.gl-item-selectable'),
                        elementParent = element.parent().parent(),
                        contElementParent=elementParent.parent().parent(),
                        rowLeft =contElementParent.children('.item-arrow-left')
                                .children('.item-arrow-left-select').children('img'),
                        rowRight=contElementParent.children('.item-arrow-right')
                                .children('.item-arrow-right-select').children('img');

                    if (element.offset().left < 0 && event.which == 37) {
                        //      IZQUIERDAA

                        $scope.safeApply(function () {
                            elementParent.css({'left': elementParent.position().left + self.ElementList.width()+widthBorder + 'px'});
                        });

                        if(elementParent.offset().left<0){
                            rowLeft.show();
                        }else{
                            rowLeft.hide();
                        }

                        if(elementParent.width()-(-1)*(elementParent.offset().left-38)<(self.ElementList.width() + widthBorder) * 4){
                            rowRight.hide();
                        }else{
                            rowRight.show();
                        }
                    }

                    if (element.offset().left >= ((self.ElementList.width()+4) * 4 + 38) && event.which == 39) {
                        //            DERECHAAAAAAAAAAAAAAAAAA

                        $scope.safeApply(function () {
                            elementParent.css({'left': elementParent.position().left - self.ElementList.width()-widthBorder + 'px'});
                        });


                        if(elementParent.width()-(-1)*(elementParent.offset().left-38) <=((self.ElementList.width()+widthBorder) * 4)){
                            rowRight.hide();
                        }else{
                            rowRight.show();
                        }


                        ///  mostrar y esconder FLECHA IZQUIERDA

                        if(elementParent.offset().left<0){
                            rowLeft.show();
                        }else{
                            rowLeft.hide();
                        }
                    }

                    // ************************  ARRIBA  Y ABAJO
                    //console.log(element.offset().top);
                    if (element.offset().top <= 31 && event.which == 38) {
                        $scope.safeApply(function () {
                            $('.grid-parent-js').css({'top': $('.grid-parent-js').position().top + $('.grid-row').height() + 'px'});
                            self.actual--;
                        });
                    }
                    if (element.offset().top > 532 && event.which == 40) {
                        $scope.safeApply(function () {
                            $('.grid-parent-js').css({'top': $('.grid-parent-js').position().top - $('.grid-row').height() + 'px'});
                            self.actual++;
                        })
                    }
                }
            });
            var container = $('#grid-parent-js'),
                elementsForView = 2,
                gridRow = $('.grid-row');
            container.on({
                'mousewheel': function (event) {
                    container = $('#grid-parent-js');
                    if (event.originalEvent.wheelDelta > 0 && container.position().top < 0) {
                        //$('.btn-slider-clips').removeClass('btn-grid-active');
                        //$('.btn-slider-clips-left').addClass('btn-grid-active');

                        container.css({'top': container.position().top + gridRow.height() + 'px'});
                    }
                    if (event.originalEvent.wheelDelta < 0 && container.position().top > (-1) * (container.height() - elementsForView * (gridRow.height()))) {
                        //$('.btn-slider-clips').removeClass('btn-grid-active');
                        //$('.btn-slider-clips-right').addClass('btn-grid-active');

                        container.css({'top': container.position().top - gridRow.height() + 'px'});
                    }
                    if (event.target.id == 'el') return;
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            gtvzone.zone("GENERIC_LAYER", "gridZona", "#zone-grid-debates-js", {
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
                    //if (selectedItem.hasClass("lastRightRow")){
                    //    //noinspection NegatedIfStatementJS,NegatedIfStatementJS,NegatedIfStatementJS
                    //    if($('.lastRow').length!=0){
                    //        gtvzone.globalKeyMappingController.setSelected($($('.lastRow')[$('.lastRow').length-1]));
                    //        return {
                    //            status: 'skip'
                    //        };
                    //    }else{
                    //        return {
                    //            status: 'none'
                    //        };
                    //    }
                    //}
                    return {
                        status: 'none'
                    };
                }
            });
        }
    };
    $scope.gridDebates.init();
    $scope.gridDebates.slider();
});
