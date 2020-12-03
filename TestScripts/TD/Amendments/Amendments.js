'use strict'
var TestData = require('../../../testData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;

//TC-239115, 290853: LLC EmbeddedPortal - Lawyer amendments/Shared Field/ Lender accepts the amendment
describe('TC-239115, 290853: Lawyer amendments Shared Field Cloisng Date', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('TC-239115: Modify Closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.FutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500); 
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })
    
    it('TC-239115: Navigate to Deal history and verify Lawyer gets Lender Amendments', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
           MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            MenuPanel.PrimaryMenuNavigateTo('Submit2Lender');
            MenuPanel.ConfirmSubmitChangesToLender(true);
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("The Lawyer has submitted changes.", true);
            DealHistory.VerifyDealHistoryTableSearch("Closing Date changed", true);
    
        }
        else 
        {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })
    
    it('TC-239115: Verify Lawyer Deal Events', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null')) 
        {
            /*LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
            LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');
            LenderIntegrationTD.LogLawyerDealEvent(1, 'ACTIVE', 'AMENDMENTS');*/
            
            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('ACCEPT',true);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('AMENDMENTS',true);
        }
        else {
            expect(false).toBe(true, "LenderRefNumber is not available for the deal.");
        } 
    })
})

//TC-290854: LLC EmbeddedPortal - Lawyer amendments/Lawyer Owned  Field/ No amendment trigerred for Lender
describe('TC-290854: Lawyer amendments/Lawyer Owned  Field instrument number', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Modify Instrument Number', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
           console.log("Deal ID " + TDDealID);
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })
    
    it('Navigate to Deal history and no new entry is added Lawyer for gets Lender Amendments', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
           // MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
           // DealHistory.VerifyDealHistoryTableEntry(1, "Automation Developer2", "LLC deal has been accepted.");

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("The Lawyer has submitted changes.", false);

            //Verify Submit to Lender menu is not enabled
            MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Disabled');

        }
        else 
        {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })

    it('Verify no Changes in Lawyer deal event', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null')) 
        {
            //LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
           // LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');

            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('ACCEPT',true);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('AMENDMENTS',false);
        }
        else {
            expect(false).toBe(true, "LenderRefNumber is not available for the deal.");
        } 
    })

})

//TC-245202, 290855: Lender Amendements / Shared & Lender Owned field/ Verify user gets full access to Portal after an amendment is actioned
describe('TC-245202, 290855: Lender changes shared field closing date and Lender Owned field Mortgage Rate', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var ClosingDate = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('TC-245202: Lender updates deal closing date and interest rate', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            ClosingDate = CustomLibrary.FutureDate();
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, ClosingDate, "3.5", TestData.data[Lang].WebService.Province);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("TC-245202: Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    it("TC-245202: Verify History Logs", function () {
        //if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) { 
           // loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                //HomePage.VerifyHomePage();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch("Lawyer has accepted the changes to the Closing Date", true);
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                var CDate = CustomLibrary.DateConversion(ClosingDate)
                HomePage.VerifyClosingdateData(CDate);
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
       // }
      ///  else {
       //     expect(false).toBe(true, "Error occured while accepting the deal.");
       // } 

    
    })

})

//TC-290850: Lender sends an amendment on Lender fields
describe('TC-290850: Lender sends an amendment on Lender fields - Mortgage Rate', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var ClosingDate = null;
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Lender updates lender owner field - interest rate', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            ClosingDate = CustomLibrary.CurrentOrFutureDate(); 
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, ClosingDate, "3.5", TestData.data[Lang].WebService.Province);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    it("Verify History Logs", function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender.", true);
            
        }
        else 
        {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })
})
//TC-303930: LLC Embedded Portal- Request Cancellation-Enable Cancellation Requested when User accesses embedded portal with read-only access - There are lender changes that have not been actionned- TD
//TC-239124: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Rejects the Amendment
describe('TC-239124: Lawyer Rejects change in shared feild closing date', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LenderAmendmentMsg = TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS;
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var ddRequestForFunds = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));
    //var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
 
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Lender updates deal shared feild closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, CustomLibrary.FutureDate(), null, TestData.data[Lang].WebService.Province);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    //TC-303930: LLC Embedded Portal- Request Cancellation-Enable Cancellation Requested when User accesses embedded portal with read-only access - There are lender changes that have not been actionned- TD
    it('TC-303930, 329711: Verify all tabs are read only in Embedded Portal except Request Cancellation', function () {
           
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null))   
         {
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyDealAcceptedCheckMark('LLC');
    
            // TC-303931, 303930: Verify System displays all pages as read only except request cancellation page
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifySubmitButtonStatus('Enabled');
            expect(ddReasonForCancellation.isEnabled()).toBe(true,"Reason drop down is disabled");
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            
            // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Message is not present');
            HomePage.VerifySaveButtonStatus('Disabled');
    
            //TC:329711- 11.6 Standardize portal messages to reference partner instead of Unity - Submit -  TD
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            expect(ddRequestForFunds.isEnabled()).toBe(false,"Funding request drop down is enabled");
            
                  
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            ManageDocuments.VerifyDisableBrowseButton();
            
            //TC:329711- 11.6 Standardize portal messages to reference partner instead of Unity - Submit -  TD
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            FinalReportPage.VerifySubmitButtonStatusFinalReport('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        
       }
        else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
             }
                    
    })

    //TC-239124: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Rejects the Amendment
    it("TC-239124: Lawyer views changes and Rejects it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'REJECT');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    it("TC-239113: Verify History Logs", function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("Lawyer/Notary has declined the changes to the Closing Date", true);
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            var CDate = CustomLibrary.DateConversion(CustomLibrary.CurrentOrFutureDate())
            HomePage.VerifyClosingdateData(CDate);
        }
        else 
        {
            
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

    
    it('Verify no Changes in Lawyer deal event', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null')) 
        {
            //LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
           //LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');


            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('AMENDMENTS',false);

        }
        else {
            expect(false).toBe(true, "LenderRefNumber is not available for the deal.");
        } 
    })
})

//TC-288356: LLC EmbeddedPortal - MMS Lender sends an amendment while user is in UNITY
//TC-290851: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Accepts the Amendment
describe('TC-290851, 288356, 290852, 290849: Lawyer Accepts change in shared feild closing date', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LenderAmendmentMsg = TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS;
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var ddRequestForFunds = element(by.xpath("//select[@formcontrolname=\'fundingRequestType\']"));
    
 
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

    it('Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('TC-288356: Lender updates deal shared feild closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, CustomLibrary.FutureDate(), null, TestData.data[Lang].WebService.Province);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    //TC-290849: LLC EmbeddedPortal - Lender Amendements / Shared & Lender Owned field/ Verify user do not get full access to Portal until the lender amendment is actioned
    //TC-303930: LLC Embedded Portal- Request Cancellation-Enable Cancellation Requested when User accesses embedded portal with read-only access - There are lender changes that have not been actionned- TD
    it('TC-303930, 290849: Verify all tabs are read only in Embedded Portal except Request Cancellation', function () {
           
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null))   
         {
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyDealAcceptedCheckMark('LLC');
    
            // TC-303931, 303930: Verify System displays all pages as read only except request cancellation page
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifySubmitButtonStatus('Enabled');
            expect(ddReasonForCancellation.isEnabled()).toBe(true,"Reason drop down is disabled");
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            
            // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Message is not present');
            HomePage.VerifySaveButtonStatus('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            expect(ddRequestForFunds.isEnabled()).toBe(false,"Funding request drop down is enabled");
            
                  
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            ManageDocuments.VerifyDisableBrowseButton();
            
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            FinalReportPage.VerifySubmitButtonStatusFinalReport('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
            
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        
       }
        else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
             }
                    
    })

    //TC-290851: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Accepts the Amendment
    it("TC-290851: Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    it("TC-239113: Verify History Logs", function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("Lawyer has accepted the changes to the Closing Date", true);
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            
        }
        else 
        {
            
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

   
})




