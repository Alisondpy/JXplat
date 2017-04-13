define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var template = require("template");
    var TouristTips = require('module/monitor/1.0.0/tourist-tips');

    //====================播放器 start

    //====================后台获取参数 start
    var courseId = $PAGE_DATA['courseId'];
    //var examId = $PAGE_DATA['examId'];
    var loginStatus = $PAGE_DATA['loginStatus'];
    //====================后台获取参数 end
    

    //显示是否隐藏游客提示信息
    var touristTips = new TouristTips();

    var Player = require('plugins/ckplayer/6.8.0/player');

    var player = new Player('#flashContent', {
        swfPlayer: $PAGE_DATA['ckplayer'],
        embed: {
            width: '1200',
            height: '500'
        },
        flash: {
            p: 1,
            i: $PAGE_DATA['lessonImageUrl'], //初始图片地址
            g: $PAGE_DATA['startTime'] || 0,
            f: $PAGE_DATA['m3u8'], //必填 请别跨域 要播放文件的路径
            a: $PAGE_DATA['play'] //必填 请别跨域 如果要调用m3u8格式的文件，必须要用到的播放插件【调用时的参数，只有当s>0的时候有效】
        }
    });

    var isSendPlayTime = true;
    
    //如果播放就加载提示
    player.on('play',function(){
        if(loginStatus != 'false'){
            touristTips.hide();
        }else{
            touristTips.show();
        }
    });
    //监听当前播放器进度
    player.on('time', function(seconds) {
        if (loginStatus != 'false'){// 未登录用户不记录学习记录
            if (isSendPlayTime && seconds > 0) {
                isSendPlayTime = false;
                var _params = $.extend(true, {}, $PAGE_DATA['setPlayTimeParams'], {
                    playTime: seconds,
                    duration: player.getTotalTime(),
                    courseId: courseId
                });
                io.get($PAGE_DATA['setPlayTime'], _params, function(data) {
                    isSendPlayTime = true;
                }, function(data) {
                    isSendPlayTime = true;
                });
            }
        }
        if (seconds >= 60){
            if (loginStatus == "false"){
                setTimeout(function(){
                    player.pause();
                },500);
                player.jump(0);
                touristTips.show();
            }
        }
    });
    //视频播放结束
    var jArrowR = $('#jArrowR');
    player.on('ended',function(){
        var newTab;
        var href = jArrowR.attr('href');
        if(examId != ''){
            box.confirm('是否进入考试页面？',function() {
                //box.loadUrl($PAGE_DATA['examUrl'], {
                //    title: '考试',
                //    className: 'ui-test-box',
                //    fixed: true,
                //    width: $(window).width(),
                //    height: $(window).height()
                //});
                newTab = window.open('about:blank');
                newTab.location.href = $PAGE_DATA['examUrl'];
            },
            function() {
                if(href != '' && href){
                    window.location.href = href;
                }
            }, this);
        }else {
            if(href != '' && href){
                window.location.href = href;
            }
        }
    });
    //====================播放器 end

    // 点击登录
    $("#jModVideoBox").on("click",".btn-login",function(){
         box.loadUrl($PAGE_DATA['loginSrc'], {
            title: '登录',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
    })
   
});
