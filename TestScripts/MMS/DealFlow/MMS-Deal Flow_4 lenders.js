'use strict'

var RunSettings = require('../../../testData/RunSetting.js');
var TestData = require('../../../testData/TestData.js');
var HomePage = require('../../../PageObjectMethods/LLCUnityPortal/HomePage.js');
var RFFPage = require('../../../PageObjectMethods/LLCUnityPortal/RequestFunds.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var CustomLibrary = require('../../../CustomLibrary/CustomLibrary.js');
var MenuPanel = require('../../../PageObjectMethods/LLCUnityPortal/MenuPanel.js');
var PreFundingInfomation = require('../../../PageObjectMethods/LLCUnityPortal/PreFundingInformation.js');
var ManageDocuments = require('../../../PageObjectMethods/LLCUnityPortal/ManageDocuments.js');
var LawyerIntegrationMMS = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationMMS.js');
var LawyerIntegrationCommon = require('../../../PageObjectMethods/LLCUnityPortal/Services/LawyerIntegration/LawyerIntegrationCommon.js');
var MMSPortral = require('../../../PageObjectMethods/MMS/MMSPortal.js');
var FinalReportPage = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var MMSCreateDeal = require('../../../PageObjectMethods/MMS/MMSCreateDeal.js');
var NotesPage = require('../../../PageObjectMethods/LLCUnityPortal/Notes.js');
var OutlookPortal = require('../../../PageObjectMethods/Outlook/Outlook.js');
var OutlookInbox = require('../../../PageObjectMethods/Outlook/OutlookInbox.js');
var OperationsPortal = require('../../../PageObjectMethods/OperationalPortal/OperationsPortal.js');
var DealHistory = require('../../../PageObjectMethods/LLCUnityPortal/DealHistory.js');
var FinalReport = require('../../../PageObjectMethods/LLCUnityPortal/FinalReport.js');
var Lang = TestData.data.LANGUAGE.value;
var Env = RunSettings.data.Global.ENVIRONMENT.value;
var FCTURN
var DealId
var ClosingDate
var ClientName
var LenderRefNo
var PropertyData
var namelist = [];
var ThankYouPageFound;
var dealSendToLLC;

describe('TC -239060, 239062,239063, 239064: MMS Deal Flow-All 4 Lenders', function () {
    var StatusMsg = element(by.css('.msg-container.ng-star-inserted'));
    function maintest(BnkLenderName, spec, branch,Province, contactName, programType, mortgageProduct) {

        it('E2E MMS Deal Flow-MMS Deal Creation', function () {
            ThankYouPageFound = false;
            dealSendToLLC = false;
            ClosingDate = CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrFutureDate());
            LenderRefNo = CustomLibrary.GenerateUniqueAutomationNumber();
            ClientName = CustomLibrary.getRandomString(5);
            MMSPortral.CreateMMSDeal(BnkLenderName, ClientName, LenderRefNo, ClosingDate);
            MMSPortral.VerifyThankYouPage().then(function (count) {
                if (count > 0) {
                    ThankYouPageFound = true;
                    FCTURN = MMSPortral.GetCreatedFCTURN();
                    MMSPortral.ClickOnEditViewdeals();
                    MMSCreateDeal.SearchbyFCTURN(FCTURN);
                    //CustomLibrary.SwitchTab(1);
                    CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                    browser.sleep(2000);
                    MMSCreateDeal.EnterStatusData(spec, BnkLenderName);
                    MMSCreateDeal.EnterLenderdata(branch, contactName, programType);
                    namelist = MMSCreateDeal.EnterMortgagorData();
                    MMSCreateDeal.EnterPopertyDataDynamic(Province);
                    MMSCreateDeal.StatusMenuClick();
                    PropertyData = MMSCreateDeal.getPropertyData();
                    MMSCreateDeal.EnterLawyerData();
                    MMSCreateDeal.SelectTrustAccount();
                    MMSCreateDeal.EnterNewMortgageData(mortgageProduct);
                    MMSCreateDeal.EnterDocumentsData();
                    MMSCreateDeal.sendDealtoLLC();
                    MMSCreateDeal.VerifyDealSendToLLC().then(function (count) {
  
                        if (count > 0) {
                            dealSendToLLC = true;
                        }
                    });
                    CustomLibrary.closeWindowUrlContains("DealDetails");
                   CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                   browser.sleep(500);
                }
                else {
                    expect(ThankYouPageFound).toBe(true, "Thank You page is not Found.");
                }
            });
        })

        it("Login To Operational Portal to Get ID & Accept Deal ", function () {
            if (dealSendToLLC) {
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                DealId = OperationsPortal.GetDealID();
                DealId.then(function (result) {
                    LawyerIntegrationMMS.MMSAcceptRejectDeal(result, "ACTIVE", function (data) {
                        LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                    });
                });
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Login to Operational Portal");
            }
        })

        it('Login To Embedded Portal & Validation Home Page', function () {
            if (dealSendToLLC) {
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                HomePage.VerifyHomePage();
                HomePage.VerifyDealAcceptedCheckMark("MMS");
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
                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                browser.waitForAngular();
                DealHistory.VerifyDealHistoryTableSearch('LLC deal has been accepted.', true);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Perform HomePage Validations");
            }
        })

        it('Verify Notes Page and Navigate Away Functionality', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                browser.waitForAngular();
                NotesPage.ClickNotesButton("NewNote");
                NotesPage.EnterNotesText('test');
                MenuPanel.PrimaryMenuNavigateTo('Home');
                CustomLibrary.WaitForSpinner();
                HomePage.NavigateAwayAcceptReject('Cancel');
                browser.sleep(2000);
                CustomLibrary.WaitForSpinner();
                MenuPanel.PrimaryMenuNavigateTo('Home');
                HomePage.NavigateAwayAcceptReject('OK');
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
            }
        })

        
        it('TC: 236251, 288374-Verify Request for Funds document', function () {
            if (dealSendToLLC) {
                MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                browser.waitForAngular();
                CustomLibrary.WaitForSpinnerInvisible();
                RFFPage.ClickRFFButtons('Save');
                HomePage.VerifyMessage('Your changes have been saved successfully.');
                RFFPage.EnterRequestedAmount(1000);
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
                        RFFPage.VerifyConfirmationMessage('Request for Funds was created successfully.');
                        RFFPage.VerifySubmitButtonStatus('Enabled');
                        RFFPage.ClickRFFButtons('Submit');
                        RFFPage.ClickRFFButtons('OK');
                        RFFPage.VerifyConfirmationMessage('Request for Funds has been submitted successfully.');
                        MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                        CustomLibrary.WaitForSpinnerInvisible();
                        //TC-288374: LLC-Embedded Portal-Manage Document-View Documents - MMS
                        // HomePage.clickLawyerDocView('Request for Funds');
                        // browser.sleep(10000);
                        // CustomLibrary.CloseTab(1);
                        ManageDocuments.VerifyStatusViewDoc('Request for Funds','Submitted');
                    }
                })
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Verify Notes and Navigate Away Functionality");
            }
        })

        it('MileStones-Broker Condition and Solicitor Condition and Submit PIF', function () {
            if (dealSendToLLC) {
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                //CustomLibrary.SwitchTab(1);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(2000);
                MMSCreateDeal.checkLawyerAcceptedStatus();
                MMSCreateDeal.VerifyLawyerAcceptedStatus();
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('The deal has been Accepted by the lawyer.', true);
                MMSCreateDeal.EnterChkBrokerConditions();
                MMSCreateDeal.EnterInstructionsforFunding();
                MMSCreateDeal.EnterChkSolictitorConditions();
               // MMSCreateDeal.ClickPropQSubmit();
               MMSCreateDeal.ClickMMSPropQDynamic(Province);
                MMSCreateDeal.ClickonViewPolicyHistory();
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Broker Conditions Satisfied has been selected', true);
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('Solicitor Conditions Satisfied has been selected', true);
                MMSCreateDeal.VerifyPolicyHistoryTableSearch('All underwriting questions are answered.', true);
                CustomLibrary.closeWindowUrlContains("DealDetails");
                browser.sleep(500);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
                browser.sleep(500);
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones-Broker Condition and Solicitor Condition.");
            }
        })

        it('Lender Authorisation to Fund and Deal Funded Mile Stone', function () {
            if (dealSendToLLC) {
                /*CustomLibrary.SwitchTab(0);
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.SwitchTab(2);
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.IssueCOI();*/
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.navigateToWindowWithUrlContains("DealDetails",2)
                browser.sleep(500);  
                MMSCreateDeal.StatusMenuClick();
                MMSCreateDeal.IssueCOIPatch();
                MMSCreateDeal.ClickFundingLeftMenu();
                MMSCreateDeal.EnterFundingData();
                //CustomLibrary.SwitchTab(0);
                browser.sleep(2000);
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                browser.sleep(2000);
                MMSPortral.ClickonFunding()
               // MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
                MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
               // CustomLibrary.CloseTab();
                MMSCreateDeal.ClickFundingLenderConfirmation();
                FCTURN.then(function (result) {
                    MMSCreateDeal.ToConfirmLender(result);
                });
                MMSPortral.ClickonLogOut();
                MMSPortral.Release2loginMMS();
                MMSPortral.ClickonFunding()
                //MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
                MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
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
               // MMSCreateDeal.EnterFundFilterData(LenderDetails.Name, ClosingDate);
               MMSCreateDeal.EnterFundFilterData(BnkLenderName, ClosingDate);
                MMSCreateDeal.ClickReleaser3();
                FCTURN.then(function (result) {
                    MMSCreateDeal.ClickRelease(result, true);
                });
              /*  MMSPortral.ClickonLogOut();
                CustomLibrary.SwitchTab(0)
                MMSPortral.loginMMSPortal();
                MMSPortral.ClickOnEditViewdeals();
                MMSCreateDeal.SearchbyFCTURN(FCTURN);
                CustomLibrary.SwitchTab(1);
                MMSCreateDeal.EnterPreFundLawyerData(ClosingDate, ClosingDate);
                MMSCreateDeal.StatusMenuClick();*/
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
               // CustomLibrary.CloseTab();
               browser.sleep(500);
               CustomLibrary.closeWindowUrlContains("DealDetails");
               browser.sleep(500);
               CustomLibrary.navigateToWindowWithUrlContains("DealList",1);
               browser.sleep(1000);

               DealId.then(function (result) {
                // LawyerIntegrationMMS.getAndSetTransactionData(result, CustomLibrary.getRandomNumber(5), CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()));
                // browser.sleep(40000);

                 LawyerIntegrationCommon.UpdateTransactionData(result,CustomLibrary.DateConversionMMDDYYYYY(CustomLibrary.CurrentOrPastDate()),null,null,CustomLibrary.getRandomNumber(5),CustomLibrary.CurrentOrPastDate(),null,null, null,null,null,null);
                 browser.sleep(3500);
                    
                });
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Complete MileStones - Lender Authorisation and Deal Funding");
            }
        });

        //Tc-303950: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When  Final Report has been submitted -  MMS
        //TC-245569: LLC EmbeddedPortal - Create and Submit SROT - Verify Deal History entry is created
        //TC-245574: LLC EmbeddedPortal - Navigate away functionality
        //TC: 240782- Verify Final Report document
        it('TC-245574, 245569, 303950,240782: MileStone-Final Report, Disabled Cancellation Requested, Verify SROT Doc', function () {
            if (dealSendToLLC) {
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
                DealHistory.VerifyDealHistoryTableSearch('"Deal Funded" has been selected.', true);
                HomePage.getDealFundedStatus().then(function (dealFundedStatus) {
                    if (dealFundedStatus == true) {
                        MenuPanel.PrimaryMenuNavigateTo('FinalReport');
                        browser.waitForAngular();
                        FinalReport.checkRegistrationDetailEntries();
                        FinalReport.EnterFinalReportData();
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
                        FinalReport.EnterRegistrationDetails();
                        FinalReport.ClickFRButton('btnCreate');
                        CustomLibrary.WaitForSpinnerInvisible();
                        FinalReport.VerifyFinalReportIsCreated().then(function(result)
                        {
                            if(result)
                            {
                                //CustomLibrary.ClosePopup();
                                //CustomLibrary.WaitForSpinnerInvisible();
                                browser.sleep(2000);
                                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                                browser.sleep(500);
                                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                                FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSCreateSuccessMsg);
                                FinalReport.FinalReportSubmit();
                                FinalReport.VerifyMessage(TestData.data[Lang].Messages.MMSSubmitSuccessMsg);
                                MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                                DealHistory.VerifyDealHistoryTableSearch('Document Solicitor\'s Report on Title has been submitted successfully.', true);
                                //TC-303950: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When  Final Report has been submitted -  MMS
                                MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
                                MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                                CustomLibrary.WaitForSpinnerInvisible();
                                HomePage.clickLawyerDocView("Solicitor's Report on Title");
                                CustomLibrary.WaitForSpinnerInvisible();
                                //CustomLibrary.ClosePopup();
                                CustomLibrary.WaitForSpinnerInvisible();
                                browser.sleep(2000);
                                CustomLibrary.navigateToWindowWithUrlContains("pdfDocuments",2);
                                browser.sleep(500);
                                CustomLibrary.closeWindowUrlContains("pdfDocuments");
                                CustomLibrary.navigateToWindow("LLC Lawyer Portal",1);
                            }
                        })
                    }
                    else {
                        expect(false).toBe(true, "Unable to Submit Final Report test as Deal Funded Milestone failed.");
                    }
                })
            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Submit Final Report.");
            }
        });

        

        it('TC-291323, 303488: File Closed functionality', function () {
            if (dealSendToLLC) {
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
                //TC-291323: LLC EmbeddedPortal - Verify Lender Portal for close status - MMS
                MMSCreateDeal.VerifyStatus('CLOSED')
                //CustomLibrary.CloseTab();
                CustomLibrary.closeWindowUrlContains("DealDetails");
                CustomLibrary.navigateToWindowWithUrlContains("DealList",1)
                browser.sleep(200);

                //TC-303488: LLC EmbeddedPortal - Verify Ops Portal for close status- MMS
                OperationsPortal.LoginOperationsPortal(FCTURN);
                OperationsPortal.SerchDealDetails(FCTURN);
                OperationsPortal.GetDealStatus();

            }
            else {
                expect(dealSendToLLC).toBe(true, "Unable to Close File.");
            }
        })

        //TC-288484: LLC EmbeddedPortal - Verify Deal completed by Lender and user in Embedded Portal - MMS
        //TC-303557: LLC EmbeddedPortal -Verify Read only status- MMS
        //TC- 303945: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is Completed/Closed
        it('TC- 288353, 303945, 303557, 288484- LLC Embedded Portal - MMS FCT Portal - Deal becomes read only when Lender Closes the dealVerify UI is not accessible in Embedded Portal after deal lender cancels the deal ', function () {
            
            if (dealSendToLLC) {
                DealId.then(function (result) {
                    LawyerIntegrationCommon.LoginViaRedirectURL(result, 'LLCDEAL');
                });
                browser.waitForAngular();
                var ClosedDealMsg = TestData.data[Lang].Messages.ClosedDealMsg;                     
                      
                CustomLibrary.WaitForElementPresent(StatusMsg);
                    //Home tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Home');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    HomePage.VerifySaveButtonStatus('Disabled');
                    
                    //Request for funds tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Request for Funds');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    RFFPage.VerifyallButtonStatus('Disabled');
            
                    //TC-303945: LLC Embedded Portal- Request Cancellation - Disabled Cancellation Requested  - When Deal is Completed/Closed
                    //Request Cancellation tab
                    MenuPanel.VerifyMenuButtonStatus('ReqCancel', 'Disabled');
            
                    //PreFundingInformation
                    MenuPanel.PrimaryMenuNavigateWithWait('Pre-Funding Information');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    PreFundingInfomation.VerifyallButtonStatus('Disabled');
            
                    //Final report tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Final Report');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    FinalReportPage.VerifyallButtonStatusFinalReport('Disabled');
            
                    //Manage document tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Manage Documents');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    ManageDocuments.VerifyDisableBrowseButton();
                    ManageDocuments.VerifyLenderDocumentsView('Enabled');
                    ManageDocuments.VerifyOnlyViewButtonsEnabled();
                    ManageDocuments.VerifyAllButtonsDisabled();
                           
                    //Note tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Notes');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
                    NotesPage.VerifyNewNoteButtonStatus('Disabled');
                    NotesPage.VerifyPrintButtonStatus('Disabled');
                         
                    //Deal History tab
                    MenuPanel.PrimaryMenuNavigateWithWait('Deal History');
                    expect(StatusMsg.getText()).toContain(ClosedDealMsg, "Expected closed deal message to appear. But was missing!");
            
                
                               
            }
            else 
            {
                expect(true).toBe(false, "Unable to verify UI after lender cancels the deal."); 
            }
           
        })

        //TC-288281: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Post a note
        it('TC- 288281: Email Verification', function () {
            if(dealSendToLLC)
            {   
                    var firstName = RunSettings.data.Global.LawyerDetails[Env].firstName;
                    var lastName = RunSettings.data.Global.LawyerDetails[Env].lastName;

                    //New Deal Creation Email
                    OutlookPortal.LogintoOutlookNonAngular();
                    var emailsubject = "New Deal - " + firstName + " " + lastName + " - " + ClientName + namelist[1] + " - " + LenderRefNo;
                    OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
                    OutlookInbox.OutlookLogOut();

                 //TC-288281: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Post a note
                 //TC-238667, 288294 -LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Deal Funded
                    OutlookPortal.LogintoOutlookNonAngular();
                    var emailsubject = "Deal Funded - " + firstName + ", " + lastName;
                    OutlookInbox.WaitUntilsearchResultAppears(FCTURN, emailsubject);
                    OutlookInbox.OutlookLogOut();

/*                  //Commenting the below code as email is not getting triggered for lender authorization

                    //TC-238666, 288293: LLC Embedded Portal/Email Notification Content/Verify Email Notification List v15.5 - Lender Authorization to Fund Satisfied
                    OutlookPortal.LogintoOutlookNonAngular();
                    var emailsubject = "Lender Authorization to Fund - " + firstName + ", " + lastName;
                    OutlookInbox.WaitUntilsearchResultAppears(LenderRefNo, emailsubject);
                    OutlookInbox.OutlookLogOut();
               */
                
            }
            else{
                expect(dealSendToLLC).toBe(true, "Unable to Verify Email.");
            }
        });

    }
    for (var i in RunSettings.data.Global.MMS[Env].Lender) {
       // var  i=3;
        var lenderName = RunSettings.data.Global.MMS[Env].Lender[i].Name;
        var spec = RunSettings.data.Global.MMS[Env].Lender[i].Spec;
        var branch = RunSettings.data.Global.MMS[Env].Lender[i].Branch;
        //var Province = RunSettings.data.Global.MMS[Env].Lender[i].Province;
        var Province = "ONTARIO";
        var contactName = RunSettings.data.Global.MMS[Env].Lender[i].ContactName;
        var programType = RunSettings.data.Global.MMS[Env].Lender[i][Province].ProgramType;
        var mortgageProduct = RunSettings.data.Global.MMS[Env].Lender[i].MortgageProduct;
        console.log(programType);
        maintest(lenderName, spec, branch,Province, contactName, programType, mortgageProduct);
       i++;
        
    };
});