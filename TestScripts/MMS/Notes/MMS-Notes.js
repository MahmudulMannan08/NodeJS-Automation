'use strict'

var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');

describe('LLC-MMS Notes Functionality', function () {
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var LenderDetails = RunSettings.data.Global.MMS[Env].Lender[0];
    var ThankYouPageFound ;
    var dealSendToLLC ;
    var Notesdata;
    var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;



    it('Create MMS DEal and Send to LLC', function () {       
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {  
        if(count > 0)
        {
            ThankYouPageFound = true;
            FCTURN = MMSPortral.GetCreatedFCTURN();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(2000);
            MMSCreateDeal.EnterStatusData(LenderDetails.Spec, LenderDetails.Name);
            MMSCreateDeal.EnterLenderdata(LenderDetails.Branch, LenderDetails.ContactName, LenderDetails.ONTARIO.ProgramType);
            MMSCreateDeal.EnterMortgagorData();
            MMSCreateDeal.EnterPopertyDataDynamic('ONTARIO')
            MMSCreateDeal.StatusMenuClick();
            MMSCreateDeal.getPropertyData();
            MMSCreateDeal.EnterLawyerData();
            MMSCreateDeal.SelectTrustAccount();
            MMSCreateDeal.EnterNewMortgageData(LenderDetails.MortgageProduct);
            MMSCreateDeal.EnterDocumentsData();
            MMSCreateDeal.sendDealtoLLC();
            MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
            
                if(count>0)
                {
                    dealSendToLLC = true;
                }
            });
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);
        }
        else{
            expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
        }}); 
    })

    it("Login To Operational Portal to Get Deal ID", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal();
            OperationsPortal.SerchDealDetails(FCTURN);
            OperationsPortal.GetDealID().then(function (id) {
                DealId = id;
            }); 
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Get Deal ID from Operational Portal");
        }
    })

    it("Accept Deal via Service", function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.AcceptRejectDeal(DealId, "ACTIVE");
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Accept the deal as deal is not Send to LLC");
        }
    })

    //TC-238732: LLC Embedded Portal -  Navigate Away Functionality on Notes Page
    it('TC-238732 :  Navigate Away and Send Note to Lender', function () {
        if(dealSendToLLC)
        {
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            browser.waitForAngular();
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.VerifyNotesPage();
            CustomLibrary.HandleAlert();
            NotesPage.ClickNotesButton("NewNote");
            NotesPage.VerifyMMSNewNoteFeilds();
            NotesPage.ClickNotesButton("Cancel");
            NotesPage.OnCancelClick();
            NotesPage.ClickNotesButton("NewNote");
            NotesPage.ClickNotesButton('SendNote');
            NotesPage.VerifyMissinfieldMessag();
            NotesPage.EnterNotesText("Test Automation-Verification of Notes");
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
            MenuPanel.PrimaryMenuNavigateTo('Notes');
            NotesPage.ClickNotesButton("NewNote");
            NotesPage.EnterNotesText("Test Automation-Verification of Notes");
            NotesPage.ClickNotesButton('SendNote');
            NotesPage.VerifyNotesHistory();
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
        }
    })

    //TC-238733: LLC EmbeddedPortal - Verify that Notes Send from LLC Unity is available on FCT MMS Portal
    it('TC-238733: MMS FCT Portal - Verify Note send by lawyer and send note to lawyer ', function () {
        if(dealSendToLLC)
        {
           
           MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2);
            MMSCreateDeal.SelectNotesData();
            MMSCreateDeal.checkuntilnotesappear("Test Automation-Verification of Notes");
            Notesdata = MMSCreateDeal.GetNotesData();
            MMSCreateDeal.VerifyLawyertoLenderNotes("Test Automation-Verification of Notes", Notesdata);
            MMSCreateDeal.EnterNotesData('This is a test note for validation');
            Notesdata = MMSCreateDeal.GetNotesData();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
        }
    })

    //TC-238734: LLC EmbeddedPortal - Verify that Note send by Lender is viewable by Lawyer
    it('TC-238734: Embedded Portal - Verify Note send by Lender ', function () {
        if(dealSendToLLC)
        {            
           
            LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.waituntilNotesappear("This is a test note for validation");
            NotesPage.GetNotesSubjectTimeStamp(Notesdata);
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
        }

               

    })

    //TC-288281: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Post a note
    it('TC- 288281: Email Verification', function () {
        if(dealSendToLLC)
        {   
            
             //TC-288281: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Post a note
             OutlookPortal.LogintoOutlookNonAngular();                     
             var emailsubject = "New Note - " + firstName + " " + lastName ;
             OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
             OutlookInbox.OutlookLogOut();
           
            
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Verify Email.");
        }
    });
})

