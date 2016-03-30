angular.module('jne').controller('PartidosCtrl',function($scope,gtvzone,$timeout,sliderFactory,api){
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericPartidos", "#zone-nav-general-js", {});
    });

    $scope.partForos = {
        actual:0,
        data:[],
        total:null,
        ElementList:$('.item-height-full-select.item-keyboard-v2').first(),
        init: function (){
            var self=this;
            api.forums
                .get()
                .then(function (res) {
                    console.log(res);
                    self.data=res.results;
                    self.total=self.data.length;
                }, function (err){
                    console.log(err);
                });
            //self.slider();
        },
        slider: function () {
            sliderFactory
            .setValues($('#list-partidos-id'),
                       this.total,
                       '.item-height-full-select',4
            );
            gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-partidos-js", {});
        }
    };
    $scope.partForos.init();

});
