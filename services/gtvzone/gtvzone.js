angular.module('jne').factory('gtvzone',function ($rootScope, $state, $window,$timeout) {
    var generalKeymapping = {
        13: function (selectedItem, newSelected){
            selectedItem.trigger('click');//con esto disparamos una accion que está implementado un poco mas abajo en Click
            return {
                status: 'selected'//este debe estar siempre, solo varia cuando se quiere hacer cosas especiales que no se harán para este proyecto
            };
        },
        107: function (selectedItem, newSelected) {//back
            if ($state.current.name == "home") {
                window.NetCastBack();
            } else {
                $window.history.back();
            }
            return {
                status: 'skip'
            };
        },
        461: function (selectedItem, newSelected) {//back
            //hace el back en Angular
            if ($state.current.name == "home") {
                window.NetCastBack();
            } else {
                $window.history.back();
            }
            return {
                status: 'skip'
            };
        },
        40: function (selectedItem, newSelected) {
            //down
            //console.log('down');
            //if (selectedItem.hasClass("incioCustomMapping")) {
            //    gtvzone.globalKeyMappingController.setSelected($('.lastCategory'));
            //    return {
            //        status: 'skip'
            //    };
            //}
            return {
                status: 'none'
            };
        },
        37: function (selectedItem, newSelected) {
            //left
            //console.log("left");
            //if (selectedItem.hasClass("incioCustomMapping")){
            //    gtvzone.globalKeyMappingController.setSelected($('.firstCategory'));
            //    return {
            //        status: 'skip'
            //    };
            //}
            //if(newSelected!=undefined){
            //    if(newSelected.hasClass("btn-class-arrow-no-select")){
            //        return {
            //            status: 'skip'
            //        }
            //    }
            //}
            return {
                status: 'none'
            };
        },
        38: function (selectedItem, newSelected){
            // top
            //console.log("top");
            //if(newSelected!=undefined){
            //    if(newSelected.hasClass("ejemplo")){
            //        return {
            //            status: 'skip'
            //        }
            //    }
            //}
            return {

                status: 'none'
            };
        },
        39: function (selectedItem, newSelected) {
            //right
            //console.log("right");
            return {
                status: 'none'
            };
        }

    };


    var gtvzone = {
        globalKeyMappingController:null,
        zone: function (name, zone, selector, keyMapping, actionZone) {
            for (var key in generalKeymapping) {
                if (!keyMapping[key])
                    keyMapping[key] = generalKeymapping[key];
            }
            for (var key in generalKeymapping) {
                if (!keyMapping[key])
                    keyMapping[key] = generalKeymapping[key];
            }
            if (this[zone]) {
                this.globalKeyMappingController.removeBehaviorZone(this[zone]);
            }


            this[zone] = new gtv.jq.KeyBehaviorZone({
                containerSelector: selector,
                navSelectors: {
                    item: '.item-keyboard-v2',
                    itemParent: '.keyboard-parent',
                    itemRow: '.keyboard-row',//esta es cada fila del teclado
                    itemPage: null
                },
                selectionClasses: {
                    basic: 'focus-item-keyboard',
                    hasData: 'focus-item-keyboard'
                },
                saveRowPosition: false,
                keyMapping: keyMapping,
                actions:(actionZone==undefined?{}:actionZone)
                //{
                //    click: function (el) {
                //        //console.log(el)
                //    },
                //    leaveZone: function (selectedItem) {
                //        //console.log("salio");
                //    },
                //    moveSelected:function moveSelected(selectedItem, newSelectedItem) {
                //        //console.log($state.current.name);
                //        if(['home','planes'].indexOf($state.current.name)!=-1){
                //            if(selectedItem!=null && newSelectedItem!=null ){
                //                selectedItem.toggleClass('grayscale-off');
                //                newSelectedItem.toggleClass('grayscale-off');
                //            }
                //        }
                //        //console.log(selectedItem);
                //    }
                //}
                ,useGeometry: true //poner true siempre
            });
            this.globalKeyMappingController.addBehaviorZone(this[zone], true, [name]);
            $rootScope.selectInit = function () {
                var elementDefault=$('.elementSelectDefaultInit');
                if (elementDefault.length != 0 && !$rootScope.modalOpenGlobal.band) {
                        gtvzone.globalKeyMappingController.setSelected(elementDefault);
                        return {
                            status: 'skip'
                        };
                }
            };
            $timeout(function () {
                $rootScope.selectInit();
            },300)
        }
    };

    return gtvzone;
});
