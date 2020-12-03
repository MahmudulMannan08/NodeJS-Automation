'use strict'
var TestData = require('../../../testData/TestData.js');
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');

describe('LLC-MMS: MANAGE DOCUMENTS', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var FCTURN
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[0];
    var BnkLenderName = LenderDetails.Name;
    var spec = LenderDetails.Spec;
    var branch = LenderDetails.Branch;
    var contactName = LenderDetails.ContactName;
    var programType = LenderDetails.ONTARIO.ProgramType;
    var mortgageProduct = LenderDetails.MortgageProduct;


    it('TC: 236453-Verify Documents cannot be created when status is Completed, Cancelled or Cancellation Request', function () {
        {
            var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
            var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
            var ClientName = CustomLibrary.getRandomString(5);
            MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
            MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
                MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                MMSCreateDeal.EnterMortgagorData();            
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();            
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
                if(count>0)
                {
                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    var DealId = OperationsPortal.GetDealID();
                    DealId.then(function (result) {
                            LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                    });
                    MenuPanel.PrimaryMenuNavigateTo("ReqCancel");
                    RequestCancellation.SelectReasonType("Client request to cancel deal");
                    RequestCancellation.SelectReasonType("Conflict of interest");
                    RequestCancellation.SelectReasonType("Lawyer/Notary cannot act on deal");
                    RequestCancellation.SelectReasonType("Other");
                    RequestCancellation.SelectReasonType("Client request to cancel deal");
                    RequestCancellation.SubmitCancellation();
                    RequestCancellation.ConfirmCancellation("Cancel");
                    RequestCancellation.SubmitCancellation();
                    RequestCancellation.ConfirmCancellation("OK");
                    RequestCancellation.VerifySubmitButtonStatus("Disabled");
                    RequestCancellation.VerifySucessfulySubmittedChanges();
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    HomePage.VerifyLawyerDocAfterCancel();
                }
                else{
                    expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }
            });
            }
            else
            {
                expect(false).toBe(true, "Thank You page is not Found.");
            }});
        }
    });
    
    //TC: 236455- Verify that user is able to upload PDF Documents based on Upload instructions and able to view PDF documents
    //TC: 240897-Document Create, Implict Save and Deal History
    //TC: 242631 - Additional Documents-Upload Word document with same name
    
    it('TC: 236454,242631,236455, 240897, 288389, 291329, 288391, 306389, 288375, 288370, 288390, 288372, 288371, 288927, 288369, 288927, 288373, 288389, 306389, 288372,  - Additional Documents', function () {
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
            MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);
            if(count>0)
            {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                var DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) { });
                });
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                CustomLibrary.WaitForSpinnerInvisible();
               //TC-288390: LLC-Embedded Portal-Manage Document-Verify navigation away functionality on the Manage Documnet - MMS
                ManageDocuments.EnterDocumentName('Test document');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                CustomLibrary.WaitForSpinner();
                HomePage.NavigateAwayAcceptReject('Cancel');
                browser.sleep(2000);
                CustomLibrary.WaitForSpinner();
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');

                //TC-288370: LLC-Embedded Portal- Manage Document-Upload "Other" Documents-MMS
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.VerifyAdditionalDocsNew("Test File Additional Upld");

                //TC-288375: LLC-Embedded Portal-Manage Document-Verify Auto navigate to Success message - MMS
                ManageDocuments.VerifySuccessMessage('Other-Test File Additional Upld was uploaded successfully.');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();

                //TC-288371--LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document uploaded)- MMS
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                CustomLibrary.WaitForSpinnerInvisible();
                DealHistory.VerifyDealHistoryTableSearch('Other-Test File Additional Upld Document uploaded successfully.', true);

                //TC: 242631 - Additional Documents-Upload Word document with same name
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyAdditionalDocswithSameName("Test File Additional Upld");
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                CustomLibrary.WaitForSpinnerInvisible();
                DealHistory.VerifyDealHistoryTableSearch('Other-Test File Additional Upld Document uploaded successfully.', true);

               //TC:288391: LLC-Embedded Portal-Manage Document-Verify 'Need Help' functionality on the Manage Documnets tab. MMS
               MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
               ManageDocuments.ClickNeedHelp();  
               browser.waitForAngular();
               CustomLibrary.WaitForSpinnerInvisible();
               CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
               browser.sleep(300);
               CustomLibrary.navigateToWindow("LLC Lawyer Portal",2);
               ManageDocuments.VerifyLinkOnNeedHelpPage(); 
               CustomLibrary.closeWindowUrlContains("contactus");
               CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);       
               ManageDocuments.ClickCreateEnglishDocumentNew2('Undertaking').then(function (IsPresent) {
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
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                CustomLibrary.WaitForSpinnerInvisible();
               
                ManageDocuments.VerifyStatusViewDoc('Undertaking','Created');
                //TC-288389, 306389: LLC-Embedded Portal-Manage Document-Create Deal History Entry (for Document created)- MMS
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.WaitUntilDealHistoryEntry('The Undertaking has been created'); 
                DealHistory.VerifyDealHistoryTableSearch('The Undertaking has been created', true);
               
        })
        }
    })
                //TC-288373: LLC-Embedded Portal-Manage Document- Regenerate Documents - MMS
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.ClickRegenerateDocumentNew2('Undertaking').then(function (IsPresent) {   
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
                         //TC: 236454- Document re-generate> Timestamp and Status
                        ManageDocuments.VerifyStatusViewDocTimeStamp('Undertaking','Created');
                        MenuPanel.PrimaryMenuNavigateWithWait('Home');
                        //Verify regenerate entry in deal history
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.WaitUntilDealHistoryEntry('The Undertaking has been created'); 
                        DealHistory.VerifyDealHistoryTableSearch('The Undertaking has been created', true); 
                            })
                        }
            })
                //TC-288927: LLC Embedded Portal - Verify document uploaded in Embedded portal is a visiable in MMS portal
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.WaitForLawyerDocuments('Other-Test File Additional Upld');
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);
                //TC-291329: LLC-Embedded Portal-Manage Document-Verify Ops Portal for Documents - MMS
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                OperationsPortal.ClickDocumentsTab();
                OperationsPortal.VerifyUploadedDocument('Other-Test File Additional Upld');
             

          /*     //TC-288369: LLC-Embedded Portal- Manage Document- Upload Documents - MMS
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.ClickUploadDocument('Undertaking');  
              
           */    
               
            }
            else{
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }
        });
        }
        else{
            expect(false).toBe(true, "Thank You page is not Found.");  
        }});
    });

});



