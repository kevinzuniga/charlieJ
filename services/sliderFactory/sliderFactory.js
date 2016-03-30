angular.module('jne').factory('sliderFactory',function($rootScope) {
	return {
        container: {},
        totalElements: 0,
        elementSelected: '',
        elementsForView: 0,
        leftInit: 0,
        actual: 0,
        setActual: function (val) {
            var self = this;

            if (val) {
                if (self.actual + 1 <= self.totalElements)self.actual++;
            }
            else if (self.actual - 1 >= 0)self.actual--;

            if (self.actual == 0) {
                $('.item-arrow-left').hide();
            }
            else {
                $('.item-arrow-left').show();
            }

            if (self.actual + self.elementsForView == self.totalElements) {
                $('.item-arrow-right').hide();
            }
            else {
                $('.item-arrow-right').show();
            }
        },
        setValues: function (container, totalElements, elementSelected, elementsForView, leftInit) {
            var self = this;
            console.log("container",container.length);
            self.container = container;
            self.totalElements = totalElements;
            self.elementSelected = elementSelected;
            self.elementsForView = elementsForView;
            self.leftInit = leftInit;
            self.actual = 0;
            $rootScope.actualSlider = 0;

            if (leftInit == undefined) {
                self.leftInit = 0;
                leftInit = 0
            }
            container.css('width', totalElements * $(elementSelected + '.item-keyboard-v2').outerWidth() + 'px');
            self.ElementList = $(elementSelected + '.item-keyboard-v2').first();

            $('.item-arrow-left').hide();

            $('.item-arrow-left-select').click(function () {
                var contenList = container;
                //console.log('I '+contenList.position().left);
                if (contenList.position().left < 0) {
                    contenList.css({'left': contenList.position().left + self.ElementList.outerWidth() + 'px'});
                    $rootScope.setActualSlider(-1);
                    self.setActual(0);
                }
            });

            $('.item-arrow-right-select').click(function () {
                var contenList = container;

                if (contenList.width() - (-1) * contenList.position().left > self.ElementList.outerWidth() * elementsForView) {
                    contenList.css({'left': contenList.position().left - self.ElementList.outerWidth() + 'px'});
                    $rootScope.setActualSlider(1);
                    self.setActual(1);
                }
            });

            if (totalElements <= elementsForView) {
                $('.item-arrow-right-select').hide();
            }

            container.on({
                'mousewheel': function (event) {
                    var contenList = container;
                    if (event.originalEvent.wheelDelta > 0 && contenList.position().left < 0) {
                        container.css({'left': contenList.position().left + self.ElementList.outerWidth() + 'px'});
                        $rootScope.setActualSlider(-1);
                        self.setActual(0);
                    }
                    if (event.originalEvent.wheelDelta < 0 && contenList.position().left > (-1) * (contenList.width() - elementsForView * (self.ElementList.outerWidth()))) {
                        container.css({'left': contenList.position().left - self.ElementList.outerWidth() + 'px'});
                        $rootScope.setActualSlider(1);
                        self.setActual(1);
                    }
                    //console.log($rootScope.actualSlider);
                    if (event.target.id == 'el') return;
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        },
        keyDownApp: function (event) {
            var self = this,
                container = self.container,
                totalElements = self.totalElements,
                elementSelected = self.elementSelected,
                elementsForView = self.elementsForView,
                leftInit = self.leftInit,
                eFocus = $(elementSelected + '.item-keyboard-v2.focus-item-keyboard');

            if (eFocus.offset() != undefined && self.ElementList!=undefined) {

                var left = eFocus.offset().left, contenList = container;

                if (left < leftInit && event.which == 37) {
                    $rootScope.safeApply(function () {
                        contenList.css({'left': contenList.position().left + self.ElementList.outerWidth() + 'px'});
                        $rootScope.setActualSlider(-1);
                        self.setActual(0);
                    });
                }
                if (left >= self.ElementList.outerWidth() * elementsForView && event.which == 39) {
                    $rootScope.safeApply(function () {
                        contenList.css({'left': contenList.position().left - self.ElementList.outerWidth() + 'px'});
                        $rootScope.setActualSlider(1);
                        self.setActual(1);
                    })
                }
            }
        },
        getActual: function () {
            return this.actual;
        }
    };
});
