'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');

//TC-299958: LLC EmbeddedPortal - Lawyer declines the deal in UNITY MMS
describe('TC-238994, 299958: MMS Deal Decline', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var ThankYouPageFound ;
    var dealSendToLLC ;
    it('MMS Deal Creation', function () {
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
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
                MMSCreateDeal.EnterMortgagorData();             
                MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO');
                MMSCreateDeal.StatusMenuClick();
                 MMSCreateDeal.getPropertyData();
                MMSCreateDeal.EnterLawyerData();
                MMSCreateDeal.SelectTrustAccount();
                MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
                MMSCreateDeal.EnterDocumentsData();
                MMSCreateDeal.sendDealtoLLC();
                MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {

                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });  
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 

        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    //TC-299958, 238994: LLC EmbeddedPortal - Lawyer declines the deal in UNITY MMS
    it("TC-299958 : Decline Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "DECLINED");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Decline the deal as deal is not Send to LLC");
        }
    })

    it('Try to log in with declined deal ', function () {
        if(dealSendToLLC)
        {
            expect(LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL')).toBe((null || undefined), 'error ');
           
        }
        else{
            expect(true).toBe(false, "Unable to verify log in for declined deal.");
        }
    })

    it('Verify decline Policy History entry in MMS', function () {
        if(dealSendToLLC)
        {
                    MMSPortral.loginMMS();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2);
                    MMSCreateDeal.ClickonViewPolicyHistory();
                    MMSCreateDeal.WaitUntilPolicyHistoryEntryNew('The deal has been Declined by the lawyer.');
                    MMSCreateDeal.VerifyPolicyHistoryTableSearch('The deal has been Declined by the lawyer.',true);
                    //Verify lawyer status
                    MMSCreateDeal.VerifyLawyerDeniedStatus();
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to verify policy history in MMS'");
        }
    })

});