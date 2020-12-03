'use strict';
var TestData = require('../../testData/TestData.js');
var Runsettings = require('../../testData/RunSetting.js');
var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var LenderIntegrationBNS = require('./Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationBNS = require('./Services/LawyerIntegration/LawyerIntegrationBNS.js');
var dateFormat = require('dateformat');

var RequestFunds = function () {
    var EC = protractor.ExpectedConditions;
    var Env = Runsettings.data.Global.ENVIRONMENT.value;
    var Lang = Runsettings.data.Global.LANG.value;
    var RFFSubmitMsg = TestData.data[Lang].Messages.RFFSubmitMsg;
    var RFFReSubmitMsg = TestData.data[Lang].Messages.RFFReSubmitMsg;
    var navigateAwyStay = element(by.id('btnCancel'));
    var navigateAwyLeave = element(by.id('btnOk'));
    var navigateAwyPopup = element(by.tagName('app-modal-dialog'));
    var navigateAwyPopupMsg = element(by.tagName('app-modal-dialog')).element(by.css('.modal-body'));
    var SucessMsg = element(by.css('.m-0'));
    var WarningMsg = element(by.css('.modal-content')).all(by.css('.col')).all(by.css('.ng-star-inserted')).get(0);
    var PortalValidationMsg = TestData.data[Lang].Messages.PortalValidationMsg;
    var UnityValidationMsg = TestData.data[Lang].Messages[Env].UnityValidationMsg;
    var ValidationMsg = TestData.data[Lang].Messages[Env].ValidationMsg;
    var PartnerSystemValidationMsg = TestData.data[Lang].Messages.PartnerSystemValidationMsg;
    var Footer = TestData.data[Lang].Footer.Footer;
    var TrustAcc = Runsettings.data.Global.BNS[Env].TrustAcc;
    var AcknowledgeOption1 = TestData.data[Lang].RFF.AcknowledgeOption1;
    var AcknowledgeOption2 = TestData.data[Lang].RFF.AcknowledgeOption2;
    var until = protractor.ExpectedConditions;
    var lblRFF = element.all(by.css('.title')).first();
    var lnkNeedHelp = element(by.linkText('Need Help?'));
    var PortalFieldIdentifierTxt = element(by.tagName('app-required-messages')).all(by.tagName('span')).get(0);
    var UnityFieldIdentifierTxt = element(by.tagName('app-required-messages')).all(by.tagName('span')).get(2);
    var SecRFF = element(by.tagName('app-bns-rff'));
    var lblClosingDate = element.all(by.css('.control-label')).get(0);
    var lblTrustAccount = element.all(by.css('.control-label')).get(1);
    var lblAssessmentRollNo = element.all(by.css('.control-label')).get(2);
    var closingDateVal = SecRFF.all(by.css('.form-row')).get(0).all(by.css('.form-group.col-md-4')).get(0).element(by.tagName('div'));
    var trustAccountVal = SecRFF.all(by.css('.form-row')).get(0).all(by.css('.form-group.col-md-4')).get(1).element(by.tagName('div'));
    var AssessmentRollNoVal = SecRFF.all(by.css('.form-row')).get(0).all(by.css('.form-group.col-md-4')).get(2).element(by.tagName('div'));
    var lblComment = element(by.css('.font-weight-bold'));
    var lblCharCountComment = SecRFF.all(by.css('.form-row')).get(1).element(by.css('.float-right'));
    var tbComment = element(by.id('notificationComments'));
    var puRFFSubmit = element(by.css('.modal-content'));
    var puRFFSubmitMsg = element(by.css('.modal-content')).all(by.css('.ng-star-inserted')).first();
    var LLCRFFCheckMark = element(by.xpath("//app-deal-milestones//div[@class=\'milestones-col ng-star-inserted\']/p[contains(text(),\'Request for Funds\')]//ancestor::div[1]"));
    var LLCRFFCheckMarkImg = LLCRFFCheckMark.element(by.tagName('img'));
    var ddlFundingReqType = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));
    var TypeOfFundingRequest = element.all(by.css('.jumbotron.box-outer.ng-tns-c12-1.ng-star-inserted')).get(0);
    var PropertyTaxInformation = element.all(by.css('.jumbotron.box-outer.ng-tns-c12-1.ng-star-inserted')).get(1);
    var lblTDRFF = element(by.xpath('//deal-milestones/div/div/div/div/div[2]/a/img'))
    var lblRegistrationDate = TypeOfFundingRequest.all(by.css('.row.font-weight-bold')).get(0);
    var lblPin = PropertyTaxInformation.all(by.css('.row.font-weight-bold')).get(1);
    var lblTitle = element(by.xpath('//app-td-rff/form/div[2]/div/div[1]/div[1]/div[1]'));
    var btnSave = element(by.buttonText('Save'))
    var btnCancel = element(by.buttonText('Cancel'));
    var btnCreate = element(by.buttonText('Create'));
    var btnSubmit = element(by.buttonText('Submit'));
    var btnOKafterSubmit = element(by.buttonText('OK'));
    var tbAmount = element(by.name('amountRequested'))
    var cbotrustAccount = element(by.css("select[formControlName=trustAccount]"))
    var Env = Runsettings.data.Global.ENVIRONMENT.value;
    var trustAccount = Runsettings.data.Global.URL_LLCEmulator[Env].TrustAccount.value;
    var SecFooter = element(by.tagName('app-footer'));
    var lnkLegal = SecFooter.all(by.tagName('a')).get(0);
    var lnkPrivacy = SecFooter.all(by.tagName('a')).get(1);
    var txtFooter = SecFooter.element(by.tagName('span'));
    var lblSolicitorAcknlg = element.all(by.css('.control-label')).get(3);
    var txtAcknlgOpt1 = element.all(by.css('.form-check-label')).get(0);
    var txtAcknlgOpt2 = element.all(by.css('.form-check-label')).get(1);
    var btnAcknlgOpt1 = element(by.id('acknowledgeBoxA'));
    var btnAcknlgOpt2 = element(by.id('acknowledgeBoxB'));
    var lblHeaderIDV1st = element.all(by.css('.font-weight-bold')).get(0);
    var trustAccIcon = element.all(by.tagName('app-td-rff')).all(by.css('.input-group')).all(by.tagName('em'));
    var trustAccIconMMS = element.all(by.tagName('app-mms-rff')).all(by.css('.input-group')).all(by.tagName('em'));
    var WarningMsgIDV = element.all(by.tagName('app-bns-rff')).all(by.css('.ng-star-inserted')).all(by.tagName('p')).get(1);
    var lblIdType1st = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(0).element(by.tagName('label'));
    var IdType1stVal = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(0).element(by.tagName('div'));
    var lblIdNo1st = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(1).element(by.tagName('label'));
    var IdNo1stVal = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(1).element(by.tagName('div'));
    var lblJurisdiction1st = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(2).element(by.tagName('label'));
    var Jurisdiction1stVal = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(2).element(by.tagName('div'));
    var lblExprDate = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(3).element(by.tagName('label'));
    var ExprDateVal = element.all(by.css('.form-row')).get(2).all(by.css('.col-md-4')).get(3).element(by.tagName('div'));
    var lblCommentIDV = element(by.xpath("//label[@class='font-weight-bold']"));
    var lblCharCountCommentIDV = element(by.xpath("//label[@class='float-right']"));
    var ddlInstructionForDelivery = element(by.xpath('//select[@formcontrolname=\'fundDeliveryInstructions\']'))
    var ddlTrsutAccount = element(by.xpath("//select[@formcontrolname=\'trustAccount\']"))
    var DealHistoryMenu = element(by.id('history'));
    var TrustAccVal = element.all(by.css('.form-group.col-md-4')).get(0).element(by.tagName('div')); 
    var IDTypeVal = element.all(by.css('.form-group.col-md-4')).get(3).element(by.tagName('div'));
    var IDNoVal = element.all(by.css('.form-group.col-md-4')).get(4).element(by.tagName('div'));
    var IssuingJurisdicationVal = element.all(by.css('.form-group.col-md-4')).get(5).element(by.tagName('div'));
    var ExpiryDateVal = element.all(by.css('.form-group.col-md-4')).get(6).element(by.tagName('div'));
    var AssessmentRollNumber = [];
    var ArnVal;
    var Row1 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.content')).get(0);
    var Row2 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.ng-star-inserted')).get(0);
    var Row3 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.ng-star-inserted')).get(1);
    var Row4 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.ng-star-inserted')).get(2);
    var Row5 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.ng-star-inserted')).get(3);
    var Row6 = element.all(by.css('.jumbotron.box-inner')).get(1).all(by.css('.ng-star-inserted')).get(4);
    var lblMMSClosingDate = element.all(by.css('.control-label')).get(1);
    var lblMMSTrustAccount = element.all(by.css('.control-label')).get(2);
    var warningIcon = element.all(by.xpath("//span[@class=\'fas fa-exclamation-circle icon-fct text-danger mr-1\']"));
    
    
    
    
    this.ReturnAssessmentRollNo = function () {

     /*   for (var i = 0; i < 3; i++) {
            AssessmentRollNumber[i] = CustomLib.getRandomNumber(3);
            if (i == 0) {
                ArnVal = AssessmentRollNumber[i];
            }
            else {
                ArnVal = ArnVal + AssessmentRollNumber[i];
            }
        }*/
        AssessmentRollNumber[0] = CustomLib.getRandomNumber(9);
        ArnVal =   AssessmentRollNumber[0];
        return AssessmentRollNumber;
    }

    this.VerifyRFFPage = function () {
        var lblRFFPage = element(by.xpath('//section[@class=\'content-header\']/h1[@class=\'title\']'));
        browser.wait(EC.visibilityOf(lblRFFPage), 60000, 'Need Help Link is not available').then(() => {


            //expect(lblRFF.isDisplayed()).toBe(true);
            // expect(lblRFF.getText()).toBe('Request for Funds');
            expect(lblRFFPage.isDisplayed()).toBe(true);
        expect(lblRFFPage.getText()).toBe('Request for Funds');

        expect(lblClosingDate.isDisplayed()).toBe(true);
        expect(lblClosingDate.getText()).toContain('Closing Date');

        expect(lblTrustAccount.isDisplayed()).toBe(true);
        expect(lblTrustAccount.getText()).toBe('Trust Account');

        expect(lblAssessmentRollNo.isDisplayed()).toBe(true);
        expect(lblAssessmentRollNo.getText()).toContain('Assessment Roll Number');

        var date = LenderIntegrationBNS.ReturnClosingDate();

        //Bug#227397 Fixed for 'Closing Date' format on RFF page. It should be long date format as like Home page. [Fixed]
        var formattedDate = dateFormat(date, "UTC:mmmm dd, yyyy");
        expect(closingDateVal.getText()).toBe(formattedDate);

        expect(trustAccountVal.getText()).toBe(TrustAcc);

        expect(AssessmentRollNoVal.getText()).toBe(ArnVal);

        expect(lnkNeedHelp.isDisplayed()).toBe(true);

        expect(txtFooter.isDisplayed()).toBe(true);
        expect(txtFooter.getText()).toContain(Footer);

        expect(lnkLegal.isDisplayed()).toBe(true);
        expect(lnkLegal.getText()).toBe('Legal');

        expect(lnkPrivacy.isDisplayed()).toBe(true);
        expect(lnkPrivacy.getText()).toBe('Privacy Policy');

    }, (error) => {
        expect(false).toBe(true, "RFF Page is not loaded properly");
})


}

this.VerifyCancellationRequestMsg = function() {
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
    expect(StatusMsg.getText()).toContain(CancellationRequestMessage,'Cancellation deal message is not present.');
}

this.VerifyRFFPageIDV = function () {

    expect(lblSolicitorAcknlg.getText()).toBe('Solicitor Acknowledgements (please select one)');
    expect(btnAcknlgOpt1.isDisplayed()).toBe(true);
    expect(btnAcknlgOpt2.isDisplayed()).toBe(true);
    expect(txtAcknlgOpt1.getText()).toBe(AcknowledgeOption1);
    expect(txtAcknlgOpt2.getText()).toBe(AcknowledgeOption2);
    expect(lblHeaderIDV1st.getText()).toBe('Identification Verification: ' + LenderIntegrationBNS.ReturnMrtgagor());
    expect(lblIdType1st.getText()).toContain('ID Type');
    expect(lblIdNo1st.getText()).toContain('ID Number');
    expect(lblJurisdiction1st.getText()).toContain('Issuing Jurisdiction');
    expect(lblExprDate.getText()).toContain('Expiry Date');

 /* expect(IdType1stVal.getText()).toBe(LawyerIntegrationBNS.ReturnIDVIdentificationType1st());
    expect(IdNo1stVal.getText()).toBe(LawyerIntegrationBNS.ReturnIDVIdNo1st());
    expect(Jurisdiction1stVal.getText()).toBe(LawyerIntegrationBNS.ReturnIDVIssuingJurisdiction1st());
    var date = LawyerIntegrationBNS.ReturnIDVExpiryDate1st();
    var formattedDate = dateFormat(date, "UTC:d mmm yyyy");
    expect(ExprDateVal.getText()).toBe(formattedDate);*/
}

this.VerifyRFFPageIDVReadOnly = function () {

    CustomLib.ScrollDown(0,10000);
    expect(IDTypeVal.isPresent()).toBe(true,'ID Type1 field is blank!');
    expect(IDTypeVal.getText()).not.toBe(null, 'Field is read only with data prefilled'); 

    expect(IDNoVal.isPresent()).toBe(true,'ID No field is blank!');
    expect(IDNoVal.getText()).not.toBe(null, 'Field is read only with data prefilled'); 

    expect(IssuingJurisdicationVal.isPresent()).toBe(true,'Issuing Jurisdication field is blank!');
    expect(IssuingJurisdicationVal.getText()).not.toBe(null, 'Field is read only with data prefilled'); 

    expect(ExpiryDateVal.isPresent()).toBe(true,'Expiry Date field is blank!');
    expect(ExpiryDateVal.getText()).not.toBe(null, 'Field is read only with data prefilled'); 
  

}

this.VerifyTrustAccount = function () {

    expect(TrustAccVal.isPresent()).toBe(true,'Trust account field is blank!');
    expect(TrustAccVal.getText()).not.toBe(null, 'Field is read only with data prefilled'); 
  

}

this.VerifyTrustAccIcon = function () {
    browser.wait(EC.presenceOf(trustAccIcon), 45000,  'Element is not visible').then(() => {
      trustAccIcon.getAttribute('title').then(function(title)
      {
         var t =  new String(title);
         
        expect(t).toContain(TestData.data[Lang].Messages[Env].TrustAccMsgLine1,"Trust account tool tip text didn't matched!"); 
        expect(t).toContain(TestData.data[Lang].Messages[Env].TrustAccMsgLine2,"Trust account tool tip text didn't matched!"); 
      })
       
       
    }, (error) => {
               expect(true).toBe(false, "Trust icon text is invalid.");
    }) 

}

this.VerifyTrustAccIconMMS = function () {
    browser.wait(EC.presenceOf(trustAccIconMMS), 45000,  'Element is not visible').then(() => {
      trustAccIconMMS.getAttribute('title').then(function(title)
      {
         var t =  new String(title);
         
        expect(t).toContain(TestData.data[Lang].Messages[Env].TrustAccMsgLine1,"Trust account tool tip text didn't matched!"); 
        expect(t).toContain(TestData.data[Lang].Messages[Env].TrustAccMsgLine2,"Trust account tool tip text didn't matched!"); 
      })
       
       
    }, (error) => {
               expect(true).toBe(false, "Trust icon text is invalid.");
    }) 

}



this.VerifyComment = function (Status) {

    CustomLib.scrollIntoView(lblClosingDate);

    if (Status == 'Disabled') {
        expect(tbComment.isEnabled()).toBe(false);
    }
    if (Status == 'Enabled') {
        expect(tbComment.isEnabled()).toBe(true);
    }
}

this.CommentonRFF = function (Comment) {
    CustomLib.WaitforElementVisible(SecRFF);
    expect(lblComment.isDisplayed()).toBe(true), 'Comment field is not displayed';
    expect(lblCharCountComment.getText()).toBe('0/1000 characters', 'Character count is incorrect');
    tbComment.sendKeys(Comment);

    var CommLength = Comment.length.toString();
    expect(lblCharCountComment.getText()).toBe('' + CommLength + '/1000 characters');
}

this.SelectILADate = function (date) {
    var tbILADate = element(by.xpath('//app-td-rff/form/div[3]/div/form/div[2]/div/div/input'));
    CustomLib.WaitforElementVisible(tbILADate);
    tbILADate.sendKeys(date);

}

this.CommentonRFFIDV = function (Comment) {
    CustomLib.WaitforElementVisible(lblCommentIDV);
    expect(lblCommentIDV.isDisplayed()).toBe(true);
    expect(lblCharCountCommentIDV.getText()).toBe('0/1000 characters');
    tbComment.sendKeys(Comment);

    var CommLength = Comment.length.toString();
    expect(lblCharCountCommentIDV.getText()).toBe('' + CommLength + '/1000 characters');

}

this.VerifySubmitButtonStatus = function (Status) {
    CustomLib.ScrollDown(0,10000);
    if (Status == 'Disabled') {
        expect(btnSubmit.isEnabled()).toBe(false, "Expected Submit Button to be - disbled. But Submit Button is - enabled");
    }
    if (Status == 'Enabled') {
        expect(btnSubmit.isEnabled()).toBe(true, "Expected Submit Button to be - enabled. But Submit Button is - disbled");
    }
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

this.VerifySaveDataMsg = function (Msg) {
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(StatusMsg), 45000,  'Element is not visible').then(() => {
        expect(StatusMsg.getText()).toContain(Msg,'Save data message is not present.');
        }, (error) => {
               expect(true).toBe(false, "Save data Message is not visible.");
    })  
}

this.VerifySaveButtonStatus = function (Status) {
    CustomLib.ScrollDown(0,10000);
    if (Status == 'Disabled') {
        expect(btnSave.isEnabled()).toBe(false, "Expected Submit Button to be - disbled. But Submit Button is - enabled");
    }
    if (Status == 'Enabled') {
        expect(btnSave.isEnabled()).toBe(true, "Expected Submit Button to be - enabled. But Submit Button is - disbled");
    }
}

this.VerifyallButtonStatus = function (Status) {

    CustomLib.ScrollDown(0,100000);
    if (Status == 'Disabled') {
        expect(btnSave.isEnabled()).toBe(false, "Expected Save Button to be - disbled. But Save Button is - enabled");
        expect(btnCreate.isEnabled()).toBe(false, "Expected Create Button to be - disbled. But Create Button is - enabled");
        expect(btnSubmit.isEnabled()).toBe(false, "Expected Submit Button to be - disbled. But Submit Button is - enabled");
    }
    if (Status == 'Enabled') {
        expect(btnSave.isEnabled()).toBe(true, "Expected Save Button to be - enabled. But Save Button is - disbled");
        expect(btnCreate.isEnabled()).toBe(true, "Expected Create Button to be - enabled. But Create Button is - disbled");
        expect(btnSubmit.isEnabled()).toBe(true, "Expected Submit Button to be - enabled. But Submit Button is - disbled");
    }
    
}


this.NavigateAway = function () {
    browser.sleep(1000);
    CustomLib.WaitNClick(DealHistoryMenu);
    CustomLib.WaitforElementVisible(element(by.css('.modal-content')));
    CustomLib.WaitForSpinnerInvisible();
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

this.SelectNotificationOfChangecb = function () {
    var cbNotificationOfChange = element(by.css('.check-box')).element(by.xpath('..'));
    cbNotificationOfChange.click();
    browser.sleep(4000)
    var NotificationTb = element(by.tagName('textarea'));
    var cbReturnMortgageProceeds = element.all(by.css('.check-box')).get(1).element(by.xpath('..'));
    expect(NotificationTb.isDisplayed()).toBe(true)
    expect(cbReturnMortgageProceeds.isDisplayed()).toBe(true)


}

this.DeSelectNotificationOfChangecb = function () {
    var cbNotificationOfChange = element(by.css('.check-box'));
    cbNotificationOfChange.click();
    browser.sleep(2000)

    var NotificationTb = element(by.tagName('textarea'));
    var cbReturnMortgageProceeds = element.all(by.css('.check-box')).get(1);
    expect(NotificationTb.isPresent()).toBe(false)
    expect(cbReturnMortgageProceeds.isPresent()).toBe(false)


}

this.EnterNotificationofChangeComments = function (val) {

    var NotificationTb = element(by.tagName('textarea'));
    NotificationTb.sendKeys(val);
}

this.SelectReturnMortgageCB = function () {
    var cbReturnMortgageProceeds = element.all(by.css('.check-box')).get(1);
    cbReturnMortgageProceeds.click();
}

this.SelectFundingReqType = function (type) {
    //browser.sleep(500);
    CustomLib.WaitForSpinnerInvisible();
    var ddlRequestForFunds = ddlFundingReqType.element(by.cssContainingText('option', type));
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(ddlRequestForFunds), 45000, 'Element taking too long to appear in the DOM').then(() => {
        ddlRequestForFunds.click();
}, (error) => {
    expect(ddlRequestForFunds.isPresent()).toBe(true, "Request for Funds Dropdownis not present.")
})
}

this.VerifyClosedDealMsg = function (Msg) {

    //var ClosedMsg = element(by.css('.msg-container.ng-star-inserted')).all(by.css('.d-flex.my-1.ng-star-inserted')).get(0);
    var ClosedMsg = element(by.css('.msg-container.ng-star-inserted'));

    CustomLib.scrollIntoView(ClosedMsg);
    expect(ClosedMsg.getText()).toContain(Msg);
}

this.VerifyFundingDropDownStatus = function (Status) {

    if (Status == 'Disabled') {
        expect(ddlRequestForFunds.isEnabled()).toBe(false, "Expected Funding dropdown to be disabled. But found Enabled!");
    }
    if (Status == 'Enabled') {
        expect(ddlRequestForFunds.isEnabled()).toBe(true, "Expected Funding dropdown to be enabled. But found Disabled!");
    }
}

this.VerifyConfirmationOfRegistrationFeilds = function () {
    expect(lblRegistrationDate.getText()).toContain('Registration Date');

}

this.VerifyRFFDdl = function (state) {

    // browser.pause();
    expect(ddlFundingReqType.isPresent()).toBe(state)


}

this.VerifyNonMandatoryPin = function () {
    expect(lblPin.getText()).toBe("PIN")
}

this.VerifyDocumentLanguages = function () {

    expect(element(by.cssContainingText('div', 'English')).isPresent()).toBe(true);
    expect(element(by.cssContainingText('div', 'French')).isPresent()).toBe(true);

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

this.ClickRFFButtons = function (button) {
    CustomLib.WaitForSpinnerInvisible();
     CustomLib.ScrollDown(0,10000);   
    switch (button) {

        case 'Save':
            CustomLib.WaitNClick(btnSave);
            //btnSave.click();
            break;
        case 'Submit':
            CustomLib.WaitNClick(btnSubmit);
            //btnSubmit.click();
            break;
        case 'Cancel':
            CustomLib.WaitNClick(btnCancel);
            //btnCancel.click();
            break;
        case 'Create':
            CustomLib.WaitNClick(btnCreate);
            //btnCreate.click();
            break;
        case 'OK':
            CustomLib.WaitNClick(btnOKafterSubmit);
            //btnOKafterSubmit.click();
            break;

    }

    browser.sleep(4000);
}


this.ConfirmRFFCreationMessage = function () {
    // confirm create RFF with pending Lender changes
    element(by.xpath('//modal-container/div/div/div[2]/button[2]')).click();

}
this.VerifyRFFValidation = function () {
    //CustomLib.scrollIntoView(lblCommentIDV);
    CustomLib.ScrollDown(0,10000);
    CustomLib.WaitNClick(btnCreate);
    CustomLib.WaitForSpinnerInvisible();
    browser.sleep(500);
    CustomLib.ScrollDown(0,10000);
    //CustomLib.scrollIntoView(lblRFF);
    // expect(element.all(by.css('.required-message-danger.ng-star-inserted')).get(0).isPresent()).toBe(true);
    // expect(element.all(by.css('.required-message-danger.ng-star-inserted')).get(0).getText()).toContain(PortalValidationMsg);
    // expect(element.all(by.css('.required-message-danger.ng-star-inserted')).get(1).isPresent()).toBe(true);
    // expect(element.all(by.css('.required-message-danger.ng-star-inserted')).get(1).getText()).toContain(UnityValidationMsg);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).getText()).toContain(PortalValidationMsg);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).getText()).toContain(ValidationMsg);
}

this.VerifyRFFValidationIDBforBNS=function(){
    CustomLib.scrollIntoView(lblCommentIDV);
    CustomLib.WaitNClick(btnSubmit);
    CustomLib.WaitForSpinnerInvisible();
    browser.sleep(500);
    CustomLib.scrollIntoView(lblRFF);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).isPresent()).toBe(true, "Portal validation message is not displayed");
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).getText()).toContain(PortalValidationMsg);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).isPresent()).toBe(true, "Partner Validation message is not displayed");
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).getText()).toContain(ValidationMsg);
}

this.VerifyRFFValidationMsgforBC=function(){
    CustomLib.scrollIntoView(lblCommentIDV);
    CustomLib.WaitNClick(btnSubmit);
    CustomLib.WaitForSpinnerInvisible();
    browser.sleep(500);
    CustomLib.scrollIntoView(lblRFF);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).getText()).toContain(PortalValidationMsg);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).getText()).toContain(ValidationMsg);
}

this.VerifyRFFValidationMsg = function () {

    CustomLib.ScrollDown(0,10000);
    CustomLib.WaitNClick(btnCreate);
    CustomLib.WaitForSpinnerInvisible();
    browser.sleep(500);
    CustomLib.ScrollUp(10000,0);

    var RFFReqFieldMsg1 = element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']'));
    expect(RFFReqFieldMsg1.get(0).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(0).getText()).toContain(PortalValidationMsg);
    var RFFReqFieldMsg2 = element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']'));
    expect(RFFReqFieldMsg2.get(1).isPresent()).toBe(true);
    expect(element.all(by.xpath('//div[@class=\'my-1 required-message-danger\']')).get(1).getText()).toContain(ValidationMsg);
    //console.log("RFF Validation Msg1", RFFReqFieldMsg1);
    //console.log("RFF Validation Msg2", RFFReqFieldMsg2);

}

this.SelectAcknowledgement = function (Option) {
    if (Option == 1) {
        CustomLib.WaitNClick(btnAcknlgOpt1);
        // btnAcknlgOpt1.click();
    }
    if (Option == 2) {
        CustomLib.WaitNClick(btnAcknlgOpt2);
        //btnAcknlgOpt2.click();
    }
}

this.EnterRFFSubmitPwd = function (pwd) {
    browser.sleep(2000);
    element(by.xpath('//modal-container/div/div/div[1]/form/div/div[2]/div/input')).sendKeys(pwd);
    browser.sleep(5000);
    element(by.xpath('//modal-container/div/div/div[2]/button[2]')).click();
    CustomLib.WaitForSpinnerInvisible();
}

this.SubmitRFF = function () {

    CustomLib.WaitForSpinnerInvisible();
    CustomLib.WaitNClick(btnSubmit);
    CustomLib.WaitforElementVisible(puRFFSubmitMsg);
    expect(puRFFSubmit.isDisplayed()).toBe(true,'RFFSubmit is not displayed');
    //expect(puRFFSubmitMsg.getText()).toBe(RFFSubmitMsg);
    CustomLib.WaitNClick(btnOKafterSubmit);
    //CustomLib.WaitNClick(btnOKafterSubmit);
}

this.SubmitRFFBasedOnProv = function (prov) {

    CustomLib.WaitForSpinnerInvisible();
    CustomLib.WaitNClick(btnSubmit);
    CustomLib.WaitforElementVisible(puRFFSubmitMsg);
    expect(puRFFSubmit.isDisplayed()).toBe(true);
    if(prov =='ON')
        expect(puRFFSubmitMsg.getText()).toBe(RFFSubmitMsg);
    CustomLib.WaitNClick(btnOKafterSubmit);
  /*  if(prov !=='ON')
        
    {CustomLib.WaitforElementVisible(puRFFSubmitMsg);
        expect(puRFFSubmitMsg.getText()).toBe(RFFSubmitMsg);
        CustomLib.WaitNClick(btnOKafterSubmit);
    }*/
}
this.VerifyRFFDocumentIsCreated = function()
{
        return element.all(by.xpath('//app-message-bar//p[contains(text(),\'Creation of the document\')]')).count().then(function (count) {
            expect(count).toBe(0,"unable to createdocument as document generation service is down");
            if(count>0) 
            {
                return false;
            }
            else
            {
                return true;
            }

});


}
this.SubmitRFFProvince = function () {

    CustomLib.WaitForSpinnerInvisible();
    CustomLib.WaitNClick(btnSubmit);

    CustomLib.WaitNClick(btnOKafterSubmit);
}

this.VerifyClosingDateErrorMessage = function () {
    element(by.xpath("//app-request-for-funds/app-td-rff/form/div[1]/div/form/div[1]/div/div[3]")).getText().then(function (txt)  
    {
        expect(txt).toContain('The Date cannot be in the future.')
    });
}

this.VerifyegistrationDateErrorMessage = function () {

    element(by.xpath("//app-td-rff/form/div[1]/div/form/div[2]/div[1]/div[3]")).getText().then(function (txt)  
    {
        expect(txt).toContain('The Date cannot be in the future.')
    });
}

this.ResubmitRFF = function () {

    CustomLib.scrollIntoView(tbComment);
    CustomLib.WaitNClick(btnSubmit);
    CustomLib.WaitforElementVisible(puRFFSubmitMsg);
    CustomLib.scrollIntoView(lblRFF);
    expect(puRFFSubmit.isDisplayed()).toBe(true);
    expect(puRFFSubmitMsg.getText()).toBe(RFFReSubmitMsg);
    CustomLib.WaitNClick(btnOKafterSubmit);
}

this.VerifySavedChanges = function (SavedMsg) {

    var SuccessMsg = element(by.css('.messages'));
    CustomLib.scrollIntoView(SuccessMsg);
    expect(SuccessMsg.getText()).toBe(SavedMsg);
}

this.VerifyRFFCheckmarkPostSubmission = function () {

    expect(LLCRFFCheckMark.getAttribute('title')).not.toBe('Not Started', 'Milestone checkmark status is not as expected!');
    expect(LLCRFFCheckMarkImg.getAttribute('src')).toContain('accepted.png', 'Milestone image is not as expected!');
    LLCRFFCheckMark.getAttribute('title').then(function (timeStamp) {

        console.log("RFF TimeStamp: ", timeStamp);
        expect(timeStamp).not.toBe(null,"RFF not submitted");
        browser.actions().mouseMove(LLCRFFCheckMark).perform();
        browser.sleep(500);
    })
}

this.VerifyRFFCheckmarkInProgress = function () {

   expect(LLCRFFCheckMark.getAttribute('title')).not.toBe('Not Started');
   expect(LLCRFFCheckMarkImg.getAttribute('src')).toContain('in-progress.png');
   LLCRFFCheckMark.getAttribute('title').then(function (timeStamp) {

       console.log("RFF Milestone Status: ", timeStamp);
       expect(timeStamp).not.toBe(null,"RFF not submitted");
       browser.actions().mouseMove(LLCRFFCheckMark).perform();
       browser.sleep(500);
   })
}

this.VerifySelectedRFFValue = function (txt) {

    expect(ddlFundingReqType.$('option:checked').getText()).toBe(txt);
}

this.EnterRequestedAmount = function (txt) {
    CustomLib.WaitforElementVisible(tbAmount);
    tbAmount.clear();
    if (txt != null) { tbAmount.sendKeys(txt); }
    cbotrustAccount.element(by.cssContainingText('option', trustAccount)).click();
    browser.sleep(500);
}

this.VerifyMissinfeildMessag = function () {

    expect(element(by.css('.col-md-12.required-message-danger')).isPresent()).toBe(true);
    expect(element(by.css('.col-md-12.required-message-danger')).getText()).toContain("Required field(s)");
}

this.VerifyReadOnlyFeilds = function () {
    expect(tbAmount.isEnabled()).toBe(false);

}

this.ConfirmRequestfund = function (type) {


    if (type == 'OK') {
        CustomLib.scrollIntoView(lblRFF);
        browser.sleep(5000);
        btnOKafterSubmit.click();
    }
    if (type == 'Cancel') {
        CustomLib.scrollIntoView(lblRFF);
        browser.sleep(5000);
        btnCancel.click();
    }

    browser.sleep(2000);
}

this.VerifySubmitMMSButtonStatus = function (Status) {

    //CustomLib.WaitforElementVisible(btnSubmit);
    CustomLib.scrollIntoView(btnSubmit);

    if (Status == 'Disabled') {
        expect(btnSubmit.isEnabled()).toBe(false);
    }
    if (Status == 'Enabled') {
        expect(btnSubmit.isEnabled()).toBe(true);
    }
}

this.SubmitMMSRFF = function () {

    //CustomLib.WaitforElementVisible(puRFFSubmitMsg);
    //expect(puRFFSubmit.isDisplayed()).toBe(true);
    //expect(puRFFSubmitMsg.getText()).toBe(RFFSubmitMsg);
    //CustomLib.WaitNClick(btnOKafterSubmit);
    CustomLib.WaitForSpinnerInvisible();
}

this.VerifyMMSRFFPage = function () {

    expect(lnkPrivacy.getText()).toBe('Privacy Policy');

    browser.sleep(15000);
    expect(Row1.getText()).toBe('Please complete the following steps at least 2 business days prior to the Closing Date, or there may be a delay in funding:');
    expect(Row2.getText()).toBe('Complete/Update the fields below.');
    expect(Row3.getText()).toBe('Prepare the Request for Funds document.');
    expect(Row4.getText()).toBe('Submit the Request for Funds document to the lender.');
    expect(Row5.getText()).toBe('After submitting a Request for Funds, any changes made to the following information would require you to submit a new Request for Funds.');
    expect(Row6.getText()).toBe('If the Trust Account is not displayed in the drop down list, go to LLC ‘My Profile’, Trust Accounts and select the MMS tab and add your Trust Account. Please ensure that you submit a Void trust account cheque to MMS Operations at solicitorvoid@fct.ca. MMS Operations will then confirm trust account information and activate for MMS transactions.');

    expect(lnkNeedHelp.isDisplayed()).toBe(true);

    expect(lblRFF.isDisplayed()).toBe(true);
    expect(lblRFF.getText()).toBe('Request for Funds');

    expect(lblMMSClosingDate.isDisplayed()).toBe(true);
    expect(lblMMSClosingDate.getText()).toContain('Closing Date');

    expect(lblMMSTrustAccount.isDisplayed()).toBe(true);
    expect(lblMMSTrustAccount.getText()).toBe('Trust Account');

    //expect(trustAccountVal.getText()).toBe(TrustAcc);

    expect(txtFooter.isDisplayed()).toBe(true);
    expect(txtFooter.getText()).toContain(Footer);

    expect(lnkLegal.isDisplayed()).toBe(true);
    expect(lnkLegal.getText()).toBe('Legal');

    expect(lnkPrivacy.isDisplayed()).toBe(true);
    expect(lnkPrivacy.getText()).toBe('Privacy Policy');

}

this.ConfirmMMSRequestfund = function (type) {


    if (type == 'OK') {
        CustomLib.scrollIntoView(lblRFF);
        browser.sleep(5000);
        btnOKafterSubmit.click();
    }
    if (type == 'Cancel') {
        CustomLib.scrollIntoView(lblRFF);
        browser.sleep(5000);
        btnCancel.click();
    }

    browser.sleep(2000);
}
this.VerifybtnSavePresent = function () {
    expect(btnSave.isPresent()).toBe(true)
}
this.VerifybtnCreatePresent = function () {
    expect(btnCreate.isPresent()).toBe(true)
}
this.VerifyMissingAmountRequested = function () {


}

this.MandatoryfieldValidation = function () {
    CustomLib.ScrollUp(0,10000);
    var Msg1 = element.all(by.css('.my-1.required-message-danger')).get(0);
    var Msg2 = element.all(by.css('.my-1.required-message-danger')).get(1);

    expect(Msg1.getText()).toContain(PortalValidationMsg, 'Mandatory field message is not displayed!');
    expect(Msg2.getText()).toContain(ValidationMsg, 'Field required message is not displayed!');


}

this.VerifyMissingInstructionDelivery = function () {
    expect(element(by.Attribute('for', 'amountRequested')).isPresent()).toBe(true);
    expect(element(by.Attribute('for', 'fundDeliveryInstructions')).isPresent()).toBe(true);
    expect(element(by.Attribute('for', 'amountRequested')).getText()).toContain("Amount Requested");
    expect(element(by.Attribute('for', 'fundDeliveryInstructions')).getText()).toContain('Instructions for Delivery of Funds');
}

this.SendRequestedAmount = function (val) {

    tbAmount.clear();
    browser.sleep(500)
    if (val != null) { tbAmount.sendKeys(val); }
    browser.sleep(500)
}

this.SelectInstructionForDelivery = function (val) {
    CustomLib.WaitforElementVisible(ddlInstructionForDelivery);
    ddlInstructionForDelivery.element(by.cssContainingText('option', val)).click();

}
this.EnterBranchNumber = function (val) {
    var tbBranchName = element(by.xpath('//input[@formcontrolname=\'branchNumber\']'));
    CustomLib.WaitforElementVisible(tbBranchName);
    tbBranchName.sendKeys(val);
}

this.SelectTrustAccountDdl = function (val) {
    browser.sleep(2000)
    ddlTrsutAccount.element(by.cssContainingText('option', val)).click();

}

this.VerifyWarningMessage = function () {
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(WarningMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(WarningMsg.isDisplayed()).toBe(true, 'Warning message is not displayed!');
        WarningMsg.getText().then(function(txt)
    {
        expect(txt).toContain("The Request for Funds has already been created. Are you sure you want to continue with this action?");
    })

}, (error) => {
    expect(false).toBe(true, "RFF warning Message is not displayed.");
})
}

this.VerifyWarningMessageTD = function () {
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(WarningMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(WarningMsg.isDisplayed()).toBe(true, 'Warning message is not displayed!');
        WarningMsg.getText().then(function(txt)
    {
        expect(txt).toContain("The Request for Funds - Information has already been created. Are you sure you want to continue with this action?");
    })

}, (error) => {
    expect(false).toBe(true, "RFF warning Message is not displayed.");
})
}

this.VerifyWarningMessageSubmit = function () {
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(WarningMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(WarningMsg.isDisplayed()).toBe(true, 'Warning message is not displayed!');
        WarningMsg.getText().then(function(txt)
    {
        expect(txt).toContain("Request for Funds - Information has already been submitted. Are you sure you want to continue with this action?");
    })

}, (error) => {
    expect(false).toBe(true, "RFF warning Message is not displayed.");
})
}

this.VerifyCreatedRFFConfirmationMessage = function () {
    browser.wait(until.presenceOf(SucessMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(SucessMsg.isDisplayed()).toBe(true);
    SucessMsg.getText().then(function(txt)
    {
        expect(txt).toContain("Request for Funds - Information was created successfully.");
    })

}, (error) => {
    expect(false).toBe(true, "RFF Confirmation Message is not displayed.");
})
}

this.VerifyWarningMessageOld = function (messageToVerify) {
        
    browser.wait(until.presenceOf(WarningMsg), 255000, 'Element taking too long to appear in the DOM').then(() => {
        expect(WarningMsg.isDisplayed()).toBe(true,"Warning message is displayed");
        browser.sleep(1500);
 WarningMsg.getText().then(function(txt)
    {       if(txt.includes(messageToVerify)) {
        console.log(txt);
        return true;
    }

    else{
        console.log("Warning message is not displayed!");
    }
    })

}, (error) => {
    expect(false).toBe(true, "RFF Warning Message is not displayed.");
})
}


this.VerifyConfirmationMessage = function (messageToVerify) {
        
    browser.wait(until.presenceOf(SucessMsg), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(SucessMsg.isDisplayed()).toBe(true, 'Success message is not displayed!');
    SucessMsg.getText().then(function(txt)
    {
        expect(txt).toContain(messageToVerify, 'Confirmation message is not as expected!');
    })

}, (error) => {
    expect(false).toBe(true, "RFF Confirmation Message is not displayed.");
})
}

this.VerifySavedRFFChanges = function () {
    browser.sleep(3000);
    var SuccessMsg = element(by.cssContainingText('p', 'Your changes have been saved successfully.'))
    browser.wait(until.presenceOf(SuccessMsg), 35000, 'Element taking too long to appear in the DOM');
    expect(SuccessMsg.isDisplayed()).toBe(true);
}

this.VerifyTitle = function (province) {

    if (province == 'AB' || 'MB') {
        expect(lblTitle.getText()).toContain("Title Number", 'Label Title number is not present!');
    }
}

this.VerifyTitleLbl = function () {

        expect(lblTitle.getText()).toContain("Title Number", 'Label Title number is not present!');
        console.log("Verifying label displayed!")
}

this.VerifyPID = function () {
    expect(lblTitle.getText()).toContain("PID", 'Label PID is not present!');
    console.log("Verifying label displayed!")
}

this.VerifyPIN = function () {
    expect(lblTitle.getText()).toContain("PIN");
}

this.VerifyRFFCheckmarkPreSubmission = function () {

    expect(LLCRFFCheckMark.getAttribute('title')).toBe('Not Started');
    expect(LLCRFFCheckMarkImg.getAttribute('src')).toContain('not-started.png');
    LLCRFFCheckMark.getAttribute('title').then(function (timeStamp) {

        console.log("RFF TimeStamp: ", timeStamp);
        expect(timeStamp).not.toBe(null);
        browser.actions().mouseMove(LLCRFFCheckMark).perform();
        browser.sleep(500);
    })
}

this.VerifyClosedRequestMsg = function() {
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var ClosedRequestMessage = TestData.data[Lang].Messages.ClosedDealMsg;
    expect(StatusMsg.getText()).toContain(ClosedRequestMessage,'Closed deal message is not present.');
}

this.VerifyRFFDropDown = function(Status) {
    var ddRequestForFunds = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));
    if (Status == 'Disabled') {
        expect(ddRequestForFunds.isEnabled()).toBe(false,"Type of Funding request drop down is enabled");
    }
    if (Status == 'Enabled') {
        expect(ddRequestForFunds.isEnabled()).toBe(true,"Type of Funding request drop down is disabled");
    }
}

this.VerifyWarningIconForIDV = function() {
    CustomLib.ScrollDown(0,10000);
    expect(warningIcon.isPresent()).toBe(true,'Warning icon for IDV fields is not present!')
}

this.VerifyWarningMsgForIDV = function (Msg) {
    var until = protractor.ExpectedConditions;
    browser.wait(until.presenceOf(WarningMsgIDV), 35000, 'Element taking too long to appear in the DOM').then(() => {
        expect(WarningMsgIDV.isDisplayed()).toBe(true , 'IDV Warning message is not displayed!');
        WarningMsgIDV.getText().then(function(txt)
    {
        expect(txt).toContain(Msg,"IDV warning message is not present!");
    })

}, (error) => {
    expect(false).toBe(true, "Warning Message is not displayed.");
})
}

this.VerifyNavigateAway = function () {
    var msg = TestData.data[Lang].Messages.NavigateawayMsg
    expect(navigateAwyPopup.isDisplayed()).toBe(true);
    expect(navigateAwyPopupMsg.getText()).toBe(msg);
    expect(navigateAwyStay.isDisplayed()).toBe(true);
    expect(navigateAwyLeave.isDisplayed()).toBe(true);

}

};

module.exports = new RequestFunds();