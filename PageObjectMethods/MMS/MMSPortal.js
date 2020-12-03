'use strict';
//var sql = require('mssql');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLibrary = require('../../CustomLibrary/CustomLibrary.js');

var fileToUpload = '../../TestData/MMS/test.pdf';
var path = require('path');
var DocumentPath = path.resolve(__dirname, fileToUpload);

var Env = Runsettings.data.Global.ENVIRONMENT.value;

var MMSUrl = Runsettings.data.Global.MMS[Env].URL;
var MMSUser = Runsettings.data.Global.MMS[Env].UserName;
var MMSPwd = Runsettings.data.Global.MMS[Env].Password;

var MMSRel1User = Runsettings.data.Global.MMS[Env].Rel1UserName;
var MMSRel1Pwd = Runsettings.data.Global.MMS[Env].Rel1Password;
var MMSRel2User = Runsettings.data.Global.MMS[Env].Rel2UserName;
var MMSRel2Pwd = Runsettings.data.Global.MMS[Env].Rel2Password;
var counter =0;
var MMSPortal = function () {
    var tbDealurnSearch = element(by.id("ctl00_ContentPlaceHolder2_txtFCTReferenceNumber"));
    var btnearch = element(by.id("ctl00_ContentPlaceHolder2_btnSearch"))
    var tbUname = element(by.id('ctl00_ContentPlaceHolder1_Login1_UserName'));
    var tbPwd = element(by.id('ctl00_ContentPlaceHolder1_Login1_Password'));
    var btnSignIn = element(by.id('ctl00_ContentPlaceHolder1_Login1_LoginButton'));
    var lnkNewDeal = element(by.cssContainingText('.ctl00_TopMenu1_TopMenuManager_1.topbar_nav.ctl00_TopMenu1_TopMenuManager_3', 'New Deal'));
    var lnkEditViewDeal = element(by.cssContainingText('.ctl00_TopMenu1_TopMenuManager_1.topbar_nav.ctl00_TopMenu1_TopMenuManager_3', 'Edit/View Deals'));
    var ddlLender = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_cboLender'));
    var tbClientLastName = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_txtClientName'))
    var tbLenderRefNo = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_txtLenderRefNo'));
    var tbClosingDate = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_txtClosingDate_txtDate'));
    var tbRecieveDate = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_txtRFIReceiveDate'));
    var btnSelectFile = element(by.id('ctl00_ContentPlaceHolder1_ucUploadDocument_FileUpload1'));
    var btnUpload = element(by.name('ctl00$ContentPlaceHolder1$ucUploadDocument$btnUpload'));
    var GeneratedURN = element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1__thankYouText"]/b[1]'))
    var lnkFunding = element(by.cssContainingText('.ctl00_TopMenu1_TopMenuManager_1.topbar_nav.ctl00_TopMenu1_TopMenuManager_3', 'Funding'));
    var lnkLogOut = element(by.cssContainingText('.ctl00_TopMenu1_TopMenuManager_1.topbar_nav.ctl00_TopMenu1_TopMenuManager_3', 'Log Out'));
    var btnClose = element(by.id('LeftMenu1_PolicyStatus_btnFileClosed'));
    var txtThankYou = element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1__thankYouText"]'));
    var EC = protractor.ExpectedConditions;

    this.loginMMS = function () {
        browser.ignoreSynchronization = true;  // or false
        browser.get(MMSUrl);
        CustomLibrary.WaitForElementPresent(tbUname);
        tbUname.clear();
        tbUname.sendKeys(MMSUser);
        tbPwd.sendKeys(MMSPwd);

        
        browser.executeScript("arguments[0].click();", btnSignIn.getWebElement());
        
        browser.sleep(1000);

    }

    this.ClickOnCreateNewdeal = function () {
        CustomLibrary.WaitNClick(lnkNewDeal);
       // lnkNewDeal.click();
    }
    this.SearchDealURN = function (urn) {
        tbDealurnSearch.sendKeys(urn);
        btnearch.click();
      CustomLibrary.WaitNClick(element(by.id("contentArea")).all(by.tagName("tr")).get(1));

    }
    this.VerifySendToLLCException = function () {
        var icon = element(by.id("LeftMenu1_imgAmendment"))
        for (var i = 0; i <= 500; i++) {

            icon.isPresent().then(function (bool) {
                if (!bool) { browser.sleep(1000); browser.refresh(); }

            })

        }


        expect(element(by.id("LeftMenu1_imgAmendment")).isDisplayed()).toBe(true)

    }
    this.ClickOnEditViewdeals = function () {
        CustomLibrary.WaitNClick(lnkEditViewDeal);
        // browser.sleep(2000)
        //lnkEditViewDeal.click();
     //browser.sleep(2000)
    
    }
    this.ClickonFunding = function () {
        //browser.sleep(1000); //optimisation
       // lnkFunding.click();
       CustomLibrary.WaitNClick(lnkFunding);
       
    }

    this.ClickonLogOut = function () {
       // lnkLogOut.click();
       CustomLibrary.WaitNClick(lnkLogOut);
    }



    this.CreateNewDeal = function (lender, ClientName, LenderRef, ClosingDt) {

        if (lender == null) { } else { ddlLender.element(by.cssContainingText('option', lender)).click(); }
        if (ClientName == null) { } else { tbClientLastName.sendKeys(ClientName); }
        tbLenderRefNo.sendKeys(LenderRef);

        tbClosingDate.sendKeys(ClosingDt);
        browser.actions().doubleClick(tbRecieveDate).perform();

        element(by.css('input[type="file"]')).sendKeys(DocumentPath);

       
        browser.wait(EC.elementToBeClickable(btnUpload), 45000, 'Waiting for element to become clickable').then(() => {

                btnUpload.click().then(() => {
                    browser.wait(EC.presenceOf(txtThankYou), 45000, 'Waiting for element to be present').then(() => {
                        txtThankYou.getText().then(function(txt)
                        {
                            console.log(txt);
                                expect(txt).toContain('Your Request has been accepted');
                        })
                    }, (error) => {
                        expect(true).toBe(false, 'FCTURN is not created successfully');
                     })

                    
                 }, (error) => {
                    console.log(error);
                 })

             }, (error) => {
                console.log(error);
             })
    

    }


    this.CreateNewDealOnly = function (lender, ClientName, LenderRef, ClosingDt) {

        if (lender == null) { } else { ddlLender.element(by.cssContainingText('option', lender)).click(); }
        if (ClientName == null) { } else { tbClientLastName.sendKeys(ClientName); }
        tbLenderRefNo.sendKeys(LenderRef);

        tbClosingDate.sendKeys(ClosingDt);
        browser.actions().doubleClick(tbRecieveDate).perform();
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        browser.wait(EC.elementToBeClickable(btnUpload), 45000, 'Waiting for element to become clickable').then(() => {
                btnUpload.click();
             }, (error) => {
                expect(true).toBe(false, 'Unable to get the element');
             })
    }

    this.VerifyThankYouPage = function () {
        return element.all(by.xpath('//*[@id="ctl00_ContentPlaceHolder1__thankYouText"]')).count().then(function(count) {        
            expect(count).toBeGreaterThan(0, "Thank You Page is not found ");
             if(count > 0 ) {
                txtThankYou.getText().then(function(txt)
                {
                    expect(txt).toContain('Your Request has been accepted');
                })
            }
             return count;
         })
    }


    this.GetCreatedFCTURN = function () {
        return GeneratedURN.getText().then(function (txt) { console.log("Get Created FCTURN", txt); return txt })
    }

    

    this.GenerateMMSDeal = function (lender, ClientName, LenderRef, ClosingDt) {

        this.loginMMS();
        this.ClickOnCreateNewdeal();

        this.CreateNewDeal(lender, ClientName, LenderRef, ClosingDt);

    }

  /*  this.CreateMMSDeal = function (lender, ClientName, LenderRef, ClosingDt) {

        this.loginMMS();
        this.ClickOnCreateNewdeal();
        this.CreateNewDealOnly(lender, ClientName, LenderRef, ClosingDt);
    }*/


    
    this.CreateMMSDeal = function (lender, ClientName, LenderRef, ClosingDt) {
        counter = 0;
        CreateMMSDealTillSucess(lender, ClientName,LenderRef, ClosingDt);
    }

    var CreateMMSDealTillSucess = function (lender, ClientName, LenderRef, ClosingDt) {
        counter ++;
        browser.ignoreSynchronization = true;  // or false
        browser.get(MMSUrl);
        CustomLibrary.WaitForElementPresent(tbUname);
        tbUname.clear();
        tbUname.sendKeys(MMSUser);
        tbPwd.sendKeys(MMSPwd);
        browser.executeScript("arguments[0].click();", btnSignIn.getWebElement());
        browser.sleep(1000);
        CustomLibrary.WaitNClick(lnkNewDeal);

       if (lender == null) { } else { ddlLender.element(by.cssContainingText('option', lender)).click(); }
       if (ClientName == null) { } else { tbClientLastName.sendKeys(ClientName); }
       tbLenderRefNo.sendKeys(LenderRef);

       tbClosingDate.sendKeys(ClosingDt);
       browser.actions().doubleClick(tbRecieveDate).perform();
       element(by.css('input[type="file"]')).sendKeys(DocumentPath);
       browser.wait(EC.elementToBeClickable(btnUpload), 45000, 'Waiting for element to become clickable').then(() => {
               btnUpload.click();
            }, (error) => {
               expect(true).toBe(false, 'Unable to get the upload file element');
            })
        browser.sleep(1000);

        element.all(by.xpath('//*[@id="ctl00_ContentPlaceHolder1__thankYouText"]')).count().then(function(count) {        
         
             if(count == 0 && counter < 5 ) {
                CreateMMSDealTillSucess(lender, ClientName,LenderRef, ClosingDt);
            }
         })    
    }

    this.loginMMSPortal = function () {

        browser.ignoreSynchronization = true;  // or false
        browser.get(MMSUrl);
        CustomLibrary.WaitForElementPresent(tbUname);
        tbUname.clear();
        tbUname.sendKeys(MMSUser);
        tbPwd.sendKeys(MMSPwd);
        btnSignIn.click();
        browser.sleep(1000);

    }
    this.Release2loginMMS = function () {
        browser.ignoreSynchronization = true;  // or false

        browser.get(MMSUrl);
        tbUname.sendKeys(MMSRel1User);
        tbPwd.sendKeys(MMSRel1Pwd);

        //browser.executeScript("arguments[0].click();", elm.getWebElement());
        browser.executeScript("arguments[0].click();", btnSignIn.getWebElement());
        //btnSignIn.click();
        browser.sleep(1000);

    }

    this.Release3loginMMS = function () {
        browser.ignoreSynchronization = true;  // or false

        browser.get(MMSUrl);
        tbUname.sendKeys(MMSRel2User);
        tbPwd.sendKeys(MMSRel2Pwd);

        //browser.executeScript("arguments[0].click();", elm.getWebElement());
        browser.executeScript("arguments[0].click();", btnSignIn.getWebElement());
        //btnSignIn.click();
        browser.sleep(1000);

    }

    //Close MMS Deal funtion
    this.ClickOnCloseButton = function () {
        browser.sleep(1000);
        btnClose.click();
        browser.sleep(1000);
    }


};
module.exports = new MMSPortal();