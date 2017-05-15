define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    require('lib/ui/slider/1.0.0/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var swiper = require('lib/plugins/swiper/2.7.0/swiper');
    var form = require('lib/core/1.0.0/utils/form');
    var templateRender = require('module/templateRender/1.0.0/templateRender');
    require('conf/header');
    var domId = $PAGE_DATA['domId'];
    var loadUrl = $PAGE_DATA['loadUrl'];//请求路径

    //轮播图
    $('#jSlider').slider();

    //图片懒加载

    //师资团队滚动
    var teacherSwiper = new swiper('#jSwiper', {
        slidesPerView: 3
    });

    $('#jRight').on('click', function() {
        teacherSwiper.swipeNext();
    });
    $('#jLeft').on('click', function() {
        teacherSwiper.swipePrev();
    });

    //资讯动态数据渲染
    new templateRender(domId,{
        url:loadUrl,
        temId:'jWrap'
    })

    // 资讯动态交互效果

     $("#"+$PAGE_DATA['domId']).on("mouseover",".jIntr",function(){
        var self = $(this);
        var _this = self.parents("ul");
        _this.find(".jDetail").hide();
        _this.find(".jIntr").show().css({"borderLeft":"1px solid #dee1e5"});
        self.hide().siblings(".jDetail").show();
        var liIndex = self.parents("li").index();
        _this.find("li").eq(liIndex-1).find(".jIntr").css({"border":"none"});

     })

     var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: true,
        effect: 'fadeIn',
        snap: true
    });
   
  
})


