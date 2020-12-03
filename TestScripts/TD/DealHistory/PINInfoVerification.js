'use strict'
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var Env = RunSettings.data.Global.ENVIRONMENT.value;


//US: 24.2 
//TC: 272655: Lender sends PIN Info for TD New Deal in to LLC Unity (TD - ON/AB/MB/NB)
//TC: 273060: Lender sends PIN Info for TD New Deal in to LLC Unity (TD - ON/AB/MB/NB) - Verify Deal History
//TC: 273061: Lender sends Amendment on PIN Info for TD Exisitng/Inflight Deal in to LLC Unity (TD - ON/AB/MB/NB) 
describe('Lender - Verify PIN info and Deal History for new and update Deal', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;

    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('Create TD Deal with No Pin', function () {
            LenderIntegrationTD.CreateTDDealthroughCodeNoPin(ProvinceName);
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

        it('TC:272655 Verify the Final Report Page for the Pin', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.TDVerifyPIN(false, ProvinceName);
            }
        })

        it('TC:273060 Verify deal history activity expecting no amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
            DealHistory.VerifyDealHistoryTableSearch("LLC deal has been accepted.", true)
            DealHistory.VerifyDealHistoryTableSearch("A new deal has been submitted by the Lender.", true)
        })

        it('TC: 273061 Lender updates deal with Pin', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                // console.log("%%%%%" + ClosingDate);
                LenderIntegrationTD.UpdateTDDealPin(TDDealID, lenderReferenceNumber, ClosingDate, "3", ProvinceName, "true");
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('TC: 273061 Verify deal history activity expecting no amendent', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender", false);
        })

    }
    var Provincearray = ["AB", "MB", "ON", "NB"];
    for (var i = 0; i < Provincearray.length; i++) {
        //  console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }

})

//TC: 273091: Lawyer Updates/Removes the PIN Info for Existing/Inflight Deal in to LLC Unity (TD - ON/AB/MB/NB) - Verify Deal History
describe('Verify when Lawyer adds and updates the PIN for Deals', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('Create TD Deal with Pin', function () {
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

        it('Verify the Final Report Page for Pin', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.TDVerifyPIN(true, ProvinceName)
            }
        })

        it('273091: Lender updates deal removal Pin', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                //LawyerIntegrationTD.ModifyTDTransactionDataPin(TDDealID, false)
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, null,null,[],null,CustomLibrary.CurrentOrPastDate(), null,null, null,null,null,null);
                browser.sleep(3500);
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('273091: Verify deal history activity after removing the PIN', function () {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();

            if (ProvinceName == "AB" || ProvinceName == "MB") {
                DealHistory.VerifyDealHistoryTableSearch("Title Number(s) changed from 1111;2222;3333; to", true);
            }

            if (ProvinceName == "ON") {
                DealHistory.VerifyDealHistoryTableSearch("Property Identification Number(s) changed from 1111;2222;3333; to", true);
            }

            if (ProvinceName == "NB") {
                DealHistory.VerifyDealHistoryTableSearch("PID(s) changed from 1111;2222;3333; to", true);

            }

        })
    }
    var Provincearray = ["AB", "MB", "ON", "NB"];
    for (var i = 0; i < Provincearray.length; i++) {
        maintest(Provincearray[i]);
    }

})

//TC: 273094: Lawyer adds PIN Info to New/Existing/Inflight Deal in to LLC Unity (TD - ON/AB/MB/NB) - Verify Deal History
describe('Lawyer - Verify PIN info and Deal History for new and update Deal', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;

    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('Create TD Deal with No Pin', function () {
            LenderIntegrationTD.CreateTDDealthroughCodeNoPin(ProvinceName);
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

        it('Verify the Final Report Page for the Pin', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.TDVerifyPIN(false, ProvinceName);
            }
        })

        it('TC:273094  Lawyer updates deal with Pin', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                //LawyerIntegrationTD.ModifyTDTransactionDataPin(TDDealID, true);
                  LawyerIntegrationCommon.UpdateTransactionData(TDDealID, null,null,["1111", "2222"],null,CustomLibrary.CurrentOrPastDate(), null,null, null,null,null,null);
                  browser.sleep(3500);
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('TC: 273094 Verify deal history activity after lawyer updates null PIN with PIN', function () {

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            CustomLibrary.WaitForSpinnerInvisible();
            if (ProvinceName == "AB" || ProvinceName == "MB") {
                DealHistory.VerifyDealHistoryTableSearch("Title Number(s) changed from to 1111;2222;", true)
            }
            if (ProvinceName == "ON") {
                DealHistory.VerifyDealHistoryTableSearch("Property Identification Number(s) changed from to 1111;2222;", true)
            }
            if (ProvinceName == "NB") {
                DealHistory.VerifyDealHistoryTableSearch("PID(s) changed from to 1111;2222;", true)
            }
        })
    }
    var Provincearray = ["AB", "MB", "ON", "NB"];
    for (var i = 0; i < Provincearray.length; i++) {
        maintest(Provincearray[i]);
    }

})




