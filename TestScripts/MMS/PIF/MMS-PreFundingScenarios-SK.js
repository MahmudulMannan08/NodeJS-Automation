'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
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
var Env = RunSettings.data.Global.ENVIRONMENT.value;

 //Use this when we need to convert  excel to json for Alberta
describe('Convert excel to json for SK', function () {
        
         it('Convert XLS to Json', function () {
            var inputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIFSecenario.xls");
            var outputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIF_SK_Questions.json");
            ExceltoJson.ConvertExceltoJson(inputFilename, outputFilename, "PIF_SK");
    
        })
});

describe('Province:SK, RegisteredAmount<100000, TransactionType: Refinance', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["BRITISH COLUMBIA"].ProgramType;
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
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);              
               MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
               MMSCreateDeal.EnterPopertyDataDynamic("SASKATCHEWAN");
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                
                MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000Common(LenderDetails.MortgageProduct, 'REFINANCE');
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000);
                    if (count > 0) {
                        dealSendToLLC = true;
                    }
                });
              CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
              browser.sleep(2000);
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("TC:330540, 330546, 330549- Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null,'N');     
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
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            //TC:329189- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions implemented for property (Refinance) where registration amount < 100,000
            //TC:330547- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions implemented for property (Refinance) where registration amount < 100,000
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',4);
            PreFundingInfomation.SavePreFundInfo();
            PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');

            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            //TC:330540 - 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Amendment message is displayed if there are outstanding amendments to the Lender
            PreFundingInfomation.VerifyPopupMsg('If you continue with this action any outstanding amendments to the lender will be submitted automatically. Do you wish to continue?');
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            var pfmap = PreFundingInfomation.PreFundDocumentQuestions();
            pfmap.then(function (prefundmap) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.WaitForLawyerEvents();
                //Verify Getlawyerevents for "PIF" (Solicittor Instruction Tab on MMS portal
                MMSCreateDeal.ClickLLCLAwyerEventTab();
                MMSCreateDeal.VerifyPIFEventandAcknowledgePIF();
                var smap = MMSCreateDeal.GetPrefundSolicitorInstructionQuestions();
                //TC:330549- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions answer in LLC UNITY are reflected back to MMS FCT Portal once PIF is submitted
                smap.then(function (solmap) {
                    MMSCreateDeal.questionAnswerVerifcation(prefundmap, solmap);
                })
               CustomLibrary.closeWindowUrlContains("DealDetails");
               browser.sleep(2000);
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
               browser.sleep(2000);
            });
                
        
        }
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

});

describe('Main--Province:SK, RegisteredAmount=100000, TransactionType: Purchase, Change Transaction type', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["SASKATCHEWAN"].ProgramType;
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
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);              
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('SASKATCHEWAN');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageDataCommon(LenderDetails.MortgageProduct, 'PURCHASE');
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000);
                    if (count > 0) {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("TC:330529, 330531, 330535, 330536, 330537, 330538, 330546, 330539, 330541, 330542, 330543 - Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                        
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null,'N');     
                   
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
            MenuPanel.PrimaryMenuNavigateTo('Home');
            //TC:330539- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Navigate away message is not displayed if there are no changes
            HomePage.VerifyNoNavigateAwayMsg();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            PreFundingInfomation.VerifyyManadatoryFieldMessage();
            //TC:330546- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions for SK have been implemented where Registration amount = 100,000
            //TC:330529- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/fraud questions for SK have been implemented as per the latest version of spreadsheet
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',1); 
            //TC:330538- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Navigate away message is displayed if there are any unsaved changes
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',1);
            CustomLibrary.WaitForSpinnerInvisible();
            browser.waitForAngular();
            PreFundingInfomation.PreFundDocumentUpload();
            //TC:330536- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Save the information on PIF Screen
            PreFundingInfomation.ClickSaveBtn();
            PreFundingInfomation.VerifySavedChanges('Your changes have been saved successfully.');
            //TC:330535- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ The applicable 'additional information' fields are displayed/hidden according to the business rules
            PreFundingInfomation.VerifyAdditionalInfoFieldSK('Yes');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            //TC:330541- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Confirmation message is displayed if there are no outstanding amendments to the Lender
            PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            //TC:330542- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Success message is displayed upon submiting the PIF
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            //TC:330537- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Save button is removed from display once PIF is submitted
            PreFundingInfomation.VerifySavebuttonDisplay();
            //TC:330543- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF can be submitted multiple times to triger confirmation message
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            PreFundingInfomation.VerifyPopupMsg('MMS Pre-Funding information has already been submitted. Are you sure you want to continue with this action?');
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds")
            MenuPanel.PrimaryMenuNavigateTo('Home');
            MMSPortral.loginMMSPortal(); 
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            //TC:330531: 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Correct set of PIF/Fraud questions displayed according to the transaction type
            MMSCreateDeal.EditTransactionType('REFINANCE');
            MMSCreateDeal.WaitForLawyerEvents();
            MMSCreateDeal.ClickLLCLAwyerEventTab();
            MMSCreateDeal.WaitForEntryToAck();
            MMSCreateDeal.SubmitLenderAccept();
            MMSCreateDeal.ClickLenderActionContinue();
            MMSCreateDeal.StatusMenuClick();
            MMSCreateDeal.WaitForHoldStatus();
            MMSCreateDeal.VerifyStatusHold('HOLD');
            CustomLibrary.navigateToWindow("ChangeStatus",3)
            browser.sleep(2000);
            MMSCreateDeal.EnterReleaseHoldReasons('test');
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();  
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                if (count > 0) {
                    dealSendToLLC = true;
                }
                else
                {
                    dealSendToLLC = false;
                }
            });  
           CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
           browser.sleep(2000);
            if(dealSendToLLC)
            {

            DealId.then(function (result) {
                //LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
                LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                browser.sleep(60000);
            }); 

            
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });

            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',3);  
        }
        
        else {
            expect(dealSendToLLC).toBe(true, "Dseal is not send to LLC after making updates");
        }
      }
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })



});

describe('Province:SK, RegisteredAmount<100000, TransactionType: Purchase, Change Registration Amount', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["SASKATCHEWAN"].ProgramType;
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
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);              
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('SASKATCHEWAN');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000Common(LenderDetails.MortgageProduct, 'PURCHASE');
               
                             
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000);
                    if (count > 0) {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });
    })

    it("TC:330532, 330545- Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                        
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null,'N');     
                   
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

             
             PreFundingInfomation.SubmitPreFundInfoMessageValidation();
             PreFundingInfomation.VerifyyManadatoryFieldMessage();
             //TC:330545- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions for property (Purchase) where Registration amount < 100,000
             PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',2); 
             CustomLibrary.WaitForSpinnerInvisible();
             browser.waitForAngular();
             PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
             PreFundingInfomation.SubmitPreFundInfoMessageValidation();
             PreFundingInfomation.SubmitOKMessageValidation();
             PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
             PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
             PreFundingInfomation.SubmitOKMessageValidation();
             MMSPortral.loginMMSPortal(); 
             MMSPortral.ClickOnEditViewdeals();
             MMSCreateDeal.SearchbyFCTURN(FCTURN);
             CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
             browser.sleep(2000);
             //TC:330532: 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ Correct set of PIF/Fraud questions displayed according to the Registration Amount
             MMSCreateDeal.EditRegistrationAmt('150000');
             MMSCreateDeal.WaitForLawyerEvents();
             MMSCreateDeal.ClickLLCLAwyerEventTab();
             MMSCreateDeal.WaitForEntryToAck();
             MMSCreateDeal.SubmitLenderAccept();
             MMSCreateDeal.ClickLenderActionContinue();
             MMSCreateDeal.StatusMenuClick();
             //MMSCreateDeal.ClickDocumentsTab();
             MMSCreateDeal.EnterDocumentsData();
             MMSCreateDeal.sendDealtoLLC();  
             MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                if (count > 0) {
                    dealSendToLLC = true;
                }
                else
                {
                    dealSendToLLC = false;
                }
            });  
             CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
             browser.sleep(2000);

             if(dealSendToLLC)
             {
 
               DealId.then(function (result) {
               // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
               LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
               
                browser.sleep(60000);
            }); 
 
             DealId.then(function (result) {
                 LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
             });
 
             browser.waitForAngular();
             CustomLibrary.WaitForSpinnerInvisible();
             MenuPanel.PrimaryMenuNavigateWithWait('Home');
             MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
             PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',2); 
             }
             else {
                expect(dealSendToLLC).toBe(true, "Deal is not send to LLC after making updates");
            }
        }
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

  


});

describe('Province:SK, Registeration Amount =100000, TransactionType: Refinance, Change Province', function () {
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["SASKATCHEWAN"].ProgramType;
    var AssessmentRollNumber = null;
        
    it('TC:330530, 330544- RegisteredAmount:100000 ,TransactionType:Refinance ', function () {
        var FCTURN
        var DealId
        var PropertyData
        var namelist = []
        var ThankYouPageFound = false;
        var dealSendToLLC;
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
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('SASKATCHEWAN');
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageDataCommon(LenderDetails.MortgageProduct, 'REFINANCE');
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000);
                    if (count > 0) {
                       CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                       browser.sleep(2000);
                        OperationsPortal.LoginOperationsPortal(FCTURN);
                        OperationsPortal.SerchDealDetails(FCTURN);
                        DealId = OperationsPortal.GetDealID();
                        DealId.then(function (result) {
                            LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                                if (data == 200) {
                                   
                                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null,'N');     
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
                        //TC:330544- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions for SK implemented where registration amount >= 100,000
                        PreFundingInfomation.AnswerPIFQuestionsAllProvinces('SASKATCHEWAN',3);
                        PreFundingInfomation.SavePreFundInfo();
                        PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                        PreFundingInfomation.SubmitPreFundInfo();
                        //Login to MMS Portal to change the province
                        MMSPortral.loginMMSPortal(); 
                        MMSPortral.ClickOnEditViewdeals();
                        MMSCreateDeal.SearchbyFCTURN(FCTURN);
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        //TC:330530- 6.1 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for SK/ PIF/Fraud questions displayed according to the property province
                        MMSCreateDeal.EditProvince('ONTARIO');
                        MMSCreateDeal.WaitForLawyerEvents();
                        MMSCreateDeal.ClickLLCLAwyerEventTab();
                        MMSCreateDeal.WaitForEntryToAck();
                        MMSCreateDeal.SubmitLenderAccept();
                        MMSCreateDeal.ClickLenderActionContinue();
                        MMSCreateDeal.StatusMenuClick();
                        MMSCreateDeal.WaitForHoldStatus();
                        MMSCreateDeal.VerifyStatusHold('HOLD');
                        CustomLibrary.navigateToWindow("ChangeStatus",3)
                        browser.sleep(2000);
                        MMSCreateDeal.EnterReleaseHoldReasons('test');
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        MMSCreateDeal.ClickDocumentsTab();
                        MMSCreateDeal.sendDealtoLLC();  
                        MMSCreateDeal.VerifyDealSendToLLCSuccessfully();                        			
                        CustomLibrary.closeWindowUrlContains("DealDetails");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                        browser.sleep(2000);
                        //Accept the amendments 
                        DealId.then(function (result) {
                            //LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
                            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                            browser.sleep(60000);
                        }); 
                        //Login to LLC UNITY portal with new redirect URL
                        DealId.then(function (result) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        });
                        browser.waitForAngular();
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateWithWait('Home');
                        MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                        PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',4); 
                   
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

