'use strict'
var TestData = require('../../../testData/TestData.js');
var RunSettings = require('../../../testData/RunSetting.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var NeedHelp = require('../../../PageObjectMethods/LLCUnityPortal/NeedHelp.js');
const ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');



describe('TC-239061: Deal flow for Lender as "Street Capital" when uploading COI through COI Button', function () {
    var Lang = TestData.data.LANGUAGE.value;
    var Env = RunSettings.data.Global.ENVIRONMENT.value;
    var LastNameLawyer = RunSettings.data.Global.URL_LLCEmulator[Env].LastNameLawyer.value
    var LawyerFirstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var LawyerFirm = RunSettings.data.Global.MMS[Env].LawyerDataLawFirm;
    var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
    var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;
    var LenderDetails =  RunSettings.data.Global.MMS[Env].Lender[0];
    var FCTURN
    var DealId
    var ClosingDate
    var ClientName
    var LenderRefNo
    var PropertyData
    var namelist = []
    var ThankYouPageFound ;
    var dealSendToLLC ;
    var isCOIIssued = false;
    var isRFFSubmitted = false;
    var AssessmentRollNumber = null;
    var legaldescription = null;
    var isUploaded = false;


    it('MMS Deal Flow-Deal Creation- PreFunding Questions through LLC Unity', function () {
        ThankYouPageFound = false;
        dealSendToLLC = false;
        ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
        LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
        ClientName = CustomLibrary.getRandomString(5);
        AssessmentRollNumber = RFFPage.ReturnAssessmentRollNo();
        legaldescription = CustomLibrary.getRandomString(10);
        MMSPortral.CreateMMSDeal(LenderDetails.Name, ClientName, LenderRefNo, ClosingDate);
        MMSPortral.VerifyThankYouPage().then(function (count) {
            if(count > 0)
            {
                ThankYouPageFound = true;
                FCTURN = MMSPortral.GetCreatedFCTURN();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               // CustomLibrary.SwitchTab(1);
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
               browser.sleep(500);
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
                    if(count>0)
                    {
                        dealSendToLLC = true;
                    }
                });
                //CustomLibrary.SwitchTab(0);
                //CustomLibrary.CloseTab(1);  
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(500);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            }
            else{
                expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
            }
        });  
    })

    it("Login To Operational Portal to Get ID, Accept Deal & Submit PIF", function () {
        if(dealSendToLLC)
        {
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);
            DealId = OperationsPortal.GetDealID();
            DealId.then(function (result) {
                LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                    if (data == 200) {

                        LawyerIntegrationCommon.UpdateTransactionData(result,null,AssessmentRollNumber,AssessmentRollNumber,"45636",null,null,null, null,legaldescription,null,null);
                        browser.sleep(3500);
                        //LawyerIntegrationMMS.getAndSetPreFundTransactionData(result, CustomLibrary.getRandomString(10), function (data) { });
                    }
                    else {
                        expect(data).toBe('200', "Unable to Accept the deal.");
                    }
                });
            });
           
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
            });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateTo('PreFundingInformation');
            CustomLibrary.WaitForSpinner();
            PreFundingInfomation.checkValueAvailable();
            PreFundingInfomation.AnswerPIFQuestionsAllProvinces('ONTARIO',1);
            PreFundingInfomation.SavePreFundInfo();
            PreFundingInfomation.VerifyMessage('Your changes have been saved successfully.');
            PreFundingInfomation.SubmitPreFundInfo();
            PreFundingInfomation.VerifyMessage(' Your changes have been submitted successfully.');
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('Pre-Funding Info has been submitted successfully.',true);
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
        }
    })

    it('HomePage Validations', function () {
        if(dealSendToLLC)
        {
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            browser.waitForAngular();
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
            HomePage.ClickNeedHelp();
            CustomLibrary.WaitForSpinnerInvisible();
            CustomLibrary.navigateToWindowWithUrlContains("contactus",2);
            //CustomLibrary.SwitchTab(1);
            browser.sleep(300);
           // CustomLibrary.SwitchTab(1);
            NeedHelp.VerifyNeedHelpPage();
            //CustomLibrary.CloseTab(1);
            //CustomLibrary.SwitchTab(0);
            CustomLibrary.closeWindowUrlContains("contactus");
            browser.sleep(500);
            CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('LLC deal has been accepted.',true);
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
        }
    })
   
    it('Verify Notes Page and Navigate Away Functionality', function () {
        if(dealSendToLLC)
        {
            MenuPanel.PrimaryMenuNavigateWithWait('Notes');
            NotesPage.ClickNotesButton("NewNote");
            NotesPage.EnterNotesText('test');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
        }
    })
    
    // TC-288330: LLC Embedded Portal/ Field identifier and Required fields message is displayed
    // TC-288333: LLC EmbeddedPortal - Warning message is displayed on RFF Resubmission > User selects OK
    // TC-288334: LLC EmbeddedPortal - Warning message is displayed on RFF Resubmission > User selects Cancel
    // TC-288335: LLC EmbeddedPortal - RFF Milestone is updated and displayed with Green circle
    // TC-288342: LLC EmbeddedPortal - Verify Navigate Away functionality on "RFF" page     
    //TC-238953:  LLC Embedded Portal/ Save Request for Funds MMS
    //TC-238946: LLC Embedded Portal/ Submit Request for Funds MMS
    it('TC-238953, 329736, 238946, 288330, 288333, 288334, 288335, 288342 : Request for Fund', function () {
        if(dealSendToLLC)
        {
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.ClickRFFButtons('Save');
            HomePage.VerifyMessage('Your changes have been saved successfully.');

            // TC-288330: LLC Embedded Portal/ Field identifier and Required fields message is displayed
            // TC-329736: 11.5 Standardize portal messages to reference partner instead of Unity - Field(s) to be completed in Unity VM- MMS
            RFFPage.VerifyRFFValidationMsg();
            
            // TC-288342: LLC EmbeddedPortal - Verify Navigate Away functionality on "RFF" page     
            RFFPage.EnterRequestedAmount(1000);
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('Cancel');
            MenuPanel.PrimaryMenuNavigateTo('Home');
            HomePage.NavigateAwayAcceptReject('OK');
           
            MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
            RFFPage.VerifySubmitButtonStatus('Disabled');
            RFFPage.EnterRequestedAmount(1000);
            RFFPage.ClickRFFButtons('Create');
            CustomLibrary.WaitForSpinnerInvisible();
            RFFPage.VerifyRFFDocumentIsCreated().then(function(result)
            {
                isRFFSubmitted = result;
                if(result)
                {
                   // CustomLibrary.ClosePopup();
                   CustomLibrary.WaitForSpinnerInvisible();
                   browser.sleep(200);
                   CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                   browser.sleep(500);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifyConfirmationMessage('Request for Funds was created successfully.');
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.VerifyConfirmationMessage('Request for Funds has been submitted successfully.');
                    
                    // TC-288335: LLC EmbeddedPortal - RFF Milestone is updated and displayed with Green circle
                    RFFPage.VerifyRFFCheckmarkPostSubmission();
                    
                    // TC-288334: LLC EmbeddedPortal - Warning message is displayed on RFF Resubmission > User selects Cancel
                    RFFPage.VerifySubmitButtonStatus('Disabled');
                    RFFPage.ClickRFFButtons('Create');
                    
                    RFFPage.VerifyWarningMessage(TestData.data[Lang].DealHistory[Env].WarningMessage);
                    RFFPage.ClickRFFButtons('Cancel');
        
                    // TC-288333: LLC EmbeddedPortal - Warning message is displayed on RFF Resubmission > User selects OK
                    RFFPage.ClickRFFButtons('Create');
                    RFFPage.VerifyWarningMessage(TestData.data[Lang].DealHistory[Env].WarningMessage);
                    RFFPage.ClickRFFButtons('OK');
                    //CustomLibrary.ClosePopup();
                    CustomLibrary.WaitForSpinnerInvisible();
                    browser.sleep(200);
                    CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                    CustomLibrary.closeWindowUrlContains("pdfDocuments");
                    CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                    RFFPage.VerifySubmitButtonStatus('Enabled');
                    RFFPage.ClickRFFButtons('Submit');
                    RFFPage.ClickRFFButtons('OK');
                    RFFPage.VerifyConfirmationMessage('Request for Funds has been submitted successfully.');
                    RFFPage.VerifyRFFCheckmarkPostSubmission();
                    RFFPage.VerifySubmitButtonStatus('Disabled');

                }              
            })

            }
        else
        {
            expect(dealSendToLLC).toBe(true, "Unable to Verify RFF and Navigate Away Functionality");
        }

        

    }), 

    // TC-288337: LLC Embedded Portal/ Create/ Re-Create Request for Funds Document 
    // TC- 288331: LLC EmbeddedPortal - Re-submission of RFF
    it('TC: 288337, 288331- Check Lawyer events after Request for funds submission', function () {

        if (dealSendToLLC) {

            if(isRFFSubmitted)
            {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.WaitForLawyerEvents();
                MMSCreateDeal.SelectNotesData();
                MMSCreateDeal.ClickLLCLAwyerTab();
                MMSCreateDeal.WaitForRFFDeclineButton();
                // Lender declines the Lawyer's RFF request
                MMSCreateDeal.SubmitLenderDeclineRFF();
                MMSCreateDeal.ClickLenderActionContinueRFF();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(500);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                MenuPanel.PrimaryMenuNavigateWithWait('Home');

                // Verify Lender declined entry in deal history
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                DealHistory.WaitUntilDealHistoryEntry('The Lender has declined');  
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].LenderDeclinesRFF,true);
               
                // Verify RFF Milestone is in In-Progress state after lender declines RFF
                MenuPanel.PrimaryMenuNavigateWithWait('Home');
                RFFPage.VerifyRFFCheckmarkInProgress();

                // TC-288337: LLC Embedded Portal/ Create/ Re-Create Request for Funds Document 
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                RFFPage.EnterRequestedAmount(1500);
                RFFPage.ClickRFFButtons('Create');
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.ClickRFFButtons('OK');
               // CustomLibrary.ClosePopup();
                CustomLibrary.WaitForSpinnerInvisible();
                browser.sleep(200);
                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                 CustomLibrary.closeWindowUrlContains("pdfDocuments");
                 CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                RFFPage.VerifyConfirmationMessage('Request for Funds was created successfully.');
                RFFPage.EnterRequestedAmount(2000);
                RFFPage.ClickRFFButtons('Create');
                RFFPage.ClickRFFButtons('OK');
               // CustomLibrary.ClosePopup();
               CustomLibrary.WaitForSpinnerInvisible();
                browser.sleep(200);
                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                 CustomLibrary.closeWindowUrlContains("pdfDocuments");
                 CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                RFFPage.ClickRFFButtons('Submit');
                RFFPage.ClickRFFButtons('OK');
                MenuPanel.PrimaryMenuNavigateTo('ManageDocuments');
                CustomLibrary.WaitForSpinnerInvisible();
                HomePage.checkTimeStamp('Request for Funds');
                ManageDocuments.VerifyStatusViewDoc('Request for Funds','Submitted');
                //HomePage.clickLawyerDocView('Request for Funds');
                //CustomLibrary.WaitForSpinnerInvisible();
               // CustomLibrary.CloseTab(1);

               
            }
            else
            {
                
                expect(isRFFSubmitted).toBe(true, "Unable to Check Lawyer events after Request for funds submission as RFF is not submitted.");
            }

                
        }  else{
            expect(dealSendToLLC).toBe(true, "Unable to Check Lawyer events after Request for funds submission as deal is not sent to LLC.");
        }

    });

    // TC- 288338: LLC EmbeddedPortal - Create and Submit RFF - Verify Deal History entry is created
    it('TC: 288338- LLC EmbeddedPortal - Create and Submit RFF - Verify Deal History entry is created', function () {
        if(dealSendToLLC) {

            if(isRFFSubmitted)
            {  
                LawyerIntegrationCommon.LoginViaRedirectURL(DealId, 'LLCDEAL');
                CustomLibrary.WaitForSpinnerInvisible();
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                //Request for fund created entry             
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFCreate,true);
                //Request for fund submitted entry         
                DealHistory.VerifyDealHistoryTableSearch(TestData.data[Lang].DealHistory[Env].RFFSubmitted,true);

            }
            else
            {              
                expect(isRFFSubmitted).toBe(true, "Unable to Check Lawyer events after Request for funds submission as RFF is not submitted.");
            }
            
          

        }
        else {
            expect(true).toBe(false, "Unable to verify deal history..");  
        }    
       
    });

    it('Publishing a document', function () {
        if(dealSendToLLC)
            {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
               // CustomLibrary.SwitchTab(1);     
               CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
               browser.sleep(500);                   
                MMSCreateDeal.EnterDocumentsDataForPublish();
                MMSCreateDeal.VerifyDocumentTableEntry('Adjustable Rate Schedule').then(function(count)
                {                 
                 if(count>0)
                 {
                    MMSCreateDeal.AllDocSelectCheckboxForPublish();
                    MMSCreateDeal.DocumentPublishandNotify();
                }  
                else {
                    expect(isUploaded).toBe(true, "Document is not present in the document grid!");
                }                

                })  
                   CustomLibrary.closeWindowUrlContains("DealDetails");
                   browser.sleep(500);
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                   browser.sleep(500);
    }
            else {
                expect(true).toBe(false, "Deal is not sent to LLC. Unable to publish the document.");
            }                          
    });

    it('MileStones-Broker Condition and Solicitor Condition', function () {
        if(dealSendToLLC)
        {
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);  
            MMSCreateDeal.checkLawyerAcceptedStatus();
            MMSCreateDeal.VerifyLawyerAcceptedStatus();
            MMSCreateDeal.ClickonViewPolicyHistory();
            MMSCreateDeal.VerifyPolicyHistoryTableSearch('The deal has been Accepted by the lawyer.',true);
            MMSCreateDeal.EnterChkBrokerConditions();
            MMSCreateDeal.EnterInstructionsforFunding();
            MMSCreateDeal.EnterChkSolictitorConditions();
            MMSCreateDeal.ClickonViewPolicyHistory();
            MMSCreateDeal.VerifyPolicyHistoryTableSearch('Broker Conditions Satisfied has been selected',true);
            MMSCreateDeal.VerifyPolicyHistoryTableSearch('Solicitor Conditions Satisfied has been selected',true);
            MMSCreateDeal.VerifyPolicyHistoryTableSearch('All underwriting questions are answered.',true);
            CustomLibrary.closeWindowUrlContains("DealDetails");
            browser.sleep(500);
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(500);
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones-Broker Condition and Solicitor Condition.");
        }
    })

    it('Lender Authorisation to Fund and Deal Funded Mile Stone', function () {
        if(dealSendToLLC)
        {
           MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
           CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
           browser.sleep(500);  
            MMSCreateDeal.StatusMenuClick();
            MMSCreateDeal.IssueCOIPatch();
            MMSCreateDeal.VerifyCOIIsIssued().then(function (IsCOIIssued) {
            if(IsCOIIssued)
            {
                isCOIIssued = true;
                MMSCreateDeal.ClickFundingLeftMenu();
                MMSCreateDeal.EnterFundingData();
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
                browser.sleep(2000);
                CustomLibrary.navigateToWindowWithUrlContains("SignOn",1)
                browser.sleep(500);
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                browser.sleep(500); 
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);
                MMSCreateDeal.EnterPreFundLawyerData(ClosingDate, ClosingDate);
                MMSCreateDeal.StatusMenuClick();
            }
            browser.sleep(500);
            CustomLibrary.closeWindowUrlContains("DealDetails");
            browser.sleep(500);
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
            browser.sleep(1000);
        });           
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones - Lender Authorisation and Deal Funding");
        }
    });


    // TC- 288367,288429, 288430, 288431, 288433, 288435, 288436, 329740
    it('TC- 328137, 288367,288429, 288430, 288431, 288433, 288435, 288436, 329740- MileStone-Final Report', function () {
      
       if(dealSendToLLC && isCOIIssued)
        {
        
            DealId.then(function (result) {
                LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                
           });
            browser.waitForAngular();
            MenuPanel.PrimaryMenuNavigateWithWait('Home');
            CustomLibrary.WaitForSpinnerInvisible();
            HomePage.waitforDealFundedCheck();
            HomePage.VerifyMMSBrokerConditionMet();
            HomePage.VerifyMMSSolicitorConditionMet();
            HomePage.VerifyMMSLenderAuthorisation();
            HomePage.VerifyMMSDealFunded();
            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
            DealHistory.VerifyDealHistoryTableSearch('"Deal Funded" has been selected.',true);
            HomePage.getDealFundedStatus().then(function (dealFundedStatus) {
                if (dealFundedStatus == true) {
                    MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                    browser.waitForAngular();
                    // TC-288367: LLC EmbeddedPortal -  Submit Confirm Close
                    FinalReport.EnterFinalReportData();
                    // TC-288429: LLC EmbeddedPortal - Field identifier & Required field validation message 
                    // TC-329740: 11.5 Standardize portal messages to reference partner instead of Unity - Field(s) to be completed in Unity VM- MMS
                    // TC-328137, 328140: 11.2.6 MMS Final Report - Replace the static message “Field(s) to be completed in Unity” with “Field(s) to be completed in your Source system”- ON
                    FinalReport.VerifyFRValidationMsg();
                    DealId.then(function (result) {
                        //LawyerIntegrationMMS.getAndSetTransactionData(result, CustomLibrary.getRandomNumber(5), CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()));
                        //browser.sleep(40000);
                       
                        LawyerIntegrationCommon.UpdateTransactionData(result,CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()),AssessmentRollNumber,AssessmentRollNumber,"45636",CustomLibrary.CurrentOrPastDate(),null,null, null,legaldescription,null,null);
                        browser.sleep(3500);
                 
                });  
                    FinalReport.checkRegistrationDetailEntries();  

                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    DealHistory.VerifyDealHistoryTableSearch('Confirm Closing’ has been submitted.',true);  
                    // TC- 288430: LLC EmbeddedPortal - Save Final Report
                    MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReport.ClickFRButtons('Save');
                    HomePage.VerifyMessage('Your changes have been saved successfully.');
                    MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    FinalReport.EnterRegistrationDetails();
                    MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.NavigateAwayAcceptReject('Cancel');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateTo('RequestForFunds');
                    CustomLibrary.WaitForSpinnerInvisible();
                    HomePage.NavigateAwayAcceptReject('OK');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                    browser.waitForAngular();
                    CustomLibrary.WaitForSpinnerInvisible();
                    // TC- 288435: LLC EmbeddedPortal - Warning message is displayed on Resubmission > User selects Cancel
                    FinalReport.EnterRegistrationDetails();
                    FinalReport.ClickFRButton('btnCreate');
                    //FinalReport.ClickFRButtons('OK');
                    CustomLibrary.WaitForSpinnerInvisible(); 
                    FinalReport.VerifyFinalReportIsCreated().then(function(result)
                    {
                        console.log("Value is " + result);
                        if(result)
                        {
                            //CustomLibrary.ClosePopup();
                            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                            browser.sleep(2000);
                             CustomLibrary.closeWindowUrlContains("pdfDocuments");
                             browser.sleep(2000);
                             CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                             browser.sleep(2000);
                            FinalReport.ClickFRButton('btnCreate');
                            FinalReport.VerifyWarningMessage(TestData.data[Lang].DealHistory[Env].FRWarningMessage);
                            FinalReport.ClickFRButtons('Cancel');
                            // TC- 288436: LLC EmbeddedPortal - Warning message is displayed on Resubmission > User selects OK
                            FinalReport.ClickFRButtons('Create');
                            FinalReport.VerifyWarningMessage(TestData.data[Lang].DealHistory[Env].FRWarningMessage);
                            FinalReport.ClickFRButtons('OK');
                           // CustomLibrary.ClosePopup();
                           browser.sleep(2000);
                           CustomLibrary.WaitForSpinnerInvisible();
                           CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                           browser.sleep(2000);
                           CustomLibrary.closeWindowUrlContains("pdfDocuments");
                           browser.sleep(2000);
                           CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                           browser.sleep(2000);
                            FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSCreateSuccessMsg);
                            FinalReport.FinalReportSubmit();
                            FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSSubmitSuccessMsg);
                            CustomLibrary.WaitForSpinnerInvisible();
                            MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                            DealHistory.VerifyDealHistoryTableSearch('Document Solicitor\'s Report on Title has been submitted successfully.',true);         
                            // TC- 288433: LLC EmbeddedPortal - Milestone is updated and displayed with Green circle
                            MenuPanel.PrimaryMenuNavigateTo('Home');
                            HomePage.VerifyMMSFinalReportMet();
                            // TC- 288431: LLC EmbeddedPortal - Create/ Re-Create SROT Document
                            MenuPanel.PrimaryMenuNavigateTo('ManageDocuments');
                            CustomLibrary.WaitForSpinnerInvisible();
                            HomePage.checkTimeStamp('Solicitor\'s Report on Title');
                           // ManageDocuments.VerifyStatusViewDoc('Solicitor\'s Report on Title','Submitted');
                            HomePage.clickLawyerDocView('Solicitor\'s Report on Title');
                            CustomLibrary.WaitForSpinnerInvisible();
                            CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                            browser.sleep(2000);
                           CustomLibrary.closeWindowUrlContains("pdfDocuments");
                           browser.sleep(2000);
                           CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                           browser.sleep(2000);
                           // CustomLibrary.CloseTab(1);
                            //TC-303950: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When  Final Report has been submitted -  MMS
                            MenuPanel.PrimaryMenuNavigateTo('Home');
                            MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');                           
                           
                        
                        }  
                    })
                     
                }
                else {
                    expect(false).toBe(true,"Unable to Submit Final Report test as Deal Funded Milestone failed.");
                }
            })
        }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Submit Final Report as deal is not sent to LLC.");
            expect(isCOIIssued).toBe(true, "Unable to Submit Final Report as COI is not generated for the deal.");
        } 
    });

    // TC- 288367,288429, 288430, 288431, 288433, 288435, 288436
    
    it('TC- 238540, 238667, 238664, 238662, 238666, 288278, 288926, ,288284, 288287, 288289, 288291, 288293, 288294 : Email Verification', function () {
        if(dealSendToLLC)
        {   
            
            //TC-238540, 288278: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - New Deal
            OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "New Deal - " + RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName + " - " + ClientName + namelist[1] + " - " + LenderRefNo;
            OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
            OutlookInbox.OutlookLogOut();

            //TC-288926, 288284: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Request for funds declined by lender/ Reject RFF
            OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "Request for Funds Declined - " + RunSettings.data.Global.LawyerDetails[Env].firstName + " " + RunSettings.data.Global.LawyerDetails[Env].lastName + " - " + ClientName + namelist[1] + " - " + LenderRefNo;
            OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
            OutlookInbox.OutlookLogOut();

            // TC-288287: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Publising a document
            OutlookPortal.LogintoOutlookNonAngular();                      
            var emailsubject = "New Document(s) Posted for " + lastName + ", " + firstName;
            OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
            OutlookInbox.OutlookLogOut(); 

            //TC-238664, 288291: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Solicitor Conditions Satisfied
            OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "Solicitor Conditions Satisfied - " + firstName + ", " + lastName;
            OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
            OutlookInbox.OutlookLogOut();            
          
           
            //TC-238667, 288294 -LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Deal Funded
            OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "Deal Funded - " + firstName + ", " + lastName;
            OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
            OutlookInbox.OutlookLogOut();

            //TC-238662, 288289: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Broker Conditions Satisfied
            OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "Broker Conditions Satisfied - " + firstName + ", " + lastName;
            OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
            OutlookInbox.OutlookLogOut();

            /* Lender Authorization to Fund email is inactive in Pre-Prod and Prod*/
            //Tc-238666, 288293: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Lender Authorization to Fund Satisfied
             /*   OutlookPortal.LogintoOutlookNonAngular();
            var emailsubject = "Lender Authorization to Fund - " + firstName + ", " + lastName;
            OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
            OutlookInbox.OutlookLogOut();  */
           }
        else{
            expect(dealSendToLLC).toBe(true, "Unable to Verify Email.");
        }
    });

    it('File Closed functionality', function () {
        if(isCOIIssued)
        {                   
            MMSPortral.loginMMSPortal();
            MMSPortral.ClickOnEditViewdeals();
            MMSCreateDeal.SearchbyFCTURN(FCTURN);
            //CustomLibrary.SwitchTab(1);
            CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
            browser.sleep(3000);
            MMSCreateDeal.ClickOnLawyerTab();
            browser.waitForAngular();
            MMSCreateDeal.FillClickCheckReportCompleted();
            MMSCreateDeal.StatusMenuClick();
            MMSPortral.ClickOnCloseButton();
            CustomLibrary.closeWindowUrlContains("DealDetails");
            CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
        }
        else{
            expect(isCOIIssued).toBe(true, "Unable to Close File as COI is not generated for the deal.");
        }
    })

    it('Operational Portal - Verify Deal Status', function () {
        if(isCOIIssued)
        {      
            OperationsPortal.LoginOperationsPortal(FCTURN);
            OperationsPortal.SerchDealDetails(FCTURN);             
            OperationsPortal.VerifyDealStatus('COMPLETED');
           // CustomLibrary.CloseTab(1);
        }
        else{
            expect(isCOIIssued).toBe(true, "Unable to verify deal status in Operational portal as deal is not closed.");
        }
    })

});
