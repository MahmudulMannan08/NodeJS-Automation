'use strict'
var RunSettings = require('../testData/RunSetting.js');
var HomePage = require('../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var CustomLibrary = require('../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LenderIntegrationTD = require('../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationTD.js');
var LawyerIntegrationMMS = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var MMSPortral = require('../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../PageObjectMethods/LLCUnityPortal/Notes.js');
var NeedHelp = require('../PageObjectMethods/LLCUnityPortal/NeedHelp.js')
var OutlookPortal = require('../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../PageObjectMethods/Outlook/OutlookInbox.js');
var OperationsPortal = require('../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReport = require('../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var PreFundingInfomation = require('../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var ManageDocuments = require('../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var RequestCancellation = require('../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var LenderPortal = require('../PageObjectMethods/LenderPortal/LenderPortal.js');
var LenderIntegrationBNS = require('../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var Notes = require('../PageObjectMethods/LLCUnityPortal/Notes.js');
var TestData = require('../testData/TestData.js');
var BNSTestData = require('../testData/BNS/BNSTestData.js');
var dateFormat = require('dateformat');
const { browser } = require('protractor');


//BNS Patch Flow
describe('BNS E2E Deal flow with IsSolicitor as False', function () {
    var BNSFctUrn = null;
    var lenderReferenceNumber = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL =null;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LangBNS = BNSTestData.data.LANGUAGE.value;
    var IsFinalReportCreated = false;
    var instrumentNo = "123567";
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;
    var SubmitSuccessMsg = RunSettings.data.Global.BNS[Env].SubmitSuccessMsg;
    var SaveSuccessMsg = TestData.data[Lang].Messages.SaveSuccessMsg;
    var SubmitSuccessMsg = TestData.data[Lang].Messages.SubmitSuccessMsg;
    var DocumentID = null;
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();
        LawyerIntegrationBNS.CleanUpScript();
    });
    it('TC - 308745: CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
        //LenderIntegrationBNS.CreateBNSDeal1('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('TC - 308746: Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            console.log(BNSFctUrn);
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(BNSFctUrn).not.toBe(undefined, "CreateBNSDeal service timed out!!!");
            expect(BNSFctUrn).not.toBe(null, "CreateBNSDeal service timed out!!!");
        }
    })

    it('TC - 308746: Verify Home Page,Deal Acceptance Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();

                //Verify footer
                HomePage.VerifyFooter();

                //Regression - Test case 195688: Step 4
                HomePage.VerifyDealStatusSection('LLC');

                HomePage.VerifyDealAcceptedCheckMark('LLC');
                HomePage.VerifyLLCRffNotStarted();
                HomePage.VerifyFinalReportNotStarted();

                //Verify left navigation bar
                MenuPanel.VerifyLeftMenuItems();

                //Verify deal history entry for "accept deal" on embedded portal
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.WaitForExpectedDHEntry(2);
                DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityDealAccept);
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

    it('Call to GetLawyerDealEvents Service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to Get Deal Events for the deal.");
        }
    })

    it('TC - 308752: Verify Deal Event for "Accepting" deal', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            var DealStatus = LenderIntegrationBNS.ReturnDealStatus('ACCEPT');
            expect(DealStatus).toBe('ACTIVE',"Deal Status");
        }
        else {
            expect(true).toBe(false, "Unable to verify deal events for accepting the deal.");
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

    it('TC - 308747: SendNote using Lender service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.SendBNSNote('1', 'STANDARD', 'NEW', BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
        }
        else {
            expect(true).toBe(false, "Unable to send lender note.");
        }
    })

    it('TC- 308748: Request for Funds', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
           // HomePage.VerifyFileNo();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

            RFFPage.VerifyRFFPage();

            RFFPage.CommentonRFF(BNSTestData.data[LangBNS].RFF.commentRFF);

            RFFPage.SubmitRFF();

            HomePage.VerifyMessage(SubmitSuccessMsg);

            RFFPage.VerifyRFFCheckmarkPostSubmission();


            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            var date = LenderIntegrationBNS.ReturnClosingDate();
            var formattedDate = dateFormat(date, "UTC:mmmm d, yyyy");
            DealHistory.WaitForExpectedDHEntry(3);
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory[Env].RFFSubmitted + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFF + ').');

        }
        else {

            expect(true).toBe(false, "Unable to Create RFF.");
        }
    })

    it('Verify Lender Note to Lawyer', function () {

        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.WaitForExpectedNoteEntry(1);
            NotesPage.VerifyNotesTableEntry(1, RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value, RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value, BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
        }
        else {
            expect(true).toBe(false, "Unable to send lender note.");
        }

    })

    it('Lawyer Sends Notes', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.VerifyNotesPage();

            NotesPage.ClickNotesButton('NewNote');

            NotesPage.SelectStandardNoteType(TestData.data[Lang].Notes.StdNoteOption1);

            NotesPage.VerifyPopulatedSubjectTB(TestData.data[Lang].Notes.StdNoteOption1);
            NotesPage.VerifyPopulatedNoteTB(TestData.data[Lang].Notes.StdNote1);

            NotesPage.ClickNotesButton('SendNote');
            NotesPage.NewNoteFeildsHidden();
            expect(NotesPage.GetNotesTableCountBNSTD()).toBe(2);

            //Regression - Test case 195689: Step 14
            NotesPage.VerifySavedChanges(SaveSuccessMsg);
        }
        else {
            expect(true).toBe(false, "Unable to send Lawyer note.");
        }
    })

    it('Update closing date to present or past(if weekend)', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            var ClosingDate = CustomLibrary.CurrentOrPastDate();
           // var JSONBody = LawyerIntegrationBNS.ReturnSendUpdateTransactionJsonBNS(BNSFctUrn, AssessmentRollNumber, ClosingDate, TestData.data[Lang].WebService.Province);
           // LawyerIntegrationBNS.SendUpdateTransactionData(JSONBody);
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
            
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal data using SendTransactionData service.");
        }
    })

    it('TC - 308750: Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //Navigate to Final Report page, verify layout
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReport.VerifyFRPage();
            FinalReport.VerifyProperty();
            FinalReport.VerifyRegParticulars();
            FinalReport.VerifyFireInsParticulars();
            FinalReport.TitleInsLPD();
            FinalReport.VerifyLawyerNotaryComm();

            FinalReport.VerifyallButtonStatus('PartiallyEnabled');

            //Verify milestone status 'Not Started'
            FinalReport.VerifyFRCheckmarkStatus('Not Started');

            //Accept amendments if any
            if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                FinalReport.AcceptAmendmentIfAvailable();
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                browser.sleep(500);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                browser.sleep(500);
            }

            //Save final report
            FinalReport.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReport.CommentonFinalReport('This is an automated comment on final report page');
            FinalReport.SelectDocLanguage('English');
            FinalReport.ClickFRButton('btnSave');
            FinalReport.VerifyMessage(SaveSuccessMsg);

            //Verify milestone status 'In Progress'
            FinalReport.VerifyFRCheckmarkStatus('In Progress');

            //Create final report
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
                    browser.sleep(2000);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    browser.sleep(2500);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                     FinalReport.VerifyallButtonStatus('Enabled');
                    FinalReport.VerifyMessage(TestData.data[Lang].Messages.CreateSuccessMsg);
        
                    //Submit final report
                    FinalReport.ClickFRButton('btnSubmit');
                    FinalReport.SubmitFR();
                    FinalReport.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                    FinalReport.VerifyFRCheckmarkStatus('Complete');
                    FinalReport.VerifyallButtonStatus('PartiallyEnabled');
        
                    //Verify deal history 
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true);
            
                    //Verify RFF disabled
                    MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                    RFFPage.VerifyComment('Disabled');
                    RFFPage.VerifySubmitButtonStatus('Disabled');

                }
               
            })
        }
        else {
            expect(true).toBe(false, "Unable to Create Final Report.");
        }
    })

    
    it('TC - 330563: Verify Get Lawyer document list and GetDocument Service', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            LawyerIntegrationCommon.GetDocumentList(BNSFctUrn, function (DocumentID) {
                browser.sleep(3500);
                if (DocumentID != null) {
                  LawyerIntegrationCommon.VerifyGetDocument(BNSFctUrn, DocumentID);
                }
                else {
                    console.log("Deal accept failed with error code: ");
                }
            });
        }
        else {
            expect(true).toBe(false, "Unable to get lawyer document list."); 
        } 
        

    })



    it('TC- 308751: Send Actionable notes using Lender Integration', function () {

      

        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            if(IsFinalReportCreated)
            {
                LenderIntegrationBNS.SendBNSNote('1', 'ACTIONABLE', 'NEW', BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
                browser.sleep(2000);
             } 
             else
             {
                expect(IsFinalReportCreated).toBe(true, "Unable to send actionable notes as Final Report is not created.");
             }
            
                    }
        else {

            expect(true).toBe(false, "Unable to send Actionable note.");
        }
    })

    it('TC- 308751: Verify & Confirm Actionable Note', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            if(IsFinalReportCreated)
            {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                //Verify actionable note table, verify pending actionable note									 
                expect(NotesPage.GetNotesTableCountBNSTDActionable()).toBe(1);

                NotesPage.VerifyNotesTableActionable();
                NotesPage.VerifyNotesTableEntryActionable(1, BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
                NotesPage.VerifyActionableNoteConfirmation();

                //Verify note indicator icon available, verify note indicator icon count
                NotesPage.VerifySpecialAttnIcon(true, '1');

                //Confirm actionable note
                NotesPage.ConfirmActionableNote(1, true);

                //Verify completed actionable note added to notes history
                NotesPage.WaitForExpectedNoteEntry(3);
                NotesPage.VerifyNotesTableEntry(1, RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value, RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value, BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails + '(Actionable Note - completed)');

                //Verify note indicator icon is cleared/not displayed when all outstanding actionable note completed
                NotesPage.VerifySpecialAttnIcon(false);

                //Verify actionable note section disappears when no outstanding actionable note remaining
                NotesPage.VerifyActionableNotesTableDisplayed(false);

             } 
             else
             {
                expect(IsFinalReportCreated).toBe(true, "Unable to send actionable notes as Final Report is not created.");
             }
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify actionable note on UI.");
        }
    })

    it('Update Deal Status to CLOSE', function () {

        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
        }
        else {
            expect(true).toBe(false, "Unable to Change Deal Status.");
        }
    })

    it('TC - 308754: Verify all tabs after Deal Closed', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            HomePage.VerifySaveButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            RFFPage.VerifyComment('Disabled');
            RFFPage.VerifySubmitButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            FinalReport.VerifyallButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            NotesPage.VerifyNewNoteButtonStatus('Disabled');

            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealClosed, true);
            //DealHistory.VerifyDealHistoryTableEntry(1, RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value + ' ' + RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value, TestData.data[Lang].DealHistory.ActivityDealClosed);
        }
        else {
            expect(true).toBe(false, "Unable to verify UI after deal Closed.");
        }
    })

    it('TC - 308753: Verify Actionable email', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            if(IsFinalReportCreated)
            {
                //Login to Outlook
            OutlookPortal.LogintoOutlookNonAngular();

            //Verify Lawyer received new deal email
            OutlookInbox.VerifyEmailOutlook("New Actionable Note", lenderReferenceNumber);
             } 
             else
             {
                expect(IsFinalReportCreated).toBe(true, "Unable to verify  actionable notes email as Final Report is not created.");
             }
           
        }
        else {
            expect(true).toBe(false, "Unable to Verify Email.");
        }
    })

    it('TC - 308757: Operations portal - Verify documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Operations portal
            OperationsPortal.LoginOperationsPortal();

            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(BNSFctUrn);

            //Verify lawyer uploaded documents in documents tab
            OperationsPortal.ClickDocumentsTab();
            OperationsPortal.VerifyUploadedDocument('Final Report');

            //Verify lender uploaded documents in documents tab
            OperationsPortal.VerifyUploadedDocument('Mortgage Instruction Package');

            //Cancel deal if not completed
            OperationsPortal.CancelDealIfNotComplete();
        }
        else {
            expect(true).toBe(false, "Unable to Verify Deal in Operational Portal.");
        }
    })

    it('TC - 308756: Lender portal - Verify documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Lender portal
            LenderPortal.LoginToLenderPortalBNS( RunSettings.data.Global.LLC[Env].BNSLenderUser, RunSettings.data.Global.LLC[Env].BNSLenderPassword);

            //Search deal in lender portal
            LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);

            //Verify lawyer uploaded documents in documents tab
            LenderPortal.VerifyUploadedDocument('Lawyer', 'Final Report');

            //Verify lender uploaded documents in documents tab
            LenderPortal.VerifyUploadedDocument('Lender', 'Mortgage Instruction Package');
        }
        else {
            expect(true).toBe(false, "Unable to Verify Lender Portal.");
        }
    })

});

describe('TC - 308758: E2E flow with IsSolicitorClose as true', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LangBNS = BNSTestData.data.LANGUAGE.value;

    var BNSFctUrn = null;
    var lenderReferenceNumber = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL =null;
  //var RegistrationDate = "2020-01-01";
    var instrumentNo = "123567";
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;
    
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('true', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal - AcceptReject soap service', function () {
         //Regression - Test case 195688: Step 2
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if (BNSFctUrn) {
            //Accepting the deal
            console.log("BNS DEal "+ BNSFctUrn);
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
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            if  (loginRedirectURL) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();

                //Verify deal history entry for "accept deal" on embedded portal
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealAccept, true);
            }
            else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(true).toBe(false, "Unable to verify Home Page as CreateBNSDeal service timed out!!!");
        }
    })


    it('TC - 308757: Generate Documents from Manage Tab', function () {
  
            if (loginRedirectURL) {

                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                CustomLibrary.WaitForSpinnerInvisible();
                ManageDocuments.ClickCreateEnglishDocumentNew2('Certificate of Independent Legal Advice').then(function (IsPresent) {
       
                    if(IsPresent)
                    {
                        CustomLibrary.navigateToWindow("Doc Forms",2);
                        ManageDocuments.SaveCreatedDocument().then(function(){
                            CustomLibrary.navigateToWindow("",2);
                            CustomLibrary.closeWindow("");
                            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            CustomLibrary.WaitForSpinnerInvisible();
                            ManageDocuments.VerifyCreatedDocument("Certificate of Independent Legal Advice");
                        });

                      /*  CustomLibrary.SwitchTab(1);
                        ManageDocuments.SaveCreatedDocument();
                        CustomLibrary.CloseTab2(1);
                        CustomLibrary.SwitchTab(0);
                        CustomLibrary.WaitForSpinnerInvisible();
                        ManageDocuments.VerifyCreatedDocument("Certificate of Independent Legal Advice");*/
                    }
                });
            }
            else {
                expect(true).toBe(false, "Unable to Generate  French Documents as Redirect URL is null.");
            }
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
                LenderIntegrationBNS.GetBNSLawyerDealEvents();
            }
        else {
                expect(true).toBe(false, "Unable to Get Deal Events for the deal.");              
            }  
    })

    it('Verify Deal Event for "Accepting" deal', function () {
        if  (loginRedirectURL) {
                var DealStatus = LenderIntegrationBNS.ReturnDealStatus('ACCEPT');
                expect(DealStatus).toBe('ACTIVE');
            }
            else {
                expect(true).toBe(false, "Unable to verify deal events for accepting the deal.");    
            }
    })

    it('SendUpdateTransactionData REST service', function () {
        if  (loginRedirectURL) {
             AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
             var ClosingDate = CustomLibrary.CurrentOrFutureDate();
            // var JSONBody = LawyerIntegrationBNS.ReturnSendUpdateTransactionJsonBNS(BNSFctUrn, AssessmentRollNumber, ClosingDate, TestData.data[Lang].WebService.Province);
             //LawyerIntegrationBNS.SendUpdateTransactionData(JSONBody);

                 //Changing PIN Number trigger amendments, send []
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
             browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");  
            }
        
    })

    it('Request for Funds', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifyRFFPage();
            RFFPage.VerifyRFFPageIDV();
            RFFPage.CommentonRFFIDV(BNSTestData.data[LangBNS].RFF.commentRFFSubmit);
            RFFPage.VerifyRFFValidationIDBforBNS();
            RFFPage.SelectAcknowledgement(1);
            RFFPage.SubmitRFF();

            HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

             //Verify deal history entry on RFF submission
             MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
             var date = LenderIntegrationBNS.ReturnClosingDate();
             var formattedDate = dateFormat(date, "UTC:mmmm d, yyyy");
             DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted  + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFFSubmit + ').', true);
        }
        else {
            expect(true).toBe(false, "Unable to submit RFF."); 
        }
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
    })

    it('Verify RFF event & SendUpdateTransactionData', function () {
        if  (loginRedirectURL) {

            //Verify GetLawyerDeal Events for RFF
            expect(LenderIntegrationBNS.VerifyDealEvent('REQUESTFORFUNDS')).toBe(true);
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            //Update closing date to present or past(If weekend today)
            var ClosingDate = CustomLibrary.CurrentOrPastDate();
            //var JSONBody = LawyerIntegrationBNS.ReturnSendUpdateTransactionJsonBNS(BNSFctUrn, AssessmentRollNumber, ClosingDate, TestData.data[Lang].WebService.Province);
            //LawyerIntegrationBNS.SendUpdateTransactionData(JSONBody);

            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal."); 
        } 
    })

    it('Final Report ', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            //Navigate to Final Report page, verify layout
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            //Verify milestone status 'Not Started'
            FinalReport.VerifyFRCheckmarkStatus('Not Started');

            //Accept amendments if any
            if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                FinalReport.AcceptAmendmentIfAvailable();
            }

            //TC-245482:LLC Embedded Portal/ Save Final Report
            FinalReport.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReport.CommentonFinalReport('This is an automated comment on final report page');
            FinalReport.SelectDocLanguage('English');
            FinalReport.ClickFRButton('btnSave');
            FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);

            //Verify milestone status 'In Progress'
            FinalReport.VerifyFRCheckmarkStatus('In Progress');

            //Create final report
            FinalReport.ClickFRButton('btnCreate');
            CustomLibrary.WaitForSpinnerInvisible();
            FinalReport.VerifyFinalReportIsCreated().then(function(result)
            {
                if(result)
                {
                    //CustomLibrary.ClosePopup();
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    browser.sleep(2000);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                }
            })
            FinalReport.VerifyallButtonStatus('Enabled');
            FinalReport.VerifyMessage(TestData.data[Lang].Messages.CreateSuccessMsg);
            //Submit final report
            FinalReport.ClickFRButton('btnSubmit');
            FinalReport.SubmitFR();
            FinalReport.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
            //TC-245488:LLC Embedded Portal/ Milestone is updated and displayed with Green circle
            FinalReport.VerifyFRCheckmarkStatus('Complete');
            FinalReport.VerifyallButtonStatus('PartiallyEnabled');

            //TC-245484: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true);
        }
        else {
            expect(true).toBe(false, "Unable to update deal."); 
        } 
       
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
      
    })

    it('Verify final report document in GetLawyerDealEvents', function () {
        if  (loginRedirectURL) {
           //Verify GetLawyerDeal Events for FR
            expect(LenderIntegrationBNS.VerifyDealEvent('SUBMITSROT')).toBe(true);

            //Verify GetLawyerDeal Events for FR documents
            expect(LenderIntegrationBNS.ReturnDocDisplayName('DOCUMENTS')).toBe('Final Report');
        }
        else {
            expect(true).toBe(false, "Unable to verify final report document available in GetLawyerDealEvents"); 
        }         
    })

    it('SendDealStatusChangeRequest - Closing deal', function () {
        if  (loginRedirectURL) {
            //Lender closes deal        
            LenderIntegrationBNS.SendDealStatusChange( TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
         }
         else {
             expect(true).toBe(false, "Unable to SendDealStatusChangeRequest"); 
         } 
    })

    it('Verify Close Deal and Is In ReadOnly Mode', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            HomePage.VerifySaveButtonStatus('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            RFFPage.VerifyComment('Disabled');
            RFFPage.VerifySubmitButtonStatus('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            FinalReport.VerifyallButtonStatus('Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            NotesPage.VerifyNewNoteButtonStatus('Disabled');
            //NotesPage.VerifyPrintButtonStatus('Disabled');
    
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealClosed, true);
         }
         else {
             expect(true).toBe(false, "Unable to verify tabs when deal is closed."); 
         }
    })

    it('TC - 308761: Operations portal - Verify Deal Status & documents', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Operations portal
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(BNSFctUrn).then( function(count) {

                if(count > 0) {

                    OperationsPortal.GetDealStatus().then( function(status) {
                        expect(status).toBe("COMPLETED", "Deal Status in Operational Portal.");

                        //Verify lawyer uploaded documents in documents tab
                        OperationsPortal.ClickDocumentsTab();
                        OperationsPortal.VerifyUploadedDocument('Final Report');

                        //Verify lender uploaded documents in documents tab
                        OperationsPortal.VerifyUploadedDocument('Mortgage Instruction Package');

                        //Cancel deal if not completed
                        OperationsPortal.CancelDealIfNotComplete();
                    
                    });
                }
                else {
                    expect(count).toBeGreaterThan(0, "Deal not found in Operational Portal");
                }
            });


        }
        else {
            expect(true).toBe(false, "Unable to Verify Deal in Operational Portal.");
        }
    })

    it('TC - 308760: Verify Delegate Recieves Email - New Deal creation', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //Login to Outlook
            var OutlookUser = RunSettings.data.Global.Outlook.DelegateUserName.value;
            var OutlookPwd = RunSettings.data.Global.Outlook.DelegatePassword.value;
            OutlookPortal.LoginToMailBox(OutlookUser,OutlookPwd);

            //Verify Lawyer received new deal email
            OutlookInbox.VerifyEmailOutlook("New Deal", lenderReferenceNumber);
        }
        else {
            expect(true).toBe(false, "Unable to Verify Email.");
        }
    })
});


//TD Patch Flow
describe('TD E2E Deal Flow', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var loginRedirectURL = null;
    var TDDealIsInDraft = null;
    var TDDealPresentInOperationalPortal = null;
    var TDDealID = null;
    var InstrumentNumber = null;
    var lenderReferenceNumber = null;
    var ClosingDate = null;
    var dateSolicitorPackage;
    var IsFinalReportCreated= false;
    var lenderChangeID;
    var AssessmentRollNumber =null;
    afterAll(function () {
        LenderIntegrationTD.CleanUpScript();
    });

    it('TC - 308783: Create TD Deal', function () {
        LenderIntegrationTD.CreateTDDealthroughCode(TestData.data[Lang].WebService.Province);
    })

    it('TC- 308783: Verify TD Deal status in Operations Portal', function() {

        browser.ignoreSynchronization = true;
        TDDealIsInDraft = true;
       TDDealPresentInOperationalPortal = false;
        TDDealID = LenderIntegrationTD.ReturnfctURNTD();
        lenderReferenceNumber = LenderIntegrationTD.ReturnLenderRefNoTD();
       if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null')) {

            OperationsPortal.LoginOperationsPortal();

            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {
                console.log(TDDealID);
                if(count > 0) {

                    TDDealPresentInOperationalPortal = true;
                    OperationsPortal.WaitForExpectedDealStatusOP("PENDING ACCEPTANCE");
                    OperationsPortal.GetDealStatus().then( function(status) {

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

   it('TC - 308784: Accept TD Deal and Verify Home Page', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.AcceptRejectDeal(TDDealID, "ACTIVE");
           loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(TDDealID, 'LLCDEAL');
             if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                //Verify deal history entry for "accept deal" on embedded portal
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch( TestData.data[Lang].DealHistory.ActivityDealAccept, true);
              }
            else 
            {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
    })

    it('TC - 308793: Verify Need Help Link', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.ClickNeedHelp();
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
                //CustomLibrary.SwitchTab(1);
                browser.sleep(300);
                NeedHelp.VerifyNeedHelpPage();
                //CustomLibrary.CloseTab2(1);
                CustomLibrary.closeWindowUrlContains("contactus");
                browser.sleep(2000);
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            }
            else {
                expect(true).toBe(false, "Unable to Verify Need Help Link.");
               
            }
    })

    it('Lawyer Amendments - Modify Registration date & Instrument number', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
            InstrumentNumber = CustomLibrary.getRandomNumber(6);
            LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrFutureDate(),AssessmentRollNumber,AssessmentRollNumber,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(false).toBe(true, "Unable to update deal data.");
        }
    })

    it('TC - 308785: Verify Notes section', function () {
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

    it('TC - 308786: Create RFF, Verify RFF Deal History', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.SelectFundingReqType("Request for Funds");
            RFFPage.SendRequestedAmount(2500);
            RFFPage.SelectInstructionForDelivery('Pickup cheque at branch');
            RFFPage.EnterBranchNumber(34567);
            RFFPage.ClickRFFButtons('Create');

            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                if(result)
                {
                   // CustomLibrary.ClosePopup();
                   CustomLibrary.WaitForSpinnerInvisible();
                   browser.sleep(2000);
                   CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                   browser.sleep(2000);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyCreatedRFFConfirmationMessage();
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted , true);
                }
               
            })           
        }
        else {
            expect(false).toBe(true, "Unable to Submit RFF.");
        }
    })

    it('TC - 308792: Generate Documents from Manage Tab', function () {
  
        if (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.ClickCreateEnglishDocumentNew2('Collateral (ereg) - Schedule').then(function (IsPresent) {
                    if(IsPresent)
                    {
                    CustomLibrary.navigateToWindow("Doc Forms",2);
                    ManageDocuments.SaveCreatedDocument().then(function(){
                        CustomLibrary.navigateToWindow("",2);
                        browser.sleep(2000);
                        CustomLibrary.closeWindow("");
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        CustomLibrary.WaitForSpinnerInvisible();
                         //Verify Message contains created document name.
                        ManageDocuments.VerifyCreatedDocument("Collateral (ereg) - Schedule");
                    })
                }
            });

            var DocName = CustomLibrary.getRandomString(10)
            ManageDocuments.UploadAdditionalDocument(DocName);
            ManageDocuments.VerifyDocumentStatus(DocName, 'Uploaded');
            ManageDocuments.VerifyUploadedDocument(DocName);

            dateSolicitorPackage = ManageDocuments.ReturnSolicitorPackageDate();
            
        }
        else {
            expect(true).toBe(false, "Unable to Generate  French Documents as Redirect URL is null.");
        }
})

    it('Lender updates deal closing date and interest rate', function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            ClosingDate = CustomLibrary.CurrentOrFutureDate(); 
            LenderIntegrationTD.UpdateTDDeal(TDDealID, lenderReferenceNumber, ClosingDate, "3.5", TestData.data[Lang].WebService.Province);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }
        
    })

    it("Lawyer views changes and Accepts it", function () {
        if ((typeof TDDealID !== 'undefined') && (TDDealID !== null) && (TDDealID !== 'null') && !TDDealIsInDraft && TDDealPresentInOperationalPortal) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(TDDealID, 'ACCEPT');
            browser.sleep(3500);
        }
        else{
            expect(false).toBe(true, "Error occured while accepting the deal.");
        }

    })

    it("Verify History Logs", function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender.", true);
            //DealHistory.VerifyDealHistoryTableEntry(1, "TTD User", "An amendment has been sent by the Lender.");
        }
        else 
        {
            expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
            expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
        }
    })

    it('TC - 330561: Verify Solicitor Instruction Package Date is Updated', function () {
  
        if (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');          
            ManageDocuments.ReturnSolicitorPackageDate().then(function(dateAfterUpdate)
            {
                expect(dateSolicitorPackage).not.toBe(dateAfterUpdate, "Solicitor Instruction Package date is updated after Lender sends amendment.");
            })    
        }
        else {
            expect(true).toBe(false, "Unable to Generate  French Documents as Redirect URL is null.");
        }
})

    it('Update Cosing Date based on weekend', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //dealID, RegistrationDate, ClosingDate, InstrumentNumber
           LawyerIntegrationCommon.UpdateTransactionData(TDDealID, CustomLibrary.CurrentOrPastDate(),AssessmentRollNumber,AssessmentRollNumber,InstrumentNumber,CustomLibrary.CurrentOrPastDate(),null,null, "IDVTypeB",null,null,null);
              browser.sleep(3500);
        }
        else {
            expect(false).toBe(true, "Unable to update deal data.");
        }
    })

    it('TC - 308787: Final Report', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            CustomLibrary.WaitForFadderInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.sleep(1000);
            FinalReport.AcceptAmendmentIfAvailable();
            var EC = protractor.ExpectedConditions;
            browser.wait(EC.invisibilityOf( element(by.css('.loading-spinner.ng-star-inserted'))), 45000,  'Waiting for Fadder to become invisible').then(() => {
                browser.sleep(1000);
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                FinalReport.SelectClosingViaCB("Soli");
                FinalReport.ClickFRButton('btnCreate');
                FinalReport.SubmitIDVTypeBInfo('ID:123', "Street Name", "Accc: 123");
                FinalReport.ClickFRButton('btnSave');
                FinalReport.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
                FinalReport.ClickFRButton('btnCreate');  
                CustomLibrary.WaitForSpinnerInvisible();
                FinalReport.VerifyFinalReportIsCreated().then(function(result)
                {
                    IsFinalReportCreated = result;
                    console.log("Value is " + result);
                    if(result)
                    { 
                         // CustomLibrary.ClosePopup();
                         CustomLibrary.WaitForSpinnerInvisible();
                         browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                        browser.sleep(2000);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.EnterRFFSubmitPwd(RunSettings.data.Global.URL_LLCEmulator[Env].Password.value);
                        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                        RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                        DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].TDFinalReportClosed, true);
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


    it('Verify Deal is in Readonly Mode', function () {
        if  (loginRedirectURL) {
            if(IsFinalReportCreated)
            {
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                HomePage.VerifySaveButtonStatus('Disabled');

                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                ManageDocuments.VerifyOnlyViewButtonsEnabled();
        
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                RFFPage.VerifySubmitButtonStatus('Disabled');
        
                MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
                FinalReport.VerifyallButtonStatus('Disabled');

                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            }
            else{
                expect(IsFinalReportCreated).toBe(true, "Unable to verify tabs in readonly mode SROT is not submitted."); 
            }

         }
         else {
             expect(true).toBe(false, "Unable to verify tabs when deal is closed."); 
         }
    })

    it('TC - 308788: Manage Documents - Check RFF, SROT', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyDocumentsTableEntry('Request for Funds - Information');
            ManageDocuments.VerifyDocumentsTableEntry('Final Report on Title');
        }
        else {
            expect(false).toBe(true, "Unable to Verify Documents.");
        }
    })

    it('TC - 308789: Verify new deal email', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if  (lenderReferenceNumber) {
                //Login to Outlook
                OutlookPortal.LogintoOutlookNonAngular();
                OutlookInbox.VerifyEmailOutlook("New Deal", lenderReferenceNumber);
            }
        }
        else {
            expect(false).toBe(true, "Unable to Verify Email.");
        }
    })

    it('TC - 308791: Operation Portal - Verify RFF & SROT', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {

            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SearchDealBNS(TDDealID).then( function(count) {

                if(count > 0) {

                    OperationsPortal.GetDealStatus().then( function(status) {
                        expect(status).toBe("COMPLETED", "Deal Status in Operational Portal.");

                        //Verify lawyer uploaded documents in documents tab
                        OperationsPortal.ClickDocumentsTab();
                        OperationsPortal.VerifyUploadedDocument("Final Report on Title");
                        OperationsPortal.VerifyUploadedDocument("Request for Funds - Information");

                        //Cancel deal if not completed
                        OperationsPortal.CancelDealIfNotComplete();
                    
                    });
                }
                else {
                    expect(count).toBeGreaterThan(0, "Deal not found in Operational Portal");
                }
            });


        }
        else {
            expect(false).toBe(true, "Unable to Verify Documents in operational Portal.");
        }

    })

    it('TC - 308790: Lender Portal -Verify RFF & SROT', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            if  (lenderReferenceNumber) {
                LenderPortal.LoginToLenderPortal(RunSettings.data.Global.LLC[Env].TDUserName, RunSettings.data.Global.LLC[Env].TDPassword);
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Request for Funds - Information');
                LenderPortal.VerifyLawyerSubmittedDocumentInGrid('Final Report on Title');
            }
        }
        else {
            expect(false).toBe(true, "Unable to Verify Documents in Lender Portal.");
        }
    })
});

//MMS PATCH FLOW
describe('MMS Deal- Patch Flow ', function () {
    var FCTURN = null;
    var DealId = null;
    var ClosingDate = null;
    var ClientName = null;
    var LenderRefNo = null;
    var PropertyData = null;
    var namelist = [];
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value
    var LawyerFirstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var LawyerFirm = RunSettings.data.Global.MMS[Env].LawyerDataLawFirm;
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var loginRedirectURL = null;
    var AssessmentRollNumber = null;
    var legaldescription = null;
    var dealSendToLLC ;
    it('TC - 309391,309391,316718 : MMS Deal Creation & Answering PIF Questions through LLC Unity', function () {
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        legaldescription = CustomLibrary.getRandomString(10);
        MMSPortral.GenerateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        FCTURN = MMSPortral.GetCreatedFCTURN();
        if (FCTURN) {
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           //CustomLibrary.SwitchTab(1);
       
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);

            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
            namelist = MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO')
            MMSCreateDeal.StatusMenuClick();
            PropertyData = MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerDataWithSearch(LawyerFirstName, LawyerFirm, LastNameLawyer);//Aug 26
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterPreFundNewMortgageRegAmtless100000(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                if(count>0)
                {
                    dealSendToLLC = true;
                    //CustomLibrary.SwitchTab(0);
                    //CustomLibrary.CloseTab(1);
                   
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);
                dealSendToLLC = true;
                    OperationsPortal.LoginOperationsPortal(FCTURN);
                    OperationsPortal.SerchDealDetails(FCTURN);
                    DealId = OperationsPortal.GetDealID();
                    var counter = 0;
                    DealId.then(function (result) {
                        LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                            if (data == 200) {
                                LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,AssessmentRollNumber,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,legaldescription,null,null);
                                browser.sleep(3500);
                            }
                            else {
                                console.log("Deal accept failed with error code: ");
                            }
                        });
                    });
        
                    DealId.then(function (result) {
                        loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(result, 'LLCDEAL');
                        if (loginRedirectURL) {
                            HomePage.VerifyMilestoneLabel();
                            MenuPanel.VerifyLeftMenuItems();
                            HomePage.VerifyRFFNotStarted();
                            HomePage.VerifyBrokerConditionNotSatisfiedNotStarted();
                            HomePage.VerifySolictorConditionNotSatisfiedNotStarted();
                            HomePage.VerifyLenderAuthurizationtoFundNotStarted();
                            HomePage.VerifyDealFundedNotstarted();
                            HomePage.VerifyMortgageInfoSection();
                            HomePage.VerifyClosingdateData(HomePage.DateConversion(ClosingDate));
                            HomePage.VerifyMortgagorName(ClientName);
                            HomePage.VerifyPropertyAddressdata(PropertyData);
                            HomePage.VerifyFooter();
                            HomePage.VerifyHeader();
                            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
                            CustomLibrary.WaitForSpinner();
                            PreFundingInfomation.checkValueAvailable();
                           PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',1);
                            PreFundingInfomation.SavePreFundInfo();
                            PreFundingInfomation.VerifyMessage('Your changes have been saved successfully');
                            PreFundingInfomation.SubmitPreFundInfo();
                            PreFundingInfomation.VerifyMessage('Your changes have been submitted successfully');
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            DealHistory.VerifyDealHistoryTableSearch("Pre-Funding Info has been submitted successfully.", true);
                          }
                        else {
                            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                        }
        
                    });
                }
                else{
                   // CustomLibrary.CloseTab();
                    expect(true).toBe(false, "Deal is not sent to LLC. Unable to verify amendment scenario.");
                }
            });
          
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }

    })

    it('TC - 309393 : Notes functionality', function () {

        if(dealSendToLLC)
        {
            MenuPanel.PrimaryMenuNavigateTo('Notes');
            browser.waitForAngular();
            NotesPage.ClickNotesButton("NewNote");
            NotesPage.EnterNotesText("Test Automation-Verification of Notes");
            NotesPage.ClickNotesButton('SendNote');
            NotesPage.VerifyNotesHistory();
            if (Env != 'DR')
            {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.checkuntilnotesappear("Test Automation-Verification of Notes");
                var Notesdata = MMSCreateDeal.GetNotesData();
                MMSCreateDeal.VerifyLawyertoLenderNotes("Test Automation-Verification of Notes", Notesdata);
                MMSCreateDeal.EnterNotesData('This is a test note for validation');
                MMSCreateDeal.checkuntilnotesappear("This is a test note for validation");
                var Notesdata = MMSCreateDeal.GetNotesData();

                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(2000);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(2000);

               // CustomLibrary.CloseTab();
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                NotesPage.waituntilNotesappear("This is a test note for validation");
                browser.sleep(5000);
                NotesPage.GetNotesSubjectTimeStamp(Notesdata);
            }
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
        }     
    })

    it('TC - 316719: Request for Fund', function () {

        if (FCTURN) {

            if (loginRedirectURL) {
                MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinner();
                RFFPage.ClickRFFButtons('Save');
                CustomLibrary.WaitForSpinnerInvisible();
                browser.waitForAngular();
                HomePage.VerifyMessage('Your changes have been saved successfully');
                RFFPage.EnterRequestedAmount(1000);
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
                {
                    console.log("Value is " + result);
                    if(result)
                    {
                       // CustomLibrary.ClosePopup();
                       CustomLibrary.WaitForSpinnerInvisible();
                       browser.sleep(2000);
                       CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                       browser.sleep(2000);
                        CustomLibrary.closeWindowUrlContains("pdfDocuments");
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);

                        RFFPage.VerifyConfirmationMessage('Request for Funds was created successfully.');
                        RFFPage.VerifySubmitButtonStatus('Enabled');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.VerifyConfirmationMessage('Request for Funds has been submitted successfully.');
                        MenuPanel.PrimaryMenuNavigateTo('ManageDocuments');
                        CustomLibrary.WaitForSpinnerInvisible();
                        ManageDocuments.VerifyStatusViewDoc('Request for Funds','Submitted');
                       // HomePage.clickLawyerDocView('Request for Funds');
                       // CustomLibrary.WaitForSpinnerInvisible();
                       // browser.sleep(15000);
                       //CustomLibrary.CloseTab(1);
                     
                    }
                   
                })
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {

            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    })

    it('TC - 316722: MileStones-Broker Condition and Solicitor Condition', function () {

        if (FCTURN) {

            if (loginRedirectURL) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               // CustomLibrary.SwitchTab(1);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
                MMSCreateDeal.EnterChkBrokerConditions();
                MMSCreateDeal.EnterInstructionsforFunding();
                MMSCreateDeal.EnterChkSolictitorConditions();
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Broker Conditions Satisfied has been selected', true);
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Solicitor Conditions Satisfied has been selected', true);
               // CustomLibrary.SwitchTab(0);
               // CustomLibrary.CloseTab(1);
               CustomLibrary.closeWindowUrlContains("DealDetails");
               browser.sleep(2000);   
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
               browser.sleep(2000);
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    })

    it('TC - 316721: MileStones - Lender Authorisation and Deal Funded', function () {

        if (FCTURN) {

            if (loginRedirectURL) {

                if (Env != 'PROD' && Env != 'DR' ) {
                    console.log("Environment "+ Env );
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    //CustomLibrary.SwitchTab(1);
                    browser.sleep(2000);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    MMSCreateDeal.StatusMenuClick();
                    MMSCreateDeal.COIthroughDocument();
                    MMSCreateDeal.ClickFundingLeftMenu();
                    MMSCreateDeal.EnterFundingData();
                   // CustomLibrary.SwitchTab(0);
                   browser.sleep(2000);
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                   browser.sleep(2000);
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
                    MMSCreateDeal.ClickFundingLenderConfirmation();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ToConfirmLender(result);
                    });
                    MMSPortral.ClickonLogOut();
                    MMSPortral.Release2loginMMS();
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
                    MMSCreateDeal.ClickReleaser2();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickSenttoLawyer(result);
                    });

                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickRelease(result, false);
                    });

                    MMSPortral.ClickonLogOut();
                    MMSPortral.Release3loginMMS();
                    MMSPortral.ClickonFunding()
                    MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
                    MMSCreateDeal.ClickReleaser3();
                    FCTURN.then(function (result) {
                        MMSCreateDeal.ClickRelease(result, true);
                    });
                    MMSPortral.ClickonLogOut();
                   // CustomLibrary.SwitchTab(0)
                   
                   browser.sleep(2000);
                   CustomLibrary.navigateToWindowWithUrlContains("SignOn",1)
                   browser.sleep(2000);
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    browser.sleep(2000); 
                   CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                  //  CustomLibrary.SwitchTab(1);
                    MMSCreateDeal.EnterPreFundLawyerData(ClosingDate, ClosingDate);
                    MMSCreateDeal.StatusMenuClick();
                    //to verify Policy History for Lender Confirmation and Deal Funded
                    MMSCreateDeal.ClickonViewPolicyHistory();
                
                   // MMSCreateDeal.VerifyFundingPolicyHistory();
                   MMSCreateDeal.VerifyPolicyHistoryTableSearch('Funding: Releaser2',true);
                   MMSCreateDeal.VerifyPolicyHistoryTableSearch('Funding: Lender Confirmation Required',true);

                    //to verify Policy History for Lender Confirmation and Deal Funded
                    //CustomLibrary.CloseTab();
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000); 
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                    browser.sleep(2000);
                    DealId.then(function (result) {
                        LawyerIntegrationCommon.UpdateTransactionData(result,CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()),AssessmentRollNumber,AssessmentRollNumber,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,legaldescription,null,null);
                        browser.sleep(3500);
                    });
                }
                else {
                    console.log("Skipped the Lender Auntorisation-Deal Funded test method execution as the Environment is : " + Env);
                }
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    });

    it('TC - 316723: MileStone-Final Report', function () {
        if (FCTURN) {
            if (loginRedirectURL) {
                if (Env != 'PROD' && Env != 'DR') {
                    DealId.then(function (result) {
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                        browser.sleep(5000);
                    });
                    browser.waitForAngular();
                    HomePage.waitforDealFundedCheck();
                    MenuPanel.PrimaryMenuNavigateTo('dealHistory');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    DealHistory.VerifyDealHistoryTableSearch('"Deal Funded" has been selected.',true);
                    HomePage.getDealFundedStatus().then(function (dealFundedStatus) {
                        if (dealFundedStatus == true) {
                            MenuPanel.PrimaryMenuNavigateTo('Home');
                            browser.waitForAngular();
                            CustomLibrary.WaitForSpinnerInvisible();
                            HomePage.VerifyMMSBrokerConditionMet();
                            HomePage.VerifyMMSSolicitorConditionMet();
                            HomePage.VerifyMMSLenderAuthorisation();
                            HomePage.VerifyMMSDealFunded();
                            MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                            browser.waitForAngular();
                            FinalReport.checkRegistrationDetailEntries();
                            FinalReport.EnterFinalReportData();
                            FinalReport.EnterRegistrationDetails();
                            browser.waitForAngular();
                            FinalReport.FinalReportCreate();
                            CustomLibrary.WaitForSpinnerInvisible();
                            FinalReport.VerifyFinalReportIsCreated().then(function(result)
                            {
                                console.log("Value is " + result);
                                if(result)
                                {
                                    //CustomLibrary.ClosePopup();
                                    browser.sleep(2000);
                                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                                    browser.sleep(2000);
                                     CustomLibrary.closeWindowUrlContains("pdfDocuments");
                                     browser.sleep(2000);
                                     CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                                     browser.sleep(2000);
                                    FinalReport.FinalReportSubmit();
                                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].MMSFinalReportSubmitted, true);
            
                                }
                               
                            })

                        }
                        else {
                            console.log("Skipping the Final Report test as Deal Funded Status failed.");
                        }
                    })
                }
                else {
                    console.log("Skipped the Final Report test method execution as the Environment is : " + Env);
                }
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    });

    it('TC - 316724 : CLOSE Deal', function () {
        if (FCTURN) {
            if (loginRedirectURL) {
                if (Env != 'PROD' && Env != 'DR') {
                    MMSPortral.loginMMSPortal();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    //CustomLibrary.SwitchTab(1);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2);
                    browser.sleep(2000);
                    MMSCreateDeal.ClickOnLawyerTab();
                    MMSCreateDeal.FillClickCheckReportCompleted();
                    MMSCreateDeal.StatusMenuClick();
                    MMSPortral.ClickOnCloseButton();
                    //CustomLibrary.CloseTab();
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000); 
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                    browser.sleep(2000);
                }
                else {
                    console.log("Skipped the File Closed test method execution as the Environment is : " + Env);
                }
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    })

    it('CANCEL Deal', function () {

        if (FCTURN) {

            if (loginRedirectURL) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               // CustomLibrary.SwitchTab(1);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2);
               browser.sleep(2000);
                MMSCreateDeal.StatusMenuClick();
                browser.sleep(1000);
                MMSCreateDeal.getStatus().then(function (status) {
                    if (Env == 'PROD'|| Env == 'DR'|| status != 'CLOSED') {
                        MMSCreateDeal.ClickOnCancelDeal();
                        //CustomLibrary.SwitchTab(2);
                        browser.sleep(2000);
                        CustomLibrary.navigateToWindowWithUrlContains("ChangeStatus",3);
                        browser.sleep(2000);
                        MMSCreateDeal.EnterCancellationReasons("Duplicate Deal", "Some Reason");
                        browser.sleep(1000);
                        //CustomLibrary.CloseTab2(1);
                    }

                    else {
                       // CustomLibrary.CloseTab2(1);
                        console.log("Skipped the cancel method as the Environment is : " + Env + " or deal status is :" + status);
                    }
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                    browser.sleep(2000); 
                    CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                    browser.sleep(2000);

                });
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }

    })

    it('TC - 316725: Operations Portal - Document verification', function () {
        if (FCTURN) {
            if (loginRedirectURL) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                OperationsPortal.GetDealStatus().then(
                    function(status){
                        if(status == "CANCELLED" || status == "COMPLETED") 
                        {
                            expect(true).toBe(true, "STATUS" + status);
                        }
                        else
                        {
                            expect(true).toBe(false, "STATUS" + status);
                        }

                    });
                OperationsPortal.ClickDocumentsTab();
                OperationsPortal.VerifyUploadedDocument("Request for Funds");
            }
            else {

                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    });

    it('TC - 316720: New Deal - Email verification', function () {
        if (FCTURN) {
            if (loginRedirectURL) {
                OutlookPortal.LogintoOutlookNonAngular();
                OutlookInbox.VerifyEmailOutlook("New Deal", LenderRefNo);
          
            }
            else {
                expect(loginRedirectURL).not.toBe(undefined, "GetRedirectURL service does not have redirect URL!!!");
                expect(loginRedirectURL).not.toBe(null, "GetRedirectURL service does not have redirect URL!!!");
            }
        }
        else {
            expect(FCTURN).not.toBe(undefined, "MMS Deal could not be created!!!");
            expect(FCTURN).not.toBe(null, "MMS Deal could not be created!!!");
        }
    })

});