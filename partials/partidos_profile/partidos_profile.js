angular.module('jne').controller('PartidosProfileCtrl',function($scope,$timeout,gtvzone){
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericCandidate", "#zone-partido-profile-js", {});
        gtvzone.zone("GENERIC_LAYER", "genericZona", "#zone-menu-candidate-js", {});
    });

});
