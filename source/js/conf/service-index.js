define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var form = require('lib/core/1.0.0/utils/form');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    require('conf/header');

// 分页
    var template=require("template");
    var Pager = require('plugins/pager/1.0.0/pager');
    var navigation = require('module/navigation-bar/1.0.0/navigation-bar');
    var jPagination = $('#jPagination');

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
                pageSize: 24,
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

        pager.on('change', function(pageNum, e) {});
    };

    function init(){
        var keyword = $("#topSearchBar").val() || "";
        var categoryId = $('#service_nav').find('.active').attr('value');
        renderList($PAGE_DATA['loadUrl'],{'categoryId':categoryId,"keyWord":keyword},"jWrap",$PAGE_DATA['domId'],jPagination);
    }

    init();

    //tab页切换

    $("#service_nav").on("click","a",function(){
        var _this = $(this);
        $("#service_nav").find("a").removeClass("active");
        _this.addClass("active");
        var keyword = $("#topSearchBar").val() || "";
        var categoryId = _this.attr('value');
        renderList($PAGE_DATA['loadUrl'],{'categoryId':categoryId,"keyWord":keyword},"jWrap",$PAGE_DATA['domId'],jPagination);

    })
    // 搜索渲染分页
    $("#jSearch").on("click",function(){
        var categoryId = $('#service_nav').find('.active').attr('value');
        var keyword = $("#topSearchBar").val() || "";
        renderList($PAGE_DATA['loadUrl'],{'categoryId':categoryId,"keyWord":keyword},"jWrap",$PAGE_DATA['domId'],jPagination);
    })


    //*渲染数据结束*/

    //图片懒加载
    var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: false,
        effect: 'fadeIn',
        snap: true
    });
});
