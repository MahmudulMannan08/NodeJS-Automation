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
var Notes = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var LenderPortal = require('../../../PageObjectMethods/LenderPortal/LenderPortal.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js')
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var dateFormat = require('dateformat');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js');

describe('E2E flow with IsSolicitorClose as true', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var Lang = TestData.data.LANGUAGE.value;
    var LangBNS = BNSTestData.data.LANGUAGE.value;
    var DocumentID = null;
    var DocumentType = null;
    var BNSFctUrn = null;
    var AssessmentRollNumber = null;
    var loginRedirectURL =null;
    var instrumentNo = "123567";
    var EC = protractor.ExpectedConditions;
    var lenderReferenceNumber = null;
    var FirstNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value;
    var LastNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value;
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;
    var IsFinalReportCreated = false;
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('true', 'true', TestData.data[Lang].WebService.Province);
    })

     //Accept BNS deal
    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
            console.log('lenderReferenceNumber = ' + lenderReferenceNumber);
            console.log('fcturn = ' + BNSFctUrn);
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    //TC-288503: LLC Embedded Portal - Note submitted from Lender/Lawyer - Verify that Print Notes option is disabled if no Note to print
    //BNS homepage UI & layout, verify milestone status, save email reciepient, left navigation bar, header & footer, accept deal, lender email notification to lawyer 
    it('TC-247474, 247468, 247487, 247467, 247458, 288503: Home page', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if  (loginRedirectURL) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();

                //Regression - Test case 195688: Step 4
                HomePage.VerifyDealStatusSection('LLC');
        
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                HomePage.VerifyLLCRffNotStarted();
                HomePage.VerifyFinalReportNotStarted();

                //TC-247487, 247458:  Regression - Test case 195688: Step 5
                HomePage.VerifyMortgageInfoSection();
        
                //Regression - Test case 195688: Step 6
                HomePage.VerifyMortgageInfoValue();
        
                //TC-247467 : Regression - Test case 195688: Step 7, 10 
                HomePage.VerifyMailRecSection();
        
                //Regression - Test case 195688: Step 11, 12
                HomePage.VerifyMailRecValidation();
               // HomePage.VerifyMailRecValidationBC();

                //Regression - Test case 195688: Step 13
                HomePage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);
        
                //TC-247474: Verify left navigation bar
                MenuPanel.VerifyLeftMenuItems();
                MenuPanel.ToggleSideMenu();
                MenuPanel.ToggleSideMenu();
        
                //TC-247468: Regression - Test case 195688: Step 17, 18, 19, 20
                HomePage.NavigateAway();
        
                //Verify deal history entry for "accept deal" on embedded portal
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealAccept, true);
                
                //TC-288503: LLC Embedded Portal - Note submitted from Lender/Lawyer - Verify that Print Notes option is disabled if no Note to print
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                NotesPage.VerifyPrintButtonStatus('Disabled');
            }
            else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    //TC:326533- 10.2 Change the label of the hyperlink found in the Help section from:  “LLC Unity User Guide” to "LLC Partner Integration User Guide” BNS
    //TC:288508 View LLC Contact Info - Contact Us section
    it('TC:288508, 326533 - Verify Need help page', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            NeedHelp.VerifyNeedHelpLink();
            HomePage.ClickNeedHelp();
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.WaitForSpinnerInvisible();
            CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
            browser.sleep(300);
            HomePage.VerifyGuideUsLinkOnNeedHelpPage();
            HomePage.VerifyContactUsOnNeedHelpPage();
            //CustomLibrary.SwitchTab(0);
            CustomLibrary.closeWindowUrlContains("contactus");
            browser.sleep(500);
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

    //TC-288515: LLC Embedded Portal- Request for Funds - Solicitor Close True - IDV Solution for BNS- IDV data does not Exist
    it('TC-288515, 329710: Request for Funds-IDV Solution for BNS- IDV data does not Exist', function () {
        if  (loginRedirectURL) {
           
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            //TC-288515: LLC Embedded Portal- Request for Funds - Solicitor Close True - IDV Solution for BNS- IDV data does not Exist
            RFFPage.VerifyWarningIconForIDV();
            //TC-329710: 11.5 Standardize portal messages to reference partner instead of Unity - IDV particulars- VM- BNS
            RFFPage.VerifyWarningMsgForIDV(TestData.data[Lang].Messages[Env].WarningMsgIDV);
                                 
        }
        else {
            expect(true).toBe(false, "Unable to submit RFF."); 
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

    //TC-288507: LLC Embedded Portal-View Request for Funds BNS-Verify Trust Account field is read-only on the RFF screen and defaults to the value sent by the Lender
    //TC-288513: LLC Embedded Portal- Request for Funds -  Solicitor Close True- IDV Solution for BNS - Display the Data in Read-only Format
    //BNS Deal/Verify Request for Funds page is displayed and UI elements are available
    //TC-245289 :LLC Embedded Portal- BNS Request For Funds- Field identifier and Required fields message is displayed
    //TC-245287 :LLC Embedded Portal - BNS Request For Funds- Verify Comments field
    //TC-245291: LLC Embedded Portal- BNS Request For Funds- Submit
    it('TC-245287, 329738, 245289, 245291, 288507, 288513: Request for Funds', function () {
        if  (loginRedirectURL) {
            //Regression - Test case 195778: Step 4
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            //HomePage.VerifyFileNo();
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

            //TC-288507: LLC Embedded Portal-View Request for Funds BNS-Verify Trust Account field is read-only on the RFF screen and defaults to the value sent by the Lender
            RFFPage.VerifyTrustAccount();

            //TC-288513: LLC Embedded Portal- Request for Funds -  Solicitor Close True- IDV Solution for BNS - Display the Data in Read-only Format
            RFFPage.VerifyRFFPageIDVReadOnly();
          
            //Regression - Test case 195778: Step 5
            RFFPage.VerifyRFFPage();
            RFFPage.VerifyRFFPageIDV();
            RFFPage.VerifyRFFPageIDVReadOnly();

            //Regression - Test case 245287: Step 7
            RFFPage.CommentonRFFIDV("This is an automated comment on Request for funds page");

            //Regression - Test case 245289: Step 8
           // RFFPage.VerifyRFFValidation();
           //TC: 329738- 11.5 Standardize portal messages to reference partner instead of Unity - Field(s) to be completed in Unity VM- BNS
            RFFPage.VerifyRFFValidationIDBforBNS();
            //Select solicitor acknowledgement option
            RFFPage.SelectAcknowledgement(1);

            //Regression - Test case 245291: Step 9
            RFFPage.SubmitRFF();

            //Regression - Test case 195778: Step 10
            HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);

            //Regression - Test case 195778: Step 11
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

    //TC-245298-:LLC Embedded Portal- BNS Request For Funds-Verify Navigate Away functionality on "RFF" page
    //TC-245297: LLC Embedded Portal- BNS Request For Funds-Submit RFF - Verify Deal History entry is created
    //TC-245295: LLC Embedded Portal- BNS Request For Funds- RFF Milestone is updated and displayed with Green circle
    //TC-245292: LLC Embedded Portal - BNS Request For Funds-Resubmission of RFF and Submit button enabled/disabled
    it('TC-245292, 245295, 245297, 245298: RFF Navigation away, Resubmit RFF, DH', function () {
        if  (loginRedirectURL) {
    
            //Verify Navigate Away on RFF
            RFFPage.CommentonRFFIDV(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
            RFFPage.NavigateAway();
            HomePage.NavigateAwayAcceptReject('Cancel');
            RFFPage.NavigateAway();
            HomePage.NavigateAwayAcceptReject('OK');
            //browser.sleep(1000);
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');

            //Resubmit RFF
            RFFPage.CommentonRFFIDV(BNSTestData.data[LangBNS].RFF.commentRFF);
            RFFPage.ResubmitRFF();
            HomePage.VerifyMessage(TestData.data[Lang].Messages.SubmitSuccessMsg);
            RFFPage.VerifySubmitButtonStatus('Disabled');
            //TC-245295: LLC Embedded Portal- BNS Request For Funds- RFF Milestone is updated and displayed with Green circle
            HomePage.VerifyRFFCheckMark();
            //Verify deal history entry on RFF submission
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            var date = LenderIntegrationBNS.ReturnClosingDate();
            var formattedDate = dateFormat(date, "UTC:mmmm d, yyyy");
               //TC-245297: LLC Embedded Portal- BNS Request For Funds-Submit RFF - Verify Deal History entry is created
           DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer,  TestData.data[Lang].DealHistory[Env].RFFSubmitted  + FirstNameLawyer + ' ' + LastNameLawyer + ' (Closing Date: ' + formattedDate + ', Comments: ' + BNSTestData.data[LangBNS].RFF.commentRFF + ').');
        }
        else {
            expect(true).toBe(false, "Unable to verify GetLawyerDealEvents, Navigation away, Resubmit RFF, Deal history on RFF submission."); 
        }  
    })

    //TC-303910: LLC Embedded Portal -Verify Notes History Grid- BNS
    //TC-238731, 288316: LLC Embedded Portal -  View Notes
    //TC-238732,288317: LLC Embedded Portal -  Navigate Away Functionality on Notes Page
    //TC-238744: LLC Embedded Portal - Notes page - BNS Deal- Notes page is displayed with proper sections and UI elements are available and functionality
    it('TC-238731, 238732, 238744, 303909, 303910, 288321, 288317, 288316: Notes - standard / regular', function () {
        if  (loginRedirectURL) {
         //Regression - Test case 238731, 303909: Step 4, 15, 18
         MenuPanel.PrimaryMenuNavigateWithWait('Notes');
         NotesPage.VerifyNotesPage();
 
         //Regression - Test case 238731, 303909: Step 5
         NotesPage.ClickNotesButton('NewNote');
 
         //Regression - Test case 238731, 303909: Step 6
         NotesPage.VerifyNewNoteFeilds();
 
         //Regression - Test case 238731, 303909: Step 7
         NotesPage.ClickNotesButton('Cancel');
         NotesPage.NewNoteFeildsHidden();
 
         //Regression - Test case 238731, 303909: Step 8
         NotesPage.ClickNotesButton('NewNote');
 
         //Regression - Test case 238731, 303909: Step 9
         NotesPage.ClickNotesButton('SendNote');
         NotesPage.VerifyMissinfieldMessag();
 
         //Regression - Test case 238731, 303909: Step 10
         NotesPage.SelectStandardNoteType(TestData.data[Lang].Notes.StdNoteOption1);
 
         NotesPage.VerifyPopulatedSubjectTB(TestData.data[Lang].Notes.StdNoteOption1);
         NotesPage.VerifyPopulatedNoteTB(TestData.data[Lang].Notes.StdNote1);
 
         //Regression - Test case 238731, 303909: Step 13
         NotesPage.ClickNotesButton('SendNote');
         NotesPage.NewNoteFeildsHidden();
         expect(NotesPage.GetNotesTableCountBNSTD()).toBe(1);
         
         //TC-303910: LLC Embedded Portal -Verify Notes History Grid- BNS
         NotesPage.VerifyNotesHistoryTableSearch(TestData.data[Lang].Notes.StdNote1, true);
          
         //Regression - Test case 238731: Step 14
         NotesPage.VerifySavedChanges(TestData.data[Lang].Messages.SaveSuccessMsg);
 
         //Regression - Test case 230135: Verify Notes Page and Send Standard Note
         NotesPage.ClickNotesButton('NewNote');
 
         //Regression - Test case 238731: Step 11
         NotesPage.EnterSubjectText(BNSTestData.data[LangBNS].Notes.subjectNote);
 
         //Regression - Test case 238731: Step 12
         NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNote);
 
         NotesPage.ClickNotesButton('SendNote');
         expect(NotesPage.GetNotesTableCountBNSTD()).toBe(2,"Verify Note Count under Notes Tables");
 
         //Regression - Test case 238731: Step 16
         NotesPage.ExpandNoteNVerify(1);
         //browser.sleep(500);
         NotesPage.VerifyNotesHistoryTableSearch(BNSTestData.data[LangBNS].Notes.detailNote, true);
         //NotesPage.VerifyNotesTableEntry(1, FirstNameLawyer, LastNameLawyer, BNSTestData.data[LangBNS].Notes.subjectNote, BNSTestData.data[LangBNS].Notes.detailNote);
          
         NotesPage.CollapseNoteNVerify(1);
 
         //Regression - Test case 195689: Step 19 - Out of scope
         //NotesPage.VerifyPrintNote();
            
         //TC-288321: LLC Embedded Portal - Lawyer Post a Note
         NotesPage.ClickNotesButton('NewNote');
         NotesPage.EnterSubjectText(BNSTestData.data[LangBNS].Notes.subjectNote);
         NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.TestNote);
         NotesPage.ClickNotesButton('SendNote');

         //Regression - Test case 195689: Step 20
         NotesPage.ClickNotesButton('NewNote');
         NotesPage.EnterNotesText(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
 
         //Regression - Test case 238732, 288317: Step 21
         NotesPage.NavigateAway();
         NotesPage.VerifyNavigateAway();
 
         //Regression - Test case 238732, 288317: Step 22
         NotesPage.NavigateAwayAcceptReject('Cancel');
         NotesPage.VerifyPopulatedNoteTB(BNSTestData.data[LangBNS].Notes.detailNoteNavigate);
 
         //Regression - Test case 238732, 288317: Step 23
         NotesPage.NavigateAway();
         NotesPage.VerifyNavigateAway();
 
         //Regression - Test case 238732, 288317: Step 24
         NotesPage.NavigateAwayAcceptReject('OK');
         browser.wait(EC.textToBePresentInElement(element(by.css('.title')), 'Home'), 20000, 'Home page is taking too long to load');
         HomePage.VerifyHomePage();
        }
        else {
            expect(true).toBe(false, "Unable to send standard / regular notes."); 
        }  
    })

    //TC-303911: LLC Embedded Portal -Verify Lender Portal for View Notes Functionality- BNS
    it('TC-303911: Lender Portal -Verify lawyer notes', function () {
          
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            //login to Lender portal
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindow("",2);
            LenderPortal.LoginToLenderPortalBNS( RunSettings.data.Global.LLC[Env].BNSLenderUser, RunSettings.data.Global.LLC[Env].BNSLenderPassword);

            //Search deal in lender portal
            LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
            //TC-303911: LLC Embedded Portal -Verify Lender Portal for View Notes Functionality- BNS
            LenderPortal.NavigateToNotesTabBNS();
            LenderPortal.VerifyNotesTableEntry(BNSTestData.data[LangBNS].Notes.TestNote);
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("LenderPortal");
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);

        }

        else{
            expect(false).toBe(true, "Either deal is not created or is not available in lender portal.");
        }

    })

    //TC-303912: LLC Embedded Portal -VerifyOpps Portal for View Notes Functionality- BNS
    it('TC-303912: Verify lawyer notes in Operations Portal', function () {
        if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
            CustomLibrary.OpenNewTab();
            browser.sleep(1000);
            CustomLibrary.navigateToWindow("",2);
            OperationsPortal.LoginOperationsPortal();
            //Search deal in operations portal
            OperationsPortal.SearchDealBNS(BNSFctUrn).then(function(count){   
                if(count > 0)
                {
                    CustomLibrary.WaitForSpinnerInvisible();
                    OperationsPortal.ClickNotesTab();
                    OperationsPortal.VerifyNotesTableEntry(BNSTestData.data[LangBNS].Notes.TestNote);
                    
                } 
               });  
               browser.sleep(500);
               CustomLibrary.closeWindowUrlContains("OperationsPortal");
               CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);     
        }
        else{
            expect(false).toBe(true, "Either deal is not created or is not available in operational portal.");
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

    //TC-238761, 288322: LLC Embedded Portal - Notes sent from embedded portal is available to lenders (GetLawyerDealEvents)
    //TC-238727, 288315: LLC Embedded Portal - Lawyer Regular and Standard Notes are displaying in the Getlawyerdealevents- BNS
    it('TC-238761, 238727, 288322, 288315: Verify Lawyer note to Lender', function () {
        if  (loginRedirectURL) {
            //Verify GetLawyerDeal Events for RFF
            expect(LenderIntegrationBNS.VerifyDealEvent('REQUESTFORFUNDS')).toBe(true,'Deal event is not as expected');

            //Regression - Test case 230710: Verify notes sent from embedded portal is available to lenders (GetLawyerDealEvents)
            //Bug#230617 - GetLawyerDealEvents - Does not return the latest note [FIXED]
            expect(LenderIntegrationBNS.ReturnNoteSubject(1, 'AMENDMENTS')).toContain(TestData.data[Lang].Notes.StdNoteOption1, 'Note subject is not as expected.');
            expect(LenderIntegrationBNS.ReturnNoteDetails(1, 'AMENDMENTS')).toBe(TestData.data[Lang].Notes.StdNote1, 'Note details are not present.');

            expect(LenderIntegrationBNS.ReturnNoteSubject(2, 'AMENDMENTS')).toBe(BNSTestData.data[LangBNS].Notes.subjectNote, 'Note subject is not as expected.');
            expect(LenderIntegrationBNS.ReturnNoteDetails(2, 'AMENDMENTS')).toBe( BNSTestData.data[LangBNS].Notes.detailNote, 'Note details are not present.');
        }
        else {
            expect(true).toBe(false, "Unable to verify lawyer note to lender."); 
        } 
    })

    it('SendNote SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.SendBNSNote('1', 'STANDARD', 'NEW',  BNSTestData.data[LangBNS].Notes.LenderNoteSubject, BNSTestData.data[LangBNS].Notes.LenderNoteDetails);
        }
        else {
            expect(true).toBe(false, "Unable to send lender note."); 
        } 
    })

    //TC-288299: LLC Embedded Portal - Receive Lender Note -  Lender Note Received - Special Attention - Standard Note
    //TC-238762, 288323: LLC Embedded Portal -   Receive Lender Note Functionality
    it('TC-238762, 288323, 288299: Verify Lender Note to Lawyer', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            //Regression - Test case 230711: Verify that Note sent by Lender is view able by Lawyer
            NotesPage.VerifyNotesHistoryTableSearch(BNSTestData.data[LangBNS].Notes.LenderNoteSubject, true);
            NotesPage.VerifyLenderNotesAreHighlighted(BNSTestData.data[LangBNS].Notes.LenderNoteSubject, true);
            browser.sleep(3000);
        }
        else {
            expect(true).toBe(false, "Unable to verify lender note."); 
        }
    })

    // UI & layout, different types, verify request submission, all page status post-request, Navigate away, request status on GetLawyerDealEvent soap service, deal history entry
    //TC-238933: LLC EmbeddedPortal - Lawyer sends cancellation request and Lender Cancels the deal
    //TC-247503: LLC Embedded Portal/ Navigate away functionality
    //TC-247488: LLC Embedded Portal/ Reason for cancelation drop down field values > Submit
    it('TC-238933, 247503, 247488: Request for cancellation', function () {
        if  (loginRedirectURL) {     
        //Navigate to Request cancellation page, verify layout
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifyRFCPage();
        RequestCancellation.VerifyReqCancellationSection();

        //Submit request cancellation without selecting option, Verify validation
        RequestCancellation.SubmitCancellationDynamic();
        RequestCancellation.VerifyMissinfieldMessag();

        //TC-247503: LLC Embedded Portal/ Navigate away functionality
        RequestCancellation.SelectReasonType(TestData.data[Lang].RequestForCancellation.CancelReasonOption1);
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('Cancel');
        RequestCancellation.NavigateAway();
        RequestCancellation.NavigateAwayAcceptReject('OK');
        browser.sleep(1000);
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
        //TC-247504: LLC Embedded Portal/ Request Cancellation informative message > Tab not accessible
        RequestCancellation.VerificationPostCancellation();
        }
        else 
        {
            expect(true).toBe(false, "Unable to verify Request for cancellation."); 
        }
       
    })

    it('GetTransactionData REST service', function () {
        if  (loginRedirectURL) {
            LawyerIntegrationCommon.GetTransactionStatus(BNSFctUrn);
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
       
    })

    //Verify the tab "Request Cancellation" is displayed as read only for deal statuses "Completed" or "Request cancellation" or a Milestone status of "Final Report Submitted"
    it('TC-247504: Request Cancellation State', function () {
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

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
    })

    //TC-247509: LLC Embedded Portal/ Submitted Request Cancellation Deal History entry
    it('TC-247509: Request Cancellation State - Getlawyerdealevent, DH', function () {
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

    //TC-238933: LLC EmbeddedPortal - Lawyer sends cancellation request and Lender Cancels the deal
    it('TC-238933: SendDealStatusChangeRequest- Cancelling deal', function () {
        if  (loginRedirectURL) {
          //Lender cancels deal
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusCancel, TestData.data[Lang].WebService.DealStatusChangeReasonCancel);
        }
        else {
            expect(true).toBe(false, "Unable to Cancel deal"); 
        } 
        
    })

    //Lender cancels deal while user is logged in
    //TC-238932: LLC EmbeddedPortal - Lender cancels the deal while user is in Embedded 
    it('TC-238932: Cancel Deal ', function () {
        if  (loginRedirectURL) {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
            HomePage.VerifySaveButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
            RFFPage.VerifyComment('Disabled');
            RFFPage.VerifySubmitButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
            FinalReportPage.VerifyallButtonStatus('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
            NotesPage.VerifyNewNoteButtonStatus('Disabled');
            NotesPage.VerifyPrintButtonStatus('Disabled');

            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            RequestCancellation.VerifyCancelledDealMsg(TestData.data[Lang].Messages.CancelledDealMsg);
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender, TestData.data[Lang].DealHistory.ActivityDealCancelled);
        }
        else {
                expect(true).toBe(false, "Unable to verify UI after deal is Cancelled"); 
        }   
    })

    it('SendDealStatusChangeRequest - Re-instating deal', function () {
        if  (loginRedirectURL) {
            //Lender cancels deal
            LenderIntegrationBNS.SendDealStatusChange(TestData.data[Lang].WebService.DealStatusReinstate, TestData.data[Lang].WebService.DealStatusChangeReasonReinstate);
            //browser.sleep(5000);
          }
          else {
              expect(true).toBe(false, "Unable to Reinstate deal"); 
          }  
    })

    //Verify deal status after Lender Reinstates
    it('Verify Deal Status after lender reinstates the deal', function () {
        if  (loginRedirectURL) {
            LawyerIntegrationCommon.VerifyTransactionStatusTillSuccess(BNSFctUrn, 'ACTIVE');
        }
        else{
            expect(false).toBe(true, "Error occured while checking deal status.");
        }
    })

    //Lender reinstates deal while user is logged in, Verify all tabs
    it('Reinstate Deal', function () {
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
    it('SendUpdateTransactionData', function () {
        if  (loginRedirectURL) {
            var ClosingDate = CustomLibrary.CurrentOrPastDate();
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,instrumentNo,CustomLibrary.CurrentOrPastDate(),null,null, "IDVType",null,null,null);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to update deal."); 
        } 
    })

    //BNS Final Report UI & layout, Navigate away, Save create & submit final report, verify milestone status, GetLawyerDealEvent - verify document, Verify deal history
    //TC-245482:LLC Embedded Portal/ Save Final Report
    //TC-245483: LLC Embedded Portal/ Create/ Re-Create SROT Document
    //TC-245484: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
    //TC-245488:LLC Embedded Portal/ Milestone is updated and displayed with Green circle
    //TC-245489: LLC Embedded Portal/ Navigate away functionality
    it('TC-245482, 245483, 245484, 245488, 245489:Final Report ', function () {
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

            //TC-245489: LLC Embedded Portal/ Navigate away functionality
            FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReportPage.NavigateAway();
            FinalReportPage.VerifyNavigateAway();
            FinalReportPage.NavigateAwayAcceptReject('Cancel');
            FinalReportPage.NavigateAway();
            FinalReportPage.NavigateAwayAcceptReject('OK');
            browser.sleep(1500);
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');

            //TC-245482:LLC Embedded Portal/ Save Final Report
            FinalReportPage.EnterRegNumber(CustomLibrary.getRandomNumber(25));
            FinalReportPage.CommentonFinalReport('This is an automated comment on final report page');
            FinalReportPage.SelectDocLanguage('English');
            FinalReportPage.ClickFRButton('btnSave');
            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.SaveSuccessMsg);

            //Verify milestone status 'In Progress'
            FinalReportPage.VerifyFRCheckmarkStatus('In Progress');

            //Create final report
            FinalReportPage.ClickFRButton('btnCreate');

            //CustomLibrary.ClosePopup();
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
        
                    //TC-245483: LLC Embedded Portal/ Create/ Re-Create SROT Document
                    //Submit final report
                    FinalReportPage.ClickFRButton('btnSubmit');
                    FinalReportPage.SubmitFR();
                    FinalReportPage.VerifyMessage(TestData.data[Lang].Messages.FRSubmitSuccessMsg);
                    //TC-245488:LLC Embedded Portal/ Milestone is updated and displayed with Green circle
                    FinalReportPage.VerifyFRCheckmarkStatus('Complete');
                    FinalReportPage.VerifyallButtonStatus('PartiallyEnabled');
        
                    //TC-245484: LLC Embedded Portal/ Create and Submit SROT - Verify Deal History entry is created
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityFRSubmitted, true);
                    //DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityFRSubmitted);
        
                    //Verify RFF disabled
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

    //TC-288946: LLC EmbeddedPortal - Verify Deal completed by Lender and user in Embedded Portal - BNS
    it('TC-288946: Verify user is able to login again in embedded portal after final report is completed', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if  (loginRedirectURL) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                     
            }
            else {
                expect(true).not.toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                
            }
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL && IsFinalReportCreated ) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get deal events."); 
        } 
      
    })

    it('Get DocumentID and DocumentType from GetLawyerDealEvents SOAP service', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
            DocumentID = LenderIntegrationBNS.ReturnDocumentID('DOCUMENTS');
            DocumentType = LenderIntegrationBNS.ReturnDocumentType('DOCUMENTS');
            expect(DocumentID).not.toBe(null, 'GetLawyerDealEvents service timed out!!!');
            console.log("DocumentID = " + DocumentID);
            expect(DocumentType).not.toBe(null, 'GetLawyerDealEvents service timed out!!!');
            console.log("DocumentType = " + DocumentType);
        }
        else {
            expect(true).toBe(false, "Unable to get DocumentID."); 
        } 
      
    })

    //TC-247512: Get Final Report document using lender service
    it('TC-247512: Get Final Report document using lender service', function () {
    
        if  (loginRedirectURL  && IsFinalReportCreated) {
            
            LenderIntegrationBNS.GetDocument(DocumentID, DocumentType, lenderReferenceNumber);
        }
        else {
            expect(true).toBe(false, "Unable to get Final report Document."); 
        } 
         

    })

    it('Verify final report document in GetLawyerDealEvents', function () {
        if  (loginRedirectURL  && IsFinalReportCreated) {
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
        if  (loginRedirectURL  && IsFinalReportCreated) {
            //Lender closes deal        
            LenderIntegrationBNS.SendDealStatusChange( TestData.data[Lang].WebService.DealStatusClose, TestData.data[Lang].WebService.DealStatusChangeReasonClose);
         }
         else {
             expect(true).toBe(false, "Unable to SendDealStatusChangeRequest"); 
         } 
    })

    // Lender closes deal while user is logged in, Verify all tabs
    //TC-303944: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is Completed/Closed  -  BNS
    //TC-248117: LLC Embedded Portal- Lender Close Deal- BNS
    //TC-247511: LLC Embedded Portal/  Verify the tab "Request Cancellation" is displayed as read only for deal statuses "Complete"
    it('TC-248117, 247511, 303944: Close Deal', function () {
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
            
            //TC-303944: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is Completed/Closed  -  BNS
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
    
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            RequestCancellation.VerifyClosedDealMsgBNS(TestData.data[Lang].Messages.ClosedDealMsg);
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityDealClosed, true);
            //DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender,  TestData.data[Lang].DealHistory.ActivityDealClosed);
         }
         else {
             expect(true).toBe(false, "Unable to verify tabs when deal is closed."); 
         }
    })

    //TC-288947: LLC EmbeddedPortal - Verify Lender Portal for close status - BNS
    //TC-288963: LLC EmbeddedPortal - Verify Lender Portal for Lawyer deal Information including - BNS
    it('TC-288947, 288963: Lender Portal -Verify deal status', function () {
          
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                //login to Lender portal
                CustomLibrary.OpenNewTab();
               // CustomLibrary.SwitchTab(1);
               browser.sleep(1000);
               CustomLibrary.navigateToWindow("",2);
                LenderPortal.LoginToLenderPortalBNS( RunSettings.data.Global.LLC[Env].BNSLenderUser, RunSettings.data.Global.LLC[Env].BNSLenderPassword);
    
                //Search deal in lender portal
                
                LenderPortal.SearchDealBNS('Lender Ref #', lenderReferenceNumber);
                LenderPortal.VerifyTDDealStatus('Closed'); 
                //TC-288963: LLC EmbeddedPortal - Verify Lender Portal for Lawyer deal Information including - TD
                LenderPortal.NavigateToDocumentsTab();
                LenderPortal.uploadLenderDocBNS('Test');
                LenderPortal.NavigateToDealHistoryTabBNS();
                LenderPortal.VerifyHistoryTableEntry('Other-Test Document uploaded successfully.');
               // CustomLibrary.CloseTab();
                //CustomLibrary.SwitchTab(0);
                CustomLibrary.closeWindowUrlContains("LenderPortal");
                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            }
    })

        //TC-288948: LLC EmbeddedPortal - Verify Ops Portal for close status- BNS
    it('TC-288948: Verify Deal Status in Operations Portal', function () {
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null) ) {
                CustomLibrary.OpenNewTab();
                //CustomLibrary.SwitchTab(1);
                browser.sleep(1000);
                CustomLibrary.navigateToWindow("",2);
                OperationsPortal.LoginOperationsPortal();
                //Search deal in operations portal
                OperationsPortal.SearchDealBNS(BNSFctUrn).then(function(count){   
                    if(count > 0)
                    {
                        CustomLibrary.WaitForSpinnerInvisible();
                        OperationsPortal.ClickMilestinesAndStatus();
                        OperationsPortal.VerifyDealStatus("COMPLETED"); 
                    } 
                   // CustomLibrary.CloseTab();
                   // CustomLibrary.SwitchTab(0);
                    
                   });  
                   browser.sleep(500);
                   CustomLibrary.closeWindowUrlContains("OperationsPortal");
                   CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);          
            }
            else{
                expect(false).toBe(true, "Either deal is not created or is not available in operational portal.");
            }
    })

        //TC-288952: LLC EmbeddedPortal -Verify Read only status- BNS
    it('TC-288952: Verify UI is not accessible in Embedded Portal after deal lender closes the deal ', function () {
        if  (loginRedirectURL && IsFinalReportCreated) {     
            
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyClosedRequestMsg();
            HomePage.VerifySaveButtonStatus('Disabled');
                   
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifyClosedRequestMsg();
            RFFPage.VerifySubmitButtonStatus('Disabled');
                    
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyClosedRequestMsg();
            FinalReportPage.VerifyallButtonStatusFinalReport('Disabled');

            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyClosedRequestMsg();
            ManageDocuments.VerifyDisableBrowseButton();
                        
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyClosedRequestMsg();
            DealHistory.VerifyDealHistoryTableSearch('Other-Test Document uploaded successfully.', true);

            
        }
        else 
        {
            expect(true).toBe(false, "Unable to verify UI after lender cancels the deal."); 
        }
       
    })

    //TC-303913: LLC Embedded Portal -Lender Sends Standard Note -  Verify Email Notification - BNS
    it('TC- 303913: Email Verification', function () {
        if(loginRedirectURL)
        {   
             var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
             var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;
             OutlookPortal.LogintoOutlookNonAngular();                     
             var emailsubject = "New Note - " + firstName + " " + lastName ;
             OutlookInbox.WaitUntilsearchResultAppears(lenderReferenceNumber, emailsubject);
             OutlookInbox.OutlookLogOut();
           
            
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Verify Email.");
        }
    });

});

