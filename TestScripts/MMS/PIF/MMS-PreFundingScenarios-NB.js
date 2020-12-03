'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var ExceltoJson = require('../../../CustomLibrary/ExceltoJson.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var ManageDocs = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;
var TestData = require('../../../testData/TestData.js');
var path = require('path');


xdescribe('Convert excel to json for NB', function () {

    it('Convert XLS to Json', function () {
        var inputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIFSecenario.xls");
        var outputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIF_NB_Questions.json");
        ExceltoJson.ConvertExceltoJson(inputFilename, outputFilename, "PIF_NB");
    })
});

describe('Province:NB, RegisteredAmount>=750000,TransactionType:Refinance', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["NEW BRUNSWICK"].ProgramType;
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var PropertyData
    var namelist = []
    var ThankYouPageFound;
    var dealSendToLLC;
    var AssessmentRollNumber = null;


    it('MMS Deal Flow-Deal Creation- PreFunding Questions through LLC Unity', function () {
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if (count > 0) {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
              //  CustomLibrary.SwitchTab(1);
                  //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(500);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);              
               MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
               MMSCreateDeal.EnterPopertyDataDynamic('NEW BRUNSWICK');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                
                MMSCreateDeal.EnterPreFundNewMortgageRegAmtgreaterorequal750000Refinance(LenderDetails.MortgageProduct);
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.ClickReleaseHold();
               // CustomLibrary.SwitchTab(2);
               CustomLibrary.navigateToWindowWithUrlContains("ChangeStatus",3)
               browser.sleep(500);
                MMSCreateDeal.EnterReleaseHoldReasons("Test");
               // CustomLibrary.SwitchTab(1);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
               browser.sleep(500);            
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    if (count > 0) {
                        dealSendToLLC = true;
                    }
                });
               // CustomLibrary.SwitchTab(0);
               // CustomLibrary.CloseTab(1);
               CustomLibrary.closeWindowUrlContains("DealDetails");
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                      //  LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                    }
                    else {
                        expect(data).toBe('200', "Unable to Accept the deal.");
                    }
                });
            });

            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');              
             //TC-288446 -LLC EmbeddedPortal - PIF > Finance deal - Mandatory field Functionality
             PreFundingInfomation.SubmitPreFundInfoMessageValidation();
             PreFundingInfomation.VerifyyManadatoryFieldMessage();
             PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',4);
             PreFundingInfomation.PreFundDocumentUpload();
            // PreFundingInfomation.UploadDocument('Title Search');
             //PreFundingInfomation.VerifyDocUploadedSuccessfully();

             //TC-288453 - LLC EmbeddedPortal - PIF > Finance deal - Save functionality
             PreFundingInfomation.SavePreFundInfo();
             PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();

    
            PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            
            PreFundingInfomation.VerifyViewDocument('Power of Attorney');
            
            //TC- - LLC EmbeddedPortal - PIF > Finance deal -  Submit > Trigger Deal History entry
            MenuPanel.PrimaryMenuNavigateTo('dealHistory');
            browser.waitForAngular();
            DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true);

           //TC-  - LLC EmbeddedPortal - PIF > Finance deal -  Required Documents section uploaded documents displayed on Manage Documents page
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocs.VerifyStatusViewDoc('Power of Attorney','Uploaded');

             DealId.then(function (result) {
                  //   LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
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
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

});

describe('Province:NB, RegisteredAmount>=750000, TransactionType:Purchase', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["NEW BRUNSWICK"].ProgramType;
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var PropertyData
    var namelist = []
    var ThankYouPageFound;
    var dealSendToLLC;
    var AssessmentRollNumber = null;


    it('MMS Deal Flow-Deal Creation- PreFunding Questions through LLC Unity', function () {
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if (count > 0) {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               // CustomLibrary.SwitchTab(1);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
               browser.sleep(500);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);              
               MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
               MMSCreateDeal.EnterPopertyDataDynamic('NEW BRUNSWICK');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterPreFundNewMortgageRegAmtgreaterorequal750000Purchase(LenderDetails.MortgageProduct);

                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.ClickReleaseHold();
               // CustomLibrary.SwitchTab(2);
               CustomLibrary.navigateToWindowWithUrlContains("ChangeStatus",3)
               browser.sleep(500);
                MMSCreateDeal.EnterReleaseHoldReasons("Test");
               // CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);       
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    if (count > 0) {
                        dealSendToLLC = true;
                    }
                });
                //CustomLibrary.SwitchTab(0);
                //CustomLibrary.CloseTab(1);
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
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
                });
            });

            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');

             //TC: 288440 - LLC EmbeddedPortal - PIF > Purchase deal - Mandatory field Functionality
             PreFundingInfomation.SubmitPreFundInfoMessageValidation();
             PreFundingInfomation.VerifyyManadatoryFieldMessage();
             PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',5); 
             CustomLibrary.WaitForSpinnerInvisible();
             browser.waitForAngular();
             PreFundingInfomation.PreFundDocumentUpload();
             PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');

             PreFundingInfomation.SubmitPreFundInfoMessageValidation();
             PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
             PreFundingInfomation.SubmitOKMessageValidation();
             PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
             PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");



             //TC -288442 -  LLC EmbeddedPortal - PIF > Purchase deal -  Ability to Upload and View Documents
            //TC-288449 -  LLC EmbeddedPortal - PIF > Purchase deal -  Submit > Trigger Deal History entry
             PreFundingInfomation.VerifyViewDocument('Agreement of Purchase and Sale');
             MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
             DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true)

             //TC- 303614- LLC EmbeddedPortal - PIF > Purchase deal -  Required Documents section uploaded documents displayed on Manage Documents page - ON
             MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
             ManageDocs.VerifyStatusViewDoc('Agreement of Purchase and Sale','Uploaded');

             DealId.then(function (result) {
                // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
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
             //CustomLibrary.SwitchTab(1);
             CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
             browser.sleep(500);
             MMSCreateDeal.ClickonViewPolicyHistory();
             MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('New MMS Pre-Funding information received.');
             MMSCreateDeal.VerifyDocUndeDocSection('Agreement of Purchase and Sale');
             
           // CustomLibrary.SwitchTab(0);
            //CustomLibrary.CloseTab(1);
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
        }
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

});

describe('Province:NB, Registeration Amount <=100000, Less Than Threshold Value', function () {
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["NEW BRUNSWICK"].ProgramType;
    var AssessmentRollNumber = null;

    
    //TC: 262913 MMS Pre-Funding Information - hide LRO Number field for NB
    //TC: 262513 MMS Pre-Funding Information - implement correct PIN labels for NB
    //TC-288447: LLC EmbeddedPortal - PIF > Purchase deal -  Submit
    //TC 288441-LLC EmbeddedPortal - PIF > Purchase deal - Save functionality
    //TC 288448 -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality

    it('TC- 262913,262513- RegisteredAmount:100000 less than Threshold value,TransactionType:Purchase with Document Upload', function () {
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
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if (count > 0) {
                ThankYouPageFound = true
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('NEW BRUNSWICK');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
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
                        browser.waitForAngular();
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                        browser.waitForAngular();
                        MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                        browser.waitForAngular();

                        //TC: 262913 MMS Pre-Funding Information - hide LRO Number field for NB
                        //TC: 262513 MMS Pre-Funding Information - implement correct PIN labels for NB
                        PreFundingInfomation.verifyLRONumber('NEW BRUNSWICK');
                        PreFundingInfomation.VerifyTitleLabelNB();

                        PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',1);
                        //TC 288448 -LLC EmbeddedPortal - PIF > Purchase deal -  Navigate away functionality
                       MenuPanel.PrimaryMenuNavigateTo('Home');
                       HomePage.NavigateAwayAcceptReject('Cancel');
                       MenuPanel.PrimaryMenuNavigateTo('Home');
                       HomePage.NavigateAwayAcceptReject('OK');
                       MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                       PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',1);
                       PreFundingInfomation.SavePreFundInfo();
                       PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                      PreFundingInfomation.SubmitPreFundInfo();
                       PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');

                    }
                    else {
                        //CustomLibrary.CloseTab();
                        expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                    }
                });
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    //TC: 261865- Save button along with vaidation message
    //TC: 261967- Verify that the Amendment message is displayed upon selecting submit if there are outstanding amendments to the Lender
    //TC: 261969- Verify that the Confirmation message is displayed upon selecting submit if there are no outstanding amendments to the Lender     
    //TC: 261970-Verify that the Success message is displwant to continue with this action?');
    //TC: 261961:Verify that Save button is removed from display once PIF is submitted
    //TC: 261973- Verify that user is able to Submit PIF multiple times and confirmation message displayed to user
    //TC- -LLC EmbeddedPortal - PIF > Finance deal -  Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('TC- 261865,261967,261969,261970,261961,261973:RegisteredAmount:100000 less than Threshold value, TransactionType:Refinance', function () {
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
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if (count > 0) {
                ThankYouPageFound = true
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                //CustomLibrary.SwitchTab(1);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('NEW BRUNSWICK')
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageDataRefinance(LenderDetails.MortgageProduct);
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
                                  //  LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
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
                        CustomLibrary.WaitForSpinner();
                       // PreFundingInfomation.PIFAnswerPropertyQuestionsRefinance('NEW BRUNSWICK');
                       PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',3);
                        MenuPanel.PrimaryMenuNavigateTo('Home');
                        HomePage.NavigateAwayAcceptReject('Cancel');
                        MenuPanel.PrimaryMenuNavigateTo('Home');
                        HomePage.NavigateAwayAcceptReject('OK');
                        MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                       // PreFundingInfomation.PIFAnswerPropertyQuestionsRefinance('NEW BRUNSWICK');
                       PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',3);
                        PreFundingInfomation.SavePreFundInfo();
                        //TC: 261865- Save button along with vaidation message
                        PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                       // PreFundingInfomation.SubmitPreFundInfo();
                       // PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');

                       PreFundingInfomation.SubmitPreFundInfoMessageValidation();

                       //TC: 261967- Verify that the Amendment message is displayed upon selecting submit if there are outstanding amendments to the Lender
                       //TC: 261969- Verify that the Confirmation message is displayed upon selecting submit if there are no outstanding amendments to the Lender     
                       //TC: 261970-Verify that the Success message is displwant to continue with this action?');
                       //TC: 261961:Verify that Save button is removed from display once PIF is submitted
                       //TC: 261973- Verify that user is able to Submit PIF multiple times and confirmation message displayed to user
                       PreFundingInfomation.VerifyPopupMsg('If you continue with this action any outstanding amendments to the lender will be submitted automatically. Do you wish to continue?');
                       PreFundingInfomation.SubmitOKMessageValidation();
                       browser.sleep(1000);
                       PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
                       PreFundingInfomation.SubmitOKMessageValidation();
                       PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
                       PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
                       MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                       DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true)
                       MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                       browser.waitForAngular();
                       PreFundingInfomation.VerifySavebuttonDisplay();
                       PreFundingInfomation.SubmitPreFundInfoMessageValidation();
                       PreFundingInfomation.VerifyPopupMsg('MMS Pre-Funding information has already been submitted. Are you sure you want to continue with this action?');
                       PreFundingInfomation.SubmitOKMessageValidation();
                       PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds");
                       DealId.then(function (result) {
                           //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                           LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                           //browser.sleep(80000);
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
                     //  MMSCreateDeal.VerifyPIFEventandAcknowledgePIF(); 
                       MMSCreateDeal.ClickonViewPolicyHistory();
                       MMSCreateDeal.waituntilPolicyHistoryContainsParticularEntry('All underwriting questions are answered.');
                       CustomLibrary.closeWindowUrlContains("DealDetails");
                       CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                    }
                    else {
                        //CustomLibrary.CloseTab();
                        expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                    }
                });
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    //TC-303572 -LLC EmbeddedPortal - PIF - Purchase deal - Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal)
    it('LLCUnityPreFunding Scenario- VALIDATION OF SUMBMITTED PIF QUESTIONS in LLC Unity and the submitted Question and Answer in MMS', function () {
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
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if (count > 0) {
                ThankYouPageFound = true
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('NEW BRUNSWICK');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000(LenderDetails.MortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                //CustomLibrary.SwitchTab(0);
                        // CustomLibrary.CloseTab(1);
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
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.waitForAngular();
                        MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                        CustomLibrary.WaitForSpinner();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.waitForAngular();
                        PreFundingInfomation.AnswerPIFQuestionsAllProvinces('NEW BRUNSWICK',1);
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
                            MMSCreateDeal.WaitForEntryToAck();
                            // MMSCreateDeal.VerifyPIFEventandAcknowledgePIF(); 
                            var smap = MMSCreateDeal.GetPrefundSolicitorInstructionQuestions();
                            smap.then(function (solmap) {
                                MMSCreateDeal.questionAnswerVerifcation(prefundmap, solmap);
                            })
                            CustomLibrary.closeWindowUrlContains("DealDetails");
                            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        });
                    }
                    else {
                        //CustomLibrary.CloseTab();
                        expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                    }
                });
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

});



