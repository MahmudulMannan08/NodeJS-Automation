'use strict';

var CustomLib = require('../../CustomLibrary/CustomLibrary.js');
var EC = protractor.ExpectedConditions;

var MenuPanel = function () {

    var LeftMenu = element(by.css('.side-navbar'))
    var LeftMenuBtns = LeftMenu.all(by.tagName('li'));
    var btnToggleMenu = element(by.css('.img-container.float-right'))
    var logoFCT = element(by.css('.logo'));
    //Primary Menu Navigation Panel
    var btnHome = element(by.id('home'))
    var btnManageDocuments = element(by.id('docs'))
    var btnReqForFunds = element(by.id('funds'))
    var btnNotes = element(by.id('notes'))
    var btnRequestCancellation = element(by.id('cancel'))
    var btnDealHistory = element(by.id('history'))
    var btnFinalReport = element(by.id('reports'))
    var btnSubmitLender = element(by.id('submitlender'))
    var btndocuments = element(by.id('docs'))
    var btnSubmitToLender = element(by.id('submitlender'))
    var btnPreFundingInformation = element(by.id('info'));

    //Functions
    this.NavigationConfirmation = function (bool) {
        if (bool) {
            element(by.id('btnOk')).click();

        }
        else {
            element(by.id('btnCancel')).click();

        }



    }

    this.ConfirmSubmitChangesToLender = function (bool) {
        if (bool) {
            CustomLib.WaitNClick(element(by.xpath('//modal-container/div/div/div[2]/button[2]')));
        }
        else {
            CustomLib.WaitNClick(element(by.xpath('//modal-container/div/div/div[2]/button[1]')));
        }
    }

    this.PrimaryMenuNavigateTo = function (option) {
        browser.sleep(1000)
        browser.waitForAngular();
        CustomLib.WaitForSpinnerInvisible();
      // browser.sleep(1000)
        switch (option) {
            case 'Home':
                CustomLib.WaitforElementVisible(btnHome);
                CustomLib.WaitNClick(btnHome);
                //btnHome.click();
                break;
            case 'ManageDocs':
            CustomLib.WaitforElementVisible(btnManageDocuments);
                CustomLib.WaitNClick(btnManageDocuments);
                //btnManageDocuments.click();
                break;
            case 'RequestForFunds':
            CustomLib.WaitforElementVisible(btnReqForFunds);
                CustomLib.WaitNClick(btnReqForFunds);
               //btnReqForFunds.click();
                break;

            case 'FinalReport':
            CustomLib.WaitforElementVisible(btnFinalReport);
                 CustomLib.WaitNClick(btnFinalReport);
                //btnFinalReport.click();
                break;
            case 'Notes':
            CustomLib.WaitforElementVisible(btnNotes);
                CustomLib.WaitNClick(btnNotes);
                //btnNotes.click();
                break;
            case 'ReqCancel':
            CustomLib.WaitforElementVisible(btnRequestCancellation);
                CustomLib.WaitNClick(btnRequestCancellation);
                //btnRequestCancellation.click();
                break;
            case 'dealHistory':
            CustomLib.WaitforElementVisible(btnDealHistory);
                CustomLib.WaitNClick(btnDealHistory);
               // btnDealHistory.click();
                break;

            case 'ManageDocuments':
            CustomLib.WaitforElementVisible(btndocuments);
                // browser.sleep(3000)
               CustomLib.WaitNClick(btndocuments);
             //  btndocuments.click();
                break;
            case 'Submit2Lender':
                //btnSubmitToLender.click();
                CustomLib.WaitforElementVisible(element(by.cssContainingText('a', 'Submit to Lender')));
                CustomLib.WaitNClick(element(by.cssContainingText('a', 'Submit to Lender')));
            //    element(by.cssContainingText('a', 'Submit to Lender')).click();
              //  browser.sleep(3000)
                break;

            case 'PreFundingInformation':
            CustomLib.WaitforElementVisible(btnPreFundingInformation);
                CustomLib.WaitNClick(btnPreFundingInformation);
               // btnPreFundingInformation.click();
                break;



        }

       // browser.sleep(2000)
        browser.waitForAngular();
        //browser.wait(EC.textToBePresentInElement(element(by.css('.title')), option), 20000, option + ' page is taking too long to load');
        CustomLib.WaitForSpinnerInvisible();
    }

    this.SecondaryMenuNavigateTo = function (option) {

        switch (option) {
            case 'Pages':
                btnPagesSM.click();
                break;
            case 'Notes':
                btnNotesSM.click();
                break;
            case 'Discuss':
                btnDiscussSM.click();
                break;

            case 'Console':
                btnConsoleSM.click();
                break;

        }
    }

    this.SearchPageMenu = function (txt) {
        txtSearchPages.sendKeys(txt);
    }

    this.PrimaryMenuNavigateWithWait = function (option) {
        switch (option) {
            case 'Home':
                CustomLib.WaitNClick(btnHome);
                break;
            case 'Pre-Funding Information':
                CustomLib.WaitNClick(btnPreFundingInformation);
                break;
            case 'Manage Documents':
                CustomLib.WaitNClick(btnManageDocuments);
                break;
            case 'Request for Funds':
                CustomLib.WaitNClick(btnReqForFunds);
                break;
            case 'Final Report':
                CustomLib.WaitNClick(btnFinalReport);
                break;
            case 'Notes':
                CustomLib.WaitNClick(btnNotes);
                break;
            case 'Request Cancellation':
                CustomLib.WaitNClick(btnRequestCancellation);
                break;
            case 'Deal History':
                CustomLib.WaitNClick(btnDealHistory);
                break;
            case 'Submit to Lender':
                CustomLib.WaitNClick(btnSubmitToLender);
                break;
        }

        //browser.wait(EC.textToBePresentInElement(element(by.css('.title')), option), 20000, option + ' page is taking too long to load');
        browser.wait(EC.textToBePresentInElement(element.all(by.css('.title')).first(), option), 45000, option + ' page is taking too long to load');
        CustomLib.WaitForSpinnerInvisible();
    }

    this.VerifyLeftMenuItems = function () {
        CustomLib.WaitforElementVisible(logoFCT);
        CustomLib.WaitforElementVisible(btnHome);
        CustomLib.WaitforElementVisible(btnManageDocuments);
        CustomLib.WaitforElementVisible(btnReqForFunds);
        CustomLib.WaitforElementVisible(btnFinalReport);
        CustomLib.WaitforElementVisible(btnNotes);
        expect(logoFCT.isDisplayed()).toBe(true);
        expect(logoFCT.getAttribute('src')).toContain('logo.png');
        expect(btnHome.getText()).toContain('Home');
        expect(btnManageDocuments.getText()).toContain('Manage Documents');
        expect(btnReqForFunds.getText()).toContain('Request for Funds');
        expect(btnFinalReport.getText()).toContain('Final Report');
        expect(btnNotes.getText()).toContain('Notes');
        expect(btnRequestCancellation.getText()).toContain('Request Cancellation');
        expect(btnDealHistory.getText()).toContain('Deal History');
        expect(btnSubmitLender.getText()).toContain('Submit to Lender');
    }

    this.ToggleSideMenu = function () {
        //browser.pause();
        btnToggleMenu.click();
        browser.waitForAngular();

    }

    this.VerifyMenuButtonStatus = function (option, Status) {

        switch (option) {
            case 'ReqCancel':
                if (Status == 'Disabled') {
                    expect(btnRequestCancellation.getAttribute('class')).toContain('disabled', "Expected Requestion Cancellation Menu button to be disabled. But found Enabled!");
                }
                if (Status == 'Enabled') {
                    expect(btnRequestCancellation.getAttribute('class')).not.toContain('disabled', "Expected Requestion Cancellation Menu button to be enabled. But found Disabled!");
                }
                break;

            case 'RequestForFunds':
                if (Status == 'Disabled') {
                    //expect(btnReqForFunds.getAttribute('class')).toContain('disabled');
                    expect(element(by.id('funds')).getAttribute('class')).toContain('disabled', "Expected Requestion For Funds Menu button to be disabled. But found Enabled!");
                }
                if (Status == 'Enabled') {
                    expect(element(by.id('funds')).getAttribute('class')).not.toContain('disabled', "Expected Requestion For Funds Menu button to be disabled. But found Disabled!");
                }
                break;
            case 'SubmitToLender':
                if (Status == 'Disabled') {
                    expect(btnSubmitLender.getAttribute('class')).toContain('disabled', "Expected Submit To Lender Menu button to be disabled. But found Enabled!");
                }
                if (Status == 'Enabled') {
                    expect(btnSubmitLender.getAttribute('class')).not.toContain('disabled', "Expected Submit To Lender Menu button to be enabled. But found Disabled!");
                }
                break;
        }
    }

};

module.exports = new MenuPanel();