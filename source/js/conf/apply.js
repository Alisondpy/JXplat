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
            io.post($PAGE_DATA['loadUrl'], $.extend({activityId:$("#activityId").val()},ucData) ,function(data){
                box.ok('恭喜您，报名成功！');
                window.top && window.top.window.location.reload();
            },function(res) {
                box.error(res.msg || '网络错误,请重试');
            },jMSubBtn[0]);

            /*var topBox = box.get(window);
            topBox.hide();
            box.ok('恭喜您，报名成功！');
            $(".apply",parent.document).show();
            $(".unApply",parent.document).hide();*/
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
            realname: {
                required: true,
                realname:true
            },
            mobile:{
                required: true,
                mobile:true
            },
            school:{
                required: true
            },
            job:{
                required:true
            }
        },
        messages:{
            realname: {
                required: "请输入姓名"
            },
            mobile:{
                required: "请输入您的手机号"
            },
            school:{
                required: "请填写您的公司或学校"
            },
            job:{
                required:"请填写您的岗位或专业"
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
