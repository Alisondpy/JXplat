define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    require('lib/ui/slider/1.0.0/slider');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var swiper = require('lib/plugins/swiper/2.7.0/swiper');
    var form = require('lib/core/1.0.0/utils/form');
    require('conf/header');

// ∑÷“≥
    var template=require("template");
    var Pager = require('plugins/pager/1.0.0/pager');
    var navigation = require('module/navigation-bar/1.0.0/navigation-bar');
    var jPagination = $('#jPagination');

    var domId = $PAGE_DATA["domId"];
    var loadUrl = $PAGE_DATA["loadUrl"];


    /*
     * ‰÷»æ∑÷“≥¡–±Ì
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
                pageSize: 6,
                currentPage: 1
            }
        });

        var loading = null;

        pager.on('ajaxStart', function() {
            loading = box.loading('’˝‘⁄º”‘ÿ...', {
                modal: false
            });
        });

        pager.on('ajaxSuccess', function(res, callback) {
            if(!$.isEmptyObject(res.data) && res.data && res.data.resultList && res.data.resultList.length > 0){
                var html = template(tmpEl,res.data);
                document.getElementById(htmEl).innerHTML = html;
                //Õº∆¨¿¡º”‘ÿ
                lazy = new Lazyload($("#"+htmEl).find('.jImg'), {
                    loadingClass: 'img-error',
                    mouseWheel: false,
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
            document.getElementById(htmEl).innerHTML = "<div class='ui-error'>«Î«Û≥¨ ±«Î÷ÿ ‘£°<a href=''>À¢–¬</a></div>";
            loading && loading.hide();
        });

        pager.on('change', function(pageNum, e) {});
    };

    function init(){
        var keyword = $("#topSearchBar").val() || "";
        $("#categoryIds").children("span").eq(0).addClass("active");
        var categoryId = $("#categoryIds").find('.active').attr('value');
        renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword},"jWrap",domId,jPagination);
    }

    init();

    //tab“≥«–ªª

    $("#categoryIds").on("click","span",function(){
        var _this = $(this);
        _this.addClass("active").siblings().removeClass("active");
        var keyword = $("#topSearchBar").val() || "";
        var categoryId = _this.attr('value');
        renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword},"jWrap",domId,jPagination);

    })
    // À—À˜‰÷»æ∑÷“≥
    $("#jSearch").on("click",function(){
        var categoryId = $("#categoryIds").find('.active').attr('value');
        var keyword = $("#topSearchBar").val() || "";
        renderList(loadUrl,{'categoryId':categoryId,"keyWord":keyword},"jWrap",domId,jPagination);
    })



    //*‰÷»æ ˝æ›Ω· ¯*/

    //Õº∆¨¿¡º”‘ÿ
    var lazy = new Lazyload($('.jImg'), {
        loadingClass: 'img-error',
        mouseWheel: false,
        effect: 'fadeIn',
        snap: true
    });



});
