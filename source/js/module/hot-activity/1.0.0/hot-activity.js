define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var template=require("template");
    var IO = require('lib/core/1.0.0/io/request');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');

 /*   * @param selector [dom selector] dom选择器
      * @param options [mix] 参数详情见defaults
*/
    var lazy;
    function HotActivity(selector,options){
     var _this = this;
        var defaults = {
            url: null,
            formatNum:false,//是否需要数字三位一划分
            numClass:'activeNo'//需要数字划分的属性（例如报名人数）
        };
        _this.el = $("#"+selector);
        _this.options = $.extend(true,{},defaults,options);
        _this._init();
    };
    HotActivity.prototype._init = function(){
        var _this = this;
        var options = _this.options;
        var el = _this.el;
        el.html("this is loading...");
        IO.get(options.url,function(res){
                if(!options.url){
                    throw new Error("the url of defaults is required");
                }
                if(res.data.resultList.length <= 0){
                    el.html("暂时没有热门活动！");
                }else{
                    _this._template(res,options.numClass);
                }
            },
            function(res){
                el.html('<p>网络错误，请点击<a class="jReload">重新加载</a></p>');
            }
        )
    };
    HotActivity.prototype._reload = function(){
        var _this = this;
        _this.on("click","jReload",function(){
            _this._init();
        })

    }
    HotActivity.prototype._template = function(res){
        var _this = this;
        var el = _this.el;
        var options = _this.options;
        var numClass = options.numClass;
        if(options.formatNum){
            $.each(res.data.list,function(i,n){
                $.each(n,function(j,m){
                    if (j == numClass){
                        n[j] =  _this._formatNum(n[j]);
                    }
                })
            })
        }
        var html = template(options.temId, res.data);
        el.html(html);
        //图片懒加载
        lazy = new Lazyload(el.find($('.jImg')), {
            loadingClass: 'img-error',
            mouseWheel: true,
            effect: 'fadeIn',
            snap: true
        });
    }
    module.exports = HotActivity;

});