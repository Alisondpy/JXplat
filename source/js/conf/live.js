define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
     var box = require('lib/ui/box/1.0.1/crossbox');
     var io = require('lib/core/1.0.0/io/request');
    //头部的的登录注册还有搜索
    require('conf/header');

    var loginStatus = $PAGE_DATA['loginStatus'];
    var courseId = $("#applyCourseId").val();

    //图片懒加载
     var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: false,
        effect: 'fadeIn',
        snap: true
    });
   
   $("#joinMySchedule").on("click",function(){
        if(loginStatus != 'false'){
            //发送ajax请求
            io.post($PAGE_DATA['loadUrl'], { "courseId":courseId , },
                function(res) {
                    //成功后的回调
                    //验证码循环
                    box.ok(res && res.msg);
                    setTimeout(function(){
                        window.location.reload();
                    },2000)
                },
                function(res) {
                    box.error((res && res.msg) || '网络错误，请重试！');
                });
        }else{
            box.loadUrl($PAGE_DATA['loginSrc'], {
            title: '登录',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
        }

   })
});