'use strict'
var TestData = require('../../../testData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var Env = RunSettings.data.Global.ENVIRONMENT.value;

describe("Deal History for TD", function () {
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var lenderReferenceNumber = null;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID =null;
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
           
           console.log(TDDealID);
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Cancel deal through Lender Integration Service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,"CANCEL","CANCELLED");
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, TestData.data[Lang].WebService.DealStatusCancelled);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })

    it('Reinstate TD Deal Via Lender Integration service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
            LenderIntegrationTD.ChangeTDDealStatus(TDDealID, lenderReferenceNumber,"REINSTATE","CANCELLED");
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Verify Deal Status using GetTransactionStatus Service', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && (typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber != null)) {
           //Lender cancels deal
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, TestData.data[Lang].WebService.DealStatusActive);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to change deal status.");
           
        }  
    })

    it('Create RFF', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.SelectFundingReqType("Request for Funds");
                RFFPage.SendRequestedAmount(2500);
                RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
                RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                if(result)
                {
                    
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyCreatedRFFConfirmationMessage();
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                    CustomLibrary.WaitForSpinnerInvisible(); 
            }
        })  
            }
            else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
    })

    it('Verify Deal History', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableEntry(1, LawyerFullName, TestData.data[Lang].DealHistory[Env].RFFSubmitted, LawyerFullName);
            DealHistory.VerifyDealHistoryTableEntry(2, LawyerFullName, "The Request for Funds - Information has been created");
            DealHistory.VerifyDealHistoryTableEntry(3, LawyerFullName, "The Request for Funds - Information has been created");
            DealHistory.VerifyDealHistoryTableEntry(4, 'TTD User', "The Lender has reactivated the deal for the following reason: CANCELLED");
            DealHistory.VerifyDealHistoryTableEntry(5, 'TTD User', "Deal has been cancelled by Lender.");
            DealHistory.VerifyDealHistoryTableEntry(6, LawyerFullName, "LLC deal has been accepted.");
            DealHistory.VerifyDealHistoryTableEntry(7, 'TTD User', "A new deal has been submitted by the Lender.");
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
    })
})
