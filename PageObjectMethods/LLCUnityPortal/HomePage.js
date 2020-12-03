'use strict';
var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('./MenuPanel.js');
var LenderIntegrationBNS = require('./Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationBNS = require('./Services//LawyerIntegration/LawyerIntegrationBNS.js');
var dateFormat = require('dateformat');
var fileToUpload = '../../testData/MMS/Lawyer.pdf'
var path = require('path');

var Env = Runsettings.data.Global.ENVIRONMENT.value;
var Lang = Runsettings.data.Global.LANG.value;
var NavigateAwyPopupMsg = TestData.data[Lang].Messages.NavigateawayMsg;
var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
var UnityValidationMsg = TestData.data[Lang].Messages.UnityValidationMsg;
var EmailRecHeader = TestData.data[Lang].Home.EmailRecHeader;
var MortgageInfoHeader = TestData.data[Lang].Home.MortgageInfoHeader;
var LenderName = Runsettings.data.Global.BNS[Env].LenderName;
var PortalFieldIdentifier = TestData.data[Lang].Header.PortalFieldIdentifier;
var UnityFieldIdentifier = TestData.data[Lang].Header.UnityFieldIdentifier;
var Footer = TestData.data[Lang].Footer.Footer;

var HomePage = function () {
    //var lblHome = element.all(by.css('.title')).first();
    var lblHome = element(by.xpath('//section[@class=\'content-header\']/h1[@class=\'title\']'));
    var lnkNeedHelp = element(by.css('.needHelp'));
    var PortalFieldIdentifierTxt = element(by.tagName('app-deal-details')).all(by.tagName('span')).get(0);
    var UnityFieldIdentifierTxt = element(by.tagName('app-deal-details')).all(by.tagName('span')).get(2);
    var PartnerSystemValidationMsg = TestData.data[Lang].Messages.PartnerSystemValidationMsg;
    var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
    var UnityValidationMsg = TestData.data[Lang].Messages.UnityValidationMsg;
    var ValidationMsg = TestData.data[Lang].Messages[Env].ValidationMsg;
    var UserGuideMsg = TestData.data[Lang].Messages[Env].UserGuideMsg;
    
    //Deal Status Section
    var SecLLCDealStatus = element(by.tagName('app-deal-milestones'));
    var milestoneDealAccepted = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Deal Accepted \']"));
    var milestoneRFF = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Request for Funds \']"));
    var milestoneSROT = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Final Report \']"));
    var LLCDealAcceptedCheckA = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Deal Accepted \']//ancestor::div[1]/a"))
    var LLCDealAcceptedCheck = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Deal Accepted \']//ancestor::div[1]"));
    var LLCDealAcceptedCheckImg = LLCDealAcceptedCheck.element(by.tagName('img'));
    var LLCRFFCheckMark = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Request for Funds \']//ancestor::div[1]"));
    var LLCFinalReportMark = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[text()=\' Final Report \']//ancestor::div[1]"));

    var WizardDealstatusAll = element.all(by.tagName('app-deal-milestones'));
    var LLCDealAcceptedCheckAll = element.all(by.tagName('app-deal-milestones'));
    var LLCDealAcceptedCheckA = LLCDealAcceptedCheckAll.all(by.tagName('a')).get(0);

    var LLCDealAcceptedCheck = element.all(by.css('.milestones-col.ng-star-inserted')).get(0);
    var LLCDealAcceptedCheckImg = element(by.tagName('app-deal-milestones')).all(by.css('.milestones-col.ng-star-inserted')).get(0).element(by.tagName('img'));
    var LLCRFFCheckMark = element.all(by.css('.milestones-col.ng-star-inserted')).get(1);
    var LLCFinalReportMark = element.all(by.css('.milestones-col.ng-star-inserted')).get(2);
    var MMSDealAcceptedCheck = element(by.tagName('app-deal-milestones')).element(by.tagName('img'));
    var MMSDealRFFCheck = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(1);
    var BrokerConditionMet = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(2);
    var SolicitorConditionMet = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(3);
    var LenderAutorisationFundMet = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(4);
    var DealFundedMet = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(5);
    var FinalReportMet = element.all(by.tagName('app-deal-milestones')).all(by.tagName('img')).get(6);
    var CheckMark = element(by.xpath("/html/body/app-root/div/div/div/app-master/div[2]/div/deal-milestones/div/div/div/div/div[4]"));
    var MMSReqForFundCheckMarkAll = element.all(by.tagName('milestones-col ng-star-inserted'));
    var MMSReqForFundCheckMark = MMSReqForFundCheckMarkAll.all(by.tagName('a')).get(1);
    var MMSSolicitorConditionsChecked = element(by.xpath('/html/body/app-root/div/div/div/app-master/div[2]/div/deal-milestones/div/div/div/div/div[4]'))


    var MMSLenderAuthToFundCheckMark = element(by.xpath('/html/body/app-root/div/div/div/app-master/div[2]/div/deal-milestones/div/div/div/div/div[5]'));


    var MMSDealFundedCheckMark = element(by.xpath("/html/body/app-root/div/div/div/app-master/div[2]/div/deal-milestones/div/div/div/div/div[6]"));

    var MMSFinalReportStartedCheckMark = element.all(by.tagName('deal-milestones')).all(by.tagName('a')).get(6);


    var SecMMSDealStatus = element(by.tagName('deal-milestones'));
    var WizardDealstatusAll = element.all(by.tagName('app-deal-milestones'));
    var lblMMSDealstatus = SecMMSDealStatus.all(by.css('.title')).get(0)
    var WizardMMSDealstatusAll = element(by.tagName('milestones-row justify-content-between'));
    var WizardMMSDealstatus = WizardDealstatusAll.all(by.tagName('p'));

    //Mortgage Info section

    var lblMortgageInfo = element(by.xpath("//div[@id=\'MainDiv\']/h2"));
    var lblLender = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and text()=\'Lender\']"));
    var lblLenderNameValue = element(by.xpath("//div[@id='MainDiv']//div[@class=\'font-weight-bold\' and contains(text(),\'Lender\')]/ancestor::div[1]/div[2]"));
    var lblRefNo = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold ng-star-inserted\']"));
    var lblLenderRefNoValue = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold ng-star-inserted\']/ancestor::div[1]/div[2]"));
    var lblClosingDate = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Closing Date\')]"))
    var SecMortgageInfo = element(by.tagName('app-mortgage-info'));
    var lblMortgageInfo = SecMortgageInfo.all(by.css('.title')).get(0);
    var InfoContainer = element.all(by.css('.jumbotron.box-inner')).get(1)//.element(by.css('.col'))

    var lblLender = element.all(by.css('.font-weight-bold')).get(0);
    var lblLenderNameValue = element.all(by.css('.form-group.col-md-4')).get(0).all(by.tagName('div')).get(1);

    var lblRefNo = element.all(by.css('.font-weight-bold')).get(1);
    var lblLenderRefNoValue = element.all(by.css('.form-group.col-md-4')).get(1).all(by.tagName('div')).get(1);

    var lblClosingDate = element.all(by.css('.font-weight-bold')).get(2);
    var lblClosingDateValueBNS = element.all(by.css('.form-group.col-md-4')).get(2).all(by.tagName('div')).get(1);
    var lblClosingDateValue = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Closing Date\')]/ancestor::div[1]/div[2]"))
    var lblOwnerName = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Mortgagor/Purchaser\')]"));
    var lblOwnerNameValue = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Mortgagor/Purchaser\')]/ancestor::div[1]/div[2]"));
    var lblPropertyAddress = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Property Address\')]"));
    var lblPropertyAddressValue = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'Property Address\')]/ancestor::div[1]/div[2]"));
    var lblFileNumber = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'File No.\')]"));
    var lblFileNumberValue = element(by.xpath("//div[@id=\'MainDiv\']//div[@class=\'font-weight-bold\' and contains(text(),\'File No.\')]/ancestor::div[1]/div[2]"));

    // Email section
    var lblMailRecep = element(by.tagName('app-email-notifications')).all(by.css('.title')).get(0);
    var MailRecepientSelectAll = element(by.tagName('app-email-notifications')).all(by.tagName('big-checkbox')).get(0).element(by.tagName('label'));
    var cbFirstMailRecipient = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(1).element(by.tagName('big-checkbox')).element(by.css('.check-box'));
    var btnSeeMore = element(by.linkText('See More '))
    var btnSeeLess = element(by.linkText('See Less '))

    var btnSelectAll = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(0).element(by.tagName('big-checkbox')).element(by.css('.check-box'));

    var btnCancel = element(by.css('.btn.btn-danger.fct'))
    var btnSave = element(by.css('.btn.btn-primary.fct'));

    var SuccessMsg = element(by.tagName('app-message-bar'));

    var labReciValidationMsg = element(by.tagName('app-deal-details'));
    var labReciValidationMsg1val = element(by.css('.required-message-container')).all(by.tagName('span')).get(0);

    var labReciValidationMsg2val = element(by.css('.required-message-container')).all(by.tagName('span')).get(2);

    var chkbxSelectafirstrecipent = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(1).element(by.tagName('big-checkbox')).element(by.tagName('input'));


    var lblCopyRight = element(by.css('.copyright-black'));
    var lnkLegal = element(by.linkText('Legal'))
    var lnkPrivacyPolicy = element(by.linkText('Privacy Policy'))

    var CancellationRequestMsg = element(by.tagName('app-message-bar')).element(by.tagName('div')).element(by.tagName('div'));

    var btnOkRffSubmit = element(by.cssContainingText('.btn.btn-success.btn-sm.fct.mt-2', 'OK'));

    var btnReqForFunds = element(by.id('funds'));
    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var lblRFF = element(by.css('.title'));

    var SecFooter = element(by.tagName('app-footer'));
    var lnkLegal = SecFooter.all(by.tagName('a')).get(0);
    var lnkPrivacy = SecFooter.all(by.tagName('a')).get(1);
    var txtFooter = SecFooter.element(by.tagName('span'));

    //Amendments
    var txtMsgAmendmentLginAlert = element(by.css('.row.alert-danger'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var lnkSubmitToLender = StatusMsg.element(by.tagName('a'));
    var btnOK = element(by.buttonText('OK'));
    var btnCancel = element(by.buttonText('Cancel'));

    //Manage Documents
    var tableLenderDocs = element.all(by.css('.table.table-bordered.header-only.headerStyle')).get(0);
    var tabBodyLenDocs = tableLenderDocs.element(by.tagName('tbody'));

    var tableLawyerrDocs = element.all(by.css('.table.table-bordered.header-only.headerStyle')).get(1);
    var tabBodyLawyerDocs = tableLawyerrDocs.element(by.tagName('tbody'));
    var documentName = "";
    var DocumentPath = path.resolve(__dirname, fileToUpload);
    var counter = 0;

    this.VerifyEmailRequired = function () {

        //PortalFieldIdentifierTxt.getText().toBe('Required field(s) to be completed below');
        //UnityFieldIdentifierTxt.getText().toBe('Required field(s) to be completed in Unity');
        expect(PortalFieldIdentifierTxt.getText()).toBe(PortalValidationMsg);
        expect(UnityFieldIdentifierTxt.getText()).toBe(ValidationMsg);
    }

    this.VerifyAlert = function () {
        browser.sleep(1500)
        browser.switchTo().alert().then(function (alertDialog) {

            expect(alertDialog.getText()).toContain('Are you sure you want to leave this page? All information entered will be lost if you proceed to navigate away from this screen. Do you wish to proceed?');
        })

    }

    this.VerifyNavigateAway = function () {
        navigateAwyLeave.click();
    }

    this.acceptAlert = function () {
        browser.sleep(1500)
        browser.driver.switchTo().alert().then(
            function (alert) {
                alert.accept();
                console.log('Alert Found')
            },
            function (err) { }
        );

    }

    this.NavigateAwayAcceptReject = function (buttonSelect) {

        //CustomLib.WaitForSpinnerInvisible();
        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }
        CustomLib.WaitforElementInvisible(element(by.css('.modal-content')));
    }

    this.dismissAlert = function () {
        browser.sleep(1500)
        browser.driver.switchTo().alert().then(
            function (alert) {
                alert.dismiss();
                console.log('Alert Found')
            },
            function (err) { }
        );

    }

    this.VerifySaveButtonStatus = function (Status) {
        
        //CustomLib.scrollIntoView(lblMailRecep);
        CustomLib.scrollIntoView(btnSave);
        

        if (Status == 'Disabled') {
            expect(btnSave.isEnabled()).toBe(false, "Expected Save Button to be - disbled. But Save Button is - enabled");
        }
        if (Status == 'Enabled') {
            expect(btnSave.isEnabled()).toBe(true, "Expected Save Button to be - enabled. But Save Button is - disbled");
        }
    }

    this.VerifyClosedRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var ClosedRequestMessage = TestData.data[Lang].Messages.ClosedDealMsg;
        expect(StatusMsg.getText()).toContain(ClosedRequestMessage,'Closed deal message is not present.');
    }

       
    this.VerifyAmendmentMsg = function () {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var LenderAmendmentMsg = TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS;
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(StatusMsg), 45000,  'Element is not visible').then(() => {
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg,'Amendment message is not present.');
            }, (error) => {
                   expect(true).toBe(false, "Amendment Message is not visible.");
        })  
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

        this.ClickSubmitToLenderMsgLnk = function() {
        CustomLib.ScrollUp(10000,0);
        CustomLib.WaitNClick(lnkSubmitToLender);
        expect(btnOK.isPresent()).toBe(true,"Submit to lender link is not a hyperlink");
        CustomLib.WaitNClick(btnCancel);

    }

    this.ClickOKForSubmitToLenderMsgLnk = function() {
        CustomLib.ScrollUp(10000,0);
        CustomLib.WaitNClick(lnkSubmitToLender);
        expect(btnOK.isPresent()).toBe(true,"Submit to lender link is not a hyperlink");
        CustomLib.WaitNClick(btnOK);

    }

    this.ClickOKButtonForSubmitToLender = function() {
        
        CustomLib.ScrollUp(10000,0);
        CustomLib.WaitNClick(lnkSubmitToLender);
        expect(btnOK.isPresent()).toBe(true,"Submit to lender link is not a hyperlink");
        CustomLib.WaitNClick(btnOK);

    }

    this.VerifyHomePage = function () {
        var lblHomePage = element(by.xpath('//section[@class=\'content-header\']/h1[@class=\'title\']'));
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(lblHomePage), 45000,  'Element is not visible').then(() => {
            expect(lblHomePage.isDisplayed()).toBe(true, "Page is Displayed.");
            }, (error) => {
                   expect(true).toBe(false, "Page is not visible.");
        })  
    }

    this.ClickNeedHelp = function () {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(lnkNeedHelp), 45000,  'Waiting for Home element to become visible').then(() => {
            CustomLib.scrollIntoView(lnkNeedHelp);
            lnkNeedHelp.click();
            }, (error) => {
                    expect(lnkNeedHelp.isDisplayed()).toBe(true);
        })  
    }

    this.VerifyNeedHelpLink = function () {
        expect(lnkNeedHelp.isPresent()).toBe(true, 'Need Help link is not present');
       
    }

    this.VerifyLinkOnNeedHelpPage = function () {
        var guideLink = element(by.css('.btn-link.fct.ml-2'));
        expect(guideLink.isPresent()).toBe(true, 'LLC Guide link is not present');
        browser.sleep(1000);
        CustomLib.CloseTab();

    }

    
    this.VerifyGuideUsLinkOnNeedHelpPage = function () {
       
        var lnkGuideUs = element.all(by.css('.btn-link.fct.ml-2')).get(1);
        browser.sleep(500);
        expect(lnkGuideUs.isPresent()).toBe(true, 'Guide us link is not present');
        lnkGuideUs.getText().then(function (str) {
            expect(str).toContain(UserGuideMsg, " User Guide link is not present.");
            console.log(str);
        });
        browser.sleep(1000);
        //CustomLib.CloseTab();

    }

    this.VerifyContactUsOnNeedHelpPage = function () {
        var ContactUs = element.all(by.css('.jumbotron.box-outer')).get(1);
        browser.sleep(500);
        expect(ContactUs.isPresent()).toBe(true, 'Contact us section is not present');
        ContactUs.getText().then(function (str) {
            expect(str).toContain('Phone', "Phone information not present.");
            console.log(str);
        });
        browser.sleep(1000);
        //CustomLib.CloseTab();

    }

    this.VerifyFooter = function () {
        CustomLib.WaitForElementPresent(SecFooter);
        expect(lnkLegal.isDisplayed()).toBe(true);
        expect(lnkLegal.getText()).toBe('Legal');
        expect(lnkPrivacyPolicy.isDisplayed()).toBe(true);
        expect(lnkPrivacyPolicy.getText()).toBe('Privacy Policy');
        expect(lblCopyRight.isDisplayed()).toBe(true);
        expect(lblCopyRight.getText()).toBe('® Registered trademark of First American Financial Corporation');
    }

    this.VerifyCancellationRequestMsg = function() {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage,'Cancellation deal message is not present.');
    }


    this.VerifyDealStatusSection = function (x) {

        if (x == 'LLC') {
            CustomLib.WaitForElementPresent(SecLLCDealStatus);
            expect(SecLLCDealStatus.isDisplayed()).toBe(true);
            CustomLib.WaitforElementVisible(milestoneDealAccepted);
            milestoneDealAccepted.getText().then(function (str) {
                expect(str).toContain('Deal Accepted', "Deal Accepted Milestone.");
            });
            milestoneRFF.getText().then(function (str) {
                expect(str).toContain('Request for Funds', "Requst for Funds Milestone");
            });
            milestoneSROT.getText().then(function (str) {
                expect(str).toContain('Final Report', "Final Report Milestone.");
            });
        }
        else if (x == 'MMS') {

            expect(SecMMSDealStatus.isDisplayed()).toBe(true);
            WizardMMSDealstatus.getText().then(function (str) {
                expect(str).toContain('Deal Accepted');
                expect(str).toContain('Request for Funds');
                expect(str).toContain('Broker Conditions');
                expect(str).toContain('Solicitor Conditions');
                expect(str).toContain('Lender Authorization to Fund');
                expect(str).toContain('Deal Funded');
                expect(str).toContain('Final Report');
            })
        }
    }

    this.VerifyMortgageInfoSection = function () {
        CustomLib.WaitforElementVisible(lblMortgageInfo);
        CustomLib.scrollIntoView(lblMortgageInfo)
        expect(lblMortgageInfo.isPresent()).toBe(true)
        expect(lblMortgageInfo.getText()).toBe(MortgageInfoHeader);

        expect(lblLender.getText()).toContain('Lender');
        expect(lblRefNo.getText()).toContain('Reference No.');
        expect(lblClosingDate.getText()).toContain('Closing Date');

        expect(lblOwnerName.getText()).toContain('Mortgagor/Purchaser');
        expect(lblPropertyAddress.getText()).toContain('Property Address');
        expect(lblFileNumber.getText()).toContain('File No.');

    }

    this.VerifyMortgageInfoValue = function () {
        CustomLib.WaitForElementPresent(lblLenderNameValue);
        CustomLib.WaitForContentToBePresent(lblLenderNameValue,LenderName); 
        lblLenderNameValue.getText().then(function(txt)
        {   
            expect(txt).toBe(LenderName, "Lender Name under Mortgagor Section on Home Page");
        })

        CustomLib.WaitForContentToBePresent(lblLenderRefNoValue,LenderIntegrationBNS.ReturnLenderRefNo()); 
        lblLenderRefNoValue.getText().then(function(txt)
        {
            expect(txt).toBe(LenderIntegrationBNS.ReturnLenderRefNo(), "Lender Reference Number under Mortgagor Section on Home Page");
        })

        var date = LenderIntegrationBNS.ReturnClosingDate();
        var formattedDate = dateFormat(date, "UTC:mmmm dd, yyyy");
        CustomLib.WaitForContentToBePresent(lblClosingDateValueBNS,formattedDate);  
        lblClosingDateValueBNS.getText().then(function(txt)
        {
           expect(lblClosingDateValueBNS.getText()).toBe(formattedDate, "Closing Date Under Mortgage Section on Home Page");
        })

        CustomLib.WaitForContentToBePresent(lblOwnerNameValue,LenderIntegrationBNS.ReturnMrtgagorFull()); 
        lblOwnerNameValue.getText().then(function(txt)
        { 
           expect(lblOwnerNameValue.getText()).toBe(LenderIntegrationBNS.ReturnMrtgagorFull(), "Mortgagor Name Under Mortgage Section on Home Page");
        })

        CustomLib.WaitForContentToBePresent(lblPropertyAddressValue,LenderIntegrationBNS.ReturnPropertyAddress()); 
        lblPropertyAddressValue.getText().then(function(txt)
        {
           expect(lblPropertyAddressValue.getText()).toBe(LenderIntegrationBNS.ReturnPropertyAddress(),"Address Under Mortgage Section on Home Page");
        }) 
    }

    this.VerifyFileNo = function () {
       CustomLib.WaitForElementPresent(lblFileNumberValue);
       var fileNumber = LawyerIntegrationBNS.ReturnLawyerMatterNo();
       CustomLib.WaitForContentToBePresent(lblFileNumberValue,fileNumber);
       expect(lblFileNumberValue.getText()).toBe(fileNumber, "File Number is not matching.");
    }

    this.VerifyMailRecSection = function () {

        CustomLib.scrollIntoView(lblMailRecep);
        expect(lblMailRecep.isDisplayed()).toBe(true);
        expect(lblMailRecep.getText()).toBe(EmailRecHeader);
        expect(MailRecepientSelectAll.getText()).toBe('Select All');
        expect(btnSelectAll.isDisplayed()).toBe(true);
        //btnSelectAll.click();
    }

    this.ExpandRecepientSection = function () {

        CustomLib.scrollIntoView(btnSeeMore)
        btnSeeMore.click();
        browser.waitForAngular();
        expect(btnSeeLess.isDisplayed()).toBe(true);

    }
    this.CollapseRecepientSection = function () {

        CustomLib.scrollIntoView(btnSeeLess)
        btnSeeLess.click();
        browser.waitForAngular();
        expect(btnSeeMore.isDisplayed()).toBe(true);

    }

    this.VerifyMailRecValidation = function () {
        CustomLib.WaitNClick(btnSelectAll);
        browser.sleep(500);
        var btnSelectAllChecked = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(0).element(by.tagName('big-checkbox')).element(by.css('.fas.fa-check.ng-star-inserted'));
        if (btnSelectAllChecked.isPresent()) {
            CustomLib.WaitNClick(btnSelectAll);
        }
        expect(btnSelectAllChecked.isPresent()).toBe(false);
        expect(btnSave.isDisplayed()).toBe(true);
        CustomLib.WaitNClick(btnSave);
        //btnSave.click();

        CustomLib.WaitforElementVisible(lblHome);
        CustomLib.scrollIntoView(lblHome);
        //Bug#228824 - Field identifier validation message is not showing (Active)
        expect(labReciValidationMsg1val.getText()).toBe(PortalValidationMsg);
        expect(labReciValidationMsg2val.getText()).toBe(ValidationMsg);

        CustomLib.scrollIntoView(lblMortgageInfo);
        CustomLib.WaitNClick(cbFirstMailRecipient);
        //Bug#227731: Active - After clicking save on homepage, unable to navigate to other pages (FIXED)								  
        CustomLib.WaitNClick(btnSave);
    }

    this.VerifyMailRecValidationBC = function () {
        CustomLib.WaitNClick(btnSelectAll);
        browser.sleep(500);
        var btnSelectAllChecked = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(0).element(by.tagName('big-checkbox')).element(by.css('.fas.fa-check.ng-star-inserted'));
        if (btnSelectAllChecked.isPresent()) {
            CustomLib.WaitNClick(btnSelectAll);
        }
        expect(btnSelectAllChecked.isPresent()).toBe(false);
        expect(btnSave.isDisplayed()).toBe(true);
        CustomLib.WaitNClick(btnSave);
        //btnSave.click();

        CustomLib.WaitforElementVisible(lblHome);
        CustomLib.scrollIntoView(lblHome);
        //Bug#228824 - Field identifier validation message is not showing (Active)
        expect(labReciValidationMsg1val.getText()).toBe(PortalValidationMsg);
        expect(labReciValidationMsg2val.getText()).toBe(ValidationMsg);

        CustomLib.scrollIntoView(lblMortgageInfo);
        CustomLib.WaitNClick(cbFirstMailRecipient);
        //Bug#227731: Active - After clicking save on homepage, unable to navigate to other pages (FIXED)								  
        CustomLib.WaitNClick(btnSave);
    }

    this.VerifyFooterButtons = function () {

        expect(btnSave.isDisplayed()).toBe(true);
        btnSave.click();

        CustomLib.WaitforElementVisible(lblHome);
        CustomLib.scrollIntoView(lblHome);

        expect(labReciValidationMsg1val.getText()).toBe(PortalValidationMsg);
        expect(labReciValidationMsg2val.getText()).toBe(ValidationMsg);

        CustomLib.scrollIntoView(lblMortgageInfo);
        CustomLib.WaitNClick(cbFirstMailRecipient);
        CustomLib.WaitNClick(btnSave);

    }
    this.VerifyEnabledButtons = function () {
        expect(btnSave.isEnabled()).toBe(true);
        expect(btnCancel.isEnabled()).toBe(true);
    }
    this.ClickHomePageButtons = function (btn) {

        switch (btn) {

            case 'Save':
                btnSave.click();
                break;
            case 'Cancel':
                btnCancel.click();
                break
                ;
        }
    }

    this.VerifySaveDataMsg = function (Msg) {

        var SavedMsg = element(by.css('.msg-container.ng-star-inserted'))
      
        CustomLib.scrollIntoView(SavedMsg);
        browser.sleep(1500);
        expect(SavedMsg.getText()).toContain(Msg, 'Amendment message is not present for saving data');
    }

    this.VerifySaveDataMsgN = function(Msg) {
        var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
        expect(StatusMsg.getText()).toContain(Msg,'Save data message is not present.');
    }
    
    this.VerifyMessage = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.WaitforElementVisible(SuccessMsg);
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(SavedMsg, 'Success Message is not present');
    }

    this.VerifyMessageNotPresent = function (SavedMsg) {

        var AmendmentMsg = element(by.css('.msg-container.ng-star-inserted'))
        //CustomLib.scrollIntoView(AmendmentMsg);
        browser.sleep(500);
        expect(AmendmentMsg.isPresent()).not.toBe(true, 'Pending Amendment message is present');
        browser.sleep(500);
    }

    this.NavigateAwayAcceptReject = function (buttonSelect) {

        if (buttonSelect == 'Cancel') {
            CustomLib.WaitNClick(navigateAwyStay);
        }
        if (buttonSelect == 'OK') {
            CustomLib.WaitNClick(navigateAwyLeave);
        }
    }

    this.NavigateAway = function () {

        cbFirstMailRecipient.click();
        CustomLib.scrollIntoView(btnReqForFunds);
        CustomLib.WaitNClick(btnReqForFunds);
        CustomLib.WaitforElementVisible(navigateAwyPopupMsg);
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        expect(navigateAwyPopupMsg.getText()).toBe(NavigateAwyPopupMsg);
        CustomLib.WaitForSpinnerInvisible();
        this.NavigateAwayAcceptReject('Cancel');
        CustomLib.scrollIntoView(lblMailRecep);
        var cbStatusFirstMailRecipient = element(by.tagName('app-email-notifications')).all(by.css('.form-row')).get(1).all(by.tagName('big-checkbox')).get(0).element(by.css('.fas.fa-check.ng-star-inserted'));
        expect(cbStatusFirstMailRecipient.isPresent()).toBe(false);

        browser.sleep(2000);
        CustomLib.scrollIntoView(btnReqForFunds);
        CustomLib.WaitNClick(btnReqForFunds);
        CustomLib.WaitforElementVisible(navigateAwyPopupMsg);
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        CustomLib.WaitForSpinnerInvisible();
        this.NavigateAwayAcceptReject('OK');
        CustomLib.WaitforElementVisible(lblRFF);
        CustomLib.scrollIntoView(lblRFF);
        expect(lblRFF.getText()).not.toBe('Home');
        expect(lblRFF.getText()).toBe('Request for Funds');
        browser.sleep(1300);
    }

    this.VerifyFooter = function () {
        var lnkLegalFooter = element(by.tagName('app-footer')).all(by.tagName('a')).get(0);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(lnkLegalFooter), 45000,  'Element is not visible').then(() => {
            expect(lnkLegalFooter.getText()).toBe('Legal');
            expect(element(by.linkText('Privacy Policy')).getText()).toBe('Privacy Policy');
            expect( element(by.css('.copyright-black')).getText()).toBe('® Registered trademark of First American Financial Corporation');
            }, (error) => {
                   expect(true).toBe(false, "Page is not visible.");
        }) 
    }


    this.VerifyLenderChanges = function (City, Province) {
        CustomLib.WaitforElementVisible(lblPropertyAddressValue);
    
        if (City) {
            CustomLib.WaitForContentToBePresent(lblPropertyAddressValue,City);
            expect(lblPropertyAddressValue.getText()).toContain(City);
        }

        if (Province) {
            CustomLib.WaitForContentToBePresent(lblPropertyAddressValue,Province);
            expect(lblPropertyAddressValue.getText()).toContain(Province);     
        }
    }

    this.VerifyHeader = function () {
        expect(lblHome.isDisplayed()).toBe(true);
        expect(lblHome.getText()).toBe('Home');
        expect(lnkNeedHelp.isDisplayed()).toBe(true);
    }

    this.ClickNeedHelp = function () {
        CustomLib.scrollIntoView(lnkNeedHelp);
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.elementToBeClickable(lnkNeedHelp), 45000, lnkNeedHelp + ' is not found').then(() => {
            browser.sleep(2000);
            lnkNeedHelp.click();
        });
    }

    this.VerifyDealAcceptedCheckMark = function (DealType) {
       // if (DealType == 'LLC') {
            CustomLib.WaitforElementVisible(LLCDealAcceptedCheckImg);
            CustomLib.WaitForElementPresent(LLCDealAcceptedCheckImg);
            expect(LLCDealAcceptedCheckImg.getAttribute('src')).toContain('accepted.png');
            LLCDealAcceptedCheck.getAttribute('title').then(function (timeStamp) {
                expect(timeStamp).not.toBe(null,"Timestamp for milestone.");
                browser.actions().mouseMove(LLCDealAcceptedCheckA).perform();

           })
        /* }
        else {
            MMSDealAcceptedCheck.getAttribute('alt').then(function (alt) {
                expect(alt).toBe('Completed',"Status for Milestone.");
            })
        }*/
    }

    this.VerifyRFFCompleted = function (DealType) {
        if (DealType == 'LLC') {
            LLCRFFCheckMark.getAttribute('title').then(function (timeStamp) {
                console.log(timeStamp);
                expect(timeStamp).not.toBe(null);
                browser.actions().mouseMove(LLCRFFCheckMark).perform();
            })
        }
        else {
            //expect(MMSDealRFFCheckMark.isPresent()).toBe(true);
            //MMSDealRFFCheckMark.getAttribute('title').then(function (timeStamp) {
            //    expect(timeStamp).not.toBe(null);
            //    //expect(timeStamp).toContain(':')
            //    browser.actions().mouseMove(MMSDealRFFCheckMark).perform();
            //    console.log(timeStamp);
            //})
        }
    }

    this.VerifyLLCFinalReportCompleted = function (DealType) {
        if (DealType == 'LLC') {

            //  expect(LLCDealAcceptedCheckA.isPresent()).toBe(true);
            // expect(LLCDealAcceptedCheck.getAttribute('title')).toBe('ACCEPTED');
            LLCFinalReportMark.getAttribute('title').then(function (timeStamp) {
                // browser.pause();
                console.log(timeStamp);
                expect(timeStamp).not.toBe(null,"Timestamp for milestone.");
                browser.actions().mouseMove(LLCFinalReportMark).perform();
            })
        }
        else {
            //expect(MMSFinalReportMark.isPresent()).toBe(true);
            //MMSFinalReportMark.getAttribute('title').then(function (timeStamp) {
            //    expect(timeStamp).not.toBe(null);
            //    //expect(timeStamp).toContain(':')
            //    browser.actions().mouseMove(MMSFinalReportMark).perform();
            //    console.log(timeStamp);
            // })
        }
    }

    this.VerifyRFFCheckMark = function () {
        var item = protractor.promise.defer();
        browser.wait(function () {
            return LLCRFFCheckMark.getAttribute('title').then(function (value) {
                var result = value !== '';
                if (result) {
                    item.fulfill(value);
                }
                return result;
            });
        });
        return item.promise;
    }

    this.VerifyLLCRffNotStarted = function () {
        //var LLCRFFImg = element(by.xpath('//app-deal-milestones//p[contains(text(),\'Request for Funds\')]//ancestor::div[1]/a/img'));
        //expect(LLCRFFImg.getAttribute('alt')).toBe('Not Started', "RFF Milestone");
         var LLCRFFImg = element(by.xpath('//app-deal-milestones//p[contains(text(),\'Request for Funds\')]//ancestor::div[1]'));
        expect(LLCRFFImg.getAttribute('title')).toBe('Not Started', "RFF Milestone");
    }

    this.VerifyMMSRffCheckMark = function () {
        MMSDealRFFCheck.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify MMS Rff CheckMark:", alt);
        });
    }

    this.VerifyMMSRffInprogress = function () {
        MMSDealRFFCheck.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('In Progress');
            console.log("Verify MMS Rff In Progrss:", alt);
        });
    }

    this.VerifyMMSBrokerConditionMet = function () {
        BrokerConditionMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify MMS Broker Condition Met:", alt);
        });
    }


    this.VerifyMMSSolicitorConditionMet = function () {
        SolicitorConditionMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify MMS Solicitor Condition Met:", alt);
        });
    }
    this.VerifyMMSLenderAuthorisation = function () {
        LenderAutorisationFundMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify Lender Authorisation:", alt);
        });
    }
    this.waitforDealFundedCheck = function () {
        counter = 0;
        checkDealFunded();

    }

    var checkDealFunded = function () {
        DealFundedMet.getAttribute('alt').then(function (alt) {
            MenuPanel.PrimaryMenuNavigateTo('Home');
            if (alt == 'Completed' || counter > 50) {
                if (counter > 50) {
                    console.log("Deal Funded milestone status failed")
                }
                return true;
            }
            else {
                counter++;
                console.log("Attempt Deal Funded Status : " + counter);
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.sleep(2000);
                checkDealFunded();
            }
        });
    }

    this.getDealFundedStatus = function () {
        MenuPanel.PrimaryMenuNavigateTo('Home');
        return DealFundedMet.getAttribute('alt').then(function (alt) {
            if (alt == 'Completed') {
                return true;
            }
            else {
                return false;
            }

        })
    };

    this.VerifyMMSFinalReportMet = function () {
        FinalReportMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify MMS Final Report Met:", alt);
        });

    }  

    this.getFinalReportStatus = function () {
        MenuPanel.PrimaryMenuNavigateTo('Home');
        return FinalReportMet.getAttribute('alt').then(function (alt) {
            console.log("##################### " + alt)
            if (alt == 'Completed') {
                return true;
            }
            else {
                return false;
            }

        })
    };
    this.VerifyMMSDealFunded = function () {
        DealFundedMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Completed');
            console.log("Verify Deal Funded:", alt);
        });
    }

    this.VerifyLLCFinalReportCheckMark = function () {
        var item = protractor.promise.defer();

        browser.wait(function () {
            return LLCFinalReportMark.getAttribute('title').then(function (value) {
                var result = value !== '';
                if (result) {
                    item.fulfill(value);
                }
                return result;
            });
        });
        return item.promise;
    }

    this.VerifyLLCFinalReportNotStarted = function () {
        FinalReportMet.getAttribute('alt').then(function (alt) {
            expect(alt).toBe('Not Started')
            console.log("Final Report:", alt);
        });
    }

    this.VerifyLLCFinalReportInProgress = function () {
        expect(LLCFinalReportMark.getAttribute('title')).toBe('In Progress')
    }

    this.VerifyCheckMarkCheckMark = function () {
        expect(CheckMark.isPresent()).toBe(true);
        expect(CheckMark.getAttribute('alt')).toBe('FINAL');
        CheckMark.getAttribute('title').then(function (timeStamp) {
            expect(timeStamp).not.toBe(null);
            expect(timeStamp).toContain(':')
            browser.actions().mouseMove(CheckMark).perform();
            console.log(timeStamp);
        })

    }

    this.VerifyBrokerConditionMetCheckMark = function () {
        expect(BrokerConditionMet.isPresent()).toBe(true);
        BrokerConditionMet.getAttribute('title').then(function (timeStamp) {
            expect(timeStamp).not.toBe(null);
            expect(timeStamp).toContain(':')
            browser.actions().mouseMove(BrokerConditionMet).perform();
            console.log(timeStamp);
        })

    }

    this.VerifyReadOnlyMortgageDetail = function () {

        expect(lblLenderNameValue.isPresent()).toBe(true)
        expect(lblLenderRefNoValue.isPresent()).toBe(true)
        expect(lblClosingDateValue.isPresent()).toBe(true)
        expect(lblOwnerNameValue.isPresent()).toBe(true)
        expect(lblPropertyAddressValue.isPresent()).toBe(true)
        expect(lblFileNumberValue.isPresent()).toBe(true)

        lblLenderNameValue.getText().then(function (val) { console.log(val); })
        lblLenderRefNoValue.getText().then(function (val) { console.log(val); })
        lblClosingDateValue.getText().then(function (val) { console.log(val); })
        lblOwnerNameValue.getText().then(function (val) { console.log(val); })
        lblPropertyAddressValue.getText().then(function (val) { console.log(val); })
        lblFileNumberValue.getText().then(function (val) { console.log(val); })

    }

    this.VerifyRFFNotStarted = function () {

        // expect(MMSReqForFundCheckMark.getAttribute('alt')).toBe('Not Started');
        CustomLib.WaitforElementVisible(MMSDealRFFCheck);
        MMSDealRFFCheck.getAttribute('alt').then(function (val) {
            expect(val).toBe('Not Started')

            console.log("Rff status:", val);

        })
    }

    this.VerifyBrokerConditionNotSatisfiedNotStarted = function () {
        CustomLib.WaitforElementVisible(BrokerConditionMet);
        BrokerConditionMet.getAttribute('alt').then(function (val) {
            expect(val).toBe('Not Started')
            console.log("Broker Condition:", val);
        })

    }

    this.VerifySolictorConditionNotSatisfiedNotStarted = function () {
        CustomLib.WaitforElementVisible(SolicitorConditionMet);
        SolicitorConditionMet.getAttribute('alt').then(function (val) {
            expect(val).toBe('Not Started')
            console.log("Solicitor Condition:", val);
        })

    }

    this.VerifyLenderAuthurizationtoFundNotStarted = function () {
        CustomLib.WaitforElementVisible(LenderAutorisationFundMet);
        LenderAutorisationFundMet.getAttribute('alt').then(function (val) {
            expect(val).toBe('Not Started')
            console.log("Lender Authorisation:", val);
        })
    }

    this.VerifyDealFundedNotstarted = function () {
        CustomLib.WaitforElementVisible(DealFundedMet);
        DealFundedMet.getAttribute('alt').then(function (val) {
            expect(val).toBe('Not Started');
            console.log("Deal Funded:", val);
        })
    }

    this.VerifySolicitorConditionMetCheckMark = function () {

        MMSSolicitorConditionsChecked.getAttribute('title').then(function (val) {
            // console.log("value is :", val);        
            expect(val).not.toBe(null);

        })

    }

    this.VerifyFinalReportNotStarted = function () {
        // var LLCFinalReportImg = element(by.xpath('//app-deal-milestones//p[contains(text(),\'Final Report\')]//ancestor::div[1]/a/img'));
        // expect(LLCFinalReportImg.getAttribute('alt')).toBe('Not Started', "Final Report Milestone");
        var LLCFinalReportImg = element(by.xpath('//app-deal-milestones//p[contains(text(),\'Final Report\')]//ancestor::div[1]'));
        expect(LLCFinalReportImg.getAttribute('title')).toBe('Not Started', "Final Report Milestone");
    }

    this.selectAllEmail = function () {
        btnSelectAll.click();
    }

    this.UnsSelectAllEmail = function () {

        // CustomLib.scrollIntoView(btnSelectAll);
        // btnSelectAll.isSelected().then(function (bool) {
        //     if (bool) { btnSelectAll.click(); btnSelectAll.click();}
        //    else {btnSelectAll.click(); }
        // })

    }

    this.selectEmailRecepient = function (i) {
        //col-md-4 col-checkbox

        var cb = (element(by.tagName('app-email-notifications')).element(by.css('.jumbotron.box-inner')).all(by.tagName('big-checkbox')).get(1 + i)).element(by.tagName('a'));
        cb.click();
        //var cb = SecEmailRecipient.element(by.css('.col-md-4.col-checkbox'));
        //CustomLib.scrollIntoView(btnSave);
        //CustomLib.scrollIntoView(cb);

    }

    this.CheckUncheckEmail = function (Type, i) {

        var cb = element(by.tagName('app-email-notifications')).all(by.tagName('big-checkbox')).get(i).element(by.css('.check-box'));
        if (Type == 'Check') {
            if (element(by.tagName('app-email-notifications')).all(by.tagName('big-checkbox')).get(i).getAttribute('ng-reflect-checked') == 'false') {
                CustomLib.WaitNClick(cb);
            }
        }
        if (Type == 'UnCheck') {
            if (element(by.tagName('app-email-notifications')).all(by.tagName('big-checkbox')).get(i).getAttribute('ng-reflect-checked') == 'true') {
                CustomLib.WaitNClick(cb);
            }
        }
    }

    this.LoginOperationsPortal = function () {
        browser.get(OperationsPortalUrl);
    }

    this.VerifyCancellationRequestMsg = function () {

        expect(CancellationRequestMsg.getText()).toContain('Your deal is in cancellation requested status and as a result no further actions can be performed at this time');
        console.log("Cancellation Request", CancellationRequestMsg);
    }

    this.VerifyMilestoneLabel = function () {
        var lblMileStoneDealAccepted = element.all(by.css('.milestones-col.ng-star-inserted')).get(0).element(by.tagName('p'));

        var lblMileStoneRFF = element.all(by.css('.milestones-col.ng-star-inserted')).get(1).element(by.tagName('p'));
        var lblMileStoneBkrCon = element.all(by.css('.milestones-col.ng-star-inserted')).get(2).element(by.tagName('p'));
        var lblMileStoneSolicitorCond = element.all(by.css('.milestones-col.ng-star-inserted')).get(3).element(by.tagName('p'));
        var lblMileStoneLATF = element.all(by.css('.milestones-col.ng-star-inserted')).get(4).element(by.tagName('p'));
        var lblMileStoneDealFunded = element.all(by.css('.milestones-col.ng-star-inserted')).get(5).element(by.tagName('p'));
        var lblMileStoneFinalReport = element.all(by.css('.milestones-col.ng-star-inserted')).get(6).element(by.tagName('p'));
        CustomLib.WaitforElementVisible(lblMileStoneDealAccepted);
        CustomLib.WaitforElementVisible(lblMileStoneRFF);
        CustomLib.WaitforElementVisible(lblMileStoneBkrCon);
        CustomLib.WaitforElementVisible(lblMileStoneSolicitorCond);
        CustomLib.WaitforElementVisible(lblMileStoneLATF);
        CustomLib.WaitforElementVisible(lblMileStoneDealFunded);
        CustomLib.WaitforElementVisible(lblMileStoneFinalReport);
        expect(lblMileStoneDealAccepted.getText()).toContain('Deal Accepted');
        expect(lblMileStoneRFF.getText()).toContain('Request for Funds');
        expect(lblMileStoneBkrCon.getText()).toContain('Broker Conditions');
        expect(lblMileStoneSolicitorCond.getText()).toContain('Solicitor Conditions');
        expect(lblMileStoneLATF.getText()).toContain('Lender Authorization to Fund');
        expect(lblMileStoneDealFunded.getText()).toContain('Deal Funded');
        expect(lblMileStoneFinalReport.getText()).toContain('Final Report');
    }


    this.VerifyLenderRefNoData = function (inputLenderRefNo) {
        expect(lblLenderRefNoValue.getText()).toContain(inputLenderRefNo);
        lblLenderRefNoValue.getText().then(function (text) {
            console.log("Lender Ref No " + text);
        })

    }
    this.ClickOnNeedHelp = function () { }
    this.emailDateConversion = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        if (Number(dateClosingDate[1]) < 10) {
            dateClosingDate[1] = dateClosingDate[1].substring(1, dateClosingDate[1].length);

        }
        return month[(dateClosingDate[0] - 1)] + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    // Comparison (different date format in MMS and LLC Unity)
    this.DateConversion = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        return month[(dateClosingDate[0] - 1)] + "" + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.VerifyClosingdateData = function (closingDate) {
        expect(element(by.cssContainingText('div', closingDate)).isPresent()).toBe(true);
        var lblClosingDateValue = element(by.xpath('//*[@id="MainDiv"]/div/div[1]/div[3]/div[2]'))
        lblClosingDateValue.getText().then(function (text) {
            expect(text).toContain(closingDate, "Closing Date on Home Page");
            console.log("Closing Date " + text);
        })
    }
    this.DateConversionwithzeroappended = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        if (dateClosingDate[1].length == 1) { dateClosingDate[1] = "0" + dateClosingDate[1] }
        return month[(dateClosingDate[0] - 1)] + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.DateConversionwithzeroTrimmed = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        if (Number(dateClosingDate[1]) < 10) {
            dateClosingDate[1] = dateClosingDate[1].substring(1, dateClosingDate[1].length);

        }
        return month[(dateClosingDate[0] - 1)] + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.DateConversionMonthShortFormat = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        return month[(dateClosingDate[0] - 1)].substring(0, 3) + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.DateConversionMonthShortFormatWithZeroAppended = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        if (Number(dateClosingDate[1]) < 10) { dateClosingDate[1] = "0" + dateClosingDate[1] }
        return month[(dateClosingDate[0] - 1)].substring(0, 3) + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.DateConversionMonthShortFormatWithZeroDayTrimmed = function (inputclosingdate) {
        var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        if (Number(dateClosingDate[1]) < 10) {
            dateClosingDate[1] = dateClosingDate[1].substring(1, dateClosingDate[1].length);

        }
        return month[(dateClosingDate[0] - 1)].substring(0, 3) + " " + dateClosingDate[1] + ", " + dateClosingDate[2];
    }

    this.DateConversionWithHyphen = function (inputclosingdate) {
        //var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dateClosingDate = inputclosingdate.split("/");
        return (dateClosingDate[2] + "-" + dateClosingDate[0] + "-" + dateClosingDate[1]);
    }
    this.VerifyClosingdateData = function (inputclosingdate) {

        expect(inputclosingdate).toContain(lblClosingDateValue.getText());
        lblClosingDateValue.getText().then(function (text) {
            console.log("Closing Date " + text);
        })
    }

    this.VerifyMortgagorName = function (inputclientname) {
        CustomLib.WaitForContentToBePresent(lblOwnerNameValue,inputclientname); 
        lblOwnerNameValue.getText().then(function (text) {
            console.log("Mortgagor " + text);
            expect(text).toContain(inputclientname, "Mortgagor Name");
        })
    }

    this.VerifyMessage = function (SavedMsg) {

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(500);
        expect(SuccessMsg.getText()).toContain(SavedMsg);
    }

    this.VerifyPropertyAddressdata = function (PropertyData) {
        var lbpropAddress = lblPropertyAddressValue.getText().then(function (text) { return text.replace(/\s+/g, ''); })
        var PropertyDataval = PropertyData.then(function (text) { console.log("Property Address " + text); return text.replace(/\s+/g, ''); });
        expect(lbpropAddress).toContain(PropertyDataval);
    }

    this.VerifyFileNoData = function () {
        expect(lblFileNumberValue.getText()).toContain();
    }

    this.VerifySaveonNoEmailRecipient = function () {
        CustomLib.scrollIntoView(btnSelectAll);
        btnSelectAll.click();
        btnSave.click();
        browser.sleep(2000);
        expect(labReciValidationMsg1val.getText()).toBe(PortalValidationMsg);

        expect(labReciValidationMsg2val.getText()).toBe(ValidationMsg);

    }

    this.VerifySuccessMsg = function () {
        btnSave.click();
        browser.sleep(3000);
        var msg = element(by.css('.messages.ng-star-inserted'))
        expect(msg.isDisplayed()).toBe(true);
        CustomLib.scrollIntoView(msg);
        msg.getText().then(function (txt) {
            expect(txt).toContain('Your changes have been saved successfully');
        })

    }
    this.AnswerPropertyQuestions = function (lawfirm, lawfirstname, lawlastname) {
        chkbxPropQ1.click();
        chkbxPropQ2.click();
        chkbxPropQ3.click();
        chkbxPropQ4.click();
        chkbxPropQ5.click();
        chkbxPropQ6.click();
        chkbxPropQ7.click();
        chkbxPropQ8.click();
        chkbxPropQ9.click();
        chkbxPropQ10.click();
        chkbxPropQ11.click();
        txtLawfirm.sendKeys(lawfirm);
        txtLyrFirstName.sendKeys(lawfirstname);
        txtLyrLastName.sendKeys(lawlastname);
        chkbxPropQ12.click();
        chkbxPropQ13.click();
        //browser.sleep(10000);
    }
    this.ClickOKRffSubmit = function () {
        // btnOkRffSubmit.click();
        CustomLib.WaitforElementVisible(btnOkRffSubmit);
        btnOkRffSubmit.click();
        // CustomLib.WaitNClick(btnOkRffSubmit);
    }

    this.ClickFreQuentlyAsked = function () {
        lnkFrequentlyAsked.click();
    }

    //Amendments
    this.ValidateAmendmentAlert = function (msg) {
        expect(txtMsgAmendmentLginAlert.getText()).toBe(msg);
    }

    this.VerifyEmailCheckAmendment = function () {
        CustomLib.scrollIntoView(btnSelectAll);
        btnSelectAll.click();
        btnSelectAll.click();
        btnSave.click();
        browser.sleep(4000);
        // expect(labReciValidationMsg1val.getText()).toBe('Required field(s) to be completed below');

        // expect(labReciValidationMsg2val.getText()).toBe('Required field(s) to be completed in Unity');

    }

    //Amendments
    this.AmendmentValidationMessage = function (msg) {
        expect(lblAmendmentValidation.getText()).toBe(msg);
    }

    this.ClickonViewDocument = function () {
        var btnView = element(by.cssContainingText('View'));
        btnView.click();
    }



    this.ClicklnkSubmittoLender = function () {

        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(btnOkRffSubmit), 5000);
        btnOkRffSubmit.click();

    }
    //Amendments
    this.SelectUnselectEmail = function () {
        btnSelectAll.click();
        btnSelectAll.click();

        btnSave.click();
    }

    //Manage Documents  

    this.clickLenDocView = function (DocSearch, DocUploadDate) {
        var rows = tabBodyLenDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName == DocSearch) {
                    cols.get(1).getText().then(function (datetxt) {
                        var dateSplit = datetxt.split(",");
                        datetxt = dateSplit[0] + "," + dateSplit[1];
                        expect(datetxt).toEqual(DocUploadDate,"Document Date");
                    });
                    cols.get(2).element(by.css('.btn.btn-link.tableLink.p-0')).click();
                }
            });
        });
    }

       this.clickLawyerDocView = function (DocSearch) {
        browser.sleep(5000);
        var found = "false";
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == DocSearch) {
                    found = "true";
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Submitted");
                    });

                    cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(0).click();
                }
            });
        }).then(function () {
            expect(found).toEqual("true","Document is present under Lawyer Documents");
        });
    }


    this.checkTimeStamp = function (DocSearch) {
        browser.sleep(1000);
        var TimeStamp;
        var found = "false";
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == DocSearch) {
                    found = "true";
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Submitted");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                         TimeStamp = Dateval;
                    
                        
                    });
                }
            });
        }).then(function () {
            console.log("TimeStamp = " + TimeStamp);
            return TimeStamp;
        });
    }

    this.clickLawyerUploadDoc = function () {
        element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        browser.sleep(5000);
        CustomLib.WaitForSpinner();
        CustomLib.WaitForSpinnerInvisible();
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        return rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            
            if (rowindex == 0) {
                cols.get(0).getText().then(function (Name) {
                    documentName = Name;

                });
                cols.get(1).getText().then(function (Status) {

                    expect(Status).toEqual("Uploaded");

                })
                cols.get(2).getText().then(function (Dateval) {
                    expect(Dateval).not.toBeNull();
                });

                cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(0).click();
                CustomLib.WaitForSpinner();
                CustomLib.WaitForSpinnerInvisible();
            }
            
        }).then(function () {

            return documentName;
        });
        // var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        // console.log("here U are :" + rows);
        // rows.each(function (row, rowindex) {

        //     var cols = row.all(by.tagName('td'));
        //         if (rowindex==0){
        //             console.log("here rows are :" + rowindex);
        //             cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(1).click();
        //             element(by.css('input[type="file"]')).sendKeys(DocumentPath);
        //            // cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(1).sendKeys(DocumentPath);



        //         }
        // });
    }

    this.VerifyClosedDealMsg = function (Msg) {

        //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
        var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));
    
        CustomLib.scrollIntoView(ClosedMsg);
        expect(ClosedMsg.getText()).toContain(Msg);
    }


    this.VerifyLendersOnlineReporsitoryLink = function (LenderName) {
        var lnkLendersOnline = element(by.css('.btn-link.fct'));
        if (LenderName == "B2B Bank") {
            //expect(lnkLendersOnline).isDisplayed().toBe('false');
            expect(lnkLendersOnline.isPresent()).toBe(false, "Lender Name on Home Page Matches");
            // expect(foo.isDisplayed()).toBe(false);
        }
        // else 
        // expect(lnkLendersOnline.isPresent()).toBe(true);

    }


    this.clickLawyerDocCreateImplictSave = function () {
        browser.sleep(2000);
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            // console.log(rowindex);
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                //console.log(DocName);
                if (DocName.trim() == "Identification Verification Form" || DocName.trim() == "Undertaking" || DocName.trim() == "Statutory Declaration") {
                    console.log(DocName);
                    expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(2).isEnabled()).toBe(true);
                }

            });
        });

        rows.each(function (row, rowindex) {
            // console.log(rowindex);
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                //console.log(text1);
                browser.sleep(10000);
                if (DocName.trim() == "Identification Verification Form") {
                    CustomLib.WaitforElementVisible(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(2));

                    cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(2).click();

                    browser.sleep(3000);

                    browser.waitForAngular();
                  //  browser.sleep(10000);//Sept 13
                    CustomLib.SwitchTab(1);
                   

                    CustomLib.WaitForSpinnerInvisible();

                    browser.waitForAngular();
                    CustomLib.CloseTab();
                    cols.get(1).getText().then(function (Status) {

                        expect(Status).toEqual('');

                    })
                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).toEqual('');
                    });

                    cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(2).click();
                    
                    // CustomLib.WaitForSpinnerInvisible();
                    CustomLib.WaitForSpinnerInvisible();
                    browser.waitForAngular();
                    CustomLib.SwitchTab(1);
                    browser.sleep(2000);//to be removed
                    var btnSaveDoc = element(by.id('mainDiv')).element(by.tagName('input'))
                    CustomLib.WaitforElementVisible(btnSaveDoc);
                    btnSaveDoc.click();
                    CustomLib.WaitForSpinnerInvisible();
                    CustomLib.SwitchTab(0);
                    browser.sleep(15000);
                    CustomLib.CloseTab();
                    CustomLib.SwitchTab(0);
                    CustomLib.WaitForSpinnerInvisible();
                    //browser.sleep(1000);
                    //browser.driver.navigate().refresh();
                    browser.sleep(2000);
                    //closing the doc




                }

            });
        });
    }

    this.VerifyLawyerDocCreateImplictSave = function () {
        browser.sleep(2000);
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            // console.log(rowindex);
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                //console.log(DocName);
                if (DocName.trim() == "Identification Verification Form") {
                    // console.log(DocName);
                    browser.sleep(3000);
                    cols.get(1).getText().then(function (Status) {

                        expect(Status).toEqual("Created");

                    });

                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).not.toEqual('');
                    });
                    expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(4).isEnabled()).toBe(true);
                }

            });
        });
    }


    this.VerifyLawyerDocRegenerated = function (ExistingDatevalue) {
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == "Identification Verification Form") {
                    cols.get(1).getText().then(function (Status) {
                        expect(Status).toEqual("Created", "Verify failed from VerifyLawyerDocRegenerated on Status");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).not.toEqual('', "Verify failed in VerifyLawyerDocRegenerated because Date Value is null");  
                    });  
                }
            });
        });
    }

    this.LawyerDocRegenerate = function () {    
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        var ExistingDatevalue
        return rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocName) {
                if (DocName.trim() == "Identification Verification Form") {
                    browser.sleep(3000);
                    cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(4).click();
                    cols.get(2).getText().then(function (Dateval) {
                        ExistingDatevalue = Dateval;
                    });
                    var EC = protractor.ExpectedConditions;
                    browser.wait(EC.visibilityOf(btnOkRffSubmit), 5000);
                    btnOkRffSubmit.click(); 
                    CustomLib.WaitForSpinnerInvisible();
                    CustomLib.SwitchTab(1);
                    CustomLib.WaitForSpinnerInvisible();
                    browser.waitForAngular();
                    var btnSaveDoc = element(by.id('mainDiv')).element(by.tagName('input'))
                    CustomLib.WaitNClick(btnSaveDoc);
                    CustomLib.SwitchTab(0);
                    browser.sleep(15000);
                    CustomLib.WaitForSpinnerInvisible();
                    CustomLib.CloseTab();
                    CustomLib.SwitchTab(0);
                }

            });
        }).then(function () {
            console.log("Existing Date Value" + ExistingDatevalue);
            return ExistingDatevalue;
        })
    }

    this.VerifyLawyerDocAfterCancel = function () {
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        console.log("here U are :" + rows);
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(0).isEnabled()).toBe(false,"Stats for Document under Lawyer Document section.");
            expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(1).isEnabled()).toBe(false,"Stats for Document under Lawyer Document section.");
            expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(2).isEnabled()).toBe(false,"Stats for Document under Lawyer Document section.");
            expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(3).isEnabled()).toBe(false,"Stats for Document under Lawyer Document section.");
            expect(cols.get(3).all(by.css('.btn.btn-link.tableLink.p-0')).get(4).isEnabled()).toBe(false,"Stats for Document under Lawyer Document section.");

        });
    }

    this.ClickDocument = function() {
        var docLink = element(by.css('.btn-link.fct'));
        docLink.click();
        browser.sleep(1500);
        CustomLib.CloseTab();
    }

    this.VerifyAdditionalDocs = function (DocName) {

        element(by.css("input[formControlName=documentName]")).sendKeys(DocName);
        element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        browser.sleep(1000);
        element(by.id("btnUpload")).click();
        var found = "false";
        browser.sleep(5000);

        var SuccessMsg = element(by.css('.msg-container.ng-star-inserted'))
        CustomLib.scrollIntoView(SuccessMsg);
        browser.sleep(1000);
        expect(SuccessMsg.getText()).toContain("Other-" + DocName + " was uploaded successfully.");
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));
        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));
            cols.get(0).getText().then(function (DocupdName) {
                if (DocupdName.trim() == "Other-" + DocName.trim()) {
                    console.log(DocupdName);
                    found = "true";
                    cols.get(1).getText().then(function (Status) {

                        expect(Status).toEqual("Uploaded","Status of Document");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).not.toEqual('');
                    });
                }
            });


        }).then(function () {
            expect(found).toEqual("true");
        });
        browser.sleep(1000);
    };

    this.EnterDocumentName = function (DocName) {
        var documentName = element(by.css("input[formControlName=documentName]"));
        documentName.sendKeys(DocName);
        expect(documentName.isEnabled()).toBe(true, 'Document name field is disabled');
        
    };

    this.VerifyAdditionalDocswithSameName = function (DocName) {

        element(by.css("input[formControlName=documentName]")).sendKeys(DocName);
        element(by.css("input[formControlName=uploadFile]")).sendKeys(DocumentPath);
        //browser.sleep(1000);
        var found = "false";
        var count = 0;
        element(by.id("btnUpload")).click();
        CustomLib.WaitNClick(btnOkRffSubmit);
        browser.sleep(5000);
        var rows = tabBodyLawyerDocs.all(by.tagName('tr'));

        rows.each(function (row, rowindex) {
            var cols = row.all(by.tagName('td'));

            cols.get(0).getText().then(function (DocupdName) {

                if (DocupdName.trim() == "Other-" + DocName.trim()) {
                    console.log(DocupdName);
                    found = "true";
                    count++;
                    cols.get(1).getText().then(function (Status) {

                        expect(Status).toEqual("Uploaded");

                    });
                    cols.get(2).getText().then(function (Dateval) {
                        expect(Dateval).not.toEqual('');
                    });

                }
            })
        }).then(function () {
            expect(found).toEqual("true");
            expect(count).toEqual(1);
        });

    }

    this.VerifyNavigateAwayMsg=function(){
        expect(navigateAwyPopup.isDisplayed()).toBe(true);
        expect(navigateAwyPopupMsg.getText()).toBe(NavigateAwyPopupMsg);
    }

    this.VerifyNoNavigateAwayMsg=function(){
        //expect(navigateAwyPopup.isDisplayed()).toBe(false, 'Navigate away alert appears');
        expect(navigateAwyStay.isPresent()).toBe(false, 'Stay on this page button is present!')
    }
};

module.exports = new HomePage();