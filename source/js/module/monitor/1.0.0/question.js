define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var PollingList = require('./../../../plugins/polling-list/1.0.0/polling-list');
    var IO = require('lib/core/1.0.0/io/request');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');
    var Util = require('lib/core/1.0.0/utils/util');
    var template=require("template");

    function Question(el, options) {
        var _this = this;
        _this.el = $(el);
        if (_this.el.length == 0) {
            throw new Error('the param [el] is required.');
        }
        var defaults = {
            //轮询ajax
            pollingAjax: {
                url: null,
                type: 'get', //'get'|'post'|'json'
                data: null
            },
            //分页ajax
            pagerAjax: {
                url: null,
                type: 'get', //'get'|'post'|'json'
                data: null
            }
        };
        _this.options = $.extend(true, {}, defaults, options);
        _this._isPulling = false;
        _this._init();
        _this._initEvent();
        _this.max = 0;
        _this.min = 0;
        _this.isFist = true;
    }

    //继承自定义事件
    Util.inherits(Question, EventEmitter);

    Question.prototype._init = function() {
        var _this = this;
        _this.pollingList = new PollingList(_this.el, {
            ajax: _this.options.pollingAjax,
            data : {
                id : _this.max
            }
        });
        _this._loadingHtml();
    }

    Question.prototype._initMouse = function(){
        var _this = this;
        if(!_this._initMouseInited){
            _this._initMouseInited = true;
            //鼠标移进容器就暂停刷新
            _this.el.on('mouseenter', function() {
                _this.stop();
            });
            //鼠标移进容器就立马刷新
            _this.el.on('mouseleave', function() {
                _this.start();
            });
        }
    }

    Question.prototype._initEvent = function() {
        var _this = this,
            options = _this.options,
            pagerAjax = _this.options.pagerAjax;
        //数据获取成功
        _this.pollingList.on('error', function(data){
            _this.pollingList.html(template('tEmpty',1));
        });
        //数据获取失败
        _this.pollingList.on('success', function(data) {
            //如果刷新成功，并且有更新，直接用html替换
             if (data && data.data && data.data.resultList && data.data.resultList.length > 0) {
                 _this._initMouse();
                 _this.min = data.data.resultList[data.data.resultList.length - 1].id;
                 _this.pollingList.html(_this.template(data.data));
                 _this.pollingList.setData({
                     id:data.data.resultList[0].id
                 });
                 _this.isFist = false;
             }else {
                 if(_this.isFist){
                     _this.pollingList.html(template('tEmpty',1));
                 }
             }
            _this.scrollTo(0);
        });
        //上拉刷新事件
        _this.pollingList.on('pullup', function(e) {
            if (!_this._isPulling) {
                _this._isPulling = true;
                IO[pagerAjax.type](pagerAjax.url, $.extend({},pagerAjax.data,{id:_this.min}), function(data) {
                    if (data && data.data && data.data.resultList && data.data.resultList.length > 0) {
                        _this.min = data.data.resultList[data.data.resultList.length - 1].id;
                        _this._isPulling = false;
                        _this.pollingList.append(_this.template(data.data));
                    }
                }, function(data) {
                    _this._isPulling = false;
                    _this.pollingList.html(template('tEmpty',1));
                });
            }
        });
    }

    //开始拉新
    Question.prototype._loadingHtml = function() {
        var _this = this;
        var str = '';
        str+='<div class="ui-loading-list">';
        str+='<div class="img-loading"></div>';
        str+='	<div class="txt">';
        str+='	正在卖力加载，请稍后';
        str+='  </div>';
        str+='</div>';
        _this.pollingList.html(str);
    };

    //开始拉新
    Question.prototype.start = function() {
        var _this = this;
        _this.pollingList.start();
    }

    //停止拉新
    Question.prototype.stop = function() {
        var _this = this;
        _this.pollingList.stop();
    }

    //清屏
    Question.prototype.clear = function() {
        var _this = this;
        _this.pollingList.container.html('');
    }

    //销毁
    Question.prototype.destroy = function() {
        var _this = this;
    }

    //跳转位置
    Question.prototype.scrollTo = function(top) {
        var _this = this;
        _this.pollingList.scrollTo(top);
    }

    Question.prototype.template = function(data) {
        return template('tQuestion',data);
    }

    module.exports = Question;
});
