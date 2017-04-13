
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var validate = require('plugins/validator/1.0.0/validator');
    var form = require("lib/core/1.0.0/utils/form");


    //手机号正确才允许点击验证码
    $.validator.addMethod("lms", function(value, element, param) {
        var mobile = /^0?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (mobile.test(value)) {
            //修改点击提交触发验证,恢复验证码按钮色彩的功能
            //change修改提交时触发验证手机号的bug
            if ($(".jsVerifyCode").hasClass("change")) {

            } else {
                $(param).removeClass("ui-btn-disable");
            }
            return this.optional(element) || true;
        } else {
            $(param).addClass("ui-btn-disable");
            return false;
        }

    }, $.validator.format("请正确填写您的手机号"));

    // 手机动态码
    $.validator.addMethod("vierfyCode", function(value, element) {
        var code = /^\d{4}$/;
        return this.optional(element) || (code.test(value));
    }, "请输入动态码");

    //验证成功时执行方法
    function validateSuccess(url, formRes) {
        var formData = form.serializeForm(formRes);
        console.log(formData);
        var refer = document.referrer; //来源页面
        formData.returnUrl = encodeURI(refer);
        io.post(url, formData, function(res) {
            box.ok("注册成功");
            refer = decodeURI(res.data.returnUrl);
            //等待1秒跳转页面
            setTimeout(function() {
                //注册成功,刷新页面
               window.top && window.top.window.location.reload();
            }, 1000);
        }, function(res) {
            box.error((res && res.msg) || '网络错误，请重试！');
        });
    }

    //注册页面验证
    $("#jsRightSignin").validate({
        rules: {
            username:{
               required: true,
               rangelength:[6,16]
            },
            mobile: {
                lms: ".jsVerifyCode",
                required: true,
                mobile: true
            },
            email: {
                required: true,
                email: true
            },
            vierfyCode: {
                required: true,
                minlength: 4
            },
            password: {
                required: true,
                rangelength:[6,16]
            },
            confirmpwd:{
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            username:{
                required:"请输入用户名",
                rangelength:"用户名长度为6~16"
            },
            mobile: {
                required: "请输入手机号",
                mobile: "请输入正确的手机号码"
            },
            vierfyCode: {
                required: "请输入动态码",
                minlength: "请输入您获取的动态码"
            },
            email: {
                required: "请输入您的邮箱",
                email: "请正确填写您的邮箱地址"
            },
            password: {
                required: "请设置您的登录密码",
                rangelength: "请输入6-16位密码，区分大小写"
            },
            confirmpwd:{
                required: "请重复登录密码",
                equalTo: "重复密码错误"
            }
        },
        //失去焦点校验
        onfocusout: function(element) {
            if($(element).valid()){
                $(element).parents(".item").removeClass("error-red");
                $(element).parent().removeClass("error-red");
            }else{
                $(element).parents(".item").addClass("error-red");
            }
        },
        onkeyup: function(element) {
            if($(element).valid()){
                $(element).parents(".item").removeClass("error-red");
                $(element).removeClass("error");
            }else{
                $(element).parents(".item").addClass("error-red");
                $(element).addClass("error");
            }
        },
        errorPlacement: function(error, element) {
            //验证码特殊结构,修改错误信息放置位置
            if (element.attr("id") === "jDynamic") {
                error.appendTo(element.parents(".item"));
                $(element).parent().addClass("error-red");
                $(element).parents(".item").addClass("error-red");
            } else {
                error.appendTo(element.parent());
                $(element).parent().addClass("error-red");
            }
        },
        submitHandler: function(formRes) {
            //验证成功时执行方法
            validateSuccess($PAGE_DATA['registerUrl'], formRes)
        }
    });
    $(".jSubBtn").click(function(){
        $("#jsRightSignin").submit();
    })
    $('body').on('keydown', function (e) {
        var e = e || window.event;
        if(e.keyCode == 13) {
            $("#jsRightSignin").submit();
        }
    })
    //获取验证码
    $(".jsVerifyCode").on("click", function() {
        var verifyCode = $(this);
        //获取阶段直接返回
        if (verifyCode.hasClass("ui-btn-disable")) {
            return false;
        }
        //发送ajax请求
        io.post($PAGE_DATA['code'], { mobile: $("#jMobile").val() , type:1},
            function(res) {
                //成功后的回调
                //验证码循环
                var count = 60;
                //class:change ==== 修改点击提交触发验证,触发验证手机号,恢复验证码按钮色彩的bug
                verifyCode.val(count+'s').addClass("ui-btn-disable change");
                var time = setInterval(function() {
                    if (count > 1) {
                        count--;
                        verifyCode.val(count+'s');
                    } else {
                        verifyCode.removeClass("ui-btn-disable change").val("获取验证码");
                        clearInterval(time);
                    }
                }, 1000);
            },
            function(res) {
                box.error((res && res.msg) || '网络错误，请重试！');
            });
    });
    $(".jPopBtn").on("click", function() {
         var topBox = box.get(window);
        topBox.hide();
        box.loadUrl($PAGE_DATA['popUrl'], {
            title: '注册条款',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
    })

    $(".jToLogin").on("click",function(){
         var topBox = box.get(window);
        topBox.hide();
         box.loadUrl($PAGE_DATA['loginSrc'], {
            title: '登录',
            autoRelease: false,
            modal: true //是否有遮罩层
        });
        
    })

})
