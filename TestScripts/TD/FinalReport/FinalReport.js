'use strict'
var TestData = require('../../../testData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js')
var Notes = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;


describe("Lawyer recieves lender amendments while submitting SROT", function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
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

    it('Accept Deal & Verify Home Page, Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE")
        }
        else 
        {
            expect(TDDealIsInDraft).toBe(false, "TD DEAL is in DRAFT STATE");
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })
   
   it('Modify Closing date and registration date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
              //dealID, RegistrationDate, ClosingDate, InstrumentNumber
            //LawyerIntegrationTD.ModifyTDDealIDVdata(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6)); 
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeA",null,null,null);
           browser.sleep(3500);
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Login to LLC Unity and try to Create Final Report', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                browser.sleep(1000);
                FinalReport.AcceptAmendmentIfAvailable();
                var EC = protractor.ExpectedConditions;
                browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                    browser.sleep(1000);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    FinalReport.SelectClosingViaCB("Title");
                    FinalReport.EnterTitleInsuranceScheduleBExceptions();
                }, (error) => {
                    console.error("Unable to accept the amendments. " + error);
                }) 
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

    it('Create Lender Amendment while Final Report in progress', function () {
        LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, CustomLibrary.CurrentOrFutureDate(), 3.5, TestData.data[Lang].WebService.Province_AB);
    })

    it('Submit Final Report and verify pending lender amendment', function () {
        FinalReport.ClickFRButton('btnCreate');
       // FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg + '. ' + TestData.data[Lang].Messages.LenderAmendmentMsg);
        FinalReport.VerifyMessage(TestData.data[Lang].Messages[Env].SaveDataMsg);
    })
})

//TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
describe('IDV with Power of Attorney', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var IsFinalReportCreated = false;
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

    it('Accept Deal & Verify Home Page, Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE")
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
        else 
        {
            expect(TDDealIsInDraft).toBe(false, "TD DEAL is in DRAFT STATE");
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })
   
    it('Create RFF', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
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
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableEntry(1, LawyerFullName, TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName); 
                }
            })
        }
        else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }   
    })

    it('Modify Closing date and registration date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
              //dealID, RegistrationDate, ClosingDate, InstrumentNumber
            //LawyerIntegrationTD.ModifyTDDealPOAdata(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6)); 
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeA",null,null,"Y");
           browser.sleep(3500);
       
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    //TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
    it('TC-245343, 245345:Create Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                //TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
                FinalReport.ClickFRButton('btnCreate');
                FinalReport.VerifyFinalReportIsCreated().then(function(result)
                {
                IsFinalReportCreated = result;
                console.log("Value is " + result);
                if(result)
                { 
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                }
            })
            }, (error) => {
                expect(true).toBe(feel, "Error occur while accepting amendments.");
            })

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableEntry(1, LawyerFullName, TestData.data[Lang].DealHistory[Env].TDFinalReportClosed); 
            DealHistory.VerifyDealHistoryTableEntry(2, LawyerFullName, TestData.data[Lang].DealHistory[Env].TDFinalReportBySolicitor);
            DealHistory.VerifyDealHistoryTableEntry(3, LawyerFullName, TestData.data[Lang].DealHistory[Env].TDFinalReportCreated);
            DealHistory.VerifyDealHistoryTableEntry(4, LawyerFullName, TestData.data[Lang].DealHistory[Env].TDFinalReportCreated);
        
            RequestCancellation.VerifyClosedDealMsg(TestData.data[Lang].Messages.ClosedDealMsg);
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }  
    })

    it('Verify Final Report in Lender Portal', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if  (lenderReferenceNumber) {
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Request for Funds - Information');
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Final Report on Title');
            }
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

    it('Verify Final Report in Operation Portal', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SearchDealBNS(TDDealID);
            OperationsPortal.ClickDocumentsTab();
            OperationsPortal.VerifyUploadedDocument("Final Report on Title");
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

    it('Verify Lawyer Deal Events', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null')) 
        {
            //LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
            //LenderIntegrationTD.LogLawyerDealEvent(2, 'COMPLETED', 'SUBMITSROT');

            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('SUBMITSROT',true);
        }
        else {
            expect(false).toBe(true, "LenderRefNumber is not available for the deal.");
        } 
    })
})

//TC-245402: LLC Embedded Portal/ Navigate away functionality
//TC288475: Verify Request cancellation tab is in read only mode for completed deal
describe('TC-245402: Navigate Away while on FR page', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    var ClosedDealMsg = TestData.data[Lang].Messages.ClosedDealMsg;
    
    

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
       // lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {       
            OperationsPortal.LoginOperationsPortal();        
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {
                if(count > 0) {
                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                        expect(status).not.toBe("DRAFT", "Deal Status for TD Deal.");
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

    it('Accept Deal & Verify Home Page, Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE")
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
        else 
        {
            expect(TDDealIsInDraft).toBe(false, "TD DEAL is in DRAFT STATE");
            expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
        }
    })
   
    it('Create RFF', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
            RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
            RFFPage.ClickRFFButtons('Create');
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                    console.log("Value is " + result);
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
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyDealHistoryTableSearch((TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName), true); 
                    }
                })
       
        }
        else {
            expect(false).toBe(true, "Unable to verify Title Number on RFF Page.");
        }   
    })

    it('Modify Closing date and registration date', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) 
        {
            //dealID, RegistrationDate, ClosingDate, InstrumentNumber
            //LawyerIntegrationTD.ModifyTDDealIDVdataTypeB(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), TestData.data[Lang].WebService.Province);
           // browser.sleep(3500);

            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(false).toBe(true, "Unable to update closing date.");
        } 
    })

    it('TC-245402, 288399, 288400, 288402, 288404, 288406: Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                FinalReport.NavigateAway();
                FinalReport.VerifyNavigateAway();
                FinalReport.NavigateAwayAcceptReject('Cancel');
                FinalReport.NavigateAway();
                FinalReport.NavigateAwayAcceptReject('OK');
                
                //TC-288399: LLC Embedded Portal/ UI/UX Mandatory field Functionality on the SROT Page
                //TC-288400: LLC Embedded Portal/ Field identifier and Required fields message is displayed
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.ClickFRButton('btnCreate');
                FinalReport.WCPMandatoryfieldValidation();
                
                FinalReport.SelectClosingViaCB("Soli");
                FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                FinalReport.ClickFRButton('btnSave');
                FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                FinalReport.ClickFRButton('btnCreate');
                CustomLibrary.WaitForSpinnerInvisible();
                FinalReport.VerifyFinalReportIsCreated().then(function(result)
                {
                    console.log("Value is " + result);
                    if(result)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(2000);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        //TC-288402: LLC Embedded Portal/ Create/ Re-Create SROT Document :Step 1
                        FinalReport.EnterSourceID('ID:1234');
                        FinalReport.ClickFRButton('btnCreate');
                        RFFPage.ClickRFFButtons('OK');
                       // CustomLibrary.ClosePopup();
                       CustomLibrary.WaitForSpinnerInvisible();
                       browser.sleep(2000);
                       CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                       browser.sleep(2000);
                       CustomLibrary.closeWindowUrlContains("pdfDocuments");
                       CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);

                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        RFFPage.ClickRFFButtons('Submit');
                        FinalReport.VerifySubmitAlert(TestData.data[Lang].DealHistory[Env].AlertFRSubmit);
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        
                        //TC-288404: LLC Embedded Portal/ Submit SROT via Solicitor opinion
                        FinalReport.VerifyFRSubmitMsg(TestData.data[Lang].DealHistory[Env].TDFinalReportBySolicitor);
                        FinalReport.VerifyClosedDealMsg(TestData.data[Lang].Messages.ClosedDealMsg);
                
                        //TC-288402: LLC Embedded Portal/ Create/ Re-Create SROT Document : Step 2
                        MenuPanel.PrimaryMenuNavigateTo('ManageDocuments');
                        CustomLibrary.WaitForSpinnerInvisible();
                        ManageDocuments.VerifyStatusViewDocTimeStamp('Final Report', 'Submitted');
                        CustomLibrary.WaitForSpinnerInvisible();

                        //TC-288406: LLC Embedded Portal/ SROT Submitted - TD deal to be displayed Read-only
                        MenuPanel.PrimaryMenuNavigateWithWait('Home');
                        HomePage.VerifyClosedDealMsg(ClosedDealMsg);
                        HomePage.VerifySaveButtonStatus('Disabled');

                        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                        RFFPage.VerifyFundingDropDownStatus();
                        RFFPage.VerifyClosedDealMsg(ClosedDealMsg);
                            
                        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                        ManageDocuments.VerifyClosedDealMsg(ClosedDealMsg);
                        ManageDocuments.VerifyDisableBrowseButton();
                
                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        FinalReport.VerifyClosedDealMsg(ClosedDealMsg);
                        FinalReport.VerifyallButtonStatusFinalReport('Disabled');

                        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                        Notes.VerifyClosedDealMsg(ClosedDealMsg);

                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyClosedDealMsg(ClosedDealMsg);
            

                    }
                   
                })
               
                           
               }, (error) => {
                expect(true).toBe(feel, "Error occur while accepting amendments.");
            })

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true); 
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportBySolicitor, true);           
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true); 
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true); 
            RequestCancellation.VerifyClosedDealMsg(TestData.data[Lang].Messages.ClosedDealMsg);
              } 
        else {
            expect(false).toBe(true, "Unable to Create Final Report.");
          }  
    })

     //TC-288475: Verify Request Cancellation tab is read only when deal is in completed status
    it('Request Cancellation State"', function () {
    if  (loginRedirectURL) {
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        RequestCancellation.VerifyRequestCancellationTab('Disabled');                          
       
    }
    else {
        expect(true).toBe(false, "Unable to verify request cancellation tab."); 
    } 
   
})


})

//Sprint 1
//262489- TD RFF/COR - Verify PIN labels for ON RFF
//262421 - Final Report TD- add WCP closing option does not display to the UI - ON, NB
//Sprint 3
//TC: 267257-Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - closing option is hidden for TD deals for ON and NB(Done as per the steps to check closing option other than WCP is present. No deal history as it was not mentioned in steps)

//TC: 262489,262421,267257
describe('verify PIN labels and WCP closing option for ON RFF', function () {
    var TDDealID = null;
    var TDDealIsInDraft = null;
    var loginRedirectURL = null;
    var TDDealPresentInOperationalPortal = null;
    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
        LenderIntegrationTD.CleanUpScript();
    });

   
    it('Create TD Deal', function () {
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
       
    })

    it('Verify TD Deal status in OP', function() {
        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
       // lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

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

    it('TC: 262489  Verify Title Number', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
            RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
            RFFPage.VerifyPIN();
        }
        else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
        } 
    })

    it('TC: 262421,267257, 306223: Verify WCP closing option not to display for ON ', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
        MenuPanel.PrimaryMenuNavigateTo('FinalReport');
        HomePage.NavigateAwayAcceptReject('OK');
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        FinalReport.VerifyTDWCPNotPresent();
        FinalReport.VerifyTDTitleSolicitorClosingPresentNoWCP();
    }
    else {
        expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        
    }
    })

})

//TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
//TC-245343: LLC Embedded Portal/ Save Final Report
//TC-245343: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
//TC-245343: LLC Embedded Portal/ Submit SROT via Solicitor opinion
//TC-288863: Verify LLC Embedded Portal- TD Final Report - Add Leasehold
describe('TC- 288863: Create final report IDV Type A Closing Via Solicitor"s opinion Insurance e2e with Estate tye as Leasehold', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    var IsFinalReportCreated = null;
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
        IsFinalReportCreated = false;
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
                console.log(TDDealID);
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else 
            {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

     it('Modify registration date,Closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
           // LawyerIntegrationTD.ModifyTDTransactionData(TDDealID,  CustomLibrary.CurrentOrPastDate(),  CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));  
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('Create RFF', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
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
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableEntry(1, LawyerFullName, TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName); 
                }
               
            })     
           
        }
        else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }
       
    })

    //TC- 288863: Verify LLC Embedded Portal- TD Final Report - Add Leasehold
    it('Update Cosing Date based on weekend', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) 
        {
            //dealID, RegistrationDate, ClosingDate, InstrumentNumber, Estate type
           // LawyerIntegrationTD.ModifyTDDealIDVTypeAEstateType(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), 'LEASEHOLD');
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeA",null,'LEASEHOLD',null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }  
    })
   
    //TC- 288863: Verify LLC Embedded Portal- TD Final Report - Add Leasehold
    it('TC-288863, 245343, 245344, 245345, 245346, 245347: Create Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                // FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                //TC-245343: LLC Embedded Portal/ Save Final Report
                FinalReport.ClickFRButton('btnSave');
                FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);

                //Submitting blank lease hold fields and verifying the required fields error messages
                FinalReport.VerifyFRValidationMsgTD();

                //Verifying Leasehold sections
                FinalReport.VerifyLeasehold();
                FinalReport.RegistrationParticulars();
                //Entering data in the leasehold fields
                FinalReport.SubmitLeaseInfo('TestLease', 'LeaseCompany', 'Unit No:5', 'Street No:123', 'StreetLine1', 'StreetLine2', 'City', 'Ontario', 'V5L0Z2', 'Canada', 'Term', 'Clause Text', 'Yes');
                //TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
                FinalReport.ClickFRButton('btnCreate');

                CustomLibrary.WaitForSpinnerInvisible();
                FinalReport.VerifyFinalReportIsCreated().then(function(result)
                {
                    IsFinalReportCreated = result;
                    console.log("Value is " + result);
                    if(result)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                        DealHistory.WaitUntilDealHistoryEntry('The File has been closed');
                        //TC-245343: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportBySolicitor, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);
                        //TC-245347: LLC Embedded Portal/ Milestone is updated and displayed with Green circle
                        FinalReport.VerifyFRCheckmarkStatus('Complete');
                    }
                   
                })
               
                
            }, (error) => {
                expect(true).toBe(feel, "Error occur while accepting amendments.");
            })

        }
        else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }  
    })

    it('Check Manage Documents', function () {
        if (IsFinalReportCreated) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyDocumentsTableEntry('Request for Funds - Information');
            ManageDocuments.VerifyDocumentsTableEntry('Final Report on Title');
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            
        }
    })

    it('Verify Final Report in Lender Portal', function () {
        if (IsFinalReportCreated) {
            if  (lenderReferenceNumber) {
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Request for Funds - Information');
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Final Report on Title');
            }
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        }
    })

    it('Verify Final Report in Operation Portal', function () {
        if (IsFinalReportCreated) {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SearchDealBNS(TDDealID);
            OperationsPortal.ClickDocumentsTab();
            OperationsPortal.VerifyUploadedDocument("Final Report on Title");
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        }
    })

    it('Verify Lawyer Deal Events', function () {
        if ( IsFinalReportCreated)  
        {
            //LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
           // LenderIntegrationTD.LogLawyerDealEvent(2, 'COMPLETED', 'SUBMITSROT');

            LenderIntegrationTD.GetTDLawyerDealEvents(lenderReferenceNumber);
            LenderIntegrationTD.ParseGetLawyerDealEventsResponse('SUBMITSROT',true);
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        } 
    })



})