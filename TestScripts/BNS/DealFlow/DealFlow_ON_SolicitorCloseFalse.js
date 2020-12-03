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

describe('E2E Flow with IsSolicitorClose as false', function () {
    var BNSFctUrn = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL =null;
    var EC = protractor.ExpectedConditions;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LangBNS = BNSTestData.data.LANGUAGE.value;
    var instrumentNo = "123567";
    var FirstNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value;
    var LastNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value;
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;
    var IsFinalReportCreated = false;
        
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });
    it('CREATE BNS Deal through Lender service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        expect(BNSFctUrn).not.toBe(null);
        if (BNSFctUrn) {
            //Accepting the deal
            console.log(BNSFctUrn);
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            }
    })

    it('Verify Home Page,Deal Acceptance Milestone, Deal History', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if  (loginRedirectURL) {
                CustomLibrary.WaitForSpinnerInvisible();
                //Regression - Test case 195688: Step 3 
                HomePage.VerifyHomePage();

                //Verify footer
                HomePage.VerifyFooter();

                //Regression - Test case 195688: Step 4
                HomePage.VerifyDealStatusSection('LLC');
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                HomePage.VerifyLLCRffNotStarted();
                HomePage.VerifyFinalReportNotStarted();

                //Regression - Test case 195688: Step 5
                HomePage.VerifyMortgageInfoSection();

                //Regression - Test case 195688: Step 6
                HomePage.VerifyMortgageInfoValue();

                //Regression - Test case 195688: Step 7, 10 
                HomePage.VerifyMailRecSection();

                //Regression - Test case 195688: Step 11, 12
                HomePage.VerifyMailRecValidation();

                //Regression - Test case 195688: Step 13
                HomePage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);

                //Verify left navigation bar
                MenuPanel.VerifyLeftMenuItems();
                MenuPanel.ToggleSideMenu();
                MenuPanel.ToggleSideMenu();

                //Regression - Test case 195688: Step 17, 18, 19, 20
                HomePage.NavigateAway();

                //Verify deal history entry for "accept deal" on embedded portal
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealAccept, true);
                //DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityDealAccept);
            }
            else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('Call to GetLawyerDealEvents Service', function () {
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
                expect(DealStatus).toBe('ACTIVE','Deal status is not Active.');
            }
            else {
                expect(true).toBe(false, "Unable to verify deal events for accepting the deal.");    
            }
    })

    it('SendUpdateTransactionData REST service', function () {
        if  (loginRedirectURL) {
             AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
             var ClosingDate = CustomLibrary.CurrentOrFutureDate();
             LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
             browser.sleep(3500);
            }
            else {
                expect(true).toBe(false, "Unable to update deal data.");  
            }
        
    })

    //TC-288309: LLC Embedded Portal - Lender sends Actionable Note - The Actionable Notes section is not displayed when Lawyer has not received any Actionable Note
    //TC-288306: LLC Embedded Portal - Lender sends Actionable Note - indicator is not displayed if lawyer does not have any actionable notes
    it('TC-288306, 288309: Count indicator & actionable notes table is not displayed if lawyer does not have any actionable notes', function () {
        if  (loginRedirectURL) {

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            CustomLibrary.WaitForSpinnerInvisible();
                     
            //TC-288306: LLC Embedded Portal - Lender sends Actionable Note - indicator is not displayed if lawyer does not have any actionable notes
            NotesPage.VerifySpecialAttnIcon(false);

            //TC-288309: LLC Embedded Portal - Lender sends Actionable Note - The Actionable Notes section is not displayed when Lawyer has not received any Actionable Note
            NotesPage.VerifyActionableNotesTableDisplayed(false);    
           
        }
        else {

            expect(true).toBe(false, "Unable to check actionable notes."); 
        }
    })
      
    it('Request for Funds', function () {
            if  (loginRedirectURL) {

                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                CustomLibrary.WaitForSpinnerInvisible();
               // HomePage.VerifyFileNo();
                
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        
                //Regression - Test case 195778: Step 5
                RFFPage.VerifyRFFPage();
        
                //Regression - Test case 195778: Step 7
                RFFPage.CommentonRFF("This is an automated comment on Request for funds page");
        
                //Regression - Test case 195778: Step 9
                RFFPage.SubmitRFF();
        
                //Regression - Test case 195778: Step 10
                HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);
        
                //Regression - Test case 195778: Step 11
                //Bug#233673: After RFF submission, milestone RFF status does not change
                RFFPage.VerifyRFFCheckmarkPostSubmission();
        
                //Regression - Test case 195778: Step 12
                RFFPage.VerifySubmitButtonStatus('Disabled');
        
                //Regression - Test case 195778: Step 13
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.VerifySubmitButtonStatus('Enabled');
            }
            else {

                expect(true).toBe(false, "Unable to submit RFF."); 
            }
    })

    //TC-271821:LLC Embedded Portal- View Request for Funds
    it('TC-271821: RF -Navigation away,Resubmit RFF, DH', function () {
        if  (loginRedirectURL) {
            CustomLibrary.WaitForSpinnerInvisible();

            //Verify Navigate Away on RFF
            RFFPage.CommentonRFF( BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
            RFFPage.NavigateAway();
            HomePage.NavigateAwayAcceptReject('Cancel');
            RFFPage.NavigateAway();
            HomePage.NavigateAwayAcceptReject('OK');

            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

            //Resubmit RFF
            RFFPage.CommentonRFF(BNSTestData.data[LangBNS].RFF.commentRFF);
            RFFPage.ResubmitRFF();
            HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);
            RFFPage.VerifySubmitButtonStatus('Disabled');

            //Verify deal history entry on RFF submission
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            var date = LenderIntegrationBNS.ReturnClosingDate();
            var formattedDate = dateFormat(date, "UTC:mmmm d, yyyy");

            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer,  TestData.data[Lang].DealHistory[Env].RFFSubmitted  + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFF + ').');
    
            }
        else {
            expect(true).toBe(false, "Unable to verify GetLawyerDealEvents, Navigation away, Resubmit RFF, Deal history on RFF submission."); 
        }  
    })

    it('Notes - Standard / regular', function () {
        if  (loginRedirectURL) {
        //Regression - Test case 195689: Step 4, 15, 18
        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        NotesPage.VerifyNotesPage();

        //Regression - Test case 195689: Step 5
        NotesPage.ClickNotesButton('NewNote');

        //Regression - Test case 195689: Step 6
        NotesPage.VerifyNewNoteFeilds();

        //Regression - Test case 195689: Step 7
        NotesPage.ClickNotesButton('Cancel');
        NotesPage.NewNoteFeildsHidden();

        //Regression - Test case 195689: Step 8
        NotesPage.ClickNotesButton('NewNote');

        //Regression - Test case 195689: Step 9
        NotesPage.ClickNotesButton('SendNote');
        NotesPage.VerifyMissinfieldMessag();

        //Regression - Test case 195689: Step 10
        NotesPage.SelectStandardNoteType(TestData.data[Lang].Notes.StdNoteOption1);

        NotesPage.VerifyPopulatedSubjectTB(TestData.data[Lang].Notes.StdNoteOption1);
        NotesPage.VerifyPopulatedNoteTB(TestData.data[Lang].Notes.StdNote1);

        //Regression - Test case 195689: Step 13
        NotesPage.ClickNotesButton('SendNote');
        NotesPage.NewNoteFeildsHidden();
        expect(NotesPage.GetNotesTableCountBNSTD()).toBe(1);

        NotesPage.VerifyNotesTableEntry(1, FirstNameLawyer, LastNameLawyer, TestData.data[Lang].Notes.StdNoteOption1, TestData.data[Lang].Notes.StdNote1);

        //Regression - Test case 195689: Step 14
        NotesPage.VerifySavedChanges(TestData.data[Lang].Messages.SaveSuccessMsg);

        //Regression - Test case 230135: Verify Notes Page and Send Standard Note
        NotesPage.ClickNotesButton('NewNote');

        //Regression - Test case 195689: Step 11
        NotesPage.EnterSubjectText(BNSTestData.data[LangBNS].Notes.subjectNote);

        //Regression - Test case 195689: Step 12
        NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNote);

        NotesPage.ClickNotesButton('SendNote');
        expect(NotesPage.GetNotesTableCountBNSTD()).toBe(2);

        //Regression - Test case 195689: Step 16
        NotesPage.ExpandNoteNVerify(1);
        browser.sleep(500);
        NotesPage.VerifyNotesTableEntry(1, FirstNameLawyer, LastNameLawyer, BNSTestData.data[LangBNS].Notes.subjectNote, BNSTestData.data[LangBNS].Notes.detailNote);

        //Regression - Test case 195689: Step 17
        NotesPage.CollapseNoteNVerify(1);

        //Regression - Test case 195689: Step 19 - Out of scope
        //NotesPage.VerifyPrintNote();

        //Regression - Test case 195689: Step 20
        NotesPage.ClickNotesButton('NewNote');
        NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);

        //Regression - Test case 195689: Step 21
        NotesPage.NavigateAway()
        NotesPage.VerifyNavigateAway();

        //Regression - Test case 195689: Step 22
        NotesPage.NavigateAwayAcceptReject('Cancel');
        NotesPage.VerifyPopulatedNoteTB(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);

        //Regression - Test case 195689: Step 23
        NotesPage.NavigateAway();
        NotesPage.VerifyNavigateAway();

        //Regression - Test case 195689: Step 24
        NotesPage.NavigateAwayAcceptReject('OK');
        browser.wait(EC.textToBePresentInElement(element(by.css('.title')), 'Home'), 20000, 'Home page is taking too long to load');
        HomePage.VerifyHomePage();
        }
        else {
            expect(true).toBe(false, "Unable to send standard / regular notes."); 
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

    it('Verify Lawyer note to Lender and Verify RFF Event', function () {
        if  (loginRedirectURL) {
            expect(LenderIntegrationBNS.VerifyDealEvent('REQUESTFORFUNDS')).toBe(true, "Request For Funds Event");

            //Regression - Test case 230710: Verify notes sent from embedded portal is available to lenders (GetLawyerDealEvents)
            //Bug#230617 - GetLawyerDealEvents - Does not return the latest note [FIXED]
            expect(LenderIntegrationBNS.ReturnNoteSubject(1, 'AMENDMENTS')).toContain(TestData.data[Lang].Notes.StdNoteOption1);
            expect(LenderIntegrationBNS.ReturnNoteDetails(1, 'AMENDMENTS')).toBe(TestData.data[Lang].Notes.StdNote1);

            expect(LenderIntegrationBNS.ReturnNoteSubject(2, 'AMENDMENTS')).toBe(BNSTestData.data[LangBNS].Notes.subjectNote);
            expect(LenderIntegrationBNS.ReturnNoteDetails(2, 'AMENDMENTS')).toBe( BNSTestData.data[LangBNS].Notes.detailNote);
        }
        else {
            expect(true).toBe(false, "Unable to verify lawyer note to lender."); 
        } 
    })

    it('SendNote SOAP service', function () {
        if  (loginRedirectURL) {
            //WebService.BNSSendNote('STANDARD', 'NEW', LenderNoteSubject, LenderNoteDetails);
            LenderIntegrationBNS.SendBNSNote('1', 'STANDARD', 'NEW',  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
        }
        else {
            expect(true).toBe(false, "Unable to send lender note."); 
        } 
    })

    it('Verify Lender Note to Lawyer', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            //Regression - Test case 230711: Verify that Note sent by Lender is view able by Lawyer
            NotesPage.VerifyNotesHistoryTableSearch(BNSTestData.data[LangBNS].Notes.LenderNoteDetails, true);
         }
        else {
            expect(true).toBe(false, "Unable to verify lender note."); 
        }
    })

    //TC-288504: LLC Embedded Portal- View Request for Funds BNS- Verify that RFF page is read only if cancelation request has been issued (not in active state)
    it('TC-288504: Request for cancellation', function () {
        if  (loginRedirectURL) {     
        //Navigate to Request cancellation page, verify layout
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifyRFCPage();
        RequestCancellation.VerifyReqCancellationSection();

        //Submit request cancellation without selecting option, Verify validation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyMissinfieldMessag();

        //Navigation away
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('Cancel');
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('OK');
        //browser.sleep(1500);
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');

        //Select request cancellation option from drop down
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);

        //Submit request for cancellation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyConfirmCancellationSection();
        RequestCancellation.ConfirmCancellationDynamic('OK');
        HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

        //Verify System displays all pages as read only except for View /download documents and Send/view/print notes
        RequestCancellation.VerifySubmitButtonStatus('Disabled');
        RequestCancellation.VerifyReasonDropDownStatus('Disabled');

        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        HomePage.VerifyCancellationRequestMsg();
        HomePage.VerifySaveButtonStatus('Disabled');

        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        FinalReportPage.VerifyCancellationRequestMsg();
        FinalReportPage.VerifyallButtonStatus('Disabled');
        //Rest verification will be done after final report is done

        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        NotesPage.VerifyNewNoteButtonStatus('Enabled');

        //RequestCancellation.VerificationPostCancellation();

        //TC-288504: LLC Embedded Portal- View Request for Funds BNS- Verify that RFF page is read only if cancelation request has been issued (not in active state)
        MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
        RFFPage.VerifyCancellationRequestMsg();
        RFFPage.VerifyComment('Disabled');
        RFFPage.VerifySubmitButtonStatus('Disabled');

        }
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

    it('GetTransactionData REST service', function () {
        if  (loginRedirectURL) {
            LawyerIntegrationCommon.GetTransactionStatus(BNSFctUrn);
           // browser.sleep(4000);
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
       
    })

    //  Verify the tab "Request Cancellation" is displayed as read only for deal statuses "Completed" or "Request cancellation" or a Milestone status of "Final Report Submitted
    //TC-238993: LLC Embedded Portal - Lender Reinstates BNS Deal
    it('TC-238993:Request Cancellation State"', function () {
        if  (loginRedirectURL) {
            //Request Cancellation State - Verify the tab "Request Cancellation" is displayed as read only for deal status "Request cancellation"
            var dealStatus = LawyerIntegrationBNS.ReturnTransactionStatus();
            if (dealStatus == "CANCELLATION REQUESTED") {
                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            }
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
       
    })

    it('TC-238993: GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
    })

    it('TC-238993: Request Cancellation State -Getlawyerdealevent, DH Entry', function () {
        if  (loginRedirectURL) {
            var DealStatus = LenderIntegrationBNS.ReturnDealStatus('REQUESTCANCELLATION');
            expect(DealStatus).toBe('CANCELLATIONREQUESTED');

            //Request Cancellation State - Verify deal History entry
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityReqCancel + ' ' + TestData.data[Lang].RequestForCancellation.CancelReasonOption1.trim());
        }
        else {
            expect(true).toBe(false, "Unable to verify Request Cancellation State"); 
        }       
    })

  
    it('TC-238993: SendDealStatusChangeRequest SOAP service - Re-instating deal', function () {
        if  (loginRedirectURL) {
            //Lender cancels deal
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusReinstate, TestData.data[Lang].WebService.DealStatusChangeReasonReinstate);
            browser.sleep(3500);
          }
          else {
              expect(true).toBe(false, "Unable to Reinstate deal"); 
          }  
    })

    //Lender reinstates deal while user is logged in, Verify all tabs
    it('TC-238993: Reinstate Deal', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifySaveButtonStatus('Enabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            //After SROT submission, these stays disabled
            RFFPage.VerifyComment('Enabled');
            RFFPage.VerifySubmitButtonStatus('Enabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.VerifyNewNoteButtonStatus('Enabled');
            NotesPage.VerifyPrintButtonStatus('Enabled');

            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            RequestCancellation.VerifySubmitButtonStatus('Enabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender,  TestData.data[Lang].DealHistory.ActivityDealReinstated + ' ' + TestData.data[Lang].WebService.DealStatusChangeReasonReinstate + '.');
        }
        else {
              expect(true).toBe(false, "Unable to verify UI after deal is Reinstated."); 
        }  
    })

    //Update closing date to present or past(If weekend today)
    it('SendUpdateTransactionData REST service ', function () {
        if  (loginRedirectURL) {
            var ClosingDate = CustomLibrary.CurrentOrPastDate();
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal."); 
        } 
    })

    //TC-271893:LLC Embedded Portal- View Request for Funds BNS/Verify that RFF page is read only if "Final Report" Milestone has been completed
    //BNS Final Report UI & layout, Navigate away, Save create & submit final report, verify milestone status, GetLawyerDealEvent - verify document, Verify deal history
    it('TC-271893: Final Report', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            //Navigate to Final Report page, verify layout
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyFRPage();
            FinalReportPage.VerifyProperty();
            FinalReportPage.VerifyRegParticulars();
            FinalReportPage.VerifyFireInsParticulars();
            FinalReportPage.TitleInsLPD();
            FinalReportPage.VerifyLawyerNotaryComm();
            FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');

            //Verify milestone status 'Not Started'
            FinalReportPage.VerifyFRCheckmarkStatus('Not Started');

            //Accept amendments if any
            //FinalReportPage.AcceptAmendmentIfAvailable();
            if (CustomLibrary.CurrentOrFutureDate() != CustomLibrary.CurrentOrPastDate()) {
                FinalReportPage.AcceptAmendmentIfAvailable();
            }

            //Navigation away
            FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReportPage.NavigateAway();
            FinalReportPage.VerifyNavigateAway();
            FinalReportPage.NavigateAwayAcceptReject('Cancel');
            FinalReportPage.NavigateAway();
            FinalReportPage.NavigateAwayAcceptReject('OK');
            browser.sleep(1500);
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');

            //Save final report
            FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReportPage.CommentonFinalReport('This is an automated comment on final report page');
            FinalReportPage.SelectDocLanguage('English');
            FinalReportPage.ClickFRButton('btnSave');
            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);

            //Verify milestone status 'In Progress'
            FinalReportPage.VerifyFRCheckmarkStatus('In Progress');


            //Create final report
            FinalReportPage.ClickFRButton('btnCreate');

           // CustomLibrary.ClosePopup();

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
        
                    //Submit final report
                    FinalReportPage.ClickFRButton('btnSubmit');
                    FinalReportPage.SubmitFR();
                    FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                    FinalReportPage.VerifyFRCheckmarkStatus('Complete');
                    FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');
        
                    //Verify deal history 
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityFRSubmitted);
        
                     //TC-271893:LLC Embedded Portal- View Request for Funds BNS/Verify that RFF page is read only if "Final Report" Milestone has been completed
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
        if  (loginRedirectURL && IsFinalReportCreated) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
      
    })

    it('Verify final report document available in GetLawyerDealEvents', function () {
        if  (loginRedirectURL && IsFinalReportCreated) {
           //Verify GetLawyerDeal Events for FR
            expect(LenderIntegrationBNS.VerifyDealEvent('SUBMITSROT')).toBe(true);

            //Verify GetLawyerDeal Events for FR documents
            expect(LenderIntegrationBNS.ReturnDocDisplayName('DOCUMENTS')).toBe('Final Report');
        }
        else {
            expect(true).toBe(false, "Unable to verify final report document available in GetLawyerDealEvents"); 
        }         
    })

    it('TC-288312: Lender updates property city', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)  && IsFinalReportCreated) {
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstNam
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississauga', null, null);
            //browser.sleep(3000);
        }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })

    //TC-238763, 288324: LLC Embedded Portal - BNS - Lender sends Actionable Notes to Lawyer
    it('TC-238763, 288324: SendNote SOAP service - Actionable notes', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
            //Send lender actionable note to lawyer
            LenderIntegrationBNS.SendBNSNote('1', 'ACTIONABLE', 'NEW',  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
         }
         else {
             expect(true).toBe(false, "Unable to Send Actionable Note"); 
         }    
    })

     //TC-238763, 288324: LLC Embedded Portal - BNS - Lender sends Actionable Notes to Lawyer
    it('TC-238763, 288324: SendNote SOAP service - Actionable notes', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
            //Send lender actionable note to lawye        
            LenderIntegrationBNS.SendBNSNote('1', 'ACTIONABLE', 'NEW', BNSTestData.data[LangBNS].Notes.LenderActionableNoteSubject, BNSTestData.data[LangBNS].Notes.LenderActionableNoteDetails);
         }
         else {
             expect(true).toBe(false, "Unable to Send Actionable Note"); 
         }     
    })
   
         
    //TC-288312: LLC Embedded Portal - Lender sends Actionable Note - User is able to access the actionable notes if lender sends amendment
    //TC-238712: LLC Embedded Portal - Receive Lender Note -  multiple notes are pending
    //TC-270035, 288502 : LLC Embedded Portal - Receive Lender Note -  Lender Note Received - Special Attention -Actionable Note in Unity
    //TC-238717: Verify actionable notes section disappears when no outstanding actionable note remaining
    //TC-238721, 288310: LLC Embedded Portal - Confirm Actionable Note- Actionable note is moved to the Notes History grid once it is completed
    //TC-238719: LLC Embedded Portal - Confirm Actionable Note- The Actionable Notes section is displayed when Lawyer has received an actionable note
    //TC-238718, 288307, 288303: LLC Embedded Portal - Actionable Note Indicator-The indicator displays the correct count of outstanding Actionable Notes
    //TC-238716, 288305: LLC Embedded Portal - Actionable Note Indicator - Indicator is cleared if all outstanding Actionable Notes have been marked as complete
    //TC-238715, 288304: LLC Embedded Portal - Actionable Note Indicator -  Number in the indicator is updated according to the user's actions
    //TC-238711, 288301: LLC Embedded Portal - Receive Lender Note - 'special attention' identifier is removed
    it('TC-329697, 238711, 288313, 288301, 288302, 288303, 288304, 288305, 288307, 288308, 288310, 238712,288502, 238715, 238716, 238717,238718, 238719,238721, 270035: Actionable notes', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) 
        {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            //Verify actionable notes table, verify multiple pending actionable notes
            expect(NotesPage.GetNotesTableCountBNSTDActionable()).toBe(2);

            //TC-238719, 288308: LLC Embedded Portal - Confirm Actionable Note- The Actionable Notes section is displayed when Lawyer has received an actionable note
            NotesPage.VerifyNotesTableActionable();
            NotesPage.VerifyNotesTableEntryActionable(1, BNSTestData.data[LangBNS].Notes.LenderActionableNoteSubject, BNSTestData.data[LangBNS].Notes.LenderActionableNoteDetails);
            NotesPage.VerifyNotesTableEntryActionable(2,  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
            NotesPage.VerifyActionableNoteConfirmation();

            //TC-238711,238718: Verify notes indicator icon available, verify notes indicator icon count
            //TC-238712, 288302: LLC Embedded Portal - Receive Lender Note -  multiple notes are pending
            NotesPage.VerifySpecialAttnIcon(true, '2');

            //Confirm actionable note
            NotesPage.ConfirmActionableNote(1, true);
            expect(NotesPage.GetNotesTableCountBNSTDActionable()).toBe(1);

            //TC-238721: Verify completed actionable note added to notes history 
            NotesPage.VerifyNotesTableEntry(1, FirstNameLender, LastNameLender, BNSTestData.data[LangBNS].Notes.LenderActionableNoteSubject, BNSTestData.data[LangBNS].Notes.LenderActionableNoteDetails + '(Actionable Note - completed)');
                        
           //TC-238715: Verify notes indicator icon is updated according to remaining actionable notes
            NotesPage.VerifySpecialAttnIcon(true, '1');

            NotesPage.ConfirmActionableNote(1, true);
            NotesPage.VerifyNotesTableEntry(2, FirstNameLender, LastNameLender,  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails + '(Actionable Note - completed)');
           
            
            //TC-238716: Verify notes indicator icon is cleared/not displayed when all outstanding actionable notes completed
            NotesPage.VerifySpecialAttnIcon(false);

            //TC-238717: Verify actionable notes section disappears when no outstanding actionable note remaining
            NotesPage.VerifyActionableNotesTableDisplayed(false);

            //TC:329697- 11.5 Standardize portal messages to reference partner instead of Unity - Actionable notes completed by lawyer  VM- BNS
            NotesPage.VerifyActionableNotesSubmissionMsg(TestData.data[Lang].Messages[Env].ActionableNotesMsg);
         }
         else {
             expect(true).toBe(false, "Unable to verify actionable notes."); 
         }  
       
    })

    it('Lender updates property city', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)  && IsFinalReportCreated ) {
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstNam
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississauga', null, null);
            //browser.sleep(3000);
        }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })

    it('SendNote SOAP service - Actionable notes', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
            //Send lender actionable note to lawyer
            LenderIntegrationBNS.SendBNSNote('1', 'ACTIONABLE', 'NEW',  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
         }
         else {
             expect(true).toBe(false, "Unable to Send Actionable Note"); 
         }    
    })

    it('TC-288313: Lawyer Accepts Lender Changes', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null)   && IsFinalReportCreated) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(BNSFctUrn, 'ACCEPT');
            browser.sleep(8500);
        }
        else {
            expect(true).toBe(false, "Lawyer is not able to reject deal.");  
        } 
    })

    //TC-288313: LLC Embedded Portal - Lender sends Actionable Note- User is able to access the actionable note after amendment is accepted
    it('TC-288313: Verify actionable notes after accepting amendment', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) 
        {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            //Confirm Actionable Note- The Actionable Notes section is displayed when Lawyer has received an actionable note
            NotesPage.VerifyNotesTableActionable();
            NotesPage.VerifyNotesActionableTableSearch(BNSTestData.data[LangBNS].Notes.LenderNoteDetails, true);
            NotesPage.VerifyActionableNoteConfirmation();
            NotesPage.VerifySpecialAttnIcon(true, '1');
            NotesPage.ConfirmActionableNote(1, true);
            //Verify completed actionable note added to notes history 
            NotesPage.VerifyNotesHistoryTableSearch((BNSTestData.data[LangBNS].Notes.LenderNoteDetails + '(Actionable Note - completed)'), true);
            //TC-288311: LLC Embedded Portal - Lender sends Actionable Note- Completed actionable notes are clearly identified to the user as "Actionable" in grid
            //NotesPage.VerifyNotesTableForCompletedActionableEntry('(Actionable Note - completed)',true);           
            NotesPage.VerifyNotesTableForCompletedActionableEntry(BNSTestData.data[LangBNS].Notes.LenderNoteDetails ,true);           
          }
         else {
             expect(true).toBe(false, "Unable to verify actionable notes."); 
         }  
       
    })

    it('SendDealStatusChangeRequest SOAP service - Closing deal', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
            //Lender closes deal        
            LenderIntegrationBNS.SendDealStatusChange( TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
         }
         else {
             expect(true).toBe(false, "Unable to SendDealStatusChangeRequest"); 
         } 
    })

    //Lender closes deal while user is logged in, Verify all tabs
    it('Close Deal ', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
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
            //NotesPage.VerifyPrintButtonStatus('Disabled');
    
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender,  TestData.data[Lang].DealHistory.ActivityDealClosed);
         }
         else {
             expect(true).toBe(false, "Unable to verify tabs when deal is closed."); 
         }
    })
});

