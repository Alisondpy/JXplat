define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var validate = require('plugins/validator/1.0.0/validator');
    var template = require("template");
    var form = require('lib/core/1.0.0/utils/form');
    var jMSubBtn = $("#jMSubBtn");
    var handshake = {
        handle:function () {
            var ucData = form.serializeForm('#jSigninForm');
            io.post($PAGE_DATA['loadUrl'], $.extend({"vProductId":$("#vProductId").val()},ucData) ,function(data){
                 var topBox = box.get(window);
                topBox.hide();
                box.ok('恭喜您，约谈成功！');
                window.top && window.top.window.location.reload();
            },function(res) {
                box.error(res.msg || '网络错误,请重试');
            },jMSubBtn[0]);
        }
    };
    jMSubBtn.click(function(){
        $("#jSigninForm").submit();
    });
    $('body').on('keydown', function (e) {
        var e = e || window.event;
        if(e.keyCode == 13) {
            $("#jSigninForm").submit();
        }
    })
    $('#jSigninForm').validate({
        rules: {
            username: {
                required: true
            },
            mobile:{
                required: true,
                mobile:true
            }
        },
        messages:{
            username: {
                required: "请输入姓名"
            },
            mobile:{
                required: "请输入您的手机号"
            }
        },
        //失去焦点校验
        onfocusout: function(element){
            $(element).valid();
        },
        submitHandler:function(form){
            handshake.handle();
        }
    });
});
