define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    require('lib/ui/slider/1.0.0/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var form = require('lib/core/1.0.0/utils/form');
    require('conf/header');


    // 分页
    var template=require("template");
    var Pager = require('plugins/pager/1.0.0/pager');
    var navigation = require('module/navigation-bar/1.0.0/navigation-bar');
    var jPagination = $('#jPagination');
    var domId = $PAGE_DATA['domId'];
    var loadUrl = $PAGE_DATA['loadUrl'];//请求路径

    //图片懒加载
    var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: false,
        effect: 'fadeIn',
        snap: true,
        threshold : 200,
        event  : "mouseover"
    });
   
      /*
     * 渲染分页列表
     * */
    var lazy,pager;
    function renderList(url,data,tmpEl,htmEl,pagEl){
        if(typeof pager !== 'undefined'){
            pager.destroy();
        }
        pager = new Pager(pagEl, {
            url:url,
            data:data,
            options: {
                pageSize:data.pageSize,
                currentPage: 1
            }
        });

        var loading = null;

        pager.on('ajaxStart', function() {
            loading = box.loading('正在加载...', {
                modal: false
            });
        });

        pager.on('ajaxSuccess', function(res, callback) {
            if(!$.isEmptyObject(res.data) && res.data && res.data.resultList && res.data.resultList.length > 0){
                var html = template(tmpEl,res.data);
                document.getElementById(htmEl).innerHTML = html;
                //图片懒加载
                lazy = new Lazyload($("#"+htmEl).find('.jImg'), {
                    loadingClass: 'img-error',
                    mouseWheel: true,
                    effect: 'fadeIn',
                    snap: true
                });
                callback && callback(res.data.records);
            }else {
                var html = template('tEmpty',1);
                document.getElementById(htmEl).innerHTML = html;
                pagEl.hide();
            }
            loading && loading.hide();
        });

        pager.on('ajaxError', function(data) {
            document.getElementById(htmEl).innerHTML = "<div class='ui-error'>请求超时请重试！<a href=''>刷新</a></div>";
            loading && loading.hide();
        });

        pager.on('change', function(pageNum, e) {
            console.log(pageNum);
        });
    };
    // 初始化页面方法
    function init(){
        var keyword = $("#indexSearchBar").val() || "" || $("#courseName").val();
        $("#indexSearchBar").val($("#courseName").val());
        
        var categoryId = $("#categoryIds .active").find('a').attr('value');
        var courseValue = $("#courseType a.active").attr("value");
        renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword,"courseType":courseValue},"jWrap",domId,jPagination);
    }

    init();

    //tab页切换

    $("#categoryIds").on("click","li",function(e){
        var _this = $(this);
         e.stopPropagation();
        var keyword = $("#indexSearchBar").val() || "";
        if(_this.is($(".more-btn"))){

        }else{
            $("#categoryIds").find("li").removeClass("active");
            _this.addClass("active");
            
            if(_this.parent().is($(".mod-more-nav"))){
                $(".more-btn").addClass("active");
            }
            var categoryId = _this.find('a').attr('value');
            var courseValue = $("#courseType a.active").attr("value");
            renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword,"courseType":courseValue},"jWrap",domId,jPagination);
        }

    })
    // 直播点播切换
    $("#courseType").on("click","a",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        var courseValue = _this.attr("value");
        var categoryId = $("#categoryIds li.active").find('a').attr('value');
        var keyword = $("#indexSearchBar").val() || "";
        renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword,"courseType":courseValue},"jWrap",domId,jPagination);
    })
    //*渲染数据结束*/

});

