
'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;

describe("MMS Deal Cancellation Request in LLC Unity", function () {
    browser.ignoreSynchronization = true;
    var i = 0;
    var lenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
    var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
    var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
    var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
    var programType = RunSettings.data.Global.MMS[Env].Lender[i].ONTARIO.ProgramType;
    var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
    var ClientName = CustomLibrary.getRandomString(5);
    var FCTURN;     
    var DealId;
    var ThankYouPageFound = false;
    var dealSendToLLC = false;


    it("Create MMS Deal", function () {
        MMSPortral.CreateMMSDeal(lenderName, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                MMSCreateDeal.EnterStatusData(spec, lenderName);
                MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    
                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
                
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });   
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    it("Accept Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "ACTIVE");
        }
        else{
            expect(false).toBe(true, "Unable to Accept the deal.");
        }
    })

    //LLC Embedded Portal/ Reason for cancelation drop down field values > Submit
    it('TC-247488, 247503: Request Cancellation in LLC Unity', function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            HomePage.VerifyDealAcceptedCheckMark("MMS");
            MenuPanel.PrimaryMenuNavigateTo("ReqCancel");
            RequestCancellation.SelectReasonType("Client request to cancel deal");
            RequestCancellation.SelectReasonType("Conflict of interest");
            RequestCancellation.SelectReasonType("Lawyer/Notary cannot act on deal");
            RequestCancellation.SelectReasonType("Other");
            RequestCancellation.SelectReasonType("Client request to cancel deal");
            //247503 - Navigate Away
            MenuPanel.PrimaryMenuNavigateTo("Home");
            RequestCancellation.VerifyNavigateAway();
            RequestCancellation.NavigateAwayAcceptReject("Cancel")
            RequestCancellation.SubmitCancellation();
            RequestCancellation.ConfirmCancellation("Cancel");
            RequestCancellation.SubmitCancellation();
            RequestCancellation.ConfirmCancellation("OK");
            RequestCancellation.VerifySubmitButtonStatus("Disabled");
            RequestCancellation.VerifySucessfulySubmittedChanges();
        }
        else{
            expect(false).toBe(true, "Unable to Process Cancellation in LLC Unity.");
        }
    })


    it('Process Cancellation in MMS', function () {
        if(dealSendToLLC)
        {
            MMSPortral.loginMMS();
            MMSPortral.ClickOnEditViewdeals();
            MMSPortral.SearchDealURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            MMSPortral.VerifySendToLLCException();
            MMSCreateDeal.ClickLLCLAwyerTab();
            MMSCreateDeal.VerifyCancellationRequest("Client request to cancel deal");
            MMSCreateDeal.AcceptAndAcknowldegeCancellation();
            MMSCreateDeal.VerifyCancellationAcknowledged();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);
        }
        else{
            expect(false).toBe(true, "Unable to Process Cancellation in LLC Unity as deal is not Send to LLC");
        }
        
    })
})

// TC-303948: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is cancelled by Lender 
//TC-288282: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Deal Cancellation
//TC-238932: LLC EmbeddedPortal - Lender cancels the deal while user is in Embedded portal
describe("TC-238932 - MMS Deal Cancellation Request in MMS Portal by Lender", function () {
    browser.ignoreSynchronization = true;
    var i = 0;
    var lenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
    var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
    var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
    var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
    var programType = RunSettings.data.Global.MMS[Env].Lender[i].ONTARIO.ProgramType;
    var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
    var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
    var ClientName = CustomLibrary.getRandomString(5);
    var FCTURN;     
    var DealId;
    var ThankYouPageFound = false;
    var dealSendToLLC = false;

    it("Create MMS Deal", function () {
        MMSPortral.CreateMMSDeal(lenderName, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(spec, lenderName);
                MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
    
                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
              
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });   
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 

        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    it("Accept Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "ACTIVE");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Accept the deal as deal is not Send to LLC");
        }
    })

        // TC-303948: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is cancelled by Lender 
        // TC-288282: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Deal Cancellation
    it('TC-238932, 288282, 303948 - Process Cancellation parallely in MMS, Email verification, Request Cancellation - Disabled Cancellation Requested  - When Deal is cancelled by Lender ', function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            HomePage.VerifyDealAcceptedCheckMark("MMS");
            CustomLibrary.OpenNewTab();
            CustomLibrary.navigateToWindow("",2);
            browser.sleep(2000);
            MMSPortral.loginMMS();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
            browser.sleep(2000);
            MMSCreateDeal.StatusMenuClick();
            MMSCreateDeal.ClickOnCancelDeal();
            CustomLibrary.navigateToWindowWithUrlContains("ChangeStatus",4)
            browser.sleep(2000);
            MMSCreateDeal.EnterCancellationReasons("Duplicate Deal", "Some Reason");
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.closeWindowUrlContains("DealList");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

            // TC-288282: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Deal Cancellation
            OutlookPortal.LogintoOutlookNonAngular();                        
            var emailsubject = "Deal Cancelled - " + firstName + " " + lastName;
            OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
            OutlookInbox.OutlookLogOut();    
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Process Cancellation in LLC Unity as deal is not Send to LLC");
        }
    })

        
 })

describe("Change Lawyer in MMS Portal", function () {
    browser.ignoreSynchronization = true;
    var i = 0;
    var lenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
    var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
    var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
    var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
    var programType = RunSettings.data.Global.MMS[Env].Lender[i].ONTARIO.ProgramType;
    var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
    var ClientName = CustomLibrary.getRandomString(5);
    var FCTURN;     
    var DealId;
    var ThankYouPageFound = false;
    var dealSendToLLC = false;

    it("Create MMS Deal", function () {
        MMSPortral.CreateMMSDeal(lenderName, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(spec, lenderName);
                MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                browser.sleep(3000);
                MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                browser.sleep(2000);
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {

                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 

        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    it("Accept Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "ACTIVE");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Accept the deal as deal is not Send to LLC");
        }
    })

    it('Check Deal In LLC', function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            HomePage.VerifyDealAcceptedCheckMark("MMS");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Check Deal In LLC'");
        }
    })

    it('Edit Lawyer in MMS', function () {
        if(dealSendToLLC)
        {
            MMSPortral.loginMMS();
            MMSPortral.ClickOnEditViewdeals();
            MMSPortral.SearchDealURN(FCTURN);
            browser.sleep(5000)
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EditLawyerData("Firm");
            MMSCreateDeal.sendDealtoLLC();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);

        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Edit Lawyer in MMS'");
        }
    })
})

//TC- 304009, 304012, 303934, 304179, 304182, 304192, 304176
describe('Request Cancellation by the lawyer scenarios', function () {
    browser.ignoreSynchronization = true;
    var i = 0;
    var lenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
    var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
    var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
    var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
    var programType = RunSettings.data.Global.MMS[Env].Lender[i].ONTARIO.ProgramType;
    var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
    var Lang = TestData.data.LANGUAGE.value;
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
    var ClientName = CustomLibrary.getRandomString(5);
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
    var FCTURN;     
    var DealId;
    var ThankYouPageFound = false;
    var dealSendToLLC = false;

    it("Create MMS Deal", function () {
        MMSPortral.CreateMMSDeal(lenderName, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(spec, lenderName);
                MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {

            
                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
              
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });   
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealStatus();
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    it("Accept Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "ACTIVE");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Accept the deal as deal is not Send to LLC");
        }
    })

    // TC-304009: Submit request cancellation without selecting option, Verify validation
    // TC-304012: Verify System displays all pages as read only 
    // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
    //TC-304179: Request Cancellation State - Verify deal History entry

    it('TC- 304009, 304012, 302934, 304179: Request Cancellation in LLC Unity', function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            HomePage.VerifyDealAcceptedCheckMark("MMS");
            MenuPanel.PrimaryMenuNavigateTo("ReqCancel");
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();


            // TC-304009: Submit request cancellation without selecting option, Verify validation
            RequestCancellation.SubmitCancellationDynamic();
            RequestCancellation.VerifyMissinfieldMessag();
            RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);
            RequestCancellation.SubmitCancellation();
            RequestCancellation.ConfirmCancellation("OK");

            // TC-304012: Verify System displays all pages as read only 
            RequestCancellation.VerifySubmitButtonStatus('Disabled');
            expect(ddReasonForCancellation.isEnabled()).toBe(false,"Reason drop down is enabled");
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            
            // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            HomePage.VerifySaveButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            RFFPage.VerifyallButtonStatus('Disabled');
            
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            ManageDocuments.VerifyDisableBrowseButton();
            
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            FinalReportPage.VerifySubmitButtonStatusFinalReport('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            
            MenuPanel.PrimaryMenuNavigateWithWait('Pre-Funding Information');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');
            PreFundingInfomation.VerifyallButtonStatus('Disabled'); 

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            expect(StatusMsg.getText()).toContain(CancellationRequestMessage, 'Cancellation Message is not present');

            //TC-304179: Request Cancellation State - Verify deal History entry
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityReqCancel + ' ' + TestData.data[Lang].RequestForCancellation.CancelReasonOption1.trim(),true);
 
            
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Process Cancellation in LLC Unity as deal is not Send to LLC");
        }
    })

    //TC- 304182: Request Cancellation- Verify Getlawyerevents - MMS
    it('TC- 304182: Request Cancellation- Verify Getlawyerevents - MMS', function () {
        if(dealSendToLLC)
        {
            MMSPortral.loginMMS();
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MMSPortral.ClickOnEditViewdeals();
            MMSPortral.SearchDealURN(FCTURN);
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSPortral.VerifySendToLLCException();
            MMSCreateDeal.ClickLLCLAwyerTab();
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MMSCreateDeal.VerifyCancellationRequest("Client request to cancel deal");
            MMSCreateDeal.AcceptAndAcknowldegeCancellation();
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MMSCreateDeal.VerifyCancellationAcknowledged(); 
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);

        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Process Cancellation in MMS as deal is not Send to LLC");
        }
    })

    //TC-304192 LLC Embedded Portal- Request Cancellation-Verify Opps Portal for Request cancellation Status- MMS 
    it("TC- 304192: Reinstate deal in Operation portal", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.ClickMilestinesAndStatus();
            //TC- 304192: Verify deal status in Operation portal is Request cancellation
            OperationsPortal.VerifyDealStatus('CANCELLATION REQUESTED');
            OperationsPortal.UndoCancelRequest();
            

            
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Reinstate deal in Operation portal as deal is not Send to LLC");
        }
    })

    it('Check Deal Reinstated deal in LLC Unity', function () {
        if(dealSendToLLC)
        {
            
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyDealAcceptedCheckMark("MMS");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Check Deal Reinstated deal in LLC Unity as deal is not Send to LLC");
        }
    })

    //TC-304176: Request cancellation by the lawyer using reason: Other --MMS
    it('TC-304176, 288468 :Request for cancellation-Reason: Other', function () {
        if  (dealSendToLLC) {     
        //Navigate to Request cancellation page
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        //Select request cancellation option as OTHER from drop down
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption4);
        RequestCancellation.CommentonRFC(TestData.data[Lang].RequestForCancellation.commentRFC);
        RequestCancellation.SubmitCancellation();
        RequestCancellation.VerifyConfirmCancellationSection();
        RequestCancellation.ConfirmCancellationDynamic('OK');
        HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

        }
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

})





