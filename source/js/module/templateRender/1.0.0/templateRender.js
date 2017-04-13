define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var form = require('lib/core/1.0.0/utils/form');
    var template = require("template");
    var IO = require('lib/core/1.0.0/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var domId = $PAGE_DATA["domId"];

 /*   * @param selector [dom selector] dom选择器
    * @param options [mix] 参数
 * */
    function templateRender(selector,options){
     var _this = this;
        var defaults = {
            url: null,
            temId:'jWrap'
        };
        _this.el = $("#"+selector);
        _this.options = $.extend(true,{},defaults,options);
        _this._init();
        _this._change();
        $("#categoryIds").find("li").eq(0).addClass("active");
    };
    templateRender.prototype._init = function(){
        var _this = this;
        var options = _this.options;
        var el = _this.el;
        var categoryId = $("#categoryIds").find(".active").children().attr("value") || "";
        el.html("正在加载中...");
        if(categoryId){
            IO.get(options.url,{'categoryId':categoryId},function(res){
                    if(options.url == null){
                        el.html("数据请求出错");
                    }
                    if(res.data.resultList == null || res.data.resultList.length <= 0){
                          var html = template('tEmpty',1);
                        document.getElementById(domId).innerHTML = html;
                    }else{
                        _this._template(res);
                    }

                },
                function(res){
                    el.html('<p>网络错误，请点击<a class="jReload">重新加载</a></p>');
                }
            )
        }else{
            IO.get(options.url,function(res){
                    if(options.url == null){
                        el.html("数据请求出错");
                    }
                   if(res.data.resultList == null || res.data.resultList.length <= 0){
                          var html = template('tEmpty',1);
                        document.getElementById(domId).innerHTML = html;
                    }else{
                        _this._template(res);
                        var lazy = new Lazyload($("#"+domId).find('.jImg'), {
                            loadingClass: 'img-error',
                            mouseWheel: true,
                            effect: 'show',
                            event : "mouseover",
                            snap: true
                        });
                    }

                },
                function(res){
                    el.html('<p>网络错误，请点击<a class="jReload">重新加载</a></p>');
                }
            )
        }

    };
    templateRender.prototype._reload = function(){
        var _this = this;
        _this.on("click","jReload",function(){
            _this._init();
        })

    }
    templateRender.prototype._template = function(res){
        var _this = this;
        var el = _this.el;
        var options = _this.options;
        var html = template(options.temId, res.data);
        el.html(html);
    }
    templateRender.prototype._change = function(){
        var _this = this;
        $("#categoryIds").on("click","li",function(){
            var self = $(this);
            self.addClass("active").siblings().removeClass("active");
            _this._init();
        });
    }

    module.exports = templateRender;
});