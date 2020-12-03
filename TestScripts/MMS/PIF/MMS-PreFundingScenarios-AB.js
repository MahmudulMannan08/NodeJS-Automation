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

 //Use this when we need to convert  excel to json for Alberta
xdescribe('Convert excel to json for AB', function () {
        
         it('Convert XLS to Json', function () {
            var inputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIFSecenario.xls");
            var outputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIF_AB_Questions.json");
            ExceltoJson.ConvertExceltoJson(inputFilename, outputFilename, "PIF_Alberta");
    
        })
});

describe('Prefunding Scenario- Province:AB - Prefunding from LLC Unity ', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[0];
    var BnkLenderName = LenderDetails.Name;
    var spec = LenderDetails.Spec;
    var branch = LenderDetails.Branch;
    var contactName =LenderDetails.ContactName;
    var programType = LenderDetails.ALBERTA.ProgramType;
    var mortgageProduct = LenderDetails.MortgageProduct;
    var AssessmentRollNumber = null;

    //TC-303595: LLC EmbeddedPortal - PIF - Purchase deal -  Submit - AB
   //TC -303594 -  LLC EmbeddedPortal - PIF > Purchase deal -  Ability to Upload and View Documents
    //TC- 303596:LLC EmbeddedPortal - PIF > Purchase deal -  Submit > Trigger Deal History entry - AB
    //TC-303597: LLC EmbeddedPortal - PIF > Purchase deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
    //TC-288450 - LLC EmbeddedPortal - PIF > Purchase deal -  Required Documents section uploaded documents displayed on Manage Documents page - AB
    //TC- 303591- LLC EmbeddedPortal - PIF > Purchase deal - Display Property Information Questions - AB
    //TC: 303592 - LLC EmbeddedPortal - PIF > Purchase deal - Mandatory field Functionality
    it('TC 303595,303595, 303596,303597,288450,303591,303592: Province:AB, RegisteredAmount:100000,TransactionType:Purchase', function () {
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
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           // CustomLibrary.SwitchTab(1);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(500);
            MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
            MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ALBERTA');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
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
                       // browser.sleep(3500);
                    }
                    else {
                        expect(data).toBe('200', "Unable to Accept the deal.");
                    }
                    })
                });
                browser.waitForAngular();
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                //TC: 262907 MMS Pre-Funding Information - hide LRO Number field for AB
                //TC: 262510 MMS Pre-Funding Information - implement correct PIN labels for AB
                PreFundingInfomation.VerifyTitleLabel();
                PreFundingInfomation.verifyLRONumber('ALBERTA');

                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                CustomLibrary.WaitForSpinnerInvisible();
                browser.waitForAngular();

                //TC: 303592 - LLC EmbeddedPortal - PIF > Purchase deal - Mandatory field Functionality
                PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                PreFundingInfomation.VerifyyManadatoryFieldMessage();
        
               PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ALBERTA',5)
               CustomLibrary.WaitForSpinnerInvisible();
               browser.waitForAngular();
              // PreFundingInfomation.PreFundDocumentUpload();
              // PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
            //TC -303594 -  LLC EmbeddedPortal - PIF > Purchase deal -  Ability to Upload and View Documents
              PreFundingInfomation.UploadDocument('Title Search');
              browser.sleep(1000);
              PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
              
             
            /*  CustomLibrary.WaitForSpinnerInvisible();
              browser.sleep(1000);
              PreFundingInfomation.VerifyDocumentUploadedSuccessfully('Title Search').then(function(txt)
              {
                  console.log("Date is " + txt);
                  expect(txt).not.toBe("","Document is not uploaded successfully.");
                  if(txt != "")
                  {
                      PreFundingInfomation.VerifyViewDocument('Title Search');
                  }
                
              })  */
               
             
               //TC-303595: LLC EmbeddedPortal - PIF - Purchase deal -  Submit - AB
               PreFundingInfomation.SubmitPreFundInfoMessageValidation();
               PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
               PreFundingInfomation.SubmitOKMessageValidation();
               PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
               PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
                
             
                //TC- 303596: LLC EmbeddedPortal - PIF > Purchase deal -  Submit > Trigger Deal History entry - AB
  
                PreFundingInfomation.VerifyViewDocument('Title Search');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true)
                             
                //TC-288450 - LLC EmbeddedPortal - PIF > Purchase deal -  Required Documents section uploaded documents displayed on Manage Documents page - AB
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocs.VerifyStatusViewDoc('Title Search','Uploaded');

                DealId.then(function (result) {
                   // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                   LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
               });


                //TC-303597: LLC EmbeddedPortal - PIF > Purchase deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
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
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('New MMS Pre-Funding information received.');
                MMSCreateDeal.VerifyDocUndeDocSection('Title Search');
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
               }
            else{
               // CustomLibrary.CloseTab();
                expect(true).toBe(false, "Deal is not sent to LLC.");
            }});
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }});  
    })


    //TC-303595: LLC EmbeddedPortal - PIF > Purchase deal -  Submit
    //TC 303593-LLC EmbeddedPortal - PIF > Purchase deal - Save functionality
    //TC 303598 -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality
    //TC-303608 -LLC EmbeddedPortal - PIF - Purchase deal - Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('TC 303593, 303595,303608,303598:Province:AB, RegisteredAmount<100000,TransactionType:Purchase', function () {
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
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(500);
            MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
            MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ALBERTA');
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000(mortgageProduct);
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
                browser.waitForAngular();
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinner();
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ALBERTA',1);
                //TC  -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('Cancel');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ALBERTA',1);
                PreFundingInfomation.SavePreFundInfo();
                PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                PreFundingInfomation.SubmitPreFundInfo();
                PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');

                var pfmap = PreFundingInfomation.PreFundDocumentQuestions();
                pfmap.then(function (prefundmap) {
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                   CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                   browser.sleep(500);
                    MMSCreateDeal.WaitForLawyerEvents();
                    //TC- -LLC EmbeddedPortal - PIF - Purchase deal - Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
                    MMSCreateDeal.ClickLLCLAwyerEventTab();
                    MMSCreateDeal.WaitForEntryToAck();
                    //MMSCreateDeal.VerifyPIFEventandAcknowledgePIF();
                    var smap = MMSCreateDeal.GetPrefundSolicitorInstructionQuestions();
                    smap.then(function (solmap) {
                        MMSCreateDeal.questionAnswerVerifcation(prefundmap, solmap);
                    })
                   CustomLibrary.closeWindowUrlContains("DealDetails");
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                });
            }
            else{
                    //CustomLibrary.CloseTab();
                    expect(true).toBe(false, "Deal is not sent to LLC.");
            }});
        }  
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        };})
    })

     //TC- LLC EmbeddedPortal - PIF > Finance deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
    //TC- -LLC EmbeddedPortal - PIF > Finance deal - Mandatory field Functionality
    //TC- - LLC EmbeddedPortal - PIF > Finance deal -  Ability to Upload and View Documents
    //TC- - LLC EmbeddedPortal - PIF > Finance deal -  Submit > Trigger Deal History entry
     //TC- - LLC EmbeddedPortal - PIF > Finance deal - Save functionality
     //TC-  - LLC EmbeddedPortal - PIF > Finance deal -  Required Documents section uploaded documents displayed on Manage Documents page
    it('Province:AB, RegisteredAmount:100000,TransactionType:Refinance', function () {
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
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);
            MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
            MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ALBERTA')
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageDataRefinance(mortgageProduct);
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
                browser.waitForAngular();
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                CustomLibrary.WaitForSpinner();
                 //TC- -LLC EmbeddedPortal - PIF > Finance deal - Mandatory field Functionality
                 PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                 PreFundingInfomation.VerifyyManadatoryFieldMessage()
                PreFundingInfomation.AnswerPIFQuestionsAllProvinces("ALBERTA",4);
                PreFundingInfomation.UploadDocument('Title Search');
                //PreFundingInfomation.VerifyDocUploadedSuccessfully();
                PreFundingInfomation.SavePreFundInfo();

                //TC: 261865- Save button along with vaidation message
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
                
                //TC- - LLC EmbeddedPortal - PIF > Finance deal -  Submit > Trigger Deal History entry
                MenuPanel.PrimaryMenuNavigateTo('dealHistory');
                browser.waitForAngular();
                DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true);
 
               //TC-  - LLC EmbeddedPortal - PIF > Finance deal -  Required Documents section uploaded documents displayed on Manage Documents page
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocs.VerifyStatusViewDoc('Title Search','Uploaded');
 
                DealId.then(function (result) {
                   // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);  
                   LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });

                //TC- LLC EmbeddedPortal - PIF > Finance deal -  Resubmit Property Information Form (Unity owned PIF field is updated)
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
                    expect(true).toBe(false, "Deal is not sent to LLC. ");
            }});
        }  
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        };})
    })

    //TC- -LLC EmbeddedPortal - PIF > Finance deal -  Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('LLCUnityPreFunding Scenario- With no document-Province:AB, RegisteredAmount<100000,TransactionType:Refinance, NAVIGATE AWAY, AMENDMENT', function () {
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
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);
            MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
            MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ALBERTA')
            MMSCreateDeal.StatusMenuClick();

            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000Refinance(mortgageProduct);
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
               HomePage.VerifyHomePage();
               MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
               CustomLibrary.WaitForSpinner();
              // PreFundingInfomation.PIFAnswerPropertyQuestionsforRegAmountlessthan100000('ALBERTA');
              PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ALBERTA',3);
               MenuPanel.PrimaryMenuNavigateTo('Home');
               browser.waitForAngular();
               CustomLibrary.WaitForSpinnerInvisible();
               //TC: 261962- Navigate away message validation      
               HomePage.VerifyNavigateAwayMsg();
               HomePage.NavigateAwayAcceptReject('Cancel');
               MenuPanel.PrimaryMenuNavigateTo('Home');
               HomePage.NavigateAwayAcceptReject('OK');
               MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
               //PreFundingInfomation.PIFAnswerPropertyQuestionsforRegAmountlessthan100000('ALBERTA');
               PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ALBERTA',3);
               PreFundingInfomation.SavePreFundInfo();
               PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
               PreFundingInfomation.SubmitPreFundInfo();
               PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');

               DealId.then(function (result) {
                //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);  
            });
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.VerifyMessage1forAmendments('There are pending amendments that have not been submitted to the lender. Select ‘Submit to Lender’ from the left navigation menu to notify the lender of these updates')
            PreFundingInfomation.VerifyMessage2forAmendments("There are pending amendments to the Pre-Funding information that have not been submitted. Select 'Submit'  from the Pre-Funding Info page to notify FCT of these updates.'")
        
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(500);
            MMSCreateDeal.WaitForLawyerEvents();
            //TC- -LLC EmbeddedPortal - PIF > Finance deal -  Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
            MMSCreateDeal.ClickLLCLAwyerEventTab();
            MMSCreateDeal.WaitForEntryToAck();
            //MMSCreateDeal.VerifyPIFEventandAcknowledgePIF(); 
            MMSCreateDeal.ClickonViewPolicyHistory();
            MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('All underwriting questions are answered.');
           // CustomLibrary.CloseTab();
           CustomLibrary.closeWindowUrlContains("DealDetails");
           CustomLibrary.navigateToWindowWithUrlContains("DealList",1);

       
        }
            else{
                   // CustomLibrary.CloseTab();
                    expect(true).toBe(false, "Deal is not sent to LLC.");
            }});
        }  
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        };})
    })

});
