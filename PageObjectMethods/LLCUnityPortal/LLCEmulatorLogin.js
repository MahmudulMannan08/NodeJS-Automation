'use strict';
var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
const EC = protractor.ExpectedConditions;
var Counter;
var CounterMax = 5
var q = require('q');
var defered = q.defer();
var SecEmailRecipient = element(by.tagName('email-notifications'));
var redirectURL = null;

var Env = Runsettings.data.Global.ENVIRONMENT.value;

var EmulatorLogin = function () {

    var ddlAuthType = element(by.name('authType'));
    var ddlPortalType = element(by.name('portalS'));
    var tbUsername = element(by.id('userName'));
    var tbPassword = element(by.id('password'));
    var tbToken = element(by.id('token'));
    var btnLogin = element(by.buttonText('Login'));
    var tbTransId = element(by.id('transactionId'));
    var tbFirstName = element(by.id('firstname'));
    var tbLastName = element(by.id('lastname'));
    var isClickable = EC.elementToBeClickable(btnLogin);
    //Home Page element
    var lblHome = element(by.css('.title_1'));
    var LenderNameValue = element.all(by.css('.form-group.col-md-4')).get(0).all(by.tagName('div')).get(1);
    var isVisible = EC.presenceOf(lblHome);

    var Request = require("request");
    // LoginFailed Alert
    var loginFailedLabel = element(by.css('.row.alert-danger'))
    var fs = require('fs');

    this.LoginViaRedirectURL = function (dealID, context) {
        Counter = 0;
        GetRedirectURLandLoginTillSucess(dealID, context);
    }

    var GetRedirectURLandLoginTillSucess = function (dealID, context) {
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var AuthToken = Runsettings.data.Global.RedirectURLCredentials[Env].AuthToken.value
        var authenticatedFctUserName = Runsettings.data.Global.LawyerDetails[Env].authenticatedFctUser;
        var partnerUserName = Runsettings.data.Global.LawyerDetails[Env].partnerUserName;
        var firstName = Runsettings.data.Global.LawyerDetails[Env].firstName;
        var lastName = Runsettings.data.Global.LawyerDetails[Env].lastName;
        var businessRole = Runsettings.data.Global.LawyerDetails[Env].businessRole;
        var fctUserName = Runsettings.data.Global.LawyerDetails[Env].fctUserName;

        var OPtBody = {
            "headers": {

                "Authorization": AuthToken,
                "XFCTAuthorization": "{     'authenticatedFctUser': '" + authenticatedFctUserName + "',   'userContext':{ 'partnerUserName': '" + partnerUserName + "', 'firstName': '" + firstName + "', 'lastName': '" + lastName + "', 'businessRole': '" + businessRole + "', 'fctUserName': '" + fctUserName + "' } }",
                "content-type": "application/json",

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false

        }

        var Request = require("request");



        Request(OPtBody, function (error, response, body) {
            if (error) { console.log(error) }
            else {


                try { browser.get(JSON.parse(response.body).url) }
                catch (error) {
                    Counter++;
                    if (Counter < CounterMax) { GetRedirectURLandLoginTillSucess(dealID, context) }

                }

            }



        })


    }
    this.LoginViaRedirectURLWithWait = function (dealID, context) {
        
        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var AuthToken = Runsettings.data.Global.RedirectURLCredentials[Env].AuthToken.value
        var authenticatedFctUserName = Runsettings.data.Global.LawyerDetails[Env].authenticatedFctUser;
        var partnerUserName = Runsettings.data.Global.LawyerDetails[Env].partnerUserName;
        var firstName = Runsettings.data.Global.LawyerDetails[Env].firstName;
        var lastName = Runsettings.data.Global.LawyerDetails[Env].lastName;
        var businessRole = Runsettings.data.Global.LawyerDetails[Env].businessRole;
        var fctUserName = Runsettings.data.Global.LawyerDetails[Env].fctUserName;

        var OPtBody = {
            "headers": {

                "Authorization": AuthToken,
                "XFCTAuthorization": "{ 'authenticatedFctUser': '" + authenticatedFctUserName + "', 'userContext':{ 'partnerUserName': '" + partnerUserName + "', 'firstName': '" + firstName + "', 'lastName': '" + lastName + "', 'businessRole': '" + businessRole + "', 'fctUserName': '" + fctUserName + "' } }",
                "content-type": "application/json",
            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",
            "rejectUnauthorized": false
        }
       
        var Request = require("request");
        return Request(OPtBody, function (error, response, body) {
            if (error) {
                console.log('LoginViaRedirectURL service error: ', error);
            }
            else {          
                //console.log(JSON.parse(response.body).url)
                browser.get(JSON.parse(response.body).url);
                CustomLib.WaitForSpinnerInvisible();
                CustomLib.WaitforElementVisible(LenderNameValue);  //Value loads latest
                CustomLib.WaitForSpinnerInvisible();
                return JSON.parse(response.body).url;
            }
        })
    }

    this.SelectPortalType = function (portalType) {
        if (portalType == 'LLC' || portalType == 'llc') {
            ddlPortalType.click();
            ddlPortalType.element(by.cssContainingText('option', 'LLC')).click();
        }
        if (portalType == 'RTIS' || portalType == 'rtis') {
            ddlPortalType.click();
            ddlPortalType.element(by.cssContainingText('option', 'RTIS')).click();
        }

    }

    this.SelectAuthType = function (type) {
        if (type == 'p' || type == 'P') {
            ddlAuthType.click();
            ddlAuthType.element(by.cssContainingText('option', 'Password')).click();
        }
        if (type == 'T' || type == 't') {
            ddlAuthType.click();
            ddlAuthType.element(by.cssContainingText('option', 'Token')).click();
        }

    }

    this.EnterLoginCredentials = function (portalType, type, uname, code, transID) {
        tbFirstName.clear();
        tbLastName.clear();
        tbTransId.clear();

        browser.sleep(1000);
        this.SelectPortalType(portalType);
        //browser.sleep(1000);
        this.SelectAuthType(type);

        if (uname != null) {
            tbUsername.clear();
            tbUsername.sendKeys(uname);
        }


        if (type == 'T' || type == 't') {
            tbToken.clear();
            tbToken.sendKeys(code);
        }
        if (type == 'p' || type == 'P') {
            tbPassword.clear();
            tbPassword.sendKeys(code)
        }
        if (transID != null) {

            tbTransId.clear();
            tbTransId.sendKeys(transID);
        }

        //this.SelectPortalType(select);

        tbFirstName.click();
        browser.sleep(1000);

        btnLogin.click();
        browser.sleep(6000)
        //browser.wait(EC.visibilityOf(element(by.tagName('email-notifications'))), 15000);
        //wait for an element to become clickable

    }

    this.VerifyFailedLogin = function (FailedLoginMsg) {
        loginFailedLabel.getText().then(function (txt) {

            expect(txt).toContain(FailedLoginMsg);
        })

    }
    this.ReturnGetRedirectUrl = function (dealID, context) {

        var RedirectURL = Runsettings.data.Global.RedirectURLCredentials[Env].endPoint.value
        var ResourceURL = Runsettings.data.Global.RedirectURLCredentials[Env].Resource.value
        var AuthToken = Runsettings.data.Global.RedirectURLCredentials[Env].AuthToken.value
        var authenticatedFctUserName = Runsettings.data.Global.LawyerDetails[Env].authenticatedFctUser;
        var partnerUserName = Runsettings.data.Global.LawyerDetails[Env].partnerUserName;
        var firstName = Runsettings.data.Global.LawyerDetails[Env].firstName;
        var lastName = Runsettings.data.Global.LawyerDetails[Env].lastName;
        var businessRole = Runsettings.data.Global.LawyerDetails[Env].businessRole;
        var fctUserName = Runsettings.data.Global.LawyerDetails[Env].fctUserName;
        var url
        var OPtBody = {
            "headers": {

                "Authorization": AuthToken,
                "XFCTAuthorization": "{     'authenticatedFctUser': '" + authenticatedFctUserName + "',   'userContext':{ 'partnerUserName': '" + partnerUserName + "', 'firstName': '" + firstName + "', 'lastName': '" + lastName + "', 'businessRole': '" + businessRole + "', 'fctUserName': '" + fctUserName + "' } }",
                "content-type": "application/json",

            },
            'method': 'GET',
            "url": RedirectURL + ResourceURL + "?context=" + context + "&fcturn=" + dealID + "&language=ENGLISH",


        }

        var Request = require("request");

        Request(OPtBody, function (error, response, body) {

            if (error || response.statusCode != 200) {
                console.log('GetRedirectUrl request was unsuccessful!!! ');
                console.log(error);
                url = 'Failed';
            }

            else {
                if (response.statusCode == 200) {
                    url = JSON.parse(response.body).url;
                    //console.group.log(RedirectUrl);
                }
            }
        })

        return url;
    }

};

module.exports = new EmulatorLogin();