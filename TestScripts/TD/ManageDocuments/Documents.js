'use strict'
var TestData = require('../../../testData/TestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');

describe('Manage Documents : Generate , Re-Generate, Upload Documents', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var IsFinalReportCreated = false;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    var DocName = CustomLibrary.getRandomString(10);
    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
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

    it('Modify registration date,Closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID,  CustomLibrary.CurrentOrPastDate(),  CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));  
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
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
       
    })

    //TC-291340: LLC-Embedded Portal-Manage Document-Verify Auto navigate to Success message - TD
    //TC:291336: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document Uploaded)-  TD
    //TC:299134- LLC-Embedded Portal- Manage Document- Manage Document- Upload Documents - TD
    it('TC: 291334, 291336, 291340-Upload Document', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.clickLawyerUploadDoc();
          //  ManageDocuments.ClickUploadDocument('Collateral (ereg) - Schedule');
            //CustomLibrary.ClosePopup(); 
            CustomLibrary.WaitForSpinnerInvisible();
            browser.sleep(2000);
            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("pdfDocuments");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            browser.waitForAngular();  
           // CustomLibrary.WaitForSpinnerInvisible();
            //TC-291340: LLC-Embedded Portal-Manage Document-Verify Auto navigate to Success message - BNS
            ManageDocuments.VerifyCreatedDocument("Collateral (ereg) - Schedule");
            //TC:291336- LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document Uploaded)-  TD
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('Collateral (ereg) - Schedule Document uploaded successfully.', true);            
         
        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })

    //TC:291344- LLC-Embedded Portal-Manage Document-Verify lender Portal  for Documents - TD
    it('TC-291344: Lender Portal -Verify lawyer documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if  (lenderReferenceNumber) {
                CustomLibrary.OpenNewTab();
                browser.sleep(1000);
                CustomLibrary.navigateToWindow("",2);
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                //Search deal in lender portal
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                //Verify lawyer document
                LenderPortal.VerifyLawyerDoc('Collateral (ereg) - Schedule');
            }
            browser.sleep(2000);
            CustomLibrary.closeWindowUrlContains("LenderPortal");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
        }
        else {
            expect(false).toBe(true, "Unable to Verify Documents in Lender Portal.");
        }
    })

    //TC-291341: LLC-Embedded Portal-Manage Document-Verify navigation away functionality on the Manage Documnet - BNS
    //TC:291342: LLC-Embedded Portal-Manage Document-Verify 'Need Help' functionality on the Manage Documnets tab. BNS
    //TC:299135- LLC-Embedded Portal- Manage Document-Manage Document-Upload "Other" Documents-TD
    it('TC:299135, 291342, 291341- Upload Additional documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //TC-291341: LLC-Embedded Portal-Manage Document-Verify navigation away functionality on the Manage Documnet - BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.EnterDocumentName('Test document');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            CustomLibrary.WaitForSpinner();
            HomePage.NavigateAwayAcceptReject('Cancel');
            browser.sleep(2000);
            CustomLibrary.WaitForSpinner();
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK'); 
            //TC:291342: LLC-Embedded Portal-Manage Document-Verify 'Need Help' functionality on the Manage Documnets tab. BNS
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            HomePage.ClickNeedHelp();
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
            browser.sleep(300);
            ManageDocuments.VerifyLinkOnNeedHelpPage(); 
            CustomLibrary.closeWindowUrlContains("contactus");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            CustomLibrary.WaitForFadderInvisible();
            ManageDocuments.UploadAdditionalDocument(DocName);
            ManageDocuments.VerifyDocumentStatus(DocName, 'Uploaded'); 
            ManageDocuments.VerifyUploadedDocument(DocName);  
        }
        else {
        expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

    //TC:291346- LLC-Embedded Portal-Manage Document-Verify Ops Portal for Documents - TD
    it('TC-291346: Verify Deal Status in Operations Portal', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindow("",2);
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then(function(count){   
                if(count > 0)
                {   
                    OperationsPortal.ClickDocumentsTab();
                    //Verify lawyer uploaded documents
                    OperationsPortal.VerifyUploadedDocument('Other-' + DocName);
                } 
                             
               browser.sleep(1000);
               CustomLibrary.closeWindowUrlContains("OperationsPortal");
               CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
               browser.sleep(2000); 
               });       
        }
        else{
            expect(false).toBe(true, "Either deal is not created or is not available in operational portal.");
        }
    })

    //TC-291339: LLC-Embedded Portal-Manage Document-View Documents  - TD
    //TC-306497: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document created)- TD
    //TC:291337: LLC-Embedded Portal-Manage Document-Manage Document-Create Documents (English and French)-TD
    it('TC:291337, 291339, 306497 - Generate English Document', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            ManageDocuments.ClickCreateEnglishDocumentNew2('Completion of Improvements Confirmation').then(function (IsPresent) {
                if(IsPresent)
                {
                CustomLibrary.navigateToWindow("Doc Forms",2);
                ManageDocuments.SaveCreatedDocument().then(function(){
                browser.sleep(1000);
                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                CustomLibrary.WaitForSpinnerInvisible();
                browser.sleep(500);
                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                //TC-291339: LLC-Embedded Portal-Manage Document-View Documents  - TD
                ManageDocuments.VerifyStatusViewDoc('Completion of Improvements Confirmation','Created');
                //TC-306497: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document created)- TD
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch('The Completion of Improvements Confirmation has been created', true);
                })       
            }
            })
        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })
  
    //TC:291337: LLC-Embedded Portal-Manage Document-Manage Document-Create Documents (English and French)-TD
    it('TC:291337- Generate French Documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
       // ManageDocuments.VerifyDocumentsTableEntry('Request for Funds - Information');
        browser.waitForAngular();
        CustomLibrary.WaitForSpinnerInvisible();
       // ManageDocuments.VerifyDocumentStatus('Request for Funds - Information', 'Submitted');
       
       ManageDocuments.ClickCreateFrenchDocumentNew2('Completion of Improvements Confirmation').then(function (IsPresent) {
        if(IsPresent)
        {
        ManageDocuments.ConfirmDocRegenerate('OK'); 
        CustomLibrary.navigateToWindow("Doc Forms",2);
        ManageDocuments.SaveCreatedDocument().then(function(){
        browser.sleep(1000);
        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);                            
        CustomLibrary.WaitForSpinnerInvisible();
        browser.sleep(500);
        CustomLibrary.closeWindowUrlContains("pdfDocuments");
        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1); 

        browser.waitForAngular();
        CustomLibrary.WaitForSpinnerInvisible();
        ManageDocuments.VerifyCreatedDocument("Confirmation de la réalisation des améliorations");
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        CustomLibrary.WaitForSpinnerInvisible();
        DealHistory.VerifyDealHistoryTableSearch('The Completion of Improvements Confirmation has been created', true);
        })
    }
})
}
    else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }
    })

    //TC:291338: LLC-Embedded Portal-Manage Document-Regenerate Documents - TD
    it('TC:291338 Regenerate French Document', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.ClickRegenerateDocumentNew2('Confirmation de la réalisation des améliorations').then(function (IsPresent) {   
                if(IsPresent)
                   {
                    ManageDocuments.ConfirmDocRegenerate('OK'); 
                    CustomLibrary.navigateToWindow("Doc Forms",2);
                    ManageDocuments.SaveCreatedDocument().then(function(){
                    browser.sleep(1000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);            
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);  

                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    //Verify regenerate entry in deal history
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    CustomLibrary.WaitForSpinnerInvisible();
                    DealHistory.VerifyDealHistoryTableSearch('The Completion of Improvements Confirmation has been created', true);
                    })
                }
            })
        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }

        
            
    })
    
     
})

//Pass Final Report changed to Closing via Solicitor Option. Pending failure is View button enable
describe('Documents not created for completed documents', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var IsFinalReportCreated = false;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    var DocName = CustomLibrary.getRandomString(10);
    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
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
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
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

    //TC:329714- 11.6 Standardize portal messages to reference partner instead of Unity - create/regenerate the document-  TD
    it('TC:329714- Unable to create document with pending lender amendments', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
    
            var ClosingDate = CustomLibrary.FutureDate();
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, ClosingDate, "3.5", TestData.data[Lang].WebService.Province);
            //TC:329714- 11.6 Standardize portal messages to reference partner instead of Unity - create/regenerate the document-  TD
            ManageDocuments.ClickCreateEnglishDocumentNew("Completion of Improvements Confirmation"); 
            ManageDocuments.VerifyMsgMD(TestData.data[Lang].Messages[Env].CreateDocMsg);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            CustomLibrary.WaitForSpinnerInvisible();
            //browser.sleep(2500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    //TC:329720- 11.6 Standardize portal messages to reference partner instead of Unity - Upload document -  TD
    it('TC:329720- Unable to upload additional document with pending lender amendments', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, CustomLibrary.CurrentOrFutureDate(), null, TestData.data[Lang].WebService.Province);
            //TC:329720- 11.6 Standardize portal messages to reference partner instead of Unity - Upload document -  TD
            ManageDocuments.UploadAdditionalDocument(DocName);
            ManageDocuments.VerifyUploadAmdMsg(TestData.data[Lang].Messages[Env].UploadDocMsg);
            MenuPanel.PrimaryMenuNavigateTo('Home');
            ManageDocuments.VerifyNavigateAway();
            ManageDocuments.NavigateAwayAcceptReject('OK');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
            //browser.sleep(8500);
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })

    // TC:329723- 11.6 Standardize portal messages to reference partner instead of Unity - Save data -  TD
    it('TC:329723- Save data message with pending lender amendments', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, CustomLibrary.FutureDate(), "4.4", TestData.data[Lang].WebService.Province);
           
            // TC:329723- 11.6 Standardize portal messages to reference partner instead of Unity - Save data -  TD           
            FinalReport.ClickFRButtons('Save');
            FinalReport.VerifySaveDataMsg(TestData.data[Lang].Messages[Env].SaveDataMsg)
           
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
  
    })


    it('Modify registration date,Closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
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

    it('TC:329709- Create RFF', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
            RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
            //TC:329709- 11.5 Standardize portal messages to reference partner instead of Unity - To add a new Trust account- TD
            RFFPage.VerifyTrustAccIcon();
            FinalReport.AcceptAmendmentIfAvailable();
            RFFPage.ClickRFFButtons('Create');
            //RFFPage.ClickRFFButtons('OK');
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
            browser.sleep(2000);
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);          
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
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
        }   
    })

    it('Update Cosing Date based on weekend', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) 
        {
            //dealID, RegistrationDate, ClosingDate, InstrumentNumber
           // LawyerIntegrationTD.ModifyTDDealIDVdataTypeB(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), TestData.data[Lang].WebService.Province);
           
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);browser.sleep(3500);
        
        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }  
    })

    //TC-329689: 11.5 Standardize portal messages to reference partner instead of Unity - IDV particulars- VM- TD
    it('TC:329689- Verify TDV warning message on Final report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                FinalReport.ClickFRButton('btnCreate');
                //TC-329689: 11.5 Standardize portal messages to reference partner instead of Unity - IDV particulars- VM- TD
                FinalReport.VerifyWarningMsgForIDV(TestData.data[Lang].Messages[Env].WarningMsgIDV);
              }, (error) => {
                expect(true).toBe(feel, "Error occur while accepting amendments.");
            })

           MenuPanel.PrimaryMenuNavigateTo('Home');
           FinalReport.NavigateAwayAcceptReject('OK');


         }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }  
    })

    it('Update Cosing Date based on weekend', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) 
        {
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
                              
        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
           
        }  
    })

    it('Create Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
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
                browser.sleep(2000);
                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                browser.sleep(2500);
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

           MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
           RequestCancellation.VerifyClosedDealMsg("The status on this file has been updated to Completed.");
         }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }  
    })

    it('Check Manage Documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            ManageDocuments.VerifyOnlyViewButtonsEnabled('Request for Funds - Information');
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
    } 
      

    })
})


