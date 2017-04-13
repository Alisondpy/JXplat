define(function(require, exports, module) {
        'use strict';
    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    require('conf/header');


    var loadUrl = $PAGE_DATA["loadUrl"];

    $("#jSearch").on("click",function(){
        var keyword = $("#topSearchBar").val();
        window.location.href = loadUrl+'?keyWord='+keyword;
    })

});
