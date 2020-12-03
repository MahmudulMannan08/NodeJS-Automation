'use strict'
var TestData = require('../../../TestData/TestData.js');
var Lang = TestData.data.LANGUAGE.value;
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RunSettings = require('../../../testData/RunSetting.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LenderIntegrationTD = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js')
var Notes = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js');
var Env = RunSettings.data.Global.ENVIRONMENT.value;

//TC:326635- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- Solicitor's Opinion- SK-TD
//TC:326634- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- Solicitor's Opinion- BC-TD
//TC:326534- 10.2 Change the label of the hyperlink found in the Help section from:  “LLC Unity User Guide” to "LLC Partner Integration User Guide” TD
describe('DealFlow for All Provinces closing via Solicitor', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    var IsFinalReportCreated = null;

    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {

        it('Create TD Deal', function () {
            LenderIntegrationTD.CreateTDDealthroughCode(ProvinceName);
        })

        it('Verify TD Deal status in Operations Portal', function () {

            browser.ignoreSynchronization = true;
            TDDealIsInDraft = true;
            TDDealPresentInOperationalPortal = false;
            TDDealID = LenderIntegrationTD.ReturnfctURNTD();
            lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
            IsFinalReportCreated = false;

            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
                console.log("Closing Date " + TDDealID);
                console.log("Reg Date " + lenderReferenceNumber);
                OperationsPortal.LoginOperationsPortal();

                OperationsPortal.SearchDealBNS(TDDealID).then(function (count) {

                    if (count > 0) {

                        TDDealPresentInOperationalPortal = true;
                        OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                        OperationsPortal.GetDealStatus().then(function (status) {
                            expect(status).not.toBe("DRAFT", "Deal Status for TD Deal.");
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

        //TC:326534- 10.2 Change the label of the hyperlink found in the Help section from:  “LLC Unity User Guide” to "LLC Partner Integration User Guide” TD
        it('TC:288508, 326534, 329728 - Verify Need help page', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                NeedHelp.VerifyNeedHelpLink();
                HomePage.ClickNeedHelp();
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.WaitForSpinnerInvisible();
                CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
                browser.sleep(300);
                //TC:329728 -11.6 Standardize portal messages to reference partner instead of Unity -   LLC Partner Integration User Guide-TD
                HomePage.VerifyGuideUsLinkOnNeedHelpPage();
                HomePage.VerifyContactUsOnNeedHelpPage();
                //CustomLibrary.SwitchTab(0);
                CustomLibrary.closeWindowUrlContains("contactus");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
                NeedHelp.VerifyNeedHelpLink();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                NeedHelp.VerifyNeedHelpLink();
                
                                            
            }
            else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
          
        }) 

        it('Modify registration date,Closing date', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                InstrumentNumber = CustomLibrary.getRandomNumber(6);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,AssessmentRollNumber,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                browser.sleep(3500);
               
                //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        
        it('Verify Notes section', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                Notes.VerifyNotesUnavailableforTDMessage();
            }
            else {
                expect(false).toBe(true, "Unable to Verify Notes Section.");
            }
        })

        it("Submit Amendments to Lender", function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                FinalReport.AcceptAmendmentIfAvailable();
            }
            else {
                expect(false).toBe(true, "Unable to Submit Amendments to lender.");
            }
        })

        it('Create RFF', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.SelectFundingReqType("Request for Funds");
                RFFPage.SendRequestedAmount(2500);
                RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
                RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
                RFFPage.ClickRFFButtons('Create');
                RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                    console.log("Value is " + result);
                    if(result)
                    {
               
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        RFFPage.VerifyCreatedRFFConfirmationMessage();
                        RFFPage.VerifySubmitButtonStatus('Enabled');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName, true)
                    }
                })
                        
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        })

        it('Update Cosing Date based on weekend', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                //LawyerIntegrationTD.ModifyTDDealIDVdataTypeB(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), ProvinceName);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,AssessmentRollNumber,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
                browser.sleep(3500);

            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        })

        //TC-306223: Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - closing option is hidden for TD deals for ON and NB
        it('TC-306223, 329688, 328109, 328110, 326634, 326634, 326749, 326752, 326744, 326746: Create Final Report', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                browser.sleep(1000);
                FinalReport.AcceptAmendmentIfAvailable();
                var EC = protractor.ExpectedConditions;
                browser.wait(EC.invisibilityOf(element(by.css('.loading-spinner.ng-star-inserted'))), 45000, 'Waiting for Fadder to become invisible').then(() => {
                    browser.sleep(1000);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    FinalReport.ClickFRButton('btnCreate');
                    //TC:326744- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - Mandatory field identifiers - BC
                    //TC:326746- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - Mandatory field identifiers - SK
                    //TC:329688- 11.5 Standardize portal messages to reference partner instead of Unity - Required field(s) to be completed in Unity  VM- TD
                    //TC:328109- 11.2.2 TD Final Report - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” - ON, AB, MB,
                    //TC:328110- 11.2.2 TD Final Report - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system” -NB, SK, BC
                    FinalReport.WCPMandatoryfieldValidation();
                    //TC-306223: Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - closing option is hidden for TD deals for ON and NB
                    if (ProvinceName == "NB" || ProvinceName == "ON") {
                        //TC:326749- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - ON
                        //TC:326752- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - NB
                        FinalReport.VerifyTDWCPNotPresent();
                        FinalReport.VerifyTDTitleSolicitorClosingPresentNoWCP();
                        FinalReport.SelectClosingViaCB('Soli')
                    } else {
                        FinalReport.SelectClosingViaCBwithWCP("Soli");
                    }
                    FinalReport.ClickFRButton('btnCreate');
                    FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                    FinalReport.ClickFRButton('btnSave');
                    FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    FinalReport.ClickFRButton('btnCreate');
                    FinalReport.VerifyFinalReportIsCreated().then(function(result)
                    {
                    IsFinalReportCreated = result;
                    console.log("Value is " + result);
                    if(result)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true);
                        //TC:326635- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- Solicitor's Opinion- SK-TD
                        //TC:326634- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry- Solicitor's Opinion- BC-TD
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportBySolicitor, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);
                    }
                })
             }, (error) => {
                expect(false).toBe(true, "Unable to Create Final Report.");
                })
                
            }
            else {
                expect(false).toBe(true, "Unable to create Final Report.");
            }
        })

        it('Check Manage Documents', function () {
            if (IsFinalReportCreated) {
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                ManageDocuments.VerifyDocumentsTableEntry('Request for Funds - Information');
                ManageDocuments.VerifyDocumentsTableEntry('Final Report on Title');
            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");

            }
        })

        it('Verify Final Report in Operation Portal', function () {
            if (IsFinalReportCreated) {
                CustomLibrary.OpenNewTab();
                browser.sleep(1000);
                CustomLibrary.navigateToWindow("",2);
                OperationsPortal.LoginOperationsPortal();
                OperationsPortal.SearchDealBNS(TDDealID);
                OperationsPortal.ClickDocumentsTab();
                OperationsPortal.VerifyUploadedDocument("Final Report on Title");
                //CustomLibrary.CloseTab();
                //CustomLibrary.SwitchTab(0);
                browser.sleep(1000);
                CustomLibrary.closeWindowUrlContains("OperationsPortal");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);

            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }
        })

         //Lender closes the deal
        it('SendDealStatusChangeRequest SOAP service - Close deal', function () {
        if  (IsFinalReportCreated) {
            
            //Lender closes deal
            LenderIntegrationTD.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
            browser.sleep(3500);
          }
          else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
          }  
        }) 

        //Verify deal status after Lender closes
        it('Verify Deal Status', function () {
            if  (IsFinalReportCreated) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(TDDealID, 'COMPLETED');
        }
        else{
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        }
        })

        //TC-303943: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is Completed/Closed  -  TD
        it('TC-303943: Request Cancellation State', function () {
        if  (IsFinalReportCreated) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');     
            //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
             
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        }       
        })

        //TC-291324: LLC EmbeddedPortal - Verify Lender Portal for close status - TD
        //TC-291328: LLC EmbeddedPortal - Verify Lender Portal for Lawyer deal Information including - TD
        it('TC-291324, 291328: Lender Portal -Verify deal status', function () {
            if  (IsFinalReportCreated) {
                if  (lenderReferenceNumber) {
                    CustomLibrary.OpenNewTab();
                    //CustomLibrary.SwitchTab(1);
                    browser.sleep(1000);
                    CustomLibrary.navigateToWindow("",2);
                    LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                    LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                    //TC-291324: LLC EmbeddedPortal - Verify Lender Portal for close status - TD
                    LenderPortal.VerifyTDDealStatus('Closed'); 
                    //TC-291328: LLC EmbeddedPortal - Verify Lender Portal for Lawyer deal Information including - TD
                    LenderPortal.NavigateToDocumentsTab();
                    LenderPortal.uploadLenderDoc('Test');
                    LenderPortal.NavigateToDealHistoryTab();
                    LenderPortal.VerifyHistoryTableEntry('Other-Test Document uploaded successfully.');

                }
                //CustomLibrary.CloseTab();
                //CustomLibrary.SwitchTab(0);
                browser.sleep(2000);
                CustomLibrary.closeWindowUrlContains("LenderPortal");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            }
            else {
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }
        })

        //TC-303487: LLC EmbeddedPortal - Verify Ops Portal for close status- TD
        it('TC-303487: Verify Deal Status in Operations Portal', function () {
            if  (IsFinalReportCreated) {     
                CustomLibrary.OpenNewTab();
                //CustomLibrary.SwitchTab(1);
                browser.sleep(1000);
                CustomLibrary.navigateToWindow("",2);
                OperationsPortal.LoginOperationsPortal();
                //Search deal in operations portal
                OperationsPortal.SearchDealBNS(TDDealID).then(function(count){   
                    if(count > 0)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        OperationsPortal.ClickMilestinesAndStatus();
                        OperationsPortal.VerifyDealStatus("COMPLETED"); 
                    } 
                    //CustomLibrary.CloseTab();
                    //CustomLibrary.SwitchTab(0);
                    browser.sleep(1000);
                    CustomLibrary.closeWindowUrlContains("OperationsPortal");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    
                   });       
            }
            else{
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }
        })

        //TC-303558: LLC EmbeddedPortal -Verify Read only status- TD
        it('TC-303558: Verify UI is not accessible in Embedded Portal after deal lender closes the deal ', function () {
        if  (IsFinalReportCreated) {     
            
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyClosedRequestMsg();
            HomePage.VerifySaveButtonStatus('Disabled');
                   
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifyClosedRequestMsg();
            RFFPage.VerifyRFFDropDown('Disabled');
                    
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReport.VerifyClosedRequestMsg();
            FinalReport.VerifyallButtonStatusFinalReport('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyClosedRequestMsg();
            ManageDocuments.VerifyDisableBrowseButton();
                        
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyClosedRequestMsg();
            DealHistory.VerifyDealHistoryTableSearch('Other-Test Document uploaded successfully.', true);

            
        }
        else 
        {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
        }
       
        })
          //TC-303487: LLC EmbeddedPortal - Verify Ops Portal for close status- TD
          it('TC-303487: Verify Deal Status and Final Report in Operations Portal', function () {
            if  (IsFinalReportCreated) {     
               // CustomLibrary.OpenNewTab();
              //  CustomLibrary.SwitchTab(1);
                OperationsPortal.LoginOperationsPortal();
                //Search deal in operations portal
                OperationsPortal.SearchDealBNS(TDDealID).then(function(count){   
                    if(count > 0)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        OperationsPortal.ClickMilestinesAndStatus();
                        OperationsPortal.VerifyDealStatus("COMPLETED"); 
                        OperationsPortal.ClickDocumentsTab();
                        OperationsPortal.VerifyUploadedDocument("Final Report on Title");
                    } 
                   // CustomLibrary.CloseTab();
                  //  CustomLibrary.SwitchTab(0);
                    
                   });       
            }
            else{
                expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            }
        })

    }

    

    
    var Provincearray = ["SK", "BC", "AB", "MB", "NB", "ON"];
   // var Provincearray = [  "AB", "MB", "NB", "ON"];
    //NB pass
   //  var Provincearray = ["BC"];
    for (var i = 0; i < Provincearray.length; i++) {
        //console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }
})

//TC:326631- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - TD- SK
//TC:326630- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - TD- BC
describe('DealFlow for All Provinces closing via Western law socities', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var IsFinalReportCreated = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
        LenderIntegrationTD.CleanUpScript();
    });
    function maintest(ProvinceName) {

        it('Create TD Deal', function () {
            LenderIntegrationTD.CreateTDDealthroughCode(ProvinceName);
        })

        it('Verify TD Deal status in Operations Portal', function () {

            browser.ignoreSynchronization = true;
            TDDealIsInDraft = true;
            TDDealPresentInOperationalPortal = false;
            TDDealID = LenderIntegrationTD.ReturnfctURNTD();
            lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();

            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
                console.log("Closing Date " + TDDealID);
                console.log("Reg Date " + lenderReferenceNumber);
                OperationsPortal.LoginOperationsPortal();

                OperationsPortal.SearchDealBNS(TDDealID).then(function (count) {

                    if (count > 0) {

                        TDDealPresentInOperationalPortal = true;
                        OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                        OperationsPortal.GetDealStatus().then(function (status) {
                            expect(status).not.toBe("DRAFT", "Deal Status for TD Deal.");
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

        it('Modify registration date,Closing date', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                InstrumentNumber = CustomLibrary.getRandomNumber(6);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, null,AssessmentRollNumber,["4444", "5555", "6666"],InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                browser.sleep(3500);
               
                //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('TC:324917, 328108, 328107, 324929,321304,324916- Create RFF', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
     
                RFFPage.SelectFundingReqType("Request for Funds");
                //TC:328108- 11.2.1 TD RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system ” - RFF- ON,AB,MB
                //TC:328107- 11.2.1 TD RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in the Partner/Source system ” - RFF- NB, SK, BC
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.MandatoryfieldValidation(); 

                //TC:324917- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- RFF- SK Province
                if(ProvinceName == 'SK' || ProvinceName == 'AB' || ProvinceName == 'MB') {
                RFFPage.VerifyTitleLbl();
                }
                //TC:324929- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- RFF - BC Province
                else if (ProvinceName == 'BC') {
                    RFFPage.VerifyPID();
                }

                //TC:321304- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR - SK Province
                RFFPage.SelectFundingReqType("Confirmation of Registration (Collateral Mortgage only)");
                if(ProvinceName == 'SK' || ProvinceName == 'AB' || ProvinceName == 'MB') {
                RFFPage.VerifyTitleLbl();
                }
                //TC:324916 - 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR - BC Province
                else if (ProvinceName == 'BC') {
                    RFFPage.VerifyPID();
                }
                
                RFFPage.SelectFundingReqType("Request for Funds");
                RFFPage.SendRequestedAmount(2500);
                RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
                RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                    if(result)
                    {
                        //CustomLibrary.ClosePopup();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        RFFPage.VerifyCreatedRFFConfirmationMessage();
                        RFFPage.VerifySubmitButtonStatus('Enabled');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        CustomLibrary.WaitForSpinnerInvisible();
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName, true)
                    }
                })
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        })

        it('Remove title number', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                InstrumentNumber = CustomLibrary.getRandomNumber(6);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, null,AssessmentRollNumber,[],InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                browser.sleep(3500);
               
                //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })

        it('Add title number', function () {
            if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                InstrumentNumber = CustomLibrary.getRandomNumber(6);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, null,AssessmentRollNumber,["4444","5555","6666"],InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                browser.sleep(3500);
               
                //LawyerIntegrationTD.ModifyTDTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            }
        })
       
        it('TC:324935, 324937, 326588, 324942, 326589, 324936 - Deal History after adding, updating and removal of Title Number', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');

                if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK") {
                    //TC:324935- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR -  Deal History entries for amendments - Update- SK Province                   
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from 1111;2222;3333; to 4444;5555;6666;', true)
                    //TC:324937- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR -  Deal History entries for amendments - SK- Removed
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from 5555;4444;6666; to', true)
                    //TC:326588- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR -  Deal History entries for amendments -  SK- Added
                    DealHistory.VerifyDealHistoryTableSearch('Title Number(s) changed from to 4444;5555;6666;', true)
                }
                if (ProvinceName == "ON") {
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from 026-109-221; 026-101-998; to 123-109-221; 123-101-998', true)
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from 123-109-221; 123-101-998; to', true)
                    DealHistory.VerifyDealHistoryTableSearch('Property Identification Number(s) changed from to 123-109-221; 123-101-998;', true)
                }
                if (ProvinceName == "NB" || ProvinceName == "BC"  ) {
                    
                    //TC:324942- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR - Update Deal History entries for amendments - UPdate - BC Province
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from 1111;2222;3333; to 4444;5555;6666;', true)
                    //TC:326589- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR -  Deal History entries for amendments - BC- Removed
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from 5555;4444;6666; to', true)
                    //TC:324936- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- COR -  Deal History entries for amendments -  BC- Added
                    DealHistory.VerifyDealHistoryTableSearch('PID(s) changed from to 4444;5555;6666;', true)
                }
            }
            else {
                expect(true).toBe(false, "Unable to verify deal history..");
            }
        })

        it('Update Cosing Date based on weekend', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                //LawyerIntegrationTD.ModifyTDDealIDVdataTypeB(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), ProvinceName);
                LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,AssessmentRollNumber,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
                browser.sleep(3500);

            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        })
        
        it('TC-306217, 306218, 326630, 326631, 326591, 326592, 326745, 326747, 326652, 326653, 326654, 326655, 326643, 326644  : Create Final Report', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                browser.sleep(1000);
                FinalReport.AcceptAmendmentIfAvailable();
                var EC = protractor.ExpectedConditions;
                browser.wait(EC.invisibilityOf(element(by.css('.loading-spinner.ng-star-inserted'))), 45000, 'Waiting for Fadder to become invisible').then(() => {
                    browser.sleep(1000);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    CustomLibrary.WaitForSpinnerInvisible();
                    //TC:326643- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK) - Non WCP Options - TD BC
                    //TC:326644- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK)- Non WCP Options - TD SK
                    FinalReport.VerifyTitleInsurancePresentTD();
                    FinalReport.VerifySolicitorPresentTD();
                    if (ProvinceName == "AB" || ProvinceName == "MB" || ProvinceName == "SK"){
                        //Verify Titlelabel and WCPPresent
                        //TC:326591- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- SROT- SK Province
                        FinalReport.VerifyTitleLabelTD();
                        
                        FinalReport.VerifyPINLabelNotPresentTD();
                        }
                        if (ProvinceName == "BC") {
                        //Verify Titlelabel and WCPPresent
                        //TC:326592- 1.1 TD RFF/COR & SROT - Update PIN labels for BC and SK- SROT- BC Province    
                        FinalReport.VerifyPIDLabelTD();
                    }
                        //TC:326745- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - SK
                        //TC:326747- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - BC
                        FinalReport.VerifyWCPPresentTD();
                    //TC-306217:  Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - TD- AB
                    //TC-306218: Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol MB - TD
                    FinalReport.SelectClosingViaCBAsWCP("Western");
                    //TC:326748- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - Mandatory field identifiers - Save - BC
                    //TC:326750- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI - Mandatory field identifiers - Save - SK
                    FinalReport.VerifyOnlyOneRadioButtonSelectedTD('Western');
                    FinalReport.ClickFRButton('btnSave');
                    FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    //TC:326654- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK)- TD SK - Explicit Save SROT
                    //TC:326655- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK) - TD SK - Explicit Save SROT
                    FinalReport.VerifyWCPAppearsSelectedAfterSave();                    
                    //TC:326653 - 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK)- TD SK- Create SROT
                    //TC:326652- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK)- TD BC - Create SROT
                    FinalReport.ClickFRButton('btnCreate');
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReport.VerifyWCPAppearsSelectedAfterCreate();
                    FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                    //FinalReport.ClickFRButton('btnSave');
                    //FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    FinalReport.ClickFRButton('btnCreate');
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReport.VerifyFinalReportIsCreated().then(function(result)
                    {
                        IsFinalReportCreated = result;
                        console.log("Value is " + result);
                        if(result)
                        {
                            //CustomLibrary.ClosePopup();
                            CustomLibrary.WaitForSpinnerInvisible();
                            browser.sleep(2000);
                            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                            browser.sleep(500);
                            CustomLibrary.closeWindowUrlContains("pdfDocuments");
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                            RFFPage.ClickRFFButtons('Submit');
                            RFFPage.ClickRFFButtons('OK');
                            RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);  
                            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true);
                            //TC:326631- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - TD- SK
                            //TC:326630- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - TD- BC
                            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportByWestern, true);
                            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);
                            
                        }
                    })
            }, (error) => {
                expect(false).toBe(true, "Unable to Create Final Report.");
            })

            }
            else {
                expect(false).toBe(true, "Unable to create Final Report.");
            }
        })

        
        //TC:326645- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK) - TD BC - Submit - Get Lawyer Deal Events
        //TC:326646- 2.2 TD - SROT - Ability to save WCP closing option when selected for TD deals (BC & SK) - TD SK - Submit- Get Lawyer Deal Events
        it('TC-326751, 326645, 326646: Get lawyer deal events ', function () {
            if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
            {
               LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
                //Verify WCP type for FR
                //TC:326751- 2.1 TD - SROT - Add WCP Closing Option for BC and SK to the UI  TD- BC
              //  LenderIntegrationTD.LogLawyerDealEventFR(2, 'WESTERN PROTOCOL');
                 LenderIntegrationTD.LogLawyerDealEventFRNEW('SUBMITSROT', 'WESTERN PROTOCOL'); 
            }
            else {
                expect(false).toBe(true, "Error occured while accepting the deal.");
            } 
        })  

        

            
    }
    
    var Provincearray = ["AB", "MB", "SK", "BC"];
   // var Provincearray = [ "MB"];
    //NB pass
    // var Provincearray = ["BC"];
    for (var i = 0; i < Provincearray.length; i++) {
        //console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }
})

//TC:326633- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - Title Insurance- SK -TD
//TC:326632- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - Title Insurance- BC -TD
//TC-245344: LLC Embedded Portal/ Create/ Re-Create SROT Document
//TC-245343: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
//TC-245439: LLC Embedded Portal/ Submit SROT via Title Insurance
describe('Create final report IDV Type B Closing Via Title Insurance e2e', function () {
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var lenderReferenceNumber = null;
    var IsFinalReportCreated = null;
    var LawyerFullName = RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName;
    var InstrumentNumber = null;
    var AssessmentRollNumber =null;
    afterAll(function () {
        console.log('afterAll - Cleaning up memory');
        LenderIntegrationTD.CleanUpScript();
    });

    function maintest(ProvinceName) {

    it('Create TD Deal', function () {  
        //LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
        LenderIntegrationTD.CreateTDDealthroughCode(ProvinceName);
    })

    it('Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
        TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
        IsFinalReportCreated = false;

        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {
            console.log("Closing Date "+ TDDealID);
            console.log("Reg Date "+ lenderReferenceNumber);
            OperationsPortal.LoginOperationsPortal();
            
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
            else 
            {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })

    it('Verify Title Insurance fields on Final report page', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            if (ProvinceName == "NB" || ProvinceName == "ON") {
              
                FinalReport.SelectClosingViaCB('Title')
            } else {
                FinalReport.SelectClosingViaCBAsWCP("Title");
            }
            //Verify Title insurance fields are displayed
            FinalReport.VerifyTitleInsuranceFieldsArePresent();
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
          
           
        }

        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }  
    })

    it('Modify registration date,Closing date', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
          // LawyerIntegrationTD.ModifyTDTransactionData(TDDealID,  CustomLibrary.CurrentOrPastDate(),  CustomLibrary.CurrentOrFutureDate(), CustomLibrary.getRandomNumber(5));  


            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(5);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
           browser.sleep(3500);
        
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it("Submit Amendments to Lender", function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
        }
        else {
            expect(false).toBe(true, "Unable to Submit Amendments to lender.");
        }
    })

    it('Create RFF', function () {       
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Deposit to my/our TD Canada Trust trust account');
            RFFPage.SelectTrustAccountDdl(RunSettings.data.Global.TD[Env].TrustAcc);
            RFFPage.ClickRFFButtons('Create');
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                if(result)
                {
                    //CustomLibrary.ClosePopup();
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyCreatedRFFConfirmationMessage();
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                    CustomLibrary.WaitForSpinnerInvisible();  
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch((TestData.data[Lang].DealHistory[Env].RFFSubmitted + LawyerFullName), true); 
                }
            })
            
        }
        else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
        }  
    })

    it('Update Cosing Date based on weekend', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) 
        {
            //dealID, RegistrationDate, ClosingDate, InstrumentNumber
            //LawyerIntegrationTD.ModifyTDDealIDVdataTypeB(TDDealID, CustomLibrary.CurrentOrPastDate(), CustomLibrary.CurrentOrPastDate(), CustomLibrary.getRandomNumber(6), TestData.data[Lang].WebService.Province);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,null,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
          
            browser.sleep(3500);
        }
        else {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }  
    })

        //TC-245439: LLC Embedded Portal/ Submit SROT via Title Insurance
    it('TC-245439, 245343, 245345, 306219, 306220, 326633, 326632: Submit Final Report via Title Insurance', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');

                if (ProvinceName == "NB" || ProvinceName == "ON") {
                    FinalReport.VerifyTDWCPNotPresent();
                    FinalReport.VerifyTDTitleSolicitorClosingPresentNoWCP();
                    FinalReport.SelectClosingViaCB('Title')
                } else {
                    FinalReport.SelectClosingViaCBAsWCP("Title");
                }

                FinalReport.EnterTitleInsuranceScheduleBExceptions();
                FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                FinalReport.ClickFRButton('btnCreate');
                FinalReport.VerifyFinalReportIsCreated().then(function(result)
                {
                    IsFinalReportCreated = result;
                    console.log("Value is " + result);
                    if(result)
                    {
                        //CustomLibrary.ClosePopup();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true);
                        //TC-306219: Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - Title Insurance- AB -TD
                        //TC-306220: Update Deal History entries for Final Report to include Western Law Societies Conveyancing Protocol - Title Insurance- MB -TD
                        //TC:326633- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - Title Insurance- SK -TD
                        //TC:326632- 2.3 TD - SROT - Ability to display WCP closing option (if selected) in SROT deal history entry - Title Insurance- BC -TD
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportByTitle, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportCreated, true);    
                    }
                })
            }, (error) => {
                expect(true).toBe(feel, "Error occur while accepting amendments.");
            })

        }
        else {
            expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            
        }  
    })

    it('Check Manage Documents', function () {
        if (IsFinalReportCreated) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyDocumentsTableEntry('Request for Funds - Information');
            ManageDocuments.VerifyDocumentsTableEntry('Final Report on Title');
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            
        }
    })

    it('Verify Final Report in Lender Portal', function () {
        if (IsFinalReportCreated) {
            if  (lenderReferenceNumber) {
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Request for Funds - Information');
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Final Report on Title');
            }
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            
        }
    })

    it('Verify Final Report in Operation Portal', function () {
        if (IsFinalReportCreated) {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SearchDealBNS(TDDealID);
            OperationsPortal.ClickDocumentsTab();
            OperationsPortal.VerifyUploadedDocument("Final Report on Title");
        }
        else {
            expect(true).toBe(IsFinalReportCreated, "Document service is down.");
            
        }
    })

    
/*
    //TC:326666- LLC Embedded Portal -  Final Report- Ability to send WCP closing option - TD BC Only
    it('TC-326666: Get lawyer deal events ', function () {
        if ((typeof lenderReferenceNumber !== 'undefined') && (lenderReferenceNumber !== null) && (lenderReferenceNumber !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) 
        {
            LenderIntegrationTD.TDLawyerEvents(lenderReferenceNumber);
            //Verify WCP type for FR
            //TC:326666- LLC Embedded Portal -  Final Report- Ability to send WCP closing option - TD BC Only
            LenderIntegrationTD.LogLawyerDealEventFR(2, 'WESTERN PROTOCOL');
          
           //LenderIntegrationTD.ParseGetLawyerDealEventsResponseClosingOption('SUBMITSROT',true, 'WESTERN PROTOCOL');
           
           
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        } 
    })  */



}
    
    var Provincearray = ["AB", "MB", "ON", "NB", "SK", "BC"];
   // var Provincearray = ["AB", "MB", "ON", "NB"];
    for (var i = 0; i < Provincearray.length; i++) {
    maintest(Provincearray[i]);
} 

})

