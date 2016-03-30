angular.module('jne').controller('DebatesCtrl',function($scope,gtvzone,$timeout,sliderFactory,api){
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-debates-js", {});
    });

    $scope.partDebate = {
        actual:0,
        data:[],
        total:null,
        ElementList:$('.item-height-full-select.item-keyboard-v2').first(),
        init: function () {
            var self=this;



            api.forums.one('organizers')
                .get()
                .then(function (res) {
                    console.log(res);
                    self.data=res;
                    self.total=self.data.length;
                    if(self.total===0){
                        $('.message-void-debates').show();
                        $('.item-arrow-right').hide();
                        $('.item-arrow-left').hide();
                    }
                }, function (err){
                    console.log(err);
                });
            //self.slider();
            //self.slider();
        },
        slider: function () {

            sliderFactory
            .setValues(
                   $('#list-debates-id'),
                   this.total,
                   '.item-height-full-select',4
            );
            gtvzone.zone("GENERIC_LAYER", "genericDebates", "#zone-debates-js", {});
        }
    };
    $scope.partDebate.init();
});
