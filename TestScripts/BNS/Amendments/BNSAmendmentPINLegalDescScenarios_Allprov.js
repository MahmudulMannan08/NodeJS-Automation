'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var BNSTestData = require('../../../testData/BNS/BNSTestData.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;
var Lang = TestData.data.LANGUAGE.value;   

//TC: 272843- Lender to not to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity > BNS
//TC: 272841- Lender to send amendment on PIN(s) and/or Legal Description in the existing/inflight deal to LLC Unity > BNS
//TC: 272957- "Closing Date" is changed >- System to trigger an amendment > BNS
//TC: 272869- Verify no Deal History logs are added > BNS
//TC:272840-Lender to send a PIN(s) and/or Legal Description in the NEW deal to LLC Unity > BNS
//TC: 272845-Lender to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity and Later removes the existing field values > BNS

describe('Functionality of Amendments when Deal gets created without Legal Desc and PIN', function () {
    var BNSFctUrn = null;
    var loginRedirectURL = null;     

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    function maintest(ProvinceName) {
    it('TC: 272843-Generate BNS Deal - Create deal soap service with no Legal Desc and PIN', function () {
        LenderIntegrationBNS.CreateBNSDealNoLegalDescNpin('false', 'true', ProvinceName);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if (BNSFctUrn) {
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('Verify Home Page', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            }
        }
    })
   
    it('TC: 272841 Update BNS Deal with Legal Desc and Pin', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.UpdateBNSDealWithLegalNPin(false, true, false, ProvinceName, false, false, true);
            browser.sleep(2000);
        }
    })

    it('Verify deal history activity expecting no amendent', function () {
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        CustomLibrary.WaitForSpinnerInvisible();
        DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
    })

    it('TC: 272957 Update BNS Deal with Closing Date', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.UpdateBNSDealWithLegalNPin(false, true, false, ProvinceName, false, true, true);
            browser.sleep(2000);
        }
    })

    it('TC: 272869 Verify deal history activity expecting amendent', function () {
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History'); MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        CustomLibrary.WaitForSpinnerInvisible();
        DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", true);
    })

}
// var Provincearray = ["NEW BRUNSWICK"];
// var Provincearray = ["ONTARIO", "MANITOBA", "ALBERTA", "NEW BRUNSWICK"];
var Provincearray = ["AB", "MB", "ON", "NB"];
for (var i = 0; i < Provincearray.length; i++) {
    console.log(Provincearray[i]);
    maintest(Provincearray[i]);
}
   
})

describe('Functionality of Amendment -New deal with legal desc', function () {
    var BNSFctUrn = null;
    var loginRedirectURL = null;
    var Lang = TestData.data.LANGUAGE.value; 

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    function maintest(ProvinceName) {
    it('TC: 272840 Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', ProvinceName);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if (BNSFctUrn) {
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('Verify Home Page', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            }
        }
    })
   
    it('TC: 272845 Update BNS Deal by removing Legal Desc and Pin', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.UpdateBNSDealWithLegalNPin(false, true, false, ProvinceName, false, false, false);
            browser.sleep(2000);
        }        
    })

    it('Verify deal history activity expecting no amendent', function () {        
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        CustomLibrary.WaitForSpinnerInvisible();
        DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
    })

    it('Update BNS Deal with Closing Date', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.UpdateBNSDealWithLegalNPin(false, true, false, ProvinceName, false, true, false);
            browser.sleep(2000);
        }        
    })

    it('Verify deal history activity expecting amendent', function () {        
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History'); MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        CustomLibrary.WaitForSpinnerInvisible();
        DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", true);
    })  
}
var Provincearray = ["AB", "MB", "ON", "NB"];
for (var i = 0; i < Provincearray.length; i++) {
    console.log(Provincearray[i]);
    maintest(Provincearray[i]);
}
})

