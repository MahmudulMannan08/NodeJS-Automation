'use strict'
var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var BNSTestData = require('../../../testData/BNS/BNSTestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var ReqCancelPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LenderIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LenderIntegration/LenderIntegrationBNS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var LawyerIntegrationBNS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationBNS.js');
var ManageDocPage = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var RequestCancellation = require('../../../PageObjectMethods/LLCUnityPortal/RequestCancellation.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var dateFormat = require('dateformat');

var Env = RunSettings.data.Global.ENVIRONMENT.value;
var LangBNS = BNSTestData.data.LANGUAGE.value;

//TC-239110: LLC EmbeddedPortal - Lender Amendements / Shared & Lender Owned field/ Verify user do not get full access to Portal until the lender amendment is actioned
//TC-239109: LLC EmbeddedPortal - Lender sends an amendment while user is in UNITY
//TC-247670: LLC EmbeddedPortal - Deal appears in Read only when lender amendment is pending
describe('TC-239109, 239110, 247670- BNS lender amendments to lawyer', function () {
    var BNSFctUrn = null;
    var Lang = TestData.data.LANGUAGE.value;
    var FirstNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLender.value;
    var LastNameLender = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLender.value;
    var FirstNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].FirstNameLawyer.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value;
    var lenderReferenceNumber = null;
    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('Verify Home Page', function () {
        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('Lender amendment - Lender sends actionable and non actionable amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
                LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Oakville', 'ON', null);
            }
        else {
                expect(true).toBe(false, "Unable to send lender amendments.");              
            }  
    })

    //TC-239110: LLC EmbeddedPortal - Lender Amendements / Shared & Lender Owned field/ Verify user do not get full access to Portal until the lender amendment is actioned
   //TC-239109: LLC EmbeddedPortal - Lender sends an amendment while user is in UNITY
   //TC-247670: LLC EmbeddedPortal - Deal appears in Read only when lender amendment is pending
    it('TC-239109, 239110, 247670, 329713: Lender sends an amendment while user is logged in to emulator - Verify UI & message and Deal History activity', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {

            browser.wait(function () {
                return element(by.css('.loading-spinner')).isPresent().then(function (result) { return !result });
            }, 600000);

            //Verify deal history page and activity entry
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityLenderAmendment, true);
            
    
            //Verify homepage and button status
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            HomePage.VerifySaveButtonStatus('Disabled');
    
            //Verify manage document page and button statuses
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            ManageDocPage.VerifyLenderDocumentsView('Enabled');
            ManageDocPage.VerifyBrowseButtonStatus('Disabled');
            
            //TC:329713- 11.6 Standardize portal messages to reference partner instead of Unity - SROT and RFF tab-  BNS
            //Verify RFF page and button and comment statuses
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            RFFPage.VerifyComment('Disabled');
            RFFPage.VerifySubmitButtonStatus('Disabled');
    
            //TC:329713- 11.6 Standardize portal messages to reference partner instead of Unity - SROT and RFF tab-  BNS
            //Verify SROT page and button statuses
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            FinalReportPage.VerifyallButtonStatus('Disabled');
    
            //Verify Notes page and button status
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.VerifySavedChanges(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            //NotesPage.VerifyNewNoteButtonStatus('Enabled');  //Bug: Note page not available
    
            //Verify Request Cancellation menubutton status
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            ReqCancelPage.VerifySubmitButtonStatus('Enabled');
            ReqCancelPage.VerifyReasonDropDownStatus('Enabled');
        }
        else {
            expect(true).toBe(false, "Unable to Get Deal Events for the deal.");              
        } 
       
    })

    it('Verify user not able to login to emulator unless he acts on amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Verify user not able to login to emulator unless he acts on amendments
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null, "RedirectURL service should returns null.");
        }
        else {
            expect(true).toBe(false, "Unable to verify UI & message and Deal History activity after lender sends amendments.");              
        }    
    })

    it('GetLenderChanges Rest request - Get changes made by lender', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationBNS.GetLenderChanges(BNSFctUrn);
        }
        else {
            expect(true).toBe(false, "Unable to Get Lender Changes for the deal.");              
        }     
    })

    it('SendLenderChangesAcceptReject Rest request - Lawyer accepts lender amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            var LenderChangesArray = [0];
            LawyerIntegrationBNS.SendLenderChangesAcceptReject(LenderChangesArray, 'ACCEPT', BNSFctUrn);
        }
        else {
            expect(true).toBe(false, "Unable to accept lender amendments.");              
        }  
       
    })
    //TC-239112: Lender Amendements /Shared field/ Lawyer accepts the Amendment
    it('TC-239112, 288944: Verify user able to login, verify lender changes, verify deal history activity', function () {  
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            //Verify lender changes
            HomePage.VerifyLenderChanges('Oakville', 'ON');
            //Verify deal history activity
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityLawyerAcceptAmendment, true);

            //TC-288944: LLC EmbeddedPortal - BNS Lender Amendements / Shared & Lender Owned field/ Verify user gets full access to Portal after an amendment is actioned
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifySaveButtonStatus('Enabled');

            MenuPanel.VerifyMenuButtonStatus('RequestForFunds', 'Enabled');
              
            MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
            ManageDocuments.VerifyEnableBrowseButton();
        
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifySubmitButtonStatusFinalReport('Disabled');
            
        }
        else {
            expect(true).toBe(false, "Unable to Verify Lender Changes on UI.");              
        }  
    })

    //TC-239111: LLC EmbeddedPortal - Lender sends an amendment on Lender fields
    it('TC-239111, 307858: Lender amendment - Lender sends non actionable amendment', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {

            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', null, 'ON', 'Lilia');
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }
    })

    it('TC-239111: Verify user not able to login to embedded portal unless he acts on amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) { 
            //Verify homepage and button status
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            HomePage.VerifySaveButtonStatus('Disabled');

            //Verify Request Cancellation menubutton status
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            ReqCancelPage.VerifySubmitButtonStatus('Enabled');
            ReqCancelPage.VerifyReasonDropDownStatus('Enabled');

            //Verify deal history page and activity entry
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender, TestData.data[Lang].DealHistory.ActivityLenderAmendment);

            //Verify user not able to login to emulator unless he acts on amendments
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null);
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }   
    })

    it('GetLenderChanges Rest request - Get changes made by lender', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationBNS.GetLenderChanges(BNSFctUrn);
            //browser.sleep(10000);
        }
        else {
            expect(true).toBe(false, "Unable to Get Lender Changes for the deal.");              
        }   
    })

    it('SendLenderChangesAcceptReject Rest request - Lawyer acts on lender non actionable amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            var LenderChangesArray = []; 
            LawyerIntegrationBNS.SendLenderChangesAcceptReject(LenderChangesArray, 'ACCEPT', BNSFctUrn);
           // browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to accept lender amendments.");              
        }  
    })

    it('Verify user has to act even if amendments is on Lender field(non actionable), verify deal history activity', function () {
      
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            //Verify user able to login
            CustomLibrary.WaitForSpinnerInvisible();
            //HomePage.VerifyHomePage();

            //Verify lender changes
          // HomePage.VerifyLenderChanges(null, 'SK');

            //Verify deal history activity
            //CustomLibrary.WaitForSpinnerInvisible();
           /* browser.wait(function () {
                return element(by.css('.loading-spinner')).isPresent().then(function (result) { return !result });
            }, 15000);*/



            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityLenderAmendment, true);
            //DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender, TestData.data[Lang].DealHistory.ActivityLenderAmendment);
        }
        else {
    
                expect(true).toBe(false, "Unable to Verify Amendments..");              
            
        } 
        
    })

    it('TC-307861- LLC-Embedded Portal - Lawyer Amendment- A change is made to a field  that is only case/accent related', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {

            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', null, 'ON', 'LILIA');
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }
    })

    it('Verify user action is not required if there is change in the case/accent for any field', function () {
      
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            //Verify user able to login
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyMessageNotPresent(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            
        }
        else {
    
                expect(true).toBe(false, "Unable to Verify Amendments..");              
            
        } 
        
    })

    it('Lender amendment - Lender sends actionable amendment', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississauga', null, null);
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }     
    })

    it('Verify user not able to login to emulator unless he acts on amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Verify homepage and button status
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            HomePage.VerifySaveButtonStatus('Disabled');

            //Verify Request Cancellation menubutton status
            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
            MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            ReqCancelPage.VerifySubmitButtonStatus('Enabled');
            ReqCancelPage.VerifyReasonDropDownStatus('Enabled');

            //Verify deal history page and activity entry
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            HomePage.VerifyMessage(TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS);
            DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLender + ' ' + LastNameLender, TestData.data[Lang].DealHistory.ActivityLenderAmendment);

            //Verify user not able to login to emulator unless he acts on amendments
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null);
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }  
       
    })

    it('GetLenderChanges Rest request - Get changes made by lender', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationBNS.GetLenderChanges(BNSFctUrn);
          
        }
        else {
            expect(true).toBe(false, "Unable to Get Lender Changes for the deal.");              
        }  
    })

    //TC-307665- LLC-Embedded Portal -  Lender Amendment- Lender sends amendment and Lawyer is in Unity - Accept
    it('TC-307665: SendLenderChangesAcceptReject Rest request - Lawyer acts on lender actionable amendments', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            var LenderChangesArray = [0];
            LawyerIntegrationBNS.SendLenderChangesAcceptReject(LenderChangesArray, 'ACCEPT', BNSFctUrn);
            browser.sleep(3500);
        }
        else {
            expect(true).toBe(false, "Unable to accept lender amendments.");              
        }  
    })

    it('Verify user has to act if amendment is on shared field(actionable), verify deal history activity', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            //HomePage.VerifyHomePage();

            //Verify lender changes
            HomePage.VerifyLenderChanges('Mississauga', null);

            //Verify deal history activity
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityLawyerAcceptAmendment, true);
            //DealHistory.VerifyDealHistoryTableEntry(1, FirstNameLawyer + ' ' + LastNameLawyer, TestData.data[Lang].DealHistory.ActivityLawyerAcceptAmendment);
        }
        else {
            expect(true).toBe(false, "Unable to lender non actionable amendments.");              
        }  
    })

    it('Lender amendment - Lender sends excluded amendment', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', null, null, 'MortgageName');
        }
        else {
            expect(true).toBe(false, "Unable to send lender amendments.");              
        }  
    })

    it('Verify user not able to login to emulator', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
             //Verify user not able to login to emulator
            expect(LawyerIntegrationCommon.ReturnGetRedirectUrl(BNSFctUrn, 'LLCDEAL')).toBe(null);
        }
        else {
            expect(true).toBe(false, "Unable to verify user logged in to embedded portal or not.");              
        }  
       
    })


    
    it('Verify Lawyer recieves Lender Changes ', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            lenderReferenceNumber = LenderIntegrationBNS.ReturnLenderRefNo();
             OutlookPortal.LogintoOutlookNonAngular();
             //Verify Lawyer received new deal email
             OutlookInbox.VerifyEmailOutlook("Amendment(s)", lenderReferenceNumber);
             OutlookInbox.OutlookLogOut();
         }
         else {
             expect(true).toBe(false, "Unable to verify Reactivation email.");
         }
    })
})

describe('BNS lawyer amendments to lender', function () {

    var BNSFctUrn = null;
    var Lang = TestData.data.LANGUAGE.value;
    var AssessmentRollNumber = null;
    var InstrumentNumber = null;
    var RegistrationDate = null;
    var RegistryOffice = null;
    

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'true', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })
   
    it('Verify Home Page', function () {
        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.VerifyHomePage();
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    it('TC-239116: Lawyer amendments - Lawyer updates lawyer owned field', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Update lawyer owned fields - instrumentNumber, registrationDate, registryOffice
            var ClosingDate = LenderIntegrationBNS.ReturnClosingDate();
            InstrumentNumber = 'Reg.No.8734684';
            RegistrationDate = '2010-08-04';
             RegistryOffice = 'Halton';

            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,ClosingDate,AssessmentRollNumber,null,InstrumentNumber,RegistrationDate,RegistryOffice,null, "IDVType",null,null,null);

        }
        else {
            expect(true).toBe(false, "Unable to send Lawyer amendments.");              
        }    
    })

    //TC-239116: LLC EmbeddedPortal - Lawyer amendments/Lawyer Owned  Field/ No amendment trigerred for Lender
    it('TC-239116: Verify lawyer amendments on UI, Verify Submit to Lender menu is not enabled', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
             //Verify lawyer amendments on UI
            MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
            FinalReportPage.VerifyRegParticularsValue(InstrumentNumber, RegistrationDate, RegistryOffice);

            //Verify Submit to Lender menu is not enabled
            MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Disabled');
        }
        else {
            expect(true).toBe(false, "Unable to verify Lawyer amendments on UI.");              
        } 
      
    })

    it('Lawyer amendments - Lawyer updates shared field', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Update shared field - ClosingDate
            LawyerIntegrationCommon.UpdateTransactionData(BNSFctUrn,BNSTestData.data[LangBNS].Service.UpdatedClosingDate,AssessmentRollNumber,null,InstrumentNumber,RegistrationDate,RegistryOffice,null, "IDVType",null,null,null);
       }
       else {
           expect(true).toBe(false, "Unable to send Lawyer amendments on shared fields.");              
       } 
      
    })

    //TC-307661- LLC-Embedded Portal - Lawyer Pending Amendment  Lawyer Submits Amendments to Lender
    //TC-307657- LLC-Embedded Portal - Lawyer Pending Amendment to Lender- Display 'Submit to Lender' as hyperlink
    //TC-239115: LLC EmbeddedPortal - Lawyer amendments/Shared Field/ Lender accepts the amendment
    it('TC-239115, 307657, 307658, 307661: Verify deal history table entry, Verify Submit to Lender menu is enabled, Submit lawyer amendments, Verify Submit to Lender menu is disabled', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
           //Verify Submit to Lender menu is enabled
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Enabled');
            //TC-307657- LLC-Embedded Portal - Lawyer Pending Amendment to Lender- Display 'Submit to Lender' as hyperlink
            HomePage.ClickSubmitToLenderMsgLnk();

            //Submit lawyer amendments
            //TC-307658- LLC-Embedded Portal - Lawyer Pending Amendment to Lender- Display 'Submit to Lender' as hyperlink
            FinalReportPage.AcceptAmendmentIfAvailable();

            //Verify Submit to Lender menu is disabled
            MenuPanel.VerifyMenuButtonStatus('SubmitToLender', 'Disabled');

            //Verify deal history table entry
            //browser.sleep(1000);
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            var ClosingDate = LenderIntegrationBNS.ReturnClosingDate();
            DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory.ActivityLawyerAmendmentSubmit,true);
            DealHistory.VerifyDealHistoryTableSearch('Closing Date changed from: ' + ClosingDate + ' to: ' + BNSTestData.data[LangBNS].Service.UpdatedClosingDate,true);
           }
       else {
           expect(true).toBe(false, "Unable to verify submit to Lender Menu enabled.");              
       }         
    })

    it('GetLawyerDealEvents SOAP service', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LenderIntegrationBNS.GetBNSLawyerDealEvents();
        }
        else {
            expect(true).toBe(false, "Unable to get Lawyer deal events.");              
        }       
    })

    it('Verify GetLawyerDealEvents - Lender receives lawyer amendment notification', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            expect(LenderIntegrationBNS.VerifyDealEvent('AMENDMENTS')).toBe(true,"Amendments deal event is not available in GetLawyerDeal Event XML.");
            var formattedDate = dateFormat(LenderIntegrationBNS.ReturnLawyerAmendments('AMENDMENTS'), "UTC:yyyy-mm-dd");
            expect(formattedDate).toBe(BNSTestData.data[LangBNS].Service.UpdatedClosingDate);
        }
        else {
            expect(true).toBe(false, "Unable to verify Lawyer deal events.");              
        }  
    })
})

//TC-303931: LLC Embedded Portal- Request Cancellation-Enable Cancellation Requested when User accesses embedded portal with read-only access - There are lender changes that have not been actionned- BNS
//TC-288364: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Rejects the Amendment
describe('TC- 288364,303931: Lawyer Reject Lender Amendments', function () {
    var BNSFctUrn = null;
    var Lang = TestData.data.LANGUAGE.value;
    var loginRedirectURL = null;
    var ddReasonForCancellation = element(by.id('reasonCode'));
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    var LenderAmendmentMsg = TestData.data[Lang].Messages[Env].LenderAmendmentMsgMMS;

    afterAll(function () {
        LenderIntegrationBNS.CleanUpScript();  
        LawyerIntegrationBNS.CleanUpScript();
    });

    it('Generate BNS Deal - Create deal soap service', function () {
        LenderIntegrationBNS.CreateBNSDeal('false', 'false', TestData.data[Lang].WebService.Province);
    })

    it('Accept Deal using Lawyer Integration', function () {
        BNSFctUrn = LenderIntegrationBNS.ReturnFctUrn();
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //Accepting the deal
            LawyerIntegrationCommon.AcceptRejectDeal(BNSFctUrn, "ACTIVE");
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })

    //Verify Lawyer is able to login to Embedded Portal
    it('Verify Lawyer is able to login to Embedded Portal', function () {
        browser.ignoreSynchronization = true;
        if (BNSFctUrn) {
            loginRedirectURL = LawyerIntegrationCommon.LoginViaRedirectURLWithWait(BNSFctUrn, 'LLCDEAL');
            if ((typeof loginRedirectURL !== "undefined") && (loginRedirectURL !== null)) {
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark('LLC');
                               
            }
            else {
                expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
                }
            }
    })
 
    it('Lender updates property city', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            //IsSolicitorClose, IsRFF, CityUpdate, ProvinceUpdate, MortgageCentreFirstNam
            LenderIntegrationBNS.UpdateBNSDeal('false', 'true', 'Mississauga', null, null);
            //browser.sleep(3000);
        }
        else {
            expect(true).toBe(false, "Lender unable to update deal.");           
        }
    })

    //TC-307666- LLC-Embedded Portal -  Lender Amendment- Lender sends amendment and Lawyer is in Unity - read only access in embedded portal
    //TC-303931: LLC Embedded Portal- Request Cancellation-Enable Cancellation Requested when User accesses embedded portal with read-only access - There are lender changes that have not been actionned- BNS
    it('TC-329693, 303931, 307666, 288945, 307656, 307662: Verify all tabs are read only in Embedded Portal except Request Cancellation', function () {
           
    if(loginRedirectURL)      
     {
        CustomLibrary.WaitForSpinnerInvisible();
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        HomePage.VerifyDealAcceptedCheckMark('LLC');
        //TC-307662- LLC-Embedded Portal -  Lender Amendment- Lender sends amendment and Lawyer is in Embedded portal
        // TC-303931: Verify System displays all pages as read only except request cancellation page
        MenuPanel.PrimaryMenuNavigateWithWait('Request Cancellation');
        RequestCancellation.VerifySubmitButtonStatus('Enabled');
        expect(ddReasonForCancellation.isEnabled()).toBe(true,"Reason drop down is disabled");
        MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Enabled');
        
        // TC-303934: LLC Embedded Portal- Request Cancellation- Enable Cancellation Requested when User accesses embedded portal with read-only access - User has already requested cancellation- MMS
        MenuPanel.PrimaryMenuNavigateWithWait('Home');
        //TC-307656- LLC-Embedded Portal - Lawyer Amendment- Display Lender Amendment message in the Embedded Portal
        expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        HomePage.VerifySaveButtonStatus('Disabled');

        MenuPanel.VerifyMenuButtonStatus('RequestForFunds', 'Disabled');
              
        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
        expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        ManageDocuments.VerifyDisableBrowseButton();
        
        MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
        expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        FinalReportPage.VerifySubmitButtonStatusFinalReport('Disabled');

        //TC-288945- LLC EmbeddedPortal - BNS Lender sends an amendment while user is in UNITY and is able to send Notes
        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
        MenuPanel.PrimaryMenuNavigateWithWait('Notes');
        NotesPage.ClickNotesButton('NewNote');
        NotesPage.SelectStandardNoteType(TestData.data[Lang].Notes.StdNoteOption1);
        NotesPage.VerifyPopulatedSubjectTB(TestData.data[Lang].Notes.StdNoteOption1);
        NotesPage.VerifyPopulatedNoteTB(TestData.data[Lang].Notes.StdNote1);
        NotesPage.ClickNotesButton('SendNote');
        // NotesPage.VerifySavedChanges(TestData.data[Lang].Messages[Env].SaveSuccessMsg);
        //TC:329693- 11.4 Standardize portal messages to reference partner instead of Unity - BNS - New notes send- VM
        //Bug reported for this test case.
       NotesPage.VerifySavedChanges(TestData.data[Lang].Messages[Env].NoteMsg); 
        MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
        expect(StatusMsg.getText()).toContain(LenderAmendmentMsg, 'Amendment Message is not present');
    
   }
    else {
            expect(true).toBe(false, "GetRedirectURL service does not have redirect URL!!!");
         }
                
    })

    //TC:288364- LLC EmbeddedPortal - BNS Lender Amendements /Shared field/ Lawyer Rejects the Amendment
    it('TC-288364: Lawyer Rejects Lender Changes', function () {
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.getAndSendAcceptRejectAmendment(BNSFctUrn, 'REJECT');
            browser.sleep(8500);
        }
        else {
            expect(true).toBe(false, "Lawyer is not able to reject deal.");  
        } 
    })

    //TC-307857:  LLC-Embedded Portal -  Lender Amendment- Lender sends amendment to shared field - Lawyer  rejects
    //TC-239124: LLC EmbeddedPortal - Lender Amendements /Shared field/ Lawyer Rejects the Amendment
    it('TC-239124, 307857: Verify Declined Request in Deal History Tab', function () {
        browser.ignoreSynchronization = true;
        if ((typeof BNSFctUrn !== 'undefined') && (BNSFctUrn !== null) ) {
            LawyerIntegrationCommon.LoginViaRedirectURL(BNSFctUrn, 'LLCDEAL');
            CustomLibrary.WaitForSpinnerInvisible();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch("Lawyer/Notary has declined the changes to the Property City",true);
            DealHistory.VerifyDealHistoryTableSearch("An amendment has been sent by the Lender",true);
            
        }
        else {
            expect(true).not.toBe(false, "CreateBNSDeal service timed out!!!");
            
        }
    })


  
   
})
