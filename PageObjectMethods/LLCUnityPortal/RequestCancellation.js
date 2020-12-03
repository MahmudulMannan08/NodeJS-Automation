'use strict';
var TestData = require('../../testData/TestData.js');
var TDTestData = require('../../testData/TD/TDData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('./RequestFunds.js');
var NotesPage = require('../../PageObjectMethods/LLCUnityPortal/Notes.js');
var ManageDocuments = require('../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var FinalReportPage = require('../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var Lang = TestData.data.LANGUAGE.value;
var Env = Runsettings.data.Global.ENVIRONMENT.value;
var RequestCancelHeader = TestData.data[Lang].RequestForCancellation.RequestCancelHeader;
var PortalFieldIdentifier = TestData.data[Lang].Header.PortalFieldIdentifier;
var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
var Footer = TestData.data[Lang].Footer.Footer;
var RFFSubmitMsg = TestData.data[Lang].Messages.RFFSubmitMsg;
var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
var SubmitSuccessMsg = TestData.data[Lang].Messages.SubmitSuccessMsg;

var RequestCancellation = function () {

    var lnkNeedHelp = element(by.linkText('Need Help?'));
    //var lblRC = element(by.css('.title'));
    var lblRC = element.all(by.css('.title')).first();
    var CommentRFC = element(by.id('txtComments'));
    var lblCharCountComment = element(by.xpath("//label[@class='float-right']"));
    var ddRequestForFunds = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));
    var lblRFC = element(by.css('.control-label.required'));
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var btnSubmit = element(by.buttonText('Submit'));
    var btnOK = element(by.css('.modal-content')).all(by.tagName('button')).get(1);
    var btnCancel = element(by.buttonText('Cancel'));
    var RFCConfirmMsg = element(by.css('.modal-content')).element(by.css('.ng-star-inserted'));
    var puRFCSubmit = element(by.css('.modal-content'));
    var fieldIdentifrAsterisk = element(by.tagName('app-request-cancellation')).element(by.css('.ng-star-inserted'));
    var SecFooter = element(by.tagName('app-footer'));
    var lnkLegal = SecFooter.all(by.tagName('a')).get(0);
    var lnkPrivacy = SecFooter.all(by.tagName('a')).get(1);
    var txtFooter = SecFooter.element(by.tagName('span'));
    var btnRequestCancellation = element(by.id('cancel'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'))
    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var tabRC = element(by.id('cancel'));
    var HomeMenu = element(by.id('home'));
    var CancelReasonOption1 = TestData.data[Lang].RequestForCancellation.CancelReasonOption1;
    var CancelReasonOption2 = TestData.data[Lang].RequestForCancellation.CancelReasonOption2;
    var CancelReasonOption3 = TestData.data[Lang].RequestForCancellation.CancelReasonOption3;
    var CancelReasonOption4 = TestData.data[Lang].RequestForCancellation.CancelReasonOption4;
    var PartnerSystemValidationMsg = TestData.data[Lang].Messages.PartnerSystemValidationMsg;
    var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
    var UnityValidationMsg = TestData.data[Lang].Messages.UnityValidationMsg;
    
    

    this.VerifyRFCPage = function () {
        CustomLib.WaitforElementVisible(fieldIdentifrAsterisk);
        expect(lblRC.isDisplayed()).toBe(true,"Non Visibility of title Request Cancellation");
        expect(lblRC.getText()).toBe(RequestCancelHeader);

        expect(fieldIdentifrAsterisk.isDisplayed()).toBe(true,"Non Visibility of Asterisk symbol");
        expect(fieldIdentifrAsterisk.getText()).toBe(PortalFieldIdentifier);

        expect(btnSubmit.isDisplayed()).toBe(true,"Submit button is not present");

        expect(lnkNeedHelp.isDisplayed()).toBe(true,"Link Need help is not present");

        expect(txtFooter.isDisplayed()).toBe(true,"Non Visibility of footer Registered trademark");
        expect(txtFooter.getText()).toContain(Footer);

        expect(lnkLegal.isDisplayed()).toBe(true,"Link Legal is not present");
        expect(lnkLegal.getText()).toBe('Legal');

        expect(lnkPrivacy.isDisplayed()).toBe(true,"Link Privacy Policy is not present");
        expect(lnkPrivacy.getText()).toBe('Privacy Policy');

    }

    this.SubmitCancellation = function () {
       // browser.sleep(3000);
        CustomLib.WaitNClick(btnSubmit);
    }

    this.SubmitCancellationDynamic = function () {				
        CustomLib.WaitNClick(btnSubmit);
    }

    this.VerifyMissinfieldMessag = function () {

        expect(element(by.css('.col-md-12.required-message-danger')).isPresent()).toBe(true, 'Validation Message is not present');
        expect(element(by.css('.col-md-12.required-message-danger')).getText()).toContain(PortalValidationMsg, 'Validation Message is not as expected');
    }

    this.SelectReasonType = function (type) {
        if (!ddReasonForCancellation.element(by.cssContainingText('option', type)).isPresent()) {
            //browser.sleep(2000)
        }
        CustomLib.WaitforElementVisible(ddReasonForCancellation);
        ddReasonForCancellation.click();
        ddReasonForCancellation.element(by.cssContainingText('option', type)).click();
    }

    this.VerifyConfirmCancellationSection = function () {
        CustomLib.WaitforElementVisible(RFCConfirmMsg);
        //  expect(ConfirmSection.isDisplayed()).toBe(true);
        expect(RFCConfirmMsg.getText()).toContain(RFFSubmitMsg, 'Message is not present');
        expect(btnCancel.getText()).toContain('Cancel', 'Invalid button text');
        expect(btnOK.getText()).toContain('OK', 'Invalid button text');
    };

    this.ConfirmCancellation = function (type) {
      //  browser.sleep(3000)
        if (type == 'OK') {
            CustomLib.WaitNClick(btnOK);
        }
        if (type == 'Cancel') {
            CustomLib.WaitNClick(btnCancel);
        }
    }

    this.ConfirmCancellationDynamic = function (type) {
						   
        if (type == 'OK') {
            CustomLib.WaitNClick(btnOK);
        }
        if (type == 'Cancel') {
            CustomLib.WaitNClick(btnCancel);
        }
    }

    this.VerifyReqCancellationSection = function () {
        expect(lblRFC.getText()).toContain('Reason for Cancellation');
        expect(ddReasonForCancellation.isDisplayed()).toBe(true);
        expect(ddReasonForCancellation.all(by.tagName('option')).get(1).getText()).toBe(CancelReasonOption1);
        expect(ddReasonForCancellation.all(by.tagName('option')).get(2).getText()).toBe(CancelReasonOption2);
        expect(ddReasonForCancellation.all(by.tagName('option')).get(3).getText()).toBe(CancelReasonOption3);
        expect(ddReasonForCancellation.all(by.tagName('option')).get(4).getText()).toBe(CancelReasonOption4);
    };

    this.VerifyLenderCancelledDealMessage = function () {
        expect(StatusMsg.getText()).toContain(TDTestData.data[TestData.data.LANGUAGE.value].Messages.LenderCancelDeal);
    }

    this.VerificationPostCancellation = function () {
        expect(ddReasonForCancellation.isEnabled()).toBe(false);
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        HomePage.VerifySaveButtonStatus('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        RFFPage.VerifyComment('Disabled');
        RFFPage.VerifySubmitButtonStatus('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        FinalReportPage.VerifyallButtonStatus('Disabled');
        //Rest verification will be done after final report is done

        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        NotesPage.VerifyNewNoteButtonStatus('Enabled');
        //Bug#231219: 'Print Note' link gets disabled after request for cancellation
        //NotesPage.VerifyPrintButtonStatus('Enabled');

        

    }

     this.VerificationPostCancellationTD = function () {

        expect(ddReasonForCancellation.isEnabled()).toBe(false,"Reason drop down is disabled");
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        HomePage.VerifySaveButtonStatus('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        expect(ddRequestForFunds.isEnabled()).toBe(false,"Type of funding request drop down is disabled");
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        
        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        ManageDocuments.VerifyDisableBrowseButton();
        
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        FinalReportPage.VerifyallButtonStatusFinalReport('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);

        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);

    }


    this.VerificationPostCancellationByLender = function () {

        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        HomePage.VerifySaveButtonStatus('Disabled');
                   
        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        expect(ddRequestForFunds.isEnabled()).toBe(false,"Type of Funding request drop down is disabled");
        
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        FinalReportPage.VerifyallButtonStatusFinalReport('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        ManageDocuments.VerifyDisableBrowseButton();
        
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        FinalReportPage.VerifyallButtonStatusFinalReport('Disabled');
                
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);

    }

   
    this.VerificationPostReinstateOfDeal = function () {

        //Verify tabs and buttons are enabled after reinstate
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        HomePage.VerifySaveButtonStatus('Enabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        expect(ddReasonForCancellation.isEnabled()).toBe(true,"Reason for cancellation drop down is enabled");
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        expect(ddRequestForFunds.isEnabled()).toBe(true,"Type of Funding request drop down is enabled");

        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        FinalReportPage.VerifyallButtonStatusFinalReport('PartiallyEnabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
        ManageDocuments.VerifyEnableBrowseButton();
                                
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');

        }

    this.VerifyCancelledDealMsg = function (Msg) {

        var CancelledMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.ng-star-inserted')).get(3);
        CustomLib.scrollIntoView(CancelledMsg);
        expect(CancelledMsg.getText()).toContain(Msg);
    }

    this.VerifyClosedDealMsg = function (Msg) {

        var ClosedMsg = element(by.xpath('//app-message-bar/div/div/div[2]/p'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyClosedDealMsgBNS = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifySucessfulySubmittedChanges = function () {

        var msg = element(by.css('.m-0'));
        msg.getText().then(function (txt) {

            expect(txt).toBe(SubmitSuccessMsg);
        })

    }
    this.VerifySubmitButtonStatus = function (Status) {

        CustomLib.scrollIntoView(lblRFC);

        if (Status == 'Disabled') {
            expect(btnSubmit.isEnabled()).toBe(false, "Expected Submit button to be disabled. But found Enabled!");
        }
        if (Status == 'Enabled') {
            expect(btnSubmit.isEnabled()).toBe(true, "Expected Submit button to be enabled. But found Disabled!");
        }
    }

    this.VerifyReasonDropDownStatus = function (Status) {

        if (Status == 'Disabled') {
            expect(ddReasonForCancellation.isEnabled()).toBe(false, "Expected Reason For Cancellation dropdown to be disabled. But found Enabled!");
        }
        if (Status == 'Enabled') {
            expect(ddReasonForCancellation.isEnabled()).toBe(true, "Expected Reason For Cancellation dropdown to be enabled. But found Disabled!");
        }
    }

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyClosingDateUpdateMsg = function () {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosingDateUpdMsg = TestData.data[Lang].Messages.ClosingDateUpdateMsg;
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(StatusMsg), 45000,  'Element is not visible').then(() => {
            expect(StatusMsg.getText()).toContain(ClosingDateUpdMsg,'Closing date update message is not present.');
            }, (error) => {
                   expect(true).toBe(false, "Closing date update Message is not visible.");
        })  
    }

    this.VerifyNavigateAway = function () {
        var msg = TestData.data[Lang].Messages.NavigateawayMsg
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        expect(navigateAwyPopupMsg.getText()).toBe(msg);
        expect(navigateAwyStay.isDisplayed()).toBe(true);
        expect(navigateAwyLeave.isDisplayed()).toBe(true);

    }

    this.NavigateAway = function () {
        browser.sleep(1000);
        CustomLib.WaitNClick(HomeMenu);
    }

    this.NavigateAwayAcceptReject = function (buttonSelect) {

        CustomLib.WaitForSpinnerInvisible();
        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }

    }

    this.CommentonRFC = function (Comment) {
        
        CustomLib.WaitforElementVisible(CommentRFC);
       
        expect(lblCharCountComment.getText()).toBe('0/500 characters', 'Incorrect character count');
        CommentRFC.sendKeys(Comment);
       
        var CommLength = Comment.length.toString();
        expect(lblCharCountComment.getText()).toBe('' + CommLength + '/500 characters');
        
    }

    this.VerifyClosedDealMsgTD = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }

    this.VerifyRequestCancellationTab = function (Status) {
       
        if (Status == 'Disabled') {
            expect(tabRC.isEnabled()).not.toBe(false,"Request Cancellation tab is disabled.");
            
        }
        if (Status == 'Enabled') {
            expect(tabRC.isEnabled()).not.toBe(true,"Request Cancellation tab is enabled.");
           
        }
    }
    

};

module.exports = new RequestCancellation();