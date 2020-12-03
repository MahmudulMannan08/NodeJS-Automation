'use strict';

var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');

var Env = Runsettings.data.Global.ENVIRONMENT.value
var URLLenderPortal = Runsettings.data.Global.LLC[Env].LenderPortalURL;

var LenderPortal = function () {

    var tbUserName = element(by.id('dataUserName'));
    var tbPwd = element(by.id('dataPassword'));
    var EC = protractor.ExpectedConditions;
    var btnSignIn = element(by.name('btnSignIn'));
    var ddlSearchParam = element(by.id('ctl00_ContentPlaceHolder1_SearchBox1_ddlSearchOption'));
    var lawyerDoc = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerList_grdDocumentList_ctl02_Label1'));
    var tbSearchInput = element(by.id('ctl00_ContentPlaceHolder1_SearchBox1_xelQuickSearch_txtValue'));
    var btnSearch = element(by.id('ctl00_ContentPlaceHolder1_SearchBox1_btnSearch'));
    var dealStatus = element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_grdDealSummary"]/tbody/tr[2]/td[8]/span'));
    var fileToUpload = '../../testData/MMS/Lawyer.pdf'
    //var tbBody = element(by.tagName('app-deal-history')).element(by.tagName('tbody'));
    var table = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealHistory1_grdResult'));
    var tableNotes = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_Notes1_grdNoteHistory'));
    var tabBody = table.element(by.tagName('tbody'));
    var tabBodyNotes = tableNotes.element(by.tagName('tbody'));
    var path = require('path');
    var documentName = "";
    var DocumentPath = path.resolve(__dirname, fileToUpload);
    
    
    this.LoginToLenderPortal = function (uName, Pwd) {
        browser.get(URLLenderPortal);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.urlIs(URLLenderPortal), 35000,  'Waiting for URL').then(() => {
                browser.sleep(1500);
                tbUserName.sendKeys(uName);
                tbPwd.sendKeys(Pwd);
                btnSignIn.click();
                CustomLib.DismissAlert();
                browser.sleep(2000);
             }, (error) => {
                console.log(error);
             })
    }

    this.LoginToLenderPortalBNS = function(userName, passWord) {

        browser.get(URLLenderPortal);
    
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.urlIs(URLLenderPortal), 35000,  'Waiting for URL').then(() => {
                CustomLib.WaitforElementVisible(tbUserName);
                tbUserName.sendKeys(userName);
                tbPwd.sendKeys(passWord);
                btnSignIn.click();
                CustomLib.DismissAlert();
                browser.sleep(2000);
             }, (error) => {
                console.log(error);
             })
        CustomLib.WaitforElementVisible(ddlSearchParam);
    }

    this.SearchDeal = function (para, value) {

        ddlSearchParam.element(by.cssContainingText('option', para)).click();
        tbSearchInput.sendKeys(value).click();
        btnSearch.click();
        browser.sleep(2000);
    }

    this.SearchDealBNS = function(ddOption, value) {

        ddlSearchParam.element(by.cssContainingText('option', ddOption)).click();
        tbSearchInput.sendKeys(value);
        btnSearch.click();
        CustomLib.WaitforElementVisible(element(by.id('ctl00_ContentPlaceHolder1_results_grdDeals')));
        element(by.id('ctl00_ContentPlaceHolder1_results_grdDeals_ctl02_lbViewDeal')).click();
        CustomLib.WaitforElementVisible(element(by.id('DocTable')));
    }

    this.VerifyTDDealStatusAfterRC = function () {
        
         dealStatus.getText().then(function (txt) { 
            expect(txt).toBe('Cancellation Requested', 'Status is invalid');
            browser.sleep(1000);
           
            
        })
    }

    this.VerifyTDDealStatus = function (Status) {
        
        return dealStatus.getText().then(function (txt) { 
            expect(txt).toBe(Status, 'Status is not as expected!');
            return txt 
            
        })
    }

    this.VerifyLawyerDoc = function (DocName) {
        browser.sleep(1000);
        lawyerDoc.getText().then(function (txt) { 
        expect(txt).toBe(DocName, 'Lawyer document is not found!');
                    
        })
    }

    this.VerifyUploadedDocument = function(uploadBy, documentName) {

        switch(uploadBy) {

            case 'Lawyer' :
                    CustomLib.WaitforElementVisible(element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerSubmitted_grdDocumentList')));
                    element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerSubmitted_grdDocumentList')).all(by.cssContainingText('td', documentName)).count().then(function(count) {
                        expect(count).toBeGreaterThan(0, "\x1b[41m\x1b[30m" + "Expected document " + documentName + " is not found" + "\x1b[0m");
                    });
                    break;
            case 'Lender' :
                    CustomLib.WaitforElementVisible(element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LenderList_grdDocumentList')));
                    element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LenderList_grdDocumentList')).all(by.cssContainingText('span', documentName)).count().then(function(count) {
                        expect(count).toBeGreaterThan(0, "\x1b[41m\x1b[30m" + "Expected document " + documentName + " is not found" + "\x1b[0m");
                    });
                    break;
        }
    }

    this.ViewDealFromGrid = function () {
        element(by.id('ctl00_ContentPlaceHolder1_results_grdDeals_ctl02_lbViewDeal')).click();
        browser.sleep(2000)

    }

    this.VerifyLawyerSubmittedDocumentInGrid = function (docName) {
   
        element.all(by.xpath("//*[@id=\'ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerSubmitted_grdDocumentList\']//span[contains(text(),'"+ docName + "')]")).count().then(function(count){  
            expect(count).toBeGreaterThan(0)  
    });
       
     
       // var tblDocument = element(by.id("ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerSubmitted_grdDocumentList"));
       // expect(tblDocument.element(by.cssContainingText('span',docName)).isDisplayed()).toBe(true) 

    }

    this.NavigateToDocumentsTab = function () {

        element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_DealDetailInformation1_tabMenun0"]/table/tbody/tr/td')).click();


    }

    this.NavigateToDealHistoryTab = function () {

        element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_DealDetailInformation1_tabMenun1"]/table/tbody/tr/td')).click();


    }

    this.NavigateToDealHistoryTabBNS = function () {

        element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_DealDetailInformation1_tabMenun2"]/table/tbody/tr/td')).click();


    }

    this.NavigateToNotesTabBNS = function () {

        element(by.xpath('//*[@id="ctl00_ContentPlaceHolder1_DealDetailInformation1_tabMenun1"]/table/tbody/tr/td')).click();


    }

    this.VerifyNotesTableEntry = function (name) {
        browser.wait(EC.visibilityOf(tabBodyNotes), 50000, 'Notes table is not available');
        expect(tabBodyNotes.element(by.cssContainingText('td', name)).isDisplayed()).toBe(true,"Entry is not present in the deal history grid.");
        }; 

    this.VerifyHistoryTableEntry = function (name) {
    browser.wait(EC.visibilityOf(tabBody), 5000, 'History table is not available');
    expect(tabBody.element(by.cssContainingText('td', name)).isDisplayed()).toBe(true,"Entry is not present in the deal history grid.");
    };

    this.ClickOnLawyerSubmittedDocument = function () {

        element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_LawyerSubmitted_grdDocumentList_ctl02_btnView')).click();
        browser.sleep(2000);

    }

    this.uploadLenderDoc = function(docName) {
        var lnkUploadDoc = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_lnkUploadDoc'));
        var ddlDocumenttype = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_ddlDocType'));
        CustomLib.WaitNClick(lnkUploadDoc);
        //Select document type
        CustomLib.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Other(refer to Solicitor - Notary Instructions)')));
        //Enter document name
        element(by.id("ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_txtDocName")).sendKeys(docName);
        //Upload file
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        //element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        //Click upload button
        element(by.id("ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_btnUpload")).click();
        browser.sleep(3500);
    }

    this.uploadLenderDocBNS = function(docName) {
        var lnkUploadDoc = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_lnkUploadDoc'));
        var ddlDocumenttype = element(by.id('ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_ddlDocType'));
        CustomLib.WaitNClick(lnkUploadDoc);
        //Select document type
        CustomLib.WaitNClick(ddlDocumenttype.element(by.cssContainingText('option', 'Other (refer to Mortgage Instructions)')));
        //Enter document name
        element(by.id("ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_txtDocName")).sendKeys(docName);
        //Upload file
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        //element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        //Click upload button
        element(by.id("ctl00_ContentPlaceHolder1_DealDetailInformation1_DealDocuments1_btnUpload")).click();
        browser.sleep(3500);
    }

};

module.exports = new LenderPortal();