'use strict'
var TestData = require('../../../testData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var Notes = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js')
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');

//TC-239097: LLC Embedded Portal - Verify Notes is disbled for TD
describe('TC-239097: Verify Notes are not Available for TD', function () {
    //var lenderReferenceNumber = null;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });

    it('Create TD Deal', function () {  
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
      //  lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {    
            OperationsPortal.LoginOperationsPortal()
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {
                if(count > 0) {
                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {
                        expect(status).not.toBe("DRAFT", "Deal Status for TD Deal.");
                        if(status != "DRAFT") {
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
            expect(true).toBe(false, "TD Deal is not created successfully.");
        }
    })

    it('Accept TD Deal', function () {
 
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE"); 
        }
        else {
            expect(false).toBe(true, "Unable to accept the deal.");
        } 
    })

    it('TC-239097: Verify Notes are unavailable for TD', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                MenuPanel.PrimaryMenuNavigateTo('Notes');
                Notes.VerifyNotesUnavailableforTDMessage();
            }
            else {
                expect(true).toBe(false, "Unable to Verify Notes for TD deal.");
            }
        }
    })
})
