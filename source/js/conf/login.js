define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var validate = require('plugins/validator/1.0.0/validator');
    var form = require('lib/core/1.0.0/utils/form');
    var jMSubBtn = $("#jMSubBtn");
    var handshake = {
        handle:function () {
            var ucData = form.serializeForm('#jSigninForm');
            io.post($PAGE_DATA['loginUrl'],ucData,function(){
                 window.top && window.top.window.location.reload();
             },function(res){
                 box.error(res.msg || '网络错误,请重试');
             },jMSubBtn[0])
        }
    }

    jMSubBtn.click(function(){
        $("#jSigninForm").submit();
    });
    // 按enter键提交表单
    $('body').on('keydown', function (e) {
        var e = e || window.event;
        if(e.keyCode == 13) {
            $("#jSigninForm").submit();
        }
    })

    $('#jSigninForm').validate({
        rules: {
            username: {
                required: true,
                username:"username"
            },
            password:{
                required: true,
                rangelength:[6,16]
            }
        },
        messages: {
            username: {
                required: "请输入手机号或邮箱",
                username: "请输入正确的手机号或邮箱"
            },
            password: {
                required: "请设置您的登录密码",
                rangelength: "请输入6-16位密码，区分大小写！"
            }
        },

        //失去焦点校验
        onfocusout: function(element){
            if($(element).valid()){
                $(element).parent().removeClass("error-red");
            }else{
                $(element).parent().addClass("error-red");
            }
        },
        errorPlacement: function(error, element) {
            //验证码特殊结构,修改错误信息放置位置
                $(element).parent().addClass("error-red");
        },
        submitHandler:function(form){
            handshake.handle();
        }
    });
     //自定义登录方式校验
    jQuery.validator.addMethod("username", function(value, element) {
        var contact = /(^0?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/;
        return this.optional(element) || (contact.test(value));
    }, "");
//立即注册
    $(".jToRes").on("click",function(){
        var topBox = box.get(window);
        topBox.hide();
         box.loadUrl($PAGE_DATA['registerSrc'], {
            title: '注册',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
    })
    // 忘记密码
     $(".jToReset").on("click",function(){
         var topBox = box.get(window);
        topBox.hide();
         box.loadUrl($PAGE_DATA['resetPwdSrc'], {
            title: '重设密码',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
    })
});
