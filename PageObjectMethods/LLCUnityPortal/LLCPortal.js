'use strict';

var Runsettings = require('../../testData/RunSetting.js');
var Env = Runsettings.data.Global.ENVIRONMENT.value;

var LLCUrl = Runsettings.data.Global.LLC[Env].URL;
var LLCLawyer = Runsettings.data.Global.LLC[Env].UserName;
var LawyerPwd = Runsettings.data.Global.LLC[Env].Password;


var lblDealToAccept = element(by.id('ctl00_mainContentPlaceHolder_mnuHome_ctl00_Label101'));
var tbSearchBox = element(by.id('ctl00_mainContentPlaceHolder_searchBox_QuickSearch'));
var btnSearch = element(by.id('ctl00_mainContentPlaceHolder_searchBox_btnSearch'));
var ddlsearchParam = element(by.id('ctl00_mainContentPlaceHolder_searchBox_ddlSearchOption'));

var LLCDeal = function () {
    
    var tbUsername = element(by.id('dataUserName'));
    var tbPassword = element(by.id('dataPassword'))
    var btnSignIn = element(by.id('btnSignIn'))
    this.LoginLLC = function () {
        browser.get(LLCUrl);
        tbUsername.sendKeys(LLCLawyer);
        tbPassword.sendKeys(LawyerPwd);
        btnSignIn.click();

    }

    this.SearchDealToAccept = function (val) {
    
        lblDealToAccept.click();
        ddlsearchParam.element(by.cssContainingText('option', 'Mortgagor/Purchaser Name')).click();
        tbSearchBox.sendKeys(val);
        btnSearch.click();

    }
};

module.exports = new LLCDeal();