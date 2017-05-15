define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');

    //判断用户是否登陆
    var loginStatus = $PAGE_DATA['loginStatus'];
//
    var form = require('lib/core/1.0.0/utils/form');
    var template=require("template");
    var io = require('lib/core/1.0.0/io/request');
    var box = require('lib/ui/box/1.0.1/crossbox');
    
    require('conf/header');

    $("#jReport").on("click",function(){
        if(loginStatus != "false"){
            var applyBox = box.loadUrl($PAGE_DATA['applyUrl'], {
                title: '报名详情',
                autoRelease: false,
                modal: true //是否有遮罩层
            });
            applyBox.css({"width":"450px"});
        }else{
            box.loadUrl($PAGE_DATA['loginSrc'], {
                title: '登录',
                autoRelease: false,
                modal: true //是否有遮罩层
            });

        }
    })
});
