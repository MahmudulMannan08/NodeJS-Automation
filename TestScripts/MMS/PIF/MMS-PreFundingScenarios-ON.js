'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var ExceltoJson = require('../../../CustomLibrary/ExceltoJson.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var ManageDocs = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var path = require('path');
const { browser } = require('protractor');
       
//Use this when we need to convert  excel to json for Ontario
 xdescribe('Convert excel to json for ON', function () {
  
  it('Convert XLS to Json', function () {
    var inputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIFSecenario.xls");
    var outputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIF_ON_Questions.json");
    ExceltoJson.ConvertExceltoJson(inputFilename, outputFilename, "PIF_Ontario");

})
});

describe('Prefunding Scenario- Province: ON - Prefunding from LLC Unity', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[2];
    var AssessmentRollNumber = null;

   //TC: 288440 - LLC EmbeddedPortal - PIF > Purchase deal - Mandatory field Functionality
   //TC- 288439  - LLC EmbeddedPortal - PIF > Purchase deal - Display Property Information Questions - ON
   //TC -288442 -  LLC EmbeddedPortal - PIF > Purchase deal -  Ability to Upload and View Documents
    //TC-288446: LLC EmbeddedPortal - PIF > Purchase deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
    //TC-288449 -  LLC EmbeddedPortal - PIF > Purchase deal -  Submit > Trigger Deal History entry
    //TC- 303614- LLC EmbeddedPortal - PIF > Purchase deal -  Required Documents section uploaded documents displayed on Manage Documents page - ON
   it('TC- 262514,262914, 247371, 247387,288440,288439,288442,288446,288449,303614: RegisteredAmount:100000,TransactionType:Purchase', function () {
    var FCTURN
    var DealId
    var PropertyData
    var namelist = []
    var ThankYouPageFound = false;
    var ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
    var ClientName = CustomLibrary.getRandomString(5);
    AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
    MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
    MMSPortral.VerifyThankYouPage().then(function(count) {
        if(count > 0) {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            //CustomLibrary.SwitchTab(1);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function(count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                            // CustomLibrary.SwitchTab(0);
                   // CustomLibrary.CloseTab(1);
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                if(count > 0) {
        
                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    DealId = OperationsPortal.GetDealID();
                    DealId.then(function(result) {
                        LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                            if(data == 200) {
                                //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                                LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                            }
                            else {
                                expect(data).toBe('200', "Unable to Accept the deal.");
                            }
                        })
                    });
                    browser.waitForAngular();
                    DealId.then(function(result) {
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    });
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    //TC: 262514: MMS Pre-Funding Information - implement correct PIN labels for ON
                    //TC: 262914: MMS Pre-Funding Information - Display LRO Number field for ON      
                    PreFundingInfomation.verifyLRONumber('ONTARIO');
                    PreFundingInfomation.VerifyTitleLabelON();
                    browser.sleep(10000);
                    //TC: 288440 - LLC EmbeddedPortal - PIF > Purchase deal - Mandatory field Functionality
                    PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                    PreFundingInfomation.VerifyyManadatoryFieldMessage();
                   PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',5);
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.waitForAngular();
                    //PreFundingInfomation.PreFundDocumentUpload();
                    PreFundingInfomation.UploadDocument('Title Search');
                    PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');

                    PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                    PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
                    PreFundingInfomation.SubmitOKMessageValidation();
                    PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
                    PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");



                    //TC -288442 -  LLC EmbeddedPortal - PIF > Purchase deal -  Ability to Upload and View Documents
                   //TC-288449 -  LLC EmbeddedPortal - PIF > Purchase deal -  Submit > Trigger Deal History entry
                    PreFundingInfomation.VerifyViewDocument('Title Search');
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true)

                    //TC- 303614- LLC EmbeddedPortal - PIF > Purchase deal -  Required Documents section uploaded documents displayed on Manage Documents page - ON
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    ManageDocs.VerifyStatusViewDoc('Title Search','Uploaded');

                    DealId.then(function (result) {
                        //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                       LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                   });


                    //TC-288446: LLC EmbeddedPortal - PIF > Purchase deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
                    MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                    browser.waitForAngular();
                    PreFundingInfomation.VerifySavebuttonDisplay();
                    PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                    PreFundingInfomation.VerifyPopupMsg('If you continue with this action any outstanding amendments to the lender will be submitted automatically. Do you wish to continue?');
                     PreFundingInfomation.SubmitOKMessageValidation();
                    browser.sleep(1000);
                    PreFundingInfomation.VerifyPopupMsg('MMS Pre-Funding information has already been submitted. Are you sure you want to continue with this action?');
                    PreFundingInfomation.SubmitOKMessageValidation();
                    PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds")
 
                   MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                   // CustomLibrary.SwitchTab(1);
                   CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                   browser.sleep(500);
                    MMSCreateDeal.ClickonViewPolicyHistory();
                    MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('New MMS Pre-Funding information received.');
                    MMSCreateDeal.VerifyDocUndeDocSection('Title Search');
                   //CustomLibrary.SwitchTab(0);
                   //CustomLibrary.CloseTab(1);
                   CustomLibrary.closeWindowUrlContains("DealDetails");
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                   
                }
                else {
                   // CustomLibrary.CloseTab();
                    expect(true).toBe(false, "Deal is not sent to LLC.");
                }
            });

        }
        else {
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }
    });
})
    //TC-288447: LLC EmbeddedPortal - PIF > Purchase deal -  Submit
    //TC 288441-LLC EmbeddedPortal - PIF > Purchase deal - Save functionality
    //TC 288448 -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality
    //TC-303572 -LLC EmbeddedPortal - PIF - Purchase deal - Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('TC-288441,288447,288448, 303572: RegisteredAmount<100000,TransactionType:Purchase, VERIFY PIF QUESTIONS Submitted in LLC Unity in MMS FCT Portal', function () {
        var FCTURN
        var DealId
        var PropertyData
        var namelist = []
        var ThankYouPageFound = false;
        var ClosingDate =  CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");

            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            if(count>0)
            {
   
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                            //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                            LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                        }
                        else {
                            expect(data).toBe('200', "Unable to Accept the deal.");
                        }
                    })
                });
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',1);
                 //TC 288448 -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('Cancel');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',1);



                PreFundingInfomation.SavePreFundInfo();
                PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
               PreFundingInfomation.SubmitPreFundInfo();
                PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
                var pfmap = PreFundingInfomation.PreFundDocumentQuestions();
                pfmap.then(function (prefundmap) {
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    //CustomLibrary.SwitchTab(1);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(500);
                    MMSCreateDeal.WaitForLawyerEvents();
                    //TC-303572 -LLC EmbeddedPortal - PIF - Purchase deal - Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
                    MMSCreateDeal.ClickLLCLAwyerEventTab();
                    MMSCreateDeal.VerifyPIFEventandAcknowledgePIF();
                    var smap = MMSCreateDeal.GetPrefundSolicitorInstructionQuestions();
                    smap.then(function (solmap) {
                        MMSCreateDeal.questionAnswerVerifcation(prefundmap, solmap);
                    })
                    //CustomLibrary.SwitchTab(0);
                   // CustomLibrary.CloseTab(1);
                   CustomLibrary.closeWindowUrlContains("DealDetails");
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                });
        }
        else{
            //CustomLibrary.CloseTab();
            expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
        }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    })

    //TC-247394: LLC EmbeddedPortal - PIF > Finance deal -  Submit
    //TC-288451 -  LLC EmbeddedPortal - PIF > Finance deal - Display Property Information Questions - ON
    //TC: 261967- Verify that the Amendment message is displayed upon selecting submit if there are outstanding amendments to the Lender
    //TC: 261969- Verify that the Confirmation message is displayed upon selecting submit if there are no outstanding amendments to the Lender     
    //TC: 261970-Verify that the Success message is displwant to continue with this action?');
    //TC: 261961:Verify that Save button is removed from display once PIF is submitted
    //TC: 261973- Verify that user is able to Submit PIF multiple times and confirmation message displayed to user
    //TC-288452 LLC EmbeddedPortal - PIF > Finance deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
    //TC-288458 -LLC EmbeddedPortal - PIF > Finance deal - Mandatory field Functionality
    //TC-288454 - LLC EmbeddedPortal - PIF > Finance deal -  Ability to Upload and View Documents
    //TC-288457 - LLC EmbeddedPortal - PIF > Finance deal -  Submit > Trigger Deal History entry
     //TC-288453 - LLC EmbeddedPortal - PIF > Finance deal - Save functionality
     //TC- 288455 - LLC EmbeddedPortal - PIF > Finance deal -  Required Documents section uploaded documents displayed on Manage Documents page
    it('TC-247394,261967,261969,261970,261961,261973,288451,288458,288452,288454,288457,288453,288455: RegisteredAmount:100000,TransactionType:Refinance', function () {
        var FCTURN
        var DealId
        var PropertyData
        var namelist = []
        var ThankYouPageFound = false;
        var ClosingDate =  CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           // CustomLibrary.SwitchTab(1);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageDataRefinance( LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            if(count>0)
            {
      
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                            //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                            LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                        }
                        else {
                            expect(data).toBe('200', "Unable to Accept the deal.");
                        }
                    })
                });
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                 //TC-288446 -LLC EmbeddedPortal - PIF > Finance deal - Mandatory field Functionality
                PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                PreFundingInfomation.VerifyyManadatoryFieldMessage();
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',4);
                //PreFundingInfomation.PreFundDocumentUpload();
                PreFundingInfomation.UploadDocument('Title Search');
                //PreFundingInfomation.VerifyDocUploadedSuccessfully();

                //TC-288453 - LLC EmbeddedPortal - PIF > Finance deal - Save functionality
                PreFundingInfomation.SavePreFundInfo();
                PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
               PreFundingInfomation.SubmitPreFundInfoMessageValidation();

               //TC: 261967- Verify that the Amendment message is displayed upon selecting submit if there are outstanding amendments to the Lender
               //TC: 261969- Verify that the Confirmation message is displayed upon selecting submit if there are no outstanding amendments to the Lender     
               //TC: 261970-Verify that the Success message is displwant to continue with this action?');
               //TC: 261961:Verify that Save button is removed from display once PIF is submitted
               //TC: 261973- Verify that user is able to Submit PIF multiple times and confirmation message displayed to user
               PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
               PreFundingInfomation.SubmitOKMessageValidation();
               PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
               PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
               
               PreFundingInfomation.VerifyViewDocument('Title Search');
               
               //TC-288457 - LLC EmbeddedPortal - PIF > Finance deal -  Submit > Trigger Deal History entry
               MenuPanel.PrimaryMenuNavigateTo('dealHistory');
               browser.waitForAngular();
               DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true);

              //TC- 288455 - LLC EmbeddedPortal - PIF > Finance deal -  Required Documents section uploaded documents displayed on Manage Documents page
               MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
               ManageDocs.VerifyStatusViewDoc('Title Search','Uploaded');

                DealId.then(function (result) {
                        //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                       LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });

                //TC-288458 LLC EmbeddedPortal - PIF > Finance deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInfomation.VerifySavebuttonDisplay();
                PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                PreFundingInfomation.VerifyPopupMsg('If you continue with this action any outstanding amendments to the lender will be submitted automatically. Do you wish to continue?');
                PreFundingInfomation.SubmitOKMessageValidation();
                browser.sleep(1000);
                PreFundingInfomation.VerifyPopupMsg('MMS Pre-Funding information has already been submitted. Are you sure you want to continue with this action?');
                PreFundingInfomation.SubmitOKMessageValidation();
                PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds");
            }
            else{
                //CustomLibrary.CloseTab();
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    })

   //TC-303573 -LLC EmbeddedPortal - PIF > Finance deal -  Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('TC-247397, 303573: RegisteredAmount<100000, TransactionType:Refinance, NAVIGATE AWAY, AMENDMENTS', function () {
        var FCTURN
        var DealId
        var PropertyData
        var namelist = []
        var ThankYouPageFound = false;
        var ClosingDate =  CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        var LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        var ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(500);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName,LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000Refinance(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            if(count>0)
            {
          
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                           // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                           LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                        }
                        else {
                            expect(data).toBe('200', "Unable to Accept the deal.");
                        }
                    })
                });
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
  
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                //PreFundingInfomation.PIFAnswerPropertyQuestionsforRegAmountlessthan100000('ONTARIO');
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',3);
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('Cancel');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                //PreFundingInfomation.PIFAnswerPropertyQuestionsforRegAmountlessthan100000('ONTARIO');
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',3);
                PreFundingInfomation.SavePreFundInfo();
                PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                PreFundingInfomation.SubmitPreFundInfo();
                PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
                
                DealId.then(function (result) {
                   // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                });
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                PreFundingInfomation.VerifyMessage1forAmendments('There are pending amendments that have not been submitted to the lender. Select ‘Submit to Lender’ from the left navigation menu to notify the lender of these updates')
                PreFundingInfomation.VerifyMessage2forAmendments("There are pending amendments to the Pre-Funding information that have not been submitted. Select 'Submit'  from the Pre-Funding Info page to notify FCT of these updates.'")
            
        
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.WaitForLawyerEvents();
                //TC-303573 -LLC EmbeddedPortal - PIF > Finance deal -  Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
                MMSCreateDeal.ClickLLCLAwyerEventTab();
                MMSCreateDeal.WaitForEntryToAck();
                //MMSCreateDeal.VerifyPIFEventandAcknowledgePIF(); 
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('All underwriting questions are answered.');
               CustomLibrary.closeWindowUrlContains("DealDetails");
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);

            }
            else{
                //CustomLibrary.CloseTab();
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});
    })
    
});



