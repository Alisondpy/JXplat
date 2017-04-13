define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
     var box = require('lib/ui/box/1.0.1/crossbox');
    require('conf/header');
    var loginStatus = $PAGE_DATA['loginStatus'];

    //图片懒加载
    var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: false,
        effect: 'fadeIn',
        snap: true
    });

    $(".jTalk").on("click",function(){
        if(loginStatus != "false"){
            var productId = $("#productId").val();
            box.loadUrl($PAGE_DATA['loadUrl'] + "?productId="+productId,{
                    title: '发起约谈',
                    autoRelease: false,
                    modal: true //是否有遮罩层,
            });
        }else{
            box.loadUrl($PAGE_DATA['loginSrc'], {
                title: '登录',
                autoRelease: false,
                modal: true //是否有遮罩层
            });
        }
        
    })

    $(".service_item").on("click","li",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        $(".service-info").hide();
        $(".service-info").eq(_this.index()).show();
    })

});
