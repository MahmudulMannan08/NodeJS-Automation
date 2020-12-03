'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');

//262289-Final Report BNS - add WCP closing option for AB to the UI
//262296- Final Report BNS - add WCP closing option for AB to the UI - Mandatory field identifiers
//262400- Final Report BNS - add WCP closing option for AB to the UI - Mandatory field identifiers with Yes or No radio button
//262713- Final Report BNS - add WCP closing option for AB to the UI - Verifiy PIN changes on SROT >Property section
//262291-Final Report BNS - add WCP closing option for MB to the UI - Mandatory field identifiers
//262299-Final Report BNS - add WCP closing option for MB to the UI
//262394-Final Report BNS - add WCP closing option for MB to the UI - Mandatory field identifiers with Yes or No radio button
//262419-Final Report BNS - add WCP closing option does not display to the UI - NB
//267260-Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - closing option is hidden for BNS deals for NB
// Sprint 3
//267262-  Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - BNS - Closing options =False -AB
// 267259- Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - BNS - Closing options = True - AB
//267258-Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - BNS - Closing options = True - MB
//267261-Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - BNS - Closing options =False - MB
//SPRINT 4: US: 17.2
//TC: 265074-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS AB - Update
//TC: 265093-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS AB - Removed
//TC: 265084-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS AB - Added
//TC: 265085- Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB - Added
//TC: 265075-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB - Update
//TC: 265094-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB -Removed
//TC: 265076-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Update
//TC: 265086- Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Added
//TC: 265095-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Removed

//NEW FUNCTIONALITY-Oct 25: US-----3.3 FCT - Final Report BNS - add WCP closing option for AB,MB,NB to the UI.

//TC: 262289,262296,262400,262713,267262
describe('TC: DealFlow - WCP set to false ', function () {
    var BNSFctUrn = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var instrumentNo = "123567";
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('CREATE BNS Deal through Lender service', function () {
            LenderIntegrationBNS.CreateBNSDeal('false', 'true', ProvinceName);

        })

        it('Accept Deal using Lawyer Integration', function () {
            BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)) {
                LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
                console.log(BNSFctUrn);
            }
            else {
                expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
                expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
            }
        })

        it('Home page', function () {
            browser.ignoreSynchronization = true;
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)) {
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
                if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.VerifyHomePage();
                }
                else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
            else {
                expect(true).toBe(false, "Unable to verify Home Page.");
            }
        })

        it('SendUpdateTransactionData REST service', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);

            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })

        it('Request for Funds', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                CustomLibrary.WaitForSpinnerInvisible();
                if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK" || ProvinceName == "BC") {
                    RFFPage.SubmitRFFProvince();
                    //HomePage.ClickOKRffSubmit();
                }
                if (ProvinceName == "NB" || ProvinceName == "ON") {
                    RFFPage.SubmitRFFBasedOnProv(ProvinceName);
                }
                CustomLibrary.WaitForSpinnerInvisible();
            }
            else {
                expect(true).toBe(false, "Unable to submit RFF.");
            }
        })

        it('SendUpdateTransactionData REST service - Update closing date ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                 browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })

        //TC: 262289,262296,262400,262713 Final Report with WCP set to No
        //TC: 265085- Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB - Added
        //TC: 265075-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB - Update
        //TC: 265094-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS MB -Removed
        //TC: 265076-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Update
        //TC: 265086- Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Added
        //TC: 265095-Update Deal History entries for amendments to PIN to reflect the correct field label for BNS NB - Removed
        //TC: 265074 
        it(' SendUpdateTransactionData REST service - Update Title Number ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,["123-109-221", "123-101-998"],instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                    browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })
        //TC: 265093 
        it('SendUpdateTransactionData REST service - Remove Title Number ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,[],instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })
        
        it(' SendUpdateTransactionData REST service - Add Title Number ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,["123-109-221", "123-101-998"],instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                    browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })

        it('TC: 326598, 326602, 326599, 326600, 326601, 326603- Deal History after adding, updating and removal of Title Number', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');

                if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK") {
                    //TC:326598- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments - Update- SK Province
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from 026-109-221; 026-101-998; to 123-109-221; 123-101-998', true)
                    //TC:326600- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments -  Deal History entries for amendments - SK- Removed
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from 123-109-221; 123-101-998; to', true)
                    //TC:326602- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments -  Deal History entries for amendments -  SK- Added
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from to 123-109-221; 123-101-998;', true)
                }
                if (ProvinceName == "ON") {
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from 026-109-221; 026-101-998; to 123-109-221; 123-101-998', true)
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from 123-109-221; 123-101-998; to', true)
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from to 123-109-221; 123-101-998;', true)
                }
                if (ProvinceName == "NB" || ProvinceName == "BC"  ) {
                    //DealHistory.VerifyDealHistoryTableSearch('The Lawyer has submitted changes.', true)
                    //TC:326601- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments - Update Deal History entries for amendments - UPdate - BC Province
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from 026-109-221; 026-101-998; to 123-109-221; 123-101-998', true)
                    //TC:326603- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments -  Deal History entries for amendments - BC- Removed
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from 123-109-221; 123-101-998; to', true)
                    //TC:326599- 3.1 BNS - SROT - Update PIN labels for BC and SK-  Deal History entries for amendments-  Deal History entries for amendments -  BC- Added
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from to 123-109-221; 123-101-998;', true)
                }
                

            }
            else {
                expect(true).toBe(false, "Unable to verify deal history..");
            }
        })

        

        it('TC: 326740, 326741, 326738, 326737, 326641, 326640, 326736, 326739, 326753, 326742, 326595, 326596, 328121, 328122, 329739 - Final Report with WCP set to No', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK" || ProvinceName == "BC") {
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    CustomLibrary.WaitForSpinnerInvisible();
                    if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK"){
                    //Verify Titlelabel and WCPPresent
                    //TC:326595- 3.1 BNS - SROT - Update PIN labels for BC and SK- SROT- SK Province
                    FinalReportPage.VerifyTitleLabel();
                    //TC:326743- 3.1 BNS - SROT - Update PIN labels for BC and SK- SROT- SK Province- Verifiy PIN changes on SROT >Property section
                    FinalReportPage.VerifyPINLabelNotPresent();
                    }
                    if (ProvinceName == "BC") {
                         //Verify Titlelabel and WCPPresent
                         //TC:326596- 3.1 BNS - SROT - Update PIN labels for BC and SK- SROT- BC Province
                    FinalReportPage.VerifyPIDLabel();
                }
                    // US-----3.3 FCT - Final Report BNS - add WCP closing option for AB and MB to the UI.                   
                    //TC:326736- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI - BC
                    //TC:326739- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI - SK
                    FinalReportPage.VerifyWCPPresent();
                   // if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                    FinalReportPage.AcceptAmendmentIfAvailable();

                   // }

                    // LLC Embedded Portal/ Navigate away functionality
                    FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                    FinalReportPage.NavigateAway();
                    FinalReportPage.VerifyNavigateAway();
                    FinalReportPage.NavigateAwayAcceptReject('Cancel');
                    FinalReportPage.NavigateAway();
                    FinalReportPage.NavigateAwayAcceptReject('OK');
                    browser.sleep(1500);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');

                    FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                    FinalReportPage.SelectDocLanguage('English');
                    FinalReportPage.ClickFRButton('btnSave');
                    browser.sleep(6000);
                    FinalReportPage.ClickFRButton('btnCreate');
                    //BNS-WCP closing option mandatory field check and selection  
                    //TC:326737- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK  UI - Mandatory field identifiers - SK
                    //TC:326738- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK  UI - Mandatory field identifiers - BC
                    //TC:329739- 11.5 Standardize portal messages to reference partner instead of Unity - Field(s) to be completed in Unity VM- BNS
                    //TC:328121- 11.2.4 BNS Final Report - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” - ON, AB, MB,
                    //TC:328122- 11.2.4 BNS Final Report - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” - NB, SK, BC
                    FinalReportPage.WCPMandatoryfieldValidation();    
                    
                    FinalReportPage.WCPMandatoryFieldSelection('Yes');
                    FinalReportPage.WCPMandatoryFieldSelection('No');
                    //TC:326740- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI- Mandatory field identifiers with Yes or No radio button - SK
                    //TC:326741- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI- Mandatory field identifiers with Yes or No radio button - BC
                    FinalReportPage.VerifyOnlyOneRadioButtonSelected('No');
                    FinalReportPage.ClickFRButton('btnSave');
                    FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    FinalReportPage.ClickFRButton('btnCreate');
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReportPage.VerifyFinalReportIsCreated().then(function(result)
                    {
                        if(result)
                        {     
                           // FinalReportPage.SubmitOKClick(ProvinceName);
                            //CustomLibrary.ClosePopup();
                            CustomLibrary.WaitForSpinnerInvisible();
                            browser.sleep(500);
                            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                            browser.sleep(500);
                            CustomLibrary.closeWindowUrlContains("pdfDocuments");
                            browser.sleep(500);
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);

                            FinalReportPage.ClickFRButton('btnSubmit');
                            FinalReportPage.SubmitFR();
                            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                            FinalReportPage.VerifyFRCheckmarkStatus('Complete');
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            //TC:326641- 4.3 BNS - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- BNS - Closing options =False -SK
                            //TC:326640- 4.3 BNS - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- BNS - Closing options =False -BC
                            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true)
                        }                       
                    })

                }
                if (ProvinceName == "NB" || ProvinceName == "ON") {
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    CustomLibrary.WaitForSpinnerInvisible();
                    //WCP closing option does not display to the UI
                    //TC:326742- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI - ON
                    //TC:326753- 4.1 BNS - SROT - Add WCP Closing Option for BC and SK UI - NB
                    FinalReportPage.VerifyWCPNotPresent();
                   // if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                        FinalReportPage.AcceptAmendmentIfAvailable();
                   // }

                    // LLC Embedded Portal/ Navigate away functionality
                    FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                    FinalReportPage.NavigateAway();
                    FinalReportPage.VerifyNavigateAway();
                    FinalReportPage.NavigateAwayAcceptReject('Cancel');
                    FinalReportPage.NavigateAway();
                    FinalReportPage.NavigateAwayAcceptReject('OK');
                    browser.sleep(1500);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');

                    FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                    FinalReportPage.SelectDocLanguage('English');
                    FinalReportPage.ClickFRButton('btnSave');
                    FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    FinalReportPage.ClickFRButton('btnCreate');                
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReportPage.VerifyFinalReportIsCreated().then(function(result)
                    {
                        if(result)
                        { 
                           // CustomLibrary.ClosePopup();
                           CustomLibrary.WaitForSpinnerInvisible();
                           browser.sleep(500);
                           CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                           browser.sleep(500);
                           CustomLibrary.closeWindowUrlContains("pdfDocuments");
                           browser.sleep(500);
                           CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.CreateSuccessMsg);
                            FinalReportPage.ClickFRButton('btnSubmit');
                            FinalReportPage.SubmitFR();
                            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true)
                        }
                       
                    })


                }
            }
            else {
                expect(true).toBe(false, "Unable to Verify Final Report.");
            }
        })
    }

   // var Provincearray = ["ON", "MB", "AB", "NB"];  
    var Provincearray = ["ON", "MB", "AB", "NB", "SK", "BC"];
   // var Provincearray = ["AB"];
    for (var i = 0; i < Provincearray.length; i++) {
        console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }
});

//TC: 262289,262296,262400,262713,267259
//TC:262291,262299,262394,267258, 303949
describe(' BNS-Deal Flow with WCP set to true', function () {
    var BNSFctUrn = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL = null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var IsFinalReportCreated = false;
    var instrumentNo = "123567";
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('CREATE BNS Deal through Lender service', function () {
            LenderIntegrationBNS.CreateBNSDeal('false', 'true', ProvinceName);
        })

        it('Accept Deal using Lawyer Integration', function () {
            
            BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)) {
                LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
            }
            else {
                expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
                expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
            }
        })

        it('Home page', function () {
            browser.ignoreSynchronization = true;
            if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)) {
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
                if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.VerifyHomePage();
                }
                else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
            else {
                expect(true).toBe(false, "Unable to verify Home Page.");
            }
        })

        it('SendUpdateTransactionData REST service', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);
  
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })

        it('Request for Funds', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                CustomLibrary.WaitForSpinnerInvisible();

                RFFPage.SubmitRFFProvince();
               // HomePage.ClickOKRffSubmit();
               // CustomLibrary.WaitForSpinnerInvisible();
            }
            else {
                expect(true).toBe(false, "Unable to submit RFF.");
            }
        })

        it('SendUpdateTransactionData REST service - Update closing date ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }
        })

        //TC-303949: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Final Report has been submitted -  BNS
        it('TC: 262289,262296,262400,262713, 303949, 304547, 307863, 288414, 288415, 288437, 288438 : Final Report -WCP set to True ', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                CustomLibrary.WaitForSpinnerInvisible();
                if (ProvinceName == "SK" || ProvinceName == "AB" || ProvinceName == "MB") {
                FinalReportPage.VerifyTitleLabel();
                }
                FinalReportPage.VerifyWCPPresent();
                   //Accept amendments if any
                   if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                    FinalReportPage.AcceptAmendmentIfAvailable();
                    browser.sleep(1000);
                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    browser.sleep(500);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    browser.sleep(500);
                }

                FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                FinalReportPage.SelectDocLanguage('English');
                FinalReportPage.ClickFRButton('btnSave');
                FinalReportPage.ClickFRButton('btnCreate');

                //TC-288414: LLC Embedded Portal - Mandatory field Functionality on the SROT Page
                //TC-288415: LLC Embedded Portal-Field identifier and Required fields message is displayed
                //if (ProvinceName == 'SK' ||ProvinceName == 'BC' || ProvinceName == 'AB' ) {
                FinalReportPage.WCPMandatoryfieldValidation(); 
                               
                //FinalReportPage.WCPMandatoryfieldValidation();
                
                //TC-304547: LLC Embedded Portal - Western Law Societies Conveyancing Protocol -  Closing options -  BNS - AB
                //TC-307863: LLC Embedded Portal - Western Law Societies Conveyancing Protocol -  Closing options -  BNS - MB
                
                FinalReportPage.WCPMandatoryFieldSelection('Yes');
                FinalReportPage.ClickFRButton('btnCreate');
                CustomLibrary.WaitForSpinnerInvisible();
                FinalReportPage.VerifyFinalReportIsCreated().then(function(result)
                {
                    IsFinalReportCreated = result;
                    console.log("Value is " + result);
                    if(result)
                    { 
                       // CustomLibrary.ClosePopup();
                       CustomLibrary.WaitForSpinnerInvisible();
                       browser.sleep(500);
                       CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                       browser.sleep(500);
                       CustomLibrary.closeWindowUrlContains("pdfDocuments");
                       browser.sleep(500);
                       CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        FinalReportPage.ClickFRButton('btnSubmit');
                        FinalReportPage.SubmitFR();
                        FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                        FinalReportPage.VerifyFRCheckmarkStatus('Complete');
                        //TC-303949: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Final Report has been submitted -  BNS
                        //Verify RC tab is disabled
                        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
    
              
                        //TC-288437: LLC Embedded Portal- Warning message is displayed on Resubmission > User selects Cancel
                        FinalReportPage.ClickFRButton('btnCreate');
                        FinalReportPage.VerifyWarningMessageFR(TestData.data[Lang].DealHistory[Env].WarningMessageFR);
                        FinalReportPage.ClickFRButtons('Cancel');
                        FinalReportPage.ClickFRButton('btnCreate');

                        //TC-288438: LLC Embedded Portal- Warning message is displayed on Resubmission > User selects OK
                        FinalReportPage.VerifyWarningMessageFR(TestData.data[Lang].DealHistory[Env].WarningMessageFR);
                        FinalReportPage.ClickFRButtons('OK');
                        //CustomLibrary.ClosePopup();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(500);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        browser.sleep(500);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    }
                })
                }
            else {
                expect(true).toBe(false, "Unable to Verify Final Report.");
            }
        })

        //TC:326638- 4.3 BNS - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - BNS - Closing options = True - SK
        //TC:326637- 4.3 BNS - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - BNS - Closing options = True - Bc
        it('TC: 267259, 326637, 326638- Deal History-with WCP set to True', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                if (IsFinalReportCreated) {
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch('Document Final Report has been submitted successfully and processed via Western Law Societies Conveyancing Protocol.', true);
            }

            else
            {
               expect(IsFinalReportCreated).toBe(true, "Document service is down.");
            }
           
            }

            else {
                expect(true).toBe(false, "Unable to verify deal history..");
                
            }
        

        })

        it('Check Manage Documents', function () {
         if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if (IsFinalReportCreated) {
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.VerifyDocumentsTableEntry('Final Report');
            }
            else {
                    expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }
        }
            
        else {
            expect(true).toBe(false, "Unable to verify final report document..");
            
        }


        })

        it('GetLawyerDealEvents SOAP service', function () {
            if (IsFinalReportCreated) {
                LenderIntegrationBNS.GetBNSLawyerDealEvents();
            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            } 
        })

        //TC:326656- 4.2 BNS - SROT - Ability to save WCP closing option when selected for BNS deals (BC & SK) - BNS BC - Submit- Get Lawyer Deal Events   
        //TC:326657- 4.2 BNS - SROT - Ability to save WCP closing option when selected for BNS deals (BC & SK) - BNS SK - Submit- Get Lawyer Deal Events   
        it('TC:326656, 326657- Verify final report document in GetLawyerDealEvents', function () {
            if  (IsFinalReportCreated) {
               //Verify GetLawyerDeal Events for FR
                expect(LenderIntegrationBNS.VerifyDealEvent('SUBMITSROT')).toBe(true);
                //Verify WCP type for FR
                expect(LenderIntegrationBNS.ReturnWCPValue('SUBMITSROT')).toBe("true",'WCP is not True');
                //Verify GetLawyerDeal Events for FR documents
                expect(LenderIntegrationBNS.ReturnDocDisplayName('DOCUMENTS')).toBe('Final Report');
            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }         
        })

        it('Verify Final Report in Operation Portal', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                if  (IsFinalReportCreated) {
                CustomLibrary.OpenNewTab();
              //  CustomLibrary.SwitchTab(1);
              CustomLibrary.navigateToWindow("",2);
                OperationsPortal.LoginOperationsPortal();
                OperationsPortal.SearchDealBNS(BNSFctUrn);
                OperationsPortal.ClickDocumentsTab();
                OperationsPortal.VerifyUploadedDocument("Final Report");
                //CustomLibrary.CloseTab();
                //CustomLibrary.SwitchTab(0);
                CustomLibrary.closeWindowUrlContains("OperationsPortal");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);   
            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            } 
        }

            else {
                
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }
        })


    }
    //per testcase, WCP available only for AB and MB
    
   // var Provincearray = ["AB", "MB",];
    var Provincearray = ["AB", "MB", "SK", "BC"];
    for (var i = 0; i < Provincearray.length; i++) {
        console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }
});

