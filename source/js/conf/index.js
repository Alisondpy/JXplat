define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    require('lib/ui/slider/1.0.0/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var IO = require('lib/core/1.0.0/io/request');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var swiper = require('lib/plugins/swiper/2.7.0/swiper');
    var form = require('lib/core/1.0.0/utils/form');
    var templateRender = require('module/templateRender/1.0.0/templateRender');
    require('conf/header');
    var domId_1 = $PAGE_DATA['newsDomId1'];
    var loadUrl_1 =  $PAGE_DATA['newsUrl1']; 

    var domId_2 =   $PAGE_DATA['newsDomId2'];
    var loadUrl_2 =  $PAGE_DATA['newsUrl2']; 

    var domId_3 = $PAGE_DATA['newsDomId3'];
    var loadUrl_3 =  $PAGE_DATA['newsUrl3'];

    //首页课程模块加载
    var courseVideoUrl = $PAGE_DATA['courseVideoUrl'];
    var courseLiveUrl = $PAGE_DATA['courseLiveUrl'];
    var courseDomId = $PAGE_DATA['courseDomId'];


    require('plugins/calender');


    //首页服务产品模块加载
    var productUrl = $PAGE_DATA['productUrl'];
    var productDomId =  $PAGE_DATA['productDomId'];

    //活动沙龙日历模块加载
    var indexCalendarUrl = $PAGE_DATA['indexCalendarUrl'];
     IO.get(indexCalendarUrl,function(res){
        var dataArray = [];
        for(var i = 0;i<res.data.length;i++){
            var map = {};
            var date_id = res.data[i].id;
            var year = res.data[i].year;
            var month = res.data[i].month;
            var day = res.data[i].day;
            var name = res.data[i].name;//活动名称
            dataArray.push(map);
            map.datetime = new Date(year,month,day);
            map.href = "/activity/activityDetail.htm?id="+date_id;
            map.name = name;
        };
         $('#calendar').eCalendar({events:dataArray});
        },
        function(res){
            $('#calendar').eCalendar({events:[]});

        }
    )



    //轮播图
    $('#jSlider').slider();
// 专家顾问点击切换
    $(".jTab").on("click","li",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        if(_this.parents(".jTab").is("#jTurn")){
            if(_this.index() == 0){
                new templateRender(courseDomId,{
                    url:courseLiveUrl,
                    temId:'jCourseWrap'
                }) 
            }else{
                   new templateRender(courseDomId,{
                    url:courseVideoUrl,
                    temId:'jCourseWrap'
                })
    
            }
        }
    })
    //配套服务切换
    $(".jService").on("click","li",function(){
        var _this = $(this);
        var code = _this.attr("data-val");
        _this.addClass("active").siblings().removeClass("active");
        new templateRender(productDomId,{
            url:productUrl+"?code="+code,
            temId:'jVendorWrap'
        })
    })



    $(".jExpertTab").on("click","li",function(){
         var _this = $(this);
            _this.addClass("active").siblings().removeClass("active");
            _this.parents(".mod-expert").find(".expert-wrap").eq(_this.index()).addClass("active").siblings().removeClass("active");
    })
    $(".mod-study-tab").on("click","li",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        $(".expert-containenr").find(".mod-expert").eq(_this.index()).addClass("active").siblings().removeClass("active");
    })
    //图片懒加载
    
   //资讯动态数据渲染
    new templateRender(domId_1,{
        url:loadUrl_1,
        temId:'jNewsWrap'
    });
    new templateRender(domId_2,{
        url:loadUrl_2,
        temId:'jNewsWrap'
    });
    new templateRender(domId_3,{
        url:loadUrl_3,
        temId:'jNewsWrap'
    })
    
    new templateRender(courseDomId,{
        url:courseLiveUrl,
        temId:'jCourseWrap'
    }) 
    

    new templateRender(productDomId,{
        url:productUrl,
        temId:'jVendorWrap'
    })

     var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: true,
        effect: 'fadeIn',
        snap: true,
        skipInvisible: false
    });


$(".hot-news").on("mouseover","li",function(){
    var _this = $(this);
    _this.addClass("active").siblings().removeClass("active");
})
})


