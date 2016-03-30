angular.module('jne').controller('MapcongresistasSeleccionaCongresistaCtrl',function($scope,$timeout,gtvzone,api,$stateParams){
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericCandidate", "#zone-candidate-js", {});
        gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-candidate-js", {});
    });
    $scope.mapCongresistaSC = {
        actual: 0,
        data: {},
        init: function () {
            var self = this;
            console.log($stateParams);
            api.congressmen.one($stateParams.idCongresista.toString())
                .get()
                .then(function (res) {
                    console.log(res);
                    self.data = res;
                }, function (err) {
                    console.log(err);
                });
            //self.slider();
        }
    };
    $scope.mapCongresistaSC.init();
});
