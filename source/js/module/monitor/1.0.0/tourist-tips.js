define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var build = require('lib/core/1.0.0/dom/build');

    function TouristTips(options) {
        var _this = this;
        var defaults = {
            selector: '#jModVideoBox'
        }
        _this.options = $.extend({}, defaults, options);
        _this.container = $(_this.options.selector);
        _this.el = $(_this._templete());
        _this.container.append(_this.el);
        if (_this.el.lenght == 0) {
            throw new Error('the param [options.selector] is required');
        }
        var builder = build.build(_this.el[0], false);
        _this.close =$('.btn-close');
        _this.login = $('.btn-login');
        _this._initEvent();
    }
    TouristTips.prototype._initEvent = function() {
        var _this = this;
        _this.close.on('click', function() {
            _this.hide();
        });
        _this.login.on('click', function() {
             box.loadUrl($PAGE_DATA['loginSrc'], {
                title: '登录',
                autoRelease: false,
                modal: true //是否有遮罩层
            });
        });
    }
    TouristTips.prototype.show = function() {
        var _this = this;
        _this.el.addClass('active');
    }

    TouristTips.prototype.hide = function() {
        var _this = this;
        _this.el.removeClass('active');
    }

    TouristTips.prototype._templete = function() {
        var str = '';
        str += '<div class="mod-tourist-tips">';
        str += '    <div class="mask"></div>';
        str += '    <div class="tips-panle">';
        str += '        <div class="txt">游客只能试看前面一段视频，登录后可观看完整视频</div>';
        str += '        <div class="btn-box">';
        str += '            <a href="javascript:;" node-type="login" class="btn-login">立即登录</a>';
        str += '        </div>';
        str += '        <a href="javascript:;" class="btn-close ui-box-iconf ui-box-close" node-type="close">x</a>';
        str += '    </div>';
        str += '</div>';
        return str;
    }
    module.exports = TouristTips;
});
