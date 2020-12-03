'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var BNSTestData = require('../../../testData/BNS/BNSTestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var dateFormat = require('dateformat');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
describe('Deal Flow for BNS with all provinces', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LangBNS = BNSTestData.data.LANGUAGE.value;
    var BNSFctUrn = null;
    var lenderReferenceNumber = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL = null;
    var instrumentNo = "123567";
    var EC = protractor.ExpectedConditions;
    var IsFinalReportCreated = false;
    var FirstNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value;
    var LastNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value;
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    function maintest(ProvinceName) {
        it('Generate BNS Deal - Create deal soap service', function () {
            LenderIntegrationBNS.CreateBNSDeal('true', 'true', ProvinceName);
        })

        it('Accept Deal - AcceptReject soap service', function () {
            BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            if (BNSFctUrn) {
                LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
            }
            else {
                expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
                expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
            }
        })

        it('Home page', function () {
            browser.ignoreSynchronization = true;
            if (BNSFctUrn) {
                loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
                if (loginRedirectURL) {
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.VerifyHomePage();
                    HomePage.VerifyMortgageInfoSection();                    
                    HomePage.VerifyMortgageInfoValue();
                    HomePage.VerifyMailRecSection();
                    HomePage.VerifyMailRecValidation();
                    HomePage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                    HomePage.VerifyDealStatusSection('LLC');
                    HomePage.VerifyDealAcceptedCheckMark('LLC');
                    MenuPanel.VerifyLeftMenuItems();
                    MenuPanel.ToggleSideMenu();
                    MenuPanel.ToggleSideMenu();
                    HomePage.NavigateAway();
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealAccept, true)
                }

                else {
                    expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                    expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
            else {
                expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
                expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
            }
        })

        it('GetLawyerDealEvents SOAP service', function () {
            if (loginRedirectURL) {
                LenderIntegrationBNS.GetBNSLawyerDealEvents();
            }
            else {
                expect(true).toBe(false, "Unable to Get Deal Events for the deal.");
            }
        })

        it('Verify Deal Event for "Accepting" deal', function () {
            if (loginRedirectURL) {
                var DealStatus = LenderIntegrationBNS.ReturnDealStatus('ACCEPT');
                expect(DealStatus).toBe('ACTIVE');
            }
            else {
                expect(true).toBe(false, "Unable to verify deal events for accepting the deal.");
            }
        })

        it('SendUpdateTransactionData REST service', function () {
            if (loginRedirectURL) {
                AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
                var ClosingDate = CustomLibrary.CurrentOrFutureDate();
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);
         
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");
            }

        })

        it('TC-328017, 327080: Request for Funds', function () {
            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.VerifyRFFPage();
                RFFPage.VerifyRFFPageIDV();
                RFFPage.CommentonRFFIDV("This is an automated comment on Request for funds page");
                //TC:328017- 11.2.3 BNS RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in your Source system”- NB, SK, BC
                //TC:327080- 11.2.3 BNS RFF - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in your Source system”- ON, AB, MB
                RFFPage.VerifyRFFValidationIDBforBNS();
                RFFPage.SelectAcknowledgement(1);
                RFFPage.SubmitRFFBasedOnProv(ProvinceName);
                HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);
                RFFPage.VerifyRFFCheckmarkPostSubmission();
                RFFPage.VerifySubmitButtonStatus('Disabled');
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.VerifySubmitButtonStatus('Enabled');
            }
            else {
                expect(true).toBe(false, "Unable to submit RFF.");
            }
        })

        it('RFF - Navigation away, Resubmit RFF, DH', function () {
            if (loginRedirectURL) {

                //expect(LenderIntegrationBNS.VerifyDealEvent('REQUESTFORFUNDS')).toBe(true);
                RFFPage.CommentonRFFIDV(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
                RFFPage.NavigateAway();
                HomePage.NavigateAwayAcceptReject('Cancel');
                RFFPage.NavigateAway();
                HomePage.NavigateAwayAcceptReject('OK');
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.CommentonRFFIDV(BNSTestData.data[LangBNS].RFF.commentRFF);
                RFFPage.ResubmitRFF();
                HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);
                RFFPage.VerifySubmitButtonStatus('Disabled');
                HomePage.VerifyRFFCheckMark();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                var date = LenderIntegrationBNS.ReturnClosingDate();
                var formattedDate = dateFormat(date, "UTC:mmmm d, yyyy");
                // DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory[Env].RFFSubmitted + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFF + ').');
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFF + ').', true)
            }
            else {
                expect(true).toBe(false, "Unable to verify GetLawyerDealEvents, Navigation away, Resubmit RFF, Deal history on RFF submission.");
            }
        })

        it('Notes - standard / regular', function () {
            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NotesPage.VerifyNotesPage();
                NotesPage.ClickNotesButton('NewNote');
                NotesPage.VerifyNewNoteFeilds();
                NotesPage.ClickNotesButton('Cancel');
                NotesPage.NewNoteFeildsHidden();
                NotesPage.ClickNotesButton('NewNote');
                NotesPage.ClickNotesButton('SendNote');
                NotesPage.VerifyMissinfieldMessag();
                NotesPage.SelectStandardNoteType(TestData.data[Lang].Notes.StdNoteOption1);
                NotesPage.VerifyPopulatedSubjectTB(TestData.data[Lang].Notes.StdNoteOption1);
                NotesPage.VerifyPopulatedNoteTB(TestData.data[Lang].Notes.StdNote1);
                NotesPage.ClickNotesButton('SendNote');
                NotesPage.NewNoteFeildsHidden();
                expect(NotesPage.GetNotesTableCountBNSTD()).toBe(1);
                NotesPage.VerifyNotesTableEntry(1, FirstNameLawyer, LastNameLawyer, TestData.data[Lang].Notes.StdNoteOption1, TestData.data[Lang].Notes.StdNote1);
                NotesPage.VerifySavedChanges(TestData.data[Lang].Messages.SaveSuccessMsg);
                NotesPage.ClickNotesButton('NewNote');
                NotesPage.EnterSubjectText(BNSTestData.data[LangBNS].Notes.subjectNote);
                NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNote);
                NotesPage.ClickNotesButton('SendNote');
                expect(NotesPage.GetNotesTableCountBNSTD()).toBe(2, "Verify Note Count under Notes Tables");
                NotesPage.ExpandNoteNVerify(1);
                NotesPage.VerifyNotesTableEntry(1, FirstNameLawyer, LastNameLawyer, BNSTestData.data[LangBNS].Notes.subjectNote, BNSTestData.data[LangBNS].Notes.detailNote);
                NotesPage.CollapseNoteNVerify(1);
                NotesPage.ClickNotesButton('NewNote');
                NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
                NotesPage.NavigateAway();
                NotesPage.VerifyNavigateAway();
                NotesPage.NavigateAwayAcceptReject('Cancel');
                NotesPage.VerifyPopulatedNoteTB(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
                NotesPage.NavigateAway();
                NotesPage.VerifyNavigateAway();
                NotesPage.NavigateAwayAcceptReject('OK');
                browser.wait(EC.textToBePresentInElement(element(by.css('.title')), 'Home'), 20000, 'Home page is taking too long to load');
                HomePage.VerifyHomePage();
            }
            else {
                expect(true).toBe(false, "Unable to send standard / regular notes.");
            }
        })

        it('GetLawyerDealEvents SOAP service', function () {
            if (loginRedirectURL) {
                LenderIntegrationBNS.GetBNSLawyerDealEvents();
            }
            else {
                expect(true).toBe(false, "Unable to get deal events.");
            }
        })

        it(' Verify Lawyer note to Lender and RFF GetLawyerDEalEvent', function () {
            if (loginRedirectURL) {

                 //Verify GetLawyerDeal Events for RFF
                expect(LenderIntegrationBNS.VerifyDealEvent('REQUESTFORFUNDS')).toBe(true, "RFF Event");
                expect(LenderIntegrationBNS.ReturnNoteSubject(1, 'AMENDMENTS')).toContain(TestData.data[Lang].Notes.StdNoteOption1);
                expect(LenderIntegrationBNS.ReturnNoteDetails(1, 'AMENDMENTS')).toBe(TestData.data[Lang].Notes.StdNote1);
                expect(LenderIntegrationBNS.ReturnNoteSubject(2, 'AMENDMENTS')).toBe(BNSTestData.data[LangBNS].Notes.subjectNote);
                expect(LenderIntegrationBNS.ReturnNoteDetails(2, 'AMENDMENTS')).toBe(BNSTestData.data[LangBNS].Notes.detailNote);
            }
            else {
                expect(true).toBe(false, "Unable to verify lawyer note to lender.");
            }
        })

        it('SendNote SOAP service', function () {
            if (loginRedirectURL) {
                LenderIntegrationBNS.SendBNSNote('1', 'STANDARD', 'NEW', BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
            }
            else {
                expect(true).toBe(false, "Unable to send lender note.");
            }
        })

        it('Verify Lender Note to Lawyer', function () {
            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NotesPage.VerifyNotesTableEntry(1, FirstNameLender, LastNameLender, BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
            }
            else {
                expect(true).toBe(false, "Unable to verify lender note.");
            }
        })

        it('SendUpdateTransactionData', function () {
            if (loginRedirectURL) {
                var ClosingDate = CustomLibrary.CurrentOrPastDate();
                //var JSONBody = LawyerIntegrationBNS.ReturnSendUpdateTransactionJsonBNS(BNSFctUrn, AssessmentRollNumber, ClosingDate, ProvinceName);
                //LawyerIntegrationBNS.SendUpdateTransactionData(JSONBody);
               // browser.sleep(3500);
                LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
                browser.sleep(3500);
         
            }
            else {
                expect(true).toBe(false, "Unable to update deal.");
            }
        })

        it('Final Report ', function () {
            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
               
                FinalReportPage.VerifyFRPage();
                FinalReportPage.VerifyPropertybasedonProv(ProvinceName);
                FinalReportPage.VerifyRegParticulars();
                FinalReportPage.VerifyFireInsParticulars();
                FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');
                if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                    FinalReportPage.AcceptAmendmentIfAvailable();
                }
                
                FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                FinalReportPage.NavigateAway();
                FinalReportPage.VerifyNavigateAway();
                FinalReportPage.NavigateAwayAcceptReject('Cancel');
                FinalReportPage.NavigateAway();
                FinalReportPage.NavigateAwayAcceptReject('OK');
                browser.sleep(1500);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                if ((ProvinceName == "AB") || (ProvinceName == "MB")) {
                    FinalReportPage.WCPMandatoryFieldSelection("No")
                }
                FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
                FinalReportPage.CommentonFinalReportwithProv('This is an automated comment on final report page', ProvinceName);
                browser.sleep(30000);
                FinalReportPage.SelectDocLanguage('English');
                FinalReportPage.ClickFRButton('btnSave');
                FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                FinalReportPage.VerifyFRCheckmarkStatus('In Progress');
                FinalReportPage.ClickFRButton('btnCreate');


                CustomLibrary.WaitForSpinnerInvisible();
                FinalReportPage.VerifyFinalReportIsCreated().then(function(result)
                {
                    IsFinalReportCreated = result;
                    if(result)
                    { 
                        //CustomLibrary.ClosePopup();
                        CustomLibrary.WaitForSpinnerInvisible();
                        browser.sleep(500);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(500);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        browser.sleep(500);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        FinalReportPage.VerifyallButtonStatus('Enabled');
                        FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.CreateSuccessMsg);
                        FinalReportPage.ClickFRButton('btnSubmit');
                        FinalReportPage.SubmitFR();
                        FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                        FinalReportPage.VerifyFRCheckmarkStatus('Complete');
                        FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true);
                        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                        RFFPage.VerifyComment('Disabled');
                        RFFPage.VerifySubmitButtonStatus('Disabled');
    
                 }   
                })               
            }
            else {
                expect(true).toBe(false, "Unable to update deal.");
            }

        })

        it('GetLawyerDealEvents SOAP service', function () {
            if (IsFinalReportCreated ) {
                LenderIntegrationBNS.GetBNSLawyerDealEvents();
            }
            else {
                expect(true).toBe(false, "Unable to submit final report.");
            }

        })

        it('Verify final report document in GetLawyerDealEvents', function () {
            if (IsFinalReportCreated) {
                expect(LenderIntegrationBNS.VerifyDealEvent('SUBMITSROT')).toBe(true);
                expect(LenderIntegrationBNS.ReturnDocDisplayName('DOCUMENTS')).toBe('Final Report');
            }
            else {
                expect(true).toBe(false, "Unable to verify final report document available in GetLawyerDealEvents");
            }
        })

        it('SendDealStatusChangeRequest - Closing deal', function () {
            if (loginRedirectURL) {
                LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
            }
            else {
                expect(true).toBe(false, "Unable to SendDealStatusChangeRequest");
            }
        })

        it(' Close Deal', function () {
            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                HomePage.VerifySaveButtonStatus('Disabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                RFFPage.VerifyComment('Disabled');
                RFFPage.VerifySubmitButtonStatus('Disabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                FinalReportPage.VerifyallButtonStatus('Disabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                NotesPage.VerifyNewNoteButtonStatus('Disabled');
                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealClosed, true)
            }
            else {
                expect(true).toBe(false, "Unable to verify tabs when deal is closed.");
            }
        })

        it('Verify Email', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                
                OutlookPortal.LogintoOutlookNonAngular();                
                OutlookInbox.VerifyEmailOutlook("New Deal", lenderReferenceNumber);
            }
            else {
                expect(true).toBe(false, "Unable to Verify Email.");
            }
        })
    }

   var Provincearray = ["SK", "BC", "AB", "MB", "ON", "NB"]; 
   
  // var Provincearray = ["AB","MB", "ON", "NB"]; 
    for (var i = 0; i < Provincearray.length; i++) {
        console.log(Provincearray[i]);
        maintest(Provincearray[i]);
    }
});

