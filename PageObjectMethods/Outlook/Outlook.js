'use strict';

var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');

var Env = Runsettings.data.Global.ENVIRONMENT.value;
var OutlookUrl = Runsettings.data.Global.Outlook.URL.value;
var OutlookUser = Runsettings.data.Global.Outlook.UserName.value;
var OutlookPwd = Runsettings.data.Global.Outlook.Password.value;

var OutlookPortal = function () {

    var txtUname = element(by.id('username'));
    var txtPwd = element(by.id('password'));
    var btnSignIn = element(by.xpath('//*[@id="lgnDiv"]//div[@class=\'signinbutton\']'));
    this.LogintoOutlook = function () {

        browser.ignoreSynchronization = true;  // or false
        browser.get(OutlookUrl);
        browser.waitForAngular();
        CustomLib.WaitForSpinnerInvisible();
        CustomLib.WaitforElementVisible(txtUname);
        txtUname.click();
        txtUname.sendKeys(OutlookUser);
        txtPwd.sendKeys(OutlookPwd);
        btnSignIn.click();
        CustomLib.WaitForSpinnerInvisible();
    }

    this.LogintoOutlookNonAngular = function () {
        browser.driver.get(OutlookUrl);
        CustomLib.WaitForSpinnerInvisible();
        CustomLib.WaitforElementVisible(txtUname);
        txtUname.clear();
        txtUname.sendKeys(OutlookUser);
        txtPwd.sendKeys(OutlookPwd);
        btnSignIn.click();
        CustomLib.WaitForSpinnerInvisible();
    }

    this.LoginToMailBox = function (username,password) {
        browser.driver.get(OutlookUrl);
        CustomLib.WaitForSpinnerInvisible();
        CustomLib.WaitforElementVisible(txtUname);
        txtUname.clear();
        txtUname.sendKeys(username);
        txtPwd.sendKeys(password);
        btnSignIn.click();
        CustomLib.WaitForSpinnerInvisible();
    }

};

module.exports = new OutlookPortal();