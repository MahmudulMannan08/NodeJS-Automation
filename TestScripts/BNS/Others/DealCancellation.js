'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var BNSData = require('../../../testData/BNS/BNSTestData.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
describe('TC-238994: BNS deal rejection', function () {
    var BNSFctUrn = null;
    var Lang = TestData.data.LANGUAGE.value;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });
    it('CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    //TC-238994, 288930: LLC EmbeddedPortal - Lawyer declines the deal in UNITY
    it('TC-238994, 288930: Decline Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Declining the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "DECLINED");
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           //Lender declines deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(BNSFctUrn, TestData.data[Lang].WebService.DealStatusDecline);
            
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })
 
    it('Try to log in with declined deal', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null, "GetRedirectURL return by service is null.");
            
        }
        else {
            expect(true).toBe(false, "Unable to verify log in for declined deal.");
        }
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
           LenderIntegrationBNS.LogLawyerDealEvent(0, 'DECLINED', 'REQUESTCANCELLATION');

        }
        else {
            expect(true).toBe(false, "Unable to GetLawyerDealEvents.");
        }      
    })

    it('Verify deal status', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Declined deal status - Verify Getlawyerdealevent
            var DealStatus = LenderIntegrationBNS.ReturnDealStatus('REQUESTCANCELLATION');
            expect(DealStatus).toBe('DECLINED');
        }
        else {
            expect(true).toBe(false, "Unable to verify Deal Status.");
        }  
    })

    
});

//TC-238934
describe('BNS login with cancelled deal, reinstated deal', function () {
    var BNSFctUrn = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var lenderReferenceNumber = null;
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });
    it('CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('SendDealStatusChangeRequest SOAP service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           //Lender cancels deal
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusCancel, TestData.data[Lang].WebService.DealStatusChangeReasonCancel);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })

    
    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(BNSFctUrn, TestData.data[Lang].WebService.DealStatusCancelled);
            browser.sleep(4500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })



      //TC- 247726: LLC EmbeddedPortal - Verify Lawyer receives email notification when lender cancels the deal and is not able to login to FCT Portal again
    it('TC- 247726: Verify Lawyer recieves Deal Cancellation email', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            browser.ignoreSynchronization = true;
            OutlookPortal.LogintoOutlookNonAngular();
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            //Verify Lawyer received new deal email
            OutlookInbox.VerifyEmailOutlook("Deal Cancelled", lenderReferenceNumber);
            OutlookInbox.OutlookLogOut();
        }
        else {
            expect(true).toBe(false, "Unable to verify Cancellation email.");
        } 
    })

        //TC-238934  - LLC EmbeddedPortal - User is not able to access portal once deal is cancelled by Lender
    it('TC-238934: Try log in with Cancelled Deal', function () {
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
               //Try access with rejected deal
                expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null);
             }
             else {
                expect(true).toBe(false, "Unable to verify log in to embedded portal with cancelled deal");
             }       
        })

    it('SendDealStatusChangeRequest SOAP service - Re-instating deal', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
             //Lender reinstates deal
             LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusReinstate, TestData.data[Lang].WebService.DealStatusChangeReasonReinstate);
         }
         else {
            expect(true).toBe(false, "Unable to Reinstate the deal.");
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

    it('Try log in with Reinstated Deal', function () {
        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
             LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
                CustomLibrary.WaitForSpinnerInvisible();
               // HomePage.VerifyHomePage();
               // HomePage.VerifySaveButtonStatus('Enabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.VerifyComment('Enabled');
                RFFPage.VerifySubmitButtonStatus('Enabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                HomePage.VerifySaveButtonStatus('Enabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NotesPage.VerifyNewNoteButtonStatus('Enabled');

                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
                MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
                RequestCancellation.VerifySubmitButtonStatus('Enabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableEntry(1, RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value + ' ' + RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value, TestData.data[Lang].DealHistory.ActivityDealReinstated + ' ' + TestData.data[Lang].WebService.DealStatusChangeReasonReinstate + '.');
        }
        else {
            expect(true).toBe(false, "Unable to verify log in to embedded portal with reinstated deal");
        } 
    })

    it('Verify Lawyer recieves Deal Reinstation email', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
             OutlookPortal.LogintoOutlookNonAngular();
             //Verify Lawyer received new deal email
             OutlookInbox.VerifyEmailOutlook("Deal Reactivated", lenderReferenceNumber);
             OutlookInbox.OutlookLogOut();
         }
         else {
             expect(true).toBe(false, "Unable to verify Reactivation email.");
         }
    })
})

//TC-288468, 288472, 303925, 303926, 303935, 303947, 303952, 288470: Request cancellation scenarios
describe('BNS request cancellation scenarios', function () {
    var BNSFctUrn = null;
    var loginRedirectURL = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var CancellationRequestMessage = TestData.data[Lang].Messages.CancellationRequestMsg;
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var lenderReferenceNumber = null;
    

 
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });
    it('CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    //Accept BNS deal
    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            console.log('lenderReferenceNumber = ' + lenderReferenceNumber);
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    //Verify Lawyer is able to login to Embedded Portal
    it('Verify Lawyer is able to login to Embedded Portal', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
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
     it('TC-288469, 288470, 288472, 288467, 303935, 303952 :Request for cancellation-Reason: Client request to cancel deal', function () {
        if  (loginRedirectURL) {     
        //Navigate to Request cancellation page, verify layout

        // TC-288467: Verify Request Cancellation section
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifyRFCPage();
        RequestCancellation.VerifyReqCancellationSection();

        // TC-288472: Submit request cancellation without selecting option, Verify validation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyMissinfieldMessag();
        browser.sleep(1500); 

        // TC-288469: Navigation away
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('Cancel');
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('OK');
        
        // TC-288467: Select request cancellation option from drop down
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);

        // TC-288467: Submit request for cancellation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyConfirmCancellationSection();
        RequestCancellation.ConfirmCancellationDynamic('OK');
        HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);  

        // TC-288470, 303935, 303952: Verify System displays all pages as read only except for View /download documents and Send/view/print notes
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifySubmitButtonStatus('Disabled');
        expect(ddReasonForCancellation.isEnabled()).toBe(false,"Reason drop down is enabled");
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        HomePage.VerifySaveButtonStatus('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        expect(StatusMsg.getText()).toContain(CancellationRequestMessage);
        RFFPage.VerifySubmitButtonStatus('Disabled');
        
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
        
        //Request Cancellation State - Verify deal History entry
        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityReqCancel + ' ' + TestData.data[Lang].RequestForCancellation.CancelReasonOption1.trim(),true);
            

        }
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

    it('GetTransactionData REST service', function () {
        if  (loginRedirectURL) {
            LawyerIntegrationCommon.GetTransactionStatus(BNSFctUrn);
           
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
       
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
    })

    //TC-303926: LLC Embedded Portal- Request Cancellation- Verify Operations Portal for Request cancellation Status- BNS
    it('TC-303926: Operations portal - Verify Request Cancellation status', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Operations portal
            CustomLibrary.OpenNewTab();
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindow("",2);
            OperationsPortal.LoginOperationsPortal();

            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(BNSFctUrn);
            OperationsPortal.ClickMilestinesAndStatus();
            //TC- 304192: Verify deal status in Operation portal is Request cancellation
            OperationsPortal.VerifyDealStatus('CANCELLATION REQUESTED');
            //CustomLibrary.CloseTab();
           // CustomLibrary.SwitchTab(0);
           CustomLibrary.closeWindowUrlContains("OperationsPortal");
           CustomLibrary.navigateToWindow("LLC Lawyer Portal",1); 
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify Deal in Operational Portal.");
        }
    })

    //TC-303925: LLC Embedded Portal- Request Cancellation- Verify Lender Portal for Request cancellation Status- BNS
    it('TC-303925: Lender portal - Verify Request Cancellation status', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Lender portal
            CustomLibrary.OpenNewTab();
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindow("",2);
            LenderPortal.LoginToLenderPortalBNS( RunSettings.data.Global.LLC[Env].BNSLenderUser, RunSettings.data.Global.LLC[Env].BNSLenderPassword);

            //Search deal in lender portal
            
            LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
            LenderPortal.VerifyTDDealStatusAfterRC(); 
            //CustomLibrary.CloseTab();
            //CustomLibrary.SwitchTab(0);
            CustomLibrary.closeWindowUrlContains("LenderPortal");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify Lender Portal.");
        }
    })

    //Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
    it('TC-288470: Request Cancellation State"', function () {
    if  (loginRedirectURL) {
        //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
        var dealStatus = LawyerIntegrationBNS.ReturnTransactionStatus();
        if (dealStatus == "CANCELLATION REQUESTED") {
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
        }
    }
    else {
        expect(true).toBe(false, "Unable to verify request cancellation tab."); 
    } 
   
    })

    //TC-247509: LLC Embedded Portal/ Submitted Request Cancellation Deal History entry
    it('TC-247509: Request Cancellation State - Getlawyerdealevent, DH', function () {
    if  (loginRedirectURL) {
        var DealStatus = LenderIntegrationBNS.ReturnDealStatus('REQUESTCANCELLATION');
        expect(DealStatus).toBe('CANCELLATIONREQUESTED');

        //Request Cancellation State - Verify deal History entry
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityReqCancel + ' ' + TestData.data[Lang].RequestForCancellation.CancelReasonOption1.trim(), true);
    }
    else {
        expect(true).toBe(false, "Unable to verify Request Cancellation State"); 
    }       
    })

    //TC-238933: LLC EmbeddedPortal - Lawyer sends cancellation request and Lender Cancels the deal
    it('TC-238933: SendDealStatusChangeRequest- Cancelling deal', function () {
    if  (loginRedirectURL) {
      //Lender cancels deal
        LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusCancel, TestData.data[Lang].WebService.DealStatusChangeReasonCancel);
    }
    else {
        expect(true).toBe(false, "Unable to Cancel deal"); 
    } 
    
    })

    //Lender cancels deal while user is logged in
    //TC-303947: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is cancelled by Lender  - BNS
    //TC-238932: LLC EmbeddedPortal - Lender cancels the deal while user is in Embedded 
    it('TC-238932, 303947: Cancel Deal ', function () {
    if  (loginRedirectURL) {
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
        //Verify RC tab is disabled
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
    }
    else {
            expect(true).toBe(false, "Unable to verify UI after deal is Cancelled"); 
    }   
    })

   //Lender reinstate the deal
    it('SendDealStatusChangeRequest SOAP service - Re-instating deal', function () {
        if  (loginRedirectURL) {
            
            //Lender reinstate deal
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusReinstate, TestData.data[Lang].WebService.DealStatusChangeReasonReinstate);
            browser.sleep(3500);
          }
          else {
              expect(true).toBe(false, "Unable to Reinstate deal"); 
          }  
    })  
   
    //TC- 288468: Request cancellation by the lawyer using reason: Other
    it('TC-288468 :Request for cancellation-Reason: Other', function () {
       if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
          
            //Navigate to Request cancellation page, verify layout
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifyRFCPage();
        
            // TC-288467: Verify Request Cancellation section
            RequestCancellation.VerifyReqCancellationSection();

            // TC-288467: Select request cancellation option from drop down
            RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption4);
            RequestCancellation.CommentonRFC(BNSData.data[Lang].RFC.commentRFC);
        
            // TC-288467: Submit request for cancellation
            RequestCancellation.SubmitCancellationDynamic();
            RequestCancellation.VerifyConfirmCancellationSection();
            RequestCancellation.ConfirmCancellationDynamic('OK');
            HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

        
        }
        else {
              expect(true).toBe(false, "Unable to verify UI after deal is Reinstated."); 
        }  
    })

   
})

