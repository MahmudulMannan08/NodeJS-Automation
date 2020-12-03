'use strict'
var TestData = require('../../../testData/TestData.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')


// RFF
//TC- 245302: LLC Embedded Portal/ Create/ Re-Create Request for Funds Document 
//TC- 245309: LLC Embedded Portal/ Create and Submit RFF - Verify Deal History entry is created
//TC- 245335:LLC Embedded Portal/ Submit Request for Funds
describe('TD Deal RFF Deposit to my/our TD Canada Trust  account', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    //var lenderReferenceNumber = null;
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

    it('TC-239050, 245302, 245309, 245335: Create RFF', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                //Verify RequestForFunds in Dropdown
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
            expect(false).toBe(true, "Unable to Create RFF.");
            }
    })
})

//TD Deal RFF Other FI Deposit (to my trust account with other FI previously approved by TDCT) 
describe('TD Deal RFF Other FI Deposit', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    //var lenderReferenceNumber = null;
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

    //TC-245307: LLC Embedded Portal/ RFF Milestone is updated and displayed with Green circle
    it('TC- 245335,245307: Create RFF', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Other FI Deposit (to my trust account with other FI previously approved by TDCT)');
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
                    RFFPage.VerifyRFFCheckmarkPostSubmission(); 
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableEntry(1, LawyerFullName, TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName); 
                }
            })
        }
        else {
            expect(false).toBe(true, "Unable to Create RFF.");
        }
    })
})

//TC-245299: Save Request for Funds 
describe('TD Deal RFF Pickup Cheque at Branch', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
   // var lenderReferenceNumber = null;
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
        //lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
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

    it('TC-245299, 329687, 245335, 288393, 288394, 288393, 288397, 288398, 288386, 288396, 288385: Create RFF', function () {
       if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");

            //TC-288397: LLC Embedded Portal/ Verify Navigate Away functionality on "RFF" page
            RFFPage.NavigateAway();
            RFFPage.VerifyNavigateAway();
            RFFPage.NavigateAwayAcceptReject('Cancel');
            RFFPage.NavigateAway();
            RFFPage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.ClickRFFButtons('Create');

            //TC-288394: LLC Embedded Portal/ Field identifier and Required fields message is displayed
            //TC-288393: LLC Embedded Portal/ UI/UX Mandatory field Functionality on the RFF Page
            //TC-329687: 11.5 Standardize portal messages to reference partner instead of Unity - Field(s) to be completed in Unity VM- TD
            RFFPage.MandatoryfieldValidation();  
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Pickup cheque at branch');
            RFFPage.EnterBranchNumber(34567);
            RFFPage.SelectNotificationOfChangecb();
            RFFPage.DeSelectNotificationOfChangecb();
            RFFPage.SelectNotificationOfChangecb();
            RFFPage.EnterNotificationofChangeComments("Text");
            RFFPage.SelectReturnMortgageCB();
            RFFPage.ClickRFFButtons('Save');

            //TC-245299: Save Request for Funds 
            RFFPage.VerifyConfirmationMessage("Your changes have been saved successfully.");
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
            RFFPage.VerifyConfirmationMessage("Request for Funds - Information was created successfully.");
            RFFPage.VerifySubmitButtonStatus('Enabled');
            RFFPage.ClickRFFButtons('Submit');
            RFFPage.ClickRFFButtons('OK');
            RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
            CustomLibrary.WaitForSpinnerInvisible();  
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch((TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName),true);
                }
            })
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SendRequestedAmount(5500);
            RFFPage.ClickRFFButtons('Create');

            //TC-288398: LLC Embedded Portal/ Warning message is displayed on RFF Resubmission > User selects Cancel
            RFFPage.VerifyWarningMessageTD(TestData.data[Lang].DealHistory[Env].WarningMessageTD);
            RFFPage.ClickRFFButtons('Cancel');
            RFFPage.ClickRFFButtons('Create');
            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                if(result)
                {
            //TC-288386: LLC Embedded Portal/ Warning message is displayed on RFF Resubmission > User selects OK        
            RFFPage.VerifyWarningMessageTD(TestData.data[Lang].DealHistory[Env].WarningMessageTD);
            RFFPage.ClickRFFButtons('OK');
            CustomLibrary.WaitForSpinnerInvisible();
            browser.sleep(2000);
            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("pdfDocuments");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            //TC-288396: LLC Embedded Portal/ Resubmission of RFF and Submit button enabled/disabled--Doubt how button enable again?
            RFFPage.VerifySubmitButtonStatus('Enabled');
            RFFPage.ClickRFFButtons('Submit');
            RFFPage.VerifyWarningMessageSubmit(TestData.data[Lang].DealHistory[Env].WarningMessageSubmit);
            RFFPage.ClickRFFButtons('OK');
            RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyConfirmationMessage('Request for Funds - Information has been submitted successfully.');
            RFFPage.VerifyRFFCheckmarkPostSubmission();
            RFFPage.VerifySubmitButtonStatus('Disabled');

            //TC-288385: LLC Embedded Portal/ Create/ Re-Create Request for Funds Document 
            MenuPanel.PrimaryMenuNavigateTo('ManageDocuments');
            CustomLibrary.WaitForSpinnerInvisible();
            ManageDocuments.VerifyStatusViewDocTimeStamp('Request for Funds - Information ', 'Submitted');
            CustomLibrary.WaitForSpinnerInvisible();
                }
            })        
        }
        else {
            expect(false).toBe(true, "Unable to Create RFF.");
        }    
    })
})

describe('TD Deal RFF Mail/Courier Cheque and Check Get Lender Deal events', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
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

    it('TC- 245335: Create RFF', function () {
       if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Mail/Courier cheque');
            RFFPage.ClickRFFButtons('Create');
            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                if(result)
                {
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(2000);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    browser.sleep(2500);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyConfirmationMessage("Request for Funds - Information was created successfully.");
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                    CustomLibrary.WaitForSpinnerInvisible();  
                }
        })
        }
        else {
            expect(false).toBe(true, "Unable to Create RFF.");
        }    
    })

    it('Check Lender Deal events for RFF', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
        {
            LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
            LenderIntegrationTD.LogLawyerDealEvent(0, 'ACTIVE', 'ACCEPT');
            LenderIntegrationTD.LogLawyerDealEvent(1, 'ACTIVE', 'REQUESTFORFUNDS');
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })
})

// Confirmation of Registartion COR
describe('Verify Registration Date & Closing Date cannot be in future for COR', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
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
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Modify  Assesment Role Number and Reg. Date to future date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
           // LawyerIntegrationTD.ModifyTDTransactionData(TDDealID,  CustomLibrary.FutureDate(),  CustomLibrary.FutureDate(), CustomLibrary.getRandomNumber(5));  
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.FutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.FutureDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('TC-239050: Verify COR cannot be created with registration date and closing date in future', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

            //Verify "Confirmation of Registration"
            RFFPage.SelectFundingReqType("Confirmation of Registration");
            MenuPanel.PrimaryMenuNavigateTo('Home');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible()
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
            RFFPage.SelectFundingReqType("Confirmation of Registration");
            RFFPage.VerifybtnCreatePresent();
            RFFPage.VerifybtnSavePresent();
            RFFPage.VerifySubmitButtonStatus(false);
            RFFPage.ClickRFFButtons('Create');
            RFFPage.VerifyClosingDateErrorMessage();
            RFFPage.VerifyegistrationDateErrorMessage();
        }
        else {
            expect(false).toBe(true, "Unable to Create RFF.");
        } 
    
    })
})

//Sprint 1
//262489- TD RFF/COR - Verify PIN labels for ON RFF
//262421 - Final Report TD- add WCP closing option does not display to the UI - ON, NB
//Sprint 3
//TC: 267257-Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - closing option is hidden for TD deals for ON and NB(Done as per the steps to check closing option other than WCP is present. No deal history as it was not mentioned in steps)

//SPRINT 1 TC: 262490-FCT - TD RFF/COR - Verify PIN labels for ON- COR
describe('TC: 262490:Verify PIN labels for ON - COR & COR with Registration Date and Closing Date as Current date', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
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


    it('Modify Assesment Role Number and Reg. Date to current date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID,  CustomLibrary.CurrentOrPastDate(),  CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(5));  
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

 
    it('Verify  Title Number on RFF & Verify COR Can be created with registration date and closing date as current date', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Confirmation of Registration");
            RFFPage.ClickRFFButtons('Create');
            RFFPage.VerifyPIN();

            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                if(result)
                {
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(2000);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    browser.sleep(2500);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyCreatedRFFConfirmationMessage();
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted , true);
                }
               
            }) 
        }
        else {
            expect(false).toBe(true, "Unable to Verify COR.");
        } 
    })

    
})

