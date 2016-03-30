describe('MapcongresistasEspecificaRegionCtrl', function() {

	beforeEach(module('jne'));

	var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('MapcongresistasEspecificaRegionCtrl', {$scope: scope});
    }));	

	it('should ...', inject(function() {

		expect(1).toEqual(1);
		
	}));

});