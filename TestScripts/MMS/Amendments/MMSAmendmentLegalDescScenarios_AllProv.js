
'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var PreFundingInformation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
const { browser } = require('protractor');
//US: 21.1
//TC:272850-Lender to not to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity > MMS
//TC:272848- Lender to send amendment on PIN(s) and/or Legal Description in the existing/inflight deal to LLC Unity > MMS
//TC:272958-"Closing Date" is changed >- System to trigger an amendment > MMS
//TC:272870- Verify no Deal History logs are added > MMS

describe('US:21.1: TC:272850,272848,272958,272870 Amendment Scenarios', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var FCTURN
    var DealId
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var ClosingDate =  CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var ClientName = null;
    var LenderRefNo = null;
    var namelist = [];
    var PropertyData
    var ThankYouPageFound;
    var dealSendToLLC;
    
    function maintest(ProvinceName) {

        it('TC: 272850 Create MMS Deal without PIN and Legal Desc', function () {
            ThankYouPageFound = false;
            dealSendToLLC = false;
            LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
            ClientName = CustomLibrary.getRandomString(5);
            MMSPortral.GenerateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
            MMSPortral.VerifyThankYouPage().then(function (count) {
                if (count > 0) {
                    ThankYouPageFound = true;
                    FCTURN = MMSPortral.GetCreatedFCTURN();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);       
                    MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                    MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
                    namelist = MMSCreateDeal.EnterMortgagorData();
                    MMSCreateDeal.EnterPopertyDataDynamic(ProvinceName);
                    MMSCreateDeal.StatusMenuClick();
                    PropertyData = MMSCreateDeal.getPropertyData();
                    MMSCreateDeal.EnterLawyerData();
                    MMSCreateDeal.SelectTrustAccount();
                    MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                    MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                        if (count > 0) {
                            dealSendToLLC = true;
                        }
                    });
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);

                }
                else {
                    expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
                }
            });
        })

        it('Verify Operations Portal', function () {
            if (dealSendToLLC) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
            }
        })

        it('Verify LLC Unity Login', function () {
            if (dealSendToLLC) {
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                            console.log("Now logged in" + data);
                            browser.sleep(5000);
                        }
                    });
                });
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('Verify LLC Page for the Amendments and Deal History', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInformation.VerifyLegalDescMMS('');
                MenuPanel.PrimaryMenuNavigateTo('dealHistory');
                browser.waitForAngular();
                DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC Unity Portal");
            }
        })

        it('TC: 272848 Add Legal Desc from MMS', function () {
            if (dealSendToLLC) {
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindowWithUrlContains("",2);
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
            browser.sleep(500);
            MMSCreateDeal.AddPropertyLegalDesc();
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",2);
            CustomLibrary.closeWindowUrlContains("DealList");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            browser.sleep(500);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC Unity Portal");
            }
        })

        it('Verify LLC Page for the Amendments', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInformation.VerifyLegalDescMMS('');
                }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC Unity Portal");
            }
        })

        it('TC: 272958 Modify Closing date', function () {
            if (dealSendToLLC) {
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindowWithUrlContains("",2);
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
            browser.sleep(1000);
            MMSCreateDeal.EnterClosingDateinStatusData(LenderDetails.Spec);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",2);
            CustomLibrary.closeWindowUrlContains("DealList");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            browser.sleep(500);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC Unity Portal");
            }

        })
        

        it('TC: 272870 Verify Amendment Deal History', function () {
            
            if (dealSendToLLC) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateTo('dealHistory');
            browser.waitForAngular();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", true);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC Unity Portal");
            }
        })
    }

  //  var Provincearray = ["ONTARIO"];

    var Provincearray = ["ONTARIO", "MANITOBA", "ALBERTA", "NEW BRUNSWICK"]; 
        for (var i = 0; i < Provincearray.length; i++) {     
        maintest(Provincearray[i]);
    }
});

//TC: 272f847- Lender to send a PIN(s) and/or Legal Description in the NEW deal to LLC Unity > MMS
//TC: 272852-Lender to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity and Later removes the existing field values >
//TC: 272851-Lender to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity and Later modifies the existing field values > MMS


describe('US:21.1: TC:272847,272852,272851 Amendment Scenarios-New Deal', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var FCTURN
    var DealId
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var ClosingDate =  CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
    var ClientName = null;
    var LenderRefNo = null;
    var namelist = [];
    var PropertyData
    var ThankYouPageFound;
    var dealSendToLLC;
    function maintest(ProvinceName) {
        it('TC: 272847,272852,272851 Create MMS Deal with PIN and Legal Desc', function () {

            ThankYouPageFound = false;
            dealSendToLLC = false;
            LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
            ClientName = CustomLibrary.getRandomString(5);
            MMSPortral.GenerateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
            MMSPortral.VerifyThankYouPage().then(function (count) {
                if (count > 0) {
                    ThankYouPageFound = true;
                    FCTURN = MMSPortral.GetCreatedFCTURN();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN); 
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(500);
                    MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                    MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
                    namelist = MMSCreateDeal.EnterMortgagorData();
                    MMSCreateDeal.EnterPreFundPropertyDataDynamic(ProvinceName);
                    MMSCreateDeal.StatusMenuClick();
                    MMSCreateDeal.EnterLawyerData();
                    MMSCreateDeal.SelectTrustAccount();
                    MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                    MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                        if (count > 0) {
                            dealSendToLLC = true;
                        }
                    });
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);

                }
                else {
                    expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
                }
            });
        })

        it('Verify Operations Portal', function () {
            if (dealSendToLLC) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
            }
        })

        it('Verify LLC Unity Login', function () {
            if (dealSendToLLC) {
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                            LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                            console.log("Now logged in" + data);
                            browser.sleep(5000);
                        }
                    });
                });
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('Verify LLC Page for the Amendments and Deal History', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInformation.VerifyLegalDescMMS('Test Data');
                MenuPanel.PrimaryMenuNavigateTo('dealHistory');
                browser.waitForAngular();
                DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('TC: 272847,272852,272851 Update Legal Desc from MMS', function () {
            if (dealSendToLLC) {
                CustomLibrary.OpenNewTab();
                browser.sleep(1000);
                CustomLibrary.navigateToWindowWithUrlContains("",2);
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
               browser.sleep(500);
                MMSCreateDeal.UpdatePropertyLegalDesc();
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",2);
                CustomLibrary.closeWindowUrlContains("DealList");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                browser.sleep(500);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('Verify LLC Page for the Amendments', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInformation.VerifyLegalDescMMS('Test Data');
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('TC: 272847,272852,272851 Remove Legal Desc from MMS', function () {
          
            if (dealSendToLLC) {
                CustomLibrary.OpenNewTab();
                browser.sleep(1000);
                CustomLibrary.navigateToWindowWithUrlContains("",2);
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",3)
                browser.sleep(500);
                MMSCreateDeal.RemovePropertyLegalDesc();
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",2);
                CustomLibrary.closeWindowUrlContains("DealList");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                browser.sleep(500);
        }
        else {
            expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
        }
        

        })

        it('Verify LLC Page for the Amendments', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                browser.waitForAngular();
                PreFundingInformation.VerifyLegalDescMMS('Test Data');
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })

        it('Verify Amendment Deal History', function () {

            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateTo('dealHistory');
                browser.waitForAngular();
                DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to LLC UNITY");
            }
        })
    }

    var Provincearray = ["ONTARIO", "MANITOBA", "ALBERTA", "NEW BRUNSWICK"]; 
  //  var Provincearray = ["ONTARIO"]; 
    for (var i = 0; i < Provincearray.length; i++) {        
        maintest(Provincearray[i]);
    }
});

//SPRINT 4: US 17.2
//SPRINT 4: US 17.2
//SPRINT 4: US 17.2
//SPRINT 3: US 5.2
//TC: 330460- 5.2 FCT MMS Pre-Funding Information - implement correct PIN labels for BC-Verify the Correct PIN Lables on PIF page
//TC: 330471- 5.2 FCT MMS Pre-Funding Information - implement correct PIN labels for BC-Verify the Correct PIN Lables -Deal History
// TC:265089- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS NB - Added
//TC: 265098 Update Deal History entries for amendments to PIN to reflect the correct field label for MMS NB - Removed
//TC: 265079 Update Deal History entries for amendments to PIN to reflect the correct field label for MMS NB - Update
//TC: 265087- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS AB - Added
//TC: 265096- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS AB - Removed
//TC: 265077- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS AB - Update
// TC: 265088- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS MB - Added
//TC: 265097- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS MB - Removed
//TC: 265078- Update Deal History entries for amendments to PIN to reflect the correct field label for MMS MB - Update
describe('TC: 265088,265078,265097,265087,265077,330460,330471265096,265089,265079,265098 - MMS- Province AB, MB: Verify Deal History on Add,Update and Remove Title Number ', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[0];
    var ThankYouPageFound = false;
    var dealSendToLLC = false;
    var DealId;
    var AssessmentRollNumber = null;
    function maintest(ProvinceName,ProgramType) {
        it('Create MMS Deal', function () {
            var FCTURN
            var PropertyData
            var namelist = []
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
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
                MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, ProgramType);
                namelist = MMSCreateDeal.EnterMortgagorData();
                MMSCreateDeal.EnterPopertyDataDynamic(ProvinceName);
                MMSCreateDeal.StatusMenuClick();
                PropertyData = MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function(count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(200);
                if(count > 0) {
                   
  
                    dealSendToLLC = true;
                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    DealId = OperationsPortal.GetDealID();
                }
                else {
                    expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }
            }); 
            }
            else {
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
            });
        })

        it('Add Title Number', function () {
            if(dealSendToLLC)
            { 
                DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        if (data == 200) {
                        // LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                            LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,["3456788"],"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                        
                        }
                        else {
                            expect(data).toBe('200', "Unable to Accept the deal.");
                        }
                    })
                });
            }
            else {
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }
        })

        it('TC:330460, 330714- Login to LLCUnity', function () {

            if(dealSendToLLC)
            {
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.VerifyHomePage();
                    MenuPanel.PrimaryMenuNavigateWithWait('Pre-Funding Information');
                   // if(ProvinceName =="BRITISH COLUMBIA")
                   if(ProvinceName =="NEW BRUNSWICK" || ProvinceName =="BRITISH COLUMBIA" )
                    {
                        //TC:330460- 5.2 FCT MMS Pre-Funding Information - implement correct PIN labels for BC-Verify the Correct PIN Lables on PIF page
                        PreFundingInfomation.VerifyPIDMMS('PID');
                    }
                    else if (ProvinceName =="SASKATCHEWAN"){
                        //TC:330714- 6.2 FCT MMS Pre-Funding Information - implement correct PIN labels for SK-Verify the Correct PIN Lables on PIF page
                        PreFundingInfomation.VerifyPIDMMS('Title Number');
                    }

                })
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }
        })

        it('TC: 265088 DealHistory-Add Title Number', function () {
            if(dealSendToLLC)
            {
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
              
                if(ProvinceName =="NEW BRUNSWICK" || ProvinceName =="BRITISH COLUMBIA"  )
                {
                    DealHistory.VerifyDealHistoryTableSearch("PID(s) changed from to 3456788", true)
                }
                else{
                    DealHistory.VerifyDealHistoryTableSearch("Title Number(s) changed from to 3456788", true)
                }
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }  
            
        })

        it('Update Title Number', function () {
            if(dealSendToLLC)
            {
                DealId.then(function (result) {
                    //LawyerIntegrationMMS.getAndSetPreFundTransactionDataUpdateTitle(result, CustomLibrary.getRandomString(10), function (data) { });
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,["12345678"],"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                    
                })
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            } 
        })

        it('TC: 265078, 330471, 330715- DealHistory-Update Title Number', function () {
            if(dealSendToLLC)
            {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                //TC:330715- 6.2 FCT MMS Pre-Funding Information - implement correct PIN labels for SK-Verify the Correct PIN Lables -Deal History
                //TC: 330471- 5.2 FCT MMS Pre-Funding Information - implement correct PIN labels for BC-Verify the Correct PIN Lables -Deal History
                if(ProvinceName =="NEW BRUNSWICK" || ProvinceName =="BRITISH COLUMBIA" )
                {
                    DealHistory.VerifyDealHistoryTableSearch("PID(s) changed from 3456788 to 12345678", true)
                }
                else  {
                    DealHistory.VerifyDealHistoryTableSearch("Title Number(s) changed from 3456788 to 12345678", true)
                }
               
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }
        })

        it('Remove Title Number', function () {

            if(dealSendToLLC)
            {
                DealId.then(function (result) {
                // LawyerIntegrationMMS.getAndSetPreFundTransactionDataRemoveTitle(result, CustomLibrary.getRandomString(10), function (data) { });
                    LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,[],"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,CustomLibrary.getRandomString(10),null,null);     
                
                })
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }
        })

        it('TC: 265097 DealHistory-Remove Title Number', function () {
            if(dealSendToLLC)
            {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        
                if(ProvinceName =="NEW BRUNSWICK" || ProvinceName =="BRITISH COLUMBIA" )
                {
                    DealHistory.VerifyDealHistoryTableSearch("PID(s) changed from 12345678 to", true)
                }
                else{
                    DealHistory.VerifyDealHistoryTableSearch("Title Number(s) changed from 12345678 to", true)
                }
                
            }
            else{
                expect(dealSendToLLC).toBe(true, "Deal is not sent to LLC.");
            }  
        })
    }

    //var Provincearray = [ "SASKATCHEWAN"];
    var Provincearray = [ "MANITOBA", "ALBERTA", "NEW BRUNSWICK", "BRITISH COLUMBIA", "SASKATCHEWAN"]; 
    for (var i = 0; i < Provincearray.length; i++) { 
        var Province =  Provincearray[i];
        var ProgramType = RunSettings.data.Global.MMS[Env].Lender[0][Province].ProgramType;
            
        maintest(Province,ProgramType);
    }
});



