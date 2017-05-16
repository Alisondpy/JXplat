define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var box = require('lib/ui/box/1.0.1/crossbox');
    var io = require('lib/core/1.0.0/io/request');
    var validate = require('plugins/validator/1.0.0/validator');
    var template = require("template");
     var templateRender = require('module/templateRender/1.0.0/templateRender');
    var form = require('lib/core/1.0.0/utils/form');
    var jMSubBtn = $("#jMSubBtn");
     var domId = $PAGE_DATA['domId'];
    var loadUrl = $PAGE_DATA['loadUrl'];//请求路径
    var submitUrl = $PAGE_DATA['submitUrl'];//请求路径
     new templateRender(domId,{
            url:loadUrl,
            temId:'jWrap',
            activityId:$("#activityId").val()
        })
        setTimeOut(function(){
             $.loadAreaSelect("area");
             var defaultForm = {};
             $("#jSigninForm").find("input").each(function(){
                var _this = $(this);
                if(_this.parent().find(".necessary")){
                    var key = _this.attr("name");
                    var rules = {reuqire:true};
                    if(key == "mobile"){
                        rules[key] = true;
                    }
                    defaultForm[key] = rules;
                }
                console.log(defaultForm);
             })
            var handshake = {
                handle:function () {
                    var ucData = form.serializeForm('#jSigninForm');
                    $("#region").val($("#province option:selected").text()+$("#city option:selected").text()+$("#county option:selected").text());
                    var activityId = $("#activityId").val();
                    io.post($PAGE_DATA['submitUrl'], $.extend({activityId:$("#activityId").val()},ucData) ,function(data){
                        box.ok('恭喜您，报名成功！');
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

        },500)
    
    //加载省市区三级联动

    $.extend({
        // 省市区三级联动
        loadAreaSelect : function(elementName) {
            var element = $("#" + elementName);
            var province = element.find("select").eq(0);
            var provinceName = province.attr("name");
            var provinceMap = loadArea($PAGE_DATA['location']);
            province.empty();
            province.append("<option value='0'>请选择省</option>");
            if (provinceMap != null) {
                $.each(provinceMap, function(i, n) {
                    province.append("<option value='" + n.id + "'>" + n.name + "</option>");
                });
            
                var provinceValue = $("input[name='" + provinceName + "_hide']").val();
                if (typeof (provinceValue) != "undefined" && provinceValue != "" && provinceValue != null && provinceValue != "0") {
                    province.val(provinceValue);
                    var city = element.find("select").eq(1);
                    var cityName = city.attr("name");
                    city.empty();
                    city.append("<option value='0'>请选择市</option>");
                    var cityMap = loadArea($PAGE_DATA['location'] + provinceValue);
                    if (cityMap != 0) {
                        $.each(cityMap, function(i, n) {
                            city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                        });
                        var cityValue = $("input[name='" + cityName + "_hide']").val();
                        if (cityValue != "" && typeof (cityValue) != "undefined" && cityValue != null && cityValue != "0") {
                            city.val(cityValue);
                            var county = element.find("select").eq(2);
                            var countyName = county.attr("name");
                            var countyValue = $("input[name='" + countyName + "_hide']").val();
                            var countyMap = loadArea($PAGE_DATA['location'] + cityValue);
                            county.empty();
                            county.append("<option value='0'>请选择县/区</option>");
                            if (countyMap != null) {
                                $.each(countyMap, function(i, n) {
                                    county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                                });

                                if (countyValue != "" && typeof (countyValue) != "undefined" && countyValue != null && countyValue != "0") {
                                    county.val(countyValue);
                                }
                            }

                        }
                    }
                }
            }
            province.change(function() {
                element.find("select").each(function(i) {
                    switch (i) {
                        case 1:
                            $(this).empty();
                            $(this).append("<option value='0'>请选择市</option>");
                            break;
                        case 2:
                            $(this).empty();
                            $(this).append("<option value='0'>请选择区/县</option>");
                            break;
                    }
                });
                var province_change = $(this).val();

                var cityMap = loadArea($PAGE_DATA['location'] + province_change);
                if (cityMap != 0) {

                    $.each(cityMap, function(i, n) {
                        city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            });

            var province_val = $("#" + province.attr("name") + "_hid").val();
            var city = element.find("select").eq(1);
            if (province_val != null && typeof (province_val) != "undefined" && province_val != '') {
                province.val(province_val);
                var city_change_Map = loadArea($PAGE_DATA['location'] + province_val);
                city.empty();
                city.append("<option value='0'>请选择市</option>");
                if (city_change_Map != 0) {
                    $.each(city_change_Map, function(i, n) {
                        city.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            }
            city.change(function() {
                var city_change = $(this).val();
                var county_change_Map = loadArea($PAGE_DATA['location'] + city_change);
                county.empty();
                county.append("<option value='0'>请选择县/区</option>");
                if (county_change_Map != null) {
                    $.each(county_change_Map, function(i, n) {
                        county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            });

            var city_val = $("#" + city.attr("name") + "_hid").val();
            var county = element.find("select").eq(2);
            if (city_val != null && typeof (city_val) != "undefined" && city_val != '') {
                city.val(city_val);
                var countyMap = loadArea($PAGE_DATA['location'] + city_val);
                county.empty();
                county.append("<option value='0'>请选择县/区</option>");
                if (countyMap != null) {
                    $.each(countyMap, function(i, n) {
                        county.append("<option value='" + n.id + "'>" + n.name + "</option>");
                    });
                }
            }

            var county_val = $("#" + county.attr("name") + "_hid").val();
            if (county_val != null && typeof (county_val) != "undefined" && county_val != '') {
                county.val(county_val);
            }
        }
    });

    function loadArea(url) {
        var areaMap;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            async: false,
            success: function (data) {
                areaMap = data.regionInfoList;
            }
        });
        return areaMap;
    }

   
});
