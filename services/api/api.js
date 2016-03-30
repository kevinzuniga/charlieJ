angular.module('jne').factory('api',function(Restangular) {
    return {
        debates: Restangular.one('debate'),
        forums: Restangular.one('forum'),
        // POLITICALPARTY
        candidates: Restangular.one('candidates'),
        governmentPlanes: Restangular.one('government-planes'),
        congressmen: Restangular.one('congressmen'),
        topics: Restangular.one('topics'),
        regions: Restangular.one('regions'),
        organizers: Restangular.one('organizers')
    }
});
