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
describe('Convert excel to json for BC', function () {
        
         it('Convert XLS to Json', function () {
            var inputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIFSecenario.xls");
            var outputFilename = path.resolve("..\\TestData\\MMS\\PIF", "PIF_BC_Questions.json");
            ExceltoJson.ConvertExceltoJson(inputFilename, outputFilename, "PIF_BC");
    
        })
});

describe('Province:BC, RegisteredAmount<100000, TransactionType: Refinance', function () {
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
                MMSCreateDeal.EnterPopertyDataDynamic('BRITISH COLUMBIA');
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

    it("TC:329189, 329191- Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if (dealSendToLLC) {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {
                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,null,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null,"N");     
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
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',4);
            PreFundingInfomation.SavePreFundInfo();
            PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');

            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            //TC:329182 - 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Amendment message is displayed if there are outstanding amendments to the Lender
            PreFundingInfomation.VerifyPopupMsg('If you continue with this action any outstanding amendments to the lender will be submitted automatically. Do you wish to continue?');
            PreFundingInfomation.SubmitOKMessageValidation();
           // PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
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
                //TC:329191- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions answer in LLC UNITY are reflected back to MMS FCT Portal once PIF is submitted
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

describe('Main--Province:BC, RegisteredAmount=100000, TransactionType: Purchase, Change Transaction type', function () {
    var Lang = TestData.data.LANGUAGE.value;
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
                MMSCreateDeal.EnterPopertyDataDynamic('BRITISH COLUMBIA');
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

    it("TC:329171, 329173, 329181, 329188, 329180, 329178, 329179, 329183, 329184, 329177, 329185, 329182 - Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
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
            //TC:329181- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Navigate away message is not displayed if there are no changes
            HomePage.VerifyNoNavigateAwayMsg();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            PreFundingInfomation.VerifyyManadatoryFieldMessage();
            //TC:329188- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions for BC have been implemented where Registration amount = 100,000
            //TC:329171- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/fraud questions for BC have been implemented as per the latest version of spreadsheet
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',1); 
            //TC:329180- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Navigate away message is displayed if there are any unsaved changes
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',1);
            CustomLibrary.WaitForSpinnerInvisible();
            browser.waitForAngular();
            PreFundingInfomation.PreFundDocumentUpload();
            //TC:329178- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Save the information on PIF Screen
            PreFundingInfomation.ClickSaveBtn();
            PreFundingInfomation.VerifySavedChanges('Your changes have been saved successfully.');
            //TC329177- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ The applicable 'additional information' fields are displayed/hidden according to the business rules
            PreFundingInfomation.VerifyAdditionalInfoField('Yes');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            //TC:329183- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Confirmation message is displayed if there are no outstanding amendments to the Lender
            PreFundingInfomation.VerifyPopupMsg('Are you sure you want to continue with this action?');
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            //TC:329184- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Success message is displayed upon submiting the PIF
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            //TC:329179- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Save button is removed from display once PIF is submitted
            PreFundingInfomation.VerifySavebuttonDisplay();
            //TC:329185- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF can be submitted multiple times to triger confirmation message
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
            //TC:329173: 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Correct set of PIF/Fraud questions displayed according to the transaction type
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

        
            if(dealSendToLLC) {
            DealId.then(function (result) {
               // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACKNOWLEDGE");
               LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACKNOWLEDGE');
                browser.sleep(60000);
            }); 

            
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });

            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',3); 
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

describe('Province:BC, RegisteredAmount<100000, TransactionType: Purchase, Change Registration Amount', function () {
    var Lang = TestData.data.LANGUAGE.value;
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
                MMSCreateDeal.EnterPopertyDataDynamic('BRITISH COLUMBIA');
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

    it("TC:329171, 329187- Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
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
            //TC:329187- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions for property (Purchase) where Registration amount < 100,000
            //TC:329171- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/fraud questions for BC have been implemented as per the latest version of spreadsheet
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',2); 
            CustomLibrary.WaitForSpinnerInvisible();
            browser.waitForAngular();
            PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
            PreFundingInfomation.SubmitPreFundInfoMessageValidation();
            PreFundingInfomation.SubmitOKMessageValidation();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            PreFundingInfomation.VerifyMessage("Your changes have been submitted successfully. In addition to MMS Pre-Funding Information, don't forget to submit the Request for Funds.");
            PreFundingInfomation.SubmitOKMessageValidation();
            //Login to MMS Portal to change the registration Amount
            MMSPortral.loginMMSPortal(); 
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            //TC:329174: 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Correct set of PIF/Fraud questions displayed according to the Registration Amount
            MMSCreateDeal.EditRegistrationAmt('150000');
            MMSCreateDeal.WaitForLawyerEvents();
            MMSCreateDeal.ClickLLCLAwyerEventTab();
            MMSCreateDeal.WaitForEntryToAck();
            MMSCreateDeal.SubmitLenderAccept();
            MMSCreateDeal.ClickLenderActionContinue();
            MMSCreateDeal.StatusMenuClick();
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

            if(dealSendToLLC){
            //Accept the ammendments
            DealId.then(function (result) {
               // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
               LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(result, 'ACCEPT');
                browser.sleep(60000);
            }); 
            //Login to LLC UNITY portal
            DealId.then(function (result) {
                 LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });
 
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            //TC:329174: 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ Correct set of PIF/Fraud questions displayed according to the Registration Amount
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',1); 
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

describe('Province:BC, Registeration Amount =100000, TransactionType: Refinance, Change Province', function () {
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[2];
    var programType = RunSettings.data.Global.MMS[Env].Lender[2]["BRITISH COLUMBIA"].ProgramType;
    var AssessmentRollNumber = null;
        
    it('TC:329186, 329172- RegisteredAmount:100000 ,TransactionType:Refinance ', function () {
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
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, programType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic('BRITISH COLUMBIA');
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
                        PreFundingInfomation.verifyLRONumber('BRITISH COLUMBIA');
                        PreFundingInfomation.VerifyTitleLabelNB();
                        //TC:329186- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions for BC implemented where registration amount >= 100,000
                        PreFundingInfomation.AnswerPIFQuestionsAllProvinces('BRITISH COLUMBIA',3);
                        PreFundingInfomation.SavePreFundInfo();
                        PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
                        PreFundingInfomation.SubmitPreFundInfo();
                        //Login to MMS Portal to change the province
                        MMSPortral.loginMMSPortal(); 
                        MMSPortral.ClickOnEditViewdeals();
                        MMSCreateDeal.SearchbyFCTURN(FCTURN);
                        CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                        browser.sleep(2000);
                        //TC:329172- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions displayed according to the property province
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
                           // LawyerIntegrationMMS.getAndSendAcceptRejectAmendment(result, "ACCEPT");
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
                        //TC:329172- 1.3 FCT MMS Pre-Funding Information - implement PIF/Fraud Questions for BC/ PIF/Fraud questions displayed according to the property province
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

