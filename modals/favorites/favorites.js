angular.module('jne')
.controller('FavoritesCtrl',
            function($scope, candidates,gtvzone,$localstorage, $modalStack,$timeout){
    console.log("modal candidatos :",candidates);
    $scope.partModal = {
        candidates: candidates,
        candidatesSelected:$localstorage.getObject('favorites')||[],
        candidatesSelectedLenght:$localstorage.get('lengthFavorites')||0,
        finishSelection:false,
        init: function () {

            var self=this,
                containerList=$('#list-modal-candidates-cont-id'),
                container=$('#list-modal-candidates-id'),
                ElementList=$('.list-modal-item-select'),
                ElementListFocus=$('.list-modal-item-select.focus-item-keyboard');

            self.candidatesSelected=self.candidatesSelected.slice(0,self.candidatesSelectedLenght);

            container.on({
                'mousewheel': function (event){
                    var contenList=container;
                    if(event.originalEvent.wheelDelta>0 && contenList.position().top<0){
                        //$('.btn-slider-clips').removeClass('btn-grid-active');
                        //$('.btn-slider-clips-left').addClass('btn-grid-active');
                        container.css({'top': contenList.position().top + ElementList.height() + 'px'});
                    }
                    if(event.originalEvent.wheelDelta<0 && contenList.position().top>(-1)*(contenList.height() - 1*(ElementList.height()))){
                        //$('.btn-slider-clips').removeClass('btn-grid-active');
                        //$('.btn-slider-clips-right').addClass('btn-grid-active');
                        container.css({'top': contenList.position().top - ElementList.height() + 'px'});
                    }
                    if (event.target.id == 'el') return;
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            $(document).keydown(function (event){
                ElementListFocus=$('.list-modal-item-select.focus-item-keyboard');
                if (ElementListFocus.offset() != undefined){
                    var top=(Math.floor(ElementListFocus.offset().top)-15),
                        contenList=container;
                    //console.log(top);
                    if (top < 156 && event.which == 38) {
                        contenList.css({'top': contenList.position().top + ElementList.height() + 'px'});
                    }
                    if (top >= (ElementList.height()*1-70) && event.which == 40) {
                        contenList.css({'top': contenList.position().top - ElementList.height() + 'px'});
                    }
                }
            });

            gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-favorites-js", {
                107: function (selectedItem, newSelected) {
                    $modalStack.dismissAll(null);
                    return {
                        status:'skip'
                    }
                },
                461: function (selectedItem, newSelected) {
                    $modalStack.dismissAll(null);
                    return {
                        status:'skip'
                    }
                }
            });
            if ($('.elementSelectDefaultInitModal').length != 0) {
                gtvzone.globalKeyMappingController.setSelected($('.elementSelectDefaultInitModal'));
                return {
                    status: 'skip'
                };
            }
        },
        selectCandidate: function (candidate) {

            var index=this.candidatesSelected.indexOf(candidate.id);
            if(index==-1){
                if(this.candidatesSelected.length==5){
                    this.candidatesSelected.pop();
                }
                this.candidatesSelected.push(candidate.id);
            }else{
                this.candidatesSelected.splice(index, 1);
            }
        },
        getRandomInt:function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        randomCandidate:function(){
            var self=this;
            var totalCandidates=self.candidates.length;
            var totalCandidateSelected=self.candidatesSelected.length;
            var numbersRandom=totalCandidates-totalCandidateSelected;
            var arrayNoSelected=[];
            var posiRandom;

            if(numbersRandom>0){

                $localstorage.set('lengthFavorites',totalCandidateSelected);
                self.candidatesSelected=self.candidatesSelected.slice(0,totalCandidateSelected);

                for(var x=0;x<totalCandidates;x++){
                    if(self.candidatesSelected.indexOf(self.candidates[x].id)==-1){
                        arrayNoSelected.push(self.candidates[x].id);
                    }
                }

                for(var j=0;j<arrayNoSelected.length;){
                    posiRandom=self.getRandomInt(0,arrayNoSelected.length);
                    self.candidatesSelected.push(arrayNoSelected[posiRandom]);
                    arrayNoSelected.splice(posiRandom,1);
                }
            }
        },
        saveSelectCandidate: function () {
            var self=this;
            self.randomCandidate();
            // *************   ID's de PARTIDOS POLITICOS !!!!!!!!!!!!!!!!!!!!!!
            $localstorage.setObject('favorites',self.candidatesSelected);
            self.finishSelection=true;
            $timeout(function () {
                $modalStack.dismissAll(null);
            },500);
        }
    };
});
