
'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var TestData = require('../../../testData/TestData.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var PreFundingInformation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;


describe('LLC Unity Integration-MMS Amendments', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var Lang = TestData.data.LANGUAGE.value;
    var dealSendToLLC;
   
     //TC-288357: LLC EmbeddedPortal - Lender Amendements / Shared & Lender Owned field/ Verify user do not get full access to Portal until the lender amendment is actioned
    // TC-288358: LLC EmbeddedPortal - Lender sends an amendment on Lender fields
    // TC-288368: LLC EmbeddedPortal - Lender Amendements / Shared & Lender Owned field/ Verify user gets full access to Portal after an amendment is actioned
    // TC-288280: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Amendment(s) to Deal
    it('TC-239110, 288357, 329715,245202,329725, 288280, 288368, 288358:  ACCEPT:Lender - Actionable Amendments(Lender only field:Property-Province-actionable=false and and shared field(actionable=true))  ', function () {
    var namelist = [];
        var FCTURN;
        var ClientName;
        var LenderRefNo;
        var ThankYouPageFound = false;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(200);
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                    browser.sleep(200);
                    if(count>0)
                    { 
                        OperationsPortal.LoginOperationsPortal(FCTURN);
                        OperationsPortal.SerchDealDetails(FCTURN);
                        var DealId = OperationsPortal.GetDealID();
                        DealId.then(function (result) {
                            LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        });
                        LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(result,'ACTIVE');

                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                            CustomLibrary.WaitForSpinnerInvisible();
                            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                           
                            CustomLibrary.OpenNewTab();
                            CustomLibrary.navigateToWindow("",2);
                            browser.sleep(2000);
                            MMSPortral.loginMMS()
                            MMSPortral.ClickOnEditViewdeals();
                            MMSCreateDeal.SearchbyFCTURN(FCTURN);
                            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
                            browser.sleep(2000);
                            MMSCreateDeal.EditMortgageforAmendments();
                            MMSCreateDeal.EnterMortgagorNewPaymentforAmendments();
                            MMSCreateDeal.EditNewMortgageforAmendments();
                            MMSCreateDeal.EnterDocumentsData();
                            MMSCreateDeal.sendDealtoLLC();
                            CustomLibrary.closeWindowUrlContains("DealDetails");
                            browser.sleep(2000);
                            CustomLibrary.closeWindowUrlContains("DealList");
                            browser.sleep(200);
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            browser.sleep(200);
                            //TC:329715- 11.6 Standardize portal messages to reference partner instead of Unity - create/regenerate the document-  MMS
                            ManageDocuments.ClickCreateEnglishDocumentNew('Undertaking');  
                            ManageDocuments.VerifyMsgMD(TestData.data[Lang].Messages[Env].CreateDocMsg);
                            DealId.then(function (result) {
                                expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(result, 'LLCDEAL')).toBe(null, "GetRedirectURL return by service is null.");
                        });
                                     
                      });

                        DealId.then(function (result) {
                               // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
                                LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                        });
                        browser.sleep(5000);
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                            CustomLibrary.WaitForSpinnerInvisible();
                            HomePage.VerifyMortgagorName(ClientName);
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            DealHistory.VerifyDealHistoryTableSearch("Lawyer has accepted the changes to the Mortgagor First Name", true);
                            MenuPanel.PrimaryMenuNavigateWithWait('Home');
                            browser.sleep(5000);
                            CustomLibrary.OpenNewTab();
                            CustomLibrary.navigateToWindow("",2);
                            browser.sleep(2000);
                            MMSPortral.loginMMS()
                            MMSPortral.ClickOnEditViewdeals();
                            MMSCreateDeal.SearchbyFCTURN(FCTURN);
                            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
                            browser.sleep(2000);
                            MMSCreateDeal.EditMortgageforAmendments();
                            MMSCreateDeal.EnterDocumentsData();
                            MMSCreateDeal.sendDealtoLLC();
                            CustomLibrary.closeWindowUrlContains("DealDetails");
                            browser.sleep(200);
                            CustomLibrary.closeWindowUrlContains("DealList");
                            browser.sleep(200);
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            browser.sleep(2000);
                            //TC:329725- 11.6 Standardize portal messages to reference partner instead of Unity - Save data -  MMS
                            HomePage.ClickHomePageButtons('Save');
                            HomePage.VerifySaveDataMsg(TestData.data[Lang].Messages[Env].SaveDataMsg);
                           
                        });
         
                   // TC-288280: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Amendment(s) to Deal
                        OutlookPortal.LogintoOutlookNonAngular(); 
                        var emailsubject = "Amendment(s) to Deal - " + firstName + " " + lastName;
                        OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);   
                        OutlookInbox.OutlookLogOut();
                       
                                          
                    });
                } 
                else{
                    expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }
            });
            }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });

    it('TC:239124 REJECT:Lender - Actionable Amendments(Lender only field:Property-Province-actionable=false and and shared field(actionable=true))  ', function () {
        //expected output: both fields will ne updated in LLC Unity but deal history will contain only shared field(actionable true) update
        var namelist = []
        var FCTURN
        var ClosingDate
        var ClientName
        var LenderRefNo
        var  ThankYouPageFound = false;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);
            if(count>0)
            {

                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    var DealId = OperationsPortal.GetDealID();
                    DealId.then(function (result) {
                        LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {});
                        LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(result,'ACTIVE');
                        MMSPortral.loginMMS();
                        MMSPortral.ClickOnEditViewdeals();
                        MMSCreateDeal.SearchbyFCTURN(FCTURN);
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        MMSCreateDeal.EditMortgageforAmendments();
                        MMSCreateDeal.EditNewMortgageforAmendments();
                        MMSCreateDeal.EnterDocumentsData();
                        MMSCreateDeal.sendDealtoLLC();
                        CustomLibrary.closeWindowUrlContains("DealDetails");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        browser.sleep(2000);
                        DealId.then(function (result) {
                           // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "REJECT");
                           LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'REJECT');
                            browser.sleep(60000);
                        });
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyDealHistoryTableEntry(1, "Automation Developer2", "Lawyer/Notary has declined the changes to the Mortgagor First Name");
                        MenuPanel.PrimaryMenuNavigateWithWait('Home');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.VerifyMortgagorName(ClientName);
                        MMSPortral.loginMMSPortal();
                        MMSPortral.ClickOnEditViewdeals();
                        MMSCreateDeal.SearchbyFCTURN(FCTURN);
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        MMSCreateDeal.ClickLLCLAwyerTab();
                        MMSCreateDeal.AcceptAndAcknowldegeAmendmentDecline();
                        MMSCreateDeal.VerifyMortgageforAmendmentsafterDecline(namelist[0]);
                        CustomLibrary.closeWindowUrlContains("DealDetails");
                        CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        browser.sleep(200);
                    });
                }
                else{
                    expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }});
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    });

    it('TC:239111, 329722 -Accept Lender - Actionable Amendments(Lender only field:Property-Province-actionable=false)  ', function () {
        //expected output:field will be updated but no update in Deal History        
        var namelist = []
        var FCTURN
        var DealId
        var LenderRefNo
        var PropertyData
        var ThankYouPageFound ;
        var dealSendToLLC ;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(200);
            if(count>0)
            {
           
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                var DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    });

                });
                MMSPortral.loginMMS();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterMortgagorNewPaymentforAmendments();
                MMSCreateDeal.sendDealtoLLC();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);
                DealId.then(function (result) {
                    //LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
                    LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                });

                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender.", true);
                   // DealHistory.VerifyDealHistoryTableEntry(1, "FCT User", "An amendment has been sent by the Lender.");
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    browser.sleep(5000);
                            CustomLibrary.OpenNewTab();
                            CustomLibrary.navigateToWindow("",2);
                            MMSPortral.loginMMS()
                            MMSPortral.ClickOnEditViewdeals();
                            MMSCreateDeal.SearchbyFCTURN(FCTURN);
                            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
                            browser.sleep(2000);
                            MMSCreateDeal.EditMortgageforAmendments();
                            MMSCreateDeal.EnterDocumentsData();
                            MMSCreateDeal.sendDealtoLLC();
                            CustomLibrary.closeWindowUrlContains("DealDetails");
                            browser.sleep(200);
                            CustomLibrary.closeWindowUrlContains("DealList");
                            browser.sleep(200);
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            browser.sleep(200);
                             //TC:329722- 11.6 Standardize portal messages to reference partner instead of Unity - Upload document -  MMS
                            ManageDocuments.VerifyAdditionalDocsMD("Test File Additional Upld");
                            ManageDocuments.VerifyUploadAmdMsg(TestData.data[Lang].Messages[Env].UploadDocMsg);
                                 

                });
            }  
            else{
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });

    //TC- 329692, 288480, 288356, 288357, 303932, 303934: Change shared field from lender portal & verify that all tabs are in Read only mode except Request Cancellation
    //TC-288359: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer accepts the Amendment
    it('TC:239112, 329712, 288359, 329692, 288480, 288356, 288357, 303932, 303934-Lender Amendements /Shared field/All tabs disabled until Lawyer accepts the Amendment  ', function () {
        //expected output:field will be updated but no update in Deal History         
        var namelist = []
        var FCTURN
        var ClosingDate
        var ClientName
        var LenderRefNo
        var ThankYouPageFound ;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        var ddReasonForCancellation = element(by.id('reasonCode'));
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(200);
            if(count>0)
            {

                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                var DealId = OperationsPortal.GetDealID();
                DealId.finally(() => {
                    DealId.then(function (result) {
                            LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        });
                    });
                });
            
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');

                    CustomLibrary.OpenNewTab();
                    CustomLibrary.navigateToWindow("",2);
                    MMSPortral.loginMMS()
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
                    browser.sleep(2000);
                    MMSCreateDeal.EditMortgageforAmendments();
                    MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(200);
                    CustomLibrary.closeWindowUrlContains("DealList");
                    browser.sleep(200);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    browser.sleep(200);
                    //TC:329712- 11.6 Standardize portal messages to reference partner instead of Unity - Submit-  MMS
                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    HomePage.VerifyAmendmentMsg();
  
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            
                    // TC-303932: Verify System displays all pages as read only except request cancellation page
                    MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
                    RequestCancellation.VerifySubmitButtonStatus('Enabled');
                    expect(ddReasonForCancellation.isEnabled()).toBe(true,"Reason drop down is disabled");
                    MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
                    
                    // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    HomePage.VerifyAmendmentMsg();
                    HomePage.VerifySaveButtonStatus('Disabled');
            
                    MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                    RFFPage.VerifyAmendmentMsg();
                    RFFPage.VerifyallButtonStatus('Disabled');
                    //TC:329690- 11.6 Standardize portal messages to reference partner instead of Unity - To add a new Trust account- MMS
                    RFFPage.VerifyTrustAccIconMMS(); 
                    
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    ManageDocuments.VerifyAmendmentMsg();
                    ManageDocuments.VerifyDisableBrowseButton();
                    
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    FinalReport.VerifyAmendmentMsg();
                    FinalReport.VerifySubmitButtonStatusFinalReport('Disabled');
            
                    //TC-288480: LLC EmbeddedPortal - MMS Lender sends an amendment while user is in UNITY and is able to send Notes - MMS
                    MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                    NotesPage.VerifyAmendmentMsg();
                    NotesPage.ClickNotesButton('NewNote');
                    NotesPage.EnterNotesText(TestData.data[Lang].Notes.StdNote1);
                    NotesPage.ClickNotesButton('SendNote');

                    //TC:329692- 11.6 Standardize portal messages to reference partner instead of Unity - New notes send- VM -MMS
                    //Bug reported message is incorrect
                    NotesPage.VerifySavedChanges(TestData.data[Lang].Messages[Env].NoteMsg);
            
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyAmendmentMsg();
                    
                    MenuPanel.PrimaryMenuNavigateWithWait('Pre-Funding Information');
                    PreFundingInformation.VerifyAmendmentMsg();
                    PreFundingInformation.VerifyallButtonStatus('Disabled');
        
                    DealId.then(function (result) {
                       // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");   
                       LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                    }); 

                    browser.sleep(5000);
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("Lawyer has accepted the changes to the Mortgagor First Name", true);
              
                });
            }
            else{
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });

    //TC-288361: LLC EmbeddedPortal - Lender Amendements /Lender amends field that is excluded from amendment list and user is still able to access FCT Portal
    it('TC-239114, 288361: Amendments- Lender Amendements /Lender amends field that is excluded from amendment list and user is still able to login to LLC UNITY Emulator', function () {
        var namelist = []
        var FCTURN
        //var DealId
        var ClosingDate
        var ClientName
        var LenderRefNo
        //var PropertyData
        var ThankYouPageFound ;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);
    
            if(count>0)
            {

                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                var DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    });
                });
                MMSPortral.loginMMS();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000); 
                MMSCreateDeal.EditNewMortgageforAmendments();
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(200);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);   
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.VerifyHomePage();

                });         
            }
            else{
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });
   
    //TC-288360: LLC EmbeddedPortal - Lawyer amendments/Shared Field/ Lender Rejects amendment
    //TC-307660: LLC-Embedded Portal -  Lawyer Pending Amendment to Lender 'Submit to Lender' as hyperlink - MMS
    //TC-288362: LLC EmbeddedPortal - Lawyer amendments/Shared Field/ Lender accepts the amendment
    it('TC:239115, 288362, 307660,239113, 288360  -Lawyer amendments/Shared Field/ Lender Accepts and Rejects amendment )  ', function () {       
        var namelist = []
        var FCTURN
        var DealId
        var PropertyData
        var ThankYouPageFound ;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);
                if(count>0)
                {
                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    var DealId = OperationsPortal.GetDealID();
                    var NewClosingDate = CustomLibrary.DateConversionMMDDYYYYY2(CustomLibrary.FutureDate());
                    DealId.then(function (result) {
                        LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) { });
                    });
                    DealId.then(function (result) {
                    //  LawyerIntegrationMMS.getAndModifyClosingdateData(result, NewClosingDate);
                        LawyerIntegrationCommon.UpdateTransactionData(result,NewClosingDate,null,null,null,null,null,null, null,null,null,null);
        
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.VerifyHomePage();
                    });
                
                    MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                    MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Enabled');
                    //TC-307660- LLC-Embedded Portal - Lawyer Pending Amendment to Lender- Display 'Submit to Lender' as hyperlink
                    HomePage.ClickSubmitToLenderMsgLnk();
        
                    //Submit lawyer amendments
                    FinalReport.AcceptAmendmentIfAvailable();
        
                    //Verify Submit to Lender menu is disabled
                    MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Disabled');
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("The Lawyer has submitted changes.", true)
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);   
                    MMSCreateDeal.WaitForLawyerEvents();
                    MMSCreateDeal.ClickLLCLAwyerTab();
                    MMSCreateDeal.SubmitLenderAccept();
                    MMSCreateDeal.ClickLenderActionContinue();
                    MMSCreateDeal.StatusMenuClick();
                    MMSCreateDeal.VerifyClosingDateinStatus(NewClosingDate);
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                    browser.sleep(2000);

                    var NewClosingDate2 = CustomLibrary.CurrentOrPastDate();
                    DealId.then(function (result) {
                        LawyerIntegrationCommon.UpdateTransactionData(result,NewClosingDate2,null,null,null,null,null,null, null,null,null,null);
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        CustomLibrary.WaitForSpinnerInvisible();
                        HomePage.VerifyHomePage();
                    });

                    MenuPanel.PrimaryMenuNavigateTo('Submit2Lender');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.ClicklnkSubmittoLender();
                    MenuPanel.VerifyMenuButtonStatus('SubmitToLender');
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("The Lawyer has submitted changes.", true)
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    MMSCreateDeal.WaitForLawyerEvents();
                    MMSCreateDeal.ClickLLCLAwyerTab();
                    MMSCreateDeal.SubmitLenderDecline();
                    MMSCreateDeal.ClickLenderActionContinue();
                    MMSCreateDeal.StatusMenuClick();
                    MMSCreateDeal.VerifyClosingDateinStatus(NewClosingDate);
                    MMSCreateDeal.ClickonViewPolicyHistory(); 
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                    browser.sleep(200);

                    DealId.then(function (result) {
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    });
                    MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    NotesPage.WaitForNoteToBeVisisble();
                    //NotesPage.VerifyAmendmentDeclineNote("The lender has declined the amendment made to the following field(s): Closing Date with a value of " + HomePage.DateConversionwithzeroTrimmed(NewClosingDate) + ".The amendment was declined due to the following reason: ");
                    NotesPage.VerifyAmendmentDeclineNote("The lender has declined the amendment made to the following field(s)");
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("The Lender has declined the amendment made to the following field(s): Closing Date.", true)
                }
                else{
                    expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });
    
     //TC-288923: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Amendment(s) to Deal - MMS PIN
    //TC-288363: LLC Embedded Portal - Lawyer amendments/Lawyer Owned  Field/ No amendment trigerred for Lender
    it('TC:239116, 288363,288923 - No amendment trigerred for Lender when lawyer updates lawyer owned field and No Amendment triggered to lawyer when lender updates PIN)  ', function () {
        var namelist = []
        var FCTURN
        var ThankYouPageFound ;
        var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,  LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            var PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(200);
            if(count>0)
            {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                var DealId = OperationsPortal.GetDealID();
                var RegDate = CustomLibrary.DatePicker();
                var InstrNumber = CustomLibrary.getRandomNumber(5);
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data = 200) {
                            //LawyerIntegrationMMS.getAndSetTransactionData(result, InstrNumber, RegDate);
                            LawyerIntegrationCommon.UpdateTransactionData(result,null,null,[123456],InstrNumber,RegDate,null,null, null,null,null,null);
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                            CustomLibrary.WaitForSpinnerInvisible();
                            HomePage.VerifyHomePage();
                        }
                     });
                });
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.VerifyInstrNoRegDate(InstrNumber, HomePage.DateConversionwithzeroappended(RegDate));
                MenuPanel.VerifyMenuButtonStatus('SubmitToLender','Enabled');
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                browser.sleep(120000);
                MMSCreateDeal.ClickLLCLAwyerTab();
                MMSCreateDeal.VerifyNoLawyerEvent();
                MMSCreateDeal.UpdatePropertyPIN('555555');
                MMSCreateDeal.EnterDocumentsData();                                     
                MMSCreateDeal.sendDealtoLLC();
                DealId.then(function (result) {
                  LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                  CustomLibrary.WaitForSpinnerInvisible();
                  MenuPanel.PrimaryMenuNavigateWithWait('Pre-Funding Information');
                 // MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                  browser.waitForAngular();
                  PreFundingInformation.VerifyPINMMS('123456');
                  CustomLibrary.closeWindowUrlContains("LLC-Portal");
                  CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                  browser.sleep(200);
          
              });

              
              // TC-288923: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Amendment(s) for PIN
              OutlookPortal.LogintoOutlookNonAngular(); 
              var emailsubject = "PIN Amendment(s) to Deal - " + firstName + " " + lastName;
              OutlookInbox.OutlookSearchPINmail(LenderRefNo, emailsubject);   
              OutlookInbox.OutlookLogOut();

            }
            else{
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    });

   
});


