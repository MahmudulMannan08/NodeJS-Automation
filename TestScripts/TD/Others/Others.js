'use strict'
var TestData = require('../../../testData/TestData.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js')
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInBox = require('../../../PageObjectMethods/Outlook/Outlookinbox.js')
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');

//TC-238998: LLC Embedded Portal - Verify Lender Recieves Deal Event When Lawyer Accepts the deal
describe('TC-238998: Verify Lender gets deal event when lawyer accepts deal', function () {
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
 
    it('TC-238998: Verify Lender Recieves Deal Event', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
        {
            LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
            LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
})

//TC-238999: LLC Embedded Portal - Verify Lawyer recieves email notification when lender cancels the deal and is not able to login to LLC Emulator
//TC 239002: LLC Embedded Portal - Operational portal - Verify deal status is changed to Cancelled when lender cancels the deal
describe('TC-238999: LLC Unity UI', function () {
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
 
    it('Verify Need Help Link for TD', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyFooter();
                HomePage.ClickNeedHelp();
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
                browser.sleep(300);
                NeedHelp.VerifyNeedHelpPage();
                CustomLibrary.closeWindowUrlContains("contactus");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
    })

    it('Verify Lawyer recieves Deal Creation email', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            OutlookPortal.LogintoOutlookNonAngular();
            OutlookInBox.VerifyEmailOutlook("New Deal", lenderReferenceNumber);
            OutlookInBox.OutlookLogOut();
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Verify Accepted State in Operation Protal', function () {
        OperationsPortal.LoginOperationsPortal();
        OperationsPortal.SearchDeal('Deal Id', TDDealID);
        OperationsPortal.VerifyDealStatus('ACTIVE')
    })

    it('Lender Cancells Deal ', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
          //  LenderIntegrationTD.CancelTDDeal(TDDealID, lenderReferenceNumber);
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,"CANCEL","CANCELLED");
            
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, TestData.data[Lang].WebService.DealStatusCancelled);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })

    
    it('TC-238999: Lender Cancells Deal and verify email', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
         /*   OutlookPortal.LogintoOutlookNonAngular();
            OutlookInBox.OutlookSearchmail(lenderReferenceNumber, "Deal Cancelled");
            OutlookInBox.OutlookLogOut();*/

            OutlookPortal.LogintoOutlookNonAngular();
            OutlookInBox.VerifyEmailOutlook("Deal Cancelled", lenderReferenceNumber);
            OutlookInBox.OutlookLogOut();
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('TC-238999: Lawyer not able to login to LLC Emulator', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(TDDealID, 'LLCDEAL')).toBe(null, "GetRedirectURL Service should return null URL.");
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('TC 239002: Verify Cancelled Status in Operation Protal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SearchDeal('Deal Id', TDDealID);
            OperationsPortal.VerifyDealStatus('CANCELLED')
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
})

