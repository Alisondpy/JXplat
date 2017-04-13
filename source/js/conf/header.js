
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var box = require('lib/ui/box/1.0.1/crossbox');
    // 登录弹出层
    $(".Jlogin").on("click",function(){
        var topBox = 
        box.loadUrl($PAGE_DATA['loginSrc'], {
                title: '登录',
                autoRelease: false,
                modal: true //是否有遮罩层
            });
        });
    $(".Jregister").on("click",function(){
            box.loadUrl($PAGE_DATA['registerSrc'], {
                title: '注册',
                autoRelease: false,
                modal: true //是否有遮罩层
        });
    })
// 登录弹出end

    var loadUrl = $PAGE_DATA['headSearchUrl'];

    $("#indexSearch").on("click",function(){
        var keyword = $("#indexSearchBar").val();
        if(keyword){
            window.location.href = loadUrl+'?keyWord='+keyword;
        }
    })

    
});
