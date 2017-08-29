define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    require('lib/ui/slider/1.0.0/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var swiper = require('lib/plugins/swiper/2.7.0/swiper');
    var form = require('lib/core/1.0.0/utils/form');
   var templateRender = require('module/templateRender/1.0.0/templateRender')
    require('conf/header');
    
    var domId = $PAGE_DATA['domId'];
    var loadUrl = $PAGE_DATA['loadUrl'];//请求路径

    //轮播图
    $('#jSlider').slider();

    //图片懒加载
    var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: true,
        effect: 'fadeIn',
        snap: true,
        skipInvisible: false
    });

    //师资团队滚动
    var teacherSwiper_1 = new swiper('#jSwiper_1', {
        slidesPerView: 4
    });
    $('#jRight_1').on('click', function() {
        teacherSwiper_1.swipeNext();
    });
    $('#jLeft_1').on('click', function() {
        teacherSwiper_1.swipePrev();
    });
   
    //免费好课数据渲染
    new templateRender(domId,{
        url:loadUrl,
        temId:'jWrap'
    })

    $(".jTeachers").on("click","li",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        $(".mod-swiper").eq(_this.index()).addClass("active").siblings().removeClass("active");
        var swiperIndex = _this.index()+1;
        var swiperName = '#jSwiper_'+swiperIndex;
        var swiperNew = 'teacherSwiper_'+swiperIndex;
        swiperNew = new swiper(swiperName, {
            slidesPerView: 4
        });
         $('#jRight_'+swiperIndex).on('click', function() {
            swiperNew.swipeNext();
        });
        $('#jLeft_'+swiperIndex).on('click', function() {
            swiperNew.swipePrev();
        });

    })

});

