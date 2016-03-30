angular.module('jne').filter('favoritesX', function($localstorage) {
	return function (candidates) {
        var favorites = $localstorage.getObject('favorites') || [];
        if (candidates != undefined && candidates.length>0 && favorites.length>0) {
            var candidateTemp;
            console.log("dd");
            for (var j = 0; j < favorites.length; j++) {
                for (var i = 0; i < candidates.length; i++) {
                    console.log(candidates[i].id == favorites[j]);
                    if (candidates[i].id == favorites[j]) {
                        candidateTemp = candidates[i];
                        candidates.splice(i, 1);
                        candidates.unshift(candidateTemp);
                        i = candidates.length;
                    }
                }
            }
            return candidates.reverse();
        } else {
            return candidates;
        }
    }
});
