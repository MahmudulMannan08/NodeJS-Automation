'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var BNSTestData = require('../../../testData/BNS/BNSTestData.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var TestData = require('../../../testData/TestData.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');


//TC-278033: LLC Embedded Portal- View Request for Funds BNS-Lender sends RFF as 'false'
describe('TC-278033: Verify RFF tab is disabled when lender sends IsRFF = false', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var BNSFctUrn = null;
    var loginRedirectURL = null;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });


    it('Generate BNS Deal - Create deal soap service', function () {
        //LenderIntegrationBNS.CreateUpdateBNSDeal('false', 'false', 'NEW');
        LenderIntegrationBNS.CreateBNSDeal('false', 'false', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal - AcceptReject soap service', function () {
        //Regression - Test case 195688: Step 2
       BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
       if (BNSFctUrn) {
           //Accepting the deal
           LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
       }
       else {
           expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
           expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
       }
   })

   //TC-278033: LLC Embedded Portal- View Request for Funds BNS-Lender sends RFF as 'false'
   it('TC-278033: Login & Verify RFF tab is disabled ', function () {
    browser.ignoreSynchronization = true;
    if (BNSFctUrn) {
        loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
        if  (loginRedirectURL) {
            CustomLibrary.WaitForSpinnerInvisible();
           //Regression - Test case 195688: Step 3 
            HomePage.VerifyHomePage();

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.WaitForExpectedDHEntry(2);
            DealHistory.VerifyDealHistoryTableEntry(1,  RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value + ' ' + RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value, TestData.data[Lang].DealHistory.ActivityDealAccept);

            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            //Verify RFF tab is greyed out
            MenuPanel.VerifyMenuButtonStatus('RequestForFunds', 'Disabled');
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
    }
    else {
        expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
        expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
    }
})

});

//TC-288511: LLC Embedded Portal- Request for Funds- Closing date is changed post RFF submission
//TC-288510: LLC Embedded Portal- View Request for Funds BNS-Lender rejects RFF - SROT not yet submitted  
describe('Functionality to verify when Lender rejects Request for Fund', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var BNSFctUrn = null;
    var loginRedirectURL = null;
    var SubmitSuccessMsg = RunSettings.data.Global.BNS[Env].SubmitSuccessMsg;
    var LangBNS = BNSTestData.data.LANGUAGE.value;
    var AssessmentRollNumber = null;
    var lenderReferenceNumber = null;
    var instrumentNo = "123567";
    var SubmitSuccessMsg = TestData.data[Lang].Messages.SubmitSuccessMsg;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
   
   

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });


    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
        console.log(BNSFctUrn);
    })

    it('Accept Deal - AcceptReject soap service', function () {

        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if (BNSFctUrn) {
            //Accepting the deal
            console.log(BNSFctUrn);
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
                        expect(true).toBe(false, "CreateBNSDeal service timed out!!!");
        }

    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(BNSFctUrn, TestData.data[Lang].WebService.DealStatusActive);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })

    it('Verify Home Page,Deal Acceptance Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyFooter();
                HomePage.VerifyDealStatusSection('LLC');
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                HomePage.VerifyLLCRffNotStarted();

                //Verify deal history entry for "accept deal" on embedded portal
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.WaitUntilDealHistoryEntry('LLC deal');              
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealAccept,true);
                
                }              
            
            else {

                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
                expect(true).toBe(false, "CreateBNSDeal service timed out!!!");
        }
    })


    it('SendUpdateTransactionData REST service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            var ClosingDate = CustomLibrary.CurrentOrFutureDate();
            //var JSONBody = LawyerIntegrationBNS.ReturnSendUpdateTransactionJsonBNS(BNSFctUrn, AssessmentRollNumber, ClosingDate, TestData.data[Lang].WebService.Province);
           // LawyerIntegrationBNS.SendUpdateTransactionData(JSONBody);
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal data.");
        }
    })

    it('Request for Funds', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            var txtRFF = TestData.data[Lang].DealHistory[Env].RFFSubmitted;
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
           // HomePage.VerifyFileNo();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifyRFFPage();
            RFFPage.CommentonRFF(BNSTestData.data[LangBNS].RFF.commentRFF);
            RFFPage.SubmitRFF();
            HomePage.VerifyMessage(SubmitSuccessMsg);
            RFFPage.VerifyRFFCheckmarkPostSubmission();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
           
           // DealHistory.WaitUntilDealHistoryEntry('The Request for Funds');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted,true);
        }
        else {

            expect(true).toBe(false, "Unable to Create RFF.");
        }
    })

    it('SendUpdateTransactionData REST service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            var ClosingDate = CustomLibrary.FutureDate();
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal data.");
        }
    })

    //TC-288511: LLC Embedded Portal- Request for Funds- Closing date is changed post RFF submission
    it('TC-288511: Request for Funds- Closing date is changed post RFF submission', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
           
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyClosingDateUpdateMsg();

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyClosingDateUpdateMsg();

 }
        else {

            expect(true).toBe(false, "Unable to Create RFF.");
        }
    })

    it('Request for Funds resubmission', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            var txtRFF = TestData.data[Lang].DealHistory[Env].RFFSubmitted;
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.CommentonRFF(BNSTestData.data[LangBNS].RFF.commentRFF);
            RFFPage.SubmitRFF();
            RFFPage.ConfirmRequestfund('OK');
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted,true);
        }
        else {

            expect(true).toBe(false, "Unable to resubmit RFF.");
        }
    })

    it('TC-288510: SendRFFReject using Lender service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
            console.log(BNSFctUrn);
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            console.log(lenderReferenceNumber);
            LenderIntegrationBNS.SendRFFReject(lenderReferenceNumber);
             
        }
        else {
            expect(true).toBe(false, "Unable to reject RFF.");
        }
    })
 
    it('TC-288510:Verify RFF Reject email', function () {

        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            OutlookPortal.LogintoOutlookNonAngular();
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            //Verify Lawyer received RFF Reject email
            OutlookInbox.VerifyEmailOutlook("Request for Funds Declined ", lenderReferenceNumber);
            OutlookInbox.OutlookLogOut();
        }
        else {
            expect(true).toBe(false, "Unable to Verify Email.");
        }
    })

    it('TC-288510: Verify & confirm RFF Reject', function () {
        browser.ignoreSynchronization = true;
        loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
        if (loginRedirectURL) {
            
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            
            //Verify that RFF checkmark appears not started  as RFF is rejected
            RFFPage.VerifyRFFCheckmarkPreSubmission();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.WaitUntilDealHistoryEntry('The Lender has declined'); 
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFRejectedNew, true);
            
        }
                   
        else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }
    })
    

});
