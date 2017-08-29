define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var build = require('lib/core/1.0.0/dom/build');

    function LeftMenu(options) {
        var _this = this;
        var defaults = {
            selector: '#jLeftMenu',
            activeClass: 'focus'
        };
        _this.options = $.extend(true, {}, defaults, options);
        _this.el = $(_this.options.selector);
        var builder = build.build(_this.el, false);
        _this.itemLevel1s = builder.get('itemLevel1');
        _this.txtLevel1s = builder.get('txtLevel1');
        _this.menuLevel2s = builder.get('menuLevel2');
        _this._init();
        _this._initEvent();
    };

    LeftMenu.prototype._initEvent = function() {
        var _this = this;
        _this.txtLevel1s.on('click', function(e) {
            e.preventDefault();
            var txtLevel1 = $(this);
            var itemLevel1 = txtLevel1.parent();
            var builder = build.build(itemLevel1, false);
            var menuLevel2 = builder.get('menuLevel2');
            if (menuLevel2) {
                if (itemLevel1.hasClass('active')) {
                    menuLevel2.slideUp(function() {
                        itemLevel1.removeClass('active');
                    });
                } else {
                    _this.menuLevel2s.slideUp();
                    menuLevel2.slideDown(function() {
                        _this.itemLevel1s.removeClass('active');
                        itemLevel1.addClass('active');
                    });
                }
            } else {
                window.location.href = txtLevel1.attr('href');
            }

        });
    }

    LeftMenu.prototype._init = function() {
        var _this = this;
        _this.el.find('.jItemLevel2').each(function() {
            var self = $(this);
            if (self.hasClass('active')) {
                self.parent().parent('.jItemLevel1').addClass('active');
            }
        });
    }

    module.exports = LeftMenu;
});
