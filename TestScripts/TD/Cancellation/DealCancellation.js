'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInBox = require('../../../PageObjectMethods/Outlook/Outlookinbox.js')
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var TDData = require('../../../testData/TD/TDData.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');


//TC-239000: LLC Embedded Portal - User is within a deal in the embedded portal, and the Lender cancels the deal:- An information message will display to the user indicating that the deal has been cancelled
describe('Lender Cancells Deal while user is in Embedded Portal - Verify Status in Ops Portal and Lawyer recieves email', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });

    it('Create TD Deal', function () {  
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            
            OperationsPortal.LoginOperationsPortal();
            
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                
                        if(status != "DRAFT") {
                            TDDealIsInDraft = false;
                        }
                    });
                }
                else {
                    expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                }
            });
        }
        else {
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    it('Accept TD Deal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
 
    it('Verify Lawyer is able to login to Embedded Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
    })


    it('Lender Cancells Deal ', function () {

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,TestData.data[Lang].WebService.DealStatusCancel, TestData.data[Lang].WebService.DealStatusChangeReasonCancel);
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }

    })

    
    it('Verify Deal Status', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'CANCELLED');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })


    it('TC-239000: Navigate to a different tab and Verify Cancellation message', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait("Deal History"); 
           // browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            //TC-239000: Lender Cancel Deal Message
            RequestCancellation.VerifyLenderCancelledDealMessage();
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
      
    })

    it('Verify Deal Status in Operations Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then(function(count){   
                if(count > 0)
                {
                    CustomLibrary.WaitForSpinnerInvisible();
                    OperationsPortal.ClickMilestinesAndStatus();
                    OperationsPortal.VerifyDealStatus("CANCELLED"); 
                }   
               });       
        }
        else{
            expect(false).toBe(true, "Either deal is not created or is not available in operational portal.");
        }
    })

    it('Verify Lender Recieves Cancellation Email', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
        
            OutlookPortal.LogintoOutlookNonAngular();
        
            OutlookInBox.VerifyEmailOutlook("Deal Cancelled", lenderReferenceNumber);
            OutlookInBox.OutlookLogOut();
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

})

//TC-303951, 303946, 303933, 304195, 304191, 304181, 304177, 304175, 304011, 304010
//TC-288467,288468,288469,288470,288472,288473: Lawyer performs request cancellation, and the lender first reinstate it & then cancels it for the second request for cancellation made by the lawyer.
describe('Lawyer performs request cancellation, and the lender first reinstate it & then cancels it.', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LangTD = TDData.data.LANGUAGE.value;
    var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var ddRequestForFunds = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));

    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });


    //Create deal
   it('Create TD Deal', function () {  
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    //Verify deal status
    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            
            OperationsPortal.LoginOperationsPortal();
            
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                
                        if(status != "DRAFT") {
                            TDDealIsInDraft = false;
                        }
                    });
                }
                else {
                    expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                }
            });
        }
        else {
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    //Accept TD deal
    it('Accept TD Deal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            console.log(TDDealID);
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
 
    //Verify Lawyer is able to login to Embedded Portal
    it('Verify Lawyer is able to login to Embedded Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
               
            }
            else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                }
        }
    })

    //Lawyer performs request cancellation & all pages are read only after request cancellation
    it('TC-288469, 288470, 288472, 288467, 304010, 303933, 304011, 303951 :Request for cancellation-Reason: Client request to cancel deal', function () {
        if  (loginRedirectURL) {     
        //Navigate to Request cancellation page, verify layout

        // TC-288467: Verify Request Cancellation section
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifyRFCPage();
        RequestCancellation.VerifyReqCancellationSection();

        // TC-288472, 304010: Submit request cancellation without selecting option, Verify validation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyMissinfieldMessag();
        browser.sleep(1500); 

        // TC-288469: Navigation away
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('Cancel');
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('OK');
        
        // TC-288467, 304011: Select request cancellation option from drop down
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);

        // TC-288467, 304011: Submit request for cancellation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyConfirmCancellationSection();
        RequestCancellation.ConfirmCancellationDynamic('OK');
        HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);  

        // TC-288470, 304011, 303933, 303951: Verify System displays all pages as read only except for View /download documents and Send/view/print notes
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifySubmitButtonStatus('Disabled');
        expect(ddReasonForCancellation.isEnabled()).toBe(false,"Reason drop down is enabled");
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
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

    //Verify Lawyer's Request cancellation entry in deal history
    it('TC-288473, 304177: Request Cancellation  DH Entry', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            //Request Cancellation State - Verify deal History entry
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityReqCancel + ' ' + TestData.data[Lang].RequestForCancellation.CancelReasonOption1.trim(),true);
            
        }
        else {
            expect(true).toBe(false, "Unable to verify Request Cancellation State"); 
        }       
    })

    //Verify deal status after Lawyer performs Request cancellation
    it('Verify Deal Status', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'CANCELLATION REQUESTED');
            console.log(lenderReferenceNumber);
        }
        else{
            expect(false).toBe(true, "Error occured while checking request cancellation status.");
        }
    })

   
    //Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
    it('TC-288470, 304011: Request Cancellation State"', function () {
        if  (loginRedirectURL) {
            //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
           // var dealStatus = LawyerIntegrationTD.ReturnTransactionStatus();
            var dealStatus = LawyerIntegrationCommon.ReturnTransactionStatus();
            if (dealStatus == "CANCELLATION REQUESTED") {
                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            }
        }
        else {
            expect(true).toBe(false, "Unable to verify request cancellation tab."); 
        } 
       
    })

    
      //TC-304181: LLC Embedded Portal- Request Cancellation- Verify Getlawyerevents - TD
    it('TC-304181: Get lawyer deal events Request cancellation', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
        {
            //LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
           // LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');
           // LenderIntegrationTD.LogLawyerDealEvent(1, 'CANCELLATIONREQUESTED', 'REQUESTCANCELLATION');

            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.LogLawyerDealEventStatus('ACCEPT','ACTIVE');
            LenderIntegrationTD.LogLawyerDealEventStatus('REQUESTCANCELLATION','CANCELLATIONREQUESTED');
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    
    it('Re-instating deal', function () {
        if  (loginRedirectURL) {
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,"REINSTATE","Re-instating the deal");
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, TestData.data[Lang].WebService.DealStatusActive);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })
 
    //Verify UI after deal is reinstated by the Lender
    it('Reinstate Deal', function () {
       if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            RequestCancellation.VerificationPostReinstateOfDeal();
        
        }
        else {
              expect(true).toBe(false, "Unable to verify UI after deal is Reinstated."); 
        }  
    })

    //Verify deal reinstated entry in deal history
    it('Deal reinstated  DH Entry', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            //Deal reinstated by lender - Verify deal History entry

            //browser.sleep(2500); // In case entry doesn't appear we will add custom function for wait
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealReinstated + ' ' + TestData.data[Lang].WebService.DealStatusChangeReasonReinstate.trim(),true);
            
        }
        else {
            expect(true).toBe(false, "Unable to verify deal reinstate entry"); 
        }       
    })

         
    //Request cancellation by the lawyer using reason: Other
    it('TC-288468, 304175 :Request for cancellation-Reason: Other', function () {
        if  (loginRedirectURL) {     
        //Navigate to Request cancellation page, verify layout
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifyRFCPage();
        
        // TC-288467: Verify Request Cancellation section
        RequestCancellation.VerifyReqCancellationSection();

        // TC-288467: Select request cancellation option from drop down
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption4);
        RequestCancellation.CommentonRFC(TDData.data[LangTD].RFC.commentRFC);
        
        // TC-288467: Submit request for cancellation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyConfirmCancellationSection();
        RequestCancellation.ConfirmCancellationDynamic('OK');
        HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

        }
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

    //TC-304195: LLC Embedded Portal- Request Cancellation-Verify Opps Portal for Request cancellation Status- TD
    it('TC-304195: Verify Deal Status in Operations Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindow("",2);
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then(function(count){   
                if(count > 0)
                {
                    CustomLibrary.WaitForSpinnerInvisible();
                    OperationsPortal.ClickMilestinesAndStatus();
                    OperationsPortal.VerifyDealStatus("CANCELLATION REQUESTED"); 
                    
                } 
               browser.sleep(1000);
               CustomLibrary.closeWindowUrlContains("OperationsPortal");
               CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                
               });       
        }
        else{
            expect(false).toBe(true, "Either deal is not created or is not available in operational portal.");
        }
    })

    //TC-304191: LLC Embedded Portal- Request Cancellation-Verify lender Portal for Request cancellation Status- TD
    it('TC-304191: Lender Portal -Verify deal status', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if  (lenderReferenceNumber) {
                CustomLibrary.OpenNewTab();
                browser.sleep(1000);
                CustomLibrary.navigateToWindow("",2);
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyTDDealStatusAfterRC();
                browser.sleep(2000);
                CustomLibrary.closeWindowUrlContains("LenderPortal");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            }
     
        }
        else {
            expect(false).toBe(true, "Unable to Verify Documents in Lender Portal.");
        }
    })
    //Lender cancels the deal
    it('SendDealStatusChangeRequest SOAP service - Cancel deal', function () {
        if  (loginRedirectURL) {
            
            //Lender reinstate deal
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,"CANCEL","CANCELLED");
                       
            browser.sleep(3500);
          }
          else {
              expect(true).toBe(false, "Unable to Cancel the deal"); 
          }  
    }) 

    //Verify deal status after Lender cancels
    it('Verify Deal Status', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'CANCELLED');
        }
        else{
            expect(false).toBe(true, "Error occured while verifying deal cancelled status.");
        }
    })

    //Verify deal cancellation entry by lender in the deal history
    it('Deal Cancelled by Lender  DH Entry', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            //Deal Cancelled State - Verify deal History entry
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealCancelledNew + ' '+TDData.data[LangTD].RFC.commentRFC, true);
          
        }
        else {
            expect(true).toBe(false, "Unable to verify Lender cancellation entry"); 
        }       
    })

    //Verify UI after lender cancels the deal
    it('Verify UI is not accessible in Embedded Portal after deal lender cancels the deal ', function () {
        if  (loginRedirectURL) {     
            
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            RequestCancellation.VerificationPostCancellationByLender();
            
        }
        else 
        {
            expect(true).toBe(false, "Unable to verify UI after lender cancels the deal."); 
        }
       
    })

    //Verify deal status
    it('Verify Deal Status', function () {
         if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'CANCELLED');
            console.log(lenderReferenceNumber);
        }
        else{
            expect(false).toBe(true, "Error occured while checking request cancellation status.");
        }
    })
    
    //TC-303946: Verify Request Cancellation tab is read only
    it('TC-303946: Request Cancellation State', function () {
        if  (loginRedirectURL) {
            //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
           // var dealStatus = LawyerIntegrationTD.ReturnTransactionStatus();
           // var dealStatus = LawyerIntegrationCommon.ReturnTransactionStatus();
            //if (dealStatus == "CANCELLATION REQUESTED") {
                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
           // }
        }
        else {
            expect(true).toBe(false, "Unable to verify request cancellation tab."); 
        } 
       
    })

 });  

 //TC-288341: LLC EmbeddedPortal - Lawyer declines the deal in UNITY - TD
describe('TC-288341: TD deal rejection', function () {
    var Lang = TestData.data.LANGUAGE.value;     
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    

    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    
     //Create TD deal
    it('Create TD Deal', function () {  
    LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            
            OperationsPortal.LoginOperationsPortal();
            
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                
                        if(status != "DRAFT") {
                            TDDealIsInDraft = false;
                        }
                    });
                }
                else {
                    expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                }
            });
        }
        else {
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    //TC-288341: LLC EmbeddedPortal - Lawyer declines the deal in UNITY - TD
    it('TC-288341: Decline TD Deal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "DECLINED"); 
            
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
      
    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
           //Lender declines deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, TestData.data[Lang].WebService.DealStatusDecline);
            
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })
 
    it('Try to log in with declined deal in embedded portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(TDDealID, 'LLCDEAL')).toBe(null, "GetRedirectURL return by service is not null.");
        }
        else {
                expect(true).toBe(false, "Unable to verify log in for declined deal.");
            }
        
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
            
        {
           // LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
           // LenderIntegrationTD.LogLawyerDealEvent(0, 'DECLINED', 'REQUESTCANCELLATION');

            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.LogLawyerDealEventStatus('REQUESTCANCELLATION','DECLINED');
          
       }
        else {
            expect(true).toBe(false, "Unable to GetLawyerDealEvents.");
        }      
    })

    it('Verify Deal Status', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'DECLINED');
            //console.log(lenderReferenceNumber);
        }
        else{
            expect(false).toBe(true, "Error occured while checking declined status.");
        }
    })

    
});


/*
//TC-288475: Verify that Request Cancellation tab is in read only mode when deal is in Completed state- Deal completed using lender integration service
describe('Lawyer performs request cancellation, and the lender first reinstate it & then cancels it.', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
        
      
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });


    //Create deal
    it('Create TD Deal', function () {  
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    //Verify deal status
    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            
            OperationsPortal.LoginOperationsPortal();
            
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                
                        if(status != "DRAFT") {
                            TDDealIsInDraft = false;
                        }
                    });
                }
                else {
                    expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                }
            });
        }
        else {
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })

    //Accept TD deal
    it('Accept TD Deal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            console.log(TDDealID);
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
 
    //Verify Lawyer is able to login to Embedded Portal
    it('Verify Lawyer is able to login to Embedded Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
            }
            else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
    }) 

    it('TC-288475 :SendDealStatusChangeRequest SOAP service - Closing deal', function () {
        if  (loginRedirectURL) {
            //Lender closes deal        
            LenderIntegrationTD.SendDealStatusChange( TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
         }
         else {
             expect(true).toBe(false, "Unable to SendDealStatusChangeRequest"); 
         } 
    })
      
    //TC-288475: Verify Request Cancellation tab is read only when deal is in completed status
    it('Request Cancellation State"', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifyClosedDealMsgTD(TestData.data[Lang].Messages.ClosedDealMsg);
            
            //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
            var dealStatus = LawyerIntegrationTD.ReturnTransactionStatus();
            if (dealStatus == "CANCELLATION REQUESTED") {
                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            }
        }
        else {
            expect(true).toBe(false, "Unable to verify request cancellation tab."); 
        } 
       
    })

 });

*/