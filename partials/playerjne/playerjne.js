angular.module('jne').controller('PlayerjneCtrl',function($scope,$rootScope,
                                                          $localstorage,$timeout,
                                                          $window, $state,
                                                          gtvzone, $stateParams,
                                                          api,Restangular,
                                                          sliderFactory){
    var api = $rootScope.playerapi || flowplayer();
    $scope.Player = {
        url:'',
        video:{},
        related_videos_pp:[],
        related_videos_topic:[],
        ad:{
            haveAd:false,
            timeAd:5,
            finishTimeAd:false,
            interval:null
        },
        showRelationed:false,
        initialize: function () {
            var self=this;
            //var d=new Date();
            //console.log("CONSULTA");
            if($stateParams.url=='government-planes'){
                //self.showRelationed=false;
                self.url='government-planes/';
                Restangular.oneUrl(self.url + '/' + $stateParams.idvideo).get()
                    .then(function (res) {
                        //console.log(res.government_plan);
                        //var x=new Date();
                        //console.log(d-x);
                        self.initVideo(res.government_plan);
                        self.video.tittle="Plan - "+res.name;
                });

            }else{
                //self.showRelationed=true;
                self.url=$stateParams.url+'/videos';
                Restangular.oneUrl(self.url+'/'+$stateParams.idvideo).get()
                    .then(function (res) {
                        console.log(res);
                        //var x=new Date();
                        //console.log(d-x);
                        self.video=res;
                        //self.related_videos_pp      =res.related_videos_pp;
                        //self.related_videos_topic   =res.related_videos_topic;
                        self.initVideo(self.video.url);
                    });
            }

        },
        initVideo:function(url){
            var that=this;
            try {
                $('#player-video').flowplayer({
                    rtmp: "rtmp://s3b78u0kbtx79q.cloudfront.net/cfx/st",
                    ratio: 9 / 16,
                    playlist: [                 // an array of Clip objects
                        [
                            {                       // Clip object
                                mp4: window.location.origin + '/assets/video/jne.mp4',
                                //'http://smartbitperu.com/videoerror/americatv.mp4', //video cualquier nunca se mostrará
                                autoPlay: true      // override Common Clip for this clip
                            }
                        ]
                    ],
                    splash: true
                }, function (a, e, t) {
                    $scope.flowpl.clip_duration = t.duration;

                    var duration=Math.round($scope.flowpl.clip_duration),hour,minutes,
                        seconds=duration%60,
                        minutesTotal=(duration-seconds)/60;
                    minutes=minutesTotal%60;
                    hour=(minutesTotal-minutes)/60;

                    $scope.safeApply(function () {
                        $scope.duration={
                            hours:hour,
                            minutes:minutes,
                            seconds:seconds
                        };
                    });

                });
                $scope.flowpl.api = api = $rootScope.playerapi = flowplayer();
                that.setVideo(url);
                $scope.flowpl.bind();
            } catch (e) {
                alert(e.message + ' primera ves que llamo al flowplayer');
            }
        },
        initSlider:function(){
            sliderFactory
                .setValues($('#list-videos-id'),
                this.related_videos_pp.length,
                '.item-video-p', 6,265

            );
            gtvzone.zone("GENERIC_LAYER", "genericZona", "#conten-generic",{
                38: function (selectedItem, newSelected) {
                    // top
                    if (selectedItem.hasClass("btn-class-prevenHeader")){

                        // no hacer nada por que no hay header
                        return {
                            status: 'skip'
                        };
                    }
                    return {
                        status: 'none'
                    };
                },
                415: function (selectedItem, newSelected) {
                    // play
                    $scope.flowpl.btnPlayPause();
                    return {
                        status: 'skip'
                    };
                },
                19: function (selectedItem, newSelected) {
                    // pausa
                    $scope.flowpl.btnPlayPause();
                    return {
                        status: 'skip'
                    };
                },
                417: function (selectedItem, newSelected) {
                    // avanzar
                    $scope.flowpl.next();
                    return {
                        status: 'skip'
                    };
                },
                412: function (selectedItem, newSelected) {
                    // retroceder
                    $scope.flowpl.previus();
                    return {
                        status: 'skip'
                    };
                },
                81: function (selectedItem, newSelected) {
                    // play
                    $scope.flowpl.btnPlayPause();
                    return {
                        status: 'skip'
                    };
                },
                87: function (selectedItem, newSelected) {
                    // pausa
                    $scope.flowpl.btnPlayPause();
                    return {
                        status: 'skip'
                    };
                },
                69: function (selectedItem, newSelected) {
                    // avanzar
                    $scope.flowpl.next();
                    return {
                        status: 'skip'
                    };
                },
                82: function (selectedItem, newSelected) {
                    // retroceder
                    $scope.flowpl.previus();
                    return {
                        status: 'skip'
                    };
                }
            });
        },
        loadVideoNormal:function(video){
            var that=this;
            that.video=video;
            that.setVideo(that.video.url);
        },
        resetStatePlayer:function(val){
            $scope.flowpl.api.error = $scope.flowpl.api.loading = false;
            api.error = api.loading = false;
            $rootScope.playerapi.error=$rootScope.playerapi.loading= false;
        },
        setVideo: function (url){
            var that=this;
            //console.log(url);
            if (api) {
                try {
                    api.unload();
                    //console.log("loadl prev");
                    api.load(url);

                    api.bind("error", function (e,v) {
                        that.resetStatePlayer(false);
                        $('#player-video').removeClass("is-error");
                        api.unload();
                        that.video.url=window.location.origin + '/assets/video/jne.mp4';
                        that.initVideo(window.location.origin + '/assets/video/jne.mp4');
                        //$scope.flowpl.api = api = $rootScope.playerapi=undefined;
                    });

                    api.play();

                    $scope.flowpl.playPause = false;
                    flowplayer($('#player-video')).unbind( "finish" );
                    flowplayer($('#player-video')).bind("ready", function (e, api, time){
                        api.pause();
                        if(that.ad.haveAd){
                            that.intervalAd();
                        }
                    });
                    flowplayer($('#player-video')).bind("finish", function (e, api, time){
                        if(!that.ad.haveAd){
                            $window.history.back();
                        }
                        if(that.ad.haveAd){
                            that.loadVideoNormal();
                        }
                        //$scope.flowpl.pt100 = true;
                        api.unload();
                    });
                } catch (e) {
                    console.log("e",e);
                    alert(e.message + 'cuando api ya esta inicializada');
                }
            } else {
                alert('no se inicializo el flowplayer');
            }
        },
        watcher: function () {
            $scope.hidenBtns = gtvzone.hidenBtns = true;
            $('body').on('keydown , click', function () {
                $scope.safeApply(function () {
                    $scope.hidenBtns = gtvzone.hidenBtns = true;
                });
                clearInterval(gtvzone.timer);
                gtvzone.timer = setInterval(watch, 5000);
            });
            var watch = function () {
                $scope.safeApply(function () {
                    $scope.hidenBtns = gtvzone.hidenBtns = false;
                })
            };
            gtvzone.timer = setInterval(watch, 5000);
        },
        intervalAd:function(){
            var that=this;
            that.ad.interval=setInterval(function(){
                $scope.safeApply(function(){
                    if(that.ad.timeAd>0){
                        that.ad.timeAd=that.ad.timeAd-1;
                    }
                    if(that.ad.timeAd==0){
                        that.ad.finishTimeAd=true;
                        clearInterval(that.ad.interval);
                    }

                });
            },1000)
        },
        cleanIntervalAd:function(){
            var that=this;
            clearInterval(that.ad.interval);
        },
        btnBack: function () {
            if($rootScope.playerapi!=undefined){
                console.log('unload');
                //$scope.flowpl.api.unload();
                $rootScope.playerapi.unload();
            }
            $window.history.back();
        },
        btnMenu:function(){
            window.NetCastLaunchQMENU();
        }
    };

    $scope.flowpl = {
        api: api,
        playPause: true,
        timeactual: 0,
        previus: function () {
            if (this.timeactual - 30 < 0){
                this.api.seek(0);
            } else {
                this.api.seek(this.timeactual - 30);
            }
        },
        next: function () {

            this.api.seek(this.timeactual + 30);
        },
        btnPlayPause: function () {
            if (this.playPause) {
                this.play();
                if($scope.Player.ad.timeAd!=0){
                    $scope.Player.intervalAd();
                }
            } else {
                this.pause();
                $scope.Player.cleanIntervalAd();
            }
        },
        play: function () {
            var that=this;
            that.api.play();
            $scope.safeApply(function () {
                that.playPause = !that.playPause;
            })
        },
        pause: function () {
            var that=this;
            that.api.pause();
            $scope.safeApply(function () {
                that.playPause = !that.playPause;
            })
        },
        bind: function (){
            var that = this;
            flowplayer($('#player-video')).bind("ready", function (e, api, time){
                $scope.flowpl.clip_duration= time.duration;

                var duration=Math.round($scope.flowpl.clip_duration),hour,minutes,
                    seconds=duration%60,
                    minutesTotal=(duration-seconds)/60;
                minutes=minutesTotal%60;
                hour=(minutesTotal-minutes)/60;



                $scope.safeApply(function () {
                    $scope.duration={
                        hours:hour,
                        minutes:minutes,
                        seconds:seconds
                    };
                });

            });

            flowplayer($('#player-video')).bind("progress", function (e, api, time) {
                that.timeactual = time;
                //analitics

                // BORRAR
                //$scope.flowpl.pause();

                $scope.safeApply(function () {
                    $('#icon-progress-id').css({'left':((time/that.clip_duration)*100) + '%'});// bar progess

                    var duration=Math.round(time),hour,minutes,
                        seconds=duration%60,
                        minutesTotal=(duration-seconds)/60;
                    minutes=minutesTotal%60;
                    hour=(minutesTotal-minutes)/60;


                    $scope.timeProgress={
                        hours:hour,
                        minutes:minutes,
                        seconds:seconds
                    };
                });
            });
        }
    };
    $timeout(function () {
        gtvzone.zone("GENERIC_LAYER", "genericZona", "#conten-generic",{
            38: function (selectedItem, newSelected) {
                // top
                if (selectedItem.hasClass("btn-class-prevenHeader")){

                    // no hacer nada por que no hay header
                    return {
                        status: 'skip'
                    };
                }
                return {
                    status: 'none'
                };
            },
            415: function (selectedItem, newSelected) {
                // play
                $scope.flowpl.btnPlayPause();
                return {
                    status: 'skip'
                };
            },
            19: function (selectedItem, newSelected) {
                // pausa
                $scope.flowpl.btnPlayPause();
                return {
                    status: 'skip'
                };
            },
            417: function (selectedItem, newSelected) {
                // avanzar
                $scope.flowpl.next();
                return {
                    status: 'skip'
                };
            },
            412: function (selectedItem, newSelected) {
                // retroceder
                $scope.flowpl.previus();
                return {
                    status: 'skip'
                };
            },
            81: function (selectedItem, newSelected) {
                // play
                $scope.flowpl.btnPlayPause();
                return {
                    status: 'skip'
                };
            },
            87: function (selectedItem, newSelected) {
                // pausa
                $scope.flowpl.btnPlayPause();
                return {
                    status: 'skip'
                };
            },
            69: function (selectedItem, newSelected) {
                // avanzar
                $scope.flowpl.next();
                return {
                    status: 'skip'
                };
            },
            82: function (selectedItem, newSelected) {
                // retroceder
                $scope.flowpl.previus();
                return {
                    status: 'skip'
                };
            }
        });
        $scope.Player.initialize();
        $scope.Player.watcher();
    });

});
