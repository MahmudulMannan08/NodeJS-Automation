'use strict'
var TestData = require('../../../testData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');

//TC: 270221-Lender to not to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity > TD,
//TC:269741-Lender to send amendment on PIN(s) and/or Legal Description in the existing/inflight deal to LLC Unity > TD,
//TC:270223-Lender to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity and Later modifies the existing field values > TD,
//TC:270224-Lender to send PIN(s) and/or Legal Description in the NEW deal to LLC Unity and Later removes the existing field values > TD,
//TC:269317-"Closing Date" is changed >- System to trigger an amendment > TD,
//TC:272863-Verify no Deal History logs are added > TD
describe('Functionality of Amendments when deal is created with no legal desc and pin', function () {

    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;

    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('TC: 270221 Create TD Deal with No Legal Desc', function () {
            LenderIntegrationTD.CreateTDDealthroughCodeNoLegalDesc(ProvinceName);

        })

        it('Verify TD Deal status in Operations Portal', function () {

            browser.ignoreSynchronization = true;
            TDDealIsInDraft = true;
            TDDealPresentInOperationalPortal = false;
            TDDealID = LenderIntegrationTD.ReturnfctURNTD();
            lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {

                OperationsPortal.LoginOperationsPortal();
                OperationsPortal.SearchDealBNS(TDDealID).then(function (count) {
                    if (count > 0) {
                        TDDealPresentInOperationalPortal = true;
                        OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                        OperationsPortal.GetDealStatus().then(function (status) {
                            if (status != "DRAFT") {
                                TDDealIsInDraft = false;
                            }
                        });
                    }
                    else {
                        expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                    }
                });
            }
            else {
                expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
            }
        })

        it('Accept TD Deal and Verify Home Page', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE");
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
                if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                    HomePage.VerifyHomePage();
                    HomePage.VerifyDealAcceptedCheckMark('LLC');
                    CustomLibrary.WaitForSpinnerInvisible();
                }
                else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('Verify the Final Report Page for the Legal Desc', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.TDVerifyLegalDescandPIN();
            }
        })

        it('TC: 272863 Verify deal history activity expecting no amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
        })

        it('TC: 269741 Lender updates deal with Legal Desc and Pin', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                console.log("%%%%%" + ClosingDate);
                LenderIntegrationTD.UpdateTDDealLegalDescNpin(TDDealID, lenderReferenceNumber, ClosingDate, "3", ProvinceName, "true");
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        //TC-290852: LLC EmbeddedPortal - Lender Amendements /Lender amends field that is excluded from amendment list and user is still able to access FCT Portal- TD
        it('TC-290852: Verify deal history activity expecting no amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            //TC-290852: LLC EmbeddedPortal - Lender Amendements /Lender amends field that is excluded from amendment list and user is still able to access FCT Portal- TD
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifySaveButtonStatus('Enabled');

            //Verify RFF page is accessible
            MenuPanel.VerifyMenuButtonStatus('RequestForFunds', 'Enabled');
            //Verify manage document page is accessible  
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyEnableBrowseButton();
            
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReport.VerifySubmitButtonStatusFinalReport('Disabled');
        })

        it('TC: 269317 Lender updates deal closing date ', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                var ClosingDate = CustomLibrary.FutureDate(); //CustomLibrary.FutureDatenew(1);
                console.log("$$$" + ClosingDate);
                LenderIntegrationTD.UpdateTDDealLegalDescNpin(TDDealID, lenderReferenceNumber, ClosingDate, "3", TestData.data[Lang].WebService.Province, "true");
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('Verify deal history activity expecting  amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", true);
        })

    }

    var Provincearray = ["AB", "MB", "ON", "NB"];
    for (var i = 0; i < Provincearray.length; i++) {
        maintest(Provincearray[i]);
    }

})


describe('Amendment functionality when deal has legal desc and pin', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('TC: 270223 Create TD Deal with Legal Desc', function () {
            LenderIntegrationTD.CreateTDDealthroughCode(ProvinceName);
        })

        it('Verify TD Deal status in Operations Portal', function () {

            browser.ignoreSynchronization = true;
            TDDealIsInDraft = true;
            TDDealPresentInOperationalPortal = false;
            TDDealID = LenderIntegrationTD.ReturnfctURNTD();
            lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {

                OperationsPortal.LoginOperationsPortal();
                OperationsPortal.SearchDealBNS(TDDealID).then(function (count) {
                    if (count > 0) {
                        TDDealPresentInOperationalPortal = true;
                        OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                        OperationsPortal.GetDealStatus().then(function (status) {
                            if (status != "DRAFT") {
                                TDDealIsInDraft = false;
                            }
                        });
                    }
                    else {
                        expect(TDDealPresentInOperationalPortal).toBe(true, "Deal not found in Operational Portal");
                    }
                });
            }
            else {
                expect(TDDealID).not.toContain('null', "CreateTDDeal service timed out!!!");
            }
        })

        it('Accept TD Deal and Verify Home Page', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE");
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
                if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                    HomePage.VerifyHomePage();
                    HomePage.VerifyDealAcceptedCheckMark('LLC');
                    CustomLibrary.WaitForSpinnerInvisible();
                }
                else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })


        it('Verify the Final Report Page for the Legal Desc', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.TDVerifyLegalDescandPINwithdata()
            }
        })

        it('TC: 270224 Lender updates deal removal Legal Desc and Pin', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                console.log("%%%%%" + ClosingDate);
                LenderIntegrationTD.UpdateTDDealLegalDescNpin(TDDealID, lenderReferenceNumber, ClosingDate, "3", ProvinceName, "false");
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('Verify deal history activity expecting no amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            
        })



        it('Lender updates deal closing date ', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                var ClosingDate =CustomLibrary.FutureDate(); // CustomLibrary.FutureDatenew(1);
                console.log("$$$" + ClosingDate);
                LenderIntegrationTD.UpdateTDDealLegalDescNpin(TDDealID, lenderReferenceNumber, ClosingDate, "3", ProvinceName, "false");
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('Verify deal history activity expecting  amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
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














