angular.module('jne').controller('CandidatoCtrl',function($scope,$timeout,gtvzone,api,$stateParams){
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-candidate-js", {});
    });

    $scope.partCandidato = {
        actual:0,
        data:{},
        ElementList:$('.item-videos-candidate-one.item-keyboard-v2').first(),
        init: function () {
            var self=this;
            api.candidates.one($stateParams.idParty.toString())
                .get()
                .then(function (res) {
                    console.log(res);
                    self.data=res;
                }, function (err){
                    console.log(err);
                });
            //self.slider();
        },
        slider: function () {
            var self=this;
            // ************ TEST
            $('#list-debates-id').css('width','1536px');
            //*********************************************
        }
    };
    $scope.partCandidato.init();
    gtvzone.zone("GENERIC_LAYER", "genericCandidate", "#zone-candidate-js", {});
});
